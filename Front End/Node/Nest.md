# Nest 学习笔记

nest 采用的适配器的设计模式
Nest 本身只依赖 HttpServer 接口，并不和具体的库耦合。
nest 对标的 java 的 spring 框架。

/user/create、/user/list 这些是不同的路由这些路由在 Controller 中声明。
通过装饰器语法来实现路由的拦截器。

### 小试牛刀

```typescript
@Controller("/user")
export class UserController {
  @Post("/create")
  createUser(@Body() createUserDto: CreateUserDto) {
    return "create user";
  }

  @Get("/list")
  listUser() {
    return "list user";
  }
}
```

- @Param 获取 url 中的参数

```typescript
@Get("/:id")
getUser(@Param("id") id: string) {
  return `get user ${id}`;
}
```

- @Query 获取 url 中的 query 参数

```typescript
@Get("/list")
xxx(@Query("name") name: string) {
  return `get user ${name}`;
}
```

- @Body 获取请求体中的参数

```typescript
@Post("/create")
createUser(@Body() createUserDto: CreateUserDto) {
  return `create user ${createUserDto.name}`;
}
```

tips:请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }我们会通过 dto （data transfer object）来接收。

- @Res 响应对象

```typescript
@Get("/list")
```

总结上面的用法

- controller 是处理路由和解析请求参数的
- service 里做业务逻辑的具体实现，比如操作数据库等
- dto 是封装请求参数的。
- entity 是数据库的表结构。
  每个模块里都包含 controller 和 service：

```typescript
@Module({
    controllers: [UserController],
    providers: [UserService],
})
```

nest 通过@Module 来定义一个模块，nest 通过一个依赖注入的机制(ioC 控制反转)来实现声明、创建依赖
每个模块都应该有 controller、service、module、dto、entities
controller 接收请求参数，交给 model 处理（model 就是处理 service 业务逻辑，处理 repository 数据库访问），然后返回 view，也就是响应。

跨多个 controller 时，nest 提供了 AOP 的机制，让一个方法在多个 controller 中都能执行。
通用的处理可以作为一个切面（aspect）来实现。![alt text](../Public%20Image/Node/image.png)

### nest/cli

nest/cli 是 nest 的脚手架工具，可以快速生成项目结构、文件、代码。
常用命令:

- nest new project-name 创建项目
- nest generate resource/module/service/controller xxx: 创建一整个模块、module、service、controller。它同样会自动在 AppModule 引入
- nest build 生成项目
- nest start 启动项目 (nest build 之后)
- nest info 查看 nest 版本信息

### 数据传输

- url params: 通过 @Param() 装饰器获取 url 中的参数。
- query params: 通过 @Query() 装饰器获取 url 中的 query 参数。
- form-urlencoded data: 通过 @Body() 装饰器获取请求体中的参数。
- formData data: 通过 @Body() 装饰器获取请求体中的参数。
- json data: 通过 @Body() 装饰器获取请求体中的参数。

url params:

```
http://www.baidu.com/user
```

user 是 url params。

query params:

```
http://www.baidu.com/user?name=xxx
```

name 是 query params。(只支持 ascii 字符，中文和特殊字符需要 encodeURIComponent 处理)

form-urlencoded data:
类似于 query params，但是请求体中的参数是 application/x-www-form-urlencoded 格式。相当于数据放在了请求体中。

formData data:用 --------- + 一串数字做为 boundary 分隔符。

json data: 请求体中的参数是 json 格式。
指定 content type 为 application/json

调用下 useStaticAssets 来支持静态资源的请求

```typescript
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets("public", { prefix: "/static/" });
  await app.listen(3000);
}
bootstrap();
```

IoC 控制反转
在对象上声明依赖关系，而不是在对象创建时声明。Nest 通过依赖注入（DI）来实现控制反转。通过装饰器语法来实现
@Injectable 通过这个声明，表示这个类可以被注入，注入分为 属性注入 和 构造器注入。

属性注入：

```typescript
import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
@Controller()
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;
}
```

构造器注入：

```typescript
import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
```

通过 @Module 声明模块，其中 controllers 是控制器，只能被注入。
IoC 机制是在 class 上标识哪些是可以被注入的，它的依赖是什么，然后从入口开始扫描这些对象和依赖，自动创建和组装对象。

### provider

providers 是可以被注入的对象，可以是类、值、工厂函数。

