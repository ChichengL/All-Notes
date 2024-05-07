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


#### useReducer
useReducer是react-hooks提供能够在无状态组件中运行的类似redux的功能的api
```js
const [state,dispatch] = useReducer(reducer)

```
更新之后的 state 值。

 派发更新的 dispatchAction 函数, 本质上和 useState 的 dispatchAction 是一样的。

 一个函数 reducer ，我们可以认为它就是一个 redux 中的 reducer , reducer的参数就是常规reducer里面的state和action, 返回改变后的state, 这里有一个需要注意的点就是：**如果返回的 state 和之前的 state ，`内存指向相同`，那么组件将不会更新。**


基础用法
```jsx
const DemoUseReducer = ()=>{
    /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
   const [ number , dispatchNumbner ] = useReducer((state,action)=>{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case 'add':
               return state + 1
           case 'sub':
               return state - 1 
           case 'reset':
             return payload       
       }
       return state
   },0)
   return <div>
      当前值：{ number }
      { /* 派发更新 */ }
      <button onClick={()=>dispatchNumbner({ name:'add' })} >增加</button>
      <button onClick={()=>dispatchNumbner({ name:'sub' })} >减少</button>
      <button onClick={()=>dispatchNumbner({ name:'reset' ,payload:666 })} >赋值</button>
      { /* 把dispatch 和 state 传递给子组件  */ }
      <MyChildren  dispatch={ dispatchNumbner } State={{ number }} />
   </div>
}

```

#### useSyncExternalStore
useSyncExternalStore 的诞生并非偶然，和 v18 的更新模式下外部数据的 tearing 有着十分紧密的关联。useSyncExternalStore 能够让 React 组件在 concurrent 模式下安全地有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。当读取到外部状态发生了变化，会触发一个强制更新，来保证结果的一致性。

  ```js
  useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
)

```

sunscribe为订阅函数，当数据改变的时候，会触发subscribe，在 useSyncExternalStore 会通过带有记忆性的 getSnapshot 来判别数据是否发生变化，如果发生变化，那么会强制更新数据。

getSnapshot 可以理解成一个带有记忆功能的选择器。当 store 变化的时候，会通过 getSnapshot 生成新的状态值，这个状态值可提供给组件作为数据源使用，getSnapshot 可以检查订阅的值是否改变，改变的话那么会触发更新。

getServerSnapshot 用于 hydration 模式下的 getSnapshot。


```jsx
import { combineReducers , createStore  } from 'redux'

/* number Reducer */
function numberReducer(state=1,action){
    switch (action.type){
      case 'ADD':
        return state + 1
      case 'DEL':
        return state - 1
      default:
        return state
    }
}

/* 注册reducer */
const rootReducer = combineReducers({ number:numberReducer  })
/* 创建 store */
const store = createStore(rootReducer,{ number:1  })

function Index(){
    /* 订阅外部数据源 */
    const state = useSyncExternalStore(store.subscribe,() => store.getState().number)
    console.log(state)
    return <div>
        {state}
        <button onClick={() => store.dispatch({ type:'ADD' })} >点击</button>
    </div>
}

```
点击按钮，会触发 reducer ，然后会触发 store.subscribe 订阅函数，执行 getSnapshot 得到新的 number ，判断 number 是否发生变化，如果变化，触发更新。

#### useTransition
在 React v18 中，有一种新概念叫做过渡任务，这种任务是对比立即更新任务而产生的，通常一些影响用户交互直观响应的任务，例如按键，点击，输入等，这些任务需要视图上立即响应，所以可以称之为立即更新的任务，但是有一些更新不是那么急迫，比如页面从一个状态过渡到另外一个状态，这些任务就叫做过渡任务。 打个比方如下图当点击 tab 从 tab1 切换到 tab2 的时候，本质上产生了两个更新任务。

  - 第一个就是 hover 状态由 tab1 变成 tab2。
    
- 第二个就是内容区域由 tab1 内容变换到 tab2 内容。
    

这两个任务，用户肯定希望 hover 状态的响应更迅速，而内容的响应有可能还需要请求数据等操作，所以更新状态并不是立马生效，通常还会有一些 loading 效果。所以第一个任务作为**立即执行任务**，而第二个任务就可以视为**过渡任务**。

useTransition 执行返回一个数组。数组有两个状态值：

- 第一个是，当处于过渡状态的标志——isPending。
- 第二个是一个方法，可以理解为上述的 startTransition。可以把里面的更新任务变成过渡任务。
```js
import { useTransition } from 'react' 
/* 使用 */
const  [ isPending , startTransition ] = useTransition ()

```

除了上述切换 tab 场景外，还有很多场景非常适合 useTransition 产生的过渡任务，比如输入内容，实时搜索并展示数据，这本质上也是有两个优先级的任务，第一个任务就是受控表单的实时响应；第二个就是输入内容改变,数据展示的变化。那么接下来我们写一个 demo 来看一下 useTransition 的基本使用。

