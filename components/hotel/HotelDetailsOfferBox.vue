<template>
  <div :class="{ 'pb-0': highlight }">
    <div v-if="highlight" class="w-full">
      <div
        class="inline-block border-primary border-t border-l border-r text-primary font-bold p-5 px-16 text-white text-sm leading-18 rounded-t"
      >
        {{ $t('hotel.HighlightedOfferDesc') }}
      </div>
    </div>
    <div
      v-if="bestPrice"
      class="bg-primary text-sm leading-14 text-white items-center text-center font-bold py-10 rounded-t sm:flex sm:px-10 sm:rounded-t-none sm:rounded-l"
    >
      #1
    </div>
    <div
      :class="{
        'bg-primary-opaque border-r border-l border-primary p-16 sm:border-r-none sm:border-l-none sm:border-b sm:border-t':
          bestPrice || highlight,
        'rounded-t sm:flex sm:rounded-t-none sm:rounded-bl border-t border-r-0': highlight,
        'pb-16 pr-16 sm:pb-0': !(bestPrice || highlight)
      }"
      class="flex flex-wrap text-black sm:flex-1"
    >
      <div class="w-1/2 md:w-6/12 lg:w-3/6 flex md-flex-wrap">
        <div
          v-if="percent > 0"
          class="hidden md:inline-block items-center my-auto bg-danger p-10 text-white text-sm leading-14 font-bold rounded mr-8"
        >
          -{{ percent }}%
        </div>
        <div class="inline-block flex flex-col justify-center">
          <div class="font-bold text-sm leading-14 w-full flex flex-col">
            <span
              v-for="(room, key) in getRoomsString"
              :key="key"
              class="mb-5"
              >{{
                room.count > 1 ? room.count + 'x ' + room.label : room.label
              }}</span
            >
          </div>
          <div class="text-sm leading-14 w-full">
            <span v-if="percent > 0" class="text-danger md:hidden"
              >-{{ percent }}%
            </span>
            {{ boardName }}
          </div>
          <div
            v-if="cancellationDeadline"
            class="text-xs text-grey-dark leading-12 mt-6 w-full"
          >
            {{ $t('hotel.CancellationDeadline') }}: {{ cancellationDeadline }}
          </div>
        </div>
      </div>
      <div
        class="w-1/2 md:w-6/12 lg:w-3/6"
        :class="percent === 0 ? 'flex items-center' : ''"
      >
        <div
          class="font-bold"
          :class="percent === 0 ? 'w-full' : 'flex items-center'"
        >
          <div v-if="percent > 0" class="w-full text-right">
            <!-- <div class="text-xs text-grey-dark line-through leading-12">
              <span v-if="voucherNum > 0 && voucher !== ''">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{ voucherNum }}</span
                ><span class="ff-currency bg-grey-dark h-12 w-12"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">{{ voucher }}</span
                ><span class="pr-6 lg:pr-0 xl:pr-6">+</span>
              </span>
              {{ currency }} {{ price }}
            </div>
            <div class="text-danger mt-4 leading-16">
              <span v-if="voucherNum > 0 && voucher !== ''">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{ voucherNum }}</span
                ><span class="ff-currency"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">{{ voucher }}</span
                ><span class="pr-6 lg:pr-0 xl:pr-6">+</span>
              </span>
              {{ currency }} {{ price }}
            </div> -->
          </div>
          <div
            v-else
            class="w-full flex flex-row justify-end text-right leading-12"
          >
            <span v-if="voucherNum > 0 && voucher !== ''">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ voucherNum }}</span>
              <span v-if="!getAllowedPV">
                <span class="ff-currency"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">{{ voucher }}</span>
              </span>
              <span v-else class="pr-6 lg:pr-0 xl:pr-6">
                <img class="inline -mt-10" :src="premiumDV" width="36"/></span
              ><span
                v-show="price > 0 || creditNum > 0"
                class="pr-6 lg:pr-0 xl:pr-6"
                >+</span
              >
            </span>
            <span v-if="type == 'bpo'" class="flex flex-row">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ bpoNum }}</span
              ><span class="pr-6 lg:pr-0 xl:pr-6"
                ><img
                  class="-mt-7 inline"
                  src="~static/images/bpo-logo.svg"/></span
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
          </div>
        </div>
      </div>
    </div>
    <div
      class="sm:flex"
      :class="{
        'flex flex-wrap content-center': !(bestPrice || highlight)
      }"
    >
      <ButtonSmall
        :is-loading="isLoading"
        :type="bestPrice || highlight ? 'primary' : 'inverted'"
        :class="{
          'rounded-t-none sm:rounded-tl-none sm:rounded-tr sm:rounded-bl-none':
            bestPrice || highlight,
          'md:h-42': !(bestPrice || highlight),
          'border-l-0': highlight,
          'border-none': isAlternateSource
        }"
        class="w-full sm:py-12"
        @click="$emit('click')"
      >
        {{ isAlternateSource ? $t('hotel.Details') : $t('hotel.Booking') }}
      </ButtonSmall>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonSmall from '@/components/micro/ButtonSmall'

import premiumDV from '@/assets/images/premium-voucher.svg'

export default {
  name: 'HotelDetailsOfferBox',
  components: { ButtonSmall },
  props: {
    isAlternateSource: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    bestPrice: {
      type: Boolean,
      default: false
    },
    boardName: {
      type: String,
      required: true
    },
    cancellationDeadline: {
      type: [String, Boolean],
      default: false
    },
    currency: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    percent: {
      type: Number,
      required: true
    },
    voucher: {
      type: String,
      default: ''
    },
    voucherNum: {
      type: Number,
      default: 0
    },
    bpoNum: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    rooms: {
      type: Array,
      default() {
        return []
      }
    },
    creditNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      premiumDV
    }
  },
  computed: {
    ...mapGetters('user', ['getAllowedPV']),
    getRoomsString() {
      const returnArray = []
      this.rooms.forEach((room) => {
        let exists = false
        returnArray.forEach((check, key) => {
          if (check.label === room.room) {
            returnArray[key].count++
            exists = true
          }
        })
        if (!exists) {
          returnArray.push({
            count: 1,
            label: room.room
          })
        }
      })

      return returnArray
    }
  }
}
</script>
