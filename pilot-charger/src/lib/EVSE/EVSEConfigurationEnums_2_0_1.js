"use strict"

import { ENUM } from "../utils"

export const CHARGING_SCHEDULE_ALLOWED_CHARGING_RATE_UNIT_2_0_1 = new ENUM('W', 'A')
export const CONNECTOR_PHASE_ROTATION_2_0_1 = new ENUM('R-LO', 'LO-S', 'S-R')
export const SUPPORTED_FEATURE_PROFILES_2_0_1 = new ENUM('FirmwareManagement', 'LocalAuthListManagement', 'ISO15118Management', 'Reservation', 'SecurityProfile', 'SmartCharging')
export const SUPPORTED_DIAGNOSTICS_PROFILES_2_0_1 = new ENUM('Basic', 'Extended')
export const SUPPORTED_FIRMWARE_PROFILES_2_0_1 = new ENUM('Basic', 'Extended', 'Premium')
export const EVSE_MAX_CURRENT_2_0_1 = new ENUM('16A', '32A', '63A')
export const CHARGE_PROFILE_MAX_STACK_LEVEL_2_0_1 = new ENUM('0', '1', '2', '3', '4')