"use strict"

import EVSEBase from "./EVSEBase"
import Connector from "../EVSEConnector/EVSEConnector_2_0_1"

import {
  STATUS_EVSE,
  STATUS_TRANSITION_EVSE_2_0_1
} from "./EVSEEnums_2_0_1"
import {
  CHARGING_SCHEDULE_ALLOWED_CHARGING_RATE_UNIT_2_0_1
} from "./EVSEConfigurationEnums_2_0_1"


export default class EVSEConnector_2_0_1 extends EVSEBase {
  #status = STATUS_EVSE.UNAVAILABLE
  #connectors = []
  
  #transaction
  #supportedFeatures
  #networkStatus
  #capabilities
  #authenticationMode
  #currentOutOfTolerance
  #temperatureStatus
  #additionalConfiguration = {
    AllowOfflineTxForUnknownId             : false,
    AuthorizationCacheEnabled              : false,
    AllowOfflineTx                         : true,
    AuthorizeRemoteTxRequests              : false,
    ChargingScheduleAllowedChargingRateUnit: CHARGING_SCHEDULE_ALLOWED_CHARGING_RATE_UNIT_2_0_1.W,
    ConnectorPhaseRotation                 : null,
    HeartbeatInterval                      : 30000,
    LocalPreAuthorize                      : false,
    MaxChargingProfilesInstalled           : 10,
    MeterValuesAlignedData                 : null,
    MeterValuesSampledData                 : null,
    MeterValueSampleInterval               : 1000,
    SupportedFeatureProfiles               : [],
    StopTransactionOnEVSideDisconnect      : true,
    SupportedDiagnosticsProfiles           : [],
    SupportedFirmwareProfiles              : [],
    TransactionMessageQueueSize            : 1e9,
    MaxCompositeSchedules                  : 10,
    EVSEMaxCurrent                         : '120V',
    ChargeProfileMaxStackLevel             : 4
  }
  constructor({ connectors, ...rest }){
    super( { connectors, ...rest } )
    this.#connectors = connectors.map(({ id, type, powerType}) => new Connector(id, type, powerType))
  }
  canTransition( newStatus ){
    return STATUS_TRANSITION_EVSE_2_0_1[this.#status]?.includes(newStatus) || false;
  }
  updateStatus( newStatus ){
    if ( !this.canTransition( newStatus ) ){
      throw new StatusTransitionError( this.#status, newStatus )
    }
    const oldStatus = this.#status
    this.status = STATUS_EVSE[newStatus.toUpperCase()]
    this.emit("StatusUpdate", this.#status, oldStatus)
  }
}