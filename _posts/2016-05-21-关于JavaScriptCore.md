---
layout: post
title: "关于JavaScriptCore"
subtitle: "iOS Develop"
author: "Rex Ma"
date: 2016-05-21 01:00:00
header-img: "img/post-bg-14.jpg"
---

最近工作十分忙碌。。。许久没有更新Blog了。。。

在最近的工作中，有一些设计到webView调用JS代码从而唤起本地Objective-C的代码的操作，于是便开始研究关于JavaScriptCore的用法。

###JSContext
JSContext相当于是JavaScript的运行环境，相当于JavaScript中的window变量。

