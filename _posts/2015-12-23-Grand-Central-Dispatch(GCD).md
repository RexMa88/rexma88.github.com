---
layout: post
title: "Grand Central Dispatch(GCD)"
subtitle: "iOS Develop"
author": "Rex Ma"
date: 2015-12-22 15:30:35
header-img: "img/post-bg-11.jpg"
---
#Grand Central Dispatch(GCD)

由于近日听美丽说和百度的技术人员说国内在多线程这块儿还是比较钟情于GCD的，**但是我个人比较喜欢容易管理的NSOperation以及国外也比较喜欢使用NSOperation，我觉得可能是大家想要的不同吧，NSOperation比较容易管理，而且定制化也比较强，但效率不及GCD。而且NSOperation是基于GCD实现的。**所以，为了能够提高我在GCD上的使用水平以及了解程度。我打算从头撸一把GCD的东西。

一开始看GCD的全称Grand Central Dispatch时，又是Grand，又是Central的，一向符合Apple公司的（zhuang）气（bi）质。总感觉“我靠，好流弊啊！”，翻译中文（translate.google.cn）之后，叫“大中央调度”。

##关于Block

在写这篇文章之前，我看了一下唐巧老师的Blog，感觉的写的还是挺不错的~也提及了Block的事情，但是还不够全面，这里给出一个网址，Block绝对包会。[http://fuckingblocksyntax.com/](http://fuckingblocksyntax.com/)。**另外关于Block，我还是建议要好好运用的~因为在Apple的新语言swift中，Block换了个名字，叫闭包，它在swift语言中的地位堪比亲儿子，运用起来十分的灵活。**

##关于同步和异步

在GCD中有两种不同的处理方法，一种是dispatch_sync，另一种是dispatch_async。其实就是同步和异步。dispatch_sync就是等待完成任务才会产生回调，而dispatch_async是立刻产生回调，不会阻塞当前线程去执行下一个函数，这里给出百度知道团队孙源大神的iOS六级考试的最后一题答案[iOS六级考试](http://blog.sunnyxx.com/2014/03/06/ios_exam_0_key/)。

##关于并发和并行

之前和美丽说的商家入驻组的PHP工程师有过交流，关于这部分的概念我也想说一下，以免今后用词不够准确。我先上图(侵删)：

![concurrencyAndParallelism](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/ConcurrencyAndParallelism.png)

**并发是指线程的上下文切换，由于操作系统的切换速度很快，所以会给我们造成一种一起执行的错觉。**
**并行指的是多核CPU同时执行多个线程。**

有的人可能对这个概念熟悉，但是由于“并行”与“并发”只有一字之差，为了方便记忆，我就说一个记忆的Tips。node.js这个技术大家没用过也听过吧，**node的特征就是单进程单线程多例程高并发的。**所以当你在分不清并发与并行的概念时，在内心呼唤一下node，把node的特征背一遍，就懂了。

##关于dispatch操作

###dispatch\_queue_t

在GCD中，你可以使用后台线程，也可以使用主线程，也可以自定义一个线程。

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
    
###串行队列与并行队列

另外，队列还分为串行和并行队列，串行队列就类似于数据结构中的FIFO(First In First Out),而并行队列则按顺序添加，但不知道何时任务会完成，同一时刻有多个任务一起执行，而具体的完成顺序是由GCD决定的。

###队列优先级(DISPATCH\_QUEUE_PRIORITY)

在GCD中，队列的优先级分为四类：Background，Low，Default，High这四类，让我们跟进去看看这四种优先级。
	
![dispatch_queue_priority](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/dispatch_queue_priority.png)

其实，之前我一直以为Low的优先级是最低，后来看到里面优先级的宏定义之后，发现Background是最低的(INT16_MIN等于-32768)以及又通过dispatch_group（后面会讲）测试了这几个优先级，**最终敲定~当你的队列优先级都一样的时候~完成任务的顺序确实是随机的，只有当你的优先级比别的高时，才会提前完成，注意这点，如果你的队列需要某个数据，而这个数据有必须通过某个方法获取，这个时候优先级的使用是至关重要的，它可以避免崩溃以及死锁。**

<!--###关于Group

在dispatch\_group_t中可以添加队列，并且可以通过优先级决定那个队列优先执行，当组中的操作全部完成时还可以
-->
