"use strict"

import { readFileSync, writeFileSync } from "fs"
import { TPowerMeter }                 from "./lib/Hardware/powermeter/types"
import { TRelay }                      from "./lib/Hardware/relay/types"
import { TWiFiModule }                 from "./lib/Hardware/communication/lan/wifi/types"
import { TNFCModule }                  from "./lib/Hardware/communication/nfc/types"
import { TRFIDModule }                 from "./lib/Hardware/communication/rfid/types"
import { TBLEModule }                  from "./lib/Hardware/communication/ble/types"
import { TZigBeeModule  }              from "./lib/Hardware/communication/zigbee/types"

import { EVSE } from "./lib/EVSE"
import { EVSEConnector } from "./lib/EVSEConnector"
import { EConnectorType, EChargingMode } from "./lib/EVSEConnector/interfaces"
import { OCPPTransport, FTPTransport, SFTPTransport } from "./lib/Transport"
import { ETransportType, EEvent, EReconnectStrategy, EWebSocketProtocol } from "./lib/Transport/interfaces"

import { readDeviceTree } from "./lib/Hardware"

const deviceTree = readDeviceTree( "/proc/device-tree" );
writeFileSync( "device-tree.json", JSON.stringify( deviceTree, null, 2 ) );


interface ParseDeviceResponse {
  PowerMeter : TPowerMeter,
  PlugRelay  : TRelay,
  EVSERelay  : TRelay,
  WiFi      ?: TWiFiModule,
  NFC       ?: TNFCModule,
  RFID      ?: TRFIDModule, 
  BLE       ?: TBLEModule,
  ZigBee    ?: TZigBeeModule
}

function parseDevices( devices ): ParseDeviceResponse {
  return { PowerMeter: {
    serialNumber: "230710280012",
    totalizer: 0,
    voltage: 0,
    deciWatts: 0,
    deciWattHours: 0
  } , PlugRelay, EVSERelay } 
}
const { PowerMeter, PlugRelay, EVSERelay } = parseDevices( deviceTree )


const logLevel = 'log';
const emptyFn = () => {}
switch( logLevel ){
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
    logs: [{ name:"TestLog", path:"/usr/src/app/src/test.log" }]
  },
  hardwareModules: {
    powerMeter: new PowerMeter(),
    connectorRelays: [new ConnectorRelay( 1 ), new ConnectorRelay( 2 ) ],

  },
  transport   : [
    // new SFTPTransport({
    //   host  : "eu-central-1.sftpcloud.io",
    //   port  : 22,
    //   user  : "31df361ca3b64065aeca0b4ee9bcc638",
    //   pass  : "cjQG3jqVMz2x3mF83DhCzuOwecyaXenj"
    // }),
    new FTPTransport({
      host  : "eu-central-1.sftpcloud.io",
      port  : 21,
      user  : "247d21666ad84822a3c104d218707806",
      pass  : "dV3Nl2HJR7revEy0OJhXLsbeSonBZ5Cv"
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