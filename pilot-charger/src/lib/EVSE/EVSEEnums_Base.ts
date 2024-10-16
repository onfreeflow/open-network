"use strict"

import { ENUM } from "../utils"

export const ENERGY_METER_TYPE = new ENUM(
  "MIDCertified",   
  "ANSIType",       
  "RevenueGrade",   
  "NonRevenueGrade",
  "Integrated",     
  "ExternalPulse",  
  "SmartMeter",     
  "DINRail",        
  "ModbusMeter",    
  "TCPMeter",       
  "RS485Meter",     
  "ZigBeeMeter",    
  "WiFiMeter",      
  "CellularMeter",  
  "LoRaMeter"       
)

export const POWER_TYPE_EVSE = new ENUM("AC", "DC")

export const VOLTAGE_EVSE = new ENUM("120V", "240V", "480V")
export const CURRENT_EVSE = new ENUM("16A", "32A", "63A")

export const AUTHENTICATION_MODE_EVSE = new ENUM("RFID", "PlugAndCharge", "RemoteStart", "LocalStart")
export const CHARGING_SCHEDULE_ALLOWED_CHARGING_RATE_UNIT = new ENUM("W", "A")
export const NETWORK_MODE_EVSE = new ENUM("Wi-Fi", "Ethernet", "Cellular")
export const CONNECTOR_STATUS_EVSE = new ENUM("Available", "Occupied", "Reserved", "Faulted", "Unavailable")
export const SUPPORTED_FEATURE_PROFILES = new ENUM("FirmwareManagement", "LocalAuthListManagement", "SmartCharging", "Reservation")
export const CLOCK_ALIGNED_DATA_INTERVAL = new ENUM("Wh", "kWh", "A", "V", "C")
