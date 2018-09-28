//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    containerheight:0,
    date:'',
    weather: { wea: '-', tem: '-', win: '-', dir:'-', hum:'-',},
    location:"-",
  },
  isWeather:false,
  isLocation:false,
  onLoad: function () {
    var that = this
    var windowWidth = app.globalData.systemInfo.windowWidth;
    var windowHeight = app.globalData.systemInfo.windowHeight;
    windowHeight = util.px2rpx(windowHeight, windowWidth);

    
    that.setData({ 
      navH: app.globalData.navHeight,
      containerheight: windowHeight*0.9,
      date: util.formatTime()
    })


    new app.appModal()
    that.updateWeather()
    that.updateLocation()
  },

  updateWeather:function()
  {
    var that = this
    if (wx.getStorageSync("weather")) {
      var w = wx.getStorageSync("weather")
      var weather = { wea: w.weather.data, tem: (w.temperature.data +'℃'), win: w.windpower.data, dir: w.winddirection.data, hum: w.humidity.data,}
      that.setData({ weather: weather })
      that.isWeather = true
    }
    else {
      var cb = function (w) {
        var weather = { wea: w.weather.data, tem: (w.temperature.data + '℃'), win: w.windpower.data, dir: w.winddirection.data, hum: w.humidity.data, }
        that.setData({ weather: weather })
        that.isWeather = true
      }
      util.getWeather(cb)
    }
  },
  updateLocation:function()
  {
    var that = this
    if (wx.getStorageSync("location")) {
      that.setData({ location: wx.getStorageSync("location") })
      that.isLocation = true
    }
    else {
      var cb = function (res) {
        that.setData({ location: res })
        that.isLocation = true
      }
      util.getLocation(cb)
    }
  },
  onShow:function()
  {
  },
  onHide: function () 
  {
  },
  opendiary:function()
  {
    wx.navigateTo({
      url: '../main/main',
    })
  },
  toadddiary:function()
  {
    wx.navigateTo({
      url: '../middle/middle',
    })
  },

  selectLocation: function () {
    var that = this
    if (that.isLocation){return}
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          that.updateLocation()
        }
        else {
          that.showModal({ title: '温馨提示', isModalShow: false, content: '尊敬的用户，在您使用之前需要授权您的位置信息！', confirmbtn: { text: '确认', type: 'openSetting', }, cancelbtn: { text: '取消' }, })
        }
      }
    })
  },

  selectWeather: function () {
    var that = this
    if (that.isWeather) { return }
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          that.updateWeather()
        }
        else {
          that.showModal({ title: '温馨提示', isModalShow: false, content: '尊敬的用户，在您使用之前需要授权您的位置信息！', confirmbtn: { text: '确认', type: 'openSetting', }, cancelbtn: { text: '取消' }, })
        }
      }
    })
  },
  navBack: function () {
    wx.navigateTo({ url: '../mine/mine' })
  },
  onShareAppMessage: function (res) {
    return {
      title: '@邀你一起来记录每一天',
      path: '/pages/login/login',
      imageUrl: "../images/theme.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
})