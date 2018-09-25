title: 忽略浏览器对部分HTML的解析
date: 2015-09-06 17:40:42
tags: 前端
---

当我们需要忽略浏览器对部分HTML解析的时候，HTML代码中的`<plaintext>`和`<xmp></xmp>`可以帮我们实现。

`<plaintext>`是单标签，它插入到HTML代码中时，其__后面的所有HTML标签全部失效__，即浏览器对`<plaintext>`后面所有的HTML标签不作解析，直接在页面上显示。__因为本博客是用markdown写的，当时没有给`<plaintext>`标签加反单引号，结果导致其后所有代码浏览器都不解析了0.0__

`<xmp></xmp>`是双标签，它__只使其包含的内容中的标签失效__，`<xmp></xmp>`的使用更为普遍。

###效果：
1. 未使用`<xmp></xmp>`：
![](http://landerqi.lefzs.com/xmp_01.jpg)

1. 使用`<xmp></xmp>`：
![](http://landerqi.lefzs.com/xmp_02.jpg)

<!-- more -->

<br>
`<plaintext>`标签的效果大家可以自己试试 :)