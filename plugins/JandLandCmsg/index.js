const _config = spark.getFileHelper('JandLandCmsg');
const JSON5 = require('json5');

_config.initFile('config.json', {
    switch: {
        join: true,
        left: true,
        chat: {
            group: true,
            server: false //发送到服务器的默认为关闭，默认的正则表达式附带了chat xxxx的正则
        }
    },
    chatMaxLength: 20,
    chatShield: ['傻逼']
});

_config.initFile('lang.json', {
    join: '%PLAYER_NAME% 进入了服务器',
    left: '%PLAYER_NAME% 离开了服务器',
    chat: {
        group: '%PLAYER_NAME% >> %PLAYER_MSG%',
        server: '[群聊]%USER_XBOXID% >> %USER_MSG%'
    }
});

const config = JSON5.parse(_config.getFile('config.json'));
const lang = JSON.parse(_config.getFile('lang.json'));

spark.Cmd.regPlaceHolder('PLAYER_NAME', e => {
    return e.realName;
});

spark.Cmd.regPlaceHolder('USER_NAME', e => {
    return e.sender.nickname;
});

spark.Cmd.regPlaceHolder('USER_CARD', e => {
    return e.sender.card;
});

spark.Cmd.regPlaceHolder('USER_QID', e => {
    return e.sender.user_id;
});

spark.Cmd.regPlaceHolder('USER_XBOXID', e => {
    //console.log(e);
    const qid = e.sender.user_id;
    if (spark.mc.getXbox(qid) == undefined) {
        console.log(e.sender.card);
        return e.sender.nickname; //获取card有时候是空的，用nickname代替
    } else {
        return spark.mc.getXbox(qid);
    }
});

spark.Cmd.regPlaceHolder('PLAYER_XUID', e => {
    return e.xuid;
});

spark.Cmd.regPlaceHolder('PLAYER_IP', e => {
    return e.getDevice().ip.split(':')[0];
});

spark.Cmd.regPlaceHolder('PLAYER_MSG', (player, msg) => {
    return msg;
});

function formatMsg(msg) {
    return msg.map(t => {
        switch (t.type) {
            case 'at':
                return '@' + t.data.qq;
            case 'text':
                return t.data.text;
            case 'img':
                return '[图片]';
            case 'face':
                return '[表情]';
        }
    }).join('');
}

spark.Cmd.regPlaceHolder('USER_MSG', e => {
    return formatMsg(e.message);
})

const GROUP_ID = spark.mc.config.group;

if (config.switch.join) {
    spark.mc.on('onJoin', (player) => {
        spark.QClient.sendGroupMsg(GROUP_ID, spark.Cmd.buildString(lang.join, [], player));
    });
}
if (config.switch.left) {
    spark.mc.on('onLeft', (player) => {
        spark.QClient.sendGroupMsg(GROUP_ID, spark.Cmd.buildString(lang.left, [], player));
    });
}

function hasShield(raw){
    var ret = false;
    config.chatShield.forEach(et => {
        if(raw.match(et)){
            ret = true
        }
    });
    return ret;
}

if (config.switch.chat.group) {
    spark.mc.on('onChat', (player, msg) => {
        if(msg.length > config.chatMaxLength){
            player.tell('聊天长度过长，将不会转发');
            return;
        }
        if(hasShield(msg)){
            player.tell('聊天包含违禁词，将不会转发');
            return;
        }
        spark.QClient.sendGroupMsg(GROUP_ID, spark.Cmd.buildString(lang.chat.group, [], player, msg));
    });
}

if (config.switch.chat.server) {
    spark.on('message.group.normal', (e) => {
        let msg = formatMsg(e.message);
        mc.broadcast(spark.Cmd.buildString(lang.chat.group, [], e.sender, msg));
    });
}

