const logger = spark.getLogger('regex');
const JSON5 = require('json5');
spark.setOwnProperty('Cmd', {});


let JandQuitConfig = JSON.parse(spark.getFileHelper('JandLandCmsg').getFile('config.json'))


const WebConfigBuilder = spark.telemetry.WebConfigBuilder;
let wbc = new WebConfigBuilder("Regex");
wbc.addButtom("regex_penal", () => {
    return {
        status: 303, // 跳转状态码为303
        url: "http://reg.sparkbridge.cn"
    }
}, "跳转到正则表达式编辑面板");
spark.emit("event.telemetry.pushconfig", wbc);

/**
 * 
 * @param {String} str 
 * @param {RegExpMatchArray} reg 
 * @returns 
 */
function buildString(str, reg, ...arg) {
    if (spark.debug) console.log(reg);
    let i = 0;
    reg.forEach(s => {
        str = str.replace(`\$${i}`, s);
        i++
    });
    if (str.includes("%")) {
        let str_arr = buildPlaceHolder(str);
        return str_arr.map((t) => {
            if (t.type == 'holder') {
                return getPlaceHolder(t.raw, ...arg);
            } else {
                return t.raw;
            }
        }).join("");
    } else {
        return str;
    }
}

spark.Cmd.buildString = buildString;

function getPlaceHolder(key, ...arg) {
    if (PlaceHolders.has(key)) {
        return PlaceHolders.get(key)(...arg);
    } else {
        return 'null';
    }
}

function buildPlaceHolder(raw) {
    let out_raw = [];
    // 是否正在匹配
    let matching = false;
    // 正在匹配的字符串
    let matching_now = '';
    // 是否跳过当前转义
    let skip_next = false;
    for (let i in raw) {
        let now_i = raw[i];
        //console.log('匹配：'+now_i);
        if (skip_next == false) { // 需要进行变量判断
            if (now_i == '\\') {  // 需要直接写入下一位
                skip_next = true;
                //console.log('跳过判断下一位');
            } else if (now_i == '%') {
                // 开始或者结束匹配变量
                if (matching) {
                    matching = false;
                    out_raw.push({ type: 'holder', raw: matching_now });
                    matching_now = '';
                } else {
                    matching = true;
                }
            } else {
                if (matching) {
                    matching_now += now_i;
                } else {
                    out_raw.push({ type: 'plan', raw: now_i })
                }
            }
        } else { //需要直接写入当前字符串
            out_raw.push({ type: 'plan', raw: now_i })
            skip_next = false;
        }
    }
    return out_raw;
}

spark.Cmd.buildPlaceHolder = buildPlaceHolder;



const Cmds = new Map();

function regCmd(head, cb) {
    Cmds.set(head, cb);
}

spark.Cmd.regCmd = regCmd;

function runCmd(_first, _args, reg, e, reply) {
    if (Cmds.has(_first)) {
        try {
            Cmds.get(_first)(_args, reg, e, reply);
        } catch (err) { console.log(err) }
    }
}

regCmd('reply', (_arg, reg, e, reply) => {
    let txt1 = buildString(_arg, reg, e);
    reply(txt1.replace(/§[a-zA-Z0-9]/g, ''), true);
});

regCmd('f', (_arg, reg, e, reply) => {
    let t_and_a = _arg.split(':');
    if (t_and_a.length == 0) {
        logger.warn(`执行正则表达式遇到错误：参数不足，请指定私聊联系人`);
    }
    let target = t_and_a[0];
    let arg = t_and_a[1];
    spark.QClient.sendPrivateMsg(Number(target), buildString(arg, reg, e))
});

regCmd('g', (_arg, reg, e, reply) => {
    let t_and_a = _arg.split(':');
    if (t_and_a.length == 0) {
        logger.warn(`执行正则表达式遇到错误：参数不足，请指定群号`);
    }
    let target = t_and_a[0];
    let arg = t_and_a[1];
    spark.QClient.sendGroupMsg(Number(target), buildString(arg, reg, e))
})

regCmd('t', (arg, reg, e, reply) => {
    let t_and_m = arg.split(':');
    let tp = t_and_m[0];
    let ms = t_and_m[1];

    if (tp == 'all') {
        let tellallMsg = buildString(ms, reg, e).trim()
        // console.log(tellallMsg)
        if (tellallMsg.length > JandQuitConfig.chatMaxLength + ms.replace(/\$1/g, '').length) {
            tellallMsg = '[群聊]聊天长度过长，将不会转发'
        }

        mc.broadcast(tellallMsg);
    } else {
        let top = mc.getPlayer(tp);
        if (top) {
            top.tell(buildString(ms, reg, e));
        }
    }
})
regCmd('run', (arg, reg, e, reply) => {
    let command = arg;
    let run_str = buildString(command, reg, e).trim();
    let r = mc.runcmdEx(run_str);
    if (!r.success) {
        reply(run_str + '执行失败');
    }
    else {
        // 没有
        reply(r.output.replace(/§[a-zA-Z0-9]/g, ''), true);
    }
})

