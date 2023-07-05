<template>
  <v-card class="account-card-bg">
    <div class="tw-flex">
      <v-tabs v-model="tab" direction="vertical" class="tw-mr-6">
        <v-tab value="person">
          <div class="tw-text-purple-50 tw-normal-case tw-flex" :class="tab === 'person' ? 'text-yellow-darken-2' : ''">
            <v-icon icon="mdi-account" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden" >Person</p>
          </div>
        </v-tab>
        <v-tab value="orders">
          <div class="tw-text-purple-50 tw-normal-case tw-flex" :class="tab === 'orders' ? 'text-yellow-darken-2' : ''">
            <v-icon icon="mdi-package-variant-closed" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Bestellungen</p>
          </div>
        </v-tab>
        <v-tab value="deliveryAddress">
          <div class="tw-text-purple-50 tw-normal-case tw-flex" :class="tab === 'deliveryAddress' ? 'text-yellow-darken-2' : ''">
            <v-icon icon="mdi-truck-delivery-outline" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Lieferanschrift</p>
          </div>
        </v-tab>
        <v-tab value="billAddress">
          <div class="tw-text-purple-50 tw-normal-case tw-flex" :class="tab === 'billAddress' ? 'text-yellow-darken-2' : ''">
            <v-icon icon="mdi-file" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Rechnungsanschrift</p>
          </div>
        </v-tab>
      </v-tabs>
      <v-window v-model="tab" class="tw-w-full">
          <v-window-item :value="'person'">
            <h2 class="tw-text-xl tw-text-purple-50 tw-text-center max-[1325px]:tw-p-8 min-[1325px]:tw-pt-4">Account Daten</h2>
            <PersonForm class="max-[1325px]:tw-p-8 min-[1325px]:tw-pt-8" :user-info="userInfo"  @save="updateUserInfo"/>
          </v-window-item>
          <v-window-item :value="'orders'">
            <h2 class="tw-text-xl tw-text-purple-50 tw-text-center max-[1325px]:tw-p-8 min-[1325px]:tw-pt-4">Bestellungen</h2>
            <ListOrders class="max-[1325px]:tw-p-8 min-[1325px]:tw-pt-8"/>
          </v-window-item>
          <v-window-item :value="'deliveryAddress'">
            <v-row class="max-[1325px]:tw-p-8 min-[1325px]:tw-pt-4">
              <v-col class="max-[1325px]:tw-hidden"></v-col>
              <v-col cols="12" md="8">
                <h2  class="tw-text-xl tw-text-purple-50 tw-text-center">Lieferanschrift</h2>
              </v-col>
              <v-col class="max-[1325px]:tw-hidden"></v-col>
            </v-row>
            <v-row>
          <v-col class="max-[960px]:tw-hidden"></v-col>
            <v-col cols="12" class="md:tw-p-8">
            <AddressForm class="tw-px-4" :address-info="customer.shipping" @save="updateShippingInfo" />
          </v-col>
          <v-col class="max-[960px]:tw-hidden"></v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="'billAddress'">
            <v-row class="max-[1325px]:tw-m-8 min-[1325px]:tw-pt-4">
              <v-col class="max-[1325px]:tw-hidden"></v-col>
              <v-col cols="12" md="8">
                <h2 class="tw-text-xl tw-text-purple-50  tw-text-center">Rechnungsanschrift</h2>
              </v-col>
              <v-col class="max-[1325px]:tw-hidden"></v-col>
            </v-row>
              <v-col class="max-[960px]:tw-hidden"></v-col>
                <v-col cols="12" class="md:tw-p-8">
                  <AddressForm class="tw-px-4" :address-info="customer.billing" :disabled="customer.billing.sameAsShipping" @save="updateBillingInfo">
                    <template v-slot:before-form>
                      <div class="tw-flex tw-justify-center">
                        <v-switch v-model="customer.billing.sameAsShipping" color="green" class="tw-text-purple-50">
                          <template v-slot:label>
                            <span class="tw-text-purple-50 tw-text-center">Rechnungsanschrift ist gleich Lieferanschrift</span>
                          </template>
                        </v-switch>
                      </div>
                    </template>
                  </AddressForm>
                </v-col>
              <v-col class="max-[960px]:tw-hidden"></v-col>
          </v-window-item>
      </v-window>
    </div>
  </v-card>
</template>
<script>
import { mdiFile } from '@mdi/js'
import PersonForm from '@/components/Account/forms/PersonForm.vue';
import AddressForm from '@/components/Account/forms/AddressForm.vue';
import ListOrders from '@/components/Account/ListOrders.vue';
import { updateUserInfo, updateUserBilling, updateUserShipping } from '@/utils/user.js'
import { useAuth } from '@/store/useAuth.js'

export default {
  components: {
    PersonForm,
    AddressForm,
    ListOrders
  },
  setup() {
    
    const authStore = useAuth();
    const customer = authStore.getCustomer;
    const userInfo = authStore.getUser;
    return { authStore, customer, userInfo}
  },
   data: vm => ({
      tab: vm.$route.query.tab,
  }),
  created() {
    this.tab = this.$route.query.tab
  },
  watch: {
    tab(val) {
      this.$router.push({ query: { tab: val } })
    },
    $route(to, from) {
      this.tab = to.query.tab
    }
  },
  methods: {
    async updateShippingInfo($event) {
      this.customer.shipping = $event
      await updateUserShipping(this.customer, this.userInfo)
    },
    async updateBillingInfo($event) {
      this.customer.billing = $event
      await updateUserBilling(this.customer, this.userInfo)
    },
    async updateUserInfo($event) {
      
      this.userInfo.firstName = $event.firstName
      this.userInfo.lastName = $event.lastName
      // this.userInfo.email = $event.email
      await updateUserInfo(this.userInfo)
    }
  }
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}
.account-card-bg {
  background: rgb(50, 17, 102);
}
</style>