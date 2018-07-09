title: javascript-patterns学习笔记（一）
date: 2018-07-09 14:57:08
tags: [javascript]
---

#### 在本书中多次提到“空对象”（“blank object”和“empty object”）。这只是某种简称，要知道JavaScript中根本不存在真正的空对象，理解这一点至关重要。即使最简单的{}对象包含从Object.prototype继承来的属性和方法。我们提到的“空（empty）对象”只是说这个对象没有自己的属性，不考虑它是否有继承来的属性。

### 强制使用new的模式
我们知道，构造函数和普通的函数无异，只是通过new调用而已。那么如果调用构造函数时忘记new会发生什么呢？漏掉new不会产生语法错误也不会有运行时错误，但可能会造成逻辑错误，导致执行结果不符合预期。这是因为如果不写new的话，函数内的this会指向全局对象（在浏览器端this指向window）。
当构造函数内包含this.member之类的代码，并直接调用这个函数（省略new），实际会创建一个全局对象的属性member，可以通过window.member或member访问到它。这必然不是我们想要的结果，因为我们要努力确保全局命名空间的整洁干净。
```
// constructor
function Waffle() {
    this.tastes = "yummy";
}
// a new object
var good_morning = new Waffle();
console.log(typeof good_morning); // "object"
console.log(good_morning.tastes); // "yummy"
// antipattern:
// forgotten `new`
var good_morning = Waffle();
console.log(typeof good_morning); // "undefined"
console.log(window.tastes); // "yummy"
```
__ECMAScript5中修正了这种非正常的行为逻辑。在严格模式中，this是不能指向全局对象的。如果在不支持ES5的JavaScript环境中，仍然后很多方法可以确保构造函数的行为即便在省略new调用时也不会出问题。__

<!-- more -->

### 使用that

遵守命名约定的确能帮上一些忙，但约定毕竟不是强制，不能完全避免出错。这里给出了一种模式可以确保构造函数一定会按照构造函数的方式执行。不要将所有成员挂在this上，将它们挂在that上，并返回that。
```
function Waffle() {
var that = {};
    that.tastes = "yummy";
    return that;
}
```
如果要创建简单的实例对象，甚至不需要定义一个局部变量that，可以直接返回一个对象直接量，就像这样：
```
function Waffle() {
    return {
        tastes: "yummy"
    };
}
```
不管用什么方式调用它（使用new或直接调用），它同都会返回一个实例对象：
```
var first = new Waffle(),
    second = Waffle();
console.log(first.tastes); // "yummy"
console.log(second.tastes); // "yummy"
```
这种模式的问题是丢失了原型，因此在Waffle()的原型上的成员不会继承到这些实例对象中。

__需要注意的是，这里用的that只是一种命名约定，that不是语言的保留字，可以将它替换为任何你喜欢的名字，比如self或me。__


4.调用自身的构造函数

为了解决上述模式的问题，能够让实例对象继承原型属性，我们使用下面的方法。在构造函数中首先检查this是否是构造函数的实例，如果不是，再通过new调用构造函数，并将new的结果返回：
```
function Waffle() {

    if (!(this instanceof Waffle)) {
        return new Waffle();
    }
    this.tastes = "yummy";

}
Waffle.prototype.wantAnother = true;

// testing invocations
var first = new Waffle(),
    second = Waffle();

console.log(first.tastes); // "yummy"
console.log(second.tastes); // "yummy"

console.log(first.wantAnother); // true
console.log(second.wantAnother); // true
```
另一种检查实例的通用方法是使用arguments.callee，而不是直接将构造函数名写死在代码中：
```
if (!(this instanceof arguments.callee)) {
    return new arguments.callee();
}
```
__这里需要说明的是，在任何函数内部都会自行创建一个arguments对象，它包含函数调用时传入的参数。同时arguments包含一个callee属性，指向它所在的正在被调用的函数。需要注意，ES5严格模式中是禁止使用arguments.callee的，因此最好对它的使用加以限制，并删除任何你能在代码中找到的实例（译注：这里作者的表述很委婉，其实作者更倾向于全面禁止使用arguments.callee）。__


