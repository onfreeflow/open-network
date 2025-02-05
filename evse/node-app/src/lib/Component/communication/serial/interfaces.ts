"use strict"

import { TComponentModule } from "../../common/types"
import {
  EBaudRate,
  EConnectionType,
  EDataAddress,
  EDataFormat
} from "./enums"

export interface ISerialModule extends TComponentModule {
  type       : EConnectionType,
  baudRate   : EBaudRate,
  pinCount   : number,
  dataFormat : EDataFormat,
  dataAddress: EDataAddress
}