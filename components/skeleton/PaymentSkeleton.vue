<template>
  <div class="absolute w-504 top-0 left-0 bottom-0 right-0 z-10 pt-48 pr-32">
    <div class="relative overflow-hidden bg-white pb-12">
      <ShimmerLayer :is-narrow="true" />
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2 pr-20 mb-10">
          <BaseSkeleton width="100px" height="12px" class="mt-7 mb-8" />
          <BaseSkeleton height="46px" class="w-full" />
        </div>
        <div class="flex flex-col w-1/2">
          <BaseSkeleton width="100px" height="12px" class="mt-7 mb-8" />
          <BaseSkeleton height="46px" class="w-full" />
        </div>
      </div>
      <div class="flex flex-col mb-10">
        <BaseSkeleton width="120px" height="12px" class="w-full mt-7 mb-8" />
        <BaseSkeleton height="46px" class="w-full" />
      </div>
      <div class="flex flex-row mb-24">
        <div class="flex flex-col w-full pr-20">
          <BaseSkeleton width="100px" height="12px" class="w-full mt-7 mb-8" />
          <BaseSkeleton height="46px" class="w-full" />
        </div>
        <div class="flex flex-col w-1/3">
          <BaseSkeleton width="20px" height="12px" class="w-full mt-7 mb-8" />
          <BaseSkeleton height="46px" class="w-full" />
        </div>
      </div>
      <div class="flex flex-row">
        <BaseSkeleton width="500px" height="46px" class="w-full" />
      </div>
    </div>
  </div>
</template>
<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'
import ShimmerLayer from '@/components/micro/ShimmerLayer'
export default {
  name: 'PaymentSkeleton',
  components: {
    BaseSkeleton,
    ShimmerLayer
  },
  props: {}
}
</script>
