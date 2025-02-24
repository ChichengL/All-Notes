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
