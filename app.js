//app.js
// const app=getApp();
App({
  onLaunch: function() {
    let me = this;
    wx.removeStorageSync('userInfo')
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log({'wx.getSetting': res});
        if (res.authSetting['scope.userLocation']) {
          console.log('已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框');
          wx.getUserInfo({
            success: result => {
              if (this.userInfoReadyCallback){
                this.userInfoReadyCallback(result);
              }else{
                wx.setStorage({
                  key: 'userInfo',
                  data: JSON.stringify(res['wx.getUserInfo']),
                })
              }
            },
            fail: result => {
              console.log({'wx.getUserInfo-fail': result});
            }
          })
        } else {
          console.log('没有授权！！');
        }
      }
    })
  }
})