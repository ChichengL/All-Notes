# 《深入理解react》之调度引擎——Scheduler
## 一、前面的话

时间过得真快，从2022年6月份react发布[18版本](https://github.com/facebook/react/tree/v18.2.0)以来(以下简称v18)，时间已经过去了近两年，很多伙伴都体验到了v18带来的新特性，其中并发模式最让人眼前一亮，只要我们使用`createRoot()`的方式来渲染我们的应用，就有机会体验到**并发模式**带来的极致爽感，而支撑并发模式的核心莫过于 react 执行流中的调度引擎——**Scheduler**。

`调度`其实并不是一个新词，在计算机行业中，从操作系统到浏览器，包括一些大型的应用层中都有调度任务的需求，调度这件事情的本质其实就是当面临很多独立的任务的时候，如何在**合理的时机**去执行它们。而今天我们研究的对象就是 Scheduler ，探索它是如何调度 react 产出的任务的。

让人兴奋的是 Scheduler 是一个独立的包，意味着它可以**独立**于 react 在任何其他的库中使用。更重要的是它的整个源码不过**600**多行，在深入理解react之前，将 Scheduler 吃透是一个很不错的选择，因为看懂它根本不用看完 react 那深似海的执行流，本文尝试以源码级等角度剖析一下 Scheduler 的实现过程，在深入理解 react 之前打下一个坚实的基础，读完本篇文章或许你会知道以下问题的答案？

1. 为什么需要Scheduler以及它解决了什么问题？
2. 什么是Scheduler中的优先级？
3. Scheduler使用什么数据结构维护任务的？
4. Scheduler是如何实现任务切分的？
5. Scheduler的执行流是什么样的？
6. 更多其他的......

话不多说，我们开始吧！

## 二、概念

### 为什么需要？

我们为什么需要调度器呢？

首先是解决卡顿问题，这来自于一个最基本的硬伤，js引擎和绘制渲染都是在同一个线程里面执行的，两者是互斥的，因此要保证用户正常使用不卡顿，屏幕必须要保证一定帧率的**刷新频率**，这个频率通常是每秒60帧。而由于 react 会产生一些CPU密集性的大任务，例如几万个**虚拟DOM**的diff、遍历等等。这种大任务会阻塞浏览器的绘制，导致页面**卡顿**。

其次是 react 会产生一些具有**优先级概念**的任务，优先级高的任务可能在后面产生，因此需要能够打断优先级低的任务，让优先级高的先执行。以更好的响应用户提高用户体验，比如用户点击，鼠标移动等。

以上就是 react 为什么需要一个调度器！

### 解决的问题

因此在react的执行流中，会产生非常多的任务，这些任务的执行时间有长有短，优先级有大有小。它们统统都会丢给Scheduler来进行处理，Scheduler会有一套自己的机制来决定该如何在合适的时机执行这些任务，来解决**CPU密集型**和**IO密集型**的场景。

## 三、体验

正如前面所说 Scheduler 可以单独使用，千言万语不如亲自试一试，因此我们可以直接创建一个工程来体验一下：

```sh
npm init
npm i scheduler -S
```

Scheduler 会暴露很多方法，其中最重要的就是这个 `unstable_scheduleCallback`，它的含义是以某种优先级去调度一个任务。

```js
// test.js
const { unstable_scheduleCallback } = require("scheduler")

const tasks = [1,1,2,2,3,3,4,4,1,2,3,4,1,2,3,4,3,2,1,1,1,1,1]

tasks.forEach((priority , i) => {
  unstable_scheduleCallback(priority , ()=>{
    console.log(priority , `第${i}任务`)
  })
})


console.log("script!")

Promise.resolve().then(res => console.log("script屁股后的微任务"))
```

上面的代码是将一些不同**优先级**（其中值越小优先级越高）的任务陆续交给 Scheduler 来调度，然后顺便测试下调度的执行时机的异步情况。 然后在 **nodejs** 中运行一下，结果如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/967ab7b6185440f5aeac79b02fe7b640~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=340&h=466&s=17768&e=png&b=000000)

通过结果我们可以得出结论，Scheduler 会按照优先级的顺序来执行给定的任务，优先级高的就会先执行，如果优先级相同的情况下再按照先注册优先执行。并且只要是交给 Scheduler 的任务都会异步执行，并且是在下一个宏任务中执行。（至于每一个任务是否都是在下一个宏任务，这个我们后面源码部分再了解，先留作疑问！）

> 小结：Scheduler 暴露了一些方法供用户使用，其中 `unstable_scheduleCallback` 可以按照优先级高的先执行来进行调度。

## 四、源码

接下来我们深入窥探一下源码，不过不用担心，我会将不重要的信息过滤掉，帮助大家理解其中最为核心的部分，但是当看完本篇文章，建议还是去细细看下源码，这样会更加的印象深刻，也可以用自己的思考验证一下笔者的理解是否正确。

### 小根堆

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4df6939138154cd3a555d9b3cbb81745~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=458&h=627&s=87508&e=png&b=fbfbfb)

熟悉算法与数据结构的同学对这个结构可以说相当了解了，小根堆的本质就是一棵二叉树，它的堆顶永远维持着最小值（业务中对应的就是优先级最高的任务），对外暴露3个方法，往堆中塞入一个元素，弹出堆顶元素，获取堆顶元素。

它的具体实现在[这里](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js)，如果对具体实现感兴趣的伙伴可以关注这个专栏，我后期会出一篇 react 中的算法的文章，来详细剖析一下它们的细节，但在这里可以把它当成一个黑盒就好了。

```js

// 比较策略
function compare(a, b) { // 使用节点的 sortIndex作为判断依据 ，如果比较不了，就是用ID，也就是顺序了
  // Compare sort index first, then task id.
  var diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

```

Scheduler 是使用上面得比较策略来维护堆顶元素的。

### 优先级

在 Scheduler 中有5种[优先级](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerPriorities.js)

```js
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;
```

每一种优先级都对应了相应的过期时间

```js
var IMMEDIATE_PRIORITY_TIMEOUT = -1; 
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; 
var maxSigned31BitInt = 1073741823; 
```

### 入口

首先了解几个重要的全局变量

```js
var taskQueue = []; // 任务队列 
var timerQueue = []; // 延时队列

var taskIdCounter = 1; // 任务id.
var currentTask = null; // 当前正在进行的任务
var currentPriorityLevel = NormalPriority; // 当前任务的优先级

var isPerformingWork = false; // 是否在执行flushWork函数
var isHostCallbackScheduled = false; // 是否有任务在调度
var isHostTimeoutScheduled = false; // 是否有定时器来调度延时任务
```

