<template>
  <div>
    <div class="mb-24 w-full flex flex-col">
      <BaseSkeleton width="100%" height="48px" class="mr-8" />
    </div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
      <LoadingLayerApartmentsearch :request="request" />
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
            <!-- apartments -->
            <BaseSkeleton height="14px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="72px" class="w-full mb-12" />
            <BaseSkeleton height="14px" class="w-full mb-12" />
            <!-- apartments end -->
            <BaseSkeleton height="154px" class="w-full mb-12" />
            <BaseSkeleton height="74px" class="w-full mb-12" />
            <BaseSkeleton height="74px" class="w-full mb-12" />
            <BaseSkeleton height="74px" class="w-full mb-12" />
            <BaseSkeleton height="40px" class="w-full mb-12" />
          </div>
          <div class="md:ml-8 flex-grow overflow-hidden">
            <!-- first section -->
            <div class="flex flex-wrap justify-start">
              <SkeletonApartmentOfferCard
                v-for="i in apartmentsCount"
                :key="i"
                class="w-full sm:w-1/2 lg:w-1/3"
                :class="{
                  'sm:odd:pr-8 sm:even:pl-8':
                    apartmentsCount % 2 === 0 && apartmentsCount !== 6,
                  'lg:pr-8 lg:pl-0': i - 1 === 0 || (i - 1) % 3 === 0,
                  'lg:pr-8 lg:pl-8':
                    !(i - 1 === 0 || (i - 1) % 3 === 0) && i % 3 !== 0,
                  'lg:pr-0 lg:pl-8': i % 3 === 0
                }"
                :image-height="responsiveApartmentImageHeight"
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
import SkeletonApartmentOfferCard from '@/components/skeleton/apartments/SkeletonApartmentOfferCard'
import LoadingLayerApartmentsearch from '@/components/micro/LoadingLayerApartmentsearch'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import {
  apartmentsCount,
  responsiveApartmentImageHeight
} from '@/includes/utils'

export default {
  name: 'SkeletonApartmentListWrapper',
  components: {
    BaseSkeleton,
    SkeletonApartmentOfferCard,
    LoadingLayerApartmentsearch,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    apartmentsCount() {
      return apartmentsCount()
    },
    responsiveApartmentImageHeight() {
      return responsiveApartmentImageHeight()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
