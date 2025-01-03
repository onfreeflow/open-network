"use strict"

import { EHardwareInterface } from "./enums"
import { celsius, watts } from "./types"

export interface IHardwareModule {
  hardwareInterfaces    ?: EHardwareInterface[],
  serialNumber           : string | number | symbol,
  name                  ?: string,
  operatingTemperature  ?: [ celsius, celsius],
  devicePowerConsumption?: {
    standby  ?: watts,
    deepSleep?: watts,
    active   ?: watts
  }
}