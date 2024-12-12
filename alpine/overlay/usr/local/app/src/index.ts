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
  filePath          = join( __dirname, "./public/regions"),
  bottomLeftRegion  = new Region({ name: "bottom-left", content: "Bottom Left", width: BOTTOM_LEFT_WIDTH }),
  bottomRightRegion = new Region({ name: "bottom-right", path: filePath, left: BOTTOM_LEFT_WIDTH, width: BOTTOM_RIGHT_WIDTH }),
  bottomRegion      = new Region({
    name         : "bottom",
    path         : filePath,
    top          : 320,
    height       : BOTTOM_HEIGHT,
    nestedRegions: [ bottomLeftRegion, bottomRightRegion ]
  }),
  topRegion         = new Region({ name: "top", path: filePath, height: TOP_HEIGHT, }),
  rootRegion        = new Region({
    name         : "index",
    path         : filePath,
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
