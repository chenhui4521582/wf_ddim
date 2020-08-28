const u = navigator.userAgent;
// Android终端
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
// // IOS 终端
// const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 

export let appCall = {
  callIOSHandler: function(name, obj, callback) {
    window.setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler(name, obj, callback);
    });
  }
};

const iosFunction = (callback) => {
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
};

const androidFunction = (callback) => {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(window.WebViewJavascriptBridge);
    }, false)
  }
};

window.setupWebViewJavascriptBridge = isAndroid ? androidFunction : iosFunction;

isAndroid && window.setupWebViewJavascriptBridge(function (bridge) {
  // 注册 H5 界面的默认接收函数（与安卓交互时，安卓端可以不调用函数名，直接 send 数据过来，就能够在这里接收到数据）
  bridge.init(function (msg, responseCallback) {
      console.log(msg);
      responseCallback("JS 返回给原生的消息内容");
  })
});