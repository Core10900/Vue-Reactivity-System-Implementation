// 测试文件

import { reactive } from "./src/reactive.js";
import { effect } from "./src/effect/effect.js";
import computed from "./src/computed.js";

const baseObj = {
  name: "张三",
  info: {
    age: 18,
  },
  a: 1,
  b: 2,
};

// const obj = reactive(baseObj);

// 普通对象的行为测试
// console.log(obj.name);
// obj.info.age;
// obj.name = "李四";
// obj.class = "class1";
// delete obj.name;
// delete obj.c;
// "use" in obj;
// for (let key in obj) {
//   console.log(key);
// }

// 数组的行为测试
// const arr = reactive([1, baseObj, 3]);
// arr[0];
// arr.length;
// for (let key in arr) {
//   arr[key];
// }
// for (let i = 0; i < arr.length; i++) {
//   arr[i];
// }

// arr.includes(1);
// arr.indexOf(1);

// console.log(arr.includes(baseObj));
// console.log(arr.indexOf(baseObj));
// console.log(arr.lastIndexOf(baseObj));

// arr[5] = 6; // 隐式修改length属性
// arr.length = 10; // 显式修改length属性
// arr.length = 1; // 显式修改length属性，且新length比旧length小，这时候就会删除多余的元素

// arr.push(4, 3);

// 测试1

// const state = reactive(baseObj);
// const testFn = () => {
//   console.log("effect 函数执行了");
//   state.name = state.name + "一";
// };

// effect(testFn);
// state.name = "王伟";

// 测试2

// const state = reactive(baseObj);
// effect(() => {
//   if (state.a === 1) {
//     state.b;
//   } else {
//     state.c;
//   }
//   console.log("函数1执行了");
// });
// effect(() => {
//   console.log(state.c);
//   console.log("函数2执行了");
// });
// state.a = 2;
// state.c = 3;
// state.b = 2;

// 测试3 - 懒执行

// const state = reactive(baseObj);
// const testFn = () => {
//   console.log("effect 函数执行了");
//   state.a = state.a + 1;
//   return state.a; // 添加返回值
// };

// const effectFn = effect(testFn, { lazy: true });

// effectFn();
// state.a = 3;

// 测试3 - 添加回调

// const state = reactive(baseObj);
// const testFn = () => {
//   console.log("effect 函数执行了");
//   state.a = state.a + 1;
//   return state.a; // 添加返回值
// };

// let isRunning = false; // 用来控制是否正在执行环境函数，防止重复执行
// const effectFn = effect(testFn, {
//   lazy: true,
//   scheduler(fn) {
//     Promise.resolve().then(() => {
//       if (!isRunning) {
//         isRunning = true;
//         fn();
//       }
//     });
//   },
// });

// effectFn();
// state.a++;
// state.a++;
// state.a++;

// 计算属性测试1
const state = reactive(baseObj);
const sum = computed(() => {
  console.log("计算属性函数执行了");
  return state.a + state.b;
});

console.log(sum.value);
// state.a++;
console.log(sum.value);
console.log(sum.value);
state.a++;
console.log(sum.value);
