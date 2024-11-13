"use strict"
import {
  IEVSEConnector,
  IEVSEConnectorOptions,
  IType1Connector,
  IType2Connector,
  IType3Connector,
  ICCSConnector,
  ICHAdeMOConnector,
  ITeslaConnector,
  IGBTConnector,
  EAvailability,
  EConnectorStatus,
  EConnectorType,
  EIsolationStatus,
  EChargingMode,
  ECommunicationProtocol,
  EGridStatus,
  EDemandResponseStatus
} from "./interfaces.ts"
import EventsObject from "../EventsObject"


export class EVSEConnector extends EventsObject implements IEVSEConnector {
  id                   : string | number;
  status               : EConnectorStatus       = EConnectorStatus.AVAILABLE;
  connectorType        : EConnectorType;
  maxVoltage           : number                 = 120; // V
  maxCurrent           : number                 = 32;  // A
  cableLength          : number                 = 0;   // cm
  isConnected          : boolean                = false;
  isCharging           : boolean                = false;
  powerOutput          : number                 = 0;
  isolationStatus      : EIsolationStatus       = EIsolationStatus.UNPLUGGED;
  vehicleSoc           : number                 = 0;
  targetSoc            : number                 = 80;
  chargingMode         : EChargingMode          = EChargingMode.DC;
  communicationProtocol: ECommunicationProtocol = ECommunicationProtocol.ISO_15118;
  energyPrice          : number                 = 0.15;
  gridStatus           : EGridStatus            = EGridStatus.NOMINAL;
  demandResponseStatus : EDemandResponseStatus  = EDemandResponseStatus.NONE;

  constructor({ id, connectorType, chargingMode, maxVoltage, maxCurrent, cableLength }:IEVSEConnectorOptions) {
    super()
    this.id = id;
    this.connectorType = connectorType
    this.maxVoltage = maxVoltage
    this.maxCurrent = maxCurrent
    this.cableLength = cableLength
    this.chargingMode = EChargingMode[ chargingMode ]
  }

  async connect() {
    this.isConnected
      ? console.log( `Connector[${ this.id }] already connected.` )
      : ( this.isConnected = true,
          this.isolationStatus = EIsolationStatus.PLUGGED,
          this.emit( EIsolationStatus.PLUGGED ),
          console.log( `${this.connectorType} vehicle connected.`));
  }

  async disconnect() {
    this.isConnected
      ? (this.isConnected = false,
         this.isolationStatus = EIsolationStatus.UNPLUGGED,
         this.isCharging = false,
         this.powerOutput = 0,
         console.log(`${this.connectorType} vehicle disconnected.`))
      : console.log('No vehicle connected.');
  }

  async startCharging() {
    if (!this.isConnected) {
      throw "No vehicle connected. Cannot start charging."
    }
    if (this.isCharging) {
      throw "Charging already in progress."
    }
    this.isCharging = true;
    this.powerOutput = await this.calculatePowerOutput();
    console.log(`Charging started in ${this.chargingMode} mode. Output: ${this.powerOutput} kW`);
  }

  async stopCharging() {
    this.isCharging
      ? (this.isCharging = false,
         this.powerOutput = 0,
         console.log('Charging stopped.'))
      : console.log('No charging in progress.');
  }

  // Calculate power output based on charging mode, grid, and demand response status
  async calculatePowerOutput() {
    const basePower = (this.maxVoltage * this.maxCurrent) / 1000; // kW
    return this.demandResponseStatus === EDemandResponseStatus.CONSTRAINED
      ? basePower * 0.5 // Reduce power by 50% during constrained DR events
      : this.gridStatus === EGridStatus.EMERGENCY
        ? 0 // Stop charging during grid emergencies
        : basePower;
  }

  // Update vehicle state of charge
  updateSoc(soc: number) {
    this.vehicleSoc = soc;
    console.log(`Vehicle state of charge updated to ${this.vehicleSoc}`);
  }

  // Adjust target state of charge for smart charging
  setTargetSoc(targetSoc: number) {
    this.targetSoc = targetSoc;
    console.log(`Target state of charge set to ${this.targetSoc}`);
  }

  // Set the energy price for OpenADR
  setEnergyPrice(price: number) {
    this.energyPrice = price;
    console.log(`Energy price updated to $${this.energyPrice} per kWh`);
  }

  // Update grid status for IEEE 2030.5
  updateGridStatus(status: EGridStatus) {
    this.gridStatus = status;
    console.log(`Grid status updated to ${this.gridStatus}`);
  }

  // Set demand response event status for OpenADR
  setDemandResponseStatus(status: EDemandResponseStatus) {
    this.demandResponseStatus = status;
    console.log(`Demand response status updated to ${this.demandResponseStatus}`);
  }

  getStatus() {
    return {
      connectorType: this.connectorType,
      maxVoltage: this.maxVoltage,
      maxCurrent: this.maxCurrent,
      cableLength: this.cableLength,
      isConnected: this.isConnected,
      isCharging: this.isCharging,
      powerOutput: this.powerOutput,
      isolationStatus: this.isolationStatus,
      vehicleSoc: this.vehicleSoc,
      targetSoc: this.targetSoc,
      chargingMode: this.chargingMode,
      communicationProtocol: this.communicationProtocol,
      energyPrice: this.energyPrice,
      gridStatus: this.gridStatus,
      demandResponseStatus: this.demandResponseStatus,
    };
  }
  updateStatus( newStatus: EConnectorStatus ){
    if ( !Object.values( EConnectorStatus ).some( type => type === newStatus ) ){
      throw new TypeError(`New availablility[${newStatus}] not accpeted by connector[${this.id}]`) 
    }
    this.status = newStatus
  }
}

export class Type1Connector extends EVSEConnector implements IType1Connector {
  declare connectorType: EConnectorType.TYPE1;
  declare communicationProtocol: ECommunicationProtocol.SAE_J1772;
}
export class Type2Connector extends EVSEConnector implements IType2Connector{
  declare connectorType: EConnectorType.TYPE2;
  declare communicationProtocol: ECommunicationProtocol.IEC_62196_2;
}
export class Type3Connector extends EVSEConnector implements IType3Connector{
  declare connectorType: EConnectorType.TYPE3;
  declare chargingMode: EChargingMode.DC;
  declare communicationProtocol: ECommunicationProtocol.TYPE3;
}
export class CCSConnector extends EVSEConnector implements ICCSConnector{
  declare connectorType: EConnectorType.CCS1 | EConnectorType.CCS2;
  declare chargingMode: EChargingMode.DC;
  declare communicationProtocol: ECommunicationProtocol.ISO_15118;
}
export class CHAdeMOConnector extends EVSEConnector implements ICHAdeMOConnector{
  declare connectorType: EConnectorType.CHADEMO;
  declare chargingMode: EChargingMode.DC;
  declare communicationProtocol: ECommunicationProtocol.CHADEMO;
}
export class TeslaConnector extends EVSEConnector implements ITeslaConnector{
  declare connectorType: EConnectorType.TESLA;
  declare communicationProtocol: ECommunicationProtocol.TESLA;
}
export class GBTConnector extends EVSEConnector implements IGBTConnector{
  declare connectorType: EConnectorType.GB_T;
  declare communicationProtocol: ECommunicationProtocol.GB_T;
}