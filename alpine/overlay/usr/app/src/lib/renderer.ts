"use strict"

import puppeteer, { Browser, Page } from "puppeteer"
import { Region } from "./region"
import { IRegionBounds } from "./types/interfaces"

export class Renderer {
    private browser: Browser | null = null;
    private page: Page | null = null;
    private rootRegion: Region;

    constructor(rootRegion: Region) {
        this.rootRegion = rootRegion;
    }

    // Initialize the renderer with the root region's content
    async init() {
        const
            { width:bWidth, height:bHeight }:Omit<IRegionBounds, "left,top"> = this.rootRegion.getBounds(),
            width = bWidth > 0 ? Math.floor(bWidth) : 320,
            height = bHeight > 0 ? Math.floor(bHeight) : 480

        this.browser = await puppeteer.launch({
            args           : [ `--window-size=${width},${height}` ],
            headless       : true,
            defaultViewport: { width, height },
        });
        this.page = await this.browser.newPage();

        // Set content from the root region
        const content = this.rootRegion.getContent();
        await this.page.setContent(content, { waitUntil: 'load' });
    }

    async renderRegion(region: Region) {
        if ( !this.page ) { await this.init() }

        const content = region.getContent()
        const bounds = region.getBounds()

        await this.page.evaluate(
            ({ id, content, top, left, width, height }:{
                content:string,
                id    : string,
                top   : number,
                left  : number,
                width : number,
                height: number
            }):void => {
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