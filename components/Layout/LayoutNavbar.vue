<template>
    <header
      role="banner"
    >
      <v-row>
        <!-- <v-col cols="1"></v-col> -->
        <v-col>  
            <div class="navbar-width-lg tw-bg-violet-900 lg:tw-mt-0 lg:tw-text-right tw-px-6 lg:tw-px-0 lg:tw-pt-5 xl:tw-pt-5 tw-h-30">
              <nav id="block-main" role="navigation" aria-labelledby="block-main-menu">
                <ul class="tw-items-center min-[960px]:tw-justify-end max-[960px]:tw-justify-center tw-flex-1 tw-pr-4 tw-mr-4 tw-list-reset tw-flex lg:tw-text-xl md:tw-text-xl sm:tw-text-xl">
                  <li class="tw-inline-block tw-py-2 tw-font-semibold tw-no-underline tw-px-4">
                    <NuxtLink to="/products">
                      <span class="tw-text-purple-50 tw-no-underline tw-is-active">
                        Produkte
                      </span>
                    </NuxtLink>
                  </li>
                  <li class="tw-inline-block tw-py-2 tw-font-semibold tw-no-underline tw-px-4">
                    <NuxtLink to="/products">
                      <span class=" tw-text-purple-50 tw-no-underline">
                        Hilfe
                      </span>
                    </NuxtLink>
                  </li>
                  <!-- <li class="tw-inline-block tw-py-2 tw-font-semibold tw-no-underline tw-px-4">
                    <NuxtLink to="/search">
                      <span class=" tw-text-purple-50 tw-no-underline tw-is-active">
                        Treuerabatt
                      </span>
                    </NuxtLink>
                  </li> -->
                  <li class="tw-inline-block tw-py-2 tw-font-semibold tw-no-underline tw-px-4">
                    <NuxtLink to="/categories">
                      <span class=" tw-text-purple-50 tw-no-underline tw-is-active">
                        Über uns
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
              </nav>
            </div>
            <nav id="nav-content" :class="fixedNavBar ? 'sticky' : ''" class="max-[960px]:tw-h-26 min-[960px]:tw-h-24 tw-pt-4 tw-bg-violet-900 tw-shadow-2xl">
                <v-row>
                  <v-col xl="3" lg="3" md="2" cols="1"></v-col>
                  <v-col xl="6" lg="6" md="8" sm="10" xs="10">
                    <div class="max-[960px]:tw-flex min-[960px]:tw-hidden">
                      <CartItem/>
                      <v-spacer />
                      <v-menu 
                        transition="slide-y-transition"
                        :close-on-content-click="false"
                        location="bottom"
                        open-on-hover
                        width="300"
                        >
                        <template v-slot:activator="{ props }">
                          <v-btn variant="text" icon="mdi-account" v-bind="props"></v-btn>
                        </template>
                        <v-card v-if="!authStore.isLoggedIn" :loading.sync="isLoggingIn" style="background: rgb(50, 17, 102); padding: 0.5rem;">
                          <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Anmelden</v-card-title>
                          <v-card-text>
                            <v-text-field 
                              v-model="loginPL.username"
                              variant="solo"
                              density="compact"
                              label="E-Mail"
                              bg-color="rgb(26, 6, 58)"
                              color="rgb(250, 245, 255)"
                            ></v-text-field>
                            <v-text-field
                              v-model="loginPL.password"
                              :type="showPassword ? 'text': 'password'"
                              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              density="compact"
                              label="Password"
                              bg-color="rgb(26, 6, 58)"
                              color="rgb(250, 245, 255)"
                              variant="solo"
                              @click:append-inner="showPassword = !showPassword"
                            ></v-text-field>
                            <div class="tw-flex tw-flex-col">
                              <p><nuxt-link to="/account/forgot-password"  class="tw-text-purple-50">Passwort vergessen</nuxt-link></p>
                              <p><nuxt-link to="/account/register"  class="tw-text-purple-50">Registrieren</nuxt-link></p>
                            </div>
                          </v-card-text>
                          <v-card-actions class="tw-justify-end tw-flex tw-p-4">
                            <v-btn color="success" rounded="xl" variant="outlined"><div class="tw-normal-case" @click="login">Login</div></v-btn>
                          </v-card-actions>
                          <template v-slot:loader="{ isActive }">
                            <v-progress-linear
                              :active="isActive"
                              color="deep-purple"
                              indeterminate
                            ></v-progress-linear>
                          </template>
                        </v-card>
                        <v-card v-if="authStore.isLoggedIn" style="background: rgb(50, 17, 102); padding: 0.5rem;">
                          <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Account</v-card-title>
                          <v-card-text>
                            <v-btn color="primary" rounded="xl" variant="outlined" to="/account/dashboard" class="tw-w-full tw-normal-case tw-m-1" style="text-transform: none;"><div class="tw-text-purple-50">Einstellungen</div></v-btn>
                            <v-btn color="primary" rounded="xl" variant="outlined" to="/account/dashboard/orders" class="tw-w-full tw-normal-case tw-m-1" style="text-transform: none;"><div class="tw-text-purple-50">Bestellungen</div></v-btn>
                          </v-card-text>
                          <v-card-actions class="tw-justify-center tw-flex tw-p-4">
                            <v-btn color="red" rounded="xl" variant="outlined" @click="logout()"><div class="tw-normal-case text-red">Logout</div></v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </div>
                    <div class="tw-flex tw-justify-center max-[960px]:tw-p-4 min-[960px]:tw-pt-0">
                      <v-menu
                        v-model="searchResultMenu"
                        transition="slide-y-transition"
                        location="bottom"
                        :close-on-content-click="false"
                      >
                      <template v-slot:activator="{ props }">
                        <v-btn-toggle
                          rounded="xl"
                          v-bind="props"
                          style="background-color: rgb(26, 6, 58);"
                          class="tw-w-full"
                        >
                          <v-text-field
                            v-model="search"
                            density="comfortable"
                            variant="solo"
                            bg-color="rgb(26, 6, 58)"
                            color="rgb(250, 245, 255)"
                            @update:modelValue="searchProductsOnChange"
                          >
                          </v-text-field>
                          <v-btn flat icon="mdi-magnify" style="color: rgb(250, 245, 255); background-color: rgb(26, 6, 58);" @click="redirectToSearchPage"></v-btn>
                        </v-btn-toggle>
                      </template>
                        <v-list  v-if="instantSearchProducts.length > 0">
                          <v-list-item
                            v-for="(item, i) in instantSearchProducts"
                            :key="i"
                          >
                          <NuxtLink :to="{
                            path: '/product/' + item.slug,
                            query: { id: item.databaseId }
                          }">
                            <div class="tw-flex">
                              <v-list-item-media>
                                <v-img
                                  class="tw-w-24 tw-h-24"
                                  :src="item.image.sourceUrl"
                                />
                              </v-list-item-media>
                              <div class="tw-flex tw-flex-col">
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                <v-list-item-subtitle>---</v-list-item-subtitle>
                              </div>
                            </div>
                          </NuxtLink>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </v-col>
                  <v-col xl="3" lg="3" md="2" cols="1">
                    <div class="tw-justify-end tw-pr-8 max-[960px]:tw-hidden min-[960px]:tw-flex">
                      <CartItem/>
                      <v-menu 
                        transition="slide-y-transition"
                        :close-on-content-click="false"
                        location="bottom"
                        open-on-hover
                        width="300"
                        >
                        <template v-slot:activator="{ props }">
                          <v-btn variant="text" icon="mdi-account" v-bind="props"></v-btn>
                        </template>
                        <v-card v-if="!authStore.isLoggedIn" :loading.sync="isLoggingIn" style="background: rgb(50, 17, 102); padding: 0.5rem;">

                          <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Anmelden</v-card-title>
                          <v-card-text>
                            <v-text-field 
                              v-model="loginPL.username"
                              variant="solo"
                              density="compact"
                              label="E-Mail"
                              bg-color="rgb(26, 6, 58)"
                              color="rgb(250, 245, 255)"
                            ></v-text-field>
                            <v-text-field
                              v-model="loginPL.password"
                              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text': 'password'"
                              density="compact"
                              label="Password"
                              bg-color="rgb(26, 6, 58)"
                              color="rgb(250, 245, 255)"
                              variant="solo"
                              @click:append-inner="showPassword = !showPassword"
                            ></v-text-field>
                            <div class="tw-flex tw-flex-col">
                              <p><nuxt-link to="/account/forgot-password"  class="tw-text-purple-50">Passwort vergessen</nuxt-link></p>
                              <p><nuxt-link to="/account/register"  class="tw-text-purple-50">Registrieren</nuxt-link></p>
                            </div>
                          </v-card-text>
                          <v-card-actions class="tw-justify-end tw-flex tw-p-4">
                            <v-btn color="success" variant="outlined" rounded="xl"><div class="tw-normal-case" @click="login">Login</div></v-btn>
                          </v-card-actions>
                          <template v-slot:loader="{ isActive }">
                            <v-progress-linear
                              :active="isActive"
                              color="deep-purple"
                              indeterminate
                            ></v-progress-linear>
                          </template>
                        </v-card>
                        <v-card v-if="authStore.isLoggedIn" style="background: rgb(50, 17, 102); padding: 0.5rem;">
                          <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Account</v-card-title>
                          <v-card-text>
                            <v-btn color="primary" rounded="xl" variant="outlined" to="/account/dashboard?tab=person" class="tw-w-full tw-normal-case tw-m-1" style="text-transform: none;"><div class="tw-text-purple-50">Einstellungen</div></v-btn>
                            <v-btn color="primary" rounded="xl" variant="outlined" to="/account/dashboard?tab=orders" class="tw-w-full tw-normal-case tw-m-1" style="text-transform: none;"><div class="tw-text-purple-50">Bestellungen</div></v-btn>
                          </v-card-text>
                          <v-card-actions class="tw-justify-center tw-flex tw-p-4">
                            <v-btn color="red" rounded="xl" variant="outlined" @click="logout()"><div class="tw-normal-case">Logout</div></v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </div>
                  </v-col>
                </v-row>
            </nav>
            <div :class="fixedNavBar ? 'computedScroll' : ''"></div>
        </v-col>
      </v-row>
    </header>