`taskQueue` 和 `timerQueue` 本质上是一个小根堆，只不过使用数组来实现这个小根堆而已。接下来看入口函数

```js
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now(); // 获取当前时间
  var startTime;

  if (typeof options === 'object' && options !== null) { // 只有在options的情况下才会走这里
    ...
  } else {
    startTime = currentTime;
  }

  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT; // -1
      break;

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT; //250
      break;

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT; // 12天 很大很大
      break;

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT; // 10000ms
      break;

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT; // 5000ms
      break;
  }

  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) { // 只有在有delay的情况下，才会成立，一般情况下都是等于。
    ...
  } else {
    newTask.sortIndex = expirationTime; // sortIndex其实就是过期时间，越早过期（数值越小）越先执行。
    push(taskQueue, newTask); // 放入taskQueue
    if (!isHostCallbackScheduled && !isPerformingWork) { 
      // 第一个任务的时候会走这里，因为默认既没有调度日任务，也没有执行flushWork函数
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}
```

这段代码理解起来并不难，总的来说做了3件事情：

1. 根据已知信息创建一个Task任务，也就是一个**Task类型**的对象
2. 将该 task 放入小根堆中
3. 如果是第一个任务，那么执行 `requestHostCallback(flushWork)` 进行调度

### 如何调度

那么 `requestHostCallback` 做了什么呢？

```js
function requestHostCallback(callback) {
  scheduledHostCallback = callback; // 其实就是flushWork

  if (!isMessageLoopRunning) { // 这个变量代表是否有宏任务在执行
    isMessageLoopRunning = true; // 如果没有去唤醒下一个宏任务
    schedulePerformWorkUntilDeadline();
  }
}
```

当第一个任务被流入 Scheduler 期间是没有正在进行的宏任务的，因此可以看看 `schedulePerformWorkUntilDeadline` 发生了什么

```js
schedulePerformWorkUntilDeadline = function () {
    port.postMessage(null);
};
```

Scheduler 用了很多补丁来实现这个 `schedulePerformWorkUntilDeadline`，但是现代浏览器基本上都支持 [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) ，因此调用它意味着会在下一个宏任务的时候唤醒注册在另外一个**port**的回调函数。也就是这一个 `channel.port1.onmessage = performWorkUntilDeadline;`

```js
var performWorkUntilDeadline = function () {
  if (scheduledHostCallback !== null) { // 其实也就是之前赋值的flushWork
    var currentTime = exports.unstable_now();// 获取当前的时间
    startTime = currentTime;  //全局的startTime，用来记录当前这批任务的调度开始时间，用来判断是否用完切片用的。
    var hasTimeRemaining = true; // 永远只可能为true.
    var hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime); // 也就是执行flushWork
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline(); // 如果task队列中还有，继续在下一个宏任务中调度
      } else {
        // 如果清空了队列，清空一下全局变量。
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  } 
};
```

`performWorkUntilDeadline` 其实就是做了一件事情，执行 `flushWork`，我们来看下它做了什么：

```js
function flushWork(hasTimeRemaining, initialTime) { // initialTime是这一批任务的开始时间
  isHostCallbackScheduled = false; // 这个变量只有在flushWork的时候才会被释放。
  isPerformingWork = true;
  var previousPriorityLevel = currentPriorityLevel;
  try {
    ...
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}
```

`flushWork` 其实也仅仅只是调用了 `workLoop`，而 `workLoop` 才是调度的核心。

```js
function workLoop(hasTimeRemaining, initialTime) {
  var currentTime = initialTime;
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
      // 如果 expriationTime > currentTime 说明任务还没有过期，否则过期了，过期了会尽可能早点执行，因此不会进入到这里
      // 没有过期的情况下 ， hasTimeRemaining 一般情况下就是为true，所以主要是看 shouldYieldToHost 结构，返回true（说明时间片已经用完了，需要异步执行）进入到这里，否则
      break;
    }

    var callback = currentTask.callback;

    if (typeof callback === 'function') {
      currentTask.callback = null; // 如果当前任务的函数置为null
      currentPriorityLevel = currentTask.priorityLevel;
      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime; // 说明当前任务过期了，
      var continuationCallback = callback(didUserCallbackTimeout); // 这个才是真正用户提供的任务函数
      currentTime = exports.unstable_now();

      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback; // 可能会继续执行。
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }

      ...
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  } 

  if (currentTask !== null) {
    return true;
  } 
  return false
}
```

这个函数的逻辑是 Scheduler 的核心，我们一点一点来理解。

根据我们之前的分析，当执行流进入到 `workLoop` 的时候意味着已经是下一个宏任务了

![Snipaste_2024-03-20_20-58-43.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/246c1efb4d874cbabb5180c329115683~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=269&h=531&s=12579&e=png&b=fdfdfd)

因此由于在 Script 当中我们已经把不同优先级的任务都**同步的**注册完了，因此来到 `workLoop` 的时候堆中应该是有多个任务才对，并且按照优先级大小顺序排列的。

### 小任务

Scheduler 并没有采取每一个宏任务只完成一个**task**这样的策略，因为这样性能明显不会很好，因为有的任务可能耗时很短，如果留有很大的一块宏任务区间只完成一个很小的任务难免有些浪费，因此 Scheduler 会合并这些小任务在一个宏任务中一起完成，方法就是调度过程中使用一个 `while` 循环来依次取出 `taskQueue` 中的任务，并执行它们。

