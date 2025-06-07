# Excel Convertor实现文档

## 功能描述

Excel Convertor是一个基于Nodejs的开源项目，用于将Excel文件转换为json格式文件

## 安装依赖
在项目根目录下执行以下命令安装依赖：
```bash
npm install
```

## 模块化实现思路
Excel Convertor采用模块化的实现方式，将代码划分为以下几个模块：
1. 导入模块
2. 配置部分
 - 学期开始日期
 - api相关配置
    - api地址
    - api认证令牌
 - 课程白名单（制定需要处理的课程）


## 核心函数实现

1. chineseToDigit函数
 - 功能：将中文数字转换为阿拉伯数字，以便后续处理

2. generateCron函数
 - 功能：根据学期开始日期和周数生成Cron表达式，用于定时任务

3. createSchedule函数
 - 功能：计算课程开始日期
 - 计算逻辑：开始日期 = 学期第一天 + (第一周周数 - 1)×7 天
  结束日期 = 学期第一天 + 最后一周周数 ×7 天（多周课程）

 - 功能：检查课程是否启用
 - 功能：检查是否需要提前开始

4. 创建并返回对象


5. paraSchedule函数
 - 功能：处理Excel文件，将其转换为json格式文件
 - 功能：将json格式文件写入到指定的目录下
  
代码部分
```javascript


