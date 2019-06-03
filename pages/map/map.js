// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    markers: [{
      // iconPath: "/resources/others.png",//
      id: 0,
      latitude:39.90569,
      longitude:116.22299,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        latitude: 39.90569,
        longitude: 116.22299,
      }, {
          latitude: 39.85,
          longitude: 116.2229,
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    circles:[{
      latitude: 39.90569,
      longitude: 116.22299,
      color: '#ff0000dd',
      fillColor: '#fcb5ec88',
      radius: 3000,
      strokeWidth: 1
    } 
    ],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
    }) 
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})