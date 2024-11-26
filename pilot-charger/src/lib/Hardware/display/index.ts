"use strict"

import { TDisplay } from "./types"

export class TFTDisplay implements TDisplay {
  screenType: EScreenType.LCD,
  screenSize: 0,
  bits      : number,
  resolution: EScreenResolution["330x400"]
}

export class TouchDisplay implements TDisplay {
  
}