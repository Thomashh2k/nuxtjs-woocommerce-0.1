<template>
    <v-menu 
        transition="slide-y-transition"
        :close-on-content-click="false"
        open-on-hover
        location="bottom"
        width="300"
    >
        <template v-slot:activator="{ props }">
            <v-btn variant="text" icon v-bind="props">
                <v-badge v-if="cart.getCartQuantity > 0" :content="cart.getCartQuantity" color="error">
                    <v-icon>mdi-cart-outline</v-icon>
                </v-badge>
                <v-icon v-else>mdi-cart-outline</v-icon>
            </v-btn>
        </template>
        <v-card style="background: rgb(50, 17, 102); padding: 0.5rem; max-height: 304px">
            <v-card-title class="account-card-bg tw-text-purple-50" style="padding-top: 0.8rem;">Warenkorb</v-card-title>
            <v-card-text class="tw-overflow-y-auto" style="height: 182px;">
                <NuxtLink 
                    v-for="item in cartItems"
                    key="item.databaseId"
                    class="tw-flex tw-flex-row tw-p-1 tw-cursor-pointer tw-decoration-purple-50 hover:tw-underline" 
                    :to="{
                        path: '/product/' + item.product.slug,
                        query: { id: item.product.databaseId },
                }">

                    <div >
                        <v-img style="width:70px; height: 90px;" :src="item.product.image.sourceUrl"></v-img>
                    </div>
                    <div id="prodInfo" class="tw-text-purple-50 tw-ml-4">
                        <h6>{{ item.product.name }}</h6>
                        <div v-if="item.product.onSale" class="tw-flex tw-justify-center tw-mt-2">
                            <div class="tw-line-through">
                                <span v-if="item.product.variations" v-html="filteredVariantPrice(item.product.price, 'right')"></span>
                                <span v-else v-html="item.product.regularPrice"></span>
                            </div>
                            <div class="">
                                <span v-if="item.product.variations" v-html="filteredVariantPrice(item.product.price)"></span>
                                <span v-else v-html="item.product.salePrice"></span>
                            </div>
                        </div>
                        <div v-else>
                            <p class="tw-mt-2 tw-text-sm" v-html="item.product.price"></p>
                        </div>
                    </div>
                </NuxtLink>
                <div class="tw-text-purple-50 tw-text-lg tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full">
                    <h1 v-if="cartItems.length === 0">Ihr Warenkorb ist leer</h1>
                </div>
            </v-card-text>
            <v-card-actions class="tw-justify-center tw-flex tw-p-4">
                <v-btn color="green" variant="outlined" to="/checkout" rounded="xl" :disabled="cartItems.length === 0"><div class="tw-normal-case">Bestellen</div></v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>
<script>
import { mdiCartOutline } from '@mdi/js'
import { useCart } from "@/store/useCart";

export default {
    data() {
        debugger
        const _cart = useCart()
        return {
            mdiCartOutline,
            cart: _cart,
            cartItems: _cart.getItems,
        }
    },
}
</script>