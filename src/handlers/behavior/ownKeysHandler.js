import track from "../../effect/track.js";
import { TrackOpTypes } from "../../utils/index.js";

export default function (target) {
  const result = Reflect.ownKeys(target);
  track(target, TrackOpTypes.ITERATE);
  return result;
}
