"use strict"

import Communication from "../"
import { TRFID} from "./types"


export class RFID extends Communication implements TRFID{
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}