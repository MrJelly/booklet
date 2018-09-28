let _compData = {
  '_modal_.showModalStatus': false,// 控制组件显示隐藏
  '_modal_.title': '',
  '_modal_.content': '',
  '_modal_.confirmbtn': '',
  '_modal_.cancelbtn': '',
}
let modalPannel = {
  // toast显示的方法
  showModal: function (data) {
    let self = this;
    self.isModalShow = data.isModalShow,
    this.setData({
      '_modal_.title': data.title,
      '_modal_.content': data.content,
      '_modal_.confirmbtn': data.confirmbtn,
      '_modal_.cancelbtn': data.cancelbtn || '',
      '_modal_.showModalStatus': true,
    });
  },
  hideModal: function () {
    let self = this;
    self.isModalShow = false
    this.setData({
      '_modal_.title': '',
      '_modal_.content': '',
      '_modal_.confirmbtn': '',
      '_modal_.cancelbtn': '',
      '_modal_.showModalStatus': false,
    });
  },
  
  onTapModal: function (e) {
    var self=this
    var index = e.currentTarget.dataset.index
    if(index == 1)
    { 
      if (!self.isModalShow)
      {
        this.hideModal()
      }
    }else
    {
      this.hideModal()
    }
  },
  bindGetUserInfo: function (e)
  {
    let self = this
    self.hideModal()
    if (self.getUserInfo)
    {
      self.getUserInfo(e)
    }
  }
}
function appModal() {
  // 拿到当前页面对象
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  // 小程序最新版把原型链干掉了。。。换种写法
  Object.assign(curPage, modalPannel);
  // 附加到page上，方便访问
  curPage.modalPannel = this;
  // 把组件的数据合并到页面的data对象中
  curPage.setData(_compData);
  return this;
}
module.exports = {
  appModal
}