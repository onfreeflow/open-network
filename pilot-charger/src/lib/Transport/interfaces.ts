"use strict"

import { Readable } from "fs"

export interface IPayload {
  [key: string]: any;
}
export interface IEnvelope {
  id     : string;
  message: Buffer;
}

export enum EEvent {
  "BOOT_NOTIFICATION"   = "BootNotification",
  "STATUS_NOTIFICATION" = "StatusNotification",
  "TRANSACTION_START"   = "TransactionStart",
  "TRANSACTION_STOP"    = "TransactionStop"
}
export enum ETransportType {
  "OCPP1_6J"  = "OCPP1.6J",
  "OCPP2_0_1" = "OCPP2.0.1"
}
export enum EWebSocketProtocol {
  "WS"  = "ws",
  "WSS" = "wss"
}
export enum EFTPProtocol {
  "FTP"  = "ftp",
  "FTPS" = "ftps"
}
export enum ETLSVersions {
  "TLSv1"   = "TLSv1",
  "TLSv1_2" = "TLSv1.2",
  "TLSv1_3" = "TLSv1.3"
}
export interface ITLSConfiguration {
  enabled   ?: boolean,
  minVersion?: ETLSVersions,
  ca        ?: Array<Readable> | Readable | null,
  key       ?: Array<Readable> | Readable | null,
  cert      ?: Array<Readable> | Readable | null 
}
export interface IFTPConfiguration {
  protocol?: EFTPProtocol;
  username?: string;
  password?: string;
}
export interface ICentralSystemService {
  type    : ETransportType;
  host    ?: string;
  port    ?: number;
  path    ?: string;
  protocol?: EWebSocketProtocol;
  identity?: string;
  password?: string;
  tls     ?: ITLSConfiguration;
  ftp     ?: IFTPConfiguration;
}

export interface ITransportOptions {
  events: EEvent[];
  centralSystemService: ICentralSystemService;
}

export interface ITransport {
  events: EEvent[];
  centralSystemService: ICentralSystemService;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(method: string, payload: IPayload | undefined ): Promise<void>;
  onEvent(method: string, callback: (data: any) => void): void;
  offEvent(method: string): void;
}