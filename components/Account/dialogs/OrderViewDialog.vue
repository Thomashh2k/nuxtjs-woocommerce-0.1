<template>
    <v-dialog v-model="showModal" max-width="700">
        <v-card class="card-bg">
            <v-card-title>
                <h1 class="tw-text-xl tw-text-purple-50 tw-text-center">Bestellung: </h1>
                <v-btn @click="closeDialog">Close</v-btn>
            </v-card-title>
            <v-card-text>
                <div class="tw-flex tw-flex-row">
                    <div class="tw-w-1/2">
                    <div v-for="pItem in order.lineItems.nodes">
                        <NuxtLink class="tw-flex tw-flex-row" :to="{path: '/product/' + pItem.product.node.slug, query: { id:  pItem.product.node.databaseId }}">
                        <img :src="pItem.product.node.image.sourceUrl" class="tw-h-25 tw-w-20 tw-my-2" />
                        <div class="tw-flex tw-flex-col tw-self-start tw-pl-4 tw-mt-1">
                            <span class="tw-text-purple-50 hover:tw-underline">{{ pItem.product.node.name }}</span>
                            <span class="tw-text-purple-50 hover:tw-underline">{{ pItem.total + ' €' }}</span>
                        </div>
                        </NuxtLink>
                    </div>
                    </div>
                    <div class="tw-w-1/2">
                        <v-sheet style="background: #1a063a;">
                        <div class="tw-flex tw-flex-row">
                            <div class="tw-w-1/2">
                            <h1 class="tw-text-purple-50 tw-text-center">Lieferaddresse</h1>
                            <div class="tw-flex te-flex-col tw-justify-center">
                                <div class="tw-flex tw-flex-col tw-text-purple-50">
                                <p>{{ order.shipping.firstName + ' ' + order.shipping.lastName }}</p>
                                <p>{{ order.shipping.address1 + ' ' + order.shipping.address2 }}</p>
                                <p>{{ order.shipping.postcode + ' ' + order.shipping.city }}</p>
                                <p>{{ getCountryNameByCode(order.shipping.country) }}</p>
                                </div>
                            </div>
                            </div>
                            <div class="tw-w-1/2">
                            <h1 class="tw-text-purple-50 tw-text-center">Rechnungsaddresse</h1>
                            <div class="tw-flex te-flex-col tw-justify-center">
                                <div class="tw-flex tw-flex-col tw-text-purple-50">
                                <p>{{ order.billing.firstName + ' ' + order.billing.lastName }}</p>
                                <p>{{ order.billing.address1 + ' ' + order.billing.address2 }}</p>
                                <p>{{ order.billing.postcode + ' ' + order.billing.city }}</p>
                                <p>{{ getCountryNameByCode(order.billing.country) }}</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </v-sheet>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions></v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'OrderViewDialog',
    emits: ['close'],
    props: {
        show: Boolean,
        order: Object
    },
    data() {
        return {
            showModal: false
        }
    },
    watch: {
        show: function (val) {
            debugger
            this.showModal = val;
        }
    },
    methods: {
        closeDialog() {
            this.showModal = false;
            context.emit('close')
        }
    }
}
</script>
<style scoped>
.card-bg {
  background: rgb(50, 17, 102);
}
</style>