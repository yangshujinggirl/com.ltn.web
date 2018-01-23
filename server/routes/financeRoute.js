// 理财模块路由
const axios = require('axios');
const lodash = require('lodash');
const {page} = require('../util');
const instance = require('../api/instance');

const {
  FinanceRoute,
  ErrorRouter
} = require('./route.config');

const financeListRouteHandler = (request, reply) => {
  // 产品类型：请求列表类型 0-最新标的 1-新手标 2-理财计划 3-散标 4-活动专区 5-转让标
  const productType = request.params.productType;
  //产品状态 0-全部 1-可投资 2-已结束 3-还款中 4-已还款
  const productStatus = request.params.productStatus;
  // 标的周期开始天
  const productDeadlineStart = request.params.productDeadlineStart;
  // 标的周期结束天
  const productDeadlineEnd = request.params.productDeadlineEnd;
  // 分页处理
  let pageNum = request.query.pageNum
  const pageSize = 5;
  pageNum = Number.parseInt(pageNum);
  // 不是数字
  if (Number.isNaN(pageNum) || pageNum < 1) {
    pageNum = 1
  }
  // 查询参数对象
  const queryParams = {
    currentPage: pageNum - 1,
    pageSize,
    productType,
    productStatus,
    productDeadlineStart,
    productDeadlineEnd
  }
  // 一级tab选择 '最新','新手标','理财计划','精准散标'
  const TabLevelOneArray = [
    {
      productType: 0,
      selected: '',
      text: '最新'
    }, {
      productType: 1,
      selected: '',
      text: '新手标'
    }, {
      productType: 2,
      selected: '',
      text: '理财计划'
    }, {
      productType: 3,
      selected: '',
      text: '精选散标'
    }, {
      productType: 4,
      selected: '',
      text: '活动专区'
    }
  ]
  // 设置选择模块
  lodash.forEach(TabLevelOneArray, function(item) {
    item.selected = item.productType == productType
      ? 'selected'
      : '';
  })
  // 二级tab选择
  let TabLevelTwoArray = [
    {
      cycleDays: 0,
      selected: '',
      href: '0/0',
      text: '全部'
    }, {
      cycleDays: 5,
      selected: '',
      href: '0/5',
      text: '5天'
    }, {
      cycleDays: 15,
      selected: '',
      href: '5/15',
      text: '15天'
    }, {
      cycleDays: 30,
      selected: '',
      href: '15/30',
      text: '30天'
    }, {
      cycleDays: 45,
      selected: '',
      href: '30/45',
      text: '45天'
    }
  ]
  // 精准散标
  if (productType == 2 || productType == 4) {
    TabLevelTwoArray = [
      {
        cycleDays: 0,
        selected: '',
        href: '0/0',
        text: '全部'
      }, {
        cycleDays: 30,
        selected: '',
        href: '0/30',
        text: '30天'
      }, {
        cycleDays: 90,
        selected: '',
        href: '30/90',
        text: '90天'
      }, {
        cycleDays: 180,
        selected: '',
        href: '90/180',
        text: '180天'
      }, {
        cycleDays: 360,
        selected: '',
        href: '180/360',
        text: '360天'
      }
    ]
  }

  lodash.forEach(TabLevelTwoArray, function(item) {
    item.selected = item.cycleDays == productDeadlineEnd
      ? 'selected'
      : '';
  })

  // 三级tab选择
  const TabLevelThreeArray = [
    {
      productStatus: 0,
      selected: '',
      text: '全部'
    }, {
      productStatus: 1,
      selected: '',
      text: '可投资'
    }, {
      productStatus: 2,
      selected: '',
      text: '已结束'
    }, {
      productStatus: 4,
      selected: '',
      text: '已还款'
    }
  ];
  // 设置选择模块
  lodash.forEach(TabLevelThreeArray, function(item) {
    item.selected = item.productStatus == productStatus
      ? 'selected'
      : '';
  })

  instance.get('/product/pcProductSearch', {params: queryParams})
  .then(data => {
    const currentPage = pageNum,
      totalPage = Math.ceil(data.totalCount / pageSize);
    const pageNumArray = page(11, currentPage, totalPage);
    reply.view(FinanceRoute.list, {
      TopNavInvestIsSelected:'selected',
      TabLevelOneArray,
      TabLevelTwoArray,
      TabLevelThreeArray,
      queryParams,
      currentPage,
      totalPage,
      pageNumArray,
      searchList: data.searchList
    })
  })
  .catch(err => {
    console.log('test111');
    console.log(err);
    throw new Error('服务器异常')
  })
}

