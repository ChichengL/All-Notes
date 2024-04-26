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


改变数组的方法
