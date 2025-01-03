"use strict";

import { Region } from "../region"

export interface RegionConfig {
  name          : string;
  top           : number;
  left          : number;
  width         : number;
  height        : number;
  content       : string | Buffer;
  nestedRegions?: Region[];
}