//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var wxviewType = require('../../utils/wxview.js');
var request = require('../../utils/request.js')

var touchData = {
  init: function () {
    this.firstTouchX = 0;
    this.firstTouchY = 0;
    this.lastTouchX = 0;
    this.lastTouchY = 0;
    this.lastTouchTime = 0;
    this.swipeDirection = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.totalDelateX = 0;
    this.speedY = 0;
  },
  touchstart: function (e) {
    this.init();
    this.firstTouchX = this.lastTouchX = e.touches[0].clientX;
    this.firstTouchY = this.lastTouchY = e.touches[0].clientY;
    this.lastTouchTime = e.timeStamp;
  },
  touchmove: function (e) {
    this.deltaX = e.touches[0].clientX - this.lastTouchX;
    this.deltaY = e.touches[0].clientY - this.lastTouchY;
    this.totalDelateX += this.deltaX;
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchY = e.touches[0].clientY;
    this.lastTouchTime = e.timeStamp;
    if (this.swipeDirection === 0) {
      if (Math.abs(this.deltaX) > Math.abs(this.deltaY)) {
        this.swipeDirection = 1;
      }
      else {
        this.swipeDirection = 2;
      }
    }
  },
  touchend: function (e) {
    var deltaTime = e.timeStamp - this.lastTouchTime;
    this.speedY = this.deltaY / deltaTime;
  }
}
Page({
  data: {
    hasRefesh: false,
    hasMore: false,

    diaryList: [],
    height: 0,
  },
  swipeCheckX: 35, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 80, //消息列表项最大左滑距离
  correctMoveLeft: 70, //显示菜单时的左滑距离
  thresholdMoveLeft: 70,//左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单

  canNavigate: true,//記錄是否可以跳轉到日記詳情頁

  totaldiary:0,
  skip:0,
  pagenum:10,

  onLoad: function () {
    var that = this
    that.renderData = {};
    that.diaryListView = wxviewType.createWXView();
    that.diaryListView.setAnimationParam('diaryListAnimation');
    that.diaryListView.page = this;

    var windowWidth = app.globalData.systemInfo.windowWidth;
    var windowHeight = app.globalData.systemInfo.windowHeight;
    var iphoneXH = app.globalData.systemInfo.model == "iPhone X" ? 65 : 0
    var height = util.rpx2px(180, windowWidth);
    that.windowWidth = windowWidth
    that.windowHeight = windowHeight - app.globalData.navHeight
    that.height = height
    that.diaryListView.setWH(windowWidth, windowHeight);

    this.setData({
      navH: app.globalData.navHeight
    })

    var totaldiary = wx.getStorageSync("total")
    if (JSON.stringify(totaldiary) === '""')
    {
      var data = {
      }
      var success = function (res) {
        wx.setStorageSync("total", res.total)
        that.totaldiary = res.result
      }
      request.requestAllDataNum(data, success)
    }
    else
    {
      that.totaldiary = totaldiary
    }
  },
  parseData:function(data)
  {
    var temp = []
    for (var i = data.length - 1; i >= 0; i--) {
      var v = data[i]
      var dt = v.due.split(' ')
      var showdate = dt[0]
      var showtime = dt[1]
      temp.push({ id: v._id, title: v.titlestr, content: v.contentstr, weather: v.weather, location: v.location, date: v.due, showdate: showdate, showtime: showtime})
    }
    return temp
  },
  setViewBound:function()
  {
    var that = this
    that.diaryListView.setBound(Math.min(0, that.windowHeight - that.data.diaryList.length * that.height), 0);
  },
  render: function () {
    this.setData(this.renderData);
    this.renderData = {};
  },
  getRenderData: function () {
    return this.renderData;
  },
  uprefresh: function () {
    var that = this
    that.setData({
      hasMore: true
    })
    if (that.skip < wx.getStorageSync("total"))
    {
      var data = {
        skip: that.skip,
        pagenum: 10,}
      var success = function (res) {
        var data = that.parseData(res.data || [])
        that.setData({
          hasMore: false
        })
        that.data.diaryList.concat(data)
        wx.setStorageSync("alldata", that.data.diaryList)
        that.update()
        that.diaryListView.update(0)
        that.diaryListView.setRefreshY(false)
        util.showTip("加载成功", "success");
      }
      request.requestAllData(data, success)
    }
    else
    {
      function timeoutfunc() {
        that.setData({
          hasMore: false
        })
        that.setViewBound()
        that.diaryListView.update(0)
        that.diaryListView.setRefreshY(false)
        util.showTip("没有更多啦！", "success");
      }
      setTimeout(timeoutfunc, 1500)
    }
    
  },
  
  update:function()
  {
    var that = this
    that.skip = that.data.diaryList.length
    that.setData({
      diaryList: that.data.diaryList
    })
    that.setViewBound()
  },

  onShow: function () {
    var that = this
    var alldata = wx.getStorageSync("alldata")
    if (JSON.stringify(alldata) === '""') {
      var data = {
        skip: 0,
        pagenum: 10,
      }
      var success = function (res) {
        that.data.diaryList = that.parseData(res.data || [])
        wx.setStorageSync("alldata", that.data.diaryList)
        that.update()
      }
      request.requestAllData(data, success)
    } else {
      that.data.diaryList = alldata
      that.update()
    }
  },
  onHide: function () {
    if (this.showState === 1) {
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
    }
  },

  ontouchstart: function (e) {
    this.diaryListView.ontouchstart(e);
    touchData.touchstart(e);
    if (this.showState === 1) {
      this.canNavigate = false
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
      return;
    }
    this.canNavigate = true
    if (touchData.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1;
    }
  },

  ontouchmove: function (e) {

    touchData.touchmove(e);
    if (this.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return;
    }
    //滑动container，只处理垂直方向
    if (e.target.id === 'id-container') {
      this.diaryListView.ontouchmove(e, touchData.deltaY);
      return;
    }
    //已触发垂直滑动
    if (touchData.swipeDirection === 2) {
      this.diaryListView.ontouchmove(e, touchData.deltaY);
      return;
    }
    var moveX = touchData.totalDelateX;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.maxMoveLeft) {
      moveX = -this.maxMoveLeft;
    }
    this.moveX = moveX;
    this.translateXMsgItem(e.target.id, moveX, 0);
  },
  ontouchend: function (e) {
    touchData.touchend(e);
    this.swipeCheckState = 0;
    if (this.touchStartState === 1) {
      this.touchStartState = 0;
      return;
    }
    //滑动container，只处理垂直方向
    if (e.target.id === 'id-container') {
      this.diaryListView.ontouchend(e, touchData.speedY);
      return;
    }
    //垂直滚动
    if (touchData.swipeDirection === 2) {
      this.diaryListView.ontouchend(e, touchData.speedY);
      return;
    }
    if (this.moveX === 0) {
      this.showState = 0;
      return;
    }
    if (this.moveX === this.correctMoveLeft) {
      this.showState = 1;
      this.lastShowMsgId = e.target.id;
      return;
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.correctMoveLeft;
      this.showState = 1;
      this.lastShowMsgId = e.target.id;
    }
    else {
      this.moveX = 0;
      this.showState = 0;
    }
    this.translateXMsgItem(e.target.id, this.moveX, 250);
  },
  translateXMsgItem: function (id, x, duration) {
    if (!id) {
      return
    }
    var animation = wx.createAnimation({ duration: duration });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function (id, animation) {
    var param = {};
    var indexString = 'diaryList[' + id + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  deletetap: function (e) {
    var that = this
    var idx = e.currentTarget.id
    var dt = that.data.diaryList[idx]
    console.log(dt)
    var data = {
      id: dt.id,
    }
    var success = function (res) {
      var total = wx.getStorageSync('total')

      wx.setStorageSync("total", ((total || 0) - 1) > 0 ? (total - 1) : 0)
      that.data.diaryList.splice(parseInt(e.currentTarget.id), 1)
      wx.setStorageSync("alldata", that.data.diaryList)
      that.update()
      that.diaryListView.update(0)
      that.diaryListView.setRefreshY(false)
    }
    request.requestDelete(data, success)
  },
  onviewdetailtap: function (e) {
    if (this.canNavigate) {
      var id = e.currentTarget.id

      var queryBean = JSON.stringify(id)
      wx.navigateTo({ url: "../detail/detail?id=" + queryBean })
    }
    //测试view的位置
    // var query = wx.createSelectorQuery();
    // //选择id
    // var that = this;

    // query.select('.detail').boundingClientRect()
    // query.exec((res) => {
    //   console.log("sdsdsdsdsdsd", res)
    // })
  },
  navBack: function () {
    wx.navigateBack({ url: '../index/index' })
  },
})