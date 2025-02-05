"use strict"

import Communication from "../"
import { TNFC} from "./types"


export class NFC extends Communication implements TNFC{
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}