// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,
  components: true,
  css: ["~/assets/css/main.css", "~/assets/css/animate.min.css", 'vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '~/assets/css/output.css', '~/assets/css/styles.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/apollo",
    "@formkit/nuxt",
    "nuxt-icon",
  ],
  plugins: ["~/plugins/apollo"],
  runtimeConfig: {
    public: {
      graphqlURL: process.env.PUBLIC_GRAPHQL_URL,
      placeholderImage: process.env.PUBLIC_PLACEHOLDER_SMALL_IMAGE_URL,
    },
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
        httpEndpoint: 'http://localhost:8080/graphql',
        httpLinkOptions: {
          credentials: "include",
        },
      },
    },
  },
});
