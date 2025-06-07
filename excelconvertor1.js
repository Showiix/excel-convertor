// 导入必要的模块
const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');

// 配置文件部分
const CONFIG = 
{
  START_DATE :  '2025-02-23', // 起始日期
  BASE_URL : 'https://abdnims.scnu.edu.cn/Atten-Backend', // 后端接口地址
  PAGE_SIZE : 350, // 每页数据量
  WHITE_LIST :  // 课程白名单
  [
],
NEED_EVENING_EARLY_START: { // 需要提前开始的课程及其适用班级 
    'DLK01460': ['24信管1班', '24信管2班'],
    'DLG34960': ['24软工2班'],
    '38HD1150': [], 
    '38HD1060': [],
    '38HD1250': [],
    '38HD1550': []
  },
};

Token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJ1c2VybmFtZSI6IjIwMjQzODAyNTQyNyIsIm5hbWUiOiLliJjmgZIiLCJncmFkZSI6IjIwMjQiLCJtYWpvcl9jbGFzcyI6Iui9r-S7tuW3peeoizHnj60iLCJpZCI6MjU1NSwicm9sZSI6IuWtpueUnyIsImlzX3N1cGVydXNlciI6ZmFsc2UsImlzX3N0YWZmIjpmYWxzZSwiZXhwIjoxNzQxNDE2NTEyfQ.fRoDkiYI83l9xNKIi93mxCV1jkXTcXfXi4PXVVuWos4';

//中文转阿拉伯数字，将课程表的数字，一，二，三转成1，2，3
function chineseToDigit(chineseStr){
    const map = {
    '一':'1', '二': '2', '三': '3', '四': '4', 
    '五': '5', '六': '6', '七': '7', '八': '8', 
    '九': '9', '零': '0'
};
return chineseStr.split('').map(char => map[char] || char).join('');
}

function generateCron(weekday, period) {
  // 课程节次与cron表达式时间的映射
  const timeMap = {
    1: '15 8 * *',   // 第1节课：8:15
    2: '5 9 * *',    // 第2节课：9:05
    3: '5 10 * *',   // 第3节课：10:05
    4: '55 10 * *',  // 第4节课：10:55
    5: '45 13 * *',  // 第5节课：13:45
    6: '35 14 * *',  // 第6节课：14:35
    7: '25 15 * *',  // 第7节课：15:25
    8: '35 16 * *',  // 第8节课：16:35
    9: '45 18 * *',  // 第9节课：18:45（晚课）
    10: '35 19 * *', // 第10节课：19:35
    11: '25 20 * *', // 第11节课：20:25
    12: '15 21 * *', // 第12节课：21:15
    15: '0 0 0 0'    // 特殊课程占位符
  };

  //周日转为0
  if (weekday === 7) weekday = 0;
  
  // 返回完整的cron表达式
  return `${timeMap[period] || timeMap[15]} ${weekday}`;
}
/**
 * 生成课程安排对象
 * 根据提供的课程信息创建课程安排对象
 * @param {moment} firstDay - 学期第一天的moment对象
 * @param {string[]} weeks - 课程所在的周数范围
 * @param {string} courseName - 课程名称
 * @param {number} weekday - 星期几（1-7）
 * @param {number[]} periods - 节次数组
 * @param {string} classroom - 教室名称
 * @param {string} className - 班级名称
 * @param {string} courseId - 课程ID
 * @param {string} classCompose - 班级组成描述
 * @returns {Object} 课程安排对象
 */
