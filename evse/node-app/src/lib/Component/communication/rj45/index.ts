"use strict"

import CommunicationModule from ".."
import { TRJ45Module } from "./types"

export class RFIDModule extends CommunicationModule implements TRJ45Module {
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}