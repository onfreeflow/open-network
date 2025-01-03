"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/log.ts
var logLevel = "log";
var emptyFn = () => {
};
switch (logLevel) {
  case "error":
    console.warn = emptyFn;
  case "warn":
    console.debug = emptyFn;
  case "debug":
    console.info = emptyFn;
  case "info":
    console.log = emptyFn;
  case "log":
  default:
    break;
}

// src/index.ts
var import_fs5 = require("fs");

// src/lib/Hardware/powermeter/index.ts
var PowerMeterModule = class {
  serialNumber = "";
  totalizer = 0;
  voltage = 0;
  deciWatts = 0;
  deciWattHours = 0;
  activelyMetering = false;
  displays = [];
  indicators = [];
  meterPowerConsumption = {
    voltageLineConsumption: 0,
    currentLineConsumption: 0,
    voltageWorkRange: 0
  };
  path;
  baudRate;
  constructor(configuration) {
    Object.entries(configuration).forEach(([key, val]) => this[key] = val);
  }
};

// src/lib/Hardware/relay/index.ts
var Relay = class {
  serialNumber;
  type;
  switchType;
  contacts = [];
  position;
  coilVoltage;
  coilCurrentType;
  loadCurrent;
  loadCurrentType;
  loadVoltage;
  constructor(configuration) {
    Object.entries(configuration).forEach(([key, value]) => this[key] = value);
  }
};
var PowerRelay = class extends Relay {
  type = "POWER" /* POWER */;
  constructor(configuration) {
    super(configuration);
  }
};
var OverCurrentRelay = class extends Relay {
  type = "OVERLOAD_PROTECTION" /* OVERLOAD_PROTECTION */;
  constructor(configuration) {
    super(configuration);
  }
};

// src/lib/Hardware/led/index.ts
function ColoredLED(color, resistance, pins = 2) {
  return function(constructor) {
    constructor.setColor(color)(constructor).resistance = resistance(constructor).pins = pins;
  };
}
var LED = class {
  id;
  name;
  description;
  pins = 2;
  resistance = 0;
  #color;
  #pattern = "SOLID" /* SOLID */;
  #active = false;
  constructor(id, name, description) {
    this.id = id;
    this.name = name || "";
    this.description = description || "";
  }
  setColor(color) {
    this.#color = color;
  }
  isActive() {
    return this.#active;
  }
  get solid() {
    return this.#pattern = "SOLID" /* SOLID */, this;
  }
  get blinkSlow() {
    return this.#pattern = "BLINK_SLOW" /* BLINK_SLOW */, this;
  }
  get blinkFast() {
    return this.#pattern = "BLINK_FAST" /* BLINK_FAST */, this;
  }
  on() {
    this.#active = true;
  }
  off() {
    this.#active = false;
  }
};
var RedLED = @ColoredLED("RED" /* RED */, 1.8) class extends LED {
};
var GreenLED = @ColoredLED("GREEN" /* GREEN */, 2.5) class extends LED {
};
var BlueLED = @ColoredLED("BLUE" /* BLUE */, 3.5) class extends LED {
};
var PurpleLED = @ColoredLED("PURPLE" /* PURPLE */, 3) class extends LED {
};
var WhiteLED = @ColoredLED("WHITE" /* WHITE */, 3.8, 3) class extends LED {
};
var MultiColorLED = @ColoredLED("MULTICOLOR" /* MULTI */, 4, 3) class extends LED {
  get red() {
    return this.setColor("RED" /* RED */), this;
  }
  get blue() {
    return this.setColor("BLUE" /* BLUE */), this;
  }
  get green() {
    return this.setColor("GREEN" /* GREEN */), this;
  }
  get yellow() {
    return this.setColor("YELLOW" /* YELLOW */), this;
  }
};
function ColoredLEDStrip(color, resistance, pins = 4) {
  return function(constructor) {
    constructor.color = color(constructor).resistance = resistance(constructor).pins = pins;
  };
}
var LEDStrip = class extends LED {
  pins = 4;
};
var RedLEDStrip = @ColoredLEDStrip("RED" /* RED */, 4) class extends LEDStrip {
};
var GreenLEDStrip = @ColoredLEDStrip("GREEN" /* GREEN */, 4) class extends LEDStrip {
};
var YellowLEDStrip = @ColoredLEDStrip("YELLOW" /* YELLOW */, 4) class extends LEDStrip {
};
var MultiColorLEDStrip = @ColoredLEDStrip("MULTICOLOR" /* MULTI */, 4) class extends MultiColorLED {
};

// package.json
var package_default = {
  name: "life.ho2.pilot-charger",
  version: "1.0.0",
  description: "HO2 LIFE - Pilot Charger",
  author: "eric@ho2.life",
  license: "ISC",
  scripts: {
    test: "mocha --exit --require ./node_modules/babel-core/register",
    "build-legacy": "npx babel --config-file ./babel.json --out-dir ./build --source-maps --verbose --extensions '.js,.ts' ./src",
    prebuild: "rm -rf ./dist",
    build: "esbuild ./src/index.ts --bundle --outfile=dist/bundle.js --platform=node --sourcemap",
    prestart: "npm run build && npx pm2 flush",
    start: "npx pm2 start --time --no-daemon ./dist/bundle.js -i 1"
  },
  engines: {
    node: ">=22.9.0",
    npm: ">=10.8.3"
  },
  dependencies: {
    uuid: "^10.0.0"
  },
  devDependencies: {
    "@babel/cli": "^7.24.8",
    "@babel/core": "^7.25.2",
    "@babel/eslint-parser": "^7.25.1",
    "@babel/plugin-proposal-do-expressions": "^7.24.7",
    "@babel/plugin-proposal-export-default-from": "^7.24.7",
    "@babel/plugin-proposal-function-bind": "^7.24.7",
    "@babel/plugin-proposal-partial-application": "^7.24.7",
    "@babel/plugin-proposal-pipeline-operator": "^7.24.7",
    "@babel/plugin-proposal-throw-expressions": "^7.24.7",
    "@babel/plugin-transform-class-properties": "^7.25.4",
    "@babel/plugin-transform-export-namespace-from": "^7.24.7",
    "@babel/plugin-transform-nullish-coalescing-operator": "^7.24.7",
    "@babel/plugin-transform-object-rest-spread": "^7.24.7",
    "@babel/plugin-transform-optional-chaining": "^7.24.8",
    "@babel/plugin-transform-private-methods": "^7.25.4",
    "@babel/plugin-transform-runtime": "^7.25.4",
    "@babel/plugin-transform-typescript": "^7.25.7",
    "@babel/preset-env": "^7.26.0",
    "@babel/preset-typescript": "^7.26.0",
    "@babel/register": "^7.24.6",
    "@types/node": "^22.10.0",
    "babel-loader": "^9.1.3",
    "babel-plugin-module-resolver": "^5.0.2",
    "babel-plugin-tcomb": "^0.4.0",
    "babel-preset-minify": "^0.5.2",
    chai: "^5.1.1",
    "chai-as-promised": "^8.0.0",
    esbuild: "^0.24.0",
    eslint: "^9.9.1",
    "eslint-webpack-plugin": "^4.2.0",
    "exports-loader": "^5.0.0",
    mocha: "^10.7.3",
    rimraf: "^6.0.1",
    sinon: "^18.0.0",
    tcomb: "^3.2.29",
    "terser-webpack-plugin": "^5.3.10",
    webpack: "^5.94.0",
    "webpack-cli": "^5.1.4",
    "webpack-node-externals": "^3.0.0"
  }
};

// src/lib/EVSE/index.ts
var import_fs3 = require("fs");
var import_perf_hooks = require("perf_hooks");

// src/lib/Logger.ts
var Logger = class {
  constructor(...args) {
    if (args.length === 0) {
      return console;
    }
  }
};

// src/lib/EVSE/enums.ts
var EPerfMarksFTPUpload = /* @__PURE__ */ ((EPerfMarksFTPUpload2) => {
  EPerfMarksFTPUpload2["FTP_UPLOAD_CONNECTING"] = "FTP_UPLOAD_CONNECTING";
  EPerfMarksFTPUpload2["START_FTP_UPLOAD"] = "START_FTP_UPLOAD";
  EPerfMarksFTPUpload2["COMPLETE_FTP_UPLOAD"] = "COMPLETE_FTP_UPLOAD";
  return EPerfMarksFTPUpload2;
})(EPerfMarksFTPUpload || {});
var EPerfMeasuresFTPUpload = /* @__PURE__ */ ((EPerfMeasuresFTPUpload2) => {
  EPerfMeasuresFTPUpload2["FTP_TIME_TO_CONNECT"] = "FTP_TIME_TO_CONNECT";
  EPerfMeasuresFTPUpload2["FTP_TIME_TO_UPLOAD"] = "FTP_TIME_TO_UPLOAD";
  return EPerfMeasuresFTPUpload2;
})(EPerfMeasuresFTPUpload || {});
var EAvailability = /* @__PURE__ */ ((EAvailability3) => {
  EAvailability3["AVAILABLE"] = "Available";
  EAvailability3["UNAVAILABLE"] = "Unavailable";
  EAvailability3["OPERATIVE"] = "Operative";
  EAvailability3["INOPERATIVE"] = "Inoperative";
  return EAvailability3;
})(EAvailability || {});

