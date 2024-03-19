# Msgbuilder API 文档

首先你需要在你的插件中调用库msgbuilder
```js
const msgbuilder = require('../../handles/msgbuilder');
```

使用
```js
msgbuilder.someFunction()
```

以调用

>发消息的时候请使用数组来和正常信息的字符串拼接


---

## `img(file)`

返回表示图片消息的对象。

- **参数：**
  - `file`（字符串 | Buffer）：图片文件的路径或图片缓冲区。

- **返回值：** 
  包含图片数据的对象。

---

## `at(qid)`

返回表示 @提及 消息的对象。

- **参数：**
  - `qid`（字符串）：QQ ID。

- **返回值：** 
  包含 @提及 数据的对象。

---

## `face(id)`

返回表示表情消息的对象。

- **参数：**
  - `id`（字符串）：表情 ID。

- **返回值：** 
  包含表情数据的对象。

---

## `text(raw)`

返回表示文本消息的对象。

- **参数：**
  - `raw`（字符串）：原始文本。

- **返回值：** 
  包含文本数据的对象。

---

## `poke(id)`

返回表示戳一戳消息的对象。

- **参数：**
  - `id`（字符串）：QQ ID。

- **返回值：** 
  包含戳一戳数据的对象。

---

## `reply(id)`

返回表示回复消息的对象。

- **参数：**
  - `id`（字符串）：回复 ID。

- **返回值：** 
  包含回复数据的对象。

---

## `format(msg)`

格式化消息以确保其结构正确。

- **参数：**
  - `msg`（字符串 | 对象 | 数组）：要格式化的消息（们）。

- **返回值：** 
  格式化后的消息。

---

## `ForwardMsgBuilder()`

返回 ForwardMsgBuilder 的新实例。

- **返回值：** 
  ForwardMsgBuilder 的新实例。











# Websocket API 文档

首先你需要在你的插件中调用库packbuilder
```js
const packbuilder = require('../../handles/packbuilder');
```

然后使用

```js
spark.QClient.sendWSPack(packbuilder.someFUNCTION(sth));

/*如：*/
spark.QClient.sendWSPack(packbuilder.GroupMessagePack(gid, msg, tmp_id));

```
来使用api



---

## `PrivateMessagePack(fid, msg, id)`

- **描述：** 构造私聊消息包对象。
  
  - `fid`（字符串）：好友的 ID。
  - `msg`（字符串）：消息内容。
  - `id`（字符串）：回显标识符。
  


---

## `GroupMessagePack(gid, msg, id)`

- **描述：** 构造群聊消息包对象。
  
  - `gid`（字符串）：群组 ID。
  - `msg`（字符串）：消息内容。
  - `id`（字符串）：回显标识符。
  


---

## `LikePack(fid)`

- **描述：** 构造点赞包对象。
  
  - `fid`（字符串）：接收者的用户 QQ。
  


---

## `DeleteMsgPack(id)`

- **描述：** 构造删除消息包对象。
  
  - `id`（字符串）：消息 ID。



---

## `GroupBanPack(gid, mid, duration)`

- **描述：** 构造禁言群成员包对象。
  
  - `gid`（字符串）：群组 ID。
  - `mid`（字符串）：成员的用户 QQ。
  - `duration`（数值）：禁言时长（单位：秒）。
  


---

## `GroupRequestPack(flag, sub_type, approve, echo)`

- **描述：** 构造设置群添加请求包对象。
  
  - `flag`（字符串）：请求标志。
  - `sub_type`（字符串）：子类型。
  - `approve`（布尔值）：是否批准。
  - `echo`（字符串）：回显标识符。
  


---

## `FriendRequestPack(flag, approve, echo)`

- **描述：** 构造设置好友添加请求包对象。
  
  - `flag`（字符串）：请求标志。
  - `approve`（布尔值）：是否批准。
  - `echo`（字符串）：回显标识符。
  

---
