const db = wx.cloud.database();
const app = getApp();
var tag = 0;
var arr = [];
var ansArr = [];
Page({
    data: {
        question: [], //问题列表，一次20道
        tags: 0,  //问题下标 
        answer: '', //答案
        choose: [], //题目选择列表
        ansArr: [], //答案列表

    },

    before: function (e) {
        tag = tag - 1;
        if (tag < 0) {
            wx.showToast({
                title: '已经是第一题！',
                icon: 'none',
                duration: 2000
            })
            tag = 0;
        } else {
            this.setData({
                tags: tag,
            })
        }
    },

    next: function (e) {

        tag = tag + 1;
        if (tag > this.data.question.length - 1) {
            wx.showToast({
                title: '已经是最后一题！',
                icon: 'none',
                duration: 2000
            })
            tag = this.data.question.length - 1
        } else {
            this.setData({
                tags: tag
            })
        }
    },

    choose: function (res) {
        let that=this;
        console.log("ansArr",ansArr);
        arr.splice(that.data.tags, 1, true);
        this.setData({
            choose: arr
        })
        console.log(that.data.choose)

        var index = res.currentTarget.dataset.index; //本次点击的下标
        var touch = res.currentTarget.dataset.value
        that.setData({
            answer: that.data.question[tag].answer,
        })
        
        let mTag = that.data.tags;
        let chooseArr = that.data.question[mTag].options;
        let nowChecked = 'question[' + mTag + '].options'; //setData改变部分数据
        if (chooseArr[index].checked) return; //选择当前已经选择的返回
        chooseArr.forEach(item => { //遍历选项，将其他选项设置为false（单选）
            item.checked = false
        })
        chooseArr[index].checked = true;
        that.setData({
            [nowChecked]: chooseArr,
        })
        console.log(res)
        console.log(that.data.question[mTag].options)

    },

    //放大图片
    showPic: function (e) {
        const src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src]
        })
    },

    onLoad: function (options) {
        // let that = this
        db.collection('questionBank').get({
            success: e => {
                this.setData({
                    question: e.data
                })
                console.log("e.data",e.data);
                for (let i = 0; i < 20; i++) {
                    arr.push(false);
                    ansArr.push(e.data[i].answer)
                }
                console.log("ansArr push",ansArr);
                this.setData({
                    ansArr: ansArr,
                })
            },
            fail: console.error
        })


    },

})