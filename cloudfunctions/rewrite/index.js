// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'jellytest' })

// 云函数入口函数
exports.main = async (event, context) => {
  var id = event.id
  try {
    return await db.collection('diarylist').doc(event.id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        titlestr: event.titlestr,
        contentstr: event.contentstr,
      }
    })
  } catch (e) {
    console.error(e)
  }
}