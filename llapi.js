const CallEvent = ll.imports("SparkAPI", "callCustomEvent");
const GetEventID = ll.imports("SparkAPI", "GetEventID");
function importClass(name) {
    let res = {}, list = ll.imports("SparkAPI", name)();
    list.forEach(funcname => res[funcname] = ll.imports("SparkAPI", `${name}.${funcname}`));
    return res;
}
const msgbuilder = importClass('msgbuilder'), packbuilder = importClass('packbuilder');
module.exports = {
    spark: {
        mc: {
            config: ll.imports("SparkAPI", "GetInfo")('spark.mc.config')
        },
        on: (event, callback) => {
            let eventId = GetEventID();
            ll.exports(callback, event, eventId);
            CallEvent(event, eventId);
            return eventId;
        },
        QClient: {
            sendGroupMsg: ll.imports("SparkAPI", "sendGroupMsg"),
            sendWSPack: ll.imports("SparkAPI", "sendWSPack"),
        },
    },
    msgbuilder: msgbuilder,
    packbuilder: packbuilder
}