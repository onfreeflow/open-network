"use strict"

import { EColor } from "../common/enums"
import { ohms } from "../common/types"

export interface ILED {
  id         : number | string,
  name       : string,
  description: string,
  pins       : number,
  resistance : ohms
}