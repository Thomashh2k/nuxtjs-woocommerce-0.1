<template>
    <footer
      class="tw-p-10 tw-bg-violet-900 tw-h-40 footer-gradient tw-w-full tw-z-50 tw-pb-10"
    >
    <v-row>
      <v-col>
        <div class="tw-flex tw-flex-col">
          <nuxt-link class="hover:tw-underline tw-cursor-pointer" to="/impressum">Impressum</nuxt-link>
          <nuxt-link class="hover:tw-underline tw-cursor-pointer" to="/agb">AGB</nuxt-link>
        </div>
      </v-col>
      <v-col>
        <div class="tw-flex tw-flex-col">
          <nuxt-link class="tw-flex tw-justify-end hover:tw-underline tw-cursor-pointer">Wiederufsrecht</nuxt-link>
          <nuxt-link class="tw-flex tw-justify-end hover:tw-underline tw-cursor-pointer">Rückgaberecht</nuxt-link>
          <nuxt-link class="tw-flex tw-justify-end hover:tw-underline tw-cursor-pointer" to="/datenschutzerklaerung">Datenschutzerklärung</nuxt-link>
        </div>
      </v-col>
    </v-row>
    </footer>
</template>

<script setup>
import { computed } from "vue";

const todayDate = computed(() => new Date().getFullYear());
</script>
<style scoped>
.footer-gradient {
  background-image: linear-gradient(#1a063a, #4c1d95);
}

</style>