const ME = require('./package.json');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');
const fhelper = require('./handles/file');
const lg = require('./handles/logger');
const Spark = require("./spark");
const PLUGIN_ROOT_DIR = './plugins/nodejs/sparkbridge2';
const logger = lg.getLogger('sparkbridge2');
const vm = require("node:vm");
process.on('unhandledRejection', (reason, promise) => {

});
var PLUGIN_DATA_DIR;

if (typeof mc !== 'undefined') {
    if (!fhelper.exists('./plugins/LeviLamina')) {
        PLUGIN_DATA_DIR = './plugins/nodejs/sparkbridge2/serverdata'

    }
    else {
        PLUGIN_DATA_DIR = './plugins/sparkbridge2/serverdata'
    }
} else {
    PLUGIN_DATA_DIR = './testdata'
}



if (fhelper.exists(PLUGIN_DATA_DIR) == false) fhelper.mkdir(PLUGIN_DATA_DIR);
console.log(fhelper.read(path.join(__dirname, 'logo.txt')));

let ROOT_FILE_HELPER = new fhelper.FileObj('base');
ROOT_FILE_HELPER.initFile('config.json', {
    target: "ws://127.0.0.1:3001",
    qid: 114514, pwd: '',
    onebot_mode_v11: true,
    ws_type: 0,
    server_port: 3001,
    debug:false
}
);
let RAW_CONFIG = ROOT_FILE_HELPER.getFile('config.json');
const CONFIG = JSON5.parse(RAW_CONFIG);

global.spark = new Spark(CONFIG.ws_type, CONFIG.target, CONFIG.server_port, CONFIG.qid, CONFIG.pwd);

spark.on("event.telemetry.ready", () => {
    const WebConfigBuilder = spark.telemetry.WebConfigBuilder;
    let wbc = new WebConfigBuilder("base");
    wbc.addText("target", CONFIG.target, "连接地址");
    wbc.addNumber("qid", CONFIG.qid, 'QQ号码');
    wbc.addChoosing("ws_type", ["正向WS", "反向WS"], CONFIG.ws_type, "websocket类型");
    wbc.addNumber("server_port", CONFIG.server_port, 'Websocket Server端口');
    wbc.addText("pwd", CONFIG.pwd, "连接密码（Access Token）");
    wbc.addSwitch('onebot_mode_v11', CONFIG.onebot_mode_v11, "是否使用onebot适配器");
    wbc.addSwitch("debug", CONFIG.debug, "开发者模式");
    //wbc.addChoosing("pl_priority_top", ["完全隔离", "可访问关键部件", '可访问内核'], CONFIG.pl_priority_top, "插件最高权限");
    spark.emit("event.telemetry.pushconfig", wbc);
});

spark.on("event.telemetry.updateconfig_base", (plname, K, newV) => {
    logger.info(`收到配置文件[${K}]更改请求，此项无法热重载， 请重启服务器`);
    CONFIG[K] = newV;
    ROOT_FILE_HELPER.updateFile('config.json', CONFIG);
    if (K == "debug") {
        spark.debug = newV;
        logger.info(`开发者模式已` + (newV == true ? "开启" : "关闭"));
    } else {
        
    }
});

const PermissionMap = {
    nor: 0,
    key : 1,
    core: 2
}

function ModuleLoaderInit(plugins_list){
    const WebConfigBuilder = spark.telemetry.WebConfigBuilder;
    let wbc = new WebConfigBuilder("ModuleLoader");
    plugins_list.forEach(v=>{
        let pl_info = require('./plugins/' + v + "/spark.json");
        wbc.addChoosing(`${v}_permission`, ["完全隔离", "可访问关键部件", '可访问内核'], PermissionMap[pl_info.permission],'插件最高权限');
    })
    spark.emit("event.telemetry.pushconfig", wbc);

    spark.on("event.telemetry.updateconfig_ModuleLoader", (plname, K, newV) => {
        let tgtname = K.split("_")[0];
        if (Object.keys(spark.plugins_list).includes(tgtname)){
            let pkpath = path.join(__dirname,'plugins',spark.plugins_list[tgtname].folder,'spark.json');
            try {
                // 确保文件路径是绝对路径
                const absolutePath = path.resolve(pkpath);
                // 读取文件内容
                const data =  fs.readFileSync(absolutePath, 'utf8');
                // 解析 JSON 数据
                let jsonData = JSON.parse(data);
                let pm_arr = ['nor','key','core'];
                jsonData.permission =pm_arr[newV];
                // 将修改后的 JSON 数据写回到文件
                fs.writeFileSync(absolutePath, JSON.stringify(jsonData, null, 2));
                // console.log(`文件已成功修改并保存：${absolutePath}`);
            } catch (error) {
                console.error(`处理文件时出错：${error}`);
            }
        }
    });
}


