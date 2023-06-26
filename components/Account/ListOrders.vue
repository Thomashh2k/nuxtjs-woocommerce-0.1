<template>
    <v-data-table-server
        v-model:expanded="expanded"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="orders"
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
    <template v-slot:item="{ item, isExpanded, toggleExpand }">
      <tr class="tw-text-purple-50">
        <td>{{ item.columns.id }}</td>
        <td>
          <v-chip v-if="item.columns.status === 'FAILED'" color="error" variant="elevated">
            <span class="tw-text-purple-50">
              {{ item.columns.status }}
            </span>
          </v-chip>
        </td>
        <td>{{ _moment(item.columns.date).format('DD.MM.yyyy HH:mm') }}</td>
        <td>{{ item.columns.dateCompleted ? item.columns.dateCompleted : '---' }}</td>
        <td>{{ item.columns.paymentMethodTitle }}</td>
        <td>{{ item.columns.total + ' €' }}</td>
        <td> 
          <v-btn
            variant="text"
            :icon="isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            @click="toggleExpand"
          ></v-btn>
      </td>
      </tr>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <div v-for="pItem in item.selectable.lineItems.nodes" class="tw-flex tw-flex-row">
            <img :src="pItem.product.node.image.sourceUrl" class="tw-h-20" />
            <div class="tw-flex tw-flex-col tw-self-start tw-pl-4">
              <span class="tw-text-purple-50">{{ pItem.product.node.name }}</span>
              <span class="tw-text-purple-50">{{ pItem.total + ' €' }}</span>
            </div>
          </div>
        </td>
      </tr>
    </template>
    <template v-slot:no-data>
      <tr class="tw-flex tw-justify-center" style="background: rgb(50, 17, 102)">
        <td colspan="7" class="tw-text-purple-50">
          Keine Bestellungen verfügbar
        </td>
      </tr>
    </template>
    </v-data-table-server>
</template>
<script>
import * as labsComponents from 'vuetify/labs/components';
import {mdiChevronUp, mdiChevronDown} from '@mdi/js';
import { getOrders } from '@/utils/order'
import moment from 'moment';

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
            orders: [],
            _moment: moment,
            loading: true,
        }
    },
    async created() {
      this.loading = true
      const resp = await getOrders({search: '', first: 10})
      this.orders = resp.nodes
      
      this.loading = false
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