import { appModal } from './component/appModal/appModal'
//app.js
App({
  appModal,
  onLaunch: function () {
    var that = this
    //获取设备信息
    that.getSystemInfo();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'jelly',
        traceUser: true,
      })
      that.globalData.db = wx.cloud.database({
        env: 'jelly'
      })
    }
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        t.globalData.navHeight = res.statusBarHeight + 46;
      }
    });
  },
  globalData: {
    systemInfo: {},//客户端设备信息
    userInfo: {},
    db:null,
    openid:null,
  }
})