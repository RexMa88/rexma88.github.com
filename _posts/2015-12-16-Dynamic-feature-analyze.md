---
layout: post
title: "UIDynamic feature analyze"
subtitle: "iOS Develop"
author": "Rex Ma"
date: 2015-12-16 11:25:35
header-img: "img/post-bg-10.jpg"
---

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

**关于angle和gravityDirection其实是为了适应不同的人群，但效果都一样，你用那个都无所谓，我亲测了一下，angle和gravityDirection会互相覆盖效果！所以，angle和gravityDirection，你二选一吧。**

###UICollisionBehavior

**找几个比较重要的特性说说吧**

####translatesReferenceBoundsIntoBoundary

这个属性是要告诉碰撞效果是不是在“边”内进行,如果你选择YES的话~默认这里的边界就是[UIScreen mainScreen].bounds的宽度和高度，并且在碰撞中你可以决定碰撞的边界的大小。

	- (void)setTranslatesReferenceBoundsIntoBoundaryWithInsets:(UIEdgeInsets)insets;

这个方法通过修改UIEdgeInsets去改变碰撞的边界~我亲测了一下~效果还是挺不错的。

**补充：这个属性为NO的时候，只是不默认屏幕为边界，如果你要是通过上面的方法修改Inset的话~还是会对边界产生碰撞的**

####- (nullable UIBezierPath *)boundaryWithIdentifier:(id <NSCopying>)identifier

碰撞效果不仅可以以自身屏幕的宽高作为碰撞的“边界”，你也可以通过UIBezierPath自定义碰撞效果的区域，**注意nullable这个是iOS9**的新特性，类似于swift的？和！（拆包和解包）关于iOS9的新特性，我会单独开辟一个新的章节去细说的，如果各位朋友对于UIBezierPath也不是很熟悉的话...没关系...为人民服务...蛤蛤~温故而知新~我也会单独去写一个章节的^_^。

	- (void)addBoundaryWithIdentifier:(id <NSCopying>)identifier forPath:(UIBezierPath *)bezierPath;
	- (void)addBoundaryWithIdentifier:(id <NSCopying>)identifier fromPoint:(CGPoint)p1 toPoint:(CGPoint)p2;
	- (void)removeBoundaryWithIdentifier:(id <NSCopying>)identifier;
	@property (nullable, nonatomic, readonly, copy) NSArray<id <NSCopying>> *boundaryIdentifiers;
	- (void)removeAllBoundaries;

关于上边这些代码都是UICollisionBehavior的内部方法。对了~关于第二个方法其实还是蛮不错的，如果UIBezierPath实在用不好的话~用**点对点**的方式构建一个边界其实还是非常不错与快捷的。

####UICollisionBehaviorDelegate

首先我们先看一下碰撞效果的Delegate方法吧~

	- (void)collisionBehavior:(UICollisionBehavior *)behavior beganContactForItem:(id <UIDynamicItem>)item1 withItem:(id <UIDynamicItem>)item2 atPoint:(CGPoint)p;
	- (void)collisionBehavior:(UICollisionBehavior *)behavior endedContactForItem:(id <UIDynamicItem>)item1 withItem:(id <UIDynamicItem>)item2;
	- (void)collisionBehavior:(UICollisionBehavior*)behavior beganContactForItem:(id <UIDynamicItem>)item withBoundaryIdentifier:(nullable id <NSCopying>)identifier atPoint:(CGPoint)p;
	- (void)collisionBehavior:(UICollisionBehavior*)behavior endedContactForItem:(id <UIDynamicItem>)item withBoundaryIdentifier:(nullable id <NSCopying>)identifier;

先说前两个~前两个是当你的碰撞体系中的碰撞单位超过一个的时候~会调用该方法，而且这个方法可以决定你碰撞前后的行为。你可以Console出你的碰撞点，或者对某一个碰撞单位进行操作。

![CollisionOne](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/CollisionDynamicOne.png)

![CollisionTwo](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/CollisionDynamicTwo.png)

上图为修改了Github上的某个Demo后的效果~

再说后两个，由于我把这四个Delegate方法都了出来，并且都会Log出信息，**但是当你的碰撞体系中的碰撞单位只有一个的时候，便不会调用前两个方法~**

![UICollisionDelegate Method](http://machaotest.oss-cn-beijing.aliyuncs.com/picture/UICollisionDelegate.png)

上图为调用顺序。

###UIDynamicItemBehavior

这个属性是一个比较特殊的物理属性，因为它并不是代表某一种特殊的物理特性，它不是碰撞，重力，吸附等这种行为。而是为了给物体附加一些属性的。这么说可能还是不太明白= =,没关系，看完之后就明白了。

这次直接把UIDynamicItemBehavior里的属性粘贴出来。

	@property (readwrite, nonatomic) CGFloat elasticity; // Usually between 0 (inelastic) and 1 (collide elastically) 
	@property (readwrite, nonatomic) CGFloat friction; // 0 being no friction between objects slide along each other
	@property (readwrite, nonatomic) CGFloat density; // 1 by default
	@property (readwrite, nonatomic) CGFloat resistance; // 0: no velocity damping
	@property (readwrite, nonatomic) CGFloat angularResistance; // 0: no angular velocity damping
	
此刻，彰显了英文的重要性，其实我大学的时候也没学过这几个物理名词，也可能学过忘却了...= =，这四个变量依次是弹力，摩擦力，密度，阻力，角阻力（这个词可能说的不准确，如有物理系童鞋，请纠正）。注释后面是默认值以及取值范围。在我的Demo中，我在碰撞效果中添加了弹力效果，还真是挺真实的~。

**关于阻力和摩擦力其实并不是一个力，摩擦力是指阻碍物体相对运动（或相对运动趋势）的力叫做摩擦力。阻力是指妨碍物体运动的作用力，称“阻力”。**