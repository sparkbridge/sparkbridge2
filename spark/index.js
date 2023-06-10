const adapter = require('../Qadapter');
const fhelper = require('../handles/file');
const PLUGIN_ROOT_DIR = './plugins/nodejs/sparkbridge2';
const PLUGIN_DATA_DIR = './plugins/sparkbridge2';
class Spark {
    QClient;
    constructor(target,qid, pwd) {
        this.QClient = new adapter(target,qid, pwd);
        this.QClient.login();
    }
    on(evt, func) {
        this.QClient.on(evt, func);
    }
    emit(evt,...arg){
        this.QClient.emit(evt,...arg);
    }
    getFileHelper(plugin_name) {
        return new fhelper.FileObj(plugin_name);
    }
    setOwnProperty(k, v) {
        this[k] = v;
    }
}

module.exports = Spark;