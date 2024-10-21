"use strict"

import { readFileSync } from "fs"
import { EVSE } from "./lib/EVSE"
import { EVSEConnector } from "./lib/EVSEConnector"
import { EConnectorType, EChargingMode } from "./lib/EVSEConnector/interfaces"
import { OCPPTransport, FTPTransport } from "./lib/Transport"
import { ETransportType, EEvent, EReconnectStrategy, EWebSocketProtocol } from "./lib/Transport/interfaces"

const logLevel = 'log';
const emptyFn = () => {}
switch( logLevel){
  case 'error': console.warn = emptyFn
  case 'warn' : console.debug = emptyFn
  case 'debug': console.info = emptyFn
  case 'info' : console.log = emptyFn
  case 'log':
  default: break;
} 

const connectorOpts = {
    chargingMode: EChargingMode.DC,
    maxCurrent  : 32,
    maxVoltage  : 120,
    cableLength : 100
  },
  serialNumber = "1o1-2024-1-1"
new EVSE({
  id          : 0,
  serialNumber,
  connectors  : [
    new EVSEConnector({ ...connectorOpts, id: 1, connectorType: EConnectorType.TYPE1 }),
    new EVSEConnector({ ...connectorOpts, id: 2, connectorType: EConnectorType.CCS1 })
  ],
  os:{
    logs: [{name:"TestLog",path:"/usr/src/app/src/test.log"}]
  },
  transport   : [
    new FTPTransport({
      host  : "eu-central-1.sftpcloud.io",
      port  : 22,
      user  : "3f28c080114e44dca15fe8fe840b3487",
      pass  : "2QzkqHAADe5YFkacikyrxQplDKgrtwrR",
      secure: true
    }),
    new OCPPTransport({
      centralSystemService:{
        type    : ETransportType.OCPP1_6J,
        host    : "steve",
        port    : 8180,
        path    : `/steve/websocket/CentralSystemService/${serialNumber}`,
        protocol: EWebSocketProtocol.WS,
      },
      events: Object.values( EEvent )
    }),
    // new OCPPTransport({
    //   centralSystemService: {
    //     type    : ETransportType.OCPP1_6J,
    //     host    : process.env.OCPP_HOST,
    //     port    : process.env.OCPP_PORT,
    //     path    : `${process.env.OCPP_PATH}/${serialNumber}`,
    //     protocol: process.env.PROTOCOL,
    //     tls     : {
    //       enabled: true,
    //       cert   : [
    //         readFileSync( "/usr/local/share/ca-certificates/nginx.crt", "utf-8" )
    //       ]  
    //     },
    //     reconnect:{
    //       strategy: EReconnectStrategy.LINEAR,
    //       timeout: 1000,
    //       attempts: 10
    //     }
    //   },
    //   events: Object.values( EEvent )
    // })
  ]
})