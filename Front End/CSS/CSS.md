###CSS居中

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