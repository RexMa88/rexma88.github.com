Apple公司于2013WWDC上推出了iOS7。其中一个新特性就是UIDynamic~之前写动画的时候，很少会想到物理特性~而且就算要添加物理特性，就会有一种蛋碎的感觉=_=~但是Apple公司出了，我就看看，就写了一个小demo，这里是[链接](https://github.com/RexMa88/UIDynamic-Demo)，以后还会继续更新。

#物理效果

##连接物理世界的载体--UIDynamicAnimator

在iOS中，实现物理行为要有一个**载体**或者说胶水也可以，这个载体就是**UIDynamicAnimator**，所有的物理行为都要添加在这个载体中，而且这个载体的初始化很有意思。
	
	animator= [[UIDynamicAnimator alloc] initWithReferenceView:self.view];
	
这就好比正常的iOS环境中是出于**另一个世界**，这个世界是没有重力，弹力，摩擦力等各种物理效果，但是突然~你使用UIDynamicAnimator给这个世界添加了可以赋予这些物理行为的**新世界**，而且你还能决定这个世界是多大**（initWithReferenceView）**这个世界就变得好玩多了~！

添加物理行为也很简单~如下：

	[animator addBehavior:physicalBehavior];
	
如果你要是看那个物理行为不是很爽的话~你也可以把它干掉。

	[animator removeBehavior:physicalBehavior];

当然，如果你要是想移除全部的物理行为，抛弃这个世界的话~也没问题~直接：
	
	[animator removeAllBehaviors];
	
##物理行为--UIDynamicBehavior

OK，有了载体~我们就可以把物理特效添加进去了~而且Apple对于物理效果支持还是比较好的~可以自定义物理特效~在我的Demo中~第一个是物理特效，很简单，直接初始化添加进去就可以了，但是我们还要深入一下.

###UIGravityBehavior

####angle

如果你要是只要自由落体的效果那很简单，直接初始化添加进去就可以了，默认是M_PI_2（PI的二分之一）**请注意：在iOS中坐标系是反过来的**~但是如果你想要来个角度的话~那就设置一下角度。我试了一下~还蛮不错的

####magnitude

我查了一下这个单词的意思是大小，但是你没告诉我什么大=_=，没关系~我亲试一下就可以了。

![magnitude](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/magnitude.png)

我个人觉得这块儿Apple说的有点不太清楚，因为我在测试不同的magnitude数值之后发现它并不是严格意义上的vector，学过高中物理的朋友肯定都明白一个道理~矢量是“大小” + “方向”，但是这里magnitude明显是**力的大小**并没有提及方向的事情~不过方向马上就说~

####gravityDirection

看到这个变量的名称和类型~我明白了~CGVector是设置重力方向的，但是这个命名...╯︿╰好吧~这个可以设置"力的方向"。其实，看到这里都明白了，那就是gravityDirection + magnitude = 矢量。

**关于angle和gravityDirection其实是为了适应不同的人群，但效果都一样，你用那个都无所谓，如果用我亲测了一下，angle和gravityDirection会互相覆盖效果！所以，angle和gravityDirection，你二选一吧。**
	