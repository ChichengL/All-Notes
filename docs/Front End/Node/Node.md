# Node核心
## Node概述

Node是什么？
Node是一个JS的运行环境
浏览器也是一个JS的运行环境

Node比浏览器拥有更多能力
具体如何体现？
浏览器中的JS
- 由Ecmascript + Web Api共同构成
- web Api提供了操作浏览器窗口和页面的能力
	- DOM
	- BOM
- 局限性
	- 跨域问题，为了保护网站的数据，因此诞生了同源协议
	- 文件读写，浏览器为了安全着想，对文件的读写是有限的，运行在沙箱中，无法直接接触外面的文件

Node中的JS
- EcmaScript + Node Api共同构成
- Node api没有以上局限性，几乎完整的提供了控制操作系统的能力


Node可以干什么？
- 开发桌面应用，比如vscode是electron+node开发的
- 开发服务器应用程序（常见）
	- 应用发起请求，node服务器进行处理，对数据库进行操作，对请求全权处理。常见于一些微型站点，例如博客，
	- node作为一个转发器，不做任何与业务逻辑有关的事情。有可能会做一些额外的功能
		- 简单信息记录
		- 静态资源托管
		- 缓存




## Node核心

Node里面同浏览器里面一样都有全局对象不过是`globalThis`或者`global`，不可以使用this得到全局对象
![[../PublicImage/Node/Pasted image 20240316125752.png]]

这个全局对象，中存在global属性，是循环引用。
- setTimeout和setInterval
在浏览器中setTimeout和setInterval，得到的是一个数字。
而在node环境得到的是一个对象
![[../PublicImage/Node/Pasted image 20240316130041.png]]
- setImmediate和setTimeout 0有点类似
- `__dirname`，得到当前运行模块的绝对路径（目录）
- `__filename`，得到当前运行模块的文件路径
- Buffer   类型化数组，计算机中存储的基本单位：字节
- process
	- cwd，获取命令行路径（当前执行命令的目录和文件路径无瓜）
	- exit，强制退出node进程
	- argv，获取代码执行时所有的命令参数（string[]）![[../PublicImage/Node/Pasted image 20240316131611.png]]
	- platform，显示在哪个操作系统平台
	- kill(pid)，杀死某个进程
	- env，获取环境变量

## 模块化的细节

模块的查找，支持绝对路径`C:\test`，相当路径`./ 和 ../`

还支持相对路径
- 首先检查是否为内置模块，如fs，path等
- 然后检查当前目录中的node_modules
- 检查上级目录中的node_modules
- 然后加载模块
如果导入文件没有提供后缀名，会进行自动补全。有js，json，node，mjs这几种 

如果只提供文件目录，不提供文件名，查找文件顺序如下
- 会自动寻找当前目录下的文件
- 先进行后缀补全，查找文件，如果查找不到
- 就自动寻找index文件


module对象，用于导出，记录当前模块的信息

require对象，常见于导入包
- resolve，将模块的路径弄为绝对路径
当执行一个模块或使用require时，会将模块防止在一个函数环境中，避免污染环境
```js
function requiere(modulePath){
	//1.将 modulePath转化为绝对路径
	//2.判断是否该模块已有缓存，如果有直接返回
	//3.没有缓存就进行读取文件内容
	//4.将内容包裹在函数中
	//function _temp(){]
	//5.创建module对象
	//module.exports = {} 
	//const exports = module.exports
	// _temp.call(module.exports,module, export , require, module.path, module.filename )_
}
```

这里在导出模块的时候，this为exports
Node中的模块更多是commonJs


## 基本内置模块

### os
--使用的不多
与操作系统相接触的
主要的有
- EOL 一行结束的分隔符
- arch，获取windows的架构名
- cpus，获得各个cpu的信息。 


### path
- filename：获得文件路径 比如 ：d:\\xxx\\xxxx\\aaa.html
- basename： 获取文件名
- dirname，获取文件所在目录，比如：d:\\test\\a获取到的就是d:\\test
- extname，获取文件名字
- resolve，获取到绝对路径通常与__dirname结合使用 

### URL
```js
const URL = require("url")
const url = new URL("地址")
//url得到的是一个对象
```



## 文件I/O

对外部设备的输入输出。
I/O的速度往往低于内存和CPU的交互速度。

### fs模块
fs为file system的简写。
主要的有几种操作
- fs.readFile，读取一个文件
- fs.writeFile，想文件写入内容
- fs.stat，获取文件或目录信息
- fs.readdir，获取目录中的文件和子目录
- fs.mkdir，创建目录
-
#### **readFile**
```js
const fs = require('fs');
const path = require('path');
fs.readFile(path.resolve(__dirname, '1.txt'), 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
 })
 console.log(1)
```
如何对于readFile(filename,[option],callback )，异步函数，会先执行后面的代码，如果读取文件结束，然后再执行回调函数。
option可有可无，如果无，就是16进制的数据（buffer的默认格式）
这里就是1，内容
同时这个方法有同步的方法（影响性能）
比如readFileSync
```js
const content = fs.readFileSync(filename,'utf-8')
console.log(1)
```
这里会等待文件读取，再执行后面的语句
这里的结果就是  内容，1

#### **writeFile**
可以用于创建文件
writeFile(filename,content,options)
当options为字符串的时候默认为编码
当options 为对象时，encoding对应编码

```js
async function test(){
	await fs.promises.writeFile(filename,'aaaa',{
		encoding:'utf-8', //默认，可以不写
		flag:'a',//追加内容
	})
}
```

结合读与写，可以实现复制的功能
```js
const fs = require('fs');
const path = require('path');

async function copy() {
    const fromFilename = path.resolve(__dirname, './1.txt')
    const toFilename = path.resolve(__dirname, './1.copy.txt')
    const buffer = await fs.promises.readFile(fromFilename);
    await fs.promises.writeFile(toFilename, buffer);
    console.log('文件拷贝成功！');
}
copy()
```

#### stat
```js
async function test(){
	const stat = await fs.promises.stat(filename);
	console.log(stat);
}
test()
```
得到的是一个Stat对象
主要包含
 - size，占用字节数
 - atime：上次访问时间
 - mtime：上次文件内容被修改时间
 - ctime：上次文件状态被修改时间
 - birthtime：文件创建时间
 - isDirectory：判断是否为目录
 - isFile：判断是否是文件



#### readdir
readdir(dirname)
```js
async function readDir() {
    const pathDir = path.resolve(__dirname);
    const paths = await fs.promises.readdir(pathDir);
    console.log(paths);
}
 readDir()
```
> [
  '1.copy.txt',        '1.txt',
  '15_generator',      'index.html',
  'Node.assets',       'Node.md',
  'node_modules',      'Package Manager',
  'package-lock.json', 'package.json',
  'test.js',           '代码',
  '代码（尝试）',      '对应实操'
]
得到数据




## Stream
流是指的数据的流动，类似于排队，一部分一部分的"进入"
为什么需要流，当传输大文件时，如果不使用流，进行一次性传输的话，那么一次网络中断就会使得文件传输失败

流是有方向的
- 可读流，Readable，源头流向内存
- 可写流，Writeable，内存流向源头
- 双工流
流存在单独的模块，Readable和Writeable
```js
 const {Readable,Writeable} = require('stream')
```
### 文件流

文件流的创建



### readStream读取流

