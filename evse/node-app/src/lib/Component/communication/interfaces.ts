"use strict"

import { TComponentModule } from "../common/types"
import { meters } from "../common/types"
import { ECommMode } from "./enums"

export interface ICommunicationModule extends TComponentModule {
  MACID    : string,
  range    : meters,
  frequency: number,
  dataRate : number, // kbps
  security : string[],
  commMode : ECommMode[]  
}