const path = require('path');
const visionOptions = {};
const inertOptions = {};

const logPath = process.env.LOG_PATH || './log';
const logFileSize = process.env.LOG_FILE_SIZE || '10M';

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

function generatorOps(time, index) {
    if(! time)
      return "ops.log";
    var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day    = pad(time.getDate());
    var hour   = pad(time.getHours());
    var minute = pad(time.getMinutes());
    return month + "/" + month +
        day + "-" + hour + minute + "-" + index + "-ops.log.zip";
}
function generatorHttp(time, index) {
    if(! time)
      return "http.log";
    var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day    = pad(time.getDate());
    var hour   = pad(time.getHours());
    var minute = pad(time.getMinutes());
    return month + "/" + month +
        day + "-" + hour + minute + "-" + index + "-http.log.zip";
}
function generatorError(time, index) {
    if(! time)
      return "error.log";
    var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day    = pad(time.getDate());
    var hour   = pad(time.getHours());
    var minute = pad(time.getMinutes());
    return month + "/" + month +
        day + "-" + hour + minute + "-" + index + "-error.log.zip";
}
function generatorLog(time, index) {
    if(! time)
      return "serverLog.log";
    var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day    = pad(time.getDate());
    var hour   = pad(time.getHours());
    var minute = pad(time.getMinutes());
    return month + "/" + month +
        day + "-" + hour + minute + "-" + index + "-serverLog.log.zip";
}

const goodOptions = {
  ops: {
    interval: 5000 // 设置心跳日志频率
  },
  reporters: { // 日志集合
    opsfileReporter: [
      // 日志压缩机，针对 Event Types： ops，response，log，error，request
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            ops: '*'
          }
        ]
      }, {
        module: 'good-console',
        args: [
          {
            format: 'YYYY-MM-DD HH:mm:ss',
            utc: false
          }
        ]
      }, {
        module: 'rotating-file-stream',
        args: [
          generatorOps, {
            interval:'1d',
            path: logPath,
            compress: function(source, dest){
              return "cat " + source + " | gzip -c9 > " + dest;
            },
            mode: {
              flags: 'w',
              encoding: 'utf8',
              fd: null,
              mode: 0o666,
              autoClose: true
            }
          }
        ]
      }
    ],
    httpFileReporter:[
      // 日志压缩机，针对 Event Types： ops，response，log，error，request
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            response: '*'
          },{
            request:'*'
          }
        ]
      }, {
        module: 'good-console',
        args: [
          {
            format: 'YYYY-MM-DD HH:mm:ss',
            utc: false
          }
        ]
      },
      {
        module: 'rotating-file-stream',
        args: [
          generatorHttp, {
            interval:'1d',
            path: logPath,
            compress: function(source, dest){
              return "cat " + source + " | gzip -c9 > " + dest;
            }
          }
        ]
      }
    ],
    errorFileReporter:[
      // 日志压缩机，针对 Event Types： ops，response，log，error，request
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            error: '*'
          }
        ]
      }, {
        module: 'good-console',
        args: [
          {
            format: 'YYYY-MM-DD HH:mm:ss',
            utc: false
          }
        ]
      },
      {
        module: 'rotating-file-stream',
        args: [
          generatorError, {
            interval:'1d',
            path: logPath,
            compress: function(source, dest){
              return "cat " + source + " | gzip -c9 > " + dest;
            }
          }
        ]
      }
    ],
    logFileReporter:[
      // 日志压缩机，针对 Event Types： ops，response，log，error，request
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            log: '*'
          }
        ]
      }, {
        module: 'good-console',
        args: [
          {
            format: 'YYYY-MM-DD HH:mm:ss',
            utc: false
          }
        ]
      },
      {
        module: 'rotating-file-stream',
        args: [
          generatorLog, {
            interval:'1d',
            path: logPath,
            compress: function(source, dest){
              return "cat " + source + " | gzip -c9 > " + dest;
            }
          }
        ]
      }
    ]
  }
};
// 服务端 hapijs的插件配置
module.exports = [
  // 视图引擎插件
  {
    register: require('vision'),
    options: visionOptions
  },
  // 静态资源插件
  {
    register: require('inert'),
    options: inertOptions
  },
   // 日志插件配置
  {
    register:require('good'),
    options:goodOptions
  }
];
