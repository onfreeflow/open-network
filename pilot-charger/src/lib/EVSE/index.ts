"use strict"
import pkg from "../../../package.json"
import { readFileSync, statSync, writeFileSync, unlink } from "fs"
import { performance } from "perf_hooks"
import Logger from "../Logger.ts"

import {
  EChargingScheduleAllowedChargingRateUnit,
  ECurrentLevel,
  EMeterType,
  EDiagnosticStatus,
  EEventsQueueDBType,
  ENetworkModeEVSE,
  EPowerType,
  EVoltageLevel,
  IEVSE,
  IEVSEConfiguration,
  IEVSEEventsQueue,
  IEVSEOptions,
  IEVSEOSConfiguration,
  IEVSEManufacturerConfiguration,
  EPerfMarksFTPUpload,
  EPerfMeasuresFTPUpload
} from "./interfaces.ts"
import { IPayload, Transport, ETransportType, EEvent } from "../Transport/interfaces.ts"

import { EVSEConnector } from  "../EVSEConnector"
import { OCPPTransport, FTPTransport, SFTPTransport } from "../Transport/index.ts"
import { EventsQueue } from "../Queue"

const logger = new Logger(/*{out:"./logs/ocpp_log.log"}*/)
// TODO: Abstract Logger, and set in options of base objects
// TODO: Add output file, and file rotation to logging
const validateOptions = options => {
  switch( true ) {
    case !options.id && typeof options.id !== 'number': throw SyntaxError( "EVSEBase Constructor: Options argument is missing required property(id)" );
    case !options.serialNumber                        : throw SyntaxError( "EVSEBase Constructor: Options argument is missing required property(serialNumber)" );
    case options.connectors.length < 1                : logger.warn( "Will not distribute power, no connectors registered")
      default: break
  }
}

export class EVSE implements IEVSE {
  connectors: EVSEConnector[] = []
  voltage:EVoltageLevel = EVoltageLevel.AC_LEVEL_2_SINGLE_PHASE
  current:ECurrentLevel = ECurrentLevel.AC_LEVEL_2
  powerType:EPowerType = EPowerType.SPLIT_PHASE_AC
  meterValue:number = 0
  id: number
  vendorId: string
  model: string
  serialNumber: string
  lastHeartbeat: string
  location: string
  maxPower: number
  transport: Transport[]
  eventsQueue: IEVSEEventsQueue = {
    queue: null,
    dbType: EEventsQueueDBType.MEMORY,
    host: "",
    port: 0
  }
  configuration: IEVSEConfiguration = {
    allowOfflineTxForUnknownId       : true,
    authorizationCacheEnabled        : false,
    clockAlignedDataInterval         : 0,
    connectionTimeOut                : 100,// ms
    getConfigurationMaxKeys          : 128,
    heartbeatInterval                : 300000,// ms
    localAuthorizeOffline            : true,
    localPreAuthorize                : false,
    meterValuesAlignedData           : 0,
    meterValueSampleInterval         : 3000,//ms
    numberOfConnectors               : 2, 
    resetRetries                     : 10,
    stopTransactionOnEVSideDisconnect: true,
    stopTransactionOnInvalidId       : true
  }
  os: IEVSEOSConfiguration = {
    firmware: {
      version: pkg.version,
      downloadInterval: 300,  // Download interval in seconds
      downloadRetries: 10,    // Number of retries
    },
    logs:[
      //{ name: "OCPP_LOG", path: "./ocpp.log" }
    ],
    diagnostics: {
      status   : EDiagnosticStatus.NEVER ,
      timestamp: ""
    },
    temporaryDirectory: "/tmp"
  }
  manufacturer: IEVSEManufacturerConfiguration = {
    vendor              : "",
    model               : "",
    chargeRate          : EChargingScheduleAllowedChargingRateUnit.W,
    autoReset           : true,
    energyMeter         : {
      type        : EMeterType.REVENUE_GRADE,
      serialNumber: "",
      currentValue: 0
    },
    overheatProtection  : false,
    networkMode         : ENetworkModeEVSE.WIFI,
    userInterfaceEnabled: true,
    voltageLimit        : null,
    currentLimit        : null
  }
  
  #ocppTransports: OCPPTransport[]
  #ftpTransports : Array<FTPTransport|SFTPTransport>

