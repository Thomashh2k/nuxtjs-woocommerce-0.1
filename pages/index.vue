<template>
    <div>
        <IndexHero />
        <CategoryShowAll />
        <h1 class="tw-text-purple-50 tw-text-2xl tw-py-4" >
            Neuerscheinungen
        </h1>
        <v-divider/>
        <ProductsRow :products="data" />
        <h1 class="tw-text-purple-50 tw-text-2xl tw-py-4">
            Bestseller
        </h1>
        <v-divider/>
        <ProductsRow :products="data" />
        <h1 class="tw-text-purple-50 tw-text-2xl tw-py-4">
            Angebote
        </h1>
        <v-divider/>
        <ProductsRow :products="data" />
    </div>
</template>
<script setup>
import FETCH_ALL_PRODUCTS_QUERY from "@/apollo/queries/FETCH_ALL_PRODUCTS_QUERY.gql";
let data = {}
let errMsg = undefined
const productVariables = { limit: 99 };

const result = await useAsyncQuery(
FETCH_ALL_PRODUCTS_QUERY,
productVariables
);
await result.execute();

data = result.data.value.products

</script>
