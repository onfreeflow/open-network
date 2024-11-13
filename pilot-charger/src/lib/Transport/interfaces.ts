"use strict"

import { Readable } from "fs"
import FTPTransport from "./FTPTransport"
import SFTPTransport from "./SFTPTransport"
import OCPPTransport from "./OCPPTransport"


export interface IPayload {
  [key: string]: any;
  timestamp?: string;
}
export interface IEnvelope {
  id     : string;
  message: Buffer;
}

export enum EEvent {
  BOOT_NOTIFICATION        = "BootNotification",
  STATUS_NOTIFICATION      = "StatusNotification",
  TRANSACTION_START        = "TransactionStart",
  TRANSACTION_STOP         = "TransactionStop",
  GET_DIAGNOSTICS          = "GetDiagnostics",
  CHANGE_AVAILABILITY      = "ChangeAvailability",
  REMOTE_START_TRANSACTION = "RemoteStartTransaction",
  REMOTE_STOP_TRANSACTION = "RemoteStopTransaction"
}
export enum ETransportType {
  "OCPP1_6J"  = "ocpp1.6",
  "OCPP2_0_1" = "ocpp2.0.1"
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

export enum EReconnectStrategy {
  "LINEAR"      = "linear",
  "PROGRESSIVE" = "progressive",
  "FIBONACCI"   = "fibonacci"
}
export interface IReconnectConfiguration {
  strategy: EReconnectStrategy;
  timeout : number;
  attempts: number;
}

export interface ICentralSystemService {
  type     : ETransportType;
  host     ?: string;
  port     ?: number;
  path     ?: string;
  protocol ?: EWebSocketProtocol;
  identity ?: string;
  password ?: string;
  tls      ?: ITLSConfiguration;
  ftp      ?: IFTPConfiguration;
  reconnect?: IReconnectConfiguration;
}

export interface IOCPPTransportOptions {
  events: EEvent[];
  centralSystemService: ICentralSystemService;
}

export interface IOCPPTransport {
  events: EEvent[];
  centralSystemService: ICentralSystemService;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(method: string, payload: IPayload | undefined, messageId?: string ): Promise<void>;
  isConnected():boolean;
  on(method: string, callback: (data: any) => void): void;
  off(method: string): void;
}
export interface IFTPTransportOptions {
  host   : string;
  port  ?: string | number;
  user  ?: string;
  pass  ?: string;
  pasv  ?: boolean;
}

export interface IFTPTransport {
  uri:string;
  connect():void;
  uploadFile(localPath:string, remotePath:string):Promise<{path:string}|void>;
  end():void;
}

export type Transport = OCPPTransport | FTPTransport | SFTPTransport