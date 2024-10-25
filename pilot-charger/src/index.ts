"use strict"

import { readFileSync } from "fs"
import { EVSE } from "./lib/EVSE"
import { EVSEConnector } from "./lib/EVSEConnector"
import { EConnectorType, EChargingMode } from "./lib/EVSEConnector/interfaces"
import { OCPPTransport, FTPTransport, SFTPTransport } from "./lib/Transport"
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
    new SFTPTransport({
      host  : "eu-central-1.sftpcloud.io",
      port  : 22,
      user  : "bab957a3412542ff94ca28a9a802a91f",
      pass  : "BhL0u7zh3OFNaEVs7Bc4aLAlQyyTFaQH"
    }),
    // new FTPTransport({
    //   host  : "eu-central-1.sftpcloud.io",
    //   port  : 21,
    //   user  : "b9bf1b899f8a4cc5ab20c2b970c80dfc",
    //   pass  : "j9TceJjHyyvzRPYeG3uF1Illw6BtSzwK"
    // }),
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