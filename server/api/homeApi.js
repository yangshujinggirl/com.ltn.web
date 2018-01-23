// 首页相关的数据接口
const instance = require('./instance');

/**
 * [getBannerApi 查询首页的banner图片]
 * @return {[type]} [promise]
 */
const getBannerApi = () => {
  return instance.get('/page/banner', {
    params: {
      location: 1
    }
  })
}
const getPlatformData = () => {
  return instance.get('/pc/homepage/ptdata/get')
}

const newProject = () => {
  return instance.get('/index/newProduct')
}
const homeProjectList = () => {
  return instance.get('/pc/product/homepage/recommend/get')
}
const news = () => {
  return instance.get('/pc/announcement/homepage/list', {
    params: {
      type: 2
    }
  })
}
const notices = () => {
  return instance.get('/pc/announcement/homepage/list', {
    params: {
      type: 1
    }
  })
}
const getFinancePlanData = () => {
  return instance.get('/pc/product/homepage/recommend/getlcjh')
}

module.exports = {
  getBannerApi,
  getPlatformData,
  newProject,
  homeProjectList,
  news,
  notices,
  getFinancePlanData
};
