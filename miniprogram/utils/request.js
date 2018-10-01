const util = require('./util.js')
const app = getApp();
function request(name, data, successCb, errorCb) {
  wx.cloud.callFunction({
    name: name,
    data: data,
    success: function (res)
    {
      util.isFunction(successCb) && successCb(res)
    },
    fail: function (res) {
      wx.hideLoading()
      util.showTip("网络没有响应","none")
      console.error
    }
  })
}

var timeLimit={
  login:0,
  alldata:0,
  alldatanum:0,
  sdelete:0,
  add:0,
  rewrite:0,
  checkLogin:function(cd){
    var currTick = new Date().getTime()
    var lastTick = this.login
    if (currTick - lastTick < cd)
    {
      return false
    }
    this.login = currTick
    return true
  },
  checkAlldata:function(cd){
    var currTick = new Date().getTime()
    var lastTick = this.alldata
    if (currTick - lastTick < cd) {
      return false
    }
    this.alldata = currTick
    return true
  },
  checkAlldatanum:function(cd){
    var currTick = new Date().getTime()
    var lastTick = this.alldatanum
    if (currTick - lastTick < cd) {
      return false
    }
    this.alldatanum = currTick
    return true
  },
  checkDelete:function(cd){
    var currTick = new Date().getTime()
    var lastTick = this.sdelete
    if (currTick - lastTick < cd) {
      return false
    }
    this.sdelete = currTick
    return true
  },
  checkAdd:function(cd){
    var currTick = new Date().getTime()
    var lastTick = this.add
    if (currTick - lastTick < cd) {
      return false
    }
    this.add = currTick
    return true
  },
  checkRewrite:function(cd){
    var currTick = new Date().getTime()
    var lastTick = this.rewrite
    if (currTick - lastTick < cd) {
      return false
    }
    this.rewrite = currTick
    return true
  },
}



function requestLogin(data, successCb, errorCb) {
  if (timeLimit.checkLogin(5000))
  {
    request("login", data, successCb, errorCb)
  }
}
function requestAllData(data, successCb, errorCb) {
  if (timeLimit.checkAlldata(5000)) {
    var db = app.globalData.db
    try {
      db.collection('diarylist').where({
        _openid: app.globalData.openid
      }).skip(data.skip) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(data.pagenum) // 限制返回数量为 10 条
        .get({
        success: function (res) {
          successCb(res)
        },
        fail: function (res) {
          util.showTip("网络没有响应", "none")
        },
      })
    } catch (e) {
      console.error(e)
      util.showTip("网络没有响应", "none")
    }
  }
}
function requestAllDataNum(data, successCb, errorCb) {
  if (timeLimit.checkAlldatanum(5000)) {
    var db = app.globalData.db
    try {
      db.collection('diarylist').where({ _openid: app.globalData.openid }).count({
        success: function (res) {
          successCb(res)
        },
        fail: function (res) {
          wx.hideLoading()
          util.showTip("网络没有响应", "none")
        },
      })
    } catch (e) {
      console.error(e)
      wx.hideLoading()
      util.showTip("网络没有响应", "none")
    }
  }
}
function requestDelete(data, successCb, errorCb) {
  if (timeLimit.checkDelete(5000)) {
    var db = app.globalData.db
    try {
      db.collection('diarylist').doc(data.id).remove({
        data: {
          titlestr: data.titlestr,
          contentstr: data.contentstr,
        },
        success: function (res) {
          successCb(res)
        },
        fail: function (res) {
          wx.hideLoading()
          util.showTip("网络没有响应", "none")
        },
      })
    } catch (e) {
      console.error(e)
      wx.hideLoading()
      util.showTip("网络没有响应", "none")
    }
  }
}
function requestAdd(data, successCb, errorCb) {
  if (timeLimit.checkAdd(5000)) {
    var db = app.globalData.db
    try {
      db.collection('diarylist').add({
        data: {
          // openid: app.globalData.openid,
          due: data.due,
          location: data.location,
          weather: data.weather,
          titlestr: data.titlestr,
          contentstr: data.contentstr,
        },
        success: function (res) {
          successCb(res)
        },
        fail: function (res) {
          wx.hideLoading()
          util.showTip("网络没有响应", "none")
        },
      })
    } catch (e) {
      console.error(e)
      wx.hideLoading()
      util.showTip("网络没有响应", "none")
    }
  }
}
function requestRewrite(data, successCb, errorCb) {
  if (timeLimit.checkRewrite(5000)) {
    var db = app.globalData.db
    try {
      db.collection('diarylist').doc(data.id).update({
        data: {
          titlestr: data.titlestr,
          contentstr: data.contentstr,
        },
        success: function (res) {
          successCb(res)
        },
        fail: function (res) {
          wx.hideLoading()
          util.showTip("网络没有响应", "none")
        },
      })
    } catch (e) {
      console.error(e)
      wx.hideLoading()
      util.showTip("网络没有响应", "none")
    }
  }
}

module.exports = {
  requestLogin: requestLogin,
  requestAllData: requestAllData,
  requestAllDataNum: requestAllDataNum,
  requestDelete: requestDelete,
  requestAdd: requestAdd,
  requestRewrite: requestRewrite,
}