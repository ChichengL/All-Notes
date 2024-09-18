# 杂记
## React-Router

React-router v6
可以使用json-server快速搭建服务器

基本使用
```jsx
<Routes>
	<Route path='/' element={<Home />}/>
</Routes>
```





## 有状态和无状态组件

一般来说，使用`class`关键字创建的组建，有自己的生命周期和私有数据是**有状态组件**
而对于使用`function`创建的组件，只有props，没有自己的私有数据和生命周期，就是无状态组件。
PS：针对function组件**没有自己的state和生命周期**，react16.8后面新增了各种Hooks，比如useState，useEffect等等来丰富函数组件


### 无状态组件
无状态组件是最基础的组建(`stateless component`)，纯静态。因为这种组建不涉及状态的更新，所以这种组建的复用性也最强，无状态组建由于没有自己的state和生命周期函数，因此运行效率更高。
其特点：
- 只接受props，没有自己的state，只负责渲染。
- 没有生命周期方法。
- 不需要声明化类，简化语法比如，类组件需要`class A extends React.component`
- 不会被实例化，因此不能直接传ref，可以使用React.forwardRef包装后再使用
  ```jsx
  import React, { forwardRef } from 'react'; // 使用forwardRef包装函数组件 
  const MyFunctionalComponent = forwardRef((props, ref) => { // 在返回的DOM元素上绑定ref 
  return <div ref={ref}>Hello, I'm a functional component with a ref!</div>; }); // 然后在父组件中可以像传给类组件一样传递ref 
  class ParentComponent extends React.Component { 
  constructor(props) { super(props); 
  this.myRef = React.createRef(); 
  } 
  render() {
   return 
   ( <MyFunctionalComponent ref={this.myRef} />
    ); 
    }
     }
```
- 不需要显示声明this关键值，在ES6的类生命往往需要讲函数的this绑定到当前作用域，而函数式声明的特性，不需要强行绑定
  
```jsx
this.foo = this.foo.bind(this)
foo(){}
```
这就是需要绑定的情况

- 函数组件有更好的性能表现，因为没有生命周期管理和状态管理，因此React并不需要进行特定的检查或者内存分配。

### 有状态组件
有状态组建是在无状态组件（stateful component）的基础上添加了状态state。
有状态组件**通常**会带有生命周期，用一在不同时刻出发状态的更新。
PS：通常是因为后面react16.8之后添加了useState hooks，让函数组件有了自己的状态，但是没有生命周期。
```jsx
class App extends React.component{
	constructor(props){
		super(props)
		this.state = {
		tips:'hello world'
		}
	}
	render(){
		return (
			<div>{this.state.tips}</div>
		);
	}
	
}
```
render方法是class组件**必须实现**的方法

## 受控组件与非受控组件
React的受控组件和非受控组件的概念相对于表单而言的，React中表单元素通常会持有内部的state，因此它的工作方式与其他HTML元素不同。
其实也就是我们**对某个组件状态的掌控，它的值是否只能由用户设置，而不能通过代码控制**。
### 受控组件
要与state绑定
在React中定义input输入框，因为没有双向绑定，不能将数据和输入框结合起来，让用户在输入框中输入东西，然后数据同步更新，这种行为是**不被我们程序掌握**的。
如果将React里的state属性与表单元素的值建立依赖关系，再通过onChange事件与setState相结合来**更新state的属性**，就能达到用户输入过程表单改变的操作。被`React`以这种方式控制取值的表单输入元素就叫做**受控组件**。
上面这么长一大堆令人害怕，总结下来就是——<mark style="background: #ADCCFFA6;">由用户输入决定值的为受控组件</mark>
```jsx
class Input extends React.Component {
	render () {
		return <input name="username" />
	 }
 }
```

这个可以通过onChange事件进行监听。
```jsx
class Input extends React.component{
	constructor(props){
		super(props);
		this.state = {username:"1"};
	}
	render(){
		return (
			<>
				<input name="username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} /> 
				<button onClick={() => console.log(this.state.username)} >Log</button>
			</>
		)
	}

}
```
这样就能在当前组建控制表单元素的值，这就是受控组件

但是服用这个组件是有弊端的，尽管此时Input组件本身是一个受控组建，但与之对应的调用方法失去的更爱Input组件值的控制权。

对于调用Input的组件而言，Input组件是非受控的，下面的例子可以调用非受控组件
```jsx
function Input({defaultValue}){
	const [value,setValue] = React.useState(default)
	return <input value={value} onChange = {e=>setValue(e.target.value)}/>
}
function UseInput(){
	return <Input default={1}/>
}
```

如果要对于组件提供方还是调用方`Input`组件都为受控组件，只需要提供方让出控制权即可。
```jsx
function Input({value,onChange}){
	return <input value={value} onChange={onChange}/>
}
function UseInput(){
	const [value,setValue] = React.useState(1);
	return <Input value={value} onChange={e => setValue(e.target.value)}>
}
```


### 非受控组件
如果表单元素**并不经过state**，而是通过ref修改或者直接操作DOM，那么他的数据无法通过state控制，这就是非受控组件
例如：
```jsx
function Input(){
	const input = useRef()
	return (
		<>
			<input name="username" ref={input}/>
		</>
	);
}
```
通过DOM进行更新。

**总结**
受控组件：
- 需要与state绑定
- 组件渲染出的状态与它的`value`或`checked prop`相对应。
- state的更新
	- 需要调用onChange事件处理
	- 然后通过对象event更新state
	- 通过setState出发视图的再次渲染
非受控组件
- 他的值不受**props或者state**进行控制
- 需要添加ref来得到DOM元素，可以通过添加defaultValue指定value值。


## 纯组件
React提供基于浅比较模式来确认是否应该重新渲染组件的类`React.PureComponent`，通常只需要继承`React.PureComponent`就可以实现一个纯组件。纯组件并未实现`shouldComponentUpdate()`
补充：shouldComponentUpdate接受两个参数nextprops和nextState，比较nextProps机票在nextState是否与当前的props或state是否相等，如果不相等则返回true，表示需要更新，这个比较是**浅层比较**

对于纯组件来说，输入相同，那么输出一定相同。
比如 `y = x+1`，如果x一直为1，那么得到的y值一定相同。

PureComponent通过寄生组合继承的方式继承了Component

React.PureComponent中的shouldComponentUpdate仅作对象的浅层比较。
此外其将跳过所有子组件树的prop更新，因此需要确保所有的子组件都是纯组件。

**优点**
- 在shouldComponentUpdate生命周期做了优化会自动shadow diff组件的state和props，结合Immutabel数据就可以很好地去做更新判断。
- 隔绝了父组件与子组件的状态变化


**缺点**
- shouldComponentUpdate中的shadow diff同样消耗性能
- 需要确保组件渲染仅取决于props与state


## 高阶组件HOC 
HOC(Higher Order Component)是React复用组件逻辑的一种高阶技巧，相当于对某个组件进行拓展。
高阶组件的参数是组件，其返回值为新的组件。
```jsx
const higherOrderComponent = (Component) =>{
	return function (props){
		return <Component props = {props}/>;
	}
}
function Component(){
	return <div>123</div>
}
const EnhancedComponent = higherOrderComponent(Component);
//然后就可以使用EnhancedComponent组件了
```
不要修改组件原型，应该采用组合的思想，通过组件包装在容器组件中实现功能

实现高阶组件的方式有以下两种
- 属性代理`props Proxy`
- 反向继承`Inheritance Inversion`

### 属性代理
比如可以为传入的组件增加一个存储中国的id属性值，通过高阶组件，我们就可以为这个组件新增一个props，然后，在Component组件（并非操作传入的Component）中对props进行操作

```jsx
const HOC = (WrappedComponent) => { 
	return class EnhancedComponent extends React.Component {
		 render() { 
			 return ( 
				 <div class="layout">
					  <WrappedComponent {...this.props} />
				</div> 
			); 
		} 
	} 
}
```


### 反向代理

反向继承是指返回的组件基层之前的组件，这样可以进行很多操作，修改state，props等等。反向继承不能保证完整的子组件树被解析
当我们使用反向继承实现高阶组件的时候可以通过渲染劫持来控制渲染，具体是指我们可以有意识地控制`WrappedComponent`的渲染过程
```jsx
const hoc = ()=>{
    return class enhanceComponent extends WrappedComponent{
        render(){
            return this.props.isRender && super.render();
        }
    }
}

function WrappedComponent(){
    return <div>Wrapped Component</div>
}
```


**注意**
1. 不要改变原始组件
不要试图在HOC中修改组件原型，或以其他方式改变他
```jsx
function logProps(InputComponent) {
    InputComponent.prototype.componentDidUpdate = function(prevProps) {
      console.log("Current props: ", this.props);
      console.log("Previous props: ", prevProps);
    };

    // 返回原始的 input 组件，其已经被修改。
    return InputComponent;
  }

  // 每次调用 logProps 时，增强组件都会有 log 输出。
  const EnhancedComponent = logProps(InputComponent);

```

2. 过滤Props
HOC是为组件添加新的内容，自身不要大幅改变约定。HOC返回的组件与元组建赢保持类似的接口。HOC应该透传与自身无关的 props，大多数HOC都应该包含一个类似于下面的render方法
```jsx
render() {
    // 过滤掉额外的 props，且不要进行透传
    const { extraProp, ...passThroughProps } = this.props;
    // 将 props 注入到被包装的组件中。
    // 通常为 state 的值或者实例方法。
    const injectedProp = someStateOrInstanceMethod;
    // 将 props 传递给被包装组件
    return (
      <WrappedComponent
        injectedProp={injectedProp}
        {...passThroughProps}
      />
    );
  }
```

不要在render里面使用HOC
React的diff算法使用组件标识确认他是应该更新现有字数还是将其丢弃并挂载新子树。如果从render返回的组件与前一个渲染中的组件相同，则react通过讲子树与新子树进行区分来地柜更新子树，如果不相等，则完全卸载前一个子树。
在

高阶组件中refs不再进行传递。
虽然高阶组件的约定是将所有`props`传递给被包装组件，但这对于`refs`并不适用，那是因为`ref`实际上并不是一个`prop`，就像`key`一样，它是由`React`专门处理的。如果将`ref`添加到`HOC`的返回组件中，则`ref`引用指向容器组件，而不是被包装组件，这个问题可以通过`React.forwardRef`这个`API`明确地将`refs`转发到内部的组件。
这个可以通过forwardRef进行解决
```jsx
function logProps(Component) {

    class LogProps extends React.Component {
      componentDidUpdate(prevProps) {
        console.log('old props:', prevProps);
        console.log('new props:', this.props);
      }
      render() {
        const {forwardedRef, ...rest} = this.props;
        // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
        return <Component ref={forwardedRef} {...rest} />;
      }
    }

    // 注意 React.forwardRef 回调的第二个参数 “ref”。
    // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
    // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
    return React.forwardRef((props, ref) => {
      return <LogProps {...props} forwardedRef={ref} />;
    });
  }
```


## Refs

ref为React提供的属性之一，表示为组件真正实例的引用，ReactDOM.render()返回的组件实例
其使用场景
- 聚焦、文本选择、媒体播放等
- 触发某些动画

使用方式
### 字符串
   这种方式基本不推荐使用
   主要是使用字符串导致的一些问题，例如当ref定义为一个string时，需要React追逐当前正在渲染的组件，在reconciliation阶段，React Element创建和更新的过程中，ref会被封装为一个闭包函数，等待commit阶段被执行，会消耗性能
   ```jsx
   function myInput(){
    const input = React.useRef(null)
    return <>
        <input ref={input} />
        <button onClick={() => input.current.focus()}>Focus</button>
    </>
}
```

###  回调
   React支持给任意组件添加特殊属性，ref属性接收一个回调函数，其在组件被加载或者卸载时会立即执行。
   - 当给HTML元素添加ref属性时，ref回调接收了底层的DOM元素作为参数。
   - 当给组件添加ref属性时，ref回调接收当前组件实例作为参数
   - 组件卸载的时候，会传入null
   - ref回调会在componentDidMount或componentDidUpdate等声明周期回调之前执行。
   CallBack Ref，我们通常会使用内联函数的形式，那么每次渲染都会重新创建，由于Reqact会清理旧的ref然后设置新的，那么每次渲染都会冲洗你创建，由于React会清理旧的然后设置新的，因此更新期间会调用两次，第一次为null，如果CallBack中带有业务逻辑的话，可能会出错，可以通过将CallBack定义成类成员函数并进行绑定的方式避免。
```jsx
function Input(){
    const inputRef = useRef(null);
    return <input ref={(element)=>inputRef.current = element}/>
}
```

但是下面是不行滴~
```jsx
function Input(){
    const inputRef = useRef(null);
    return <input ref={(element)=>inputRef.current = element}/>
}

function InputThree(){
    const inputRef = useRef(null);
    return <Input ref={(element)=>inputRef.current = element}/>
}
```
因为ref只是React用来获取HTML元素和类组件的

### API创建
使用createRef
```jsx
function Input(){
    const inputRef = createRef(null);
    return <input ref={(element)=>inputRef.current = element}/>
}
```
这里需要注意，createRef和useRef两者的差异
- createRef是类组件专用的创建引用的方法，而useRef是专门为函数组件设计的Hook
- useRef相比creatRef更加灵活，因为他可以在函数组件内部存储任意类型的数据，并且每次渲染时都能保证`current`属性指向同一对象
- 在函数组件内部直接使用`createRef`会导致每次渲染都生成一个新的Ref对象，而useRef则能避免这个问题

## React中的合成事件

React自己实现了一套高效的事件注册、存储、分发和重用逻辑
React在内部实现的一套事件处理机制，是浏览器原生事件的跨浏览器包装器，兼容所有浏览器。
- React上注册的事件最终会绑定在document这个DOM上，而不是React组件对应的DOM，通过这种方式减少内存开销，所有的时间都绑定在document上，其他节点没有绑定事件，这就是事件委托
- React自身实现了一套事件冒泡机制，使用React实现的Event对象与原生Event对象不同。
- React通过队列的形式，从触发的组件向父组件回溯，然后调用他们JSX中定义的callback
- React通过对象池的形式管理合成事件对象的创建和销毁，减少了垃圾的生成和新对象内存的分配，提高了性能。






# React进阶
## State
React 是有多种模式的，基本平时用的都是 legacy 模式下的 React，除了`legacy` 模式，还有 `blocking` 模式和 `concurrent` 模式， blocking 可以视为 concurrent 的优雅降级版本和过渡版本，React 最终目的，现在以 concurrent 模式作为默认版本，这个模式下会开启一些新功能。

