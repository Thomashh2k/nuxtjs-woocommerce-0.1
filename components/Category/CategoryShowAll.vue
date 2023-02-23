<template>
  <div v-if="data.productCategories">
    <section class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">

          <NuxtLink
            v-for="mainCat in mainCategory" :key="mainCat.id"
            class="'text-black cursor-pointer hover:underline tw-mx-4"
            :to="{
              path: '/category/' + mainCat.slug,
              query: { id: mainCat.id },
            }"
          >
            <div :class="'tw-w-96 tw-mt-6 tw-cursor-pointer ' + mainCat.linkClass">
              <div :class="'tw-flex tw-items-center tw-justify-center card-bg-color tw-h-16 tw-w-30  tw-text-center tw-border tw-border-gray-300 tw-rounded-lg hover:tw-shadow-outline ' + mainCat.linkClass">
                <span :class="'tw-text-5xl mdi ' + mainCat.iconClass"></span>
              </div>
            </div>
          </NuxtLink>
    </section>
  </div>
</template>

<script setup>
import FETCH_ALL_CATEGORIES_QUERY from "@/apollo/queries/FETCH_ALL_CATEGORIES_QUERY.gql";
import { onMounted } from "vue";

import { mdiSonyPlaystation, mdiNintendoSwitch, mdiMicrosoftXbox } from '@mdi/js'


const variables = { limit: 99 };
const { data, error, execute, pending } = await useAsyncQuery(FETCH_ALL_CATEGORIES_QUERY, variables);
await execute();
console.log(error);

let sony = {}
let xbox = {}
let nintendo = {}

let mainCategory = []
let subCategorys = {}

sony = data.value.productCategories.nodes.find(el => el.name === 'Sony');
sony.iconClass = 'mdi-sony-playstation'
sony.linkClass = 'link-sony-playstation'
xbox = data.value.productCategories.nodes.find(el => el.name === 'Xbox');
xbox.iconClass = 'mdi-microsoft-xbox'
xbox.linkClass = 'link-microsoft-xbox'
nintendo = data.value.productCategories.nodes.find(el => el.name === 'Nintendo');
nintendo.iconClass = 'mdi-nintendo-switch'
nintendo.linkClass = 'link-nintendo-switch'

mainCategory = [sony, xbox, nintendo];
subCategorys = {
  sony: [],
  xbox: [],
  nintendo: [],
};


for (let i = 0; i < data.value.productCategories.nodes.length; i++) {
  if(data.value.productCategories.nodes[i].slug.includes('nintendo') && data.value.productCategories.nodes[i].slug !== 'nintendo') {

    subCategorys.nintendo.push(data.value.productCategories.nodes[i]);

  } else if(data.value.productCategories.nodes[i].slug.includes('xbox') && data.value.productCategories.nodes[i].slug !== 'xbox') {

    subCategorys.xbox.push(data.value.productCategories.nodes[i]);

  } else if(data.value.productCategories.nodes[i].slug.includes('sony') && data.value.productCategories.nodes[i].slug !== 'sony') { 

    subCategorys.sony.push(data.value.productCategories.nodes[i]);
    
  }
}

</script>
<style scoped>
.card-bg-color {
  /* .tw-bg-violet-900 */
  background-color: rgb(76 29 149 / var(--tw-bg-opacity));
}
.link-sony-playstation:hover {
  background: #0070d1 !important;
  color: white !important;

  @apply tw-border tw-border-gray-300 tw-rounded-lg 
}
.link-microsoft-xbox:hover {
  background: rgb(16, 124, 16) !important;
  color: white  !important;

  @apply tw-border tw-border-gray-300 tw-rounded-lg
}
.link-nintendo-switch:hover {
  background: white !important;
  color: red !important;

  @apply tw-border tw-border-gray-300 tw-rounded-lg
}

</style>



        <!-- <template v-for="nodes in data.productCategories">
          <template v-for="category in nodes">
            <div v-if="category.slug !== undefined" :key="category.id">
              <NuxtLink
                class="text-black cursor-pointer hover:underline"
                :to="{
                  path: '/category/' + category.slug,
                  query: { id: category.id },
                }"
              >
                <div class="tw-mt-6 tw-cursor-pointer">
                  <div
                    class="tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-text-center tw-border tw-border-gray-300 tw-rounded-lg tw-shadow hover:tw-shadow-outline"
                  >
                    <p class="tw-text-lg">
                      {{ category.name }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>
        </template> -->