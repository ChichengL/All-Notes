非父子组件通信——Event Bus

需要安装hy-event-store
event-bus.js
```jsx
import {HYEventBus} from 'hy-event-store'
const eventBus = new HYEventBus();
export defualt eventBus;
```

其使用
A组件
```jsx
import eventBus from './utils/event-bus.js'
function (){
	const click = ()=>{
		eventBus.emit("hello","你好我是ttt");
	}
	return <button onClick={()=>click }></button>
}
```

使用事件：emit
注册事件：on
卸载事件：off


# React进阶

## React全部Hooks
react hooks解决了什么问题？

刚推出函数组件时，函数组件没有自己的生命周期，没有自己的状态，只能接受props，进行渲染UI的操作。那么任何处理数据的逻辑都必须放在class类组件内部，那么会使得类组件错综复杂。

类组件是一种面向对象思想的体现，类组件之间的状态会随着功能增强而变得越来越臃肿，代码维护成本也比较高，而且不利于后期 tree shaking。
因此Hooks诞生了


Hooks的`本质`
- 让函数组件也能做类组件的事，有自己的 状态，可以处理一些副作用，能获取ref，也能做数据缓存。
- 解决逻辑服用难的问题。
- 放弃面向对象编程，拥抱函数编程


