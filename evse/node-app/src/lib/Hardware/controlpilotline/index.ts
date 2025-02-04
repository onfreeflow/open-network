"use strict"

import { EControlPilotLineState } from "./enums"
import { TControlPilotLine }      from "./types"
import { volts }                  from "../common/types"
import EventsObject               from "../../EventsObject"

export class ControlPilotLine extends EventsObject implements TControlPilotLine {
  id: number | string | symbol;
  voltage : volts;
  MACAddress: string;
  state: EControlPilotLineState;
  // target: /tty/uart1 via UART, SPI, or I2C to manage PLC communication. So Serial Connection
  constructor( configuration: { target: string } ){ //target could be a Serial Port
    super()
    
  }

  updateState( newState: EControlPilotLineState ):void {
    this.state = newState
    this.emit( "stateUpdate", newState )
  }

}