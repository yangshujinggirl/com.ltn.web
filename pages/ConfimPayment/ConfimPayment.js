import Cookies from 'js-cookie';
import './ConfimPayment.scss';
import '../../common/pages/layout.js';
import '../../common/libs/jquery.marquee.js';
import icon from './imgs/gou.png';
import {
  UserInfo,
  goLogin
} from '../../common/scripts/utils.js';
const Accounting = require('accounting');
let ticketId = 0;
let presentCode = "";
let birdCoinDeductions = 0;
let realPay = "0";
$(document).ready(function() {
  //获取初始dom节点
  const $fxTicket = $('.ticket-list-contain .fx-ticket');//返现券容器节点
  const $topTitle = $('.top-title');//首页标题节点
  const $haveMoney = $('.invest-money');//持有金额节点
  const $preIncome = $('.pre-income');//持有金额节点
  const $jxTicket = $('.ticket-list-contain .jx-ticket');//加息券容器节点
  const $broadcast = $('.broadcast-contain');//广播位置节点
  const $ticketDisplay = $('.ticket-display-contain');//券整体容器节点
  const $birdCoin = $('.result-total .bird-coin');//鸟币抵扣容器节点
  const $birdCoinCheck = $('.bird-icon-check');//鸟币抵扣选择节点
  const $fxChild = $(".ticket-list-contain .fx-ticket");//返现券子容器节点
  const $ticketNoData = $(".ticket-list-contain .no-data");//券无数据占位符容器节点
  const $excBtn = $('.exc-contain button');//兑换券按钮节点
  const $excInput = $('.exc-contain input');//兑换券输入框节点
  const $excErrMes = $('.exchange-ticket .describe-text .err-mes');//兑换券错误信息展示节点
  const $exchangeContain = $('.exchange-ticket .exchange-input-contain');//券兑换容器节点
  const $exchangeResult = $('.exchange-ticket .exc-ticket-result-contain');//券兑换结果容器节点
  const $ticketResultDom = $('.result-total .ticket');//券选择结果节点
  const $topSpan = $('.ticket-content-wrap .top-tt span');//券容器切换节点
  const $topTicSpan = $('.ticket-list-contain div[name="ticket-contain"]');//返现券及加息券容器节点
  const $startTime = $('.invest-start-time');//标的投资起始时间节点
  const $resultpay = $('.result-total .result-pay');//实际支付金额节点
  const $investMoney = $topTitle.attr('investMoney');//投资金额
  let birdIconState = 1;//鸟币抵扣状态 0:不使用鸟币，1:使用鸟币抵扣
  //初始化金钱格式
  $haveMoney.html(Accounting.formatMoney($investMoney,{symbol:''})+"元");
  $preIncome.html(Accounting.formatMoney($preIncome.html(),{symbol:''})+"元");
  //广播
  $broadcast.marquee({
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

  //初始化显示详情
  if($topTitle.attr('couponTag')=="1"){
    $ticketDisplay.fadeIn();
  }
  if($topTitle.attr('birdCoinTag')=="1"&&birdIconState==1){
    $birdCoinCheck.fadeIn();
    $birdCoin.fadeIn();
  }

  //切换鸟币抵扣状态
  $birdCoinCheck.find('input').click(function(){
    if(birdIconState == 1){
      birdIconState = 0;
      $birdCoin.hide();
      realPay = $investMoney;
      $resultpay.html("¥"+realPay);
    } else{
      birdIconState = 1;
      realPay = $investMoney-birdCoinDeductions;
      $resultpay.html("¥"+realPay);
      $birdCoin.fadeIn();
    }
  })

  //获取个人卡券鸟币等信息
  $.ajax({
    url: 'http://192.168.18.196:8082/user/userInfo',
    type: 'POST',
    data: {
      clientType: "PC",
      sessionKey: UserInfo.sessionKey,
      productId:$topTitle.attr('productId')
    },
    success: function(datas) {
      if(datas.resultCode=="0"){
        const data = datas.data;
        if($topTitle.attr('birdCoinTag')=="1"){
          if(data.birdCoin<Math.floor($investMoney/50)){
            birdCoinDeductions = data.birdCoin;
            if(birdIconState == 1){
              realPay = $investMoney-birdCoinDeductions;
            } else{
              realPay = $investMoney;
            }
          } else{
            birdCoinDeductions = Math.floor($investMoney/50);
            if(birdIconState == 1){
              realPay = $investMoney-birdCoinDeductions;
            } else{
              realPay = $investMoney;
            }
          }
        } else{
          realPay = $investMoney;
        }
        $birdCoin.empty();
        $birdCoin.html('鸟币抵扣：');
        $birdCoin.append("<small>"+birdCoinDeductions+"元</small>");
        $resultpay.html("¥"+realPay);
        // 接口异常
        data.coupons.forEach(function(val,index){
          if(val.activityType =="TZFX" && val.limitAmount<=$investMoney){
            $fxTicket.append("<li class='ticket-check' ticketId="+val.id+" limitAmount="+val.limitAmount+" amount="+val.amount+'元'+" ticketType='返现券：'><p>"+val.amount+"<span>元返现券</span></p><p>（"+val.couponDate+"前使用）</p><img src="+icon+" /></li>");
          }else if (val.activityType=="JXQ" && val.limitAmount<=$investMoney) {
            $jxTicket.append("<li class='ticket-check' ticketId="+val.id+" limitAmount="+val.limitAmount+" amount="+'加'+val.amount+'%'+" ticketType='加息券：'><p>"+val.amount+"%<span>加息券</span></p><p>（"+val.couponDate+"前使用）</p><img src="+icon+" /></li>");
          }else if (val.activityType=="TYDK") {
            $fxTicket.append("<li class='ticket-check' ticketId="+val.id+" limitAmount="+val.limitAmount+" amount="+val.amount+'元'+" ticketType='体验金券：'><p>"+val.amount+"<span>元体验金券</span></p><p>（"+val.couponDate+"前使用）</p><img src="+icon+" /></li>");
          }
        })
        if($fxChild.children().length==0){
          $ticketNoData.fadeIn();
        }
      } else{
        Cookies.remove('ltn_user');
        window.location.href='/';
      }
    },
    error: function(error) {
      alert("服务器异常，请稍后再试");//TODO 信息错误
    }
  });

  //输入券码校验
  $excInput.keyup(function(){
    var value = $(this).val();
    if(value==''){
      $excErrMes.html('');
    }
  });
  //兑换理财券
  $excBtn.click(function(){
    var value = $(this).prev().val();
    if(value){
      $.ajax({
        url: 'http://192.168.18.196:8082/pc/presentCoupon/couponInfo/get',
        type: 'POST',
        data: {
          clientType: "PC",
          sessionKey: UserInfo.sessionKey,
          presentCode:value
        },
        success: function(datas) {
          if(datas.resultCode=="0"){
            const data = datas.data.coupon;
            if(data.limitAmount>$investMoney){
              $excErrMes.html(`兑换失败，该理财金券需要满${data.limitAmount}元才能兑换使用！`);
            }else{
              $excErrMes.html('');
              $exchangeContain.hide();
              if(data.activityType=="TZFX"){
                $exchangeResult.append("<li class='ticket-check' ticketId="+value+" limitAmount="+data.limitAmount+" amount="+data.amount+'元'+" ticketType='返现券：'><p>"+data.amount+"<span>元返现券</span></p><p>（"+data.couponDate+"前使用）</p><img src="+icon+" /></li>");
              } else {
                $exchangeResult.append("<li class='ticket-check' ticketId="+value+" limitAmount="+data.limitAmount+" amount="+'加'+data.amount+'%'+" ticketType='加息券：'><p>"+data.amount+"%<span>加息券</span></p><p>（"+data.couponDate+"前使用）</p><img src="+icon+" /></li>");
              }
              $('.ticket-check').find('img').hide();
              $('.ticket-check').css('border','1px solid #e2e2e2');
              $('.exc-ticket-result-contain .ticket-check').css('border','1px solid #f60');
              $('.exc-ticket-result-contain .ticket-check').children().last().fadeIn();
              presentCode = $('.exc-ticket-result-contain .ticket-check').attr('ticketId');
              ticketId = 0;
              $exchangeResult.fadeIn();
              $ticketResultDom.empty();
              $ticketResultDom.html((data.activityType=="TZFX")?"返现券：":"加息券：");
              $ticketResultDom.append("<small>"+((data.activityType=="TZFX")?data.amount+'元':'加'+data.amount+'%')+"(投资"+data.limitAmount+"元可使用)</small>");
            }
          } else if (datas.resultCode=="800002") {
            goLogin(window.location.href);
          } else{
            $excErrMes.html(datas.resultMessage);
          }
        },
        error: function(error) {
          $excErrMes.html(error.resultMessage);
        }
      })
    }
  });

  //选择要使用的券
  $('.ticket-list-contain').on('click','.ticket-check',function(){
    const status = $(this).children().last().css('display');
    if(status == "none"){//选取
      ticketId = $(this).attr('ticketId');
      presentCode = '';
      if($(this).parent().attr('class') !=="exc-ticket-result-contain"){
        $exchangeResult.empty();
        $exchangeResult.hide();
        $exchangeContain.fadeIn();
      }
      $('.ticket-check').find('img').hide();
      $('.ticket-check').css('border','1px solid #e2e2e2');
      $(this).css('border','1px solid #f60');
      $(this).children().last().fadeIn();
      $ticketResultDom.empty();
      $ticketResultDom.html($(this).attr('ticketType'));
      $ticketResultDom.append("<small>"+$(this).attr('amount')+"(投资"+$(this).attr('limitAmount')+"元可使用)</small>");
    }else{//取消选取
      ticketId = 0;
      $exchangeResult.empty();
      $exchangeResult.hide();
      $exchangeContain.fadeIn();
      $('.ticket-check').find('img').hide();
      $(this).css('border','1px solid #e2e2e2');
      $ticketResultDom.empty();
    }
  });

  //下单接口
  $('.content-contain-wrap .btn-confirm-submit').click(function(){
    if(birdIconState == 0){
      birdCoinDeductions = 0;
    }
    $.ajax({
      url: 'http://192.168.18.196:8082/product/buy/confirm',
      type: 'POST',
      data: {
        clientType: "PC",
        sessionKey: UserInfo.sessionKey,
        productId:$topTitle.attr('productId'),
        orderAmount:$investMoney,
        userCouponId:ticketId,
        presentCode:presentCode,
        birdCoin:birdCoinDeductions
      },
      success: function(data){
        if(data.resultCode=='0'){
          window.location.replace("/finance/pay/success/"+$topTitle.attr('productId')+"/"+$investMoney+'/'+realPay);
        } else{
          sessionStorage.setItem("resultMessage", data.resultMessage);
          window.location.replace("/finance/pay/defeat/"+$topTitle.attr('productId')+"/"+$investMoney+'/'+realPay);
        }
      },
      error: function(error) {
        alert("服务器异常");
        console.log(error);
      }
    })
  });

  //切换卡券选择种类展示
  $topSpan.click(function(){
    var forClass = $(this).attr('for');
    $topSpan.removeClass('active');
    $(this).addClass('active');
    $topTicSpan.hide();
    $('.ticket-list-contain .'+forClass).fadeIn();
    if($(".ticket-list-contain ."+forClass).children().length==0){
      $ticketNoData.fadeIn();
    } else{
      $ticketNoData.hide();
    }
  })
})
