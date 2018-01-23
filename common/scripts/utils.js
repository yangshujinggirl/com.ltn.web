import  Cookies from 'js-cookie';
const SESSION_KEY_BASE="ltn_";

const ltn_user = Cookies.getJSON(`${SESSION_KEY_BASE}user`)||{};
const sessionKey = ltn_user.sessionKey?ltn_user.sessionKey:'';
const mobile = ltn_user.mobileNo?ltn_user.mobileNo:'';
const userName = ltn_user.userName?ltn_user.userName:'';
const userAccount = ltn_user.usableBalance?ltn_user.usableBalance:'';
const isLogin = !!(sessionKey && sessionKey.length>0);

// 用户相关信息
const UserInfo = {
  sessionKey,
  mobile,
  userName,
  userAccount,
  // 判断用户是否登陆，true：登陆，false：未登陆
  isLogin
}

// 清楚用户登陆信息
function clearSession() {
  Cookies.remove(`${SESSION_KEY_BASE}user`);
}

// 清除 服务器端 用户session
function loginOutAjax(sessionKey) {
  $.ajax({
    url: '/api/user/login/logout',
    type: 'POST',
    data: {
      clientType: "PC",
      sessionKey: sessionKey
    },
    complete: function () {
      window.location.href;
    }
  })
}

//登录
function goLogin(url){
  window.location.href = "/account/#/user/login?backUrl="+url;
}

//  size: 需要显示页码的个数 例如 10 页码个数是11  如果是9 页面个数就是9
function page(size,currentPage=1,totalpage=1) {
  let pageArray = [];
  // 偶数
  if(size%2 === 0){
    size +=1;
  }
  // 中间页的序号
  let middleIndex = (size-1)/2+1;
  // 总页数不够，全部显示
  if(totalpage<=size){
    for(let i=1;i<=totalpage;i++){
      pageArray.push(i)
    }
  // 总页数够
  }else{
    // 小于 中间页面
    if(currentPage<=middleIndex){
      for(let i=1;i<=size;i++){
        pageArray.push(i)
      }
    // 大于中间页面
    }else{
      // 1. 右边有足够的页面 currentPage+middleIndex <=totalpage
      // 2. 右边不够了
      if((currentPage+middleIndex-1)>totalpage){
        for(let i=totalpage-size;i<=totalpage;i++){
          pageArray.push(i)
        }
      }else{
        for(let i=(currentPage-middleIndex+1);i<=(currentPage+middleIndex-1);i++){
          pageArray.push(i)
        }
      }
    }
  }
  return pageArray;
}

module.exports = {
  UserInfo,
  clearSession,
  loginOutAjax,
  goLogin,
  page
};
