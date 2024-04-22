
Uniapp的有点，可以一套代码打包到不同平台


移动端开发主要是IOS和Android

原生开发优缺点：
- 原生App在体验、性能、兼容性都非常好
- 但是多个平台开发，成本和时间都比较高
- 且不利于版本控制


跨平台开发，一套代码搞定多个平台
但是不适合做高性能、复杂用户体验，以及定制高的应用，比如qq，抖音等。

 ![](Public%20Image/Uniapp/Pasted%20image%2020240420102902.png)
 Hbuilder X是一个前端开发工具，但是对uniapp特别加强
HbuilderX在V3.2.5之后开始优化了对Vue3的支持（支持setup语法糖）


### uniapp不同于vue的地方
现如今的结构变化是
```vue
<template>
	<view>
	注意必须有一个view，且只能有一个根view。所有内容写在这个view下面。
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style>

</style>

```

其标签变化
- div-> view且只能有一个根view
- span、font改为text
- a改为navigator
- img改为image
- input只能作为输入框（原来i的html中可以是checkbox，radio等等）
- form、button、label、textarea、canvas、video这些都还在
- select改为picker
- iframe改为web-view
- ul、li没有了，都用view代替，做列表一般使用uList组件

新增组件
- scroll-view可区域滚动视图容器
- swiper可华东区域视图容器
- icon图标
- rich-text富文本，不可执行js，但是可以渲染各种文字格式和图片
- progress进度条
- slider滑块指示器
- switch 开关选择器
- camera相机
- live-player直播
- map地图
- cover-view 可覆盖原生组件的视图容器


 js的变化

js的变化，分为运行环境变化、数据绑定模式变化、api变化3部分。

- **运行环境从浏览器变成v8引擎**

标准js语法和api都支持，比如if、for、settimeout、indexOf等。

但浏览器专用的window、document、navigator、location对象，包括cookie等存储，只有在浏览器中才有，app和小程序都不支持。

可能有些人以为js等于浏览器里的js。其实js是ECMAScript组织管理的，浏览器中的js是w3c组织基于js规范补充了window、document、navigator、location等专用对象。

在uni-app的各个端中，除了h5端，其他端的js都运行在一个独立的v8引擎下，不是在浏览器中，所以浏览器的对象无法使用。如果你做过小程序开发，对此应当很了解。

这意味着依赖document的很多HTML的库，比如jquery无法使用。

当然app和小程序支持web-view组件，里面可以加载标准HTML，这种页面仍然支持浏览器专用对象window、document、navigator、location。

- **以前的dom操作，改成vue的MVVM模式**

现在前端趋势是去dom化，改用mvvm模式，更简洁的写法，大幅减少代码行数，同时差量渲染性能更好。

uni-app使用vue的数据绑定方式解决js和dom界面交互的问题。

如果你想改变某个dom元素的显示内容，比如一个view的显示文字：

以前是给view设id，然后js里通过选择器获取dom元素，进一步通过js进行赋值操作，修改dom元素的属性或值。

如下演示了一段代码，页面中有个显示的文字区和一个按钮，点击按钮后会修改文字区的值


js api
alert，confirm 改成了uni.showmodel
ajax 改为了 uni.request
cookie、session没有了，localStorage改为了uni.storage



css变化
' * 选择器不支持 ,body不存在了改为了page


生命周期发生变化
不再使用vue的生命周期而是使用
```js
import {onLoad} from '@dcloudio/uni-app'
//引入生命周期
onLoad(()=>{
	console.log("onload已经加载");
})
```




## uniapp配置路由

在pages下写页面，然后再根目录的pages.json写路由配置


`pages.json`
```json
{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		},
		{
			"path" : "pages/order/index",
			"style" : 
			{
				"navigationBarTitleText" : "",
				"enablePullDownRefresh" : false
			}
		},
		{
			"path" : "pages/user/index",
			"style" : 
			{
				"navigationBarTitleText" : "",
				"enablePullDownRefresh" : false
			}
		}
	],
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#ffffff",
		"backgroundColor": "#F8F8F8"
	},
	"tabBar": {
		"list": [{
			"pagePath": "pages/index/index",
			"iconPath": "",
			"selectedIconPath": "",
			"text": "主页"
		}, {
			"pagePath": "pages/order/index",
			"iconPath": "",
			"selectedIconPath": "",
			"text": "订单"
		},{
			"pagePath": "pages/user/index",
			"iconPath": "",
			"selectedIconPath": "",
			"text": "用户"
		}]
	},
	"uniIdRouter": {}
}

```

pages指代页面
tabBar是菜单栏+和路由关联了的

Uniapp的目录结构

![](Public%20Image/Uniapp/Pasted%20image%2020240421083503.png)
pages放置页面的目录，一般是一个路由一个子文件夹
static，放置静态资源的目录
unpackage放置运行或者打包的目录
pages.json配置路由的文件夹
uni.scss内置样式的变量


App.vue的不同点
-  App.vue时uniapp的入口组件，所有页面都是再App.vue下进行切换
- `App.vue本身不是页面`，不能编写试图元素，`也没有< template>元素`

那么App.vue的租用是什么？
- 应用的生命周期
- 编写全局样式
- 定义全局数据globalData
应用生命周期仅可在App.vue中监听，在页面监听无效果


App.vue中的style为`全局样式`，作用于每一个页面(style标签不支持scoped，写累导致样式无效)