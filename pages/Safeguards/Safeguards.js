import '../../common/pages/layout.js';
import './Safeguards.scss';
import '../../common/libs/jquery.sticky/jquery.sticky';
import {
  UserInfo
} from '../../common/scripts/utils.js';
// 初始化安全保障的导航

function initSafeNav(){
  //  页面第一次加载的时候执行
  let $navWap = $('.safe-page-wrap  .nav');
  let $nav = $('.safe-page-wrap .nav span');
  let $line = $('.safe-page-wrap .nav i');
  let $pList = $('.p1,.p2,.p3,.p4,.p5,.p6');
  let baseUrl= window.location.origin+window.location.pathname;
  // 设置导航吸顶效果
  $(".nav-wrap").sticky({
    zIndex:1000,
    topSpacing:0
  });
  $(".nav-wrap").fadeIn();
  navHover($nav,$line,$navWap);
  navClick($nav,baseUrl,$line,$pList);
  let p_index = window.location.hash.replace('#','');
  let $currentNav = $nav.eq(p_index);
  //处理没有找到的情况
  if($currentNav.length==0){
    p_index = 0;
    $currentNav = $nav.eq(0)
  }
  $nav.eq(p_index).trigger('click');

}

function updateNav($nav,$line){
  let p_index = window.location.hash.replace('#','');
  let $currentNav = $nav.eq(p_index);
  //处理没有找到的情况
  if($currentNav.length==0){
    p_index = 0;
    $currentNav = $nav.eq(0)
  }
  window.location.hash = p_index;
  $currentNav.siblings().removeClass('active');
  $currentNav.addClass('active');// 激活当前导航
  // 设置下标的位置
  setNavLinePosition($line,p_index);

}

// 处理导航鼠标hover效果
function navHover($nav,$line,$navWap){
  $nav.bind('mouseover',function(){
    let index = parseInt($(this).attr('index'));
    setNavLinePosition($line,index);
  })
  $navWap.bind('mouseout',function(){
    let hisIndex = $nav.filter('.active').attr('index');
    hisIndex = parseInt(hisIndex);
    setNavLinePosition($line,hisIndex);
  })
}

// 处理导航点击效果
function navClick($nav,baseUrl,$line,$pList){
  $nav.bind('click',function(){
    let p_index = parseInt($(this).attr('index'));
    window.location.hash =p_index;
    updateNav($nav,$line);
    showContent($pList,p_index);
  })
}

// 设置下标的位置
function setNavLinePosition($line,index){
  $line.css({
    'left':`${55+index*140}px`
  }).show();
}

// 设置内容区域
function showContent($pList,index){
  $pList.hide();
  $pList.eq(index).fadeIn();
  if($(window).scrollTop()>400){
    $("html,body").animate({"scrollTop":'400'},500);
  }
}

$(document).ready(function(){
    initSafeNav();
    let $oneScrollArea = $('.p2 .one .scroll');
    let $threeScrollArea = $('.p2 .three .scroll');
    let $leftArrow = $('.p2 .left-arrow');
    let $rightArrow = $('.p2 .right-arrow');

    // updateArrow($oneScrollArea);
    // updateArrow($threeScrollArea);

    $leftArrow.bind('click',function(){
      let $scrollArea = $(this).siblings('.scroll');
      let startIndex = parseInt($scrollArea.attr('startIndex'));
      let translate = -startIndex*298+298;
      $scrollArea.css({
        'transform':`translate(${translate}px)`
      })
      startIndex-=1;
      $scrollArea.attr('startIndex',startIndex);
      updateArrow($scrollArea);
    })
    $rightArrow.bind('click',function(){
      let $scrollArea = $(this).siblings('.scroll');
      let startIndex = parseInt($scrollArea.attr('startIndex'));
      let translate = startIndex*298+298;
      $scrollArea.css({
        'transform':`translate(-${translate}px)`
      })
      startIndex+=1;
      $scrollArea.attr('startIndex',startIndex);
      updateArrow($scrollArea);
    })

    // p1
    let $p1ScrollArea = $('.p1 .scroll');
    let $p1leftArrow = $('.p1 .left-arrow');
    let $p1rightArrow = $('.p1 .right-arrow');

    $p1leftArrow.bind('click',function(){
      let $scrollArea = $(this).siblings('.scroll');
      let startIndex = parseInt($scrollArea.attr('startIndex'));
      let translate = -startIndex*1200+1200;
      $scrollArea.css({
        'transform':`translate(${translate}px)`
      })
      startIndex-=1;
      $scrollArea.attr('startIndex',startIndex);
      updateArrow($scrollArea);
    })
    $p1rightArrow.bind('click',function(){
      let $scrollArea = $(this).siblings('.scroll');
      let startIndex = parseInt($scrollArea.attr('startIndex'));
      let translate = startIndex*1200+1200;
      $scrollArea.css({
        'transform':`translate(-${translate}px)`
      })
      startIndex+=1;
      $scrollArea.attr('startIndex',startIndex);
      updateArrow($scrollArea);
    })

    $('.p1 .scroll-content').hover(function(){
      updateArrow($p1ScrollArea);
    },function(){
      $p1rightArrow.hide();
      $p1leftArrow.hide();
    })
    $('.p2 .one ').hover(function(){
      updateArrow($oneScrollArea);
    },function(){
      $('.p2 .one .arrow').hide();
    })
    $('.p2 .three').hover(function(){
      updateArrow($threeScrollArea);
    },function(){
      $('.p2 .three .arrow').hide();
    })

    // 控制 滑动尖头是否显示
    function updateArrow($scrollArea){
      $scrollArea.siblings('.arrow').hide();
      let startIndex = parseInt($scrollArea.attr('startIndex'));
      let maxIndex = parseInt($scrollArea.attr('maxIndex'));
      if(startIndex==0 && maxIndex>startIndex){
        $scrollArea.siblings('.right-arrow').fadeIn();
      }else if(startIndex == maxIndex){
        $scrollArea.siblings('.left-arrow').fadeIn();
      }else{
        $scrollArea.siblings('.arrow').fadeIn();
      }
    }


    // p5 控制
    // 1. 媒体切换控制
    let p5nav = $('.p5 .news-nav img');
    let p5NavList = $('.p5 .news-list');
    p5nav.bind('click',function(){
      if($(this).hasClass('active')){
        return false;
      }
      p5NavList.hide();//隐藏全部的list
      let src = $(this).attr('src');
      let dataSrc = $(this).attr('data-src');
      let listId =  $(this).attr('data-list');
      let hisSrc = $(this).siblings('.active').attr('src');
      let hisdDataSrc = $(this).siblings('.active').attr('data-src');
      [src,dataSrc] = [dataSrc,src];
      [hisSrc,hisdDataSrc] = [hisdDataSrc,hisSrc];

      // 切换图标
      $(this).attr('src',src);
      $(this).attr('data-src',dataSrc);
      $(this).siblings('.active').attr('src',hisSrc);
      $(this).siblings('.active').attr('data-src',hisdDataSrc);
      p5NavList.filter(`.${listId}`).fadeIn();
      p5nav.removeClass('active');
      $(this).addClass('active');

    })
    $(p5nav[0]).trigger('click');
    // 注册
    if(UserInfo.isLogin){
      $('.zhuce a').attr('href','/')
    }else{
      $('.zhuce a').attr('href','/html/user/register')
    }
});

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