因此 Scheduler 当遇到小任务的时候，采取的策略是在同一个时间片内一起执行，直到它们的累计时长超过了规定的阈值之后才让出主线程。这个阈值在 Scheduler 中是5ms，我们可以在[源码](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerFeatureFlags.js#L12C13-L12C31)中窥探的到。

```js
var frameYieldMs = 5; // 切片大小
```

判断的方法就是 `shouldYieldToHost`

```js
var frameInterval = frameYieldMs;
function shouldYieldToHost() {
  var timeElapsed = exports.unstable_now() - startTime;
  if (timeElapsed < frameInterval) {
    return false; // 说明不应该中断，时间片还没有用完
  } 
  return true; // 说明时间片已经用完了
}
```

因为我们知道这一批任务开始的时间，只要所有任务加起来的时间超过 **5ms** 我们就认为要交出主线程了，所以把 `while` 循环 `break` 掉。

最后判断一下 `taskQueue` 中是还存有任务，如果存在返回 true，否则返回 false，这个决定 `performWorkUntilDeadline` 中的 `hasMoreTask` 是否继续调度（可以翻翻看看前面的分析），直到把队列清空为止，而整个过程都是在宏任务中异步完成，根本不会阻塞主线程渲染UI ，自然也就不会使用户感受到卡顿了。

---

### 大任务

但是并不是所有的任务都是小任务啊，有的任务很大，可能远远超过5ms，这个时候该怎么办呢？

实际上，有两种可能，第一种就是用户不管它，直接把这个大任务交给 Scheduler 来进行调度，结果就是 workLoop 在执行完这个任务的时候，已经花了不少时间，下一个任务会 `break` 掉 `while` 循环，然后在下一个任务会在下一个宏任务中调度执行，但是在这个大任务在执行过程中就会阻塞UI 的绘制，影响用户体验。

第二种就是用户可以利用 Scheduler 的 `shouldYieldToHost` 方法来对大任务进行拆分，将大任务拆称为一个个的小任务然后交给 Scheduler 来执行，这样的话就不会阻塞主线程绘制UI，获得更流畅的用户体验了，这个该如何去做呢？

这个就需要用户在使用 Scheduler 的时候对大任务的执行方式做一个设计，例如一个同步执行的大任务可以选择将其拆分为若干个独立的小任务用循环去执行，通过类似下面这样的**范式**就可以做到：

```js

let current = 0;
let count = 100000;
const bigWork = ()=>{
    while( current < count && !shouldYieldToHost() ){
        doUnitWork();
        count ++;
    }
    
    if(current < count){
      // 说明任务还没做完，但是时间片已经到了
      return bigWork;
    }
    
    return null;
}

```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59e353b8dbd24ca3bee6832d5e56a8f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=510&h=768&s=33707&e=png&b=fdfdfd)

用户需要将大任务以上面的范式进行改进，然后将大任务拆成极小的细粒度的小任务，然后每次执行小任务的时候都看一下是否用完了5ms的时间片，如果用完了就结束执行，这时候大任务可能还没有执行完，但是因为全局变量保存了大任务的执行进度因此并不会丢失掉信息，然后返回函数本身，这个时候我们再来看一下 Scheduler 是如何处理这种情况的。

```js
// workLoop 函数内部

var continuationCallback = callback(didUserCallbackTimeout); // 执行过后
currentTime = getCurrentTime();
if (typeof continuationCallback === "function") {
  currentTask.callback = continuationCallback;
} else {
  if (currentTask === peek(taskQueue)) {
    pop(taskQueue);
  }
}
```

可以看到当函数有返回值且返回值为一个函数的时候，本来清空的又会被赋值为该函数，并且最重要一点本次执行的任务不会在 `taskQueue` 中被移除，那么继续往下走，就会在下一个宏任务中被继续调度，因为上一次执行的大任务依然在堆顶，所以这一次执行的依然是它，借助全局变量中保存的信息，任务便会被回复执行，这样即便在大任务的情况下也不会阻塞UI的绘制了。

事实上 react 的并发模式就是通过这样的方式来实现大任务的更新的，如下所示：

```js
function workLoopConcurrent() {
    // Perform work until Scheduler asks us to yield
    while (workInProgress !== null && !shouldYield()) {
      performUnitOfWork(workInProgress); // 处理每一个fiber节点
    }
 }
```

> 小结：  
> 我们通过上面内容知道了 workLoop 的工作流程，Scheduler 的调度流程的主要核心宗旨就是在不阻塞浏览器绘制的大前提下尽可能多的执行任务。如果用户提供的任务很小（耗时短）就会合并起来批量同步执行，如果任务比较大需要用户配合着 Scheduler 将任务拆分成若干小任务分批次的执行。总而言之，Scheduler 总会恰到好处的将我们的给定的任务按照优先级尽快的执行，且并不阻碍UI的绘制。

---

### 饥饿问题

在任务调度的话题里永远都有一个饥饿问题，意思是说在调度器接受到一堆任务之后，它们就会按照优先级的大小排列起来，当调度器取出一个最高优先级的任务执行的过程中，也是有可能继续往队列里面填充任务的，如果这个最高优先级产生的任务的优先级永远都比其他任务优先级高，那其他的低优先级任务就永远不可能得到执行，相当于在排队过程中一直有人插队，这就是著名的**饥饿问题**， Scheduler 是如何解决这个问题的呢？

正如上面所说在 Scheduler 中是用小根堆来维护优先级队列的，我们再来看一下入队列的代码：

```JS
// 简化后的代码
function unstable_scheduleCallback(priorityLevel, callback, options) {
  ...
  var startTime = exports.unstable_now();
  var timeout = 根据优先级确定一个值 // -1 | 250 | 1000 | 5000 | 12 天
  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  newTask.sortIndex = expirationTime;
  push(taskQueue, newTask); 
  ...

  return newTask;
}

```

决定在堆中是否处于高位的核心是 `sortIndex` ，也就是取决于 `expirationTime` 的大小，而它由两部分构成，分别是 `startTime` 和 `timeout` ，我们可以想象一下，当一个低优先级任务进到队列里的时候，其实随着时间的推移它的优先级会越来越高的，因为优先级的值越小优先级越高，随着时间的推移后进来的任务即便优先级比较高，但是 `startTime` 的值会越来越大的，因此意味着后来者它们一出生就带着更重的负担，相对而言，原来优先级低的任务它们因为先进入队列所以就显得优先级在逐步升高了。

Scheduler 体系下的优先级并不是一个一锤子买卖，在调度任务的过程中它们的优先级也会**动态**的调整。

我们甚至可以推断，当一个优先级到了过期时间之后，它一定会处于堆顶，新进来的任务无论优先级多高都不可能再超越它了。

我们举个简单例子来说明这一点：

例如刚开始有两个任务 A1 B2。

字母代表任务名，数字代表优先级。假设刚开始 startTime 的值为 100，那么在堆中应该是这样的。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78614b1cdc0c4223b27396172d62c420~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=334&h=392&s=16781&e=png&b=fcfcfc)

