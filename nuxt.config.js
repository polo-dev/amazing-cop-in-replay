const webpack = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Spotify To Youtube',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Un projet Nuxt.js permettant de transformer une playlist spotify en playlist youtube' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  router: {
    middleware: 'check_auth'
  },
  /*
  ** Customize the progress bar color
  */
  loading: '~/components/Loading.vue',
  /*
  ** Build configuration
  */
  build: {
    devMiddleware: {
      mode: 'development',
      context: __dirname,
      noInfo: true,
      quiet: true,
      reload: true,
      entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './service/spotify.js',
        './service/youtube.js',
      ],
      output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
      },
    },
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: [
      'axios',
      'lodash',
      //'vue-notifications'
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.ProvidePlugin({
        '$': 'jquery',
        '_': 'lodash',
        'anime': '~/plugins/vue-animejs'
        // ...etc.
      }),
    ],
  },
  env: {
    url: 'http://localhost:3000',
    port: 3000
  },
  buildModules: [
    'cookie-universal-nuxt',
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    icons: {
      iconfont: 'mdiSvg'
    }
  }
}

