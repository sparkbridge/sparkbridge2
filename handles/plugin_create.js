// ./handles/createPlugin.js
const fs = require('fs');
const path = require('path');

// 获取用户输入的第一个参数（插件名称）
const pluginName = process.argv[2];

if (!pluginName) {
    console.error('请提供插件名称作为参数！');
    process.exit(1);
}

// 目标路径：./plugins/[用户输入的参数]
const pluginDir = path.join(__dirname, '../plugins', pluginName);
const sparkJsonPath = path.join(pluginDir, 'spark.json');

// 创建插件目录（如果不存在）
if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
    console.log(`目录已创建：${pluginDir}`);
}

// 写入 spark.json 文件
const sparkJsonContent = {
    author:"noman",
    name: pluginName,
    version: [0,0,1],
    description: "由生成器生成的模板描述",
    loadmode: "hybrid",
    permission: "key",
    priority: "post",
    load: true
};

fs.writeFileSync(
    sparkJsonPath,
    JSON.stringify(sparkJsonContent, null, 2) // 格式化缩进
);

console.log(`spark.json 已生成：${sparkJsonPath}`);