export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: 'static',
  ssr: false,
  head: {
    title: 'พร้อมส่ง',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Prompt&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp',
      },
    ],
  },
  router: {
    middleware: 'cleanTempQty',
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://artisan.promptsong.com/api',
    // baseUrl: process.env.BASE_URL || 'http://localhost:5000/api',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/main.scss'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  moment: {
    defaultLocale: 'th',
    locales: ['th'],
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    'nuxt-material-design-icons-iconfont',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios

  axios: {
    //baseURL: 'https://picsum.photos',
    baseURL: 'http://localhost:50598/api', //Mock auth api from node server
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },

  // auth: {
  //   strategies: {
  //     local: {
  //       endpoints: {
  //         login: {
  //           url: 'authenticate/login',
  //           method: 'post',
  //           propertyName: 'token',
  //         }, //Call mock auth api and store token into local storage via auth stage.
  //         user: { url: 'profile', method: 'get', propertyName: false }, //If login success call mock profile api and store profile obj into local storage via auth stage.
  //         logout: false,
  //       },
  //     },
  //   },
  //   redirect: {
  //     login: '/auth', //If auth fail redirect to login
  //   },
  // },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  vuetify: {
    iconfont: 'md',
    theme: {
      themes: {
        light: {
          primary: '#4CAF50',
          secondary: '#616161',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          titel: '#469B5C',
          groupTital: '#DD6241',
          make: '#B5B5B5',
          unit: '#757575',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.performance.maxAssetSize = 700 * 1024
    },
    // vendor: ['vue2-google-maps', 'vue-browser-geolocation'],
  },
  plugins: [
    { src: '~/plugins/vue2-google-maps.js' },
    { src: '~/plugins/vue-browser-geolocation.js' },
    { src: '~/plugins/vuex-persisedstate.js', ssr: false },
    { src: '~/plugins/v-modal.js', ssr: false },
    { src: '~/plugins/vue-carousel.js', ssr: false },
    { src: '~/plugins/loading.js', ssr: false },
    { src: '~/plugins/qrcode-promptpay.js', ssr: false },
  ],
}
