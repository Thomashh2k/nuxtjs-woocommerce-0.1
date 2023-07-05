<template>
  <NuxtPage/>
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
      const authorization = useCookie("authorization");
      const woocommerceSession = useCookie("woocommerce-session");
      cookie.value = null;
      authorization.value = null;
      woocommerceSession.value = null;
      refreshToken.value = null;
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.account-card-bg {
  background: rgb(50, 17, 102);
}
</style>