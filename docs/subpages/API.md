# Spark API 文档

## 多插件协同API

```js
spark.setOwnProperty('#插件名字#', {});
//创建一个属于你的插件的api共用库

spark.#插件名字#.something=something
//注册全局api

//————————————————————
//此后在其他插件使用
spark.#插件名字#.something()

```

## Log记录器

```js
const lg = require('../../handles/logger');//导入logger库

const logger = lg.getLogger('foobar');//为你的插件log命名

logger.info("Hi!")//输出
```

然后你应该会看见“2024-04-26 11:45:14 [foobar] [info] Hi!”这样的输出

## 文件读取api 

```js
const configFile = spark.getFileHelper('Example');//获取Example插件的配置文件目录
let a=configFile.getFile("a.txt")//获取目录下指定文本文件
let b=configFile.getBuffer("b.jpg")//获取插件目录下指定二进制文件（如图片，音视频等等）

```
## 正则表达式自定义变量

通过插件regex，我们可以通过预留的占位符变量来在信息中插入变量，如%User_Name%

那我们能不能自己创建占位符变量呢

当然可以，我们在框架中预留了自定义占位符api，调用如下：

```js
//例如，我们想要通过变量%Game_Version%回复游戏版本，那可以进行如下操作
spark.Cmd.regPlaceHolder('Game_Version', () => {
    return mc.getBDSVersion();
});

```
你可以自制插件导入库实现更多功能。

## spark.QClient 开发文档

> 我们在其中接入了大部分Onebot支持的API，具体是否可用参照你所使用的Onebot实现。


### `spark.QClient.sendGroupMsg`
**描述:**
发送群组消息。

**参数:**
- `gid` (数字): 群组ID。
- `msg` (消息对象): 要发送的消息。

**返回值:**
- Promise 对象，解析为服务器响应数据。

**用法:**
```javascript
spark.QClient.sendGroupMsg(12345678, { type: 'text', data: { text: '你好，群组！' } })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### `spark.QClient.sendPrivateMsg`
**描述:**
发送私聊消息。

**参数:**
- `fid` (数字): 用户ID。
- `msg` (消息对象): 要发送的消息。

**返回值:**
- Promise 对象，解析为服务器响应数据。

**用法:**
```javascript
spark.QClient.sendPrivateMsg(87654321, { type: 'text', data: { text: '你好，朋友！' } })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### `spark.QClient.sendGroupForwardMsg`
**描述:**
发送群组转发消息。

**参数:**
- `gid` (数字): 群组ID。
- `msg` (消息对象): 要发送的转发消息。

**返回值:**
- Promise 对象，解析为服务器响应数据。

**用法:**
```javascript
spark.QClient.sendGroupForwardMsg(12345678, { ... })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.sendGroupBan`
**描述:**
设置群组成员禁言。

**参数:**
- `gid` (数字): 群组ID。
- `mid` (数字): 成员ID。
- `d` (数字): 禁言时长（秒）。

**用法:**
```javascript
spark.QClient.sendGroupBan(12345678, 87654321, 3600);
```

###  `spark.QClient.deleteMsg`
**描述:**
删除消息。

**参数:**
- `id` (数字): 消息ID。

**用法:**
```javascript
spark.QClient.deleteMsg(12345678);
```

###  `spark.QClient.getGroupMemberList`
**描述:**
获取群组成员列表。

**参数:**
- `gid` (数字): 群组ID。

**返回值:**
- Promise 对象，解析为成员列表数据。

**用法:**
```javascript
spark.QClient.getGroupMemberList(12345678)
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getGroupMemberInfo`
**描述:**
获取群组成员信息。

**参数:**
- `gid` (数字): 群组ID。
- `mid` (数字): 成员ID。

**返回值:**
- Promise 对象，解析为成员信息数据。

**用法:**
```javascript
spark.QClient.getGroupMemberInfo(12345678, 87654321)
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.setGroupAddRequest`
**描述:**
处理群组添加请求。

**参数:**
- `flag` (字符串): 请求标识。
- `sub_type` (字符串): 请求类型。
- `approve` (布尔值): 是否批准。

**用法:**
```javascript
spark.QClient.setGroupAddRequest('flag_example', 'add', true);
```

###  `spark.QClient.setFriendAddRequest`
**描述:**
处理好友添加请求。

**参数:**
- `flag` (字符串): 请求标识。
- `approve` (布尔值): 是否批准。

**用法:**
```javascript
spark.QClient.setFriendAddRequest('flag_example', true);
```

###  `spark.QClient.sendLike`
**描述:**
发送点赞消息。

**参数:**
- `fid` (数字): 用户ID。
- `times` (数字): 点赞次数。

**用法:**
```javascript
spark.QClient.sendLike(87654321, 10);
```

###  `spark.QClient.getMsg`
**描述:**
获取消息。

**参数:**
- `id` (数字): 消息ID。

**返回值:**
- Promise 对象，解析为消息数据。

**用法:**
```javascript
spark.QClient.getMsg(12345678)
    .then(data => console.log(data))
    .catch(error => console.error(error));
```


###  `spark.QClient.sendGroupWholeBan`
**描述:**
设置群组全体禁言。

**参数:**
- `gid` (数字): 群组ID。
- `enable` (布尔值): 是否启用禁言。