// src/lib/Queue/interfaces.ts
var EEventsQueueDBType = /* @__PURE__ */ ((EEventsQueueDBType3) => {
  EEventsQueueDBType3["SQLITE3"] = "sqlite3";
  EEventsQueueDBType3["LEVELDB"] = "leveldb";
  EEventsQueueDBType3["ROCKSDB"] = "rocksdb";
  EEventsQueueDBType3["REDIS"] = "redis";
  EEventsQueueDBType3["MEMORY"] = "memory";
  return EEventsQueueDBType3;
})(EEventsQueueDBType || {});

// src/lib/Queue/index.ts
var import_events = require("events");

// src/lib/Queue/Database.ts
var Database = class {
  //implements IDatabase {
  db = null;
  dbType;
  configuration = { host: "localhost", port: 5432, path: "/" };
  supportedDBTypes = Object.values(EEventsQueueDBType);
  constructor(dbType, configuration) {
    if (!this.supportedDBTypes.includes(dbType)) {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
    this.dbType = dbType;
    this.configuration = configuration;
  }
  async initialize() {
    this.db = await this.#createClient();
    if (this.dbType === "sqlite3") {
      await new Promise((resolve, reject) => {
        if (this.db) {
          this.db.run(
            "CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT)",
            (err) => {
              if (err) reject(err);
              else resolve(true);
            }
          );
        }
      });
    }
  }
  async #createClient() {
    switch (this.dbType) {
      case "sqlite3":
        try {
          const sqlite3 = await import("sqlite3");
          return new sqlite3.Database(this.configuration.path || ":memory:");
        } catch (e) {
          console.warn(e);
        }
      case "leveldb":
        try {
          const level = await import("level");
          return level.default(this.configuration.path || "./leveldb");
        } catch (e) {
          console.warn(e);
        }
      case "rocksdb":
        try {
          const rocksdb = await import("rocksdb");
          return rocksdb(this.configuration.path || "./rocksdb");
        } catch (e) {
          console.warn(e);
        }
      case "redis":
        try {
          const redis = await import("redis");
          const client = redis.createClient({
            url: `redis://${this.configuration.host || "localhost"}:${this.configuration.port || 6379}`
            // Optional auth properties can be added here
          });
          await client.connect();
          return client;
        } catch (e) {
          console.warn(e);
        }
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }
  async insert(event) {
    const eventStr = JSON.stringify(event.message);
    switch (this.dbType) {
      case "sqlite3":
        await new Promise((resolve, reject) => {
          this.db.run("INSERT INTO queue (id, event) VALUES (?)", [event.id, eventStr], (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        });
        break;
      case "leveldb":
      case "rocksdb":
        await this.db.put(event.id, eventStr);
        break;
      case "redis":
        await this.db.set(event.id, eventStr);
        break;
    }
  }
  async delete(event) {
    switch (this.dbType) {
      case "sqlite3":
        await new Promise((resolve, reject) => {
          this.db.run("DELETE FROM queue WHERE id = ?", [event.id], (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        });
        break;
      case "leveldb":
      case "rocksdb":
      case "redis":
        await this.db.del(event.id);
        break;
    }
  }
  async fetchAll() {
    const events = [];
    switch (this.dbType) {
      case "sqlite3":
        return new Promise((resolve, reject) => {
          this.db.all("SELECT id, event FROM queue ORDER BY id ASC", [], (err, rows) => {
            if (err) reject(err);
            resolve(rows.map((row) => {
              const event = JSON.parse(row);
              events.push(event);
            }));
          });
        });
      case "leveldb":
      case "rocksdb":
        for await (const [_, value] of this.db.iterator()) {
          const event = JSON.parse(value);
          events.push(event);
        }
        return events;
      case "redis":
        const keys = await this.db.keys("*");
        for (const key of keys) {
          const value = await this.db.get(key);
          const event = JSON.parse(value);
          events.push(event);
        }
        return events;
    }
  }
};

// src/lib/Queue/index.ts
var EventsQueue = class _EventsQueue {
  queue = [];
  eventStream;
  db;
  emitter = new import_events.EventEmitter();
  events = [];
  constructor({ dbType = "memory" /* MEMORY */, host, path, port, events }) {
    this.events = events;
    this.eventStream = this._eventGenerator();
    if (!(this instanceof _EventsQueue)) {
      return new _EventsQueue(arguments[0]);
    }
    return (async () => {
      if (dbType === "memory" /* MEMORY */) {
        console.warn("Queue will not persist, dbType[memory]");
      } else {
        if (!host) {
          throw new Error(`Missing {host} on intilizer`);
        } else if (!port) {
          throw new Error(`Missing {port} on intilizer`);
        } else if (!path) {
          throw new Error(`Missing {path} on intilizer`);
        }
        const db = await new Database(dbType, { path, host, port });
        if (!(db instanceof Database)) {
          console.warn("Invalid database instance provided.");
        } else {
          this.db = db;
          try {
            await this.db.initialize();
          } catch (e) {
            console.error(e);
          }
        }
      }
      return this;
    })();
  }
  async hydrate() {
    try {
      if (this.db) {
        this.queue.push(...await this.db.fetchAll());
      }
    } catch (e) {
      console.error(e);
    }
  }
  *_eventGenerator() {
    while (true) {
      yield this.queue.length === 0 ? null : this.queue.shift();
    }
  }
  async enqueue(event) {
    try {
      if (this.db) {
        await this.db.insert(event);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.queue.push(event);
      return true;
    }
  }
  async dequeue() {
    const event = this.eventStream.next().value;
    try {
      event && this.db ? await this.db.delete(event) : null;
    } catch (e) {
      console.error(e);
    }
    return event;
  }
  get length() {
    return this.queue.length;
  }
  on(eventName, callBack) {
    this.emitter.on(eventName, callBack);
  }
  off(eventName, callBack) {
    this.emitter.off(eventName, callBack);
  }
  async enqueueEvent(method, payload) {
    const event = JSON.stringify({ method, payload });
    try {
      await this.enqueue(event);
      this.emitter.emit("EVENT_QUEUED", event);
    } catch (e) {
      console.error(e);
    }
  }
  async dequeueEvent() {
    const event = JSON.parse(await this.dequeue());
    try {
      this.emitter.emit("EVENT_DEQUEUED", event);
    } catch (e) {
      console.error(e);
    } finally {
      return event;
    }
  }
};

// src/lib/EVSEConnector/enums.ts
var EConnectorStatus = /* @__PURE__ */ ((EConnectorStatus2) => {
  EConnectorStatus2["AVAILABLE"] = "Available";
  EConnectorStatus2["UNAVAILABLE"] = "Unavailable";
  EConnectorStatus2["OCCUPIED"] = "Occupied";
  EConnectorStatus2["RESERVED"] = "Reserved";
  EConnectorStatus2["FAULTED"] = "Faulted";
  EConnectorStatus2["CHARGING"] = "Charging";
  EConnectorStatus2["SUSPENDED_EV"] = "SuspendedEV";
  EConnectorStatus2["SUSPENDED_EVSE"] = "SuspendedEVSE";
  EConnectorStatus2["FINISHING"] = "Finishing";
  return EConnectorStatus2;
})(EConnectorStatus || {});

// src/lib/EventsObject.ts
var import_events2 = require("events");
var EventsObject = class extends import_events2.EventEmitter {
  once(...args) {
    (0, import_events2.once)(this, ...args);
    return this;
  }
};

// src/lib/EVSEConnector/index.ts
var EVSEConnector = class extends EventsObject {
  id;
  status = "Available" /* AVAILABLE */;
  connectorType;
  maxVoltage = 120;
  // V
  maxCurrent = 32;
  // A
  cableLength = 0;
  // cm
  isConnected = false;
  isCharging = false;
  powerOutput = 0;
  isolationStatus = "unplugged" /* UNPLUGGED */;
  vehicleSoc = 0;
  targetSoc = 80;
  chargingMode = "DC" /* DC */;
  communicationProtocol = "ISO 15118" /* ISO_15118 */;
  energyPrice = 0.15;
  gridStatus = "nominal" /* NOMINAL */;
  demandResponseStatus = "none" /* NONE */;
  powerMeters;
  relays;
  constructor(configuration) {
    super();
    Object.entries(configuration).forEach(
      ([key, value]) => this[key] = value
    );
  }
  async connect() {
    this.isConnected ? console.log(`Connector[${typeof this.id === "symbol" ? this.id.description : this.id}] already connected.`) : (this.isConnected = true, this.isolationStatus = "plugged" /* PLUGGED */, this.emit("plugged" /* PLUGGED */), console.log(`${this.connectorType} vehicle connected.`));
  }
  async disconnect() {
    this.isConnected ? (this.isConnected = false, this.isolationStatus = "unplugged" /* UNPLUGGED */, this.isCharging = false, this.powerOutput = 0, console.log(`${this.connectorType} vehicle disconnected.`)) : console.log("No vehicle connected.");
  }
  async startCharging() {
    if (!this.isConnected) {
      throw "No vehicle connected. Cannot start charging.";
    }
    if (this.isCharging) {
      throw "Charging already in progress.";
    }
    this.isCharging = true;
    this.powerOutput = await this.calculatePowerOutput();
    console.log(`Charging started in ${this.chargingMode} mode. Output: ${this.powerOutput} kW`);
  }
  async stopCharging() {
    this.isCharging ? (this.isCharging = false, this.powerOutput = 0, console.log("Charging stopped.")) : console.log("No charging in progress.");
  }
  // Calculate power output based on charging mode, grid, and demand response status
  async calculatePowerOutput() {
    const basePower = this.maxVoltage * this.maxCurrent / 1e3;
    return this.demandResponseStatus === "constrained" /* CONSTRAINED */ ? basePower * 0.5 : this.gridStatus === "emergency" /* EMERGENCY */ ? 0 : basePower;
  }
  // Update vehicle state of charge
  updateSoc(soc) {
    this.vehicleSoc = soc;
    console.log(`Vehicle state of charge updated to ${this.vehicleSoc}`);
  }
  // Adjust target state of charge for smart charging
  setTargetSoc(targetSoc) {
    this.targetSoc = targetSoc;
    console.log(`Target state of charge set to ${this.targetSoc}`);
  }
  // Set the energy price for OpenADR
  setEnergyPrice(price) {
    this.energyPrice = price;
    console.log(`Energy price updated to $${this.energyPrice} per kWh`);
  }
  // Update grid status for IEEE 2030.5
  updateGridStatus(status) {
    this.gridStatus = status;
    console.log(`Grid status updated to ${this.gridStatus}`);
  }
  // Set demand response event status for OpenADR
  setDemandResponseStatus(status) {
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
      demandResponseStatus: this.demandResponseStatus
    };
  }
  updateStatus(newStatus) {
    if (!Object.values(EConnectorStatus).some((type) => type === newStatus)) {
      throw new TypeError(`New availablility[${newStatus}] not accpeted by connector[${this.id}]`);
    }
    this.status = newStatus;
  }
};

// src/lib/Transport/OCPPTransport.ts
var import_crypto2 = require("crypto");
var import_tls = require("tls");
var import_net = require("net");

// src/lib/Transport/enums.ts
var EEvent = /* @__PURE__ */ ((EEvent2) => {
  EEvent2["BOOT_NOTIFICATION"] = "BootNotification";
  EEvent2["STATUS_NOTIFICATION"] = "StatusNotification";
  EEvent2["TRANSACTION_START"] = "TransactionStart";
  EEvent2["TRANSACTION_STOP"] = "TransactionStop";
  EEvent2["GET_DIAGNOSTICS"] = "GetDiagnostics";
  EEvent2["CHANGE_AVAILABILITY"] = "ChangeAvailability";
  EEvent2["REMOTE_START_TRANSACTION"] = "RemoteStartTransaction";
  EEvent2["REMOTE_STOP_TRANSACTION"] = "RemoteStopTransaction";
  return EEvent2;
})(EEvent || {});

// src/lib/Transport/Envelope.ts
var import_crypto = require("crypto");

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm-node/rng.js
var import_node_crypto = __toESM(require("node:crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_node_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/native.js
var import_node_crypto2 = __toESM(require("node:crypto"));
var native_default = {
  randomUUID: import_node_crypto2.default.randomUUID
};

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/lib/utils.ts
var ErrorMalformedMessage = class extends Error {
  constructor(cause = "") {
    super(`Message Malformed: `, { cause });
  }
};

// src/lib/Transport/Envelope.ts
var createWebSocketFrame = (message, opcode = 1) => {
  const payload = Buffer.from(message, "utf-8");
  const mask = (0, import_crypto.randomBytes)(4);
  const maskedPayload = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) {
    maskedPayload[i] = payload[i] ^ mask[i % 4];
  }
  let frameHeader;
  if (payload.length <= 125) {
    frameHeader = Buffer.alloc(2 + 4);
    frameHeader[1] = payload.length | 128;
  } else if (payload.length <= 65535) {
    frameHeader = Buffer.alloc(4 + 4);
    frameHeader[1] = 126 | 128;
    frameHeader.writeUInt16BE(payload.length, 2);
  } else {
    frameHeader = Buffer.alloc(10 + 4);
    frameHeader[1] = 127 | 128;
    frameHeader.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  frameHeader[0] = opcode | 128;
  mask.copy(frameHeader, frameHeader.length - 4);
  return Buffer.concat([frameHeader, maskedPayload]);
};
var parseWebSocketFrame = (frame) => {
  const firstByte = frame[0];
  const fin = (firstByte & 128) !== 0;
  const opcode = firstByte & 15;
  const secondByte = frame[1];
  const isMasked = (secondByte & 128) !== 0;
  let payloadLength = secondByte & 127;
  let offset = 2;
  if (payloadLength === 126) {
    payloadLength = frame.readUInt16BE(2);
    offset += 2;
  } else if (payloadLength === 127) {
    payloadLength = Number(frame.readBigUInt64BE(2));
    offset += 8;
  }
  let mask;
  if (isMasked) {
    mask = frame.slice(offset, offset + 4);
    offset += 4;
  }
  const payload = Buffer.alloc(payloadLength);
  for (let i = 0; i < payloadLength; i++) {
    payload[i] = frame[offset + i] ^ (isMasked ? mask[i % 4] : 0);
  }
  const message = payload.toString("utf-8");
  switch (opcode) {
    case 0:
      console.log("Continuation frame:", message);
      break;
    case 1:
      return message;
    case 2:
      console.log("Binary frame");
      break;
    case 8:
      console.log("Close frame");
      break;
    case 9:
      console.log("Ping frame");
      break;
    case 10:
      console.log("Pong frame");
      break;
    default:
      throw new ErrorMalformedMessage(`Unknown opcode: ${opcode}`);
  }
};
var formatOCPPMessage = (method, payload = {}, messageId = Math.random().toString(36).substring(2, 15)) => {
  const messageArr = [
    2,
    messageId,
    method,
    payload
  ];
  try {
    if (typeof messageArr !== "object" && !(messageArr instanceof Array)) throw new ErrorMalformedMessage("must be of type 'object' and instance of Array. OCPP expects a list []");
    if (messageArr.length !== 4) throw new ErrorMalformedMessage("message must be 4 items: [messageType, messageId, action, payload]");
    if (typeof messageArr[0] !== "number") throw new ErrorMalformedMessage("message[0] must be of type 'number'");
    if (typeof messageArr[1] !== "string") throw new ErrorMalformedMessage("message[1] must be of type 'string'");
    if (typeof messageArr[2] !== "string") throw new ErrorMalformedMessage("message[2] must be of type 'string'");
  } catch (e) {
    console.error(e.message, e.cause);
  }
  return createWebSocketFrame(JSON.stringify(messageArr));
};
var formatOCPPResponse = (messageId, payload = {}) => {
  const messageArr = [
    3,
    messageId,
    payload
  ];
  try {
    if (typeof messageArr !== "object" && !(messageArr instanceof Array)) throw new ErrorMalformedMessage("must be of type 'object' and instance of Array. OCPP expects a list []");
    if (messageArr.length !== 3) throw new ErrorMalformedMessage("response must be 3 items: [messageType, messageId, payload]");
    if (typeof messageArr[0] !== "number") throw new ErrorMalformedMessage("message[0] must be of type 'number'");
    if (typeof messageArr[1] !== "string") throw new ErrorMalformedMessage("message[1] must be of type 'string'");
  } catch (e) {
    console.error(e.message, e.cause);
  }
  return createWebSocketFrame(JSON.stringify(messageArr));
};
var CallEnvelope = class {
  id = v4_default();
  text;
  message;
  constructor(method, payload = { timestamp: (/* @__PURE__ */ new Date()).toISOString() }) {
    this.text = `[${method}]: ${JSON.stringify(payload)}`;
    this.message = formatOCPPMessage(method, payload);
  }
};
var ResponseEnvelope = class {
  id = v4_default();
  text;
  message;
  constructor(messageId, payload = { timestamp: (/* @__PURE__ */ new Date()).toISOString() }) {
    this.id = messageId;
    this.text = `[${messageId}]: ${JSON.stringify(payload)}`;
    this.message = formatOCPPResponse(messageId, payload);
  }
};

// src/lib/Transport/OCPPTransport.ts
var OCPPTransport = class extends EventsObject {
  events = Object.values(EEvent);
  centralSystemService = {
    type: "ocpp1.6" /* OCPP1_6J */,
    host: "localhost",
    port: 80,
    path: "/",
    protocol: "ws" /* WS */,
    reconnect: {
      strategy: "linear" /* LINEAR */,
      timeout: 3e3,
      attempts: 10
    }
  };
  #link;
  #linkError;
  #reconnectCount = 0;
  constructor(options) {
    super();
    this.events = options.events ? options.events : this.events;
    this.centralSystemService = {
      ...options.centralSystemService,
      tls: {
        ...this.centralSystemService.tls,
        ...options.centralSystemService.tls
      },
      ftp: {
        ...this.centralSystemService.ftp,
        ...options.centralSystemService.ftp
      },
      reconnect: {
        ...this.centralSystemService.reconnect,
        ...options.centralSystemService.reconnect
      }
    };
  }
  async connect() {
    const { host, port, path, protocol, tls } = this.centralSystemService;
    if (!host || !port || !path) {
      throw new SyntaxError("Cannot connect without options.centralSystemService[host|port|path]");
    }
    return new Promise((resolve, reject) => {
      const connectCallback = async () => {
        console.log(`${tls?.enabled ? "\u{1F512} Securely" : ""} connected to server`);
        this.#link.write(
          [
            `GET ${path} HTTP/1.1`,
            `Host: ${host}:${port} `,
            `Upgrade: websocket`,
            `Connection: Upgrade`,
            `Sec-WebSocket-Key: ${(0, import_crypto2.randomBytes)(16).toString("base64")}`,
            `Sec-WebSocket-Version: 13`,
            `Sec-Websocket-Protocol: ${this.centralSystemService.type}`
          ].map((header) => Buffer.from(header, "ascii").toString("ascii")).join("\r\n") + "\r\n\r\n"
        );
        this.#reconnectCount = 0;
        this.#linkError = void 0;
        resolve();
      };
      console.log(`ws://${host}:${port}${path}`);
      const connectOptions = {
        host,
        port
      }, tlsConnectOptions = {
        ...connectOptions,
        protocol,
        ca: tls?.ca,
        rejectUnauthorized: true,
        keepAlive: true
      };
      this.#link = !tls?.enabled ? (0, import_net.connect)(connectOptions, connectCallback) : (0, import_tls.connect)(tlsConnectOptions, connectCallback);
      this.#link.on("data", (data) => {
        let event;
        const frameData = parseWebSocketFrame(data);
        try {
          event = JSON.parse(frameData);
        } catch (e) {
        }
        this.emit("OCPP_EVENT", event);
      });
      this.#link.on("end", (...args) => {
        console.info("END", ...args);
      });
      this.#link.on("close", async (...args) => {
        console.info("close", ...args);
        if (this.#linkError?.message?.includes("connect EHOSTUNREACH")) {
          this.#link = void 0;
          this.reconnect();
          return;
        } else {
          setTimeout(this.reconnect, this.centralSystemService?.reconnect?.timeout || 3e4);
        }
        reject();
      });
      this.#link.on("error", (err) => {
        console.error(err);
        this.#linkError = err;
      });
    });
  }
  async disconnect() {
  }
  async reconnect() {
    if (!this.centralSystemService.reconnect) {
      throw new SyntaxError("Reconnects not defined");
    }
    if (this.#reconnectCount > this.centralSystemService.reconnect.attempts) {
      throw new Error("Max Reconnects");
    }
    this.#reconnectCount = this.#reconnectCount + 1;
    console.log(`Reconnect Attempt with strategy[${this.centralSystemService.reconnect.strategy}]: ${this.#reconnectCount} of ${this.centralSystemService.reconnect.attempts}`);
    await this.connect();
  }
  resetRetries() {
  }
  isConnected() {
    return !!this.#link;
  }
  async sendMessage(method, payload) {
    if (!this.#link) {
      throw `Cannot send message[ method: ${method}, payload: ${JSON.stringify(payload)}], not connected to Central System Service`;
    }
    const { message } = new CallEnvelope(method, payload);
    await this.#link.write(message);
  }
  async sendResponse(messageId, payload) {
    if (!this.#link) {
      throw `Cannot send response[ Id: ${messageId}, payload: ${JSON.stringify(payload)}], not connected to Central System Service`;
    }
    const { message } = new ResponseEnvelope(messageId, payload);
    await this.#link.write(message);
  }
};

