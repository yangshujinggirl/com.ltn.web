import Cookies from 'js-cookie';
import './FinanceDetail.scss';
import '../../common/pages/layout.js';
import '../../common/libs/jquery.marquee.js';
import {
  UserInfo,
  goLogin,
  page
} from '../../common/scripts/utils.js';
const Accounting = require('accounting');
const backUrl = window.location.href;
let goUrl = '';
let userAccount = 0;

const $pageNavigation = $('.page-navigation');//分页节点
const $isHistoryList = $('.history-list-il');//登录后购买记录节点
const $noHistoryList = $('.history-list-nl');//未登录购买记录节点
const $nodataHistoryList = $('.history-list-no-data');//购买记录w无数据节点

$(document).ready(function() {
  //获取初始化dom节点
  const $broadcast = $('.broadcast-contain');//广播信息内容节点
  const $islogin = $('.right-contain.is-login');//登录显示区域节点
  const $nologin = $('.right-contain.no-login');//未登录区域显示节点
  const $notCanBuy = $('.right-contain.can-not-buy');//不可购买节点
  const $inputMoney = $('#input-money');//输入金额input节点
  const $preIncome = $('#pre-income');//预收益节点
  const $remainMoney = $('.remain-money');//起投节点
  const $totalMoney = $('.total-money');//项目总金额节点
  const $canInvest = $('.can-invest');//可投金额节点
  const $loginCanInvest = $('.login-can-invest');//登录后可投金额节点
  const $topLine = $('.product-info-contain .top-line');//标的头部信息节点
  const $toastInfo = $('.toast-info');//错误信息展示节点
  const $goRecharge = $('.go-recharge');//去充值按钮节点
  const $goLogin = $('.go_login');//去登录按钮节点
  const rate = $('.rate .spe-color').html();//标的预期收益率
  const $accountMoney = $('#account-money');//账户余额节点
  const $instantlySubmit = $('.bottom-contain-absolute .instantly-submit');//立即投资按钮节点
  const $navSpan = $('.nav-title span');//详情切换按钮节点
  const $instructionContain = $('.page-content div[name="item"]');//详情内容容器节点
  const $modalShadow = $('.modal-shadow');//弹层阴影节点
  const $modal = $('.modal-contain-wrap');//弹层节点
  const $modalText = $('.modal-contain .text');//弹层文案节点
  const $modalBtn = $('.modal-contain .btn');//弹层按钮节点
  const $modalClose = $('.modal-contain .close');//关闭弹层按钮节点
  //添加金钱分割符号
  $remainMoney.html(Accounting.formatMoney($remainMoney.html(),{symbol:''}));
  $totalMoney.html(Accounting.formatMoney($totalMoney.html(),{symbol:''}));
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
  //后退清除input值
  if($inputMoney.val()!=='') {
    $inputMoney.val('');
  }

  //产品详情
  $.ajax({
    url: 'http://192.168.18.196:8082/product/productDetail',
    type: 'POST',
    data: {
      clientType: "PC",
      id: $topLine.attr('productId')
    },
    success: function(data){
      if(data.resultCode=="0"){
        const invest = data.data.pcProductDetail.productRemainAmount;
        $canInvest.html(Accounting.formatMoney(invest,{symbol:''})+'元');
        $loginCanInvest.html(Accounting.formatMoney(invest,{symbol:''})+'元');
      }
    },
    error: function(error) {
      console.log(error);
    }
  });

    // 触发侧边条
    $('.slidebar-wrap .wrap').bind('click',function(){
      $('#udesk_btn a').trigger('click');
    })
    slidebarControoler();
    
  //用户登录与否显示模块
  if(UserInfo.isLogin){
    //用户购买产品权限信息
    $.ajax({
      url: 'http://192.168.18.196:8082/user/userIsBuyProduct',
      type: 'POST',
      data: {
        clientType: "PC",
        sessionKey: UserInfo.sessionKey
      },
      success: function(data){
        if(data.resultCode=='0'){
          if(($topLine.attr('productType')=='TYB' && data.data.isCanBuyTYB == 0)||($topLine.attr('productType')=='XSB' && data.data.isCanBuyXSB == 0)){
            $notCanBuy.fadeIn();
          } else{
            $islogin.fadeIn();
          }
        } else{
          Cookies.remove('ltn_user');
          window.location.reload();
        }
      },
      error: function(error) {
        $nologin.fadeIn();
        alert("服务器异常");
        console.log(error);
      }
    });

    //用户账户信息
    $.ajax({
      url: 'http://192.168.18.196:8082/user/userInfo',
      type: 'POST',
      data: {
        clientType: "PC",
        sessionKey: UserInfo.sessionKey
      },
      success: function(datas) {
        const data = datas.data;
        if(datas.resultCode=="0"){
          userAccount = data.usableBalance;
          $accountMoney.html(userAccount+'元');
        } else{
          console.log(datas.resultMessage);//TODO
        }
      },
      error: function(error) {
        alert("/user/userInfo服务器异常，请稍后再试");//TODO 信息错误
      }
    });

    //获取用户购买记录
    getPurchaseHistory();
  } else {
    $nologin.fadeIn();
    $noHistoryList.fadeIn();
  }

  //输入投资金额事件处理
  $inputMoney.keyup(function() {
    //验证输入的值（只能是小于等于9位的正整数）
    let money = $(this).val();
    if(money.length==1){
      $(this).val(money.replace(/[^1-9]/g,''));
    } else {
      if(money.length>9){
        money = money.slice(0,9);
      }
      $(this).val(money.replace(/\D/g,''));
    }

    //预期年化收益率
    let rate = $(this).attr("rateData");
    //投资期限
    const date = $(this).attr("convertDay");
    //预期收益金额
    const income = ($(this).val()*rate/365*date).toFixed(2);
    $preIncome.html(income+'元');
    //剩余投资金额
    const remainAmount = parseInt($(this).attr("remainAmount"));
    //起投金额
    const startInvest = parseInt($(this).attr("startInvest"));
    //单笔限额
    const singleLimitAmount = parseInt($(this).attr("singleLimitAmount"));
    //输入金额
    const value = parseInt($(this).val()==''?0:$(this).val());
    //非最后一笔投资（最后一笔投资金额可以小于起投金额）
    if(remainAmount>=startInvest){
      //投资金额大于剩余投资金额
      if (value>remainAmount){
        $toastInfo.html('剩余投资金额为'+remainAmount+'元');
        $toastInfo.css('display','block');
        $goRecharge.css('display','none');
        $instantlySubmit.addClass('disabled');
      //投资金额小于起投金额
      } else if (value<startInvest) {
        $toastInfo.html('起投金额为'+startInvest+'元');
        $toastInfo.css('display','block');
        $goRecharge.css('display','none');
        $instantlySubmit.addClass('disabled');
      } else {
        //单笔投资不限额
        if(singleLimitAmount==0){
          if(value>userAccount){
            $goRecharge.css('display','block');
            $toastInfo.css('display','none');
            $instantlySubmit.addClass('disabled');
          }else{
            $toastInfo.css('display','none');
            $goRecharge.css('display','none');
            $instantlySubmit.removeClass('disabled');
          }
        }else{
          //单笔投资大于限额
          if(value>parseInt(singleLimitAmount)){
            $toastInfo.html('单笔投资限额为'+singleLimitAmount+'元');
            $toastInfo.css('display','block');
            $instantlySubmit.addClass('disabled');
          }else{
            //账户余额不足
            if(value>userAccount){
              $goRecharge.css('display','block');
              $toastInfo.css('display','none');
              $instantlySubmit.addClass('disabled');
            //正常流程投资按钮可点击
            }else{
              $toastInfo.css('display','none');
              $goRecharge.css('display','none');
              $instantlySubmit.removeClass('disabled');
            }
          }
        }
      }
    //标的最后一笔投资
    } else{
      //最后一笔投资金额投资限制为剩余金额
      if(value!==remainAmount){
        $toastInfo.html('当前只能投资'+remainAmount+'元');
        $toastInfo.css('display','block');
        $goRecharge.css('display','none');
        $instantlySubmit.addClass('disabled');
      }else{
        //账户余额不足
        if(value>userAccount){
          $goRecharge.css('display','block');
          $instantlySubmit.addClass('disabled');
        //正常流程投资按钮可点击
        }else{
          $toastInfo.css('display','none');
          $instantlySubmit.removeClass('disabled');
        }
      }
    }
  });

  //立即投资按钮触发
  $instantlySubmit.click(function(){
    const isDisabled = $(this).hasClass('disabled');
    if(!isDisabled){
      if($topLine.attr('productType')=='TYB'){
        window.location.href="/finance/confirm/1/60000";
      } else{
        $.ajax({
          url: 'http://192.168.18.196:8082/get/person/data.json',
          type: 'GET',
          data: {
            clientType: "PC",
            sessionKey: UserInfo.sessionKey
          },
          success: function(datas) {
            const data = datas.data;
            if(datas.resultCode=="0"){
              if(data.nameAuthStatus=='0'){
                //去实名
                goUrl = '/account/#/user/depostReal';
                $modalShadow.fadeIn();
                $modal.fadeIn();
              }else if (data.pwdAuthStatus=='0') {
                //设置交易密码
                goUrl = '/account/#/user/depostPsd';
                $modalShadow.fadeIn();
                $modal.fadeIn();
              }else if (data.bankAuthStatus=='0') {
                //去绑卡
                goUrl = '/account/#/user/depostCard';
                $modalText.html="您当前还未绑卡，请去绑定银行卡！";
                $modalBtn.html="立即绑定银行卡";
                $modalShadow.fadeIn();
                $modal.fadeIn();
              }else{
                const invest = $inputMoney.val();
                window.location.href="/finance/confirm/"+$topLine.attr('productId')+"/"+invest;
              }
            } else{
              console.log(datas.resultMessage);//TODO
            }
          },
          error: function(error) {
            alert("/get/person/data.json服务器异常，请稍后再试");//TODO 信息错误
          }
        });
      }
    }
  });

  //登录
  $goLogin.click(function(){
    goLogin(backUrl);
  });

  //关闭弹框
  $modalClose.click(function(){
    $modalShadow.hide();
    $modal.hide();
  });

  //弹框确认回调函数
  $modalBtn.click(function(){
    window.location.href=goUrl+"?backUrl="+backUrl;
  });

  //切换详情tab选择种类展示
  $navSpan.click(function(){
    var forClass = $(this).attr('for');
    $navSpan.removeClass('active');
    $(this).addClass('active');
    $instructionContain.hide();
    $('.'+forClass).fadeIn();
  })

  $('.page-navigation').on('click','.page-navigation-item',function(){
    const page = $(this).attr('page-id');
    getPurchaseHistory(parseInt(page));
  });
});

