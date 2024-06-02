function SendMsg(msg) {
    spark.QClient.sendGroupMsg(spark.mc.config.group, msg);
}
ll.exports(SendMsg, "SparkAPI", "sendGroupMessage");

function callCustomEvent(event,eventId){
    let func=ll.imports(event,eventId);
    spark.on(event,(e)=>{
         func(e);
    });
}
var EventId=0;
function GetEventID(){
    EventId++;
    return "SparkBridge_Event_" + EventId;
}
ll.exports(callCustomEvent,"SparkAPI","callCustomEvent");
ll.exports(GetEventID,"SparkAPI","GetEventID");

const msgbuilder = require('../../handles/msgbuilder');
function GetGroupId(){
    return spark.mc.config.group;
}
function sendWSPack(json){
    return spark.QClient.sendWSPack(json);
}
ll.exports(GetGroupId,"SparkAPI","GetGroupId");
ll.exports(sendWSPack,"SparkAPI","sendWSPack");//直接spark.QClient.sendWSPack会报错
ll.exports(spark.QClient.deleteMsg,"SparkAPI","deleteMsg");
ll.exports(spark.QClient.sendGroupMsg,"SparkAPI","sendGroupMsg");
ll.exports(spark.QClient.sendPrivateMsg,"SparkAPI","sendPrivateMsg");
ll.exports(spark.QClient.sendGroupForwardMsg,"SparkAPI","sendGroupForwardMsg");
ll.exports(msgbuilder.img,"SparkAPI","msgbuilder.img");
ll.exports(msgbuilder.at,"SparkAPI","msgbuilder.at");
ll.exports(msgbuilder.face,"SparkAPI","msgbuilder.face");
ll.exports(msgbuilder.text,"SparkAPI","msgbuilder.text");
ll.exports(msgbuilder.poke,"SparkAPI","msgbuilder.poke");
ll.exports(msgbuilder.reply,"SparkAPI","msgbuilder.reply");
ll.exports(msgbuilder.format,"SparkAPI","msgbuilder.format");
ll.exports(msgbuilder.ForwardMsgBuilder,"SparkAPI","msgbuilder.ForwardMsgBuilder");
