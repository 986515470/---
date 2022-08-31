// pages/revise/revise.js
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
    key: false
  },
  formSubmit: function (res) {
    console.log(res);
    const userValue = res.detail.value;
    if ((userValue.title && userValue.answer && userValue.name1 && userValue.name2 && userValue.name3 && userValue.name4) == '') {
      wx.showModal({
        title: '错误',
        content: '请填写完所有内容！',
      })
    } else {
      wx.showModal({
        title: '确认',
        content: '请确认填写信息是否正确！',
        success: res => {
          if (res.confirm) {
            if (this.data.key) {
              wx.showLoading({
                title: '添加中',
                mask: true,
              })
              db.collection('questionBank').add({
                data: {
                  title: userValue.title,
                  answer: userValue.answer,
                  options: [
                    {
                      "name": userValue.name1,
                      "value":'A'
                    },
                    {
                      "name":userValue.name2,
                      "value":'B'
                    },
                    {
                      "name":userValue.name3,
                      "value":'C'
                    },
                    {
                      "name":userValue.name4,
                      "value":'D'
                    }
                  ]
                }
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
              wx.navigateBack({
                delta: 1,
              })
            } else {
              db.collection('questionBank').where({
                _id: this.data.question._id,
              }).get({
                success: res => {
                  wx.showLoading({
                    title: '更新中',
                    mask: true,
                  })
                  db.collection('questionBank').doc(res.data[0]._id).update({
                    data: {
                      title: userValue.title,
                      answer: userValue.answer,
                      options: [
                        {
                          "name": userValue.name1,
                          "value":'A'
                        },
                        {
                          "name":userValue.name2,
                          "value":'B'
                        },
                        {
                          "name":userValue.name3,
                          "value":'C'
                        },
                        {
                          "name":userValue.name4,
                          "value":'D'
                        }
                      ]
                    }
                  })
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 2000)
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            }

          } else if (res.cancel) {
            return;
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.dataObj) {
      let questions = JSON.parse(decodeURIComponent(options.dataObj)); //解析得到对象 
      this.setData({
        key: false,
        question: questions
      })
      console.log(this.data.question);
      //console.log(this.data.question.title);
      //console.log(this.data.question.options[0].name);
    } else {
      console.log("error");
      this.setData({
        key: true
      })

    }
    console.log(this.data.key);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})