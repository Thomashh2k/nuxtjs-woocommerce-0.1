<template>
  <section ref="section">
    <v-window v-if="productsPages.length > 0" center-active show-arrows id="product-container" class="slide-group-wrapper">
      <template v-slot:prev="{ props }">
        <v-btn icon="mdi-chevron-left" @click="props.onClick" class="btn-bg-color"></v-btn>
      </template>
      <template v-slot:next="{ props }">
        <v-btn icon="mdi-chevron-right" @click="props.onClick" class="btn-bg-color"></v-btn>
      </template>
      <v-window-item v-for="(productPage, index) in productsPages" :key="index" class="tw-flex tw-flex-row tw-justify-center">
        <ProductCard v-for="product in productPage" :product="product" />
      </v-window-item>
    </v-window>

  </section>
</template>
  
<script>
import { filteredVariantPrice, addProductToCart } from "@/utils/functions";
import ProductCard from "@/components/Products/ProductCard.vue";
import * as labsComponents from 'vuetify/labs/components'

export default {
  name: 'ProductsRow',
  props: {
    products: {type: Object, required: true}
  },
  components: {
    ...labsComponents,
    ProductCard
  },
  mounted() {
    
    if(process.client) {
      this.setProductsPages()
      window.addEventListener("resize", () => { this.setProductsPages() })
    }
  },
  data() {
    return {
      productsPages: [],
      productsLength: null
    }
  },
  beforeUnmount() {
    if(process.client) {
      window.removeEventListener("resize", () => { this.setProductsPages() })
    }
  },
  methods: {
    setProductsPages() {
      this.productsLength = this.productsGroupLength()
      this.productsPages = this.convertToTwoDimensionalArray(this.products.nodes, this.productsLength)
    },
    productImage(product) {
      const config = useRuntimeConfig();
      return product.image ? product.image.sourceUrl : config.placeholderImage;
    },
    async addToCart (product) {
      const result = await addProductToCart(product);
      if(result !== false) {
        errMsg = result.message
      }
    },
    convertToTwoDimensionalArray(arr, columns) {
      const result = [];
      const rows = Math.ceil(arr.length / columns);

      for (let i = 0; i < rows; i++) {
        result.push(arr.slice(i * columns, (i + 1) * columns));
      }

      return result;
    },
    productsGroupLength() {
      let _productsGroupLength = 0
      const slideGroupWrapper = this.$refs.section;
      const visibleWidth = slideGroupWrapper.getBoundingClientRect().width;
      let totalWidth = 0
      let itemWidth = 0
      if(window.innerWidth >= 2160) {
        itemWidth = 340
      } else if(window.innerWidth <= 1920) {
          itemWidth = 310
      } if(window.innerWidth <= 1280) {
          itemWidth = 240

      } if(window.innerWidth <= 960) {
          itemWidth = 180
      } 
      while(totalWidth < visibleWidth) {
          _productsGroupLength++;
          totalWidth += itemWidth
          if(totalWidth + itemWidth > visibleWidth) {
              break;
          }
      }

      return _productsGroupLength;
    }
  }
}
</script>
  
<style scoped>
    a:hover {
        border: none;
    }
    .btn-bg-color {
      background-color: rgb(26, 6, 58);
      color: rgb(250 245 255);
    }
</style>