logger.info('SparkBridge载入中...VERSION:' + ME.version);
spark.VERSION = ME.VERSION;

if (typeof mc !== 'undefined') {
    spark.onBDS = true;
} else {
    spark.onBDS = false;
}

const PLUGINS_PATH = path.join(__dirname, 'plugins');
const plugins_list = fhelper.listdir(PLUGINS_PATH);

function VMrunCodeFromDir(perm,dirPath) {
    try {
        // 尝试读取 package.json 文件
        const packageJsonPath = path.join(dirPath, 'package.json');
        let mainFile = 'index.js'; // 默认入口文件
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            mainFile = packageJson.main || 'index.js'; // 如果有 package.json，则使用其指定的入口文件
        }

        // 获取入口文件的完整路径
        const filePath = path.join(dirPath, mainFile);

        // 读取入口文件内容
        const code = fs.readFileSync(filePath, 'utf8');

        let context = {};

        if(perm == 'key'){
            // key permission
            context = {
                console,
                setInterval,
                clearTimeout,
                spark,
                ll,
                require: (moduleName) => {
                    // 解析模块路径
                    const resolvedPath = require.resolve(moduleName, { paths: [dirPath] });
                    return require(resolvedPath);
                },
            };
        }else{
            // normal permission
            context = {
                console,
                setInterval,
                clearTimeout,
                spark,
                ll,
            };
        }

        // 创建一个 Script 对象
        let script = new vm.Script(code);

        // 在上下文中运行代码
        script.runInNewContext(context);

        logger.info(`插件 ${path.basename(dirPath)} 已成功从虚拟环境加载，入口文件：${mainFile}`);

    } catch (error) {
        console.error(`读取或执行插件 ${dirPath} 时出错：${error}`);
    }
}

// 优先级映射表
const priorityMap = {
    post: 0,  // 普通
    main: 1,  // 关键
    init: 2 , // 核心
    base: 3
};

function loadPlugin(_name) {
    try {
        // 读取 spark.json 文件
        let pl_info = require('./plugins/' + _name + "/spark.json");

        if (pl_info.loadmode) {
            if (pl_info.loadmode !== 'hybrid') {
                if (pl_info.loadmode == 'offline' && spark.onBDS) {
                    logger.info(`忽略 ${pl_info.name}，因在BDS模式下无法使用`);
                    return;
                }
                if (pl_info.loadmode == 'bds' && !spark.onBDS) {
                    logger.info(`忽略 ${pl_info.name}，因插件强制在BDS模式下使用`);
                    return;
                }
            }
        }

        if (pl_info.load) {
            if (pl_info.permission == 'core' || pl_info.permission == 'key') {
                let pl_obj = require('./plugins/' + _name);
            } else {
                VMrunCodeFromDir(pl_info.permission,'./plugins/' + _name)
        }
            // logger.info(`加载 ${pl_info.name}`);
            logger.info(`${pl_info.name} 加载完成，作者：${pl_info.author}`);
        } else {
            logger.info('跳过加载插件：' + _name);
        }
    } catch (err) {
        console.log(err);
        logger.error(`插件 ${_name} 加载失败`);
    }
}

