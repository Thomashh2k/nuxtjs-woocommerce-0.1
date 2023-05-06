<template>
    <div>
        <IndexHero />
        <CategoryShowAll />
        <ProductsShowAll :products="data" />
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
