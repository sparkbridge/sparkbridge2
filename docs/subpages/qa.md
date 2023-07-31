# 问答

## 为什么出现报错：“解析群聊信息出现异常 e.foreach is not a function”？

说明你应该回到 [配置亿下](/subpages/conf.md) 把gocq第一步重新做一次。把post-format的值改成array！！！！

## 为什么部分插件无法加载，显示“SyntaxError: Unexpected token ﻿□ in JSON at position 0”？

该故障原因因为编码错误导致的。请检查所有插件的config以及插件本身的config文件格式是否为UTF-8（UTF8 BOM也不行）

## 为什么我的plugins文件夹没有nodejs文件夹？

Liteloader的版本需要大于2.5.0。

## 如何安装llplugin文件？

直接放进BDS的plugins文件夹即可。

## 无法登录？

搭建[qsign签名服务器](https://github.com/fuqiuluo/unidbg-fetch-qsign)

## 如何扫码登录？

认真阅读gocq文档配置部分你就会知道

## 可以连接多个服务器吗？

暂时不可以。


## 出现：获取 Ticket 时出现错？

你所在的地区墙了go-cqhttp的服务器或者服务商禁用了国外IP

解决办法：向服务商申请解禁或者挂梯子。

## sparkbridge.llplugins放进服务器一直无法正常下载配置文件

什么？你用的是简幻欢？他们屏蔽了我们的github资源。请加群下载完整版的sparkbridge

## 教程看不懂怎么办？

![](/qa/pa.png)
