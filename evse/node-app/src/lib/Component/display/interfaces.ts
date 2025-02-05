import { TComponentModule } from "../common/types"
import { EScreenType, EScreenResolution } from "./enums"

export interface IDisplay extends TComponentModule {
  screenType: EScreenType,
  screenSize: number,
  bits      : number,
  resolution: EScreenResolution
}