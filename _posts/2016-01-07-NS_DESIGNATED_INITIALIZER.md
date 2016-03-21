---
layout: post
title: "About NS_DESIGNATED_INITIALIZER"
subtitle: "iOS Develop"
author": "Rex Ma"
date: 2016-01-07 13:30:35
header-img: "img/post-bg-03.jpg"
---
最近这几天一直在看AFN的开源代码，向Matt大神学习如何更加规范的敲代码，深感自己在敲代码这条路上走过不少弯路，之后看到AFHTTPRequestOperationManager中有几行不太能看懂的话，如下:
	
	#ifndef NS_DESIGNATED_INITIALIZER
	#if __has_attribute(objc_designated_initializer)
	#define NS_DESIGNATED_INITIALIZER 	__attribute__((objc_designated_initializer))
	#else
	#define NS_DESIGNATED_INITIALIZER
	#endif
	#endif
	
后来我在objc/NSObjcRuntime.h这个文件中也看到了一模一样的写法，就去Google了一下上边这段话中NS_DESIGNATED_INITIALIZER的含义。发现其实NS\_DESIGNATED\_INITIALIZER的宏是用来指定初始化方法的，在Xcode6中就出现了,之后在StackOverflow上看见：
	
* A designated initializer must call (via super) a designated initializer of the superclass. Where NSObject is the superclass this is just [super init].
* Any convenience initializer must call another initializer in the class - which eventually leads to a designated initializer.
* A class with designated initializers must implement all of the designated initializers of the superclass.

提炼一下就是说在使用这个宏指定的初始化方法必须要实现父类中的designated初始化方法。如果你用原先的初始化方法初始化时，也必须要实现子类designted的初始化方法。如果你没有在init方法中实现designated的初始化方法，还会收到警告..当然，你也可以直接调用你设计的初始化方法。