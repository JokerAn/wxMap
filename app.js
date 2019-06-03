//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log(res);
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.globalData.userInfo = res.userInfo;
              //在index.wxml中的onLoad 中定义了一个 函数：userInfoReadyCallback
              //如果在这能获取到了  那就说明 index.xml中的onload函数已经执行了
              //那就调用这个方法
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})