function createSchedule(firstDay,weeks,courseName,weekday,periods,classroom,className,courseId,classCompose,courseCompose)
{
  // 计算起始日期
const startDate = firstDay.clone().add((parseInt(weeks[0]) - 1) * 7, 'days');
  
  // 计算结束日期
  let endDate;
  // 如果只有一周的课程，则结束日期为第7天
  if (weeks.length === 1) {
    endDate = startDate.clone().add(6, 'days');
  } else {
    // 如果有两个周数，计算结束日期
    endDate = firstDay.clone().add(parseInt(weeks[1]) * 7 - 1, 'days');
  }

// 检查课程是否启用
  let isEnabled = CONFIG.WHITE_LIST.some(item => courseName.includes(item));

// 特殊班级处理 
  if (classCompose === '无') isEnabled = false; // 无班级组成则不启用
  if (courseName.includes('英语')) classCompose = className; // 英语课程特殊处理
    
  // 检查是否需要提前开始（针对晚课）
  let isEveningEarlyStart = false;
  if (CONFIG.NEED_EVENING_EARLY_START[courseId] && periods[0] === 9) {
    const requiredClasses = CONFIG.NEED_EVENING_EARLY_START[courseId];
    
    if (requiredClasses.length === 0) {
      // 空数组表示所有班级都需要提前开始
      isEveningEarlyStart = true;
    } else {
      // 检查班级组成是否符合要求
      const composes = classCompose.split('、');
      isEveningEarlyStart = composes.every(c => requiredClasses.includes(c));
    }
  }
return {
  startDate: startDate.format('YYYY-MM-DD'), // 开始日期
  endDate: endDate.format('YYYY-MM-DD'), // 结束日期
  courseName, // 课程名称
  weekday, // 星期几
  periods, // 节次数组
  classroom, // 教室名称
  className, // 班级名称
  courseId, // 课程ID
  isEnabled, // 是否启用
  isEveningEarlyStart, // 是否提前开始
  cron: generateCron(weekday, periods[0]), // cron表达式
  courseCompose, // 课程组成描述
  classCompose // 班级组成描述
};
}

function parseSchedule(filePath) 
{ 
 const workbook = xlsx.readFile(filePath); // 读
 const sheet = workbook.Sheets[workbook.SheetNames[0]]; //
 const data = xlsx.utils.sheet_to_json(sheet);
 // 处理数据

  const firstDay = moment(CONFIG.START_DATE);// 学期第一天

  const schedules = []; // 存储课程安排的数组

  const studentMap = new Map(); // 学生ID与姓名映射表

  const timeRegex = /星期(?<weekday>[1-7])第(?<periods>.+?)节{(?<weeks>.+?)周}/;
  
  // 遍历Excel中的每一行数据
  data.forEach(row => {

    // 提取课程信息
    const courseId = row['课程代码'] || '';
    const className = row['教学班'] || '';
    const courseName = `${row['教师姓名'] || ''}-${row['课程名称'] || ''}`;
    
    // 将 信息管理与信息系统(中外合作) 替换为 信管
    //将 软件工程(中外合作) 替换为 软工
    //将 人工智能(中外合作) 替换为 AI

    let classCompose = (row['教学班组成'] || '')
      .replace(/信息管理与信息系统\(中外合作\)/g, '信管')
      .replace(/软件工程\(中外合作\)/g, '软工')
      .replace(/人工智能\(中外合作\)/g, 'AI')
      .replace(/;/g, '、');
    
    // 创建课程唯一ID（用于关联课程和学生）
    const uniqueId = `${className}${courseName}${courseId}`;
    
    // 处理上课时间：转换为数字表示
    const rawTime = row['上课时间'] ? chineseToDigit(row['上课时间'].toString()) : '';
    // 使用正则表达式匹配上课时间
    const timeMatch = rawTime.match(timeRegex);
    
    // 处理教室信息：拆分为数组
    const classrooms = (row['教学地点'] || '').toString().split(';');
    
    // 提取学生信息
    const studentId = row['学号'] || '';
    const studentName = row['姓名'] || '';
    


    // 将学生信息添加到studentMap
    if (!studentMap.has(uniqueId)) {
      studentMap.set(uniqueId, new Map());
    }
    studentMap.get(uniqueId).set(studentId, studentName);
    
    // 处理没有上课时间的情况（特殊课程）
    if (!timeMatch) {
      // 使用"起始结束周"字段
      const weeks = (row['起始结束周'] || '').replace('周', '').split('-');
      if (weeks.length < 2) return; // 无效数据跳过
      
      // 创建课程安排对象（默认星期8表示特殊课程）
      const schedule = createSchedule(
        firstDay, weeks, courseName, 8, [1], 
        row['教学地点'], className, courseId, classCompose
      );
      schedule.uniqueId = uniqueId; // 添加唯一ID
      schedules.push(schedule);
      return;
    }
    
    // 解析上课时间信息
    const weekday = parseInt(timeMatch.groups.weekday); // 星期几（1-7）
    
    // 解析节次：处理连续节次（如1-3）和单节次（如4）
    const periods = timeMatch.groups.periods.split(',').flatMap(p => {
      const parts = p.split('-').map(Number);
      if (parts.length === 1) return [parts[0]]; // 单节次
      
      // 连续节次：生成节次范围数组
      const [start, end] = parts;
      return Array.from({length: end - start + 1}, (_, i) => start + i);
    });
    
    // 解析周次信息：处理单周、双周和连续周
    const weeks = timeMatch.groups.weeks.split(',').flatMap(w => {
      // 检查是否为单周或双周
      const isOdd = w.includes('(单)');
      const isEven = w.includes('(双)');
      // 清理周数字符串
      const cleanW = w.replace('周(单)', '').replace('周(双)', '').replace('周', '');
      const [start, end] = cleanW.split('-').map(Number);
      
      if (!end) return [start]; // 单周
      
      // 生成周数序列
      const allWeeks = Array.from({length: end - start + 1}, (_, i) => start + i);
      
      // 根据单双周筛选
      if (isOdd) return allWeeks.filter(w => w % 2 === 1);
      if (isEven) return allWeeks.filter(w => w % 2 === 0);
      return allWeeks; // 普通连续周
    });
    
    // 为每个周次创建课程安排
    weeks.forEach((week, i) => {
      // 获取教室：尝试按索引获取，否则使用第一个或空字符串
      const classroom = classrooms[i] || classrooms[0] || '';
      
      // 创建课程安排对象
      const schedule = createSchedule(
        firstDay, [week], courseName, weekday, periods, 
        classroom, className, courseId, classCompose
      );
      schedule.uniqueId = uniqueId; // 添加唯一ID
      schedules.push(schedule);
    });
  });return {
  schedules, // 课程安排数组
  // 将Map转换为普通对象：{uniqueId: {studentId, studentName}}
  students: Object.fromEntries(
    Array.from(studentMap).map(([id, student]) => [id, student])
  )
};
}

