"use strict"

import { EventsQueue } from "../Queue"
import { EVSEConnector } from "../EVSEConnector"
import { Transport } from "../Transport/interfaces"

export enum EPerfMarksFTPUpload {
  FTP_UPLOAD_CONNECTING = "FTP_UPLOAD_CONNECTING",
  START_FTP_UPLOAD = "START_FTP_UPLOAD",
  COMPLETE_FTP_UPLOAD = "COMPLETE_FTP_UPLOAD"
}
export enum EPerfMeasuresFTPUpload {
  FTP_TIME_TO_CONNECT = "FTP_TIME_TO_CONNECT",
  FTP_TIME_TO_UPLOAD = "FTP_TIME_TO_UPLOAD"
}

export interface IPayload {
  [key: string]: any;
  timestamp?: string;
}
export enum EChargingMode {
  AC = 'AC',
  DC = 'DC',
}
export enum EPowerFrequency {
  "50HZ" = "50Hz",
  "60HZ" = "60Hz"  
}
export enum EVoltageLevel {
  AC_LEVEL_1 = 120,
  AC_LEVEL_2_SINGLE_PHASE = 240,
  AC_LEVEL_3_THREE_PHASE = 400,
  DC_FAST_CHARGING_STANDARD = 500,
  DC_FAST_CHARGING_HIGH_POWER = 800,
  DC_FAST_CHARGING_ULTRA = 1000,
}
export enum ECurrentLevel {
  AC_LEVEL_1 = 16,
  AC_LEVEL_2 = 32,
  DC_FAST_STANDARD = 125,
  DC_FAST_HIGH = 350,
  DC_FAST_ULTRA = 500,
}
export enum EPowerLevel {
  AC_LEVEL_1 = 1.92,    
  AC_LEVEL_2 = 22,      
  DC_FAST_STANDARD = 50,
  DC_FAST_HIGH = 350,   
  DC_FAST_ULTRA = 1000,
}
export enum EPowerType {
  SINGLE_PHASE_AC = 'Single-Phase AC',
  SPLIT_PHASE_AC = 'Split-phase AC',
  THREE_PHASE_AC = 'Three-Phase AC',
  DC = 'DC',
  CONSTANT_VOLTAGE = 'Constant Voltage',
  CONSTANT_CURRENT = 'Constant Current',
}
export enum ESmartChargingCapability {
  DYNAMIC_LOAD_MANAGEMENT = 'Dynamic Load Management',
  SCHEDULED_CHARGING = 'Scheduled Charging',
  VEHICLE_TO_GRID = 'Vehicle-to-Grid (V2G)',
  DEMAND_RESPONSE = 'Demand Response',
  POWER_SHARING = 'Power Sharing',
}
export enum EGridStatus {
  NOMINAL = 'Nominal',
  CONSTRAINED = 'Constrained',
  EMERGENCY = 'Emergency',
}
export enum EDemandResponseStatus {
  NONE = 'None',
  CONSTRAINED = 'Constrained',
  UNCONSTRAINED = 'Unconstrained',
}
export enum EIngressProtection {
  IP54 = 'IP54',
  IP65 = 'IP65',
  IP67 = 'IP67',
}
export enum ETemperatureRange {
  MIN = -30,
  MAX = 50, 
}
export enum EHumidityRange {
  MIN = 5, 
  MAX = 95,
}
export enum EInstallationType {
  WALL_MOUNTED = 'Wall-Mounted',
  PEDESTAL = 'Pedestal',
  POLE_MOUNTED = 'Pole-Mounted',
}
export enum EDurabilityRating {
  IMPACT_RESISTANT = 'Impact Resistant',
  UV_RESISTANT = 'UV Resistant',
  WEATHER_RESISTANT = 'Weather Resistant',
}
export enum EFirmwareUpdateInterval {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  MANUAL = 'Manual',
}

export enum EErrorReporting {
  STATUS_REPORT = 'Status Report',
  DIAGNOSTIC_REPORT = 'Diagnostic Report',
}

export enum ELockingMechanism {
  AUTO_LOCK = 'Automatic Lock',
  MANUAL_LOCK = 'Manual Lock',
  NONE = 'None',
}

export enum EPowerFactor {
  PF_1   = 1.0,
  PF_095 = 0.95,
  PF_09  = 0.9,
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

export enum EEventsQueueDBType {
  MEMORY  = "memory",
  REDIS   = "redis",
  SQLITE3 = "sqlite3",
  ROCKSDB = "rocksdb",
  LEVELDB = "leveldb"
}

export interface IEVSEEventsQueue {
  queue : EventsQueue | null,
  dbType?: EEventsQueueDBType,
  host  ?: string,
  port  ?: number
}

export interface IEVSEProperties {
  connectors     : EVSEConnector[];
  voltage        : EVoltageLevel
  current        : ECurrentLevel
  powerType      : EPowerType
  meterValue     : number
  id             : string | number;
  vendorId       : string
  model          : string
  serialNumber   : string
  lastHeartbeat  : string
  location       : string
  maxPower       : number
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

export interface IEVSEOptions {
  id            : string | number;
  serialNumber  : string;
  connectors   ?: EVSEConnector[] | EVSEConnector;
  transport    ?: Transport[];
  eventsQueue  ?: Omit<IEVSEEventsQueue, "queue">;
  os           ?: IEVSEOSConfiguration;
  configuration?: IEVSEConfiguration;
  manufacturer ?: IEVSEManufacturerConfiguration;
}

// Charging Rate Units
export enum EChargingScheduleAllowedChargingRateUnit {
  W = 'W',  // Watts
  A = 'A',  // Amperes
}

export enum EMeterType {
  REVENUE_GRADE = 'Revenue Grade',
  STANDARD = 'Standard',
  BASIC = 'Basic',
}
// Energy Meter Types
export interface IEnergyMeter {
  type        : EMeterType.REVENUE_GRADE;
  currentValue: number;
  serialNumber: string;
}

// Network Modes
export enum ENetworkModeEVSE {
  WIFI = 'WiFi',
  ETHERNET = 'Ethernet',
  CELLULAR = 'Cellular',
  BLUETOOTH = 'Bluetooth'
}

export interface IFirmwareConfiguration {
  version         : string;
  downloadInterval: number;
  downloadRetries : number;
}

export interface IGetDiagnosticsRequest {
  location: string;
  retries: number;
  retryInterval: number;
  startTime: string;
  stopTime: string;
}

export enum EDiagnosticStatus {
  UPLOADED = "Uploaded",
  UPLOADING = "Uploading",
  UPLOAD_FAILED = "UploadFailed",
  NEVER = "Never"
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
  timestamp: string;
  status   : EDiagnosticStatus;
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