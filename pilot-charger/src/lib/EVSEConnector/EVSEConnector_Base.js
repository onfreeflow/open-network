"use strict"

import EventsObject from "../EventsObject"
import { POWER_TYPE } from "./EVSEConnector_Enums_Base"

export default class EVSEConnectorBase extends EventsObject {
  #id
  #powerType
  
  #current
  #meterValue = 0
  #voltage

  #status
  #type

  constructor(id, powerType, options){
    super()
    if ( !id || id == undefined ) {
      this.error( new SyntaxError( "BaseEVSEConnector: Missing id argument" ) )
    } 
    if ( !POWER_TYPE.includes(powerType) ){
      this.error( new SyntaxError( `BaseEVSEConnector: Incorrect Power Type or missing argument - Allowed Types[${POWER_TYPE.toString()}]` ) )
    }
    this.id = id
    this.powerType = powerType
    Object.entries(options).forEach( (key, value)=>{
      switch(key){
        case 'current': this.updateCurrent( value ); break;
        case 'meterValue': this.updateMeterValue( value ); break;
        case 'voltage': this.updateCurrent( value ); break;
        default: break;
      }
    })
  }
  error(err){
    this.emit( "error", err )
    throw err
  }
  updateCurrent( newCurrent ){
    if (
      newCurrent.lastIndexOf('A') !== newCurrent.length-1
      || parseInt(newCurrent.split("A")[0]) === NaN
    ){
      this.error( new TypeError( "BaseEVSEConnector: Incorrect 'current' or missing argument. Expect string('19.2A')" ) )
    }
    this.#current = newCurrent
  }
  updateMeterValue( newMeterValue ){ this.#meterValue = newMeterValue }
}