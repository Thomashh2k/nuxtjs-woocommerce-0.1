<template>
    <header
      role="banner"
    >
      <v-row>
        <!-- <v-col cols="1"></v-col> -->
        <v-col>  
            <LayoutMobileMenu />
            <div
              class="navbar-width-lg tw-mt-4 tw-bg-violet-900 lg:tw-mt-0 lg:tw-text-right tw-px-6 lg:tw-px-0 lg:tw-pt-5 xl:tw-pt-7 tw-h-30"
            >
              <nav
                id="block-main"
                role="navigation"
                aria-labelledby="block-main-menu"
              >
                <ul
                  class="tw-items-center tw-justify-end tw-flex-1 tw-pr-4 tw-mr-4 tw-list-reset lg:tw-flex"
                >
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline tw-is-active"
                      >
                        Home
                      </span>
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/products">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline"
                        >Products</span
                      >
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/categories">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline tw-is-active"
                        >Categories</span
                      >
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/search">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline tw-is-active"
                        >Search</span
                      >
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <LayoutCart />
                  </li>
                </ul>
              </nav>
            </div>
            <nav id="nav-content" :class="fixedNavBar ? 'sticky' : ''" class="tw-h-24 tw-pt-4 tw-bg-violet-900 tw-shadow-2xl">
              <v-row>
                <v-col cols="4"></v-col>
                <v-col>
                  <div class="tw-flex tw-justify-center">
                    <v-btn-toggle
                      rounded="xl"
                      class="tw-w-full"
                    >
                    <v-text-field 
                      density="comfortable"
                      variant="solo"
                      bg-color="rgb(26, 6, 58)"
                      color="rgb(250, 245, 255)"
                    >
                    </v-text-field>
                    <v-btn variant="text" icon="mdi-magnify" ></v-btn>
                  </v-btn-toggle>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="tw-flex tw-justify-end">
                    <v-menu transition="slide-y-transition" :close-on-content-click="false">
                      <template v-slot:activator="{ props }">
                        <v-btn variant="text" icon="mdi-account" v-bind="props"></v-btn>
                      </template>
                      <v-card>
                        <v-text-field></v-text-field>
                        <v-text-field type="password"></v-text-field>
                      </v-card>
                    </v-menu>
                  </div>
                </v-col>
              </v-row>
            </nav>
            <div :class="fixedNavBar ? 'computedScroll' : ''"></div>
        </v-col>
        <!-- <v-col cols="1"></v-col> -->
      </v-row>
    </header>
</template>
<script>
import { mdiMagnify } from '@mdi/js'

export default {
    name: "LayoutNavbar",
    beforeCreate() {
        debugger;
        if (process.client) {
            window.addEventListener("scroll", () => { this.handleScollEvent(); });
        }
    },
    beforeDestroy() {
        if (process.client) {
            window.removeEventListener("scroll", () => { this.handleScollEvent(); });
        }
    },
    data() {
        return {
            fixedNavBar: false,
            mdiMagnify
        };
    },
    methods: {
        handleScollEvent() {
            debugger;
            if (process.client) {
                var header = document.getElementById("nav-content");
                var sticky = header.offsetTop;
                if (window.pageYOffset > sticky) {
                    this.fixedNavBar = true;
                }
                else {
                    this.fixedNavBar = false;
                }
            }
        }
    }
}
</script>
<style>
header {
  max-width: 100%;
}
.sticky {
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
}

.sticky + .content {
  padding-top: 102px;
}

.navbar-width-lg {
  width: 100%;
}
.computedScroll {
  height: 75px;
}

/* #nav-content + .main-body-part {
  padding-top: 102px;
} */
</style>
