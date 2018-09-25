title: hexo博客优化
date: 2015-06-23 11:51:44
tags: hexo
---

##添加RSS
hexo有提供RSS生成插件：[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)，需要自己手动安装：
1. 在博客目录下运行
	```
	$ npm install hexo-generator-feed --save
	```
2. 配置`hexo/_config.yml`文件
	```
feed:
  type: atom
  path: atom.xml
  limit: 20	```

3. 访问本地地址：<http://localhost:4000/atom.xml>,插件启用成功的话，会自动生成atom.xml文件。
4. 在站点导航中添加链接：
在`themes/light/_config.yml`中，编辑 `rss: /atom.xml`
在`themes/light/layout/_partial/header.ejs`中，`<ul></ul>`之间，添加一样代码`<li> <a href="/atom.xml">RSS</a> </li>`

<!-- more -->

<br>
##添加sitemap站点地图
为了方便搜索引擎收录我们的网站，我们可以通过[hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap)插件，生成一个sitemap.xml文件，然后登录站长平台，在提交Sitempas界面里提交自己网站的sitemap.xml文件，比如我的文件：<http://landerqi.com/sitemap.xml>。

__四大搜索站长平台地址__：

- 百度站长平台：<http://zhanzhang.baidu.com>
- 360站长平台：<http://zhanzhang.haosou.com>
- 搜狗站长平台：<http://zhanzhang.sogou.com>
- 谷歌站长平台：<http://google.com/webmasters>

1. 安装，在博客目录下运行：
	```
	$ npm install hexo-generator-sitemap --save
	```

2. 配置`hexo/_config.yml`文件
	```
	sitemap:
    path: sitemap.xml
	```

<br>
##添加百度统计
到百度统计注册账号，添加网站地址，将百度提供给你的一段js代码加入你的网站即可。__大概类似这样的代码：__
```
<script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "//hm.baidu.com/hm.js?";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  </script>
```
我把它加在了`themes/lightqi/layout/_partial/head.ejs` 中的head标签里面。

<br>
##添加百度分享
找到`themes\lightqi\layout\_partial\article.ejs`里的如下代码:
	```
<%- partial('post/category') %>
<%- partial('post/tag') %>

	```
修改成如下:
	```
	<div class="nirdonkey">
      <%- partial('post/category') %>
      <%- partial('post/tag') %>
</div>
<div class="bdsharebuttonbox"><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网"></a><a href="#" class="bds_tieba" data-cmd="tieba" title="分享到百度贴吧"></a><a href="#" class="bds_bdhome" data-cmd="bdhome" title="分享到百度新首页"></a><a href="#" class="bds_mshare" data-cmd="mshare" title="分享到一键分享"></a><a href="#" class="bds_more" data-cmd="more"></a>
</div>
<div class="clearfix"></div>
	```

还需要添加如下代码至 themes\lightqi\layout\_partial\after_footer.ejs .

	```
<script> window._bd_share_config = {
    "common": {
        "bdSnsKey": {},
        "bdText": "",
        "bdMini": "2",
        "bdPic": "",
        "bdStyle": "0",
        "bdSize": "16"
    },
    "share": {},
    "image": {
        "viewList": ["qzone", "tsina", "tqq", "renren", "t163"],
        "viewText": "分享到：",
        "viewSize": "16"
    },
    "selectShare": {
        "bdContainerClass": null,
        "bdSelectMiniList": ["qzone", "tsina", "tqq", "renren", "t163"]
    }
};
with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=857b0ced057ae80679bef08f6ee865cf.js?cdnversion=' + ~ ( - new Date() / 36e5)];
</script>
	```

最后美化一下样式，找到`themes\lightqi\source\css\_partial\archive.styl`加入出下代码：
	```
.archive
  article
    .nirdonkey
      float left
    .bdsharebuttonbox
      float right

	```

<br>
##添加多说评论
- 注册[多说](http://duoshuo.com/)账号，获得通用代码。
- 将通用代码粘贴到`themes\light\layout\_partial\comment.ejs`里面，如下：
	```
<% if ( page.comments){ %>
<section id="comment">
通用代码
</section>
<% } %>
	```
- `hexo\_config.yml`中加入:
	```
# duoshuo comment
duoshuo_shortname: landerqi(你站点的short_name)
	```
	short_name是指你在http://duoshuo.com/create-site/申请网站后的duoshuo.com前的字段。

<br>
##文章中插入图片
- 插入图片格式为`![图片名称](图片连接地址)`，图片大家可以上传到七牛云存储或者一些其他的存储服务，我自己现在是在用七牛，免费的基本已经够用了。
- 使用本地路径：在`hexo/source`目录下新建一个img文件夹，将图片放入该文件夹下，插入图片时链接即为`/img/图片名称`。

<br>
##绑定自己的域名
- 首页你得拥有自己的域名，你可以到万网，或Godaddy这些域名提供商上挑选自己喜欢的域名。
- 注册DNSPOD，用DNSPOD解析域名：
![](http://landerqi.lefzs.com/QQ图片20150623144211.png)
记录类型选CNAME。
__如果是在万网或Godaddy上购买的域名，需要修改DNS地址为`f1g1ns1.dnspod.net`和`f1g1ns1.dnspod.net`，DNSPOD才可以成功解析。__
- 在`source`目录下新建一个名为CNAME的文本文件，里面写入你要绑定的域名，比如`landerqi.com`。

<br>
__我自己的主题代码已提交到Github上了，大家如果觉得配置麻烦，可以直接使用我的主题[lightqi](https://github.com/landerqi/lightqi)，使用方法非常简单，在博客根目录下输入`git clone https://github.com/landerqi/lightqi.git themes/lightqi`。再修改hexo/_config.yml的theme为lightqi即可__