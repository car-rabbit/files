$(function() {
  var isTest = true;
  var ajaxUrlHost = isTest ? "http://api-test.chetubao.com.cn" : "http://api.chetubao.com.cn";
  var urlHost = isTest ? "http://m-test.chetubao.com.cn" : "http://m.chetubao.com.cn";
  var isReload = window.location.href.indexOf("isappinstalled=");
  if (isReload !== -1) {
    window.location.href = urlHost + "/drive/index.html";
  }
  $.ajax({
    url: ajaxUrlHost + "/wechatShare?url=" + window.location.href,
    type: "get",
    success: function(data) {
      if (data.code == 200) {
        var wxRes = data.body;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: wxRes.appid,
          timestamp: wxRes.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxRes.noncestr, // 必填，生成签名的随机串
          signature: wxRes.signature, // 必填，签名
          jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
        });

        wx.ready(function() {
          //需在用户可能点击分享按钮前就先调用
          wx.onMenuShareTimeline({
            title: "2018新款途乐全国试驾--体验“沙漠之王”迎豪礼!", // 分享标题
            desc:
              "2018新款途乐全国试驾--体验“沙漠之王”迎豪礼!", // 分享描述
            link: wxRes.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: urlHost + "/drive/assets/images/thumb.jpg", // 分享图标
            success: function() {
              // 设置成功
            }
          });

          wx.onMenuShareAppMessage({
            title: "2018新款途乐全国试驾--体验“沙漠之王”迎豪礼!", // 分享标题
            desc: "2018新款途乐全国试驾--体验“沙漠之王”迎豪礼!", // 分享描述
            link: wxRes.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: urlHost + "/drive/assets/images/thumb.jpg", // 分享图标
            success: function() {
              // 设置成功
            }
          });
        });
      }
    }
  });
});
