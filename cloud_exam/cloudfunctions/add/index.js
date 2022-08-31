// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
    try {
      return await db.collection('teachers').doc(event.id).update({
        data: {
          comment: _.addToSet({
              'name': event.name,
              'avatar': event.avatar,
              'content': event.content,
              'score': event.score,
              '_openid': event.openid,
               'time' : Date.parse(new Date())
            })
        },
        success: e => {
          console.log("更新成功",e)
        },
        fail: e => {
            console.log("更新失败",e)
          }
      })
    } catch (e) {
      console.error("发生异常",e)
    }

}