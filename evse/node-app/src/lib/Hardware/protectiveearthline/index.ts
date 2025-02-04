"use strict"

import { EProtectiveEarthLineState } from "./enums"
import { TProtectiveEarthLine }      from "./types"
import { volts }                     from "../common/types"
import EventsObject                  from "../../EventsObject"

export class ProtectiveEarthLine extends EventsObject implements TProtectiveEarthLine {
  id: number | string | symbol;
  voltage : volts;
  MACAddress: string;
  state: EProtectiveEarthLineState;
  constructor(){
    super()
  }
}