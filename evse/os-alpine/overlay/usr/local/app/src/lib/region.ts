"use stirct"

import fs from "fs"
import { join } from "path"
import EventEmitter from 'events'
import { IRegionBounds } from "./types/interfaces"
import { Renderer } from "./renderer"

export interface IRegionBounds { top: number; left: number; width: number; height: number }

export class Region extends EventEmitter {
    private name         : string | null = null;
    private path         : string;
    private bounds       : IRegionBounds;
    private content      : string;
    private parentRegion : Region | null = null;
    private nestedRegions: Region[] = [];
    private renderer     : Renderer;

    constructor(
        config  : {
            name         ?: string; // Name of the file (without extension)
            path         ?: string; // Path to the directory containing the file
            top          ?: number; // Optional top position (defaults to 0)
            left         ?: number; // Optional left position (defaults to 0)
            width        ?: string | number; // Optional width (defaults to 100%)
            height       ?: string | number; // Optional height (defaults to 100%)
            content      ?: string; // Initial content (overrides file loading)
            nestedRegions?: Region[];
        },
        renderer?: Renderer // Optional renderer
    ) {
        super()
        // Validate configuration
        if (!config.content && !config.name) {
            throw new Error("Region must have either 'content' or 'name' set.");
        }

        if (config.content && config.path) {
            throw new Error("Region cannot have both 'content' and 'path' set.");
        }

        this.name = config.name || null;
        this.bounds = {
            top   : config.top ?? 0, // Default to 0
            left  : config.left ?? 0, // Default to 0
            width : config.width || 320, // Default to 320px
            height: config.height || 480, // Default to 480px
        };
        this.content = config.content || ''; // Initialize content
        this.renderer = renderer || Region.defaultRenderer(this);

        // Validate unique name in the connected tree
        if (this.name) {
            if (this.collectAllRegionNames().has(this.name)) {
                throw new Error(`Region name "${this.name}" is not unique in the connected tree.`);
            }
        }

        // Initialize content from file if not explicitly provided
        if (!config.content && config.name) {
            this.initializeContentFromFile(
                join( this.getEffectivePath(config.path), `${config.name}.html` )
            )
        }

        // Add nested regions
        if (config.nestedRegions) {
            this.addNestedRegions(config.nestedRegions);
        }
        
        this.emit( "init", this )
    }

    // Default renderer based on the Region instance
    static defaultRenderer = (region: Region): Renderer => {
        //console.debug('Using default Renderer for root region.');
        const renderer = new Renderer( region )
        renderer.init()
        return renderer
    };

    // Collect all names in the connected region tree
    private collectAllRegionNames(): Set<string> {
        const names = new Set<string>();
    
        //console.debug(`Collecting names for region: ${this.name || 'Unnamed Region'}`);
    
        // Collect names from ancestors
        let parent = this.parentRegion;
        while (parent) {
            if (parent.name) {
                //console.debug(`Found ancestor region: ${parent.name}`);
                names.add(parent.name);
            }
            parent = parent.parentRegion;
        }
    
        // Collect names from siblings (regions with the same parent, excluding self)
        if (this.parentRegion) {
            for (const sibling of this.parentRegion.getNestedRegions()) {
                if (sibling !== this && sibling.name) {
                    //console.debug(`Found sibling region: ${sibling.name}`);
                    names.add(sibling.name);
    
                    // Collect names from sibling's descendants (cousins)
                    const collectDescendants = (region: Region) => {
                        for (const nested of region.getNestedRegions()) {
                            if (nested.name) {
                                //console.debug(`Found cousin region: ${nested.name}`);
                                names.add(nested.name);
                                collectDescendants(nested);
                            }
                        }
                    };
                    collectDescendants(sibling);
                }
            }
        }
    
        // Collect names from descendants (nested regions under the current region)
        const collectDescendantNames = (region: Region) => {
            for (const nested of region.getNestedRegions()) {
                if (nested !== this && nested.name) {
                    //console.debug(`Found descendant region: ${nested.name}`);
                    names.add(nested.name);
                    collectDescendantNames(nested);
                }
            }
        };
        collectDescendantNames(this);
    
        return names;
    }

    // Get effective path (inherit from parent if not explicitly set)
    private getEffectivePath = (path?: string): string => {
        if (path) {
            this.path = path
        } else if (!this.path && this.parentRegion) {
            this.path = this.parentRegion.getEffectivePath()
        }
        if (!this.path) {
            this.path = join( __dirname, './' )
        }
        return this.path
    }

    // Load content from file
    private async initializeContentFromFile( filePath: string ):Promise<void> {
        try {
            this.content = fs.readFileSync( filePath, "utf-8" );
            await this.renderer.renderRegion(this);
        } catch ( error: any ) {
            console.error(`Failed to load content for region from "${filePath}": ${error.message}`);
        }
    }

    addNestedRegion = ( nestedRegion: Region ):void => {
        nestedRegion.setParentRegion( this ),
        this.nestedRegions.push( nestedRegion ),
        this.emit( "nestedRegionAdded", nestedRegion )
    }

    // Add nested regions and set up propagation
    addNestedRegions = (nestedRegions: Region[]):void =>
        nestedRegions.forEach( this.addNestedRegion )

    // Set content and notify watchers
    setContent = (newContent: string) => {
        if (this.content !== newContent) {
            this.content = newContent;
            this.emit( "contentUpdated", this ); // Emit event when content changes
        }
    };

    // Set parent region
    private setParentRegion = ( parent: Region ) => {
        this.parentRegion = parent;

        // Inherit parent's renderer if not explicitly set
        if ( !this.renderer ) {
            this.renderer = parent.getRenderer();
        }
        this.emit("parentSet", this);
    };


    // Get current content
    getContent = () => this.content;
    // Get the renderer, defaulting to the parent's renderer if available
    getRenderer = (): Renderer => this.renderer || this.parentRegion?.getRenderer();

    // Recursive getters for regions
    getBounds        = ():IRegionBounds => {
        if ( !(typeof this.bounds.width === 'number' && this.bounds.width > 0) )
            throw new Error("Invalid Width")

        if ( !(typeof this.bounds.height === 'number' && this.bounds.height > 0) )
            throw new Error("Invalid Height")
        return {
            top: this.bounds.top || 0,
            left: this.bounds.left || 0,
            width:  Math.floor( this.bounds.width ),
            height: Math.floor( this.bounds.height ),
        }
    }
    getName          = ():string | null => this.name;
    getNestedRegions = ():Region[]      => this.nestedRegions;
    getParentRegion  = ():Region | null => this.parentRegion;

    findRegionByName = (name: string): Region | null => 
        ( this.name === name )
        ? this
        : this.nestedRegions
            .map((nested) => nested.findRegionByName(name))
            .find((result) => result !== null) || null
}