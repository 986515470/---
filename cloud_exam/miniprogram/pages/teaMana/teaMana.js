// pages/teaMana/teaMana.js
const db = wx.cloud.database();
Page({
    
    /**
     * 组件的初始数据
     */
    data: {
        favorfill: 'cuIcon-favorfill',
        favor: 'cuIcon-favor',
        teachers: [], //教师列表
    },

    scolltolowe: function () {
        wx.showToast({
            title: '已到最后',
        })
    },
    onLoad(options){
        db.collection('teachers').get({
            success: res => {
                this.setData({
                    teachers:res.data
                })
                console.log(this.data.teachers);
            }
        })
    }
})