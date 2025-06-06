

## Node.js的基础架构
NodeJs是什么？
——NodeJs是一个基于GoogleJS引擎V8的JS运行时

这里是需要理解Js引擎和Js运行时

Js引擎就是把写的一些Js代码进行解析执行，最后得到一个结果

Js运行时：JS本身+一些拓展能力 组成的运行环境

比如浏览器环境、NodeJs环境、其他运行时环境
这里我们主要是了解NodeJs环境。

NodeJs的组成：V8引擎+Libuv+部分第三方库

Libuv是一个跨平台的异步IO库，封装各个操作系统的一些API，提供网络还有文件进程这些功能。
NodeJs的代码组成
![](../PublicImage/Node/Pasted%20image%2020240424132509.png)
Node通过c/c++实现核心功能，然后暴露出去。
然后通过js语法进行操作

C++层分为3部分
1. net、fs等模块对应的c++模块（依赖Libuv和第三方库的C++）
2. 不依赖libuv和第三方的c++代码，比如buffer模块的实现
3. v8

c语言层：Libuv 等库提供了一系列 C API，然后在 Node.js 的 C++ 层对其进行封装使用，最终暴露 JS API 给 JS 层使用。

Nodejs的应用架构
NodeJs和Nginx、Redis相类似，都是一个`单线程+事件驱动+非阻塞IO`的应用
从开发者角度来看，Nodejs是单线程，从实现来看NodeJs是多线程的。
比如一个异步的文件操作，是在一个子线程中执行的，操作完成之后这个回调会由主线程进行调度执行。因此尽可能在开发时不要在主线程中执行耗时的代码和阻塞式API，耗时的代码可以使用woker_threads进行多线程
>工作线程对于执行 CPU 密集型的 JavaScript 操作很有用。
```js
const worker = require('node:worker_threads');
```



Node的事件驱动
Node.js 中非常核心的部分，当 Node.js 中没有任务处理时，它就会阻塞在这里，有事件发生后，就会被唤醒继续执行，整个应用就是这样靠着各种事件来驱动运行的。

Node的非阻塞IO
使用非阻塞IO是为了避免条件不满足时引起进程阻塞。

NodeJS的执行架构
JS向C++提交任务，C++向操作系统提交任务，然后由操作系统返回给C++再返回给JS
在 Node.js 中，任务有不同的类型和优先级。Node.js 的任务分为宏任务和微任务，宏任务包括定时器、网络 IO、文件 IO，微任务包括 Promise、process.nextTick。
这个生产者 / 消费者的模型是通过**事件循环**实现的
当消费者队列没有任务时，消费者应该怎么处理
1.轮询判断是否有任务
2.变成阻塞状态，等待唤醒
两种方式。
事件驱动模块的 epoll_ctl 订阅 fd 的事件，然后同样地通过事件驱动模块的 epoll_wait 判断是否有事件触发。

Libuv 中具体通过 fd 的方式（管道或 eventfd）来实现异步机制的。当线程池完成任务时，它会修改这个 fd 为可读的，然后在主线程事件循环的 Poll IO 阶段时，它就会执行这个可读事件的回调，从而执行上层的回调。

除了主线程和 Libuv 的线程池外，Node.js 还有一些额外的辅助线程，比如看门狗线程 Watchdog、调试线程 Inspector、消费 trace event 数据的 Trace 线程，还有用来做后台任务的线程，如 GC 的线程。


### Libuv数据结构和通用逻辑

uv_loop_s是Libuv中最核心的数据结构
这里了解一下就ok

