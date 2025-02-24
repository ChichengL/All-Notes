## 基础

对于设备列表的获取都是通过`navigator.mediaDevices`来进行的。

但是不同浏览器对权限控制实现不同+对于方法的命名不同，需要一个库`adapter.js`来抹平差异化
其作用是：
- 统一API的方法：自动适配不同浏览器对 WebRTC 的实现差异（如旧版 `getUserMedia` → 新版 `navigator.mediaDevices.getUserMedia`）。
- 事件标准化：统一 `RTCPeerConnection`、`RTCDataChannel` 等接口的事件回调格式。
- 浏览器前缀差异化抹平： 自动补全浏览器私有前缀（如 `-webkit-`、`moz-`）。

```javascript
// 无需写厂商前缀，直接使用标准 API
const stream = await navigator.mediaDevices.getUserMedia({ video: true });

// 适配旧版浏览器（如 Chrome 47 之前的 getUserMedia）
// Adapter.js 会自动 polyfill 为兼容代码
```


```js
navigator.mediaDevices.enumerateDevices().then(getDevices).catch(handleError);

function getDevices(devices) {
  console.log("device", devices);

  devices.forEach((device) => {
    let option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label;
    if (device.kind === "audioinput") audioInput.appendChild(option);
    if (device.kind === "videoinput") videoInput.appendChild(option);
    if (device.kind === "audiooutput") audioOutput.appendChild(option);
  });
}
```

对于视频可以
```html
<video autoplay playsinline id="player"></video>
```
```js
let constraints = {
    video: true,
    audio: true,
  };
  navigator.mediaDevices.getUserMedia(constraints).then(getMediaStream).catch();
```

### constraints
```ts
type constraints = {
	video: boolean | VideoMediaOption
	audio:boolean | AudioMediaOption
}
```

当video和audio为一个对象时，表示对这个获取到的流有约束
对于video参数的调整
```ts
type VideoMediaOption = {
	width //宽度度
	height // 高度
	aspectRatio //宽高比
	franeRate //帧率
	facingMode /**
		*  user 前置摄像头
		* envuronment:后置摄像头
		* left: 前置左摄像头
		* right:前置右摄像头
	*/
	resizeMode//类似于裁剪的功能
}
```

```ts
type AudioMediaOption = {
	volume//音量相关0，静音，1最大声
	sampleRate //采样率
	sampleSize // 采样大小
	echoCancellation //是否开启回音消除 true false实时通讯需要
	autoGainControl //自动增益 true false
	noiseSuppression //降噪 true false
	latency //延迟大小，越小实时性越高，但是如果出现网络抖动，可能出现一些报错
	channelCount //单双声道
	deviceID // 多个输入输出设备，进行设备切换
	groupId // 不同的设备
}
```


### 视频特效
- css filter, -webkit-filter/filter
- 将video和filter关联
- OpenGL/Metal（大部分时候是浏览器来做）
常见的特效

| 特效         | 说明   | 特效          | 说明  |
| ---------- | ---- | ----------- | --- |
| grayscale  | 灰度   | opacity     | 透明度 |
| sepia      | 褐色   | brightness  | 亮度  |
| saturate   | 饱和度  | contrast    | 对比度 |
| hue-rotate | 色相旋转 | blur        | 模糊  |
| invert     | 反色   | drop-shadow | 阴影  |
  