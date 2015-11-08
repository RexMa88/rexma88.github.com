---
layout: post
subtitle: "technology"
title: "iOS UITableView"
author: "RexMa"
date: 2015-11-08 15:00:00
---
<span class="image featured"><img src="/images/AirCraft.png" alt=""></span>
#iOS UITableView
（这是我第一次写技术博客，但是不知道为什么~这个模板的目录的title是大写字母，我个人也不是很喜欢这样，但由于我并非web工程师==，没关系，我找到就会修改，但如果给各位看官带来视觉上的困扰，请谅解.）

第一次写Blog,就写一个最常用的，UITableView是iPhone中最常用的UI控件之一，也许要去掉之一。所以说一些UITableView的Tips将在日常开发中起到很大的作用。

###Tips
(由于我之前没有什么写Blog的习惯，所以第一篇看起来会比较杂乱，后期我会慢慢的整理。)

**高度**

关于高度方面，很多人都喜欢在UITableViewDataSource中使用下面这个代理方法.

	- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath

	但是，如果你的TableViewCell的**高度相同**的话，并不需要调用这个方法，而是直接在配置你的TableView时加上**rowHeight**这个属性即可.上面的那个方法是在你的**高度不同**的时候使用的，下面就说说高度不同的时候，使用怎样的方法会比较好。

	当你的UITableViewCell高度不同的时候并且界面比较复杂的时候，我比较推荐使用**纯代码**生成界面，而不是使用xib或StoryBoard。首先，xib和StoryBoard不利于版本管理，而且StoryBoard中各个界面的关系连线让人看起来十分的恶心。使用**纯代码**生成的Cell则相对好管理一些，另外，我的建议是除非cell的风格种类极多，可以创建多个UITableViewCell，如果风格以及逻辑上并不是有很大的区别的话，尽量使用**一个**UITableViewCell会比较好。

	在Cell中的布局，我推荐使用Masonry.
