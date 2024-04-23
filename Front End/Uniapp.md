
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




### uniapp配置路由

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

### 样式配置
App.vue中的style为`全局样式`，作用于每一个页面(style标签不支持scoped，写累导致样式无效)
全局样式在app.vue里面生效

然后在`uni.scss`中配置全局样式变量
如果配置页面的样式，是没有body的
是pgae
```css
page{
	
}
```

比如重写uni-ui内置的样式变量（在uni.scss中）
```scss
$uni-color-primary:#007aff;
// 重写
$hy-color:orange;
//自定义
```



### 全局数据的贡献
在app.vue中写入数据
```vue
<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	},
	globalData: {
		name: '专家们',
		age: 99
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'static/css/variable.scss';
</style>

```

比如在index.vue中使用
```js
import { onLoad } from '@dcloudio/uni-app';
onLoad(() => {
	const app = getApp();
	console.log('app', app.globalData);
});
```

app拿到的是整个实例，其实这样子的数据方法还可以使用pinia
拿到当前页面的路由
```js
const pages = getCurrentPages();
console.log(pages[pages.length - 1].route);
```

getApp,getCurrenPages兼容web，h5,小程序端


### page.json

page.json兼容h5,weapp,app
类似小程序的app.config.json

globalStyle:对全局的一些东西进行配置比如
navigationBarTextStyle，导航文本颜色
navigationBarTitleText，文本
navigationBarBackgroundColor：背景颜色


manifest.json
开发小程序需要使用小程序id，需要申请


### 内置组件
直接写div是可以的，但是不跨平台
跨平台的话写
```html
<view></view>
<text>文本组件</text>
<image></image>
```
支持相对路径，绝对路径和导入的图片
```vue
<template>
	<view>
		<text>文本组件</text>
		<!-- primary是一个主题色 
			1.自己封装button
			重写button的样式
		-->
			<button type="primary">按钮</button>
			<!-- <image src="../../static/logo.png" mode=""></image> -->
			<!-- <image src="@/static/logo.png" mode="widthFix"></image> -->
			<image :src="cvy" mode=""></image>
		</view>
</template>

<script setup>
import { ref } from 'vue';
//引入生命周期
import cvy from '@/static/logo.png';
import { onLoad } from '@dcloudio/uni-app';

</script>

<style>

</style>

```

![](Public%20Image/Uniapp/Pasted%20image%2020240422164837.png)

滚动组件
```vue
<template>
	<view class="content">
		<scroll-view scroll-y="true" class="hy-v-scroll">
			<view class="v-item">1</view>
			<view class="v-item">2</view>
			<view class="v-item">3</view>
			<view class="v-item">4</view>
			<view class="v-item">5</view>
			<view class="v-item">6</view>
			<view class="v-item">7</view>
			<view class="v-item">8</view>
		</scroll-view>
		<scroll-view scroll-x="true" class="hy-h-scroll">
			<view class="v-item">1</view>
			<view class="v-item">2</view>
			<view class="v-item">3</view>
			<view class="v-item">4</view>
			<view class="v-item">5</view>
			<view class="v-item">6</view>
			<view class="v-item">7</view>
			<view class="v-item">8</view>
		</scroll-view>
	</view>
</template>

<script setup></script>

<style lang="scss">
.hy-v-scroll {
	height: 400rpx;
	border: 2rpx solid red;
	box-sizing: border-box;
	.v-item {
		height: 200rpx;
		border-bottom: 2rpx solid blue;
	}
}
.hy-h-scroll {
	white-space: nowrap; //不换行 
	.v-item {
		display: inline-block;
		height: 200rpx;
		width: 200rpx;
		border-left: 2rpx solid hotpink;
	}
}
</style>

```
![](Public%20Image/Uniapp/Pasted%20image%2020240422170435.png)效果



拓展组件——uni-ui
基于Vue组件和Flex布局的跨全端Ui框架
 
特点：高性能 全端  风格拓展，可以在uni.scss中拓展和切换应用的风格
### 扩展组件
安装组件库
一、通过uni_modules单独安装组件 ，到官网导入之后无需 
使用图片时：
- 不支持本地图片的平台，小于 40kb，一定会转 base64。（共四个平台 mp-weixin, mp-qq, mp-toutiao, app v2）
但是超过40kb小程序这边是需要手动转化的，因为小程序支持的图片要不是cdn，要不是本地比较小的图片，比较大的图片需要手动转化为base64
在static能直接转化为base64

