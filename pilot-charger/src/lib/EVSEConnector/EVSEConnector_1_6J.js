"use strict"

import EVSEConnectorBase from "./EVSEConnector_Base"
import {
  AVAILABILITY_TYPE_1_6J,
  CONNECTOR_STATUS_1_6J,
  CONNECTOR_TYPE_1_6J,
  OCPP_TRANSITIONS_1_6J
} from "./EVSEConnector_Enums_1_6J"

export default class EVSEConnector_1_6 extends EVSEConnectorBase{
  #status = CONNECTOR_STATUS_1_6J.UNAVAILABLE
  #maxEnergyOnConnector
  #availabilityType = AVAILABILITY_TYPE_1_6J.INOPERATIVE
  constructor(id, type, powerType, options = {}){
    super(id, powerType, options)
    if ( !CONNECTOR_TYPE_1_6J.includes( type ) ) {
      this.error( new SyntaxError(`EVSEConnector_1_6: Invalid Connector Type - Allowed Types:[${CONNECTOR_TYPE_1_6J.toString()}]`) )
    }
  }
  canTransition( newStatus ){
    return OCPP_TRANSITIONS_1_6J[this.status]?.includes(newStatus) || false;
  }
  updateStatus( newStatus ){
    if ( this.canTransition( newStatus ) ){
      return CONNECTOR_STATUS_1_6J[this.#status]?.includes(newStatus) || false;
    }
    this.status = CONNECTOR_STATUS_1_6J[newStatus.toUpperCase()]
    this.emit("StatusNotification", {
      "connectorId": this.id,
      "errorCode"  : "NoError",
      "status"     : this.status
    })
  }
  updateAvailability( newAvailabliity ){
    if ( !AVAILABILITY_TYPE_1_6J.includes( newAvailabliity ) ){
      this.error( new SyntaxError("EVSEConnector_1_6: Invalid Connector Type") )
    }
    this.#availabilityType = newAvailabliity
  }
}