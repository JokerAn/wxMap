// pages/map/map.js
import {
  utils
} from '../../utils/util.js'
var util = new utils();
import {
  HTTP
} from '../../utils/http.js'
var anHttp = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saomiaoing: false,
    nums:0,
    msg: 1,
    markers: [{
      id: 0,
      latitude: 39.906256,
      longitude: 116.18564,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        latitude: 39.906256,
        longitude: 116.18564,
      }, {
        latitude: 39.90747,
        longitude: 116.190349,
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    circles: [{
      latitude: 39.906306,
      longitude: 116.185596,
      color: '#ff0000dd',
      fillColor: '#fcb5ec88',
      radius: 350,
    }],
    uuids: [
      'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
      'FDA50693-A4E2-4FB1-AFCF-C6EB07642172',
      'FDA50693-A4E2-4FB1-AFCF-C6EB07642583',
      'FDA50693-A4E2-4FB1-AFCF-C6EB07641923',
      'FDA50693-A4E2-4FB1-AFCF-C6EB07641468'
    ], //uuids
    devices: [], //最终搜索到的uuids
    distanceM: 0, //手机与中心打卡点的距离 单位 米
    bluetootTypeMsg: ''
  },


  //生命周期函数--监听页面加载

  onLoad: function(options) {
    let me = this;
    //获取用户手机的位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log({
          '当前位置的信息': res
        });
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        // wx.openLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   name: "要去的地方",
        //   scale: 15
        // })
        //得到用户手机距离打卡机的位置
        let juli = util.distance(latitude, longitude, 39.906256, 116.18564);
        console.log('距离公司的距离是 ' + juli);
        me.setData({
          distanceM: juli
        });

        //是否打开蓝牙了
        wx.openBluetoothAdapter({
          success(BluetootResult) {
            console.log(BluetootResult);
            console.log('打开蓝牙了');
            me.setData({
              bluetootTypeMsg: '扫描设备中...'
            })
            //如果用户打开蓝牙，关闭定时器 并且 开始搜索IBeacon
            console.log('关闭定时器 并且 开始搜索IBeacon');
            me.startBeacon(me.data.uuids,function(){
              me.sendAjax();
            });
          },
          fail: function() {
            me.setData({
              bluetootTypeMsg: '蓝牙关闭状态，请打开蓝牙'
            })
            console.log('蓝牙关闭状态，请打开蓝牙');
          }
        })

      }
    })
    //检测蓝牙是否可用
    wx.onBluetoothAdapterStateChange(function(res) {
      console.log('蓝牙适配器是否可用', res.available);
      if (res.available) {
        console.log('蓝牙可用，即将搜索...');
        me.startBeacon(me.data.uuids, function () {
          
          me.sendAjax();
        });
      } else {
        console.log('蓝牙关闭状态，请打开蓝牙');
        me.setData({
          bluetootTypeMsg: '蓝牙关闭状态，请打开蓝牙'
        })
      }
    })
    //检测ibeacon的搜索状态
    wx.onBeaconServiceChange(function(res) {
      console.log('目前是否处于搜索状态 ' + res.discovering);
    })

  },


  controltap(e) {
    console.log(e.controlId)
  },
  //开始搜索
  startBeacon(myUUIDS,callback) {
    callback=callback||function(){};
    let me = this;
    console.log("开始扫描设备...");
    me.setData({
      devices: [],
      saomiaoing: true,
      bluetootTypeMsg: '扫描设备中...'
    })
    // //检测是否打开蓝牙了
    // wx.openBluetoothAdapter({
    //   success(BluetootResult) {
    //     console.log(BluetootResult);
    //     console.log('打开蓝牙了');
    //     me.setData({
    //       bluetootTypeMsg: '扫描设备中...'
    //     })
    //搜索设备
      wx.startBeaconDiscovery({
        uuids: myUUIDS,
        success: function (beaconDiscoveryResult) {
          console.log("扫描设备成功...");
          console.log('startBeaconDiscovery', beaconDiscoveryResult);
          //得到设备列表
          wx.getBeacons({
            success: function (getBeaconsResult) {
              console.log(getBeaconsResult);
              
              if (getBeaconsResult.beacons.length == 0) {
                let numss=me.data.nums+1;
                console.log('numss = ' + numss);
                me.setData({
                  nums:numss
                })
                console.log('当前扫描次数是 ' + numss);
                if (numss > 50) {
                  me.stopBeacon(function(){
                    me.setData({
                      bluetootTypeMsg: '未扫描到设备',
                      devices: getBeaconsResult.beacons,
                      saomiaoing: false,
                      nums: 0
                    })
                
                  });
                } else {
                  me.stopBeacon(function () {
                    me.startBeacon(myUUIDS,callback);
                  });
                }
              }else{
                me.setData({
                  bluetootTypeMsg: '打卡',
                  devices: getBeaconsResult.beacons
                });
                me.stopBeacon(function () {
                  me.setData({
                    saomiaoing: false,
                    nums: 0
                  })
                });
                callback();
              }
              //停止扫描

            },
            fail: function (getBeaconsResultError) {
              me.setData({
                bluetootTypeMsg: '得到设备列表失败！',
              })
              console.log('getBeaconsResultError', getBeaconsResultError);
            }
          });
        },
        fail: function (error) {
          console.log("扫描设备失败...", error);

          // if (error.errCode == 11003) {
          //   console.log("扫描设备已经运行了，正在关闭并重新启动", error);
          //   //停止扫描
          //   me.stopBeacon(function () {
          //     me.startBeacon(myUUIDS,callback);
          //   });
          // } else {
          console.log("扫描设备失败，6秒后重新启动", error);
          setTimeout(() => {
            me.startBeacon(myUUIDS, callback);
          }, 6000)
          // }

        }
      });
    

    //   },
    //   fail: function () {
    //     me.setData({
    //       bluetootTypeMsg: '蓝牙关闭状态，请打开蓝牙'
    //     })
    //     console.log('蓝牙关闭状态，请打开蓝牙');
    //   }
    // })

  },
  //停止搜索
  stopBeacon(callback) {
    let me = this;
    console.log('me.data.saomiaoing= ' + me.data.saomiaoing)
    if (me.data.saomiaoing) {
      wx.stopBeaconDiscovery({
        success: function(res) {
          console.log("停止设备扫描！");
          
        
          if (callback != undefined) {
            callback()
          }
        },
        fail: function(error) {
          console.log("停止设备扫描失败！", error);
          if (error.errCode == 11004) {

          } else {
            setTimeout(() => {
              me.stopBeacon(callback);
            }, 5000)
          }

        }
      });
    } else {
      console.log("设备本来就停止扫描！不用重复停止");
    }

  },

  dkAjax() {
    console.log('打卡成功');
  },
  clearStorage() {

    wx.clearStorage();
  },
  clearStorage2() {

    wx.redirectTo({
      url: '../login/login',
    })
  },
  sendAjax(){
    console.log(this.data.devices);
    console.log('我发送了ajax');
  }
})