创建读取流
createReadStream(path,[options])
需要指定编码，不指定默认为buffer

options
- encoding：编码方式，默认为bufffer
- start：起始字节，默认为0
- end：结束字节，默认为文件最大字节
- highWaterMark：每次读取的数量，默认为64* 1024字节 
- autoClose：读取完毕之后是否自动关闭，默认为true
使用这个方法，得到Readable的子类 
身上有事件
`rs.on`
```js
let rs = fs.createReadStream('1.txt',{flags:'r'.encoding:"utf-8"})
rs.on('open',()=>{
	console.log('读取流开始')
})
let chunks = []
rs.on('close',()=>{
	console.log('读取流结束')
})
rs.on('data',(chunk)=>{
	chunks.push(chunk)
})
```
- open，文件打开触发
- error，读取文件出错触发
- close，文件关闭触发
	- rs.close进行手动关闭
	- 文件读取完成后自动关闭
- data，读取到文件的数据触发
	- 数据只有在注册data事件之后才会读取，每次读取的是highWaterMark指定的数量
	- 回调函数中会携带读取到 的数据
- end，全部数据读取完毕，触发，默认先于close触发

rs.pause()暂停读取
rs.resume()恢复读取
```js
rs.pause()
rs.on('pause',()=>{
	setTimeout(()=>{
		rs.resume();
	},1000)
})
```
可以这样搭配使用


### 写入流 writeStream
创建写入流
fs.createWriteStream(文件路径，【可选配置】)
```js
const fs = require('fs')
let writeSteam = fs.createWriteStream("hello",{flags:'w',encoding:'utf-8'})

```
options
- flags：操作文件的方式，w：覆盖，a追加
- encoding：编码方式，默认utf-8，空的话为buffer
- start：起始字节
- highWaterMark：每次最多写入的字节数


写入流监听事件
ws.on
- open
- error
- close
```js
ws.on('open',()=>{
	console.log('文件打开')
})
ws.on('close',()=>{
	console.log('文件写入完成，关闭')
})
ws.write("aaa",(err)=>{
	err ? console.log(err) : ''
});
ws.end(()=>{
console.log('文件写入关闭')
})
```

- `writeFile()` 适用于一次性写入较小文件且不需要流式处理的情况。
- `createWriteStream()` 更适合处理大文件或者需要更细粒度控制数据传输进度的情况。
可以多次调用`.write(data)`的方法进行将数据写入

写入通道的大小取决于highWaterMark
write**是有返回值**的，返回的为布尔值，表示写入通道是否被填满，如果为true表示没有填满，可以直接写入，无需排队；如果是false就需要排队
且为false的时候要注意背压问题，因为写入队列是内存中的数据，是有限的
![[../PublicImage/Node/Pasted image 20240330153223.png]]

背压问题：内存中太多东西写入磁盘较为缓慢，导致内存中数据越积越多
当写入队列清空时，会触发drain事件

```js
let i = 0;

function write(){
	let flag = true;
	while(i< 1024*1024 * 10 && flag){
		flag = ws.write('a')
		i++;
	}
}
write()
ws.on('drain',()=>{
	write()
})
```
运行速度慢，但是不会造成背压问题。时间换内存

ws.end([data])：结束写入，将自动关闭文件，data是可选的，表示关闭之前的最后一次写入

复制A的内容到B
```js
function method1(){
	const from = path.resolve(__dirname,'./temp/1.txt')
	const to = path.resolve(__dirname,'./temp/2.txt');
	const content = await fs.promises.readFile(from)
	await fs.promises.writeFile(to,content)
}

function method2(){
	const from = path.resolve(__dirname,'./temp/1.txt')
	const to = path.resolve(__dirname,'./temp/3.txt');
	const rs = fs.createReadStream(from)
	const ws = fs.createWriteStream(to)
	rs.on('data',(chunk)=>{
		const flag = ws.write(chunk)
		if(!flag){
			rs.pause()
		}
	})
	ws.on('drain',()=>{
		rs.resume()
	})
	rs.on('close',()=>{
		ws.end()
	})
}
```
method2的速度更快且不会造成背压
此外可以简化method2使用pipe的api
```js
function method2(){
	const from = path.resolve(__dirname,'./temp/1.txt')
	const to = path.resolve(__dirname,'./temp/3.txt');
	const rs = fs.createReadStream(from)
	const ws = fs.createWriteStream(to)
	rs.pipe(ws)
}
```
相当于rs"搭建"了一个通向ws的管道



## net模块
相比http模块不常用
### 回顾http请求
普通模式——三次握手，一次请求，一次响应，四次挥手
特点：每次请求都需要三次握手，四次挥手


**长连接模式**——三次握手，多次请求，多次响应，四次挥手
在响应头中加入`Connection:keep-alive`，即可实现

### net模块
net是一个通信模块
可以利用他实现
- 进程间的通信IPC
- 网络通信TCP/IP

#### 创建客户端

net.createConnection(options,[connectListener])
返回socket
options
- host: 主机名（不用写协议）
- port：端口号
```js
const net = require('net')
const socket = net.createConnection({
	host:'duyi.ke.qq.com',
	port:80
},()=>{
	console.log('连接成功')
})
socket.on('data',(chunk)=>{
	console.log('来自服务器的消息',chunk.toString('utf-8'))
	socket.end()//客户端收到消息就结束连接，如果不是长连接的话
})
socket.write('你好👋！')
socket.on('end',()=>{
console.log('连接 结束')
})
```
socket是一个特殊的文件
在node中表现为双共流对象
通过向流写入内容发送数据
通过监听流的内容获取数据
```js
socket.write(`请求行
请求头

请求体`)

//比如
socket.write(`GET / HTTP/1.1
Host: duyi.ke.qq.com
Connection: keep-alive

`)
```

注意：请求头和请求体之间必须有两个换行


#### 创建服务器


```js
const net = require('net')

const server = net.createServer()

server.listen(9527)

server.on('listening', () => {
    console.log('Server is listening on port 9527')
})

server.on('connection', (socket) => {
    console.log('socket', socket)
})
```

这里可以得到socket，可以利用socket对客户端进行响应 

```js
const net = require('net')

const server = net.createServer()
server.listen(9527)

server.on('listening', () => {
    console.log('Server is listening on port 9527')
})


server.on('connection', (socket) => {
    // console.log('socket', socket)
    //响应数据
    
    //接收数据
    socket.on('data', (data) => {
        socket.write(`HTTP/1.1 200 OK

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>你好</h1>
    </body>
    </html>    `)
    })

})
```

![[../PublicImage/Node/Pasted image 20240331153317.png]]

甚至可以发送图片
等等
```js
server.on('connection', (socket) => {
    // console.log('socket', socket)
    //响应数据
    socket.on('data', async (chunk) => {
        const fileName = path.resolve(__dirname, './1.jpg')
        const bodyBuffer = await fs.promises.readFile(fileName)
        const headBuffer = Buffer.from(`HTTP/1.1 200 OK
Content-Type: image/jpeg

`, 'utf-8')
        const responseBuffer = Buffer.concat([headBuffer, bodyBuffer])
        socket.write(responseBuffer)\
        socket.end()
    })
    //接收数据
    socket.on('end', () => {
        console.log('关闭连接')
    })
})
```




## http模块


http模块建立在net模块之上
直接使用net模块非常麻烦

