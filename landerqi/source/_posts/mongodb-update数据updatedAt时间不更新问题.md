title: mongodb update数据updatedAt时间不更新问题
date: 2019-08-12 19:05:47
tags: [数据库, 解决问题]
---

今天在写一个koa项目的时候，需要操作mongoDB修改数据，参考之前一些旧项目的代码，他是这样update数据的：

<img src="https://fesystem.bs2dl.yy.com/156560781156486" alt="">

直接把要更新的数据传入进去，这样数据也是可以更新成功，但是会有一个问题，`updateAt` 的`timestamps`永远不会更新（因为我需要用到这个时间来做展示）:

<!--more -->

<img src="https://fesystem.bs2dl.yy.com/1565607692818579" alt="">

Google之后发现很多解释都不是针对这个问题的。我又换了`save()`, `findOneAndUpdate()`等方法，发现还是有这个问题。

__解决办法：__
我把这个update方法重写了一下：
<img src="https://fesystem.bs2dl.yy.com/1565608416665389" alt="">
__发现竟然可以了！__

其实我本来是想用javascript的__展开语法(Spread syntax)__重写`updateTime`这个值的，结果误打误撞的解决了这个问题:
``` javascript
  /**
   * 根据_id lib
   * @param {string} data lib数据结构
   * @return {object} 返回更新结果{ n: 1, nModified: 1, ok: 1 }
   */
  update (data) {
    return libs.findOneAndUpdate({ _id: data._id }, { $set: {...data, ...{ updateTime: Date.now() } } })
  }
```
虽然这种方法也可以正常更新`updateTime`, 但是当我发现是因为缺少`$set`更新操作符后，就觉得没有必要再多此一举重写`updateTime`了。


之后我又去仔细看了一下文档，里面确实有写这个`$set` 更新操作符（Update Operators）是必须的：
<img src="https://fesystem.bs2dl.yy.com/1565607759715446" alt="">

__Update Operators:__
<img src="https://fesystem.bs2dl.yy.com/1565607787959236" alt="Update Operators">

总结发现果然文档才是最好的学习资料，借鉴一些旧项目可以快速上手，但是如果想到对所用到的技术有更深的理解的话，还是需要仔细阅读官方文档才行。之前参考的旧项目也是前端同事写的，前端同事接触数据库较少，代码中存在问题的可能性大，所以不要盲目的复制、粘贴。