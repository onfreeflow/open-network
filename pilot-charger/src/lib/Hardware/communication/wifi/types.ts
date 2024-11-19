import { gigahertz } from "../../common/types"
import { EHardwareInterface } from "../../common/enums"
import { TCommunicationModule } from "../types"

import {
  EWiFiCertification,
  EWiFiEncryption,
  EWifiProtocol
 } from "./enums"

interface IWiFiModule extends Omit<TCommunicationModule, "frequency"> {
  protocols       : EWifiProtocol[],
  frequencies     : gigahertz[],
  interfaces      : EHardwareInterface[],
  certifications  : EWiFiCertification[],
  encryptions     : EWiFiEncryption[]
}

export type TWiFiModule = IWiFiModule