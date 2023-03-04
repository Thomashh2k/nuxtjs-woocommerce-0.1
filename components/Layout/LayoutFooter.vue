<template>
  <div class="tw-bg-violet-900 tw-h-40 footer-gradient tw-bottom-0 tw-z-50">
    <footer
      class="tw-p-10 tw-bottom-0"
    >
    <v-row>
      <v-col>
        <div class="tw-flex tw-flex-col">
          <nuxt-link>Impressum</nuxt-link>
          <nuxt-link>AGB</nuxt-link>
        </div>
      </v-col>
      <v-col>
        <div class="tw-flex tw-flex-col">
          <div class="tw-flex tw-justify-end">
            <nuxt-link>Wiederufsrecht</nuxt-link>
            <nuxt-link>Rückgaberecht</nuxt-link>
          </div>
        </div>
      </v-col>
    </v-row>
    </footer>
  </div>
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