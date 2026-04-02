import { TrackOpTypes, isObject } from "../../utils/index.js";
import track from "../../effect/track.js";
import { reactive } from "../../reactive.js";

export default function (target, key) {
  // console.log("触发了reactive的依赖收集");
  // 拦截到了get操作后要进行依赖收集
  track(target, TrackOpTypes.GET, key);
  const result = Reflect.get(target, key);

  // 如果result是一个对象，那么就继续递归进行代理
  if (isObject(result)) {
    return reactive(result);
  }

  return result;
}
