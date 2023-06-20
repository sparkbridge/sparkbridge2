const EventEmitter = require("events");
const JSON5 = require('json5');
const _config = spark.getFileHelper('mc');

_config.initFile('config.json', {
    group: 114514,
    admins: [],
    switch: {
        chat: true,
        cmd: true,
        join: true,
        left: true
    }
});

_config.initFile('xbox.json', {});


var config = JSON5.parse(_config.getFile('config.json'));
var xboxs = JSON.parse(_config.getFile('xbox.json'));

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
    return xboxs[qid] ?? '未绑定';
}

function addXbox(qid, xbox) {
    xboxs[qid] = xbox;
    _config.updateFile('xbox.json', xboxs);
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

spark.mc.remXboxByName = remXboxByName;
spark.mc.addXbox = addXbox;
spark.mc.remXboxByQid = remXboxByQid;
spark.mc.getXbox = getXbox;