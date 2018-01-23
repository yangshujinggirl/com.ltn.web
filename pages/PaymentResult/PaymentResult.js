import './PaymentResult.scss';
import '../../common/pages/layout.js';
import '../../common/libs/jquery.marquee.js';
const Accounting = require('accounting');
import {
  UserInfo
} from '../../common/scripts/utils.js';

$(document).ready(function() {
  if(!UserInfo.isLogin){
    window.location.href='/';
  }
  //初始化缓存dom节点信息
  const $payMoney = $('.pay-money');//支付成功金钱
  const $errorMes = $('.error-mes');//支付失败信息展示节点
  const $haveMoney = $('.have-money');//持有金额节点
  //错误信息显示
  const resultMessage = sessionStorage.getItem("resultMessage");
  $errorMes.html(resultMessage);
  //添加金钱分割符号
  $payMoney.html(Accounting.formatMoney($payMoney.html(),{symbol:''})+"<span>元</span>");
  $haveMoney.html(Accounting.formatMoney($haveMoney.html(),{symbol:''})+"元");
  //重新支付
  $('.go-repay').click(function(){
    window.history.back();
  })
  //广播
  $('.broadcast-contain').marquee({
    pauseOnHover: true,
    //speed in milliseconds of the marquee
    duration: 5000,
    //gap in pixels between the tickers
    gap: 0,
    //time in milliseconds before the marquee will start animating
    delayBeforeStart: 0,
    //'left' or 'right'
    direction: 'up',
    //true or false - should the marquee be duplicated to show an effect of continues flow
    duplicated: true,
    startVisible: true
  });
})