然后根据我们之前分析的调度策略，A1 被取出来执行，假设它花了300ms ，在它任务的末尾又添加了一个优先级为1的任务 C1 ，这个时候在计算 C1 的sortIndex 的时候，就会取当前时间 `startTime` ，由于经过了250ms，所以当前时间一定大于或等于 400 ，最终计算得到的 stortIndex 必然是要高于350的，因此即便后来者优先级再高都不会超过 B2 ，所以B2就会在下一个周期中优先执行。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ada50fa23d2145458001d0a638467016~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=224&h=357&s=12702&e=png&b=fcfcfc)

> 小结  
> 在 Scheduler 中优先级并不是一成不变的，而是在调度过程中动态分配变化的

## 五、最后的话

实际上 Scheduler 中一共维护了两个队列，本文并没有提到关于 `timerQueue` 的相关信息，那是因为在 react 的调度流程中基本不会涉及到 `timerQueue` 所以如果单纯理解 react 其实以上的知识已经足够，出于篇幅原因，timerQueue 相关的信息我会在后续的文章中进行详细分析。



# 《深入理解react》之hooks原理

## 一、前面的话

`hooks`是react的一个标志性的特点，它是react拥抱函数式编程的一个重要的突破；通过使用`hooks`，我们可以让一个函数式组件也能够有自己的状态，相信大家在平常开发中都已经感受到`hooks`所带来的收益了，本篇文章就来探究一下hooks的工作原理，以及如何优雅的使用`hooks`，耐心看完本篇文章你能够对下面的问题有更加深入的理解：

1. `useState`的状态保存在哪里？
2. 函数式组件是怎么维护多个`hook`的?
3. `useEffect`的依赖是如何起作用的？
4. 其他更多的内容...

废话不多说我们开始吧！

## 二、useState

当我们的组件进入`render`阶段的时候会调用`renderWithHooks`，在这里会调用我们定义的组件，我们的写在函数中的各种各样的hook也就会被调用了，在前面的文章中我们提到过react会将hooks的引用对象设置为真正的引用对象，如果是初始化（也就是第一次调用`renderWithHooks`）的时候会将引用对象置为`HooksDispatcherOnMountInDEV`，它身上就是初始化的时候的各种hooks对象，就像下面这个样子：

```js
HooksDispatcherOnMountInDEV = {
      readContext: function (context) { ... },
      useCallback: function (callback, deps) {...},
      useContext: function (context) {...},
      useEffect: function (create, deps) {...},
      useImperativeHandle: function (ref, create, deps) {...},
      ...
      useState: function (initialState) {...},
      ...
};
```

### 初始化

我们首先就来看一下`useState`是如何实现的，他在初始化时会执行的代码如下：

```js
function (initialState) {
    currentHookNameInDev = "useState";
    var prevDispatcher = ReactCurrentDispatcher$1.current;
    ReactCurrentDispatcher$1.current =
      InvalidNestedHooksDispatcherOnMountInDEV;
    try {
      return mountState(initialState);
    } finally {
      ReactCurrentDispatcher$1.current = prevDispatcher;
    }
}
```

直接返回`mountState`对应的值

```js
function mountState(initialState) {
    // 1 创建hook对象
    var hook = mountWorkInProgressHook();
    if (typeof initialState === "function") {
      // $FlowFixMe: Flow doesn't like mixed types
      initialState = initialState();
    }
   
    hook.memoizedState = hook.baseState = initialState;
    // 创建一个更新队列
    var queue = {
      pending: null,
      interleaved: null,
      lanes: NoLanes,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: initialState,
    };
    hook.queue = queue;
    // 返回dispatchSetState
    var dispatch = (queue.dispatch = dispatchSetState.bind(
      null,
      currentlyRenderingFiber$1, // 这个就是组件对应的那个fiber对象
      queue
    ));
    return [hook.memoizedState, dispatch];
}
```

在初始化时的步骤有这么几个过程：

1. 创建hook对象
2. 返回初始值，以及dispatch函数，并将其与当前的fiber关联起来

我们来看一下hook是什么样子的

```js
function mountWorkInProgressHook() {
    var hook = {
      memoizedState: null, // 当前hook的状态
      baseState: null, // 前提状态
      baseQueue: null, // 前提更新队列
      queue: null, // 当前hook的更新队列
      next: null, // 下一个hook
    };
    if (workInProgressHook === null) {// 说明第一个hook
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
    } else {// 将其添加到上一个hook的next指针后
      workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}
```

我们可以看到hook的对象有基本5个属性，我依次解释一下：

1. `memoizedState` 代表的是当前hook的状态，也是直接返回给用户消费的值
2. `baseState` 代表的是本次更新的基本状态，它只会存在于前一次有一个高优先级更新任务导致某次更新被跳过的情况
3. `baseQueue` 同样是代表的是本次更新的基本队列，和2一样它们是一起使用的
4. `queue` 代表的是本次更新队列
5. `next` 代表的是下一个`hook`对象

从这点我们可以看出其实函数式组件是使用一个**单向链表**来维护函数中的hooks的，如果我们定义了以下的状态：

```js
import React, { useState } from 'react';

const ExampleComponent = () => {
  // 定义状态Hook a
  const [a, setA] = useState('初始值A');

  // 定义状态Hook b
  const [b, setB] = useState(0);

  // 定义状态Hook c
  const [c, setC] = useState({ key: '初始值C' });

  // 定义状态Hook d
  const [d, setD] = useState(['初始值D']);

  return (
    <div>
      ...
    </div>
  );
};

export default ExampleComponent;
```

在`ExampleComponent`对应的`fiber`对象身上就会有这样的一个hook链表了

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/592d7c875dde459c937ca3a5316de66b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=413&h=432&s=21164&e=png&b=fdfdfd)

紧接着，每个`useState`类型的hook身上都会在初始化时挂一个空的更新队列的链表，这个和我们之前在专栏讲到的`updateQueue`结构是一致的。

当我们创建好hook对象之后，然后将用户给的初始值赋值给`hook`对象的`memoizedState`身上，然后返回`dispatchSetState`就好了，至于`dispatchSetState`到底是什么我们可以后面再分析，通过上面的分析，我们可以得出一个结论，函数式组件的状态实际上是保存在`fiber`的`hook`对象身上的

### dispatchSetState

当初始化结束后，用户通常可以通过某些交互来触发更新，触发更新时会调用`dispatchSetState`，也就是用户定义的`setXXX`，一般情况下它会做以下几件事情：

