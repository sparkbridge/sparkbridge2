# 配置文件详解

启动一次SparkBridge后，会在`plugin/sparkbridge2/`文件夹生成配置文件

``` 
┌─base <-- gocqhttp登录项配置文件
├─mc  <-- 群和管理员配置文件
├─JandLandCmsg  <-- 群服互通细则配置文件
├─regex  <--正则表达式配置文件
└─economy  <-- 经济配置文件  

```
## 登录项配置文件
打开/base的`config.json`
``` json
{
    target: 'ws://127.0.0.1:8080', //对接gocqhttp所需要的address地址和端口
    qid: 114514, //你的bot的QQ号
    pwd: 'linktoken', //gocqhttp 配置文件中access-token的配对密匙，需保持一致，不是密码！！！
}
```

:::

## 配置 GO-CQHTTP

### 下载 [GO-CQHTTP](https://github.com/Mrs4s/go-cqhttp/releases)

如果上面的链接无法打开，你也可以在群文件下载

>任何与Gocq相关的问题请看[Gocqhttp完整文档](https://docs.go-cqhttp.org/)

### 使用正向 WebSocket
打开 cqhttp 按提示创建bat文件，打开后, 通信方式选择: 正向WS

在 CQHTTP 配置文件中，

首先，填写`post-format`值为`array`,就像这样
```yaml
message:
  # 上报数据类型
  # 可选: string,array
  post-format: array

```

然后，更改gocq中access-token为你在sb机器人配置文件中填的配对密匙
```yaml
# 默认中间件锚点
default-middlewares: &default
  # 访问密钥, 强烈推荐在公网的服务器设置
  access-token: 'linktoken'
  # 事件过滤器文件目录
  filter: ''
```

随后，填写 `address` 值为你在sb机器人配置文件中填的ip地址和端口。

最后的配置文件连接列表应该是这样的格式

```yaml
# 正向WS设置
 - ws:
     # 正向WS服务器监听地址
     address: 127.0.0.1:8080
     middlewares:
       <<: *default # 引用默认中间件

```
随后填写qq账号密码，按指示登录gocqhttp。登录成功后，打开bds

sbBot将会根据你的填写开始连接。如果一切顺利，bds应该会输出以下文字：
```cmd
登录成功，开始处理事件
```
此时发送“bot测试”到群，应该可以收到回应：已上线。

## 基本使用配置文件

### mc

核心配置，配置生效群和Bot管理员

配置文件位于`/plugins/sparkbridge2/mc/config.json`

``` json
{
    "group": 12345678, // 机器人所生效群。目前只支持一个
    "admins": [10001,10002], // 管理员，是一个数组，可添加多个，用逗号分割
}
```
### JandLandCmsg

Join and Left and Chat msg，提供群服互通的支持：

配置文件位于`/plugins/sparkbridge2/JandLandCmsg/config.json`
```json
{
    "switch": {
        "join": true,// 是否转发玩家进入服务器
        "left": true,// 是否转发玩家离开服务器
        "chat": {
            "group": true,// 是否转发游戏玩家聊天内容到群聊
            "server": false// 是否转发群聊内容到游戏，默认保持关闭，使用插件regex中的正则表达式转发聊天内容，具体看下文。
        }
    },
    "chatMaxLength": 20,//最大允许的转发数量
    "chatShield": [
        "傻逼"   //转发包含关键词则不转发
    ]
}
```


### regex

插件`regex`可提供自定义正则表达式功能

配置文件位于`/plugins/sparkbridge2/regex/data.json`

``` json
{
    "^我是(.+)": {
        "cmd": "reply|你是$1",
        "adm": false
    },
    "^bot测试": {
        "cmd": "reply|已上线",
        "adm": true
    },
    "^绑定(.+)": {
        "cmd": "addwl|$1:true",
        "adm": false
    },
    "^解绑": {
        "cmd": "remwl|$1",
        "adm": false
    },
    "^查服": {
        "cmd": "run|list",
        "adm": false
    },
    "^chat(.+)": {
        "cmd": "t|all:$1",
        "adm": false
    },
    "执行(.+)": {
        "cmd": "run|$1",
        "adm": true
    }
}
```

这里自带一些正则表达式指令和示范，`cmd`项是要执行的命令，`adm`是是否需要管理员来触发
。

此处将绑定、解绑、查服、指定聊天前缀转发（此处为chat）、执行命令使用正则表达式操作，提供了更多的自定义空间。

具体的命令可用查看[正则表达式命令](/subpages/cmd.md)

## [-->怎么使用呢](/subpages/use.md)
