/**
 * 触发器
 * @param {*} target 目标对象
 * @param {*} type 触发器的操作类型
 * @param {*} key 触发器的属性
 */

export default function trigger(target, type, key) {
  console.log("触发器:拦截到了代理对象:", target);
  console.log("触发器:拦截到了代理对象的", key, "属性的", type, "操作");
}