### 请求
使用request方法
request(url[,options]  [,callback])

```js
const http = require("http")
const request = http.request("http://duyi.ke.qq.com",{
	method:"GET"
},(response)=>{
	console.log(response)
	let str = ""
    response.on('data', data => str += data)
    response.on('end', () => console.log(str))
})
request.end()//才开始发送请求
```

如果没有 **response.end**相当于只有请求头，没有请求体，以及请求体和请求头之间的`\r\n\r\n` 


### 创建服务器
使用http.createServer([,options]  [,callback])
options一般不动

主要是配置callback

callback中有两个参数，req和res，分别是请求：IncomingMessage对象和响应：ServerResponse对象
```js
const http = require("http")

const server = http.createServer((req, res) => {
	console.log("请求地址",req.url)
	let str = ""
    req.on("data", (chunk) => {
        str += chunk.toString('utf-8')
    })
    req.on('end',()=>{
	    console.log(str);
    })
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Hello World\n")
})
server.listen(9001, () => {
    console.log("Server running at http://localhost:9001")
})
```


req.url是主机之后的地址，比如`localhost:9001/a/b`得到的是`/a/b`

server可以指定监听对象
**server.listen(port[,host], callback)**

静态资源托管

```js
const http = require('http');

const fs = require('fs');

const path = require('path');

const URL = require('url')

  

async function getStatus(filename) {

    try {

        return await fs.promises.stat(filename)

    } catch (err) {

        return null

    }

}

//静态资源服务器

async function getFileInfo(url) {

    const urlobj = URL.parse(url)

    console.log(urlobj)

    let filePath = path.join(__dirname, 'public', urlobj.pathname.substring(1));

    const exist = await getStatus(filePath)

    if (!exist) {

        return null

    } else if (exist.isDirectory()) {

        filePath = path.join(filePath, 'index.html')

        const exist = await getStatus(filePath)

        if (!exist) {

            return null

        }

        return fs.readFileSync(filePath)

    } else {

        return fs.readFileSync(filePath)

    }

}

  

const server = http.createServer(async (req, res) => {

    const url = req.url;

    const fileBuffer = await getFileInfo(url);

    if (fileBuffer) {
        res.writeHead(200)
        res.write(fileBuffer);
        res.end()
    } else {

        res.writeHead(404)

        res.write('<h1>404 Not Found</h1>')

        res.end()

    }

})

  

server.listen(3000, () => {

    console.log('Server is running on port 3000');

})
```



## https
http发送是明文发送的。
而https可以保证数据在传输过程不被窃取和篡改进而保证传输安全
对称加密（常见有RC2）不能解决篡改的问题

因此使用的非对称加密：得到一对密钥，一个加密一个解密

常见有RSA等


常见流程，A客户端，B服务端
B拥有一套密钥，B将公钥发给A，公钥加密，私钥解密

A接受到之后，产生一个key（用于后续对话），A使用公钥对key进行加密，然后传输给B

B用私钥解密得到key，然后A，B通过key进行加密对话
![[../PublicImage/Node/Pasted image 20240331184645.png]]
但是这样还是不太安全，因为第三者可以篡改公钥key1
![[../PublicImage/Node/Pasted image 20240331185322.png]]



因此引入了DC证书，CA证书颁发机构
证书内容有服务器地址，证书颁发机构
以及**私钥加密**的公钥key1，和私钥加密的证书签名

证书签名 = 服务器地址 + CA的公钥key + 服务端的公钥key1
证书签名的算法是公开的，他出现的目的是为了让每一个拿到证书的终端，可以验证签名是否被篡改



最终：（客户端A，服务端B）
A向B正式请求之前，B先向A发送证书，然后A进行验证签名，如果有第三者篡改内容，那么签名不会通过
签名通过之后后续步骤和非对称加密的一样
第三者只能拿到公钥key1，而不能篡改客户端拿到的key1，因此后续第三者无法对内容进行解析

### https模块


通常服务器有两种
- 直接的node服务器
- nginx代理服务器+ node服务器（更安全）
使用几乎和http一样除了创建
```js
const server = https.createServer(
{
	key:fs.readFileSync(path),//私钥路径
	cert:fs.readFileSync(path)//证书路径
},callback
)
```

其他和http几乎一致



## Node的生命周期（事件循环）


先执行main（主函数）
查看是否有事件没有完成，如果有就执行，没有就结束代码执行

在浏览器中是无限循环的，因为需要处理各种操作，比如用户交互，网络请求等，只有页面关闭才会结束事件循环

![[../PublicImage/Node/Pasted image 20240331193713.png]]
timers阶段：存放计时器和回调函数

poll：轮询队列
- 除了timers、checks
- 绝大部分回调都会放在这个队列，比如文件的读取、监听用户请求
- 运作方式：
	- 如果poll中有回调，一次执行回调，直到清空队列
	- 如果poll中没有回调
		- 等待其他队列中出现回调，结束该阶段，进入下一阶段
		- 如果其他队列中也没有回调，则持续等待，直到出现回调为止

node的事件循环使用的libuv（c写的）


```js
const start = Date.now()

setTimeout(function f1() {
    console.log('f1', Date.now() - start);
}, 200)

setTimeout(function f3() {
    console.log('f2', Date.now() - start);
},100)

  

const fs = require('fs')
fs.readFile('./index.html', 'utf-8', function f2() {
    console.log('readFile')
    const start = Date.now()
    while(Date.now() - start < 300) {}
})
```
![[../PublicImage/Node/Pasted image 20240331203310.png]]
先执行计时器1，计时器2，这两个分别进入计时，然后执行读文件操作，随后执行f2函数（异步函数），在f2函数中停止等待300ms，此时结束第一遍事件循环，此时所有计数器都截止，且f3先计时完成，因此执行f3和f1

check阶段：setImmediate的回调会直接进入
类似于setTimeout(fn,0)

```js
console.time()

let i = 0;
function test() {
    i++;
    if (i < 100) {
        setTimeout(test, 0);
    } else {
        console.timeEnd();
    }
}

test()


console.time('1')
function test1() {
    i++;
    if (i < 100) {
        setImmediate(test1);
    } else {
        console.timeEnd('1');
    }
}

test1()
```
![[../PublicImage/Node/Pasted image 20240331205417.png]]

为什么快呢？因为是直接加到check队列的不需要询问，而timer是需要等待计时的
且当嵌套层数过深会自动给setTimeout加上至少4ms的间隔计时

但是如果是这样子
```js
const start = Date.now()
setTimeout(() => {
    console.log('setTimeout', Date.now() - start)
},0)

setImmediate(() => {
    console.log('setImmediate', Date.now() - start)
})
```
![[../PublicImage/Node/Pasted image 20240331210448.png]]

对于等待在poll阶段的，setImmediate是先于setTimeout执行的
```js
  
const fs = require('fs');
fs.readFile('./1.txt', () => {
    setTimeout(()=>console.log('setTimeout'),0)
    setImmediate(()=>console.log('setImmediate'))
})
```
![[../PublicImage/Node/Pasted image 20240331211017.png]]

setTimeout(fn,0)
setImmediate(fn)这两者谁先执行不明确，如果电脑较卡，可能先执行setImmediate，比较流畅就先执行setTimeout，这里为什么？卡的时候，可能计时不再是0了
在一个事件循环周期内，如果有 "I/O callbacks" 或 "timers" 队列中的任务需要执行，那么 "check" 队列的任务将会推迟到下个循环。

