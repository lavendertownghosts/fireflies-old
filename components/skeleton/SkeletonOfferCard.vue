<template>
  <div class="flex flex-col">
    <div class="flex flex-row items-center justify-between mb-16">
      <div class="flex flex-col sm:w-1/2">
        <BaseSkeleton width="212px" height="14px" class="mb-6" />
        <BaseSkeleton width="134px" height="12px" />
      </div>
      <div class="flex flex-row items-center">
        <BaseSkeleton width="87px" height="14px" class="sm:mr-16" />
        <div class="hidden sm:block">
          <BaseSkeleton width="103px" height="40px" />
        </div>
      </div>
    </div>
    <BaseSkeleton height="40px" class="w-full mb-16 sm:hidden" />
    <BaseSkeleton height="1px" class="w-full mb-16" />
  </div>
</template>

<script>
import BaseSkeleton from '@/components/skeleton/BaseSkeleton'

export default {
  name: 'SkeletonOfferCard',
  components: {
    BaseSkeleton
  }
}
</script>
