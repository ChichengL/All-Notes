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

### **1. NAT (Network Address Translator)**

- **作用**：
    - 将内网设备的私有 IP 地址和端口映射到公网 IP 地址和端口，允许多设备共享单一公网出口。
    - **典型场景**：家庭路由器、企业防火墙。
- **对 WebRTC 的影响**：
    - 隐蔽了内网设备的真实地址，导致直接通信不可行（需借助 STUN/TURN 穿透

NAT产生的原因
- IPv4地址不够用,ipv6够用了
- 出于网络安全的考虑
NAT种类:
- 完全锥型(Full Cone NAT): 当内网的主机通过NAT映射到公网之后，公网所有的IP能访问这个地址
  ![](Pasted%20image%2020250225205131.png)
- 地址限制锥型NAT: 在出去请求是记录目的的IP地址，收到请求时，先检查是否在记录中，不在直接pass
  ![](Pasted%20image%2020250225205338.png)
- 端口限制锥型NAT:记录发出去的端口地址
  ![](Pasted%20image%2020250225205427.png)
- 对称型NAT: 不同主机存储的IP地址都不同，如果A上记录的地址，直接在B上使用就不能使用
  ![](Pasted%20image%2020250225205454.png)


#### NAT穿越原理
C1,C2想STUN发消息
然后交换公网IP和端口
C1->C2,C2->C1甚至是端口猜测（对称型）


---

### **2. STUN (Simple Traversal of UDP Through NAT)**

- **作用**：
    - 发现设备的公网可达地址（通过 NAT 转换后的地址）和 NAT 类型（如完全锥形、对称型等）。
    - **工作流程**：
        1. 客户端向 STUN 服务器发送请求。
        2. STUN 服务器返回客户端的公网地址和端口。
    - **优点**：无需中继，直接穿透 NAT。
- **示例**：
    
    ```plaintext
    用户A（内网 IP: 192.168.1.100） -> STUN 服务器 -> 返回公网地址: 203.0.113.5:12345
    ```
    

---

### **3. TURN (Traversal Using Relays around NAT)**

- **作用**：
    - 当两端无法通过 STUN 穿透直接通信时，通过中继服务器（TURN Server）转发数据。
    - **关键特性**：
        - 中继服务器拥有公网 IP，双方均需向中继服务器注册并发送数据。
        - 带宽消耗大，通常作为最后手段。
- **示例**：
    
    ```plaintext
    用户A → TURN 服务器（公网 IP: 203.0.113.5） → 用户B
    ```
    

---

### **4. ICE (Interactive Connectivity Establishment)**

- **作用**：
    - 综合协调 STUN 和 TURN，自动收集所有可能的连接候选地址，并选择最优路径建立连接。
    - **候选地址类型**：
        1. **本地候选**：设备自身的网络接口地址（如 `192.168.1.100:5000`）。
        2. **STUN 反射候选**：通过 STUN 服务器获取的公网地址（如 `203.0.113.5:12345`）。
        3. **TURN 中继候选**：通过 TURN 服务器中继的地址（如 `203.0.113.5:6000`）。
    - **流程**：
        1. ICE 收集所有候选地址。
        2. 通过信令交换（如 SDP 协商）对比双方候选地址。
        3. 尝试直接连接（优先 STUN 反射地址）。
        4. 若失败，启用 TURN 中继。

---

### **完整工作流程示例**

**场景**：用户A（内网 IP: 192.168.1.100）与用户B（内网 IP: 10.0.0.200）尝试通话。

1. **ICE 初始化**：
    
    - 用户A和用户B均启动 ICE，收集本地候选地址（如 `192.168.1.100:5000` 和 `10.0.0.200:6000`）。
2. **获取 STUN 反射地址**：
    
    - 用户A向 STUN 服务器发送请求，返回公网地址 `203.0.113.5:12345`。
    - 用户B同样获取公网地址 `203.0.113.6:12346`。
3. **信令协商**：
    
    - 通过信令服务器交换 SDP，包含双方的候选地址：
        
        ```markdown
        A 的候选列表: [192.168.1.100:5000, 203.0.113.5:12345]
        B 的候选列表: [10.0.0.200:6000, 203.0.113.6:12346]
        ```
        
4. **连接尝试**：
    
    - A 尝试直接连接到 B 的 `203.0.113.6:12346`（STUN 反射地址）。
    - B 同样尝试连接到 A 的 `203.0.113.5:12345`。
    - 若穿透成功，直接建立 UDP 连接。
5. **失败时启用 TURN**：
    
    - 若上述步骤失败（如对称 NAT 环境），双方退而使用 TURN 中继地址：
        
        ```markdown
        A → TURN 服务器（203.0.113.5:6000） → B
        B → TURN 服务器（203.0.113.5:6000） → A
        ```
        
