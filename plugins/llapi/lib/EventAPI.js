const CallEvent=ll.imports("SparkAPI","callCustomEvent");
const GetEventID=ll.imports("SparkAPI","GetEventID");
class Spark{
    constructor() {
        throw new Error("Static class cannot be instantiated");
    }
    static on(event, callback) {
        let eventId=GetEventID();
        ll.exports(callback, event, eventId);
        CallEvent(event, eventId);
    }
}
module.exports = {
    Spark
};