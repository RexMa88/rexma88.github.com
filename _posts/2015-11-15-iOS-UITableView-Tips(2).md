---
layout: post
title: "iOS UITableView Tips(2)"
subtitle: "iOS Develop"
author: "Rex Ma"
date: 2015-11-15 22:20:35
header-img: "img/post-bg-01.jpg"
---
#TableView Tips(2)
(本来想一章就结束TableView Tips，但是发现自己还是太天真了~too young,too simple)

##架构上的优化
在Tips(1)中指出了一些常用的优化技巧，但是在整体架构上却没怎么提及，那么这次就说说怎么好好在架构上相对优化.

**ViewController**几乎是处理任何界面逻辑的容器。但你呈献给用户的TableView中存在多种多样的Cell时，会使ViewController十分的复杂，但是我们可以通过一些方法降低耦合度.

###Model与Cell的结合
这是目前一种最广为人们使用的方式，在Cell中对Model数据写一个setter方法，可以直接减少Controller中的dataSource方法中的耦合度，易分离.

	@property (nonatomic, strong) xxModel *model;
	- (void)setModel:(xxModel *)model;

我们在上边这个setter方法中处理我们的业务逻辑.

###Request与Model的结合
可以通过建立两个interface，一个是request部分，另一个是model部分，直接在请求部分转换成model，并针对业务逻辑写一些方法，在Controller层中用request的对象去调用.

###Cell与Category
通过对UITableViewCell进行Category，可以减少Cell与model,cell与TableView之间的耦合度达到分离的效果。

###创建新的DataSource
通过创建一个NSObject文件，并且遵守UITableViewDataSource，使大部分的DataSource方法可以在该文件中时间。在你需要UITableView的界面中声明该自定义DataSource实例.
	
	@property (nonatomic, strong) customDataSource * dataSource;
	self.tableView.dataSource = self.dataSource;
