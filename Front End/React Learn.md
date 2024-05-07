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


常见Hook
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69822a1b61e64ee29b8125592e1ee035~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)


### Hooks之数据驱动

#### useState
useState 可以使函数组件像类组件一样拥有 state，函数组件通过 useState 可以让组件重新渲染，更新视图。

```js
const [state,dispatch] = useState(initData)
```
state，目的提供给 UI ，作为渲染视图的数据源。

dispatchAction 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。

initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。



注意事项：
在函数组件一次执行上下文中，state 的值是固定不变的。
```jsx
function Index(){
    const [ number, setNumber ] = React.useState(0)
    const handleClick = () => setInterval(()=>{
        // 此时 number 一直都是 0
        setNumber(number + 1 ) 
    },1000)
    return <button onClick={ handleClick } > 点击 { number }</button>
}

```
解决方案传入一个记忆值的回调函数
```jsx
function Index(){
    const [ number, setNumber ] = React.useState(0)
    const handleClick = () => setInterval(()=>{
        // 此时 number 一直都是 0
        setNumber(number => number + 1 ) 
    },1000)
    return <button onClick={ handleClick } > 点击 { number }</button>
}
```

如果两次 dispatchAction 传入相同的 state 值，那么组件就不会更新
```jsx
export default function Index(){
    const [ state  , dispatchState ] = useState({ name:'alien' })
    const  handleClick = ()=>{ // 点击按钮，视图没有更新。
        state.name = 'Alien'
        dispatchState(state) // 直接改变 `state`，在内存中指向的地址相同。
    }
    return <div>
         <span> { state.name }</span>
        <button onClick={ handleClick }  >changeName++</button>
    </div>
}

```

解决方案：传入一个新的对象
```jsx
export default function Index(){
    const [ state  , dispatchState ] = useState({ name:'alien' })
    const  handleClick = ()=>{ // 点击按钮，视图没有更新。
        dispatchState({...state, name: 'Alien' }) // 直接改变 `state`，在内存中指向的地址相同。因此需要传入一个新对象来触发更新。
    }
    return <div>
         <span> { state.name }</span>
        <button onClick={ handleClick }  >changeName++</button>
    </div>
}
```


### useReducer