对于 concurrent 模式下，会采用不同 State 更新逻辑。
![](https://files.catbox.moe/0il3kv.png)

## Ref

### Ref的创建方式：createRef,**useRef**
`类组件——createRef`
```jsx
class Index extends React.Component{
    constructor(props){
       super(props)
       this.currentDom = React.createRef(null)
    }
    componentDidMount(){
        console.log(this.currentDom)
    }
    render= () => <div ref={ this.currentDom } >ref对象模式获取元素或组件</div>
}
```
createRef的原理
```js
export function createRef() {
  const refObject = {
    current: null,
  }
  return refObject;
}
```
`函数组件——useRef`
```jsx
export default function Index(){
    const currentDom = React.useRef(null)
    React.useEffect(()=>{
        console.log( currentDom.current ) // div
    },[])
    return  <div ref={ currentDom } >ref对象模式获取元素或组件</div>
}
```
createRef不可用于获取函数组件，因此现在更加推荐使用useRef
>原因：函数组件每次更新就是重新执行的结果，那么所有变量都会变化（除开使用useMemo，useCallback等钩子保存的），所以不能直接把ref对象直接暴露出去，如果这样每次函数组件执行都会重新声明Ref，ref就回随着组件执行被重置。
>如何解决呢？
>hooks 和函数组件对应的 fiber 对象建立起关联，将 useRef 产生的 ref 对象挂到函数组件对应的 fiber 上，函数组件每次执行，只要组件不被销毁，函数组件对应的 fiber 对象一直存在，所以 ref 等信息就会被保存下来。



### 获取Ref的三种方式
字符串、函数、对象

- 字符串（弃用）
```jsx
class Children extends Component{  
    render=()=><div>hello,world</div>
}
/* TODO:  Ref属性是一个字符串 */
export default class Index extends React.Component{
    componentDidMount(){
       console.log(this.refs)
    }
    render=()=> <div>
        <div ref="currentDom"  >字符串模式获取元素或组件</div>
        <Children ref="currentComInstance"  />
    </div>
}
```

这种情况因为没有一个引用可以直接访问只能通过this.refs来得到，所以针对于类组件而言
this.refs不能获取到函数组件

- 函数
```jsx
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}
/* TODO: Ref属性是一个函数 */
export default class Index extends React.Component{
    currentDom = null
    currentComponentInstance = null
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
        <div ref={(node)=> this.currentDom = node }  >Ref模式获取元素或组件</div>
        <Children ref={(node) => this.currentComponentInstance = node  }  />
    </div>
}
```

这个也是拿到组件实例或者DOM元素

- 对象
```jsx
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}
export default class Index extends React.Component{
    currentDom = React.createRef(null)
    currentComponentInstance = React.createRef(null)
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
         <div ref={ this.currentDom }  >Ref对象模式获取元素或组件</div>
        <Children ref={ this.currentComponentInstance }  />
   </div>
}
```

use等钩子要在函数组件使用才行。


### ref的高阶用法
#### forwardRef转发Ref
- 跨越组件传递ref
比如有父、子、孙，三个组件层层嵌套，父组件想要拿到孙组件的实例，这时候就需要React.forWardRef（一个高阶组件（Higher-Order Component, HOC），它允许你将一个父组件传递给一个函数组件的 ref。）
```jsx
class Father extends React.Component {
  constructor(props) {
    super(props)
  }
  grandSonRef = React.createRef()
  render(){
    return(
      <div>
        <NewSon ref={this.grandSonRef} />
      </div>
    )
  }
  componentDidMount(): void {
    console.log(this.grandSonRef.current)
  }
}

const NewSon = React.forwardRef((props,ref)=> <Son grandRef={ref} {...props}/>)
class Son extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div>
        <GrandSon grandRef={this.props.grandRef} />
      </div>
    )
  }
}

function GrandSon(props){
  const {grandRef} = props
  return (
    <div>
      <div>GrandSon</div>
      <span ref={grandRef}>想要获取的元素</span>
    </div>
  )
}

```

- 合并转发ref
通过 forwardRef 转发的 ref 不要理解为只能用来直接获取组件实例，DOM 元素，也可以用来传递合并之后的自定义的 ref 
```jsx
// 表单组件
class Form extends React.Component{
    render(){
       return <div>{...}</div>
    }
}
// index 组件
class Index extends React.Component{ 
    componentDidMount(){
        const { forwardRef } = this.props
        forwardRef.current={
            form:this.form,      // 给form组件实例 ，绑定给 ref form属性 
            index:this,          // 给index组件实例 ，绑定给 ref index属性 
            button:this.button,  // 给button dom 元素，绑定给 ref button属性 
        }
    }
    form = null
    button = null
    render(){
        return <div   > 
          <button ref={(button)=> this.button = button }  >点击</button>
          <Form  ref={(form) => this.form = form }  />  
      </div>
    }
}
const ForwardRefIndex = React.forwardRef(( props,ref )=><Index  {...props} forwardRef={ref}  />)
// home 组件
export default function Home(){
    const ref = useRef(null)
     useEffect(()=>{
         console.log(ref.current)
     },[])
    return <ForwardRefIndex ref={ref} />
}
```


- 高阶组件转发
如果高阶组件HOC没有处理ref，那么高阶组件本身就是一个新组件，标记的ref会指向高阶组件而非原始组件，可以通过forwardRef来解决。

```jsx
function HOC(Component){
  class Wrap extends React.Component{
     render(){
        const { forwardedRef ,...otherprops  } = this.props
        return <Component ref={forwardedRef}  {...otherprops}  />
     }
  }
  return  React.forwardRef((props,ref)=> <Wrap forwardedRef={ref} {...props} /> ) 
}
class Index extends React.Component{
  render(){
    return <div>hello,world</div>
  }
}
const HocIndex =  HOC(Index)
export default ()=>{
  const node = useRef(null)
  useEffect(()=>{
    console.log(node.current)  /* Index 组件实例  */ 
  },[])
  return <div><HocIndex ref={node}  /></div>
}
```

#### ref实现组件通信
- 类组件ref
```jsx
/* 子组件 */
class Son extends React.PureComponent{
    state={
       fatherMes:'',
       sonMes:''
    }
    fatherSay=(fatherMes)=> this.setState({ fatherMes  }) /* 提供给父组件的API */
    render(){
        const { fatherMes, sonMes } = this.state
        return <div className="sonbox" >
            <div className="title" >子组件</div>
            <p>父组件对我说：{ fatherMes }</p>
            <div className="label" >对父组件说</div> <input  onChange={(e)=>this.setState({ sonMes:e.target.value })}   className="input"  /> 
            <button className="searchbtn" onClick={ ()=> this.props.toFather(sonMes) }  >to father</button>
        </div>
    }
}
/* 父组件 */
export default function Father(){
    const [ sonMes , setSonMes ] = React.useState('') 
    const sonInstance = React.useRef(null) /* 用来获取子组件实例 */
    const [ fatherMes , setFatherMes ] = React.useState('')
    const toSon =()=> sonInstance.current.fatherSay(fatherMes) /* 调用子组件实例方法，改变子组件state */
    return <div className="box" >
        <div className="title" >父组件</div>
        <p>子组件对我说：{ sonMes }</p>
        <div className="label" >对子组件说</div> <input onChange={ (e) => setFatherMes(e.target.value) }  className="input"  /> 
        <button className="searchbtn"  onClick={toSon}  >to son</button>
        <Son ref={sonInstance} toFather={setSonMes} />
    </div>
}
```

	- 子组件暴露方法 fatherSay 供父组件使用，父组件通过调用方法可以设置子组件展示内容。
	* 父组件提供给子组件 toFather，子组件调用，改变父组件展示内容，实现父 <-> 子 双向通信。

- 函数组件forwardRef+useImperativeHandle
对于函数组件，本身是没有实例的，但是 React Hooks 提供了，useImperativeHandle 一方面第一个参数接受父组件传递的 ref 对象，另一方面第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。一起看一下 useImperativeHandle 的基本使用。

useImperativeHandle 接受三个参数：
* 第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
* 第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
* 第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。

![](https://files.catbox.moe/65rq1e.png)

```jsx
// 子组件
function Son (props,ref) {
    const inputRef = useRef(null)
    const [ inputValue , setInputValue ] = useState('')
    useImperativeHandle(ref,()=>{
       const handleRefs = {
           onFocus(){              /* 声明方法用于聚焦input框 */
              inputRef.current.focus()
           },
           onChangeValue(value){   /* 声明方法用于改变input的值 */
               setInputValue(value)
           }
       }
       return handleRefs
    },[])
    return <div>
        <input placeholder="请输入内容"  ref={inputRef}  value={inputValue} />
    </div>
}

const ForwarSon = forwardRef(Son)
// 父组件
class Index extends React.Component{
    cur = null
    handerClick(){
       const { onFocus , onChangeValue } =this.cur
       onFocus() // 让子组件的输入框获取焦点
       onChangeValue('let us learn React!') // 让子组件input  
    }
    render(){
        return <div style={{ marginTop:'50px' }} >
            <ForwarSon ref={cur => (this.cur = cur)} />
            <button onClick={this.handerClick.bind(this)} >操控子组件</button>
        </div>
    }
}
```


### ref原理
#### ref的执行时间和处理逻辑
但是对于 Ref 处理函数，React 底层用两个方法处理：**commitDetachRef**  和 **commitAttachRef**

commitDetachRef发生在DOM更新前
commitAttacRef发生在DOM更新后

第一阶段：一次更新中，在 commit 的 mutation 阶段, 执行commitDetachRef，commitDetachRef 会清空之前ref值，使其重置为 null。

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') { /* function 和 字符串获取方式。 */
      currentRef(null); 
    } else {   /* Ref对象获取方式 */
      currentRef.current = null;
    }
  }
}
```

第二阶段：DOM 更新阶段，这个阶段会根据不同的 effect 标签，真实的操作 DOM 。

第三阶段：layout 阶段，在更新真实元素节点之后，此时需要更新 ref 。
```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent: //元素节点 获取元素
        instanceToUse = getPublicInstance(instance);
        break;
      default:  // 类组件直接使用实例
        instanceToUse = instance;
    }
    if (typeof ref === 'function') {
      ref(instanceToUse);  //* function 和 字符串获取方式。 */
    } else {
      ref.current = instanceToUse; /* ref对象方式 */
    }
  }
}
```


commitDetachRef和commitAttachRef只有在ref更新的时候调用。
调用时机
```js
function commitMutationEffects(){
     if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
}
```
存在Ref同时为更新的时候调用
```js
function commitLayoutEffects(){
     if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }
}
```


Ref和markRef有关系
```js
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) ||      // 初始化的时候
    (current !== null && current.ref !== ref)  // ref 指向发生改变
  ) {
    workInProgress.effectTag |= Ref;
  }
}
```
`markRef` 会在以下两种情况下给 effectTag 标记 Ref，只有标记了 Ref tag 才会有后续的 `commitAttachRef` 和 `commitDetachRef` 流程。（ current 为当前调和的 fiber 节点 ）

* 第一种` current === null && ref !== null`：就是在 fiber 初始化的时候，第一次 ref 处理的时候，是一定要标记 Ref 的。
* 第二种` current !== null && current.ref !== ref`：就是 fiber 更新的时候，但是 ref 对象的指向变了。


包括初始化和ref指向改变（这里与markRef有关系）
所以这里容易出现问题
```jsx
export default class Index extends React.Component{
    state={ num:0 }
    node = null
    render(){
        return <div >
            <div ref={(node)=>{
               this.node = node
               console.log('此时的参数是什么：', this.node )
            }}  >ref元素节点</div>
            <button onClick={()=> this.setState({ num: this.state.num + 1  }) } >点击</button>
        </div>
    }
}
```

这里每次点击都会执行打印两次，分别对应commitDetachRef和commitAttachRef
因此每次点击更新state，导致组件更新，组件更新render函数重新调用，这里ref绑定的函数每次都不是相同的，因此ref执行改变了，所以打印两次。
稍微做做修改就不会出现两次打印
```jsx
export default class Index extends React.Component{
    state={ num:0 }
    node = null
    getDom= (node)=>{
        this.node = node
        console.log('此时的参数是什么：', this.node )
     }
    render(){
        return <div >
            <div ref={this.getDom}>ref元素节点</div>
            <button onClick={()=> this.setState({ num: this.state.num + 1  })} >点击</button>
        </div>
    }
}
```

![](https://files.catbox.moe/gwnaob.png)



## Context

出现背景：将状态集成到公共祖先组件上，通过 `props` 传递状态会非常繁琐。虽然 `Context` 简化了状态传递，但为了避免不必要的更新，仍需要使用 `memo` 等优化手段。
无论是否出现Context都会出现不必要的更新（没有采用优化手段的话）
### 旧版Context（了解
16.3之前是老版本的context，需要使用PropType来声明context类型
provider
```jsx
// 提供者
import propsTypes from 'proptypes'
class ProviderDemo extends React.Component{ 
    getChildContext(){
        const theme = { /* 提供者要提供的主题颜色，供消费者消费 */
            color:'#ccc',
            background:'pink'
        }
        return { theme }
    }
    render(){
        return <div>
            hello,let us learn React!
            <Son/>
        </div>
    }
 }

ProviderDemo.childContextTypes = {
    theme:propsTypes.object
}
```

consumer
```jsx
// 消费者
class ConsumerDemo extends React.Component{
   render(){
       console.log(this.context.theme) // {  color:'#ccc',  bgcolor:'pink' }
       const { color , background } = this.context.theme
       return <div style={{ color,background } } >消费者</div>
   }
}
ConsumerDemo.contextTypes = {
    theme:propsTypes.object
}

const Son = ()=> <ConsumerDemo/>
```

上述context使用繁琐且以来propsTypes等第三方库。
### 新版Context
16.3之后context api发布

创建
```js
const ThemeContext = React.createContext(null) //
const ThemeProvider = ThemeContext.Provider  //提供者
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者
```
provider
```jsx
const ThemeProvider = ThemeContext.Provider  //提供者
export default function ProviderDemo(){
    const [ contextValue , setContextValue ] = React.useState({  color:'#ccc', background:'pink' })
    return <div>
        <ThemeProvider value={ contextValue } > 
            <Son />
        </ThemeProvider>
    </div>
}
```

consumer由三种
1. 类组件——contextType方式
```jsx
const ThemeContext = React.createContext(null)
// 类组件 - contextType 方式
class ConsumerDemo extends React.Component{
   render(){
       const { color,background } = this.context
       return <div style={{ color,background } } >消费者</div> 
   }
}
ConsumerDemo.contextType = ThemeContext

const Son = ()=> <ConsumerDemo />
```
* 类组件的静态属性上的 contextType 属性，指向需要获取的 context（ demo 中的 ThemeContext ），就可以方便获取到最近一层 Provider 提供的 contextValue 值。
* 记住这种方式只适用于类组件。


2. 函数组件之useContext方式
```jsx
const ThemeContext = React.createContext(null)
// 函数组件 - useContext方式
function ConsumerDemo(){
    const  contextValue = React.useContext(ThemeContext) /*  */
    const { color,background } = contextValue
    return <div style={{ color,background } } >消费者</div> 
}
const Son = ()=> <ConsumerDemo />
```
useContext 接受一个参数，就是想要获取的 context ，返回一个 value 值，就是最近的 provider 提供 contextValue 值。


3. 订阅者——consumer方法
```jsx
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者

function ConsumerDemo(props){
    const { color,background } = props
    return <div style={{ color,background } } >消费者</div> 
}
const Son = () => (
    <ThemeConsumer>
       { /* 将 context 内容转化成 props  */ }
       { (contextValue)=> <ConsumerDemo  {...contextValue}  /> }
    </ThemeConsumer>
) 
```


#### 动态context
```jsx
function ConsumerDemo(){
     const { color,background } = React.useContext(ThemeContext)
    return <div style={{ color,background } } >消费者</div> 
}
const Son = React.memo(()=> <ConsumerDemo />) // 子组件

const ThemeProvider = ThemeContext.Provider //提供者
export default function ProviderDemo(){
    const [ contextValue , setContextValue ] = React.useState({  color:'#ccc', background:'pink' })
    return <div>
        <ThemeProvider value={ contextValue } >
            <Son />
        </ThemeProvider>
        <button onClick={ ()=> setContextValue({ color:'#fff' , background:'blue' })  } >切换主题</button>
    </div>
}
```


**Provder 的 value 改变，会使所有消费 value 的组件重新渲染**
**在 Provider 里 value 的改变，会使引用`contextType`,`useContext` 消费该 context 的组件重新 render ，同样会使 Consumer 的 children 函数重新执行，与前两种方式不同的是 Consumer 方式，当 context 内容改变的时候，不会让引用 Consumer 的父组件重新更新**
类似于上面son的render没有执行，执行的是ConsumerDemo的render方法。因为son是通过memo等方法处理了的


阻止Provider value改变造成的不必要渲染：
1. 利用memo，pureComponent对子组件props进行浅比较处理
```jsx
const Son = React.memo(()=> <ConsumerDemo />)  
```
2. 利用React 本身对 React element 对象的缓存。React 每次执行 render 都会调用 createElement 形成新的 React element 对象，如果把 React element 缓存下来，下一次调和更新时候，就会跳过该 React element 对应 fiber 的更新。
```jsx
<ThemeProvider value={ contextValue } >
    { React.useMemo(()=>  <Son /> ,[]) }