Promise和nextTick是在事件循环中的优先级最高的一个梯队
process.nextTick是优先级最高的其次是promise然后再是其他的事件循环
```js
const process = require("process");

setTimeout(() => {
  console.log("Hello World");
}, 0);

Promise.resolve().then(() => {
    console.log("promise");
 })

process.nextTick(() => {
    console.log("nextTick");
})
```

打印
>nextTick
promise
Hello World



## 拓展EventEmitter

```js
rs.on('open',()=>{

})

rs.on('data',()=>{})
```

这些使用on注册事件
这个注册事件就是调用的eventEmitter

```js
const {EventEmitter} = require("events")
const ee = new EventEmitter()

ee.on('1',function fn1(){
	console.log('1')
})
ee.on('1',function fn2(){
	console.log('1')
})
ee.emit('1')

//移除
ee.off('1',fn2)
```
这里会打印两次，
注册事件，会将回调函数放在一个数组中，当触发时就会执行这个数组中的函数

大概类似于
```js
ee.on('1',()=>{
	console.log('1')
})
ee.on('1',()=>{
	console.log('1')
})
/**第一次先查看是否存在'1'
*ee = {}
if(ee['1']) ee['1'].push(fn)
else ee['1'] = [fn]


当emit时就是
let events = ee['1']
events.forEach(fn=> fn())
*/
```


# MySQL

数据库管理系统，关系型数据库
MySQL特点：开源、轻量、快速
密码：自己常用的密码
默认监听3306端口
和mysql交互
```sh
mysql -uroot -p
```

使用show databases;
可以查看数据库

通常使用navicat（收费）图形化管理数据库


 ## 数据库设计

SQL是结构化查询语言
其有几个分支
- DDL，数据定义语言，操作数据库对象
- DML，数据操作语言，操作数据库中的记录
- DCL，与角色管理有关
创建数据库
```sql
create database name;
```

切换数据库
```sql
use database
```

学过暂时跳过


# 数据驱动和ORM

## mysql驱动数据

驱动程序是连接内存和其他存储介质的桥梁
mysql驱动程序是连接内存数据和mysql数据的桥梁
mysql驱动程序通常使用mysql和mysql2（第三方，优化做的更好）

安装依赖
```sh
npm i mysql2
```



然后创建index.js
```js
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chen030127',
    database: 'companydb',
})
//连接数据库
  

connection.query(
    'SELECT * FROM `test` WHERE `name` = "Liang Ziyi" AND `age` > 25',
    function (err, results, fields) {
    
        console.log(results)
        console.log(fields)
    }
)

connection.end()
//断开连接
```

query查询语句的回调函数中的参数，err，results，fields分别是错误，结果，字段 


如果需要使用promise可以
```js
const mysql = require('mysql2/promise');

async function main() {

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
       password: 'chen030127',
        database: 'companydb'
    })

  

    const [results1] = await connection.query(

        'SELECT * FROM `test` WHERE `name` = "Liang Ziyi" AND `age` > 25',

    )

    console.log(results1)

    connection.end()

}

  

main()
```


需要防止sql注入
什么是sql注入，用户通过sql语句到最终查询中，导致了整个sql于与其行为不符

query语句是可以得到拼接后的sql语句导致sql注入。

那么这里最好使用的是execute方法
```js
const sql = `select * from company where id>? or name=?`
connection.execute(sql,[25,'李华'])
```
这里的`?`就是占位符效果。通过数组的每个值放在哪里


为了避免多次连接不释放占用服务器资源，通常使用连接池来进行连接

```js
const pool = mysql.createPool({
	hsot:'localhost',
	user:'root',
	database:'test',
	waitForConnections:true,
	connectionLimit:10,
	queueLimit:0
})
```

他会自动管理连接池的关闭
waitForConnections：如果连接数量满了，后面来的是否进行排队等候，如果不是则会报错
queueLimit：等待队伍的长度，0表示无限长 

模糊查询
```js
const sql = `select * from company where \`name\` like concat('%',?,'%');`
const [results] = await pool.execute(sql,[id])
```


## Sequelize简介
  
### ORM
Object Relational Mapping 对象关系映射
通过ORM框架，可以自动的把程序中的一些和数据库关联

ORM框架会隐藏具体的数据库底层细节，让开发者使用同样的数据操作接口，完成对不同数据库的操作

ORM的优势
- 开发者不用关心数据库，仅需要关心对象
- 可轻易的完成数据库的移植
- 无需拼接复杂的sql语句即可完成精确查询


### Node中的ORM

Sequelize和TypeORM主要是这两种

Sequlize支持js和ts

TypeORM支持TS，但是不成熟



## 模型定义和同步

```js
const sequelize = new Sequelize('myschooldb', 'root', 'chen030127', {
    host: 'localhost',
    dialect: 'mysql',
    logging:null//不再记录日志
})
```
第一到第三个参数分别是，数据库名称，用户名，密码
这样就创建了一个连接

可以测试连接是否成功
```js
async function connect() {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        //断开连接
        sequelize.close();
    }catch(error){
        console.error('Unable to connect to the database:', error);
    }
}
connect() 
```


模型(即是表)定义的方法，使用`sequelize.define

```js
const sequelize = require('./db')
const { DataTypes } = require('sequelize')

// 创建模型
const Admin = sequelize.define('admin',{
    loginId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    createdAt: 'createTime',
    updatedAt: 'updateTime',
    paranoid: true // 软删除,数据并非直接删除，而是标记为删除状态
})

Admin.sync() // 同步模型到数据库,如果表不存在则自动创建，已经存在则不再创建
//Admin.sync({force:true}) // 强制同步模型到数据库,如果表存在则删除再创建
//Admin.sync({alter:true}) // 同步模型到数据库,如果表存在则自动修改表结构

module.exports = Admin
```


表的关联：
比如
```js
const A = sequelize.define('a',{})
const B = sequelize.define('b',{})

A.hasOne(B,{/**/})//关联意味着A和B之间存在一对一的关系，外键在B中定义
A.belongsTo(B,{/**/})//关联意味着A和B之间存在一对一的关系，外键在A中定义
A.hasMany(B,{/**/})//A和B之间存在一对多的关系，外键在目标模型B中定义

```


## 模型的增删改

三层架构 
- 路由层
- 服务层
- 数据访问层
![[../PublicImage/Node/Pasted image 20240406081014.png]]
创建数据的方法
```js
const Admin = require('./models/Admin');

const ins = Admin.build({
    loginId: 'admin',
    password: 'admin',
    name: 'admin',
})//同步方法，构建一个admin实例

ins.save().then(() => {

    console.log('admin created successfully');
})

Admin.create({
    loginId: 'admin1',
    password: 'admin1',
    name: 'admin1',
}).then((ins)=>{
    console.log('admin1 created successfully');
})//异步方法，创建多个admin实例
```


## 模拟数据
[[使用mockJS]]

```js
const data = Mock.mock({
    "datas|500-700":[{
        //让id自增
        "id|+1":1,
        name:"@cname",
        "birthday":"@date",
        "sex|1-2":true,
        //电话正则
        mobile:/1[34578]\d{9}/,
        "ClassId|1-16":0
    }]
}).datas
```

这样子使用，其实可以看文档



