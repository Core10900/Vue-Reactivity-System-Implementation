import { TrackOpTypes, TriggerOpTypes, ITERATE_KEY } from "../utils/index.js";
import { targetMap, activeEffect } from "./effect.js";

// 定义修改数据和触发数据的映射关系
const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};

/**
 * 触发器
 * @param {*} target 目标对象
 * @param {*} type 触发器的操作类型
 * @param {*} key 触发器的属性
 */

export default function trigger(target, type, key) {
  // 触发器要做的事情就是在targetMap中一层层去找依赖，然后把找到的依赖函数全部执行一边
  const effectFns = getEffectFns(target, type, key);
  // console.log("触发器触发了");
  // console.log(effectFns);
  if (!effectFns) {
    return;
  }
  for (const effectFn of effectFns) {
    // 如果依赖函数和当前正在执行的函数相同，则不执行
    if (effectFn !== activeEffect) {
      // 如果用户自定义了调度函数，则使用调度函数执行依赖函数，否则直接执行依赖函数
      if (effectFn.options && effectFn.options.scheduler) {
        effectFn.options.scheduler(effectFn);
        continue;
      }
      effectFn();
    }
  }
}

/**
 * 根据触发器的操作类型和属性去targetMap中找依赖函数
 * @param {*} target
 * @param {*} type
 * @param {*} key
 */
const getEffectFns = (target, type, key) => {
  const propMap = targetMap.get(target);
  if (!propMap) {
    return;
  }

  // 如果是新增、删除操作会涉及到迭代
  const keys = [key];
  if (type === TriggerOpTypes.ADD || type === TriggerOpTypes.DELETE) {
    keys.push(ITERATE_KEY);
  }

  // 用来存储所有要触发的依赖函数
  const effectFnsSet = new Set();

  for (const key of keys) {
    const typeMap = propMap.get(key);
    if (!typeMap) {
      continue;
    }

    const trackTypes = triggerTypeMap[type];

    for (const trackType of trackTypes) {
      const depFns = typeMap.get(trackType);
      if (!depFns) {
        continue;
      }
      depFns.forEach((fn) => effectFnsSet.add(fn));
    }
  }

  return effectFnsSet;
};