const {
  getProductDetailApi,
  getScrollMessageeApi
} = require('../api/financeDetailApi');

//协议地址类型
const protocolUrl = {
  tyb:"http://www.lingtouniao.com/ltn-static/protocol/tyb",//体验标
  lcjh:"http://www.lingtouniao.com/ltn-static/protocol/lcjhproduct",//理财计划
  jkxy:"http://www.lingtouniao.com/ltn-static/protocol/loan"//借款协议
}

//产品详情数据拓展
const productDetailExt = {
  //新手标
  new:{
    id:1,
    type:'new',
    protocolUrl:protocolUrl.lcjh,
    protocolName:'理财计划协议',
    crumbUrl:'/finance/list/1/0/0/0'
  },
  //理财计划
  finPlan:{
    id:2,
    type:'finPlan',
    protocolUrl:protocolUrl.lcjh,
    protocolName:'理财计划协议',
    crumbUrl:'/finance/list/2/0/0/0'
  },
  //活动标
  act:{
    id:3,
    type:'act',
    protocolUrl:protocolUrl.lcjh,
    protocolName:'理财计划协议',
    crumbUrl:'/finance/list/4/0/0/0'
  },
  //国资供应链
  gzg:{
    id:4,
    type:'GZG',
    protocolUrl:protocolUrl.jkxy,
    protocolName:'借款协议',
    crumbUrl:'/finance/list/3/0/0/0'
  },
  //消费分期
  xffq:{
    id:5,
    type:'XFFQ',
    protocolUrl:protocolUrl.jkxy,
    protocolName:'借款协议',
    crumbUrl:'/finance/list/3/0/0/0'
  },
  //信用宝
  xyb:{
    id:6,
    type:'XYB',
    protocolUrl:protocolUrl.jkxy,
    protocolName:'借款协议',
    crumbUrl:'/finance/list/3/0/0/0'
  },
  //其他标的信息
  other:{
    id:7,
    type:'other',
    protocolUrl:protocolUrl.jkxy,
    protocolName:'借款协议',
    crumbUrl:'/finance/list/3/0/0/0'
  },
  tyb:{
    id:8,
    type:'tyb',
    protocolUrl:protocolUrl.tyb,
    protocolName:'体验标投资协议',
    crumbUrl:'/finance/list/0/1/0/0'
  },
  zt:{
    id:9,
    type:'zt',
    protocolUrl:protocolUrl.lcjh,
    protocolName:'理财计划',
    crumbUrl:'/finance/list/1/0/0/0'
  }
}

//拆分历史年华收益字段
function spit(productDetail){
  const arr = productDetail.annualIncomeText.split("+");
  const annualIncome = {
    firstAnnualIncome:arr[0],
    secondAnnualIncome:arr[1]=='undefined'?'':arr[1]
  }
  productDetail=lodash.assign(productDetail,annualIncome);
  return productDetail;
}

//析构产品详情信息
function buildProd(productDetail){
  let secondCategoryId = productDetail.secondCategoryId;
  let productId = productDetail.productId;
  productDetail = spit(productDetail);
  if(productId==1){
    productDetail=lodash.assign(productDetail,productDetailExt.tyb);
  }else if(secondCategoryId==="1007007"||secondCategoryId==="1004005"){//新手标
    productDetail=lodash.assign(productDetail,productDetailExt.new);
  }else if (['1007001','1007002','1007003','1007004','1007006'].indexOf(secondCategoryId) !== -1) {//理财计划
    productDetail=lodash.assign(productDetail,productDetailExt.finPlan);
  }else if (secondCategoryId === "1007005") {//活动标
    productDetail=lodash.assign(productDetail,productDetailExt.act);
  }else if (secondCategoryId === "1008013"||secondCategoryId === "1006001") {//国资供应链
    productDetail=lodash.assign(productDetail,productDetailExt.gzg);
  }else if (secondCategoryId === "1008014"||secondCategoryId === "1004003") {//消费分期
    productDetail=lodash.assign(productDetail,productDetailExt.xffq);
  } else if (secondCategoryId === "1008015"||secondCategoryId === "1004004") {//信用宝
    productDetail=lodash.assign(productDetail,productDetailExt.xyb);
  } else if (secondCategoryId === "1004001") {//智投
    productDetail=lodash.assign(productDetail,productDetailExt.zt);
  }else {//其他类型标的
    productDetail=lodash.assign(productDetail,productDetailExt.other);
  }
  return productDetail;
}

