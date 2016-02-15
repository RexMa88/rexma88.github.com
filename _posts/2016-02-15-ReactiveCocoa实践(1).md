
---
layout: post
title: "ReactiveCocoa实践(1)"
subtitle: "iOS Develop"
author: "Rex Ma"
date: 2016-02-15 20:20:00
header: "img/post-bg-02.jpg"
---

#关于ReaciveCocoa
关于ReactiveCocoa的介绍，请点击[链接](http://nshipster.cn/reactivecocoa/).Mattt Thompson已经说得非常细致了，本系列只是为了让所有想快速实践ReactiveCocoa却无从下手的筒子们快速上手实践，在讲解过程中，也会融入理论知识。

##如何实现一个最简单的ReactiveCocoa程序

先拔出一个已经烂了大街的Demo，大家都用它来说ReactiveCocoa~~

	_textfield = [[UITextField alloc] initWithFrame:CGRectMake(0, 100, 200, 30)];
    _textfield.borderStyle = UITextBorderStyleRoundedRect;
    [self.view addSubview:_textfield];
    
    [_textfield.rac_textSignal subscribeNext:^(NSString *value) {
        NSLog(@"The value is %@",value);
    }];
    
嗯呢~这就是一个非常简单的ReactiveCocoa程序，运行之后~你在UITextField上输入一个字符，便会NSLog出一个字符，而且是实时的。从这段代码中，我们可以看出两个看不懂的东西，这两个东西将作为ReactiveCocoa实践的重中之重。分别是：Signal(信号)，Subscribe(订阅)。

##RACSignal



   

