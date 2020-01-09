// miniprogram/pages/charts/charts.js
function t(t, a, e) {
  return a in t ? Object.defineProperty(t, a, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[a] = e, t;
}
const app = getApp()
var util = require('../../utils/util.js');
var a = require('../../utils/wxcharts.js');
var datamgr = require('../../utils/datamgr.js');

const years=[1,2,3,4,5,6,7,8,9,10,11,12]
const solarMonth= [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const solarDays=function (y, m) {
  if (m > 12 || m < 1) { return -1 } //若参数错误 返回-1
  var ms = m - 1;
  if (ms == 1) { //2月份的闰平规律测算后确认返回28或29
    return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
  } else {
    return (solarMonth[ms]);
  }
}
var m=null
var outStr = { total:'总支出：',rank:'支出排行榜'}
var inStr = { total: '总收入：',rank:'收入排行榜'}
Page({
  data: {
    outcomesort: datamgr.outcomesort,
    incomesort: datamgr.incomesort,
    ranknull:!0,//是否显示排行榜
    rankData:[],
    curSelect: 0,//收入、支出
    selectDate:0,//选择年/月
    pickerfields: 'month',
    year:'',
    month:'',
  },

  onLoad: function (options) {
    var that = this
    app.addEventListener("change", that.uiDataChange)
    this.setData({ maxDate: util.formatDate(!0) })
    this.canvasWidth = util.rpx2px(720, app.globalData.systemInfo.windowWidth)
    this.canvasHeight = util.rpx2px(300, app.globalData.systemInfo.windowWidth)

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
    
    that.setDate()
    that.update()
  },
  uiDataChange(){
    var that = this
    that.setDate()
    // that.update()
    that.needUpdate=!0
  },

  setDate(year,month)
  {
    var that = this
    if(!year && !month)
    {
      var date = new Date()
      year = date.getFullYear()
      month= date.getMonth()+1
    }
    var p, d
    
    if (that.data.selectDate == 0) {
      p="month",d=year+'年'+month+'月'
    }else
    {
      p = "year", d = year + '年'
    }

    that.setData({
      pickerfields: p,
      date: d,
      year:year, 
      month:month
    })
  },
  update()
  {
    var that = this
    var str= that.data.curSelect==0?outStr:inStr
    if (that.data.selectDate == 0) {
      var list = datamgr.mergeMonthCome(that.data.year, that.data.month, that.data.curSelect)

      var l = solarDays(that.data.year, that.data.month)
      var monthdate = []
      var data = list.chartData
      let s = data.length, i, j, dt = [], md = [], t = !1
      for (i = 1; i <= l; i++) {
        for (j = s - 1; j >= 0; j--) {
          let val = data[j]
          if (val.day == i) {
            dt.push(val.num)
            t = !0
            break;
          }
        }
        t == !1 && dt.push(0);
        t = !1
        md.push(i)
      }
      that.initChart(dt, md)
      that.setData({
        rankData: list.rankData,
        totalNum: list.total,
        totalText: str.total + list.total,
        averageText: '平均值：'+Math.floor(list.total / l),
        rankText: str.rank,
        ranknull: list.rankData.length == 0
      })
    } else {
      var list = datamgr.mergeYearCome(that.data.year, that.data.curSelect)
      var data = list.chartData
      var l = years.length
      let s = data.length, i, j, dt = [], t = !1
      for (i = 1; i <= l; i++) {
        for (j = s - 1; j >= 0; j--) {
          let val = data[j]
          if (val.month == i) {
            dt.push(val.num)
            t = !0
            break;
          }
        }
        t == !1 && dt.push(0);
        t = !1
      }
      that.initChart(dt, years)
      that.setData({
        rankData: list.rankData,
        totalNum: list.total,
        totalText: str.total + list.total,
        averageText: '平均值：' + Math.floor(list.total / l),
        rankText: str.rank,
        ranknull: list.rankData.length == 0
      })
    }
  },
  initChart:function(data, date) {
    var that = this, l = that.data.curSelect==0?"支出":'收入';
    m = new a(t({
      canvasId: "line-canvas",
      type: "line",
      categories: date,
      categoryNames: "fdfd",
      animation: !0,
      background: "#f5f5f5",
      series: [{
        seryname: that.data.selectDate,
        name: l,
        data: data,
        format: function (t, a) {
          return isNaN(t) ? 0 : (t);
        },
        color: "#343233",
        dataPointShape: "circle",
        dataPointFillColor: "#FCAA67",
        emptyPointFillColor: "#ffffff"
      }],
      xAxis: {
        disableGrid: !0,
        gridColor: "#c3c3c3",
        fontColor: "#6c6c6c",
        type: "calibration"
      },
      yAxis: {
        disabled: !0,
        max: that.canvasHeight,
        min: 0,
      },
      width: that.canvasWidth,
      height: that.canvasHeight,
      dataLabel: !1,
      dataPointShape: !0,
      legend: !1
    }, ));
  },
  touchHandler: function (t) {
    m.showToolTip(t, {
      format: function (t, a) {
        var e = t.seryname==0?'日':'月'
        return  a+e+t.name + ":" + t.data;
      }
    });
  },
  selectTap(e)
  {
    var that = this;
    if (e.currentTarget.id == that.data.curSelect) return
    that.setData({
      curSelect: e.currentTarget.id,
    })
    that.update()
  },
  selectDate(e)
  {
    var that = this;
    if(e.currentTarget.id == that.data.selectDate) return
    that.setData({
      selectDate: e.currentTarget.id,
    })
    that.setDate()
    that.update()
  },
  onDateChange(e)
  {
    var that = this;
    var arr = String(e.detail.value).split("-");
    var year = arr[0], month = arr[1] || !1
    if (that.data.selectDate == 1 && year && year == that.data.year)return
    if (that.data.selectDate == 0 && year == that.data.year && month == that.data.month)return
    that.setDate(year, month)
    that.update()
  },
  addtally() {
    wx.navigateTo({
      url: '../addtally/addtally',
    })
  },
  onReady: function () {

  },
  onShow: function () {
    if(this.needUpdate)
    {
      this.needUpdate=!1
      this.update()
    }
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