```typescript
// app.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}

//app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

这个就是一个 provider
@Moudule 中 providers 数组中的每一项除了是类之外还可以是对象

```typescript
@Module({
    providers: [
        {
            provide: 'APP_SERVICE',
            useClass: AppService
        },
        {
            provide: 'person2',
            useValue: {
                name: 'John',
                age: 30
            }
        },
        {
            provide:'person',
            useFactory: () => ({ name: 'John', age: 30 })
        }
    ]
})
```

模块导出 provider，另一个模块需要 imports 它才能用这些 provider。
但如果这个模块被很多模块依赖了，那每次都要 imports 就很麻烦。
这里就可以使用全局模块，把 provider 注册到全局，然后其他模块都可以直接使用。

```typescript
// aaa.module.ts
import {Module, Global} from "@nestjs/common";
import {AAAService} from "./aaa.service";
import {AAAController} from "./aaa.controller";
@Global()
@Module({
    controllers: [AAAController],
    providers: [AAAService],
    exports: [AAAService]
})

// bbb.module.ts
import {Module} from "@nestjs/common";
import {BBBService} from "./bbb.service";
import {BBBController} from "./bbb.controller";

@Module({
    imports: [],//这里不用显示声明AAAModule，因为它已经被注册到全局了
    controllers: [BBBController],
    providers: [BBBService]
})

// bbb.service.ts
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class BBBService {
  constructor(private readonly aaaService: AAAService){}
  getHello(): string {
    return this.aaaService.getHello();
  }
}
```

全局模块可以被其他模块依赖，也可以被其他模块导入。不用再显式声明。
但是也有个弊端，如果过度使用，就无法得知 provider 的来源，也不方便排查问题。类似于 vue 的 mixin

生命周期:
Nest 在启动的时候，会递归解析 Module 依赖，扫描其中的 provider、controller，注入它的依赖。
这里有生命周期的方法

- 初始化生命周期
  - onModuleInit() 在模块初始化之后调用，只会被调用一次。
  - onApplicationBootstrap() 在应用启动之后调用，只会被调用一次。
    首先，递归初始化模块，会依次调用模块内的 controller、provider 的 onModuleInit 方法，然后再调用 module 的 onModuleInit 方法。
    全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法

nest 提供了两个接口

```typescript
export interface onModuleInit {
  onModuleInit(): any;
}
export interface onApplicationBootstrap {
  onApplicationBootstrap(): any;
}
```

可以分别在 controller、provider、module 实现这两个接口，然后在 Nest 启动的时候，会自动调用这两个方法。

```typescript
import {
  Injectable,
  onModuleInit,
  onApplicationBootstrap,
} from "@nestjs/common";
@Injectable()
export class AService implements onModuleInit, onApplicationBootstrap {
  onModuleInit() {
    console.log("onModuleInit");
  }
  onApplicationBootstrap() {
    console.log("onApplicationBootstrap");
  }
}

//a.controller.ts
import {
  Controller,
  onModuleInit,
  onApplicationBootstrap,
} from "@nestjs/common";
import { AService } from "./a.service";
@Controller()
export class AController implements onModuleInit, onApplicationBootstrap {
  onModuleInit() {
    console.log("onModuleInit");
  }
  onApplicationBootstrap() {
    console.log("onApplicationBootstrap");
  }
}

// a.module.ts
import { Module, onModuleInit, onApplicationBootstrap } from "@nestjs/common";
import { AService } from "./a.service";

@Module({
  imports: [],
  controllers: [AController],
  providers: [AService],
})
export class AModule implements onModuleInit, onApplicationBootstrap {
  onModuleInit() {
    console.log("onModuleInit");
  }
  onApplicationBootstrap() {
    console.log("onApplicationBootstrap");
  }
}
```

- 销毁生命周期
  - onModuleDestroy() 在模块销毁之前调用，只会被调用一次。
  - beforeApplicationShutdown() 在应用关闭之前调用，只会被调用一次。
  - onApplicationShutdown() 在应用关闭之前调用，只会被调用一次。
    先调用每个模块的 controller、provider 的 onModuleDestroy 方法，然后调用 Module 的 onModuleDestroy 方法。
    之后再调用每个模块的 controller、provider 的 beforeApplicationShutdown 方法，然后调用 Module 的 beforeApplicationShutdown 方法。
    然后停止监听网络端口。
    之后调用每个模块的 controller、provider 的 onApplicationShutdown 方法，然后调用 Module 的 onApplicationShutdown 方法。

beforeApplicationShutdown 和 onApplicationShutdown 的区别：
beforeApplicationShutdown 能够传入一个 signal 系统信号量，比如 SIGTERM。
这些终止信号是别的进程传过来的，让它做一些销毁的事情，比如用 k8s 管理容器的时候，可以通过这个信号来通知它。

```typescript
const app = await NestFactory.create(AppModule);
await app.listen(3000);
app.close(); // 关闭应用
```

## AOP 架构

后端框架基本都是 MVC(Model View Controller)架构的。MVC 架构下，请求会先发送给 Controller，由它调度 Model 层的 Service 来完成业务逻辑，然后返回对应的 View。
