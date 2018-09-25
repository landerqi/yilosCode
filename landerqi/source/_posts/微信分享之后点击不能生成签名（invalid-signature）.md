title: 微信分享之后点击不能生成签名（invalid signature）
date: 2015-11-06 16:39:58
tags: 微信
---

最近在做微信分享的功能，微信官方现在要求，如果要调用微信分享的接口，需要通过`appid, appsecret` 生成一个`signature签名`,我这里获取签名的方法是在前端页面里面异步传递当前`url`给`java`来获取：
![获取签名代码](http://landerqi.lefzs.com/wxYY图片20151106164818.png?imageView2/2/w/600)

<!-- more -->
后来发现直接点Url进入是可以调用分享接口正常分享的，可以从分享之后的页面点进去却不能分享，错误显示：
![签名错误提示](http://landerqi.lefzs.com/wx855310967496113415.png?imageView2/2/w/300)

开始我们以为是签名错误，结果用[签名校验工具](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign)校验，发现生成的签名并没有问题。而后，我们把分享之后的`url` alert出来，发现微信自己在`url`后面加了一些参数（from=singlemessage&isappinstalled=0）：
![分享之后url](http://landerqi.lefzs.com/wx10309671615601412.png?imageView2/2/w/300)

里面有个__&__符号，我这边用的是`get`方法，服务端接收到的`url`会丢失掉__&__后面的字符, 所以导致`url` 不正确，以至于不能生成正确的签名。
知道问题了就简单了，只需要在传递参数之前把这个字符转成编码，像这样：
```
var targetUrl = location.href.split('#')[0];
    targetUrl = targetUrl.replace('&', '%26');
```
就可以了。

*********

__当时测试的比较匆忙，所以有个问题是在之后正式使用的时候发现的。__
如果`url`中没有带参数，用上面的`replace`是可以正常分享的，但是如果你自己本身就有传参，就会出错。
__原因是：__
`replace`只能替换第一个__&__字符。当你传入参数后，分享之后的地址微信自动加上`from=singlemessage&isappinstalled=0`之后，`url`中出现多个__&__字符，结果只有第一个被替换了，所以还是出现上述报错。
__解决办法：__`javascript`中没有`java`里面那种`raplaceAll`方法，所以我们需要自己拓展一个：
```
/**
 * replaceAll方法
 * @param s0 原始字符串
 * @param s1 需要被替换的字符串
 * @param s2 替换字符串
 */
replaceAll: function(s0, s1,s2){
    return s0.replace(new RegExp(s1,"gm"),s2);
}
```
__或者直接拓展原型方法(这是不用正式表达式的 ：)：__
```
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
```
