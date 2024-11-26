"use strict"

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