<template>
    <v-data-table-server
        v-model:expanded="expanded"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        show-expand
        color="primary"
        class="elevation-1 table-bg tw-px-4"
        item-value="name"
        style="background-color: rgb(50, 17, 102);"
        >
    <!-- @update:options="loadItems" -->
    <template v-slot:headers="{ columns }">
      <tr>
        <th v-for="item in columns">
          <span class="tw-text-purple-50">{{ item.title }}</span>
        </th>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr class="tw-text-purple-50">
        <td>{{ item.columns.id }}</td>
        <td>{{ item.columns.status }}</td>
        <td>{{ item.columns.date }}</td>
        <td>{{ item.columns.dateCompleted }}</td>
        <td>{{ item.columns.paymentMethodTitle }}</td>
        <td>{{ item.columns.total }}</td>
      </tr>
    </template>
    <template v-slot:item.data-table-expand="{ expand, isExpanded }">
        <v-icon dense>
            {{ !isExpanded ? mdiChevronDown : mdiChevronUp }}
        </v-icon>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          More info about {{ item }}
        </td>
      </tr>
    </template>
    </v-data-table-server>
</template>
<script>
import * as labsComponents from 'vuetify/labs/components';
import {mdiChevronUp, mdiChevronDown} from '@mdi/js';

export default {
    name: 'ListOrders',
    components: {
    ...labsComponents,
    },
    data() {
        return {
            itemsPerPage: 5,
            mdiChevronDown,
            mdiChevronUp,
            expanded: [],
            headers: [
                {
                    title: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'id',
                    key: 'id',
                },
                { title: 'Status', key: 'status', align: 'end' },
                { title: 'Bestellt am', key: 'date', align: 'end' },
                { title: 'Abgeschlossen am', key: 'dateCompleted', align: 'end' },
                { title: 'Zahlungsmethode', key: 'paymentMethodTitle', align: 'end' },
                { title: 'Kosten insgesammt', key: 'total', align: 'end' },
                { title: '', key: 'data-table-expand' }
            ],
            serverItems: [
                { id: 1, status: 'In Bearbeitung', date: '2021-01-01', dateCompleted: '2021-01-01', paymentMethodTitle: 'PayPal', total: '100€' },
                { id: 2, status: 'In Bearbeitung', date: '2021-01-01', dateCompleted: '2021-01-01', paymentMethodTitle: 'Klarna', total: '100€' },
                { id: 3, status: 'Zugestellt', date: '2021-01-01', dateCompleted: '2021-01-01', paymentMethodTitle: 'PayPal', total: '100€' },
                { id: 4, status: 'Zugestellt', date: '2021-01-01', dateCompleted: '2021-01-01', paymentMethodTitle: 'PayPal', total: '100€' },
            ],
            loading: false,
            totalItems: 0,
        }
    }
}
</script>
<style scoped>
.table-bg, .v-table, .v-data-table__td, .v-data-table__tbody, .v-data-table__thead{
  background-color: rgb(50, 17, 102);
}
table, thead, tbody, tr, th, td {
    background-color: rgb(50, 17, 102) !important;
}
</style>