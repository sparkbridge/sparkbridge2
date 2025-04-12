const { WebSocket } = require('ws');
const EventEmitter = require("events");
const logger = require('../handles/logger');
const { text } = require('../handles/msgbuilder');
const { boom } = require('../handles/reconnect');

class CustomTrigger extends EventEmitter {
    constructor() {
        super();
        this.interceptors = {}; // 使用对象存储拦截器，键为事件名称
    }

    // 添加拦截器，并指定事件名称
    addInterceptor(event, interceptor) {
        if (!this.interceptors[event]) {
            this.interceptors[event] = [];
        }
        this.interceptors[event].push(interceptor);
    }

    // 触发事件
    trigger(event, ...args) {
        // 检查是否有拦截器拦截当前事件
        if (this.interceptors[event]) {
            for (const interceptor of this.interceptors[event]) {
                const result = interceptor(...args);
                if (result === false) {
                    if(spark.debug) console.log(`Event '${event}' was intercepted.`);
                    return; // 如果拦截器返回 false，则中断事件触发
                }
            }
        }

        // 如果没有被拦截，则正常触发事件
        this.emit(event, ...args);
    }
}


class Qadapter {
    client;
    target;
    qid;
    pwd;
    ws_type;
    port;
    eventEmitter = new CustomTrigger();
    //eventKeyMap = new Map();
    logger = logger.getLogger('Qadapter')
    constructor(ws_type,target,port, qid, pwd, customs) {
        this.target = target;
        this.qid = qid;
        this.pwd = pwd;
        this.ws_type = ws_type;
        this.port = port;
        this.customs = customs;
    }
    login() {
        //console.log(this.pwd);
        if(this.ws_type == 0){
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
                this.logger.warn(`websocket 已经断开,将在 ${(new Date(Date.now() + boom())).toISOString()} 尝试重连`);
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
        else if(this.ws_type == 1){
            this.client = new WebSocket.Server({ port:this.port});


            this.logger.info('Websocket 服务器 于 ws://localhost:'+this.port+" 开启");

            // 监听连接事件
            this.client.on('connection', (ws,req) => {
                this.logger.info(`${req.headers.host}:${req.headers.port} 发起连接`);

                // 打印客户端的请求头信息
                if(spark.debug) console.log('Client request headers:', req.headers);

                if(req.headers.authorization != `Bearer ${this.pwd}` && spark.debug == false){
                    this.logger.info('Client 未提供正确的授权头');
                    ws.send('Client 未提供正确的授权头');
                    ws.close();
                    return;
                }

                if (req.headers['x-self-id'] == this.qid){
                    this.logger.info('WebSocket 服务器 已接收到来自 '+"["+this.qid+"]"+' 的连接');
                    this.eventEmitter.emit('bot.online');
                }

                // 监听客户端消息事件
                ws.on('message', (message) => {
                    // console.log(`Received message: ${message}`);
                    // 向客户端发送响应
                    // ws.send(`Server received: ${message}`);
                    let msg_obj;
                    try {
                        msg_obj = JSON.parse(message);
                    } catch (err) {
                        this.logger.error('解析消息出现错误！');
                        console.log(err);
                    }
                    this.eventEmitter.emit('gocq.pack', msg_obj);
                });

                // 监听错误事件
                ws.on('error', (error) => {
                    this.logger.error('WebSocket error:', error);
                });

                // 监听关闭事件
                ws.on('close', () => {
                    this.logger.info('Client disconnected');
                });

            });

            // 监听服务器错误事件
            this.client.on('error', (error) => {
                this.logger.error('websocket 故障！！');
                this.logger.error('请检查连接到go-cqhttp的密钥是否填写正确');
                console.error('Server error:', error);
            });

            // 监听服务器关闭事件
            this.client.on('close', () => {
                console.log('WebSocket server closed');
            });
        }
        
    }
    on(evk, func) {
        if (spark.debug) console.log('触发on', evk);
        this.eventEmitter.on(evk, func);

        // 初始化spark.plugins_list 
        //spark.plugins_list = spark.plugins_list || [];

        // 设置最大监听器数量
        // PS：Nodejs中，监听器数量默认限制为10，否则会警告。设置为0才是无限个

        this.eventEmitter.setMaxListeners(0);
    
    }

    emit(evk, ...arg) {
        if (spark.debug) console.log('触发emit', evk);
        /* if(this.eventKeyMap.has(evk)){
             this.eventKeyMap.get(evk).forEach(element => {
                 element(...arg);
             });
         }*/
        this.eventEmitter.trigger(evk, ...arg);
    }

    addInterceptor(evt,interceptor){
        if (spark.debug) console.log('触发addInterceptor');
        this.eventEmitter.addInterceptor(evt,interceptor);
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
        if(this.ws_type == 0){
            this.client.send(pack);
        }else if(this.ws_type == 1){
            this.client.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(pack);
                }
            });
        }

    }
}


module.exports = Qadapter;
