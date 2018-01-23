const Axios = require('axios');
const isProd = process.env.NODE_ENV === 'production';
const instance = Axios.create({
  baseURL: isProd?'http://localhost:8080/api':'http://192.168.18.196:8082',
  timeout: 15000
});

instance.interceptors.request.use(function (config) {
    if(config.params){
      config.params.clientType = 'PC'
    }
    if(config.data){
      config.data.clientType = 'PC'
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    let data = response.data;
    // 业务正常
    if(data.resultCode === '0'){
      return data.data;
    // sessionKey 超时
    }else if(data.resultCode === '1000'){

    }else{
      let error = new Error(data.resultMessage);
      error.resultCode = data.resultCode
      Promise.reject(error);
    }
  }, function (error) {
    // 发生异常
    if(error.response){
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
       console.error(error.response.data);
       console.error(error.response.status);
       console.error(error.response.headers);
       Promise.reject(new Error(`响应异常:${error.response.status}`));
     }else if(error.request){
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('请求错误:',error.request._currentUrl);
      Promise.reject(new Error(`请求错误:${error.request._currentUrl}`))
    }else{
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      Promise.reject(new Error(`未知错误:${error.message}`))
    }
  });

module.exports = instance;
