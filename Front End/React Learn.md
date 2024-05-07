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
