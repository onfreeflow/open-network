"use strict"

import Database from "./Database"
import { EventEmitter } from "events"
import { EEvent } from "../Transport/interfaces"

export interface IDatabaseConfiguration {
  host: string;
  port: number;
  path: string;
}

export enum EEventsQueueDBType {
  SQLITE3 = 'sqlite3',
  LEVELDB = 'leveldb',
  ROCKSDB = 'rocksdb',
  REDIS   = 'redis',
  MEMORY  = 'memory'
}

export interface IPayload {
  [key: string]: any;
  timestamp?: string;
}

export interface IEventsQueue {
  queue      : string[]
  eventStream: Generator
  db         : Database
  emitter    : EventEmitter
  events     : EEvent | EEvent[]
}

export interface IEventsQueueOptions {
  dbType: EEventsQueueDBType
  host ?: string
  path ?: string
  port ?: number
  events: EEvent | EEvent[]
}