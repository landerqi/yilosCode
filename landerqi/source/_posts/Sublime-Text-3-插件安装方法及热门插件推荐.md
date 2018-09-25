title: Sublime Text 3 插件安装方法及热门插件推荐
date: 2015-06-16 23:15:40
tags: [工具,前端]
---
之前工作的时候一直用的Webstorm（前端开发神器）。在性能高的电脑上用Webstorm挺好的，可是Webstorm在我的macbook air运行起来非常卡。所以决定使用一下Sublime Text :)

Sublime Text是一款非常精巧的文本编辑器，速度快得出奇。这些非常棒的特性包括任意跳转（Goto Anything）、多重选择（multiple selections）、指令面板（command palette）、免打扰模式（distraction free mode）、分区编辑（split editing）、快速项目切换（instant project switch），你还可以随意地自定义更多功能。还有，这款编辑器支持Mac、Windows和Linux平台。

__因为自己一直习惯用vim快捷键，以及用惯了Webstorm的自动保存功能，所以做了些简单配置：__
__preferences-> User Settings__
```
{
    "ignored_packages": [], //使用vim快捷键
    "save_on_focus_lost": true, //这是设置当Sublime 失去焦点后自动保存
}

```
<!-- more -->

##插件安装

1. 直接安装
    可以直接下载安装包解压缩到Packages目录（菜单->preferences->packages）。

2. 使用Package Control组件安装（个人比较喜欢的方式，方便快捷）
    - 按Ctrl+`调出console（注：安装有QQ输入法的这个快捷键会有冲突的，输入法属性设置-输入法管理-取消热键切换至QQ拼音）
    - 粘贴以下代码到底部命令行并回车：
    ```
    import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
    ```
    - 重启Sublime Text 3。
    - 如果在Perferences->package settings中看到package control这一项，则安装成功。
    - Sublime Text2 的代码
    ```
    import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
    ```


__用Package Control安装插件的方法：__
- 按下Ctrl(command)+Shift+P调出命令面板
- 输入install 调出 Install Package 选项并回车，然后在列表中选中要安装的插件。(删除的话输入remove 调出Remove Package)

<br>
##常用插件

###[Emmet](https://packagecontrol.io/packages/Emmet)([Github](https://github.com/sergeche/emmet-sublime))
Emmet 其前身是 Zen Coding。它让编写 HTML 代码变得简单。Emmet 的基本用法是：输入简写形式，然后按 Tab 键。
关于 Emmet 的更多用法，请看[官方文档](http://docs.emmet.io/)，这份[速查表](http://docs.emmet.io/cheat-sheet/)可以帮你快速记忆简写形式。
<br>

###[Theme – Soda](https://packagecontrol.io/packages/Theme%20-%20Soda) ([GitHub](https://github.com/buymeasoda/soda-theme))
![](http://landerqi.lefzs.com/qdSoda-Dark.png)
![](http://landerqi.lefzs.com/qdSoda-Light.png)
安装后你还需要在你的配置文件（菜单 Preferences -> Settings - User）中加入"theme": "Soda Light.sublime-theme" 或 "theme": "Soda Dark.sublime-theme"。要达到图中的效果，你还需要下载与之搭配的 color scheme。

如果你喜欢 Soda Dark 和 Monokai，我建议你使用 [Monokai Extended](https://sublime.wbond.net/packages/Monokai%20Extended) ([GitHub](https://github.com/jonschlinkert/sublime-monokai-extended))。这个 color scheme 是 Monokai Soda 的增强，如果再配合 [Markdown Extended](https://sublime.wbond.net/packages/Markdown%20Extended) ([GitHub](https://github.com/jonschlinkert/sublime-markdown-extended))，将大大改善 Markdown 的语法高亮。
![](http://landerqi.lefzs.com/qdMonokai-Extended-Markdown-Extended.png)
<br>

###JS Format([Github](https://github.com/jdc0589/JsFormat))
JS代码格式化插件。
<br>

###Bracket Highlighter([Github](https://github.com/facelessuser/BracketHighlighter))
类似于代码匹配，可以匹配括号，引号等符号内的范围。
<br>

###Sublime Prefixr([Github](https://github.com/wbond/sublime_prefixr))
Prefixr，CSS3 私有前缀自动补全插件

<br>
###[Alignment](https://sublime.wbond.net/packages/Alignment)([Github](https://github.com/wbond/sublime_alignment))
代码中“＝”自动对齐插件，快捷键： ctrl+alt+a（Mac OS 上是 cmd+ctrl+a）。
<br>

###[Sublime​Code​Intel](https://packagecontrol.io/packages/SublimeCodeIntel ) ([GitHub](https://github.com/SublimeCodeIntel/SublimeCodeIntel))
代码自动提示,详细的[说明](https://github.com/SublimeCodeIntel/SublimeCodeIntel/blob/development/README.rst#configuring)。
不建议把 Sublime​Code​Intel 与其他单个语言的扩展 package 一同使用，虽然很多语言扩展 package 比 Sublime​Code​Intel 的代码提示功能要完善。如果需要一同使用，请在用户配置文件（菜单Preferences -> Package Settings -> Sublime​Code​Intel -> Settings - User 中加入下面的内容，并去掉要禁用的语言。
```
"codeintel_enabled_languages":
 [
 "JavaScript", "Mason", "XBL", "XUL", "RHTML", "SCSS", "Python", "HTML","Ruby", "Python3", "XML", "Sass", "XSLT", "Django", "HTML5", "Perl", "CSS","Twig", "Less", "Smarty", "Node.js", "Tcl", "TemplateToolkit", "PHP"
 ],
 "codeintel_live_enabled_languages":
 [
 "JavaScript", "Mason", "XBL", "XUL", "RHTML", "SCSS", "Python", "HTML","Ruby", "Python3", "XML", "Sass", "XSLT", "Django", "HTML5", "Perl", "CSS","Twig", "Less", "Smarty", "Node.js", "Tcl", "TemplateToolkit", "PHP"
 ]
```

<br>

###AutoFileName
自动补全文件(目录)名，很重要的插件
<br>

###其他语法支持
如果有一个 SublimeText 本身所带语言包不包含的语言，它就无法显示适当的语法高亮。这些语言包括 LESS，Sass，SCSS，Styls 和 Jade（或其它）。如果您正在使用这些语言，你可能要安装它们的语法插件。
- [LESS](https://github.com/danro/LESS-sublime)
- [SASS](https://github.com/nathos/sass-textmate-bundle)
- [SCSS](https://github.com/MarioRicalde/SCSS.tmbundle)
- [Styls](https://github.com/billymoon/Stylus)
- [Jade](https://github.com/P233/Jade-Snippets-for-Sublime-Text-2)
