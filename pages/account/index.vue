<template>
    <div>
        /account
        <v-btn @click="logout"></v-btn>
    </div>
</template>
<script>
import { useAuth } from "@/store/useAuth";

export default {
  // middleware: 'auth'
  name: 'account',
  watch: {
    'authStore.isLoggedIn'() {
      this.$router.push('/')
    }
  },
  data() {
    return {
      authStore: useAuth()
    }
  },
  methods: {
    logout() {
      this.authStore.logout()
      this.$router.push('/')
    }
  }
}
</script>