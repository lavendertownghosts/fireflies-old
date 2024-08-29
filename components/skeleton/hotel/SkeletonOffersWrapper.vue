<template>
  <div class="relative overflow-hidden">
    <LoadingLayerHotelsearch :request="request" :is-local="true" />
    <ShimmerLayer :is-narrow="true" />
    <div class="flex flex-col p-16">
      <BaseSkeleton width="288px" height="24px" class="my-16" />
      <BaseSkeleton height="1px" class="w-full mb-16" />
      <SkeletonOfferCard v-for="i in 3" :key="i" />

      <BaseSkeleton width="288px" height="24px" class="mb-16 mt-40" />
      <BaseSkeleton height="1px" class="w-full mb-16" />
      <SkeletonOfferCard v-for="n in [4, 5, 6]" :key="n" />

      <BaseSkeleton width="288px" height="24px" class="mb-16 mt-40" />
      <BaseSkeleton height="1px" class="w-full mb-16" />
      <SkeletonOfferCard v-for="f in [7, 8, 9]" :key="f" />
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import SkeletonOfferCard from '@/components/skeleton/SkeletonOfferCard'
import LoadingLayerHotelsearch from '@/components/micro/LoadingLayerHotelsearch'
import ShimmerLayer from '@/components/micro/ShimmerLayer'

export default {
  name: 'SkeletonOffersWrapper',
  components: {
    BaseSkeleton,
    SkeletonOfferCard,
    LoadingLayerHotelsearch,
    ShimmerLayer
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    }
  }
}
</script>