## 数据查询

- 查询单个数据：findOne
- 参照主键查询单个数据：findByPK
- 查询多个数据：findAll
- 查询数量：count
- 包含关系：include

```js
const Student = require('../models/Student');

exports.addStudent = async(StudentData) => {
    const student = await Student.create(StudentData);
    return student.toJSON();
}

exports.deleteStudent = async(id) => {
    const student = await Student.findByPk(id);
    
    await student.destroy();
}

exports.updateStudent = async(id, StudentData) => {

    return await Student.update(studentData, {
        where:{
            id: id
        }
    })
}

exports.getStudents = async(page = 1, limit = 10,sex = -1) => {
    const students = await Student.findAndCountAll({
        offset: (page - 1) * limit,
        limit: +limit
    });
    const total = await Student.count();
    const datas = JSON.parse(JSON.stringify(students));
    return {
        total,
        datas
    }
}
```


## MD5加密

明文存储，拿到数据库权限之后，可以直接看到数据的账号和密码。

MD5是一种hash算法（单向加密）

可以使用md5进行加密
```js
const md = require('md5')
const messageMD = md('message')
```

特点
- hash加密算法中的一种
- 将任何一个字符串，加密成一个固定长度的字符串
- 单向加密：只能加密无法解密
- 同样的源字符串加密后得到的结果固定

## moment

utc和北京时间：
utc：世界协调时，以英国格林威治时间为标准
utc时间和北京时间相差8小时
utc的凌晨相当于背景时间的上午八点


时间戳：某个utc时间到utc1970-1-1凌晨经过的毫秒数，表示的是utc时间的差异

服务器可能会部署到世界的任何位置，服务器内部应该统一使用utc时间或时间戳，包括数据库

为了确保服务器与客户端的时间一致，可以使用moment
```js
const moment = require("moment")
console.log(moment().toString())//获取当前时间
console.log(moment.utc().toString())
```

获取时间戳
```js
+moment()
moment.valueOf()
```

根据指定的时间格式得到时间
```js
console.log(moment(0).toString(),+moment(0))
```


使用日期令牌转化
令牌是一个格式化的字符串,表明传入的日期是否有效
```js
const token = ["YYYY-MM-DD HH:mm:ss","YYYY-M-D H:m:s","x"]
moment("1970-01-01 00:00:00",token)
//按照指定格式显示
const m = moment.utc('2015-1-5 23:00:01',token,true)
console.log(m.format("YYYY年MM月DD日 HH点mm分ss秒"))

```

显示本地时间：m.local()


## 数据验证
数据验证的位置：
- 前端（客户端）：为了用户体验
- 路由层：验证接口格式是否正常
- 业务逻辑层：保证业务完整性
- 数据库验证：保证数据完整性

相关库： validator 用于验证某个字符串是否满足某个规则 

```js
exports.addStudent = async(StudentData) => {
    const stuObj =  pick(StudentData, ['name', 'birthday', 'sex', 'ClassId',"mobile"])
    const rule={
        name: {
            presence: { message: "姓名不能为空", allowEmpty: false },
            length: { minimum: 2,maximun:10, message: "姓名长度不能少于2个字符且不得多于10个字符" }
        },
        mobile:{
            presence: { message: "手机号不能为空", allowEmpty: false },
            format:/1[34578]\d{9}/
        }
    }
    const result = validate.validate(stuObj, rule)
    console.log(result)
    const student = await Student.create(stuObj);
    return student.toJSON();
}
```



## 日志记录

常用**log4js**针对node

日志级别
![[../PublicImage/Node/Pasted image 20240406162436.png]]
日志分类：sql日志、请求日志


日志出口

安装
```sh
npm i log4js
```

默认只有级别大于等于off的才会打印，否则就不进行打印

我们可以设置级别
```js
const log4js = require('log4js')
const logger = log4js.getLogger()

logger.level = 'debug'
```


```js
const path = require('path')
const log4js = require('log4js')
log4js.configure({
    appenders:{
        sql:{
            type:'file',
            filename:path.resolve(__dirname,"logs","sql","logging.log")
        }//出口名称
    },
    categories:{
        sql:{//分类名称
            appenders:['sql']// 指定这个Category的日志将被发送到名为'sql'的Appender进行处理
            ,level:'all'
        }
    }
})
```

sql分类使用了sql的配置
可能有点绕，图如下![[../PublicImage/Node/Pasted image 20240406164640.png]]


```js

const path = require('path')
const log4js = require('log4js')
log4js.configure({
    appenders:{
        sql:{
            type:'file',
            filename:path.resolve(__dirname,"logs","sql","logging.log")
        },//出口名称
        default:{
            type:'file',
            filename:path.resolve(__dirname,"logs","default","logging.log")
        }
    },
    categories:{
        sql:{//分类名称
            appenders:['sql']// 指定这个Category的日志将被发送到名为'sql'的Appender进行处理
            ,level:'all'
        },
        default:{
            appenders:['default'],
            level:'info'
        }
    }
})
const logger = log4js.getLogger()

process.on('exit',()=>{
    log4js.shutdown()
})

logger.info('abc')
const logger2 = log4js.getLogger('sql')
logger2.info('sql日志')
```
这样进行一个简单的配置
![[../PublicImage/Node/Pasted image 20240406165545.png]]然后就可以在logs中看到打印的日志了


常用配置
```js
const path = require('path')
const log4js = require('log4js')
log4js.configure({
    appenders:{
        sql:{
            type:'dateFile',
            filename:path.resolve(__dirname,"logs","sql","logging.log"),
            maxLogSize:1024 , //文件最大1KB
            keepFileExt:true, //保留文件扩展名
            layout:{
                type:'pattern',
                pattern:'%c [%d{yyyy-MM-DD hh:mm:ss}] [%p] : %m%n' //日志格式 时间 日志级别 日志内容 换行
            }
        },//出口名称
        default:{
            type:'stdout',
            filename:path.resolve(__dirname,"logs","default","logging.log")
        }
    },
    categories:{
        sql:{//分类名称
            appenders:['sql']// 指定这个Category的日志将被发送到名为'sql'的Appender进行处理
            ,level:'all'
        },
        default:{
            appenders:['default'],
            level:'info'
        }
    }
})

const sqlLogger = log4js.getLogger('sql')
const defaultLogger = log4js.getLogger('default')

module.exports = {
    sqlLogger,
    defaultLogger
}
```



# express

## express基本使用

为什么要使用express，而不使用http等模块
- 根据不同的请求路径、请求方法，做不同的事情，处理起来比较麻烦
- 读取请求提和写入响应体是通过流的方式，比较麻烦

因此使用第三方库
express和koa2

express生态更加完整 

```js
const express = require('express');

const app = express();
const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
```
然后方法如何定义？
```js
app.请求方法("请求路径",处理函数)
```
这样配置一个请求映射。
使用和http模块几乎一致

```js
const express = require('express');

const app = express();
const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
app.get('/news/:id',(req,res)=>{
    console.log("请求头",req.headers)

    console.log("请求参数",req.params)

    console.log("请求路径",req.path)
    console.log("请求查询",req.query)
    res.send("ok")
})
```

```js
app.get('/news/:id',(req,res)=>{
    
    res.status(302).location("http://www.baidu.com").end();
    res.redirect(302,"http://www.baidu.com")
})
```