// src/lib/Transport/FTPTransport.ts
var import_net2 = __toESM(require("net"));
var import_fs = require("fs");
var parsePasvResponse = (pasvResponse) => {
  const match = pasvResponse.match(/(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)/);
  if (!match) {
    throw new Error("FTPTransport#parsePasvResponse: Invalid PASV response format.");
  }
  const ip = `${match[1]}.${match[2]}.${match[3]}.${match[4]}`;
  const port = parseInt(match[5]) * 256 + parseInt(match[6]);
  return [ip, port];
};
var FTPTransport = class {
  #connectionConfiguration = {
    host: "localhost",
    port: 21,
    user: "",
    pass: "",
    secure: false,
    pasv: true
  };
  #connection;
  #connected = false;
  uri = "ftp://";
  constructor({
    host = "localhost",
    port = 21,
    user = "",
    pass = "",
    secure = false,
    pasv = true
  }) {
    this.#connectionConfiguration = {
      host,
      port,
      user,
      pass,
      secure,
      pasv
    };
    if (user !== "" && pass === "") throw new SyntaxError(`FTPTransport::constructor:IFTPTransportOptions - Has [user] Missing[pass]`);
    if (pass !== "" && user === "") throw new SyntaxError(`FTPTransport::constructor:IFTPTransportOptions - Has [pass] Missing[user]`);
    const credentialStr = user !== "" ? `${user}:${pass}@` : "";
    const hostStr = port ? `${host}:${port}` : host;
    this.uri = `${!secure ? "ftp" : "sftp"}://${credentialStr}${hostStr}/`;
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.#connection = import_net2.default.createConnection({ host: this.#connectionConfiguration.host, port: this.#connectionConfiguration.port }, async () => {
        await new Promise(() => (this.#connection.once("data", () => {
          this.#connected = true;
        }), resolve(true)));
      }).on("error", reject);
    });
  }
  #sendCommand = (command, expectedCode) => new Promise((resolve, reject) => {
    this.#connection.write(`${command}\r