1. 创建更新优先级
2. 创建更新对象
3. 将更新对象加入当前`hook`对象的更新队列中，形成一个环形链
    
    > 专栏的[《深入理解react》之优先级（上）](https://juejin.cn/post/7352079364610916371)有对这个链表形成过程做了详细表述，这里就不啰嗦了
    
4. 从当前发生更新的地方顺着自己的祖先节点打标签
5. 调度更新

这个就是`dispatchSetState`触发更新的过程，然后进入到更新流程的`render`阶段

### 更新

在更新时，`render`阶段也会执行`renderWithHooks`去生成最新的`ReactElement`，这个时候调用的`hook列表`就不是初始化时的了，而是更新时的，如下所示：

```js

HooksDispatcherOnUpdateInDEV = {
  readContext: function (context) { ... },
  useCallback: function (callback, deps) {...},
  useContext: function (context) {...},
  useEffect: function (create, deps) {...},
  useImperativeHandle: function (ref, create, deps) {...},
  ...
  useState: function (initialState) {...},
  ... 
};
```

更新时的`useState`的实现如下：

```js
function (initialState) {
    ...
    try {
      return updateState(initialState);
    } finally {
      ReactCurrentDispatcher$1.current = prevDispatcher;
    }
}
```

`updateState`会直接调用`updateReducer`，下面看看`updateReducer`的实现，

```js
function updateReducer(reducer, initialArg, init) {
    var hook = updateWorkInProgressHook(); // 获取当前workInProgress的hook对象；
    var queue = hook.queue; // 获取这个hook对象的更新队列
    queue.lastRenderedReducer = reducer; // 默认计算逻辑，setXX(fn) 传入函数时采用的到
    var current = currentHook; // 全局变量，保存的是程序当前来到的hook对象，用户setXX()时其实是将update对象保存在此时的current树上的，所以关键要获取这个来进行后面的状态计算
    var baseQueue = current.baseQueue; // 初始化是 null，这个是前一次被调过的优先级队列，暂时可以不管，特殊场景下才会用到
    // 这就是
    var pendingQueue = queue.pending; // 更新队列

    if (pendingQueue !== null) {
      ...
      current.baseQueue = baseQueue = pendingQueue;
      queue.pending = null;
    }

    if (baseQueue !== null) { // 会进入到这里，进行状态计算
      var first = baseQueue.next;
      var newState = current.baseState;
      var newBaseState = null;
      var newBaseQueueFirst = null;
      var newBaseQueueLast = null;
      var update = first;

      do {
        var updateLane = update.lane;

        if (!isSubsetOfLanes(renderLanes, updateLane)) { // 跳过优先级的情况
          ...
        } else {
          ...
          if (update.hasEagerState) {
            newState = update.eagerState;  // 如果是 setXX('xx') 这样的简单类型 走这里
          } else {
            var action = update.action;
            newState = reducer(newState, action); // 如果是 setXX(fn) 这样的函数 走这里
          }
        }

        update = update.next;
      } while (update !== null && update !== first);

      ...

      hook.memoizedState = newState;
      hook.baseState = newBaseState;
      hook.baseQueue = newBaseQueueLast;
      queue.lastRenderedState = newState;
    } 
    ...

    var dispatch = queue.dispatch;
    return [hook.memoizedState, dispatch];
 }

```

在上面可以看到，其实本次更新流程中，核心是将更新队列进行遍历然后来做状态的计算，得到最新的`状态`，然后返回给组件，让组件去消费，只有这样的才能是基于最新状态的`ReactElement`

以上便是`useState`的核心实现，如果用伪代码来表示就像下面这个样子：

```js
const fiber = {
  state:状态信息
}

function useState(){
  reurn [fiber.state , setState]
}

function setState(xxx){
  fiber.state = xxx
  调度
}

function Component(){
  const [ , setState] = useState();
  return 界面
}
```

形象点表示就是下图

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d69e1ce8adb645b8bf63b5ce5b511ddd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=412&h=305&s=17789&e=png&b=fdfdfd)

## 三、useEffect

所有的hook在更新时和初始化时函数的实现都不相同，因此我们依然分别来看一下

### mount

在`mount`阶段，`useEffect`的实现是这样的

```js
function (create, deps) { // 其中create是用户定义的函数，deps是依赖项
   return mountEffect(create, deps);
}
```

然后会执行这个`mountEffectImpl(Passive | PassiveStatic, Passive$1, create, deps)`，注意看，在这个过程中传入了`Passive`这个副作用

```js
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = mountWorkInProgressHook(); // 创建hook对象
    var nextDeps = deps === undefined ? null : deps;
    currentlyRenderingFiber$1.flags |= fiberFlags;
    hook.memoizedState = pushEffect(HasEffect | hookFlags, create, undefined, nextDeps);
}
```

`mountWorkInProgressHook`这个我们在前面分析过了，其实就是创建一个hook对象，除了这一点，很重要的一点就是给当前的这个fiber对象打上了含有`Passive`的标签，方便在`commit`进行消费，因此我们可以得出一个结论，**但凡是我们的函数式组件使用了`useEffect`这样的`hook`，那么在都会被打上含有`Passive`副作用的标签**

最重要的是第三步，封装`effect`，我们来看一下`pushEffect`的实现

```js
function pushEffect(tag, create, destroy, deps) { 
    var effect = {
      tag: tag, // tag为含有Passive的副作用常量
      create: create, // 一个函数
      destroy: destroy, // 暂时是undefined
      deps: deps, // 依赖项
      // Circular
      next: null // 很显然，它是一个链表
    };
    var componentUpdateQueue = currentlyRenderingFiber$1.updateQueue; // 更新队列

    if (componentUpdateQueue === null) { // 第一个hook的时候是null
      componentUpdateQueue = createFunctionComponentUpdateQueue(); 创建一个 { lastEffect: link , stores:null } 这样的对象
      currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else { // 如果存在queue
      var lastEffect = componentUpdateQueue.lastEffect;
      if (lastEffect === null) { // 构建环形链表
        componentUpdateQueue.lastEffect = effect.next = effect;
      } else { // 
        var firstEffect = lastEffect.next;
        lastEffect.next = effect;
        effect.next = firstEffect;
        componentUpdateQueue.lastEffect = effect;
      }
    }

    return effect;
  }
```

通过这一步我们可以发现，当我们在函数式组件中声明多个hook的时候，会形成一个环形链表，并且这个环形链表会由当前`fiber`的`updateQueue`引用

总而言之，假设我们当前书写了以下的`useEffect`列表

```js
function FunctionComponent(){
    useEffect(...); // 1
    useEffect(...); // 2
    useEffect(...); // 3
    useEffect(...); // 4
    return ...
}

```

