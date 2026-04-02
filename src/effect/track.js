/**
 *
 * @param {*} target 代理对象
 * @param {*} type 操作行为
 * @param {*} key 属性
 */
export default function track(target, type, key) {
  console.log("触发了收集器！");
  console.log("收集器拦截到了代理对象:", target);
  if (key) {
    console.log("收集器拦截到了代理对象的", key, "属性的", type, "操作");
  } else {
    console.log("收集器拦截到了代理对象的", type, "操作");
  }
}
