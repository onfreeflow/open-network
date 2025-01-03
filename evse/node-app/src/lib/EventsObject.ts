import { EventEmitter, once } from "events"

export default class EventsObject extends EventEmitter {
  once( ...args ) {
    once( this, ...args )
    return this
  }
}