```jsx
/* 模拟数据 */
const mockList1 = new Array(10000).fill('tab1').map((item,index)=>item+'--'+index )
const mockList2 = new Array(10000).fill('tab2').map((item,index)=>item+'--'+index )
const mockList3 = new Array(10000).fill('tab3').map((item,index)=>item+'--'+index )

const tab = {
  tab1: mockList1,
  tab2: mockList2,
  tab3: mockList3
}

export default function Index(){
  const [ active, setActive ] = React.useState('tab1') //需要立即响应的任务，立即更新任务
  const [ renderData, setRenderData ] = React.useState(tab[active]) //不需要立即响应的任务，过渡任务
  const [ isPending,startTransition  ] = React.useTransition() 
  const handleChangeTab = (activeItem) => {
     setActive(activeItem) // 立即更新
     startTransition(()=>{ // startTransition 里面的任务优先级低
       setRenderData(tab[activeItem])
     })
  }
  return <div>
    <div className='tab' >
       { Object.keys(tab).map((item)=> <span className={ active === item && 'active' } onClick={()=>handleChangeTab(item)} >{ item }</span> ) }
    </div>
    <ul className='content' >
       { isPending && <div> loading... </div> }
       { renderData.map(item=> <li key={item} >{item}</li>) }
    </ul>
  </div>
}

```


### Hooks之执行副作用

#### useEffect
React hooks也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其本质主要是运用了 hooks 里面的 useEffect ， useLayoutEffect，还有 useInsertionEffect。其中最常用的就是 useEffect 。我们首先来看一下 useEffect 的使用。

```js
useEffect(()=>{
	return ()=>{}
},dep)
```
useEffect 第一个参数 callback, 返回的 destory ， destory 作为下一次callback执行之前调用，用于清除上一次 callback 产生的副作用。

第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，执行上一次callback 返回的 destory ，和执行新的 effect 第一个参数 callback 。

对于 useEffect 执行， React 处理逻辑是采用异步调用 ，对于每一个 effect 的 callback， React 会向 setTimeout回调函数一样，放入任务队列，`等到主线程任务完成，DOM 更新，js 执行完成，视图绘制完毕，才执行`。所以 effect 回调函数不会阻塞浏览器绘制视图。
因此不能在useEffect更改State，否则会引起无穷的渲染。


```jsx
/* 模拟数据交互 */
function getUserInfo(a){
    return new Promise((resolve)=>{
        setTimeout(()=>{ 
           resolve({
               name:a,
               age:16,
           }) 
        },500)
    })
}

const Demo = ({ a }) => {
    const [ userMessage , setUserMessage ] :any= useState({})
    const div= useRef()
    const [number, setNumber] = useState(0)
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    /* useEffect使用 ，这里如果不加限制 ，会是函数重复执行，陷入死循环*/
    useEffect(()=>{
       /* 请求数据 */
       getUserInfo(a).then(res=>{
           setUserMessage(res)
       })
       /* 定时器 延时器等 */
       const timer = setInterval(()=>console.log(666),1000)
       /* 操作dom  */
       console.log(div.current) /* div */
       /* 事件监听等 */
       window.addEventListener('resize', handleResize)
         /* 此函数用于清除副作用 */
       return function(){
           clearInterval(timer) 
           window.removeEventListener('resize', handleResize)
       }
    /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */
    },[ a ,number ])
    return (<div ref={div} >
        <span>{ userMessage.name }</span>
        <span>{ userMessage.age }</span>
        <div onClick={ ()=> setNumber(1) } >{ number }</div>
    </div>)
}

```
  
useEffect的功能
- ① 请求数据。
- ② 设置定时器,延时器等。
- ③ 操作 dom , 在 React Native 中可以通过 ref 获取元素位置信息等内容。
- ④ 注册事件监听器, 事件绑定，在 React Native 中可以注册 NativeEventEmitter 。
- ⑤ 还可以清除定时器，延时器，解绑事件监听器等。


#### useLayoutEffect
useLayout和useEffect很相似，他们不同的地方是，useLayoutEffect采用了同步执行。
细节点来说
- useLayout是在DOM更新之后，浏览器绘制之前执行的。因此操作DOM尽可能放在useLayoutEffect中，使用useEffect来操作DOM，因为useEffect是执行在浏览器绘制视图之后，接下来又修改DOM，可能引起浏览器的回流和重绘。而且由于连续两次绘制，视图上可能照成闪现的效果
- useLayoutEffect中的回调函数会阻塞浏览器的绘制

```jsx
const DemoUseLayoutEffect = () => {
    const target = useRef()
    useLayoutEffect(() => {
        /*我们需要在dom绘制之前，移动dom到制定位置*/
        const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
        animate(target.current,{ x,y })
    }, []);
    return (
        <div >
            <span ref={ target } className="animate"></span>
        </div>
    )
}

```


#### useInsertionEffect
useInsertionEffect 是在 React v18 新添加的 hooks ，它的用法和 useEffect 和 useLayoutEffect 一样。那么这个 hooks 用于什么呢?

先看useInsertionEffect
```js
React.useEffect(()=>{
    console.log('useEffect 执行')
},[])

React.useLayoutEffect(()=>{
    console.log('useLayoutEffect 执行')
},[])

React.useInsertionEffect(()=>{
    console.log('useInsertionEffect 执行')
},[])

```
打印：useInsertionEffect 执行 -> useLayoutEffect 执行 -> useEffect 执行