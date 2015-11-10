---
layout: post
title: "iOS UITableView Tips"
date: 2015-11-08 23:42:35
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

由于之前，用xib做过一个类似于微信朋友圈的东西，着实是把我恶心了一下，我就说说关于cell中使用AutoLayout的注意事项：

**1.应该尽量将高度的约束都“整理清楚”，所谓“整理清楚”就是要把TopConstraint，HeightConstraint，BottomConstraint这些参数给弄好，保证我的Cell中的所有UI控件的这些参数加到一起是Cell的高度.**

**2.巧用优先级，优先级的概念我想我应该是不用说了，这一点体现在朋友圈里最典型的就是当你没有对该条朋友圈消息进行评论或者点赞的时候，你应该自动地忽略这部分的控件（我是用的是UITableView进行评论，点赞功能），这时就应该降低这部分控件的优先级，使得他“有可能”会消失**

**3.动态刷新的时候调用**

	[cell setNeedsUpdateConstraints];
   	[cell updateConstraintsIfNeeded];		
   	[cell setNeedsLayout];
   	[cell layoutIfNeeded];

**会让你的界面重新布局，从而重新计算高度.**
