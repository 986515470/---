// pages/repo/repo.js
const db = wx.cloud.database();

Page({
    /**
     * 组件的属性列表
     */
    data: {
        questions: [],
        inputValue: ''
    },
    bindKeyInput(e) {
        this.setData({
            inputValue: e.detail.value
        })
        console.log(this.data.inputValue);
        if (this.data.inputValue == '') {
            let that = this;
            wx.cloud.callFunction({
                name: "read",
                success(res) {
                    console.log("云函数获取数据成功！", res)
                    console.log("questionBank res", res);
                    that.setData({
                        questions: res.result.data,
                    })
                    console.log("that.data.questions?", that.data.questions);
                },
                fail(res) {
                    console.log("云函数获取数据失败！", res)
                }
            })
        } else {
            let str = this.data.inputValue;
            let that = this;
            db.collection('questionBank').where({
                title: {
                    $regex: '^' + str + '.*',
                }
                // _id:that.data.inputValue
            }).get({
                success: res => {
                    console.log("questionBank res", res);
                    that.setData({
                        questions: res.result.data,
                    })
                    console.log("that.data.questions", that.data.questions);
                }
            })
        }

    },
    revise(e) {
        wx.navigateTo({
            url: '../revise/revise?dataObj=' + encodeURIComponent(JSON.stringify(this.data.questions[e.target.dataset.index])),
        })
    },
    add() {
        wx.navigateTo({
            url: '../revise/revise',
        })
    },
    delect(e) {
        console.log("delect");
        db.collection('questionBank').doc(this.data.questions[e.target.dataset.index]._id).remove({
            success: res => {
                
                let that = this;
                wx.cloud.callFunction({
                    name: "read",
                    success(res) {
                        console.log("云函数获取数据成功！", res)
                        console.log("questionBank res", res);
                        that.setData({
                            questions: res.result.data,
                        })
                        console.log("that.data.questions?", that.data.questions);
                    },
                    fail(res) {
                        console.log("云函数获取数据失败！", res)
                    }
                })
            }
        })
    },
    onLoad() {
        let that = this;
        wx.cloud.callFunction({
            name: "read",
            success(res) {
                console.log("云函数获取数据成功！", res)
                console.log("questionBank res", res);
                that.setData({
                    questions: res.result.data,
                })
                console.log("that.data.questions?", that.data.questions);
            },
            fail(res) {
                console.log("云函数获取数据失败！", res)
            }
        })

    },
    onShow() {
        let that = this;
        wx.cloud.callFunction({
            name: "read",
            success(res) {
                console.log("云函数获取数据成功！", res)
                console.log("questionBank res", res);
                that.setData({
                    questions: res.result.data,
                })
                console.log("that.data.questions?", that.data.questions);
            },
            fail(res) {
                console.log("云函数获取数据失败！", res)
            }
        })
    },

})