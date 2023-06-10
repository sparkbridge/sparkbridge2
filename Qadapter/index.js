const { WebSocket } = require('ws');
const EventEmitter = require("events");

class Qadapter{
    client;
    target;
    qid;
    pwd;
    eventEmitter = new EventEmitter();
    eventKeyMap = new Map({'':[]});
    constructor(target,qid,pwd){
        this.target =  target;
        this.qid = qid;
        this.pwd = pwd;
    }
    login(){
        this.client = new WebSocket(this.target,{headers:{Authorization:this.pwd}});
        this.client.on('open',()=>{
            //this.logger.info('登录成功，开始处理事件');
            this.eventEmitter.emit('bot.online');
        });
    }
    on(evk,func){
        if(this.eventKeyMap.has(evk)==false) this.eventKeyMap.set(evk,[]);
        this.eventKeyMap.get(evk).push(func);
    }
    setProperty(k,v){
        this[k] = v;
    }
    sendGroupMsg(gid,msg){
        
    }
    sendPrivateMsg(pid,msg){

    }
}