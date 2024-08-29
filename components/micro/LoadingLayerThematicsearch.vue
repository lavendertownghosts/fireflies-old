<template>
  <div
    :class="[
      isLocal
        ? 'absolute h-full pt-177 sm:pt-72 md:pt-128 lg:pt-216'
        : 'fixed top-0 bottom-0 left-0 h-screen items-center'
    ]"
    class="bg-white-opaque w-full flex justify-center z-30 overflow-hidden px-16"
  >
    <div
      :class="{
        'mx-auto': isLocal
      }"
      class="loading-layer-modal-wrapper bg-primary-gradient rounded text-white text-center p-16 flex flex-col items-center justify-center"
    >
      <p class="text-xs leading-12 pulse-me">{{ $t('hotel.LoadingOffers') }}</p>
      <div class="my-16">
        <LoadingAnimation color="white" />
      </div>
      <p class="font-bold text-base w-240 leading-16 truncate mb-4">
        {{ thematicName }}
      </p>
    </div>
  </div>
</template>

<script>
import LoadingAnimation from '@/components/micro/LoadingAnimation'

export default {
  name: 'LoadingLayerThematicsearch',
  components: {
    LoadingAnimation
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    },
    isLocal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      thematicName: ' '
    }
  },
  watch: {
    request: {
      handler(val) {
        this.thematicName = val.name
      },
      deep: true
    }
  }
}
</script>

<style>
.loading-layer-modal-wrapper {
  width: 288px;
  height: 188px;
}
</style>
