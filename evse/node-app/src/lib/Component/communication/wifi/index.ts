"use strict"

import CommunicationModule from ".."
import { gigahertz } from "../../common/types"
import { EHardwareInterface } from "../../common/enums"
import { TWiFiModule } from "./types"
import {
  EWifiProtocol,
  EWiFiCertification,
  EWiFiEncryption
} from "./enums"

export class WiFiModule extends CommunicationModule implements TWiFiModule {
    protocols       : EWifiProtocol[]
    frequencies     : gigahertz[]
    interfaces      : EHardwareInterface[]
    certifications  : EWiFiCertification[]
    encryptions     : EWiFiEncryption[]
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}
export default WiFiModule