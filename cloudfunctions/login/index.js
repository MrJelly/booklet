// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含
 * - 小程序端调用传入的 data
 * - 经过微信鉴权直接可信的用户唯一标识 openid 
 * 
 */
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'jellytest' })

exports.main = async (event, context) => {
  var openid = event.userInfo.openId
  try {
    await db.collection('userlist').doc(openid).get()
    return { _id: openid}
  } catch (e) {
    try {
      return await db.collection('userlist').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _id: event.userInfo.openId,
          openid: event.userInfo.openId,
          nickName: event.nickName,
          avatarUrl: event.avatarUrl,
          gender: event.gender,
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}