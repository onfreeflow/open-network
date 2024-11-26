"use strict"

import { EHardwareInterface } from "./enums"
import { watts } from "./types"

export type IHardwareModule = {
  hardwareInterfaces?: EHardwareInterface[],
  serialNumber       : string | number | symbol,
  name              ?: string,
  devicePowerConsumption  ?: {
    standby  ?: watts,
    deepSleep?: watts,
    active   ?: watts
  }
}