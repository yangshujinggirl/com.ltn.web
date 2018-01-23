const instance = require('../api/instance');
const {
  HelpRoute
} = require('./route.config');
function handlerBankLimit(request, reply){
  instance.get('/bank/list/bk')
  .then((data) => {
    console.log(data.bankInfoList);
    reply.view(HelpRoute['trade'], {
      bankList: data.bankInfoList
    })
  })
  .catch(err => {
    console.log(err);
    throw new Error('服务器异常')
  })
}

const helpMainRoute = (server)=>{
  server.route({
    method: "GET",
    path: "/help/{pageName?}",
    handler: function (request, reply) {
      const { pageName } = request.params;
      if (pageName && HelpRoute[pageName]) {
        if(pageName == 'trade'){
          handlerBankLimit(request, reply);
        }else{
          reply.view(HelpRoute[pageName]);
        }
      } else {
        reply.view(HelpRoute.aboutltn);
      }
    }
  })
}
module.exports = {
  helpMainRoute
};
