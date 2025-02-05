"use strict"

import CommunicationModule from ".."
import { TRFIDModule } from "./types"


export class RFIDModule extends CommunicationModule implements TRFIDModule {
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}