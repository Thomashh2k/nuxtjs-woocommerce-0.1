<template>
  <div>
    <section v-if="currentCategory === null" class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">
      <NuxtLink
        v-for="mainCat in mainCategory" :key="mainCat.id"
        class="'text-black cursor-pointer hover:underline tw-mx-4"
        @click="redirectToCategory(mainCat)"
      >
        <div :class="'2xl:tw-w-96 lg:tw-w-60 md:tw-w-40 sm:tw-w-32 tw-w-24 tw-mt-6 tw-cursor-pointer ' + mainCat.linkClass">
          <div :class="'tw-flex tw-items-center tw-justify-center card-bg-color tw-h-16 tw-w-30  tw-text-center tw-border tw-border-gray-300 tw-rounded-lg hover:tw-shadow-outline ' + mainCat.linkClass">
            <span :class="'tw-text-5xl mdi ' + mainCat.iconClass"></span>
          </div>
        </div>
      </NuxtLink>
    </section>
    <section v-else>
      <div v-if="currentCategory.children.nodes.length !== 0" >
        <v-breadcrumbs :items="[currentCategory.name]"></v-breadcrumbs>
        <div class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">
          <NuxtLink
            v-for="cCat in currentCategory.children.nodes" :key=" currentCategory.children.nodes.id"
            class="'text-black cursor-pointer hover:underline tw-mx-4"
            @click="redirectToCategory(cCat)"
          >
            <div :class="'2xl:tw-w-96 lg:tw-w-60 md:tw-w-40 sm:tw-w-32 tw-w-24 tw-mt-6 tw-cursor-pointer ' + cCat.linkClass">
              <div :class="'tw-flex tw-items-center tw-justify-center card-bg-color tw-h-16 tw-w-30  tw-text-center tw-border tw-border-gray-300 tw-rounded-lg hover:tw-shadow-outline ' + cCat.linkClass">
                <span class="2xl:tw-text-2xl lg:tw-text-2xl md:tw-text-xl sm:tw-text-base">{{ cCat.name }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-else>
        <v-breadcrumbs :items="breadcrumbCatItems" class="tw-text-purple-50"></v-breadcrumbs>
        <div class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">
          <NuxtLink
            v-for="mainCat in mainCategory" :key="mainCat.id"
            class="'text-black cursor-pointer hover:underline tw-mx-4"
            @click="redirectToCategory(mainCat)"
          >
            <div :class="'2xl:tw-w-96 lg:tw-w-60 md:tw-w-40 sm:tw-w-32 tw-w-24 tw-mt-6 tw-cursor-pointer ' + mainCat.linkClass">
              <div :class="'tw-flex tw-items-center tw-justify-center card-bg-color tw-h-16 tw-w-30  tw-text-center tw-border tw-border-gray-300 tw-rounded-lg hover:tw-shadow-outline ' + mainCat.linkClass">
                <span :class="'tw-text-5xl mdi ' + mainCat.iconClass"></span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import FETCH_ALL_CATEGORIES_QUERY from "@/apollo/queries/FETCH_ALL_CATEGORIES_QUERY.gql";
import { onMounted } from "vue";
import { useCategories } from '@/store/useCategories'
import { mdiSonyPlaystation, mdiNintendoSwitch, mdiMicrosoftXbox } from '@mdi/js'
const router = useRouter();
const route = useRoute();
const categoriesStore = useCategories()
const props = defineProps({
   isSearchPage: { type: Boolean, required: false, default: false },
   selectedCategoryId: { type: String, required: false, default: '' },
   searchQuery: { type: String, required: false, default: '' },
});

const variables = { limit: 150 };
let mainCategory = categoriesStore.getAllCategories
let currentCategory = ref(categoriesStore.getActiveCategory)

if(currentCategory?.value === null || route.path.includes('search')  || route.path.includes('category')) {
  for (let i = 0; i < mainCategory.length; i++) {
    if(mainCategory[i].id === route.query.id) {
      currentCategory = mainCategory[i]
    } else {
      for (let x = 0; x < mainCategory[i].children.nodes.length; x++) {
        if(mainCategory[i].children.nodes[x].id === route.query.id) {
          mainCategory[i].children.nodes[x]
        } 
      }
    }
    
  }
}

if(mainCategory.length === 0) {
  const { data, error, execute } = await useAsyncQuery(FETCH_ALL_CATEGORIES_QUERY, variables);
  await execute();
  console.log(data);
  
  let sony = {
    iconClass: 'mdi-sony-playstation',
    linkClass: 'link-sony-playstation'
  }
  let xbox ={
    iconClass: 'mdi-microsoft-xbox',
    linkClass: 'link-microsoft-xbox'
  }
  let nintendo = {
    iconClass: 'mdi-nintendo-switch',
    linkClass: 'link-nintendo-switch'
  }
  debugger
  sony.id = data.value.sonyCategory.nodes[0].id;
  sony.name = data.value.sonyCategory.nodes[0].name;
  sony.slug = data.value.sonyCategory.nodes[0].slug;
  sony.children = data.value.sonyCategory.nodes[0].children;


  xbox.id = data.value.xboxCategory.nodes[0].id;
  xbox.name = data.value.xboxCategory.nodes[0].name;
  xbox.slug = data.value.xboxCategory.nodes[0].slug;
  xbox.children = data.value.xboxCategory.nodes[0].children;

  nintendo.id = data.value.nintendoCategory.nodes[0].id;
  nintendo.name = data.value.nintendoCategory.nodes[0].name;
  nintendo.slug = data.value.nintendoCategory.nodes[0].slug;
  nintendo.children = data.value.nintendoCategory.nodes[0].children;

  
  mainCategory = [sony, xbox, nintendo];
  
  categoriesStore.setCategories(mainCategory)
}

onBeforeUnmount(() => {
  categoriesStore.setActiveCategory(null)
})

function redirectToCategory(cat) {
  
  if(props.isSearchPage) {
    router.push({path: '/search/' + cat.slug, query: { id: cat.id, q: props.searchQuery }})
    categoriesStore.setActiveCategory(cat)
  } else {
    router.push({path: '/search/' + cat.slug, query: { id: cat.id, q: props.searchQuery}})
    categoriesStore.setActiveCategory(cat)
  }
}

const breadcrumbCatItems = computed(() => {  
  // Uncaught (in promise) TypeError: currentCategory.ancestors is undefined
  const items =  []
  for (let i = 0; i < currentCategory?.value.ancestors.nodes.length; i++) {
    let _item = { title: currentCategory?.value.ancestors.nodes[i].name }
    _item.href = route.path.replace(currentCategory?.value.slug, '')  +  currentCategory?.value.ancestors.nodes[i].slug + '?id=' +  currentCategory?.value.ancestors.nodes[i].id
    items.push(_item)
  }
  items.push({ title: currentCategory?.value.name })
  
  return items
})

</script>
<style scoped>
.card-bg-color {
  /* .tw-bg-violet-900 */
  background-color: rgb(76 29 149 / var(--tw-bg-opacity));
}

.card-bg-color:hover {
  /* .tw-bg-violet-900 */
  background-color: #36136b;
  @apply tw-border tw-border-gray-300 tw-rounded-lg 
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
  background: red !important;
  color: white !important;

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