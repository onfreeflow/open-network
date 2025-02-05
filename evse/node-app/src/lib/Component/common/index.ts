"use strict"

import Base from "../../Base"
import { EHardwareInterface } from "./enums"
import { TComponentModule, celsius, watts } from "./types"
import { IComponentModuleConfiguration } from "./interfaces"

export class ComponentModule extends Base implements TComponentModule  {
    hardwareInterfaces    ?: EHardwareInterface[]
    serialNumber           : string | number | symbol
    name                  ?: string
    operatingTemperature  ?: [ celsius, celsius]
    devicePowerConsumption?: {
      standby  ?: watts,
      deepSleep?: watts,
      active   ?: watts
    }
    constructor( configuration:IComponentModuleConfiguration ){
      super()
      this.serialNumber = configuration.serialNumber
    }
    getSerialNumber = ():string|number => typeof this.serialNumber === "symbol" ? this.serialNumber.description! : this.serialNumber
}
export default ComponentModule