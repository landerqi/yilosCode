import Util from './util.js';

const api = {};
const domain = '//wap.yy.com'; // test
// get接口
const url = {
  // 抓娃娃首页列表
  getWaWaList: `${domain}/mobileweb/doll/wxAppList`,
  // 充值配置列表
  buyCoinConfig: `${domain}/mobileweb/doll/buyCoinConfig`,
  infos: `${domain}/mobileweb/together/index/championship/infos`,
  freshmanGift: `${domain}/mobileweb/doll/freshmanGift`,
  freshmanGiftTake: `${domain}/mobileweb/doll/freshmanGiftTake`,
};

// get接口
const urlPost = {
  // 支付下单接口
  minaPaySrv: `${domain}/mobileweb/doll/minaPaySrv`,
};

Object.keys(url).forEach((k) => {
  api[k] = function (args) {
    return $.ajax({
      url: url[k],
      jsonp: 'jsonpcb',
      dataType: 'jsonp',
      data: args,
    });
  };
});

// post请求
Object.keys(urlPost).forEach((k) => {
  api[k] = function (args) {
    return $.ajax({
      url: urlPost[k],
      type: 'post',
      dataType: 'json',
      data: args,
    });
  };
});

module.exports = api;