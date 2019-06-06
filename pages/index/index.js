//index.js
//获取应用实例
const app = getApp()
import {
  HTTP
} from '../../utils/http.js'
var anHttp = new HTTP();
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
    let me = this;
    console.log(app.globalData);
    //如果获取到了app.globalData.userInfo 就说明 app.js中的获取用户信息的函数执行完了
    //如果没获取到 说明onload执行的比app.js中的获取用户信息快 那只能在else中的定义一个公共函数
    //等app.js中的获取用户信息完成后 执行这个函数了 都是挂载在app下 所以能获取到
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
      console.log('等待回调函数来设置数据');
    }
    wx.login({
      success(res) {
        console.log({
          'wx.login': res
        })
        if (res.code) {
          anHttp.ajaxServe('get', 'http://10.10.113.28/common/api/v1/auth/wechat' + '?code=' + res.code, null)
            .then(function(result) {
              console.log('请求成功')
              console.log({
                'http://10.10.113.28/common/api/v1/auth/wechat': result
              });
              wx.setStorage({
                key: 'openid',
                data: result.openid
              })
              wx.setStorage({
                key: 'session_key',
                data: result['session_key']
              })
              wx.setStorage({
                key: 'expires_in',
                data: result['expires_in']
              })
              console.log(app.globalData);
              wx.request({ //发送请求
                url: 'http://10.10.113.28/common/api/v1/auth/decode',
                data: {
                  sessionKey: result.session_key,
                  // encryptedData: me.data.userInfo.encryptedData,
                  // iv: me.data.userInfo.iv
                },
                method: 'post',
                success: res03 => {
                  console.log(res03);
                },
                fail: err => {
                  reject(err)
                  util.showAlert("请求超时", 'none', 1500);
                }
                })
              console.log('222222222werwer');
              // anHttp.ajaxServe('post', 'http://10.10.113.28/common/api/v1/auth/decode', {
              //     sessionKey: result.session_key,
              //     encryptedData: e.detail.encryptedData,
              //     iv: e.detail.iv
              //   })
              //   .then((res02) => {
              //     console.log({
              //       'http://10.10.113.28/common/api/v1/auth/decode请求成功': res02
              //     });
              //   }).catch(function() {
              //     console.log('请求失败2')
              //   })
            }).catch(function(err) {
              console.log('请求失败')
              console.log(err)
            })




        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }

    })
  },
  onGotUserInfo: function(e) {
    console.log(e)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    this.setData({
      userInfo: e.detail.userInfo,
    })
    
  },

  //获取当前网络状态
  getNetWorkType: function() {
    wx.getNetworkType({
      success: function(res) {
        console.log(res)
      }
    })
  },

  //获取系统信息

  getSystemInfo: function() {
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
      }
    })
  },

  //监听重力感应数据 - 带on开头的都是监听接收一个callback
  onAccelerometerChange: function() {
    wx.onAccelerometerChange(function(res) {
      setTimeout(() => {
        console.log(res)
      }, 5000)
    })
  },

  //监听罗盘数据
  onCompassChange: function() {
    wx.onCompassChange(function(res) {
      setTimeout(() => {
        console.log(res)
      }, 5000)
    })
  }
})