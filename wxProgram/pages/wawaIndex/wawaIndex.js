// pages/wawaIndex/wawaIndex.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWaWaListData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /*
  * 获取娃娃机列表
  */
  getWaWaListData: function () {
    const self = this;
    const tempListData = [];

    wx.request({
      url: 'https://wap.yy.com/mobileweb/doll/wxAppList',
      success: function(data) {
        const result = data.data;
        console.log('娃娃机列表数据', result);
        if (result.code === 0) {
          self.setData({
            listData: result.data.list
          });
        }
      }
    })
  }
})