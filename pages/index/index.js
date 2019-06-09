//index.js
//获取应用实例
const app = getApp()
import {
  HTTP
} from '../../utils/http.js'
var anHttp = new HTTP();
import {
  utils
} from '../../utils/util.js'
var util = new utils();
Page({
  data: {
    userInfo: {},
    userName: 'admin@ambow.com',
    userPwd: '652852504B32EC67D17D97E58F63CE2B',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
    if (wx.getStorageSync('userInfo')) {
      
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(res),
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.setStorage({
            key: 'userInfo',
            data: JSON.stringify(res),
          })
        }
      })
    }
    if(wx.getStorageSync('token')){
      this.getMe();
    }
  },
  onGotUserInfo: function(e) {
    console.log(e)
    let userDetail = e.detail;
    this.setData({
      userInfo: e.detail.userInfo,
    })
    let me = this;
    wx.login({
      success(res) {
        console.log({'wx.login': res});
        if (me.data.userName === '' || me.data.userPwd === '') {
          util.showAlert('请填写用户名和密码！');
          return
        }
        if (res.code) {
          anHttp.ajaxServe('get', 'http://www.jokeran.com:3100/wxxcx/demo/getunionId2' + '?code=' + res.code, null).then((opids)=>{
            codeDataconsole.log(opids);
            codeDataconsole.log('------------------------------');
          })
          anHttp.ajaxServe('get', 'http://10.10.113.28/common/api/v1/auth/wechat' + '?code=' + res.code, null)
            .then(function(result) {
              console.log('请求成功')
              console.log({'http://10.10.113.28/common/api/v1/auth/wechat': result});
              util.setStorage('openid', result.openid)
              util.setStorage('opesession_keynid', result['session_key'])
              util.setStorage('expires_in', result['expires_in'])
              anHttp.ajaxServe('post', 'http://10.10.113.28/common/api/v1/auth/decode', {
                sessionKey: result.session_key,
                encryptedData: userDetail.encryptedData,
                iv: userDetail.iv
              }, null).then(function(result01) {
                console.log(result01)
                console.log(wx.getStorageSync('openid'));





              //loginAJAX
              
                let canshu = {
                  name: me.data.userName,
                  passWord: me.data.userPwd,
                };
                console.log(canshu);
                util.showAlert('登陆中...')
                anHttp.ajaxServe('post', 'http://10.10.113.28/ehr/api/v1/login', canshu).then((res) => {
                  if (res && res.tokenType && res.token) {
                    wx.setStorage({
                      key: 'token',
                      data: res.tokenType + ' ' + res.token
                    })
                    me.getMe()
                  }
                })









              })
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
  getMe(){
    anHttp.ajaxServe('get', 'http://10.10.113.28/iot/api/v1/user/me', null).then((result) => {
      console.log(result);
      wx.reLaunch({
        url: '../map/map'
      })
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
  },
  userNameF(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPwdF(e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  loginAn(){
    wx.reLaunch({
      url: '../map/map'
    })
  }
})