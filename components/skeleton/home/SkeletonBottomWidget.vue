<template>
  <div>
    <div class="max-w-screen-xl mx-auto">
      <div class="relative overflow-hidden">
        <ShimmerLayer :is-narrow="innerWidth < 1000" />
        <!-- title & filters -->
        <div class="mt-24 flex-grow overflow-hidden">
          <!-- first section -->
          <div class="flex flex-wrap text-left justify-start">
            <SkeletonThematicOfferCard
              v-for="i in offerCount"
              :key="i"
              class="w-full sm:w-1/2 lg:w-1/4 px-8"
              :image-height="responsiveHotelImageHeight"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonThematicOfferCard from '@/components/skeleton/thematics/SkeletonThematicOfferCard'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import { responsiveWidgetThematicOfferHeight } from '@/includes/utils'

export default {
  name: 'SkeletonBottomWidget',
  components: {
    SkeletonThematicOfferCard,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    responsiveHotelImageHeight() {
      return responsiveWidgetThematicOfferHeight()
    },
    offerCount() {
      if (this.innerWidth <= 772) {
        return 4
      } else {
        return 8
      }
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