### 检查是不是数组

如果typeof的操作数是数组的话，将返回“object”。
```
console.log(typeof [1, 2]); // "object"
```
这个结果勉强说得过去，毕竟数组是一种对象，但对我们用处不大。往往你需要知道一个值是不是真正的数组。你可能见到过这种检查数组的方法：检查length属性、检查数组方法比如slice()等等。但这些方法非常脆弱，非数组的对象也可以拥有这些同名的属性。还有些人使用instanceof Array来判断数组，但这种方法在某些版本的IE里的多个iframe的场景中会出问题（译注：原因就是在不同iframe中创建的数组不会相互共享其prototype属性）。

ECMAScript 5定义了一个新的方法Array.isArray()，如果参数是数组的话就返回true。比如：
```
Array.isArray([]); // true

// trying to fool the check
// with an array-like object
Array.isArray({
    length: 1,
    "0": 1,
    slice: function () {}
}); // false
```
如果你的开发环境不支持ECMAScript5，可以通过Object.prototype.toString()方法来代替。如调用toString的call()方法并传入数组上下文，将返回字符串“[object Array]”。如果传入对象上下文，则返回字符串“[object Object]”。因此可以这样做：
```
if (typeof Array.isArray === "undefined") {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };
}
```

### JSON

上文我们刚刚讨论过对象和数组直接量，你已经对此很熟悉了，现在我们将目光转向JSON。JSON（JavaScript Object Notation）是一种轻量级的数据交换格式。很多语言中都实现了JSON，特别是在JavaScript中。

JSON格式及其简单，它只是数组和对象直接量的混合写法，看一个JSON字符串的例子：
```
{"name": "value", "some": [1, 2, 3]}
```
__JSON和对象直接量在语法上的唯一区别是，合法的JSON属性名均用引号包含。而在对象直接量中，只有属性名是非法的标识符时采用引号包含，比如，属性名中包含空格{"first name": "Dave"}。 在JSON字符串中，不能使用函数和正则表达式直接量。__


#### 使用JSON

在前面的章节中讲到，出于安全考虑，不推荐使用eval()来“粗糙的”解析JSON字符串。最好使用JSON.parse()方法，ES5中已经包含了这个方法，而且在现代浏览器的JavaScript引擎中已经内置支持JSON了。对于老旧的JavaScript引擎来说，你可以使用JSON.org所提供的JS文件 https://cdnjs.com/libraries/json2 来获得JSON对象和方法。
```
// an input JSON string
var jstr = '{"mykey": "my value"}';

// antipattern
var data = eval('(' + jstr + ')');

// preferred
var data = JSON.parse(jstr);

console.log(data.mykey); // "my value"
```
如果你已经在使用某个JavaScript库了，很可能库中提供了解析JSON的方法，就不必再额外引入JSON.org的库了，比如，如果你已经使用了YUI3，你可以这样：
```
// an input JSON string
var jstr = '{"mykey": "my value"}';

// parse the string and turn it into an object
// using a YUI instance
YUI().use('json-parse', function (Y) {
    var data = Y.JSON.parse(jstr);
    console.log(data.mykey); // "my value"
});
```
如果你使用的是jQuery，可以直接使用它提供的parseJSON()方法：
```
// an input JSON string
var jstr = '{"mykey": "my value"}';

var data = jQuery.parseJSON(jstr);
console.log(data.mykey); // "my value"
```
和JSON.parse()方法相对应的是JSON.stringify()。它将对象或数组（或任何原始值）转换为JSON字符串。
```
var dog = {
    name: "Fido",
    dob:new Date(),
    legs:[1,2,3,4]
};

var jsonstr = JSON.stringify(dog);

// jsonstr is now:
// {"name":"Fido","dob":"2010-04-11T22:36:22.436Z","legs":[1,2,3,4]}
```

