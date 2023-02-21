<template>
  <div class="tw-container tw-mx-auto tw-mt-24 tw-max-w-[84.375rem]">
    <footer
      class="tw-px-6 tw-text-center tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-lg"
    >
      <div class="p-6">
        Copyright reserved &copy; {{ todayDate }} Daniel / w3bdesign
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from "vue";

const todayDate = computed(() => new Date().getFullYear());
</script>
