<template>
    <v-card class="card-bg">
        <v-card-title v-html="page?.title" class="tw-text-purple-50 tw-text-center" />
        <v-card-text v-html="page?.content" class="tw-text-purple-50" />
        <v-card-actions class="tw-text-purple-50">
             Veröffentlicht: {{ page?.date }}
        </v-card-actions>
    </v-card>
</template>
<script>
import { getPage } from '@/utils/getPage'
import moment from 'moment';

export default {
    name: 'generic-page',
    data() {
        return {
            page: {
                date: null,
                databaseId: null,
                title: null,
                content: null
            }
        }
    },
    async created() {
        debugger
        if(this.$route.params.slug[0].includes('index')) {
            this.$router.push('/')
        }
        const result = await getPage(this.$route.params.slug[0])
        this.page.date =  moment(result.pageBy.date).format('DD.MM.yyyy HH:mm')
        this.page.databaseId = result.pageBy.databaseId
        this.page.title = result.pageBy.title
        this.page.content = result.pageBy.content
    }
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}
</style>