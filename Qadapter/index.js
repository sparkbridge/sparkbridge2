const { WebSocket } = require('ws');
const EventEmitter = require("events");

class Qadapter{
    client;
    target;
    qid;
    pwd;
    myEmitter = new EventEmitter();
    constructor(target,qid,pwd){
        this.target =  target;
        this.qid = qid;
        this.pwd = pwd;
    }
    login(){
        this.client = new WebSocket(this.target,{headers:{Authorization:this.pwd}});
    }
    setProperty(k,v){
        this[k] = v;
    }
    sendGroupMsg(gid,msg){
        
    }
    sendPrivateMsg(pid,msg){

    }
}