const _config = spark.getFileHelper('JandLandCmsg');
const JSON5 = require('json5');

_config.initFile('config.json',{
    switch:{
        join:true,
        left:true,
        chat:{
            group:true,
            server :false //发送到服务器的默认为关闭，默认的正则表达式附带了chat xxxx的正则
        }
    },
    chatMaxLength:20,
    chatShield:['傻逼']
});

_config.initFile('lang.json',{
    join:'%PLAYER_NAME% 进入了服务器',
    left: '%PLAYER_NAME% 离开了服务器',
    chat:{
        group:'%PLAYER_NAME%',
        server :''
    }
});

const config =JSON5.parse( _config.getFile('config.json'));
const lang = JSON.parse(_config.getFile('lang.json'));

spark.Cmd.regPlaceHolder('PLAYER_NAME',e=>{
    return e.realName;
});

spark.Cmd.regPlaceHolder('USER_NAME',e=>{
    return e.sender.nickname;
});

spark.Cmd.regPlaceHolder('USER_CARD',e=>{
    return e.sender.card;
});

spark.Cmd.regPlaceHolder('USER_QID',e=>{
    return e.sedner.user_id;
});

spark.Cmd.regPlaceHolder('USER_XBOXID',e=>{
    const qid = e.user_id;
    if(spark.mc.getXbox(qid) == '未找到'){
        return e.sender.card;
    }else{
        return spark.mc.getXbox(qid);
    }
});

spark.Cmd.regPlaceHolder('PLAYER_XUID',e=>{
    return e.xuid;
});

spark.Cmd.regPlaceHolder('PLAYER_IP',e=>{
    return e.getDevice().ip.split(':')[0];
});

const GROUP_ID = spark.mc.config.group;

if(config.switch.join){
    spark.mc.on('onJoin',(player)=>{
        spark.QClient.sendGroupMsg(GROUP_ID,spark.Cmd.buildString(lang.join,[],player));
    });
}
if(config.switch.left){
    spark.mc.on('onLeft',(player)=>{
        spark.QClient.sendGroupMsg(GROUP_ID,spark.Cmd.buildString(lang.left,[],player));
    });
}

if(config.switch.chat.group){
    spark.mc.on('onChat',(player)=>{
        spark.QClient.sendGroupMsg(GROUP_ID,spark.Cmd.buildString(lang.left,[],player));
    });
}