function mergeConsecutiveCourses(schedules) {
  const merged = []; // 存储合并后的课程
  const skipIndexes = new Set(); // 记录已合并的课程索引
  
  // 遍历所有课程
  for (let i = 0; i < schedules.length; i++) {
    // 跳过已合并的课程
    if (skipIndexes.has(i)) continue;
    
    const current = schedules[i];
    let mergedCourse = {...current}; // 创建当前课程的副本
    let foundMerge = false; // 标记是否找到可合并的课程
    
    // 查找后续可合并的课程
    for (let j = i + 1; j < schedules.length; j++) {
      // 跳过已合并的课程
      if (skipIndexes.has(j)) continue;
      
      const next = schedules[j];
      
      // 检查合并条件：
      // 1. 同一班级
      // 2. 同一天（相同的开始/结束日期和星期）
      // 3. 节次连续（如第3节和第4节）
      // 4. 不在每4节课的边界（避免跨大节合并）
      const sameClass = current.className === next.className;
      const sameDay = current.startDate === next.startDate && 
                     current.endDate === next.endDate &&
                     current.weekday === next.weekday;
      const consecutive = current.periods[current.periods.length - 1] + 1 === next.periods[0];
      const validPeriod = current.periods[current.periods.length - 1] % 4 !== 0;
      
      // 如果满足合并条件
      if (sameClass && sameDay && consecutive && validPeriod) {
        // 合并节次：将下一课程的节次添加到当前课程
        mergedCourse.periods = [...current.periods, ...next.periods];
        // 更新课程名称
        mergedCourse.courseName += '（理论+实验）';
        // 标记下一课程已合并
        skipIndexes.add(j);
        foundMerge = true;
      }
    }
    
    // 如果找到可合并的课程，添加合并后的课程；否则添加原始课程
    merged.push(foundMerge ? mergedCourse : current);
    // 如果合并了课程，标记当前课程已处理
    if (foundMerge) skipIndexes.add(i);
  }
  
  return merged;
}
// 生成选课记录
function createEnrollments(schedules, studentData) {
  const enrollments = []; // 存储选课记录
  const processed = new Set(); // 记录已处理的课程ID
  
  // 遍历所有课程
  schedules.forEach(schedule => {
    const uniqueId = schedule.uniqueId;
    
    // 跳过已处理的课程或没有学生数据的课程
     if (processed.has(uniqueId)) return;
    if (!studentData[uniqueId]) return;
    
    // 标记该课程已处理
    processed.add(uniqueId);
    
    // 为该课程的每个学生创建选课记录
    Object.entries(studentData[uniqueId]).forEach(([studentId, studentName]) => {
      enrollments.push({
        courseName: schedule.courseName, // 课程名称
        className: schedule.className,   // 班级名称
        studentID: studentId,            // 学生学号
        studentName                      // 学生姓名
      });
    });
  });
  
  return enrollments;
}


