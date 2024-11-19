"use strict"

import {
  deciwatts,
  deciwatthours,
  celsius,
  volts,
  THardwareModule
} from "../common/types"
import { TDisplay, TLED } from "../display/types"

export interface IPowerMeter extends THardwareModule {
  totalizer            : deciwatts,
  voltage              : volts,
  deciWatts            : deciwatts,
  deciWattHours        : deciwatthours,
  display              : TDisplay,
  activelyMetering     : boolean,
  pulseIndicator       : TLED,
  operatingTemperature : [ celsius, celsius ],
  meterPowerConsumption: {
    voltageLineConsumption: volts,
    currentLineConsumption: volts,
    voltageWorkRange      : volts
  },
}