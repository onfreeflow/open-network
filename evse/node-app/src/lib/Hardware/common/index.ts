"use strict"

import Base from "../../Base"
import { EHardwareInterface } from "./enums"
import { THardwareModule, celsius, watts } from "./types"
import { IHardwareModuleConfiguration } from "./interfaces"

export class HardwareModule extends Base implements THardwareModule  {
    hardwareInterfaces    ?: EHardwareInterface[]
    serialNumber           : string | number | symbol
    name                  ?: string
    operatingTemperature  ?: [ celsius, celsius]
    devicePowerConsumption?: {
      standby  ?: watts,
      deepSleep?: watts,
      active   ?: watts
    }
    constructor( configuration:IHardwareModuleConfiguration ){
      super()
      this.serialNumber = configuration.serialNumber
    }
    getSerialNumber = ():string|number => typeof this.serialNumber === "symbol" ? this.serialNumber.description! : this.serialNumber
}
export default HardwareModule