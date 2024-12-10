"use strict"

import puppeteer, { Browser, Page } from 'puppeteer'
import { Region } from './region';

export class Renderer {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private rootRegion: Region;

    constructor(rootRegion: Region) {
        this.rootRegion = rootRegion;
    }

    // Initialize the renderer with the root region's content
    async init() {
        const { width, height } = this.rootRegion.getBounds();
        this.browser = await puppeteer.launch({
            args           : [`--window-size=${width},${height}`],
            headless       : true,
            defaultViewport: {
                width : typeof width !== 'string'  ? width  : 0,
                height: typeof height !== 'string' ? height : 0
            },
        });
        this.page = await this.browser.newPage();

        // Set content from the root region
        const content = this.rootRegion.getContent();
        await this.page.setContent(content, { waitUntil: 'load' });
    }

    async renderRegion(region: Region) {
        if ( !this.page ) throw new Error( "Renderer not initialized." )

        const content = region.getContent()
        const bounds = region.getBounds()

        await this.page.evaluate(
            ({ id, content, top, left, width, height }) => {
                let element = document.getElementById( id as string )
                if (!element) {
                    element = document.createElement( "div" )
                    element.id = id as string;
                    document.body.appendChild(element);
                }
                element.innerHTML = content;
                Object.assign(element.style, {
                    position: "absolute",
                    left    : `${left}px`,
                    top     : `${top}px`,
                    width   : `${width}px`,
                    height  : `${height}px`,
                });
            },
            {
                content,
                id    : region.getName(),
                top   : bounds.top,
                left  : bounds.left,
                width : bounds.width,
                height: bounds.height,
            }
        );
    }

    async shutdown() {
        if ( this.browser ) await this.browser.close();
    }
}