</ThemeProvider>
```


context对象可以接受一个displayName的property类型为字符串，可以让React DevTools使用该字符串来确定context要显示的内容。
```jsx
const MyContext = React.createContext(/* 初始化内容 */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
```


### Context高阶用法

嵌套：
```jsx
interface aProp{
  color:string
}
const aContext = React.createContext<aProp | null>(null)
const bContext = React.createContext<Boolean | null>(null)
const ProviderDemo = ()=>{
  const [A] = React.useState({color:'red'})
  const [B] = React.useState(false)
  return (
    <aContext.Provider value={A}>
      <bContext.Provider value={B}>
        <Son/>
      </bContext.Provider>
    </aContext.Provider>
  )
}
const Son = React.memo(()=><Consumer />)
const Consumer = ()=>{
  return (
    <aContext.Consumer>
      {
        (aValue)=>(
          <bContext.Consumer>
            {
              (bValue)=>{
                return (
                  <div>aValue:{JSON.stringify(aValue)},bValue:{JSON.stringify(bValue)}</div>
                )
              }
            }
          </bContext.Consumer>
        )
      }
    </aContext.Consumer>
  )
}

```

逐级传递：
Provider 还有一个良好的特性，就是可以逐层传递 context ，也就是一个 context 可以用多个 Provder 传递，下一层级的 Provder 会覆盖上一层级的 Provder 。

特点：
- 全局只有一个 ThemeContext ，两次用 provider 传递两个不同 context 。
* 组件获取 context 时候，会获取离当前组件最近的上一层 Provider 。
* 下一层的 provider 会覆盖上一层的 provider 。


## CSS in React

css模块化是一个重要的点，其作用：
- 防止全局污染、样式覆盖
- 命名错乱导致样式覆盖
- css代码冗余，体积庞大

css模块化有两种处理方式：
- css module让css由css-loader等处理
- css in js的写法，然后将style赋予React

### css module

配置
```js
{
	test:/\.css$/,
	use:[
		'css-loader?modules'
	]
}
```

然后使用：
css:
```css
.text{
	color:red;
}
```
js:
```jsx
import style from './style.css'
export default ()=> <div>
    <div className={ style.text } >验证 css modules </div>
</div>
```

这里的类名会生成一个类似于hash的全局唯一类名以防止样式冲突。


这里也可以自定义命名
```js
{
     test: /\.css$/,/* 对于 css 文件的处理 */
     use:[
        {
            loader: 'css-loader',
            options:{
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]", /* 命名规则  [path][name]__[local] 开发环境 - 便于调试   */
              },
            }
        },
     ],
}
```
这样配置。

一旦经过 css modules 处理的 css 文件类名 ，再引用的时候就已经无效了。
因此可以设置全局类名：`:global(.className)`的语法 ，声明一个全局类名
```css
.text{
    color: blue;
}
:global(.text_bg) {
    background-color: pink;
}
```

```js
import style from './style.css'
export default ()=><div>
    <div className={ style.text + ' text_bg'} >验证 CSS Modules </div>
</div>
```

组合样式
CSS Module提供`composes`组合方式实现样式的复用
```css
.base{ /* 基础样式 */
    color: blue;
}
.text { /* 继承基础样式 ，增加额外的样式 backgroundColor */
    composes:base;
    background-color: pink;
}
```

### css in JS

`CSS IN JS` 相比 CSS Modules 更加简单， CSS IN JS 放弃css ，用 js 对象形式直接写 style 
比如
```jsx
import React from 'react'
import Style from './style'

export default function Index(){
    return <div  style={ Style.boxStyle }  >
        <span style={ Style.textStyle }  >hi , i am CSS IN JS!</span>
    </div>
}
```

style.js
```js
/* 容器的背景颜色 */
const boxStyle = {
    backgroundColor:'blue',
}
/* 字体颜色 */
const textStyle = {
    color:'orange'
}

