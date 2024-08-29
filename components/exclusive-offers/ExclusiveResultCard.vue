<template>
  <div
    class="mb-24 flex-col relative"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="flex-col flex cursor-pointer" @click="addToCart()">
      <div
        class="bg-grey-light relative w-full rounded mb-8 overflow-hidden"
        :style="'height:' + imageHeight + 'px;'"
      >
        <div
          class="absolute top-0 bottom-0 right-0 left-0 w-full text-center flex items-center justify-center"
        >
          <i class="far fa-image-polaroid text-xl"></i>
        </div>
        <div
          class="absolute top-0 bottom-0 right-0 left-0 bg-center bg-cover"
          :style="'background-image: url(' + offer.leadpicture + ')'"
        ></div>
        <div
          v-if="!offer.discount_pass"
          class="flex items-center justify-center absolute top-0 left-0 bg-warning w-auto h-34 px-10 rounded-br"
        >
          <p class="text-black text-sm leading-14 font-bold">
            -
            {{
              parseInt(offer.diffprice[currency])
                | formatNumber('0,0', { thousandsSeparator: ' ' })
            }}
            {{ currency }}
          </p>
        </div>
        <div
          v-else
          class="flex items-center justify-center absolute top-0 left-0 bg-primary w-auto h-34 px-10 rounded-br"
        >
          <img src="~static/images/discount-pass-logo.png" class="mr-4" />
          <p class="text-white text-sm leading-14 font-bold">
            {{ $t('exclusive_offers.DiscountPassOffer') }}
          </p>
        </div>
      </div>
      <div class="inline-flex mb-12 h-28">
        <h4
          class="text-normal text-black leading-14"
          :class="[hover || active ? 'underline' : '']"
        >
          <b>{{ offer.city }},</b> {{ offer.country }}
        </h4>
      </div>
      <div class="inline-flex mb-8 h-28">
        <h4
          class="text-sm text-black leading-14 font-bold"
          :class="[hover || active ? 'underline' : '']"
        >
          {{ offer.hotelname }}
        </h4>
        <StarRatings
          class="ml-3 whitespace-no-wrap text-3xs font-bold text-black"
          :stars="parseInt(offer.hotelstar)"
        />
      </div>

      <div v-if="!isList" class="flex flex-col text-black leading-14">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-calendar-alt"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ offer.checkin | formatDateDisplay }} -
            {{ offer.checkout | formatDateDisplay }}
            <div class="mt-5">
              {{ offer.nightsnum }} {{ $t('general.Nights') }}
            </div>
          </div>
        </div>
        <!-- 
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-map-marker-alt"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            In the city center
          </div>
        </div>
        -->
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-user-friends"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ getGuestText(offer.adultcount, offer.childrencount) }}
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-bed"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ getBoardName(offer.services) }}
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-umbrella-beach"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ offer.roomtypedesc }}
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-suitcase"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            <span v-if="request.business == '0'">{{
              $t('exclusive_offers.NotBusiness')
            }}</span>
            <span v-else>{{ $t('exclusive_offers.Business') }}</span>
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
        <div
          class="flex flex-row w-full"
          :class="offer.cancellable ? 'text-primary' : 'text-danger'"
        >
          <div class="w-20 mr-8 text-center">
            <i v-if="offer.cancellable" class="far fa-check"></i>
            <i v-if="!offer.cancellable" class="far fa-times"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ $t('weboffice.Cancelable') }}:
            {{ offer.cancelable | formatDateDisplay }}
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
      </div>
      <div v-else>
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-calendar-alt"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ offer.checkin | formatDateDisplay }} -
            {{ offer.checkout | formatDateDisplay }}
            <div class="mt-5">
              {{ offer.nightsnum }} {{ $t('general.Nights') }}
            </div>
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-bed"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ getBoardName(offer.services) }}
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-8 text-center">
            <i class="far fa-user-friends"></i>
          </div>
          <div class="sm:w-3/4 md:w-auto">
            {{ getGuestText(offer.adultcount, offer.childrencount) }}
          </div>
        </div>
        <div class="bg-grey-light h-1 my-12"></div>
      </div>

      <div class="flex flex-col">
        <p class="text-xs">
          {{ $t('exclusive_offers.OriginalPrice') }}: {{ currency }}
          {{
            parseInt(offer.originalPrice[currency])
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
          <i
            class="far fa-info-circle text-primary"
            :title="$t('exclusive_offers.PriceTooltip')"
          ></i>
        </p>
        <p
          v-if="!offer.discount_pass"
          class="text-base leading-16 font-bold text-warning"
        >
          <span class="pr-6 lg:pr-0 xl:pr-6">{{ offer.BPO }}</span>
          <span class="ff-currency bpo bg-warning"></span
          ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span
          ><span
            v-show="parseInt(offer.price[currency]) > 0"
            class="pr-6 lg:pr-0 xl:pr-6"
            >+</span
          >
          <span v-show="parseInt(offer.price[currency]) > 0">
            {{ currency }}
            {{
              parseInt(offer.price[currency])
                | formatNumber('0,0', { thousandsSeparator: ' ' })
            }}
          </span>
        </p>
        <div v-else>
          <div class="flex flex-row justify-between text-base">
            <div class="flex pr-6 lg:pr-0 xl:pr-6 font-bold text-black">
              {{ currency }}
              {{
                parseInt(offer.price[currency])
                  | formatNumber('0,0', { thousandsSeparator: ' ' })
              }}
            </div>
            <div class="flex">
              <span class="flex bg-danger rounded px-6 text-white font-bold">
                {{ offer.pv_count }}
                <img
                  src="~static/images/premium-voucher-white.svg"
                  class="ml-4 mr-8"
                />
                {{ $t('exclusive_offers.PVCredit') }}
              </span>
            </div>
          </div>
          <div class="text-xs italic">
            {{ $t('exclusive_offers.PricePVDesc') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import dummy from '~/assets/images/thematic/thematic-cart-dummy1.jpg'
import StarRatings from '@/components/micro/StarRatings'

import { getGuestText, getBoardName, formatDateDisplay } from '@/includes/utils'

export default {
  name: 'ExclusiveResultCard',
  components: {
    StarRatings
  },
  props: {
    offer: {
      type: [Object, Boolean],
      default: false
    },
    request: {
      type: [Object],
      default() {
        return {}
      }
    },
    imageHeight: {
      type: Number,
      default: 240
    },
    isList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getBoardName,
      formatDateDisplay,
      dummy,
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
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    getGuestText(adults, children) {
      return getGuestText(adults, children)
    },
    addToCart() {
      if (!this.isList) {
        if (!this.isLoggedIn) {
          this.$eventBus.publish('showLoginModal')
        } else if (this.offer.discount_pass) {
          this.$router.push(
            this.localePath('/weboffice/discount-pass/cart/' + this.offer.id)
          )
        } else {
          this.$router.push(
            this.localePath('/weboffice/exclusive-offers/cart/' + this.offer.id)
          )
        }
      } else if (this.offer.discount_pass) {
        this.$router.push(this.localePath('/discount-offers/' + this.offer.id))
      } else {
        this.$router.push(this.localePath('/exclusive-offers/' + this.offer.id))
      }
    }
  }
}
</script>
