"use strict"

export class ENUM {
  #core = {}
  constructor(...items){
    this.#core = items.reduce( (obj, item) => (obj[item.toUpperCase()]=item,obj), {})
    return this
  }
  includes( str ){
    return Object.values( this.#core ).includes( str )
  }
  toString(){
    return JSON.toString( this.#core )
  }
}

export class ErrorMalformedMessage extends Error {
  constructor( cause = "" ) {
    super( `Message Malformed: `, { cause })
  }
}
export class StatusTransitionError extends Error {
  constructor( oldStatus, newStatus ){
    super( `Status Transition Error: Status[${oldStatus}] cannot transition to Status[${newStatus}]`, { cause: "NewStatus !== OldStatus" } )
  }
}