var a = require("utils/util.js");
//app.js
App({
  onLaunch: function () {
    var that = this
    that.getSystemInfo();
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  addEventListener: function (evtName, cbkFunc) {
    var evtListenerList = this.globalData.evtListenerMap[evtName]
    if (!evtListenerList) {
      evtListenerList = []
      this.globalData.evtListenerMap[evtName] = evtListenerList
    }
    var exist = false
    for (var key in (evtListenerList)) {
      if (evtListenerList[key] && evtListenerList[key][0] == cbkFunc) { exist = true }
    }
    if (!exist) {
      var evtListener = [cbkFunc]
      evtListenerList.push(evtListener)
    }
  },

  sendEvent: function (evtName, pragram) {
    var evtListenerList = this.globalData.evtListenerMap[evtName]
    if (!evtListenerList) { return }
    var tempList = []
    for (var key in evtListenerList) {
      tempList.push(evtListenerList[key])
    }
    for (var key in tempList) {
      if (tempList[key][0]) {
        tempList[key][0](pragram)
      }
    }
  },

  removeEventListener: function (evtName, cbkFunc) {
    var evtListenerList = this.globalData.evtListenerMap[evtName]
    console.log("evtListenerList", evtListenerList)
    if (evtListenerList) {
      for (var key in evtListenerList) {
        if (evtListenerList[key][0] == cbkFunc) {
          evtListenerList[key].pop()
        }
      }
    }
  },
  
  globalData: {
    systemInfo: {},//客户端设备信息
    userInfo: {},
    evtListenerMap:{}
  }
})