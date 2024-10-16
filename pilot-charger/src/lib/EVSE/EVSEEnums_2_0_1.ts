"use strict"

import { ENUM } from "../utils"

export const NETWORK_STATUS_EVSE_2_0_1 = new ENUM('Connected', 'Disconnected', 'Connecting', 'Faulted');
export const CAPABILITIES_EVSE_2_0_1 = new ENUM('ISO15118', 'PlugAndCharge', 'RemoteStop', 'SecurityProfile');
export const SUPPORTED_FEATURES_EVSE_2_0_1 = new ENUM('SmartCharging', 'FirmwareUpdate', 'Diagnostics', 'SecurityProfiles');
export const TEMPERATURE_STATUS_EVSE_2_0_1 = new ENUM('Normal', 'High', 'Overheated', 'Low');
export const TRANSACTION_STATE_EVSE_2_0_1 = new ENUM('Started', 'Ongoing', 'Ended');

export const STATUS_EVSE = new ENUM( 'Available', 'Reserved', 'Occupied', 'Charging', 'SuspendedEV', 'SuspendedEVSE', 'Faulted', 'Unavailable' )
export const STATUS_TRANSITION_EVSE_2_0_1 = {
  Available    : ["Reserved", "Charging", "Unavailable", "Faulted", "SuspendedEVSE"],
  Reserved     : ["Available", "Charging", "Unavailable", "Faulted"],
  Occupied     : ["Reserved", "Available", "Charging", "Faulted", "SuspendedEVSE", "SuspendedEV"],
  Charging     : ["Finishing", "SuspendedEVSE", "SuspendedEV", "Faulted", "Unavailable"],
  SuspendedEV  : ["Charging", "Faulted", "Unavailable"],
  SuspendedEVSE: ["Charging", "Faulted", "Unavailable"],
  Faulted      : ["Available", "Unavailable"],
  Unavailable  : ["Available"]
};