`);
    this.#connection.on("data", (data) => {
      const response = data.toString();
      if (response.startsWith("5") || response.startsWith("4")) {
        return reject(new Error(`FTP error[${command}]: ${response}`));
      }
      const code = response.slice(0, 3);
      if (expectedCode && code !== expectedCode) {
        console.debug(`Waiting for expected response code: ${expectedCode}, but got: ${code}`);
        if (!this.#connectionConfiguration.secure && code === "SSH") {
          this.end();
          return reject(new Error("SSH Response"));
        }
        return;
      }
      resolve(response);
    });
  });
  async uploadFile(localPath, remotePath) {
    if (!localPath || !remotePath) {
      throw new Error(`FTPTransport::uploadFile: Missing local[${localPath}] or remote[${remotePath}] path.`);
    }
    try {
      await this.#sendCommand(`USER ${this.#connectionConfiguration.user}`, "331");
      await this.#sendCommand(`PASS ${this.#connectionConfiguration.pass}`, "230");
      await this.#sendCommand(`TYPE I`, "200");
      let pasvResponse;
      if (this.#connectionConfiguration.pasv) {
        pasvResponse = await this.#sendCommand("PASV", "227");
      }
      if (typeof pasvResponse !== "string") {
        throw new Error("FTPTransport::uploadFile: PASV response is not a string.");
      }
      const [host, port] = parsePasvResponse(pasvResponse);
      const dataConnection = import_net2.default.createConnection({ host, port });
      await this.#sendCommand(`STOR ${remotePath}`, "150");
      await new Promise((resolve, reject) => {
        const fileStream = (0, import_fs.createReadStream)(localPath);
        fileStream.on("error", reject);
        fileStream.on("end", async () => {
          fileStream.close();
          await this.#sendCommand("QUIT", "221");
          resolve(true);
        });
        fileStream.pipe(dataConnection, { end: true });
      });
      return { path: remotePath };
    } catch (err) {
      console.error(new Error(`Error during FTP upload: ${err.message}`));
    }
  }
  end() {
    this.#connection.end();
    this.#connected = false;
  }
};

