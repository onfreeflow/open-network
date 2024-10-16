"use strict"

import { connect } from 'tls'
import Logger from "../Logger"
import { EventQueue } from "../Queue/Queue"
import Envelope from "../Envelope"
import { randomBytes } from "crypto"
import {
  CHARGING_SCHEDULE_ALLOWED_CHARGING_RATE_UNIT,
  CLOCK_ALIGNED_DATA_INTERVAL,
  NETWORK_MODE_EVSE,
  ENERGY_METER_TYPE,
  POWER_TYPE_EVSE,
  VOLTAGE_EVSE,
  CURRENT_EVSE
} from "./EVSEEnums_Base"

const logger = new Logger(/*{out:"./logs/ocpp_log.log"}*/)
// TODO: Abstract Logger, and set in options of base objects
// TODO: Add output file, and file rotation to logging
const validateOptions = options => {
  switch( true ) {
    case !options.id && typeof options.id !== 'number': throw SyntaxError( "EVSEBase Constructor: Options argument is missing required property(id)" );
    case !options.serialNumber                        : throw SyntaxError( "EVSEBase Constructor: Options argument is missing required property(serialNumber)" );
    case options.connectors.length < 1                : logger.warn( "Will not distribute power, no connectors registered")
    case !options.centralSystemService                : logger.warn( "Will not report to central system service: [options.centralSystemService] not configured." ); break;
    case !options.centralSystemService.host           : logger.warn( "Will not report to central system service: [options.centralSystemService.host] not configured." ); break;
    case !options.centralSystemService.port           : logger.warn( "Will not report to central system service: [options.centralSystemService.port] not configured." ); break;
    case !options.centralSystemService.path           : logger.warn( "May not report to central system service: [options.centralSystemService.path] not configured." ); break;
      default: break
  }
}

export default class EVSEBase {
  #connectors = []
  #voltage = VOLTAGE_EVSE["120V"]
  #current = CURRENT_EVSE["16A"]
  #powerType = POWER_TYPE_EVSE.AC
  #meterValue = 0
  #id
  #vendorId
  #model
  #firmwareVersion
  #serialNumber
  #lastHeartbeat
  #location
  #maxPower
  #manufacturer = {
    chargeRate          : CHARGING_SCHEDULE_ALLOWED_CHARGING_RATE_UNIT.W,
    autoReset           : true,
    energyMeterType     : ENERGY_METER_TYPE.REVENUE_GRADE,
    overheatProtection  : false,
    networkMode         : NETWORK_MODE_EVSE.WIFI,
    userInterfaceEnabled: true,
    voltageLimit        : null,
    currentLimit        : null
  }
  #centralSystemService = {
    host         : "",
    port         : "",
    path         : "",
    protocol     : "ws",
    protocolName : "ocpp1.6j",
    chargePointId: 0,
    security     : {
      identity: "",
      password: "",
      tls: {
        enabled: true,
        requestCert: false,
        minVersion : 'TLSv1.2',
        key        : [],
        cert       : []
      }
    },
    ftp: {
      username: "",
      password: ""
    },
    firmware:{
      downloadInterval: 300,
      downloadRetries: 10
    }
  }
  #configuration = {
    allowOfflineTxForUnknownId       : true,
    authorizationCacheEnabled        : false,
    clockAlignedDataInterval         : 0,
    connectionTimeOut                : 100, // ms
    getConfigurationMaxKeys          : 128,
    heartbeatInterval                : 300000, // ms
    localAuthorizeOffline            : true,
    localPreAuthorize                : false,
    meterValuesAlignedData           : CLOCK_ALIGNED_DATA_INTERVAL.WH,
    meterValueSampleInterval         : 1000, //ms
    numberOfConnectors               : 1,
    resetRetries                     : 10,
    stopTransactionOnEVSideDisconnect: true,
    stopTransactionOnInvalidId       : true
  }

  #eventsQueue = {
    queue: null,
    dbType: 'memory',
    host: "",
    port: 0
  }
  
  #link
  constructor( options ){
    validateOptions( options )
    this.#id = options.id
    this.#serialNumber = options.serialNumber
    this.#connectors = options.connectors
    this.#centralSystemService = { ...this.#centralSystemService, chargePointId:options.serialNumber, ...options.centralSystemService }
    this.#configuration = { ...this.#configuration, ...options.configuration }
    this.#eventsQueue = { ...this.#eventsQueue, ...options.eventsQueue }

    if ( !(this instanceof EVSEBase) ) {
      return new EVSEBase( options )
    }
    return (async ()=> {
      try {
        await this.#setupEventQueue()
        this.#startUp()
        await this.#connectToCentralSystem()
      } catch ( warn ) {
        console.warn( warn )
      }
      return this
    })()
  }
  emit( method, payload = {} ){
    const envelope = new Envelope( method, payload )
    this.#link 
      ? envelope.message |> this.#link.write
      : envelope.message |> this.#eventsQueue.queue.enqueueEvent
  }
  #startUp(){
    if ( !this.#link ){
      logger.warn( "Not Connected to Central System Service" )
    }
    this.#boot()
    this.#heartbeatSetup()
  }
 async #setupEventQueue(){
    if ( !this.#eventsQueue ){
      logger.warn( "ONLY USE FOR TESTING PURPOSES: Default Event Queue is only using ram. Power reset will result in data loss." )
    }
    const { dbType, host, port } = this.#eventsQueue
    this.#eventsQueue.queue = await new EventQueue( { dbType, host, port } )
  }
  async #connectToCentralSystem(){
    const { host, port, path, protocol, tls: { cert } } = this.#centralSystemService
    if ( !host && !port && !path ){
      throw new SyntaxError("Cannot connect without options.centralSystemService[host|port|path]")
    }
    return new Promise( ( resolve, reject ) => {
      this.#link = connect({
        protocol, host, port, ca:cert,
        rejectUnauthorized: true,
        keepAlive: true
      }, async () => {
        console.log('🔒 Securely connected to server');
        this.#link.write([
          `GET ${path}/${this.#serialNumber} HTTP/1.1`,
          `Host: ${host}`,
          `Upgrade: websocket`,
          `Connection: Upgrade`,
          `Sec-WebSocket-Key: ${randomBytes(16).toString('base64')}`,
          `Sec-WebSocket-Version: 13`,
          '\r\n'
        ].join('\r\n'));
        await this.#eventsQueue.queue.hydrate()
        while ( this.#eventsQueue.queue.length > 0 ){
          ( await this.#eventsQueue.queue.dequeueEvent() ) |> this.#link.write
        }
        resolve()
      })
      
      this.#link.on('data', ( data ) => {
        console.log('📥 Received from server[data:RAW]:', data.toString('utf-8') );
      })
      this.#link.on( "end", ( ...args ) => {
        console.log("END", ...args )
      })
      this.#link.on( "close", ( ...args ) => {
        console.log( "close", ...args )
        setTimeout( async () => {
          await this.#connectToCentralSystem()
        }, 10000 )
      })
      this.#link.on( "error", ( err ) => {
        console.error( err )
      })
    })
  }
  #boot(){
    this.emit( "BootNotification", { chargePointVendor: "ExampleVendor", chargePointModel: "ExampleModel" } )
  }
  #heartbeatSetup(){
    this.heartbeat = setInterval(() => {
      this.#lastHeartbeat = new Date().toISOString()
      this.emit( "Heartbeat" )
    }, this.#configuration.heartbeatInterval || process.env.HEARTBEAT_INTERVAL || 120000);
    this.#lastHeartbeat = new Date().toISOString()
    this.emit( "Heartbeat" )
  }
}