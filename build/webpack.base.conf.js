'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  // 入口起点(entry point)指示 webpack 应该使用src下的main.js这个模块，来作为构建其内部依赖图的开始。
  // 进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
  entry: {
    app: './src/main.js'
  },
  // output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    // 
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  // oader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。
  // loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
  // 重要的是要记得，在 webpack 配置中定义 loader 时，要定义在 module.rules 中，而不是 rules
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      // 在更高层面，在 webpack 的配置中 loader 有两个目标：
      // test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
      // use 属性，表示进行转换时，应该使用哪个 loader。
      // “嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.vue' 的路径」时，在你对它打包之前，先使用 vue-loader 转换一下。”
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',   // 加载 ES2015+ 代码。然后使用Babel转译为 JS文件
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]   // 只命中 node_modules 目录里的js文件，加快 Webpack 搜索速度
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,     // limit是10000了，就是让8kb之内的图片才编码   低于limit的图片进行base64编码，以减少http请求
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
