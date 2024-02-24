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
        <td>{{ item.databaseId }}</td>
        <td>
          <v-chip v-if="item.status === 'FAILED' || item.status === 'CANCELLED'" color="error" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.status) }}
            </span>
          </v-chip>
          <v-chip v-else-if="item.status === 'COMPLETED'" color="success" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.status) }}
            </span>
          </v-chip>
          <v-chip v-else-if="item.status === 'PROCESSING' || item.status === 'PENDING'" color="warning" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.status) }}
            </span>
          </v-chip>
          <v-chip v-else-if="item.status === 'REFUNDED' || item.status === 'ON_HOLD'" variant="elevated">
            <span class="tw-text-purple-50">
              {{ _getOrderStatus(item.status) }}
            </span>
          </v-chip>
        </td>
        <td>{{ _moment(item.date).format('DD.MM.yyyy HH:mm') }}</td>
        <td>{{ item.dateCompleted ?_moment(item.dateCompleted).format('DD.MM.yyyy HH:mm') : '---' }}</td>
        <td>{{ item.paymentMethodTitle }}</td>
        <td>{{ priceToNumber(item.total) + ' €' }}</td>
        <td>{{ priceToNumber(item.shippingTotal) + ' €' }}</td>
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
          <div class="tw-flex tw-flex-row">
            <div class="tw-w-1/2">
              <div v-for="pItem in item.selectable.lineItems.nodes">
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
                          <p>{{ item.raw.shipping.firstName + ' ' + item.raw.shipping.lastName }}</p>
                          <p>{{ item.raw.shipping.address1 + ' ' + item.raw.shipping.address2 }}</p>
                          <p>{{ item.raw.shipping.postcode + ' ' + item.raw.shipping.city }}</p>
                          <p>{{ getCountryNameByCode(item.raw.shipping.country) }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="tw-w-1/2">
                      <h1 class="tw-text-purple-50 tw-text-center">Rechnungsaddresse</h1>
                      <div class="tw-flex te-flex-col tw-justify-center">
                        <div class="tw-flex tw-flex-col tw-text-purple-50">
                          <p>{{ item.raw.billing.firstName + ' ' + item.raw.billing.lastName }}</p>
                          <p>{{ item.raw.billing.address1 + ' ' + item.raw.billing.address2 }}</p>
                          <p>{{ item.raw.billing.postcode + ' ' + item.raw.billing.city }}</p>
                          <p>{{ getCountryNameByCode(item.raw.billing.country) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-sheet>
            </div>
          </div>
        </td>
      </tr>
    </template>
    <template v-slot:no-data>
      <tr class="tw-flex tw-justify-center "  style="background: rgb(50, 17, 102)">
        <td colspan="7" class="tw-text-purple-50">
          Keine Bestellungen verfügbar
        </td>
      </tr>
    </template>
    <!-- <template v-slot:loader>
      <tr class="tw-flex tw-justify-center" style="background: rgb(50, 17, 102)">
        <td colspan="7" class="tw-text-purple-50">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </td>
      </tr>
    </template> -->
    </v-data-table-server>
</template>
<script>
import {mdiChevronUp, mdiChevronDown} from '@mdi/js';
import { getOrders } from '@/utils/order'
import { getOrderStatus } from '@/utils/functions'
import moment from 'moment';

export default {
    name: 'ListOrders',
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
      debugger
      this.loading = true
      const resp = await getOrders({search: '', first: 10})
      this.orders = resp.nodes
      this.loading = false
    },
    methods: {
      getCountryNameByCode(code) {
        if(code === 'DE') {
          return 'Deutschland'
        } else if (code === 'AT') {
          return 'Österreich'
        } else if (code === 'CH') {
          return 'Schweiz'
        } else {
          return 'Nicht verfügbar'
        }
      },
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