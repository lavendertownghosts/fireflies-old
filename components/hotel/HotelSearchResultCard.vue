<template>
  <div
    class="mb-24"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousedown="active = true"
    @mouseup="active = false"
    @click="$emit('click')"
  >
    <nuxt-link
      :to="localePath('/hotel/search/' + $route.params.id + '/' + hotel.slug)"
      target="_blank"
      class="flex flex-col cursor-pointer"
    >
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
          :style="'background-image: url(' + hotel.image + ')'"
        ></div>
        <div
          v-show="hasHotelDiscount"
          class="flex items-center justify-center absolute top-0 left-0 bg-danger w-52 h-34 rounded-br"
        >
          <p class="text-white text-sm leading-14 font-bold">
            -{{ hotel.discount }}%
          </p>
        </div>
        <div
          v-if="hotel.selected == 1 && searchType == 'bpo'"
          class="flex items-center justify-center absolute top-0 left-0 bg-warning h-34 px-10 rounded-br"
        >
          <p class="text-black text-sm leading-14 font-bold">
            {{ $t('hotel.selectedBPO') }}
          </p>
        </div>
        <div
          v-show="hasBpoDiscount"
          class="flex items-center justify-center absolute top-0 left-0 bg-warning w-auto h-34 px-10 rounded-br"
        >
          <p class="text-black text-sm leading-14 font-bold">
            -{{ hotel.bpo_discount }}% {{ $t('hotel.WithBestPriceOption') }}
          </p>
        </div>
      </div>
      <div class="inline-flex items-center h-14">
        <h3
          class="text-sm leading-14 font-bold truncate"
          :class="[
            hover || active ? 'underline' : '',
            active ? 'text-grey-dark' : 'text-black'
          ]"
        >
          {{ hotel.hotel_name }}
        </h3>
        <StarRatings
          class="ml-3 whitespace-no-wrap"
          :stars="parseInt(hotel.star)"
          :star-class="
            'text-3xs font-bold ' + (active ? 'text-grey-dark' : 'text-black')
          "
        />
      </div>
      <p class="mt-8 text-sm leading-14">
        {{ calcDistance(hotel.distance) }}
      </p>
      <p class="mt-8 text-sm leading-14">
        <i class="far fa-bed"></i> {{ hotel.room }}
      </p>
      <p class="mt-8 text-sm leading-14">
        <i class="far fa-utensils mr-3"></i> {{ getBoardName(hotel.board) }}
      </p>
      <div class="flex flex-col mt-10">
        <p
          v-show="hasAnyDiscount"
          class="text-xs leading-12 text-grey-dark line-through font-bold"
        >
          {{
            Math.ceil(hotel.price[currency])
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
          {{ currency }}
        </p>
        <p
          class="text-base leading-16 font-bold"
          :class="[
            hasBpoDiscount
              ? 'text-warning'
              : hasHotelDiscount
              ? 'text-danger'
              : 'text-black',
            hasAnyDiscount ? 'mt-4' : '',
            hotel.selected == 1 && searchType == 'bpo' ? 'text-warning' : ''
          ]"
        >
          <span v-if="voucherNum > 0 && voucher !== ''">
            <span class="pr-6 lg:pr-0 xl:pr-6 inline-block">{{
              voucherNum
            }}</span>
            <span v-if="!allowedPV">
              <span class="ff-currency"></span
              ><span class="pr-6 lg:pr-0 xl:pr-6">{{ voucher }}</span>
            </span>
            <span v-else class="pr-6 lg:pr-0 xl:pr-6">
              <img class="inline -mt-10" :src="premiumDV" width="36" />
            </span>
            <span
              v-show="price > 0 || creditNum > 0"
              class="pr-6 lg:pr-0 xl:pr-6 inline-block"
              >+</span
            >
          </span>
          <span v-if="searchType == 'bpo'">
            <span class="pr-6 lg:pr-0 xl:pr-6">{{ BPONum }}</span
            ><span class="pr-6 lg:pr-0 xl:pr-6"
              ><img class="inline -mt-10" :src="premiumBPO"/></span
            ><span v-show="price > 0" class="pr-6 lg:pr-0 xl:pr-6">+</span>
          </span>
          <span v-if="creditNum > 0">
            <span class="pr-6 lg:pr-0 xl:pr-6">{{ creditNum }}</span
            ><span class="ff-currency"></span
            ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span
            ><span v-show="price > 0" class="pr-6 lg:pr-0 xl:pr-6">+</span>
          </span>
          <span v-show="price > 0">
            {{ currency }}
            {{
              Math.ceil(price)
                | formatNumber('0,0', { thousandsSeparator: ' ' })
            }}
          </span>
        </p>
      </div>
    </nuxt-link>
    <div
      v-show="
        hotel.booking_information !== undefined &&
          hotel.booking_information !== ''
      "
      class="mt-4 text-sm leading-12 cursor-pointer"
    >
      <span class="link" @click="bookingInfoActive = !bookingInfoActive">{{
        $t('hotel.BookingInformation')
      }}</span>
      <div class="relative">
        <perfect-scrollbar
          v-show="bookingInfoActive"
          class="hotel-popup bottom-0 p-16 mb-16 bg-white rounded shadow-drop text-black overflow-y-hidden"
        >
          <h2 class="text-lg leading-24 mb-12">
            {{ $t('hotel.BookingInformation') }}
          </h2>
          <p class="text-sm leading-20">{{ hotel.booking_information }}</p>
        </perfect-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import { mapGetters } from 'vuex'

import StarRatings from '@/components/micro/StarRatings'
import { calcHotelDistance, getBoardName } from '@/includes/utils'

import premiumDV from '@/assets/images/premium-voucher.svg'
import premiumBPO from '@/assets/images/bpo-logo.svg'

export default {
  name: 'HotelSearchResultCard',
  components: {
    StarRatings,
    PerfectScrollbar
  },
  props: {
    imageHeight: {
      type: Number,
      default: 240
    },
    hotel: {
      type: [Object, Boolean],
      default: false
    },
    voucher: {
      type: String,
      default: ''
    },
    searchType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      premiumDV,
      premiumBPO,
      hover: false,
      active: false,

      bookingInfoActive: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('user', ['getAllowedPV']),
    hasAnyDiscount() {
      return (
        parseInt(this.hotel.discount) > 0 ||
        (this.hotel.bpo_discount !== undefined &&
          parseInt(this.hotel.bpo_discount) > 0)
      )
    },
    hasHotelDiscount() {
      return parseInt(this.hotel.discount) > 0
    },
    hasBpoDiscount() {
      return (
        this.hotel.bpo_discount !== undefined &&
        parseInt(this.hotel.bpo_discount) > 0
      )
    },
    allowedPV() {
      return this.getAllowedPV
    },
    currency() {
      return this.getCurrency
    },
    price() {
      return Math.ceil(this.hotel.price[this.currency])
    },
    voucherNum() {
      return parseInt(this.hotel.voucher)
    },
    BPONum() {
      return parseInt(this.hotel.bpo)
    },
    creditNum() {
      return Math.ceil(this.hotel.credit)
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onDocumentMouseUp)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    getBoardName,
    calcDistance(distance) {
      return (
        calcHotelDistance(distance) + ' ' + this.$t('hotel.FromTheCityCenter')
      )
    },
    onDocumentMouseUp(e) {
      const isChild = this.$el.contains(e.target)

      if (!isChild) {
        this.bookingInfoActive = false
      }
    }
  }
}
</script>

<style scoped>
.hotel-popup {
  position: absolute !important;
  max-height: 248px !important;
}
</style>