在内存中就会有下面的结构

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cee247f795504d0cba317c900f869de9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=590&h=421&s=38140&e=png&b=fdfdfd)

### 更新

无论是初始化还是更新其实都是给新构建的这棵fiber树中的fiber挂上这个副作用的effect链表，因此更新时做的事情和mount时是差不多的

```js
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = updateWorkInProgressHook();
    var nextDeps = deps === undefined ? null : deps;
    var destroy = undefined;

    if (currentHook !== null) { // 更新时，存在的
      var prevEffect = currentHook.memoizedState;
      destroy = prevEffect.destroy;

      if (nextDeps !== null) {
        var prevDeps = prevEffect.deps; // nextDeps实际上就是依赖最新的值
        if (areHookInputsEqual(nextDeps, prevDeps)) { // 如果不一致，需要将新的依赖项放入这个链表中
          hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
          return;
        }
      }
    }

    currentlyRenderingFiber$1.flags |= fiberFlags;
    hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps);
 }
```

但是在更新时需要判断一下，依赖项是否和之前是一致的，一致就说明依赖没变，在本次更新中不用执行`hook`对应的函数，他的实现是通过给`effect`，传递不同的`tag`来实现的，还记得吗，初始化时给`pushEffect`传递的是`HasEffect | hookFlags`，而如果依赖项不变则仅仅传递`hookFlags`，方便在commit阶段判定不执行相应的`hook函数`。

### 执行副作用

调用`useEffect`hook实际上仅仅只是将相关信息保存在fiber上，然后打上标签，真正执行副作用的时候是在`commit`阶段，因此`useEffect`的实现是`render`流程和`commit`流程配合在一起实现的

