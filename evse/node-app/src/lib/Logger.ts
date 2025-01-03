"use strict"

export default class Logger {
  constructor( ...args ){
    if ( args.length === 0 ){
      return console
    }
  }
}