// src/lib/Transport/SFTPTransport.ts
var import_events3 = require("events");
var import_crypto3 = require("crypto");
var import_net3 = require("net");
var import_fs2 = require("fs");
var emitter = new import_events3.EventEmitter();
var SFTPTransport = class {
  #connectionConfiguration = {
    host: "localhost",
    port: 22,
    user: "",
    pass: ""
  };
  #connection;
  #dh;
  #sharedSecret;
  #encryptionKey;
  #cipher;
  #decipher;
  uri = "sftp://";
  /** 
  * @param {object} config - Configuration for SFTP connection.
  * @param {string} config.host - The SFTP server host (default: localhost)
  * @param {string} config.port - The SFTP server port (default: 22).
  * @param {string} config.username - The SFTP username.
  * @param {string} config.password - The SFTP password.
  */
  constructor({
    host = "localhost",
    port = 22,
    user = "",
    pass = ""
  }) {
    this.#connectionConfiguration = {
      host,
      port,
      user,
      pass
    };
    if (user !== "" && pass === "") throw new SyntaxError(`SFTPTransport::constructor:IFTPTransportOptions - Has [user] Missing[pass]`);
    if (pass !== "" && user === "") throw new SyntaxError(`SFTPTransport::constructor:IFTPTransportOptions - Has [pass] Missing[user]`);
    const credentialStr = user !== "" ? `${user}:${pass}@` : "";
    const hostStr = port ? `${host}:${port}` : host;
    this.uri = `sftp://${credentialStr}${hostStr}/`;
  }
  async connect() {
    this.#connection = new import_net3.Socket();
    await new Promise((resolve, reject) => {
      this.#connection.connect(this.#connectionConfiguration.port, this.#connectionConfiguration.host, resolve);
      this.#connection.on("error", reject);
    });
    this.#connection.write("SSH-2.0-GenericClient_1.0\r\n");
    const serverProtocol = await new Promise((resolve, reject) => {
      let protocolBuffer = Buffer.alloc(0);
      const timeout = setTimeout(() => {
        this.#connection.off("data", onData);
        reject(new Error("Timeout waiting for full server protocol response"));
      }, 3e3);
      const onData = (data) => {
        protocolBuffer = Buffer.concat([protocolBuffer, data]);
        const protocolString = protocolBuffer.toString();
        if (protocolString.includes("curve25519") || protocolString.includes("ecdh-sha2") || protocolString.includes("diffie-hellman")) {
          clearTimeout(timeout);
          this.#connection.off("data", onData);
          resolve(protocolString);
        }
      };
      this.#connection.on("data", onData);
      this.#connection.on("error", (error) => {
        clearTimeout(timeout);
        this.#connection.off("data", onData);
        reject(error);
      });
    });
    console.log("Server Protocol:", serverProtocol);
    const supportedKexAlgorithms = serverProtocol.match(/curve25519|ecdh-sha2-nistp\d+|diffie-hellman-group\d+-sha\d+/g) || [];
    let clientKex;
    let clientPublicKey;
    if (supportedKexAlgorithms.includes("ecdh-sha2-nistp256")) {
      console.debug("Using ecdh-sha2-nistp256 for key exchange");
      clientKex = (0, import_crypto3.createECDH)("prime256v1");
      clientPublicKey = clientKex.generateKeys();
    } else if (supportedKexAlgorithms.includes("ecdh-sha2-nistp384")) {
      console.debug("Using ecdh-sha2-nistp384 for key exchange");
      clientKex = (0, import_crypto3.createECDH)("secp384r1");
      clientPublicKey = clientKex.generateKeys();
    } else if (supportedKexAlgorithms.includes("ecdh-sha2-nistp521")) {
      console.debug("Using ecdh-sha2-nistp521 for key exchange");
      clientKex = (0, import_crypto3.createECDH)("secp521r1");
      clientPublicKey = clientKex.generateKeys();
    } else if (supportedKexAlgorithms.includes("diffie-hellman-group14-sha256")) {
      console.debug("Using diffie-hellman-group14-sha256 for key exchange");
      clientKex = (0, import_crypto3.createDiffieHellman)(2048);
      clientPublicKey = clientKex.generateKeys();
    } else if (supportedKexAlgorithms.includes("diffie-hellman-group1-sha1")) {
      console.debug("Using diffie-hellman-group1-sha1 for key exchange");
      clientKex = (0, import_crypto3.createDiffieHellman)(1024);
      clientPublicKey = clientKex.generateKeys();
    } else {
      throw new Error("No compatible key exchange algorithm found");
    }
    const serverPublicKey = await new Promise((resolve, reject) => {
      console.log("Promise Started");
      let buffer = Buffer.alloc(0);
      let retryCount = 0;
      const maxRetries = 5;
      const timeout = setTimeout(() => {
        this.#connection.off("data", onData);
        reject(new Error("Timeout waiting for server public key"));
      }, 3e4);
      const onData = (key) => {
        buffer = Buffer.concat([buffer, key]);
        if (buffer.length > 0) {
          clearTimeout(timeout);
          this.#connection.off("data", onData);
          resolve(buffer);
        }
      };
      const sendClientKey = () => {
        if (retryCount < maxRetries) {
          console.log(`Sending client public key to server (Attempt ${retryCount + 1}/${maxRetries})...`);
          this.#connection.write(clientPublicKey);
          retryCount += 1;
        } else {
          clearInterval(retryInterval);
          reject(new Error("Failed to receive server public key after multiple attempts"));
        }
      };
      const retryInterval = setInterval(sendClientKey, 5e3);
      sendClientKey();
      this.#connection.on("data", onData);
      this.#connection.on("error", (error) => {
        clearTimeout(timeout);
        this.#connection.off("data", onData);
        reject(error);
      });
    });
    console.log("SERVER PUBLIC KEY:", serverPublicKey.toString());
    this.#sharedSecret = clientKex.computeSecret(serverPublicKey);
    this.#encryptionKey = (0, import_crypto3.createHash)("sha256").update(this.#sharedSecret).digest();
    this.#cipher = (0, import_crypto3.createCipheriv)("aes-256-ctr", this.#encryptionKey, Buffer.alloc(16, 0));
    this.#decipher = (0, import_crypto3.createDecipheriv)("aes-256-ctr", this.#encryptionKey, Buffer.alloc(16, 0));
    this.#connection.on("data", (encryptedData) => {
      const decryptedBuffer = this.#decipher.update(encryptedData, "hex", "utf8") + this.#decipher.final("utf8");
      const type = decryptedBuffer.readUInt8(4);
      switch (type) {
        case 102: {
          const requestId = decryptedBuffer.readUInt32BE(5);
          const handleLength = decryptedBuffer.readUInt32BE(9);
          const handle = decryptedBuffer.slice(13, 13 + handleLength).toString("utf8");
          console.log(`Request[${requestId}]BUFFER TO STRING: `, decryptedBuffer.toString());
          return emitter.emit("fileHandle", handle);
        }
        case 101: {
          return this.#handleStatusResponse(decryptedBuffer);
        }
        default:
          console.error("Unknown packet type:", type);
      }
    });
    this.#authenticate();
    this.#openSubsystem();
  }
  /**
   * Uploads a file via SFTP using the system's sftp command.
   * @param {string} localPath - The path to the local file.
   * @param {string} remotePath - The destination path on the SFTP server.
   * @returns {Promise<{path:string}|void>}
   */
  async uploadFile(localPath, remotePath) {
    this.#init();
    this.#openForWrite(remotePath);
    const [fileHandle] = await (0, import_events3.once)(emitter, "fileHandle");
    this.#writeToFile(fileHandle, 0, (0, import_fs2.readFileSync)(localPath));
    this.#closeWrite(fileHandle);
  }
  #writeEncrypted(data) {
    if (!this.#sharedSecret) throw new Error("SFTPTransport#writeEncrypted: missing [sharedSecret]");
    if (!this.#encryptionKey) throw new Error("SFTPTransport#writeEncrypted: missing [encryptionKey]");
    if (!this.#cipher) throw new Error("SFTPTransport#writeEncrypted: missing [cipher]");
    if (!this.#decipher) throw new Error("SFTPTransport#writeEncrypted: missing [decipher]");
    this.#connection.write(this.#cipher.update(data, "utf8", "hex") + this.#cipher.final("hex"), "hex");
  }
  #authenticate() {
    this.#writeEncrypted(
      JSON.stringify({ type: "USERAUTH_REQUEST", username: this.#connectionConfiguration.user, password: this.#connectionConfiguration.pass, method: "password", service: "ssh-connection" })
    );
  }
  #openSubsystem() {
    const channelRequestBuffer = Buffer.alloc(25);
    channelRequestBuffer.writeUInt32BE(21, 0);
    channelRequestBuffer.writeUInt8(98, 4);
    channelRequestBuffer.write("sftp", 5, "utf8");
    this.#writeEncrypted(channelRequestBuffer);
  }
  //-------------
  #init() {
    const buff = Buffer.alloc(9);
    buff.writeUInt32BE(5, 0);
    buff.writeUInt8(1, 4);
    buff.writeUInt32BE(3, 5);
    this.#writeEncrypted(buff);
  }
  #openForWrite(filename) {
    const filenameBuffer = Buffer.from(filename, "utf8");
    const packetLength = 9 + filenameBuffer.length + 4;
    const buffer = Buffer.alloc(packetLength);
    buffer.writeUInt32BE(packetLength - 4, 0);
    buffer.writeUInt8(3, 4);
    buffer.writeUInt32BE(1, 5);
    buffer.writeUInt32BE(2, 9);
    filenameBuffer.copy(buffer, 13);
    this.#writeEncrypted(buffer);
  }
  #writeToFile(fileHandle, offset, data) {
    const fileHandleBuffer = Buffer.from(fileHandle, "utf8");
    const dataBuffer = Buffer.from(data, "utf8");
    const packetLength = 17 + fileHandleBuffer.length + dataBuffer.length;
    const buffer = Buffer.alloc(packetLength);
    buffer.writeUInt32BE(packetLength - 4, 0);
    buffer.writeUInt8(6, 4);
    buffer.writeUInt32BE(2, 5);
    fileHandleBuffer.copy(buffer, 9);
    buffer.writeBigUInt64BE(BigInt(offset), 9 + fileHandleBuffer.length);
    dataBuffer.copy(buffer, 17 + fileHandleBuffer.length);
    this.#writeEncrypted(buffer);
  }
  #closeWrite(fileHandle) {
    const fileHandleBuffer = Buffer.from(fileHandle, "utf8");
    const packetLength = 9 + fileHandleBuffer.length;
    const buffer = Buffer.alloc(packetLength);
    buffer.writeUInt32BE(packetLength - 4, 0);
    buffer.writeUInt8(4, 4);
    buffer.writeUInt32BE(3, 5);
    fileHandleBuffer.copy(buffer, 9);
    this.#writeEncrypted(buffer);
  }
  #handleStatusResponse(buffer) {
    const requestId = buffer.readUInt32BE(5);
    const statusCode = buffer.readUInt32BE(9);
    if (statusCode === 0) {
      console.log(`Request ${requestId} completed successfully.`);
    } else {
      const errorMessageLength = buffer.readUInt32BE(13);
      const errorMessage = buffer.slice(17, 17 + errorMessageLength).toString("utf8");
      console.error(`Error on request ${requestId}: ${errorMessage} (Code: ${statusCode})`);
    }
  }
  #closeSubSytem() {
    this.#writeEncrypted(JSON.stringify({ type: "CHANNEL_CLOSE", service: "sftp" }));
  }
  #disconnect(reasonCode = 11, description = "Client Disconnect") {
    const descriptionBuffer = Buffer.from(description, "utf8");
    const descriptionLength = descriptionBuffer.length;
    const languageTagBuffer = Buffer.from("", "utf8");
    const languageTagLength = languageTagBuffer.length;
    const packetLength = 1 + 4 + 4 + descriptionLength + 4 + languageTagLength;
    const buffer = Buffer.alloc(4 + packetLength);
    buffer.writeUInt32BE(packetLength, 0);
    buffer.writeUInt8(1, 4);
    buffer.writeUInt32BE(reasonCode, 5);
    buffer.writeUInt32BE(descriptionLength, 9);
    descriptionBuffer.copy(buffer, 13);
    buffer.writeUInt32BE(languageTagLength, 13 + descriptionLength);
    languageTagBuffer.copy(buffer, 17 + descriptionLength);
    this.#writeEncrypted(buffer);
  }
  end() {
    this.#closeSubSytem();
    this.#disconnect();
    this.#connection.end();
  }
};

