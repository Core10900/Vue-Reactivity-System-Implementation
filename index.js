// 测试文件

import { reactive } from "./src/reactive.js";

const obj = reactive({
  name: "张三",
  info: {
    age: 18,
  },
});

// console.log(obj.name);
// obj.info.age;
// obj.name = "李四";
// obj.class = "class1";
// delete obj.name;
// delete obj.c;
// "use" in obj;
for (let key in obj) {
  console.log(key);
}
