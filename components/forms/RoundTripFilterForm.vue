<template>
  <div class="flex flex-col text-black">
    <div v-if="getReverseFilterHistory && getReverseFilterHistory.length > 0">
      <h3 class="text-sm leading-14 font-bold mb-12">
        {{ $t('general.PreviousFilters') }}
      </h3>
      <div v-for="(history, index) in getReverseFilterHistory" :key="index">
        <HistoryRoundTripFilter
          :history="history"
          @click="fillHistory(history)"
        />
      </div>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-8">
      {{ $t('roundtrip.StartRoundTrip') }}
    </h3>
    <InputDateRange
      v-model="dates"
      :is-dark="false"
      :input-style="[]"
      :wrapper-style-checkin="['w-1/2']"
      :wrapper-style-checkout="['w-1/2']"
      class="flex flex-row relative"
      ><div
        slot="separator"
        class="flex items-center text-sm leading-14 pt-2 md:mx-5 w-5 lg:mx-0"
      >
        -
      </div></InputDateRange
    >
    <h3 class="text-sm leading-14 font-bold mt-20 mb-8">
      {{ $t('roundtrip.TripLength') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="week"
        :is-disabled="!getCountTripLength('0-6')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.UpTo1Week') }}
      </InputCheckbox>
      <p :class="!getCountTripLength('0-6') ? 'text-grey' : ''" class="text-sm">
        {{ getCountTripLength('0-6') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="weeks_1_2"
        :is-disabled="!getCountTripLength('7-14')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.Weeks_1_2') }}
      </InputCheckbox>
      <p
        :class="!getCountTripLength('7-14') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountTripLength('7-14') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end">
      <InputCheckbox
        v-model="weeks_2"
        :is-disabled="!getCountTripLength('14+')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.Weeks2') }}
      </InputCheckbox>
      <p :class="!getCountTripLength('14+') ? 'text-grey' : ''" class="text-sm">
        {{ getCountTripLength('14+') }}
      </p>
    </div>
    <InputGuests
      v-model="guests"
      :label="$t('roundtrip.Guests')"
      :is-dark="false"
      :wrapper-style="['mt-24']"
      :label-style="'text-sm mb-12'"
      class="w-full"
      @input="filterResults()"
    />
    <div class="text-xs leading-12 text-grey-dark mt-4">
      {{ $t('roundtrip.GuestDesc') }}
    </div>

    <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
      {{ $t('roundtrip.PriceRange') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_0_500"
        :is-disabled="getCountPrice('0-500') === 0"
        @input="filterResults()"
      >
        {{ getPriceLabel('0-500') }}
      </InputCheckbox>
      <p :class="!getCountPrice('0-500') ? 'text-grey' : ''" class="text-sm">
        {{ getCountPrice('0-500') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_500_750"
        :is-disabled="getCountPrice('500-750') === 0"
        @input="filterResults()"
      >
        {{ getPriceLabel('500-750') }}
      </InputCheckbox>
      <p :class="!getCountPrice('500-750') ? 'text-grey' : ''" class="text-sm">
        {{ getCountPrice('500-750') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_750_1000"
        :is-disabled="getCountPrice('750-1000') === 0"
        @input="filterResults()"
      >
        {{ getPriceLabel('750-1000') }}
      </InputCheckbox>
      <p :class="!getCountPrice('750-1000') ? 'text-grey' : ''" class="text-sm">
        {{ getCountPrice('750-1000') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_1000_1500"
        :is-disabled="getCountPrice('1000-1500') === 0"
        @input="filterResults()"
      >
        {{ getPriceLabel('1000-1500') }}
      </InputCheckbox>
      <p
        :class="!getCountPrice('1000-1500') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountPrice('1000-1500') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_1500"
        :is-disabled="getCountPrice('1500+') === 0"
        @input="filterResults()"
      >
        {{ getPriceLabel('1500+') }}
      </InputCheckbox>
      <p :class="!getCountPrice('1500+') ? 'text-grey' : ''" class="text-sm">
        {{ getCountPrice('1500+') }}
      </p>
    </div>
    <p class="link text-sm cursor-pointer leading-14" @click="showCustomPrice">
      {{ $t('roundtrip.UniquePrice') }}
    </p>
    <div v-show="customPriceActive" class="flex flex-row mt-7">
      <div>
        <InputText
          v-model="price_min"
          input-type="number"
          :placeholder="$t('roundtrip.Min')"
          @change="filterResults"
        />
      </div>
      <div class="flex items-center px-4">-</div>
      <div>
        <InputText
          v-model="price_max"
          :placeholder="$t('roundtrip.Max')"
          input-type="number"
          @change="filterResults"
        />
      </div>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
      {{ $t('roundtrip.Countries') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.country,
        showMore.country === true ? 999 : showLimit
      )"
      :key="'country' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!value.count"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.label | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!value.count ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="
        showMore.country === false && showLimit < dynamicFilters.country.length
      "
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.country = true"
    >
      {{ $t('roundtrip.MoreCountries') }}
    </p>
    <p
      v-show="
        showMore.country === true && showLimit < dynamicFilters.country.length
      "
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.country = false"
    >
      {{ $t('roundtrip.Less') }}
    </p>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-8">
      {{ $t('roundtrip.Cities') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.city,
        showMore.city === true ? 999 : showLimit
      )"
      :key="'city' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!value.count"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.label | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!value.count ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="showMore.city === false && showLimit < dynamicFilters.city.length"
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.city = true"
    >
      {{ $t('roundtrip.MoreCities') }}
    </p>
    <p
      v-show="showMore.city === true && showLimit < dynamicFilters.city.length"
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.city = false"
    >
      {{ $t('roundtrip.Less') }}
    </p>
    <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
      {{ $t('roundtrip.PhysicalDifficultyLevel') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="very_easy"
        :is-disabled="!getCountDifficulty('VERY_EASY')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.VeryEasy') }}
      </InputCheckbox>
      <p
        :class="!getCountDifficulty('VERY_EASY') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountDifficulty('VERY_EASY') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="easy"
        :is-disabled="!getCountDifficulty('EASY')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.Easy') }}
      </InputCheckbox>
      <p
        :class="!getCountDifficulty('EASY') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountDifficulty('EASY') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="moderate"
        :is-disabled="!getCountDifficulty('MODERATE')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.Moderate') }}
      </InputCheckbox>
      <p
        :class="!getCountDifficulty('MODERATE') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountDifficulty('MODERATE') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end">
      <InputCheckbox
        v-model="challenging"
        :is-disabled="!getCountDifficulty('CHALLENGING')"
        @input="filterResults()"
      >
        {{ $t('roundtrip.Challenging') }}
      </InputCheckbox>
      <p
        :class="!getCountDifficulty('CHALLENGING') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountDifficulty('CHALLENGING') }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
      {{ $t('roundtrip.Categories') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.category,
        showMore.category === true ? 999 : showLimit
      )"
      :key="'category' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!value.count"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.label | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!value.count ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="
        showMore.category === false &&
          showLimit < dynamicFilters.category.length
      "
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.category = true"
    >
      {{ $t('roundtrip.MoreCategories') }}
    </p>
    <p
      v-show="
        showMore.category === true && showLimit < dynamicFilters.category.length
      "
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.category = false"
    >
      {{ $t('roundtrip.Less') }}
    </p>
    <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
      {{ $t('roundtrip.Languages') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.language,
        showMore.language === true ? 999 : showLimit
      )"
      :key="'language' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!value.count"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.label | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!value.count ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="
        showMore.language === false &&
          showLimit < dynamicFilters.language.length
      "
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.language = true"
    >
      {{ $t('roundtrip.MoreLanguages') }}
    </p>
    <p
      v-show="
        showMore.language === true && showLimit < dynamicFilters.language.length
      "
      class="link text-sm cursor-pointer leading-14"
      @click="showMore.language = false"
    >
      {{ $t('roundtrip.Less') }}
    </p>
    <ButtonSmall
      v-show="showFilterButton"
      class="w-full mt-24"
      type="inverted"
      @click="filterResults(true)"
    >
      {{ $t('general.Filter') }}
    </ButtonSmall>
    <div
      class="text-sm leading-14 link cursor-pointer text-center mt-16 hidden md:block"
      @click="removeFilters"
    >
      {{ $t('general.DeleteFilters') }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import HistoryRoundTripFilter from '@/components/history/HistoryRoundTripFilter'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import InputGuests from '@/components/micro/InputGuests'
import InputDateRange from '@/components/micro/InputDateRange'
import {
  getLanguageName,
  getTomorrow,
  limitBy,
  updateArrayOfObjects
} from '~/includes/utils'
export default {
  name: 'ProgramFilterForm',
  components: {
    HistoryRoundTripFilter,
    ButtonSmall,
    InputCheckbox,
    InputText,
    InputGuests,
    InputDateRange
  },
  props: {
    showFilterButton: {
      type: Boolean,
      default: true
    },
    init: {
      type: [Object, Boolean],
      default() {
        return false
      }
    }
  },
  data() {
    return {
      dynamicFilters: {
        country: [],
        city: [],
        category: [],
        language: []
      },
      guests: {
        adults: 2,
        children: 0,
        childrenAges: []
      },
      showLimit: 3,
      showMore: {
        country: false,
        city: false,
        category: false,
        language: false
      },
      customPriceActive: false,
      very_easy: false,
      easy: false,
      moderate: false,
      challenging: false,
      price_slot_0_500: false,
      price_slot_500_750: false,
      price_slot_750_1000: false,
      price_slot_1000_1500: false,
      price_slot_1500: false,
      price_min: '',
      price_max: '',
      stars_5: false,
      stars_4: false,
      stars_3: false,
      stars_2: false,
      stars_1: false,
      week: false,
      weeks_1_2: false,
      weeks_2: false,
      activeCategory: '',
      dates: {
        date1: getTomorrow(),
        date2: ''
      }
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('round-trip', ['getFilterHistory']),
    currency() {
      return this.getCurrency
    },
    getReverseFilterHistory() {
      const reverseHistory = []
      if (this.getFilterHistory.length > 0) {
        this.getFilterHistory.forEach((history) => {
          reverseHistory.push(history)
        })
      }
      return reverseHistory.reverse()
    },
    getMaxAdultsCount() {
      if (
        this.init.filters !== undefined &&
        this.init.filters.passenger_limit !== undefined &&
        this.init.filters.passenger_limit.max !== undefined
      ) {
        return parseInt(this.init.filters.passenger_limit.max)
      } else {
        return 10
      }
    },
    getMinAdultsCount() {
      if (
        this.init.filters !== undefined &&
        this.init.filters.passenger_limit !== undefined &&
        this.init.filters.passenger_limit.min !== undefined
      ) {
        return parseInt(this.init.filters.passenger_limit.min)
      } else {
        return 0
      }
    }
  },
  watch: {
    init: {
      handler(val) {
        this.processInit(val)
      },
      deep: true
    }
  },
  mounted() {
    this.processInit(this.init)
  },
  methods: {
    ...mapMutations('round-trip', ['pushFilterHistory']),
    filterResults(getResultsToo = false) {
      const trueFilters = {}
      let historyFilters = {}
      trueFilters.dates = this.dates
      trueFilters.date_range = [this.dates.date1, this.dates.date2]
      trueFilters.passengers = this.guests.adults + this.guests.children
      trueFilters.guests = this.guests
      const tripLength = []
      if (this.week === true) {
        tripLength.push('0-6')
      }
      if (this.weeks_1_2 === true) {
        tripLength.push('7-14')
      }
      if (this.weeks_2 === true) {
        tripLength.push('14+')
      }
      if (tripLength.length > 0) {
        trueFilters.trip_length = tripLength
      }
      const priceFilter = []
      const tmpHistoryPriceFilter = []
      if (this.price_slot_0_500 === true) {
        priceFilter.push('0-500')
        tmpHistoryPriceFilter.push({
          range: '0-500',
          label: this.init.filters.price_range['0-500'].label
        })
      }
      if (this.price_slot_500_750 === true) {
        priceFilter.push('500-750')
        tmpHistoryPriceFilter.push({
          range: '500-750',
          label: this.init.filters.price_range['500-750'].label
        })
      }
      if (this.price_slot_750_1000 === true) {
        priceFilter.push('750-1000')
        tmpHistoryPriceFilter.push({
          range: '750-1000',
          label: this.init.filters.price_range['750-1000'].label
        })
      }
      if (this.price_slot_1000_1500 === true) {
        priceFilter.push('1000-1500')
        tmpHistoryPriceFilter.push({
          range: '1000-1500',
          label: this.init.filters.price_range['1000-1500'].label
        })
      }
      if (this.price_slot_1500 === true) {
        priceFilter.push('1500+')
        tmpHistoryPriceFilter.push({
          range: '1500+',
          label: this.init.filters.price_range['1500+'].label
        })
      }
      if (priceFilter.length > 0) {
        trueFilters.price_range = priceFilter
      }

      if (
        this.price_min !== '' &&
        this.price_max !== '' &&
        this.price_min <= this.price_max
      ) {
        trueFilters.custom_price_range = [this.price_min, this.price_max]
      }

      const difficultyFilter = []
      if (this.very_easy === true) {
        difficultyFilter.push('VERY_EASY')
      }
      if (this.easy === true) {
        difficultyFilter.push('EASY')
      }
      if (this.moderate === true) {
        difficultyFilter.push('MODERATE')
      }
      if (this.challenging === true) {
        difficultyFilter.push('CHALLENGING')
      }
      if (difficultyFilter.length > 0) {
        trueFilters.difficulty = difficultyFilter
      }
      this.dynamicFilters.category.forEach((item) => {
        if (item.model) {
          if (trueFilters.category === undefined) {
            trueFilters.category = []
          }
          trueFilters.category.push(item.name)
        }
      })
      this.dynamicFilters.country.forEach((item) => {
        if (item.model) {
          if (trueFilters.country === undefined) {
            trueFilters.country = []
          }
          trueFilters.country.push(item.name)
        }
      })

      this.dynamicFilters.city.forEach((item) => {
        if (item.model) {
          if (trueFilters.city === undefined) {
            trueFilters.city = []
          }
          trueFilters.city.push(item.name)
        }
      })

      this.dynamicFilters.language.forEach((item) => {
        if (item.model) {
          if (trueFilters.languages === undefined) {
            trueFilters.languages = []
          }
          trueFilters.languages.push(item.name)
        }
      })

      historyFilters = JSON.parse(JSON.stringify(trueFilters))
      if (getResultsToo) {
        if (Object.entries(historyFilters).length > 0) {
          historyFilters.currency = this.currency
          if (tmpHistoryPriceFilter.length > 0) {
            historyFilters.price_range = tmpHistoryPriceFilter
          }
          this.pushFilterHistory(historyFilters)
        }
        this.$emit('filter', {
          filters: trueFilters
        })
      } else {
        this.$emit('updateFilters', {
          filters: trueFilters
        })
      }
    },
    limitBy(obj, n) {
      return limitBy(obj, n)
    },
    changeActiveCategory(payload) {
      this.activeCategory = payload.category
      if (payload.level > 1) {
        this.filterResults()
        this.$emit('filter')
      }
    },
    resetFilters() {
      this.very_easy = false
      this.easy = false
      this.moderate = false
      this.challenging = false
      this.price_slot_0_500 = false
      this.price_slot_500_750 = false
      this.price_slot_750_1000 = false
      this.price_slot_1000_1500 = false
      this.price_slot_1500 = false
      this.price_min = ''
      this.price_max = ''
      this.stars_5 = false
      this.stars_4 = false
      this.stars_3 = false
      this.stars_2 = false
      this.stars_1 = false
      this.week = false
      this.weeks_1_2 = false
      this.weeks_2 = false
    },
    removeFilters() {
      this.resetFilters()
      this.$emit('filter', {
        filters: {
          date_range: [getTomorrow(), '']
        }
      })
    },
    processInit(init) {
      const filters = init.filters
      if (init === false || filters === undefined) {
        return
      }
      if (filters.date_range !== undefined) {
        this.dates.date1 = filters.date_range[0]
        this.dates.date2 = filters.date_range[1]
      }
      if (init.filters.trip_length !== undefined) {
        if (
          init.filters.trip_length['0-6'] !== undefined &&
          !parseInt(init.filters.trip_length['0-6'].count)
        ) {
          this.week = false
        }
        if (
          init.filters.trip_length['7-14'] !== undefined &&
          !parseInt(init.filters.trip_length['7-14'].count)
        ) {
          this.weeks_1_2 = false
        }
        if (
          init.filters.trip_length['14+'] !== undefined &&
          !parseInt(init.filters.trip_length['14+'].count)
        ) {
          this.weeks_2 = false
        }
      }
      if (init.filters.price_range !== undefined) {
        if (
          init.filters.price_range['0-500'] !== undefined &&
          !init.filters.price_range['0-500'].count
        ) {
          this.price_slot_0_500 = false
        }
        if (
          init.filters.price_range['500-750'] !== undefined &&
          !init.filters.price_range['500-750'].count
        ) {
          this.price_slot_500_750 = false
        }
        if (
          init.filters.price_range['750-1000'] !== undefined &&
          !init.filters.price_range['750-1000'].count
        ) {
          this.price_slot_750_1000 = false
        }
        if (
          init.filters.price_range['1000-1500'] !== undefined &&
          !init.filters.price_range['1000-1500'].count
        ) {
          this.price_slot_1000_1500 = false
        }
        if (
          init.filters.price_range['1500+'] !== undefined &&
          !init.filters.price_range['1500+'].count
        ) {
          this.price_slot_1500 = false
        }
      }
      if (init.filters.difficulty !== undefined) {
        if (
          init.filters.difficulty.VERY_EASY === undefined ||
          (init.filters.difficulty.VERY_EASY !== undefined &&
            !parseInt(init.filters.difficulty.VERY_EASY.count))
        ) {
          this.very_easy = false
        }
        if (
          init.filters.difficulty.EASY === undefined ||
          (init.filters.difficulty.EASY !== undefined &&
            !parseInt(init.filters.difficulty.EASY.count))
        ) {
          this.easy = false
        }
        if (
          init.filters.difficulty.MODERATE === undefined ||
          (init.filters.difficulty.MODERATE !== undefined &&
            !parseInt(init.filters.difficulty.MODERATE.count))
        ) {
          this.moderate = false
        }
        if (
          init.filters.difficulty.CHALLENGING === undefined ||
          (init.filters.difficulty.CHALLENGING !== undefined &&
            !parseInt(init.filters.difficulty.CHALLENGING.count))
        ) {
          this.challenging = false
        }
      }
      if (init.filters.country !== undefined) {
        if (this.dynamicFilters.country.length === 0) {
          for (const [key, value] of Object.entries(init.filters.country)) {
            this.dynamicFilters.country.push({
              label: value.label,
              name: key,
              count: parseInt(value.count),
              model: false
            })
          }
        } else {
          for (const [key, value] of Object.entries(
            this.init.filters.country
          )) {
            this.dynamicFilters.country = updateArrayOfObjects(
              this.dynamicFilters.country,
              'name',
              key,
              'count',
              parseInt(value.count)
            )
            if (!parseInt(value.count)) {
              this.dynamicFilters.country = updateArrayOfObjects(
                this.dynamicFilters.country,
                'name',
                key,
                'model',
                false
              )
            }
          }
        }
      }

      if (init.filters.city !== undefined) {
        if (this.dynamicFilters.city.length === 0) {
          for (const [key, value] of Object.entries(init.filters.city)) {
            this.dynamicFilters.city.push({
              label: value.label,
              name: key,
              count: parseInt(value.count),
              model: false
            })
          }
        } else {
          for (const [key, value] of Object.entries(this.init.filters.city)) {
            this.dynamicFilters.city = updateArrayOfObjects(
              this.dynamicFilters.city,
              'name',
              key,
              'count',
              parseInt(value.count)
            )
            if (!parseInt(value.count)) {
              this.dynamicFilters.city = updateArrayOfObjects(
                this.dynamicFilters.city,
                'name',
                key,
                'model',
                false
              )
            }
          }
        }
      }

      if (init.filters.languages !== undefined) {
        if (this.dynamicFilters.language.length === 0) {
          for (const [key, value] of Object.entries(init.filters.languages)) {
            this.dynamicFilters.language.push({
              label: getLanguageName(value.label),
              name: key,
              count: parseInt(value.count),
              model: false
            })
          }
        } else {
          for (const [key, value] of Object.entries(
            this.init.filters.languages
          )) {
            this.dynamicFilters.language = updateArrayOfObjects(
              this.dynamicFilters.language,
              'name',
              key,
              'count',
              parseInt(value.count)
            )
            if (!parseInt(value.count)) {
              this.dynamicFilters.language = updateArrayOfObjects(
                this.dynamicFilters.language,
                'name',
                key,
                'model',
                false
              )
            }
          }
        }
      }

      if (init.filters.category !== undefined) {
        if (this.dynamicFilters.category.length === 0) {
          for (const [key, value] of Object.entries(init.filters.category)) {
            const label = value.label.split('_').join(' ')
            this.dynamicFilters.category.push({
              label:
                label.charAt(0).toUpperCase() + label.slice(1).toLowerCase(),
              name: key,
              count: parseInt(value.count),
              model: false
            })
          }
        } else {
          for (const [key, value] of Object.entries(
            this.init.filters.category
          )) {
            this.dynamicFilters.category = updateArrayOfObjects(
              this.dynamicFilters.category,
              'name',
              key,
              'count',
              parseInt(value.count)
            )
            if (!parseInt(value.count)) {
              this.dynamicFilters.category = updateArrayOfObjects(
                this.dynamicFilters.category,
                'name',
                key,
                'model',
                false
              )
            }
          }
        }
      }
    },
    fillHistory(history) {
      this.resetFilters()
      if (history.dates !== undefined) {
        this.dates.date1 = history.dates.date1
        this.dates.date2 = history.dates.date2
      }
      if (history.trip_length !== undefined && history.trip_length.length > 0) {
        history.trip_length.forEach((tripLength) => {
          if (tripLength === '0-6') {
            this.week = true
          }
          if (tripLength === '7-14') {
            this.weeks_1_2 = true
          }
          if (tripLength === '14+') {
            this.weeks_2 = true
          }
        })
      }
      if (history.guests !== undefined) {
        this.guests.adults = history.guests.adults
        this.guests.children = history.guests.children
        this.guests.childrenAges = history.guests.childrenAges
      }
      if (history.price_range !== undefined && history.price_range.length > 0) {
        history.price_range.forEach((price) => {
          if (price.range !== undefined) {
            if (price.range === '0-500') {
              this.price_slot_0_500 = true
            }
            if (price.range === '500-750') {
              this.price_slot_500_750 = true
            }
            if (price.range === '750-1000') {
              this.price_slot_750_1000 = true
            }
            if (price.range === '1000-1500') {
              this.price_slot_1000_1500 = true
            }
            if (price.range === '1500+') {
              this.price_slot_1500 = true
            }
          }
        })
      }
      if (
        history.custom_price_range !== undefined &&
        history.custom_price_range.length > 0
      ) {
        this.price_min = history.custom_price_range[0]
        this.price_max = history.custom_price_range[1]
        this.customPriceActive = true
      }
      if (history.country !== undefined && history.country.length > 0) {
        for (let i = 0; i < history.country.length; i++) {
          for (let j = 0; j < this.dynamicFilters.country.length; j++) {
            if (history.country[i] === this.dynamicFilters.country[j].name) {
              this.dynamicFilters.country[j].model = true
            }
          }
        }
      }
      if (history.city !== undefined && history.city.length > 0) {
        for (let i = 0; i < history.city.length; i++) {
          for (let j = 0; j < this.dynamicFilters.city.length; j++) {
            if (history.city[i] === this.dynamicFilters.city[j].name) {
              this.dynamicFilters.city[j].model = true
            }
          }
        }
      }
      if (history.difficulty !== undefined && history.difficulty.length > 0) {
        history.difficulty.forEach((difficulty) => {
          if (difficulty === 'VERY_EASY') {
            this.very_easy = true
          }
          if (difficulty === 'EASY') {
            this.easy = true
          }
          if (difficulty === 'MODERATE') {
            this.moderate = true
          }
          if (difficulty === 'CHALLENGING') {
            this.challenging = true
          }
        })
      }

      if (history.category !== undefined && history.category.length > 0) {
        for (let i = 0; i < history.category.length; i++) {
          for (let j = 0; j < this.dynamicFilters.category.length; j++) {
            if (history.category[i] === this.dynamicFilters.category[j].name) {
              this.dynamicFilters.category[j].model = true
            }
          }
        }
      }
      if (history.language !== undefined && history.language.length > 0) {
        for (let i = 0; i < history.language.length; i++) {
          for (let j = 0; j < this.dynamicFilters.language.length; j++) {
            if (history.language[i] === this.dynamicFilters.language[j].name) {
              this.dynamicFilters.language[j].model = true
            }
          }
        }
      }
      this.filterResults()
    },
    showCustomPrice() {
      if (this.customPriceActive) {
        this.price_min = ''
        this.price_max = ''
      }
      this.customPriceActive = !this.customPriceActive
    },
    getCountDifficulty(type) {
      if (
        this.init.filters !== undefined &&
        this.init.filters.difficulty !== undefined &&
        this.init.filters.difficulty[type] !== undefined
      ) {
        return parseInt(this.init.filters.difficulty[type].count)
      } else {
        return 0
      }
    },
    getCountPrice(type) {
      if (
        this.init.filters !== undefined &&
        this.init.filters.price_range !== undefined &&
        this.init.filters.price_range[type] !== undefined
      ) {
        return parseInt(this.init.filters.price_range[type].count)
      } else {
        return 0
      }
    },
    getPriceLabel(type) {
      if (
        this.init.filters !== undefined &&
        this.init.filters.price_range !== undefined &&
        this.init.filters.price_range[type] !== undefined
      ) {
        let label = this.init.filters.price_range[type].label[
          this.currency
        ].split('-')

        if (label[1] !== undefined) {
          label =
            this.currency +
            ' ' +
            this.$options.filters.formatNumber(label[0], '0,0', {
              thousandsSeparator: ' '
            }) +
            ' - ' +
            this.$options.filters.formatNumber(label[1], '0,0', {
              thousandsSeparator: ' '
            })
        } else {
          label =
            this.currency +
            ' ' +
            this.$options.filters.formatNumber(label[0].slice(0, -1), '0,0', {
              thousandsSeparator: ' '
            }) +
            '+'
        }

        return label
      } else {
        return 0
      }
    },
    getCountTripLength(type) {
      if (
        this.init.filters !== undefined &&
        this.init.filters.trip_length !== undefined &&
        this.init.filters.trip_length[type] !== undefined
      ) {
        return parseInt(this.init.filters.trip_length[type].count)
      } else {
        return 0
      }
    }
  }
}
</script>
