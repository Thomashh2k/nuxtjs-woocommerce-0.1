<template>
    <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        class="elevation-1 table-bg"
        item-value="name"
        @update:options="loadItems"
    ></v-data-table-server>
</template>
<script>
import * as labsComponents from 'vuetify/labs/components'

export default {
    name: 'ListOrders',
    components: {
    ...labsComponents,
    },
    data() {
        return {
            itemsPerPage: 5,
            headers: [
                {
                title: 'ID',
                align: 'start',
                sortable: false,
                value: 'id',
                },
                { title: 'Status', key: 'status', align: 'end' },
                { title: 'Bestellt am', key: 'date', align: 'end' },
                { title: 'Abgeschlossen am', key: 'dateCompleted', align: 'end' },
                { title: 'Zahlungsmethode', key: 'paymentMethodTitle', align: 'end' },
                { title: 'Kosten insgesammt', key: 'total', align: 'end' },
            ],
            loading: false,
            totalItems: 0,
        }
    }
}
</script>
<style scoped>
.table-bg {
  background: rgb(50, 17, 102);;
}
</style>