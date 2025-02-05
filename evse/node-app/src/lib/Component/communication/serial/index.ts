"use strict"

import CommunicationModule from ".."
import { TSerialModule } from "./types"
import {
  EConnectionType,
  EBaudRate,
  EDataFormat,
  EDataAddress
} from "./enums"

export class SerialModule extends CommunicationModule implements TSerialModule {
  type       : EConnectionType
  baudRate   : EBaudRate
  pinCount   : number
  dataFormat : EDataFormat
  dataAddress: EDataAddress
  constructor({serialNumber}:{serialNumber:string|number|symbol}){
      super({serialNumber})
  }
}
export default SerialModule