<template>
  <div>
    <LayoutNavbar />
    <article class="main-body-part content" style="height: 100%;">
      <v-row>
        <v-col cols="1"></v-col>
        <v-col>
          <slot />
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </article>
    <LayoutFooter />
    <!-- <LayoutStickyFooter /> -->
  </div>
</template>
<script>
import { computed } from "vue";

export default {
  data() {
    if (process.client) {
      return {
        headerHeight: document.getElementsByTagName('header')[0].clientHeight,
        footerHeight: document.getElementsByTagName('footer')[0].clientHeight,
        articleHeight: document.getElementsByTagName('article')[0].clientHeight,
        windowHeight: window.innerHeight,
        bodyHeight: 0
      }
    } else {
      return {
        headerHeight: 0,
        footerHeight: 0,
        articleHeight: 0,
        windowHeight: 0,
        bodyHeight: 0
      }
    }
  },
  watch: {
    $route(to, from) {
      debugger
      this.articleHeight = document.getElementsByTagName('article')[0].clientHeight
      if(this.articleHeight > this.windowHeight) {
        this.bodyHeight = this.articleHeight
      }
      else {
        this.bodyHeight = this.windowHeight
      }
    }
  },
  created() {
    this.bodyHeight = this.windowHeight - this.headerHeight
  }
}
</script>
<style scoped>
.content {
  padding-top: 102px;
}
</style>