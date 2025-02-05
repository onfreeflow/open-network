"use strict"

import CommunicationModule from ".."
import { TBLEModule } from "./types"
import { meters } from "../../common/types"
import { ECommMode } from "../enums"


export class BLEModule extends CommunicationModule implements TBLEModule {
  constructor({serialNumber}:{serialNumber:string|number|symbol}){
    super({serialNumber})
  } 
}