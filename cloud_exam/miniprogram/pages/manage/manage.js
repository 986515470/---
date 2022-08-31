const db = wx.cloud.database();
Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    avatarUrl: '',
    userInfo: {},
    userName: 'null',
    userClass: 'null',
    elements: [{
        title: '题库管理', //数据库题目信息展示
        name: 'repo',
        icon: 'question',
        color: 'blue'
      },
      {
        title: '教师管理', //数据库教师信息展示
        name: 'teaMana',
        icon: 'like',
        color: 'red'
      },
      {
        title: '预约信息', //人员预约信息展示
        name: 'ordMana',
        icon: 'copy',
        color: 'cyan'
      },
      {
        title: '人员信息', //数据库人员信息展示
        name: 'peoMana',
        icon: 'settings',
        color: 'pink'
      },
    ]
  },

  onLoad: function(options) {
    let that=this;
    db.collection('userInfo').get({
      success: res => {
        console.log(res)
        that.setData({
          userInfo: res.data[0].userInfo,
          avatarUrl: res.data[0].avatarUrl,
          userName: res.data[0].name,
          userClass: res.data[0]._class,
        })
      }
    })
  },
})