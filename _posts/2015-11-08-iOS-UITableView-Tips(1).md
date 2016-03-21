---
layout: post
title: "iOS UITableView Tips(1)"
subtitle: "iOS Develop"
author": "Rex Ma"
date: 2015-11-08 23:42:35
header-img: "img/post-bg-04.jpg"
---

##UITableView

第一次写Blog,就写一个最常用的，UITableView是iPhone中最常用的UI控件之一，也许要去掉之一。所以说一些UITableView的Tips将在日常开发中起到很大的作用。

###Tips
(由于我之前没有什么写Blog的习惯，所以第一篇看起来会比较杂乱，后期我会慢慢的整理。)

####高度

关于高度方面，很多人都喜欢在UITableViewDataSource中使用下面这个代理方法.

	- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath

但是，如果你的TableViewCell的**高度相同**的话，并不需要调用这个方法，而是直接在配置你的TableView时加上**rowHeight**这个属性即可.下面就说说**高度不同**的时候，使用怎样的方法会比较好。

	tableView.estimatedRowHeight = 50.0
	- (CGFloat)tableView:(UITableView *)tableView estimatedHeightForRowAtIndexPath:(NSIndexPath *)indexPath

见名知意，上边这两句话是用来说明估算高度的，但是这话说的很笼统，你让我估算，每个Cell的高度真心没有特别统一的，你让我怎么估算，我的建议是当cell的高度在一定范围之内采用这种方法比较好，并且取平均值，我相信各位的数学如果不是体育老师教的话，平均值的计算方法应该是不用我说的.

**Warning**:如果你真的无法估算出高度的平均值的话，**慎用！！！**因为UITableView是UIScrollView的子类，UIScrollView的contentSize是由**UITableView的Cell的高度与numberOfCell的数量**决定的，所以，就算是估算高度，也会转换成真正的高度的，但转换的过程中，会出现“即视感”的跳跃.所以我的建议是老老实实地使用第一句的方法去计算高度。

####关于UITableViewCell的布局

当你的UITableViewCell高度不同的时候并且界面比较复杂的时候，我比较推荐使用**纯代码**生成界面，而不是使用xib或StoryBoard。首先，xib和StoryBoard不利于版本管理，而且StoryBoard中各个界面的关系连线让人看起来十分的恶心。使用**纯代码**生成的Cell则相对好管理一些，另外，我的建议是除非cell的风格种类极多，可以创建多个UITableViewCell，如果风格以及逻辑上并不是有很大的区别的话，尽量使用**一个**UITableViewCell会比较好。

####xib布局

由于之前，用xib做过一个类似于微信朋友圈的东西，着实是把我恶心了一下，我就先说说关于cell中使用AutoLayout的注意事项：

**1.应该尽量将高度的约束都“整理清楚”，所谓“整理清楚”就是要把TopConstraint，HeightConstraint，BottomConstraint这些参数给弄好，保证我的Cell中的所有UI控件的这些参数加到一起是Cell的高度.**

**2.巧用优先级，优先级的概念我想我应该是不用说了，这一点体现在朋友圈里最典型的就是当你没有对该条朋友圈消息进行评论或者点赞的时候，你应该自动地忽略这部分的控件（我是用的是UITableView进行评论，点赞功能），这时就应该降低这部分控件的优先级，使得他“有可能”会消失**

**3.动态刷新的时候调用**

	[cell setNeedsUpdateConstraints];
	[cell updateConstraintsIfNeeded];		
	[cell setNeedsLayout];
	[cell layoutIfNeeded];

**会让你的界面重新布局，从而重新计算高度.**

####纯代码布局

说完了xib布局，我就说说纯代码布局的注意事项，上面说过Cell尽量只是用一个，这一点是**纯代码**生成UITableViewCell得天独厚的优势，如果你在一个xib中放置很多控件，这些控件首先要把布局弄好，而且这个布局是“混乱”的，你稍微感受一下可能就会感受到眩晕感了= =

在这里，我推荐一个非常好的布局工具，叫[Masonry](https://github.com/SnapKit/Masonry).这个东西我觉得叫神器都不为过，用它可以直接代替Masonry，关于这个东西的用法，我会在后续的Blog中说明。

####缓存的使用

事实上，这东西已经被说烂了，而且缓存(NSCache)这东西是公认的优化程序的东西，在这里也不例外，在UITableView中常见的优化方式是用利用UITableView的indexPath属性去缓存不同cell的不同高度.

但是在这部分，依旧是有空间可以进行再**优化**的，我们进行项目开发的时候，一般都是先从后台获取数据，生成model，好！现在假设每个Cell的布局你已经知道了，那我可不可以在获取到model之后~直接在model层获取高度，**因为，cell的高度是由内容决定的**，我相信这点没有人会质疑的，所以生成model之后，直接获取高度。

这时，可能有人会问，那既然高度可以缓存，那可不可以用NSCache去缓存cell，其实这个我还真做过，但是，我暂时还不确定NSCache提取Cell的速度会比TableView直接重用要快。所以这里先留个悬念。

####关于RunLoop在UITableView中的使用

RunLoop这个东西大家肯定是不陌生的，如果大家真的对RunLoop陌生的话~那我推荐去看看这篇[深入理解RunLoop](http://blog.ibireme.com/2015/05/18/runloop/),事实上tableView在静止的时候，是出于NSRunLoopModeDefault状态，在这个mode时，我们可以刷新我们的cell并缓存，这个方式的使用是参考[UITableView-FDTemplateLayoutCell](https://github.com/forkingdog/UITableView-FDTemplateLayoutCell),同时也很感谢百度的孙源，这是他的[Blog链接](http://blog.sunnyxx.com/).

我们在滑动TableView的过程中，加载图片时会出现掉帧的情况，RunLoop在滑动时，mode为UITrackingRunLoopMode，在静止的时候切换为NSDefaultRunLoopMode，所以为了避免滑动时不掉帧，可以当滑动结束，静止的时候在NSDefaultRunLoopMode下对图片进行加载。

	[self.image performSelector:@selector(setImage:)
               withObject:image
               afterDelay:0
                  inModes:@[NSDefaultRunLoopMode]];
                 
这样的话，就可以让TableView滑动的时候更加的流畅.

####关于-systemLayoutSizeFittingSize:
这个API我并不推崇，原因在于不如手动计算快，而且对于AutoLayout要求很高，如果你自认为还没有足够高的能力去驾驭，尽量不要使用.