重写内部样式
```scss
.uni-forms-item__label{
	color:red !important; 
}
:deep(.uni-form-ite__label){
	color:pink !important;
}
:global(.uni-form-ite__label){
	 color:skyblue !important; 
}
```


### 条件编译
使用
```vue
#ifdef %PLATFORM%
//某平台存在就这样编译
#endif

#ifndef
除了某平台，其他平台均存在这样的编译
#endif
```

### uniapp常见页面通讯方式
1. 使用url查询字符串和eventChannel
2. 使用事件总线
3. 全局数据gloablData
4. 本地数据存储
5. pinia 

#### url查询参数
1.查询参数
```vue
<template>
	<view class="content">
		<navigator url="/pages/order/index?name=abc&age=18" open-type="navigate">
			<button>跳转</button>
		</navigator>
	</view>
</template>

```
接受数据
```js
onLoad((options) => {
	console.log('url传递的数据', options);
});
```
导航
navigator中open-type的区别？
- navigate
	- url:需要跳转的应用内`非 tabBar` 的页面的路径 , `路径后可以带参数`。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，path为下一个页面的路径，下一个页面的onLoad函数可得到传递的参数
	- ![](Public%20Image/Uniapp/Pasted%20image%2020240423153552.png)
- navigateBack
	- delta:类型为number 非必填，表示返回页面数，如果大于现有页面数会回到首页
	- ![](Public%20Image/Uniapp/Pasted%20image%2020240423153614.png)
- reLauch
	- url：`需要跳转的应用内页面路径 , 路径后可以带参数`。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，`如果跳转的页面路径是 tabBar 页面则不能带参数`
- switchTab（只能切换页面不支持跳转页面的通信 ）
	- url：需要`跳转的 tabBar 页面的路径`（需在 pages.json 的 tabBar 字段定义的页面），路径后不能带参数
- redirect:
	- url :需要跳转的应用内`非 tabBar 的页面的路径`，`路径后可以带参数`。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
这些都有回调函数
![](Public%20Image/Uniapp/Pasted%20image%2020240423153523.png)


或者是在事件里面触发
```vue
uni.navigateTo({
	url:"xxxx"
})
```

#### eventChannel 
在组合式api中写法是这样子的
```js
export default {
	onLoad(options) {
		const eventChannel = this.getOpenerEventChannel();
		console.log('eventChannel', eventChannel);
	}
};
```

但是在v3的setup语法糖中是这样子的
```js
import { onLoad, getOpenerEventChannel } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue';
onLoad((options) => {
	const instance = getCurrentInstance();
	const eventChannel = instance.proxy.getOpenerEventChannel();

	console.log('channel', eventChannel);
});
```

注意
`uni.navigateTo`、`uni.redirectTo`、`uni.reLaunch`，`uni.navigateBack`才能支持页面间的消息传递，而tabBar是不支持页面见的通信的。


比如在index中是
```js
const handleClick = () => {
	uni.navigateTo({
		url: '/pages/order/index',
		success(res) {
			res.eventChannel.emit('data', { data: '你' });
		}
	});
};
```

在order中就是
```js
import { onLoad } from '@dcloudio/uni-app';
import { getCurrentInstance, onMounted } from 'vue';
// const orderThis = getCurrentInstance();
const instance = getCurrentInstance();
const eventChannel = instance.proxy.getOpenerEventChannel();
eventChannel.on('data', (data) => {
	console.log('触发了回调了，数据是', data.data);
});
```

![](Public%20Image/Uniapp/Pasted%20image%2020240423203004.png)
成功触发回调函数



如果是反向的数据（比如A->B然后B回到A并且给A带了数据）
```js
const handleClick = () => {
	uni.navigateTo({
		url: '/pages/order/index',
		success(res) {
			res.eventChannel.emit('data', { data: '你' });
		},
		events: {
			fromOrderData(data) {
				console.log(data);
			}
		}
	});
};
```

```js
const goHmoe = () => {
	eventChannel.emit('fromOrderData', { data: '来自order页面的你好' });
	uni.navigateBack({ delta: 1 });
};
```
因为页面的前进后退都是异步的，因此这个eventChannel.emit放在navigateBack的前后都没有关系


#### 事件总线
使用uni进行触发

必须在触发之前监听