在[《深入理解react》之commit阶段](https://juejin.cn/post/7355448283227570202) 这篇文章中我们有提到过`useEffect`会通过`flushPassiveEffects`异步执行，因此我们可以直接看它是怎么做的，具体的行为在`commitHookEffectListMount`里

```js
function commitHookEffectListMount(flags, finishedWork) {
    var updateQueue = finishedWork.updateQueue;
    // 获取fiber身上的副作用链表
    var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    // 判断
    if (lastEffect !== null) {
      var firstEffect = lastEffect.next;
      var effect = firstEffect;
      do {
        if ((effect.tag & flags) === flags) { // 判断与之前的tag是否相同，相同才往下走，依赖项未变的则不会进入下面，也就不会执行下面的逻辑 ， useLayoutEffect对应的也不会走这里
          var create = effect.create;
          effect.destroy = create();
          ...
        }

        effect = effect.next;
      } while (effect !== firstEffect);
    }
  }
```

逻辑非常清晰本质上就是获取fiber身上的副作用链表，然后依次执行，凡是遇到依赖项未变的或者`useLayoutEffect`的hook就跳过，此时用户书写的符合条件的就会在这里执行啦！

## 四、useLayoutEffect

其实到这里大家或许已经猜到`useLayoutEffect`的实现原理，它与`useEffect`的语法完全相同，无非就是副作用的执行时机不同而已

`useLayoutEffect`的执行时机在commit阶段的`Mutation`中，属于在DOM变更后同步执行，而`useEffect`属于在`beforeMutation`之前就开始调度了，但是因为是异步执行，因此`useLayoutEffect`要晚，且不阻塞DOM绘制，而`useLayoutEffect`如果含有CPU密集型计算会阻塞UI的绘制

在`useLayoutEffct`的初始化过程中，调用的实现与`useEffect`都相同，仅仅是用一个不同的副作用标签将其区分开来而已

```js
function mountLayoutEffect(create, deps) {
    var fiberFlags = Update;
    {
      fiberFlags |= LayoutStatic;
    }
    return mountEffectImpl(fiberFlags, Layout, create, deps);
}
```

这样`commit`阶段就能够通过不同的标签区分当前的`effect`是否应该在该阶段执行了，我们用伪代码来表示就像下面这个样子：

```js
function commit(){ // commit阶段

   异步执行(()=> {
      1. 遍历fiber树
      2. 获取当前fiber树的updateQueue，也就是副作用链表
      3. 遍历整个链表
      4. 如果遇到Layout的不执行，依赖不变的不执行，仅仅执行Passive的副作用
   })
    
   // Mutation 阶段
   各种DOM操作
  
   1. 遍历fiber树
   2. 获取当前fiber树的updateQueue，也就是副作用链表
   3. 遍历整个链表
   4. 如果遇到Passive的不执行，依赖不变的不执行，仅仅执行Layout的副作用
   
   ...
}

```

## 五、useMemo & useCallback

这两个hook的原理基本上是差不多的，我们可以一起来介绍，和前面我们介绍的hooks一样，分为初始化和更新两种场景

### 初始化

`useMemo`的初始化会调用`mountMemo`

```js
function mountMemo(nextCreate, deps) {
    var hook = mountWorkInProgressHook(); // 创建当前的hook对象，并且接在fiber的hook链表后面
    var nextDeps = deps === undefined ? null : deps;
    var nextValue = nextCreate();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}
```

`mountWorkInProgressHook`在上一篇已经分析过了，大部分的`hook`初始化时都要调用这个来创建自己的`hook`对象，但是也会有例外的情况，比如`useContext`，我们后面再说；第一次执行`useMemo`都要调用用户提供的函数，得到需要缓存的值，将依赖和值都放在`hook`的`memoizedState`身上

`useCallback`的初始化会调用`mountCallback`

```js
function mountCallback(callback, deps) {
    var hook = mountWorkInProgressHook();
    var nextDeps = deps === undefined ? null : deps;
    hook.memoizedState = [callback, nextDeps];
    return callback;
}
```

可以看到唯一的区别就是`useCallback`会把传递进来的函数直接缓存起来，而不进行调用求值，经过初始化后组件对应的fiber节点上就保存着对应的`hook`信息，而缓存的函数和值也会被保存在这个`hook`中

### 更新

`useMemo`在更新时实际上会调用`updateMemo`，它的实现如下：

```js
function updateMemo(nextCreate, deps) {
    var hook = updateWorkInProgressHook(); // 基于current创建workInProgress的hook对象
    var nextDeps = deps === undefined ? null : deps; // 获取最新的依赖值
    var prevState = hook.memoizedState; // 老的缓存的值

    if (prevState !== null) {
      if (nextDeps !== null) {
        var prevDeps = prevState[1];

        if (areHookInputsEqual(nextDeps, prevDeps)) { // 比较最新的依赖值
          return prevState[0]; // 如果相同，说明直接返回缓存中的就好了
        }
      }
    }
    // 说明依赖不同，重新计算
    var nextValue = nextCreate();
    // 再次存入对应的hook对象中
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}
```

每次更新的时候，都会通过`areHookInputsEqual`来判断依赖是否发生了变化，`areHookInputsEqual`会比较这个数组中的每一项，看是否与原来的保持一致，有任何一个不同都会返回`false`，导致重新计算。

```js
function areHookInputsEqual(nextDeps, prevDeps) {
   for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
      if (objectIs(nextDeps[i], prevDeps[i]) /*判断是否相等*/) {
        continue;
      }
      return false;
   }
   return true;
}
```

缓存的核心原理就是`workInProgress`的hook对象中的`memoizedState`是直接复用的原来的`hook`对象，因此相关的信息得以被完整的保存下来，只有在需要更新的时候才进行替换 ，`useCallback`的更新逻辑和`useMemo`的逻辑是一样的，在这里就不多花更多的篇幅去介绍了

## 六、useRef

接下来我们来看一下`useRef`的基本原理，我们先来回顾一下`useRef`的作用，它是一个用于保存数据的引用，可以作为基本类型、复杂类型、DOM元素、类组件实例等数据的引用，用于存储的值，在组件更新过程中始终保持一致，因此非常适合用于保存需要持久化的数据。

### 初始化

初始化时会通过`mountRef`来创建引用对象

```js
function mountRef(initialValue) {
    var hook = mountWorkInProgressHook();// 创建hook对象
    {
      var _ref2 = { // 创建ref对象
        current: initialValue,
      };
      hook.memoizedState = _ref2; //将其保存在hook的memoizedState上
      return _ref2; // 返回
    }
 }
```

初始化的逻辑很简单，创建一个`ref`对象，将其保存在对应`hook`的`memoizedState`属性身上。

### 更新时

```js
function updateRef(initialValue) {
    var hook = updateWorkInProgressHook();
    return hook.memoizedState;
 }
```

`ref`的更新就更加简单了，直接返回原来的引用就好，因为`hook`的信息都是基于老的`hook`直接复用的，因此信息还是原来的信息，所以在整个react运行时过程中，这个引用就像一个静态的变量一样，永远被持久的存储了下来。

### DOM元素&类组件实例

在我们专栏的[《深入理解react》之commit阶段](https://juejin.cn/post/7355448283227570202) 这篇文章中我们有分析过ref在有些特殊情况下会将一些特殊信息存储下来，例如DOM元素或者类组件实例的情况

```js
...
const ref = React.useRef();

<h1 id="h1" ref={ref}>hello</h1>
或者
<ClassComponent ref={ref}/>
或者
<FunctionComponent ref={ref}/>
...

```

创建Ref引用的过程发生在`render`阶段，以上几种情况都会给当前的组件的fiber上打上`Ref`的标签，等到`commit`阶段处理，处理的逻辑就是将相关的信息赋值到对应的ref引用上达到持久存储的目的。

在commit阶段会通过`commitAttachRef`来将`fiber`身上的`stateNode`属性的信息赋值给引用对象上，对于类式组件来说就是实例对象；对于原生元素来说，就是DOM元素。

当然对于函数式组件来说，就是`useImperativeHandle`返回的对象，我们后面再去了解它是如何做到的

## 七、useContext

`useContext`相信大家在工作中经常用到，它可以很方便的将状态提升到更上层，然后在任意子孙组件都可以消费状态信息，避免层层传递`props`而导致的尴尬境地，接下来我们就来研究它是如何实现的吧！

在使用`useContext`之前我们得有一个`context`吧，因此先来看一下`React.createContext()`做了什么吧！

```js
function createContext(defaultValue) {
    var context = { // 创建一个context对象，就是长下面这个样子
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    };
    context.Provider = { // Provider类型的组件，提供者
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context,
    }; 
    
    {
      var Consumer = { // Context类型的组件，消费者
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
      }; 
      // 给Consumer绑定一些属性
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          },
        },
        ...
        Consumer: {
          get: function () {
            return context.Consumer;
          },
        },
      });
      context.Consumer = Consumer;
    }
    // 返回这个context
    return context;
}
```

我保留了核心的context创建过程, 可以看的出来还是比较容易理解的，在`context`的内部有`Provider`和`Consumer`，它们都是`ReactElement`类型的对象，可以直接在用户层使用JSX来消费，根据逻辑我们可以看的出来`context`和`Provider`以及`Consumer`都是互相引用着的

一般来说这个创建context的过程是最先发生的，紧接着会先触发`Provider`的`render阶段`，最后再触发`useContext`，因为我们知道`useContext`需要在`renderWithHooks`中执行，而`renderWithHooks`是发生在`beginWork`过程的，因此它是自上而下的这么一个顺序

### Provider

`Provider`是一个`ReactElement`类型的元素，它拥有属于一类的fiber类型,在它的父节点被调和的时候，它对应的fiber节点也会被创建出来，对应的`tag`类型是**10**

```js
export const ContextProvider = 10;
```

我们在使用`Provider`的时候，同时也会将自定义信息注入进来

```js
<Provider value={{... }}>
  <.../>
</Provider>
```

此时也会被保存在`Provider`类型的`fiber`的`pendingProps`身上，在真正调和这个`Provider`的时候会进入`updateContextProvider`进行处理

```js
function updateContextProvider(current, workInProgress, renderLanes) {
    var providerType = workInProgress.type; // 就是context信息 { _context:context , $$typeof: xxx }
    var context = providerType._context;
    var newProps = workInProgress.pendingProps;
    var newValue = newProps.value; // 用户给定的
    pushProvider(workInProgress, context, newValue); 
    ...
    return workInProgress.child;
}
```

`Provider`身上会有`context`的信息，因为它们互相引用着

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/585665b1542f41c29837c311d98e3b2a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=512&h=293&s=34654&e=png&b=fbf8f8)

然后在这里面会调用`pushProvider(workInProgress, context, newValue);`，这里面会将用户给定的值赋值给`context`中的`_currentValue`保存起来

```js
function pushProvider(providerFiber, context, nextValue) {
   ...
   context._currentValue = nextValue;
}
```

自此之后提供者任务完成,将一个上层的**状态和方法**保存在了`context`这个公共区域之中，接下来就是下层如何进行消费

## 八、useContext

我们可以使用`useContext`来消费上层的状态和其他hook不同的一点是，无论初始化还是更新阶段，都是调用的`readContext`来获取相关的信息

```js
function readContext(context) {
    var value =  context._currentValue ; // 直接取出context
    ...
    {
      var contextItem = {
        context: context,
        memoizedValue: value,
        next: null
      };

      if (lastContextDependency === null) {
        // 如果是第一个 useContext
        lastContextDependency = contextItem;
        currentlyRenderingFiber.dependencies = { // context 信息是放在dependencies属性上的
          lanes: NoLanes,
          firstContext: contextItem
        };
      } else {
        // 如果有多个,形成单向链表
        lastContextDependency = lastContextDependency.next = contextItem;
      }
    }
    return value;
}
```

通过上面的分析我们可以知道,`useContext`并非和之前的`hook`一样会在`fiber`的`memoizedState`上形成一个链表，而是会在`dependencies`属性上形成一个链表，假设我们用了两个`useContext`来获取上层的信息

```js
function App (){
  const context1 = useContext(Context1);
  const context2 = useContext(Context2);

  return (...)
}

```

那么对应的Fiber结构就应该是这一个样子的

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fd36ab30d614742b1f4a2b20ceee3a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=429&h=418&s=23936&e=png&b=fdfdfd)

