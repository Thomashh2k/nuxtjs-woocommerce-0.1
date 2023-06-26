<template>
    <div ref="section">
        <IndexHero />
        <CategoryShowAll />
        <h1 class="tw-text-purple-50 tw-text-2xl tw-py-4 tw-text-center">
            Neuerscheinungen
        </h1>
        <v-divider/>
        <ProductsRow v-if="!isLoading" :products="newestProducts" />
        <v-window v-else>
            <v-window-item class="tw-flex tw-flex-row">
                <v-skeleton-loader
                    v-for="index in productsLength" :key="productsLength"
                    class="card-bg-color card-height card-width lg:tw-mt-6 md:tw-mt-5 sm:tw-mt-5 max-[1280px]:tw-mt-5 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 md:tw-mr-3 sm:tw-mr-3 max-[1280px]:tw-mr-2 hover:shadow-2xl"
                    type="image, list-item, list-item, actions"
                ></v-skeleton-loader>
            </v-window-item>
        </v-window>
        <h1 class="tw-text-purple-50 tw-text-2xl tw-py-4 tw-text-center">
            Bestseller
        </h1>
        <v-divider/>
        <ProductsRow v-if="!isLoading" :products="featuredProducts" />
        <v-window v-else>
            <v-window-item class="tw-flex tw-flex-row">
                <v-skeleton-loader
                    v-for="index in productsLength" :key="productsLength"
                    class="card-bg-color card-height card-width lg:tw-mt-6 md:tw-mt-5 sm:tw-mt-5 max-[1280px]:tw-mt-5 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 md:tw-mr-3 sm:tw-mr-3 max-[1280px]:tw-mr-2 hover:shadow-2xl"
                    type="image, list-item, list-item, actions"
                ></v-skeleton-loader>
            </v-window-item>
        </v-window>
        <h1 class="tw-text-purple-50 tw-text-2xl tw-py-4 tw-text-center">
            Angebote
        </h1>
        <v-divider/>
        <ProductsRow v-if="!isLoading" :products="onSaleProducts" />
        <v-window v-else>
            <v-window-item class="tw-flex tw-flex-row">
                <v-skeleton-loader
                    v-for="index in productsLength" :key="productsLength"
                    class="card-bg-color card-height card-width lg:tw-mt-6 md:tw-mt-5 sm:tw-mt-5 max-[1280px]:tw-mt-5 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 md:tw-mr-3 sm:tw-mr-3 max-[1280px]:tw-mr-2 hover:shadow-2xl"
                    type="image, list-item, list-item, actions"
                ></v-skeleton-loader>
            </v-window-item>
        </v-window>
        <h1 v-if="onSaleProducts.nodes.length === 0" class="tw-text-purple-50 tw-text-xl tw-py-4 tw-text-center">
            Leider haben wir keine Angebote momentan.
        </h1>
    </div>
</template>
<script>
import GET_PRODUCTS_FOR_INDEX from "@/apollo/queries/GET_PRODUCTS_FOR_INDEX.gql";
import * as labsComponents from 'vuetify/labs/components'

export default {
    name: 'IndexPage',
    components: {
    ...labsComponents,
    },
    data() {
        return {
            isLoading: true,
            productsLength: null,
            featuredProducts: {
                nodes: []
            },
            newestProducts: {
                nodes: []
            },
            onSaleProducts: {
                nodes: []
            },
            errMsg: undefined
        }
    },
    computed: {
        cardWidth() {
           
        }
    },
    async mounted() {
        this.productsLength = this.productsGroupLength()
        const productVariables = { limit: 99 };
        const result = await useAsyncQuery(
            GET_PRODUCTS_FOR_INDEX,
            productVariables
        );
        await result.execute();

        this.featuredProducts = result.data.value.featuredProducts
        this.newestProducts = result.data.value.newestProducts
        this.onSaleProducts = result.data.value.onSaleProducts
        this.isLoading = false
    },
    methods: {
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
            }

            return _productsGroupLength;
        }
    }
}
</script>
<style scoped>
    .card-bg-color {
        /* background: rgb(26, 6, 58) !important; */
        background-color: rgb(76 29 149 / var(--tw-bg-opacity));
    }
    .card-height {
        height: 28rem;
    }
    .card-width {
        max-width: 340px;
        min-width: 340px;
    }
    @media (max-width: 2160px) {
        .card-height {
            height: 28rem;
        }
        .card-width {
            max-width: 340px;
            min-width: 340px;
        }
    }
    @media screen and (max-width: 1920px) {
        .card-width {
            max-width: 305px;
            min-width: 305px;
        }
        .card-height {
            height: 28rem;
        }
    }

    @media screen and (max-width: 1280px) { 
        .card-width {
            max-width: 240px;
            min-width: 240px;
        }
        .card-height {
            height: 24.5rem;
        }
    }
    @media screen and (max-width: 960px) {
        .card-width {
            max-width: 180px;
            min-width: 180px;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
    @media screen and (max-width: 640px) { 
        .card-width {
            max-width: 180px;
            min-width: 180px;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
</style>