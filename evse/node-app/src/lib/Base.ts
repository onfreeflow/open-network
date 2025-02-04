"use strict"
import EventsObject from "./EventsObject"

export class Base extends EventsObject {
  id:string|number|symbol;
  getId = () => typeof this.id === "symbol" ? this.id.description : this.id
}
export default Base