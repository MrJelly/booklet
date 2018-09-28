//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var request = require('../../utils/request.js')

var titlestr=""
var contentstr=""
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    height: 0,
    modalHidden:true,
    diaryID:0,
    diary:{}
  },
  
  onLoad: function (options) {
    
    var that =this
    this.setData({
      navH: app.globalData.navHeight
    })
    var id = JSON.parse(options.id);
    that.data.diaryID = id
    var alldata = wx.getStorageSync("alldata")
    that.data.diary = alldata[id]
    titlestr = alldata[id].title
    contentstr = alldata[id].content
    that.setData({ diary: alldata[id]})
    var windowWidth = app.globalData.systemInfo.windowWidth;
    var windowHeight = app.globalData.systemInfo.windowHeight;
    var height = util.px2rpx(windowHeight, windowWidth)
    that.setData({ 
      navH: app.globalData.navHeight,
      height: (height - 15)+"rpx"})
  },

  onShow:function()
  {
  },
  toeditdiary: function()
  {
    var that = this;
    that.setData({
      modalHidden: false,
    });
  },
  oncancel: function()
  {
    var that = this;
    that.setData({
      modalHidden: true,
    });
  },
  onconfirm: function()
  {
    var that = this;
    if (titlestr == "" || contentstr == "") { util.showTip("标题或内容为空", "none"); return }
    wx.showLoading({
      title: '正在修改中',
    })
    var id = that.data.diary.id
    var data = {
      id: id,
      titlestr: titlestr,
      contentstr: contentstr,
    }
    var success = function (res) {
      var alldata = wx.getStorageSync("alldata")
      var dt = alldata[that.data.diaryID]
      dt.title = titlestr
      dt.content = contentstr
      that.data.diary = dt
      wx.setStorageSync("alldata", alldata)
      that.setData({
        modalHidden: true,
        diary: dt
      });
      wx.hideLoading()
      util.showTip("修改成功", "success");
    }
    request.requestRewrite(data, success)
  },
  settitle: function(e)
  {
    titlestr = e.detail.value
  },
  setdetail: function(e)
  {
    contentstr = e.detail.value
  },
  navBack: function () {
    wx.navigateBack({ url: '../main/main' })
  },
  
})