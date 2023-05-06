<template>
  <div>
    <div v-if="products !== null">
      <div v-if="products.nodes.length === 0">
        <h1 class="tw-text-center tw-text-2xl">Es konnten keine Produkte gefunden werden.</h1>
        <CategoryShowAll :is-search-page="true" :search-query="search" />
      </div>
      <div v-else>
        <h1 v-if="$route.query.q !== ''" class="tw-text-center tw-text-2xl">Suchergebniss für "{{ $route.query.q }}"</h1>
        <CategoryShowAll :is-search-page="true" :search-query="search" />
        <ProductsShowAll class="tw-mb-6" :products="products" />

      </div>
      <h1 v-if="!pageInfo.hasNextPage" class="tw-text-center tw-text-2xl">Es gibt keine weiteren Produkte zum laden</h1>
      <div v-if="fetchingMore">
        <v-progress-linear
          indeterminate
          color="yellow-darken-2"
        ></v-progress-linear>
      </div>
    </div>
    <div v-else>
      <v-progress-linear
      indeterminate
      color="yellow-darken-2"
    ></v-progress-linear>
    </div>
  </div>
</template>

<script>
import PRODUCT_PAGE_CATEGORY_SEARCH_QUERY from "@/apollo/queries/PRODUCT_PAGE_CATEGORY_SEARCH_QUERY.gql";

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
      loadMore: function() { return undefined; },
      fetchingMore: false,
      itemsPerPage: 5,
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
        this.search = newVal.query.q;
        const result = await pageCategorySearchProducts(
          { query: this.search, categoryIn: this.$route.path.replace('/search', '') },
          { first: this.itemsPerPage }
        );
        this.products = result.data.products;
        this.loadMore = result.loadMore;
        this.pageInfo = result.data.products.pageInfo;
      }
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async created() {
    window.addEventListener('scroll', this.handleScroll);
    const result = await pageCategorySearchProducts(
      { query: this.search, categoryIn: this.$route.path.replace('/search', '') },
      { first: this.itemsPerPage }
    );
    this.products.nodes = result.data.products.nodes;
    this.loadMore = result.loadMore;
    this.pageInfo = result.data.products.pageInfo;
  },
  methods: {
    async handleScroll() {
      if(!this.fetchingMore) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight && this.pageInfo.hasNextPage) {
          this.fetchingMore = true
          debugger
          const result = await this.loadMore(true, this.pageInfo, this.itemsPerPage, this.products.nodes.map(el => el.databaseId));
          this.products.nodes = this.products.nodes.concat(result.data.products.nodes);
          this.pageInfo = result.pageInfo;
          this._callMadeOnScroll = false
          this.fetchingMore = false
        }
      }
    }
  }
}
</script>
