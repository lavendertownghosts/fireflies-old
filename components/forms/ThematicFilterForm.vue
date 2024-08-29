<template>
  <div v-if="init !== false" class="flex flex-col">
    <!-- NOTE: FILTER STARS -->
    <h3 class="text-sm leading-14 text-black font-bold mb-8">
      {{ $t('thematic.Category') }}
    </h3>

    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star5"
        :is-disabled="!init.stars[0].count"
        @input="filterResults()"
      >
        <StarRatings :stars="5" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[0].count ? 'text-grey' : ''">
        {{ init.stars[0].count || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star4"
        :is-disabled="!init.stars[1].count"
        @input="filterResults()"
      >
        <StarRatings :stars="4" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[1].count ? 'text-grey' : ''">
        {{ init.stars[1].count || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox
        v-model="star3"
        :is-disabled="!init.stars[2].count"
        @input="filterResults()"
      >
        <StarRatings :stars="3" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[2].count ? 'text-grey' : ''">
        {{ init.stars[2].count || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end">
      <InputCheckbox
        v-model="star2"
        :is-disabled="!init.stars[3].count"
        @input="filterResults()"
      >
        <StarRatings :stars="2" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[3].count ? 'text-grey' : ''">
        {{ init.stars[3].count || 0 }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end">
      <InputCheckbox
        v-model="star1"
        :is-disabled="!init.stars[4].count"
        @input="filterResults()"
      >
        <StarRatings :stars="1" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm" :class="!init.stars[4].count ? 'text-grey' : ''">
        {{ init.stars[4].count || 0 }}
      </p>
    </div>

    <!-- NOTE: FILTER DATE -->
    <h3 class="text-sm leading-14 text-black font-bold mt-24 mb-8">
      {{ $t('general.Date') }}
    </h3>
    <InputDateRange
      v-model="dates"
      :is-dark="false"
      :input-style="[]"
      :wrapper-style-checkin="['w-1/2']"
      :wrapper-style-checkout="['w-1/2']"
      class="flex flex-row relative"
      @input="filterResults()"
    >
      <div
        slot="separator"
        class="flex items-center text-sm leading-14 pt-2 md:mx-5 w-5 lg:mx-0"
      >
        -
      </div>
    </InputDateRange>

    <!-- NOTE: FILTER COUNTRY -->
    <h3 class="text-sm leading-14 text-black font-bold mt-24">
      {{ $t('general.Country') }}
    </h3>
    <InputDropdown
      v-if="countryDropdown"
      v-model="countrySelect"
      :is-dark="false"
      :values="countries"
      class="mt-12"
      @input=";(citySelect = 0), filterResults()"
    ></InputDropdown>

    <!-- NOTE: FILTER CITY -->
    <h3 class="text-sm leading-14 text-black font-bold mt-24">
      {{ $t('general.City') }}
    </h3>
    <InputDropdown
      v-if="cityDropdown"
      v-model="citySelect"
      :is-dark="false"
      :values="cities"
      class="mt-12"
      @input="filterResults()"
    ></InputDropdown>

    <!-- NOTE: SUBMIT+RESET -->
    <ButtonSmall
      v-if="showButton"
      class="mt-24"
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
import { mapGetters } from 'vuex'

import InputCheckbox from '@/components/micro/InputCheckbox'
import InputDateRange from '@/components/micro/InputDateRange'
import InputDropdown from '@/components/micro/InputDropdown'
import StarRatings from '@/components/micro/StarRatings'
import ButtonSmall from '@/components/micro/ButtonSmall'

import { getTomorrow } from '~/includes/utils'

export default {
  name: 'ThematicFilterForm',
  components: {
    InputCheckbox,
    InputDateRange,
    StarRatings,
    InputDropdown,
    ButtonSmall
  },
  props: {
    init: {
      type: [Object, Boolean, Array],
      default() {
        return false
      }
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
    }
  },
  data() {
    return {
      star1: false,
      star2: false,
      star3: false,
      star4: false,
      star5: false,
      dates: {
        date1: getTomorrow(),
        date2: ''
      },
      cities: [],
      countries: [],
      countrySelect: false,
      citySelect: false,
      countryDropdown: true,
      cityDropdown: true
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
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
    }
  },
  mounted() {},
  methods: {
    resetFilters() {
      this.star1 = false
      this.star2 = false
      this.star3 = false
      this.star4 = false
      this.star5 = false
      this.country = []
      this.countrySelect = false
      this.citySelect = false
      this.cities = []

      /* FORCE RE RENDER DROPDOWN */
      this.countryDropdown = false
      this.cityDropdown = false
      this.$nextTick(() => {
        this.countryDropdown = true
        this.cityDropdown = true
      })
    },
    getTrueFilters() {
      const trueFilters = {}

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
        trueFilters.stars = starFilters
      }

      if (this.dates.date1 !== '') {
        trueFilters.bookablefrom = this.dates.date1
      }

      if (this.dates.date2 !== '') {
        trueFilters.bookableto = this.dates.date2
      }

      if (this.countrySelect !== false) {
        if (this.countrySelect !== 0) {
          trueFilters.country = this.countries[this.countrySelect]
        }
      }

      if (this.citySelect !== false) {
        if (this.citySelect !== 0) {
          trueFilters.city = this.cities[this.citySelect]
        }
      }

      return trueFilters
    },
    processInit(init) {
      if (init === false) {
        return
      }

      if (init.cities !== null && init.cities.length > 0) {
        this.cities = [this.$t('thematic.allcities')]
        for (let i = 0; i < init.cities.length; i++) {
          if (init.cities[i].count > 0) {
            this.cities.push(init.cities[i].name)
          }
        }
      }

      if (init.countries !== null && init.countries.length > 0) {
        this.countries = [this.$t('thematic.allcountries')]
        for (let i = 0; i < init.countries.length; i++) {
          this.countries.push(init.countries[i].name)
        }
      }
    },
    filterResults(getResultsToo = false) {
      const trueFilters = this.getTrueFilters()
      if (getResultsToo) {
        this.$emit('filter', trueFilters)
      } else {
        this.$emit('updateFilter', trueFilters)
      }
    },
    removeFilters() {
      this.resetFilters()
      this.$emit('filter', {
        date: [getTomorrow(), '']
      })
    }
  }
}
</script>
