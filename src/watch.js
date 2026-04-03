import { effect, cleanup } from "./effect/effect.js";

/**
 * watch函数的简易实现
 * @param {*} source 监听的目标，一个响应式数据或者getter函数(数组暂不考虑)
 * @param {*} cb 回调函数
 * @param {*} options 配置项
 */
export default function watch(source, cb, options = {}) {
  // 参数归一化(没有考虑数组的情况)
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue, newValue; // 用来保存旧值和最新值

  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue); // 执行回调函数，传入新值和旧值
    oldValue = newValue;
  };

  const effectFn = effect(getter, {
    lazy: true, // watch的effect函数是一个惰性函数，只有在watch被调用的时候才会执行
    scheduler() {
      if (options.flush && options.flush === "post") {
        // 如果用户指定了flush为post，说明希望在组件更新之后执行回调函数，那么就把job放到微任务队列中执行，这样就能保证在组件更新之后执行回调函数了
        Promise.resolve().then(job);
      } else {
        // 否则就直接执行job函数，这样就能保证在组件更新之前执行回调函数了
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }

  return () => {
    // 停止监听
    cleanup(effectFn);
  };
}

/**
 * 用来便利对象，便利响应式数据对象的每一个属性，包括嵌套的属性
 * 之所以要便利，是为了触发依赖收集，当监听的响应式数据对象发生变化的时候，会触发回调函数
 * @param {} value
 * @param {*} seen
 * @returns
 */
function traverse(value, seen = new Set()) {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }
  seen.add(value);

  for (let key in value) {
    traverse(value[key], seen);
  }

  return value;
}
