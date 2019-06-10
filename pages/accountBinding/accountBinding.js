// pages/accountBinding/accountBinding.js
import {
  utils
} from '../../utils/util.js';
import {
  HTTP
} from '../../utils/http.js';
var anHttp = new HTTP();
var util = new utils();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: 'admin@ambow.com',
    password: '652852504B32EC67D17D97E58F63CE2B'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (wx.getStorageSync('bind')){
      wx.navigateTo({
        url: '../map/map',
      })
    }
  },
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passWdInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  acountBinding() {
    let _this = this;
    console.log(_this.data.userName);
    if (_this.data.userName == "") {
      util.showAlert('请输入账号!', 'none', 1500)
      return
    }
    if (_this.data.password == "") {
      util.showAlert('请输入密码!', 'none', 1500)
      return
    }
    let post_data = {
      username: _this.data.userName,
      password: _this.data.password
    }
    wx.showModal({
      title: '提示',
      content: '您确定要绑定账号吗！',
      success: function(res) {
        if (res.confirm) {
          util.showLoading("绑定中...")
          anHttp.ajaxServe('post', 'http://10.10.113.28/ehr/api/v1/login', post_data)
            .then(res => {
              console.log(res);
              if (res && res.token && res.tokenType) {
                console.log(res.token)
                wx.setStorage({
                  key: 'token',
                  data: res.tokenType + ' ' + res.token,
                })
                anHttp.ajaxServe('get', 'http://10.10.113.28/iot/api/v1/user/me', null, {
                    header: {
                      'Authorization': res.tokenType + ' ' + res.token
                    }
                  })
                  .then((res) => {
                    console.log(res);
                    wx.setStorage({
                      key: 'userAuthInfo',
                      data: res,
                    })
                    if (res.accounts[0].permissionMap.hasOwnProperty('sps_acdemic')) {
                      let post_data = {
                        "relationId": wx.getStorageSync('openid'),
                        "userId": res.userId,
                        "username": _this.data.userName
                      }
                      console.log(post_data)
                      anHttp.ajaxServe('post', 'http://10.10.113.28/common/api/v1/auth/relation', post_data)
                        .then(res => {
                          console.log(res);
                          if (res.id) {
                            util.hideLoading();
                            util.showAlert('绑定成功!', 'none', 1500)
                            wx.setStorageSync('bind', res);
                            wx.navigateTo({
                              url: '../map/map'
                            })
                          }
                        })
                    } else {
                      util.showAlert('请您更换账号绑定!', 'none', 1500)
                    }
                  })
              } else if (res.data.statusCode == 401) {
                util.showAlert('账号或密码错误', 'none', 1500)
              } else {
                util.showAlert('没有权限', 'none', 1500)
              }
            })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})