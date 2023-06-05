<template>
  <div>
      <div v-if="products.nodes.length === 0 && !fetchingMore">
        <h1 class="tw-text-center tw-text-2xl">Es konnten keine Produkte gefunden werden.</h1>
        <CategoryShowAll :is-search-page="true" :search-query="search" />
      </div>
      <div v-else>
        <h1 class="tw-text-center tw-text-2xl">Suchergebniss für "{{ $route.query.q }}"</h1>
        <CategoryShowAll :is-search-page="true" :search-query="search" />
        <ProductsShowAll class="tw-mb-6" :products="products" />

      </div>
      <h1 v-if="!pageInfo.hasNextPage && !fetchingMore" class="tw-text-center tw-text-2xl">Es gibt keine weiteren Produkte zum laden</h1>
      <div v-if="fetchingMore">
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
        <v-progress-linear
          indeterminate
          color="yellow-darken-2"
        ></v-progress-linear>
      </div>
  </div>
</template>

<script>
import { pageSearchProducts } from "@/utils/search";

export default {
  setup() {
    useHead(() => ({
      title: "Search",
      titleTemplate: "%s - Nuxt 3 Woocommerce",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Nuxt 3 Woocommerce",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    }));
  },
  data() {
    return {
      search: this.$route.query.q,
      products: {
        nodes: []
      },
      itemsPerPage: 5,
      loadMore: function() { return undefined; },
      fetchingMore: false,
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: null,
        hasPreviousPage: null
      },
    }
  },
  watch: {
    async $route(newVal, oldVal) {
      if(newVal.query.q !== oldVal.query.q) {
        this.fetchingMore = true
        this.search = newVal.query.q;
        const result = await pageSearchProducts(this.search, this.itemsPerPage)
        this.products = result.products;
        this.pageInfo = result.products.pageInfo;
        this.fetchingMore = false
      }
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async created() {
    this.fetchingMore = true
    window.addEventListener('scroll', this.handleScroll);
    const result = await pageSearchProducts(this.search, this.itemsPerPage);

    this.products.nodes = result.data.products.nodes;
    this.loadMore = result.loadMore;
    this.pageInfo = result.data.products.pageInfo;
    this.fetchingMore = false
  },
  methods: {
    async handleScroll() {
      if(!this.fetchingMore) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight && this.pageInfo.hasNextPage) {
          this.fetchingMore = true
          const result = await this.loadMore(true, this.pageInfo, this.itemsPerPage, this.products.nodes.map(el => el.databaseId));
          this.products.nodes = this.products.nodes.concat(result.data.products.nodes);
          this.pageInfo = result.pageInfo;
          this.fetchingMore = false;
        }
      }
    }
  }
}
</script>

<style>
@media (max-width: 767px) {
  .CustomHitsItem {
    padding: 10px;
    width: 100%;
  }
}

@media (min-width: 768px) {
  .CustomHitsItem {
    width: 47%;
  }
}

@media (min-width: 1280px) {
  .CustomHitsItem {
    width: 32%;
  }
}
</style>
