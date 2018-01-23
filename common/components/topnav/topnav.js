import {
  UserInfo
} from  '../../scripts/utils.js';
let userAccountUrl = '/account/#/account/viewall';
let url = UserInfo.isLogin?userAccountUrl:`/account/#/user/login?backUrl=${userAccountUrl}`

$('.my-account').attr('href',url);
