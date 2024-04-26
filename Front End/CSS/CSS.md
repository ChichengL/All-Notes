## 基础
### CSS居中

#### 水平居中
对于内联元素，比如文本元素
可以使用
```css
text-aligin:center
```
实现水平居中

块级元素
该元素的宽度高度已知情况下
可以使用`margin`实现
```css
.content {
  width: 100px;
  height: 100px;
  margin : 0 auto;
}
```

可以使用偏移`transform:translate()`来实现
```css
.container {
  position: relative;
}

.content {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
/**
* 不知道自己的宽度时
* 
*/
.content{
	width:100px;
	position:absolute;
	left:50%;
	transform:translateX(-50px);
}
/**
*已知宽度时
*/
```


对于flex布局
可以使用`justify-content` 指明主轴上的元素应该如何排放
```css
.container {
  display: flex;
  justify-content: center;
}
.container {
	display: flex;
	flex-direction: column
	align-items: center;
}
```


对于grid布局
```css
.container {
  display: grid;
  justify-content: center;
}
```


垂直居中和水平居中相类似
不过对于垂直居中的内联元素居中可以通过设置`line-height`为当前容器的高度来实现垂直居中其他的都相类似



水平垂直居中
内联元素
```css
.father{
	height:40px;
	line-height:40px;
	text-align:center;
}
```

对于块级元素
使用transform
```css
.father{
	position:relative;
}
.child{
	position:absolute;
	left:50%;
	top:50%;
	transform:translate(-50%,-50%);
}
.child{
	position:absolute;
	width:50px;
	height:50px;
	left:50%;
	top:50%;
	transform:translate(-50px,-50px);
}
```

不使用transform：确定高度和宽度为100px
```css
.child{
	position:absolue;
	left:calc(50% - 50px);
	top:calc(50% - 50px);
}
```

flex布局
```css
.father{
	display:flex;
	justify-content:center;
	align-items:center;
}
```

grid布局
```css
.father {
  display: grid;
  place-items: center;
}
```



### css变量
使用 `--xx`来声明一个变量
```css
html{
	--color:red;
}
.div{
	color:var(--color);
}
```
这里是基本使用（因为div一定在html下，所以可以这样子）

同时支持在媒体查询中使用
```css
@media(max-width:400px){
	/*当屏幕宽度不超过400px时生效*/
	:root{
		/*这里选择在根的上下文来使用变量（相当于被root包裹的作用域都可以使用）*/
		--color:green;
		--width:50px;
	}
}
```
css可以动态的改变
```css
html{
--color:red;
}
.container{
	background-color:red;
}
.container{
	--color:blue;
	background-color:red;
}
```

这样是可以的



### Sass
sass是预编译css语言
sass的注释
```scss
// 注释1
/*注释2*/
```
注释1不会编辑到css中，而注释2会，注释2也是css的注释

sass支持嵌套
```css
.father{
	width:100px;
	.child{
		height:100px;
	}
}
```
其效果编译为css之后
```css
.father{
	width:100px;
}
.father .child{
	height:100px;
}
```

且scss是预编译，那么
```scss
html{
 $color:red;
}
.father{
	color:$color;
}
```

这样是错误的,因为scss编译为css没有基于dom结构，不知道.father是在html中，且.father作用域不在html作用域中，因此报错
CSS 变量与预处理器变量最重要的区别就是**CSS变量是动态分配的**。它们在页面的整个生命周期中会保持活动状态，当更新它们时，所有引用它们的地方都会更新。因为它们是属性，所以可以通过任何更新 CSS 属性的机制来更新它们：样式表、内联样式，甚至 JavaScript。

|             |            |
| ----------- | ---------- |
| **SASS 变量** | **CSS 变量** |
| 静态分配        | 动态分配       |
| 不支持媒体查询     | 支持媒体查询     |
| 需要预处理器进行编译  | 不需要预处理器处理  |
| 增加了一层计算和复杂性 | 单层直接变量管理   |


mixins 和include，复用代码
相当于函数了
```css
@mixin absolute-center() {
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
}

.element {
  @include absolute-center();
}
```


