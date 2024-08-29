<template>
  <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
    <LoadingLayerCarRentalsearch :request="request" />
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
          <BaseSkeleton width="176px" height="14px" class="mb-16" />
          <div class="flex flex-wrap">
            <div class="w-full lg:w-2/6 xl:w-5/12">
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
            <div class="w-full lg:w-4/6 xl:w-7/12">
              <div class="flex flex-row justify-between mb-18">
                <div class="flex-grow mr-20 lg:mr-0">
                  <div class="flex-col">
                    <div class="flex flex-row w-full lg:mb-4">
                      <div v-for="i in 3" :key="i" class="w-1/3">
                        <BaseSkeleton
                          :width="i === 3 ? '42px' : '83px'"
                          height="12px"
                          class="mr-10"
                        />
                        <BaseSkeleton
                          v-if="i < 3"
                          width="42px"
                          height="12px"
                          class="mr-10"
                        />
                      </div>
                    </div>
                    <div class="w-full">
                      <BaseSkeleton
                        class="w-full lg:rounded-r-none lg:rounded-l-none"
                        height="48px"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex-initial lg:pt-4">
                  <BaseSkeleton class="mt-24" width="135px" height="48px" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-end">
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
      <!-- sidebar & car rental cards -->
      <div class="w-full flex flex-row items-stretch mt-24">
        <div class="hidden md:block w-auto mr-8 min-w-grid-sm xl:min-w-grid-md">
          <BaseSkeleton height="14px" class="w-full mb-12" />
          <BaseSkeleton
            v-for="i in 3"
            :key="i"
            :height="innerWidth >= 1280 ? '52px' : '66px'"
            class="w-full mb-12"
          />
          <BaseSkeleton height="124px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="154px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="154px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="124px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="124px" class="w-full mt-12 mb-12" />
          <BaseSkeleton height="40px" class="w-full mt-12" />
        </div>
        <div class="md:ml-8 flex-grow overflow-hidden">
          <!-- car rental cards section -->
          <div class="flex flex-wrap justify-start">
            <div class="hidden lg:block xl:hidden w-full mb-24">
              <BaseSkeleton :height="'111px'" class="w-full" />
            </div>
            <div
              v-for="i in sectionCarRentalCount"
              :key="i"
              class="w-full mb-24"
            >
              <BaseSkeleton
                :height="responsiveCarRentalFilterHeight + 'px'"
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
import LoadingLayerCarRentalsearch from '@/components/micro/LoadingLayerCarRentalsearch'

import {
  responsiveCarRentalFilterHeight,
  sectionCarRentalCount
} from '@/includes/utils'

export default {
  name: 'SkeletonSearchWrapper',
  components: {
    BaseSkeleton,
    ShimmerLayer,
    LoadingLayerCarRentalsearch
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    responsiveCarRentalFilterHeight() {
      return responsiveCarRentalFilterHeight()
    },
    sectionCarRentalCount() {
      return sectionCarRentalCount()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
