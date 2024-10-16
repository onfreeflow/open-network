
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid"
import ErrorMalformedMessage from "./utils"

const createWebSocketFrame = message => {
  const payload = Buffer.from(message, "utf8");
  const mask = randomBytes(4);
  const maskedPayload = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) {
    maskedPayload[i] = payload[i] ^ mask[i % 4];
  }
  const frameHeader = Buffer.alloc(2 + 4);
  frameHeader[0] = 0x81;
  frameHeader[1] = 0x80 | payload.length;
  mask.copy(frameHeader, 2);
  return Buffer.concat([frameHeader, maskedPayload]);
}

const formatOCPPMessage = ( method, payload = {} ) => {
  const messageArr = [
    2,
    Math.random().toString(36).substring(2, 15),
    method,
    payload
  ]
  try {
    if ( typeof messageArr !== "object" && !(messageArr instanceof Array) ) throw new ErrorMalformedMessage("must be of type 'object' and instance of Array. OCPP expects a list []")
    if ( messageArr.length !== 4 ) throw new ErrorMalformedMessage("message must be 4 items: [messageType, messageId, action, payload]")
    if ( typeof messageArr[ 0 ] !== "number" ) throw new ErrorMalformedMessage("message[0] must be of type 'number'")
    if ( typeof messageArr[ 1 ] !== "string") throw new ErrorMalformedMessage("message[1] must be of type 'string'")
    if ( typeof messageArr[ 2 ] !== "string" ) throw new ErrorMalformedMessage("message[2] must be of type 'string'")
    if ( typeof messageArr[ 3 ] !== "object" ) throw new ErrorMalformedMessage("message[3] must be of type 'object'")
  } catch ( e ) {
    console.error( e.message, e.cause )
  }
  return messageArr |> JSON.stringify |> createWebSocketFrame
}

export default class Envelope {
  id = uuidv4()
  constructor( method, payload = {}  ){
    this.message = formatOCPPMessage( method, payload )
  }
}