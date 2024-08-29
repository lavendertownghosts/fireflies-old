<template>
  <div class="flex flex-col sm:flex-row sm:flex-wrap">
    <ExclusiveResultCard
      v-for="(item, index) in results"
      :key="index"
      :offer="item"
      :image-height="responsiveWidgetThematicOfferHeight"
      :is-list="true"
      class="w-full sm:w-1/2 lg:w-1/4 px-8"
    />
  </div>
</template>

<script>
import ExclusiveResultCard from '@/components/exclusive-offers/ExclusiveResultCard'
import { responsiveWidgetThematicOfferHeight } from '@/includes/utils'

export default {
  name: 'ExclusiveHomeTop',
  components: {
    ExclusiveResultCard
  },
  props: {
    results: {
      type: [Array, Boolean],
      default() {
        return []
      }
    }
  },
  computed: {
    responsiveWidgetThematicOfferHeight() {
      return responsiveWidgetThematicOfferHeight()
    }
  }
}
</script>
