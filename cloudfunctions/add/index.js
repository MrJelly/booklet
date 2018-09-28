// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'jellytest' })

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const addResult = await db.collection('diarylist').add({
      data:{
          openid: event.userInfo.openId,
          due: event.due,
          location: event.location,
          weather: event.weather,
          titlestr: event.titlestr,
          contentstr: event.contentstr,
      }
    })
    const countResult = await db.collection('diarylist').where({
      openid:event.userInfo.openId
    }).count()
    addResult.total = countResult.total
    return addResult
  } catch (e) {
    console.error(e)
  }
}