export default {
    boxStyle,
    textStyle
}
```
可以使用拓展运算符实现样式的继承

styled-component 基于props属性来动态添加样式
```js
const Button = styled.button`
    background: ${ props => props.theme ? props.theme : '#6a8bad'  };
    color: #fff;
    min-width: 96px;
    height :36px;
    border :none;
    border-radius: 18px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-left: 20px !important;
`
export default function Index(){
    return <div>
        <Button theme={'#fc4838'}  >props主题按钮</Button>
    </div>
}
```

styled-component可以通过几成功的方式来达到样式的复用
```js
const NewButton = styled(Button)`
    background: orange;
    color: pink;
`
export default function Index(){
    return <div>
       <NewButton > 继承按钮</NewButton>
    </div>
}
```

CSS IN JS 特点。

*  CSS IN JS 本质上放弃了 css ，变成了 css in line 形式，所以根本上解决了全局污染，样式混乱等问题。
* 运用起来灵活，可以运用 js 特性，更灵活地实现样式继承，动态添加样式等场景。
* 由于编译器对 js 模块化支持度更高，使得可以在项目中更快地找到 style.js 样式文件，以及快捷引入文件中的样式常量。
* 无须 webpack 额外配置 css，less 等文件类型。


## 高阶组件HOC
高阶组件出现的背景：

在不修改现有组件基础上，对组件进行重新设计，HOC的产生根本作用就是解决大量的代码复用，逻辑复用问题。
比如： `react-keepalive-router`，可以缓存页面，项目中的 keepaliveLifeCycle 就是通过 HOC 方式，给业务组件增加了额外的生命周期。

高阶组件真的很好理解，都知道高阶函数就是一个将函数作为参数并且返回值也是函数的函数。高阶组件是以组件作为参数，返回组件的函数。返回的组件把传进去的组件进行功能强化。

高阶组件的种类：
**属性代理和反向继承**
- 属性代理: 就是用组件包裹一层代理组件，在代理组件上，可以做一些，对源组件的强化操作。这里注意属性代理返回的是一个新组件，被包裹的原始组件，将在新的组件里被挂载。
```jsx
function HOC(WrapComponent){
    return class Advance extends React.Component{
       state={
           name:'alien'
       }
       render(){
           return <WrapComponent  { ...this.props } { ...this.state }  />
       }
    }
}
```
优点：
* ① 属性代理可以和业务组件低耦合，零耦合，对于条件渲染和 props 属性增强，只负责控制子组件渲染和传递额外的 props 就可以了，所以无须知道，业务组件做了些什么。所以正向属性代理，更适合做一些开源项目的 HOC ，目前开源的 HOC 基本都是通过这个模式实现的。
* ② 同样适用于类组件和函数组件。
* ③ 可以完全隔离业务组件的渲染，因为属性代理说白了是一个新的组件，相比反向继承，可以完全控制业务组件是否渲染。
* ④ 可以嵌套使用，多个 HOC 是可以嵌套使用的，而且一般不会限制包装 HOC 的先后顺序。

缺点：
* ① 一般无法直接获取原始组件的状态，如果想要获取，需要 ref 获取组件实例。
* ② 无法直接继承静态属性。如果需要继承需要手动处理，或者引入第三方库。
* ③ 因为本质上是产生了一个新组件，所以需要配合 forwardRef 来转发 ref。


- 反向继承：反向继承和属性代理有一定的区别，在于包装后的组件继承了原始组件本身，所以此时无须再去挂载业务组件。
```jsx
class Index extends React.Component{
  render(){
    return <div> hello,world  </div>
  }
}
function HOC(Component){
    return class wrapComponent extends Component{ /* 直接继承需要包装的组件 */
        
    }
}
export default HOC(Index) 
```

优点：
* ① 方便获取组件内部状态，比如 state ，props ，生命周期，绑定的事件函数等。
* ② es6继承可以良好继承静态属性。所以无须对静态属性和方法进行额外的处理。

缺点：
* ① 函数组件无法使用。
* ② 和被包装的组件耦合度高，需要知道被包装的原始组件的内部状态，具体做了些什么？
* ③ 如果多个反向继承 HOC 嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个 componentDidMount ，当前 componentDidMount 会覆盖上一个 componentDidMount 。这样副作用串联起来，影响很大。

高阶组件的功能：

1. 强化props
```jsx
function withRouter(Component) {
  const displayName = `withRouter(${Component.displayName || Component.name})`;
  const C = props => {
      /*  获取 */
    const { wrappedComponentRef, ...remainingProps } = props;
    return (
      <RouterContext.Consumer>
        {context => {
          return (
            <Component
              {...remainingProps} // 组件原始的props 
              {...context}        // 存在路由对象的上下文，history  location 等 
              ref={wrappedComponentRef}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;
  /* 继承静态属性 */
  return hoistStatics(C, Component);
}
export default withRouter
```
- 分离出 props 中 wrappedComponentRef 和 remainingProps ， remainingProps 是原始组件真正的 props， wrappedComponentRef 用于转发 ref。
* 用 Context.Consumer 上下文模式获取保存的路由信息。（ React Router 中路由状态是通过 context 上下文保存传递的）
* 将路由对象和原始 props 传递给原始组件，所以可以在原始组件中获取 history ，location 等信息。


2. 控制渲染
```jsx
const HOC = (WrapComponent) =>
  class Index  extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>暂无数据</div>
      }
    }
  }
```


动态加载：
```jsx
export default function dynamicHoc(loadRouter) {
  return class Content extends React.Component {
    state = {Component: null}
    componentDidMount() {
      if (this.state.Component) return
      loadRouter()
        .then(module => module.default) // 动态加载 component 组件
        .then(Component => this.setState({Component},
         ))
    }
    render() {
      const {Component} = this.state
      return Component ? <Component {
      ...this.props
      }
      /> : <Loading />
    }
  }
}
const Index = AsyncRouter(()=>import('../pages/index'))
```


3. 组件赋能：
ref获取实例
类组件才存在实例，函数组件不存在实例。
```jsx
function Hoc(Component){
  return class WrapComponent extends React.Component{
      constructor(){
        super()
        this.node = null /* 获取实例，可以做一些其他的操作。 */
      }
      render(){
        return <Component {...this.props}  ref={(node) => this.node = node }  />
      }
  }
}
```

事件监控：
HOC 不一定非要对组件本身做些什么？也可以单纯增加一些事件监听，错误监控。接下来，接下来做一个 `HOC` ，只对组件内的点击事件做一个监听效果。

```jsx
function ClickHoc (Component){
  return  function Wrap(props){
    const dom = useRef(null)
    useEffect(()=>{
       const handerClick = () => console.log('发生点击事件') 
       dom.current.addEventListener('click',handerClick)
     return () => dom.current.removeEventListener('click',handerClick)
    },[])
    return  <div ref={dom}  ><Component  {...props} /></div>
  }
}

@ClickHoc
class Index extends React.Component{
   render(){
     return <div className='index'  >
       <p>hello，world</p>
       <button>组件内部点击</button>
    </div>
   }
}
export default ()=>{
  return <div className='box'  >
     <Index />
     <button>组件外部点击</button>
  </div>
}
```


## React渲染优化

### React渲染
React提供了一系列api来帮助优化：PureComponent,shouldComponentUpdate,memo等。

render阶段的作用：根据一次更新中产生的新状态值，通过 React.createElement ，替换成新的状态，得到新的 React element 对象，新的 element 对象上，保存了最新状态值。

接下来，React 会调和由 render 函数产生 chidlren，将子代 element 变成  fiber（这个过程如果存在 alternate，会复用 alternate 进行克隆，如果没有 alternate ，那么将创建一个），将 props 变成 pendingProps ，至此当前组件更新完毕。然后如果 children 是组件，会继续重复上一步，直到全部 fiber 调和完毕。完成 render 阶段。

### 控制render
React控制render的方法：
- 第一种：父组件来隔断子组件的渲染，比如memo，缓存 element 对象
- 第二种：组件自身来控制是否render，比如PureComponent，shouldComponentUpdate

#### **缓存element对象**
```jsx
/* 子组件 */
function Children ({ number }){
    console.log('子组件渲染')
    return <div>let us learn React!  { number } </div>
}
/* 父组件 */
export default class Index extends React.Component{
    state={
        numberA:0,
        numberB:0,
    }
    render(){
        return <div>
            <Children number={ this.state.numberA } />
           <button onClick={ ()=> this.setState({ numberA:this.state.numberA + 1 }) } >改变numberA -{ this.state.numberA } </button>
           <button onClick={ ()=> this.setState({ numberB:this.state.numberB + 1 }) } >改变numberB -{ this.state.numberB }</button>
        </div>
     }

}
```

这里Children依赖的是numberA但是更新numberB之后，Index都会重新渲染，导致子组件重新渲染。
>默认情况下只要父组件的状态或 props 发生变化，导致父组件重新渲染，那么无论子组件的 props 是否实际发生了变化，子组件都会跟随父组件一起重新渲染。
```jsx
export default class Index extends React.Component{
    constructor(props){
        super(props)
        this.state={
            numberA:0,
            numberB:0,
        }
        this.component =  <Children number={this.state.numberA} />
    }
    controllComponentRender=()=>{ /* 通过此函数判断 */
        const { props } = this.component
        if(props.number !== this.state.numberA ){ /* 只有 numberA 变化的时候，重新创建 element 对象  */
            return this.component = React.cloneElement(this.component,{ number:this.state.numberA })
        }
        return this.component
    }
    render(){
       return <div>
          { this.controllComponentRender()  } 
          <button onClick={ ()=> this.setState({ numberA:this.state.numberA + 1 }) } >改变numberA</button>
          <button onClick={ ()=> this.setState({ numberB:this.state.numberB + 1 }) }  >改变numberB</button>
       </div>
    }
}
```

推荐下面的写法
```jsx
export default function Index(){
    const [ numberA , setNumberA ] = React.useState(0)
    const [ numberB , setNumberB ] = React.useState(0)
    return <div>
        { useMemo(()=> <Children number={numberA} />,[ numberA ]) }
        <button onClick={ ()=> setNumberA(numberA + 1) } >改变numberA</button>
        <button onClick={ ()=> setNumberB(numberB + 1) } >改变numberB</button>
    </div>
}
```

useMemo的**原理**：
useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。

使用场景
* 可以缓存 element 对象，从而达到按条件渲染组件，优化性能的作用。
* 如果组件中不期望每次 render 都重新计算一些值,可以利用 useMemo 把它缓存起来。
* 可以把函数和属性缓存起来，作为 PureComponent 的绑定方法，或者配合其他Hooks一起使用。

#### **PureComponent**

纯组件是一种发自组件本身的渲染优化策略，当开发类组件选择了继承 PureComponent ，就意味这要遵循其渲染规则。规则就是**浅比较 state 和 props 是否相等**。
```jsx
/* 纯组件本身 */
class Children extends React.PureComponent{
    state={
        name:'alien',
        age:18,
        obj:{
            number:1,
        }
    }
    changeObjNumber=()=>{
        const { obj } = this.state
        obj.number++
        this.setState({ obj })
    }
    render(){
        console.log('组件渲染')
        return <div  >
           <div> 组件本身改变state </div>
           <button onClick={() => this.setState({ name:'alien' }) } >state相同情况</button>
           <button onClick={() => this.setState({ age:this.state.age + 1  }) }>state不同情况</button>
           <button onClick={ this.changeObjNumber } >state为引用数据类型时候</button>
           <div>hello,my name is alien,let us learn React!</div>
        </div>
    }
}
/* 父组件 */
export default function Home (){
    const [ numberA , setNumberA ] = React.useState(0)
    const [ numberB , setNumberB ] = React.useState(0)
    return <div>
        <div> 父组件改变props </div>
        <button onClick={ ()=> setNumberA(numberA + 1) } >改变numberA</button>
        <button onClick={ ()=> setNumberB(numberB + 1) } >改变numberB</button>
        <Children number={numberA}  /> 
    </div>
}
```

- 对于 props ，PureComponent 会浅比较 props 是否发生改变，再决定是否渲染组件，所以只有点击 numberA 才会促使组件重新渲染。
* 对于 state ，如上也会浅比较处理，当上述触发 ‘ state 相同情况’ 按钮时，组件没有渲染。
* 浅比较只会比较基础数据类型，对于引用类型，比如 demo 中 state 的 obj ，单纯的改变 obj 下属性是不会促使组件更新的，因为浅比较两次 obj 还是指向同一个内存空间，想要解决这个问题也容易，浅拷贝就可以解决，将如上 changeObjNumber 这么修改。这样就是重新创建了一个 obj ，所以浅比较会不相等，组件就会更新了。

**原理**：
当继承PureComponent后，`pureComponentPrototype.isPureReactComponent = true;`
```js
function checkShouldComponentUpdate(){
     if (typeof instance.shouldComponentUpdate === 'function') {
         return instance.shouldComponentUpdate(newProps,newState,nextContext)  /* shouldComponentUpdate 逻辑 */
     } 
    if (ctor.prototype && ctor.prototype.isPureReactComponent) {
        return  !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    }
}
```

- isPureReactComponent 就是判断当前组件是不是纯组件的，如果是 PureComponent 会浅比较 props 和 state 是否相等。
* 还有一点值得注意的就是 shouldComponentUpdate 的权重，会大于 PureComponent。

shallowEqual浅比较流程
* 第一步，首先会直接比较新老 props 或者新老 state 是否相等。如果相等那么不更新组件。
* 第二步，判断新老 state 或者 props ，有不是对象或者为 null 的，那么直接返回 false ，更新组件。
* 第三步，通过 Object.keys 将新老 props 或者新老 state 的属性名 key 变成数组，判断数组的长度是否相等，如果不相等，证明有属性增加或者减少，那么更新组件。
* 第四步，遍历老 props 或者老 state ，判断对应的新 props 或新 state ，有没有与之对应并且相等的（这个相等是浅比较），如果有一个不对应或者不相等，那么直接返回 false ，更新组件。

注意事项：
1. 避免使用箭头函数：render避免使用箭头函数
不要给是 PureComponent 子组件绑定箭头函数，因为父组件每一次 render ，如果是箭头函数绑定的话，都会重新生成一个新的箭头函数 ， PureComponent 对比新老 props 时候，因为是新的函数，所以会判断不相等，而让组件直接渲染，PureComponent 作用终会失效。

2. PureComponent 的父组件是函数组件的情况，绑定函数要用 useCallback 或者 useMemo 处理。
```jsx

class Index extends React.PureComponent{}
export default function (){
    const callback = React.useCallback(function handerCallback(){},[])
    return <Index callback={callback}  />
}
```


#### shouldComponentUpdate
```jsx
class Index extends React.Component{ //子组件
    state={
        stateNumA:0,
        stateNumB:0
    }
    shouldComponentUpdate(newProp,newState,newContext){
        if(newProp.propsNumA !== this.props.propsNumA || newState.stateNumA !== this.state.stateNumA ){
            return true /* 只有当 props 中 propsNumA 和 state 中 stateNumA 变化时，更新组件  */
        }
        return false 
    }
    render(){
        console.log('组件渲染')
        const { stateNumA ,stateNumB } = this.state
        return <div>
            <button onClick={ ()=> this.setState({ stateNumA: stateNumA + 1 }) } >改变state中numA</button>
            <button onClick={ ()=> this.setState({ stateNumB: stateNumB + 1 }) } >改变stata中numB</button>
            <div>hello,let us learn React!</div>
        </div>
    }
}
export default function Home(){ // 父组件
    const [ numberA , setNumberA ] = React.useState(0)
    const [ numberB , setNumberB ] = React.useState(0)
    return <div>
        <button onClick={ ()=> setNumberA(numberA + 1) } >改变props中numA</button>
        <button onClick={ ()=> setNumberB(numberB + 1) } >改变props中numB</button>
        <Index propsNumA={numberA}  propsNumB={numberB}   />
    </div>
}
```

`immutable.js` 可以解决此问题，immutable.js 不可变的状态，对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。鉴于这个功能，所以可以把需要对比的 props 或者 state 数据变成 Immutable 对象，通过对比 Immutable 是否相等，来证明状态是否改变，从而确定是否更新组件。


#### React.memo
```js
React.memo(Component,compare);
```
- React.memo 接受两个参数，第一个参数 Component 原始组件本身，第二个参数 compare 是一个函数，可以根据一次更新中 props 是否相同决定原始组件是否重新渲染。
- compare**返回True不重新渲染**，但是返回False会重新渲染。
- memo 当二个参数 compare 不存在时，会用**浅比较原则**处理 props ，相当于仅比较 props 版本的 pureComponent 。
被 memo 包裹的组件，element 会被打成 `REACT_MEMO_TYPE` 类型的 element 标签，在 element 变成 fiber 的时候， fiber 会被标记成 MemoComponent 的类型。

memo
- 通过 memo 第二个参数，判断是否执行更新，如果没有那么第二个参数，那么以浅比较 props 为 diff 规则。如果相等，当前 fiber 完成工作，停止向下调和节点，所以被包裹的组件即将不更新。
* memo 可以理解为包了一层的高阶组件，它的阻断更新机制，是通过控制下一级 children ，也就是 memo 包装的组件，是否继续调和渲染，来达到目的的。


#### 打破渲染限制
1. forceUpdate。类组件更新调用个这个的话，会**跳过**PureComponent的浅比较和shouldComponentUpdate的自定义比较、
2. Context穿透，以上方法不能阻断你context改变带来的渲染穿透（也就是这些阻碍手段如果使用在消费了context的组件上不奏效）

![](https://files.catbox.moe/u132qs.png)


正常开发时无需在意React是否存在**没有必要的渲染**。
但是有些情况需要注意：
1. 数据可视化模块组件（含有大量的数据），一次diff可能消耗的性能比较大，可以使用memo，shouldComponentUpdate等方案控制自身组件渲染。
2. 含有大量表单的页面，React 一般会采用受控组件的模式去管理表单数据层，表单数据层完全托管于 props 或是 state ，而用户操作表单往往是频繁的，需要频繁改变数据层，所以很有可能让整个页面组件高频率 render 。
3. 第三种情况就是越是靠近 app root 根组件越值得注意，根组件渲染会波及到整个组件树重新 render ，子组件 render ，一是浪费性能，二是可能执行 useEffect ，componentWillReceiveProps 等钩子，造成意想不到的情况发生。（往往靠近根且集成了大量状态的组件需要使用优化手段优化，否则容易造成大量的组件渲染）



细节：
- 开发过程中对于大量数据展示的模块，开发者有必要用 shouldComponentUpdate ，PureComponent来优化性能。
* 对于表单控件，最好办法单独抽离组件，独自管理自己的数据层，这样可以让 state 改变，波及的范围更小。
* 如果需要更精致化渲染，可以配合 immutable.js 。
* 组件颗粒化，配合 memo 等 api ，可以制定私有化的渲染空间。



## React渲染——懒加载

### 懒加载和异步渲染
#### 异步渲染
Suspense是React提出的一种通过不代码实现异步操作的方案。
```jsx
// 子组件
function UserInfo() {
  // 获取用户数据信息，然后再渲染组件。
  const user = getUserInfo();
  return <h1>{user.name}</h1>;
}
// 父组件
export default function Index(){
    return <Suspense fallback={<h1>Loading...</h1>}>
        <UserInfo/>
    </Suspense>
}
```
Suspense 包裹异步渲染组件 UserInfo ，当 UserInfo 处于数据加载状态下，展示 Suspense 中 fallback 的内容。
传统模式：挂载组件-> 请求数据 -> 再渲染组件。  
异步模式：请求数据-> 渲染组件。

那么异步渲染相比传统数据交互相比好处就是：
* 不再需要 componentDidMount 或 useEffect 配合做数据交互，也不会因为数据交互后，改变 state 而产生的二次更新作用。
* 代码逻辑更简单，清晰。

#### 动态加载（懒加载）
React.lazy

Suspense和React.lazy可以实现动态加载的功能
```jsx
const LazyComponent = React.lazy(()=>import('./text'))
```

React.lazy需要传入一个函数，这个函数需要动态调用import()，且需要返回一个Promise，该Promsie需要resolve一个default export的React组件
```jsx
const LazyComponent = React.lazy(() => import('./test.js'))

export default function Index(){
   return <Suspense fallback={<div>loading...</div>} >
       <LazyComponent />
   </Suspense>
}
```

React.lazy和Suspense的原理

整个 render 过程都是同步执行一气呵成的，但是在 Suspense 异步组件情况下允许**调用 Render => 发现异步请求 => 悬停，等待异步请求完毕 => 再次渲染展示数据**。

Suspense 在执行内部可以通过 `try{}catch{}` 方式捕获异常，这个异常通常是一个 `Promise` ，可以在这个 Promise 中进行数据请求工作，Suspense 内部会处理这个 Promise ，Promise 结束后，Suspense 会再一次重新 render 把数据渲染出来，达到异步渲染的效果。
![](https://files.catbox.moe/8myuba.png)


React.lazy原理
lazy 内部模拟一个 promiseA 规范场景。完全可以理解 React.lazy 用 Promise 模拟了一个请求数据的过程，但是请求的结果不是数据，而是一个动态的组件。下一次渲染就直接渲染这个组件，所以是 React.lazy 利用 Suspense **接收 Promise ，执行 Promise ，然后再渲染**这个特性做到动态加载的。

```jsx
function lazy(ctor){
    return {
         $$typeof: REACT_LAZY_TYPE,
         _payload:{
            _status: -1,  //初始化状态
            _result: ctor,
         },
         _init:function(payload){
             if(payload._status===-1){ /* 第一次执行会走这里  */
                const ctor = payload._result;
                const thenable = ctor();
                payload._status = Pending;
                payload._result = thenable;
                thenable.then((moduleObject)=>{
                    const defaultExport = moduleObject.default;
                    resolved._status = Resolved; // 1 成功状态
                    resolved._result = defaultExport;/* defaultExport 为我们动态加载的组件本身  */ 
                })
             }
            if(payload._status === Resolved){ // 成功状态
                return payload._result;
            }
            else {  //第一次会抛出Promise异常给Suspense
                throw payload._result; 
            }
         }
    }
}
```
当组件加载好了之后Promise状态变化，调用then方法。
- 第一次渲染首先会执行 init 方法，里面会执行 lazy 的第一个函数，得到一个Promise，绑定 Promise.then 成功回调，回调里得到将要渲染组件 `defaultExport` ，这里要注意的是，如上面的函数当第二个 if 判断的时候，因为此时状态不是 Resolved ，所以会走 else ，抛出异常 Promise，抛出异常会让当前渲染终止。

* 这个异常 Promise 会被 Suspense 捕获到，Suspense 会处理 Promise ，Promise 执行成功回调得到 defaultExport（将想要渲染组件），然后 Susponse 发起第二次渲染，第二次 init 方法已经是 Resolved 成功状态，那么直接返回 result 也就是真正渲染的组件。这时候就可以正常渲染组件了。


### 渲染错误边界
```jsx
function ErrorTest(){
    return 
}
function Test(){
    return <div>let us learn React!</div>
}

 class Index extends React.Component{ 
    componentDidCatch(...arg){
       console.log(arg)
    }
   render(){  
      return <div>
          <ErrorTest />
          <div> hello, my name is alien! </div>
          <Test />
      </div>
   }
}
```

ErrorTest不是一个组件，但是错误的被当做一个组件使用导致出现渲染错误。
为了防止如上的渲染异常情况 React 增加了 `componentDidCatch` 和 `static getDerivedStateFromError()` 两个额外的生命周期，去挽救由于渲染阶段出现问题造成 UI 界面无法显示的情况。

#### ComponentDidCatch
接受两个参数
1. error——抛出的错误
2. info，带有componentStack key的对象，其中包含有关组件引发错误的栈信息。
那么 componentDidCatch 中可以再次触发 setState，来降级UI渲染，componentDidCatch() 会在commit阶段被调用，因此允许执行副作用。
```js
 class Index extends React.Component{
   state={
       hasError:false
   }  
   componentDidCatch(...arg){
       uploadErrorLog(arg)  /* 上传错误日志 */
       this.setState({  /* 降级UI */
           hasError:true
       })
   }
   render(){  
      const { hasError } =this.state
      return <div>
          {  hasError ? <div>组件出现错误</div> : <ErrorTest />  }
          <div> hello, my name is alien! </div>
          <Test />
      </div>
   }
}
```

componentDIdCatch作用：
- 调用setState促使组件渲染，并做一些错误拦截的功能
- 监控组件，发身错误，上报错误日志。

#### static getDerivedStateFromError
React更期望用 getDerivedStateFromError 代替 componentDidCatch 用于处理渲染异常的情况。getDerivedStateFromError 是静态方法，内部不能调用 setState。getDerivedStateFromError 返回的值可以合并到 state，作为渲染使用。
```js
 class Index extends React.Component{
   state={
       hasError:false
   }  
   static getDerivedStateFromError(){
       return { hasError:true }
   }
   render(){  
      /* 如上 */
   }
}
```


### diff过程——key作用
和Vue的类似，复用、删除、新增、移位、
1. 遍历新children，复用oldFiber
```js
function reconcileChildrenArray(){
    /* 第一步  */
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {  
        if (oldFiber.index > newIdx) {
            nextOldFiber = oldFiber;
            oldFiber = null;
        } else {
            nextOldFiber = oldFiber.sibling;
        }
        const newFiber = updateSlot(returnFiber,oldFiber,newChildren[newIdx],expirationTime,);
        if (newFiber === null) { break }
        // ..一些其他逻辑
        }  
        if (shouldTrackSideEffects) {  // shouldTrackSideEffects 为更新流程。
            if (oldFiber && newFiber.alternate === null) { /* 找到了与新节点对应的fiber，但是不能复用，那么直接删除老节点 */
                deleteChild(returnFiber, oldFiber);
            }
        }
    }
}
```

- 第一步对于 React.createElement 产生新的 child 组成的数组，首先会遍历数组，因为 fiber 对于同一级兄弟节点是用 sibling 指针指向，所以在遍历children 遍历，sibling 指针同时移动，找到与 child 对应的 oldFiber 。
* 然后通过调用 updateSlot ，updateSlot 内部会判断当前的 tag 和 key 是否匹配，如果匹配复用老 fiber 形成新的 fiber ，如果不匹配，返回 null ，此时 newFiber 等于 null 。
* 如果是处于更新流程，找到与新节点对应的老 fiber ，但是不能复用 `alternate === null `，那么会删除老 fiber 。

2. 统一删除oldfiber
```js
if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
}
```
新节点的长度已经达到，需要删除多余的节点
比如：情况一：节点删除
* **oldChild: A B C D**
* **newChild: A B**
A , B 经过第一步遍历复制完成，那么 newChild 遍历完成，此时 C D 已经没有用了，那么统一删除 C D。

3. 统一创建newFiber
```js
if(oldFiber === null){
   for (; newIdx < newChildren.length; newIdx++) {
       const newFiber = createChild(returnFiber,newChildren[newIdx],expirationTime,)
       // ...
   }
}
```

新节点的个数少于老节点，需要新增节点
比如：情况二：节点增加
* **oldChild: A B**
* **newChild: A B C D**
A B 经过第一步遍历复制完，oldFiber 没有可以复用的了，那么直接创建 C D。

4. 针对发生移动等复杂情况
```js
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = updateFromMap(existingChildren,returnFiber)
    /* 从mapRemainingChildren删掉已经复用oldFiber */
}
```
- mapRemainingChildren 返回一个 map ，map 里存放剩余的老的 fiber 和对应的 key (或 index )的映射关系。
* 接下来遍历剩下没有处理的 Children ，通过 updateFromMap ，判断 mapRemainingChildren 中有没有可以复用 oldFiber ，如果有，那么复用，如果没有，新创建一个 newFiber 。
* 复用的 oldFiber 会从 mapRemainingChildren 删掉。

比如：情况三：节点位置改变
* **oldChild: A B C D**
* **newChild: A B D C**
如上 A B 在第一步被有效复用，第二步和第三步不符合，直接进行第四步，C D 被完全复用，existingChildren 为空。


5. 删除掉没有复用的FIber
```js
if (shouldTrackSideEffects) {
    /* 移除没有复用到的oldFiber */
    existingChildren.forEach(child => deleteChild(returnFiber, child));
}
```

比如：最后一步，对于没有复用的 oldFiber ，统一删除处理。

情况四：复杂情况(删除 + 新增 + 移动)  
* **oldChild: A B C D**
* **newChild: A E D B** 

首先 A 节点，在第一步被复用，接下来直接到第四步，遍历 newChild ，E被创建，D B 从 existingChildren 中被复用，existingChildren 还剩一个 C 在第五步会删除 C ，完成整个流程。

React的key最好是唯一标识，否则不能得到有效的复用


```jsx
function AsyncComponent(Component:React.ComponentType,api:()=>Promise<any>){
    const AsyncComponentPromise = ():Promise<any> => new Promise(async (resolve)=>{
        const data = await api()
        resolve({
            default: (props)=> <Component data={data} {...props}/>
        })
    })
    return React.lazy(AsyncComponentPromise)
}

