const app = getApp();
const db = wx.cloud.database();
var teachers = [];
var userAvatar = '';
var openid = '';
Page({
    data: {
        userName: '',
        teaInf: {},
        fullStarUrl: '../../images/fullstar.png',
        nullStarUrl: '../../images/nullstar.png',
        score: 5,
        scoreArray: [1, 2, 3, 4, 5],
        scoreText: ['1星', '2星', '3星', '4星', '5星'],
        scoreContent: '',
        commentContent: '未填写评价！',
        comment: [],
        data: {
            name: '',
            avatar: '',
            comment: '',
            score: '',
            openid: '',
        }
    },

    changeScore: function (e) { //评分
        var that = this;
        var num = 0;
        var touchX = e.touches[0].pageX;
        var starMinX = 90;
        var starWidth = 20;
        var starLen = 10;
        var starMaxX = starWidth * 5 + starLen * 4 + starMinX;
        if (touchX > starMinX && touchX < starMaxX) {
            num = Math.ceil((touchX - starMinX) / (starWidth + starLen));
            if (num != that.data.score) {
                that.setData({
                    score: num,
                    scoreContent: that.data.scoreText[num - 1]
                })
            }
        } else if (touchX < starMinX) {
            that.setData({
                score: 0,
                scoreContent: ''
            })
        }
    },

    submit: function (e) { //提交数据到数据库
        var comments;
        var count = 0;
        wx.showLoading({
            title: '提交中',
        })
        console.log("comment id", this.data.teaInf._id);
        db.collection('teachers').doc(this.data.teaInf._id).get({
            success: e => {
                console.log("需要增加评论的教师：", e.data);
                comments = e.data.comment;
                for (let i = 0; i < comments.length; i++) {
                    count = comments[i].score + count
                }


                wx.cloud.callFunction({ //调用云函数添加数据
                    name: 'add',
                    data: {
                        name: this.data.userName,
                        avatar: wx.getStorageSync('avatarUrl'),
                        content: this.data.commentContent,
                        score: this.data.score,
                        openid: wx.getStorageSync('openid'),
                        count: count
                    },
                    success: e => {
                        console.log("评论回调：", e);
                        wx.hideLoading();
                        wx.navigateTo({
                            url: '../teacher/teacher',
                        })
                    },
                    fail: e => {
                        console.log("评论失败", e)
                    }
                })
                db.collection('userInfo').doc(wx.getStorageSync('userInfo')._id).update({
                    data: {
                        order: {
                            cmstatus: true
                        }

                    }
                })
            }
        })
    },

    back: function () {
        wx.navigateBack({
            delta: 1,
        })
    },

    textareaAInput: function (e) {
        if (e.detail.cursor == 0) {
            this.setData({
                commentContent: '未填写评价，默认好评！',
            })
        } else {
            this.setData({
                commentContent: e.detail.value,
            })
        }
    },

    onLoad: function (e) {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: e => {
                openid = e.result.openid;

            },
            fail: console.error
        })
        db.collection("teachers").get({
            success: res => {
                teachers = res.data; //拿到关于教师数据
                console.log(teachers)
                for (let i = 0; i <= teachers.length; i++) {
                    if (teachers[i]._id == app.globalData.teacher) {
                        this.setData({
                            teaInf: teachers[i], //筛选出选中的教师数据
                        })
                    }
                }
            },
        })
        db.collection("userInfo").get({
            success: res => {
                userAvatar = res.data[0].avatarUrl;
                this.setData({
                    userName: res.data[0].name,
                })
            }
        })

    }
})