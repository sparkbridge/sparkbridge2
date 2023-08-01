# 开发指南

很高兴认识你，欢迎你参与到Sparkbridge2的开发中。这里我们来稍微讲一下sb2的开发：

正如前面插件指南所说，插件装载位置在于“\plugins\nodejs\sparkbridge2\plugins”，因此在这里新建一个文件夹，随便起一个名字，就可以了。

接下来插件里面应该至少包含两个文件：
``` 
┌─index.js <-- 你的插件的主程序
└─spark.json  <-- 你的插件的自述文件

```
我们先新建这个自述文件，让我们打开它
```json
{
    "name": "example", //这是插件的名字，将会在被bds加载时显示
    "author": "户山兔兔", //此处签上你的大名
    "version": [
        0,
        0,
        1
    ],//写上版本号
    "desc": "这是一个示例插件", //插件的自述，不过这并不会显示在bds的控制台中
    "load":true //是否启用此插件，保持默认即可
}
```
>[!Warning]真正的json中不应当包含注释！

接下来我们开始对index的开发：
这是一个简单的sb插件
```js
const msgbuilder = require('../../handles/msgbuilder');//导入信息构建函数
spark.QClient.on('bot.online', () => {
    spark.QClient.sendGroupMsg(spark.mc.config.group, '我来啦');向指定群发送字符
    //spark.QClient.sendGroupMsg(spark.mc.config.group, msgbuilder.img('https://bestdori.com/assets/cn/stamp/01_rip/stamp_002001.png'));
    //↑ 或者图片

});//bot上线时执行的命令
spark.on('message.group.normal', (e, reply) => {

    const { raw_message, group_id } = e;
    if (group_id !== spark.mc.config.group) return;//此处对正在发送消息的群聊判断，查看是否和配置文件一致
        if(raw_message=='你好吗'){
			reply('我很好，谢谢。');//使用reply();发送信息。
        }
        if (raw_message == '可爱捏')
            reply(msgbuilder.img('https://bestdori.com/assets/cn/stamp/01_rip/stamp_001007.png'))//这里可以发一张在线图片
    
})

```
你可以试试把这个代码本地执行一次！

更多api请等待文档更新。

有以下几个需要注意的点：

1. 如果您的插件依赖了其他的库，请一并打包node_modules到文件夹。
