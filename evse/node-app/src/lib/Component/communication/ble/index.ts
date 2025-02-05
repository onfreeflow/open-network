"use strict"

import Communication from "../"
import { TBLE } from "./types"

export class BLE extends Communication implements TBLE {
  constructor({serialNumber}:{serialNumber:string|number|symbol}){
    super({serialNumber})
  } 
}