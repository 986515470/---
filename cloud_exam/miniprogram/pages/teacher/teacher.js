const app = getApp();
const db = wx.cloud.database();
var id = '';
var teachers = [];
var time = '';
var place = '';
var openid = '';
Page({
    data: {
        favorfill: 'cuIcon-favorfill',
        favor: 'cuIcon-favor',
        modalName: null,
        starArr: [1, 2, 3, 4, 5], //start level
        place: [], //地址
        status: '', //是否预约
        comment: [], //学生评价
        teachers: [], //教师列表
        teaInf: {}, //teacher info
        time: [], //时间
        cmstatus: '', //是否评价
        order: [], //预约信息
        swiperList: [{
            id: 0,
            url: ''
        }, {
            id: 1,
            url: '',
        }, {
            id: 2,
            url: ''
        }],
    },

    addComment: function (res) {
        wx.navigateTo({
            url: '../comment/comment',
        })
    },

    hideModal(e) {
        this.setData({
            modalName: null
        })
    },

    order: function (res) {
        this.setData({
            modalName: 'bottomModal',
        })
    },

    change: function (e) {
        console.log(e)
        time = e.detail.value;
    },

    change2: function (e) {
        console.log(e)
        place = e.detail.value;
    },

    submit: function (e) {
        if ((time && place) == '') {
            console.log('发生错误，请将所有选项选完');
            wx.showModal({
                title: '错误',
                content: '请将所有选项选完',
            })
        } else {
            wx.showLoading({
                title: '提交中',
            })

            wx.cloud.callFunction({
                name: 'template',
                data: {
                    _id: app.globalData.teacher,
                    openid: openid,
                    formid: e.detail.formId,
                    name: this.data.teaInf.name,
                    place: place,
                    time: time,
                    cmstatus: false,
                    status: true
                },
                success: res => {
                    wx.hideLoading();
                    console.log(res);
                    wx.showToast({
                        title: '预约成功',
                        icon: 'success',
                        duration: 2000,
                        mask: true,
                        success: function (res) {
                            wx.switchTab({
                                url: '../me/me',
                            })
                        },
                        fail: function (res) {
                            console.error
                        },
                        complete: function (res) {
                            wx.switchTab({
                                url: '../me/me',
                            })
                        },
                    })
                },
                fail: console.error
            })
            db.collection('userInfo').where({
                _openid: wx.getStorageSync('openid')
            }).update({
                data: {
                    order: {
                        _id: app.globalData.teacher,
                        tea: this.data.teaInf.name,
                        place: place,
                        time: time,
                        status: false
                    }

                }
            })
        }
    },

    scolltolowe: function () {
        wx.showToast({
            title: '已到最后',
        })
    },

    onLoad: function (options) {
        db.collection('userInfo').get({
            success: e => {
                id = e.data[0]._id;
                openid = e.data[0]._openid;
                console.log("onload teacher order", e.data[0].order);
                console.log("app.globalData.teacher", app.globalData.teacher);
                console.log("judge teacher",e.data[0].order._id == app.globalData.teacher);
                if (e.data[0].order._id == app.globalData.teacher) {
                    this.setData({
                        status: e.data[0].order.status,
                        cmstatus: e.data[0].order.cmstatus,
                        order: e.data[0].order
                    })

                }
            }
        })
        console.log("status", this.data.status);
        console.log("&&cmstatus", this.data.cmstatus);
        db.collection('teachers').get({
            success: res => {
                teachers = res.data; //拿到关于教师数据
                console.log("查找教师数据", res.data);
                for (let i = 0; i <= teachers.length; i++) {
                    if (teachers[i]._id == app.globalData.teacher) {
                        this.setData({
                            teaInf: teachers[i], //筛选出选中的教师数据
                        })
                        this.setData({
                            place: teachers[i].place,
                            time: teachers[i].time,
                            swiperList: [{
                                id: 0,
                                url: this.data.teaInf.avatar
                            }, {
                                id: 1,
                                url: this.data.teaInf.avatar
                            }, {
                                id: 2,
                                url: this.data.teaInf.avatar
                            }],
                        })
                    }
                }
            }
        })

        db.collection('teachers').doc(app.globalData.teacher).get({
            success: e => {
                console.log("获取评价", e.data.comment)
                this.setData({
                    comment: e.data.comment
                })
            }
        })

    },
})