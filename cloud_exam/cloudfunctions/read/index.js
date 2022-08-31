// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    traceUser: true,
    // env: 'cloud1-4gsi3t205838b899'，
    env: 'shop-8gckt7u0462abcd2'
})


// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("questionBank").get();
}