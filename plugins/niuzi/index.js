//spark.debug = true;
const msgbuilder = require('../../handles/msgbuilder');

const _config = spark.getFileHelper('niuzi');
_config.initFile('config.json', {
    default_name: '牛子',
    pkCd: 10,
    convertConst: 500
});
_config.initFile('commands.json', {
    '^领养牛子$': 'niuzi_get',
    '^比划比划': 'niuzi_pk',
    '^改牛子名(.+)': 'niuzi_rename',
    '^处理请求 (.+) (.+)': 'niuzi_handle',
    '^搞对象': 'niuzi_marry',
    '^贴贴[\\!！]$': 'niuzi_teetee',
    '^我要分手$': 'niuzi_break',
    '^牛子榜$': 'niuzi_balance',
    '^我的对象$': 'niuzi_elephant',
    '^我的牛子$': 'niuzi_me'
});
_config.initFile('lang.json', {
    no_niuzi: '你还没有牛子！输入“领养牛子”来获取牛子',
    target_no_niuzi: '对方没有牛子！',
    target_has_elephant: '对方已经有对象了',
    has_elephat:'你已经有对象了',
    get_success: '领养成功，输入“我的牛子”查看详情',
    get_already: '你已经有一个牛子了',
    no_elephant: '你还没有对象',
    no_target: '找不到目标'
})
_config.initFile('niuzi_data.json', {});

const config = JSON.parse(_config.getFile('config.json'));
const commands = JSON.parse(_config.getFile('commands.json'));
const niuzi_data = JSON.parse(_config.getFile('niuzi_data.json'));
const lang = JSON.parse(_config.getFile('lang.json'));
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

function has_niuzi(qid) {
    return niuzi_data[qid] !== undefined;
}

function get_niuzi_data(qid) {
    return niuzi_data[qid];
}

function save_niuzi() {
    _config.updateFile('niuzi_data.json', niuzi_data);
}

function get_niuzi(qid) {
    if (has_niuzi(qid) == false) {
        niuzi_data[qid] = {
            name: config.default_name,
            long: randomNum(1, 50),
            elephant: null,
            tee_cd: 0,
            red_cd: 0
        }
        save_niuzi()
        return true;
    } else {
        return false;
    }
}

function reduce_niuzi(qid, long) {
    niuzi_data[qid].long -= long;
    save_niuzi();
}

function grow_niuzi(qid, long) {
    niuzi_data[qid].long += long;
    save_niuzi();
}

for (let k in commands) {
    spark.Cmd.addRegex(k, { cmd: commands[k], adm: false });
}

/*

spark.on('message.group.normal',(e,reply)=>{

})

spark.Cmd.addRegex('^领养牛子$',{cmd:'niuzi_get',adm:false});
*/

function buildString(k, e) {
    return spark.Cmd.buildString(k, [], e);
}

spark.Cmd.regCmd('niuzi_get', (cmd, reg, e, reply) => {
    let get = get_niuzi(e.sender.user_id);
    if (get) {
        reply(buildString(lang.get_success, e), true);
    } else {
        reply(buildString(lang.get_already, e), true);
    }
});

spark.Cmd.regCmd('niuzi_me', (cmd, reg, e, reply) => {
    if (get_niuzi(e.sender.user_id) == undefined) {
        reply(buildString(lang.no_niuzi, e),true);
    } else {
        let niuzi = get_niuzi_data(e.sender.user_id);
        reply(`名字：${niuzi.name}\n长度：${niuzi.long}`, true)
    }
});

spark.Cmd.regCmd('niuzi_elephant', (cmd, reg, e, reply) => {
    if (get_niuzi(e.sender.user_id) == undefined) {
        reply(buildString(lang.no_niuzi, e));
    } else {
        let niuzi = get_niuzi_data(e.sender.user_id);
        if (niuzi.elephant !== null) {
            spark.QClient.getGroupMemberInfo(spark.mc.config.group, niuzi.elephant).then(res => {
                //console.log(res);
                let duix = get_niuzi_data(niuzi.elephant);
                reply(`QQ：${niuzi.elephant}\n名字：${res.card}\n长度：${duix.long}`, true);
            }).catch(console.log);
        } else {
            //console.log(lang.no_elephant);
            reply(buildString(lang.no_elephant, e), true);
        }
    }
});

