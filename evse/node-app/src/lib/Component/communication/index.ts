"use strict"

import ComponentModule from "../common"
import { TCommunicationModule } from "./types"
import { meters } from "../common/types"
import { ECommMode } from "./enums"


export class CommunicationModule extends ComponentModule implements TCommunicationModule {
    MACID    : string
    range    : meters
    frequency: number
    dataRate : number // kbps
    security : string[]
    commMode : ECommMode[]
}

export default CommunicationModule