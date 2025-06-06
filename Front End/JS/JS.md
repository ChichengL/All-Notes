# 基础


## 数组
### 数组判断
ES6之前可以使用
1. Object.prototype.call(obj).slice(8,-1) === 'Array'进行判断
2. 使用 obj.constructor === Array进行判断
3. obj instanceof Array 进行判断
4. Array.prototype.isPrototypeOf(obj)进行判断
5. Object.getPrototypeOf(obj) === Array.prototype进行判断
3,4,5都是通过原型链去判断，判断这个对象的原型和数组的原型

Es6之后
使用Array.isArray(obj)进行判断


改变数组的方法：fill()、`pop()、push()、shift()、splice()、unshift()、reverse()、sort()；`
常见的为后面7个
不改变原数组的方法：concat()、every()、filter()、find()、findIndex()、forEach()、indexOf()、join()、lastIndexOf()、map()、reduce()、reduceRight()、slice()、some。

1. 复制填充方法

fill方法是填充，填充某个索引区间的所有值为同一值
```js
array.fiil(value,start,end);
```

value是必选，其他两个可选
end默认为array.length
索引区间是`[start,end)`end的索引不包含

copyWith复制方法
opyWithin()方法会按照指定范围来浅复制数组中的部分内容，然后将它插入到指定索引开始的位置，开始与结束索引的计算方法和fill方法一样。
```js
array.copyWith(target,start,end);
```
target：必选，start，end可选。如果end为负值，那么表示倒数



2. 转换方法
主要有toLocaleString()、toString()、valueOf()、join()
toString和valueOf是和对象的隐式转换有关
toString方法,返回的是由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串，`对数组的每个值都会调用toString()方法`
```js
let colors = ["red", "blue", "green"];  
console.log(colors.toString())  // red,blue,green
```

valueOf方法，返回的是`一个数组的本身`
```js
let colors = ["red", "blue", "green"];  
console.log(colors.valueOf())  // ["red", "blue", "green"]
```

对于`普通对象`和一个基础类型（Number,String,Bool,Symbol,bigInt,Null,undefined）
进行比较时
先调用valueOf，如果返回的不是一个基础类型，那么就调用toString方法。
对于日期对象，先调用的是toString再是valueOf进行比较
因此可以重写valueOf和toString方法实现一些烧操作
```js
let a = {
	_value = 1,
	valueOf(){
		return this._value++;
	} 
}
if(a==1 && a==2 && a==3){
	console.log('success')
}
```

toLocalString
toLocaleString()方法可能会返回和toString()方法相同的结果，但也不一定。在调用toLocaleString()方法时会得到一个逗号分隔的数组值的字符串，它与toString()方法的区别是，为了得到最终的字符串，会`调用每个值的toLocaleString()方法`
```js
let array= [{name:'zz'}, 123, "abc", new Date()];
let str = array.toLocaleString();
console.log(str); // [object Object],123,abc,2024/4/26 13:03:05

console.log(array.toString()) // [object Object],123,abc,Fri Apr 26 2024 13:03:05 GMT+0800 (中国标准时间)
```

join
把数组中的所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的。
```js
array.join(",");//比如这里声明使用 , 进行分隔每个元素
```



3. 操作方法
concat，slice，splice
concat，用于连接多个数组,返回一个全新数组，且对于arrayX的处理相当于
Array.isArray(arrayX) ? ...arrayX: arrayX
只变一层类似于 array.flat(1)

```js
arrayObject.concat(arrayX,arrayX,......,arrayX)
```


slice
已有的数组中返回选定的元素。返回一个新的数组，包含从 start 到 end （不包括该元素）的数组元素。方法并不会修改数组，而是返回一个子数组。

```js
arrayObject.slice(start,end)
```

start必选，可以为正可以为负数，如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素
end：可选。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。


`splice`
使用它的形式有很多种，它会向/从数组中添加/删除项目，然后返回被删除的项目。`该方法会改变原始数组。`
```js
arrayObject.splice(index, howmany, item1,.....,itemX)
```

常见形式
- 删除：- 需要给splice()传递两个参数，即要删除的第一个元素的位置和要删除的元素的数量；
- 插入：需要给splice()传递至少三个参数，即开始位置、0（要删除的元素数量）、要插入的元素。
- 替换：splice()方法可以在删除元素的同事在指定位置插入新的元素。同样需要传入至少三个参数，即开始位置、要删除的元素数量、要插入的元素。要插入的元素数量是任意的，不一定和删除的元素数量相等。

