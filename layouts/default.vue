<template>
  <div>
    <LayoutNavbar />
      <v-row class="main-body-part">
        <v-col cols="1"></v-col>
        <v-col class="content">
          <slot />
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    <LayoutFooter />
    <!-- <LayoutStickyFooter /> -->
  </div>
</template>
<style scoped>
.content {
  padding-top: 102px;
}
</style>