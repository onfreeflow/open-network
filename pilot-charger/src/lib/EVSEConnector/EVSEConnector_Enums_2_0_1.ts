"use strict"

import { ENUM } from "../utils"

export const AVAILABILITY_2_0_1 = new ENUM(
  'Inoperative',
  'Operative'
)

export const OCPP_TRANSITIONS_2_0_1 = new Map([
  ["Available", new Map(["Reserved", "Charging", "Unavailable", "Faulted", "SuspendedEVSE"])],
  ["Reserved", new Map(["Available", "Charging", "Unavailable", "Faulted"])],
  ["Occupied", new Map(["Reserved", "Available", "Charging", "Faulted", "SuspendedEVSE", "SuspendedEV"])],
  ["Charging", new Map(["Finishing", "SuspendedEVSE", "SuspendedEV", "Faulted", "Unavailable"])],
  ["SuspendedEV", new Map(["Charging", "Faulted", "Unavailable"])],
  ["SuspendedEVSE", new Map(["Charging", "Faulted", "Unavailable"])],
  ["Faulted", new Map(["Available", "Unavailable"])],
  ["Unavailable", new Map(["Available"])]
]);

export const CONNECTOR_TYPE_2_0_1 = new ENUM(
    'IEC_62196_T1',
    'IEC_62196_T2',
    'CHAdeMO',
    'CCS1',
    'CCS2',
    'Tesla'
  )
export const CONNECTOR_STATUS_2_0_1 = new ENUM(
    'Available',
    'Occupied',
    'Reserved',
    'Faulted',
    'Unavailable',
    'Charging',
    'SuspendedEVSE',
    'SuspendedEV',
    'Finishing'
  )
export const CONNECTOR_CABLE_STATUS_2_0_1 = new ENUM(
    'PluggedIn',
    'Unplugged',
    'Locked'
  )
export const CONNECTOR_PHASE = new ENUM(
    '1-Phase',
    '1-Phase-Split',
    '3-Phase'
  )