# Msgbuilder API 文档

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

## QQ发送 API

使用QCilent调用这些通用api：
```js
spark.QClient.SOMEFUNCTION()
```

获取返回值：
```js
async function SOMEFUNCTION() {
            try {
                let data = await spark.QClient.SOMEFUNCTION();
               // console.log("Received data:", data);
                return data;
            } catch (error) {
                console.error("Error:", error);
                throw error; // 可以选择抛出错误或者处理错误
            }
        }
        //使用async创建函数

let getsth =await SOMEFUNCTION()
console.log(getsth)//拿到message传回值，详细规则参见GocqHttp文档。
```

### sendGroupMsg(gid, msg)

发送一个群信息

- **参数：**
  - `gid`：群ID。
  - `msg`：信息内容。



### sendPrivateMsg(fid, msg)

发送一个私信信息

- **参数：**
  - `fid`：好友ID。
  - `msg`：信息内容。

### sendGroupForwardMsg(gid, msg) 

发送群合并聊天信息

- **参数：**
  - `gid`：群ID。
  - `msg`：自定义转发消息, 具体看 [CQcode](https://docs.go-cqhttp.org/cqcode/#%E5%90%88%E5%B9%B6%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E8%8A%82%E7%82%B9)。


### deleteMsg(id)
撤回某个信息

- **参数：**
  - `id`：信息id

## 如何自行实现api

使用
```js
spark.QClient.sendWSPack(SOMEFUNCTION(sth));
//自行通过sendWSPack调用自己的方法

//也可以导入packbuilder库引入已有的api
const packbuilder = require('../../handles/packbuilder');
spark.QClient.sendWSPack(packbuilder.GroupMessagePack(gid, msg, tmp_id));
```