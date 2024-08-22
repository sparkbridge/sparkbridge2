# telemetry

作为SparkBridge的网页可视化配置编辑器

## 接入方法


### 推送配置

注：以下示例注册了一个名为`example`的插件
``` js
const  WebConfigBuilder   = spark.telemetry.WebConfigBuilder;

let wbc = new WebConfigBuilder("example");
wbc.addEditArray('admins',config.admins,'管理员列表');
wbc.addNumber("group",config.group,'监听的群聊');
spark.emit("event.telemetry.pushconfig", wbc);

```

### 监听更改
``` js
spark.on("event.telemetry.updateconfig_example",(plname,K,newV)=>{
    // plname 插件名称 
    // K 修改的配置项
    // newV 配置项更新的值
})
```

## API

``` js
const  WebConfigBuilder   = spark.telemetry.WebConfigBuilder;

let wbc = new WebConfigBuilder("example"); //插件名称

wbc.addEditArray("配置项名称","配置值","配置描述");  // 添加一个可编辑数组

wbc.addChoosing("配置项名称","配置可选列表","配置值（注意此项为number）","配置描述"); // 添加一个可选择数组

wbc.addSwitch("配置项名称","配置值（注意此项为boolen值）","配置描述"); //添加一个开关，此项返回true/false

wbc.addText("配置项名称","配置值","配置描述"); //添加一个可编辑文本

wbc.addNumber("配置项名称","配置值","配置描述"); // 添加一个可编辑数值
```