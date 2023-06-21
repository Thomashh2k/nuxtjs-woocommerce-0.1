<template>
    <div id="paypal-button-container"></div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {loadScript} from '@paypal/paypal-js';
import {onMounted, defineEmits} from 'vue';
import { useCart } from "@/store/useCart";

const cart = useCart();

const emit = defineEmits(['onPay', 'click'])
const props = defineProps(['isValidToClick'])

onMounted(async() => {
    try {
        const paypal = await loadScript({
            'client-id': 'AWGX1KNbxGkxU1apCMBB1o2Uw09iqacaXfN69E7ZX1JtBSt3nxBAkW-UbgJTEFWymKstdGpUc1f8g_lh',
            currency: 'EUR'
        });

        await paypal.Buttons({
            createOrder: function(data, actions) {
                
                const totalPriceS = cart.getCartDetails.total.replace('&nbsp;€', '')
                const totalPriceN = Number(totalPriceS.replace(',', '.'))
                // Momentan funktioniert die Bestellung nicht
                // Das kann an verschiedene Gründe liegen, daher sollten wir uns noch darum kümmern
                // das der Korrekte Preis mit Währung übermittelt wird, um potenzielle Fehlerquellen auszuschließen
                // 1. CartContents fertig stellen mit korrekten Versandpreis und MwST
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            // e.g reference.price
                            currency_code: 'EUR',
                            value: totalPriceN,
                        },
                    }],
                });
            },
            // onInit: function(data, actions) {
            //     debugger
            //     if(props.isValidToClick) {
            //         actions.enable();
            //     }
            //     watch(() => props.isValidToClick, (newValue) => {
            //         if(newValue) {
            //             actions.enable();
            //         } else {
            //             actions.disable();
            //         }
            //     });
            // },
            onApprove: (data, actions) => onPaid(data, actions),
            onClick: function () {
                emit('click')
            },
            style: {
                // Adapt to your needs
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal',
            },
            // The following is optional and you can
            // limit the buttons to those you want to
            // provide
            fundingSource: paypal.FUNDING.PAYPAL,
        }).render('#paypal-button-container');
    } catch (error) {
        // Add proper error handling
        console.error(error);
    }
});
const onPaid = function(data, actions) {
    debugger
    
    actions.order.capture().then(function(orderData) {
        debugger
        console.log('orderData')
        console.log(orderData)
        emit('onPay', { orderData, data})
        return orderData
    })    
}
</script>
