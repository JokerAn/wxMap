//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
  },
  //事件处理函数
  gotoPage: function() {
    wx.navigateTo({
      url: '../map/map'
    });
    console.log(1);
  },
  onLoad: function() {
    
    console.log(app.globalData);
    //如果获取到了app.globalData.userInfo 就说明 app.js中的获取用户信息的函数执行完了
    //如果没获取到 说明onload执行的比app.js中的获取用户信息快 那只能在else中的定义一个公共函数
    //等app.js中的获取用户信息完成后 执行这个函数了 都是挂载在app下 所以能获取到
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }else{
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          unionId: wx.getStorageSync('unionId'),
          hasUserInfo: true
        })
      }
    }
  },
  onGotUserInfo: function(e) {
    console.log(e)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  }
})