// 首页的路由
const axios = require('axios');
const {HomeRoute} = require('./route.config');
const {
  getBannerApi,
  getPlatformData,
  newProject,
  getFinancePlanData,
  homeProjectList,
  news,
  notices
} = require('../api/homeApi');

// 首页处理
const handlerHomePage = (request, reply)=>{
  axios.all([
    getBannerApi(),
    getPlatformData(),
    newProject(),
    getFinancePlanData(),
    homeProjectList(),
    news(),
    notices()
  ])
  .then(([
    bannerList,
    platformData,
    newProject,
    financePlanList,
    homeProjectList,
    news,
    notices
  ])=>{
    reply.view(HomeRoute.home, {
      //topNav选中样式
      TopNavFirstIsSelected:'selected',
      bannerList: bannerList.bannerList,
      platformData: platformData,
      newProject: newProject,
      financePlanList:financePlanList.productList,
      homeProjectList:homeProjectList.productList,
      news: news.announcementList,
      notices:notices.announcementList
    })
  },(reject)=>{
    request.server.log('error',reject)
    reply(new Error(reject))
  })
  .catch(err=>{
    console.error(err);
    throw new Error('服务器异常')
  })
}

module.exports = (server)=>{
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      handlerHomePage(request, reply)
    }
  });
  server.route({
    method: 'GET',
    path: '/index.html',
    handler: function (request, reply) {
      handlerHomePage(request, reply)
    }
  });
  server.route({
    method: 'GET',
    path: '/home.html',
    handler: function (request, reply) {
      handlerHomePage(request, reply)
    }
  });
};
