const pkg = require('../package.json');
// 环境区分
const env = {
  // 输出主路径
  path:`./public/${pkg.version}`,
  // 资源cdn路径
  publicPath:`/${pkg.version}/`,
  // 输出外部css文件路径
  cssFileName:'stylesheet/[name].css',
  // 输出外部js文件路径
  jsFileName:'javascript/[name].js',
  // 输出外部img文件路径
  imgFileName:'images/[name]-[hash:5].[ext]',
  // 输出外部img文件路径
  fontFileName:'fonts/[name].[ext]',
  // 输出外部html文件路径
  htmlFilePath:'../../views/build/',
  cdnHost:'//st.lingtouniao.com'
}
// 执行脚本，处理环境变量
switch (process.env.NODE_ENV) {
  // 本地开发环境
  case 'development':
    break;
  // 内网测试环境
  case 'test':
    env.path = `./public/${pkg.version}`;
    env.publicPath = `//st.lingtouniao.com/web/${pkg.version}/`;
    env.htmlFilePath = `../../views/build/`;
    env.cdnHost = '//st.lingtouniao.com';
    break;
  // 生产环境
  case 'production':
    env.path = `./public/${pkg.version}`;
    env.publicPath = `//s1.lingtouniao.com/web/${pkg.version}/`;
    env.htmlFilePath = `../../views/build/`;
    env.cdnHost = '//s1.lingtouniao.com';
    break;
  default:
    throw new Error('环境参数不正确');
}

console.log('构建配置参数:',env)

module.exports = env;
