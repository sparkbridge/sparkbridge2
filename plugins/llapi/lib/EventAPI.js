const CallEvent = ll.imports("SparkAPI", "callCustomEvent");
let NextEventId = 0;
function getNextEventId() {
    NextEventId++;
    return "SparkBridge_Event_" + NextEventId;
}
class Event {
    constructor() {
        throw new Error("Static class cannot be instantiated");
    }
    static listen(event, callback) {
        let eventId = getNextEventId();
        ll.exports(callback, event, eventId);
        CallEvent(event, eventId);
    }
}
module.exports = {
    Event
};