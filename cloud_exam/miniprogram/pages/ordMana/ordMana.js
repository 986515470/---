// pages/ordMana/ordMana.js
const db = wx.cloud.database();
Page({


    /**
     * 
     * 组件的初始数据
     */
    data: {
        datas: []
    },
    onLoad(options) {
        let that = this;
        db.collection('userInfo').get({
            success: res => {
                let datas = res.data;
                console.log("datas", datas);
                that.setData({
                    datas: datas
                })
                console.log("this.datas", that.datas);
            },
            fail: res => {
                console.log(res);
            }
        })

    }

})