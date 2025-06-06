

## 小窥

`中心化模型：redux`
Redux，可能这个状态库不怎么受欢迎，但是无法否认的是，这个状态管理库在很多地方用到。
Redux是中心化的模型：中心化模型指整个应用的状态被存储到一个单一的、全局的 Store 中（pinia也是中心化的）
优点：

- 可预测性：因为所有状态的操作都通过中心化的 Store 来进行的，所以整个状态的变更会变的更加可预测性。
- 易于调试：中心化的状态使得调试和状态监控变得容易。

缺点：

- 性能问题：由于所有状态都集中到单一的 Store 中，因此任何状态的更新都会导致整个状态树的更新，因此容易触发额外的 re-render，即使不相关的状态发生变化。
- 额外的模板代码：需要编写较多的模板代码，在应用的开发和维护中都带来了额外的成本。
- 较高的学习成本：学习曲线比较陡峭，有大量的概念和中间件需要学习。

`可变模型(mutable): Mobx、Valtio`
Mutable 指的是创建对象之后任何状态更新都是基于对原先对象的基础之上进行的，典型的比如 MobX、Valtio 都是属于此类
优点：

- 提升开发效率：Mutable 方案可以使得更新状态更加容易，尤其是在多层嵌套对象的更新上。同时由于基于 Mutable 方案下的状态管理库内部会基于 Proxy 来实现，会监听组件对于状态的使用情况，从而在更新状态时正确触发对应的组件完成 re-render，因此这种方案下我们可以认为性能默认就是最优的，不需要手动来优化。
- 容易理解：相比于 Immutable 方案，更容易学习和理解。

缺点：

- 因为 Mutable 方案内部采用 Proxy，因此过于黑盒，状态的更新没有那么透明，遇到问题可能比较难以排查。

`Immutable（不可变） 模型：Redux、Zustand、XState、Recoil、Jotai`

Immutable 指的是对象一旦创建就不能被修改，需要基于这个对象生成新的对象而保证原始对象不变，比如 Zustand、Jotai、Redux 都属于这一类。
```js
// Zustand
increment: () =>
  set((state) => ({
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1,
        },
      },
    },
  })),
```
优点：

- 可预测性：当状态发生变化时，这些变化是可以被追踪以及最终状态的更新结果是明确的。

缺点：

- 理解和开发成本：在更新状态时，尤其是多层嵌套的对象中会比较麻烦。不过我们可以结合 Immer(扁平化) 来解决这个问题。

`原子化模型：Jotai、Recoi`
优点：

- 精细的状态控制：原子化的设计模型维护各个原子状态以及原子之间的依赖交错关系，并通过原子之间的相互依赖关系阻止应用 re-render，提高性能。
- 方便组合和重用：各个原子可以相互组合和重用来共同构建整个应用的状态。

缺点：

- 额外的原子管理成本：由于状态被分散成了一个个切片的原子，因此如何拆分和维护较多的原子带来了额外的成本。

优化方案
根据优化方式可以分为三类：基于 selector、基于原子化模型、基于 Proxy 的自动优化。我们不能说那种方案是更好的，而是需要根据不同团队情况、产品情况来正确选择合适的方案，接下来我们分别介绍一下：

 基于 selector（React Redux、Zustand、XState）
 ```jsx
 const usePersonStore = create((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}))

function App() {
  const { firstName } = usePersonStore()
  return <div>firstName: {firstName}</div>
}
```
如果更新了lastName，firstname也会更新
这里我们通过解构的方式拿到了 `firstName` 的值，Zustand 是不知道组件真正用到了什么状态的，所以当 `lastName` 也会导致 `App` 重新渲染。那最佳实践应该是：
```jsx
function App() {
  const firstName = usePersonStore(state => state.firstName)
  return <div>firstName: {firstName}</div>
}
```

`基于原子之间的交错组合`
```jsx
const firstNameAtom = atom('')

const lastNameAtom = atom('')

const fullNameAtom = atom(get => {
  const firstName = get(firstNameAtom)
  const lastName = get(lastNameAtom)
  return firstName + lastName
})

function App() {
  const firstName = useAtomValue(firstNameAtom)
  return <div>firstName: {firstName}</div>
}
```
在 `App` 组件中我们只使用到了 `firstNameAtom`，那么由于我们并没有用到 `lastNameAtom` 状态，也没有用到 `fullNameAtom` ，当 `lastNameAtom` 状态发生变化是不会导致 `App` 组件重新渲染的。
用到fullName的话，lastname改变fullname也会改变

`基于Proxy自动优化（Mobx，Valtio)`

以 Valtio、Mobx 为首的基于 Mutable 的状态管理库：这类状态管理库内部采用 Proxy 来实现，会自动监听组件使用了哪些状态，只有这些状态变化才会触发组件 re-render。

而其中我们说 Zustand/Valtio 是 React “外部” 状态管理库，也就是说这些状态不基于 React Context 来分发 Store。所以当你的项目使用 SSR/RSC，可能需要谨慎考虑使用 Zustand/Valtio。