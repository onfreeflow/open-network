"use strict"

import HardwareModule from "../../common"
import { meters, gigahertz } from "../../common/types"
import { EHardwareInterface } from "../../common/enums"
import { ECommMode } from "../enums"
import { TWiFiModule } from "./types"
import {
  EWifiProtocol,
  EWiFiCertification,
  EWiFiEncryption
} from "./enums"

export class WiFiModule extends HardwareModule implements TWiFiModule {
    protocols       : EWifiProtocol[]
    frequencies     : gigahertz[]
    interfaces      : EHardwareInterface[]
    certifications  : EWiFiCertification[]
    encryptions     : EWiFiEncryption[]
    MACID           : string
    range           : meters
    frequency       : number
    dataRate        : number // kbps
    security        : string[]
    commMode        : ECommMode[]
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}
export default WiFiModule