"use strict"
import EVSEConnectorBase from "./EVSEConnector_Base"
import {
  AVAILABILITY_2_0_1,
  OCPP_TRANSITIONS_2_0_1,
  CONNECTOR_STATUS_2_0_1,
  CONNECTOR_TYPE_2_0_1,
  CONNECTOR_CABLE_STATUS_2_0_1,
  CONNECTOR_PHASE
} from "./EVSEConnector_Enums_2_0_1"

export default class EVSEConnector_2_0_1 extends EVSEConnectorBase{
  #status = CONNECTOR_STATUS_2_0_1b.UNAVAILABLE
  #availability = AVAILABILITY_2_0_1.OPERATIVE

  #phase
  #maxCurrent
  #maxVoltage
  #maxPower
  #currentOutOfTolerance
  #proximityStatus
  #thermalStatus
  #location
  constructor(id, type, powerType, options){
    super(id, powerType, options)
    if ( !CONNECTOR_TYPE_2_0_1.includes( type ) ) {
      this.error( new SyntaxError("EVSEConnector_2_0_1: Invalid Connector Type") )
    }
  }
  canTransition( newStatus ){
    return OCPP_TRANSITIONS_2_0_1.get(this.status).has(newStatus) || false;
  }
  updateStatus( newStatus ){
    const oldStatus = this.status
    if ( !this.canTransition( newStatus ) ){
     this.error( new SyntaxError("EVSEConnector_2_0_1: Invalid Status") )
    }
    this.status = CONNECTOR_STATUS_2_0_1[newStatus.toUpperCase()]
    this.emit("StatusUpdate", this.status, oldStatus)
  }
  updateAvailability( newAvailabliity ){
    if ( !AVAILABILITY_2_0_1.includes( newAvailabliity ) ){
      this.error( new SyntaxError("EVSEConnector_2_0_1: Invalid Availability") )
    }
    this.#availability = newAvailabliity
  }
}