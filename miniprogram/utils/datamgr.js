
const outcomesort = {0:{ icon: "icon-canyin", text: "餐饮" }, 1:{ icon: "icon-jiaotong", text: "交通" }, 2:{ icon: "icon-juzhu", text: "居住" }, 3:{ icon: "icon-yiliao", text: "医疗" }, 4:{ icon: "icon-jiaoyu", text: "教育" }, 5:{ icon: "icon-yule", text: "娱乐" }, 6:{ icon: "icon-jiaoji", text: "交际" }, 7:{ icon: "icon-gouwu", text: "购物" }, 8:{ icon: "icon-tongxun", text: "通讯" }, 9:{ icon: "icon-lvxing", text: "旅行" }, 10:{ icon: "icon-zhangbei", text: "长辈" }, 11:{ icon: "icon-haizi", text: "孩子" }, 12:{ icon: "icon-jianshen", text: "健身" }, 13:{ icon: "icon-chongwu", text: "宠物" }, 14:{ icon: "icon-weixiu", text: "维修" }, 15:{ icon: "icon-qiche", text: "汽车" }, 16:{ icon: "icon-juanzeng", text: "捐赠" }, 17:{ icon: "icon-bangong", text: "办公" }, 18:{ icon: "icon-renqing", text: "人情" }, 19:{ icon: "icon-qita", text: "其他" }}

const incomesort = { 0:{ icon: "icon-gongzi", text: "工资" }, 1:{ icon: "icon-baoxiao", text: "报销" }, 2:{ icon: "icon-jiangjin", text: "奖金" }, 3:{ icon: "icon-licai", text: "理财" }, 4:{ icon: "icon-jiekuan", text: "借款" }, 5:{ icon: "icon-hongbao", text: "收红包" }, 6:{ icon: "icon-touzi", text: "投资" }, 7:{ icon: "icon-shenghuofei", text: "生活费" }, 8:{ icon: "icon-jianzhi", text: "兼职" }, 9:{ icon: "icon-qita", text: "其他" }}
function getTally()
{
  return wx.getStorageSync('tallydata') || []
}

function getTallyByIndex(index)
{
  let arr = getTally()
  return arr[index]
}

function setTally(dt)
{
  let arr = getTally()
  {
    let index = -1
    let min=!1
    for (let i = 0, l = arr.length; i < l; i++) {
      let val = arr[i]
      index = index + 1
      if (val.time < dt.time) {
        min=!0
        break
      }
    }
    if(index == -1) arr.unshift(dt)
    else { (!min)?arr.push(dt):arr.splice(index, 0, dt)}
  }
  wx.setStorageSync('tallydata', arr)
}
function deleteTallyByIndex(index)
{
  var tallydata = getTally()
  tallydata.splice(index,1)
  wx.setStorageSync('tallydata', tallydata)
}
function editTallyByIndex(index,data)
{
  var tallydata = getTally()
  tallydata.splice(index, 1)
  wx.setStorageSync('tallydata', tallydata)
  setTally(data)
}
function getComeByMonth(year,month)
{
  var start= new Date(year,month-1,1).valueOf(),end = new Date(year, month, 1).valueOf()
  let hv = !1
  let tmp = []
  let arr = getTally()
  for (let i=0,l=arr.length;i<l;i++)
  {
    let val = arr[i]
    if (val.time>=start && val.time<end)
    {
      hv=!0
      val.index = i
      tmp.push(val)
    }else
    {
      if (hv)
      {
        break
      }
    }
  }
  return tmp
}

function getComeByMonthandType(year, month, comeType)
{
  let tmp = []
  let arr = getComeByMonth(year, month)
  for (let i = 0, val; val = arr[i++];) {
    val.comeType == comeType&&tmp.push(val)
  }
  return tmp
}


function uniq(array) {

  var temp = {}; //一个新的临时数组
  temp.data = []
  var total=0;
  let l = array.length, i, j
  for (i = 0; i < l; i++) {
    let val = array[i]
    total += val.num
    let hv = !1
    for (j = 0; j < temp.data.length; j++) {
      let tmpVal = temp.data[j]
      if (tmpVal.sortindex == val.sortindex) {
        hv = !0
        temp.data[j].num = tmpVal.num + val.num
      }
    }
    if (!hv) temp.data.push(val);

  }
  temp.total = total
  return temp;
}
function mergeYearCome(year, comeType)
{
  var start = new Date(year, 0, 1).getTime(), end = new Date(Number(year)+1, 0, 1).getTime()
  let m = [], n = [], o = !1,i=0,j=0,total=0
  let arr = getTally()
  for (let l = arr.length; i < l; i++) {
    let dt = arr[i]
    if (dt.time < start || dt.time >= end || dt.comeType != comeType) {continue}
    let dtn = arr[i + 1]
    if (o) { o.num = o.num + dt.num } else o = deepClone(dt)
    if (dtn && dt.month != dtn.month) {
      m.push(o)
      o = !1
    }
    /*获取每个月的数据和*/
    let hv = !1
    for (j=0; j < n.length; j++) {
      let tmpVal = n[j]
      if (tmpVal.sortindex == dt.sortindex) {
        hv = !0
        n[j].num = tmpVal.num + dt.num
      }
    }
    if (!hv) n.push(dt);
    /*获取每个分类的数据和*/
    total += dt.num
    /*获取每个分类的数据和*/
  }
  o && m.push(o)
  n=n.sort(function (a, b) { return b.num - a.num })
  return { chartData: m, rankData:n,total:total}
}
function mergeMonthCome(year, month, comeType)
{
  var array = getComeByMonthandType(year, month, comeType)
  let m = [], n = [], o = !1, i = 0, j = 0, total = 0,l=array.length
  for (; i < l; i++) {
    let dt = array[i]
    let dtn = array[i + 1]
    if (o) { o.num = o.num + dt.num } else o=deepClone(dt)
    if (dtn && dt.day != dtn.day) {
      m.push(o)
      o=!1
    }
    /*获取每天的数据和*/
    let hv = !1
    for (j=0; j < n.length; j++) {
      let tmpVal = n[j]
      if (tmpVal.sortindex == dt.sortindex) {
        hv = !0
        n[j].num = tmpVal.num + dt.num
      }
    }
    if (!hv) n.push(dt);
    /*获取每个分类的数据和*/
    total += dt.num
    /*获取当月数据和*/
  }
  o && m.push(o)
  n = n.sort(function (a, b) { return b.num - a.num })
  return { chartData: m, rankData: n, total: total }
}

function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    var key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}  


function findArray(array, feature, all = true) {
  for (let index in array) {
    let cur = array[index];
    if (feature instanceof Object) {
      let allRight = true;
      for (let key in feature) {
        let value = feature[key];
        if (cur[key] == value && !all) return index;
        if (all && cur[key] != value) {
          allRight = false;
          break;
        }
      }
      if (allRight) return index;
    } else {
      if (cur == feature) {
        return index;
      }
    }
  }
  return -1;
}
// index 唯一id 用于删除  编辑 查找
// year 
// month
// day
// time
// sortindex 分类id
// comeType 支出 收入  类别
// num  
// remark 备注

module.exports = { 
  outcomesort: outcomesort, 
  incomesort: incomesort,
  getTallyByIndex: getTallyByIndex,
  setTally: setTally,
  getComeByMonth: getComeByMonth,
  deleteTallyByIndex: deleteTallyByIndex,
  mergeYearCome: mergeYearCome,
  mergeMonthCome: mergeMonthCome,
  editTallyByIndex: editTallyByIndex,
  };
