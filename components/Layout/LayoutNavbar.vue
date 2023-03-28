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
                    <NuxtLink to="/products">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline tw-is-active"
                      >
                      Produkte
                      </span>
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/products">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline"
                        >
                        Hilfe
                        </span>
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/search">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline tw-is-active"
                      >
                      Treuerabatt
                      </span>
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                    <NuxtLink to="/categories">
                      <span
                        class="tw-text-xl tw-text-purple-50 tw-no-underline tw-is-active"
                      >
                        Über uns
                      </span>
                    </NuxtLink>
                  </li>
                  <li
                    class="tw-inline-block tw-py-2 tw-text-xl tw-font-semibold tw-no-underline lg:tw-text-base lg:tw-px-4"
                  >
                  </li>
                </ul>
              </nav>
            </div>
            <nav id="nav-content" :class="fixedNavBar ? 'sticky' : ''" class="tw-h-24 tw-pt-4 tw-bg-violet-900 tw-shadow-2xl">
                <v-row>
                  <v-col xl="4" lg="4" ></v-col>
                  <v-col xl="4" lg="4" md="4" sm="11" xs="11">
                    <div class="tw-flex tw-justify-center">
                      <v-btn-toggle
                        rounded="xl"
                        style="background-color: rgb(26, 6, 58);"
                        class="tw-w-full"
                      >
                      <v-text-field 
                        density="comfortable"
                        variant="solo"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                      >
                      </v-text-field>
                      <v-btn flat icon="mdi-magnify" style="color: rgb(250, 245, 255); background-color: rgb(26, 6, 58);"></v-btn>
                    </v-btn-toggle>
                    </div>
                  </v-col>
                  <v-col xl="4" lg="4">
                    <div  class="tw-flex tw-justify-end tw-pr-8">
                      <v-menu 
                        transition="slide-y-transition"
                        :close-on-content-click="false"
                        location="bottom"
                        width="300"
                        >
                        <!-- open-on-hover -->
                        <template v-slot:activator="{ props }">
                          <v-btn variant="text" icon="mdi-account" v-bind="props"></v-btn>
                        </template>
                        <v-card v-if="!authStore.isLoggedIn" style="background: rgb(50, 17, 102); padding: 0.5rem;">
                          <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Anmelden</v-card-title>
                          <v-card-text>
                            <v-text-field 
                              v-model="loginPL.username"
                              variant="solo"
                              density="compact"
                              label="Benutzername"
                              bg-color="rgb(26, 6, 58)"
                              color="rgb(250, 245, 255)"
                            ></v-text-field>
                              <v-text-field
                                v-model="loginPL.password"
                                type="password"
                                density="compact"
                                label="Password"
                                bg-color="rgb(26, 6, 58)"
                                color="rgb(250, 245, 255)"
                                variant="solo"
                              ></v-text-field>
                              <div class="tw-flex tw-flex-col">
                                <p><nuxt-link to="/account/forgot-password"  class="tw-text-purple-50">Passwort vergessen</nuxt-link></p>
                                <p><nuxt-link to="/account/register"  class="tw-text-purple-50">Registrieren</nuxt-link></p>
                              </div>
                          </v-card-text>
                          <v-card-actions class="tw-justify-end tw-flex tw-p-4">
                            <v-btn color="success" variant="outlined"><div class="tw-normal-case" @click="login">Login</div></v-btn>
                          </v-card-actions>
                        </v-card>
                        <v-card v-if="authStore.isLoggedIn" style="background: rgb(50, 17, 102); padding: 0.5rem;">
                          <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Account</v-card-title>
                          <v-card-text>
                            <v-btn color="primary" variant="outlined" to="/account/dashboard" class="tw-w-full tw-normal-case tw-m-1" style="text-transform: none;"><div class="tw-text-purple-50">Dashboard</div></v-btn>
                            <v-btn color="primary" variant="outlined" to="/account/dashboard/orders" class="tw-w-full tw-normal-case tw-m-1" style="text-transform: none;"><div class="tw-text-purple-50">Bestellungen</div></v-btn>
                          </v-card-text>
                          <v-card-actions class="tw-justify-center tw-flex tw-p-4">
                            <v-btn color="red" variant="outlined" @click="authStore.logout()"><div class="tw-normal-case">Logout</div></v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                      <CartItem/>
                    </div>
                    <!-- <div v-if="authStore.isLoggedIn" class="tw-flex tw-justify-end tw-pr-8">
                      <v-btn-toggle class="btn-toggle" rounded="xl">
                        <v-btn class="tw-text-purple-50" icon="mdi-account" variant="outlined" to="account"></v-btn>
                        <v-btn @click="authStore.logout()" icon="mdi-logout" variant="outlined" class="tw-bg-red-600 logout-btn">
                        </v-btn>
                      </v-btn-toggle>
                    </div> -->
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

import { mdiMagnify, mdiLogout, mdiAccount } from '@mdi/js'
import { login } from "@/utils/auth"
import { useAuth } from "@/store/useAuth";


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
          mdiMagnify,
          mdiAccount,
          mdiLogout,
          authStore: useAuth(),
          loginPL: {
            clientMutationId: null,
            username: null,
            password: null
          }
      };
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
        const result = login(this.loginPL);
        this.loginPL = {
          clientMutationId: null,
          username: null,
          password: null
        }
        return result
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
