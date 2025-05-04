ll.exports((msg) => spark.QClient.sendGroupMsg(spark.mc.config.group, msg), "SparkAPI", "sendGroupMessage");
ll.exports(() => spark.mc.config.group, "SparkAPI", "GetGroupId");
// -----------------------------------------------------------------

const msgbuilder = require('../../handles/msgbuilder');
const packbuilder = require('../../handles/packbuilder');
function callCustomEvent(event, eventId) {
    spark.on(event, (e) => {
        if (ll.hasExported(event, eventId)) ll.imports(event, eventId)(e);
    });
}

let EventId = 0;
ll.exports(callCustomEvent, "SparkAPI", "callCustomEvent");
ll.exports(() => `SparkBridge_Event_${++EventId}`, "SparkAPI", "GetEventID");
ll.exports((type) => {
    switch (type) {
        case 'spark.mc.config':
            return spark.mc.config;
    }
}, "SparkAPI", "GetInfo")
ll.exports((data) => spark.QClient.sendWSPack(data), "SparkAPI", "sendWSPack");//直接spark.QClient.sendWSPack会报错
ll.exports(spark.QClient.sendGroupMsg, "SparkAPI", "sendGroupMsg");

function getStaticMethods(klass) {
    return Object.getOwnPropertyNames(klass)
        .filter(prop => typeof klass[prop] === 'function'
            && prop !== 'length'
            && prop !== 'name'
            && prop !== 'prototype');
}
function exportClass(klass, name) {
    let list = getStaticMethods(klass);
    ll.exports(() => list, "SparkAPI", name);
    list.forEach(method => {
        ll.exports(klass[method], "SparkAPI", `${name}.${method}`);
    });
}
exportClass(msgbuilder, 'msgbuilder');
exportClass(packbuilder, 'packbuilder');