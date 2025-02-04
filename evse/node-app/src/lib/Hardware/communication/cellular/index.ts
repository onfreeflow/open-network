"use strict"

import HardwareModule from "../../common"
import { TCellular } from "./types"
import { ECellularBand } from "./enums"
import { EHardwareInterface } from "../../common/enums"

export class Cellular extends HardwareModule implements TCellular {
    hardwareInterface: EHardwareInterface
    bands: ECellularBand[]
    esn: number
    arn: string;
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}