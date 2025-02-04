"use strict"

import { EventsQueue } from "../Queue"
import { EVSEConnector } from "../EVSEConnector"
import { Transport } from "../Transport/interfaces"

import { TDisplay } from "../Hardware/display/types"
import { TLED } from "../Hardware/led/types"
import { TPowerMeter } from "../Hardware/powermeter/types"
import { TPowerRelay, TConnectorRelay, TOverloadProtectionRelay } from "../Hardware/relay/types"

import { TSerialModule } from "../Hardware/communication/serial/types"
import { TBLEModule } from "../Hardware/communication/ble/types"
import { TRFIDModule } from "../Hardware/communication/rfid/types"
import { TNFCModule } from "../Hardware/communication/nfc/types"
import { TLoRaModule } from "../Hardware/communication/lora/types"
import { TWiFiModule } from "../Hardware/communication/wifi/types"
import { TRJ45Module } from "../Hardware/communication/rj45/types"
import { TCellular } from "../Hardware/communication/cellular/types"

import {
  EAvailability,
  EChargingScheduleAllowedChargingRateUnit,
  ECurrentLevel,
  EDiagnosticStatus,
  EEventsQueueDBType,
  EMeterType,
  ENetworkModeEVSE,
  EPowerType,
  EVoltageLevel
} from "./enums"

export interface IPayload {
  [key: string]: any;
  timestamp   ?: string;
}

export interface IEVSEConfiguration {
  allowOfflineTxForUnknownId       : boolean, //true,
  authorizationCacheEnabled        : boolean, //false,
  clockAlignedDataInterval         : number, // 0,
  connectionTimeOut                : number, // 100, // ms
  getConfigurationMaxKeys          : number, // 128,
  heartbeatInterval                : number, // 300000, // ms
  localAuthorizeOffline            : boolean, //true,
  localPreAuthorize                : boolean, //false,
  meterValuesAlignedData           : number,
  meterValueSampleInterval         : number, //ms
  numberOfConnectors               : number, // 1,
  resetRetries                     : number, // 10,
  stopTransactionOnEVSideDisconnect: boolean, // true,
  stopTransactionOnInvalidId       : boolean  // true
}
export interface IEVSEEventsQueue {
  queue : EventsQueue | null,
  dbType?: EEventsQueueDBType,
  host  ?: string,
  port  ?: number
}
export interface IEVSEProperties {
  availability   : EAvailability;
  connectors     : EVSEConnector[];
  voltage        : EVoltageLevel
  current        : ECurrentLevel
  powerType      : EPowerType
  meterValue     : number
  id             : string | number;
  vendorId      ?: string
  model         ?: string
  serialNumber   : string
  lastHeartbeat ?: string
  location      ?: string
  maxPower      ?: number
  transport      : Transport[]
  eventsQueue    : IEVSEEventsQueue
  configuration  : IEVSEConfiguration
}

export interface IEVSE extends IEVSEProperties {
  emit(method:string, payload?: IPayload ):void;
}

export interface IEVSEOptionsEventsQueue {
  host  : string;
  port  : number | string;
  dbType: EEventsQueueDBType;
}

interface IConnectorRelay extends TPowerRelay {

}
export interface IIndicators {
  active   ?: TLED,
  charging ?: TLED,
  error    ?: TLED,
  faulted  ?: TLED,
  inactive ?: TLED
  preparing?: TLED,
  power    ?: TLED,
  updating ?: TLED,
}
export interface IHMIs {
  buttons     ?: [],
  screens     ?: TDisplay[],
  touchScreens?: TDisplay[],
  indicators  ?: IIndicators
}
export interface IHardwareModules {
  hmis                    : IHMIs,
  powerMeters             : TPowerMeter[],
  evseRelays              : TPowerRelay[],
  connectorRelays         : TConnectorRelay[],
  overloadProtectionRelays: TOverloadProtectionRelay[],
  communications          : {
    serial  ?: TSerialModule[],   //RS232, RS485, USB(A/B/C)
    ble     ?: TBLEModule[],
    rfid    ?: TRFIDModule[],
    nfc     ?: TNFCModule[],
    lora    ?: TLoRaModule[],
    wifi    ?: TWiFiModule[],
    rj45    ?: TRJ45Module[],
    cellular?: TCellular[]
  }
}

interface ISizeLWH {
  length: number,
  width : number, 
  height: number
}

export interface IEVSEOptions {
  id              : string | number;
  serialNumber    : string;
  size           ?: ISizeLWH;
  connectors      : EVSEConnector[];
  transport      ?: Transport[];
  eventsQueue    ?: Omit<IEVSEEventsQueue, "queue">;
  os             ?: IEVSEOSConfiguration;
  hardwareModules?: IHardwareModules;
  configuration  ?: IEVSEConfiguration;
  manufacturer   ?: IEVSEManufacturerConfiguration;
}

// Energy Meter Types
export interface IEnergyMeter {
  type        : EMeterType.REVENUE_GRADE;
  currentValue: number;
  serialNumber: string;
}


export interface IFirmwareConfiguration {
  version         ?: string;
  downloadInterval?: number;
  downloadRetries ?: number;
}

export interface IGetDiagnosticsRequest {
  location: string;
  retries: number;
  retryInterval: number;
  startTime: string;
  stopTime: string;
}

export interface IGetDiagnosticResponse {
  filename: string;
}
export interface IDiagnostics {
  status       : EDiagnosticStatus
  timestamp    : string;
  path         : string;
  filename     : string;
  requestPeriod: string;
}

export interface IManufacturerLog {
  name: string;
  path: string;
}

export interface IDiagnosticsConfiguration{
  timestamp?: string;
  status   ?: EDiagnosticStatus;
}

export interface IEVSEOSConfiguration {
  temporaryDirectory?: string;
  firmware          ?: IFirmwareConfiguration;
  logs              ?: IManufacturerLog[];
  diagnostics       ?: IDiagnosticsConfiguration;
}

export interface IEVSEManufacturerConfiguration {
  vendor              : string;
  model               : string;
  chargeRate          : EChargingScheduleAllowedChargingRateUnit;
  autoReset           : boolean;
  energyMeter         : IEnergyMeter;
  overheatProtection  : boolean;
  networkMode         : ENetworkModeEVSE;
  userInterfaceEnabled: boolean;
  voltageLimit        : number | null;
  currentLimit        : number | null;
}