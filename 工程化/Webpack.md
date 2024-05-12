## 出现背景
`Webpack` 最初的目标是实现前端项目的模块化，旨在更高效地管理和维护项目中的每一个资源
前端开发遇到的问题
- 需要通过模块化的方式来开发
- 使用一些高级的特性来加快我们的开发效率或者安全性，比如通过ES6+、TypeScript开发脚本逻辑，通过sass、less等方式来编写css样式代码
- 监听文件的变化来并且反映到浏览器上，提高开发的效率
- JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题
- 开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化

webpack的功能：
- 编译代码
- 模块整合（浏览器同一时间只能发起6个请求，为了避免多次请求）
- 万物皆模块


# webpack的构建流程
分为三大步：
- 初始化流程
- 编译构建流程
- 输出流程

### 初始化流程
从配置文件中和shell中读取并且合并参数，得到最终参数，然后拷贝到options对象中。
完成上述步骤之后，则开始初始化`Compiler`编译对象，该对象掌控者`webpack`声明周期，不执行具体的任务，只是进行一些调度工作。


## 编译构建流程
根据配置中的`entry`找出所有的入口文件
然后调用`Compiler`的run启动编译构建流程
- `compile` 开始编译
- `make` 从入口点分析模块及其依赖的模块，创建这些模块对象
  递归创建依赖图
- `build-module` 构建模块
- `seal` 封装构建结果
- `emit` 把各个chunk输出到结果文件

`compile编译`
执行了`run`方法后，首先会触发`compile`，主要是构建一个`Compilation`对象
该对象是编译阶段的主要执行者，主要会依次下述流程：执行模块创建、依赖收集、分块、打包等主要任务的对象

`seal输出资源`

`seal`方法主要是要生成`chunks`，对`chunks`进行一系列的优化操作，并生成要输出的代码
`webpack` 中的 `chunk` ，可以理解为配置在 `entry` 中的模块，或者是动态引入的模块
根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再把每个 `Chunk` 转换成一个单独的文件加入到输出列表

`emit输出完成`
在确定好输出内容后，根据配置确定输出的路径和文件名
![](Public%20Image/Webpack/Pasted%20image%2020240512171731.png)



## Webpack的Loader
引入目的：
Webpack本身只能对js和json文件进行打包的。那么对于`css，png`等资源是如何处理的呢？
这里就需要配置对应的`loader`进行处理

那么loader的作用就是，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中。即`拓展webpack`让他拥有处理其他文件的能力

