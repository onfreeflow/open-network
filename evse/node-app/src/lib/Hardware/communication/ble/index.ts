"use strict"

import HardwareModule from "../../common"
import { TBLEModule } from "./types"
import { meters } from "../../common/types"
import { ECommMode } from "../enums"


export class BLEModule extends HardwareModule implements TBLEModule {
  MACID    : string
  range    : meters
  frequency: number
  dataRate : number // kbps
  security : string[]
  commMode : ECommMode[]
  constructor({serialNumber}:{serialNumber:string|number|symbol}){
    super({serialNumber})
  } 
}