//详情购买记录分页
function getPurchaseHistory(currentPage=0,pageSize=10){
  //获取投资记录信息
  $.ajax({
    url: 'http://192.168.18.196:8082/product/purchasehistory',
    type: 'POST',
    data: {
      clientType: "PC",
      currentPage,
      pageSize,
      productId:$('.product-info-contain .top-line').attr('productId'),
      sessionKey: UserInfo.sessionKey
    },
    success: function(datas) {
      const data = datas.data;
      if(datas.resultCode=='0'){
        $noHistoryList.hide();
        if(data.purchaseHistoryList.length>0){
          $('.list-content').html('');
          data.purchaseHistoryList.forEach(function(val,index){
            $('.list-content').append(`<li><span>${index+1}</span><span>${val.orderDate}</span><span>${val.userName}</span></span><span>${val.orderAmount}</span></li>`);
          });
          $isHistoryList.fadeIn();
          const totalPage = Math.ceil(data.totalCount / pageSize);
          const pageNumArray = page(11, currentPage, totalPage);
          $pageNavigation.html('');
          if(currentPage>0){
            $pageNavigation.append(`<a class="page-navigation-item" page-id="0">首页</a>`);
            $pageNavigation.append(`<a class="page-navigation-item" page-id="${currentPage-1}">上一页</a>`);
          }
          pageNumArray.forEach(function(value,ind){
            if(value == (currentPage+1)){
              $pageNavigation.append(`<a data-selected="true">${value}</a>`);
            }else{
              $pageNavigation.append(`<a class="page-navigation-item" page-id="${value-1}">${value}</a>`);
            }
          });
          if(currentPage<(totalPage-1)){
            $pageNavigation.append(`<a class="page-navigation-item" page-id="${currentPage+1}">下一页</a>`);
            $pageNavigation.append(`<a class="page-navigation-item" page-id="${totalPage-1}">尾页</a>`);
          }
          $pageNavigation.fadeIn();
        } else{
          $nodataHistoryList.fadeIn();
        }
      }else{
        console.log(datas.resultMessage);//TODO
      }
    },
    error: function(error) {
      alert("/product/purchasehistory服务器异常，请稍后再试");//TODO 信息错误
    }
  });
}


// 侧边工具栏控制
function slidebarControoler(){
  let $goTop = $('.slidebar-wrap .icon-top-arrow');
  $(window).scroll(function() {
    if ($(window).scrollTop() > 100) {
      $goTop.fadeIn();
    } else {
      $goTop.fadeOut();
    };
  });
  $goTop.bind('click',function(){
    $("html,body").animate({"scrollTop":'0'},500)
  })
}
