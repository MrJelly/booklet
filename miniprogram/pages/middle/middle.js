// pages/middle/middle.js
const app = getApp()
var util = require('../../utils/util.js');
var request = require('../../utils/request.js')

// const plugin = requirePlugin("WechatSI")
// const manager = plugin.getRecordRecognitionManager()

var titlestr = ""
var contentstr = ""
var getdue =function()
{
  var date = new Date();
  console.log("date======>>",date)
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

Page({
  data: {
    date:'',
    initTitleValue: '',
    initContentValue: '',
    location: '-',
    weather:'-',
    locationCheck :true,
    weatherCheck :true,
  },
  isWeather: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    new app.appModal();
    that.setData({
      navH: app.globalData.navHeight,
      date: util.formatTime()})
    that.updateWeather()
    that.updateLocation()
  },
  updateWeather: function () {
    var that = this
    if (wx.getStorageSync("weather")) {
      var w = wx.getStorageSync("weather")
      var weather = "天气:" + w.weather.data + "   温度:" + w.temperature.data +"℃"
      that.data.weather = weather
      that.setData({ weather: weather })
      that.isWeather = true
    }
    else {
      var cb = function (w) {
        var weather = "天气:" + w.weather.data + "   温度:" + w.temperature.data + "℃"
        that.data.weather = weather
        that.setData({ weather: weather })
        that.isWeather = true
      }
      util.getWeather(cb)
    }
  },
  updateLocation: function () {
    var that = this
    if (wx.getStorageSync("location")) {
      that.data.location = wx.getStorageSync("location")
      that.setData({ location: that.data.location })
      
    }
    else {
      var cb = function (res) {
        that.data.location = res
        that.setData({ location: res })
      }
      util.getLocation(cb)
    }
  },
  onShow: function () {
  },

  settitle: function(e)
  {
    titlestr = e.detail.value
  },
  setcontent: function(e)
  {
    contentstr = e.detail.value
  },
  sendButtonTap: function (e) {
    var that = this
    
    if (titlestr == "" || contentstr == "") { util.showTip("标题或内容为空", "none"); return }
    wx.showLoading({
      title: '正在发布中',
    })
    var data = {
      due: util.formatTime(true),
      location: that.data.locationCheck ? that.data.location : '-',
      weather: that.data.weatherCheck ? that.data.weather : '-',
      titlestr: titlestr,
      contentstr: contentstr,
    }
    var success = function (res) {
      var total = wx.getStorageSync('total')
      wx.setStorageSync("total", (total || 0)+1)
      var alldata = wx.getStorageSync("alldata") || []
      var dt = data.due.split(' ')
      var showdate = dt[0]
      var showtime = dt[1]
      alldata.unshift({ id: res._id, title: data.titlestr, content: data.contentstr, weather: data.weather, location: data.location, date: data.due, showdate: showdate, showtime: showtime })
      wx.setStorageSync("alldata", alldata)
      titlestr = ""
      contentstr: "",
      that.setData({ initTitleValue: '', initContentValue: '' })
      wx.hideLoading()
      util.showTip("发布成功", "success");
    }
    request.requestAdd(data, success)
  },

  selectcolortap:function(e) 
  {
    const index = e.currentTarget.dataset.idx
    if (index != this.selectedindex)
    {
      this.selectedindex = index
      this.selectedcolor = font_colors[index]
      this.setData({selectedindex: index,
        selectedcolor: this.selectedcolor
      })
    }
  },

  selectLocation: function () {
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) 
        {
          wx.chooseLocation({
            success: function (res) {
              // console.log("resresult++++++++++++",res)
              if (res.address != that.data.location) {
                that.data.location = res.address
                that.setData({ location: res.address })
              }
            },
            fail: console.error,
          })
        }
        else
        {
          that.showModal({ title: '温馨提示', isModalShow: false, content: '尊敬的用户，在您使用之前需要授权您的位置信息！', confirmbtn: { text: '确认', type: 'openSetting', }, cancelbtn: { text: '取消' },})
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
  switchLocationChange:function(e){
    this.data.locationCheck = !this.data.locationCheck
  },
  switchWeatherChange:function(e){
    this.data.weatherCheck = !this.data.weatherCheck
  },
  navBack:function()
  {
    wx.navigateBack({ url:'../index/index' })
  },




  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})