function readPluginDir() {
    // 遍历plugins文件夹，找到list.json，按照list.json的顺序加载插件
    // 记录当前插件列表，如果在旧的中没有就新增

    // 这里获取旧插件list
    const plugins_load_list = JSON.parse(fhelper.read(path.join(__dirname, 'plugins', 'list.json')));
    // 这里遍历 plugins文件夹，读取spark.json
    const current_list = {};
    const plugins = fs.readdirSync(path.join(__dirname, 'plugins'));
    plugins.forEach(epl => {
        const sata = fs.statSync(path.join(__dirname, 'plugins', epl));
        if (!sata.isDirectory()) return;
        logger.info('读取 ' + epl);
        let i_info = JSON.parse(fhelper.read(path.join(__dirname, 'plugins', epl, 'spark.json')));
        const priorityValue = priorityMap[i_info.priority] || 0;
        current_list[i_info.name] = {
            name: i_info.name,
            folder: epl,
            priority: priorityValue
        };
    });

    // 对比当前插件列表和旧列表，有新增的就加到旧插件列表
    for (let i in current_list) {
        if (!plugins_load_list.includes(current_list[i].folder)) {
            // 新增插件
            logger.info('新增插件' + i);
            plugins_load_list.push(current_list[i].folder);
        }
    }

    // 移除不存在的插件
    for (let i = plugins_load_list.length - 1; i >= 0; i--) {
        const pluginFolder = plugins_load_list[i];
        if (!Object.values(current_list).some(plugin => plugin.folder === pluginFolder)) {
            logger.info('移除不存在的插件' + pluginFolder);
            plugins_load_list.splice(i, 1);
        }
    }

    logger.info('检测到了' + plugins_load_list.length + '个插件');
    bootUpPlugins(plugins_load_list, current_list);
}


function bootUpPlugins(plugins_load_list, current_list) {
    logger.info('开始加载插件');
    try {
        if (spark.debug) console.log(plugins_load_list);
        if (spark.debug) console.log(current_list);

        // 按照 priority 排序
        // pluginInfoList.sort((a, b) => b.priority - a.priority); // 降序排序，优先级高的先加载
        
        const pluginInfoArray = Object.values(current_list);

        // 按照 priority 降序排序
        pluginInfoArray.sort((a, b) => b.priority - a.priority);

        // 将排序后的数组重新转换为对象
        const sortedPluginInfoObj = {};
        pluginInfoArray.forEach(item => {
            sortedPluginInfoObj[item.name] = item;
        });

        for (let pl_info in sortedPluginInfoObj) {
            const { name, folder, priority } = sortedPluginInfoObj[pl_info];

            // 将优先级数值转换回字符串类型，用于日志输出
            const priorityStr = Object.keys(priorityMap).find(key => priorityMap[key] === priority);
            logger.info(`加载插件 ${name}，优先级为 ${priorityStr}`);
            loadPlugin(folder);
        }
        // 更新 list.json 文件
        fhelper.writeTo(path.join(__dirname, 'plugins', 'list.json'), JSON.stringify(plugins_load_list));
        if(CONFIG.debug){
            ModuleLoaderInit(plugins_load_list);
        }
        spark.plugins_list = sortedPluginInfoObj;
    } catch (e) {
        console.log(e);
    }
}

spark.debug = CONFIG.debug;

if (spark.onBDS) {
    ll.registerPlugin(
    /* name */ "sparkbridge2",
    /* introduction */ "a qq bot system",
    /* version */[2, 6, 0]
    );
    readPluginDir();
} else {
    // spark.debug = true;
    console.log('\n');
    logger.warn('====本地调试器====');
    logger.warn("您现在处于调试模式！！！");
    logger.warn("MC类将被覆盖");
    logger.warn("数据存储已转移到testdata文件夹")
    logger.warn('====本地调试器====\n');
    require('./handles/fakeapi');
    readPluginDir();
}

function moduleExists(moduleName) {
    try {
        // 尝试解析模块路径
        require.resolve(moduleName);
        return true; // 模块存在
    } catch (error) {
        return false; // 模块不存在
    }
}

// // 示例用法
// const moduleName = 'vm';
// if (moduleExists(moduleName)) {
//     console.log(`模块 ${moduleName} 存在`);
// } else {
//     console.log(`模块 ${moduleName} 不存在`);
// }