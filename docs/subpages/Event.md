# Spark事件文档

>更多事件可以参考[Go-CqHttp-事件](https://docs.go-cqhttp.org/event)或者[Onebot](https://github.com/botuniverse/onebot-11/blob/master/event/README.md)的文档，或者前往./spark/index.js

```js
class Spark {
    QClient;
    debug = false;//在这里打开调试模式，改成True即可
    
    //...more code
    }
```

重新运行程序就可以看到所有的正在触发的事件。

常用事件：

> 触发事件格式为：#post_type#.#message_type#.#sub_type#

> 如下文message.group.normal


## 群信息事件

### message.group.normal

最常用的群信息事件

Example：

```js
spark.on('message.group.normal', (e, reply) => {//开始监听
    const { raw_message, group_id, user_id } = e;//获取当前信息内容
    if (group_id !== spark.mc.config.group) return;//不是目标群则返回
    if (raw_message == 'xxxx') {
        reply('xxxx')
        //执行需要的逻辑
    }
})
```

## 好友私聊事件

### message.private.friend

```js
spark.on('message.private.friend', (e, reply) => {
    const { raw_message,user_id } = e;
    reply(xxx)
})
```

## Bot登录

### bot.online

```js
spark.on('bot.online', () => { //当bot登录时
    spark.QClient.sendGroupMsg(spark.mc.config.group, '我来啦');向指定群发送字符
});//bot上线时执行的命令

```

>此处仅作示例，Onebot所有事件都能收到，请参考Onebot11或者gocq文档

