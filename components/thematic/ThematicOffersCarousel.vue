<template>
  <Carousel
    :per-page="offersNum"
    :navigate-to="navTo"
    :loop="true"
    :pagination-enabled="false"
    :scroll-per-page="true"
    :special-scroll="true"
    class="tematic-offers"
  >
    <Slide
      v-for="(offer, index) in results"
      :key="index"
      class="flex flex-col items-center justify-center px-8"
    >
      <div
        class="tematic-offer-image relative bg-grey-light rounded cursor-pointer"
        :alt="offer.name"
        @click="$router.push(localePath('/thematic-offers/' + offer.id))"
      >
        <div
          class="absolute top-0 bottom-0 right-0 left-0 w-full text-center flex items-center justify-center"
        >
          <i class="far fa-image-polaroid text-xl"></i>
        </div>
        <div
          class="absolute top-0 bottom-0 right-0 left-0 rounded bg-center bg-cover"
          :style="'background-image: url(' + offer.picture_big_filename + ')'"
        ></div>
      </div>
      <h2 class="w-full text-lg leading-36 text-center text-black mt-16">
        {{ offer.name | truncate(15) }}
      </h2>
      <p class="text-base leading-24">
        {{
          $t('thematic.thematicOfferCount', {
            offers: offer.number_of_offers
          })
        }}
      </p>
    </Slide>
  </Carousel>
</template>

<script>
import { Carousel, Slide } from '@/components/carousel'

export default {
  name: 'ThematicOffersCarousel',
  components: {
    Carousel,
    Slide
  },
  props: {
    results: {
      type: [Array, Boolean],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      offersNum: 1,
      navTo: [2, false]
    }
  },
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('resize', this.setOffersNum)
  },
  destroyed() {
    window.removeEventListener('resize', this.setOffersNum)
  },
  mounted() {
    this.setOffersNum()
  },
  methods: {
    setOffersNum() {
      if (window.innerWidth > 1023) {
        this.offersNum = 4
        this.navTo = [0, false]
      } else {
        this.offersNum = 1
        this.navTo = [2, false]
      }
    }
  }
}
</script>

<style>
.tematic-offer-image {
  width: 236px;
  height: 314px;
}

.VueCarousel.tematic-offers {
  left: 20%;
}

@media (min-width: 520px) and (max-width: 771px) {
  .VueCarousel.tematic-offers {
    left: 28%;
  }
}

@media (min-width: 772px) and (max-width: 1023px) {
  .VueCarousel.tematic-offers {
    left: 36%;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .VueCarousel.tematic-offers {
    left: 50%;
    transform: translateX(-50%);
  }

  .VueCarousel.tematic-offers .VueCarousel-wrapper {
    width: 100% !important;
  }
}

@media (min-width: 1280px) {
  .VueCarousel.tematic-offers {
    left: 50%;
    transform: translateX(-50%);
  }

  .VueCarousel.tematic-offers .VueCarousel-wrapper {
    width: 100% !important;
  }

  .tematic-offer-image {
    width: 288px;
    height: 384px;
  }
}

.VueCarousel.tematic-offers .VueCarousel-wrapper {
  overflow: visible;
  width: 1005px;
  left: 0;
}

.VueCarousel.tematic-offers
  .VueCarousel-wrapper
  .VueCarousel-inner
  .VueCarousel-slide {
  flex-shrink: 1;
  flex-basis: initial;
}

.VueCarousel.tematic-offers .VueCarousel-wrapper .VueCarousel-inner {
  justify-content: center;
}
</style>
