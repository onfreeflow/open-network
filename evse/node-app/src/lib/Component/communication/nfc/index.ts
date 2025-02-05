"use strict"

import CommunicationModule from ".."
import { TNFCModule } from "./types"


export class NFCModule extends CommunicationModule implements TNFCModule {
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}