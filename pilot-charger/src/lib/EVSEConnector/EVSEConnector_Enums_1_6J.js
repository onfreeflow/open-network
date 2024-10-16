"use strict"
import { ENUM } from "../utils"

export const AVAILABILITY_TYPE_1_6J = new ENUM( 'Inoperative', 'Operative' )
export const CONNECTOR_TYPE_1_6J = new ENUM('Type2','CHAdeMO','CCS', 'Type1')
export const CONNECTOR_STATUS_1_6J = new ENUM(
  'Available',
  'Occupied',
  'Reserved',
  'Faulted',
  'Unavailable'
)

export const OCPP_TRANSITIONS_1_6J = {
  Available: ["Reserved", "Faulted", "Unavailable", "Occupied"],
  Reserved: ["Available", "Faulted", "Occupied", "Unavailable"],
  Occupied: ["Available", "Reserved", "Faulted", "Unavailable"],
  Faulted: ["Available", "Unavailable"],
  Unavailable: ["Available"]
}