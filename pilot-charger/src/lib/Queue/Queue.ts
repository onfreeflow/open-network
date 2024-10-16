"use strict"

import { EventEmitter } from "events"
import Database from "./Database"

export class EventQueue {
  #queue = []
  #eventStream
  #db
  #emitter = new EventEmitter()
  constructor({ dbType, host, port }) {
    this.#eventStream = this._eventGenerator();
    if ( !(this instanceof EventQueue) ) {
      return new EventQueue( options )
    }
    return (async () => {
      if ( dbType === "memory"){
        console.warn( "Queue will not persist, dbType[memory]" )
        return this
      }
      const db = await new Database( dbType, { host, port } )
      if ( !(db instanceof Database) ) {
        console.warn("Invalid database instance provided.");
        return this
      }
      this.#db = db;
      try {
        await this.#db.initialize();
      } catch ( e ) {
        console.error( e );
      }
      return this
    })()
  }
  async hydrate(){
    try {
      if (this.#db) {
        this.#queue.push(...await this.#db.fetchAll());
      }
    } catch (e) {
      console.error( e )
    }
  }
  *_eventGenerator() {
      while (true) {
          yield this.#queue.length === 0 ? null : this.#queue.shift()
      }
  }
  async enqueue(event){
    try{
      if (this.#db) {
        await this.#db.insert(eventStr);
      }
      this.#queue.push(event)
    } catch ( e ){
      console.error( e )
    }
  }
  async dequeue() {
    try{
      const { value } = this.#eventStream.next()
      if (value && this.#db) {
        await this.#db.delete(JSON.stringify(value));
      }
      return value || null
    } catch ( e ){
      console.error( e )
    }
  }
  get length(){
    return this.#queue.length
  }
  on( eventName, callBack ){
    this.#emitter.on( eventName, callBack )
  }
  off( eventName, callBack ){
    this.#emitter.off( eventName, callBack )
  }
  async enqueueEvent( event ){
    try {
      await this.enqueue( event )
      this.#emitter.emit( "EVENT_QUEUED", event )
    } catch ( e ){
      console.error( e )
    }
  }
  async dequeueEvent(){
    try{
      const event = await this.dequeue()
      this.#emitter.emit( "EVENT_DEQUEUED", event )
      return event
    } catch ( e ){
      console.error( e )
    }
  }
}