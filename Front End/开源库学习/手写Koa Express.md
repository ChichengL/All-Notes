## 核心差异

|特性|Koa|Express|
|---|---|---|
|**中间件机制**|洋葱模型（async/await）|线性执行（回调函数）|
|**上下文**|封装 `ctx` 对象|原生 `req`/`res` 对象|
|**错误处理**|更易通过 try/catch 捕获|需要手动传递错误|
|**设计理念**|更现代，利用 Promise|传统回调风格|

# Koa
### 基本使用
Koa 的中间件按顺序执行，形成类似洋葱的结构：  
**先进后出**，每个中间件通过 `await next()` 暂停自身，进入下一个中间件，最后反向回溯。
```js
const Koa = require('koa');
const app = new Koa();

// 中间件1
app.use(async (ctx, next) => {
  console.log('1. 进入中间件1');
  await next(); // 跳转到下一个中间件
  console.log('5. 离开中间件1');
});

// 中间件2
app.use(async (ctx, next) => {
  console.log('2. 进入中间件2');
  await next();
  console.log('4. 离开中间件2');
});

// 中间件3（最内层）
app.use(async (ctx) => {
  console.log('3. 处理请求');
  ctx.body = 'Hello Koa'; // 设置响应体
});

app.listen(3000);

// 输出顺序：
// 1. 进入中间件1 → 2. 进入中间件2 → 3. 处理请求 → 4. 离开中间件2 → 5. 离开中间件1
```

### 上下文
```js
app.use(async (ctx) => {
  // 请求相关
  ctx.method;      // HTTP 方法（GET/POST等）
  ctx.url;         // 请求 URL
  ctx.query;       // 解析后的查询参数（对象形式）
  ctx.params;      // 路由参数（需配合路由库如 koa-router）
  ctx.request.body; // 请求体（需配合 body 解析中间件）

  // 响应相关
  ctx.status = 200; // 设置状态码
  ctx.body = { data: 'ok' }; // 响应内容（自动设置 Content-Type）
  ctx.set('X-Custom-Header', 'value'); // 设置响应头
});

/**
ctx.req;  // Node 的 request 对象
ctx.res;  // Node 的 response 对象
ctx.request; // Koa 封装的 request
ctx.response; // Koa 封装的 response
*/
```

### 异常处理
```js
// 统一错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

// 抛出错误示例 同时支持异步 async await
app.use(async (ctx) => {
  if (ctx.query.token !== 'secret') {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error; // 触发错误处理中间件
  }
  ctx.body = 'Access granted';
});

const Router = require('koa-router');
const router = new Router();

router.get('/users/:id', async (ctx) => {
  const userId = ctx.params.id; // 获取路由参数
  ctx.body = `User ID: ${userId}`;
});

app.use(router.routes());
```


## 手写实现
```js
const http = require('http');

class Koa {
  constructor() {
    this.middlewares = []; // 存储中间件
    this.context = { // 上下文对象
      req: null,
      res: null,
      request: null,
      response: null,
    };
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  listen(port, callback) {
    const server = http.createServer(async (req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res);
      // 组合中间件
      const fn = compose(this.middlewares);
      // 执行中间件链
      await fn(ctx);
      // 最终响应
      ctx.res.end(ctx.body);
    });
    server.listen(port, callback);
  }

  createContext(req, res) {
    const ctx = Object.create(this.context);
    ctx.req = req;
    ctx.res = res;
    ctx.request = { body: '' };
    ctx.response = {};
    return ctx;
  }
}
function compose(middlewares) {
  return function (ctx) {
    return dispatch(0);
    
    function dispatch(i) {
      const fn = middlewares[i];
      if (!fn) return Promise.resolve();
      return Promise.resolve(
        fn(ctx, () => dispatch(i + 1)) // 这里的 next 就是下一个中间件
      );
    }
  };
}
```



# Express
### 基本使用
```js
const express = require('express');
const app = express();

// 中间件1（通用中间件）
app.use((req, res, next) => {
  console.log('Middleware 1 - Start');
  next(); // 必须调用 next() 才能继续
  console.log('Middleware 1 - End');
});

// 中间件2（路由级中间件）
app.get('/', (req, res, next) => {
  console.log('Middleware 2 - Handle Request');
  res.send('Hello Express');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// 输出顺序：
// Middleware 1 - Start → Middleware 2 - Handle Request → Middleware 1 - End
```

### 核心功能
#### 自带路由
```js
// 基本路由
app.get('/users', (req, res) => {
  res.send('User List');
});

// 带参数的路由
app.get('/users/:id', (req, res) => {
  const userId = req.params.id; // 获取路由参数
  res.send(`User ID: ${userId}`);
});

// POST 请求处理
app.post('/users', (req, res) => {
  const userData = req.body; // 需配合 body-parser 中间件
  res.json({ success: true });
});
```
#### 请求和响应
```js
// 请求对象（req）
req.query;      // 获取查询参数（如 ?name=John → { name: 'John' }）
req.params;     // 路由参数（如 /users/:id → { id: '123' }）
req.body;       // 请求体（需配合 body-parser）
req.cookies;    // Cookie 数据（需配合 cookie-parser）

// 响应对象（res）
res.status(404).send('Not Found');     // 设置状态码和内容
res.json({ data: 'JSON Response' });   // 发送 JSON
res.redirect('/new-path');             // 重定向
res.set('X-Custom-Header', 'value');   // 设置响应头
res.sendFile('/path/to/file.html');    // 发送文件
```
#### 模版引擎
```js
// 配置模板引擎（以 EJS 为例）
app.set('views', './views');    // 模板文件目录
app.set('view engine', 'ejs');  // 使用的引擎

// 渲染页面
app.get('/', (req, res) => {
  res.render('index', { title: 'Express App' }); // 渲染 views/index.ejs
});
```
### 错误处理
#### 同步错误
```js
app.get('/error', (req, res) => {
  throw new Error('BROKEN'); // Express 会自动捕获并返回 500
});
```
#### 异步错误
```js
app.get('/async-error', (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error('Async Error');
    } catch (err) {
      next(err); // 手动传递错误给错误处理中间件
    }
  }, 1000);
});
```

#### 错误中间件
```js
// 放在所有中间件之后
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```


## 手写实现
```js
const http = require('http');

class Express {
  constructor() {
    this.middlewares = []; // 存储中间件和路由
  }

  use(handler) {
    this.middlewares.push(handler);
  }

  get(path, handler) {
    this.middlewares.push((req, res, next) => {
      if (req.method === 'GET' && req.url === path) {
        handler(req, res);
      } else {
        next();
      }
    });
  }
  post(path, handler){
	  this.middlewares.push((req, res, next) => {
      if (req.method === 'POST' && req.url === path) {
        handler(req, res);
      } else {
        next();
      }
    });
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      let idx = 0;
      const next = () => {
        if (idx < this.middlewares.length) {
          this.middlewares[idx++](req, res, next);
        }
      };
      next();
    });
    server.listen(port, callback);
  }
}
const app = new Express();

app.use((req, res, next) => {
  console.log('Middleware 1');
  next();
});

app.get('/', (req, res) => {
  res.end('Hello Express');
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  next();
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// 访问 / 时输出：
// Middleware 1
// Hello Express（不会执行 Middleware 2）
```