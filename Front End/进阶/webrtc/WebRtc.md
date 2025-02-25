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
```css
.blur {
        -webkit-filter: blur(5px); /* Safari, Chrome and Opera > 12.1 */
        filter: blur(5px);
}
```


### 截图

```html
<div>
  <canvas id="picture"></canvas>
</div>
<div>
  <button id="snapshot">Take Snapshot</button>
</div>
```
```js
//picture
let snapshot = document.querySelector("button#snapshot");
let picture = document.querySelector("canvas#picture");
picture.width = 320;
picture.height = 240;


snapshot.onclick = () => {
  picture.className = filterSelect.value;
  const video = videoPlayer;
  const canvas = picture;
  const ctx = canvas.getContext("2d");

  // 获取视频的实际分辨率
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // 计算缩放比例（保持宽高比）
  const canvasWidth = 320;
  const canvasHeight = 240;
  const scaleWidth = canvasWidth / videoWidth;
  const scaleHeight = canvasHeight / videoHeight;
  const scale = Math.min(scaleWidth, scaleHeight); // 取最小比例防止溢出

  // 计算缩放后的目标尺寸
  const targetWidth = videoWidth * scale;
  const targetHeight = videoHeight * scale;

  // 计算居中位置
  const x = (canvasWidth - targetWidth) / 2;
  const y = (canvasHeight - targetHeight) / 2;

  // 绘制到画布并居中显示
  ctx.drawImage(video, x, y, targetWidth, targetHeight);
};
```

### mediaStream事件
方法(track相关)
MediaStream.addTrack() 加入轨
MediaStream.removeTrack() 移除轨
MediaStream.getVideoTrack() 获取视频轨
MediaStream.getAudioTrack() 获取音频轨


```js
function getMediaStream(mediaStream) {
  console.log("Your media stream  is: ", mediaStream);
  videoPlayer.srcObject = mediaStream;

  // 获取视频轨道设置
  const videoTrack = mediaStream.getVideoTracks()[0];
  const setting = videoTrack.getSettings();
  divConstraints.textContent = JSON.stringify(setting, null, 2); // 🔍 这里会输出到 divConstraints

  audioPlayer.srcObject = mediaStream;
  return navigator.mediaDevices.enumerateDevices();
}
```


### 录制
```js
let mediaRecorder = new MediaRecorder(stream,[,options])
```


| 参数      | 说明                                             |
| ------- | ---------------------------------------------- |
| stream  | 媒体流，可从getUserMedia,<vedio>,<audio>或者<canvas>获取 |
| options | 限制选项                                           |
options

| 选项                 | 说明                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| mimeType           | video/webm<br>audio/webm<br>video/webm;codecs=vp8<br>video/webm;codecs=h264<br>video/webm;codecs=opus |
| audioBitsPerSecond | 音频码率                                                                                                  |
| vedioBitsPerSecond | 视频码率                                                                                                  |
| bitsPerSecond      | 整体码率                                                                                                  |

MediaRecorder API

- MediaRecorder.start(timeslice)
  开始录制媒体，timeslice是可选的，设置了会按照时间切片存储数据
- MediaRecorder.stop() 停止录制，会触发包括最终Blob数据的dataavailable事件
- MediaRecorder.pause()暂停录制
- MediaRecorder.resume()恢复录制
- MediaRecorder.isTypeSupported()支持录制的格式

事件
- MediaRecorder.ondataavailable当数据有效时触发
  每次记录一定时间的数据时(如果没有指定时间片,则记录整个数据时)会定期触发。
- MediaRecorder.onerror
  录制出现问题之后触发事件

JS存储数据的方式
- 字符串
- Blob
- ArrayBuffer
- ArrayBufferView


 获取桌面
getDisplayMedia


### socketIO
给本次连接发消息 socket.emit()

给某个房间内的所有人发消息 io.in(room).emit()

除本连接外，给某个房间内所有人发消息 socket.to(room).emit()

除本连接外，给所有人发消息 socket.broadcast.emit()


2,3的区别是：
另外，要注意到socket.to(room)和io.in(room)的不同之处在于，前者不会发送消息给当前客户端自己，而后者会。这是因为在socket.to(room)中，客户端可能已经加入了自己所在的房间，所以需要排除自身。


## WebRtc传输
传输协议
NAT（Network Address Translator）
STUN(Simple Traversal of UDP Through NAT)
TURN(Traversal Using Relays around NAT)
ICE(Interactive Connectivity Establishment)