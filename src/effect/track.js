import { targetMap, activeEffect } from "./effect.js";
import { TrackOpTypes, ITERATE_KEY } from "../utils/index.js";

let shouldTrack = true; // 控制是否进行依赖收集，默认为true
/**
 * 暂停依赖收集
 */
export function pauseTracking() {
  shouldTrack = false;
}

/**
 * 恢复依赖收集
 */
export function resumeTracking() {
  shouldTrack = true;
}

/**
 *
 * @param {*} target 代理对象
 * @param {*} type 操作行为
 * @param {*} key 属性
 */
export default function track(target, type, key) {
  // console.log("触发了收集器！");
  // 如果shouldTrack为false，说明当前不需要进行依赖收集，直接返回
  if (!shouldTrack || !activeEffect) {
    return;
  }

  // console.log("收集器拦截到了代理对象:", target);

  // 首先要做的就是一层层的去targetMap中去找
  let propMap = targetMap.get(target);
  if (!propMap) {
    propMap = new Map();
    targetMap.set(target, propMap);
  }

  // 对key进行归一化处理
  if (type === TrackOpTypes.ITERATE) {
    // 在遍历对时候key默认是undefined的，所以我们需要把它改成一个特殊的标识
    key = ITERATE_KEY;
  }

  let typeMap = propMap.get(key);
  if (!typeMap) {
    typeMap = new Map();
    propMap.set(key, typeMap);
  }

  // 最后根据type去找对应的set集合(依赖的函数)
  let depSet = typeMap.get(type);
  if (!depSet) {
    depSet = new Set();
    typeMap.set(type, depSet);
  }

  // 现在找到依赖的set集合了，我们要存储依赖
  if (!depSet.has(activeEffect)) {
    depSet.add(activeEffect);
    activeEffect.deps.push(depSet); // 将集合存到activeEffect的deps属性中，方便在下一次执行环境函数之前进行清理
  }
}
