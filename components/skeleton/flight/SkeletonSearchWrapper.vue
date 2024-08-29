<template>
  <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
    <LoadingLayerFlightsearch :request="request" />
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
        <div class="hidden md:block">
          <BaseSkeleton width="162px" height="14px" class="mb-16" />
          <div class="flex flex-wrap">
            <div class="w-full xl:w-1/2">
              <div class="flex flex-row leading-14 xl:leading-12 mb-4 ">
                <div class="w-1/2">
                  <BaseSkeleton width="49px" height="12px" />
                </div>
                <div class="w-1/2">
                  <BaseSkeleton width="49px" height="12px" />
                </div>
              </div>
              <div class="flex xl:hidden">
                <BaseSkeleton height="48px" class="w-full mb-16" />
              </div>
            </div>
            <div class="w-full xl:w-1/2">
              <div class="flex flex-row items-start mb-4">
                <BaseSkeleton
                  v-for="i in 3"
                  :key="i"
                  width="95px"
                  height="12px"
                  class="mr-10"
                />
              </div>
              <div class="flex flex-row justify-between mb-18 xl:hidden">
                <BaseSkeleton width="492px" height="48px" />
                <BaseSkeleton width="135px" height="48px" />
              </div>
            </div>
          </div>
          <div class="hidden xl:flex">
            <BaseSkeleton height="48px" class="w-full mb-16" />
          </div>
          <div class="flex flex-row justify-between">
            <BaseSkeleton width="556px" height="14px" />
            <BaseSkeleton width="209px" height="14px" />
          </div>
        </div>
      </div>
      <!-- title & filters -->
      <div class="md:mt-40">
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
      <!-- sidebar & flight cards -->
      <div class="w-full flex flex-row items-stretch mt-24">
        <div class="hidden md:block w-auto mr-8 min-w-grid-sm xl:min-w-grid-md">
          <BaseSkeleton height="14px" class="w-full mb-12" />
          <BaseSkeleton
            v-for="i in 3"
            :key="i"
            height="52px"
            class="w-full mb-12"
          />
          <BaseSkeleton height="98px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="98px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="148px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="154px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="154px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="124px" class="w-full mt-12 mb-24" />
          <BaseSkeleton height="40px" class="w-full" />
        </div>
        <div class="md:ml-8 flex-grow overflow-hidden">
          <!-- first section -->
          <div class="flex flex-wrap justify-start">
            <div v-for="i in 4" :key="i" class="w-full mb-24">
              <BaseSkeleton
                :height="responsiveFlightImageHeight + 'px'"
                class="w-full"
              />
            </div>
          </div>
          <!-- second section -->
          <div class="flex flex-wrap justify-start">
            <div
              v-for="i in secondSectionFlightCount"
              :key="i"
              class="w-full mb-24"
            >
              <BaseSkeleton
                :height="responsiveFlightImageHeight + 'px'"
                class="w-full"
              />
            </div>
          </div>
          <div class="flex flex-wrap">
            <BaseSkeleton
              :height="responsiveFlightOneWayImageHeight + 'px'"
              class="w-full mb-24"
            />
          </div>
          <div class="w-full px-16 mb-40 flex lg:justify-center">
            <BaseSkeleton height="40px" class="w-full lg:w-1/2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import LoadingLayerFlightsearch from '@/components/micro/LoadingLayerFlightsearch'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import {
  secondSectionFlightCount,
  responsiveFlightImageHeight,
  responsiveFlightOneWayImageHeight
} from '@/includes/utils'

export default {
  name: 'SkeletonSearchWrapper',
  components: {
    BaseSkeleton,
    LoadingLayerFlightsearch,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    secondSectionFlightCount() {
      return secondSectionFlightCount()
    },
    responsiveFlightImageHeight() {
      return responsiveFlightImageHeight()
    },
    responsiveFlightOneWayImageHeight() {
      return responsiveFlightOneWayImageHeight()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
