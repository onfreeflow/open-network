"use stirct"

import { join } from 'path'
import { ScreenManager } from './lib/screen-manager'
import { Region } from './lib/region'
// Constant
const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 480
const BOTTOM_LEFT_WIDTH = SCREEN_WIDTH / 2
const BOTTOM_RIGHT_WIDTH = SCREEN_WIDTH / 2
const TOP_HEIGHT = SCREEN_HEIGHT * .68
const BOTTOM_HEIGHT = SCREEN_HEIGHT * .32

// Define regions
const
  bottomLeftRegion = new Region({ name: "bottom-left", width: BOTTOM_LEFT_WIDTH }),
  bottomRightRegion = new Region({ name: "bottom-right", left: BOTTOM_LEFT_WIDTH, width: BOTTOM_RIGHT_WIDTH }),
  bottomRegion = new Region({
    name         : "bottom",
    top          : 320,
    height       : BOTTOM_HEIGHT,
    nestedRegions: [ bottomLeftRegion, bottomRightRegion ]
  }),
  topRegion = new Region({ name: "top", height: TOP_HEIGHT, }),
  rootRegion = new Region({
    name         : "index",
    path         : join( __dirname, "./public/regions"),
    width        : SCREEN_WIDTH,
    height       : SCREEN_HEIGHT,
    nestedRegions: [ topRegion, bottomRegion ]
  }),
  frameBufferDevice = "/dev/fb0",
  screenManager = new ScreenManager( rootRegion, frameBufferDevice )

// Start rendering
;(async () => {
  await screenManager.initialize()
  await screenManager.renderAll()

  console.log("Application started!")

  // Simulate content updates
  setTimeout(() => {
    topRegion.setContent(`<h1>Updated Clock: ${new Date().toLocaleTimeString()}</h1>`  );
  }, 5000)

  setTimeout(() => {
    bottomLeftRegion.setContent( `<p>Updated Left: ${(Math.random() * 10).toFixed(2)}</p>` )
    bottomRightRegion.setContent( `<p>Updated Right: ${(Math.random() * 10).toFixed(2)}</p>` )
  }, 10000)
})()
