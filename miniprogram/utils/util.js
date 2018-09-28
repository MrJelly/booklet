const amapFile = require('./amap-wx.js')
const formatTime = (ishour,date)=> {
  date = date || new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const week = date.getDay();
  var str = ''
  if (week == 0) {
    str = "星期日";
  } else if (week == 1) {
    str = "星期一";
  } else if (week == 2) {
    str = "星期二";
  } else if (week == 3) {
    str = "星期三";
  } else if (week == 4) {
    str = "星期四";
  } else if (week == 5) {
    str = "星期五";
  } else if (week == 6) {
    str = "星期六";
  } 
  if (ishour)
  {
    return year + '年' + month + '月' + day + '日' + ' ' + [hour, minute, second].map(formatNumber).join(':') +' / ' + str
  }else{
    return year + '年' + month + '月' + day + '日' + ' / ' + str
  }
  
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':') + ' ' + str
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function px2rpx(px, windowWidth) {
  return px * 750 / windowWidth;
}

function rpx2px(rpx, windowWidth) {
  return rpx / 750 * windowWidth
}

function showTip(sms, icon, fun, t) {
  if (!t) {
    t = 500;
  }
  wx.showToast({
    title: sms,
    icon: icon,
    duration: t,
    success: fun
  })
}

function showModal(t, c, fun,showCancel) {
  wx.showModal({
    title: t,
    content: c,
    showCancel: showCancel || false,
    success: fun
  })
}
function getWeather(cb)
{
  var myAmapFun = new amapFile.AMapWX({ key: 'af75e9dc4e4c13d2451e1f64dddeded1' });
  myAmapFun.getWeather({
    success: function (data) {
      wx.setStorageSync("weather", data)
      cb(data)
    },
    fail: function (info) {
    }
  })
}

function getLocation(cb)
{
  var myAmapFun = new amapFile.AMapWX({ key: 'af75e9dc4e4c13d2451e1f64dddeded1' });
  myAmapFun.getRegeo({
    success: function (data) {
      var l = data[0].name + '(' + data[0].desc +')'
      wx.setStorageSync("location", l)
      cb(l)
    },
    fail: function (info) {
    }
  })
}

function isFunction(obj) {
  return typeof obj === 'function';
}


module.exports = {
  formatTime: formatTime,
  px2rpx: px2rpx,
  rpx2px: rpx2px,
  showTip: showTip,
  showModal: showModal,
  getWeather: getWeather,
  getLocation: getLocation,
  isFunction: isFunction,
}
