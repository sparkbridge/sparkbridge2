const msgbuilder = require('../../handles/msgbuilder')
const packbuilder = require('../../handles/packbuilder');
const { parseCQString } = require('../../handles/parserCQString');
function text(str) {
    if (typeof str == 'string') return msgbuilder.text(str);
    else return str;
}

const build_reply = (id, type, mid) => {
    return (msg, quote = false) => {
        msg = msgbuilder.format(msg);
        if (quote) {
            msg.unshift({
                type: 'reply',
                data: {
                    id: mid.toString()
                }
            });
        }
        if (type == 'group') {
            return sendGroupMsg(id, msg);
        } else {
            return sendPrivateMsg(id, msg);
        }
    }
}

const _config = spark.getFileHelper('base');
const _raw_file = _config.getFile("config.json");
const _p_raw = JSON.parse(_raw_file);
const _isArray = _p_raw.onebot_mode_v11;
//console.log(_isArray)
spark.on('gocq.pack', (pack) => {
    if (spark.debug) console.log(pack);
    //let evt_name = `${pack.post_type}${pack.message_type == undefined ? '' :'.'+ pack.message_type}`;

    if (pack.echo != undefined) {
        // if (spark.debug) console.log(pack);
        spark.QClient.eventEmitter.emit("packid_" + pack.echo, pack.data);
        // return  // <-- 要不要return呢，不return也没什么，但是怕出啥问题。。。
    }
    const POST_TYPE = pack.post_type;
    switch (POST_TYPE) {
        case 'meta_event':
            spark.emit(`${POST_TYPE}.${pack.meta_event_type}`, pack);
            break;
        case 'message':
            //console.log("in");
            if (!_isArray) {
                //console.log("in",typeof pack.message);
                let _pmessage = parseCQString(pack.message.toString());
                 pack.message = _pmessage;
              //console.log(_pmessage);
            }
            if (pack.raw_message.includes('&#91;') || pack.raw_message.includes('&#93;') || pack.raw_message.includes('&#44') || pack.raw_message.includes('&amp;')) {
                pack.raw_message = pack.raw_message.replace('&#91;', '[');
                pack.raw_message = pack.raw_message.replace('&#93;', ']');
                pack.raw_message = pack.raw_message.replace('&#44;', ',');
                pack.raw_message = pack.raw_message.replace('&amp;', '&');
                // 采用最烂的替换方式，希望能有高效率的方法，欢迎PR
            }
            spark.emit(`${POST_TYPE}.${pack.message_type}.${pack.sub_type}`, pack, build_reply(pack.group_id == undefined ? pack.user_id : pack.group_id, pack.message_type, pack.message_id));
            break;
        case 'notice':
            spark.emit(`${POST_TYPE}.${pack.notice_type}`, pack)
            break;
        case 'request':
            spark.emit(`${POST_TYPE}.${pack.request_type}`, pack);
            break;
    }
});

function uuid() {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substring((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    return uuid
}


function sendGroupMsg(gid, msg) {
    let tmp_id = uuid();
    msg = msgbuilder.format(msg);
    spark.QClient.sendWSPack(packbuilder.GroupMessagePack(gid, msg, tmp_id));
    return new Promise((res, rej) => {
        spark.QClient.eventEmitter.once('packid_' + tmp_id, (data) => {
            res(data);
        });
        setTimeout(() => {
            rej({ reason: 'timeout' });
        }, 10e3);
    });
}
spark.QClient.setOwnProperty('sendGroupMsg', sendGroupMsg);

function sendPrivateMsg(fid, msg) {
    msg = msgbuilder.format(msg);
    let tmp_id = uuid();
    spark.QClient.sendWSPack(packbuilder.PrivateMessagePack(fid, msg, tmp_id));
    return new Promise((res, rej) => {
        spark.QClient.eventEmitter.once('packid_' + tmp_id, (data) => {
            res(data);
        });
        setTimeout(() => {
            rej({ reason: 'timeout' });
        }, 10e3);
    });
}
spark.QClient.setOwnProperty('sendPrivateMsg', sendPrivateMsg);

function sendGroupForwardMsg(gid, msg) {
    let tmp_id = uuid();
    spark.QClient.sendWSPack(packbuilder.GroupForwardMessagePack(gid, msg, tmp_id));
    return new Promise((res, rej) => {
        spark.QClient.eventEmitter.once('packid_' + tmp_id, (data) => {
            res(data);
        });
        setTimeout(() => {
            rej({ reason: 'timeout' });
        }, 10e3);
    });
}
spark.QClient.setOwnProperty('sendGroupForwardMsg', sendGroupForwardMsg);

function sendGroupBan(gid, mid, d) {
    spark.QClient.sendWSPack(packbuilder.GroupBanPack(gid, mid, d));
}
spark.QClient.setOwnProperty('sendGroupBan', sendGroupBan);

function deleteMsg(id) {
    spark.QClient.sendWSPack(packbuilder.DeleteMsgPack(id));
}
spark.QClient.setOwnProperty('deleteMsg', deleteMsg);

function getGroupMemberList(gid) {
    let tmp_id = uuid();
    spark.QClient.sendWSPack(packbuilder.GroupMemberListPack(gid, tmp_id));
    return new Promise((res, rej) => {
        spark.QClient.eventEmitter.once('packid_' + tmp_id, (data) => {
            res(data);
        });
        setTimeout(() => {
            rej({ reason: 'timeout' });
        }, 10e3);
    })
}
spark.QClient.setOwnProperty('getGroupMemberList', getGroupMemberList)

function getGroupMemberInfo(gid, mid) {
    let tmp_id = uuid();
    spark.QClient.sendWSPack(packbuilder.GroupMemberInfoPack(gid, mid, tmp_id));
    return new Promise((res, rej) => {
        spark.QClient.eventEmitter.once('packid_' + tmp_id, (data) => {
            res(data);
        });
        setTimeout(() => {
            rej({ reason: 'timeout' });
        }, 10e3);
    })
}
spark.QClient.setOwnProperty('getGroupMemberInfo', getGroupMemberInfo);

