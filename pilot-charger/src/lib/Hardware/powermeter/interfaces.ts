"use strict"

import {
  watts,
  deciwatts,
  deciwatthours,
  celsius,
  volts,
  TBaudRate,
  THardwareModule,
} from "../common/types"
import { TDisplay } from "../display/types"
import { TLED } from "../led/types"

interface IMeterPowerConsumption {
  voltageLineConsumption?: volts
  currentLineConsumption?: watts
  voltageWorkRange      ?: [volts, volts]
}
export interface IPowerMeterConfiguration {
  serialNumber          : string | number;
  totalizer             : watts;
  voltage               : volts;
  displays             ?: TDisplay[]
  indicators           ?: TLED[];
  meterPowerConsumption?: IMeterPowerConsumption;
}

export interface IPowerMeter extends THardwareModule {
  totalizer            : deciwatts,
  voltage              : volts,
  deciWatts            : deciwatts,
  deciWattHours        : deciwatthours,
  activelyMetering     : boolean,
  display              ?: TDisplay,
  pulseIndicator       ?: TLED,
  operatingTemperature ?: [ celsius, celsius ],
  path                 : string,
  baudRate             : TBaudRate,
  meterPowerConsumption?: {
    voltageLineConsumption?: volts,
    currentLineConsumption?: volts,
    voltageWorkRange      ?: volts
  },
}