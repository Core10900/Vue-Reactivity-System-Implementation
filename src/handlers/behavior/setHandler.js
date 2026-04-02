import trigger from "../../effect/trigger.js";
import { TriggerOpTypes, isChanged } from "../../utils/index.js";
export default function (target, key, value) {
  //对于操作的类型还需要进一步判断，因为set操作还有可能是新增
  const type = Reflect.has(target, key)
    ? TriggerOpTypes.SET
    : TriggerOpTypes.ADD;

  // 进行操作之前要缓存一下旧值方便判断数据是否发生了变化
  const oldValue = target[key];
  const oldArrayLength = Array.isArray(target) ? target.length : undefined;
  const result = Reflect.set(target, key, value);
  // 只有当数据发生了变化才触发更新
  if (isChanged(oldValue, value)) {
    // 拦截到了set操作后要进行触发更新
    trigger(target, type, key);

    // 如果是数组，且length发生了变化，那么就触发length的更新
    if (Array.isArray(target) && oldArrayLength !== target.length) {
      if (key !== "length") {
        // 进入了这个分支说明是隐式修改了length，例如通过索引的方式修改了数组的length属性，比如arr[5] = 6，这时候就需要触发length的更新
        trigger(target, TriggerOpTypes.SET, "length");
      } else {
        // 进入了这个分支说明是显式修改了length，例如通过arr.length = 10的方式修改了数组的length属性，这时候就需要触发length的更新
        // 同时还需要判断一下新旧length的关系，如果新length比旧length小，那么就需要触发被删除元素的更新
        // 因为当我们把数组的length设置为一个比当前长度小的值时，数组会自动删除多余的元素，这时候就需要触发被删除元素的更新
        for (let i = target.length; i < oldArrayLength; i++) {
          trigger(target, TriggerOpTypes.DELETE, String(i));
        }
      }
    }
  }
  return result;
}
