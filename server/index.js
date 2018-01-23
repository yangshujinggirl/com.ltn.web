// 服务文件
const Path = require('path');
const Hapi = require('hapi');
const Nunjucks = require('nunjucks');
const plugins = require('./plugins');
// 请求异常处理
const {
  ErrorRouter
} = require('./routes/route.config');
// 首页
const homeRoute = require('./routes/homeRoute');
// 理财相关
const {
  financeListRoute,
  financeDetailRouter,
  confimPaymentRouter,
  paymentResultRouter
} = require('./routes/financeRoute');
// 关于相关
const {
  aboutMainRouter,
  noticeDetail,
  newsDetail
} = require('./routes/aboutRoute');
// 帮助相关
const {
  helpMainRoute
} = require('./routes/helpRoute');
// 市场相关
const {
  marketMainRoute
} = require('./routes/marketRoute');
// 其他静态页面路由
const {
  otherMainRoute
} = require('./routes/otherRoute');
// 创建服务
const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3003,
  host: '127.0.0.1',
  routes: {
    // 静态文件配置
    files: {
      relativeTo: Path.join(__dirname, '../public')
    },
    // cookie 解析
    state: {
      parse: true, failAction: 'ignore'
    }
  }
});
server.register(plugins)
.then(()=>{
  // 配置视图
  server.views({
    engines: {
      njk: {
        compile: function (src, options) {
          var template = Nunjucks.compile(src, options.environment);
          return function (context) {
            return template.render(context);
          };
        },
        prepare: function (options, next) {
          options.compileOptions.environment = Nunjucks.configure(options.path, { watch: false });
          options.compileOptions.environment.addGlobal('cdnHost',process.env.NODE_ENV === 'production'?'//s1.lingtouniao.com':'//st.lingtouniao.com')
          // options.compileOptions.environment.addFilter('formatPlatformData',function(platformData, unit){
          //   if(platformData>unit){
          //     return Math.floor(platformData/unit)
          //   }
          //   return str.slice(0, count || 5);
          // })
          return next();
        }
      }
    },
    isCached: process.env.NODE_ENV === 'production',
    path: Path.join(__dirname, '../views'),
    defaultExtension: 'njk'
  });
  // 路由注册
  // 首页路由
  homeRoute(server);
  // 理财路由
  financeListRoute(server);
  // 理财详情路由
  financeDetailRouter(server);
  //下单确认路由
  confimPaymentRouter(server);
  //下单结果路由
  paymentResultRouter(server);
  // 关于我们路由
  aboutMainRouter(server);
  noticeDetail(server);
  newsDetail(server);
  // 帮助路由
  helpMainRoute(server);
  // 市场相关
  marketMainRoute(server);
  // 其他路由
  otherMainRoute(server);
  // 配置静态资源路径
  server.route({
    method:'GET',
    path:'/demo',
    handler:function(request, reply){
      reply.views('demo')
    }
  })
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  });
  server.ext('onPreResponse', function(request, reply){
    const response = request.response;
    // 响应崩溃
    if(response.isBoom){
      switch (response.output.statusCode) {
      case 404:
        server.log(['error'],response.request);
        reply.view(ErrorRouter.error404);
        break;
      case 500:
        reply.view(ErrorRouter.error500)
        break;
      default:
        reply.view(ErrorRouter.error500)
      }
    }else{
      return reply.continue();
    }
  });
  return server.start();
},err=>{
  throw new Error('插件注册失败')
})
.then(()=>{
  console.info("服务启动成功:",server.info);
},err=>{
  console.error('promise 异常捕获');
  console.error("服务启动失败:",err);
})
.catch(err=>{
  console.error('异常捕获');
  console.error('服务启动异常',err);
})
