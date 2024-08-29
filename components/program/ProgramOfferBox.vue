<template>
  <div class="flex flex-row border-b border-grey-light">
    <div
      v-if="bestPrice"
      class="bg-primary text-sm leading-14 text-white items-center text-center font-bold py-10 rounded-t sm:flex sm:px-10 sm:rounded-t-none sm:rounded-l"
    >
      #1
    </div>
    <div
      :class="{
        'bg-primary-opaque border-r border-l border-primary p-16 sm:border-r-none sm:border-l-none sm:border-b sm:border-t': bestPrice,
        'pb-16 pr-16 sm:pb-0': !bestPrice
      }"
      class="flex flex-wrap text-black sm:flex-1"
    >
      <div class="w-4/6 flex md-flex-wrap">
        <div class="flex flex-col justify-center">
          <div class="font-bold text-sm leading-14 w-full flex flex-col">
            {{ dateFrom }}{{ dateTo !== dateFrom ? ' - ' + dateTo : ''
            }}{{ session !== '' ? ' ' + session : ''
            }}{{ language !== '' ? ' (' + language + ')' : '' }}
          </div>
          <div class="text-sm leading-14 mt-5 w-full">
            {{ name }}
          </div>
          <div
            v-if="cancellationDeadline"
            class="text-xs text-grey-dark leading-12 mt-6 w-full"
          >
            {{ $t('hotel.CancellationDeadline') }}: {{ cancellationDeadline }}
          </div>
        </div>
      </div>
      <div class="w-2/6 flex items-center">
        <div class="font-bold w-full">
          <div class="w-full text-right leading-12">
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
        'flex flex-wrap content-center': !bestPrice
      }"
    >
      <ButtonSmall
        :is-loading="isLoading"
        :type="bestPrice ? 'primary' : 'inverted'"
        :class="{
          'rounded-t-none sm:rounded-tl-none sm:rounded-tr sm:rounded-bl-none': bestPrice,
          'md:h-42': !bestPrice
        }"
        @click="$emit('click')"
      >
        {{ $t('hotel.Booking') }}
      </ButtonSmall>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonSmall from '@/components/micro/ButtonSmall'

import premiumDV from '@/assets/images/premium-voucher.svg'

export default {
  name: 'ProgramOfferBox',
  components: { ButtonSmall },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    session: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: ''
    },
    bestPrice: {
      type: Boolean,
      default: false
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
    dateFrom: {
      type: String,
      required: true
    },
    dateTo: {
      type: String,
      required: true
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
