// 提供一个reactive函数，接受一个对象作为参数，并返回一个Proxy对象

import handlers from "./handlers/index.js";
import { isObject } from "./utils/index.js";

// 映射表:用来存储原始对象和代理对象的映射关系，WeakMap的key只能是对象，并且当key被垃圾回收时，WeakMap会自动删除对应的键值对，这样就避免了内存泄漏的问题
const proxyMap = new WeakMap();
/**
 * 将对象转成proxy对象
 * @param {*} obj 要转换的对象
 * @returns Proxy对象
 */
function reactive(obj) {
  // 如果不是一个对象，那么就直接返回
  if (!isObject(obj)) {
    return obj;
  }

  // 如果这个对象已经被代理过了，那么就直接返回之前代理的结果
  if (proxyMap.has(obj)) {
    return proxyMap.get(obj);
  }

  const proxy = new Proxy(obj, handlers);
  proxyMap.set(obj, proxy);
  return proxy;
}

export { reactive };
