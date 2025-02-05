import { lstatSync, readFileSync, readdirSync } from 'fs'

export const readDeviceTree = ( nodePath:string , fullPath?: string ):any =>
  readdirSync( nodePath ).reduce( ( tree, node ) => (
    fullPath = `${nodePath}/${node}`,
    tree[ node ] = lstatSync( fullPath ).isDirectory() ? readDeviceTree( fullPath ) : readFileSync( fullPath, 'utf8' ),
    tree
  ), {} as any)