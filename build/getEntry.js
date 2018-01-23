const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const lodash = require('lodash');
const entry = {},
htmlWebpackPlugin = [];
// commonChunks = [];

function getEntry(pagesPath,env) {
  console.log('页面根目录:',pagesPath);
  // 获取页面模块
  const pageArray = fs.readdirSync(pagesPath);
  lodash.forEach(pageArray,(pageName,index)=>{
    entry[pageName] = `${pagesPath}/${pageName}/${pageName}.js`;
    const temp = new HtmlWebpackPlugin({
      template:`${pagesPath}/${pageName}/${pageName}.pug`,
      filename:`${env.htmlFilePath}${pageName}.njk`,
      // filename:process.env.NODE_ENV === 'dev'?`${pageName}.html`:`../../views/client-templates/${pageName}.njk`,
      chunks:['manifest','common',pageName],
      hash:false
    });
    htmlWebpackPlugin.push(temp);
  });
  return {
    entry,
    htmlWebpackPlugin
  }
}


module.exports = getEntry;