// src/lib/EVSE/index.ts
var logger = new Logger(
  /*{out:"./logs/ocpp_log.log"}*/
);
var validateOptions = (options) => {
  switch (true) {
    case (!options.id && typeof options.id !== "number"):
      throw SyntaxError("EVSEBase Constructor: Options argument is missing required property(id)");
    case !options.serialNumber:
      throw SyntaxError("EVSEBase Constructor: Options argument is missing required property(serialNumber)");
    case options.connectors.length < 1:
      logger.warn("Will not distribute power, no connectors registered");
    default:
      break;
  }
};
var EVSE = class _EVSE {
  availability = "Available" /* AVAILABLE */;
  connectors = [];
  voltage = 240 /* AC_LEVEL_2_SINGLE_PHASE */;
  current = 32 /* AC_LEVEL_2 */;
  powerType = "Split-phase AC" /* SPLIT_PHASE_AC */;
  meterValue = 0;
  id;
  vendorId;
  model;
  serialNumber;
  lastHeartbeat;
  location;
  maxPower;
  transport = [];
  eventsQueue = {
    queue: null,
    dbType: "memory" /* MEMORY */,
    host: "",
    port: 0
  };
  configuration = {
    allowOfflineTxForUnknownId: true,
    authorizationCacheEnabled: false,
    clockAlignedDataInterval: 0,
    connectionTimeOut: 100,
    // ms
    getConfigurationMaxKeys: 128,
    heartbeatInterval: 3e5,
    // ms
    localAuthorizeOffline: true,
    localPreAuthorize: false,
    meterValuesAlignedData: 0,
    meterValueSampleInterval: 3e3,
    //ms
    numberOfConnectors: 2,
    resetRetries: 10,
    stopTransactionOnEVSideDisconnect: true,
    stopTransactionOnInvalidId: true
  };
  os = {
    firmware: {
      version: package_default.version,
      downloadInterval: 300,
      // Download interval in seconds
      downloadRetries: 10
      // Number of retries
    },
    logs: [
      //{ name: "OCPP_LOG", path: "./ocpp.log" }
    ],
    diagnostics: {
      status: "Never" /* NEVER */,
      timestamp: ""
    },
    temporaryDirectory: "/tmp"
  };
  manufacturer = {
    vendor: "",
    model: "",
    chargeRate: "W" /* W */,
    autoReset: true,
    energyMeter: {
      type: "Revenue Grade" /* REVENUE_GRADE */,
      serialNumber: "",
      currentValue: 0
    },
    overheatProtection: false,
    networkMode: "WiFi" /* WIFI */,
    userInterfaceEnabled: true,
    voltageLimit: null,
    currentLimit: null
  };
  hardwareModules = {
    powerMeters: [],
    evseRelays: [],
    connectorRelays: [],
    overloadProtectionRelays: [],
    hmis: {
      indicators: { power: void 0, active: void 0, inactive: void 0 }
    },
    communications: {
      serial: [],
      ble: [],
      rfid: [],
      nfc: [],
      lora: [],
      wifi: [],
      rj45: [],
      cellular: []
    }
  };
  #ocppTransports;
  #ftpTransports;
  //#commsTransport: 
  //#serialTransports: SerialTransport[]
  //#wanTransports: WANTransport[]
  constructor(options) {
    validateOptions(options);
    this.id = options.id;
    this.serialNumber = options.serialNumber;
    this.connectors = options.connectors.filter((connector) => connector instanceof EVSEConnector) || [];
    this.#ocppTransports = typeof options.transport === "object" ? options.transport.filter((transport) => transport instanceof OCPPTransport) : options.transport instanceof OCPPTransport ? [options.transport] : [];
    this.#ftpTransports = typeof options.transport === "object" ? options.transport.filter((transport) => transport instanceof FTPTransport || transport instanceof SFTPTransport) : options.transport instanceof FTPTransport ? [options.transport] : [];
    this.configuration = { ...this.configuration, ...options.configuration };
    this.eventsQueue = { ...this.eventsQueue, ...options.eventsQueue };
    this.os = { ...this.os, ...options.os };
    this.manufacturer = { ...this.manufacturer, ...options.manufacturer };
    this.hardwareModules = { ...this.hardwareModules, ...options.hardwareModules };
    if (!(this instanceof _EVSE)) {
      return new _EVSE(options);
    }
    return (async () => {
      try {
        await this.#setupEventsQueue();
        this.#startUp();
        await this.#connectToCentralSystem();
      } catch (warn) {
        console.warn(warn);
      }
      return this;
    })();
  }
  async emit(method, payload) {
    let recieved = false;
    try {
      for (const transport of this.#ocppTransports) {
        if (!transport.isConnected()) continue;
        try {
          await transport.sendMessage(method, payload);
          recieved = true;
        } catch (e) {
          console.error(e);
        }
      }
      if (recieved === false) throw "No available transport connection";
    } catch (e) {
      if (this.eventsQueue.queue instanceof EventsQueue)
        this.eventsQueue.queue.enqueueEvent(method, payload);
    }
  }
  #startUp() {
    try {
      this.#boot();
      this.#heartbeatSetup();
      this.#emitAvailability();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async #setupEventsQueue() {
    if (!this.eventsQueue) {
      logger.warn("ONLY USE FOR TESTING PURPOSES: Default Event Queue is only using ram. Power reset will result in data loss.");
    }
    const { dbType, host, port } = this.eventsQueue;
    this.eventsQueue.queue = await new EventsQueue({ dbType, host, port });
    await this.eventsQueue.queue.hydrate();
  }
  async #connectToCentralSystem() {
    for (const transport of this.#ocppTransports) {
      await transport.connect();
      await this.#listenToOCPPTransport(transport);
    }
    while (this.eventsQueue.queue && this.eventsQueue.queue.length > 0) {
      for (const transport of this.#ocppTransports) {
        const { method, payload } = await this.eventsQueue.queue.dequeueEvent();
        console.log("sending queued message:", method, payload);
        await transport.sendMessage(method, payload);
      }
    }
  }
  async #listenToOCPPTransport(transport) {
    transport.on("OCPP_EVENT", async (eventData) => {
      if (!eventData) return;
      if (transport.centralSystemService.type === "ocpp1.6" /* OCPP1_6J */) {
        const [messageType, messageId, eventMethod, eventPayload] = eventData;
        switch (eventMethod) {
          case "GetDiagnostics" /* GET_DIAGNOSTICS */: {
            const { location } = eventPayload;
            try {
              await this.#sendDiagnostics({ location });
              transport.sendResponse(messageId, { status: "Accepted", filename: location });
            } catch (e) {
              console.error(e);
              transport.sendResponse(messageId, { status: "Rejected" });
            }
            break;
          }
          case "ChangeAvailability" /* CHANGE_AVAILABILITY */: {
            const { connectorId: connectorId2, type } = eventPayload;
            try {
              await this.#updateAvailability(connectorId2, type);
              transport.sendResponse(messageId, { status: "Accepted" });
            } catch (e) {
              console.error(e);
              transport.sendResponse(messageId, { status: "Rejected" });
            }
            break;
          }
          case "RemoteStartTransaction" /* REMOTE_START_TRANSACTION */: {
            const {
              idTag,
              connectorId: connectorId2
            } = eventPayload;
            try {
              if (!idTag) throw new Error("Missing idTag");
              if (!connectorId2) throw new Error("Missing ConnectorId ");
              await this.remoteStartTransaction(idTag, connectorId2);
            } catch (e) {
              transport.sendResponse(messageId, { status: "Rejected" });
            }
            break;
          }
          case "RemoteStopTransaction" /* REMOTE_STOP_TRANSACTION */: {
            break;
          }
          default:
            break;
        }
      }
    });
  }
  #boot() {
    this.emit(
      "BootNotification",
      {
        chargePointVendor: this.manufacturer.vendor,
        chargePointModel: this.manufacturer.model,
        chargePointSerialNumber: this.serialNumber,
        // Optional
        chargeBoxSerialNumber: this.serialNumber,
        // Optional
        firmwareVersion: this.os.firmware.version,
        // Optional
        iccid: "",
        // Optional
        imsi: "123456789012345",
        // Optional
        meterType: this.manufacturer.energyMeter.type
      }
    );
  }
  #heartbeatSetup() {
    setInterval(() => {
      this.lastHeartbeat = (/* @__PURE__ */ new Date()).toISOString();
      this.emit("Heartbeat");
    }, this.configuration.heartbeatInterval || process.env.HEARTBEAT_INTERVAL || 12e4);
    this.lastHeartbeat = (/* @__PURE__ */ new Date()).toISOString();
    this.emit("Heartbeat");
  }
  async #ftpUpload(transport, localPath, remotePath) {
    import_perf_hooks.performance.mark("FTP_UPLOAD_CONNECTING" /* FTP_UPLOAD_CONNECTING */);
    await transport.connect();
    const localFileStats = (0, import_fs3.statSync)(localPath);
    this.emit("DiagnosticStatusNotification", {
      status: "Uploading" /* UPLOADING */,
      fileName: remotePath,
      fileSize: localFileStats.size,
      path: `${transport.uri}${remotePath}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      duration: (import_perf_hooks.performance.mark("START_FTP_UPLOAD" /* START_FTP_UPLOAD */), import_perf_hooks.performance.measure(
        "FTP_TIME_TO_CONNECT" /* FTP_TIME_TO_CONNECT */,
        "FTP_UPLOAD_CONNECTING" /* FTP_UPLOAD_CONNECTING */,
        "START_FTP_UPLOAD" /* START_FTP_UPLOAD */
      ), import_perf_hooks.performance.getEntriesByName("FTP_TIME_TO_CONNECT" /* FTP_TIME_TO_CONNECT */)[0].duration),
      retryCount: 0
    });
    await transport.uploadFile(localPath, remotePath);
    this.emit("DiagnosticStatusNotification", {
      status: "Uploaded" /* UPLOADED */,
      fileName: remotePath,
      fileSize: localFileStats.size,
      path: `${transport.uri}${remotePath}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      duration: (import_perf_hooks.performance.mark("COMPLETE_FTP_UPLOAD" /* COMPLETE_FTP_UPLOAD */), import_perf_hooks.performance.measure(
        "FTP_TIME_TO_UPLOAD" /* FTP_TIME_TO_UPLOAD */,
        "START_FTP_UPLOAD" /* START_FTP_UPLOAD */,
        "COMPLETE_FTP_UPLOAD" /* COMPLETE_FTP_UPLOAD */
      ), import_perf_hooks.performance.getEntriesByName("FTP_TIME_TO_UPLOAD" /* FTP_TIME_TO_UPLOAD */)[0].duration),
      retryCount: 0
    });
    await transport.end();
    Object.values(EPerfMarksFTPUpload).forEach((mark) => import_perf_hooks.performance.clearMarks(mark));
    Object.values(EPerfMeasuresFTPUpload).forEach((measure) => import_perf_hooks.performance.clearMeasures(measure));
  }
  async #sendDiagnostics({ location, retries, interval, startTimestamp, stopTimestamp }) {
    const match = location.match(
      /([a-zA-Z]+):\/\/([a-zA-Z0-9._%+-]+):([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)(:[0-9]+)?(\/.*)?/
    );
    if (!match && this.os.logs.length === 0)
      throw new Error("EVSE#sendDiagnostics: [args{location}] not a full URI and log paths[options.os.logs[string]] ");
    if (!match && this.#ftpTransports.length === 0)
      throw new Error("EVSE#sendDiagnostics: [args{location}] not a full URI and no FTP transports [options.transports[FTPTransport] ");
    const combinedLog = this.os.logs.map(({ name, path }) => `
--------${name}--------
 ${(0, import_fs3.readFileSync)(path)} 
-----------------------
`).join("\n"), combinedLogPath = `${this.os.temporaryDirectory}/combined-log-export-${(/* @__PURE__ */ new Date()).toISOString()}.log`;
    try {
      (0, import_fs3.writeFileSync)(combinedLogPath, combinedLog, { encoding: "utf-8" });
    } catch (e) {
      logger.error("Write File error for temp file: ", combinedLogPath);
    }
    if (match) {
      const [remoteProtocol, remoteUsername, remotePassword, remoteHostname, remoteDirtyPort, remotePath = "/"] = match, remotePort = remoteDirtyPort.slice(1) || void 0;
      if (!remoteHostname) throw new SyntaxError("EVSE#sendDiagnostics: [location] property missing [hostname]");
      if (remoteUsername && !remotePassword) throw new SyntaxError("EVSE#sendDiagnostics: Has [username] Missing [password]");
      if (!remoteUsername && remotePassword) throw new SyntaxError("EVSE#sendDiagnostics: Has [password] Missing [username]");
      const transport = remoteProtocol && remoteProtocol?.toLowerCase() === "sftp" ? new SFTPTransport({
        host: remoteHostname,
        port: remotePort,
        user: remoteUsername,
        pass: remotePassword
      }) : new FTPTransport({
        host: remoteHostname,
        port: remotePort,
        user: remoteUsername,
        pass: remotePassword
      });
      await this.#ftpUpload(transport, combinedLogPath, remotePath);
    } else {
      await Promise.all(
        this.#ftpTransports.map(async (transport) => {
          if (!transport) throw new Error("Unexpected transport error");
          await this.#ftpUpload(transport, combinedLogPath, location);
        })
      );
    }
    await new Promise((resolve, reject) => {
      (0, import_fs3.unlink)(combinedLogPath, (err) => err ? reject(err) : resolve(true));
    });
  }
  #getDiagnosticStatusResponse() {
    this.emit("GetDiagnosticsResponse", {
      filename: ""
    });
  }
  #emitAvailability() {
    this.emit(
      "StatusNotification" /* STATUS_NOTIFICATION */,
      {
        connectorId: 0,
        status: this.availability,
        errorCode: "NoError",
        info: "Charger is " + this.availability,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    this.connectors.forEach(({ id: connectorId2, status }) => {
      console.log(`${connectorId2}: ${status}`);
      this.emit(
        "StatusNotification" /* STATUS_NOTIFICATION */,
        {
          connectorId: connectorId2,
          status,
          errorCode: "NoError",
          info: `Connector [${connectorId2}] is: ${status}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      );
    });
  }
  #updateAvailability(connectorId2, newAvailability) {
    const availabilityUpdateMap = {
      ["Inoperative" /* INOPERATIVE */]: "Unavailable" /* UNAVAILABLE */,
      ["Operative" /* OPERATIVE */]: "Available" /* AVAILABLE */
    };
    if (connectorId2 === 0) {
      if (!Object.values(EAvailability).some((type) => type === newAvailability)) {
        throw new TypeError(`New availablility[${newAvailability}] not accpeted by EVSE`);
      }
      if (this.availability === newAvailability) {
        throw new Error(`Cannot change, already set to [${this.availability}]`);
      }
      this.availability = availabilityUpdateMap[newAvailability];
    } else {
      this.connectors.filter((connector) => connector.id !== connectorId2)[0].updateStatus(availabilityUpdateMap[newAvailability]);
    }
    this.#emitAvailability();
  }
  async remoteStartTransaction(idTag, connectorId2) {
    if (this.availability === "Unavailable" /* UNAVAILABLE */) throw new Error("Charger in 'Unavailable' status");
    const [connector] = this.connectors.filter((c) => c.id === connectorId2);
    const connectorStatusInfo = connector.getStatus();
    if (!connector) throw new Error(`No connector with ID: ${connectorId2}`);
    if (connector.status === "Faulted" /* FAULTED */) throw new Error("Connector in Status: Faulted");
    if (connector.status === "Occupied" /* OCCUPIED */) throw new Error("Connector in Status: Occupied");
    if (connector.status === "Reserved" /* RESERVED */) throw new Error("Connector in Status: Reserved");
    if (connectorStatusInfo.isCharging) throw new Error(`Cannot Start, connector already charging`);
    if (!connectorStatusInfo.isConnected) {
      await connector.once("plugged");
    }
    await connector.startCharging();
  }
};

// src/lib/Hardware/index.ts
var import_fs4 = require("fs");
var readDeviceTree = (nodePath, fullPath) => (0, import_fs4.readdirSync)(nodePath).reduce((tree, node) => (fullPath = `${nodePath}/${node}`, tree[node] = (0, import_fs4.lstatSync)(fullPath).isDirectory() ? readDeviceTree(fullPath) : (0, import_fs4.readFileSync)(fullPath, "utf8"), tree), {});

// src/index.ts
var deviceTree = readDeviceTree("/proc/device-tree");
(0, import_fs5.writeFileSync)("device-tree.json", JSON.stringify(deviceTree, null, 2));
function parseDevices(devices) {
  return {
    PowerMeters: [{
      serialNumber: "230710280012",
      totalizer: 0,
      voltage: 0,
      deciWatts: 0,
      deciWattHours: 0,
      path: "",
      baudRate: 9600,
      activelyMetering: false
    }],
    Relays: [{
      serialNumber: "0A-FF-0B-CC-B2",
      type: "POWER" /* POWER */,
      switchType: "SINGLE_POLE_SINGLE_THROW" /* SPST */,
      contacts: ["NORMALLY_OPEN" /* NO */, "COMMON" /* C */, "COIL_P" /* COIL_P */, "COIL_N" /* COIL_N */],
      position: "OPEN" /* OPEN */,
      coilVoltage: 5,
      coilCurrentType: "DIRECT_CURRENT" /* DC */,
      loadCurrent: 240,
      loadCurrentType: "ALTERNATING_CURRENT" /* AC */,
      loadVoltage: 270
    }]
  };
}
var { PowerMeters, Relays } = parseDevices(deviceTree);
var connectorId = {
  ZERO: Symbol(0),
  ONE: Symbol(1),
  TWO: Symbol(2)
};
var ledId = {
  ONE: Symbol(1),
  TWO: Symbol(2),
  THREE: Symbol(3),
  FOUR: Symbol(4),
  FIVE: Symbol(5),
  SIX: Symbol(6),
  SEVEN: Symbol(7)
};
var connectorName = ["jane", "john", "jake", "bakery", "running", "jumping", "jerking", "jam", "jesup", "james", "sam"];
var connectorOpts = { chargingMode: "AC" /* AC */, maxCurrent: 32, maxVoltage: 120, cableLength: 100 };
var serialNumber = "1o1-2024-b1-00001";
var led = {
  single: {
    red: new RedLED(ledId.ONE, "Main", "Front & Top"),
    green: new GreenLED(ledId.TWO, "Action", "Front & Top"),
    multicolor: new MultiColorLED(ledId.THREE, "Status")
  },
  strip: {
    red: new RedLEDStrip(ledId.FOUR, "Main", "TOP"),
    green: new GreenLEDStrip(ledId.FIVE, "Action", "TOP"),
    yellow: new YellowLEDStrip(ledId.SEVEN, "Warning", "Yellow Strip"),
    multicolor: new MultiColorLEDStrip(ledId.SIX, "Status", "Wraps edge")
  }
};
var powerMeter = {
  ZERO: new PowerMeterModule(PowerMeters[0]),
  ONE: new PowerMeterModule(PowerMeters[0]),
  TWO: new PowerMeterModule(PowerMeters[0])
};
var relay = {
  ZERO: new OverCurrentRelay(Relays[0]),
  ONE: new PowerRelay(Relays[0]),
  TWO: new PowerRelay(Relays[0]),
  THREE: new PowerRelay(Relays[0])
};
new EVSE({
  id: 0,
  serialNumber,
  connectors: [
    new EVSEConnector({
      ...connectorOpts,
      id: connectorId.ONE,
      connectorType: "SAE_J1772" /* TYPE1 */,
      powerMeters: [powerMeter.ONE],
      relays: {
        power: relay.ONE,
        overCurrent: relay.ZERO
      },
      displayName: connectorName.pop()
    }),
    new EVSEConnector({
      ...connectorOpts,
      id: connectorId.TWO,
      connectorType: "CCS_Type_1" /* CCS1 */,
      powerMeters: [powerMeter.TWO],
      relays: {
        power: relay.TWO,
        overCurrent: relay.ZERO
      },
      displayName: connectorName.pop()
    })
  ],
  os: {
    logs: [{ name: "TestLog", path: "/usr/src/app/src/test.log" }]
  },
  hardwareModules: {
    powerMeters: Object.values(powerMeter),
    connectorRelays: [relay.TWO, relay.THREE],
    hmis: {
      indicators: {
        power: led.single.red.solid,
        active: led.single.red.solid,
        preparing: led.single.red.blinkFast,
        charging: led.single.red.blinkSlow,
        error: led.strip.red.blinkSlow,
        faulted: led.strip.red.solid,
        updating: led.strip.yellow.blinkFast,
        inactive: led.strip.red.blinkSlow
      }
    },
    evseRelays: [relay.ONE],
    overloadProtectionRelays: [relay.ZERO],
    communications: {
      serial: [],
      wifi: [],
      rj45: []
    }
  },
  transport: [
    // new SFTPTransport({
    //   host  : "eu-central-1.sftpcloud.io",
    //   port  : 22,
    //   user  : "31df361ca3b64065aeca0b4ee9bcc638",
    //   pass  : "cjQG3jqVMz2x3mF83DhCzuOwecyaXenj"
    // }),
    new FTPTransport({
      host: "eu-central-1.sftpcloud.io",
      port: 21,
      user: "247d21666ad84822a3c104d218707806",
      pass: "dV3Nl2HJR7revEy0OJhXLsbeSonBZ5Cv"
    }),
    new OCPPTransport({
      centralSystemService: {
        type: "ocpp1.6" /* OCPP1_6J */,
        host: "steve",
        port: 8180,
        path: `/steve/websocket/CentralSystemService/${serialNumber}`,
        protocol: "ws" /* WS */
      },
      events: Object.values(EEvent)
    })
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
    //       timeout : 1000,
    //       attempts: 10
    //     }
    //   },
    //   events: Object.values( EEvent )
    // })
  ]
});
//# sourceMappingURL=bundle.js.map
