const {
  OtherStaticRoute
} = require('./route.config');
const instance = require('../api/instance');
function handlerActlist(request, reply){
  instance.get('/get/activities')
  .then((data) => {
    reply.view(OtherStaticRoute.actlist, {
      activityList: data.result
    })
  })
  .catch(err => {
    throw new Error('服务器异常')
  })
}

const otherMainRoute = (server)=>{
  server.route({
    method:"GET",
    path:"/other/{pageName?}",
    handler:function(request,reply){
      const { pageName } = request.params;
      if (pageName && OtherStaticRoute[pageName]){
        switch (pageName) {
          case 'actlist':
            handlerActlist(request, reply)
            break;
          case 'downloadapp':
            reply.view(OtherStaticRoute['downloadapp'],{
              TopNavDownloadIsSelected:'selected'
            });
            break;
          case 'safeguards':
            reply.view(OtherStaticRoute['safeguards'],{
              TopNavSafeIsSelected:'selected'
            });
            break;
          case 'rechargeok':
            reply.view(OtherStaticRoute['rechargeok'],{
              result:'success'
            });
            break;
          case 'rechargedefeat':
            reply.view(OtherStaticRoute['rechargedefeat'],{
              result:'defeat'
            });
            break;
          default:
            reply.view(OtherStaticRoute[pageName]);
        }
      }else{
        reply.view(OtherStaticRoute['error404']);
      }
    }
  })
}

module.exports = {
  otherMainRoute
};
