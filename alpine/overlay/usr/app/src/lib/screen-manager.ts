"use strict"

import { Region }      from "./region"
import { Renderer }    from "./renderer"
import { Framebuffer } from "./framebuffer"

export class ScreenManager {
    private rootRegion: Region
    private renderer: Renderer
    private framebuffer: Framebuffer

    constructor(rootRegion: Region, framebufferDevice: string = '/dev/fb0') {
        this.rootRegion = rootRegion
        this.renderer = new Renderer(rootRegion)
        this.framebuffer = new Framebuffer(framebufferDevice)
    }

    async initialize() {
        //console.debug('Initializing screen manager...')
        await this.renderer.init()
        this.framebuffer.clear()

        // Attach watchers to automatically render regions on content updates
        this.attachWatchers( this.rootRegion )

        //console.debug('Screen manager initialized.')
    }

    private attachWatchers(region: Region) {
        // Watch the region for content changes
        region.on('contentUpdated', () => this.renderRegion(region))

        // Recursively attach watchers to nested regions
        for (const nested of region.getNestedRegions()) {
            this.attachWatchers( nested )
        }
    }

    async renderRegion(region: Region) {
        //console.debug(`Rendering region: ${region.getName()}`)
        await this.renderer.renderRegion(region)

        const contentBuffer = Buffer.from(region.getContent(), 'utf-8') // Mock content buffer
        this.framebuffer.writeToFramebuffer(contentBuffer)
    }

    async renderAll() {
        //console.debug('Rendering all regions...')
        const traverseAndRender = async (region: Region) => {
            await this.renderRegion(region)
            for (const nested of region.getNestedRegions()) {
                await traverseAndRender(nested)
            }
        }
        await traverseAndRender(this.rootRegion)
    }
}