<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:justify-between">
      <div
        class="flex flex-row sm:flex-grow sm:mr-16 justify-between font-bold leading-18 items-center"
      >
        <div>{{ getDateInterval }}</div>
        <div>
          <div v-show="offer.fullprice[currency] > 0" class="text-right">
            <div class="text-2x text-black font-bold">
              {{ currency }}
              {{
                Math.ceil(offer.fullprice[currency])
                  | formatNumber('0,0', { thousandsSeparator: ' ' })
              }}
            </div>
            <div class="text-sm mb-4 font-normal">
              {{ $t('general.textOr') }}
            </div>
          </div>
          <div class="text-right text-warning">
            <span v-if="offer.bpo > 0">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ offer.bpo }}</span
              ><span class="pr-6 lg:pr-0 xl:pr-6"
                ><img
                  class="-mt-7 inline"
                  src="~static/images/bpo-logo.svg"/></span
              ><span
                v-show="offer.price[currency] > 0"
                class="pr-6 lg:pr-0 xl:pr-6"
                >+</span
              >
            </span>
            <span v-if="offer.activity_bpo > 0">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ offer.activity_bpo }}</span
              ><span class="ff-currency mt-5 bg-warning bpo"></span
              ><span class="pr-6 lg:pr-0 xl:pr-6">HC</span
              ><span
                v-show="offer.price[currency] > 0"
                class="pr-6 lg:pr-0 xl:pr-6"
                >+</span
              >
            </span>
            <span v-show="offer.price[currency] > 0">
              {{ currency }}
              {{
                Math.ceil(offer.price[currency])
                  | formatNumber('0,0', { thousandsSeparator: ' ' })
              }}
            </span>
          </div>
          <div class="text-danger mt-4 leading-16">
            <span v-if="offer.voucherNum > 0 && offer.voucher !== ''">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ offer.voucherNum }}</span
              ><span class="ff-currency"></span
              ><span class="pr-6 lg:pr-0 xl:pr-6">{{ offer.voucher }}</span
              ><span class="pr-6 lg:pr-0 xl:pr-6">+</span>
            </span>
            {{ offer.discountPrice }}
          </div>
        </div>
      </div>
      <div class="flex mt-16 sm:mt-0">
        <ButtonSmall
          :type="'inverted'"
          :is-loading="isLoading"
          class="w-full"
          @click="$emit('select', offer)"
        >
          {{ $t('roundtrip.Booking') }}
        </ButtonSmall>
      </div>
    </div>
    <div class="h-1 w-full bg-grey-light my-16"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addDays, format } from 'date-fns'
import ButtonSmall from '@/components/micro/ButtonSmall'
import { getMonthName } from '@/includes/utils'
export default {
  name: 'RoundTripOfferBox',
  components: { ButtonSmall },
  props: {
    offer: {
      type: Object,
      required: true
    },
    duration: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    getDateInterval() {
      let day = 0
      if (this.duration.weeks !== undefined && this.duration.weeks > 0) {
        day += 7 * this.duration.weeks
      }
      if (this.duration.days !== undefined && this.duration.days > 0) {
        day += this.duration.days
      }
      const dateTMP = new Date(this.offer.date)
      const dateTMP2 = addDays(new Date(this.offer.date), day - 1)
      return (
        getMonthName(format(dateTMP, 'M')) +
        format(dateTMP, ' dd.') +
        ' - ' +
        getMonthName(format(dateTMP2, 'M')) +
        format(dateTMP2, ' dd.')
      )
    }
  }
}
</script>
