import trigger from "../../effect/trigger.js";
import { TriggerOpTypes } from "../../utils/index.js";
export default function (target, key) {
  // 删除操作之前要判断一下属性是否存在，只有当属性存在时才触发更新
  const hasKey = Reflect.has(target, key);
  const result = Reflect.deleteProperty(target, key);
  if (hasKey && result) {
    trigger(target, TriggerOpTypes.DELETE, key);
  }
  return result;
}
