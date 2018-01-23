module.exports = {
  /**
   * [getBanner 获取打包的banner]
   * @param  {[type]} process [description]
   * @return {[type]}         [description]
   */
  getBanner:(process)=>{
    return `
    hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]
    builder: 领投鸟前端团队
    builder-env: ${process.title}:${process.version}
    version:${process.env.npm_package_version}
    project:${process.env.npm_package_des||'领投鸟项目'}
    `
  }
}
