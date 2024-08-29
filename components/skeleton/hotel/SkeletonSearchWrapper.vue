<template>
  <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
    <LoadingLayerHotelsearch :request="request" />
    <!-- header & search -->
    <div class="relative overflow-hidden">
      <ShimmerLayer :is-narrow="innerWidth < 1000" />
      <div>
        <div class="md:hidden">
          <div class="flex flex-row mb-20">
            <BaseSkeleton width="9px" height="41px" class="mr-8" />
            <div class="flex flex-col flex-grow">
              <BaseSkeleton width="66px" height="14px" class="mb-6" />
              <BaseSkeleton height="21px" class="w-full sm:w-5/6" />
            </div>
          </div>
          <BaseSkeleton height="32px" class="w-full" />
        </div>
        <div class="hidden md:block lg:hidden">
          <BaseSkeleton width="104px" height="12px" class="mb-4" />
          <BaseSkeleton height="48px" class="w-full mb-16" />
          <div class="flex flex-row items-start mb-4">
            <BaseSkeleton
              v-for="i in 3"
              :key="i"
              width="95px"
              height="12px"
              class="mr-10"
            />
          </div>
          <div class="flex flex-row justify-between mb-18">
            <BaseSkeleton width="420px" height="48px" />
            <BaseSkeleton width="135px" height="48px" />
          </div>
          <div class="flex flex-row justify-between">
            <BaseSkeleton width="484px" height="14px" />
            <BaseSkeleton width="209px" height="14px" />
          </div>
        </div>
        <div class="hidden lg:block">
          <div class="flex flex-row mb-4">
            <div class="w-1/2 flex flex-row items-start">
              <BaseSkeleton width="104px" height="12px" />
            </div>
            <div class="w-1/2 flex flex-row items-start">
              <BaseSkeleton
                v-for="i in 3"
                :key="i"
                width="95px"
                height="12px"
                class="mr-10"
              />
            </div>
          </div>
          <BaseSkeleton height="48px" class="w-full mb-16" />
          <div class="flex flex-row justify-between">
            <BaseSkeleton width="484px" height="14px" />
            <BaseSkeleton width="209px" height="14px" />
          </div>
        </div>
      </div>
      <!-- title & filters -->
      <div class="mt-40">
        <div class="hidden md:block">
          <div class="flex flex-row justify-between">
            <div class="flex flex-row">
              <BaseSkeleton width="9px" height="32px" class="mr-8" />
              <div class="flex flex-col flex-grow">
                <BaseSkeleton width="66px" height="14px" class="mb-6" />
                <BaseSkeleton width="407px" height="12px" />
              </div>
            </div>
            <BaseSkeleton width="288px" height="32px" />
          </div>
        </div>
      </div>
      <!-- sidebar & hotel cards -->
      <div class="w-full flex flex-row items-stretch mt-24">
        <div class="flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md">
          <BaseSkeleton height="40px" class="w-full mb-24" />
          <BaseSkeleton height="14px" class="w-full mb-12" />
          <BaseSkeleton height="52px" class="w-full mb-12" />
          <BaseSkeleton height="66px" class="w-full mb-12" />
          <BaseSkeleton height="94px" class="w-full mb-12" />
          <BaseSkeleton height="124px" class="w-full mb-24" />
          <BaseSkeleton height="96px" class="w-full mb-24" />
          <BaseSkeleton height="154px" class="w-full mb-24" />
          <BaseSkeleton height="182px" class="w-full mb-24" />
          <BaseSkeleton height="124px" class="w-full mb-24" />
          <BaseSkeleton height="124px" class="w-full mb-24" />
          <BaseSkeleton height="40px" class="w-full mb-24" />
        </div>
        <div class="md:ml-8 flex-grow overflow-hidden">
          <!-- first section -->
          <div class="flex flex-wrap justify-start">
            <SkeletonHotelCard
              v-for="i in firstSectionHotelCount"
              :key="i"
              class="w-full sm:w-1/2 lg:w-1/3"
              :class="{
                'sm:odd:pr-8 sm:even:pl-8':
                  firstSectionHotelCount % 2 === 0 &&
                  firstSectionHotelCount !== 6,
                'lg:pr-8 lg:pl-0': i - 1 === 0 || (i - 1) % 3 === 0,
                'lg:pr-8 lg:pl-8':
                  !(i - 1 === 0 || (i - 1) % 3 === 0) && i % 3 !== 0,
                'lg:pr-0 lg:pl-8': i % 3 === 0
              }"
              :image-height="responsiveHotelImageHeight"
            />
          </div>
          <!-- related offers -->
          <div class="w-full flex flex-col justify-start">
            <BaseSkeleton height="1px" class="w-full mb-15 flex-grow" />
            <BaseSkeleton width="120px" height="14px" class="mb-4" />
            <BaseSkeleton
              :height="innerWidth < 520 ? '20px' : '12px'"
              class="w-full sm:w-4/5 lg:w-2/3 xl:w-1/2"
            />
            <div class="flex flex-row overflow-hidden my-16 rounded">
              <BaseSkeleton
                v-for="i in 5"
                :key="i"
                width="172px"
                height="172px"
                class="flex-shrink-0 mr-9"
              />
            </div>
            <BaseSkeleton height="1px" class="w-full mb-24 flex-grow" />
          </div>
          <!-- second section -->
          <div class="flex flex-wrap justify-start">
            <SkeletonHotelCard
              v-for="i in secondSectionHotelCount"
              :key="i"
              class="w-full sm:w-1/2 lg:w-1/3"
              :class="{
                'sm:odd:pr-8 sm:even:pl-8':
                  firstSectionHotelCount % 2 === 0 &&
                  firstSectionHotelCount !== 6,
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
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import SkeletonHotelCard from '@/components/skeleton/hotel/SkeletonHotelCard'
import LoadingLayerHotelsearch from '@/components/micro/LoadingLayerHotelsearch'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import {
  firstSectionHotelCount,
  secondSectionHotelCount,
  responsiveHotelImageHeight
} from '@/includes/utils'

export default {
  name: 'SkeletonSearchWrapper',
  components: {
    BaseSkeleton,
    SkeletonHotelCard,
    LoadingLayerHotelsearch,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    firstSectionHotelCount() {
      return firstSectionHotelCount()
    },
    secondSectionHotelCount() {
      return secondSectionHotelCount()
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
