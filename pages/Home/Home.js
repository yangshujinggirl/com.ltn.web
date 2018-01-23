import '../../common/pages/layout.js';
// 引入swiper 样式文件
import './Home.scss';
// 文字滚动插件 jqeruy
import '../../common/libs/jquery.marquee.js';

import {
  UserInfo
} from '../../common/scripts/utils.js';
import '../../common/libs/jquery.sticky/jquery.sticky';

function initBanner(){
  let winodwWidth = window.innerWidth;
  // 设置banner的尺寸
  if (winodwWidth > 1920) {
    $('.banner-wrap').height(winodwWidth / 1920 * 350)
  }
  // 初始化轮播banner，
  let bannerArray = $('.banner-wrap .img-items li');
  let pageArray = $('.banner-wrap .page span');
  const controller={
    stop:false,
    showIndex:0,
    time:5000
  }
  showHideImgAndPage(bannerArray, pageArray, controller);
  pageClick(bannerArray, pageArray, controller);
  bannerArray.bind('mouseover', function() {
    controller.stop = true;
  })
  bannerArray.bind('mouseout', function() {
    controller.stop = false;
  })
  pageArray.bind('mouseover', function() {
    controller.stop = true;
  })
  pageArray.bind('mouseout', function() {
    controller.stop = false;
  })
  setInterval(function() {
    if (controller.stop) {
      return false;
    }
    controller.showIndex++;
    if (controller.showIndex > bannerArray.length-1) {
      controller.showIndex = 0;
    }
    showHideImgAndPage(bannerArray, pageArray, controller);
  }, controller.time)
}
function pageClick(bannerArray, pageArray, controller) {
  pageArray.bind('mouseover', function() {
    controller.showIndex = $(this).attr('index');
    showHideImgAndPage(bannerArray, pageArray, controller);
  })
}
function showHideImgAndPage(bannerArray, pageArray, controller) {
  bannerArray.fadeOut({
    duration:1000,
  });
  pageArray.removeClass('active');
  $(bannerArray[controller.showIndex]).fadeIn({
    duration:1000,
    progress:function(animation,progress){
    }
  });
  $(pageArray[controller.showIndex]).addClass('active');
}

$(document).ready(function() {
  // 导航吸顶
  $(".top-nav-wrap").sticky({
    zIndex:1000
  });
  // 初始化banner
  initBanner();

  // 触发侧边条
  $('.slidebar-wrap .wrap').bind('click',function(){
    $('#udesk_btn a').trigger('click');
  })

  // 平台消息
  $('.marquee').marquee({
    pauseOnHover: true,
    //speed in milliseconds of the marquee
    duration: 20000,
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
  // 媒体报道
  $('.notices-marquee').marquee({
    pauseOnHover: true,
    //speed in milliseconds of the marquee
    duration: 32000,
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

  //平台运营报告悬浮样式变化
  $('.platform-report-conetnt').hover(function() {
    $(this).children().css('color', '#f60');
    var src = $(this).find('.icon').attr('src');
    var dataSrc = $(this).find('.icon').attr('data-src');
    [src, dataSrc] = [dataSrc, src];
    $(this).find('.icon').attr('src', src);
    $(this).find('.icon').attr('data-src', dataSrc);
  }, function() {
    $(this).children().css('color', '#888c8e');
    var src = $(this).find('.icon').attr('src');
    var dataSrc = $(this).find('.icon').attr('data-src');
    [src, dataSrc] = [dataSrc, src];
    $(this).find('.icon').attr('src', src);
    $(this).find('.icon').attr('data-src', dataSrc);
  });

  // banner浮层
  slidebarControoler();
  const $islogin = $('.register-info-wrap .islogin').hide();
  const $nologin = $('.register-info-wrap .nologin').hide();
  if(UserInfo.isLogin){
    getUserTotalAccount(UserInfo.sessionKey,$islogin,$nologin)
  } else {
    $nologin.fadeIn();
  }
})

// 加载用户数据
function getUserTotalAccount(sessionKey,$islogin,$nologin){
  $.ajax({
    url: '/api/user/totalAccount',
    type: 'POST',
    data: {
      clientType: "PC",
      sessionKey: sessionKey
    },
    success: function({data}) {
      // 接口异常
      if(!data){
        $nologin.fadeIn();
      }else{
        $('#property').html(data.totalAsset===0?"0.00":data.totalAsset);
        $('#remainder').html(data.usableBalance===0?"0.00":data.usableBalance);
        $('.hidden-register').hide();
        $islogin.fadeIn();
      }
    },
    error: function(error) {
      $nologin.fadeIn();
    }
  })
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
