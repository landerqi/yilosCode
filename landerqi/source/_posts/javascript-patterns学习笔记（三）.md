title: javascript-patterns学习笔记（三）
date: 2018-09-04 20:18:02
tags: [javascript]
---

**callback**
一个回调的例子

我们从一个例子开始，首先介绍无回调的情况，然后在作修改。假设你有一个通用的函数，用来完成某种复杂的逻辑并返回一大段数据。假设我们用findNodes()来命名这个通用函数，这个函数用来对DOM树进行遍历，并返回我所感兴趣的页面节点：

```
var findNodes = function () {
    var i = 100000, // big, heavy loop
        nodes = [], // stores the result
        found; // the next node found
    while (i) {
        i -= 1;
        // complex logic here...
        nodes.push(found);
    }
    return nodes;
};
```
<!--more-->
保持这个函数的功能的通用性并一贯返回DOM节点组成的数组，并不会发生对节点的实际操作，这是一个不错的注意。可以将操作节点的逻辑放入另外一个函数中，比如放入一个hide()函数中，这个函数用来隐藏页面中的节点元素：

```
var hide = function (nodes) {
    var i = 0, max = nodes.length;
    for (; i < max; i += 1) {
        nodes[i].style.display = "none";
    }
};

// executing the functions
hide(findNodes());
```

这个实现的效率并不高，因为它将findNodes()所返回的节点数组重新遍历了一遍。最好在findNodes()中选择元素的时候就直接应用hide()操作，这样就能避免第二次的遍历，从而提高效率。但如果将hide()的逻辑写死在findNodes()的函数体内，findNodes()就变得不再通用了（译注：如果我将hide()的逻辑替换成其他逻辑怎么办呢？），因为修改逻辑和遍历逻辑耦合在一起了。如果使用回调模式，则可以将隐藏节点的逻辑写入回调函数，将其传入findNodes()中适时执行：
```
// refactored findNodes() to accept a callback
var findNodes = function (callback) {
    var i = 100000,
        nodes = [],
        found;

    // check if callback is callable
    if (typeof callback !== "function") {
        callback = false;
    }
    while (i) {
        i -= 1;

        // complex logic here...

        // now callback:
        if (callback) {
            callback(found);
        }

        nodes.push(found);
    }
    return nodes;
};
```
这里的实现比较直接，findNodes()多作了一个额外工作，就是检查回调函数是否存在，如果存在的话就执行它。回调函数是可选的，因此修改后的findNodes()也是和之前一样使用，是可以兼容旧代码和旧API的。

这时hide()的实现就非常简单了，因为它不用对元素列表做任何遍历了：
```
// a callback function
var hide = function (node) {
    node.style.display = "none";
};

// find the nodes and hide them as you go
findNodes(hide);
```

正如代码中所示，回调函数可以是事先定义好的，也可以是一个匿名函数，你也可以将其称作main函数，比如这段代码，我们利用同样的通用函数findNodes()来完成显示元素的操作：
```
// passing an anonymous callback
findNodes(function (node) {
    node.style.display = "block";
});
```

**回调和作用域**

在上一个例子中，执行回调函数的写法是：
```
callback(parameters);
```
尽管这种写法可以适用大多数的情况，而且足够简单，但还有一些场景，回调函数不是匿名函数或者全局函数，而是对象的方法。如果回调函数中使用this指向它所属的对象，则回调逻辑往往并不像我们希望的那样执行。

假设回调函数是paint()，它是myapp的一个方法：
```
var myapp = {};
myapp.color = "green";
myapp.paint = function (node) {
    node.style.color = this.color;
};
函数findNodes()大致如下：

var findNodes = function (callback) {
    // ...
    if (typeof callback === "function") {
        callback(found);
    }
    // ...
};
```

__当你调用findNodes(myapp.paint)，运行结果和我们期望的不一致，因为this.color未定义。因为findNodes()是全局函数，this指向的是全局对象。如果findNodes()是dom对象的方法（类似dom.findNodes()），那么回调函数内的this则指向dom，而不是myapp。__

__解决办法是，除了传入回调函数，还需将回调函数所属的对象当作参数传进去：__
```
findNodes(myapp.paint, myapp);
```
同样需要修改findNodes()的逻辑，增加对传入的对象的绑定：
```
var findNodes = function (callback, callback_obj) {
    //...
    if (typeof callback === "function") {
        callback.call(callback_obj, found);
    }
    // ...
};
```
在后续的章节会对call()和apply()有更详细的讲述。

其实还有一种替代写法，就是将函数当作字符串传入findNodes()，这样就不必再写一次对象了，换句话说：
```
findNodes(myapp.paint, myapp);
// 可以写成：
findNodes("paint", myapp);
```

在findNodes()中的逻辑则需要修改为：
```
var findNodes = function (callback, callback_obj) {

    if (typeof callback === "string") {
        callback = callback_obj[callback];
    }

    //...
    if (typeof callback === "function") {
        callback.call(callback_obj, found);
    }
    // ...
};
```
----------------------

**立即执行的函数好处和用法**

立即执行的函数应用很广泛。它可以帮助我们做一些不想留下全局变量的工作。所有定义的变量都只是立即执行的函数的本地变量，你完全不用担心临时变量会污染全局对象。

__立即执行的函数还有一些名字，比如“自调用函数”或者“自执行函数”，因为这些函数会在被定义后立即执行自己。__
这种模式也经常被用到书签代码中，因为书签代码会在任何一个页面运行，所以需要非常苛刻地保持全局命名空间干净。

