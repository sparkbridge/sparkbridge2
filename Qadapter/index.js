const { WebSocket } = require('ws');
const EventEmitter = require("events");
const logger = require('../handles/logger');
const { text } = require('../handles/msgbuilder');
const { boom } = require('../handles/reconnect');

class Qadapter {
    client;
    target;
    qid;
    pwd;
    eventEmitter = new EventEmitter();
    //eventKeyMap = new Map();
    logger = logger.getLogger('Qadapter')
    constructor(target, qid, pwd, customs) {
        this.target = target;
        this.qid = qid;
        this.pwd = pwd;
        this.customs = customs;
    }
    login() {
        //console.log(this.pwd);
        this.client = new WebSocket(this.target, { headers: { Authorization: 'Bearer ' + this.pwd } });// 
        this.client.on('open', () => {
            this.logger.info('登录成功，开始处理事件');
            this.eventEmitter.emit('bot.online');
        });
        this.client.on('error', (e) => {
            this.logger.error('websocket 故障！！');
            this.logger.error('请检查连接到go-cqhttp的密钥是否填写正确');
            console.log(e);
        });
        this.client.on('close', (e) => {
            this.logger.warn('websocket 已经断开');
            setTimeout(() => {
                this.login()
            }, boom());
        });
        this.client.on('message', (_data, _islib) => {
            let raw = _data;
            if (_islib) {
                raw = _data.toString()
            }
            let msg_obj;
            try {
                msg_obj = JSON.parse(raw);
            } catch (err) {
                this.logger.error('解析消息出现错误！');
                console.log(err);
            }
            this.eventEmitter.emit('gocq.pack', msg_obj);
        })
    }
    on(evk, func) {
        if (spark.debug) console.log('触发on', evk);
        this.eventEmitter.on(evk, func);

        // 初始化spark.plugins_list 
        spark.plugins_list = spark.plugins_list || [];

        // 设置最大监听器数量
        // PS： JS并没有明确限制监听器数量，不设置maxlisteners就是无限个
        // const maxListeners = 10 + (spark.plugins_list.length) * 3;
        // this.eventEmitter.setMaxListeners(maxListeners);

    }

    emit(evk, ...arg) {
        if (spark.debug) console.log('触发emit', evk);
        /* if(this.eventKeyMap.has(evk)){
             this.eventKeyMap.get(evk).forEach(element => {
                 element(...arg);
             });
         }*/
        this.eventEmitter.emit(evk, ...arg);
    }
    setOwnProperty(k, v) {
        if (spark.debug) console.log('挂载 ——> ' + k);
        this[k] = v;
    }
    sendWSPack(pack) {
        if (typeof pack !== 'string') {
            pack = JSON.stringify(pack);

        }
        if (spark.debug) console.log("send-->", pack);
        this.client.send(pack);
    }
}


module.exports = Qadapter;