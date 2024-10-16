"use strict"

import EVSEBase from "./EVSEBase"
import Connector from "../EVSEConnector/EVSEConnector_1_6J"
import {
  STATUS_EVSE_1_6J,
  STATUS_TRANSITION_EVSE_1_6J,
} from "./EVSEEnums_1_6J"
import {
  SUPPORTED_FEATURE_PROFILES_1_6J
} from "./EVSEConfigurationEnums_1_6J"
import { StatusTransitionError } from "../utils"
const configuration = {
  meterValuesSampledData  : ['Energy.Active.Import.Register', 'Power.Active.Import', 'Current.Import', 'Voltage', 'Temperature'],
  stopTxnAlignedData      : ['Energy.Active.Import.Register', 'Power.Active.Import', 'Current.Import', 'Voltage', 'Temperature'],
  stopTxnSampledData      : ['Energy.Active.Import.Register', 'Power.Active.Import', 'Current.Import', 'Voltage', 'Temperature'],
  supportedFeatureProfiles: [
    SUPPORTED_FEATURE_PROFILES_1_6J.FIRMWARE_MANAGEMENT,
    SUPPORTED_FEATURE_PROFILES_1_6J.LOCAL_AUTH_LIST_MANAGEMENT,
    SUPPORTED_FEATURE_PROFILES_1_6J.SMART_CHARGING,
    SUPPORTED_FEATURE_PROFILES_1_6J.RESERVATION
  ]
}
export default class EVSE_1_6J extends EVSEBase {
  #status = STATUS_EVSE_1_6J.UNAVAILABLE
  #connectors = []
  constructor({ connectors, ...rest }){
    super({
      connectors,
      ...rest,
      configuration: {
        ...configuration,
        ...rest.configuration
      }
    })
    this.#connectors = connectors.map(({ id, type, powerType}) => new Connector( id, type, powerType ) )
  }
  canTransition( newStatus ){
    return STATUS_TRANSITION_EVSE_1_6J[this.#status]?.includes(newStatus) || false;
  }
  updateStatus( newStatus ){
    if ( !this.canTransition( newStatus ) ){
      throw new StatusTransitionError( this.#status, newStatus )
    }
    this.status = STATUS_EVSE_1_6J[newStatus.toUpperCase()]
    this.emit( "StatusNotification", {
      "connectorId": 0,
      "errorCode"  : "NoError",
      "status"     : this.status
    }) 
  }
}