// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'jellytest' })
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await db.collection('diarylist').where({openid:event.userInfo.openId}).count()
  return countResult.total
}