这两种重定向都是ok的


同时也可以监听所有匹配路径
```js
app.all('*',()=>{
	cnsole.log("all")
})
```

全部路径和方法都可以进入这个，触发回调函数，相当于最后的留守


## nodemon

nodemon是一个监视器，用于监控工程中的文件变化，如果发现文件有变化，可以执行一段脚本

使用
```sh
npx nodemon index
```

当更改代码，无需手动重启
或者配置package.json
```js
"scripts": {
    "start": "npx nodemon -x pnpm server",
    "server":"node index.js"
  },
```




## express中间件

中间件就是处理函数

当匹配到了请求后，交给第一个请求函数处理
```js
const express = require('express');

const app = express();
const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
app.get('/news',(req,res,next)=>{
    console.log('handle1')
    next()
},(req,res,next)=>{
    next()
    console.log('handle2')
    res.send('news')
},(req,res,next)=>{
    console.log('handle3')
    next()
})
app.get('/news',(req,res)=>{
    console.log('handle4')

})
```
这样就是先hanle1，再handle3、handle4、handle2
next进行调度另一个匹配到东西

匹配到请求后
- 先交给第一个匹配到
- 然后需要在函数中手动交给后续的中间件进行处理

中间件的处理细节
- 如果后续没有中间件了，express发现如果响应没有结束那么响应404
- 如果中间件发生了错误，不会停止服务器，相当于调用了next(错误对象)，寻找一个后续处理错误的中间件，如果没有这个中间件就返回状态吗500 

处理错误的中间件
```js
module.exports = (err, req, res, next) => {
    if(err){
        const errObj = {
            code:500,
            msg:err instanceof Error? err.message : err,
        }
        res.send(errObj)
    }else{
        next()
    }
}
```


使用中间件常用`use`
```js
app.use('/news',require('./errorMiddleware.js'))
```
这个能匹配，/news, /news/abc, /news/123, /news/ab/cd/123


## 常用中间件

匹配静态资源，使用express.static

```js
const express = require('express');
const path = require('path')
const app = express();
const staticRoot = path.resolve(__dirname,'../public')
app.use(express.static(staticRoot))
app.use(require('./errorMiddleware'))

const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
```

其原理：
- 当请求时会根据请求路径，从指定目录中寻找是否存在该文件，如果存在，直接响应文件内容，而不再移交给后面
- 如果不存在，直接移交给后续的中间件 
默认情况下，如果映射的结果是一个目录，则会自动使用index.html文件


express.urlencoded通常用于拿到请求体，如果没有这个就拿不到，因为请求体是按流的格式来得到的 

```js
app.use(express.urlencoded({extended:true}))
app.post("/api/student",(req,res)=>{
console.log(res.body)
})
```

其实现：
```js
const qs = require('querystring');
module.exports = (req,res,next)=>{
    if(req.headers['content-type'] === 'application/x-www-form-urlencoded'){
        let body = '';
        req.on('data',chunk=>{
            body += chunk.toString('utf-8');
        });
        req.on('end',()=>{
            req.body = qs.parse(body);
            next();
        });
    }else{
        next();
    }
}
```


express.json
匹配json格式的消息体



## express路由

路由本质就是中间件

通过`express.Router`进行配置，好处就是不用再写大段的路径，且可以将同目录下的操作放在同一个文件，增加可维护性。


```js
const express = require('express')
const studentRouter = express.Router()
const studentService = require('../../services/studentService')
const { asyncHandler } = require('../getSendResult')


studentRouter.get('/', asyncHandler(async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const sex = req.query.sex || -1
    const name = req.query.name || ''
    return await studentService.getStudents(page, limit, sex, name)
})
)
studentRouter.get('/:id', asyncHandler(async (req, res) => {
    return await studentService.getStudentById(req.params.id)
}))
studentRouter.post('/', asyncHandler(async (req, res, next) => {
    return await studentService.addStudent(req.body)    
}))
studentRouter.put('/:id', asyncHandler(async (req, res, next) => {
    return await studentService.updateStudent(req.params.id, req.body)
}))
studentRouter.delete('/:id', asyncHandler(async (req, res, next) => {
    return await studentService.deleteStudent(req.params.id)
}))

module.exports = studentRouter
```
这是进行一个api的配置

```js
app.use('/api/student',require('./api/student'))//使用
```
所有的路径就会在以`/api/student`的基础上做添加，比如获取一个学生的信息，实际上的请求路径是`/api/student/:id`


这里就是路由层的配置，通过路由层操作服务层，服务层操作数据库

这里封装了一个高阶函数`asyncHandler`
```js
//高阶函数封装异步处理
exports.asyncHandler =(handler)=>{
    return async(req,res,next)=>{
        try{
            const result = await handler(req,res,next)
            res.send(this.getResult(result))
        }catch(err){
            next(err)
        }
    }
}
```

返回一个新的函数，在调用这个函数的时候，调用传入函数，拿到结果，然后对结果进行封装，使代码更加简洁，让函数更专注本职工作



## Cookie的基本概念
[[Cookie]]

###  cookie的组成
Cookie的来源
>服务器有一个接口，可以添加一个管理员。
>但是并非所有的人都有这个权限
>服务器如何知道请求接口的人使有权力的呢？——只有登陆过的管理员才可以操作
>
>但是客户端和服务器的传输使用的使http协议，http协议使无状态的，即服务器不知道这次请求的人跟前面登录的人是否同为一个人
>因为请求是频繁的，比如
>A登录（普通人），B登录（管理员），A发起操作请求，但是A没有这个权限。服务器如何得知呢


客户端成功后，服务器会给客户端一个出入证（令牌 token）
后续客户端每次请求，都必须携带出入证（令牌token）

客户端存在一个类似于卡包的东西，能具备下面的功能

1. 能够存放多个出入证
2. 能够自动出示出入证
3. 正确的出示出入证
4. 管理出入证的有效期。


整个卡包理解为整个cookie，一个卡包中的卡片（出入证）认定为一个cookie
每个cookie记录了如下的信息
- key：键，如「昵称」
- value：值，如「张三」
- domain：域，表达这个cookie属于哪个网站的
- path：路径，表达这个cookie属于该网站的那个基路径的
- secure：是否使用安全传输
- expire：过期时间



如果cookie满足以下条件就会自动发送
- cookie没有过期
- cookie的域和请求的域匹配
- cookie中的path和这次请求的path是匹配的
	- 比如cookie中的path是`/abc`那么能匹配`/abc`、`/abc/d`、`/abc/d/e/f/g`
- cookie的安全传输
	- 如果secure为true，那么请求的协议必须是https
	- 如果secure为false，那么请求的协议可以是http和https


###  如何设置cookie
- 服务器响应
- 客户端自行设置（较少），比如用户关闭了广告且选择了此后不再团出，那么后续请求时，就会从客户端发送给服务器不需要弹出广告的cookie，后续就不会出现广告了

服务端设置cookie
在响应头中加入
```
set-cookie:xxx
set-cookie:yyy
set-cookie:zzz
```

cookie的格式
```
键=值; path=?;domain=?;expire=?;max-age=?;secure;httponly
```

max-age和expire通常只设置一个即可，max-age=1000，那么会自动设置expire为当前时间+1000秒作为过期时间
如果既没有expire又没有max-age，则表示回话结束后过期