  //#commsTransport: 
  //#serialTransports: SerialTransport[]
  //#wanTransports: WANTransport[]
  constructor( options:IEVSEOptions ){
    validateOptions( options )
    this.id = options.id
    this.serialNumber = options.serialNumber
    this.connectors = options.connectors
    this.#ocppTransports = typeof options.transport === 'object'
                          ? options.transport.filter( transport => transport instanceof OCPPTransport )
                          : options.transport instanceof OCPPTransport ? [ options.transport ] : []
    this.#ftpTransports = typeof options.transport === 'object'
                          ? options.transport.filter( transport => transport instanceof FTPTransport || transport instanceof SFTPTransport )
                          : options.transport instanceof FTPTransport ? [ options.transport ] : []
    this.configuration = { ...this.configuration, ...options.configuration }
    this.eventsQueue = { ...this.eventsQueue, ...options.eventsQueue }
    this.os = { ...this.os, ...options.os }
    this.manufacturer = { ...this.manufacturer, ...options.manufacturer }

    if ( !(this instanceof EVSE ) ) {
      return new EVSE( options )
    }
    return (async ()=> {
      try {
        await this.#setupEventsQueue()
        this.#startUp()
        await this.#connectToCentralSystem()
      } catch ( warn ) {
        console.warn( warn )
      }
      return this
    })()
  }
  async emit( method:string, payload?: IPayload ):Promise<void>{
    let recieved = false
    try {
      for ( const transport of this.#ocppTransports ) {
        if ( !transport.isConnected() ) continue
        try {
          await transport.sendMessage( method, payload )
          recieved = true
        } catch (e) {
          console.error(e)
        }
      }
      if ( recieved === false ) throw "No available transport connection"
    } catch ( e ) {
      if ( this.eventsQueue.queue instanceof EventsQueue )
      this.eventsQueue.queue.enqueueEvent( method, payload )
    }
  }
  #startUp(){
    this.#boot()
    this.#heartbeatSetup()
  }
  async #setupEventsQueue(){
    if ( !this.eventsQueue ){
      logger.warn( "ONLY USE FOR TESTING PURPOSES: Default Event Queue is only using ram. Power reset will result in data loss." )
    }
    const { dbType, host, port } = this.eventsQueue
    this.eventsQueue.queue = await new EventsQueue( { dbType, host, port } )
    await this.eventsQueue.queue.hydrate()
  }
  async #connectToCentralSystem(){
    for ( const transport of this.#ocppTransports ) {
      await transport.connect()
      await this.#listenToOCPPTransport( transport )
    }
    while ( this.eventsQueue.queue && this.eventsQueue.queue.length > 0 ){
      for ( const transport of this.#ocppTransports ) {
        const { method, payload } = await this.eventsQueue.queue.dequeueEvent()
        await transport.sendMessage(method, payload )
      }
    }
  }
  async #listenToOCPPTransport( transport:OCPPTransport ){
    transport.on( "OCPP_EVENT", async eventData => {
      if ( !eventData ) return
      if ( transport.centralSystemService.type === ETransportType.OCPP1_6J ){
        logger.info( "OCPP_EVENT: ", eventData )
        const [ messageType, messageId, eventMethod, eventPayload ] = eventData
        if ( eventMethod === EEvent.GET_DIAGNOSTICS ) {
          const { location } = eventPayload
          await this.#sendDiagnostics({ location })
          transport.sendMessage(  EEvent.GET_DIAGNOSTICS, { filename: location }, messageId )
        }
      }
    })
  }
  #boot(){
    this.emit(
      "BootNotification",
      {
        chargePointVendor      : this.manufacturer.vendor,
        chargePointModel       : this.manufacturer.model,
        chargePointSerialNumber: this.serialNumber,  // Optional
        chargeBoxSerialNumber  : this.serialNumber,  // Optional
        firmwareVersion        : this.os.firmware.version,  // Optional
        iccid                  : "",  // Optional
        imsi                   : "123456789012345",  // Optional
        meterType              : this.manufacturer.energyMeter.type
      }
    )
  }
  #heartbeatSetup(){
    setInterval(() => {
      this.lastHeartbeat = new Date().toISOString()
      this.emit( "Heartbeat" )
    }, this.configuration.heartbeatInterval || process.env.HEARTBEAT_INTERVAL || 120000);
    this.lastHeartbeat = new Date().toISOString()
    this.emit( "Heartbeat" )
  }
  async #ftpUpload( transport:FTPTransport|SFTPTransport, localPath:string , remotePath:string ){
    /**
     * Start EVSE FTP Upload Timer
    */
    performance.mark(EPerfMarksFTPUpload.FTP_UPLOAD_CONNECTING)

    await transport.connect()
    
    const localFileStats:any = statSync(localPath)

    this.emit( "DiagnosticStatusNotification", {
      status    : EDiagnosticStatus.UPLOADING,
      fileName  : remotePath,
      fileSize  : localFileStats.size,
      path      : `${transport.uri}${remotePath}`,
      timestamp : new Date().toISOString(),
      duration  : (
                    performance.mark( EPerfMarksFTPUpload.START_FTP_UPLOAD ),
                    performance.measure(
                      EPerfMeasuresFTPUpload.FTP_TIME_TO_CONNECT,
                      EPerfMarksFTPUpload.FTP_UPLOAD_CONNECTING,
                      EPerfMarksFTPUpload.START_FTP_UPLOAD
                    ),
                    performance.getEntriesByName(EPerfMeasuresFTPUpload.FTP_TIME_TO_CONNECT)[0].duration
                  ),
      retryCount: 0
    })
    await transport.uploadFile( localPath, remotePath )
    this.emit( "DiagnosticStatusNotification", {
      status    : EDiagnosticStatus.UPLOADED,
      fileName  : remotePath,
      fileSize  : localFileStats.size,
      path      : `${transport.uri}${remotePath}`,
      timestamp : new Date().toISOString(),
      duration  : (
        performance.mark( EPerfMarksFTPUpload.COMPLETE_FTP_UPLOAD),
        performance.measure(
          EPerfMeasuresFTPUpload.FTP_TIME_TO_UPLOAD,
          EPerfMarksFTPUpload.START_FTP_UPLOAD,
          EPerfMarksFTPUpload.COMPLETE_FTP_UPLOAD 
        ),
        performance.getEntriesByName(EPerfMeasuresFTPUpload.FTP_TIME_TO_UPLOAD)[0].duration
      ),
      retryCount: 0
    })
    await transport.end()
    Object.values( EPerfMarksFTPUpload ).forEach( mark => performance.clearMarks( mark ) )
    Object.values( EPerfMeasuresFTPUpload ).forEach( measure=> performance.clearMeasures( measure ) )
  }
  
  async #sendDiagnostics({ location, retries, interval, startTimestamp, stopTimestamp }:{location:string, retries?:number, interval?:number, startTimestamp?:string, stopTimestamp?:string}){
    //TODO: manage the retries, interval, startTimestamp, and stopTimestamp
    // const retry = () => this.#ftpUpload( transport, localPath, remotePath )
    const match = location.match(
                /([a-zA-Z]+):\/\/([a-zA-Z0-9._%+-]+):([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)(:[0-9]+)?(\/.*)?/
              )
    if ( !match && this.os.logs.length === 0 )
      throw new Error("EVSE#sendDiagnostics: [args{location}] not a full URI and log paths[options.os.logs[string]] ")
    if ( !match && this.#ftpTransports.length === 0 )
      throw new Error("EVSE#sendDiagnostics: [args{location}] not a full URI and no FTP transports [options.transports[FTPTransport] ")

    const
      combinedLog = this.os.logs.map(({name,path})=> `\n--------${name}--------\n ${readFileSync(path)} \n-----------------------\n`).join("\n"),
      combinedLogPath = `${this.os.temporaryDirectory}/combined-log-export-${new Date().toISOString() }.log`

    try { 
      writeFileSync( combinedLogPath, combinedLog, { encoding: "utf-8" } )
    } catch ( e ) {
      logger.error ("Write File error for temp file: ", combinedLogPath)
    }

    if ( match ){
      const [ remoteProtocol, remoteUsername, remotePassword, remoteHostname, remoteDirtyPort, remotePath = "/" ] = match,
        remotePort = remoteDirtyPort.slice(1) || undefined
      if ( !remoteHostname ) throw new SyntaxError( "EVSE#sendDiagnostics: [location] property missing [hostname]" )
      if ( remoteUsername && !remotePassword ) throw new SyntaxError( "EVSE#sendDiagnostics: Has [username] Missing [password]" ) 
      if ( !remoteUsername && remotePassword ) throw new SyntaxError( "EVSE#sendDiagnostics: Has [password] Missing [username]" )
      const transport = remoteProtocol && remoteProtocol?.toLowerCase() === "sftp"
                          ? new SFTPTransport({
                              host: remoteHostname,
                              port: remotePort,
                              user: remoteUsername,
                              pass: remotePassword
                            })
                          : new FTPTransport({
                              host: remoteHostname,
                              port: remotePort,
                              user: remoteUsername,
                              pass: remotePassword
                            })
      await this.#ftpUpload( transport, combinedLogPath, remotePath )
    } else {
      await Promise.all(
        this.#ftpTransports.map( async ( transport ) => {
          if (!transport ) throw new Error( "Unexpected transport error" )
          await this.#ftpUpload( transport, combinedLogPath, location )
        })
      )
    }
    await new Promise( ( resolve, reject ) => {
      unlink( combinedLogPath, ( err ) => err ? reject( err ) : resolve( true ) )
    })
  }
  #getDiagnosticStatusResponse(){
    this.emit( "GetDiagnosticsResponse", {
      filename: ""
    })
  }
}
export default EVSE