"use strict"

import {
  ICentralSystemService,
  IPayload,
  IOCPPTransport,
  IOCPPTransportOptions,
  EEvent,
  ETransportType,
  EReconnectStrategy,
  EWebSocketProtocol
} from "./interfaces"
import Envelope, { parseWebSocketFrame } from "./Envelope"
import { randomBytes } from "crypto"
import { connect as tlsConnect } from "tls"
import { connect as netConnect } from "net"
import EventsObject from "../EventsObject"

export class OCPPTransport extends EventsObject implements IOCPPTransport {
  events: EEvent[] = Object.values( EEvent )
  centralSystemService:ICentralSystemService = {
    type: ETransportType.OCPP1_6J,
    host: "localhost",
    port: 80,
    path: "/",
    protocol: EWebSocketProtocol.WS,
    reconnect: {
      strategy: EReconnectStrategy.LINEAR,
      timeout : 3000,
      attempts: 10
    }
  }
  #link
  #linkError
  #reconnectCount = 0
  constructor(options: IOCPPTransportOptions) {
    super()
    this.events = options.events ? options.events : this.events;

    this.centralSystemService = {
      ...options.centralSystemService,
      tls: { 
        ...this.centralSystemService.tls,
        ...options.centralSystemService.tls
      },
      ftp: {
        ...this.centralSystemService.ftp,
        ...options.centralSystemService.ftp
      },
      reconnect: {
        ...this.centralSystemService.reconnect,
        ...options.centralSystemService.reconnect
      }
    }

    // Now `mergedOptions` has `path` and `protocol` with default values if they weren’t provided
    // console.log('Connecting to:', mergedOptions);
  }
  async connect(): Promise<void> {
    const { host, port, path, protocol, tls }:ICentralSystemService = this.centralSystemService
    if ( !host || !port || !path ){
      throw new SyntaxError("Cannot connect without options.centralSystemService[host|port|path]")
    }
    return new Promise( ( resolve, reject ) => {
      const connectCallback = async () => {
        console.log(`${tls?.enabled ? "🔒 Securely" :""} connected to server`);
        this.#link.write([
            `GET ${path} HTTP/1.1`,
            `Host: ${host}:${port} `,
            `Upgrade: websocket`,
            `Connection: Upgrade`,
            `Sec-WebSocket-Key: ${randomBytes(16).toString('base64')}`,
            `Sec-WebSocket-Version: 13`,
            `Sec-Websocket-Protocol: ${this.centralSystemService.type}`
          ]
          .map( header => Buffer.from(header, 'ascii').toString('ascii') )
          .join('\r\n') + '\r\n\r\n' 
        )
        this.#linkError = undefined
        resolve()
      }
      console.log(`ws://${host}:${port}${path}`)
      const connectOptions = {
        host, port
      }, tlsConnectOptions = {
        ...connectOptions,
        protocol, ca: tls?.ca,
        rejectUnauthorized: true,
        keepAlive: true
      }
      this.#link = !tls?.enabled
                    ? netConnect( connectOptions, connectCallback)
                    : tlsConnect( tlsConnectOptions, connectCallback )
      
      this.#link.on('data', ( data ) => {
        //console.log('📥 Received from server[data:RAW]')
        let event
        const frameData = parseWebSocketFrame( data )
        try {
          event = JSON.parse( frameData )
        } catch( e ) {
          console.warn( e )
          event = frameData
        }
        this.emit( "OCPP_EVENT", event )
      })
      this.#link.on( "end", ( ...args ) => {
        console.info("END", ...args )
      })
      this.#link.on( "close", async ( ...args ) => {
        console.info( "close", ...args )

        if ( this.#linkError?.message?.includes( "connect EHOSTUNREACH" ) ){
          this.#link = undefined
          this.reconnect()
          return
        }
        
        reject()
      })
      this.#link.on( "error", ( err ) => {
        console.error( err );
        this.#linkError = err
      })
    })
  }

  async disconnect(): Promise<void> {
    // Implement disconnect logic here
  }

  async reconnect(): Promise<void> {
    // Implement strategy  
    if ( this.#reconnectCount > this.centralSystemService.reconnect.attempts ){
      throw "Max Reconnects"
    }
    this.#reconnectCount = this.#reconnectCount + 1
    console.log( `Reconnect Attempt with strategy[${this.centralSystemService.reconnect.strategy}]: ${this.#reconnectCount} of ${this.centralSystemService.reconnect.attempts}`)
    await this.connect()
  }
  resetRetries():void {
    //clear reconnect variables (soft reset)
  }

  isConnected(){
    return !!this.#link
  }
  async sendMessage( method: string, payload?: IPayload ): Promise<void> {
    if ( !this.#link ) {
      throw `Cannot send message[ method: ${method}, payload: ${JSON.stringify(payload)}], not connected to Central System Service`
    }
    // console.log( "=========================")
    // console.log( "METHOD: ", method )
    // console.log( "PAYLOAD: ", payload )
    // console.log( "----------------------")
    await this.#link.write(
            new Envelope( method, payload ).message
          )
    // console.log( "=========================")
  }
}
export default OCPPTransport