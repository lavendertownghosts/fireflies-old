<template>
  <div class="relative">
    <div
      v-show="showLeftGradient"
      :class="gradientHiddenClass"
      class="absolute w-24 top-0 left-0 bg-white-to-black-gradient z-10 h-240"
    ></div>
    <div
      v-show="showRightGradient"
      :class="gradientHiddenClass"
      class="absolute w-24 top-0 right-0 bg-black-to-white-gradient z-10 h-240"
    ></div>
    <Scrollbar
      ref="scrollWrapper"
      class="overflow-y-hidden"
      :centered="false"
      @left="checkGradient"
    >
      <div class="flex flex-row md:pb-0 h-full" :style="getWrapperStyle">
        <div
          v-for="(offer, index) in offers"
          :key="index"
          :class="index === 0 ? 'mr-8' : index === 3 ? 'ml-8' : 'mx-8'"
        >
          <div class="relative">
            <div
              style=""
              class="bg-primary-gradient absolute top-0 left-0 z-10 rounded-tl rounded-br text-white p-10"
            >
              <div class="flex flex-row items-center">
                <div><img :src="getImage(offer.typeIcon)" class="mr-4" /></div>
                <div class="text-sm leading-14 font-bold">
                  {{ offer.type }}
                </div>
              </div>
            </div>
            <div
              :style="getBackgroundImageStyle"
              :class="[
                !fixWidth ? 'w-216 lg:w-240 lg:h-177 xl:w-288 xl:h-216' : '',
                !fixHeight ? 'h-160' : ''
              ]"
            >
              <div
                :style="{
                  backgroundImage: 'url(' + offer.img + ')'
                }"
                class="absolute top-0 bottom-0 right-0 left-0 bg-cover rounded"
              ></div>
            </div>
          </div>
          <div class="text-left text-black mt-8">
            <div class="text-sm leading-14 font-bold">
              {{ offer.title }}
            </div>
            <div class="text-base leading-16 font-bold mt-8">
              {{ offer.price }}
            </div>
          </div>
        </div>
      </div>
    </Scrollbar>
  </div>
</template>

<script>
import Scrollbar from '@/components/Scrollbar'
export default {
  name: 'RelevantOffers',
  components: {
    Scrollbar
  },
  props: {
    fixWidth: {
      type: [String, Boolean],
      default: false
    },
    fixHeight: {
      type: [String, Boolean],
      default: false
    },
    minWidth: {
      type: String,
      default: '912px'
    },
    gradientHiddenClass: {
      type: String,
      default: 'lg:hidden'
    }
  },
  data() {
    return {
      offers: [
        {
          type: this.$t('general.Hotel'),
          typeIcon: '/images/white/travel-services/hotel/hotel-16.svg',
          img: '/images/relevant_offer/offer_1.svg',
          title: 'Les Caves du Louvre - Wine Tasting Experience',
          price: 'EUR 145'
        },
        {
          type: this.$t('general.Program'),
          typeIcon: '/images/white/travel-services/program/program-16.svg',
          img: '/images/relevant_offer/offer_2.svg',
          title: 'Bateaux Parisiens - Paris Magic Sightseeing Cruise with...',
          price: 'EUR 145'
        },
        {
          type: this.$t('general.RoundTrip'),
          typeIcon:
            '/images/white/travel-services/round-trip/round-trip-16.svg',
          img: '/images/relevant_offer/offer_3.svg',
          title: 'Vedettes de Paris - Seine Sightseeing Morning Cruise 1...',
          price: 'EUR 145'
        },
        {
          type: this.$t('general.Program'),
          typeIcon: '/images/white/travel-services/program/program-16.svg',
          img: '/images/relevant_offer/offer_4.svg',
          title: 'Audio Guided Visit of the Sacre Coeur and Environs',
          price: 'EUR 145'
        }
      ],
      showLeftGradient: false,
      showRightGradient: true
    }
  },
  computed: {
    getBackgroundImageStyle() {
      if (this.fixHeight !== false && this.fixWidth !== false) {
        return 'width: ' + this.fixWidth + '; ' + 'height: ' + this.fixHeight
      } else if (this.fixHeight !== false) {
        return 'height: ' + this.fixHeight
      } else if (this.fixWidth !== false) {
        return 'width: ' + this.fixWidth
      } else {
        return ''
      }
    },
    getWrapperStyle() {
      return 'min-width: ' + this.minWidth
    }
  },
  methods: {
    getImage(image) {
      return require('../assets' + image)
    },
    checkGradient(prop) {
      this.showLeftGradient = !prop.isMin
      this.showRightGradient = !prop.isMax
    }
  }
}
</script>
<style scoped>
@media (max-width: 1023px) {
  .h-160 {
    height: 160px;
  }
}
</style>
