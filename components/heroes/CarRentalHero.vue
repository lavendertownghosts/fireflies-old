<template>
  <div
    class="hero-bg w-full bg-primary flex flex-col justify-between"
    :style="{ backgroundImage: `url(${placeholderBackgroundUrl})` }"
  >
    <img :src="backgroundUrl" class="hidden" @load="onLoadBackgroundImage" />
    <div
      class="px-16 md:pt-16 xl:px-40 max-w-screen-xl xl:min-w-xl xl:mx-auto flex flex-col flex-grow justify-center"
    >
      <div
        class="text-pink text-lg leading-24 sm:text-2xl sm:leading-40 md:text-3xl md:leading-56 font-light flex flex-col flex-grow justify-center min-w-full items-left z-10 text-shadow hidden md:flex md:my-42 lg:my-92"
      >
        <div class="text-left">
          {{ $t('general.CarRentHeroText1') }}
        </div>
        <div class="uppercase text-left pl-56 sm:pl-92 md:pl-128">
          {{ $t('general.CarRentHeroText2') }}
        </div>
      </div>
    </div>
    <div class="search-bg w-full text-white z-10">
      <CarRentalSearchForm :is-homepage="true" />
    </div>
  </div>
</template>

<script>
import placeholderBackgroundUrl from '~/assets/images/car-rental-hero-bg-small.jpg'
import backgroundUrl from '~/assets/images/car-rental-hero-bg.jpg'

import CarRentalSearchForm from '@/components/forms/CarRentalSearchForm'
export default {
  name: 'CarRentalHero',
  components: {
    CarRentalSearchForm
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
