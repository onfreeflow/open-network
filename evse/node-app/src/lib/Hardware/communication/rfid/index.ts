"use strict"

import HardwareModule from "../../common"
import { TRFIDModule } from "./types"
import { meters } from "../../common/types"
import { ECommMode } from "../enums"


export class RFIDModule extends HardwareModule implements TRFIDModule {
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