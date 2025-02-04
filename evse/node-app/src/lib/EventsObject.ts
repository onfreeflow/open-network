import { EventEmitter, once } from "events"

export default class EventsObject extends EventEmitter {
  once( eventName: string, options?:any ) {
    once( this, eventName, options )
    return this
  }
}