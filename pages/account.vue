<template>
  <v-card class="account-card-bg">
    <v-tabs
    v-if="!$route.path.includes('register')"
      v-model="tab"
      class="tw-bg-violet-900"
    >
      <v-tab to="/account/dashboard">
        <div class="tw-text-purple-50 tw-normal-case">Persöhnliche Daten</div>
      </v-tab>
      <v-tab to="/account/dashboard/orders">
        <div class="tw-text-purple-50 tw-normal-case">Bestellungen</div>
      </v-tab>
      <v-tab value="three">
        <div class="tw-text-purple-50 tw-normal-case">Item Three</div>
      </v-tab>
      <!-- <v-spacer />
      <div class="tw-flex tw-items-center tw-mr-4">
        <v-btn color="red" variant="outlined" @click="logout"><div class="tw-normal-case">Logout</div></v-btn>
      </div> -->
    </v-tabs>
    <v-card-text style="margin: unset; padding: unset">
      <v-window v-model="tab">
          <NuxtPage/>
      </v-window>
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