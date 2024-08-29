<template>
  <div class="mt-16">
    <div class="flex flex-col sm:flex-row">
      <div class="flex flex-col w-full sm:w-1/3 pl-1">
        <div class="text-xs text-black font-bold w-full mb-4">
          {{ $t('hotel.Category') }}
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="star5">
            <StarRatings :stars="5" star-class="text-3xs" position="center" />
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="star4">
            <StarRatings :stars="4" star-class="text-3xs" position="center" />
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="star3">
            <StarRatings :stars="3" star-class="text-3xs" position="center" />
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="star2">
            <StarRatings :stars="2" star-class="text-3xs" position="center" />
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end">
          <InputCheckbox v-model="star1">
            <StarRatings :stars="1" star-class="text-3xs" position="center" />
          </InputCheckbox>
        </div>
      </div>
      <div class="flex flex-col w-full sm:w-1/3 mt-24 sm:mt-0">
        <div class="text-xs text-black font-bold w-full mb-4">
          {{ $t('hotel.Supply') }}
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="supply20">
            {{ $t('hotel.WithBreakfast') }}
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="supply50">
            {{ $t('hotel.AllInclusive') }}
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="supply30">
            {{ $t('hotel.HB') }}
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="supply10">
            {{ $t('hotel.RoomOnly') }}
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="supply40">
            {{ $t('hotel.FullBoard') }}
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between items-end mb-4">
          <InputCheckbox v-model="supply60">
            {{ $t('hotel.DinnerOnly') }}
          </InputCheckbox>
        </div>
      </div>
      <div class="flex flex-col w-full sm:w-1/3 mt-24 sm:mt-0">
        <div class="text-xs text-black font-bold w-full mb-8">
          {{ $t('general.WhatWouldYouPay') }}
        </div>
        <InputRadio
          v-show="!isCis"
          v-model="payment"
          :label="$t('general.BestPriceOption')"
          :class="'mr-24 w-full sm:w-auto mb-4'"
          :selected="'bpo'"
        />
        <InputRadio
          v-model="payment"
          :label="$t('general.CreditCard')"
          :class="'mr-24 w-full sm:w-auto mb-4'"
          :selected="isCis ? 'card_cis' : 'card'"
        />
        <InputRadio
          v-model="payment"
          :label="$t('hotel.DiamondVoucher')"
          :class="'w-full sm:w-auto'"
          :selected="isCis ? 'voucher_cis' : 'voucher'"
        />
        <InputRadio
          v-show="isCis"
          v-model="payment"
          :label="$t('hotel.DiamondVoucherAndCredit')"
          :selected="'voucher_credit'"
        />
      </div>
    </div>
    <div v-if="showButtons">
      <div class="mt-16 inline-block" @click="addHotel">
        <ButtonSmall type="primary">
          {{ $t('general.NewTravelAssistantService') }}
        </ButtonSmall>
      </div>
      <div class="inline-block">
        <button class="link font-bold ml-8" @click="$emit('close')">
          {{ $t('general.Cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputRadio from '@/components/micro/InputRadio'
import InputCheckbox from '@/components/micro/InputCheckbox'
import StarRatings from '@/components/micro/StarRatings'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'HotelForm',
  components: {
    ButtonSmall,
    StarRatings,
    InputCheckbox,
    InputRadio
  },
  props: {
    data: {
      type: [Object, Boolean],
      default: false
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      star1: false,
      star2: false,
      star3: false,
      star4: false,
      star5: false,
      supply10: false,
      supply20: false,
      supply30: false,
      supply40: false,
      supply50: false,
      supply60: false,
      payment: 'bpo'
    }
  },
  computed: {
    ...mapGetters('user', ['isCis'])
  },
  watch: {
    isCis(value) {
      if (value) {
        this.payment = 'card_cis'
      } else {
        this.payment = 'bpo'
      }
    },
    star1: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    star2: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    star3: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    star4: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    star5: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    supply10: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    supply20: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    supply30: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    supply40: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    supply50: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    supply60: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    },
    payment: {
      handler() {
        if (!this.showButtons) {
          this.addHotel()
        }
      }
    }
  },
  mounted() {
    if (this.data !== false) {
      if (this.data.payment !== undefined && this.data.payment !== false) {
        this.payment = this.data.payment
      }
      if (this.data.star !== undefined && this.data.star !== false) {
        if (this.data.star.includes(1)) {
          this.star1 = true
        }
        if (this.data.star.includes(2)) {
          this.star2 = true
        }
        if (this.data.star.includes(3)) {
          this.star3 = true
        }
        if (this.data.star.includes(4)) {
          this.star4 = true
        }
        if (this.data.star.includes(5)) {
          this.star5 = true
        }
      }
      if (this.data.supply !== undefined && this.data.supply !== false) {
        if (this.data.supply.includes(90)) {
          this.supply10 = true
        }
        if (this.data.supply.includes(20)) {
          this.supply20 = true
        }
        if (this.data.supply.includes(30)) {
          this.supply30 = true
        }
        if (this.data.supply.includes(40)) {
          this.supply40 = true
        }
        if (this.data.supply.includes(50)) {
          this.supply50 = true
        }
        if (this.data.supply.includes(60)) {
          this.supply60 = true
        }
      }
    }
  },
  methods: {
    addHotel() {
      const trueFilters = {}
      trueFilters.payment = this.payment
      const starFilters = []
      if (this.star1 === true) {
        starFilters.push(1)
      }
      if (this.star2 === true) {
        starFilters.push(2)
      }
      if (this.star3 === true) {
        starFilters.push(3)
      }
      if (this.star4 === true) {
        starFilters.push(4)
      }
      if (this.star5 === true) {
        starFilters.push(5)
      }
      if (starFilters.length > 0) {
        trueFilters.star = starFilters
      }

      const supplyFilters = []
      if (this.supply10 === true) {
        supplyFilters.push(90)
      }
      if (this.supply20 === true) {
        supplyFilters.push(20)
      }
      if (this.supply30 === true) {
        supplyFilters.push(30)
      }
      if (this.supply40 === true) {
        supplyFilters.push(40)
      }
      if (this.supply50 === true) {
        supplyFilters.push(50)
      }
      if (this.supply60 === true) {
        supplyFilters.push(60)
      }
      if (supplyFilters.length > 0) {
        trueFilters.supply = supplyFilters
      }
      this.$emit('addHotel', trueFilters)
    }
  }
}
</script>

<style></style>