这种模式也可以让你包裹一些独立的特性到一个封闭的模块中。设想你的页面是静态的，在没有JavaScript的时候工作正常，然后，本着渐进增强的精神，你给页面加入了一点增加代码。这时候，你就可以把你的代码（也可以叫“模块”或者“特性”）放到一个立即执行的函数中并且保证页面在有没有它的时候都可以正常工作。然后你就可以加入更多的增强特性，或者对它们进行移除、进行独立测试或者允许用户禁用等等。

你可以使用下面的模板定义一段函数代码，我们叫它module1：
```
// module1 defined in module1.js
(function () {

    // all the module 1 code ...

}());
```
立即初始化的对象

还有另外一种可以避免污染全局作用域的方法，和前面描述的立即执行的函数相似，叫做“立即初始化的对象”模式。这种模式使用一个带有init()方法的对象来实现，这个方法在对象被创建后立即执行。初始化的工作由init()函数来完成。

下面是一个立即初始化的对象模式的例子：
```
({
    // here you can define setting values
    // a.k.a. configuration constants
    maxwidth: 600,
    maxheight: 400,

    // you can also define utility methods
    gimmeMax: function () {
        return this.maxwidth + "x" + this.maxheight;
    },

    // initialize
    init: function () {
        console.log(this.gimmeMax());
        // more init tasks...
    }
}).init();
```
你也可以将对象字面量和init()调用一起写到括号里面。简单地说，下面两种语法都是有效的：
```
({...}).init();
({...}.init());
```

__这种模式的一个弊端是，JavaScript压缩工具可能不能像压缩一段包裹在函数中的代码一样有效地压缩这种模式的代码。这些私有的属性和方法不被会重命名为一些更短的名字，因为从压缩工具的角度来看，保证压缩的可靠性更重要。在写作本书的时候，Google出品的Closure Compiler的“advanced”模式是唯一会重命名立即初始化的对象的属性的压缩工具。一个压缩后的样例是这样：__
```
({d:600,c:400,a:function(){return this.d+"x"+this.c},b:function(){console.log(this.a())}}).b();
```
__这种模式主要用于一些一次性的工作，并且在init()方法执行完后就无法再次访问到这个对象。如果希望在这些工作完成后保持对对象的引用，只需要简单地在init()的末尾加上return this;即可。__

--------------

**条件初始化**

条件初始化（也叫条件加载）是一种优化模式。当你知道某种条件在整个程序生命周期中都不会变化的时候，那么对这个条件的探测只做一次就很有意义。浏览器探测（或者特征检测）是一个典型的例子。

举例说明，当你探测到XMLHttpRequest被作为一个本地对象支持时，就知道浏览器不会在程序执行过程中改变这一情况，也不会出现突然需要去处理ActiveX对象的情况。当环境不发生变化的时候，你的代码就没有必要在需要在每次XHR对象时探测一遍（并且得到同样的结果）。

另外一些可以从条件初始化中获益的场景是获得一个DOM元素的computed styles或者是绑定事件处理函数。大部分程序员在他们的客户端编程生涯中都编写过事件绑定和取消绑定相关的组件，像下面的例子：
```
// BEFORE
var utils = {
    addListener: function (el, type, fn) {
        if (typeof window.addEventListener === 'function') {
            el.addEventListener(type, fn, false);
        } else if (typeof document.attachEvent === 'function') { // IE
            el.attachEvent('on' + type, fn);
        } else { // older browsers
            el['on' + type] = fn;
        }
    },
    removeListener: function (el, type, fn) {
        // pretty much the same...
    }
};
```
这段代码的问题就是效率不高。每当你执行utils.addListener()或者utils.removeListener()时，同样的检查都会被重复执行。

如果使用条件初始化，那么浏览器探测的工作只需要在初始化代码的时候执行一次。在初始化的时候，代码探测一次环境，然后重新定义这个函数在剩下来的程序生命周期中应该怎样工作。下面是一个例子，看看如何达到这个目的：
```
// AFTER

// the interface
var utils = {
    addListener: null,
    removeListener: null
};

// the implementation
if (typeof window.addEventListener === 'function') {
    utils.addListener = function (el, type, fn) {
        el.addEventListener(type, fn, false);
    };
    utils.removeListener = function (el, type, fn) {
        el.removeEventListener(type, fn, false);
    };
} else if (typeof document.attachEvent === 'function') { // IE
    utils.addListener = function (el, type, fn) {
        el.attachEvent('on' + type, fn);
    };
    utils.removeListener = function (el, type, fn) {
        el.detachEvent('on' + type, fn);
    };
} else { // older browsers
    utils.addListener = function (el, type, fn) {
        el['on' + type] = fn;
    };
    utils.removeListener = function (el, type, fn) {
        el['on' + type] = null;
    };
}
```

__说到这里，要特别提醒一下关于浏览器探测的事情。当你使用这个模式的时候，不要对浏览器特性过度假设。举个例子，如果你探测到浏览器不支持window.addEventListener，不要假设这个浏览器是IE，也不要认为它不支持原生的XMLHttpRequest，虽然这个结论在整个浏览器历史上的某个点是正确的。当然，也有一些情况是可以放心地做一些特性假设的，比如.addEventListener和.removeEventListerner，但是通常来讲，浏览器的特性在发生变化时都是独立的。最好的策略就是分别探测每个特性，然后使用条件初始化，使这种探测只做一次。__