const TestDemo = ({data,age})=>{
    const {name,say} = data
    console.log('子组件渲染11111')
    return <div>
        <h1>hello,world,my name is {name}</h1>
        <p>age:{age}</p>
        <p>say:{say}</p>
    </div>
}
const getData = ()=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                name:'zhangsan',
                say:'React SSR'
            })
        },1000)
    })
}
const IndexAsync = ()=>{
    const LazyTest = AsyncComponent(TestDemo,getData) // 放在父组件里面是为了确保，父组件每一次挂在都要重新请求数据。
    return <div>
        <React.Suspense>
            <LazyTest age={20} />
        </React.Suspense>
    </div>
}
```



## React中大量数据的处理方案（实践）

### 时间分片
一次渲染大量数据容易造成卡顿现象。
**浏览器执行js速度要比渲染DOM速度快很多**
时间分片是将一个问题分为多次执行的一种方案。

比如这里要渲染20000个DOM节点：
```jsx
import React,{useState} from "react"
import './App.css'
class Index extends React.Component{
    state={
        dataList:[],                  // 数据源列表
        renderList:[],                // 渲染列表
        position:{ width:0,height:0 } // 位置信息
    }
    box = React.createRef()
    componentDidMount(){
        const { offsetHeight , offsetWidth } = this.box.current
        const originList = new Array(20000).fill(1)
        this.setState({
            position: { height:offsetHeight,width:offsetWidth },
            dataList:originList,
            renderList:originList,
        })
    }
    render(){
        const { renderList, position } = this.state
        console.log('position',position,'renderList',renderList)
        return <div className="bigData_index" ref={this.box}  >
            {
                renderList.map((item,index)=><Circle  position={ position } key={index}  /> )
            }
            111
        </div>
    }
}
/* 控制展示Index */
export default ()=>{
    const [show, setShow] = useState(false)
    const [ btnShow, setBtnShow ] = useState(true)
    const handleClick=()=>{
        setBtnShow(false)
        setTimeout(()=>{ setShow(true) },[])
    } 
    return <>
        { btnShow &&  <button onClick={handleClick} >show</button> } 
        { show && <Index />  }
    </>
}
/* 获取随机颜色 */
function getColor(){
    const r = Math.floor(Math.random()*255);
    const g = Math.floor(Math.random()*255);
    const b = Math.floor(Math.random()*255);
    return 'rgba('+ r +','+ g +','+ b +',0.8)';
 }
/* 获取随机位置 */
function getPostion(position){
     const { width , height } = position
     return { left: Math.ceil( Math.random() * width ) + 'px',top: Math.ceil(  Math.random() * height ) + 'px'}
}
/* 色块组件 */
function Circle({ position }){
    const style = React.useMemo(()=>{ //用useMemo缓存，计算出来的随机位置和色值。
         return {  
            background : getColor(),
            ...getPostion(position)
         }
    },[])
    return <div style={style} className="circle" />
}
```

app.css
```css

*{
  padding: 0;
  margin: 0;
}


.circle {
  width: 4px;
  height: 4px;
  position: absolute;
}
.bigData_index{
  width: 100vw;
  height: 100vh;
  position: relative;
}
```

这里点击show按钮之后，会有一段时间的卡顿。这就是一次性执行大量的DOM渲染导致的。
这里可以将时间分片采用：`requestIdCallback `或者`requestAnimation`这俩个API来优化


### 虚拟列表
![](https://files.catbox.moe/oeuumb.png)
虚拟区：是用户看不见的区域（除开缓冲区），不需要渲染DOM
缓冲区：即将看到的区域，防止滑动造成的白屏
视图区：用户能直接看到的列表区

实现思路：
- 通过useRef获取元素，缓存变量.
- useEffect初始化计算容器的高度。截取初始化列表长度。这里需要 div 占位，撑起滚动条。
* 通过监听滚动容器的 onScroll 事件，根据 scrollTop 来计算渲染区域向上偏移量, 这里需要注意的是，当用户向下滑动的时候，为了渲染区域，能在可视区域内，可视区域要向上滚动；当用户向上滑动的时候，可视区域要向下滚动。
* 通过重新计算 end 和 start 来重新渲染列表。

```jsx
import React from 'react'
import './App.css'
function App() {
  return (
    <div>
        <VirtualList />
    </div>
  )
}

export default App
const debounce = (func, wait=100) => {
    let timeout
    return function() {
        if(timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, arguments)
        }, wait)
    }
}

