import './FinanceList.scss';
import '../../common/pages/layout.js';


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
