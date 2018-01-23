// 投资详情相关的数据接口
const instance = require('./instance');

/**
 * [getProductDetailApi 获取投资详情信息]
 * @return {[type]} [promise]
 */
const getProductDetailApi = (productId) => {
  return instance.get('/product/productDetail', {
    params: {
      id: productId
    }
  })
}
/**
 * [getScrollMessageeApi 获取投资详情广告信息]
 * @return {[type]} [promise]
 */
const getScrollMessageeApi = () => {
  return instance.get('/message/getScrollMessage')
}

module.exports = {
  getProductDetailApi,
  getScrollMessageeApi
};
