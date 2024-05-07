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
## React全部api解读

### 组件类
Component，PureComponent，memo，forwardRef，lazy，Suspense，Fragment，Profiler，StrictMode

#### Component
Component是类组件的基础，一切类组件都始于Component
```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

```

实例化时期
```js
function constructClassInstance(
    workInProgress,
    ctor,
    props
){
   const instance = new ctor(props, context);
    instance.updater = {
        isMounted,
        enqueueSetState(){
            /* setState 触发这里面的逻辑 */
        },
        enqueueReplaceState(){},
        enqueueForceUpdate(){
            /* forceUpdate 触发这里的逻辑 */
        }
    }
}

```
对于`Component`，实例化我们类组件，然后赋值`updater`对象，负责组件的更新。然后在组件各个阶段，执行类组件的`render`函数，和对应的生命周期函数就可以了。