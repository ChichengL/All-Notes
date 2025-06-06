### This的特点
this指向是`动态的`，是在运行时绑定。
与声明位置无关，但是与调用方式和调用位置有关。

绑定规则有三——默认绑定、饮食绑定、显示绑定。
接下来娓娓道来

### 默认绑定

都知道，箭头函数和普通函数是有区别的
`箭头函数没有自己的this`，只能继承上一层的this
而普通函数会生成`自己的this`
因此我们需要分开讨论

对于**普通函数**而言
在非严格模式下
- 浏览器中的this通常指向`window`。
- node环境中this指向全局对象`global`上
在严格模式下
- `this` 的值会是 `undefined` 在Node.js中，或在浏览器的严格模式下保持 `undefined`（不过在实际操作中，Node.js会将其显示为 `{}`，这是一个空的对象，但实际上它是 `undefined` 的一种特殊表现形式，用于避免 `TypeError`）。

对于**箭头函数**而言
- 无论在 **Node.js** 还是 **浏览器** 中，无论是否处于 **严格模式**，箭头函数内部的 `this` 都会保持外层的 `this` 值
- 在 Node.js 环境下，如果直接在全局作用域定义箭头函数并调用，因为全局作用域下的 `this` 是 `global`（非严格模式下表现为一个空对象 `{}`），所以箭头函数内的 `this` 也会是同样的值。
- 在浏览器环境中，全局作用域下的 `this` 默认指向 `window` 对象，因此箭头函数内的 `this` 也是 `window`，不论是否启用严格模式（因为箭头函数不遵循严格模式对 `this` 的改变规则）。


即表现出以下情况
普通函数
```js
function fn(){
	console.log(this)
	//浏览器环境为window对象
	//node环境为global对象

	//严格模式下，都为undefined
}
```

箭头函数
```js
const fn = ()=>{
	console.log(this)
	//严格模式和非严格模式一样
	//node环境为{}
	//浏览器环境为window
}
```


这里再探讨一下关于调用方式和调用位置的情况
非严格模式下
```js
const obj = {
    name: 'John',
    sayName() {
        console.log(this.name);
    }
}

obj.sayName(); // John
const sayName = obj.sayName;
sayName(); // undefined
```

严格模式下会报错
>console.log(this.name);
>TypeError: Cannot read properties of undefined (reading 'name')
因为严格模式下的this指向最外层的话，那么就会报错

```js

const obj = {
    name: 'John',
    sayName: () => {
        console.log(this.name);
    }
}

obj.sayName(); // undefined
const sayName = obj.sayName;
sayName(); // undefined
```
这里都是undefined，因为这里涉及到隐式绑定了。
总结来说，两次打印出 `undefined` 是因为箭头函数没有自己的 `this`，它使用了外层作用域的 `this`，而那个 `this` 并没有 `name` 属性，所以结果是 `undefined`。
### 隐式绑定
前提条件
- 调用对象内部的函数
- 如果对象内部没有这个函数，调用的时候会因为找不到而报错
- 调用的时候将this绑定在对象上

```js
const foo = ()=> {
    console.log(this)
}

const obj = {
    fn:foo
}
foo()
obj.fn()
```
>node环境为{}
浏览器环境下为window对象

这个也是一样，foo沿用了外层的this，而这个this已经确认。

即`箭头函数在声明的时候确认了this指向，普通函数是在运行时确认的this`
如果想根据对象的不同调用函数产生不同的结果，那么应该声明一个普通函数。
比如
```js
function foo() {
    console.log(this)
}

const obj = {
    fn:foo
}
foo()
obj.fn()
```
>分别打印global和obj对象
### 显示绑定

使用bind，call，apply改变this的绑定。

bind使用：`fn.bind(obj)`
结果 得到一个新的函数

call: 
```js
fn.call(obj,a1,a2,a3...)
```
apply:
```js
fn.apply(obj,[a1,a2,...])
```
call和apply都是得到一个结果，只不过他的this是绑定在obj上的

```js
foo.call(globalThis)
foo.call({ name: 'chichengl' })
foo.call(123)
```

手写bind，call，apply
`bind`
```js
Function.prototype.myBind = function(context){
	if(typeof this !== 'function'){
		throw new TypeError("This is not Function")
	}
	
	if(context === null || context === undefined){
		context = globalThis
	}else{
		context = Object(context)
	}
	const self = this;
	const args = [...arguments].slice(1)
	return function(){
		return self.apply(context,[...args].concat(argument))
	}
}
```


`call`
```js
Function.prototype.myCall = function (context){
	if(typeof this !== 'function'){
		throw new TypeError("This is not Function")
	}
	
	if(context === null || context === undefined){
		context = globalThis
	}else{
		context = Object(context)
	}
	const args = [...arguments].slice(1)
	const flag = Symbol('fn');
	context[flag] = this;
	const res = context[flag](...args)
	delete context[flag]
	return res;
}
```

