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

![objc_object_struct](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/objc_object.png)

![objc_class_struct](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/objc_class.png)

请注意一下这个objc\_object结构体中就一个isa指针，如果看官们自己去寻找一下这个指针的话，会在objc\_object结构体上看见其实isa是objc\_class指针.

**现在我们回过来再看**
**1,objc_msgSend(obj,method)**通过obj的isa指针找到objc_class结构.

**2,在这里请注意，先从objc\_cache中查找经常使用的被缓存的方法，这样可以大大地提高执行效率~而并不是直接遍历objc\_method_list中的方法,这样的话效率实在太低了,当然，如果objc\_cache中找不到的话~就会去objc_method_list中查找了**

**3,如果你没查找到,咋办呢？没关系,你可以看见objc\_class里边还有一个super_class,继续往超类上寻找.**

**4,一直往上寻找，找到了就去实现方法(objc\_method)IMP,没找到咋办？报错~而且这个错误还是经常见到的,就是unrecognized selector sent to instance**

**5,但是呢，我前边说过了~咱们的Objective-C是动态语言,所以在运行时（Runtime）阶段,你有三次机会可以添加方法（method）,这样可以避免你的程序发生4中的异常,本章节先说最早能改变的一种方式**

##resolveInstanceMethod & resolveClassMethod

**warning:由于这两种方法类似,只不过一个是检测instanceMethod,另一个是检测classMethod的,所以本文中主要是以instanceMethod作为参考系**

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

![runtimeInstanceMethod](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/resolveInstanceMethod.png)

其中_cmd就是指**本来**的方法,而obj则是指实现该方法的类.可以看出本来的方法真的是**instanceMethod**,而其中的实现(IMP)则被runtimeInstanceMethod替换了.

##Method Swizzling(函数混编)

关于Method Swizzling,我先吐槽一下,其实实现代码很简单,一看就能明白,但是我很支持唐巧老师说的,一个技术实现换成了英文就变得"拽拽的",而且我觉得写这方面文章的技术人员不少了,我就不再赘述了~如果,不太了解的朋友,可以参考这篇[Blog](http://nshipster.com/method-swizzling/),我就说说在使用这个技术上应该注意什么吧~

曾经以为没有写过关于Method Swizzling的代码~但是在2015.12.18日早上8点10分在我的Github上看见了这部分的代码！激动ing...^_^...[代码链接](https://github.com/RexMa88/Method-Swizzling-Usage)

###+(void)load
好多人知道在这个方法中实现方法的交换,但是不知道为什么~让咱们看看苹果怎么说的

**The load message is sent to classes and categories that are both dynamically loaded and statically linked, but only if the newly loaded class or category implements a method that can respond......In a custom implementation of load you can therefore safely message other unrelated classes from the same image, but any load methods implemented by those classes may not have run yet.**

注意：dynamic loaded~苹果自己说了动态加载,而且这方法还跟runtime绑定~也就是说你只要引用了runtime,就会被引用,**而且在+(void)load中创建一个对象时,还没有创建autorelease pool,所以你要是使用了不想被释放的变量,最好在load中创建**,在+(void)load中使用Method Swizzling是可以安全地保证你的IMP已经交换了.

在百度知道的开源项目UITableView-FDTemplateLayoutCell中也使用了，Method Swizzling这个黑科技，但在孙源的Blog中并未提及，我上张图，方便大家学习大厂的代码风格，而且我个人**强烈推荐要学习这个开源项目中的知识，因为这个项目代码量不是很多~但是涵盖的知识点却很多~总比一个人撸AFNetWorking要舒服很多吧**

![FDTemplateLayoutCell](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/Method%20Swizzling.png)
