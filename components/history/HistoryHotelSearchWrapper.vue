<template>
  <div v-if="getSearchHistory && getSearchHistory.length > 0">
    <span class="block text-xs leading-16 mb-6">{{
      $t('general.HistorySearch')
    }}</span>
    <div class="flex flex-col md:flex-row">
      <div
        v-for="(history, i) in getSearchHistory"
        :key="i"
        class="md:w-1/3 md:pr-16 lg:w-256 lg:pr-0 lg:mr-16 last:pr-0"
      >
        <HistoryHotelSearch :history="history" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistoryHotelSearch from '@/components/history/HistoryHotelSearch'

export default {
  name: 'HistoryHotelSearchWrapper',
  components: {
    HistoryHotelSearch
  },
  computed: {
    ...mapGetters('hotel', ['getSearchHistory'])
  }
}
</script>
