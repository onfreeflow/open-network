"use strict"

import {
  ICentralSystemService,
  IPayload,
  ITransport,
  ITransportOptions,
  EEvent,
  ETransportType,
  EWebSocketProtocol
} from "./interfaces"
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
    protocol: EWebSocketProtocol.WS
  }
  #link
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
          await this.reconnect()
        }, 10000 )
      })
      this.#link.on( "error", ( err ) => {
        console.error( err )
      })
    })
  }

  async disconnect(): Promise<void> {
    // Implement disconnect logic here
  }

  async reconnect(): Promise<void> {
    await this.connect()
  }

  async sendMessage( method: string, payload: IPayload | undefined ): Promise<void> {
    // wrap in envelope including undefined payload
    // Implement send message logic here
  }

  onEvent(event: string, callback: (data: any) => void): void {
    // Implement onEvent logic here
  }

  offEvent(event: string): void {
    // Implement offEvent logic here
  }
}
export default Transport