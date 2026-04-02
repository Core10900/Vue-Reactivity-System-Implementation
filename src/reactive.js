// 提供一个reactive函数，接受一个对象作为参数，并返回一个Proxy对象

import handlers from "./handlers/index.js";
/**
 * 将对象转成proxy对象
 * @param {*} obj 要转换的对象
 * @returns Proxy对象
 */
function reactive(obj) {
  return new Proxy(obj, handlers);
}

export { reactive };