加载模块的执行顺序
![](https://static.vue-js.com/9c2c43b0-a6ff-11eb-85f6-6fac77c0c9b3.png)
关于配置`loader`的方式有三种：

- 配置方式（推荐）：在 webpack.config.js文件中指定 loader
- 内联方式：在每个 import 语句中显式指定 loader
- CLI 方式：在 shell 命令中指定它们
配置方式：
- `rules`是一个数组的形式，因此我们可以配置很多个`loader`
- 每一个`loader`对应一个对象的形式，对象属性`test` 为匹配的规则，一般情况为正则表达式
- 属性`use`针对匹配到文件类型，调用对应的 `loader` 进行处理
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```

常见loader
- style-loader: 将css添加到DOM的内联样式标签style里
- css-loader :允许将css文件通过require的方式引入，并返回css代码
- less-loader: 处理less
- sass-loader: 处理sass
- postcss-loader: 用postcss来处理CSS
- autoprefixer-loader: 处理CSS3属性前缀，已被弃用，建议直接使用postcss
- file-loader: 分发文件到output目录并返回相对路径
- url-loader: 和file-loader类似，但是当文件小于设定的limit时可以返回一个Data Url
- html-minify-loader: 压缩HTML
- babel-loader :用babel来转换ES6文件到ES5


## Webpack的Plugin
目的：
Plugin 的目的是为了在打包过程的特定时刻执行更复杂的任务，或对输出结果进行修改，这是 Loader 所不能胜任的。Plugin 能够在构建过程中的多个阶段介入，实现更高级的功能和优化。
功能：
`webpack`中的`plugin`也是如此，`plugin`赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期），贯穿了`webpack`整个编译周期
![](Public%20Image/Webpack/Pasted%20image%2020240512173042.png)

他出现是为了解决`loader`无法实现的其他事

配置是在plugins属性传入new实例对象
```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {
  ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};
```

特性：
其本质是一个具有apply方法的javascript对象，具有`apply`方法

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建过程开始！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```



## 面试题

### Loader和Plugins的区别，编写思路
区别：
- 就运行时机而言：
  Loader运行在打包文件之前
  plugins在整个编译周期都起作用
- 对作用而言：
  Loader类似于转化器，对单个文件进行处理。
  plugin赋予webpack各种灵活功能，例如打包优化、环境变量注入等，解决loader无法实现的其他事

Loader的特点
loader本质是一个函数，其this会被webpack填充，他接受一个参数，为webpack传递给loader的文件源内容。
函数中有异步操作或同步操作，异步操作通过 `this.callback` 返回，返回值要求为 `string` 或者 `Buffer`
```js
module.exports = function(source) {
    const content = doSomeThing2JsString(source);
    
    // 如果 loader 配置了 options 对象，那么this.query将指向 options
    const options = this.query;
    
    // 可以用作解析其他模块路径的上下文
    console.log('this.context');
    
    /*
     * this.callback 参数：
     * error：Error | null，当 loader 出错时向外抛出一个 error
     * content：String | Buffer，经过 loader 编译后需要导出的内容
     * sourceMap：为方便调试生成的编译后内容的 source map
     * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
     */
    this.callback(null, content); // 异步
    return content; // 同步
}
```


编写plugin

webpack基于发布订阅模式，在运行的生命周期中会给广播出许多时间，插件通过监听这些时间，就可以在特定阶段执行任务

- compiler：包含了 webpack 环境的所有的配置信息，包括 options，loader 和 plugin，和 webpack 整个生命周期相关的钩子
- compilation：作为 plugin 内置事件回调函数的参数，包含了当前的模块资源、编译生成资源、变化的文件以及被跟踪依赖的状态信息。当检测到一个文件变化，一次新的 Compilation 将被创建
规范
- 插件必须是一个函数或者是一个包含 `apply` 方法的对象，这样才能访问`compiler`实例
- 传给每个插件的 `compiler` 和 `compilation` 对象都是同一个引用，因此不建议修改
- 异步的事件需要在插件处理完任务时调用回调函数通知 `Webpack` 进入下一个流程，不然会卡住

```js
class MyPlugin {
    // Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply (compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', compilation => {
        // compilation: 当前打包构建流程的上下文
        console.log(compilation);
        
        // do something...
    })
  }
}
```


### webpack的热更新事如何做到的。
开启热更新
```js
const webpack = require('webpack')
module.exports = {
  // ...
  devServer: {
    // 开启 HMR 特性
    hot: true
    // hotOnly: true
  }
}
```
![](Public%20Image/Webpack/Pasted%20image%2020240512191122.png)
- Webpack Compile：将 JS 源代码编译成 bundle.js
- HMR Server：用来将热更新的文件输出给 HMR Runtime
- Bundle Server：静态资源文件服务器，提供文件访问路径
- HMR Runtime：socket服务器，会被注入到浏览器，更新文件的变化
- bundle.js：构建输出的文件
- 在HMR Runtime 和 HMR Server之间建立 websocket，即图上4号线，用于实时更新文件变化

上面图中，可以分成两个阶段：

- 启动阶段为上图 1 - 2 - A - B

在编写未经过`webpack`打包的源代码后，`Webpack Compile` 将源代码和 `HMR Runtime` 一起编译成 `bundle`文件，传输给`Bundle Server` 静态资源服务器

- 更新阶段为上图 1 - 2 - 3 - 4

当某一个文件或者模块发生变化时，webpack监听到文件变化对文件重新编译打包，编译生成唯一的hash值，这个hash值用来作为下一次热更新的标识

根据变化的内容生成两个补丁文件：manifest（包含了 hash 和 chundId，用来说明变化的内容）和chunk.js 模块

由于socket服务器在HMR Runtime 和 HMR Server之间建立 websocket链接，当文件发生改动的时候，服务端会向浏览器推送一条消息，消息包含文件改动后生成的hash值，如下图的h属性，作为下一次热更细的标识

在浏览器接受到这条消息之前，浏览器已经在上一次socket 消息中已经记住了此时的hash 标识，这时候我们会创建一个 ajax 去服务端请求获取到变化内容的 manifest 文件

mainfest文件包含重新build生成的hash值，以及变化的模块，对应上图的c属性

浏览器根据 manifest 文件获取模块变化的内容，从而触发render流程，实现局部模块更新