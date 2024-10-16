import { EventEmitter } from "events"

export default class EventsObject {
  #emitter = new EventEmitter( { captureRejections: true } )
  constructor(){}
  emit(...args){
    this.#emitter.emit(...args)
    return this
  }
  on(...args){
    this.#emitter.on(...args)
    return this
  }
  off( ...args ){
    this.#emitter.off( ...args )
    return this
  }
}