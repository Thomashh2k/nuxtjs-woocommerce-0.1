// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  components: true,
  css: ["~/assets/css/main.css", "~/assets/css/animate.min.css", 'vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '~/assets/css/output.css', '~/assets/css/styles.css'],
  build: {
    transpile: ['vuetify', 'vee-validate'],
  },
  devtools: true,
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    "@pinia/nuxt",
    // '@nuxtjs/axios',
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/apollo",
    // '@sidebase/nuxt-auth',
    // "@nuxtjs/auth-next",
    // "@nuxtjs/auth",
    // "@nuxtjs/axios",
    "@formkit/nuxt",
    "nuxt-icon",
  ],
  // auth: {
  //   strategies: {
  //     graphql: {
  //       scheme: '~/schemes/graphqlScheme.js',
  //     },
  //   },
  //    redirect: {
  //    logout: '/',
  //     callback: false,
  //     home: '/',
  //   },
  // },
  // axios: {
  //   baseURL: 'http://localhost:8080'
  // },
  plugins: ["~/plugins/apollo.js"],
  runtimeConfig: {
    public: {
      PUBLIC_GRAPHQL_URL: 'https://api.og-gaming.store:8080/graphql',
      STRIPE_PAYMENT_API: 'http://localhost:1337',
      SERVER_DOMAIN: 'https://api.og-gaming.store'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      charset: "utf-16",
      viewport: "width=500, initial-scale=1",
      meta: [{ name: "description", content: "Nuxt 3 - Woocommerce" }],
      script: [
        {
          src: 'https://x.klarnacdn.net/kp/lib/v1/api.js',
          type:'text/javascript',
          crossorigin: "anonymous",
          async: true
        }
      ]
    },
    // global transition
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  apollo: {
    authType: "Session",
    authHeader: "woocommerce-session",
    tokenStorage: "cookie",
    tokenName: "woocommerce-session",
    clients: {
      default: {
        httpEndpoint: 'https://api.og-gaming.store:8080/graphql',
        httpLinkOptions: {
          credentials: "include",
        },
      },
    },
  },
});
