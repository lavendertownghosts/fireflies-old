<template>
  <div class="mb-24">
    <BaseSkeleton :height="imageHeight + 'px'" class="w-full mb-8" />
    <BaseSkeleton height="14px" class="w-full mb-8" />
    <BaseSkeleton height="14px" class="w-full mb-8" />
    <BaseSkeleton height="14px" class="w-full mb-8" />
    <BaseSkeleton height="14px" class="w-full mb-8" />
    <div>
      <BaseSkeleton width="145px" height="14px" class="mb-8" />
    </div>
    <div>
      <BaseSkeleton width="73px" height="16px" class="block" />
    </div>
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'

export default {
  name: 'SkeletonThematicOfferCard',
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