`apply`
```js
Function.prototype.myApply = function(context){
	if(typeof this !== 'function'){
		throw new TypeError("This is not Function")
	}
	
	if(context === null || context === undefined){
		context = globalThis
	}else{
		context = Object(context)
	}
	const args = [...arguments][1]
	const flag = Symbol('fn');
	context[flag] = this;
	const result = arguments.length > 1 ? context[flag](...args) : context[flag]()
	delete context[flag]
	return result
}
```


### 特殊的new绑定

new关键字也会设计到this的改变，这里需要请求new的过程
1. 创建一个新对象
2. 设置原型链
3. 绑定this
4. 执行构造函数
5. 返回处理：如果构造函数显式地返回了一个对象（非基本类型，如数字、字符串、布尔值等，而是object、array、function等），那么这个返回的对象将会是 `new` 表达式的结果，而不是第一步创建的那个新对象。如果没有显式返回一个对象，或者返回了一个基本类型值，那么 `new` 表达式的结果就是最初创建的那个新对象。
```js
function myNew(constructor,...args){
	const obj = Object.create(constructor.prototype)
	const result = constructor.call(obj,...args);
	return typeof result === 'function' ? result : obj;
}
```

检验
```js
function A(name,age){
    this.name = name;
    this.age = age;
    return 1;
}
const a = new A('zhangsan', 20);

function myNew(constructor,...args){
	const obj = Object.create(constructor.prototype)
	const result = constructor.call(obj,...args);
	return typeof result === 'function' ? result : obj;
}
const b = myNew(A, 'lisi', 25);
console.log(a, b);//A { name: 'zhangsan', age: 20 } A { name: 'lisi', age: 25 }
```
这里还需要考虑是否传入一个箭头函数，因为箭头函数不可以被实例化
```js
function myNew(constructor, ...args) {
    let obj;
    try {
        obj = Object.create(constructor.prototype)
    } catch (error) {
        throw new TypeError(`${constructor.name} is not a constructor `)
    }
	const result = constructor.call(obj,...args);
	return typeof result === 'function' ? result : obj;
}
```


### 面试题
1.
```js
var name = 'window'

var person = {
	name: 'person',
	sayName: function () {
		console.log(this.name)
	},
}

function sayName() {
	var sss = person.sayName
	sss() // 直接调用-> window
	person.sayName() // 隐式绑定->person
	;(person.sayName)() // 与上述一样，隐式绑定->person
	;(b = person.sayName)() // 间接引用，返回b，调用->window
}

sayName()

```

2.
```js
var name = 'window'
var person1 = {
	name: 'person1',
	foo1: function () {
		console.log(this.name)
	},
	foo2: () => console.log(this.name),
	foo3: function () {
		return function () {
			console.log(this.name)
		}
	},
	foo4: function () {
		return () => console.log(this.name)
	},
}

var person2 = { name: 'person2' }

person1.foo1() // 隐式绑定->person1
person1.foo1.call(person2) // 显示绑定->person2

person1.foo2() // 上层作用域->window
person1.foo2.call(person2) // 上层作用域->window

person1.foo3()() // 隐式绑定->window
person1.foo3.call(person2)() // window  前面拿到的还是那个函数 默认绑定(后面那个执行的)
person1.foo3().call(person2) // 显示绑定->person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1


```
2.的变式
```js
function fn() {
    const obj2 = {
        name: 'obj2',
        foo1() {
            console.log(this);//obj2
        },
        foo2: () => {
            console.log(this);//fn没有自己的this找上一层的this，即无视obj寻找obj同一层的obj所处的环境是fn中，fn如果是当做对象声明，那么this指向fn的新实例，如果当做函数调用fn的this默认绑定在window上
        },
        foo3: function () { 
            return function () { 
                console.log(this);//window这个内部函数没有被任何对象直接调用，而是作为一个独立的函数调用。在这种情况下，非严格模式下，`this` 默认绑定到全局对象 `window`（在浏览器中），因此输出 `window`
            }
        },
        foo4: function () { 
            return ()=>console.log(this);//obj2调用上一层匿名函数的this这个this指向的obj2
        }
    }
    obj2.foo1(); 
    obj2.foo2(); 
    obj2.foo3()(); 
    obj2.foo4()(); 
}
new fn();
```

3.
```js
var name = 'window'
function Person(name) {
	this.name = name
	this.foo1 = function () {
		console.log(this.name)
	}
	this.foo2 = () => console.log(this.name)
	this.foo3 = function () {
		return function () {
			console.log(this.name)
		}
	}
	this.foo4 = function () {
		return () => console.log(this.name)
	}
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() // 隐式绑定->person1
person1.foo1.call(person2) // 显示绑定->person2

person1.foo2() // new 绑定 上层作用域 -> person1
person1.foo2.call(person2) // 无关 new 绑定上层作用域-> person1

person1.foo3()() // 隐式绑定->window
person1.foo3.call(person2)() // window  前面拿到的还是那个函数 默认绑定(后面那个执行的)
person1.foo3().call(person2) // 显示绑定->person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1

```