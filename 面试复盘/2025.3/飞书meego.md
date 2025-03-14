
## 一面问题
1. 拷问实习，广告的变现是如何做到的
2. 问prefetch和preload的区别
	1. prefetch优先级更高，会立即加载，preload是空闲时候加载
3. esm和commonjs的区别
4. 优化库——tree-shaking的条件是啥
	1. esm
	2. 写入的模块
5. position的取值作用和区别
6. http状态码
	1. 100 200 300 400 500 （301和302说反了）
		1. 301是永久重定向，302是临时重定向
		2. 304协商缓存
7. 协商缓存的过程
8. 回流和重绘，之间还有什么流程（图层合并）
9. 宽度不定如何实现居中
10. css盒子模型
11. 浏览器有哪些进程
12. 渲染进程会做什么事情
13. 用过那些ts内置类型，有什么作用
14. 浏览器创建一个tab有什么进程
15. js有哪些基本数据类型
16. absolute父元素条件
17. map和obj的区别
	1. map的key和obj的key
	2. weakmap的key，以及和map的区别
18. 如何进行多人协作
19. git merge有偏向吗
20. react有哪些常用的hooks
21. useState是同步还是异步
22. react执行顺序
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