httponly：设置cookie是否仅能用于传输，设置了该值，表示cookie仅能用于传输，而不允许客户端通过JS获取，这对防止跨站脚本攻击（XSS）很有效 

```js
router.post('/login', asyncHandler(async (req, res) => {
    const result = await adminService.login(req.body.loginId, req.body.password);
    console.log(result);
    if(result){
        //设置cookie
        res.setHeader('Set-Cookie', `token=${result.id}; path=/; HttpOnly; max-age=3600`);
    }
    return result;
}));
```
可以自己设置cookie但是没必要，可以使用第三方库cookie-parser


比如
```js
//加入cookie-parser中间件
//加入之后，会在req对象上添加一个cookies属性，可以用来获取和设置cookie值
//加入之后，会在res对象上添加一个cookie方法，可以用来设置cookie值
app.use(require('cookie-parser')())

app.use(require('./tokenMiddleware'))//服务端验证cookie
```


然后使用
```js
res.cookie('token',result.id,{
            path:'/',
            domain: 'localhost',
            maxAge:1000*60*60, //1小时过期
            httpOnly:true, //不允许客户端访问
        })
```

登录之后给予token，通过cookie给予来适配浏览器，通过header给予适配其他终端


为了防止伪造cookie，可以
```js
app.use(require('cookie-parser')("secret"))

```
传输密钥
```js
res.cookie('token',result.id,{
            path:'/',
            domain: 'localhost',
            maxAge:1000*60*60, //1小时过期
            httpOnly:true, //不允许客户端访问
            signed:true //签名
        })
```
加上了`signed:true`这样传输过去的cookie就是加密状态

然后服务端进行获取token 的时候就不再是
```js
    let token = req.cookies.token;
```
这里是传输的时候定义了一个名为token的cookie

**而是**
```js
let token = req.signedCookies.token;
```
这样子


或者是手动进行加密（使用了内置库的）

```js
//使用对称加密算法对字符串进行加密和解密 aes 128
const crypto = require('crypto');
const secret = Buffer.from('a7c0pocrkadecizq')

const iv = "potikice03gpj24f"


exports.encrypt = (str) => {
    const cry = crypto.createCipheriv('aes-128-cbc', secret, iv)
    let result = cry.update(str, 'utf-8', 'hex')
    result += cry.final("hex")
    return result
}

exports.decrypt = (str) => {
    const cry = crypto.createDecipheriv('aes-128-cbc', secret, iv)
    let result = cry.update(str, 'hex', 'utf-8')
    result += cry.final("utf-8")
    return result
}
```

然后在路由层的api中的admin
更改
```js
let value = crypto.encrypt(result.id.toString());
res.cookie('token',value,{
	path:'/',
	domain: 'localhost',
	maxAge:1000*60*60, //1小时过期
})
```
这样在服务端发送给客户端的时候的cookie就是加密的。


然后服务端收到客户端发来的请求（需要验证cookie的）
就解密

服务端验证cookie的代码
```js
const {getErr} = require('./getSendResult')
const {pathToRegexp} = require('path-to-regexp')
const crypto = require('../utils/crypt')

const needTokenApi = [
    {method:"POST",path:"/api/student/"},
    {method:"PUT",path:"/api/student/:id"},
    {method:"DELETE",path:"/api/student/:id"},
    {method:"GET",path:"/api/student/:id"},
    {method:"GET",path:"/api/student/"}

]

module.exports = (req, res, next) => {
    const apis = needTokenApi.filter(item=>{
        if(item.method === req.method && pathToRegexp(item.path).test(req.path)){
            return true;
        }
    })
    if(apis.length === 0){
        next();
        return;
    }
    let token = req.cookies.token;
    if(!token){
        token = req.headers.authorization;
    }
    if(!token){
        //没有认证
        handleNoToken(req,res,next)
        return;
    }
    const userId = crypto.decrypt(token);
    req.userId = userId
    next();
}

function handleNoToken(req, res, next){
    res.status(401).send(getErr('请先登录', 401))
}
```




## 跨域

跨域只针对浏览器，是浏览器搞出来的同源策略

同源：
- 协议，http或者https
- 端口，例如：80或者443
- 主机名，例如：www.baidu.com
这三者完全相同


解决方法
- JSONP
- CORS
- nginx代理

### JSONP
浏览器端生成一个script元素，访问数据接口
服务器响应一段JS代码，调用某个函数，并发响应的数据传入
因为js代码不受同源策略影响
比如
```html
<script src='./index.js'></script>
```
在index.js中
```js
function callback(data){
    console.log(data);
}
function jsonp(url){
    const script = document.createElement('script');
    script.src=url;
    document.body.appendChild(script);
    script.onload = function(){
        script.remove();
    }
}

jsonp('http://localhost:3001/api/student')
```
然后在
服务端
```js
studentRouter.get('/', async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const sex = req.query.sex || -1
    const name = req.query.name || ''
    const result = await studentService.getStudents(page, limit, sex, name)
    const json = JSON.stringify(result)
    const script = `callback(${json})`  
    res.header("content-type","application/javascript").send(script)
}
)
```

![[../PublicImage/Node/Pasted image 20240408161604.png]]
这样就可以拿到数据了


JSONP的缺陷
- 会严重影响服务器的正常响应格式
- 只能使用get请求

这是更改之后的格式
![[../PublicImage/Node/Pasted image 20240408161846.png]]

这是之前的格式

![[../PublicImage/Node/Pasted image 20240408162022.png]]


### CORS

CORS是基于http1.1的一种跨域解决方案，Cross-Origin Resource Sharing

总体思路，如果浏览器要跨域访问服务器资源，需要获得服务器的允许

CORS针对不同的请求，规定了三种不同的交互模式
- 简单请求
- 需要预检的请求
- 附带身份凭证的请求
后面可以做的事越来越多，但是要求越来越严格

简单请求
当浏览器运行一段ajax代码（无论是XMLHttpRequest还是fetch api），浏览器会首先判断他属于哪一种请求模式

简单请求的判定
1. 请求方法属于下面的一种
   - get
   - post
   - head
2. 请求头仅包含安全的字段，常见的安全字段如下
   - Accept
   - Accept-Language
   - Content-Language
   - DPR
   - Downlink
   - Save-Data
   - Viewport-Width
   - Width
3. 请求头如果包含`Content-Type`，仅限下面的值之一
   - text/plain
   - multipart/form-data
   - application/x-www-form-urlencoded


简单请求的规范
当某个ajax跨域请求时简单请求时，会发生以下的事情

1. 请求头中自动添加Origin 字段
   相当于告诉服务器，那个源地址再跨域请求
2. 服务器响应头中应包含`Access-Control-Allow-Origin`
   当服务器收到请求之后如果允许该请求跨域，需要再响应头中添加`Access-Control-Allow-Origin`字段
   这个字段的值可以分为
   - * ：表示任何请求都允许跨域
   - 具体的源：比如http://my.com，表示来自于这个地址的我允许你访问
	 服务器可以维护一个可悲允许的源列表，如果请求的Origin命中该列表，才响应* 或具体的源（最好是具体的源）


![[../PublicImage/Node/Pasted image 20240408170047.png]]
   

比如出现了这个错误
然后服务器处理跨域，写一个处理跨域的中间件
然后使用 

