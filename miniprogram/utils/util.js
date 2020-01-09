const formatDate = (onlyMonth,year,month,day)=> {
  if(!year&&!month&&!day)
  {
    let date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return onlyMonth ? [year, month].map(formatNumber).join("-") : [year, month, day].map(formatNumber).join("-")
  }else{
    return onlyMonth ? [year, month].map(formatNumber).join("-") : [year, month, day].map(formatNumber).join("-")
  }
}
function getWeekStr(week)
{
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
  return str
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

function isFunction(obj) {
  return typeof obj === 'function';
}


module.exports = {
  formatDate: formatDate,
  px2rpx: px2rpx,
  rpx2px: rpx2px,
  showTip: showTip,
  showModal: showModal,
  isFunction: isFunction,
  formatNumber: formatNumber,
  getWeekStr: getWeekStr,
}
