
## 一面问题
1. 拷问实习，广告的变现是如何做到的
2. 问prefetch和preload的区别
	1. prefetch优先级更高，会立即加载，preload是空闲时候加载
3. esm和commonjs的区别
4. 优化库——tree-shaking的条件是啥
	1. esm
	2. **package.json的sideEffects标记**
	3. 构建工具支持
5. position的取值作用和区别
	1. static正常文档流
	2. relative，定位基准是自身的原始位置
	3. absolute，定位基准：最近的定位祖先元素（非static) 脱离文档流
	4. fixed：根据视口定位，脱离文档流
	5. sticky: 开始表现为relative达到阈值之后表现为fixed
6. http状态码
	1. 100 200 300 400 500 （301和302说反了）
		1. 301是永久重定向，302是临时重定向
		2. 304协商缓存
		3. 101  http->websocket
		4. 200资源正常返回包含强缓存
7. 协商缓存的过程
	1. if-modified-since做对比，强缓存的话
8. 回流和重绘，之间还有什么流程（图层合并）
	1. 浏览器渲染流程
		1. html解析为dom树，css解析为cssom，构建出dom & cssom树
		2. 根据dom和cssom构建出来渲染树
		3. 布局：渲染树构建完成之后，元素位置和应用样式确定了，需要计算出所有元素的大小和绝对位置
		4. 绘制：将布局结果转化为屏幕上的像素点，多个图层分层绘制
		5. 合成：将不同图层合并为最终图像，这个可以使用GPU加速处理，跳过布局和绘制阶段
	2. 回流(reflow):计算元素的几何属性（位置、尺寸），重新构建页面布局。
		1. 改变元素的几何信息：width，height，top，position等
		2. 内容变化（也会引起布局变化）
	3. 重绘(repaint):更新元素的可见样式（颜色、背景等），不改变布局。
		1. 颜色，背景，阴影，轮廓变化，不改变布局的情况下
	4. 合成：GPU 直接处理图层的变换，跳过布局和绘制阶段。
		1. gpu加速属性:transform
		2. 透明度
		3. 滤镜filter
		4. 图层提升：will-change:transform或者transform:translateZ(0)强制提升到合成层
9. 宽度不定如何实现居中
	1. 
10. 实现过虚拟列表吗，虚拟列表解决了什么问题
11. css盒子模型
12. 浏览器有哪些进程
13. 渲染进程会做什么事情
14. 用过那些ts内置类型，有什么作用
15. 浏览器创建一个tab有什么进程
16. js有哪些基本数据类型
17. absolute父元素条件
18. map和obj的区别
	1. map的key和obj的key
	2. weakmap的key，以及和map的区别
19. 如何进行多人协作
20. git merge有偏向吗
21. react有哪些常用的hooks
22. useState是同步还是异步
23. react执行顺序
	1. layoutEffect和effect的区别
	2. 为什么不能在if-else中调用hook
	3. hook的结构是什么样子的。
	   ```js
function App() {
  console.log('App')
  const [state, setState] = useState(0)
  useEffect(() => {
    setState(state => state + 1)
    setState(state => state + 2)
  }, [])

  useEffect(() => {
    console.log('useEffect 1')
    return () => {
      console.log('useEffect 1 cleanup')
    }
  }, [state])

  useEffect(() => {
    console.log('useEffect 2')
    return () => {
      console.log('useEffect 2 cleanup')
    }
  }, [state])

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return () => {
      console.log('useLayoutEffect cleanup')
    }
  }, [state])

  return <Sub state={state} />
}

function Sub({ state }) {
  console.log('Sub')

  useEffect(() => {
    console.log('sub useEffect')
    return () => {
      console.log('sub useEffect cleanup')
    }
  }, [state])

  return null
}


<App/>
```


-----
21. 算法题：实现一个 TS`Await<T>`或者 最近公共祖先
```ts

/** 在二叉树中查找两个节点最近公共祖先 */
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
  // 1.当前节点和左儿子，当前节点和右儿子， 不在当前节点，但是存在左儿子和右儿子
  let parent = null;
  const dfs = (node)=>{
     if(!node)return false;
      const left = dfs(node.left);
      const right = dfs(node.right);
      
      if((left && right) || ((left || right)&&(node === p ||node===q))){
          parent = node;
      }
      
      return left || right || node === p || node === q
   }
   dfs(root);
   return parent;
}
/**
    a.left->b b.left->c         eg: p->b  q->c
     
*/
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

class TreeNode{}
```


