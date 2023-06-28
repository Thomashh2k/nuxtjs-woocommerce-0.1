<template>
    <v-data-table-server
        v-model:expanded="expanded"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="orders"
        :itemsLength="1"
        :loading="loading"
        show-expand
        color="primary"
        class="table-bg tw-px-4"
        expand-on-click
        item-value="databaseId"
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
      <tr class="tw-text-purple-50 elevation-10">
        <td>{{ item.columns.databaseId }}</td>
        <td>
          <v-chip v-if="item.columns.status === 'FAILED' || item.columns.status === 'CANCELLED'" color="error" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.columns.status) }}
            </span>
          </v-chip>
          <v-chip v-else-if="item.columns.status === 'COMPLETED'" color="success" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.columns.status) }}
            </span>
          </v-chip>
          <v-chip v-else-if="item.columns.status === 'PROCESSING' || item.columns.status === 'PENDING'" color="warning" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.columns.status) }}
            </span>
          </v-chip>
          <v-chip v-else-if="item.columns.status === 'REFUNDED' || item.columns.status === 'ON_HOLD'" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.columns.status) }}
            </span>
          </v-chip>
        </td>
        <td>{{ _moment(item.columns.date).format('DD.MM.yyyy HH:mm') }}</td>
        <td>{{ item.columns.dateCompleted ?_moment(item.columns.dateCompleted).format('DD.MM.yyyy HH:mm') : '---' }}</td>
        <td>{{ item.columns.paymentMethodTitle }}</td>
        <td>{{ priceToNumber(item.columns.total) + ' €' }}</td>
        <td>{{ priceToNumber(item.columns.shippingTotal) + ' €' }}</td>
        <td> 
          
          <v-btn
            variant="text"
            :icon="isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            @click="toggleExpand(item)"
          ></v-btn>
      </td>
      </tr>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr class="">
        <td :colspan="columns.length">
          <div>
            <!-- <ul class="list-none">
              <li class="tw-text-purple-50">Warenwert Gesammt: {{ priceToNumber(item.selectable.total) + ' €' }}</li>
              <li class="tw-text-purple-50">Versandkosten Gesammt: {{ priceToNumber(item.selectable.shippingTotal) + ' €' }}</li>
              <li>Milk</li>
            </ul>  
            <v-divider /> -->
            <div v-for="pItem in item.selectable.lineItems.nodes" class="">
              <NuxtLink class="tw-flex tw-flex-row" :to="{path: '/product/' + pItem.product.node.slug, query: { id:  pItem.product.node.databaseId }}">
                <img :src="pItem.product.node.image.sourceUrl" class="tw-h-25 tw-w-20 tw-my-2" />
                <div class="tw-flex tw-flex-col tw-self-start tw-pl-4 tw-mt-1">
                  <span class="tw-text-purple-50 hover:tw-underline">{{ pItem.product.node.name }}</span>
                  <span class="tw-text-purple-50 hover:tw-underline">{{ pItem.total + ' €' }}</span>
                </div>
              </NuxtLink>
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
import { getOrderStatus } from '@/utils/functions'
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
            _getOrderStatus: getOrderStatus,
            expanded: [],
            headers: [
                {
                    title: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'databaseId',
                    key: 'databaseId',
                },
                { title: 'Status', key: 'status', align: 'end' },
                { 
                  title: 'Bestellt am',
                  key: 'date',
                  align: 'end',
                  sortable: true,
                  sort: (a, b) => {
                    const numA = moment(a.date).unix()
                    const numB = moment(b.date).unix()
                    return numA - numB
                  }
                },
                { title: 'Abgeschlossen am', key: 'dateCompleted', align: 'end' },
                { title: 'Zahlungsmethode', key: 'paymentMethodTitle', align: 'end' },
                { title: 'Kosten insgesammt', key: 'total', align: 'end' },
                { title: 'Versandkosten insgesammt', key: 'shippingTotal', align: 'end' },
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
      // for(let i = 0; i < this.orders.length; i++) {
      //   this.orders[i].date = moment(resp.nodes[i].date).format('DD.MM.yyyy HH:mm')
      //   this.orders[i].dateCompleted = resp.nodes[i].dateCompleted ? resp.nodes[i].dateCompleted : '---'
      //   this.orders[i].total = resp.nodes[i].total + ' €'
      // }
      
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