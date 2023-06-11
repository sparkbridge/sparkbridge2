const msgbuilder = require('../../handles/msgbuilder')
const packbuilder = require('../../handles/packbuilder');

function text(str){
    if(typeof str == 'string') return msgbuilder.text(str);
    else return str;
}

const build_reply = (id,type)=>{
    return (msg) =>{
        spark.QClient.sendWSPack(packbuilder.MessagePack(id,type,msg));
    }
}

spark.on('gocq.pack',(pack)=>{
    //console.log(pack);
    //let evt_name = `${pack.post_type}${pack.message_type == undefined ? '' :'.'+ pack.message_type}`;
    const POST_TYPE = pack.post_type;
    switch(POST_TYPE){
        case 'meta_event':
            spark.emit(`${POST_TYPE}.${pack.meta_event_type}`,pack);
            break;
        case 'message':
            spark.emit(`${POST_TYPE}.${pack.message_type}.${pack.sub_type}`,pack,build_reply(pack.group_id == undefined ? pack.user_id : pack.group_id,pack.message_type));
            break;
        case 'notice':
            spark.emit(`${POST_TYPE}.${pack.notice_type}`,pack)
            break;
        case 'request':
            spark.emit(`${POST_TYPE}.${pack.request_type}`,pack);
            break;

    }
});

function sendGroupMsg(gid,msg){
    spark.QClient.sendWSPack(packbuilder.GroupMessagePack(gid,msg));
}
spark.QClient.setOwnProperty('sendGroupMsg',sendGroupMsg);

function sendPrivateMsg(fid,msg){
    spark.QClient.sendWSPack(packbuilder.PrivateMessagePack(fid,msg));
}
spark.QClient.setOwnProperty('sendPrivateMsg',sendPrivateMsg);


/*
spark.on('ws.open',()=>{
    spark.QClient.sendGroupMsg(519916681,'测试');
});


spark.on('message.group.normal',(pack,reply)=>{
    if(pack.raw_message == 'ksm测试'){
        reply(msgbuilder.img('https://pic2.zhimg.com/v2-adde807644d40c64a0116178b84297c7_r.jpg?source=1940ef5c'))
    }
})

*/