&相当于拼接
```scss
button {
  background-color: #535353;
  color: #000;
  &:hover {
    background-color: #000;
    color: #fff;
  } /*这里相当于是下面的*/
}
/*
button :hover{
	background-color: #000;
    color: #fff;
}
*/
```

sass支持:来嵌套属性
```scss
add-icon {
  background : {
    image: url("./assets/arrow-right-solid.svg");
    position: center center;
    repeat: no-repeat;
    size: 14px 14px;
  }
}
```

编译为css之后
```css
.add-icon {
  background-image: url("./assets/arrow-right-solid.svg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 14px 14px;
}
```


@import 和@use
@import导入文件
比如在`variable.scss`中定义全局变量，为了主题切换
```scss
$theme-button-color:red;
```

在index.scss中使用
```scss
@import './variable.scss'
button{
	background-color:$theme-button-color;
}
```
用`@import`时，所有变量、mixin 等都可以全局访问，因为一切都是全局的，所以库必须为其所有成员添加前缀以避免命名冲突。因此不建议使用 @import。

@use
用法和@import一样
```scss
@use 'normalize';

content {
  max-width:660px;
}
```

```scss
$accent-color: #535353;
@mixin dark-background {
  background-color:#000;
  color:#fff;
}
```
然后使用
```scss
@use 'src/colors' as c;
body  {
  color: c.$accent-color;
}
```
as可要可不要，如果不要as，那么后面使用就是`colors.$accent-color`


sass的流程控制
@if/@else   @each   @for  @while

```scss
@mixin theme($is-dark:false){
	@if $is-dark{
	
	}
	@else{
	
	}
}
```

@each类似于for...of

```scss
$sizes: 40px, 50px, 80px;
@each $size in $sizes {
  .icon-#{$size} {
    font-size: $size;
    height: $size;
    width: $size;
  }
}
```

@for
```scss
@for $i from 1 through 4 {
  .bubble-#{$i} {
    transition-delay: .3 * $i;
  }
}
```


scss中可以使用媒体查询，但是scss变量不支持媒体查询



## 进阶

#### 隐藏元素
1. 使用opacity和filter:opacity()
opacity: N 和 filter: opacity(N) 属性可以传递一个 0 到 1 之间的数字，或者 0% 和 100% 之间的百分比，对应地表示完全透明和完全不透明。

- opacity: N：该属性用来设置元素的透明度；
- filter: opacity(N) ：filter属性用来设置元素的滤镜，opacity是滤镜重的透明度，用来设置元素的透明度。
```css
div {
	opacity: 0;
}

div {
	filter: opacity(0%);
}
```

2. 巧妙使用color和background-color
```css
div {
	color: rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
```


3.transform改变元素位置

这里需要注意
浮动相当于将一个嵌入的元素取出来，那么其他元素就会受到影响。 而transform不会让元素脱离原来的位置，但是会让它显现在不同位置或者显现不同大小（视觉改变，元素绘制发生变化）

PS:
>浮动可能导致高度塌陷，可以将父元素变为一个bfc来解决
>`BFC` 全称：`Block Formatting Context`， 名为 "块级格式化上下文"。`BFC`是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。那么怎么使用`BFC`呢，`BFC`可以看做是一个`CSS`元素属性

创建BFC常见CSS属性
- overflow: hidden
- display: inline-block
- position: absolute
- position: fixed
- display: table-cell
- display: flex

```css
div {
	transform: scale(0);
}

div {
	translate(-9999px, 0px)
}
```

4. visible hidden
除非使用collapse值，否则元素使用的空间保持不变。
不影响布局，且不能被读取
```css
div {
	visibility: hidden;
}
```

5. dispaly none
display 可能是最常用的元素隐藏方法; 。当其值为 none 时元素就隐藏了。被隐藏的元素不会在页面中占据位置，也不会响应绑定的监听事件。
```css
div {
  display: none;
}
```

6. z-index

使用z-index讲元素隐藏
```css
div {
  z-index: -1;
}
```

7. position
和transform相类似，都是讲元素移开
```css
div {
  position: absolute;
  left: -999px;
}
```

8. 覆盖元素

```css
div::after {
  position: absolute;
  content: '';
  top: 0;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
}```

9. 缩小尺寸
```css
div {
  height: 0;
  padding: 0;
  overflow: hidden;
}
```
和transform:scale(0)类似

