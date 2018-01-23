const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const WebpcakUtil = require('./webpack.util');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const lodash = require('lodash');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const env = require('./build/env');
const getEntryAndHtmlTemplate = require('./build/getEntry')(path.resolve('pages'),env);

// style extract
const extractSCSS = new ExtractTextPlugin(env.cssFileName);
// babel options
const options = {
  presets: ['env','stage-2']
}

// nodejs  commonjs  module 方式处理模块
module.exports = {
  target:'web',
  devServer:{
    // contentBase: path.join(__dirname, "templates"),
    port: 8080,
    // publicPath: path.join(__dirname, "public")
  },
  entry:getEntryAndHtmlTemplate.entry,
  output:{
    // 必须是个绝对路径
    path:path.resolve(__dirname,`${env.path}`),
    publicPath:env.publicPath, //process.env.NODE_ENV==='production'?'/static-client':'/',
    filename: env.jsFileName,//"[name].js",
    chunkFilename:env.jsFileName//"[id].js"
  },
  module:{
    rules:[
      // 处理js文件
      {
        test: /\.js$/,
         exclude: /(node_modules|bower_components)/,
         use: {
           loader: 'babel-loader',
           options: options
         }
      },
      // 处理scss 文件
      {
        test:/\.(scss|css)$/,
        use:extractSCSS.extract([
          // 解析css
          {
            loader:'css-loader'
          },
          // 解析scss
          {
            loader:'sass-loader',
            options:{
              data: '$cdnHost: '+`"${env.cdnHost}"`+' ;'// 这个地方处理，scss中需要访问cdn资源的主域名
            }
          }
        ])
      },
      // 处理 页面级别的 pug
      {
        test:/\.pug$/,
        use:[
          {
            loader:'pug-loader',
            options:{
              pretty:true,
              globals:{
                cdnHost:'hello'
              }
            }
          }
        ]
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: env.imgFileName,//'imgs/[name]-[hash:5].[ext]',
              publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
            }
          }
        ]
      },
      // 处理字体
      {
       test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
       use:{
         loader: 'url-loader',
         options:{
           limit:15000,
           minetype:'application/font-woff',
           name:env.fontFileName,////'fonts/[name]-[hash:5].[ext]',
           publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
         }
       }
      },
      {
       test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
       use:{
         loader: 'url-loader',
         options:{
           limit:15000,
           minetype:'application/font-woff',
           name:env.fontFileName,////'fonts/[name]-[hash:5].[ext]',
           publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
         }
       }
      },
      {
       test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
       use:{
         loader: 'url-loader',
         options:{
           limit:15000,
           minetype:'application/octet-stream',
           name:env.fontFileName,////'fonts/[name]-[hash:5].[ext]',
           publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
         }
       }
      },
      {
       test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
       use:{
         loader: 'url-loader',
         options:{
           limit:10000,
           minetype:'application/octet-stream',
           name:env.fontFileName,////'fonts/[name]-[hash:5].[ext]',
           publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
         }
       }
      },
      {
       test: /webfont.svg?$/,
       use:{
         loader: 'url-loader',
         options:{
           limit:10000,
           minetype:'application/octet-stream',
           name:env.fontFileName,////'fonts/[name]-[hash:5].[ext]',
           publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
         }
       }
      },
      {
        test: /\.svg$/,
        use:{
          loader: 'file-loader',
          options:{
            limit:10000,
            name:env.fontFileName,////'fonts/[name]-[hash:5].[ext]',
            publicPath:env.publicPath,//process.env.NODE_ENV==='production'?'/static-client/':'/'
          }
        }
      }
    ]
  },
  externals:{
    'jquery':'jQuery'
  },
  plugins:lodash.concat([
    new CleanWebpackPlugin([`public/${pkg.version}/`,'views/build/']),
    new webpack.BannerPlugin({
      banner: WebpcakUtil.getBanner(process)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:'common',
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    extractSCSS
  ],getEntryAndHtmlTemplate.htmlWebpackPlugin)
};
