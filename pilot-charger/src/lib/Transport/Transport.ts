"use strict"

import {
  ICentralSystemService,
  IPayload,
  ITransport,
  ITransportOptions,
  EEvent,
  ETransportType,
  EReconnectStrategy,
  EWebSocketProtocol
} from "./interfaces"
import Envelope from "./Envelope"
import { Readable } from "fs"
import { randomBytes } from "crypto"
import { connect } from 'tls'

export class Transport implements ITransport {
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
  constructor(options: ITransportOptions) {
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
    const ca:Readable = tls?.ca
    if ( !host && !port && !path ){
      throw new SyntaxError("Cannot connect without options.centralSystemService[host|port|path]")
    }
    return new Promise( ( resolve, reject ) => {
      this.#link = connect({
        protocol, host, port, ca,
        rejectUnauthorized: true,
        keepAlive: true
      }, async () => {
        console.log("🔒 Securely connected to server");
        this.#link.write([
          `GET ${path} HTTP/1.1`,
          `Host: ${host}`,
          `Upgrade: websocket`,
          `Connection: Upgrade`,
          `Sec-WebSocket-Key: ${randomBytes(16).toString('base64')}`,
          `Sec-WebSocket-Version: 13`,
          "\r\n"
        ].join("\r\n"));
        this.#linkError = undefined
        resolve()
      })
      
      this.#link.on('data', ( data ) => {
        console.log('📥 Received from server[data:RAW]:', data.toString('utf-8') );
      })
      this.#link.on( "end", ( ...args ) => {
        console.log("END", ...args )
      })
      this.#link.on( "close", async ( ...args ) => {
        console.log( "close", ...args )

        if ( this.#linkError?.message?.includes( "connect EHOSTUNREACH" ) ){
          this.#link = undefined
          this.reconnect()
          return
        }
        
        reject()
      })
      this.#link.on( "error", ( err ) => {
        console.error( err.message );
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
    //clear resetniables (soft reset)
  }

  isConnected(){
    return !!this.#link
  }
  async sendMessage( method: string, payload?: IPayload ): Promise<void> {
    if ( !this.#link ) {
      throw `Cannot send message[ method: ${method}, payload: ${JSON.stringify(payload)}], not connected to Central System Service`
    }
    await this.#link.write( new Envelope( method, payload ) )
  }

  onEvent(event: string, callback: (data: any) => void): void {
    // Implement onEvent logic here
  }

  offEvent(event: string): void {
    // Implement offEvent logic here
  }
}
export default Transport