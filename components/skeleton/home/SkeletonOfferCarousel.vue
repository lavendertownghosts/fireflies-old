<template>
  <div>
    <div class="max-w-screen-xl mx-auto">
      <div class="relative overflow-hidden">
        <ShimmerLayer :is-narrow="innerWidth < 1000" />
        <!-- title & filters -->
        <div
          class="px-8 xl:px-34 max-w-screen-xl mx-auto text-center z-10 bg-white"
        >
          <div class="mt-32 flex-grow overflow-hidden">
            <!-- first section -->
            <div class="flex flex-wrap text-left justify-start">
              <SkeletonThematicCard
                v-for="i in 4"
                :key="i"
                class="w-full sm:w-1/2 lg:w-1/4 px-8"
                :image-height="responsiveThematicImageHeight"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonThematicCard from '@/components/skeleton/thematics/SkeletonThematicCard'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import { responsiveThematicImageHeight } from '@/includes/utils'

export default {
  name: 'SkeletonTopWidget',
  components: {
    SkeletonThematicCard,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    responsiveThematicImageHeight() {
      return responsiveThematicImageHeight()
    },
    offerCount() {
      if (this.innerWidth <= 320) {
        return 1
      } else if (this.innerWidth <= 520) {
        return 2
      } else if (this.innerWidth <= 772) {
        return 2
      } else {
        return 4
      }
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
