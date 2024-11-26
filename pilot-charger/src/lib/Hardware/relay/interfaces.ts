"use strict"

import { THardwareModule} from "../common/types"
import { ECurrentType } from "../common/enums"
import { ESwitchType } from "../switch/enums"
import { ERelayContacts, ERelayPosition, ERelayType } from "./enums"

export interface IRelay extends THardwareModule {
  type           : ERelayType,      
  switchType     : ESwitchType,     
  contacts       : ERelayContacts[],
  position       : ERelayPosition,  
  coilVoltage    : number,          
  coilCurrentType: ECurrentType,    
  loadCurrent    : number,          
  loadCurrentType: ECurrentType,    
  loadVoltage    : number           
}

export interface IRelayConfiguration {
  switchType     : ESwitchType,     
  contacts       : ERelayContacts[],
  position       : ERelayPosition,  
  coilVoltage    : number,          
  coilCurrentType: ECurrentType,    
  loadCurrent    : number,          
  loadCurrentType: ECurrentType,    
  loadVoltage    : number           
}