reduce
对数组中的每个元素执行一个reducer函数(升序执行)，将其结果汇总为单个返回值。
```js
array.reduce(callback,[initiakValue])
```
callback
```js
let arr = [1, 2, 3, 4]
let sum = arr.reduce((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur;
})
console.log(arr, sum);  
```


类数组
arguments，HTMLCollection、NodeLIst

arguments
```js
const a = ()=>{
	console.log(arguments)
}
```


数组常见操作
1. 扁平化
递归实现
```js
let arr = [1, [2, [3, 4, 5]]];
const flatten = (arr)=>{
	let res = []
	for(let i = 0; i < arr.length; i ++){
		if(Array.isArray(arr[i])){
			res = res.concat(flatten(arr[i]))
		}else{
			res.push(arr[i]);
		}
	}
	return res;
}
```

reduce迭代
```js
let arr = [1, [2, [3, 4]]];
function flatten(arr){
	return arr.reduce((prev,next)=>{
		return prev.concat(Array.isArray(next) ? flatten(next) : next,[])
	})
}
```

拓展运算符
```js
let arr = [1, [2, [3, 4]]];
const flatten = (arr)=>{
	while(arr.some(item=> Array.isArray(item))){
		arr = [].concat(...arr);
	}
	return arr;
}
```

split 和 toString
```js
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.toString().split(',');
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```

ES6中flat
```js
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.flat(Infinity);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```

不使用flat实现，控制层数的扁平化
将第一个改改
```js
let arr = [1, [2, [3, 4, 5]]];
const flatten = (arr,deepth)=>{
	let res = []
	for(let i = 0; i < arr.length; i ++){
		if(Array.isArray(arr[i]) && deepth > 0){
			res = res.concat(flatten(arr[i],deepth-1))
		}else{
			res.push(arr[i]);
		}
	}
	return res;
}

console.log(flatten(arr,1)); // [ 1, 2, [ 3, 4, 5 ] ]
```


### 数组去重
set实现
```js
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];
Array.from(new Set(array)); // [1, 2, 3, 5, 9, 8]
```

map实现
```js
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

function uniqueArray(array) {
  let map = {};
  let res = [];
  for(var i = 0; i < array.length; i++) {
    if(!map.hasOwnProperty([array[i]])) {
      map[array[i]] = 1;
      res.push(array[i]);
    }
  }
  return res;
}

uniqueArray(array); // [1, 2, 3, 5, 9, 8]

```

indexOf实现
```js
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

function uniqueArray(array) {
    let res = [];
    for (let i = 0; i < array.length; i++) { 
        if (array.indexOf(array[i]) === i) {
            res.push(array[i]);
        }
    }
  return res;
}
```

includes实现
```js
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

function uniqueArray(array) {
    let res = [];
    for (let i = 0; i < array.length; i++) { 
        if (res.includes(array[i])  === false) {
            res.push(array[i]);
        }
    }
  return res;
}

console.log(uniqueArray(array)); // [1, 2, 3, 5, 9, 8]
```


## 变量提升
var声明的存在变量提升
let和const声明的不存在变量提升
var声明在变量环境
let和const声明在词法环境
![](https://cdn.nlark.com/yuque/0/2021/png/1500604/1631457143026-2dff9d08-1111-4159-9e48-6c86ab80e60a.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_17%2Ctext_5b6u5L-h5YWs5LyX5Y-377ya5YmN56uv5YWF55S15a6d%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fformat%2Cwebp)
查找变量是先词法环境再变量环境，再沿着作用域查找

let 和 const声明的变量是存在暂时性死区的。也就是在声明之前不能使用否则会报错。

# 进阶
## this
如果嵌套了多个对象，那么指向**最后一个**调用这个方法的对象
```js
const obj1 = {
    text: 1,
    fn: function() {
        return this.text
    }
}
const obj2 = {
    text: 2,
    fn: function() {
        return obj1.fn()
    }
}
const obj3 = {
    text: 3,
    fn: function() {
        var fn = obj1.fn
        return fn()
    }
}
console.log(obj1.fn())//1
console.log(obj2.fn())//1
console.log(obj3.fn())// undefined因为这里指向的window 
```
这里第三个不同于之前是因为，在进行 `var fn = o1.fn` 赋值之后，是直接调用的，因此这里的 `this` 指向 `window`，答案是 `undefined`
**new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定**


