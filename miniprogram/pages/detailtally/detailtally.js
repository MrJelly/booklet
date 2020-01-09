
var util = require('../../utils/util.js');
var datamgr = require('../../utils/datamgr.js');
const app=getApp()
Page({
  data: {
    outcomesort: datamgr.outcomesort,
    incomesort: datamgr.incomesort,
    detail:{},
  },

  onLoad: function (options) {
    if (!options.index) return
    this.index = options.index
    let detail = datamgr.getTallyByIndex(Number(options.index))
    let date = detail.year + '年' + detail.month + '月' + detail.day + '日' + ' '+ util.getWeekStr(detail.week)
    let sortIndex = detail.comeType == 0 ? datamgr.outcomesort[detail.sortindex] : datamgr.incomesort[detail.sortindex]
    this.setData({ 
      detail,
      date,
      sortIndex
    })
  },
  tapEdit: function (e) {
    var t = this.index;
    wx.navigateTo({
      url: "/pages/addtally/addtally?index=" + t
    });
  },
  tapDel: function (e) {
    var t = this, n = t.index;
    wx.showModal({
      title: "提示",
      content: "确认删除这条记账？",
      success: function (e) {
        datamgr.deleteTallyByIndex(n)
        app.sendEvent("change")
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  onHide(){},
  onUnload: function () {
    this.index =!1
  }
})
