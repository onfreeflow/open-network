"use strict"

import { ENUM } from "../utils"

export const STATUS_EVSE_1_6J = new ENUM('Available', 'Occupied', 'Reserved', 'Faulted', 'Unavailable');
export const STATUS_TRANSITION_EVSE_1_6J = {
  Available: ["Reserved", "Faulted", "Unavailable", "Occupied"],
  Reserved: ["Available", "Faulted", "Occupied", "Unavailable"],
  Occupied: ["Available", "Reserved", "Faulted", "Unavailable"],
  Faulted: ["Available", "Unavailable"],
  Unavailable: ["Available"]
}