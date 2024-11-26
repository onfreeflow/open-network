"use strict"

import { ECurrentType } from "../common/enums"
import { ESwitchType } from "../switch/enums"
import { ERelayContacts, ERelayPosition, ERelayType } from "./enums"
import { IRelay, IRelayConfiguration } from "./interfaces"

export class Relay implements IRelay {
  serialNumber   : string | number | symbol;
  type           : ERelayType;
  switchType     : ESwitchType;
  contacts       : ERelayContacts[] = [];
  position       : ERelayPosition;
  coilVoltage    : number;
  coilCurrentType: ECurrentType;
  loadCurrent    : number;
  loadCurrentType: ECurrentType;
  loadVoltage    : number;
  constructor( configuration: IRelayConfiguration ){
    Object.entries( configuration ).forEach( ([key,value]) => this[key]=value)
  }
}

export class PowerRelay extends Relay {
  type: ERelayType = ERelayType.POWER
  constructor( configuration: Omit<IRelayConfiguration, "type" >){
    super(configuration)
  }
}
export class OverCurrentRelay extends Relay {
  type: ERelayType = ERelayType.OVERLOAD_PROTECTION
  constructor( configuration: Omit<IRelayConfiguration, "type" >){
    super(configuration)
  }
}