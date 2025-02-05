"use strict"

import CommunicationModule from ".."
import { TZigBeeModule } from "./types"

export class ZigBeeModule extends CommunicationModule implements TZigBeeModule {
    constructor({serialNumber}:{serialNumber:string|number|symbol}){
        super({serialNumber})
    }
}
export default ZigBeeModule