```js
const allowOrigin = [
    "http://localhost:3001",
    "null",
    "http://127.0.0.1:5500"
]


module.exports = (req, res, next)=>{
    //处理简单请求
    if("origin" in req.headers && allowOrigin.includes(req.headers.origin)){
        res.header("Access-Control-Allow-Origin", req.headers.origin)
    }
    next()
}
```

![[../PublicImage/Node/Pasted image 20240408170952.png]]

需要预检的请求
当认为发送的不是一个简单请求之后，就会按照下面流程进行
1. 浏览器发送预检，询问服务器是否允许
2. 服务器允许
3. 浏览器发送真实请求
4. 服务器完成真实响应


比如再请求发起的时候设置了额外的请求头或者其他的

```js
fetch("http://localhost:3001/api/student",{
	method:"POST",
	headers:{
		a:1,
		b:2,
		"content-type":"application/json",
        authorization: `${token}`
	},
    credentials: 'include',
}).then(res=>res.json()).then(data=>console.log(data))

```
浏览器发现这不是一个简单的请求，按照下面的流程与服务器交互

1. 浏览器发送预检请求，询问服务器是否允许
   >OPTIONS /api/student HTTP/1.1
   >	Host:crossdomain.com
   >	Origin:http://my.com
   >	Access-Control-Request-Method:POST
   >	Access-Control-Request-Headers:a,b,content-type
2. 如果服务器允许，那么会返回下面的消息格式
   >HTTP/1.1 200 OK
   >   Date:xxxxx
   >   ...
   >   Access-Control-Allow-Origin:http://my.com
   >   Access-Control-Allow-Methods:POST
   >   Access-Control-Allow-Headers:a,b,content-type
   >   Access-Control-Max-Age:86400
   >   
	分别表达允许请求的源、请求的方法，请求头这些，然后设置一个时间，表达这个时间之内不用再次发送预请求

```js
//处理预检请求
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Origin", req.headers.origin) //允许跨域请求
        res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"])//允许跨域请求的header
        
    }
```
注意这里放在req.headers是一个对象，需要处理跨域问题


附带身份凭证的请求
默认情况下，ajax的跨域请求并不会附带cookie，这样依赖某些需要权限的操作无法进行
![[../PublicImage/Node/Pasted image 20240408184834.png]]
比如这个，请求通过了，但是没有携带token，无法实现操作

可以通过简单的配置实现附带cookie
```js
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

fetch(url,{
	credentials:"include"
})
```

这样在发送请求的时候就能携带cookie了
但是这样会带来新的跨域问题，这时候需要服务器多响应一个键值对
`Access-Control-Allow-Credentials:true`
```js
    res.header("Access-Control-Allow-Credentials", true)
```

也可以使用cors中间件

```js
const cors = require("cors")
const corsOptions = {
	origin:'xxx',
	optionsSuccessStatus:200
}
app.get("/products/:id",cors(corsOptions),(req,res,next)=>{
	
})
```

origin也可以配置函数



## Session

Cookie，Session，JWT这三者有什么关系呢

Cookie存储在客户端，不占用服务器资源
缺点
- 只能是字符串格式
- 存储量有限
	- sessionStorage
	- localStorage
	- 可以解决这个问题
- 数据容易被获取
- 数据容易被篡改
- 容易丢失

Session，存储在服务端
优点：
- 可以是任何格式
- 存储量理论上无上限
- 数据难以被获取
- 数据难以篡改
缺点：
- 占用服务器资源

![[../PublicImage/Node/Pasted image 20240408194543.png]]

缺点：服务器占用内存大，且浏览器是否关闭服务端不可知

因此session是设置了一个过期时间的



## JWT

JWT全称`JSON Web Token `

起源：
前后端分离的发展，越来越多公司会创建一个中心服务器，服务于各种产品线，不同的产品有不同的数据。
这样使用传统的cookie进行传输可以吗？浏览器对cookie有自动处理，但是其他的呢？手机上的应用可以吗？需要特殊处理

JWT出现是为了各种终端设备，提供统一的、安全的令牌格式

JWT可以存储到cookie，也可以存储到localstorage

jwt可以出现在响应的任何一个地方，客户端和服务器自行约定即可

通常是以下格式
```
GET /api/resources HTTP/1.1
...
authrization: bearer jwt令牌
...
```


令牌的组成
1. header:令牌头部，记录了整个令牌的类型和签名算法
2. payload：令牌复合，记录了保存的主题信息，比如你要保存的用户信息可以放在这里
3. signature：令牌签名，按照头部固定的签名算法，对整个令牌进行签名，该签名的作用是：保证令牌不被伪造和篡改
组合的完整格式：`header.payload.signature`


header一般是个json对象
```json
{
	"alg":"HS256",
	"typ":"JWT"
}
```

alg：signature使用的签名算法，通常取两个值
	HS256:一种对称加密算法，使用同一个密钥对signature加密解密
	RS256:一种非对称加密算法，使用私钥加密、公钥解密

type：整个令牌的类型，固定JWT就ok

生成方式，将header部分使用base64 url编码即可
浏览器提供了btoa函数，可以完成这个操作
```js
window.btoa(JSON.stringify({
	"alg":"HS256",
	"type":"JWT"
}))
```
得到字符串

浏览器提供了atob来进行解码
```js
window.atob("xxx")
```

nodejs可以使用第三方库`atob`和`btoa`实现

payload：
jwt的主体信息，可以不写
![[../PublicImage/Node/Pasted image 20240408221736.png]]

甚至可以天机用户的id、账号这些都可以（因为他本身就是一个json对象而已）


signature：jwt的签名，保证jwt不被篡改。

signature就是对称加密算法HS256对字符串`header.payload`这两部分进行加密，当然这里需要指定一个密钥，比如`shhh`
这里得到的字符串就是第三部分
由于签名使用的密钥存放在服务器，这样一来，客户端无法为找签名因为他拿不到密钥

前两部分可以明文传输

验证，将header+payload用同样的密钥进行加密然后和jwt进行比较，如果相同，那么就可以进行其他验证，比如是否过期等


### 登录验证

使用jsonwebtoken库
jwt.sign(加密对象，密钥，配置对象)

```js
const jwt = require("jsonwebtoken")
const secrect = "test"
const token = jwt.sign({
	id:1,
	name:'123'
},secrect,{
	expiresIn:3600//1h后过期
})

const decode = jwt.decode(token)
try{
const verify = jwt.verify(token,secrect)
}catch(err){
console.log("jwt无效")
}
```

jwt.decode(token)，没有验证

jwt.verify(token,secrect)，验证不通过会报错


基本使用
```js
// 颁发jwt
const secret = 'secret'
const cookieKey = 'token'
const jwt = require('jsonwebtoken')
exports.publish = (res, maxAge = 3600 * 24, info = {}) => {
    const token = jwt.sign(info, secret, { expiresIn: maxAge })
    res.cookie(cookieKey, token, { maxAge: maxAge * 1000, httpOnly: true, path: '/' })
    res.header('Authorization', `Bearer ${token}`)
}

exports.verify = (req) => {
    let token = req.headers.authorization || req.cookies[cookieKey]
    if (!token) return null
    try {
        const parts = token.split(' ')
        token = parts.length === 2 ? parts[1] : parts[0]
        const result = jwt.verify(token, secret)
        return result;
    } catch (err) {
        return null
    }
} 
```






## 常见场景

### 一、日志记录



