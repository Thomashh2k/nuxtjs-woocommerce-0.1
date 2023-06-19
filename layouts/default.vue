<template>
  <div class="tw-bg-violet-900 wrapper">
    <LayoutNavbar />
    <article class="main-body-part content" style="height: 100%; background: #1a063a;">
      <v-row>
        <v-col sm="1" md="1" lg="1" xl="1"></v-col>
        <v-col cols="12" sm="10" md="10" lg="10" xl="10">
          <slot  />
        </v-col>
        <v-col sm="1" md="1" lg="1" xl="1"></v-col>
      </v-row>
    </article>
    <v-snackbar
      v-model="message"
      :timeout="3000"
      :color="snackbar.getType === 'error' ? 'red' : snackbar.getType"
      multi-line
    >
    <div class="tw-text-purple-50" v-html="message">

    </div>
      <template v-slot:actions>
        <v-btn
          classs="tw-text-purple-50"
          variant="text"
          @click="closeSnackbar"
        >
          Schließen
        </v-btn>
      </template>
    </v-snackbar>
    <LayoutFooter class="footer"  />
  </div>
</template>
<script>
import { storeToRefs } from 'pinia';
import { useSnackbar } from "@/store/snackbar";

export default {
  setup() {
    const snackbar = useSnackbar();
    const { message } = storeToRefs(snackbar)
    return { snackbar, message }
  },
  data() {
    return {
      showSnackbar: false,
      msg: null,
      footerIsBottom: true,
      bottom: false
    }
  },
  watch: {
    message(newVal, oldVal) {
      if(newVal !== oldVal) {
        setTimeout(() => {
          this.snackbar.removeMessage();   
        }, 3000)
      }
    },
    $route(newVal, oldVal) {
      this.$nextTick(() => {
        this.footerIsBottom = this.isFooterAtBottom()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.footerIsBottom = this.isFooterAtBottom()
    })
    window.addEventListener("resize", () => { this.footerIsBottom = this.isFooterAtBottom() })
  },
  beforeUnmount() {
    window.removeEventListener("resize", () => { this.footerIsBottom = this.isFooterAtBottom() })
  },
  methods: {
    closeSnackbar() {
      this.showSnackbar = false;
      this.snackbar.removeMessage();
    },
    isFooterAtBottom() {
      const content = document.getElementsByClassName('main-body-part')[0].getBoundingClientRect().height
      console.log('content: ', content , 'window.innerHeight: ', window.innerHeight)
      return document.getElementsByClassName('main-body-part')[0].getBoundingClientRect().height >= window.innerHeight;
      // return document.getElementById('footer').getBoundingClientRect().bottom <= window.innerHeight;
    }
  }
}
</script>
<style scoped>
.content {
  padding-top: 75px;
  flex: 1; /* Der Inhalt nimmt den verfügbaren Platz im flexiblen Layout ein */

}
.stickToBottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.wrapper {
  min-height: 100vh; /* Die minimale Höhe des Wrapper-Elements auf 100% der Viewport-Höhe setzen */
  display: flex;
  flex-direction: column;
}

.footer {
  flex-shrink: 0; /* Der Footer wird nicht verkleinert, um den verfügbaren Platz zu teilen */
}
</style>