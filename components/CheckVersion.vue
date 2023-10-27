<template>
  <v-toolbar
    v-if="newBuild"
    dense
    class="success lighten-2"
  >
    <v-toolbar-title class="flex text-center">
      Update wird geladen
    </v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: 'CheckVersion',
  data: () => ({
    newBuild: false,
    userBuildVersion: localStorage.getItem('userBuildVersion'), // act. client version
    serverBuildVersion: null // act. server version
  }),
  async mounted() {
    debugger
    try {
      await fetch('https://og-gaming.store/build.json', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (res) => {
        const body = await res.json()
        this.serverBuildVersion = body.version
        if (this.userBuildVersion !== null) {
        if (this.newVersionAvailable()) {
          this.updateClientVersion()
        }
      } else if (this.userBuildVersion === null) {
        localStorage.setItem('userBuildVersion', this.serverBuildVersion)
      }
      }).catch((err) => {
        console.error(err)
      })
    } catch (e) {
      this.stop()
    }
  },
  methods: {
    newVersionAvailable() {
      return (
        typeof this.serverBuildVersion !== 'undefined' &&
        this.userBuildVersion !== this.serverBuildVersion
      )
    },
    updateClientVersion() {
      localStorage.setItem('userBuildVersion', this.serverBuildVersion)
      window.location.reload()
      this.newBuild = true
    },
    stop() {
      window.stop()
    }
  }
}
</script>

<style scoped>
</style>
