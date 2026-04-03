import { effect } from "./effect/effect.js";

/**
 * conputed函数的简易实现
 * @param {Function | { get: Function, set: Function }} getterOrOptions getter函数或者一个包含getter和setter的对象
 */
export default function computed(getterOrOptions) {
  // 进行参数归一化，得到getter和setter函数
  const { getter, setter } = normalizeParam(getterOrOptions);

  const effectFn = effect(getter, {
    lazy: true, // 计算属性的effect函数是一个惰性函数，只有在访问计算属性的value属性的时候才会执行
    scheduler() {
      dirty = true; // 当计算属性依赖的响应式数据发生变化的时候，把dirty设置为true，表示需要重新计算了
    },
  });

  let value; // 用来缓存计算属性的值
  let dirty = true; // 用来标识计算属性是否需要重新计算，初始值为true，表示需要计算
  // 返回一个类似ref对象的对象
  let obj = {
    get value() {
      if (dirty) {
        value = effectFn(); // 访问计算属性的value属性的时候执行effect函数，得到计算属性的值
        dirty = false; // 计算完成后把dirty设置为false，表示不需要重新计算了
      }
      return value;
    },
    set value(newValue) {
      // 设置计算属性的值
      setter(newValue);
    },
  };
  return obj;
}

/**
 * 进行参数归一化
 * @param {Function | { get: Function, set: Function }} getterOrOptions
 */
function normalizeParam(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    // 如果参数是一个函数，那么就把它当做getter函数，setter函数就是一个空函数
    getter = getterOrOptions;
    setter = () => {
      console.warn("it has no setter");
    };
  } else {
    // 如果参数是一个对象，那么就从对象中取出getter和setter
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return {
    getter,
    setter,
  };
}