regCmd('addwl', (arg, reg, e, reply) => {
    let command = arg.split(":");
    let xboxid = buildString(command[0], reg, e).trim();
    if (!spark.mc.hasXbox(xboxid) && spark.mc.getXbox(e.user_id) == undefined) {
        spark.mc.addXbox(e.user_id, xboxid);
        reply(xboxid + '绑定成功', true);
        if (command[1] == 'true') {
            mc.runcmd('allowlist add "' + xboxid + '"');
        }
    }
    else {
        reply('绑定失败，请检查是否已经绑定', true);
    }
})

regCmd('remwl', (arg, reg, e, reply) => {
    //console.log(e);
    //console.log(spark.mc.getXbox(e.sender.user_id));
    if (spark.mc.getXbox(e.sender.user_id) != undefined) {
        let xb = spark.mc.getXbox(e.user_id);
        spark.mc.remXboxByQid(e.sender.user_id);
        reply('解绑成功', true);
        mc.runcmd('allowlist remove "' + xb + '"');
    }
});

/**
 * 
 * @param {String} cmd 
 */
function commandParse(cmd, reg, e, reply) {
    let items = cmd.split("|");
    if (items.length == 1) {
        //logger.warn(`执行正则表达式：${cmd} 遇到错误：参数不足，请写入参数`);
    }
    let _first = items[0];
    let _arg = items[1];
    if (spark.debug)
        logger.info('执行正则表达式命令：' + _first + ',参数：' + _arg);
    runCmd(_first, _arg, reg, e, reply);
}

const PlaceHolders = new Map();

function regPlaceHolder(key, recall) {
    PlaceHolders.set(key, recall);
}

spark.Cmd.regPlaceHolder = regPlaceHolder;

spark.Cmd.addRegex = (key, item) => {
    if (regexs[key] != undefined) return false;
    regexs[key] = item;
    return true;
}

const GROUP = spark.mc.config.group;
const ADMINS = spark.mc.config.admins;

const _config = spark.getFileHelper('regex');
const PRE_CONFIG = {
    "^我是(.+)": {
        cmd: 'reply|你是$1',
        adm: false
    },
    "^bot测试": {
        cmd: 'reply|已上线',
        adm: true
    },
    "^绑定(.+)": {
        cmd: 'addwl|$1:true',
        adm: false
    },
    "^解绑": {
        cmd: 'remwl|$1',
        adm: false
    },
    "^查服": {
        cmd: 'run|list',
        adm: false
    },
    "^chat (.+)": {
        cmd: 't|all:[群聊]%USER_XBOXID% >> $1',
        adm: false
    },
    "^执行(.+)": {
        cmd: 'run|$1',
        adm: true
    }
}

_config.initFile('data.json', PRE_CONFIG, false);
const regexs = JSON5.parse(_config.getFile('data.json'));

function formatMsg(msg) {
    const formattedMessages = msg.map((t) => {
        switch (t.type) {
            case 'at':
                try {
                    if (spark.mc.getXbox(t.data.qq) == undefined) {
                        // const data = await spark.QClient.getGroupMemberInfo(spark.mc.config.group, t.data.qq);
                        // if (data) {
                        //     let name
                        //     if (data.card == "") {
                        //         name = data.nickname;
                        //     }
                        //     else {
                        //         name = data.card;
                        //     }
                        //     return '@' + name;
                        // } else {
                        //     return '@' + t.data.qq;
                        // }
                        return '@' + t.data.qq;
                    } else {
                        return '@' + spark.mc.getXbox(t.data.qq);
                    }
                } catch (error) {
                    console.error(error);
                    return '@' + t.data.qq;
                }
            case 'text':
                return t.data.text;
            case 'image':
                return '[图片]';
            case 'face':
                return '[表情]';
        }
    });

    return formattedMessages.join('');
}

//spark.debug = true;
spark.on('message.group.normal',  (e, reply) => {
    //reply("?")
    const { raw_message, group_id, user_id } = e;
    //console.log(raw_message, group_id, user_id ,GROUP);
    const raw =  formatMsg(e.message);

    //console.log(raw);
    if (group_id !== GROUP) return;
    for (let reg_it in regexs) {
        //console.log(reg_it);

        let tmp = raw.match(reg_it);
        if (tmp == null) continue;
        if (spark.debug) console.log('regex working...', reg_it);
        if (regexs[reg_it].adm == true && !ADMINS.includes(user_id)) {
            reply("执行失败，权限不足");
            return;
        }
        try {
            regexs[reg_it].cmd.split(';').forEach(regtmp => {
                commandParse(regtmp, tmp, e, reply);

            })
        } catch (err) {
            console.log(err);
        }
    }
});


spark.on('notice.group_decrease', (e) => {

    const { self_id, user_id, group_id } = e;
    if (group_id != spark.mc.config.group || user_id == self_id) return
    if (spark.mc.getXbox(user_id) != undefined) {
        let xb = spark.mc.getXbox(user_id);
        spark.mc.remXboxByQid(user_id);
        spark.QClient.sendGroupMsg(group_id, `用户${xb}退出群聊，已从白名单移除`)
        mc.runcmd('allowlist remove "' + xb + '"');
    }
})