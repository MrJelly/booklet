import { appModal } from './component/appModal/appModal'
//app.js
App({
  appModal,
  onLaunch: function () {
    var that = this
    //获取设备信息
    that.getSystemInfo();

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log('微信小程序登录成功', res)

    //   }
    // })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'jellytest',
        traceUser: true,
      })
      that.globalData.db = wx.cloud.database({
        env: 'jellytest'
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