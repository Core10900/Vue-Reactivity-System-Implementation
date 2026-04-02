import track from "../../effect/track.js";
import { TrackOpTypes } from "../../utils/index.js";

// hasHandler主要用来拦截in操作符，即判断对象中是否有某个属性
export default function (target, key) {
  const result = Reflect.has(target, key);
  track(target, TrackOpTypes.HAS, key);
  return result;
}
