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
          :style="'background-image: url(' + thematic.leadpicture + ')'"
        ></div>
        <div
          v-if="!isSale"
          class="flex flex-col p-10 absolute top-0 left-0 w-auto rounded-br"
          :class="[
            thematic.offerType === 'booked-by-you'
              ? 'bg-danger text-white'
              : '',
            thematic.offerType === 'flashsale' ? 'bg-black text-white' : '',
            thematic.offerType === 'superflashsale'
              ? 'bg-warning text-black'
              : ''
          ]"
        >
          <p class="text-sm leading-14 font-bold">
            <span v-if="thematic.offerType === 'booked-by-you'">{{
              $t('thematic.BookedByYou')
            }}</span>
            <span v-if="thematic.offerType === 'flashsale'">{{
              $t('thematic.FlashSales')
            }}</span>
            <span v-if="thematic.offerType === 'superflashsale'">{{
              $t('thematic.SuperFlashSales')
            }}</span>
          </p>
          <div class="text-xs leading-12">
            {{ $t('thematic.rooms', { rooms: thematic.offernumber }) }}
          </div>
        </div>
        <div
          v-if="isSale"
          class="flex flex-col p-10 absolute top-0 left-0 w-auto rounded-br bg-danger text-white"
        >
          <p class="text-sm leading-14 font-bold">
            -40%
          </p>
        </div>
      </div>
      <div class="inline-flex mb-8 h-28">
        <h4
          class="text-sm text-black leading-14 font-bold"
          :class="[hover || active ? 'underline' : '']"
        >
          {{ thematic.hotelname }}
        </h4>
        <StarRatings
          class="ml-3 whitespace-no-wrap text-3xs font-bold text-black"
          :stars="parseInt(thematic.hotelstar)"
        />
      </div>
      <div class="flex flex-col text-sm">
        <p>{{ thematic.city }}, {{ thematic.country }}</p>
        <p v-if="!isSale" class="mb-4">
          {{ thematic.roomtypedesc }}{{ service }}
        </p>
        <p
          v-if="
            thematic.checkin !== null && thematic.offerType !== 'booked-by-you'
          "
          class="mb-4"
        >
          {{ thematic.checkin | formatDateDisplay }} -
          {{ thematic.checkout | formatDateDisplay }} ({{ thematic.nightsnum }}
          {{ $t('general.Nights') }})
        </p>
        <p
          v-if="
            thematic.redeemdatelimit !== null &&
              thematic.offerType == 'booked-by-you'
          "
          class="mb-4"
        >
          {{
            $t('thematic.redemptionPeriod', {
              redemption: this.$options.filters.formatDateDisplay(
                thematic.redeemdatelimit
              )
            })
          }}
        </p>
        <div class="flex">
          <span v-if="thematic.offerType == 'booked-by-you'"
            >{{ thematic.nightsnum }} {{ $t('general.Nights') }},&nbsp;
          </span>
          <span>
            {{
              getGuestText(thematic.adultcount, thematic.childrencount)
            }}</span
          >
        </div>
      </div>

      <div class="flex flex-col mt-8">
        <p v-if="isSale" class="mb-4 text-xs line-through leading-16 font-bold">
          <span v-show="price > 0">
            {{ currency }}
            {{ price | formatNumber('0,0', { thousandsSeparator: ' ' }) }}
          </span>
        </p>
        <p
          class="text-base leading-16 font-bold"
          :class="[
            thematic.offerType === 'booked-by-you' ? 'text-danger' : '',
            thematic.offerType === 'flashsale' ? 'text-black' : '',
            thematic.offerType === 'superflashsale' ? 'text-warning' : '',
            isSale === true ? 'text-danger' : ''
          ]"
        >
          <span class="pr-6 lg:pr-0 xl:pr-6">{{
            thematic.calculatedpriceBPO
          }}</span>
          <span
            class="ff-currency bpo"
            :class="[
              thematic.offerType === 'booked-by-you' ? 'bg-danger' : '',
              thematic.offerType === 'flashsale' ? 'bg-black' : '',
              thematic.offerType === 'superflashsale' ? 'bg-warning' : ''
            ]"
          ></span
          ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span
          ><span v-show="price > 0" class="pr-6 lg:pr-0 xl:pr-6">+</span>
          <span v-show="price > 0">
            {{ currency }}
            {{ price | formatNumber('0,0', { thousandsSeparator: ' ' }) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import StarRatings from '@/components/micro/StarRatings'
import Dummy from '~/assets/images/news/dummy1.jpg'

import { getGuestText, getBoardName } from '@/includes/utils'

export default {
  name: 'ThematicResultCard',
  components: {
    StarRatings
  },
  props: {
    thematic: {
      type: [Object, Boolean],
      default: false
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
    price() {
      if (this.thematic.price !== undefined) {
        return parseInt(this.thematic.price[this.currency])
      } else {
        return 0
      }
    },
    dummy() {
      return Dummy
    }
  },
  mounted() {
    this.setService()
  },
  beforeDestroy() {},
  methods: {
    getGuestText(adults, children) {
      return getGuestText(adults, children)
    },
    setService() {
      this.service = getBoardName(this.thematic.services)
      if (this.service !== '') {
        this.service = ', ' + this.service
      }
    },
    addToCart() {
      if (!this.isLoggedIn) {
        this.$eventBus.publish('showLoginModal')
      } else {
        this.$router.push(
          this.localePath('/thematic-offers/cart/' + this.thematic.id)
        )
      }
    }
  }
}
</script>
