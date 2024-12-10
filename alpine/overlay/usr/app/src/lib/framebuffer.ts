import * as fs from "fs"

export class Framebuffer {
    private devicePath: string
    constructor( devicePath: string = "/dev/fb0" ) {
        this.devicePath = devicePath
    }
    writeToFramebuffer( data: Buffer ) {
        try {
            const fd = fs.openSync( this.devicePath, "w" )
            fs.writeSync( fd, data )
            fs.closeSync( fd )
        } catch (error: any) {
            console.error( `Failed to write to framebuffer: ${error.message}` )
        }
    }
    clear() {
        this.writeToFramebuffer( Buffer.alloc( 800 * 480 * 4, 0 ) )
    }
}