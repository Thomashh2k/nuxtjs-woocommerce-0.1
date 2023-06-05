<template>
  <div>
    <LayoutNavbar />
    <article class="main-body-part content" style="height: 100%;">
      <v-row>
        <v-col cols="1" sm="1" md="1" lg="1" xl="1"></v-col>
        <v-col cols="10" sm="10" md="10" lg="10" xl="10">
          <slot />
        </v-col>
        <v-col cols="1" sm="1" md="1" lg="1" xl="1"></v-col>
      </v-row>
    </article>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      :color="snackbar.getType === 'error' ? 'red' : 'green'"
      multi-line
    >
    <div class="tw-text-purple-50" v-html="msg">

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
    <LayoutFooter id="footer" :class="footerIsBottom ? '' : 'stickToBottom'"  />
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
      footerIsBottom: true
    }
  },
  watch: {
    message(newVal, oldVal) {
      if(newVal !== oldVal) {
        if(newVal === null) {
          this.showSnackbar = false;
          this.msg = null;
        } else if(newVal !== null) {
          this.showSnackbar = true;
          this.msg = newVal;
        }
      }
    },
    $route(newVal, oldVal) {
      if(newVal !== oldVal) {
        this.footerIsBottom = this.isFooterAtBottom()
      }
    }
  },
  created() {
    this.footerIsBottom = this.isFooterAtBottom()
  },
  methods: {
    closeSnackbar() {
      this.showSnackbar = false;
      this.snackbar.removeMessage();
    },
    isFooterAtBottom() {
      if(process.client) {
        return document.getElementById('footer').getBoundingClientRect().bottom <= window.innerHeight;
      } else {
        return true
      }
    }
  }
}
</script>
<style scoped>
.content {
  padding-top: 75px;
}

.stickToBottom {
  bottom: 0;
  position: absolute;
}
</style>