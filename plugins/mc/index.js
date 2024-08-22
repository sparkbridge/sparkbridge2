const EventEmitter = require("events");
const JSON5 = require('json5');
const _config = spark.getFileHelper('mc');

_config.initFile('config.json', {
    group: 114514,
    admins: []
});

_config.initFile('xbox.json', {});

function convertArrayToNumbersSafe(arr) {
  return arr.map(item => {
    const number = Number(item);
    return isNaN(number) ? 0 : number;
  });
}
var config = JSON5.parse(_config.getFile('config.json'));
var xboxs = JSON.parse(_config.getFile('xbox.json'));

const  WebConfigBuilder   = spark.telemetry.WebConfigBuilder;
let wbc = new WebConfigBuilder("mc");
wbc.addNumber("group",config.group,"监听的群聊");
wbc.addEditArray("admins",config.admins,"管理员列表（请仅填入数字）");
spark.emit("event.telemetry.pushconfig", wbc);

spark.on("event.telemetry.updateconfig_mc",(plname,K,newV)=>{
    let v = newV;
    if(K == 'admins'){
        v = convertArrayToNumbersSafe(newV);
    }
    config[K] = v;
    _config.updateFile("config.json",config);
})

spark.setOwnProperty('mc', {});
spark.mc.config = config;
const eventmitter = new EventEmitter();
//spark.mc['eventmitter'] = eventmitter;

spark.mc.on = eventmitter.on;
spark.mc.emit = eventmitter.emit;

mc.listen('onChat', (p, m) => {
    spark.mc.emit('onChat', p, m);
});

mc.listen('onLeft', (p) => {
    spark.mc.emit('onLeft', p);
});

mc.listen('onJoin', (p) => {
    spark.mc.emit('onJoin', p);
});

function getXbox(qid){
    return xboxs[qid];
}

function addXbox(qid, xbox) {
    xboxs[qid] = xbox;
    _config.updateFile('xbox.json', xboxs);
}

function hasXbox(xboxid){
    return Object.values(xboxs).includes(xboxid);
}

function remXboxByName(xbox) {
    let t = Object.values(xboxs);
    if (t.includes(xbox)) {
        let num = t.indexOf(xbox);
        delete xboxs[Object.keys(xboxs)[num]];
        _config.updateFile('xbox.json', xboxs);
    }
}

function remXboxByQid(qid) {
    if (xboxs[qid] == undefined) return;
    delete xboxs[qid];
    _config.updateFile('xbox.json', xboxs);
}
function getQQByXbox(xbox) {
    return Object.keys(xboxs).find(key => xboxs[key] === xbox);
}


spark.mc.remXboxByName = remXboxByName;
spark.mc.addXbox = addXbox;
spark.mc.remXboxByQid = remXboxByQid;
spark.mc.getXbox = getXbox;
spark.mc.hasXbox = hasXbox;
spark.mc.getQQByXbox = getQQByXbox;