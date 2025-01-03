"use strict"
import { SerialPort, ReadLineParser } from "serialport";

export class ErrorMalformedMessage extends Error {
  constructor( cause = "" ) {
    super( `Message Malformed: `, { cause })
  }
}
export class StatusTransitionError extends Error {
  constructor( oldStatus:string, newStatus:string ){
    super( `Status Transition Error: Status[${oldStatus}] cannot transition to Status[${newStatus}]`, { cause: "NewStatus !== OldStatus" } )
  }
}

/**
 * Sends a command to the Arduino to control a device (e.g., a relay) by serial number.
 * @param {string} portPath - Port path such as: /dev/ttyUSB0
 * @param {Object} {command, serialNumber, portPath, baudRate, timeout, newLine } - The port path, baud rate, serial number of the device to target.
 * @returns {Promise<boolean>} Resolves to true if the command is sent successfully.
 */
export async function sendSerialCommand( portPath:string, { command, serialNumber, baudRate = 9600, timeout = 2000, newLine = "\n" }:{ command:string,serialNumber:string|number|Symbol, baudRate?:number, timeout?:number, newLine?:string } ):Promise<boolean|string> {
  const
    sn = serialNumber instanceof Symbol ? serialNumber.description : serialNumber,
    port = new SerialPort( { path: portPath, baudRate } ),
    parser = new ReadLineParser({ delimiter: newLine }),
    message = JSON.stringify( { serialNumber: sn, command } ) + newLine; // Add newline for serial parsing
  return new Promise( ( resolve, reject ) => {
    const
      time_out = setTimeout( () => ( reject(), port.close() ), timeout ),
      wrapUp = ( msg?:string|boolean, err?:Error ) => (
        clearTimeout( time_out ),
        port.close(),
        msg ? resolve( msg ) : err ? reject( err ) : false
      )
    parser.on( "data", ( data:string ) => wrapUp( data.trim() ) )
    port.on( "error", ( err ) => wrapUp( undefined, err ) )
    port.on( "open", () => {
      console.debug( `Port ${portPath} opened. Sending command: ${message}` )
      port.write( message, ( err: Error | null | undefined ) => err ? wrapUp( undefined, err ) : true )
    })
  })
}

