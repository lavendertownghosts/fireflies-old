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
        <!-- sidebar & hotel cards -->
        <div class="flex flex-wrap justify-start ml-8 mr-8 xl:ml-32 xl:mr-32">
          <SkeletonThematicCard
            v-for="i in categoryCount"
            :key="i"
            class="mb-16 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-8"
            :image-height="responsiveThematicImageHeight"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import SkeletonThematicCard from '@/components/skeleton/thematics/SkeletonThematicCard'
import LoadingLayerThematicsearch from '@/components/micro/LoadingLayerThematicsearch'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

import {
  thematicCount,
  thematicCategoryCount,
  responsiveThematicImageHeight
} from '@/includes/utils'

export default {
  name: 'SkeletonThematicListWrapper',
  components: {
    BaseSkeleton,
    SkeletonThematicCard,
    ShimmerLayer,
    LoadingLayerThematicsearch
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
    categoryCount() {
      return thematicCategoryCount()
    },
    responsiveThematicImageHeight() {
      return responsiveThematicImageHeight()
    },
    innerWidth() {
      return window.innerWidth
    }
  }
}
</script>
