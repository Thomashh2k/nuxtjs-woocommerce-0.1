// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    themes: {
      normal: {
        colors: {
          primary: colors.red.darken1,
          danger: colors.red,
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})