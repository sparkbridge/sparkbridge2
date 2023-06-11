const msgbuilder = require('../../handles/msgbuilder')
const packbuilder = require('../../handles/packbuilder');
function text(str){
    if(typeof str == 'string') return msgbuilder.text(str);
    else return str;
}

const Greply = (gid)=>{
    return (msg) =>{
        spark.QClient.send(packbuilder.GroupMessagePack(text(msg)));
    }
}

spark.on('gocq.pack',(pack)=>{
    console.log(pack);
    //let evt_name = `${pack.post_type}${pack.message_type == undefined ? '' :'.'+ pack.message_type}`;
    const POST_TYPE = pack.post_type;
    switch(POST_TYPE){
        case 'meta_event':
            spark.emit(`${POST_TYPE}.${pack.meta_event_type}`,pack);
            break;
        case 'message':
            spark.emit(`${POST_TYPE}.${pack.message_type}.${pack.sub_type}`,pack);
            break;
        case 'notice':
            spark.emit(`${POST_TYPE}.${pack.notice_type}`,pack)
            break;
        case 'request':
            spark.emit(`${POST_TYPE}.${pack.request_type}`,pack);
            break;

    }
})