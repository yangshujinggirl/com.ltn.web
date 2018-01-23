import {
  UserInfo,
  clearSession,
  loginOutAjax
} from '../../scripts/utils.js';

$(document).ready(function () {
  // 二维码显示控制
  $('.icon-weixin').hover(function(){
    $(this).find('.weixin-code').fadeIn();
  },function(){
    $(this).find('.weixin-code').fadeOut();
  })
  var backUrl = window.location.href;
  let $login = $('.top-header .login');
  let $register = $('.top-header .register');
  let $userInfo = $('.top-header .userInfo');
  let $loginOut = $('.top-header .loginOut');
  $login.hide();
  $register.hide();
  $userInfo.hide();
  $loginOut.hide();
  $userInfo.html(`欢迎您，${(UserInfo.userName===""||UserInfo.userName==="undefined")?UserInfo.mobile:UserInfo.userName}`);
  $login.attr('href',`/account/#/user/login?backUrl=${backUrl||'/'}`);
  $register.attr('href',`/account/#/user/register`);
  if(UserInfo.isLogin){
    $loginOut.fadeIn();
    $userInfo.fadeIn();
  }else{
    $login.fadeIn();
    $register.fadeIn();
  }
  // 退出登陆
  $loginOut.on('click', function () {
    clearSession();
    loginOutAjax(UserInfo.sessionKey);
    window.location.reload();
  })
})
