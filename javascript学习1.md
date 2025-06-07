# 学习javascript
```

# 学习JavaScript
let name = "豆包";    // 可变变量
const age = 3;        // 不可变常量（值不能重新赋值）
var hobby = "编程";   // 老派声明方式（不推荐新手用）

// 基本类型
let num = 10;         // 数字
let isDone = false;   // 布尔值
let text = "hello";   // 字符串
let nothing = null;   // 空值
let unknown;          // undefined（未赋值）

// 复杂类型
let arr = [1, 2, 3];  // 数组
let obj = {           // 对象（类似 Python 的字典）
  name: "豆包",
  age: 3
};

// 普通函数
function add(a, b) {
  return a + b;
}

// 箭头函数（简化写法）
const multiply = (a, b) => a * b;

// 调用函数
console.log(add(2, 3));       // 输出: 5
console.log(multiply(4, 5));  // 输出: 20

#if else语句
const hour = 14;
if (hour < 12) {
  console.log("上午好");
} else if (hour < 18) {
  console.log("下午好");
} else {
  console.log("晚上好");
}

#for循环
const fruits = ["苹果", "香蕉", "橙子"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// 更简洁的 forEach
fruits.forEach(fruit => {
  console.log(fruit);
});

#foreach
在 JavaScript 中，forEach 是一个数组方法，用于对数组中的每个元素执行指定的操作。它的语法如下：
array.forEach(callback(currentValue, index, array), thisArg)
参数解释：
callback：必需。一个函数，对数组中的每个元素执行。
currentValue：当前元素的值。
index：可选。当前元素的索引。
array：可选。当前数组。
thisArg：可选。执行 callback 时用作 this 的值。
forEach 方法不会返回一个新数组，而是直接在原数组上进行操作。它通常用于遍历数组并对每个元素执行一些操作，比如打印、修改、过滤等。


const 火车车厢 = ['车头', '乘客车厢1', '餐车', '乘客车厢2', '行李车厢'];

火车车厢.forEach((车厢, 车厢编号) => {
  console.log(`现在检查第 ${车厢编号} 节车厢: ${车厢}`);
});

数组.forEach(function(当前元素, 元素索引, 原始数组) {
  // 在这里编写要执行的操作
});

或者可以写成箭头函数的形式
数组.forEach((当前元素, 元素索引, 原始数组) => {
  // 执行操作
});

没有返回值：forEach 方法不会返回新的数组，它的返回值是 undefined。如果你需要得到一个新数组，应该使用 map 方法。
不能中断循环：在 forEach 循环里，无法使用 break 或者 continue 来中断循环。如果有中断循环的需求，可以使用普通的 for 循环。

#对象
const person = {
  name: "张三",
  age: 25,
  hobbies: ["读书", "跑步"],
  
  sayHello() {
    console.log(`你好，我是${this.name}`);
  }
};

console.log(person.name);     // 输出: 张三
person.sayHello();            // 输出: 你好，我是张三


#map对象--javascript中的字典
const map = new Map();
// 添加键值对
map.set("name", "豆包");
map.set("age", 3);
// 获取值
console.log(map.get("name"));  // 输出: 豆包
// 遍历键值对
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
#set对象--javascript中的集合
const set = new Set();
// 添加元素
set.add(1);
set.add(2);
set.add(1);  // 重复的元素不会被添加
// 检查元素是否存在
console.log(set.has(1));  // 输出: true
// 遍历集合
set.forEach(value => {
  console.log(value);
});

#数组
const numbers = [1, 2, 3, 4];

// 添加元素
numbers.push(5);

// 过滤元素
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers);     // 输出: [2, 4]

#异步编程

// 模拟一个异步请求（比如从服务器获取数据）
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("数据加载完成");  // 成功时调用
      // reject("网络错误");     // 失败时调用
    }, 1000);
  });
}

// 使用 Promise
fetchData()
  .then(data => {
    console.log(data);        // 输出: 数据加载完成
  })
  .catch(error => {
    console.error(error);
  });

# 使用 async/await promis的语法糖
  async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);        // 输出: 数据加载完成
  } catch (error) {
    console.error(error);
  }
}

loadData();

# 模块化 导出
// 定义一个模块文件
export function add(a, b) {
  return a + b;
}

export const PI = 3.14;

# 导入模块
// 在另一个文件中使用
import { add, PI } from './math.js';

console.log(add(1, 2));       // 输出: 3
console.log(PI);              // 输出: 3.14



const fs = require('fs');
fs.writeFileSync('test.txt', 'Hello Node.js!');



const http = require('http');
http.createServer((req, res) => {
  res.end('Hello World');
}).listen(3000);



const path = require('path');
const filePath = path.join(__dirname, 'data.txt');




// 从 Node.js 内置工具箱里拿出 "fs" 工具包（文件操作工具）
const fs = require('fs');

// 使用 fs 工具包里的 readFileSync 工具读取文件
const data = fs.readFileSync('test.txt', 'utf8');




// 导入 http 模块（用于创建服务器）
const http = require('http');

// 创建服务器
http.createServer((req, res) => {
  res.end('Hello World!');
}).listen(3000);



# 安装 axios 模块（用于网络请求）
npm install axios
// 导入 axios 模块
const axios = require('axios');

// 使用 axios 发送网络请求
axios.get('https://api.example.com/data')
  .then(response => {
    console.log(response.data);
  });



  // math.js
function add(a, b) {
  return a + b;
}

// 导出 add 函数，让其他文件可以使用
module.exports = {
  add: add
};


// main.js
const math = require('./math');  // 注意路径要写对

console.log(math.add(2, 3));  // 输出 5


#cron表达式
Cron 表达式是一种用于指定定时任务执行时间的字符串格式，广泛应用于 Unix/Linux 系统的 cron 服务以及许多其他编程语言和系统中。它通过简洁的语法来表示任务执行的时间规则，可以精确到分钟级别，非常适合用于自动化脚本、定时任务调度等场景。

Cron 表达式由 5 个空格分隔的字段组成，分别是：
分钟 小时 日期 月份 星期 [年份]

分钟：0-59
小时：0-23（0 表示午夜）
日期：1-31
月份：1-12 或 JAN-DEC
星期：0-7 或 SUN-SAT（0 和 7 都表示星期日）
年份：可选字段，1970-2099

Cron 表达式中使用以下特殊字符来表示更灵活的时间规则：

星号（*）：表示所有可能的值。例如，在小时字段中使用*表示每个小时。
逗号（,）：用于分隔多个值。例如，1,3,5表示第 1、3、5 个时间单位。
连字符（-）：表示范围。例如，9-17表示从 9 到 17 的时间单位。
斜杠（/）：表示间隔。例如，*/5表示每隔 5 个时间单位执行一次。
问号（?）：仅用于日期和星期字段，表示不指定值。当其中一个字段有值时，另一个字段需要用?。
Cron 表达式的示例：
每分钟执行一次：* * * * *
每小时执行一次：0 * * * *
每天执行一次：0 0 * * *
每周执行一次：0 0 * * 0
每月执行一次：0 0 1 * *
每年执行一次：0 0 1 1 *

每天的 12:00 执行：0 12 * * *
每周一的 12:00 执行：0 12 * * 1
每月的 1 号的 12:00 执行：0 12 1 * *
0 17 * * 1-5 表示每周一到周五的 17:00 执行
0 17 * * 1,3,5 表示每周一、周三和周五的 17:00 执行
0 17 * * 1-5/2 表示每周一和周三的 17:00 执行
*/5 * * * * 表示每隔 5 分钟执行一次


javascript的console对象
console.log()：用于在控制台输出普通的文本信息。
最常用
console.error()：用于输出错误信息，通常会以红色字体显示。
console.warn()：用于输出警告信息，通常会以黄色字体显示。
console.info()：用于输出提示信息，通常会以蓝色字体显示。
console.debug()：用于输出调试信息，通常会以灰色字体显示。
console.dir()：用于输出对象的属性和方法，通常会以特殊格式显示。
console.time()：用于开始计时，可以配合 console.timeEnd() 使用。
console.timeEnd()：用于结束计时，配合 console.time() 使用。
console.count()：用于输出函数被调用的次数。
console.assert()：用于判断表达式是否为 true，如果不是，则输出错误信息。
console.clear()：用于清除控制台内容。
console.table()：用于输出对象数组的表格形式。
console.group()：用于创建分组，可以嵌套使用。
console.groupEnd()：用于结束分组。
console.trace()：用于输出函数调用栈。
console.timeStamp()：用于输出时间戳。
console.markTimeline()：用于标记时间轴。
console.profile()：用于开始性能分析。
console.profileEnd()：用于结束性能分析。


javascript中格式化字符串
使用字符串的模板字面量（template literals）和字符串插值（string interpolation）可以格式化字符串。
const name = "Bob";
const age = 25;
const message = `My name is ${name} and I am ${age} years old.`;
console.log(message); // 输出: My name is Bob and I am 25 years old.

// 你还能在${}中放入表达式
const a = 10;
const b = 20;
const sum = `The sum is ${a + b}`;
console.log(sum); // 输出: The sum is 30


parseInt()和parseFloat()
parseInt()函数用于将字符串转换为整数，parseFloat()函数用于将字符串转换为浮点数。
const str = "123";
const num1 = parseInt(str);
const num2 = parseFloat(str);
console.log(num1);    // 输出: 123
console.log(num2);    // 输出: 123.0


parseInt("10");      // 返回 10
parseInt("10.5");    // 返回 10（会忽略小数点及后面的部分）
parseInt("20px");    // 返回 20（遇到非数字字符 "p" 时停止解析）
parseInt("  -123  "); // 返回 -123（会自动忽略字符串开头和结尾的空格）



# moment.js 中的 clone方法
在 JavaScript 中，对象和数组是引用类型。直接赋值变量只会复制引用（内存地址），而不会创建新的对象。这意味着修改一个变量会影响另一个变量：

const original = { name: "Alice" };
const copy = original; // 复制引用，而非对象本身

copy.name = "Bob";
console.log(original.name); // 输出 "Bob"，因为两个变量指向同一个对象

对于日期对象，如果不使用 clone() 直接修改，会影响原始日期：

const today = new Date();
const tomorrow = today; // 错误！没有创建新对象，只是复制引用

tomorrow.setDate(today.getDate() + 1);
console.log(today); // 原始日期也被修改了！


Moment.js 的 clone() 方法：
Moment.js 是一个专门处理日期的库，它的 clone() 方法用于创建一个新的 Moment 对象，其值与原对象相同。这样操作新对象不会影响原始对象。
const today = moment(); // 创建当前日期的 Moment 对象
const tomorrow = today.clone().add(1, 'days'); // 克隆并加一天

console.log(today.format('YYYY-MM-DD')); // 输出原始日期（例如：2025-06-03）
console.log(tomorrow.format('YYYY-MM-DD')); // 输出克隆后的日期（例如：2025-06-04）


数组方法 some（）用于测试数组中是否至少有一个元素通过某个条件
array.some(callback(element[, index[, array]])[, thisArg])

callback：对每个元素执行的回调函数
element：当前遍历的数组元素
返回值：如果至少有一个元素使回调函数返回 true，则返回 true，否则返回 false


字符串方法 includes() 用于判断字符串是否包含子字符串
str.includes(searchString[, position])
searchString
必需，要查找的子字符串。
position（可选）
从原字符串的哪个索引位置开始搜索，默认为 0（即从字符串开头搜索）。

例子
const str = "Hello, world!";

// 基本用法
console.log(str.includes("world")); // true
console.log(str.includes("World")); // false（区分大小写）

// 使用 position 参数
console.log(str.includes("world", 7)); // true（从索引 7 开始搜索）
console.log(str.includes("world", 8)); // false（从索引 8 开始搜索，找不到 "world"）

// 空字符串的情况
console.log(str.includes("")); // true（空字符串总是被视为包含）


# xlsx

const XLSX = require('xlsx');
const fs = require('fs');

// 读取Excel文件
const workbook = XLSX.readFile('example.xlsx');

// 获取所有表名
const sheetNames = workbook.SheetNames;
console.log('所有表名:', sheetNames);

// 获取指定工作表中的数据
const sheetName = sheetNames[0]; // 获取第一个工作表
const worksheet = workbook.Sheets[sheetName];

// 将工作表数据转换为JSON格式
const jsonData = XLSX.utils.sheet_to_json(worksheet);
console.log('工作表数据:', jsonData);

总结
使用 SheetJS 库（xlsx）操作 Excel 工作表的主要方法包括：

XLSX.readFile('filename.xlsx')：读取 Excel 文件。
workbook.SheetNames：获取所有表名。
workbook.Sheets[sheetName]：获取指定工作表。
XLSX.utils.sheet_to_json(worksheet)：将工作表数据转换为 JSON 格式。
XLSX.utils.json_to_sheet(jsonData)：将 JSON 数据转换为工作表。
XLSX.writeFile(workbook, 'filename.xlsx')：保存工作簿到文件。





```