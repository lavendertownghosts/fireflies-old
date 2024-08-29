<template>
  <div>
    <div class="mb-24 w-full flex flex-col">
      <BaseSkeleton width="100%" height="160px" class="mr-8" />
    </div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
      <LoadingLayerThematicsearch :request="request" />
      <!-- header & search -->
      <div class="relative overflow-hidden">
        <ShimmerLayer :is-narrow="innerWidth < 1000" />
        <!-- title & filters -->
        <div class="mt-0">
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
        <!-- sidebar & hotel cards -->
        <div class="w-full flex flex-row items-stretch mt-24">
          <div
            class="flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md"
          >
            <!-- thematics -->
            <BaseSkeleton height="14px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="14px" class="w-full mb-12" />
            <!-- thematics end -->
            <BaseSkeleton height="154px" class="w-full mb-12" />
            <BaseSkeleton height="74px" class="w-full mb-12" />
            <BaseSkeleton height="74px" class="w-full mb-12" />
            <BaseSkeleton height="74px" class="w-full mb-12" />
            <BaseSkeleton height="40px" class="w-full mb-12" />
          </div>
          <div class="md:ml-8 flex-grow overflow-hidden">
            <!-- first section -->
            <div class="flex flex-wrap justify-start">
              <SkeletonThematicOfferCard
                v-for="i in thematicCount"
                :key="i"
                class="w-full sm:w-1/2 lg:w-1/3"
                :class="{
                  'sm:odd:pr-8 sm:even:pl-8':
                    thematicCount % 2 === 0 && thematicCount !== 6,
                  'lg:pr-8 lg:pl-0': i - 1 === 0 || (i - 1) % 3 === 0,
                  'lg:pr-8 lg:pl-8':
                    !(i - 1 === 0 || (i - 1) % 3 === 0) && i % 3 !== 0,
                  'lg:pr-0 lg:pl-8': i % 3 === 0
                }"
                :image-height="responsiveHotelImageHeight"
              />
            </div>
            <div class="w-full px-16 mb-56 flex lg:justify-center">
              <BaseSkeleton height="40px" class="w-full lg:w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import SkeletonThematicOfferCard from '@/components/skeleton/thematics/SkeletonThematicOfferCard'
import LoadingLayerThematicsearch from '@/components/micro/LoadingLayerThematicsearch'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import { thematicCount, responsiveHotelImageHeight } from '@/includes/utils'

export default {
  name: 'SkeletonThematicListWrapper',
  components: {
    BaseSkeleton,
    SkeletonThematicOfferCard,
    LoadingLayerThematicsearch,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    thematicCount() {
      return thematicCount()
    },
    responsiveHotelImageHeight() {
      return responsiveHotelImageHeight()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
