// 测试文件

import { reactive } from "./src/reactive.js";

const baseObj = {
  name: "张三",
  info: {
    age: 18,
  },
};

const obj = reactive(baseObj);

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
const arr = reactive([1, baseObj, 3]);
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
