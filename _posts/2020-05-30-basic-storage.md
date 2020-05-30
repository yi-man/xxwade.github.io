---
layout: post
title: 现代存储入门
categories: 存储
description: 存储的基本知识
keywords: oplog
---


<a name="7WNdG"></a>
## 基本事实
顺序io比随机io快三个数量级<br />

<a name="82O3V"></a>
## 消息队列
<a name="dctP8"></a>
### oplog
类似binlog，commit log， redo log等，记录操作记录，用处

- 重建内存状态
- 数据复制
- 消息队列


<br />特性：

- 顺序写
- 随机查找地址，然后从该点写入
- 有ttl限制



<a name="dVJgf"></a>
#### 逻辑结构
<a name="tZLze"></a>
#### 物理结构
epoch<br />![image.png](/assets/images/202005/basic-storage0.png)
<a name="2gXdM"></a>
#### 如何避免写入过多
批量写入<br />

<a name="3Torx"></a>
#### 缺点

- 信息密度低
- 查询效率低



<a name="DAgaX"></a>
## key-value存储
<a name="7LoDm"></a>
### b+树
<a name="hO0QO"></a>
#### 特点

- m叉树仅存储索引，真实数据存储在树外
- 叶子节点通过链表串联在一起，方便区间查找



<a name="RwPfx"></a>
#### 问题

- 插入效率 logN
- 写的性能惩罚     写一个字节都得读出整块到内存中
- 批量写会引起 ‘shotgun writes’， 会使写的内容分厂分散，对缓存不友好
- count 会引发更多写    不断回溯向上写


<br />

<a name="HKRxz"></a>
### LSM树

- 写很快
- 平衡读



<a name="GUG4X"></a>
#### level db
![image.png](/assets/images/202005/basic-storage1.png)<br />
<br />写入时：

- oplog
- memtable
- active memtable 变为shadowed memtable，新建 active memtable
- shadowed memtable 转储到 l0
- 后台程度 压缩 li 到 li+1


<br />读取时：

- 查找所有包含k的文件
- 定位到文件中k的位置
- 按时间顺序merge出结果


<br />对于count：<br />遍历范围内数据，得到精确值<br />使用hyperloglog，得到不精确的值<br />

<a name="TZJI6"></a>
### 布隆过滤器
多hash定位元素是否存在<br />hash值不完全相等时，一定不存在该元素；如果相等时，需进一步验证是否真的存在<br />
<br />可用作判断重复<br />
<br />

<a name="6TLUr"></a>
### 跳表

<br />

<a name="DTSeA"></a>
## 文档和索引

- 选择索引
- 根据索引得到主键
- 根据条件过滤主键得到结果



<a name="AuqsJ"></a>
### Tire树


<a name="6GQkA"></a>
### BKD树

<br />

<a name="fuqQs"></a>
## 列存储和大型并行处理


<a name="PbiL4"></a>
## 空间数据库
<a name="OXSSs"></a>
### R-Tree
<a name="IAk2X"></a>
### Geo-hash
![image.png](/assets/images/202005/basic-storage2.png)<br />

<a name="KS8mn"></a>
## 时间数据库


