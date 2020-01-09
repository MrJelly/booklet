// miniprogram/pages/addtally/addtally.js
const app = getApp()
var util = require('../../utils/util.js');
var datamgr = require('../../utils/datamgr.js');
var calc = require("../../utils/calc")
var remarkstr = ''
var tallyDate=[]

const outcomesort = function()
{
  let f= function(r){
    let sort = []
    for (let i = r*10; i < r*10+10; i++) {
      let dt = datamgr.outcomesort[i]
      if (dt)
      {
        sort.push(dt)
      }
    }
    return sort
  }
  let outcome =[]
  for (let i = 0; i < 2; i++)
  {
    outcome.push(f(i))
  }
  return outcome
}()
const incomesort = function()
{
  let f = function (r) {
    let sort = []
    for (let i = r * 10; i < r * 10 + 10; i++) {
      let dt = datamgr.incomesort[i]
      if (dt) {
        sort.push(dt)
      }
    }
    return sort
  }
  let income = []
  for (let i = 0; i < 1; i++) {
    income.push(f(i))
  }
  return income
}()
const getTime = function()
{
  let date = tallyDate.length > 0 ? new Date(+tallyDate[0], tallyDate[1] - 1, tallyDate[2]) : new Date()
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), time: date.getTime(), week: date.getDay()}
}

Page({

  swipercurrent:0,
  data: {
    outcomesort: outcomesort,
    incomesort: incomesort,
    date:'今天',
    complete:'完成',
    //是否采用衔接滑动
    circular: true,
    //是否显示画板指示点
    indicatorDots: false,
    //选中点的颜色
    indicatorcolor: "#000",
    //是否竖直
    vertical: false,
    //是否自动切换
    autoplay: false,
    //滑动动画时长毫秒
    duration: 100,

    curSelect:0,//收入  支出
    swiperindex: 0,//swiper页数
    curSelectSwiper: 0,//当前选中swiper页面
    curSelectWays:0,//当前选中swiper页面的id
    selectdata: outcomesort[0][0],
    sortViewHeight: 500,
  },
  onLoad: function (options) {
    this.setData({ maxDate: util.formatDate() })
    if (options.index){
      this.index = options.index
      this.isEdit=!0
      let detail = datamgr.getTallyByIndex(Number(options.index))
      let todayDate = new Date();
      if (detail.year == todayDate.getFullYear() && detail.month == todayDate.getMonth() + 1 && detail.day == todayDate.getDate()) {
        tallyDate = []
        this.setData({ date: "今天" })
      } else {
        tallyDate = [detail.year, detail.month, detail.day]
        this.setData({ date: util.formatDate(!1,detail.year ,detail.month ,detail.day) })
      }
      calc.setInit(detail.num)
      remarkstr = detail.remark
      let swiperindex=Math.floor(detail.sortindex/10)
      let curSelectWays = detail.sortindex % 10
      let dt = detail.comeType == 0 ? outcomesort:incomesort
      this.setData({
        curSelect: detail.comeType,
        curSelectWays,
        curSelectSwiper: swiperindex,
        swiperindex,
        calc: calc.getVars(),
        selectdata: dt[swiperindex][curSelectWays],
        initTitleValue: detail.remark
      })
    } else { calc.setInit(0)}
  },

  selectTap:function(e)
  {
    var that = this;
    if (e.currentTarget.id == that.data.curSelect) return
    let dt = e.currentTarget.id == 0 ? outcomesort : incomesort
    let curSelectWays = 0, swiperindex=0
    that.setData({ 
      curSelect: e.currentTarget.id,
      swiperindex,
      curSelectWays,
      curSelectSwiper: swiperindex,
      selectdata: dt[swiperindex][curSelectWays]
    })
  },
  selectWaysTap:function(e)
  {
    var that = this;
    if (e.currentTarget.id == that.data.curSelectWays && that.data.curSelectSwiper == that.data.swiperindex) return
    let dt = that.data.curSelect == 0 ? outcomesort : incomesort
    that.setData({
      curSelectWays: e.currentTarget.id,
      curSelectSwiper:that.data.swiperindex,
      selectdata: dt[that.data.swiperindex][e.currentTarget.id]
    })
  },
  bingswipercurrent:function(e)
  {
    var that = this
    that.setData({ swiperindex: e.detail.current })
  },

  btnClicked: function (e) {
    var that = this
    var code = e.target.dataset.op
    if (code =="完成")
    {
      if (calc.getVars().displayNum==0){
        wx.showToast({
          title: '金额数不能为0',
          icon:'none'
        })
        return
      }
      var temp = getTime()
      temp.remark = remarkstr
      temp.sortindex = that.data.swiperindex * 10 + Number(that.data.curSelectWays)
      temp.comeType = that.data.curSelect
      temp.num = Number(calc.getVars().displayNum)
      
      if (this.isEdit)
      {
        datamgr.editTallyByIndex(this.index, temp)
        app.sendEvent("change")
        wx.reLaunch({
          url: '/pages/tally/tally',
        })
        return
      }
      datamgr.setTally(temp)
      app.sendEvent("change")
      wx.navigateBack({
        delta: 1
      })
      return
    }
    calc.addOp(code)
    this.setData({ calc: calc.getVars() })
  },
  btnTouchStart: function (e) {
    var code = e.target.dataset.op
    var tapped = { [code]: 'active' }
    this.setData({ tapped: tapped })
  },
  btnTouchEnd: function (e) {
    var code = e.target.dataset.op
    var tapped = {}
    this.setData({ tapped: tapped })
  },
  onDateChange: function (e) {
    var arr = e.detail.value.split("-");
    let date = new Date();
    if (+arr[0] == date.getFullYear() && +arr[1] == date.getMonth() + 1 && +arr[2]==date.getDate())
    {
      tallyDate = []
      this.setData({ date: "今天"})
    }else{
      tallyDate=arr
      this.setData({ date: e.detail.value })
    }
  },
  setRemark: function (e) {
    remarkstr = e.detail.value
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    this.index = !1
    this.isEdit = !1
    remarkstr=''
  },
  onUnload: function () {
    this.index = !1
    this.isEdit = !1
    remarkstr = ''
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})