import { THardwareModule } from "../common/types"
import { EScreenType, EScreenResolution } from "./enums"

export interface IDisplay extends THardwareModule {
  screenType: EScreenType,
  screenSize: number,
  bits      : number,
  resolution: EScreenResolution
}