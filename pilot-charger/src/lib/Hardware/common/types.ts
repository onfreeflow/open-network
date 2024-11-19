"use strict"

export type volts         = number;
export type deciwatts     = number; 
export type deciwatthours = number;
export type watts         = number;
export type whatthours    = number;
export type meters        = number;
export type hertz         = number; // 50, 60
export type gigahertz     = number; // 2.4, 5, 6
export type temperature   = number;
export type fahrenheit    = temperature;
export type celsius       = temperature;
export type ohms          = number;

import { EHardwareInterface } from "./enums"

export type THardwareModule = {
  hardwareInterfaces?: EHardwareInterface[],
  serialNumber       : string,
  name              ?: string,
  devicePowerConsumption  ?: {
    standby  ?: watts,
    deepSleep?: watts,
    active   ?: watts
  }
}