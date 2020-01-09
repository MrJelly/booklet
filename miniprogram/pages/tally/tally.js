// miniprogram/pages/tally.js
const app = getApp();
var util = require('../../utils/util.js');
var datamgr = require('../../utils/datamgr.js');
import touch from '../../utils/touch.js'
Page({
  data: {
    year:new Date().getFullYear(),
    month: (new Date().getMonth()) + 1,
    tallylist:[],
    outcomesort: datamgr.outcomesort,
    incomesort: datamgr.incomesort,
    touchIndexData:[],
    outcometotal:0,
    incometotal:0,
  },
  onLoad: function (options) {
    app.addEventListener("change", this.uiDataChange)
    this.setData({ maxDate:util.formatDate(!0)})
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    this.animation = animation
    var next = !0;
    setInterval(function () {
      if (next) {
        this.animation.scale(0.95).step()
        this.animation.rotateZ(20).step()
        next = !next;
      } else {
        this.animation.scale(1).step()
        this.animation.rotateZ(-20).step()
        next = !next;
      }
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 500)
    this.touch = new touch()
    this.update()
  },
  uiDataChange() {
    var that = this
    that.update()
  },
  update:function(year,month)
  {
    var that = this
    if(!year || !month)
    {
      let date = new Date()
      year = date.getFullYear()
      month = date.getMonth() + 1
    }
    let tallydata = datamgr.getComeByMonth(year, month)
    let l = tallydata.length
    let tallylist = []
    let tmp = { title: '', outcome: 0, income: 0, data: [] }
    let touchIndexData = this.data.touchIndexData
    let outcometotal=0, incometotal =0
    for (let i = 0; i < l; i++) {
      let dt = tallydata[i]
      let dtn = tallydata[i + 1]
      let num = parseFloat(dt.num)
      if (dt.comeType == 0)
      {
        tmp.outcome = tmp.outcome + num
        outcometotal = outcometotal + num
      } else
      {
        tmp.income = tmp.income + num
        incometotal = incometotal + num
      }
      dt.touchindex = i
      touchIndexData.push(!1)
      tmp.data.push(dt)
      if ((dtn && dt.day != dtn.day) || i == l - 1) {
        tmp.title = dt.month + '月' + dt.day + '日' + (util.getWeekStr(dt.week))

        tallylist.push(tmp)
        tmp = { title: '', outcome: 0, income: 0, data: [] }
      }
    }
    this.setData({
      year,
      month,
      tallylist: tallylist,
      touchIndexData: touchIndexData,
      outcometotal: outcometotal,
      incometotal: incometotal,
    })
  },
  onDateChange:function(e)
  {
    var that = this
    var arr = e.detail.value.split("-");
    that.update(arr[0], arr[1])
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = this.touch._touchstart(e, this.data.touchIndexData)
    this.setData({
      touchIndexData: data
    })
  },
  touchmove: function (e) {
    let data = this.touch._touchmove(e, this.data.touchIndexData)
    if (data)
    {
      this.setData({
        touchIndexData: data
      })
    }
  },
  del: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除这条记账？',
      success: function (res) {
        if (res.confirm) {
          datamgr.deleteTallyByIndex(e.currentTarget.dataset.index)
          app.sendEvent("change")
        } else if (res.cancel) {
        }
      }
    })
  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '../detailtally/detailtally?index=' + e.currentTarget.dataset.index,
    })
  },
  addtally()
  {
    wx.navigateTo({
      url: '../addtally/addtally',
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {
    app.removeEventListener("change", this.uiDataChange)
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})