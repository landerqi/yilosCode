title: javascript-patterns学习笔记（二）
date: 2018-07-10 15:39:02
tags: [javascript]
---

### 原始值的包装对象

__JavaScript中有五种原始类型：数字、字符串、布尔值、null和undefined。__除了null和undefined之外，其他三种都有对应的“包装对象”（wrapper objects）。可以通过内置构造函数来生成包装对象，Number()、String()、和Boolean()。

为了说明数字原始值和数字对象之间的区别，看一下下面这个例子：
```
// a primitive number
var n = 100;
console.log(typeof n); // "number"

// a Number object
var nobj = new Number(100);
console.log(typeof nobj); // "object"
```
<!-- more -->
包装对象带有一些有用的属性和方法，比如，数字对象就带有toFixed()和toExponential()之类的方法。字符串对象带有substring()、chatAt()和toLowerCase()等方法以及length属性。这些方法非常方便，和原始值相比，这让包装对象具备了一定优势。其实原始值也可以调用这些方法，因为原始值会首先转换为一个临时对象，如果转换成功，则调用包装对象的方法。
```
// a primitive string be used as an object
var s = "hello";
console.log(s.toUpperCase()); // "HELLO"

// the value itself can act as an object
"monkey".slice(3, 6); // "key"

// same for numbers
(22 / 7).toPrecision(3); // "3.14"
```
因为原始值可以根据需要转换成对象，这样的话，也不必为了用包装对象的方法而将原始值手动“包装”成对象。比如，不必使用new String("hi")，直接使用"hi"即可。
```
// avoid these:
var s = new String("my string");
var n = new Number(101);
var b = new Boolean(true);

// better and simpler:
var s = "my string";
var n = 101;
var b = true;
```
不得不使用包装对象的一个原因是，有时我们需要对值进行扩充并保持值的状态。原始值毕竟不是对象，不能直接对其进行扩充（译注：比如1.property = 2会报错）。
```
// primitive string
var greet = "Hello there";

// primitive is converted to an object
// in order to use the split() method
greet.split(' ')[0]; // "Hello"

// attemting to augment a primitive is not an error
greet.smile = true;

// but it doesn't actually work
typeof greet.smile; // "undefined"
```
在这段示例代码中，greet只是临时转换成了对象，以保证访问其属性/方法时不会出错。另一方面，如果greet通过new String()定义为一个对象，那么扩充smile属性就会按照期望的那样执行。对字符串、数字或布尔值的扩充并不常见，除非你清楚自己想要什么，否则不必使用包装对象。

当省略new时，包装器将传给它的参数转换为原始值：
```
typeof Number(1); // "number"
typeof Number("1"); // "number"
typeof Number(new Number()); // "number"
typeof String(1); // "string"
typeof Boolean(1); // "boolean"
```


### Error 对象

JavaScript中有很多内置的Error构造函数，比如Error()、SyntaxError()，TypeError()等等，这些“错误”通常和throw语句一起使用。这些构造函数创建的错误对象包含这些属性：
#### name
name属性是指创建这个对象的构造函数的名字，通常是“Error”，有时会有特定的名字比如“RangeError”

#### message

创建这个对象时传入构造函数的字符串

错误对象还有其他一些属性，比如产生错误的行号和文件名，但这些属性是浏览器自行实现的，不同浏览器的实现也不一致，因此出于兼容性考虑，并不推荐使用这些属性。

另一方面，throw可以抛出任何对象，并不限于“错误对象”，因此你可以根据需要抛出自定义的对象。这些对象包含属性“name”和“message”或其他你希望传递给异常处理逻辑的信息，异常处理逻辑由catch语句指定。你可以灵活运用抛出的错误对象，将程序从错误状态恢复至正常状态。
```
try {
    // something bad happened, throw an error
    throw {
        name: "MyErrorType", // custom error type
        message: "oops",
        extra: "This was rather embarrassing",
        remedy: genericErrorHandler // who should handle it
    };
} catch (e) {
    // inform the user
    alert(e.message); // "oops"

    // gracefully handle the error
    e.remedy(); // calls genericErrorHandler()
}
```
__通过new调用和省略new调用错误构造函数是一模一样的，他们都返回相同的错误对象。__

### JavaScript的函数具有两个主要特性，正是这两个特性让它们与众不同。第一个特性是，函数是一等对象（first-class object），第二个是函数提供作用域支持。

