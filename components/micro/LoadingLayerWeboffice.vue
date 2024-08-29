<template>
  <div class="w-full flex justify-center z-30 overflow-hidden px-16">
    <div class="rounded text-center p-16">
      <p class="text-xs leading-12 text-black">
        {{ $t('weboffice.LoadingLayerTitle') }}
      </p>
      <div class="my-16">
        <LoadingAnimation color="#00ADB5" />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingAnimation from '@/components/micro/LoadingAnimation'
export default {
  name: 'LoadingLayerWeboffice',
  components: {
    LoadingAnimation
  }
}
</script>
