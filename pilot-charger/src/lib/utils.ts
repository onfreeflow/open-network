"use strict"

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