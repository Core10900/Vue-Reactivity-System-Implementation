import { TrackOpTypes, isObject, RAW } from "../../utils/index.js";
import track, { pauseTracking, resumeTracking } from "../../effect/track.js";
import { reactive } from "../../reactive.js";

const ArrayInstrumentations = {};
// 需要重写数组的includes、indexOf、lastIndexOf方法
["includes", "indexOf", "lastIndexOf"].forEach((method) => {
  ArrayInstrumentations[method] = function (...args) {
    // this是代理对象，先在代理对象上找，如果找不到再去原始数组上找
    let res = Array.prototype[method].apply(this, args);
    if (res === false || res < 0) {
      // 这里的this[RAW]就是原始数组，因为在getHandler中如果访问的属性是RAW就会返回原始对象
      res = Array.prototype[method].apply(this[RAW], args);
    }
    return res;
  };
});

// 重写数组的push、pop、shift、unshift、splice方法，这些方法在执行的时候我们需要暂停依赖收集，调用完之后再恢复依赖收集
["push", "pop", "shift", "unshift", "splice"].forEach((method) => {
  ArrayInstrumentations[method] = function (...args) {
    pauseTracking();
    const res = Array.prototype[method].apply(this, args);
    resumeTracking();
    return res;
  };
});

export default function (target, key) {
  // RAW是一个特殊标识，用来获取原始对象的引用，如果访问的属性是RAW，那么就直接返回原始对象
  // 这个标识不能和已有的属性重复
  if (key === RAW) {
    return target;
  }

  // console.log("触发了reactive的依赖收集");
  // 拦截到了get操作后要进行依赖收集
  track(target, TrackOpTypes.GET, key);
  const result = Reflect.get(target, key);

  // 如果访问的目标对象是数组，并且访问的属性在ArrayInstrumentations中有重写，那么就返回重写后的方法
  if (Array.isArray(target) && ArrayInstrumentations.hasOwnProperty(key)) {
    return ArrayInstrumentations[key];
  }

  // 如果result是一个对象，那么就继续递归进行代理
  if (isObject(result)) {
    return reactive(result);
  }

  return result;
}
