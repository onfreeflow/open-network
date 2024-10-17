"use strict"
import { readFileSync } from "fs"
import { EVSE } from "./lib/EVSE"
import { EVSEConnector } from "./lib/EVSEConnector"
import { EConnectorType, EChargingMode } from "./lib/EVSEConnector/interfaces"
import { Transport } from "./lib/Transport/Transport"
import { ETransportType, EEvent } from "./lib/Transport/interfaces"
import { EventsQueue } from "./lib/Queue"
import { EEventsQueueDBType } from "./lib/Queue/interfaces"

const connectorOpts = {
  chargingMode: EChargingMode.DC,
  maxCurrent  : 32,
  maxVoltage  : 120,
  cableLength : 100
}
new EVSE({
  id          : 0,
  serialNumber: "1o1-2024-1-1",
  connectors  : [
    new EVSEConnector({ ...connectorOpts, id: 1, connectorType: EConnectorType.TYPE1 }),
    new EVSEConnector({ ...connectorOpts, id: 2, connectorType: EConnectorType.CCS1 })
  ],
  transport   : [
    new Transport({
      centralSystemService: {
        type    : ETransportType.OCPP1_6J,
        host    : process.env.OCPP_HOST,
        port    : process.env.OCPP_PORT,
        path    : process.env.OCPP_PATH,
        protocol: process.env.PROTOCOL,
        tls     : {
          enabled: true,
          cert   : [
            readFileSync( "/usr/local/share/ca-certificates/nginx.crt", "utf-8" )
          ]  
        }
      },
      events: Object.values( EEvent )
    })
  ],
  eventsQueue : new EventsQueue({ dbType: EEventsQueueDBType.MEMORY, events: Object.values( EEvent ) })
})