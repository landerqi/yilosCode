KISSY.add('bee-demo/index',["./header/header","./article/article"],function(S ,require, exports, module) {
 //初始化header模块
var header = require('./header/header');
header.init();

//初始化article模块
var article = require('./article/article');
article.init();
});