const pkg = require('./package')

module.exports = {
  //mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'http://api.map.baidu.com/api?v=2.0&ak=Qk4XGHvmWkjCTcYYjopw6jyYcvDm1sOm' },//百度地图api
      //{ src: 'http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js' },//测距js
      { src: 'http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js' },//点聚合
      { src: 'http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js' },//点聚合

    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [{
    src: '~assets/themes/index.scss',
    lang: 'scss'
  }],
  router: {
    middleware: ['auth']
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~plugins/config',
      ssr: true
    }, { 
      src: '~plugins/iview', 
      ssr: true 
    },{
      src: '~components/index',
      ssr: true
    },{
      src: '~plugins/axios/index',
      ssr: true
    }, {
      src: '~plugins/state-sync/index',
      ssr: false
    },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },
  server: {
    port: 8999, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
}
