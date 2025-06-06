# React 源码学习

React 使用 js 写，但是使用了 flow 来进行类型标注

React 项目结构，包括:
examples
packages

### 初始化

```shell
mkdir my-react
cd my-react
pnpm i
```

然后创建 examples 目录，可以使用 vite 创建

```shell
pnpm create vite examples --template react-ts
```

最后创建 packages 目录，用于存放 React 的源码

```shell
mkdir packages
```

packages:

- react
- react-dom
- react-reconciler
- scheduler
- shared
  以上是最主要的几个包，这里使用的是 monorepo 架构，因此还需要创建
  `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
```

创建目录

```shell
mkdir react && cd react && pnpm init && cd ..
mkdir react-dom && cd react-dom && pnpm iniit && cd ..
mkdir react-reconciler && cd react-reconciLer && pnpm init && cd ..
mkdir scheduler && cd scheduler && pnpminit && cd ..
mkdir shared && cd shared && pnpm init && cd ..

```

创建公共依赖

```shell
pnpm add vitest -Dw
```

安装项目内的相互依赖

```shell
pnpm add shared --filter scheduler
```

React——Scheduler

React 16.3 引入了 Scheduler 包，用于调度任务，包括异步更新、动画、布局等。

场景:
在 React 应用运行过程当中,有一些任务要执行,这些任务分别有不同的优先级,比如从高优先级到低优先级分别为:**立即执行、用户阻塞级别、普通优先级、低优先级、闲置。**

比如

```ts
export type PriorityLevel = 0 | 1 | 2 | 3 | 4;

export const ImmediatePriority: PriorityLevel = 0;
export const UserBlockingPriority: PriorityLevel = 1;
export const NormalPriority: PriorityLevel = 2;
export const LowPriority: PriorityLevel = 3;
export const IdlePriority: PriorityLevel = 4;
```

在每一次只能执行一个任务的前提下，只能通过优先级来区分优先做哪些任务，但是只论优先级是不够的，会出现饥饿问题，甚至导致饿死。
因此 React 的调度器的核心是优先级+过期时间.

React 的 Scheduler 是一个单线程调度器，它将任务按照优先级和过期时间进行排序，然后按照顺序执行。（与 React 直接无关，执行调度任务的一个包）

可以当做一个 JS 实现的**单线程调度器**。
