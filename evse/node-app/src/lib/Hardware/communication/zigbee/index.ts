"use strict"

import HardwareModule from "../../common"
import { meters } from "../../common/types"
import { ECommMode } from "../enums"
import { TZigBeeModule } from "./types"

export class ZigBeeModule extends HardwareModule implements TZigBeeModule {
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
export default ZigBeeModule