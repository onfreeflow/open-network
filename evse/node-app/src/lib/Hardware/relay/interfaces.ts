"use strict"

import { THardwareModule} from "../common/types"
import { IHardwareModule } from "../common/interfaces"
import { ECurrentType } from "../common/enums"
import { ESwitchType } from "../switch/enums"
import { ERelayContacts, ERelayPosition, ERelayType } from "./enums"

export interface IRelayStatusResponse {
  position: ERelayPosition
}

export interface IRelay extends THardwareModule {
  path           : string
  type           : ERelayType      
  switchType     : ESwitchType     
  contacts       : ERelayContacts[]
  position       : ERelayPosition 
  coilVoltage    : number          
  coilCurrentType: ECurrentType    
  loadCurrent    : number          
  loadCurrentType: ECurrentType    
  loadVoltage    : number
  close()        : void
  open()         : void
  status()       : IRelayStatusResponse
}

export interface IRelayConfiguration extends IHardwareModule {
  switchType     : ESwitchType     
  contacts       : ERelayContacts[]
  position       : ERelayPosition  
  coilVoltage    : number          
  coilCurrentType: ECurrentType    
  loadCurrent    : number          
  loadCurrentType: ECurrentType    
  loadVoltage    : number
  path           : string        
}