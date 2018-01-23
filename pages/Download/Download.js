import '../../common/pages/layout.js';
import './Download.scss';

var heightOne = $('.part-one').offset().top;
var heightTwo = $('.part-two').offset().top;
var heightThr = $('.part-thr').offset().top;

function animateEvent() {
  $(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    if(scrollTop>=200) {
      // $('#jsOneL').addClass('animate');
      $('.left-one').stop().animate({
        top:"55px"
      },2000);
      $('.right-one').stop().animate({
        bottom:"0"
      },2000);
    }
    if(scrollTop>=heightOne) {
      $('.content-two').stop().animate({
        top:"100px"
      },2000);
    }
    if(scrollTop>=heightTwo) {
      $('.content-thr').stop().animate({
        top:"100px"
      },2000);
    }
    if(scrollTop>=heightThr) {
    $('.right-last').stop().animate({
      bottom:"45px"
    },2000);
      $('.content-four').stop().animate({
        top:"40px"
      },2000)
    }
  })
}

function isShow() {
  var flag = false;
  $(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    // console.log($(window).scrollTop())
    if(flag==false && scrollTop>=800) {
      $('.fooer-content').slideDown();
    } else {
      $('.fooer-content').slideUp();
    }
  })
  $('.close-btn').on('click',function() {
    $('.fooer-content').hide();
    flag = true;
  })
}

animateEvent();
isShow();

$(document).ready(function() {
  // 触发侧边条
  $('.slidebar-wrap .wrap').bind('click',function(){
    $('#udesk_btn a').trigger('click');
  })
  slidebarControoler();
})

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
