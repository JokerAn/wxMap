//app.js
const app = getApp()
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
        console.log({ 'wx.getSetting': res });
        console.log(res.authSetting)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation']) {
          console.log('已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框');
          wx.getUserInfo({
            success: result => {
              console.log({ 'wx.getUserInfo': result });
              app.globalData.userInfo = result.userInfo;
              //在index.wxml中的onLoad 中定义了一个 函数：userInfoReadyCallback
              //如果在这能获取到了  那就说明 index.xml中的onload函数已经执行了
              //那就调用这个方法
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }, 
            fail: result=>{
              console.log({ 'wx.getUserInfo-fail': result });
            }
          })
        }else{
          console.log('没有授权！！');
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})