//获取当前服务器时间年月日
function getDate(){
  const d = new Date();
  let month = d.getMonth()+1;
  if (month<10){
    month = "0"+month;
  }
  const date = d.getFullYear()+"-"+month+"-"+d.getDate();
  return date;
}

//产品详情添加投资日期和预期收益等
function reBuildData(productDetail,value,realPay){
  //计算预收益
  const rate = productDetail.annualIncome;
  let income = 0;
  if(productDetail.productType=="TYB"){
    income = 13.18;
  }else{
    income = (value*rate/365*productDetail.convertDay).toFixed(2);
  }
  const newObj = {
    orderTime:getDate(),
    preIncome:income,
    investMoney:value,
    realPayMoney:realPay
  }
  productDetail = lodash.assign(productDetail,newObj);
  return productDetail;
}

const financeDetailHandler = (request, reply)=>{
  const productId = request.params.productId;
  axios.all([getProductDetailApi(productId),getScrollMessageeApi()])
  .then(([productDetail, messageList])=>{
    console.log(messageList.messageList);
    console.log(buildProd(productDetail.pcProductDetail));
    reply.view(FinanceRoute.detail, {
      TopNavInvestIsSelected:'selected',
      productDetail:buildProd(productDetail.pcProductDetail),
      messageList:messageList.messageList
    })
  },(reject)=>{
    request.server.log('error',reject);
    reply(new Error('服务器异常'));
  })
  .catch(err=>{
    console.log(err);
    throw new Error('服务器异常');
  })
}

const ConfimPaymentHandler = (request, reply)=>{
  const productId = request.params.productId;
  const value = request.params.value;
  axios.all([getProductDetailApi(productId),getScrollMessageeApi()])
  .then(([productDetail, messageList])=>{
    const data = productDetail.pcProductDetail;
    reply.view(FinanceRoute.confim, {
      TopNavInvestIsSelected:'selected',
      messageList:messageList.messageList,
      productDetail:buildProd(reBuildData(data,value,''))
    })
  },(reject)=>{
    request.server.log('error',reject);
    reply(new Error('服务器异常'));
  })
  .catch(err=>{
    console.log(err);
    throw new Error('服务器异常');
  })
}

const PaymentResultHandler = (request, reply)=>{
  const productId = request.params.productId;
  const value = request.params.value;
  const realPay = request.params.realMoney;
  axios.all([getProductDetailApi(productId),getScrollMessageeApi()])
  .then(([productDetail, messageList])=>{
    const data = productDetail.pcProductDetail;
    if(request.params.type == 'success'){
      reply.view(FinanceRoute.result, {
        TopNavInvestIsSelected:'selected',
        messageList:messageList.messageList,
        productDetail:buildProd(reBuildData(data,value,realPay)),
        type:'success'
      })
    } else if(request.params.type == 'defeat'){
      reply.view(FinanceRoute.result, {
        messageList:messageList.messageList,
        productDetail:buildProd(reBuildData(data,value,realPay)),
        type:'defeat'
      })
    } else{
      reply.view(ErrorRouter.error404);
    }
  },(reject)=>{
    request.server.log('error',reject);
    reply(new Error('服务器异常'));
  })
  .catch(err=>{
    console.log(err);
    throw new Error('服务器异常');
  });
}

//投资列表页面
const financeListRoute = (server) => {
  server.route({
    method: 'GET',
    path: '/finance/list/{productType}/{productStatus}/{productDeadlineStart}/{productDeadlineEnd}',
    handler:financeListRouteHandler
  })
}

//标的详情页面
const financeDetailRouter = (server) => {
  server.route({
    method: 'GET',
    path: '/finance/detail/{productId}',
    handler:financeDetailHandler
  })
}

//下单确认页面
const confimPaymentRouter = (server) => {
  server.route({
    method: 'GET',
    path: '/finance/confirm/{productId}/{value}',
    handler:ConfimPaymentHandler
  })
}

//下单结果页面
const paymentResultRouter = (server) => {
  server.route({
    method: 'GET',
    path: '/finance/pay/{type}/{productId}/{value}/{realMoney}',
    handler:PaymentResultHandler
  })
}

module.exports = {
  financeListRoute,
  financeDetailRouter,
  confimPaymentRouter,
  paymentResultRouter
};
