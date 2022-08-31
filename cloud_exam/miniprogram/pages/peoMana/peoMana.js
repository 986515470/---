// pages/peoMana/peoMana.js
const db = wx.cloud.database();
Page({
    /**
     * 组件的初始数据
     */
    data: {
        people: {

        }
    },
    onLoad(options) {
        db.collection('userInfo').get({
            success: res => {
                this.setData({
                    people: res.data
                })
                console.log(this.data.people);
            }
        })
    }

})