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

- 字符串
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

