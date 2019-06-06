// pages/map/map.js
import {
  utils
} from '../../utils/util.js'
var util = new utils();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:1,
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
      "EE527551-9C8F-C93C-B9CE-01D9E27D42B4",
      "70552625-45EE-CCB7-6BCE-6B597EB73EF2"
    ], //uuids
    devices: [], //最终搜索到的uuids
    distanceM: 0, //手机与中心打卡点的距离 单位 米
    bluetootType: false, //手机蓝牙是否是打开状态
     bluetootTypeMsg: '' 
  },


  //生命周期函数--监听页面加载

  onLoad: function(options) {
    let num=1;
    setInterval(()=>{
      console.log('我正在被处罚');
      num++;
      this.setData({
        msg:num
      })
    },5000)
    let me = this;
    //获取用户手机电量
    wx.getBatteryInfo({
      success: function(result) {
        console.log({
          '手机电量': result
        });
      }
    })
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
              bluetootType: true
            })
            me.startBeacon(me.data.devices, ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825']);
          }
        });

      }
    })
  },


  controltap(e) {
    console.log(e.controlId)
  },
  //开始搜索
  startBeacon(devices, myUUIDS) {
    let me = this;
    console.log("开始扫描设备...");
    wx.startBeaconDiscovery({
      uuids: myUUIDS,
      success: function(beaconDiscoveryResult) {
        console.log("扫描设备成功...");
        console.log(beaconDiscoveryResult);
        wx.getBeacons({
          success: function (getBeaconsResult) {
            console.log(getBeaconsResult);
            me.setData({
              devices: ['0000000']
            })
            //停止扫描
            me.stopBeacon();
          },
          fail: function (getBeaconsResult) {
            console.log(getBeaconsResult);
            me.setData({
              devices: ['test']
            })
          }
        })
        // 监听iBeacon信号
        wx.onBeaconUpdate(function(beaconUpdateResult) {
          console.log(beaconUpdateResult);
          // 请注意，官方文档此处又有BUG，是res.beacons，不是beacons。
          if (beaconUpdateResult && beaconUpdateResult.beacons && beaconUpdateResult.beacons.length > 0) {
            // 此处最好检测rssi是否等于0，等于0的话信号强度等信息不准确。我是5秒内重复扫描排重。
            //最后在停止扫描
            //发送AJAX.......
            me.setData({
              devices: beaconUpdateResult.beacons
            })
            me.stopBeacon();
          }else{
            me.setData({
              bluetootTypeMsg: '未发现打卡设备！',
              devices: ['test']
            })
          }
          //上边都获取到了 为啥网上还要这一步？？？？？？
          wx.getBeacons({
            success: function(getBeaconsResult) {

            },
            fail: function(getBeaconsResult) {

            }
          })
        });
      },
      fail: function() {
        console.log("扫描设备失败先关闭扫描...5秒后重新扫描");
        setTimeout(() => {
          me.stopBeacon(function() {
            me.startBeacon(devices, myUUIDS);
          });
        }, 5000)
      }
    });
  },
  //停止搜索
  stopBeacon(callback = function() {}) {
    let me =this;
    wx.stopBeaconDiscovery({
      success: function(res) {
        console.log();
        console.log("停止设备扫描！");
        callback();
      },
      fail: function(res) {
        console.log("停止设备扫描失败！");
        setTimeout(()=>{
          me.stopBeacon();
        }, 2000)
      }
    });
  },
  switch1Change: function(e) {
    let me = this;
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    if (e.detail.value) {
      me.setData({
        bluetootType: true,
        bluetootTypeMsg: '扫描设备中...'
      })
      //每隔五秒--监听蓝牙状态
      console.log('每隔五秒--监听蓝牙状态');
      var onBluetoothAdapterStateChangeTime = setInterval(() => {
        //是否打开蓝牙了
        wx.openBluetoothAdapter({
          success(BluetootResult) {
            console.log(BluetootResult);
            console.log('打开蓝牙了');
            me.setData({
              bluetootTypeMsg: '扫描设备中...'
            })
            //如果用户打开蓝牙，关闭定时器 并且 开始搜索IBeacon
            clearInterval(onBluetoothAdapterStateChangeTime);
            console.log('关闭定时器 并且 开始搜索IBeacon');
            me.startBeacon(me.data.devices, me.data.uuids);
          },
          fail: function() {
            me.setData({
              bluetootTypeMsg: '请打开蓝牙'
            })
            console.log('没有打开蓝牙，等待五秒后再次检查是否打开蓝牙');
          }
        })
      }, 5000);
    } else {
      me.setData({
        bluetootType:false,
        bluetootTypeMsg:'',
        devices:[]
      })
      //停止扫描
      me.stopBeacon();
    }
  },
  dkAjax(){
    console.log('打卡成功');
  }
})