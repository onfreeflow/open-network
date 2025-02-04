"use strict"

import { THardwareModule } from "../../common/types"
import {
  EBaudRate,
  EConnectionType,
  EDataAddress,
  EDataFormat
} from "./enums"

export interface ISerialModule extends THardwareModule {
  type       : EConnectionType,
  baudRate   : EBaudRate,
  pinCount   : number,
  dataFormat : EDataFormat,
  dataAddress: EDataAddress
}