title: 用animation的step()方法实现动画效果
date: 2015-06-12 09:59:47
tags: css3
---

steps(n,[ start | end ] ]?)函数，这个函数可以把动画平均划分为基本相等的，这个n是一个自然数，意思就是把一个动画平均分成n等分，直到平均地走完这个动画，__与linear不同，linear是不间断的完成一个动画，而steps是一帧一帧执行的。__step-start等同于steps(1,start)，动画分成1步，动画执行时为开始左侧端点的部分为开始；step-end等同于steps(1,end)：动画分成一步，动画执行时以结尾端点为开始，默认值为end。

__w3c图解如下：__
![](http://landerqi.lefzs.com/step.png)
<!-- more -->
<br>
###简单用法：
事先把自己准备的一帧帧动画拼成一张Sprite图：
![](http://landerqi.lefzs.com/fire_work.png)

<br>
###创建动画
- 要让我们的烟火动起来，我们先创建一个class，定义好宽、高，把事先做好的Sprite图设为背景：
	```
	.fire-work{
	  background: url("fire_work.png");
	  width: 145px;
	  height: 140px;
	}
	```

- 下一步我们需要创建一个动画
```
@keyframes play {
  0% {background-position:0px -0%;}
  100% {background-position:0px -300%;}
}
```
<br>
###执行动画
在这里我们需要把动画play绑定到class fire-work上，设置动画执行时间0.8s,__因为我们的Sprite只有三帧画面，所以我们需要设置step(n)的参数为3，即step(3)__,我们可以看到Sprite图的background position迅速的从上到下变换。
```
.fire-work {
  ...
  animation: play .8s steps(3);
}
```
<br>

__执行效果如下：__
![](http://landerqi.lefzs.com/fire_work.gif)

[DEMO](http://topics.guoguan.com/zt/2015/tongjiling/index.html) (此DEMO是针对手机做的一个小应用，需用手机观看) ：<br><http://topics.guoguan.com/zt/2015/tongjiling/index.html>