</template>
<script>

import { mdiMagnify, mdiLogout, mdiAccount } from '@mdi/js'
import { login } from "@/utils/auth"
import { useAuth } from "@/store/useAuth";
import { miniSearchProducts } from "@/utils/search";


export default {
    name: "LayoutNavbar",
    beforeCreate() {
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
          mdiMagnify,
          mdiAccount,
          search: '',
          mdiLogout,
          authStore: useAuth(),
          instantSearchProducts: [],
          searchResultMenu: false,
          isLoggingIn: false,
          showPassword: false,
          loginPL: {
            clientMutationId: null,
            username: null,
            password: null
          }
      };
    },
    watch: {
      instantSearchProducts(newVal) {
        this.searchResultMenu = newVal.length > 0
      }
    },
    created() {
      if(this.$route.query.q !== undefined) {
        this.search = this.$route.query.q
      }
    },
    methods: {
      handleScollEvent() {
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
      },
      async login() {
        
        this.isLoggingIn = true
        try {
          await login(this.loginPL);
          this.loginPL = {
            clientMutationId: null,
            username: null,
            password: null
          }
          this.isLoggingIn = false
        } catch(ex) {
          this.isLoggingIn = false
        }

      },
      async logout() {
        await this.authStore.logout()
        const cookie = useCookie("woo-session");
        const refreshToken = useCookie("refreshToken");
        const authorization = useCookie("authorization");
        const woocommerceSession = useCookie("woocommerce-session");
        cookie.value = null;
        authorization.value = null;
        refreshToken.value = null;
        woocommerceSession.value = null;
      },
      async searchProductsOnChange() {
        if(this.search !== '') {
          this.instantSearchProducts = await miniSearchProducts(this.search, 3)
        }
      },
      redirectToSearchPage() {
        if(this.search !== '') {
          if(this.search !== this.$route.query.q) {
            console.log('push')
            this.$router.push({path: '/search', query: {q: this.search}})
          } else {
            console.log('go')
            this.$router.go()
          }
        }
      }
    }
}

</script>
<style lang="scss">
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
.account-card-bg {
  background: rgb(50, 17, 102);
}
.logout-btn {
  border-color: red !important;
  border-width: 2px !important;
  border-left: 2px !important;
}
.btn-toggle:hover {
  background: rgb(26, 6, 58) !important;
  color: rgb(250, 245, 255);
  opacity: 1;
}
/* #nav-content + .main-body-part {
  padding-top: 102px;
} */
</style>
