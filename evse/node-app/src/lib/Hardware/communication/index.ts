"use strict"

import HardwareModule from "../common"
import { TCommunicationModule } from "./types"
import { meters } from "../common/types"
import { ECommMode } from "./enums"


export class CommunicationModule extends HardwareModule implements TCommunicationModule {
    MACID    : string
    range    : meters
    frequency: number
    dataRate : number // kbps
    security : string[]
    commMode : ECommMode[]
}

export default CommunicationModule