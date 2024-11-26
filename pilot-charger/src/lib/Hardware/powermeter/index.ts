"use strict";

import { watts, volts, celsius } from "../common/types"
import { TDisplay } from "../display/types"
import { TPowerMeter } from "./types"
import { IPowerMeterConfiguration } from "./interfaces"
import { TLED } from "../led/types"

const options = {
  displays:[],
  indicators:[],
}

export class PowerMeterModule implements TPowerMeter {
  serialNumber:string      = ""
  totalizer:watts          = 0
  voltage:volts            = 0
  deciWatts:watts          = 0
  deciWattHours:watts      = 0
  activelyMetering:boolean = false
  displays:TDisplay[]      = []
  indicators:TLED[]        = []
  meterPowerConsumption    = {
    voltageLineConsumption: 0,
    currentLineConsumption: 0,
    voltageWorkRange      : 0
  }
  path                    : "/dev/ttyUSB0",
  baudRate                : 9600
  constructor( configuration: IPowerMeterConfiguration ){
    Object.entries( configuration).forEach( ( [ key, val ] ) => this[ key ] = val )
    
  }
  
}

export default PowerMeterModule