---
layout: post
title: "Grand Central Dispatch(GCD)"
subtitle: "iOS Develop"
author": "Rex Ma"
date: 2015-12-22 15:30:35
header-img: "img/post-bg-11.jpg"
---
#Grand Central Dispatch(GCD)

由于近日听说国内在多线程这块儿还是比较钟情于GCD的，**但是我个人比较喜欢容易管理的NSOperation以及国外也比较喜欢使用NSOperation，我觉得可能是大家想要的不同吧，NSOperation比较容易管理，而且定制化也比较强，但效率不及GCD。而且NSOperation是基于GCD实现的。**所以，为了能够提高我在GCD上的使用水平以及了解程度。我打算从头撸一把GCD的东西。先来个[代码链接](https://github.com/RexMa88/Concurrent/tree/master/GrandCentralDispatch)...(由于GCD需要不断探索，代码需要不断更新)。

##关于Block

在写这篇文章之前，我看了一下唐巧老师的Blog，感觉的写的还是挺不错的~也提及了Block的事情，但是还不够全面，这里给出一个网址，Block绝对包会。[http://fuckingblocksyntax.com/](http://fuckingblocksyntax.com/)。**另外关于Block，我还是建议要好好运用的~因为在Apple的新语言swift中，Block换了个名字，叫闭包，它在swift语言中的地位堪比亲儿子，运用起来十分的灵活。**

##关于同步和异步

在GCD中有两种不同的处理方法，一种是dispatch_sync，另一种是dispatch_async。其实就是同步和异步。dispatch_sync就是等待完成任务才会产生回调，而dispatch_async是立刻产生回调，不会阻塞当前线程去执行下一个函数，这里给出百度知道团队孙源大神的iOS六级考试的最后一题答案[iOS六级考试](http://blog.sunnyxx.com/2014/03/06/ios_exam_0_key/)。

另外，我个人建议是打断点看一下，同步和异步的执行路线，这样的话还是可以加深理解的。

##关于并发和并行

关于这部分的概念我也想说一下，以免今后用词不够准确。我先上图(侵删)：

![concurrencyAndParallelism](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/ConcurrencyAndParallelism.png)

**并发是指线程的上下文切换，由于操作系统的切换速度很快，所以会给我们造成一种一起执行的错觉。**
**并行指的是多核CPU同时执行多个线程。**

有的人可能对这个概念熟悉，但是由于“并行”与“并发”只有一字之差，为了方便记忆，我就说一个记忆的Tips。node.js这个技术大家没用过也听过吧，**node的特征就是单进程单线程多例程高并发的。**所以当你在分不清并发与并行的概念时，在内心呼唤一下node，把node的特征背一遍，就懂了。

##关于dispatch操作

###dispatch\_queue_t

在GCD中，你可以使用后台线程，也可以使用主线程，也可以自定义一个线程。

	//后台线程
	dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(queue, ^{
        //code
    });
    
    //主线程
    dispatch_queue_t mainQueue = dispatch_get_main_queue();
    dispatch_async(mainQueue, ^{
        //code
    });
    //自定义队列
   	 dispatch_queue_t customQueue = dispatch_queue_create("rexmacustomqueue", NULL);
    dispatch_async(customQueue, ^{
        //code
    });
    dispatch_release(customQueue);//不要忘记释放队列
    
###dispatch_get_global VS dispatch_queue_create

我在stackoverflow中找到了关于这两种队列区别的答案，[链接](http://stackoverflow.com/questions/10984885/what-is-the-difference-between-dispatch-get-global-queue-and-dispatch-queue-crea)，大意就是dispatch_get_global更加适合创建并发的队列，而dispatch_queue_create更适合创建串行队列。

###串行队列与并行队列

另外，队列还分为串行和并行队列，串行队列就类似于数据结构中的FIFO(First In First Out),而并行队列则按顺序添加，但不知道何时任务会完成，同一时刻有多个任务一起执行，而具体的完成顺序是由GCD决定的。

**dispatch\_get\_global\_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)用这个方法生成的队列默认是并行队列。**

如果你想自定义串行或者并行队列的话，可以使用下面的方法：
	
	dispatch_queue_t concurrentQueue =dispatch_queue_create("RexMaConcurrentQueue", DISPATCH_QUEUE_CONCURRENT);
	dispatch_queue_t serialQueue = dispatch_queue_create("RexMaSerialQueue", DISPATCH_QUEUE_SERIAL);

###队列优先级(DISPATCH\_QUEUE_PRIORITY)

在GCD中，队列的优先级分为四类：Background，Low，Default，High这四类，让我们跟进去看看这四种优先级。
	
![dispatch_queue_priority](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/dispatch_queue_priority.png)

其实，之前我一直以为Low的优先级是最低，后来看到里面优先级的宏定义之后，发现Background是最低的(INT16_MIN等于-32768)以及又通过dispatch\_group（后面会讲）测试了这几个优先级，**最终敲定~当你的队列优先级都一样的时候~完成任务的顺序确实是随机的，只有当你的优先级比别的高时，才会提前完成，注意这点，如果你的队列需要某个数据，而这个数据有必须通过某个方法获取，这个时候优先级的使用是至关重要的，它可以避免崩溃以及死锁。**

###关于Group

在dispatch\_group\_t中可以添加队列，并且可以通过优先级决定哪个队列优先执行，当组中的操作全部完成时还可以通过dispatch\_group_notify进行一个总结性操作，这里有一个小的tip，如果你希望在完成某个操作之后想做点儿什么，就可以把操作放在dispatch\_group\_notify里边。**当然，使用group可能会有点重了，如果你的操作在主线程的话~可以直接使用dispatch\_async(dispatch\_get\_main\_queue(), ^{ //code }),这种相对轻量级的做法。**

###关于延时操作

GCD还专门提供了通过dispatch\_after进行延时操作的方法，通过dispatch\_time\_t可以获取时间间隔(uint64\_t)。如图：

![dispatch_time_t](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/dispatch_time_t.png)

这张图还是很好理解的，什么时候开始以及时间间隔是多少，具体的实现已经放在我的Demo中了。

	dispatch_after(delaytime, dispatch_get_main_queue(), ^{
        NSLog(@"Hello world");
    });
 
之后就很好理解了~把推迟的delaytime放进去就可以了。

关于DISPATCH_TIME_NOW在GCD中的定义是0ull，而关于DISPATCH\_TIME\_FOREVER是~0ull。0ull是unsigned long long类型，值为0。

##关于dispatch_once

关于dispatch_once的用法，这个方法一般用在单例模式中，使用这种方式创建单例模式在线程中是安全的，具体的实现就不说了，这都是老掉牙的东西了。

##关于dispatch_apply

利用dispatch_apply是一种十分高效的迭代方式，如果你的迭代是独立的(前后数据互不影响)可以使用并发队列，dispatch\_apply原生的API是同步的，如下所示：
	
	//创建一个并发队列
	dispatch_queue_t queue = dispatch_get_global(DISPATCH_QUEUE_PRIORITY,0);
	//dispatch_apply同步执行
	dispatch_apply(10, queue, ^(size_t index) {
        NSLog(@"The index is %zu",index);
    });
    
**注：dispatch\_get\_main()在dispatch\_apply是不起作用的，如果你想串行，可以使用dispatch\_queue_create()创建串行队列。**

改成异步的也很简单，只要把它放在dispatch_async里边就可以了~这种利用iPhone多核心进行编程的遍历方式还有:
	
	[array enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        //step
    }];

#关于GCD高级用法

**由于是GCD高级用法，所以可能说的不是非常准确，如果不准确的话，还希望客位看官给指正一下。**

##分派源(dispatch\_source\_t)

分派源处理是一种十分高效处理事务的方法，我写了个demo。在这里说先说明一下用法吧。

	//创建一个分派源
	dispatch_source_t source = dispatch_source_create(DISPATCH_SOURCE_TYPE_DATA_ADD, 0, 0,dispatch_get_global_queue(0, 0));
	//分派源需要处理的事务
	dispatch_source_set_event_handler(source,^{
		//获取分派源发来的数据;
		id value = dispatch_source_get_data(source);
	});
	//由于分派源创建之后默认是暂停的，所以需要使用dispatch_resume去启动
	dispatch_resume(source);
	
这里用一种十分高效的分派源传递数据的方法。
	
	dispatch_queue_t queue = dispatch_get_global(DISPATCH_QUEUE_PRIORITY_DEFAULT,0);
	
	for(NSUInteger index = 0; index < 100; index++){
		dispatch_async(queue, ^{
			//给分派源发数据
			dispatch_source_merge_data(source, value);
		});
	}	

##信号量(dispatch\_semaphore\_t)

如果学过操作系统的童鞋，应该知道**信号量**这个概念，信号量其实就是资源的数量，当资源数量小于0的时候动作被阻塞。所以，信号量是可以控制**并发数量**的，很像NSOperationQueue的maxConcurrentOperationCount。我个人还是比较喜欢用操作队列的这种写法，因为看起来更直观。但还是说说如何使用dispatch\_semaphore\_t吧。
	
	//创建信号量，初始值为1
	dispatch_semaphore_t semaphore = dispatch_semaphore_create(1);
	//信号量减1，如果此时信号量已经为0，再减1的话，可以通过设置DISPATCH_TIME_FOREVER一直等待.
	long dispatch_semaphore_wait(dispatch_semaphore_t dsema, dispatch_time_t timeout);
	//信号量加1
	long dispatch_semaphore_signal(dispatch_semaphore_t dsema);
	
可以通过加1、减1操作对现有资源进行同步并发操作。譬如我设置3个资源，此时信号量初始值为3，当我有5个事情需要做的时候，可以先放进去3个并发执行，剩下的2个等待...完成1个之后，就塞进去1个去执行。

##队列关联数据(dispatch\_queue\_set\_specific)

###为啥废除dispatch\_get\_current_queue()

说队列关联数据之前，我想先说说Apple已经废除的的一个方法：dispatch\_get\_current\_queue，之前有人说这个方法会引起死锁，但是也没说清楚引起死锁的情况。我就说一种情况进行说明吧。在ViewDidLoad中：
	
	dispatch_sync(dispatch_get_current_queue(),^{
		//doing Something;
	});

此时，dispatch\_get\_current\_queue() == dispatch\_get\_main\_queue()，但现在是同步的，处于互相等待结束的状态，所以就会引起死锁。

###可以用dispatch\_queue\_set\_specific代替

利用GCD的这个特性可以在队列中关联数据（包括队列），这个用法有点和runtime中的动态绑定(objc\_setAssociatedObject、objc\_getAssociatedObject)类似，但是由于队列关联数据不会释放和销毁，所以要传入一个销毁函数(dispatch\_function_t)CFRelease,具体用法如下:
	
	dispatch_queue_set_specific(queue, &key, (void *)value, (dispatch_function_t)CFRelease);
	dispatch_get_specific(&key);
	
我在自己编写的Distribution项目中，封装了这个方法，[链接](https://github.com/RexMa88/Distribution-Jump/blob/master/pushOrPop/RMAsyncQueue.h).