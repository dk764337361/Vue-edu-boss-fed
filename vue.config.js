// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时⽣效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使⽤ `scss` 选项，对 `scss` 语法进⾏单独配置
      scss: {
        // 将路径修改为实际路径，添加 /styles 部分
        // prependData: '@import "~@/styles/variables.scss";'
        additionalData: '@import "~@/styles/variables.scss";'
      }
    }
  }
}
