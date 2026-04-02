import trigger from "../../effect/trigger.js";
import { TriggerOpTypes, isChanged } from "../../utils/index.js";
export default function (target, key, value) {
  //对于操作的类型还需要进一步判断，因为set操作还有可能是新增
  const type = Reflect.has(target, key)
    ? TriggerOpTypes.SET
    : TriggerOpTypes.ADD;

  // 进行操作之前要缓存一下旧值方便判断数据是否发生了变化
  const oldValue = target[key];
  const result = Reflect.set(target, key, value);
  // 只有当数据发生了变化才触发更新
  if (isChanged(oldValue, value)) {
    // 拦截到了set操作后要进行触发更新
    trigger(target, type, key);
  }
  return result;
}
