<template>
  <div
    class="hero-bg w-full bg-primary flex flex-col justify-between"
    :style="{ backgroundImage: `url(${placeholderBackgroundUrl})` }"
  >
    <img :src="backgroundUrl" class="hidden" @load="onLoadBackgroundImage" />
    <div
      class="py-56 px-16 xl:px-40 max-w-screen-xl xl:min-w-xl xl:mx-auto flex flex-col flex-grow justify-center"
    >
      <div
        class="text-pink text-lg leading-24 sm:text-2xl sm:leading-40 md:text-3xl md:leading-56 font-light flex flex-col flex-grow justify-center min-w-full items-left z-10 text-shadow"
      >
        <div class="text-left">
          {{ $t('general.TransferHeroText1') }}
        </div>
        <div class="uppercase text-left pl-56 sm:pl-92 md:pl-128">
          {{ $t('general.TransferHeroText2') }}
        </div>
      </div>
    </div>
    <div class="search-bg w-full text-white z-10">
      <TransferSearchForm :is-homepage="true" />
    </div>
  </div>
</template>

<script>
import placeholderBackgroundUrl from '~/assets/images/transfer-hero-bg-small.jpg'
import backgroundUrl from '~/assets/images/transfer-hero-bg.jpg'

import TransferSearchForm from '@/components/forms/TransferSearchForm'
export default {
  name: 'TransferHero',
  components: {
    TransferSearchForm
  },
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl
    }
  },
  methods: {
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    }
  }
}
</script>

<style scoped>
.search-bg {
  max-height: 614px;
}
</style>
