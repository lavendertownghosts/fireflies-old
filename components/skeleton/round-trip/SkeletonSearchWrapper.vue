<template>
  <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
    <LoadingLayerRoundTripsearch :request="request" />
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
          <div class="flex flex-wrap">
            <div class="w-full">
              <div class="flex flex-row mb-4">
                <div class="w-1/2">
                  <BaseSkeleton width="128px" height="12px" />
                </div>
              </div>
              <div class="flex">
                <BaseSkeleton
                  height="48px"
                  class="w-full mb-16 lg:rounded-r-none"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-between h-14">
            <div class="flex w-2/3 lg:w-1/2">
              <BaseSkeleton height="14px" class="w-full" />
            </div>
            <div class="flex ">
              <BaseSkeleton width="209px" height="14px" />
            </div>
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
          </div>
        </div>
      </div>
      <!-- sidebar & car rental cards -->
      <div class="w-full flex flex-row items-stretch mt-24">
        <div class="hidden md:block w-auto mr-8 min-w-grid-sm xl:min-w-grid-md">
          <BaseSkeleton height="14px" class="w-full mb-12" />
          <BaseSkeleton
            v-for="i in 3"
            :key="i"
            :height="'80px'"
            class="w-full mb-12"
          />
          <BaseSkeleton height="74px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="98px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="102px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="240px" class="w-full mt-12 mb-12" />
          <div>
            <BaseSkeleton
              v-for="i in 2"
              :key="i"
              :height="'124px'"
              class="w-full mb-12 mt-12"
            />
          </div>
          <BaseSkeleton height="126px" class="w-full mt-12 mb-12" />
          <div>
            <BaseSkeleton
              v-for="i in 2"
              :key="i"
              :height="'124px'"
              class="w-full mb-12 mt-12"
            />
          </div>
          <BaseSkeleton height="40px" class="w-full mt-12" />
        </div>
        <div class="md:ml-8 flex-grow overflow-hidden">
          <!-- car rental cards section -->
          <div class="flex flex-wrap justify-start">
            <div class="hidden lg:block xl:hidden w-full mb-24">
              <BaseSkeleton :height="'111px'" class="w-full" />
            </div>
            <div v-for="i in 10" :key="i" class="w-full mb-24">
              <BaseSkeleton
                :height="responsiveRoundTripFilterHeight + 'px'"
                class="w-full"
              />
            </div>
            <div class="hidden w-full mb-24 lg:block xl:hidden">
              <BaseSkeleton :height="'106px'" class="w-full" />
            </div>
          </div>
          <div class="w-full px-16 mb-40 flex lg:justify-center">
            <BaseSkeleton height="40px" class="w-full lg:w-2/3 xl:w-7/12" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import ShimmerLayer from '@/components/micro/ShimmerLayer'
import LoadingLayerRoundTripsearch from '@/components/micro/LoadingLayerRoundTripsearch'

import { responsiveRoundTripFilterHeight } from '@/includes/utils'

export default {
  name: 'SkeletonSearchWrapper',
  components: {
    BaseSkeleton,
    ShimmerLayer,
    LoadingLayerRoundTripsearch
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    responsiveRoundTripFilterHeight() {
      return responsiveRoundTripFilterHeight()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
