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
  // 如果shouldTrack为false，说明当前不需要进行依赖收集，直接返回
  if (!shouldTrack) {
    return;
  }
  // console.log("触发了收集器！");
  // console.log("收集器拦截到了代理对象:", target);
  if (key) {
    console.log("收集器拦截到了代理对象的", key, "属性的", type, "操作");
  } else {
    console.log("收集器拦截到了代理对象的", type, "操作");
  }
}
