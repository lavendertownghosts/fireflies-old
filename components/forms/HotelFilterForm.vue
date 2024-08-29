<template>
  <div
    v-if="
      init !== false &&
        init.filters !== undefined &&
        init.filters[1] !== undefined
    "
    class="flex flex-col"
  >
    <h3
      v-show="getFilterHistory.length > 0"
      class="text-sm leading-14 text-black font-bold mb-12"
    >
      {{ $t('general.PreviousFilters') }}
    </h3>
    <HistoryHotelFilter
      v-for="(history, i) in getFilterHistory"
      :key="i"
      :history="history"
      @click="fillHistory(history)"
    />

    <h3 class="text-sm leading-14 text-black font-bold mt-12 mb-8">
      {{ $t('hotel.nameFilter') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputText
        v-model="textSearch"
        :placeholder="$t('hotel.namePlaceholder')"
        class="w-full"
      />
    </div>
    <h3 class="text-sm leading-14 text-black font-bold mt-12 mb-8">
      {{ $t('hotel.Category') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star5"
        :is-disabled="!init.stars[5]"
        @input="filterResults()"
      >
        <StarRatings :stars="5" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[5] ? 'text-grey' : ''">
        {{ init.stars[5] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star4"
        :is-disabled="!init.stars[4]"
        @input="filterResults()"
      >
        <StarRatings :stars="4" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[4] ? 'text-grey' : ''">
        {{ init.stars[4] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star3"
        :is-disabled="!init.stars[3]"
        @input="filterResults()"
      >
        <StarRatings :stars="3" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[3] ? 'text-grey' : ''">
        {{ init.stars[3] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star2"
        :is-disabled="!init.stars[2]"
        @input="filterResults()"
      >
        <StarRatings :stars="2" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[2] ? 'text-grey' : ''">
        {{ init.stars[2] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end">
      <InputCheckbox
        v-model="star1"
        :is-disabled="!init.stars[1]"
        @input="filterResults()"
      >
        <StarRatings :stars="1" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[2] ? 'text-grey' : ''">
        {{ init.stars[1] || 0 }}
      </p>
    </div>

    <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
      {{ $t('hotel.Supply') }}
    </h3>

    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="supply10"
        :is-disabled="!init.supply[10]"
        @input="filterResults()"
      >
        {{ $t('hotel.RoomOnly') }}
      </InputCheckbox>
      <p class="text-sm" :class="!init.supply[10] ? 'text-grey' : ''">
        {{ init.supply[10] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="supply20"
        :is-disabled="!init.supply[20]"
        @input="filterResults()"
      >
        {{ $t('hotel.WithBreakfast') }}
      </InputCheckbox>
      <p class="text-sm" :class="!init.supply[20] ? 'text-grey' : ''">
        {{ init.supply[20] || 0 }}
      </p>
    </div>
    <div
      class="flex flex-row justify-between items-end"
      :class="showMoreSupply ? 'mb-4' : 'mb-12'"
    >
      <InputCheckbox
        v-model="supply30"
        :is-disabled="!init.supply[30]"
        @input="filterResults()"
      >
        {{ $t('hotel.HB') }}
      </InputCheckbox>
      <p class="text-sm" :class="!init.supply[30] ? 'text-grey' : ''">
        {{ init.supply[30] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="supply40"
        :is-disabled="!init.supply[40]"
        @input="filterResults()"
      >
        {{ $t('hotel.FullBoard') }}
      </InputCheckbox>
      <p class="text-sm" :class="!init.supply[40] ? 'text-grey' : ''">
        {{ init.supply[40] || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="supply50"
        :is-disabled="!init.supply[50]"
        @input="filterResults()"
      >
        {{ $t('hotel.AllInclusive') }}
      </InputCheckbox>
      <p class="text-sm" :class="!init.supply[50] ? 'text-grey' : ''">
        {{ init.supply[50] || 0 }}
      </p>
    </div>

    <div v-if="showOptionsFilter">
      <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
        {{ $t('hotel.Options') }}
      </h3>
      <div class="flex flex-row justify-between items-end mb-12">
        <InputCheckbox v-model="voucherSelected" @input="filterResults()">
          {{ $t('hotel.selectedOffer') }}
        </InputCheckbox>
        <p class="text-sm" :class="!voucherCount ? 'text-grey' : ''">
          {{ voucherCount || 0 }}
        </p>
      </div>
    </div>

    <div v-if="showPriceFilter">
      <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
        {{ $t('hotel.PriceRange') }}
      </h3>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox
          v-model="price_slot_0_100"
          :is-disabled="init.ranges.price_slot_0_100.count === 0"
          @input="filterResults()"
        >
          {{ currency }} 0 - {{ currency }}
          {{
            init.ranges.price_slot_0_100.max[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_0_100.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_0_100.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox
          v-model="price_slot_100_250"
          :is-disabled="init.ranges.price_slot_100_250.count === 0"
          @input="filterResults()"
        >
          {{ currency }}
          {{
            init.ranges.price_slot_100_250.min[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
          -
          {{ currency }}
          {{
            init.ranges.price_slot_100_250.max[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_100_250.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_100_250.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox
          v-model="price_slot_250_500"
          :is-disabled="init.ranges.price_slot_250_500.count === 0"
          @input="filterResults()"
        >
          {{ currency }}
          {{
            init.ranges.price_slot_250_500.min[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
          -
          {{ currency }}
          {{
            init.ranges.price_slot_250_500.max[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_250_500.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_250_500.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox
          v-model="price_slot_500_1000"
          :is-disabled="init.ranges.price_slot_500_1000.count === 0"
          @input="filterResults()"
        >
          {{ currency }}
          {{
            init.ranges.price_slot_500_1000.min[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
          -
          {{ currency }}
          {{
            init.ranges.price_slot_500_1000.max[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </InputCheckbox>
        <p
          class="text-sm"
          :class="
            init.ranges.price_slot_500_1000.count === 0 ? 'text-grey' : ''
          "
        >
          {{ init.ranges.price_slot_500_1000.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end">
        <InputCheckbox
          v-model="price_slot_1000_plus"
          :is-disabled="init.ranges.price_slot_1000_plus.count === 0"
          @input="filterResults()"
        >
          {{ currency }}
          {{
            init.ranges.price_slot_1000_plus.min[currency]
              | parseInt
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
          +
        </InputCheckbox>
        <p
          class="text-sm"
          :class="
            init.ranges.price_slot_1000_plus.count === 0 ? 'text-grey' : ''
          "
        >
          {{ init.ranges.price_slot_1000_plus.count }}
        </p>
      </div>
      <p class="text-black text-sm leading-14 my-12">
        {{ $t('hotel.CustomPrice') }}
      </p>
      <div class="flex flex-row justify-between items-center mb-4">
        <InputText
          v-model="price_min"
          input-type="number"
          :input-props="{
            min: Math.ceil(Math.ceil(init.price.min[currency]) / nights),
            max: Math.ceil(Math.ceil(init.price.max[currency]) / nights)
          }"
          :placeholder="$t('hotel.Min')"
          class="w-full"
          @change="validateMinMax"
        />
        <p class="text-black text-sm leading-14 mx-4">-</p>
        <InputText
          v-model="price_max"
          input-type="number"
          :input-props="{
            min: Math.ceil(Math.ceil(init.price.min[currency]) / nights),
            max: Math.ceil(Math.ceil(init.price.max[currency]) / nights)
          }"
          :placeholder="$t('hotel.Max')"
          class="w-full"
          @change="validateMinMax"
        />
      </div>
    </div>
    <div v-else>
      <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
        {{ $t('hotel.VoucherCount') }}
      </h3>
      <div class="flex flex-row justify-between items-center mb-4">
        <InputText
          v-model="voucher_min"
          input-type="number"
          :input-props="{
            min: parseInt(init.voucher.min),
            max: parseInt(init.voucher.max)
          }"
          :placeholder="$t('hotel.Min')"
          class="w-full"
          @change="validateMinMax"
        />
        <p class="text-black text-sm leading-14 mx-4">-</p>
        <InputText
          v-model="voucher_max"
          input-type="number"
          :input-props="{
            min: parseInt(init.voucher.min),
            max: parseInt(init.voucher.max)
          }"
          :placeholder="$t('hotel.Max')"
          class="w-full"
          @change="validateMinMax"
        />
      </div>
    </div>
    <div v-show="errorMinMax !== ''" class="text-danger text-xs leading-12">
      {{ errorMinMax }}
    </div>
    <div
      v-if="showDynamicFilters && dynamicFilters.facilities.length > 0"
      class="flex flex-col"
    >
      <!-- Hotel facilities -->
      <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
        {{ $t('hotel.Facilities') }}
      </h3>
      <div
        v-for="(value, key) in limitBy(
          dynamicFilters.facilities,
          showMore['1'] === true ? 999 : showLimit
        )"
        :key="'facilities' + key"
        class="flex flex-row justify-between items-end mb-4"
      >
        <InputCheckbox
          v-model="value.model"
          :is-disabled="parseInt(value.count) === 0"
          @input="filterResults()"
        >
          <p class="truncate">
            {{ value.en | capitalize | truncate(sidebarTruncateValue) }}
          </p>
        </InputCheckbox>
        <p
          class="text-sm"
          :class="parseInt(value.count) === 0 ? 'text-grey' : ''"
        >
          {{ value.count }}
        </p>
      </div>

      <p
        v-show="showMore['1'] === false"
        class="link text-sm cursor-pointer"
        @click="showMore['1'] = true"
      >
        {{ $t('hotel.MoreFacilities') }}
      </p>
      <p
        v-show="showMore['1'] === true"
        class="link text-sm cursor-pointer"
        @click="showMore['1'] = false"
      >
        {{ $t('hotel.LessFacilities') }}
      </p>

      <!-- Hotel themes -->
      <div v-if="init.filters !== undefined && init.filters['2'] !== undefined">
        <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
          {{ $t('hotel.HotelThemes') }}
        </h3>
        <div
          v-for="(value, key) in limitBy(
            dynamicFilters.themes,
            showMore['2'] === true ? 999 : showLimit
          )"
          :key="'themes' + key"
          class="flex flex-row justify-between items-end mb-4"
        >
          <InputCheckbox
            v-model="value.model"
            :is-disabled="parseInt(value.count) === 0"
            @input="filterResults()"
          >
            <p class="truncate">
              {{ value.en | capitalize | truncate(sidebarTruncateValue) }}
            </p>
          </InputCheckbox>
          <p
            class="text-sm"
            :class="parseInt(value.count) === 0 ? 'text-grey' : ''"
          >
            {{ value.count }}
          </p>
        </div>

        <p
          v-show="showMore['2'] === false"
          class="link text-sm cursor-pointer"
          @click="showMore['2'] = true"
        >
          {{ $t('hotel.MoreHotelThemes') }}
        </p>
        <p
          v-show="showMore['2'] === true"
          class="link text-sm cursor-pointer"
          @click="showMore['2'] = false"
        >
          {{ $t('hotel.LessHotelThemes') }}
        </p>
      </div>
    </div>

    <div v-if="!isMobile">
      <ButtonSmall
        v-show="showButton"
        class="w-full mt-24"
        type="inverted"
        @click="filterResults(true)"
      >
        {{ $t('general.Filter') }}
      </ButtonSmall>
    </div>
    <div v-else class="w-full fixed bottom-0 left-0 right-0">
      <ButtonSmall
        v-show="showButton"
        class="w-full rounded-t-none rounded-b-none"
        type="primary"
        @click="filterResults(true)"
      >
        {{ $t('general.Filter') }}
      </ButtonSmall>
    </div>
    <div
      class="text-sm leading-14 link cursor-pointer text-center mt-16 hidden md:block"
      @click="removeFilters"
    >
      {{ $t('general.DeleteFilters') }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import HistoryHotelFilter from '@/components/history/HistoryHotelFilter'

import InputText from '@/components/micro/InputText'
import InputCheckbox from '@/components/micro/InputCheckbox'
import StarRatings from '@/components/micro/StarRatings'
import ButtonSmall from '@/components/micro/ButtonSmall'

import { limitBy, orderBy, updateArrayOfObjects } from '@/includes/utils'

export default {
  name: 'HotelFilterForm',
  components: {
    HistoryHotelFilter,
    InputText,
    InputCheckbox,
    StarRatings,
    ButtonSmall
  },
  props: {
    init: {
      type: [Object, Boolean, Array],
      default() {
        return false
      }
    },
    filterCache: {
      type: [Object, Boolean, Array],
      default() {
        return false
      }
    },
    nights: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default() {
        return true
      }
    },
    isMobile: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      dynamicFilters: {
        facilities: [],
        themes: []
      },
      showDynamicFilters: false,
      textSearch: '',
      price_slot_0_100: false,
      price_slot_100_250: false,
      price_slot_250_500: false,
      price_slot_500_1000: false,
      price_slot_1000_plus: false,

      price_min: '',
      price_max: '',
      voucher_min: '',
      voucher_max: '',

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

      payment_bpo_tc: false,
      payment_promo: false,

      voucherSelected: false,
      voucherCount: 0,

      showLimit: 3,
      showMoreSupply: true,
      showMore: {
        '1': false,
        '2': false
      },

      throtleTimeout: false,
      errorMinMax: ''
    }
  },
  computed: {
    ...mapGetters('hotel', ['getFilterHistory']),
    ...mapGetters('general', ['getCurrency']),
    showPriceFilter() {
      if (
        this.type === 'card' ||
        this.type === 'bpo' ||
        this.type === 'card_cis'
      ) {
        return true
      } else {
        return false
      }
    },
    showOptionsFilter() {
      if (this.type === 'voucher') {
        return true
      } else {
        return false
      }
    },
    currency() {
      return this.getCurrency
    },
    sidebarTruncateValue() {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        return 30
      } else {
        return 35
      }
    }
  },
  watch: {
    init: {
      handler(val) {
        this.processInit(val)
      },
      deep: true
    },
    filterCache: {
      handler(val) {
        if (val) {
          this.fillHistory(val)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.processInit(this.init)
  },
  methods: {
    ...mapMutations('hotel', [
      'pushFilterHistory',
      'setSearchCache',
      'clearSearchCache'
    ]),
    processInit(init) {
      if (init && init.filters !== undefined && init.filters.length > 0) {
        if (init.voucher.selected !== undefined) {
          this.voucherCount = init.voucher.selected
        }
        if (this.dynamicFilters.facilities.length === 0) {
          for (const value of Object.entries(init.filters[1].values)) {
            this.dynamicFilters.facilities.push({
              id: value[0],
              ...value[1],
              model: false
            })
          }
        } else {
          for (const value of Object.entries(init.filters[1].values)) {
            this.dynamicFilters.facilities = updateArrayOfObjects(
              this.dynamicFilters.facilities,
              'id',
              value[0],
              'count',
              value[1].count
            )
          }
        }

        if (init.filters[2] !== undefined) {
          if (this.dynamicFilters.themes.length === 0) {
            for (const value of Object.entries(init.filters[2].values)) {
              this.dynamicFilters.themes.push({
                id: value[0],
                ...value[1],
                model: false
              })
            }
          } else {
            for (const value of Object.entries(init.filters[2].values)) {
              this.dynamicFilters.themes = updateArrayOfObjects(
                this.dynamicFilters.themes,
                'id',
                value[0],
                'count',
                value[1].count
              )
            }
          }
        }

        this.dynamicFilters.facilities = orderBy(
          this.dynamicFilters.facilities,
          'count',
          -1
        )
        this.dynamicFilters.themes = orderBy(
          this.dynamicFilters.themes,
          'count',
          -1
        )
        this.showDynamicFilters = true
      }
    },
    resetFilters() {
      this.price_slot_0_100 = false
      this.price_slot_100_250 = false
      this.price_slot_250_500 = false
      this.price_slot_500_1000 = false
      this.price_slot_1000_plus = false

      this.price_min = ''
      this.price_max = ''
      this.voucher_min = ''
      this.voucher_max = ''

      this.star1 = false
      this.star2 = false
      this.star3 = false
      this.star4 = false
      this.star5 = false

      this.supply10 = false
      this.supply20 = false
      this.supply30 = false
      this.supply40 = false
      this.supply50 = false
      this.supply60 = false

      this.payment_bpo_tc = false
      this.payment_promo = false

      this.voucherSelected = false

      this.textSearch = ''

      for (let i = 0; i < this.dynamicFilters.facilities.length; i++) {
        this.dynamicFilters.facilities[i].model = false
      }

      for (let i = 0; i < this.dynamicFilters.themes.length; i++) {
        this.dynamicFilters.themes[i].model = false
      }
    },
    fillHistory(history) {
      this.resetFilters()

      for (let i = 0; i < history.length; i++) {
        if (history[i].category === '1') {
          for (let n = 0; n < this.dynamicFilters.facilities.length; n++) {
            if (this.dynamicFilters.facilities[n].id === history[i].filter) {
              this.dynamicFilters.facilities[n].model = true
            }
          }
        } else if (history[i].category === '2') {
          for (let n = 0; n < this.dynamicFilters.themes.length; n++) {
            if (this.dynamicFilters.themes[n].id === history[i].filter) {
              this.dynamicFilters.themes[n].model = true
            }
          }
        } else if (history[i].category === 'price') {
          const priceFilters = JSON.parse(history[i].filter)
          for (let n = 0; n < priceFilters.length; n++) {
            if (priceFilters[n].range === 'price_slot_0_100') {
              this.price_slot_0_100 = true
            } else if (priceFilters[n].range === 'price_slot_100_250') {
              this.price_slot_100_250 = true
            } else if (priceFilters[n].range === 'price_slot_250_500') {
              this.price_slot_250_500 = true
            } else if (priceFilters[n].range === 'price_slot_500_1000') {
              this.price_slot_500_1000 = true
            } else if (priceFilters[n].range === 'price_slot_1000_plus') {
              this.price_slot_1000_plus = true
            } else if (priceFilters[n].range === 'custom') {
              this.price_min = priceFilters[n].min
              this.price_max =
                priceFilters[n].max < 999999999999 ? priceFilters[n].max : ''
            }
          }
        } else if (history[i].category === 'star') {
          for (let n = 0; n < history[i].filter.length; n++) {
            if (history[i].filter[n] === 1) {
              this.star1 = true
            } else if (history[i].filter[n] === 2) {
              this.star2 = true
            } else if (history[i].filter[n] === 3) {
              this.star3 = true
            } else if (history[i].filter[n] === 4) {
              this.star4 = true
            } else if (history[i].filter[n] === 5) {
              this.star5 = true
            }
          }
        } else if (history[i].category === 'supply') {
          for (let n = 0; n < history[i].filter.length; n++) {
            if (history[i].filter[n] === 10 || history[i].filter[n] === 90) {
              this.supply10 = true
            } else if (history[i].filter[n] === 20) {
              this.supply20 = true
            } else if (history[i].filter[n] === 30) {
              this.supply30 = true
            } else if (history[i].filter[n] === 40) {
              this.supply40 = true
            } else if (history[i].filter[n] === 50) {
              this.supply50 = true
            } else if (history[i].filter[n] === 60) {
              this.supply60 = true
            }
          }
        } else if (history[i].category === 'voucher') {
          const voucherFilters = JSON.parse(history[i].filter)
          if (voucherFilters.min !== '') {
            this.voucher_min = voucherFilters.min
          }
          if (voucherFilters.max !== '' && voucherFilters.max < 9999999) {
            this.voucher_max = voucherFilters.max
          }
        } else if (history[i].category === 'text') {
          this.textSearch = history[i].filter
        }

        this.filterResults()
      }
    },
    limitBy(obj, n) {
      return limitBy(obj, n)
    },
    getTrueFilters() {
      const trueFilters = []

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
        trueFilters.push({
          category: 'star',
          filter: starFilters
        })
      }

      const supplyFilters = []
      if (this.supply10 === true) {
        supplyFilters.push(90)
        supplyFilters.push(10)
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
        trueFilters.push({
          category: 'supply',
          filter: supplyFilters
        })
      }

      const priceFilter = []

      if (this.price_slot_0_100 === true) {
        priceFilter.push({
          min: 0,
          max: this.init.ranges.price_slot_0_100.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_0_100'
        })
      }

      if (this.price_slot_100_250 === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_100_250.min_total[this.currency],
          max: this.init.ranges.price_slot_100_250.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_100_250'
        })
      }

      if (this.price_slot_250_500 === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_250_500.min_total[this.currency],
          max: this.init.ranges.price_slot_250_500.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_250_500'
        })
      }

      if (this.price_slot_500_1000 === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_500_1000.min_total[this.currency],
          max: this.init.ranges.price_slot_500_1000.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_500_1000'
        })
      }

      if (this.price_slot_1000_plus === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_1000_plus.min[this.currency],
          max: 999999999999,
          currency: this.currency,
          range: 'price_slot_1000_plus'
        })
      }

      if (this.price_min !== '' || this.price_max !== '') {
        priceFilter.push({
          min:
            this.price_min !== '' ? parseInt(this.price_min * this.nights) : 0,
          max:
            this.price_max !== ''
              ? parseInt(this.price_max * this.nights)
              : 999999999999,
          currency: this.currency,
          range: 'custom'
        })

        trueFilters.push({
          category: 'nights',
          filter: this.nights
        })
      }

      if (priceFilter.length > 0) {
        trueFilters.push({
          category: 'price',
          filter: JSON.stringify(priceFilter)
        })
      }

      if (this.voucher_min !== '' || this.voucher_max !== '') {
        trueFilters.push({
          category: 'voucher',
          filter: JSON.stringify({
            min: this.voucher_min !== '' ? parseInt(this.voucher_min) : 0,
            max:
              this.voucher_max !== ''
                ? parseInt(this.voucher_max)
                : 999999999999
          })
        })
      }

      if (this.voucherSelected) {
        trueFilters.push({
          category: 'voucher',
          filter: JSON.stringify({ selected: 1 })
        })
      }

      if (this.textSearch !== '') {
        trueFilters.push({
          category: 'text',
          filter: this.textSearch
        })
      }

      for (let i = 0; i < this.dynamicFilters.facilities.length; i++) {
        if (this.dynamicFilters.facilities[i] !== undefined) {
          if (
            this.dynamicFilters.facilities[i].model !== undefined &&
            this.dynamicFilters.facilities[i].model === true
          ) {
            trueFilters.push({
              category: '1',
              filter: this.dynamicFilters.facilities[i].id,
              name: this.dynamicFilters.facilities[i].en
            })
          }
        }
      }

      for (let i = 0; i < this.dynamicFilters.themes.length; i++) {
        if (this.dynamicFilters.themes[i] !== undefined) {
          if (
            this.dynamicFilters.themes[i].model !== undefined &&
            this.dynamicFilters.themes[i].model === true
          ) {
            trueFilters.push({
              category: '2',
              filter: this.dynamicFilters.themes[i].id,
              name: this.dynamicFilters.themes[i].en
            })
          }
        }
      }

      return trueFilters
    },
    filterResults(getResultsToo = false) {
      // @todo needs support for payment options
      const trueFilters = this.getTrueFilters()

      if (this.throtleTimeout) {
        clearTimeout(this.throtleTimeout)
      }
      this.throtleTimeout = setTimeout(() => {
        clearTimeout(this.throtleTimeout)

        if (getResultsToo) {
          if (Object.entries(trueFilters).length > 0) {
            this.pushFilterHistory(trueFilters)
          }
          const searchCache = {}
          searchCache[Number(this.$route.params.id)] = trueFilters
          this.setSearchCache(searchCache)

          this.$emit('filter', {
            filters: trueFilters
          })
        } else {
          this.$emit('updateFilter', {
            filters: trueFilters
          })
        }
      }, 10)
    },
    removeFilters() {
      this.resetFilters()
      this.clearSearchCache(Number(this.$route.params.id))
      this.$emit('filter', {
        filters: []
      })
    },
    validateMinMax() {
      this.errorMinMax = ''
      if (this.showPriceFilter) {
        if (this.price_min !== '') {
          if (this.price_min < 0) {
            this.price_min = 0
          }
        }
        if (this.price_max !== '') {
          if (this.price_max < 0) {
            this.price_max = 0
          }

          if (
            this.price_min !== '' &&
            this.price_max !== '' &&
            parseInt(this.price_min) > parseInt(this.price_max)
          ) {
            this.errorMinMax = this.$t('hotel.MinMaxValidate')
          }
        }
      } else {
        if (this.voucher_min !== '') {
          if (this.voucher_min < parseInt(this.init.voucher.min)) {
            this.voucher_min = parseInt(this.init.voucher.min)
          }

          if (this.voucher_min > parseInt(this.init.voucher.max)) {
            this.voucher_min = parseInt(this.init.voucher.max)
          }
        }
        if (this.voucher_max !== '') {
          if (this.voucher_max < parseInt(this.init.voucher.min)) {
            this.voucher_max = parseInt(this.init.voucher.min)
          }

          if (this.voucher_max > parseInt(this.init.voucher.max)) {
            this.voucher_max = parseInt(this.init.voucher.max)
          }
        }

        if (
          this.voucher_min !== '' &&
          this.voucher_max !== '' &&
          parseInt(this.voucher_min) > parseInt(this.voucher_max)
        ) {
          this.errorMinMax = this.$t('hotel.MinMaxValidate')
        }
      }
    }
  }
}
</script>
