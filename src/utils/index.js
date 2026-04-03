/**
 * @description: 收集器的操作类型

 */
export const TrackOpTypes = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate",
};

/**
 * @description: 触发器的操作类型
 */
export const TriggerOpTypes = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
};

/**
 * @description: 判断一个值是否是对象
 * @param {*} value
 * @returns
 */
export function isObject(value) {
  return typeof value === "object" && value !== null;
}

/**
 * @description: 判断对象是否发生了变化
 * @param {*} oldObj
 * @param {*} newObj
 * @returns
 */
export function isChanged(oldObj, newObj) {
  return !Object.is(oldObj, newObj);
}

/**
 * @description: 定义一个特殊的Symbol值，用来标识原始对象
 */
export const RAW = Symbol("raw");

/**
 * @description: 迭代器标识
 */
export const ITERATE_KEY = Symbol("iterate");