由于`beginWork`是自上而下的，因此在`reactContext`获取状态时，值早已在祖先节点上被更新为了最新的状态，因此在使用`useContext`时消费的也是最新的状态

如果从`useContext`的地方触发了更新，由于触发的更新的`setXXX`是由祖先节点提供的，实际上会从祖先节点开始发起更新，从祖先组件的整棵子树都会被重新`reder`，如下图所示:

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bf0541d464245ceaf2bb7144320cad6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=714&h=477&s=53597&e=png&b=fcfcfc)

### Consumer

当然除了使用`useContext`我们还可以通过`Consumer`这样的方式来进行消费，用法如下:

```js
import AppContext from 'xxx'

const Consumer = AppContext.Consumer

function Child(){

  return (
    <Consumer>
      {
        (value)=> xxx
      }
    </Consumer>
  )
}


```

在`render`阶段中当`beginWork`来到了`Consumer`类型的节点时，会触发`updateContextConsumer`

```js
function updateContextConsumer(current, workInProgress, renderLanes) {
    var context = workInProgress.type; //Consumer类型的fiber将context信息存贮在type属性上
    context = context._context;
    var newProps = workInProgress.pendingProps; // 获取porps
    var render = newProps.children;

    {
      if (typeof render !== 'function') { // 意味着被Consumer包括的必须是个函数
        报错
      }
    }
    
    var newValue = readContext(context); // 依然是调用readContext
    var newChildren;
    
    newChildren = render(newValue); // 这样就把最新的状态交给下层去消费了
     
    reconcileChildren(current, workInProgress, newChildren, renderLanes); // 继续调和子节点
    return workInProgress.child;
 }
```

可以看到实际上`Consumer`内部依然是通过`readContext`来获取`context`信息的,原理和`useContext`一致

> 小结  
> 通过上面的分析我们可以得出一个结论，`context`最基本的原理就是利用`beginWork`自上而下进行这样的特点,将状态通过上层先存贮第三方，然后下层的节点因为后进行`beginWork`就可以无忧的消费提存存贮在第三方的状态了，而这个第三方实际上就是我们的`context`

## 九、useImpertiveHandle

`useImpertiveHandle`这个hook的作用想必大家都知道，函数式组件本身是没有实例的,但是这个`hook`可以让用户自定义一些方法暴露给上层的组件使用，我们来看看它是怎么做的

### 初始化时

初始化时`useImpertiveHandle`执行的是`mountImperativeHandle`

```js
function mountImperativeHandle(ref, create, deps) { // 这个ref实际上就是上层组件的一个ref引用{ current:xxx }
    // 其实本质上调用的是mountEffectImpl
    var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
    var fiberFlags = Update;
    //因为传入的是Layout, 所以实际上和useLayoutEffect的执行时机一样
    return mountEffectImpl(fiberFlags, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
  }
```

在上一篇中我们有分析`effect`类型的hook的执行时机以及原理等,如果忘了可以复习一下 [《深入理解react》之hooks原理（上）](https://juejin.cn/post/7357990322063114266),我们可以看到这个实际上和上一篇文章中提到的`useLayoutEffect`执行时机是一样的，都是在`Mutation`阶段**同步执行**，唯一的区别就是`useLayoutEffect`执行的是用户自定义的函数，而`useImpertiveHandle`执行的是`imperativeHandleEffect.bind(null, create, ref)`

```js
function imperativeHandleEffect(create, ref) {
   var refObject = ref;
  {
    if (!refObject.hasOwnProperty('current')) { // 引用必须具有 current属性
      error("报错");
    }
  }

  var _inst2 = create(); // 调用用户提供的函数,得到的是一个对象,用户可以在这个对象上绑定一些子组件的方法 { fun1, fun2 ,... }

  refObject.current = _inst2; // 赋值给父组件的引用
  return function () { // 并且提供销毁函数,方便删除这个引用
    refObject.current = null;
  };
}
```

可以看到，整体还是比较好理解的，本质上就是把父组件传下来的ref引用赋个值而已，这样父组件的ref就能够使用子组件的方法或者状态了，实际上通过上面的分析如果你不想要使用`imperativeHandleEffect`,使用下面的降级方式,效果完全相同

```js
function Child(props , ref){
  useLayoutEffect(()=>{
  
    ref.current = { // 当deps发生改变的时候,直接给ref.current赋新值就好了
    
    }
  
  } , [deps])  
  
  return (...)
}

```

### 更新时

更新时执行的是`updateImperativeHandle`

```js
function updateImperativeHandle(ref, create, deps) {
   // 将ref的引用添加为依赖
    var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
    // updateEffectImpl 和 imperativeHandleEffect 我们都分析过了
    return updateEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
 }
```

在上一篇中我们提到过`updateEffectImpl`在依赖不变时会传入不同标识，方便`commit`阶段区分出来然后跳过执行，这里也是一样的

当依赖未产生变化时 `imperativeHandleEffect` 便不会执行，`ref`还是原来的信息；只有当依赖变化才会重新赋最新的值

## 十、最后的话

通过本篇文章，我简单介绍了一下React hooks的原理，当然所有的内容全部是个人理解，如有错误，欢迎评论区指正。也欢迎大家多多在评论区留言讨论


