---
layout: post
title: "利用通知以及Runtime机制解耦合"
subtitle: "iOS Develop"
author: "Rex Ma"
date: 2015-11-29 16:17:45
header-img: "img/post-bg-04.jpg"
---
最近，看了一篇关于设计模式的文章，对于代码解耦合有了一些想法，再加上编译原理中**状态机**的概念：输出不仅和状态有关而且和输入有关系，则称为Mealy状态机.~我觉得可以利用一种通知分发的方式解决Controller之间界面跳转的耦合状态.于是,就再github上写了一个[demo](https://github.com/RexMa88/Distribution-Jump).这个demo经过好大夫的iOS工程师看了一下，感觉还算有模有样，建议我继续维护下去，所以现在还在维护ing，希望有志之士可以一同帮助我.

##NSNotificationCenter分发以及通过objc_setAssociatedObject、objc_getAssociatedObject动态关联

NSNotificationCenter这部分还是很简单的,在1对N的消息传递中有着一定的优势，在我的demo中，我对NSNotificationCenter中进行了宏的再封装,用起来更舒服一点。但是我为了让Controller之间不仅可以具有通知传递跳转以及传递数据的功能,还在BaseViewController添加了动态加载与获取的方法.

**关于动态加载的优点:当你接触到某一个陌生类的时候,你想在其中添加自己的属性时，就可以直接通过objc_setAssociatedObject、objc_getAssociatedObject关联就可以了，是一种十分灵活添加属性的方法.**

##AppDelegate中统一管理

在这个demo中,我直接在app启动的时候就对该分发跳转机制添加了通知声明以及处理通知的逻辑,主要是对Push逻辑进行了事务上的处理,其中还添加了Push的Controller本身.

##关于未来方向

关于未来的方向，目前想利用objc_ivar动态添加变量和属性,以及进行动态添加方法,但是对于动态添加方法这部分,我还需要再封装与处理,**利用Runtime机制动态添加也是一种解耦合的方法!并不是为了单纯的炫技~毕竟比我技术好的人还是很多很多的~= =**

