<template>
  <v-card class="account-card-bg">
    <v-tabs
    v-if="!$route.path.includes('register')"
      class="tw-bg-violet-900"
    >
    </v-tabs>
    <v-card-text style="margin: unset; padding: unset">
      <NuxtPage/>
    </v-card-text>
  </v-card>
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
      const cookie = useCookie("woo-session");
      const authorization = useCookie("authorization");
      const woocommerceSession = useCookie("woocommerce-session");
      const refreshToken = useCookie("refreshToken");
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