```c
1 使用方自定义数据的字段，用于关联上下文
void* data;

2 活跃的 handle 个数，大于 0 则事件循环不会退出，除非显式调用 uv_stop
unsigned int active_handles;

3 handle 队列，包括活跃和非活跃的
void* handle_queue[2]; 

4 request 个数，大于 0 则事件循环不会退出，除非显式调用 uv_stop
union { void* unused[2];  unsigned int count; } active_reqs;

5 事件循环是否结束的标记，由 uv_stop 设置
unsigned int stop_flag;

6 Libuv 运行的一些标记，目前只有 UV_LOOP_BLOCK_SIGPROF，主要是用于 epoll_wait 的时候屏蔽 SIGPROF 信号，防止无效唤醒。
unsigned long flags; 

7 事件驱动模块的 fd，比如调用 epoll_create 返回的 fd
int backend_fd;                    
   
8 pending 阶段的队列                   
void* pending_queue[2];          
           
9 指向需要在事件驱动模块中注册事件的 IO 观察者队列            
void* watcher_queue[2];      

10 watcher_queue 队列的节点 uv__io_t 中有一个 fd 字段，watchers 以 fd 为索引，记录 fd 所关联的 uv__io_t 结构体                       
uv__io_t** watchers;               

11 watchers 相关的数量，在 maybe_resize 函数里设置
unsigned int nwatchers;

12 loop->watchers 中已使用的元素个数，一般为 watcher_queue 队列的节点数
unsigned int nfds;      

13 线程池的子线程处理完任务后把对应的结构体插入到 wq 队列，由主线程在 Poll IO 阶段处理        
void* wq[2];               

14 控制 wq 队列互斥访问，否则多个子线程同时访问会有问题
uv_mutex_t wq_mutex;

15 用于线程池的子线程和主线程通信，参考线程池和线程间通信章节    
uv_async_t wq_async;   

16 用于设置 close-on-exec 时的锁，因为打开文件和设置 close-on-exec 不是原子操作（除非系统支持），所以需要一个锁控制这两个步骤是一个原子操作。
uv_rwlock_t cloexec_lock;  

17 事件循环 close 阶段的队列，由 uv_close 产生
uv_handle_t* closing_handles;       

18 fork 出来的子进程队列                 
void* process_handles[2];    
           
19 事件循环的 prepare 阶段对应的任务队列                   
void* prepare_handles[2];        
            
20 事件循环的 check 阶段对应的任务队列              
void* check_handles[2];        

21 事件循环的 idle 阶段对应的任务队列
void* idle_handles[2];  

21 async_handles 队列，Poll IO 阶段执行 uv__async_io 遍历 async_handles 队列，处理里面 pending 为 1 的节点，然后执行它的回调
void* async_handles[2];         

22 用于线程间通信 async handle 的 IO 观察者。用于监听是否有 async handle 任务需要处理
uv__io_t async_io_watcher;  

23 用于保存子线程和主线程通信的写端 fd                    
int async_wfd;   

24 保存定时器二叉堆结构       
struct {
    void* min; 
    unsigned int nelts;
} timer_heap; 
       
25 管理定时器节点的递增 id
uint64_t timer_counter;      
  
26 当前时间，Libuv 会在每次事件循环的开始和 Poll IO 阶段更新当前时间，然后在后续的各个阶段使用，减少系统调用次数                     
uint64_t time; 
  
27 fork 出来的进程和主进程通信的管道，用于子进程收到信号的时候通知主进程，然后主进程执行子进程节点注册的回调
int signal_pipefd[2];                 

28 用于信号处理的 IO 观察者，类似 async_io_watcher，signal_io_watcher 保存了管道读端 fd 和回调，然后注册到事件驱动模块中，在子进程收到信号的时候，通过 write 写到管道，最后主进程在 Poll IO 阶段执行回调
uv__io_t signal_io_watcher;

29 用于管理子进程退出信号的 handle
uv_signal_t child_watcher;  
  
30 备用的 fd，当服务器处理连接因 fd 耗尽而失败时，可以使用 emfile_fd       
int emfile_fd;   

```


uv_handle_t
Libuv中，handle代表生命周期比较长的对象。例如
1. prepare handle
2. 一个TCP服务器
这个表示c++中的基类，很多子类继承于他Libuv主要通过C语言实现继承的效果

