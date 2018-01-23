const {
  MarketMainRoute
} = require('./route.config');
const marketMainRoute = (server) => {
  server.route({
    method: 'GET',
    path: '/market/{pageName?}',
    handler: function(request, reply) {
      const {pageName} = request.params;
      if (pageName && MarketMainRoute[pageName]) {
        reply.view(MarketMainRoute[pageName]);
      } else {
        reply.view(MarketMainRoute['error404'], {TopNavIsAbsolute: 'top-nav-rewrite-wrap'}); // TODO
      }
    }
  })
}
module.exports = {
  marketMainRoute
};
