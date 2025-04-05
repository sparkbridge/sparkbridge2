const _config = spark.getFileHelper('JandLandCmsg');
const JSON5 = require('json5');

function formatMsg(msg) {
    const formattedMessages =msg.map((t) => {
        switch (t.type) {
            case 'at':
                if (spark.mc.getXbox(t.data.qq) == undefined) {
                    return '@' + t.data.qq;
                }else{
                    return '@' + spark.mc.getXbox(t.data.qq);
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
    // chatShield: []
});

const  WebConfigBuilder   = spark.telemetry.WebConfigBuilder;


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

let wbc_2 = new WebConfigBuilder("JandLandCmsg");
wbc_2.addSwitch("join",config.switch.join,"是否开启加入提示");
wbc_2.addSwitch("left",config.switch.left,"是否开启离开提示");
wbc_2.addSwitch("chat_group",config.switch.chat.group,"是否转发消息到群聊");
wbc_2.addSwitch("chat_server",config.switch.chat.server,"是否转发消息到服务器（默认为关闭，默认的正则表达式附带了chat xxxx的正则）");
wbc_2.addNumber("chatMaxLength",config.chatMaxLength,"聊天最大字数长度");
// wbc_2.addEditArray("chatShield",config.chatShield,"聊天屏蔽词语");
spark.emit("event.telemetry.pushconfig", wbc_2);

spark.on("event.telemetry.updateconfig_JandLandCmsg",(p,k,v)=>{
    switch(k){
        case "join":
            config.switch.join = v;
            break;
        case 'left':
            config.switch.left = v;
            break; 
        case 'chat_group':
            config.switch.chat.group = v;
            break;
        case 'chat_server':
            config.switch.chat.server = v;
            break;
        case 'chatMaxLength':
            config.chatMaxLength = v;
            break;
        case 'chatShield':
            config.chatShield = v;
            break;
    }
    _config.updateFile("config.json",config);
})



let wbc_1 = new WebConfigBuilder("JandLandCmsg_lang");
wbc_1.addText("join",lang.join,"加入服务器向群聊中发送的消息");
wbc_1.addText("left",lang.left,'离开服务器向群聊中发送的消息');
wbc_1.addText("chat_group",lang.chat.group,"发送到群聊的聊天信息格式");
wbc_1.addText('chat_server',lang.chat.server,"发送到服务器的聊天信息格式");
spark.emit("event.telemetry.pushconfig", wbc_1);
spark.on("event.telemetry.updateconfig_JandLandCmsg_lang",(p,k,v)=>{
    switch(k){
        case 'join':
            lang.join = v;
            break;
        case 'left':
            lang.left = v;
            break;
        case 'chat_group':
            lang.chat.group = v;
            break;
        case 'chat_server':
            lang.chat.server = v;
            break;
    }
    _config.updateFile("lang.json",lang);
})



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


spark.Cmd.regPlaceHolder('USER_MSG', e => {
    return formatMsg(e.message);
});
// //这个代码不知道为什么没有办法运行，直接用上面的Player_msg就行了
// spark.Cmd.regPlaceHolder('USER_MSG', (player, msg) => {
//     return msg;
// });


const GROUP_ID = spark.mc.config.group;

if (config.switch.join) {
    spark.mc.on('onJoin', (player) => {
        if(player.isSimulatedPlayer()){
            return;
        }
        spark.QClient.sendGroupMsg(GROUP_ID, spark.Cmd.buildString(lang.join, [], player));
    });
}
if (config.switch.left) {
    spark.mc.on('onLeft', (player) => {
        spark.QClient.sendGroupMsg(GROUP_ID, spark.Cmd.buildString(lang.left, [], player));
    });
}

if (config.switch.chat.group) {
    spark.mc.on('onChat', (player, msg) => {
        if(msg.length > config.chatMaxLength){
            player.tell('聊天长度过长，将不会转发');
            return;
        }

        spark.QClient.sendGroupMsg(GROUP_ID, spark.Cmd.buildString(lang.chat.group, [], player, msg));
    });
}

if (config.switch.chat.server) {
    
    spark.on('message.group.normal', async (e) => {
        if (e.group_id !== GROUP_ID) return;
        let msg = formatMsg(e.message);
   //     console.log(spark.Cmd.buildString(lang.chat.server, [], e.sender, msg));
        mc.broadcast(spark.Cmd.buildString(lang.chat.server, [], e.sender, msg));
    });
}

