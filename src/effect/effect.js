/**
 * 用于记录当前活动的 effect
 */
export let activeEffect = undefined;
export const targetMap = new WeakMap(); // 用来存储对象和其属性的依赖关系
const effectStack = [];

/**
 * 该函数的作用，是执行传入的函数，并且在执行的过程中，收集依赖
 * @param {*} fn 要执行的函数
 */
export function effect(fn, options = {}) {
  const { lazy = false } = options;
  const environment = () => {
    try {
      activeEffect = environment;
      effectStack.push(environment);
      // 清空当前环境函数的依赖，因为在下一次执行环境函数之前，应该先清空之前的依赖，这样才能保证依赖的准确性，如果不清空，那么就会导致依赖的重复收集，最终导致内存泄漏的问题
      cleanup(environment);
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  // 给环境函数添加一个deps属性，用来存储该环境函数的依赖，方便在下一次执行环境函数之前进行清理
  environment.deps = [];
  environment.options = options;
  if (!lazy) {
    environment();
  }
  return environment;
}

/**
 * 清空当前环境函数的依赖
 * @param {*} environment 当前环境函数
 */
export function cleanup(environment) {
  let deps = environment.deps; // 拿到当前环境函数的依赖（是个数组）
  if (deps.length) {
    deps.forEach((dep) => {
      dep.delete(environment);
    });
    deps.length = 0;
  }
}