function pk() {
    let win = randomNum(0, 11);
    if (win > 5) {
        return true;
    } else {
        return false;
    }
}

spark.Cmd.regCmd('niuzi_pk', (cmd, reg, e, reply) => {
    var target = 0;
    // console.log('pk')
    e.message.forEach(e => {
        if (e.type == 'at') {
            target = e.data.qq;
        }
    });
    if (target == 0) {
        reply(buildString(lang.no_target, e), true);
        return;
    }
    if(target == e.sender.user_id){
        return;
    }
    if (has_niuzi(target) == false) {
        reply(buildString(lang.target_no_niuzi, e), true);
        return;
    }
    spark.QClient.getGroupMemberInfo(spark.mc.config.group, target).then(res => {
        let win = pk();
        let s = get_niuzi_data(e.sender.user_id);
        let b = get_niuzi_data(target);
        if(s.red_cd !== 0){
            let less = s.red_cd - new Date().getTime();
            if(less > 0){
                reply(`你的牛子红肿了，等 ${(less/6e4).toFixed(1)} 分钟`)
                return;
            }
        }
        if(b.red_cd !== 0){
            let less = b.red_cd - new Date().getTime();
            if(less > 0){
                reply(`对方的牛子红肿了，等 ${(less/6e4).toFixed(1)} 分钟`)
                return;
            }
        }
        if (win) {
            let lg = randomNum(0, b.long + 50);
            reduce_niuzi(target, lg);
            grow_niuzi(e.sender.user_id, lg);
            reply(`${res.card} 与 ${e.sender.card} 开始比划牛子，赢到了${Math.abs(lg)} 厘米`);
        } else {
            let lg = randomNum(0, s.long + 50);
            grow_niuzi(target, lg);
            reduce_niuzi(e.sender.user_id, lg);
            reply(`${res.card} 与 ${e.sender.card} 开始比划牛子，输掉了${Math.abs(lg)} 厘米`);
        }
        let cd =new Date().getTime()+ config.pkCd * 60000;
        niuzi_data[target].red_cd = cd;
        niuzi_data[e.sender.user_id].red_cd = cd;
        save_niuzi()
    }).catch(console.log);

});


spark.Cmd.regCmd('niuzi_rename', (cmd, reg, e, reply) => {
    var name = reg[1];
    // console.log(name);
    if (name.length > 20) {
        reply('名字长度过长',true);
        return;
    }
    niuzi_data[e.sender.user_id].name = name.trim();
    save_niuzi();
    reply('你的牛子已重命名为：' + name, true);
});

const marry_apply = {};

spark.Cmd.regCmd('niuzi_marry',(cmd,reg,e,reply)=>{
    var target = 0;
    // console.log('pk')
    e.message.forEach(e => {
        if (e.type == 'at') {
            target = e.data.qq;
        }
    });
    if (target == 0) {
        reply(buildString(lang.no_target, e), true);
        return;
    }
    if(target == e.sender.user_id){
        return;
    }
    if (has_niuzi(target) == false) {
        reply(buildString(lang.target_no_niuzi, e), true);
        return;
    }
    let s = get_niuzi_data(e.sender.user_id);
    let b = get_niuzi_data(target);
    if(b.elephant !== null){
        reply(buildString(lang.target_has_elephant,e),true);
        return;
    }
    if(s.elephant !== null){
        reply(buildString(lang.has_elephat,e),true);
        return;
    }
    marry_apply[target] = e.sender.user_id;
    reply('已经暂存你的请求，有效期五分钟\n对方发送“处理请求 处对象 同意”即可成功处对象');
});