**用法:**
```javascript
spark.QClient.sendGroupWholeBan(12345678, true);
```

###  `spark.QClient.setGroupKick`
**描述:**
将成员移出群组。

**参数:**
- `gid` (数字): 群组ID。
- `mid` (数字): 成员ID。
- `rej` (布尔值): 是否拒绝再次申请加入。

**用法:**
```javascript
spark.QClient.setGroupKick(12345678, 87654321, true);
```

###  `spark.QClient.setGroupLeave`
**描述:**
退出或解散群组。

**参数:**
- `gid` (数字): 群组ID。
- `dismiss` (布尔值): 是否解散群组。

**用法:**
```javascript
spark.QClient.setGroupLeave(12345678, true);
```

###  `spark.QClient.setGroupName`
**描述:**
设置群组名称。

**参数:**
- `gid` (数字): 群组ID。
- `name` (字符串): 新的群组名称。

**用法:**
```javascript
spark.QClient.setGroupName(12345678, '新群名称');
```

###  `spark.QClient.getStrangerInfo`
**描述:**
获取陌生人信息。

**参数:**
- `sid` (数字): 陌生人ID。
- `no_cache` (布尔值): 是否不使用缓存。

**返回值:**
- Promise 对象，解析为陌生人信息数据。

**用法:**
```javascript
spark.QClient.getStrangerInfo(87654321, true)
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getFriendInfo`
**描述:**
获取好友信息。

**参数:**
- `fid` (数字): 好友ID。
- `no_cache` (布尔值): 是否不使用缓存。

**返回值:**
- Promise 对象，解析为好友信息数据。

**用法:**
```javascript
spark.QClient.getFriendInfo(87654321, true)
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getGroupInfo`
**描述:**
获取群组信息。

**参数:**
- `gid` (数字): 群组ID。
- `no_cache` (布尔值): 是否不使用缓存。

**返回值:**
- Promise 对象，解析为群组信息数据。

**用法:**
```javascript
spark.QClient.getGroupInfo(12345678, true)
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getFriendList`
**描述:**
获取好友列表。

**返回值:**
- Promise 对象，解析为好友列表数据。

**用法:**
```javascript
spark.QClient.getFriendList()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getGroupList`
**描述:**
获取群组列表。

**返回值:**
- Promise 对象，解析为群组列表数据。

**用法:**
```javascript
spark.QClient.getGroupList()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getGroupHonorInfo`
**描述:**
获取群组荣誉信息。

**参数:**
- `gid` (数字): 群组ID。
- `type` (字符串): 荣誉类型。

**返回值:**
- Promise 对象，解析为荣誉信息数据。

**用法:**
```javascript


spark.QClient.getGroupHonorInfo(12345678, 'talkative')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

###  `spark.QClient.getStatus`
**描述:**
获取客户端状态。

**返回值:**
- Promise 对象，解析为状态数据。

**用法:**
```javascript
spark.QClient.getStatus()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```
## 如何自行实现api

使用
```js
spark.QClient.sendWSPack(SOMEFUNCTION(sth));
//自行通过sendWSPack调用自己的方法

//也可以导入packbuilder库引入已有的api
const packbuilder = require('../../handles/packbuilder');
spark.QClient.sendWSPack(packbuilder.GroupMessagePack(gid, msg, tmp_id));
```


## Msgbuilder API 文档

这一部分用于更加灵活地构建信息

首先你需要在你的插件中调用库msgbuilder
```js
const msgbuilder = require('../../handles/msgbuilder');
```

使用
```js
msgbuilder.someFunction()
```

以调用

>发消息的时候请使用数组来和正常信息的字符串拼接:
如：
```js
let string=[]
let msg="some word"
let img=msgbuilder.img(Buffer)
string.push(msg)
string.push(img)
reply(string)
//发送文字同时和图片
```


---

### `img(file)`

返回表示图片消息的对象。

- **参数：**
  - `file`（字符串 | Buffer）：图片文件的路径或图片缓冲区。

- **返回值：** 
  包含图片数据的对象。

---

### `at(qid)`

返回表示 @提及 消息的对象。

- **参数：**
  - `qid`（字符串）：QQ ID。

- **返回值：** 
  包含 @提及 数据的对象。

---

### `face(id)`

返回表示表情消息的对象。

- **参数：**
  - `id`（字符串）：表情 ID。

- **返回值：** 
  包含表情数据的对象。

---

### `text(raw)`

返回表示文本消息的对象。

- **参数：**
  - `raw`（字符串）：原始文本。

- **返回值：** 
  包含文本数据的对象。

---

### `poke(id)`

返回表示戳一戳消息的对象。

- **参数：**
  - `id`（字符串）：QQ ID。

- **返回值：** 
  包含戳一戳数据的对象。

---

### `reply(id)`

返回表示回复消息的对象。

- **参数：**
  - `id`（字符串）：回复 ID。

- **返回值：** 
  包含回复数据的对象。

---

### `format(msg)`

格式化消息以确保其结构正确。

- **参数：**
  - `msg`（字符串 | 对象 | 数组）：要格式化的消息（们）。

- **返回值：** 
  格式化后的消息。

---

### `ForwardMsgBuilder()`

返回 ForwardMsgBuilder 的新实例。

- **返回值：** 
  ForwardMsgBuilder 的新实例。











