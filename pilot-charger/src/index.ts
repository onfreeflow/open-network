"use strict"
import { readFileSync } from "fs"
import EVSE_1_6J from "./lib/EVSE/EVSE_1_6J"

( async () => {
  await new EVSE_1_6J({
    id: 0,
    serialNumber: "1o1-2024-1-1",
    connectors:[
      {
        id       : 1,
        type     : "Type1",
        powerType: "DC"
      },
      {
        id       : 2,
        type     : "CCS",
        powerType: "DC"
      }
    ],
    centralSystemService: {
      host    : process.env.OCPP_HOST,
      port    : process.env.OCPP_PORT,
      path    : process.env.OCPP_PATH,
      protocol: process.env.PROTOCOL,
      tls     : {
        enabled: true,
        cert   : [ readFileSync( process.env.NODE_EXTRA_CA_CERTS, "utf-8" ) ] 
      }
    }
  })
})()