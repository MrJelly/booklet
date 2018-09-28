//index.js
//获取应用实例
const app = getApp()
var request = require('../../utils/request.js')
var tick = 3600000
Page({
  data: {
    hasUserInfo: false,
    showUI:false,
    isUserInfo:false,
    isLocation:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    text:{}
  },
  onLoad: function (option) {
    var that = this
    var curTick = new Date().getTime()
    var lastTick = wx.getStorageSync("tick")
    if (JSON.stringify(lastTick) != '""')
    {
      if (curTick - lastTick > tick) {
        wx.removeStorageSync("weather")
        wx.removeStorageSync("location")
      }
    }
    wx.setStorageSync("tick", curTick)
    
    new app.appModal();//调用showModal
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              that.login()
            }
          })

        } else {
          if (that.data.canIUse) {
            that.showModal({ title: '温馨提示', isModalShow: true, content: '尊敬的用户，在您使用之前需要授权您的用户信息！', confirmbtn: { text: '确认授权', type: 'getUserInfo' }, })
          } else {
            wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo
                that.login()
              }
            })
          }
        }
      }
    })
  },
  onShow:function(){
  },
  login:function(data)
  {
    wx.showLoading({
      title: '登录中请稍后...',
    })
    var data = data || {}
    var success = (res) => 
    {
      console.log("返回值=======",res)
      wx.hideLoading()
      var op = wx.getStorageSync("openid")
      if (op && op != res.result._id)
      {
        wx.clearStorageSync()
        wx.setStorageSync("openid", res.result._id)
        app.globalData.openid = res.result._id
      }
      wx.reLaunch({ url: "../index/index" })
    }
    request.requestLogin(data, success)
  },
  
  getUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo)
    {
      const userInfo = e.detail.userInfo
      app.globalData.userInfo = userInfo
      
      var data = {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender
      }
      that.login(data)
    }
    else
    {
      that.showModal({ title: '温馨提示', isModalShow: true, content: '我们保证不会泄露您的任何个人信息，请您确认！', confirmbtn: { text: '确认授权', type: 'getUserInfo'}, })
    }
  },
})
