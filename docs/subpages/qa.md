# 问答

## LL3能用吗

可以，使用LSE兼容层配置为index.js作为启动，然后使用nodejs模式。

## 为什么出现报错：“TypeError: msg.map is not a function”？

如果你使用的机器人实现使用string格式，请不要关闭base配置中的OnebotV11，将其保持打开

## 为什么部分插件无法加载，显示“SyntaxError: Unexpected token ﻿□ in JSON at position 0”？

该故障原因因为编码错误导致的。请检查所有插件的config文件格式是否为UTF-8（UTF8 BOM也不行）

## 为什么部分插件无法加载，显示如下类似报错？

```
Error: ENOENT: no such file or directory, open 'plugins\nodejs\sparkbridge2\plugins\xxxx\spark.json'
```

该故障原因因为你使用了sb1的插件。这与sb2不兼容，请等待开发者更新

## 为什么我的plugins文件夹没有nodejs文件夹？

Liteloader的版本需要大于2.5.0。

## 如何安装llplugin文件？

直接放进BDS的plugins文件夹即可。

如果你使用的是LL3,请使用lse兼容层，且nodejs需要另外配置

## 可以连接多个服务器吗？

多个服务器同时安装sparkbridge然后Onebot实现中连接多个后端可实现一个bot控制多个服务器。需要注意的是一个sparkbridge插件只能用于一个服务器。

## 一直卡在npm i

你使用的服务器网络无法很好的连接到github服务器，你可以尝试在自己的电脑上部署程序后将node_modules复制到插件目录下

## 教程看不懂怎么办？

![](/qa/pa.png)

## [-->插件市场](/subpages/store.md)
