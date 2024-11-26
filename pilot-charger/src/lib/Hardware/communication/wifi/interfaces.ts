"use strict"
import { gigahertz } from "../../common/types"
import { EHardwareInterface } from "../../common/enums"
import { TCommunicationModule } from "../types"

import { EWiFiCertification, EWiFiEncryption, EWifiProtocol } from "./enums"

export interface IWiFiModule extends Omit<TCommunicationModule, "frequency"> {
  protocols       : EWifiProtocol[],
  frequencies     : gigahertz[],
  interfaces      : EHardwareInterface[],
  certifications  : EWiFiCertification[],
  encryptions     : EWiFiEncryption[]
}