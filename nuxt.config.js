export default {
  ssr: false,
  telemetry: false,

  /*
   ** Headers of the page
   */
  head: {
    title: 'Fireflies',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      {
        property: 'og:title',
        content: 'Fireflies'
      },
      {
        property: 'twitter:title',
        content: 'Fireflies'
      },
      {
        property: 'og:image',
        content: '/images/og-image.png'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.png' },
      { rel: 'stylesheet', href: '/webfonts/fonts.css' },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/webfonts/fa-brands-400.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/webfonts/fa-duotone-900.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/webfonts/fa-light-300.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/webfonts/fa-regular-400.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/webfonts/fa-solid-900.woff2'
      }
    ]
  },
  loadingIndicator: {
    name: 'cube-grid',
    color: 'white',
    background: 'linear-gradient(90deg, #10507f 0.35%, #00adb5 100%)'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#008C92' },

  /*
   ** Global CSS
   */
  css: ['~assets/css/all.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/filters.js',
    '~plugins/api',
    '~plugins/persisted-state',
    '~plugins/eventbus',
    '~plugins/gmap',
    /* '~plugins/idletime', */
    '~plugins/input-mask'
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/juliomrqz/nuxt-netlify
    '@aceforth/nuxt-netlify'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      'nuxt-bugsnag',
      {
        apiKey: process.env.BUGSNAG_API_KEY,
        publishRelease: true,
        reporterOptions: {
          autoAssignRelease: true
        },
        config: {
          releaseStage:
            process.env.NODE_ENV !== 'development'
              ? process.env.RELEASE_STAGE
              : 'development', // dev, test, live
          enabledReleaseStages: ['dev', 'test', 'live']
        }
      }
    ],
    'vue-scrollto/nuxt',
    '@nuxtjs/recaptcha',
    '@nuxt/http',
    'nuxt-i18n',
    '@nuxtjs/gtm'
  ],

  recaptcha: {
    hideBadge: false,
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    language: 'en',
    version: 2,
    size: 'normal' // Size: 'compact', 'normal', 'invisible' (v2)
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en', file: 'en.js' },
      { code: 'hu', iso: 'hu', file: 'hu.js' },
      { code: 'cs', iso: 'cs', file: 'cs.js' },
      { code: 'de', iso: 'de', file: 'de.js' },
      { code: 'ro', iso: 'ro', file: 'ro.js' },
      { code: 'ru', iso: 'ru', file: 'ru.js' },
      { code: 'sk', iso: 'sk', file: 'sk.js' },
      { code: 'es', iso: 'es', file: 'es.js' },
      { code: 'pl', iso: 'pl', file: 'pl.js' },
      { code: 'tr', iso: 'tr', file: 'tr.js' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    lazy: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en'
    },
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true
    }
  },

  env: {
    NODE_ENV: process.env.NODE_ENV,
    CONTEXT: process.env.CONTEXT,
    BRANCH: process.env.BRANCH,
    BACKEND_URL: process.env.BACKEND_URL,
    RELEASE_STAGE: process.env.RELEASE_STAGE,
    SEARCH_INTERVAL: 5000,
    GMAPS_API_KEY: process.env.GMAPS_API_KEY,
    GTAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE
  },

  gtm: {
    enabled: process.env.NODE_ENV === 'production'
  },

  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID
    }
  },

  netlify: {
    mergeSecurityHeaders: true,
    // tried to make netlify redirects work, but there was no time to test them further so went with a middleware instead
    // leaving the lib here to add security headers and to enable it for future use
    redirects: [
      /* {
        from: '/cz/*',
        to: '/cs/:splat'
      } */
    ]
  },

  hooks: {
    build: {
      async before() {
        // kényelem miatt jöhet mindig
        /* if (process.env.NODE_ENV === 'development') {
          return
        } */

        const fetch = require('node-fetch')
        const fs = require('fs').promises

        const languages = [
          'en',
          'hu',
          'cs',
          'sk',
          'ro',
          'ru',
          'es',
          'de',
          'tr',
          'pl'
        ]

        let site = 'testnewadmin'
        if (process.env.RELEASE_STAGE === 'test') {
          site = 'testnewadmin'
        } else if (process.env.RELEASE_STAGE === 'live') {
          site = 'newadmin'
        }

        for (let i = 0; i < languages.length; i++) {
          try {
            const res = await fetch(
              'https://' +
                site +
                '.fireflies.com/localization/locale-' +
                languages[i] +
                '.js'
            )

            const langText = await res.text()
            await fs.writeFile('./lang/' + languages[i] + '.js', langText)
          } catch (error) {
            throw new Error('Localization download error: ' + error)
          }

          console.log(languages[i] + '.js was downloaded successfully')
        }
      }
    }
  },

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    // analyze: process.env.NODE_ENV === 'development', // npx nuxt build --analyze
    /* filenames: {
      chunk: () => '[name].js'
    }, */
    /*
     ** You can extend webpack config here
     */
    transpile: [/^gmap-vue($|\/)/],
    postcss: {
      plugins: {
        'postcss-preset-env': {
          features: {
            customProperties: false
          }
        }
      }
    },
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
