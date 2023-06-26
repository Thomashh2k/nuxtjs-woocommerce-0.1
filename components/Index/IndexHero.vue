<template>
  <v-carousel id="hero">
    <v-carousel-item
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      cover
    ></v-carousel-item>

    <v-carousel-item
      src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
      cover
    ></v-carousel-item>

    <v-carousel-item
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      cover
    ></v-carousel-item>
    <template v-slot:prev="{ props }">
      <v-btn icon="mdi-chevron-left" @click="props.onClick" class="btn-bg-color"></v-btn>
    </template>
    <template v-slot:next="{ props }">
      <v-btn icon="mdi-chevron-right" @click="props.onClick" class="btn-bg-color"></v-btn>
    </template>
  </v-carousel>
</template>
<style scoped>
#hero {
  /* max-width: 100; */
}
.btn-bg-color {
  background-color: rgb(26, 6, 58);
  color: rgb(250 245 255);
}
</style>
