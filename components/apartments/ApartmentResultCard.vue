<template>
  <div
    class="mb-24 flex-col relative"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!--  <div
      class="flex-col flex cursor-pointer"
      @click="$eventBus.publish('showCartBlock')"
    > -->
    <nuxt-link
      :to="getLink"
      target="_blank"
      class="flex-col flex cursor-pointer"
    >
      <div
        class="bg-grey-light relative w-full rounded md:mb-8 overflow-hidden"
        :style="'height:' + imageHeight + 'px;'"
      >
        <div
          class="absolute top-0 bottom-0 right-0 left-0 w-full text-center flex items-center justify-center"
        >
          <i class="far fa-image-polaroid text-xl"></i>
        </div>
        <div
          class="absolute top-0 bottom-0 right-0 left-0 bg-center bg-cover"
          :style="'background-image: url(' + featimage + ')'"
        ></div>
        <div
          class="flex flex-col p-10 absolute top-0 left-0 w-auto rounded-br"
        ></div>
        <div
          class="md:flex hidden flex-col justify-between p-10 absolute bottom-0 left-0 w-full rounded-br infos-background text-white"
        >
          <div class="flex">
            <div class="flex pb-6">
              <h4 class="leading-24 font-bold text-base">
                {{
                  apartment.name === undefined
                    ? apartment.hotel_name
                    : apartment.name
                }}
              </h4>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col w-1/2">
              <div class="flex flex-row text-xs pt-6 md:pr-6">
                <div class="pr-4 text-center w-24">
                  <i class="fa fa-map-marker"></i>
                </div>
                {{ apartment.city }},
                {{ apartment.country }}
              </div>
              <div
                v-if="apartment.capacity !== undefined"
                class="flex flex-row text-xs pt-6"
              >
                <div class="pr-4 text-center w-24">
                  <i class="fa fa-user-friends"></i>
                </div>
                {{ $t('apartments.UpToGuests', [apartment.capacity]) }}
              </div>
            </div>
            <div
              class="text-right flex flex-col w-1/2 content-center justify-end"
            >
              <div
                v-show="paymentType === 'bpo_price'"
                class="flex flex-row justify-end items-center"
              >
                <div class="text-warning items-center flex flex-row">
                  <span class="font-bold text-lg pr-6">{{
                    apartment.bpo_bpo !== undefined
                      ? apartment.bpo_bpo
                      : apartment.price.bpo_bpo
                  }}</span>
                  <img src="~static/images/bpo-logo.svg" />
                  <span
                    v-show="price > 0"
                    class="font-black text-sm font-black px-6"
                  >
                    +
                  </span>
                </div>
                <div class="text-warning flex flex-col">
                  <span v-show="price > 0" class="font-bold text-base">
                    {{ currency }}
                    {{
                      price | formatNumber('0,0', { thousandsSeparator: ' ' })
                    }}
                  </span>
                  <span v-if="false" class="text-xs">
                    {{ $t('apartments.PricePerNight') }}: {{ currency }}
                    {{ Math.ceil(apartment.bpo_price_per_night[currency]) }}
                  </span>
                </div>
              </div>
              <div
                v-show="paymentType === 'pv_bpo'"
                class="flex flex-row justify-end"
              >
                <div class="text-warning items-center flex flex-row">
                  <span class="font-bold text-lg pr-6 lg:pr-0 xl:pr-6">{{
                    apartment.pv_bpo !== undefined
                      ? apartment.pv_bpo
                      : apartment.price.pv_bpo
                  }}</span>
                  <img src="~static/images/bpo-logo.svg" />
                  <span
                    v-show="price > 0"
                    class="font-black text-sm font-black px-6"
                  >
                    +
                  </span>
                  <span
                    class="text-danger font-bold text-lg pr-6 lg:pr-0 xl:pr-6"
                    >{{
                      apartment.pv_pv !== undefined
                        ? apartment.pv_pv
                        : apartment.price.pv_pv
                    }}</span
                  >
                  <img src="~static/images/premium-voucher-logo.svg" />
                </div>
              </div>
              <div class="text-xs flex justify-end">
                <div class="border-t mt-4 pt-4 border-white">
                  {{ $t('apartments.MarketPrice') }}: {{ currency }}
                  {{
                    apartment.bkprice !== undefined
                      ? apartment.bkprice[currency]
                      : apartment.price.bkprice[currency]
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="md:hidden fley flex-col justify-between p-10 -mt-2 w-full rounded-b border border-grey-light"
      >
        <div class="flex flex-col">
          <div class="flex">
            <h4 class="text-base leading-14 font-bold">
              {{ apartment.name }}
            </h4>
          </div>
          <div class="flex flex-row text-xs pt-4">
            <div class="pr-4 text-center w-24">
              <i class="fa fa-map-marker"></i>
            </div>
            {{ apartment.city }},
            {{ apartment.country }}
          </div>
          <div class="flex flex-row text-xs">
            <div class="pr-4 text-center w-24">
              <i class="fa fa-user-friends"></i>
            </div>
            {{ $t('apartments.UpToGuests', [apartment.capacity]) }}
          </div>
        </div>

        <div class="text-left mt-10 pt-10 border-t border-grey-light">
          <div
            v-show="paymentType === 'bpo_price'"
            class="flex flex-row border-b border-white pb-8 items-center"
          >
            <div class="text-warning items-center flex flex-row">
              <span class="font-bold text-lg pr-6 lg:pr-0 xl:pr-6">{{
                apartment.bpo_bpo !== undefined
                  ? apartment.bpo_bpo
                  : apartment.price.bpo_bpo
              }}</span>
              <img src="~static/images/bpo-logo.svg" />
              <span v-show="price > 0" class="font-black text-sm px-6">
                +
              </span>
            </div>
            <div class="text-warning flex flex-col">
              <span v-show="price > 0" class="font-bold text-base">
                {{ currency }}
                {{ price | formatNumber('0,0', { thousandsSeparator: ' ' }) }}
              </span>
              <span v-if="false" class="text-xs">
                {{ $t('apartments.PricePerNight') }}: {{ currency }}
                {{ Math.ceil(apartment.bpo_price_per_night[currency]) }}
              </span>
            </div>
          </div>
          <div v-show="paymentType === 'pv_bpo'">
            <div class="text-warning items-center flex flex-row">
              <span class="font-bold text-lg pr-6 lg:pr-0 xl:pr-6">{{
                apartment.pv_bpo !== undefined
                  ? apartment.pv_bpo
                  : apartment.price.pv_bpo
              }}</span>
              <img src="~static/images/bpo-logo.svg" />
              <span
                v-show="price > 0"
                class="font-black text-sm font-black px-6"
              >
                +
              </span>
              <span
                class="text-danger font-bold text-lg pr-6 lg:pr-0 xl:pr-6"
                >{{
                  apartment.pv_pv !== undefined
                    ? apartment.pv_pv
                    : apartment.price.pv_pv
                }}</span
              >
              <img src="~static/images/premium-voucher-logo.svg" />
            </div>
          </div>
          <div class="text-xs border-t border-grey-light mt-4 pt-4">
            {{ $t('apartments.MarketPrice') }}: {{ currency }}
            {{
              apartment.bkprice !== undefined
                ? apartment.bkprice[currency]
                : apartment.price.bkprice[currency]
            }}
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Dummy from '~/assets/images/news/dummy1.jpg'

import { getGuestText } from '@/includes/utils'

export default {
  name: 'ApartmentResultCard',
  components: {},
  props: {
    apartment: {
      type: [Object, Boolean],
      default: false
    },
    paymentType: {
      type: String,
      default: 'bpo_price'
    },
    imageHeight: {
      type: Number,
      default: 240
    },
    isSale: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      service: '',
      hover: false,
      active: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('user', ['isLoggedIn']),
    currency() {
      return this.getCurrency
    },
    getLink() {
      let url = ''
      if (this.apartment.id !== undefined) {
        url = this.localePath('/apartments/' + this.apartment.id)
      } else if (this.apartment.intId !== undefined) {
        url = this.localePath('/apartments/' + this.apartment.intId)
      } else {
        url = this.localePath(
          '/apartments-condos/search/' +
            parseInt(this.$route.params.id) +
            '/' +
            this.apartment.slug
        )
      }
      return url
    },
    featimage() {
      return this.apartment.images === undefined
        ? this.apartment.featured_image
        : this.apartment.images[0]
    },
    price() {
      if (this.apartment.bpo_price !== undefined) {
        if (this.apartment.bpo_price[this.currency] !== undefined) {
          return parseInt(this.apartment.bpo_price[this.currency])
        } else {
          return parseInt(this.apartment.bpo_price.EUR)
        }
      }
      if (this.apartment.price.bpo_price) {
        if (this.apartment.price.bpo_price[this.currency] !== undefined) {
          return parseInt(this.apartment.price.bpo_price[this.currency])
        } else {
          return parseInt(this.apartment.price.bpo_price.EUR)
        }
      } else {
        return 0
      }
    },
    dummy() {
      return Dummy
    },
    discount() {
      if (this.paymentType === 'bpo_price') {
        return this.currency + ' ' + this.apartment.bpo_discount[this.currency]
      } else if (this.paymentType === 'pv_bpo') {
        return this.currency + ' ' + this.apartment.pv_discount[this.currency]
      } else {
        return this.currency + ' 0'
      }
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    getGuestText(adults, children) {
      return getGuestText(adults, children)
    }
  }
}
</script>

<style scoped>
.infos-background {
  background: #393e46cc;
}
</style>
