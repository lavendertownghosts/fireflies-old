<template>
  <div class="flex flex-col sm:flex-row sm:flex-wrap">
    <ThematicResultCard
      v-for="(item, index) in results"
      :key="index"
      :thematic="item"
      :image-height="responsiveWidgetThematicOfferHeight"
      class="w-full sm:w-1/2 lg:w-1/4 px-8"
    />
  </div>
</template>

<script>
import ThematicResultCard from '@/components/thematic/ThematicResultCard'
import { responsiveWidgetThematicOfferHeight } from '@/includes/utils'

export default {
  name: 'ThematicHomeBottom',
  components: {
    ThematicResultCard
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
