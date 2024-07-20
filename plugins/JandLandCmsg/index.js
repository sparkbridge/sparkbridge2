const _config = spark.getFileHelper('JandLandCmsg');
const JSON5 = require('json5');

async function formatMsg(msg) {
    const formattedMessages = await Promise.all(msg.map(async (t) => {
        switch (t.type) {
            case 'at':
                try {
                    if (spark.mc.getXbox(t.data.qq) == undefined) {
                        const data = await spark.QClient.getGroupMemberInfo(spark.mc.config.group, t.data.qq);
                        if (data) {
                            let name
                            if (data.card == "") {
                                name = data.nickname;
                            }
                            else {
                                name = data.card;
                            }
                            return '@' + name;
                        } else {
                            return '@' + t.data.qq;
                        }
                    }else{
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
    }));

    return formattedMessages.join('');
}


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
        server: '[群聊]%USER_XBOXID% >> %PLAYER_MSG%'
    }
});

const config = JSON5.parse(_config.getFile('config.json'));
const lang = JSON5.parse(_config.getFile('lang.json'));

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
    const qid = e.user_id;
   
    if (spark.mc.getXbox(qid) == undefined) {
        //console.log(e.card);
        return e.nickname; //获取card有时候是空的，用nickname代替
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


/*spark.Cmd.regPlaceHolder('USER_MSG', e => {
    return formatMsg(e.message);
})*/
//这个代码不知道为什么没有办法运行，直接用上面的Player_msg就行了
spark.Cmd.regPlaceHolder('USER_MSG', (player, msg) => {
    return msg;
});


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
    let ret = false;
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
    
    spark.on('message.group.normal', async (e) => {
        if (e.group_id !== GROUP_ID) return;
        let msg =await formatMsg(e.message);
   //     console.log(spark.Cmd.buildString(lang.chat.server, [], e.sender, msg));
        mc.broadcast(spark.Cmd.buildString(lang.chat.server, [], e.sender, msg));
    });
}

