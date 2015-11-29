---
layout: post
title: "Runtime resolveInstanceMethod and resolveClassMethod"
subtitle: "iOS Develop"
author: "Rex Ma"
date: 2015-11-29 16:17:45
header-img: "img/post-bg-03.jpg"
---
#Runtime
Objective-C的Runtime机制想必大家并不陌生，这是由于Objective-C是动态语言所决定的，Runtime机制也可以说是在日常iOS开发中的“黑科技”兼“双刃剑”.以后我会针对这个机制进行一个长期的整理.

##消息转发
消息转发可以说是Runtime机制的核心，里面方法的实现是通过**objc_msgSend(obj,method)**传递实现的。而这又与objc\_object、objc\_class的结构有关。如图所示：

![objc_object_struct](https://github.com/RexMa88/rexma88.github.com/blob/master/img/objc_object.png)

![objc_class_struct](https://github.com/RexMa88/rexma88.github.com/blob/master/img/objc_class.png)

请注意一下这个objc\_object结构体中就一个isa指针，如果看官们自己去寻找一下这个指针的话，会在objc\_object结构体上看见其实isa是objc\_class指针.

**现在我们回过来再看**
**1,objc_msgSend(obj,method)**通过obj的isa指针找到objc_class结构。

**2,在这里请注意，先从objc\_cache中查找经常使用的被缓存的方法，这样可以大大地提高执行效率~而并不是直接遍历objc\_method_list中的方法,这样的话效率实在太低了,当然，如果objc\_cache中找不到的话~就会去objc_method_list中查找了**

**3,如果你没查找到,咋办呢？没关系,你可以看见objc\_class里边还有一个super_class,继续往超类上寻找.**

**4,一直往上寻找，找到了就去实现方法(objc\_method)IMP,没找到咋办？报错~而且这个错误还是经常见到的,就是unrecognized selector sent to instance**

**5,但是呢，我前边说过了~咱们的Objective-C是动态语言,所以在运行时（Runtime）阶段,你有三次机会可以添加方法（method）,这样可以避免你的程序发生4中的异常,本章节先说最早能改变的一种方式**

##resolveInstanceMethod
这是我写的关于这个方法的[链接](https://github.com/RexMa88/runtime-addMethod),**(由于这个demo还处在孵化阶段，resolveInstanceMethod的方法已经实现,但是resolveClassMethod有点小问题,不过马上就会解决了.)**

下面这个方法就是主要实现~程序在运行时,会遍历该Controller中要实现的方法,我亲测了一下,无论方法有没有实现,只要声明了就会进入这个方法.之后找到你想要添加的方法的名称(可添加,可替换,demo中是替换掉超类的方法),之后看class_addMethod,其实就是在instanceMethod中换成runtimeInstanceMethod的实现,大概意思就是对instanceMethod中的IMP说**“你滚蛋,老子((IMP)runtimeInstanceMethod)来了= =”**

**注:由于已经替换了其中的方法了,千万不要在把instanceMethod方法的实现在写进去,要不然又被挤出来了~= =**

	+ (BOOL)resolveInstanceMethod:(SEL)sel{
    	if (sel == @selector(instanceMethod)) {
        	class_addMethod([self class], @selector(instanceMethod),(IMP)runtimeInstanceMethod, "");
        	return YES;
    	}
    	return [super resolveInstanceMethod:sel];
	}
	
之后看一下替换掉的对象方法的输出,也很有意思.如图:

![runtimeInstanceMethod](https://github.com/RexMa88/rexma88.github.com/blob/master/img/resolveInstanceMethod.png)

其中_cmd就是指**本来**的方法,而obj则是指实现该方法的类.可以看出本来的方法真的是**instanceMethod**,而其中的实现(IMP)则被runtimeInstanceMethod替换了.

-------未完待续-----程序猿真的应该敲会儿代码，歇一会儿~脖子难受.
