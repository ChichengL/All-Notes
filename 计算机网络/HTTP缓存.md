HTTP缓存存在两种：`from memory cache`和`from disk cache`
分别是来自内存和来自磁盘的缓存


## 前端常用缓存方案
- HTML 文档配置协商缓存
- JS、CSS、图片等资源配置强缓存
此方案的好处：当项目版本更新时，可以获取最新的页面；若版本未变化，可继续复用之前的缓存资源；既很好利用了浏览器缓存，又解决了页面版本更新的问题

浏览器拉取缓存流程
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/504787d34e1d41379d2d8a3754998810~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 强缓存
资源没有过期就直接取缓存。如果过期了，则请求服务器，一般用于JS、CSS、图片等资源

第一次访问页面，浏览器会根据服务器返回的response Header来判断是否对资源进行缓存，如果响应头中有`cache-control` 或 `expires`字段，那么就代表强缓存



## Cache-Control
是响应头头中控制网页缓存的字段，主要取值为：
- public：资源客户端和服务器都可以缓存
- privite：资源只有客户端可以缓存
- no-cache：客户端缓存资源，但是是否缓存需要经过协商缓存来验证
- no-store：不使用缓存
- max-age：缓存保质期，是相对服务器的时间
max-age
比如HTTP响应头中`Cache-Control为max-age = 31536000`，即表示在31536000秒后该资源过期，如果没有过期，浏览器会直接使用缓存结果，强制缓存生效。

**Cache-Control: no-cache 和 no-store的区别：**

`Cache-Control: no-cache`：这个很容易让人产生误解，误以为是响应不被缓存

实际上`Cache-Control: no-cache` 是会被缓存的，是协商缓存的标识，只不过每次都会向服务器发起请求，来验证当前缓存的有效性

`Cache-Control: no-store`：这个才是响应不被缓存的意思

## Expires
Expires是http1.0控制网页缓存的字段，值为一个时间戳，服务器返回该资源缓存的到期时间
但 Expires 有个缺点，就是它判断是否过期是用本地时间来判断的，本地时间是可以自己修改的

到了HTTP/1.1，Expire 已经被 Cache-Control 替代，Cache-Control 使用了max-age相对时间，解决了Expires 的缺陷

因此。当Expire和Cache-Control都存在的时候后者的优先级更高。


## memory cache 和 disk cache 的区别
两者都属于**强缓存**，主要区别在于存储位置和读取速度上
- memory cache来自内存，disk cache来自于磁盘
- memory cache要比 disk cache快的多！从磁盘访问可能需要5-20ms，而从内存访问只需要100ns
特点
- memory cache 特点：  
    当前tab页关闭后，数据将不存在（资源被释放掉了），再次打开相同的页面时，原来的 memory cache 会变成 disk cache
- disk cache 特点：  
    关闭tab页甚至关闭浏览器后，数据依然存在，下次打开仍然会是 from disk cache

  
一般情况下，浏览器会将js和图片等文件解析执行后直接存入内存中，这样当刷新页面时，只需直接从内存中读取(from memory cache)；而css文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)
从使用频率而言，js和图片在页面加载时经常被频繁请求，且在交互过程中可能需要快速访问，因此放入内存中（`为了JS的快速加载和图片的快速呈现`即为了增强用户体验感）


## 协商缓存
浏览器携带缓存标识向服务器发送请求，服务器根据缓存标识来决定该资源是否过期，一般用于html资源，验证版本是否更新

触发条件
- Cache-Control 的值为 no-cache （协商缓存）
- 或者 Cache-Control: max-age=0

协商缓存的标识
### Last-modified
文件在服务器最后被修改的时间，从服务器response Headers上获取
Last-modified的验证流程
- 第一次访问页面，服务器的响应头会返回Last-Modified字段
- 客户端再次发送该请求时，请求头`If-Modified-Since`字段会携带上次请求返回的Last-Modified值
- 服务器根据`If-Modified-since`的值与该资源在服务器最后被修改的时间做对比，若服务器上的时间大于Last-Modified的值，则从小返回资源，表示资源已经更新；否则返回，表示资源未更新。


### Etag
当前资源文件的一个唯一标识(由服务器生成)，若文件内容发生变化该值就会改变
验证流程
- 第一次访问页面时，服务器的响应头会返回 etag 字段
- 客户端再次发起该请求时，**请求头 If-None-Match 字段会携带上次请求返回的 etag 值**
- 服务器根据 If-None-Match 的值，与该资源在服务器的Etag值做对比，若值发生变化，状态码为200，表示资源已更新；反之则返回304，代表资源无更新，可继续使用缓存

Etag出现是为了解决Last-modified带来的问题。
- 比如文件内容没有更改，只是做了一些其他的修改，那么不用重新请求。
- 某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说 1s 内修改了 N 次)，If-Modified-Since 能检查到的粒度是秒级的，使用 Etag 就能够保证这种需求下客户端在 1 秒内能刷新 N 次 cache

协商缓存存在两种状态
资源没变化返回304，反之返回200

因为Etag是为了解决Last-modified带来的问题，因此Etag的判断优先级是大于Last-modified

协商缓存的流程
第一次请求
客户端发送请求，服务器处理请求，返回文件内容和一堆Header，包括Etag 和 Last-Modified，状态码200
第二次请求
1、客户端发起请求，此时请求头上会带上 **if-none-match值为Etag** 和 **if-modified-since值为last-modified**

2、服务器优先判断 Etag，若资源未变化状态码为304，客户端继续使用本地缓存，若资源发生变化，状态码为200 并返回最新的资源

  