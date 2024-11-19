"use strict"

import {
  ohms,
  THardwareModule
} from "../common/types"
import { EColor } from "../common/enums"

enum EScreenType {
  LCD  = "LCD",
  TFT  = "TFT",
  LED  = "LED",
  OLED = "OLED"
}

enum EScreenResolution {
  ONE_X_ONE                           = "1x1",
  FOUR_HUNDRED_X_THREE_HUNDRED_TWENTY = "400x320",
}

export interface IDisplay extends THardwareModule {
  screenType: EScreenType,
  screenSize: number,
  bits      : number,
  resolution: EScreenResolution
}

export interface ILED {
  pins: number,
  color: EColor,
  resistance: ohms
}

export type TDisplay = IDisplay
export type TLED = ILED