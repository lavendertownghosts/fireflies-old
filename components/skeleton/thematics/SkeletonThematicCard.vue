<template>
  <div class="mb-24 text-center">
    <BaseSkeleton :height="imageHeight + 'px'" class="w-full mb-16" />
    <BaseSkeleton height="24px" class="w-full mb-4" />
    <BaseSkeleton height="14px" class="w-full mb-8" />
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'

export default {
  name: 'SkeletonThematicCard',
  components: {
    BaseSkeleton
  },
  props: {
    imageHeight: {
      type: Number,
      default: 240
    }
  }
}
</script>
