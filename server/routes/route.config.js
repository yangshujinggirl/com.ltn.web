// 路由配置
const tempBasePath = 'build/';
// 帮助中心
const HelpRoute = {
  // 关于领投鸟
  aboutltn:tempBasePath+'HelpAboutLtn',
  // 登录注册
  login:tempBasePath+'HelpLogin',
  // 认证绑卡
  certificate:tempBasePath+'HelpCertificate',
  // 充值提现
  trade:tempBasePath+'HelpTrade',
  // 投资返现
  invest:tempBasePath+'HelpInvest',
  // 账户安全
  account:tempBasePath+'HelpAccount',
  // 理财金券
  ticket:tempBasePath+'HelpTicket',
  // 名词解释
  glossary:tempBasePath+'HelpGlossary',
  // 产品介绍
  product:tempBasePath+'HelpProduct',
  // 活动介绍
  activity:tempBasePath+'HelpActivity'
}
// 关于我们
const AboutRoute = {
  // 关于领投鸟
  pltinfo:tempBasePath+'AboutPlatform',
  // 团队介绍
  team:tempBasePath+'AboutTeam',
  // 平台荣誉
  honor:tempBasePath+'AboutHonor',
  // 合作伙伴
  partner:tempBasePath+'AboutPartner',
  // 品牌优势
  advantage:tempBasePath+'AboutAdvantage',
  // 平台公告
  notice:tempBasePath+'AboutNotice',
  // 公告详情
  noticeDetail:tempBasePath+'AboutNoticeDetail',
  // 媒体报道
  news:tempBasePath+'AboutNews',
  // 媒体详情
  newsDetail:tempBasePath+'AboutNewsDetail',
  // 运营报告
  report:tempBasePath+'AboutReport',
  // 协议范本
  protocol:tempBasePath+'AboutProtocol',
  //发展历程
  road:tempBasePath+'AboutRoad',
  // 加入我们
  join:tempBasePath+'AboutJoin',
  //联系我们
  contact:tempBasePath+'AboutContact'
}
// 其他静态页面
const OtherStaticRoute = {
  // 新手指引
  newerguide:tempBasePath+'NewerGuide',
  // app下载
  downloadapp:tempBasePath+'Download',
  // 安全保障
  safeguards:tempBasePath+'Safeguards',
  // 活动列表
  actlist:tempBasePath+'ActivityBanner',
  // 我是合伙人
  mypartner:tempBasePath+'MyPartner',
  // 存管页面
  depository:tempBasePath+'Depository',
  //充值成功回调页面
  rechargeok:tempBasePath+'rechargeResult',
  //充值失败回调页面
  rechargedefeat:tempBasePath+'rechargeResult'
}
// 首页链接
const HomeRoute = {
  home:tempBasePath+'Home'
}
// 理财模块
const FinanceRoute = {
  list:tempBasePath+'FinanceList',
  detail:tempBasePath+'FinanceDetail',
  confim:tempBasePath+'ConfimPayment',
  result:tempBasePath+'PaymentResult'
}
const MarketMainRoute = {
  //广场舞活动
  squareDancing:tempBasePath+'SquareDancing'
}
const ErrorRouter = {
  //404错误页面
  error404:tempBasePath+'Error404',
  //500错误页面
  error500:tempBasePath+'Error500'
}
module.exports = {
  HomeRoute,
  FinanceRoute,
  HelpRoute,
  AboutRoute,
  OtherStaticRoute,
  MarketMainRoute,
  ErrorRouter
}