#### 函数是对象，那么：
    + 可以在程序执行时动态创建函数
    + 可以将函数赋值给变量，可以将函数的引用拷贝至另一个变量，可以扩充函数，除了某些特殊场景外均可被删除。
    + 可以将函数作为参数传入另一个函数，也可以被当作返回值返回。

函数可以包含自己的属性和方法
对于一个函数A来说，首先它是对象，拥有属性和方法，其中某个属性碰巧是另一个函数B，B可以接受函数作为参数，假设这个函数参数为C，当执行B的时候，返回另一个函数D。乍一看这里有一大堆相互关联的函数。当你开始习惯函数的许多用法时，你会惊叹原来函数是如此强大、灵活并富有表现力。通常说来，一说到JavaScript的函数，我们首先认为它是对象，它具有一个可以“执行”的特性，也就是说我们可以“调用”这个函数。

我们通过new Function()构造器来生成一个函数，这时可以明显看出函数是对象：
```
// antipattern
// for demo purposes only
var add = new Function('a, b', 'return a + b');
add(1, 2); // returns 3
```
在这段代码中，毫无疑问add()是一个对象，毕竟它是由构造函数创建的。这里并不推荐使用Function()构造器创建函数（和eval()一样糟糕），因为程序逻辑代码是以字符串的形式传入构造器的。这样的代码可读性差，写起来也很费劲，你不得不对逻辑代码中的引号做转义处理，并需要特别关注为了让代码保持一定的可读性而保留的空格和缩进。

#### __函数的第二个重要特性是它能提供作用域支持。__在JavaScript中没有块级作用域（译注：在JavaScript1.7中提供了块级作用域部分特性的支持，可以通过let来声明块级作用域内的“局部变量”），也就是说不能通过花括号来创建作用域，JavaScript中只有函数作用域（译注：这里作者的表述只针对函数而言，此外JavaScript还有全局作用域）。在函数内所有通过var声明的变量都是局部变量，在函数外部是不可见的。刚才所指花括号无法提供作用域支持的意思是说，如果在if条件句内、或在for或while循环体内用var定义了变量，这个变量并不是属于if语句或for（while）循环的局部变量，而是属于它所在的函数。如果不在任何函数内部，它会成为全局变量。在第二章里提到我们要减少对全局命名空间的污染，那么使用函数则是控制变量的作用域的不二之选。

### 声明 vs 表达式：命名与提前

那么，到底应该用哪个呢？函数声明还是函数表达式？在不能使用函数声明语法的场景下，只能使用函数表达式了。下面这个例子中，我们给函数传入了另一个函数对象作为参数，以及给对象定义方法:
```
// this is a function expression,
// pased as an argument to the function `callMe`
callMe(function () {
    // I am an unnamed function expression
    // also known as an anonymous function
});

// this is a named function expression
callMe(function me() {
    // I am a named function expression
    // and my name is "me"
});

// another function expression
var myobject = {
    say: function () {
        // I am a function expression
    }
};
```
__函数声明只能出现在“程序代码”中，也就是说在别的函数体内或在全局。这个定义不能赋值给变量或属性，同样不能作为函数调用的参数。下面这个例子是函数声明的合法用法，这里所有的函数foo()，bar()和local()都使用函数声明来定义：__
```
// global scope
function foo() {}

function local() {
    // local scope
    function bar() {}
    return bar;
}
```
#### 函数的name属性

选择函数定义模式的另一个考虑是只读属性name的可用性。尽管标准规范中并未规定，但很多运行环境都实现了name属性，在函数声明和带有名字的函数表达式中是有name的属性定义的。在匿名函数表达式中，则不一定有定义，这个是和实现相关的，在IE中是无定义的，在Firefox和Safari中是有定义的，但是值为空字符串。
```
function foo() {} // declaration
var bar = function () {}; // expression
var baz = function baz() {}; // named expression

foo.name; // "foo"
bar.name; // ""
baz.name; // "baz"
```

__在Firebug或其他工具中调试程序时name属性非常有用，它可以用来显示当前正在执行的函数。同样可以通过name属性来递归的调用函数自身。如果你对这些场景不感兴趣，那么请尽可能的使用匿名函数表达式，这样会更简单、且冗余代码更少。__
__和函数声明相比而言，函数表达式的语法更能说明函数是一种对象，而不是某种特别的语言写法。__
__我们可以将一个带名字的函数表达式赋值给变量，变量名和函数名不同，这在技术上是可行的。比如：var foo = function bar(){};。然而，这种用法的行为在浏览器中的兼容性不佳（特别是IE中），因此并不推荐大家使用这种模式。__


