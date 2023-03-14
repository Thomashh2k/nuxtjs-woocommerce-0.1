<template>
    <div class="tw-w-1/6">
        <v-list nav class="card-bg">
            <v-list-item prepend-icon="mdi-account" value="person">
              <div class="tw-text-purple-50 tw-normal-case">Person</div>
            </v-list-item>
            <v-list-item prepend-icon="mdi-credit-card" value="payments">
              <div class="tw-text-purple-50 tw-normal-case">Zahlungswege</div>
            </v-list-item>
            <v-list-item prepend-icon="mdi-truck-delivery-outline" value="deliveryAddress">
              <div class="tw-text-purple-50 tw-normal-case">Lieferanschrift</div>
            </v-list-item>
            <v-list-item prepend-icon="mdi-file" value="billAddress">
              <div class="tw-text-purple-50 tw-normal-case">Rechnungsanschrift</div>
            </v-list-item>
        </v-list>
    </div>

</template>
<style scoped>
.card-bg {
  background: #4c1d95;
}
</style>