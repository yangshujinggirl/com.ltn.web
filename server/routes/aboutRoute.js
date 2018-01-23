const instance = require('../api/instance');
const {AboutRoute} = require('./route.config');
const {
  page
} = require('../util');
// 处理媒体报道
const handlerAboutNews = (request, reply) => {
  let pageNum = request.query.pageNum
  const pageSize = 5;
  pageNum = Number.parseInt(pageNum);
  // 不是数字
  if (Number.isNaN(pageNum) || pageNum < 1) {
    pageNum = 1
  }
  // 抓取 平台公告数据
  instance.get('/pc/announcement/list', {
    params: {
      currentPage: pageNum - 1,
      pageSize,
      type: 2
    }
  }).then((data) => {
    const currentPage = pageNum,
      totalPage = Math.ceil(data.totalCount / pageSize);
    const pageNumArray = page(5, currentPage, totalPage);
    reply.view(AboutRoute.news, {
      TopNavIsAbsolute: 'top-nav-rewrite-wrap',
      newsList: data.announcementList,
      totalPage: Math.ceil(data.totalCount / pageSize),
      currentPage,
      pageNumArray
    });
  }).catch(err => {
    throw new Error('服务器异常')
  })
}
// 处理平台公告
const handlerAboutNoticePage = (request, reply) => {
  let pageNum = request.query.pageNum
  const pageSize = 10;
  pageNum = Number.parseInt(pageNum);
  // 不是数字
  if (Number.isNaN(pageNum) || pageNum < 1) {
    pageNum = 1
  }
  // 抓取 平台公告数据
  instance.get('/pc/announcement/list', {
    params: {
      currentPage: pageNum - 1,
      pageSize,
      type: 1
    }
  }).then((data) => {
    const currentPage = pageNum,
      totalPage = Math.ceil(data.totalCount / pageSize);
    const pageNumArray = page(5, currentPage, totalPage);
    reply.view(AboutRoute.notice, {
      TopNavIsAbsolute: 'top-nav-rewrite-wrap',
      noticeList: data.announcementList,
      totalPage: Math.ceil(data.totalCount / pageSize),
      currentPage,
      pageNumArray
    });
  }).catch(err => {
    throw new Error('服务器异常')
  })
}
// 处理平台运营报告
const handlerAboutReport = (request, reply) => {
  let type = request.query.type;
  if (!type) {
    type = 1;
  }
  if (type != 1 && type != 2 && type != 3) {
    type = 1;
  }
  instance.get('/report/yyReport', {params: {
      type
    }}).then((data) => {
    reply.view(AboutRoute.report, {
      TopNavIsAbsolute: 'top-nav-rewrite-wrap',
      reports: data.reports,
      type
    })
  }).catch(err => {
    throw new Error('服务器异常')
  })
}
// 主路由 处理
const aboutRouteHandler = (request, reply) => {
  const {pageName} = request.params;
  if (pageName && AboutRoute[pageName]) {
    switch (pageName) {
      case 'notice':
        handlerAboutNoticePage(request, reply)
        break;
      case 'report':
        handlerAboutReport(request, reply)
        break;
      case 'news':
        handlerAboutNews(request, reply)
        break;
      default:
        reply.view(AboutRoute[pageName], {TopNavIsAbsolute: 'top-nav-rewrite-wrap'});
    }
  } else {
    reply.view(AboutRoute.pltinfo, {TopNavIsAbsolute: 'top-nav-rewrite-wrap'});
  }
}
// 主路由
const aboutMainRouter = (server) => {
  server.route({method: "GET", path: "/about/{pageName?}", handler: aboutRouteHandler})
}
// 平台公告详情
const noticeDetail = (server) => {
  server.route({
    method: "GET",
    path: '/about/notice/{announcementId}',
    handler: function(request, reply) {
      instance.get('/pc/announcement/detail', {
        params: {
          announcementId: request.params.announcementId,
          type: 1
        }
      }).then((data) => {
        reply.view(AboutRoute.noticeDetail, {
          lastAnnouncement: data.lastAnnouncement,
          TopNavIsAbsolute: 'top-nav-rewrite-wrap'
        })
      }).catch(err => {
        throw new Error('服务器异常')
      })
    }
  })
}
// 平台新闻消息，媒体报道
const newsDetail = (server) => {
  server.route({
    method: "GET",
    path: "/about/news/{announcementId}",
    handler: function(request, reply) {
      instance.get('/pc/announcement/detail', {
        params: {
          announcementId: request.params.announcementId,
          type: 2
        }
      }).then((data) => {
        reply.view(AboutRoute.newsDetail, {
          lastAnnouncement: data.lastAnnouncement,
          TopNavIsAbsolute: 'top-nav-rewrite-wrap'
        })
      }).catch(err => {
        throw new Error('服务器异常')
      })
    }
  })
}
module.exports = {
  aboutMainRouter,
  noticeDetail,
  newsDetail
}