//导入数据到API

async function importData(schedules, enrollments) {
  // 导入课程安排
  console.log('开始导入课程安排...');
  const scheduleChunks = [];
  
  // 将课程安排分块（每块CONFIG.PAGE_SIZE条记录）
  for (let i = 0; i < schedules.length; i += CONFIG.PAGE_SIZE) {
    scheduleChunks.push(schedules.slice(i, i + CONFIG.PAGE_SIZE));
  }
  
  // 逐块发送请求
  for (const chunk of scheduleChunks) {
    try {
      // 发送POST请求到课程安排导入API
      const response = await axios.post(
        `${CONFIG.BASE_URL}/admin/importScheduleRecords`,
        { schedules: chunk }, // 请求体
        { 
          headers: { 
            Authorization: CONFIG.TOKEN, // 使用配置中的令牌
            'Content-Type': 'application/json' 
          } 
        }
      );
      console.log(`导入进度: ${chunk.length}条, 状态: ${response.status}`);
    } catch (error) {
      // 错误处理：输出详细的错误信息
      console.error('导入失败:', error.response?.data || error.message);
      // 输出当前块数据以便调试
      console.error('失败数据:', JSON.stringify(chunk, null, 2));
    }
    // 等待100毫秒，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 导入选课记录
  console.log('\n开始导入选课记录...');
  const enrollChunks = [];
  
  // 将选课记录分块
  for (let i = 0; i < enrollments.length; i += CONFIG.PAGE_SIZE) {
    enrollChunks.push(enrollments.slice(i, i + CONFIG.PAGE_SIZE));
  }
  
  // 逐块发送请求
  for (const chunk of enrollChunks) {
    try {
      // 发送POST请求到选课记录导入API
      const response = await axios.post(
        `${CONFIG.BASE_URL}/admin/importEnrollmentRecords`,
        { enrollments: chunk },
        { 
          headers: { 
            Authorization: CONFIG.TOKEN,
            'Content-Type': 'application/json' 
          } 
        }
      );
      console.log(`导入进度: ${chunk.length}条, 状态: ${response.status}`);
    } catch (error) {
      console.error('导入失败:', error.response?.data || error.message);
      console.error('失败数据:', JSON.stringify(chunk, null, 2));
    }
    // 等待500毫秒，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// 主程序
async function main() {
  try {
    const filePath = '/Users/showiix/Downloads/选课名单查询.xlsx'; // Excel文件路径
    const outputDir = '/Users/showiix/Downloads/output';    // 输出目录
    
    console.log('开始处理课程表数据...');
    
    // 1. 创建输出目录（如果不存在）
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
      console.log(`创建输出目录: ${outputDir}`);
    }
    
    // 2. 解析Excel文件
    console.log('解析Excel文件...');
    const { schedules: rawSchedules, students } = parseSchedule(filePath);
    console.log(`解析完成: 找到 ${rawSchedules.length} 条课程安排, ${Object.keys(students).length} 门课程的学生数据`);
    
    // 3. 合并连续课程（如理论+实验）
    console.log('合并连续课程...');
    const mergedSchedules = mergeConsecutiveCourses(rawSchedules);
    console.log(`合并完成: 原始 ${rawSchedules.length} 条, 合并后 ${mergedSchedules.length} 条`);
    
    // 4. 生成选课记录
    console.log('生成选课记录...');
    const enrollments = createEnrollments(mergedSchedules, students);
    console.log(`生成完成: ${enrollments.length} 条选课记录`);
    
    // 5. 保存JSON文件
    console.log('保存JSON文件...');
    fs.writeFileSync(`${outputDir}/schedules.json`, JSON.stringify(mergedSchedules, null, 2));
    fs.writeFileSync(`${outputDir}/enrollments.json`, JSON.stringify(enrollments, null, 2));
    fs.writeFileSync(`${outputDir}/students.json`, JSON.stringify(students, null, 2));
    console.log(`JSON文件已保存到 ${outputDir} 目录`);
      
    // 6. 导入到API
    const needImport = true; // 设为false则不导入
    if (needImport) {
      console.log('\n开始导入API...');
      await importData(mergedSchedules, enrollments);
      console.log('数据导入完成');
    }
    console.log('\n处理完成!');

  } catch (error) {
    // 全局错误处理
    console.error('处理过程中发生错误:');
    console.error(error.stack); // 打印完整的错误堆栈
    process.exit(1); // 以错误状态退出
  }
}


main();