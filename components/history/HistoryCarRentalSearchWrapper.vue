<template>
  <div v-if="getSearchHistory && getSearchHistory.length > 0">
    <span class="block text-xs leading-16 mb-6">{{
      $t('general.HistorySearch')
    }}</span>
    <div class="flex flex-col lg:flex-row">
      <div
        v-for="(history, i) in getSearchHistory"
        :key="i"
        class="w-full lg:w-1/3 lg:pr-16 xl:w-320 last:pr-0"
      >
        <HistoryCarRentalSearch :history="history" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistoryCarRentalSearch from '@/components/history/HistoryCarRentalSearch'

export default {
  name: 'HistoryCarRentalSearchWrapper',
  components: {
    HistoryCarRentalSearch
  },
  computed: {
    ...mapGetters('carRental', ['getSearchHistory'])
  }
}
</script>
