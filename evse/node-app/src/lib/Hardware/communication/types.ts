"use strict"

import { THardwareModule } from "../common/types"
import { meters } from "../common/types"
import { ECommMode } from "./enums"

interface ICommunicationModule extends THardwareModule {
  MACID    : string,
  range    : meters,
  frequency: number,
  dataRate : number, // kbps
  security : string[],
  commMode : ECommMode[]  
}

export type TCommunicationModule = ICommunicationModule