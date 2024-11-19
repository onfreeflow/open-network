"use strict"

import { THardwareModule } from "../common/types"
import { ECurrentType } from "../common/enums"
import { ESwitchType } from "../switch/enums"
import { ERelayType, ERelayContacts, ERelayPosition } from "./enums"

interface IRelay extends THardwareModule {
  type           : ERelayType,      // POWER
  switchType     : ESwitchType,     // SPST
  contacts       : ERelayContacts[],// [ "NC", "C", "COIL_P", "COIL_N"] 
  position       : ERelayPosition,  // OPEN/CLOSED
  coilVoltage    : number,         // 5
  coilCurrentType: ECurrentType,    // DC
  loadCurrent    : number,         // DeciWatt
  loadCurrentType: ECurrentType,    // AC
  loadVoltage    : number          // 270
}

export type TRelay = IRelay