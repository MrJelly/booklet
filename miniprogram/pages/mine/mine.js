// pages/mine/mine.js
const app = getApp();
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "新用户",
    icon: "../images/defaulticon.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight,
      name:app.globalData.userInfo.nickName,
      icon: app.globalData.userInfo.avatarUrl, 
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 用户点击右上角分享
   */
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
  navBack: function () {
    wx.navigateBack({ url: '../index/index' })
  },
  clearData: function () {
    var func = () => wx.clearStorageSync()
    util.showModal("提示", "缓存数据可以提高您的体验，确定要清理吗？", func, true)
  },
})