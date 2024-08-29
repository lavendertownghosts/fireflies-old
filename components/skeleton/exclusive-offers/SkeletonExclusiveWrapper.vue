<template>
  <div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
      <!-- header & search -->
      <div class="relative overflow-hidden">
        <ShimmerLayer :is-narrow="innerWidth < 1000" />
        <!-- title & filters -->
        <div class="mt-0 pb-24">
          <div class="hidden md:block">
            <div class="flex flex-row justify-between">
              <div class="flex flex-row">
                <BaseSkeleton width="9px" height="32px" class="mr-8" />
                <div class="flex flex-col flex-grow">
                  <BaseSkeleton width="66px" height="14px" class="mb-6" />
                  <BaseSkeleton width="407px" height="12px" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- cards -->
        <div class="flex flex-wrap justify-start mb-12 -ml-8 -mr-8">
          <SkeletonThematicOfferCard
            v-for="i in exclusiveCount"
            :key="i"
            class="w-full sm:w-1/2 lg:w-1/4 px-8"
            :image-height="responsiveWidgetThematicOfferHeight"
          />
        </div>
        <div class="w-full px-16 mb-56 flex lg:justify-center">
          <BaseSkeleton height="40px" class="w-full lg:w-1/2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import SkeletonThematicOfferCard from '@/components/skeleton/exclusive-offers/SkeletonExclusiveOfferCard'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import {
  exclusiveCount,
  responsiveWidgetThematicOfferHeight
} from '@/includes/utils'

export default {
  name: 'SkeletonExclusiveListWrapper',
  components: {
    BaseSkeleton,
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
    exclusiveCount() {
      return exclusiveCount()
    },
    responsiveWidgetThematicOfferHeight() {
      return responsiveWidgetThematicOfferHeight()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
