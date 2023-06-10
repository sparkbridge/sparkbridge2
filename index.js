// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\zhouying\Documents/dts/helperlib/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "sparkbridge2",
    /* introduction */ "a qq bot system",
    /* version */ [2,0,1]
); 


const ME = require('./package.json');
const JSON5 = require('json5');
const path = require('path');
const fhelper = require('./handles/file');
const Spark = require('./spark');
const lg = require('./handles/logger');
const PLUGIN_ROOT_DIR = './plugins/nodejs/sparkbridge2';
const PLUGIN_DATA_DIR = './plugins/sparkbridge2';
if(fhelper.exists(PLUGIN_DATA_DIR) == false) fhelper.mkdir(PLUGIN_DATA_DIR);
console.log(fhelper.read(PLUGIN_ROOT_DIR+'/logo.txt'));

let ROOT_FILE_HELPER =new fhelper.FileObj('base');
ROOT_FILE_HELPER.initFile('config.json',{target:"ws://127.0.0.1:8080",qid:114514,pwd:''});
let RAW_CONFIG = ROOT_FILE_HELPER.getFile('config.json');
const CONFIG = JSON.parse(RAW_CONFIG);

global.spark = new Spark(CONFIG.target,CONFIG.qid,CONFIG.pwd);

const logger = lg.getLogger('sparkbridge2')

mc.listen('onServerStarted', () => {
    const PLUGINS_PATH = path.join(__dirname, 'plugins\\');
    const plugins_list = fhelper.listdir(PLUGINS_PATH);
    const laodPlugin = (_name) =>{
        try {
            let pl_obj = require('./plugins/'+_name);
            let pl_info = require('./plugins/'+_name+"/spark.json")
            logger.info(`加载 ${pl_info.name}`);
            //pl_obj.onStart(_adapter);
            logger.info(`${pl_info.name} 加载完成，作者：${pl_info.author}`);
        } catch (err) {
            console.log(err);
            logger.error(`插件 ${_name} 加载失败`);
        }
    }
    laodPlugin('bridgebase')
})