function VirtualList() {
    const [dataList, setDataList] = React.useState<number[]>([]) // 数据源
    const [position, setPosition] = React.useState<[number,number]>([0,0]) // 截取缓冲区+视图区索引

    const scroll = React.useRef(null) // 视图区滚动元素
    const box = React.useRef() // 获取元素用于容器高度
    const context = React.useRef(null) // 用于移动视图区域，形成滑动效果
    const scrollInfo = React.useRef({
        height:500, // 容器高度
        bufferCount:8, // 缓冲区数量
        itemHeight:60, // 每个元素高度
        renderCount:0 //
    })
    React.useEffect(()=>{
        const height = box.current.offsetHeight
        const {itemHeight,bufferCount} = scrollInfo.current
        const renderCount = Math.ceil(height/itemHeight) + bufferCount
        scrollInfo.current = {renderCount,height,itemHeight,bufferCount}
        const dataList = new Array(10000).fill(1).map((item,index)=> index+1)
        setDataList(dataList)
        setPosition([0,renderCount])
    },[])

    const handleScroll = ()=>{
        console.log('scroll')
        const {scrollTop} = scroll.current
        const {itemHeight,renderCount} = scrollInfo.current
        const currentOffset = scrollTop - (scrollTop % itemHeight) // 计算当前视图区域偏移量
        context.current.style.transform = `translateY(${currentOffset}px)` // 移动视图区域
        const start = Math.floor(scrollTop / itemHeight)
        const end = Math.floor(scrollTop / itemHeight + renderCount + 1)
        if(end !== position[1] || start !== position[0]){
            // 说明移动了
            setPosition([start,end])
        }
    }
    const debouncedHandleScroll = React.useCallback(debounce(handleScroll),[])
    const {itemHeight,height} = scrollInfo.current
    const [start,end] = position
    const renderList = dataList.slice(start,end)
    console.log('渲染区间',position)
    return (
        <div className="list_box" ref={box}>
            <div className="scroll_box" style={{height:height+'px'}} onScroll={handleScroll} ref={scroll}>
                <div className="scroll_hold" style={{height:`${dataList.length*itemHeight}px`}}>
                    <div className="context" ref={context}>
                        {
                            renderList.map((item,index)=>(
                                <div className='list' key={index}>
                                    {item + ''} Item
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
```

创建scroll函数，每次滚动调用这个函数，然后拿到：当前总盒子的偏移量，每个元素的高度还有需要渲染的元素个数，进而得到`起始索引和结束索引`，再通过这个索引判断是否变化，如果索引变化说明数据需要更新就更新  需要渲染的列表`renderList`

然后初始化的时候，获取需要渲染数量以及大量的数据。并且更新起始和终止索引，以便后续更新之后拿到初始的渲染列表。
```jsx
React.useEffect(()=>{
	const height = box.current.offsetHeight
	const {itemHeight,bufferCount} = scrollInfo.current
	const renderCount = Math.ceil(height/itemHeight) + bufferCount
	scrollInfo.current = {renderCount,height,itemHeight,bufferCount}
	const dataList = new Array(10000).fill(1).map((item,index)=> index+1)
	setDataList(dataList)
	setPosition([0,renderCount])
},[])
```

然后就是滚动函数
```jsx
const handleScroll = ()=>{
	console.log('scroll')
	const {scrollTop} = scroll.current
	const {itemHeight,renderCount} = scrollInfo.current
	const currentOffset = scrollTop - (scrollTop % itemHeight) // 计算当前视图区域偏移量
	context.current.style.transform = `translateY(${currentOffset}px)` // 移动视图区域
	const start = Math.floor(scrollTop / itemHeight)
	const end = Math.floor(scrollTop / itemHeight + renderCount + 1)
	if(end !== position[1] || start !== position[0]){
		// 说明移动了
		setPosition([start,end])
	}
}
```

需要scroll元素是因为，box元素是定高且overflow:hidden的，然后就是，不能知道滚动了多少，所以需要scroll元素。
scroll_hold元素是为了出现滚动条


## React事件流程
### 老版本
React给元素绑定的事件，并非绑定在元素上，拿到的事件源e甚至都不是事件源，冒泡/捕获阶段绑定的事件也并非在那时候执行的。

为什么要这样子做——为了兼容性来磨平浏览器的差异。

v17 之前 React 事件都是绑定在 document 上，v17 之后 React 把事件绑定在应用对应的容器 container 上，将事件绑定在同一容器统一管理，防止很多事件直接绑定在原生的 DOM 元素上。
事件捕获-> 事件源 -> 事件冒泡，也包括重写一下事件源对象 event 。
这对后期的ssr和跨端的支持度很高

#### 冒泡和捕获
```jsx
export default function Index(){
    const handleClick=()=>{ console.log('模拟冒泡阶段执行') } 
    const handleClickCapture = ()=>{ console.log('模拟捕获阶段执行') }
    return <div>
        <button onClick={ handleClick  } onClickCapture={ handleClickCapture }  >点击</button>
    </div>
}
```

冒泡通过onClick，捕获通过onClickCapture（加上Capture的后缀）

#### 阻止冒泡
```jsx
export default function Index(){
    const handleClick=(e)=> {
        e.stopPropagation() /* 阻止事件冒泡，handleFatherClick 事件讲不在触发 */
    }
    const handleFatherClick=()=> console.log('冒泡到父级')
    return <div onClick={ handleFatherClick } >
        <div onClick={ handleClick } >点击</div>
    </div>
}
```
React 阻止冒泡和原生事件中的写法差不多，当如上 handleClick上 阻止冒泡，父级元素的 handleFatherClick 将不再执行，但是底层原理完全不同，接下来会讲到其功能实现。

#### 事件合成
React 事件系统可分为三个部分：
* 第一个部分是事件合成系统，初始化会注册不同的事件插件。
* 第二个就是在一次渲染过程中，对事件标签中事件的收集，向 container 注册事件。
* 第三个就是一次用户交互，事件触发，到事件执行一系列过程。

比如
```jsx
export default function Index(){
  const handleClick = () => {}
  return <div >
     <button onClick={ handleClick } >点击</button>
  </div>
}
```
但是在相对应的元素上是找不到对应的事件的。
只有在document（react17以前），或者是container上才有相对应的事件

- React 的事件不是绑定在元素上的，而是统一绑定在顶部容器上，在 v17 之前是绑定在 document 上的，在 v17 改成了 app 容器上。这样更利于一个 html 下存在多个应用（微前端）。
* 绑定事件并不是一次性绑定所有事件，比如发现了 onClick 事件，就会绑定 click 事件，比如发现 onChange 事件，会绑定 `[blur，change ，focus ，keydown，keyup]` 多个事件。
* React 事件合成的概念：React 应用中，元素绑定的事件并不是原生事件，而是React 合成的事件，比如 onClick 是由 click 合成，onChange 是由 blur ，change ，focus 等多个事件合成。


#### 事件插件
React 有一种事件插件机制，比如上述 onClick 和 onChange ，会有不同的事件插件 SimpleEventPlugin ，ChangeEventPlugin 处理，先不必关心事件插件做了些什么，只需要先记住两个对象。这个对于后续的了解很有帮助。

```jsx
const registrationNameModules = {
    onBlur: SimpleEventPlugin,
    onClick: SimpleEventPlugin,
    onClickCapture: SimpleEventPlugin,
    onChange: ChangeEventPlugin,
    onChangeCapture: ChangeEventPlugin,
    onMouseEnter: EnterLeaveEventPlugin,
    onMouseLeave: EnterLeaveEventPlugin,
    ...
}
```

不同的事件有不同的处理流程，对应的事件源对象也有所不同，React的事件和事件源是自己合成的，所以对于不同事件需要不同的事件插件


#### 事件绑定
接下来重点研究一下事件绑定阶段，所谓事件绑定，就是在 React 处理 props 时候，如果遇到事件比如 onClick ，就会通过 addEventListener 注册原生事件
```js
export default function Index(){
  const handleClick = () => console.log('点击事件')
  const handleChange =() => console.log('change事件)
  return <div >
     <input onChange={ handleChange }  />
     <button onClick={ handleClick } >点击</button>
  </div>
}
```


### 新版本
通过 onClick，onClickCapture 和原生的 DOM 监听器给元素 button 绑定了三个事件处理函数，那么当触发一次点击事件的时候，处理函数的执行，老版本打印顺序为：

老版本事件系统：事件监听 -> 捕获阶段执行 -> 冒泡阶段执行

但是老版本的事件系统，一定程度上，不符合事件流的执行时机，但是在新版本 v18 的事件系统中，这个问题得以解决。

新版本事件系统：捕获阶段执行 -> 事件监听 -> 冒泡阶段执行

主要在`事件绑定`和`事件触发`
#### 事件绑定——事件初始化
新版本的事件系统中，createRoot会一口气向外层容器注册全部事件

```js
function createRoot(container, options) {
    /* 省去和事件无关的代码，通过如下方法注册事件 */
    listenToAllSupportedEvents(rootContainerElement);
}
function listenToAllSupportedEvents(rootContainerElement) {
    /* allNativeEvents 是一个 set 集合，保存了大多数的浏览器事件 */
    allNativeEvents.forEach(function (domEventName) {
      if (domEventName !== 'selectionchange') {
         /* nonDelegatedEvents 保存了 js 中，不冒泡的事件 */ 
        if (!nonDelegatedEvents.has(domEventName)) {
          /* 在冒泡阶段绑定事件 */ 
          listenToNativeEvent(domEventName, false, rootContainerElement);
        }
        /* 在捕获阶段绑定事件 */
        listenToNativeEvent(domEventName, true, rootContainerElement);
      }
    });
}
```

通过 listenToNativeEvent 绑定浏览器事件，这里引出了两个常量，allNativeEvents 和 nonDelegatedEvents ，它们分别代表的意思如下：

allNativeEvents：allNativeEvents 是一个 set 集合，保存了 81 个浏览器常用事件。
nonDelegatedEvents ：这个也是一个集合，保存了浏览器中不会冒泡的事件，一般指的是媒体事件，比如 pause，play，playing 等，还有一些特殊事件，比如 cancel ，close，invalid，load，scroll 。

```js
var listener = dispatchEvent.bind(null,domEventName,...)
if(isCapturePhaseListener){
    target.addEventListener(eventType, dispatchEvent, true);
}else{
    target.addEventListener(eventType, dispatchEvent, false);
}
```
如上可以看到 listenToNativeEvent 本质上就是向原生 DOM 中去注册事件，上面还有一个细节，就是 dispatchEvent 已经通过 bind 的方式将事件名称等信息保存下来了。经过这第一步，在初始化阶段，就已经注册了很多的事件监听器了。


#### 事件触发
接下来就是重点，当触发一次点击事件，会发生什么，首先就是执行 dispatchEvent 事件，我们来看看这个函数做了些什么？
执行dispatchEvent事件
```js
batchedUpdates(function () {
    return dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst);
});

function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  /* 找到发生事件的元素——事件源 */  
  var nativeEventTarget = getEventTarget(nativeEvent);
  /* 待更新队列 */
  var dispatchQueue = [];
  /* 找到待执行的事件 */
  extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  /* 执行事件 */
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
```
通过 batchedUpdates （批量更新）来处理 dispatchEventsForPlugins 

首先通过 getEventTarget 找到发生事件的元素，也就是事件源。然后创建一个待更新的事件队列，这个队列做什么，马上会讲到，接下来通过 extractEvents 找到待更新的事件，然后通过 processDispatchQueue 执行事件。



**当发生一次点击事件，React 会根据事件源对应的 fiber 对象，根据 return指针向上遍历，收集所有相同的事件**，比如是 onClick，那就收集父级元素的所有  onClick 事件，比如是 onClickCapture，那就收集父级的所有 onClickCapture。

得到了 dispatchQueue 之后，就需要 processDispatchQueue 执行事件了，这个函数的内部会经历两次遍历：

* 第一次遍历 dispatchQueue，通常情况下，只有一个事件类型，所有 dispatchQueue 中只有一个元素。
* 接下来会遍历每一个元素的 listener，执行 listener 的时候有一个特点：
```js
/* 如果在捕获阶段执行。 */
if (inCapturePhase) {
    for (var i = dispatchListeners.length - 1; i >= 0; i--) {
      var _dispatchListeners$i = dispatchListeners[i],
          instance = _dispatchListeners$i.instance,
          currentTarget = _dispatchListeners$i.currentTarget,
          listener = _dispatchListeners$i.listener;
     
      
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      
      /* 执行事件 */
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    for (var _i = 0; _i < dispatchListeners.length; _i++) {
      var _dispatchListeners$_i = dispatchListeners[_i],
          _instance = _dispatchListeners$_i.instance,
          _currentTarget = _dispatchListeners$_i.currentTarget,
          _listener = _dispatchListeners$_i.listener;
      
      if (_instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      /* 执行事件 */
      executeDispatch(event, _listener, _currentTarget);
      previousInstance = _instance;
    }
  }
```

![](https://files.catbox.moe/9cimlz.png)



## React调度

### 异步调度
为什么采用异步调度？
对于大型的 React 应用，会存在一次更新，递归遍历大量的虚拟 DOM ，造成占用 js 线程，使得浏览器没有时间去做一些动画效果，伴随项目越来越大，项目会越来越卡。
> vue是使用了**依赖收集**的过程，temple模板可以自动收集依赖，然后更新的时候，以更小的范围进行更新。

React 似乎无法打破从 root 开始‘找不同’的命运，但是还是要解决浏览器卡顿问题，那怎么办，解铃还须系铃人，既然更新过程阻塞了浏览器的绘制，所以要改变更新的流程。
与 vue 更快的响应，更精确的更新范围，React 选择更好的用户体验。（采用了时间分片）
浏览器每一次事件循环都会做这个事情： 处理事件、执行js、调用requestAnimation，布局，绘制Paint

浏览器的空余时间可以通过调用requestIdleCallback（时间分片）来执行其他事情。
```js
requestIdleCallback(callback,{ timeout })
```
 - callback 回调，浏览器空余时间执行回调函数。
* timeout 超时时间。如果浏览器长时间没有空闲，那么回调就不会执行，为了解决这个问题，可以通过 requestIdleCallback 的第二个参数指定一个超时时间。

React 为了防止 requestIdleCallback 中的任务由于浏览器没有空闲时间而卡死，所以设置了 5 个优先级。

![](https://files.catbox.moe/89k44v.png)


**React没有采用浏览器提供的requestIdleCallback，而是自己实现了一个requestIdleCallback来兼容每个浏览器**

模拟requestIdleCallback的条件：
1. 实现的这个 requestIdleCallback ，可以主动让出主线程，让浏览器去渲染视图。
2. 一次事件循环只执行一次，因为执行一个以后，还会请求下一次的时间片。

宏任务就是在下次事件循环中去执行的，不会阻塞浏览器更新，且每次只执行一个宏任务。

**setTimeout(fn,0)**
可以满足创建宏任务，但是是有一定缺陷的，当递归执行setTimeout(fn,0)时，间隔时间会变为4毫秒左右，而不是最初的1毫秒


MessageChannel
感知到最低限度每秒 60 帧的频率划分时间片，这样每个时间片就是 16ms 。但是setTimeout就浪费了4ms，因此才采用了一个新的方式去实现，那就是 `MessageChannel` 。
MessageChannel 接口允许开发者创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据。
* MessageChannel.port1 只读返回 channel 的 port1 。
* MessageChannel.port2 只读返回 channel 的 port2 。

```js
  let scheduledHostCallback = null 
  /* 建立一个消息通道 */
  var channel = new MessageChannel();
  /* 建立一个port发送消息 */
  var port = channel.port2;

  channel.port1.onmessage = function(){
      /* 执行任务 */
      scheduledHostCallback() 
      /* 执行完毕，清空任务 */
      scheduledHostCallback = null
  };
  /* 向浏览器请求执行更新任务 */
  requestHostCallback = function (callback) {
    scheduledHostCallback = callback;
    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true;
      port.postMessage(null);
    }
  };
```
- 在一次更新中，React 会调用 requestHostCallback ，把更新任务赋值给 scheduledHostCallback ，然后 port2 向 port1 发起 postMessage 消息通知。
* port1 会通过 onmessage ，接受来自 port2 消息，然后执行更新任务 scheduledHostCallback ，然后置空 scheduledHostCallback ，借此达到异步执行目的。


### 异步调度原理
- 对于正常更新会走 performSyncWorkOnRoot 逻辑，最后会走 `workLoopSync` 。
* 对于低优先级的异步更新会走 performConcurrentWorkOnRoot 逻辑，最后会走 `workLoopConcurrent` 。
```js
function workLoopSync() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
在一次更新调度过程中，workLoop 会更新执行每一个待更新的 fiber 。他们的区别就是异步模式会调用一个 shouldYield() ，如果当前浏览器没有空余时间， shouldYield 会中止循环，直到浏览器有空闲时间后再继续遍历，从而达到终止渲染的目的。这样就解决了一次性遍历大量的 fiber ，导致浏览器没有时间执行一些渲染任务，导致了页面卡顿。

正常更新的任务：
```js
scheduleCallback(Immediate,workLoopSync)
```

异步任务：
```js
/* 计算超时等级，就是如上那五个等级 */
var priorityLevel = inferPriorityFromExpirationTime(currentTime, expirationTime);
scheduleCallback(priorityLevel,workLoopConcurrent)
```

```js
function scheduleCallback(){
   /* 计算过期时间：超时时间  = 开始时间（现在时间） + 任务超时的时间（上述设置那五个等级）     */
   const expirationTime = startTime + timeout;
   /* 创建一个新任务 */
   const newTask = { ... }
  if (startTime > currentTime) {
      /* 通过开始时间排序 */
      newTask.sortIndex = startTime;
      /* 把任务放在timerQueue中 */
      push(timerQueue, newTask);
      /*  执行setTimeout ， */
      requestHostTimeout(handleTimeout, startTime - currentTime);
  }else{
    /* 通过 expirationTime 排序  */
    newTask.sortIndex = expirationTime;  
    /* 把任务放入taskQueue */
    push(taskQueue, newTask);
    /*没有处于调度中的任务， 然后向浏览器请求一帧，浏览器空闲执行 flushWork */
     if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true;
         requestHostCallback(flushWork)
     }
    
  }
  
} 
```
对于调度本身，有几个概念必须掌握。
* `taskQueue`，里面存的都是过期的任务，依据任务的过期时间( `expirationTime` ) 排序，需要在调度的 `workLoop` 中循环执行完这些任务。
* `timerQueue` 里面存的都是没有过期的任务，依据任务的开始时间( `startTime` )排序，在调度 workLoop 中 会用`advanceTimers`检查任务是否过期，如果过期了，放入 `taskQueue` 队列。

scheduleCallback 流程如下。
* 创建一个新的任务 newTask。
* 通过任务的开始时间( startTime ) 和 当前时间( currentTime ) 比较:当 startTime > currentTime, 说明未过期, 存到 timerQueue，当 startTime <= currentTime, 说明已过期, 存到 taskQueue。
* 如果任务过期，并且没有调度中的任务，那么调度 requestHostCallback。本质上调度的是 flushWork。
* 如果任务没有过期，用 requestHostTimeout 延时执行 handleTimeout。

没有超时的任务什么时候执行？
通过requestHostTimeout来确认
```js
requestHostTimeout = function (cb, ms) {
_timeoutID = setTimeout(cb, ms);
};

cancelHostTimeout = function () {
clearTimeout(_timeoutID);
};
```

延时指定时间后，调用的handleTimeout函数，会将任务重新放在requestHostCallback调度。

```js
function handleTimeout(){
  isHostTimeoutScheduled = false;
  /* 将 timeQueue 中过期的任务，放在 taskQueue 中 。 */
  advanceTimers(currentTime);
  /* 如果没有处于调度中 */
  if(!isHostCallbackScheduled){
      /* 判断有没有过期的任务， */
      if (peek(taskQueue) !== null) {   
      isHostCallbackScheduled = true;
      /* 开启调度任务 */
      requestHostCallback(flushWork);
    }
  }
}
function advanceTimers(){
   var timer = peek(timerQueue);
   while (timer !== null) {
      if(timer.callback === null){
        pop(timerQueue);
      }else if(timer.startTime <= currentTime){ /* 如果任务已经过期，那么将 timerQueue 中的过期任务，放入taskQueue */
         pop(timerQueue);
         timer.sortIndex = timer.expirationTime;
         push(taskQueue, timer);
      }
   }
}
```
- 通过 advanceTimers 将 timeQueue 中过期的任务转移到 taskQueue 中。（ 如果任务已经过期，那么将 timerQueue 中的过期任务，放入 taskQueue。）
* 然后调用 requestHostCallback **调度过期的任务。**

因此React最终调用的都是过期的任务
requestHostCallback ，放入 MessageChannel 中的回调函数是flushWork
```js
function flushWork(){
  if (isHostTimeoutScheduled) { /* 如果有延时任务，那么先暂定延时任务*/
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }
  try{
     /* 执行 workLoop 里面会真正调度我们的事件  */
     workLoop(hasTimeRemaining, initialTime)
  }
}
```
flushWork 如果有延时任务执行的话，那么会先暂停延时任务，然后调用 workLoop ，去真正执行超时的更新任务。

workLoop
```js
function workLoop(){
  var currentTime = initialTime;
  advanceTimers(currentTime);
  /* 获取任务列表中的第一个 */
  currentTask = peek();
  while (currentTask !== null){
      /* 真正的更新函数 callback */
      var callback = currentTask.callback;
      if(callback !== null ){
         /* 执行更新 */
         callback()
        /* 先看一下 timeQueue 中有没有 过期任务。 */
        advanceTimers(currentTime);
      }
      /* 再一次获取任务，循环执行 */ 
      currentTask = peek(taskQueue);
  }
}
```

![](https://files.catbox.moe/wtiy7s.png)

调和+异步调度
![](https://files.catbox.moe/2qn8zp.png)



## Fiber
fiber是啥？
fiber 在 React 中是最小粒度的执行单元，fiber就是react的虚拟DOM。
他出现解决了什么？
React15之前，虚拟DOM采用的是递归遍历更新，比如一次更新，就会从应用根部递归更新，递归一旦开始，中途无法中断，随着项目越来越复杂，层级越来越深，导致更新的时间越来越长，给前端交互上的体验就是卡顿。

`Reactv16` 为了解决卡顿问题引入了 fiber ，为什么它能解决卡顿，更新 fiber 的过程叫做 `Reconciler`（调和器），每一个 fiber 都可以作为一个执行单元来处理，所以每一个 fiber 可以根据自身的过期时间`expirationTime`（ v17 版本叫做优先级 `lane` ）来判断是否还有空间时间执行更新，如果没有时间更新，就要把主动权交给浏览器去渲染，做一些动画，重排（ reflow ），重绘 repaints 之类的事情，这样就能给用户感觉不是很卡。然后等浏览器空余时间，在通过 `scheduler` （调度器），再次恢复执行单元上来，这样就能本质上中断了渲染，提高了用户体验。


element、fiber、dom三者的关系
- element 是 React 视图层在代码层级上的表象，也就是开发者写的 jsx 语法，写的元素结构，都会被创建成 element 对象的形式。上面保存了 props ， children 等信息。
* DOM 是元素在浏览器上给用户直观的表象。
* fiber 可以说是是 element 和真实 DOM 之间的交流枢纽站，一方面每一个类型 element 都会有一个与之对应的 fiber 类型，element 变化引起更新流程都是通过 fiber 层面做一次调和改变，然后对于元素，形成新的 DOM 做视图渲染。
![](https://files.catbox.moe/brbeu4.png)
```js
export const FunctionComponent = 0;       // 对应函数组件
export const ClassComponent = 1;          // 对应的类组件
export const IndeterminateComponent = 2;  // 初始化的时候不知道是函数组件还是类组件 
export const HostRoot = 3;                // Root Fiber 可以理解为跟元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4;              // 对应  ReactDOM.createPortal 产生的 Portal 
export const HostComponent = 5;           // dom 元素 比如 <div>
export const HostText = 6;                // 文本节点
export const Fragment = 7;                // 对应 <React.Fragment> 
export const Mode = 8;                    // 对应 <React.StrictMode>   
export const ContextConsumer = 9;         // 对应 <Context.Consumer>
export const ContextProvider = 10;        // 对应 <Context.Provider>
export const ForwardRef = 11;             // 对应 React.ForwardRef
export const Profiler = 12;               // 对应 <Profiler/ >
export const SuspenseComponent = 13;      // 对应 <Suspense>
export const MemoComponent = 14;          // 对应 React.memo 返回的组件
```

Fiber节点有的数据
```js
function FiberNode(){

  this.tag = tag;                  // fiber 标签 证明是什么类型fiber。
  this.key = key;                  // key调和子节点时候用到。 
  this.type = null;                // dom元素是对应的元素类型，比如div，组件指向组件对应的类或者函数。  
  this.stateNode = null;           // 指向对应的真实dom元素，类组件指向组件实例，可以被ref获取。
 
  this.return = null;              // 指向父级fiber
  this.child = null;               // 指向子级fiber
  this.sibling = null;             // 指向兄弟fiber 
  this.index = 0;                  // 索引

  this.ref = null;                 // ref指向，ref函数，或者ref对象。

  this.pendingProps = pendingProps;// 在一次更新中，代表element创建
  this.memoizedProps = null;       // 记录上一次更新完毕后的props
  this.updateQueue = null;         // 类组件存放setState更新队列，函数组件存放
  this.memoizedState = null;       // 类组件保存state信息，函数组件保存hooks信息，dom元素为null
  this.dependencies = null;        // context或是时间的依赖项

  this.mode = mode;                //描述fiber树的模式，比如 ConcurrentMode 模式

  this.effectTag = NoEffect;       // effect标签，用于收集effectList
  this.nextEffect = null;          // 指向下一个effect

  this.firstEffect = null;         // 第一个effect
  this.lastEffect = null;          // 最后一个effect

  this.expirationTime = NoWork;    // 通过不同过期时间，判断任务是否过期， 在v17版本用lane表示。

  this.alternate = null;           //双缓存树，指向缓存的fiber。更新阶段，两颗树互相交替。
}
```

fiber通过child、return、subling建立联系，分别对应子节点、父节点、兄弟节点

### fiber的更新机制
初始化
创建fiberRoot和rootFiber
* `fiberRoot`：首次构建应用， 创建一个 fiberRoot ，作为整个 React 应用的根基。
* `rootFiber`： 如下通过 ReactDOM.render 渲染出来的，如上 Index 可以作为一个 rootFiber。一个 React 应用可以有多 ReactDOM.render 创建的 rootFiber ，但是只能有一个 fiberRoot（应用根节点）。
![](https://files.catbox.moe/3yr5lt.png)

在第一次挂载
```js
function createFiberRoot(containerInfo,tag){
    /* 创建一个root */
    const root = new FiberRootNode(containerInfo,tag)
    const rootFiber = createHostRootFiber(tag);
    root.current = rootFiber
    return root
}
```

workInProgress和current
* workInProgress是：正在内存中构建的 Fiber 树称为 workInProgress Fiber 树。在一次更新中，所有的更新都是发生在 workInProgress 树上。在一次更新之后，workInProgress 树上的状态是最新的状态，那么它将变成 current 树用于渲染视图。
* current：正在视图层渲染的树叫做 current 树。
接下来会到 rootFiber 的渲染流程，首先会复用当前 current 树（ rootFiber ）的 `alternate` 作为 workInProgress ，如果没有 alternate （初始化的 rootFiber 是没有 alternate ），那么会创建一个 fiber 作为 workInProgress 。会用 alternate 将新创建的 workInProgress 与 current 树建立起关联。这个关联过程只有初始化第一次创建 alternate 时候进行。

> **`current`**：表示应用当前正在使用的 Fiber 树，这是用户看到的界面。
> 这个alternate：表示工作中的 Fiber 树，它是 React 在调度更新时创建的备份树（work-in-progress tree），负责执行当前任务和状态更新。
> 具体作用：
>
>1. **树的复用**：在更新过程中，React 不会直接修改当前树，而是操作 `alternate` 树，并在操作完成后将 `alternate` 树变为新的 `current` 树。通过这种机制，React 能够高效管理 UI 的更新，确保更新过程中的 Fiber 树可以被复用，减少不必要的创建和销毁操作。
  >  
>2. **并发更新**：在并发模式下，`alternate` 树允许 React 在后台准备新的更新，而不会打断用户当前看到的界面。更新完成后，React 会将新的 `alternate` 树替换掉当前树。

![](https://files.catbox.moe/psnqzs.png)
在新创建的 alternates 上，完成整个 fiber 树的遍历，包括 fiber 的创建。

![](https://files.catbox.moe/jn95hl.png)
最后会以 workInProgress 作为最新的渲染树，fiberRoot 的 current 指针指向 workInProgress 使其变为 current Fiber 树。到此完成初始化流程。
![](https://files.catbox.moe/gtkn2k.png)

双缓存：在内存中构建并直接替换的技术
比如canvas绘制动画时，上一帧计算量比较大的话，canvas在内存中绘制当前动画，绘制完毕后直接用当前帧替换上一帧画面
React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。


两大阶段：render和commit

#### render阶段：
```js
function workLoop (){
    while (workInProgress !== null ) {
      workInProgress = performUnitOfWork(workInProgress);
    }
}
```
每一个fiber都被当作可以执行的节点，调和过程中，每一个发生更新的fiber都会作为一次workInProgress
那么 workLoop 就是执行每一个单元的调度器，如果渲染没有被中断，那么 workLoop 会遍历一遍 fiber 树。
>performUnitOfWork 包括两个阶段 beginWork 和 completeWork 。

```js
function performUnitOfWork(){
    next = beginWork(current, unitOfWork, renderExpirationTime);
    if (next === null) {
       next = completeUnitOfWork(unitOfWork);
    }
}
```

`beginWork`：是向下调和的过程。就是由 fiberRoot 按照 child 指针逐层向下调和，期间会执行函数组件，实例类组件，diff 调和子节点，打不同effectTag。

`completeUnitOfWork`：是向上归并的过程，如果有兄弟节点，会返回 sibling兄弟，没有返回 return 父级，一直返回到 fiebrRoot ，期间可以形成effectList，对于初始化流程会创建 DOM ，对于 DOM 元素进行事件收集，处理style，className等。
这俩结合起来，构成了整个fiber树的调和。

beginWork的作用：
* 对于组件，执行部分生命周期，执行 render ，得到最新的 children 。
* 向下遍历调和 children ，复用 oldFiber ( diff 算法)
* 打不同的副作用标签 effectTag ，比如类组件的生命周期，或者元素的增加，删除，更新。

react调和子节点：
```js
function reconcileChildren(current,workInProgress){
   if(current === null){  /* 初始化子代fiber  */
        workInProgress.child = mountChildFibers(workInProgress,null,nextChildren,renderExpirationTime)
   }else{  /* 更新流程，diff children将在这里进行。 */
        workInProgress.child = reconcileChildFibers(workInProgress,current.child,nextChildren,renderExpirationTime)
   }
}
```

EffectTag:
```js
export const Placement = /*             */ 0b0000000000010;  // 插入节点
export const Update = /*                */ 0b0000000000100;  // 更新fiber
export const Deletion = /*              */ 0b0000000001000;  // 删除fiebr
export const Snapshot = /*              */ 0b0000100000000;  // 快照
export const Passive = /*               */ 0b0001000000000;  // useEffect的副作用
export const Callback = /*              */ 0b0000000100000;  // setState的 callback
export const Ref = /*                   */ 0b0000010000000;  // ref
```

向上归并completeUnitOfWork：
* 首先 completeUnitOfWork 会将 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中。在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。
* completeWork 阶段对于组件处理 context ；对于元素标签初始化，会创建真实 DOM ，将子孙 DOM 节点插入刚生成的 DOM 节点中；会触发 diffProperties 处理 props ，比如事件收集，style，className 处理，在15章讲到过。

调和顺序：
* beginWork    -> rootFiber
* beginWork    -> Index fiber
* beginWork    -> div fiber
* beginWork    -> hello,world fiber
* completeWork -> hello,world fiber (completeWork返回sibling)
* beginWork    -> p fiber
* completeWork -> p fiber
* beginWork    -> button fiber
* completeWork -> button fiber (此时没有sibling，返回return)
* completeWork -> div fiber
* completeWork -> Index fiber
* completeWork -> rootFiber  (完成整个workLoop)
#### commit阶段

* 一方面是对一些生命周期和副作用钩子的处理，比如 componentDidMount ，函数组件的 useEffect ，useLayoutEffect ；
* 另一方面就是在一次更新中，添加节点（ `Placement` ），更新节点（ `Update` ），删除节点（ `Deletion` ），还有就是一些细节的处理，比如 ref 的处理。
commit 细分可以分为：
* `Before mutation` 阶段（执行 DOM 操作前）
  因为这个还没修改真实的DOM，能够获取DOM快照，如果是类组件就调用`getSnapshotBeforeUpdate`，如果是函数组件会异步调用useEffect
* `mutation` 阶段（执行 DOM 操作）
  置空ref，对新增、更新、删除元素，进行真实的DOM操作
* `layout` 阶段（执行 DOM 操作后）
  commitLayoutEffectOnFiber 对于类组件，会执行生命周期，setState 的callback，对于函数组件会执行 useLayoutEffect 钩子。
  如果有 ref ，会重新赋值 ref 。

## React——位运算
如果分支判断是一对多的情况下，可以用位运算来达到效果
```js
const A = 0b0000000000000000000000000000001
const B = 0b0000000000000000000000000000010
const C = 0b0000000000000000000000000000100
```

比如需要AB只满足任意一个就行，那么可以使用|处理
```js
const A = 0b0000000000000000000000000000001
const B = 0b0000000000000000000000000000010
const C = 0b0000000000000000000000000000100
const N = 0b0000000000000000000000000000000
const value = A | B
console.log((value & A ) !== N ) // true
console.log((value & B ) !== N ) // true
console.log((value & C ) !== N ) // false
```


位掩码：
对于常量的声明（如上的 A B C ）必须满足只有一个 1 位，而且每一个常量二进制 1 的所在位数都不同，如下所示：

0b0000000000000000000000000000001 = 1   
0b0000000000000000000000000000010 = 2   
0b0000000000000000000000000000100 = 4  

#### React位掩码场景——更新优先级
React存在多个更新优先级的任务待执行时，高优先级的任务会优先执行，等到执行完高优先级任务，在回过头来执行低优先级任务。
react17之前采用的是：expirationTime
React17及之后使用的：lane

>react-reconciler/src/ReactFiberLane.js
```js
export const NoLanes = /*                        */ 0b0000000000000000000000000000000;
const SyncLane = /*                        */ 0b0000000000000000000000000000001;

const InputContinuousHydrationLane = /*    */ 0b0000000000000000000000000000010;
const InputContinuousLane = /*             */ 0b0000000000000000000000000000100;

const DefaultHydrationLane = /*            */ 0b0000000000000000000000000001000;
const DefaultLane = /*                     */ 0b0000000000000000000000000010000;

const TransitionHydrationLane = /*                */ 0b0000000000000000000000000100000;
const TransitionLane = /*                        */ 0b0000000000000000000000001000000;
```

SyncLane 代表的数值是 1，它却是最高的优先级，也即是说 lane 的代表的数值越小，此次更新的优先级就越大 ，在新版本的 React 中，还有一个新特性，就是 render 阶段可能被中断，在这个期间会产生一个更高优先级的任务，那么会再次更新 lane 属性，这样多个更新就会合并，这样一个 **lane 可能需要表现出多个更新优先级。**
所以通过位运算，让多个优先级的任务合并，这样可以通过位运算分离出高优先级和低优先级的任务。

分离过程
> react-reconciler/src/ReactFiberLane.js -> getHighestPriorityLanes
```js
function getHighestPriorityLanes(lanes) {
   /* 通过 getHighestPriorityLane 分离出优先级高的任务 */ 
  switch (getHighestPriorityLane(lanes)) {
       case SyncLane:
         return SyncLane;
       case InputContinuousHydrationLane:
         return InputContinuousHydrationLane;
       ...  
  }
  
```
> react-reconciler/src/ReactFiberLane.js -> getHighestPriorityLane
```js
function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}
```

```js
const SyncLane = 0b0000000000000000000000000000001
const InputContinuousLane = 0b0000000000000000000000000000100
const lane = SyncLane | InputContinuousLane
console.log( (lane & -lane) === SyncLane  ) // true
```


#### 位掩码——更新上下文
lane决定更新与否，进入更新状态之后可以通过`ExecutionContext`判断现在更新上下文的状态。
**更新上下文状态—ExecutionContext**
那么在 React 中会被合成一次更新，那么就有一个问题，React 如何知道当前的上下文中需要合并更新的呢？此时就需要ExecutionContext来证明当前上下文状态

```js
function batchedEventUpdates(){
    var prevExecutionContext = executionContext;
    executionContext |= EventContext;  // 赋值事件上下文 EventContext 
    try {
        return fn(a);  // 执行函数
    }finally {
        executionContext = prevExecutionContext; // 重置之前的状态
    }
}
```

```js
if (lane === SyncLane) {
        if (
            (executionContext & LegacyUnbatchedContext) !== NoContext && // unbatch 情况，比如初始化
            (executionContext & (RenderContext | CommitContext)) === NoContext) {
            //直接更新
         }else{
               if (executionContext === NoContext) {
                   //放入调度更新
               }
         }
    }
```
通过 executionContext 以及位运算来判断是否**直接更新**还是**放入到调度中去更新**。

#### 更新flag

```js
const NoFlags = 0b00000000000000000000000000;
const PerformedWork =0b00000000000000000000000001;
const Placement =  0b00000000000000000000000010;
const Update = 0b00000000000000000000000100;
//初始化
let flag = NoFlags

//发现更新，打更新标志
flag = flag | PerformedWork | Update

//判断是否有  PerformedWork 种类的更新
if(flag & PerformedWork){
    //执行
    console.log('执行 PerformedWork')
}

//判断是否有 Update 种类的更新
if(flag & Update){
    //执行
    console.log('执行 Update')
}


if(flag & Placement){
    //不执行
    console.log('执行 Placement')
}
```
通过flag来区分当前的fiber发生了什么类型的更新

## React数据更新架构设计

### 更新前置
- 批量更新——减少更新次数。
浏览器绘制成本是比较高的，需要做出良好的性能保障
>减少更新次数，从而减少浏览器的渲染绘制操作，比如重绘，回流等。
 避免 JS 的执行，影响到浏览器的绘制。

React数据变更
数据变化-> DOM 元素变化 -> 浏览器绘制

如果一个事件中存在多次更新，不进行合并，就会出现多次DOM更新。为了避免出现这种情况，React 通过更新上下文的方式，来判断每一次更新是在什么上下文环境下，比如在 React 事件系统中，就有 EventContext。在这些上下文中的更新，都是 React 可控的，进而可以批量处理这些更新任务。

- 更新调度——更新由浏览器控制
scheduler！

在 React 中维护了一个更新队列中，去保存这些更新任务，当第一次产生更新的时候，会先把当前更新任务放入到更新队列中，然后先执行更新，接下来调度会向浏览器请求空闲时间，在此期间，如果有其他更新任务插入，比如上述的微任务，就会放入更新队列中，如果浏览器空闲了，就会判断更新队列中是否还有待更新的任务，如果有那么执行，接下来再向浏览器请求下一个空闲帧，一直到待更新队列中没有更新任务，这样就保证了更新任务导致浏览器卡住的情况发生，把更新的主动权交给了浏览器。


- 更新标识——lane和ExpirationTime


 ExpirationTime是指的过期时间，每次执行的任务的时候，会通过 ExpirationTime 来计算当前任务是否过期，如果过期了说明需要马上优先执行，如果没有过期，那么就让更高优先级的任务先执行，这就好比如上产品会把每一个需求增加了一个 deadline （过期时间），来确保需求的迫切性。
 这样子会有问题，比如输入事件，这种与用户有高交互性的需要更高的优先级，但是有一个不紧急的事情过期时间更短导致，这个输入事件没有第一时间被执行
 
所以就采用了另外一个模式， 那就是 Lane 模型，Lane 采用位运算的方式，一个 Lane 上可以有多个任务合并，这样能够描述出一个 fiber 节点上，存在多个更新任务，那么就可以优先处理高优先级任务


### 更新后置

render和commit阶段
React 在进入到更新流程之后，并不是马上更新数据，更新 DOM 元素，而是通过 render 和 commit 两大阶段来处理整个流程。

render —— diff
整个 render 都围绕着 diff 展开，首先就是 React 需要通过对比 childLanes 来找到更新的组件。找到对应的组件后，就会执行组件的 render 函数，然后会得到新的 element 对象，接下来就是新 element 和老 fiber 的 diff ，通过对比对单元素节点和多元素节点来复用老 fiber ，创建新 fiber 。
在 render 阶段中，会通过 fiber 上面的 child ，return 和 sibling 三个指针来遍历，找到需要更新的 fiber 并且执行更新。在此其中，会采用优先深度遍历的方式，遍历 child，当没有 child 之后会遍历 sibling 兄弟节点，最后到父元素节点。这种方式的好处，就是可以方便形成真实 DOM 树结构，在 fiber 初始化流程中，创建 DOM 元素是在 render 阶段完成的。

## ReactHooks
为什么推出Hooks，因为之前存在类组件和函数组件，如果不出现hooks的话，函数组件没有自己的状态，所有的状态都只能在类组件中书写，会使得类组件内部错综复杂。

所以 Hooks 出现本质上原因是：
* 1 让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref ，也能做数据缓存。
* 2 解决逻辑复用难的问题。
* 3 放弃面向对象编程，拥抱函数式编程。
### Hooks和fiber
类组件的状态比如 state ，context ，props 本质上是存在类组件对应的 fiber 上，包括生命周期比如 componentDidMount ，也是以副作用 effect 形式存在的。那么 Hooks 既然赋予了函数组件如上功能，所以 hooks 本质是离不开函数组件对应的 fiber 的。 hooks 可以作为函数组件本身和函数组件对应的 fiber 之间的沟通桥梁。
![hooks](https://files.catbox.moe/gr8pa0.png)

hooks对象本质上是三中处理策略存在React中
1. `ContextOnlyDispatcher`：防止开发者在函数组件外调用hooks，只要调用了这个形态下的hooks，就会抛出异常
2. `HooksDispatcherOnMoun`t: 将函数组件初始化，因为之前讲过 hooks 是函数组件和对应 fiber 桥梁，这个时候的 hooks 作用就是建立这个桥梁，初次建立其 hooks 与 fiber 之间的关系。
3. `HooksDispatcherOnUpdate`：第三种形态是函数组件的更新，既然与 fiber 之间的桥已经建好了，那么组件再更新，就需要 hooks 去获取或者更新维护状态。

```js
const HooksDispatcherOnMount = { /* 函数组件初始化用的 hooks */
    useState: mountState,
    useEffect: mountEffect,
    ...
}
const  HooksDispatcherOnUpdate ={/* 函数组件更新用的 hooks */
   useState:updateState,
   useEffect: updateEffect,
   ...
}
const ContextOnlyDispatcher = {  /* 当hooks不是函数内部调用的时候，调用这个hooks对象下的hooks，所以报错。 */
   useEffect: throwInvalidHookError,
   useState: throwInvalidHookError,
   ...
}
```

#### 函数组件的触发
函数组件触发实在renderWithHooks中

fiber调和过程中，遇到函数组件类型的fiber，就会调用updateFunctionComponent更新fiber，这个方法里面调用了renderWithHooks
>react-reconciler/src/ReactFiberHooks.js
```js
let currentlyRenderingFiber
function renderWithHooks(current,workInProgress,Component,props){
    currentlyRenderingFiber = workInProgress;
    workInProgress.memoizedState = null; /* 每一次执行函数组件之前，先清空状态 （用于存放hooks列表）*/
    workInProgress.updateQueue = null;    /* 清空状态（用于存放effect list） */
    ReactCurrentDispatcher.current =  current === null || current.memoizedState === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate /* 判断是初始化组件还是更新组件 */
    let children = Component(props, secondArg); /* 执行我们真正函数组件，所有的hooks将依次执行。 */
    ReactCurrentDispatcher.current = ContextOnlyDispatcher; /* 将hooks变成第一种，防止hooks在函数组件外部调用，调用直接报错。 */
}
```
workInProgress 正在调和更新函数组件对应的 fiber 树。
- 类组件的fiber，memorizedState保存state信息，函数组件的fiber，**用memorizedState保存hooks信息**
- 对于函数组件的fiber，updateQueue存放每一个useEffect/useLayoutEffect产生的副作用组成的链表。
- 然后判断组件是初始化流程还是更新流程，如果初始化用  HooksDispatcherOnMount 对象，如果更新用 HooksDispatcherOnUpdate 对象。函数组件执行完毕，将 hooks 赋值给 ContextOnlyDispatcher 对象。**引用的 React hooks都是从 ReactCurrentDispatcher.current 中的， React 就是通过赋予 current 不同的 hooks 对象达到监控 hooks 是否在函数组件内部调用。**
*  Component ( props ， secondArg ) 这个时候函数组件被真正的执行，里面每一个 hooks 也将依次执行。
* 每个 hooks 内部为什么能够读取当前 fiber 信息，因为 currentlyRenderingFiber ，函数组件初始化已经把当前 fiber 赋值给 currentlyRenderingFiber ，每个 hooks 内部读取的就是 currentlyRenderingFiber 的内容。


#### hooks和fiber建立联系
hooks 初始化流程使用的是 mountState，mountEffect 等初始化节点的hooks，将 hooks 和 fiber 建立起联系，那么是如何建立起关系呢，每一个hooks 初始化都会执行 mountWorkInProgressHook 
> react-reconciler/src/ReactFiberHooks.js
```js
function mountWorkInProgressHook() {
  const hook = {  memoizedState: null, baseState: null, baseQueue: null,queue: null, next: null,};
  if (workInProgressHook === null) {  // 只有一个 hooks
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {  // 有多个 hooks
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```
首先函数组件对应 fiber 用 memoizedState 保存 hooks 信息，每一个 hooks 执行都会产生一个 hooks 对象，hooks 对象中，保存着当前 hooks 的信息，不同 hooks 保存的形式不同。每一个 hooks 通过 next 链表建立起关系。

比如：
```js
function Son() {
  console.log('Son');
  const {count, setCount} = React.useState(0)// 第一个hook
  const divRef = React.useRef(null); // 第二个hooks
  useEffect(() => {
    console.log('divRef:', divRef.current); // 第三个hook
  }, []);
  return (
    <div>
      <h3 ref={divRef}>Son</h3>
      {count}
      <button onClick={() => setCount(count + 1)}>Son Increment</button>
    </div>
  )
}
```
![](https://files.catbox.moe/2z6dio.png)


#### hooks更新逻辑
首先取出  workInProgres.alternate 里面对应的 hook ，然后根据之前的 hooks 复制一份，形成新的 hooks 链表关系。
**hooks 规则，hooks 为什么要通常放在顶部，hooks 不能写在 if 条件语句中**，因为在更新过程中，如果通过 if 条件语句，增加或者删除 hooks，在复用 hooks 过程中，会产生复用 hooks 状态和当前 hooks 不一致的问题。

```js
export default function Index({ showNumber }){
    let number, setNumber
    showNumber && ([ number,setNumber ] = React.useState(0)) // 第一个hooks
}
```

![](https://files.catbox.moe/v05b3e.png)
hook类型不一致直接报错了
所以开发的时候一定注意 hooks 顺序一致性。

### 状态派发
useState 解决了函数组件没有 state 的问题，让无状态组件有了自己的状态
useState 和 useReducer 原理大同小异，本质上都是触发更新的函数都是 dispatchAction。

```js
const [ number,setNumber ] = React.useState(0)  
```

useState(0)干了什么
```js
function mountState(initialState){
     const hook = mountWorkInProgressHook();
    if (typeof initialState === 'function') {initialState = initialState() } // 如果 useState 第一个参数为函数，执行函数得到初始化state
     hook.memoizedState = hook.baseState = initialState;
    const queue = (hook.queue = { ... }); // 负责记录更新的各种状态。
    const dispatch = (queue.dispatch = (dispatchAction.bind(  null,currentlyRenderingFiber,queue, ))) // dispatchAction 为更新调度的主要函数 
    return [hook.memoizedState, dispatch];
}
```
- 上面的 state 会被当前 hooks 的 `memoizedState` 保存下来，每一个 useState 都会创建一个 `queue` 里面保存了更新的信息。
* 每一个 useState 都会创建一个更新函数，比如如上的 setNumber 本质上就是 dispatchAction，那么值得注意一点是，当前的 fiber 被  bind 绑定了固定的参数传入 dispatchAction 和 queue ，所以当用户触发 setNumber 的时候，能够直观反映出来自哪个 fiber 的更新。
* 最后把 memoizedState dispatch 返回给开发者使用。

dispatchAction
```js
function dispatchAction(fiber, queue, action){
    /* 第一步：创建一个 update */
    const update = { ... }
    const pending = queue.pending;
    if (pending === null) {  /* 第一个待更新任务 */
        update.next = update;
    } else {  /* 已经有带更新任务 */
       update.next = pending.next;
       pending.next = update;
    }
    if( fiber === currentlyRenderingFiber ){
        /* 说明当前fiber正在发生调和渲染更新，那么不需要更新 */
    }else{
       if(fiber.expirationTime === NoWork && (alternate === null || alternate.expirationTime === NoWork)){
            const lastRenderedReducer = queue.lastRenderedReducer;
            const currentState = queue.lastRenderedState;                 /* 上一次的state */
            const eagerState = lastRenderedReducer(currentState, action); /* 这一次新的state */
            if (is(eagerState, currentState)) {                           /* 如果每一个都改变相同的state，那么组件不更新 */
               return 
            }
       }
       scheduleUpdateOnFiber(fiber, expirationTime);    /* 发起调度更新 */
    }
}
```
原来当每一次改变 state ，底层会做这些事。
* 首先用户每一次调用 dispatchAction（比如如上触发 setNumber ）都会先创建一个 update ，然后把它放入待更新 pending 队列中。
* 然后判断如果当前的 fiber 正在更新，那么也就不需要再更新了。
* 反之，说明当前 fiber 没有更新任务，那么会拿出上一次 state 和 这一次 state 进行对比，如果相同，那么直接退出更新。如果不相同，那么发起更新调度任务。**这就解释了，为什么函数组件 useState 改变相同的值，组件不更新了。**

多次更新
```js
export default  function Index(){
    const [ number , setNumber ] = useState(0)
    const handleClick=()=>{
        setNumber(num=> num + 1 ) // num = 1
        setNumber(num=> num + 2 ) // num = 3 
        setNumber(num=> num + 3 ) // num = 6
    }
    return <div>
        <button onClick={() => handleClick() } >点击 { number } </button>
    </div>
}
```
如上当点击一次按钮，触发了三次 setNumber，等于触发了三次  dispatchAction ，那么这三次 update 会在当前 hooks 的 pending 队列中，然后事件批量更新的概念，会统一合成一次更新。接下来就是组件渲染，那么就到了再一次执行 useState，此时走的是更新流程。那么试想一下点击 handleClick 最后 state 被更新成 6 ，那么在更新逻辑中  useState 内部要做的事，就是**得到最新的 state 。**

```js
function updateReducer(){
    // 第一步把待更新的pending队列取出来。合并到 baseQueue
    const first = baseQueue.next;
    let update = first;
   do {
        /* 得到新的 state */
        newState = reducer(newState, action);
    } while (update !== null && update !== first);
     hook.memoizedState = newState;
     return [hook.memoizedState, dispatch];
}
```

- 当再次执行useState的时候，会触发更新hooks逻辑，本质上调用的就是 updateReducer，如上会把待更新的队列 pendingQueue 拿出来，合并到 `baseQueue`，循环进行更新。
* 循环更新的流程，说白了就是执行每一个 `num => num + 1` ，得到最新的 state 。接下来就可以从 useState 中得到最新的值。

### 处理副作用
在 fiber 章节讲了，在 render 阶段，实际没有进行真正的 DOM 元素的增加，删除，React 把想要做的不同操作打成不同的 effectTag ，等到commit 阶段，统一处理这些副作用，包括 DOM 元素增删改，执行一些生命周期等。hooks 中的 useEffect 和 useLayoutEffect 也是副作用，接下来以 effect 为例子，看一下 React 是如何处理 useEffect 副作用的。

初始化时：
```js
function mountEffect(create,deps){
    const hook = mountWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    currentlyRenderingFiber.effectTag |= UpdateEffect | PassiveEffect;
    hook.memoizedState = pushEffect( 
      HookHasEffect | hookEffectTag, 
      create, // useEffect 第一次参数，就是副作用函数
      undefined, 
      nextDeps, // useEffect 第二次参数，deps    
    )
}
```
- mountWorkInProgressHook 产生一个 hooks ，并和 fiber 建立起关系。
* 通过 pushEffect 创建一个 effect，并保存到当前 hooks 的 memoizedState 属性下。
* pushEffect 除了创建一个 effect ， 还有一个重要作用，就是如果存在多个 effect 或者 layoutEffect 会形成一个副作用链表，绑定在函数组件 fiber 的 updateQueue 上。
比如
```js
React.useEffect(()=>{
    console.log('第一个effect')
},[ props.a ])
React.useLayoutEffect(()=>{
    console.log('第二个effect')
},[])
React.useEffect(()=>{
    console.log('第三个effect')
    return () => {}
},[])
```

![](https://files.catbox.moe/8qrn80.png)

更新阶段
```js
function updateEffect(create,deps){
    const hook = updateWorkInProgressHook();
    if (areHookInputsEqual(nextDeps, prevDeps)) { /* 如果deps项没有发生变化，那么更新effect list就可以了，无须设置 HookHasEffect */
        pushEffect(hookEffectTag, create, destroy, nextDeps);
        return;
    } 
    /* 如果deps依赖项发生改变，赋予 effectTag ，在commit节点，就会再次执行我们的effect  */
    currentlyRenderingFiber.effectTag |= fiberEffectTag
    hook.memoizedState = pushEffect(HookHasEffect | hookEffectTag,create,destroy,nextDeps)
}
```
更新 effect 的过程非常简单。
* 就是判断 deps 项有没有发生变化，如果没有发生变化，更新副作用链表就可以了；如果发生变化，更新链表同时，打执行副作用的标签：`fiber => fiberEffectTag，hook => HookHasEffect`。在 commit 阶段就会根据这些标签，重新执行副作用。

React 会用不同的 EffectTag 来标记不同的 effect，对于useEffect 会标记 UpdateEffect | PassiveEffect， UpdateEffect 是证明此次更新需要更新 effect ，HookPassive 是 useEffect 的标识符，对于 useLayoutEffect 第一次更新会打上  HookLayout  的标识符。**React 就是在 commit 阶段，通过标识符，证明是 useEffect 还是 useLayoutEffect ，接下来 React 会同步处理 useLayoutEffect ，异步处理 useEffect** 。


如果函数组件需要更新副作用，会标记 UpdateEffect，至于哪个effect 需要更新，那就看 hooks 上有没有 HookHasEffect 标记，所以初始化或者 deps 不想等，就会给当前 hooks 标记上 HookHasEffect ，所以会执行组件的副作用钩子。


### 状态获取与缓存
#### ref
```js
function mountRef(initialValue) { /* 创建*/
  const hook = mountWorkInProgressHook();
  const ref = {current: initialValue};
  hook.memoizedState = ref; // 创建ref对象。
  return ref;
}
function updateRef(initialValue){
  const hook = updateWorkInProgressHook()
  return hook.memoizedState // 取出复用ref对象。
}
```

#### useMemo处理
```js
/* 挂载*/
function mountMemo(nextCreate,deps){
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
/*更新*/
function updateMemo(nextCreate,nextDeps){
    const hook = updateWorkInProgressHook();
    const prevState = hook.memoizedState; 
    const prevDeps = prevState[1]; // 之前保存的 deps 值
    if (areHookInputsEqual(nextDeps, prevDeps)) { //判断两次 deps 值
        return prevState[0];
    }
    const nextValue = nextCreate(); // 如果deps，发生改变，重新执行
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}
```
useMemo 更新流程就是对比两次的 dep 是否发生变化，如果没有发生变化，直接返回缓存值，如果发生变化，执行第一个参数函数，重新生成缓存值，缓存下来，供开发者使用。


# React生态
