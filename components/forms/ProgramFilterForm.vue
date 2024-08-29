<template>
  <div>
    {{ init.filter }}
    <div
      v-if="
        init !== false &&
          (init.filter !== undefined || init.ranges !== undefined)
      "
      class="flex flex-col text-black"
    >
      <div v-if="getReverseFilterHistory && getReverseFilterHistory.length > 0">
        <h3 class="text-sm leading-14 font-bold mb-12 mt-8">
          {{ $t('general.PreviousFilters') }}
        </h3>
        <HistoryProgramFilter
          v-for="(history, i) in getReverseFilterHistory"
          :key="i"
          :history="history"
          @click="fillHistory(history)"
        />
      </div>
      <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
        {{ $t('program.PriceRange') }}
      </h3>
      <div class="flex flex-row justify-between items-end mb-8">
        <InputCheckbox
          v-model="price_slot_0_50"
          :is-disabled="init.ranges.price_slot_0_50.count === 0"
          @input="filterResults()"
        >
          EUR 0 - EUR 50
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_0_50.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_0_50.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-8">
        <InputCheckbox
          v-model="price_slot_50_75"
          :is-disabled="init.ranges.price_slot_50_75.count === 0"
          @input="filterResults()"
        >
          EUR 50 - EUR 75
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_50_75.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_50_75.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-8">
        <InputCheckbox
          v-model="price_slot_75_100"
          :is-disabled="init.ranges.price_slot_75_100.count === 0"
          @input="filterResults()"
        >
          EUR 75 - EUR 100
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_75_100.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_75_100.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-8">
        <InputCheckbox
          v-model="price_slot_100_150"
          :is-disabled="init.ranges.price_slot_100_150.count === 0"
          @input="filterResults()"
        >
          EUR 100 - EUR 150
        </InputCheckbox>
        <p
          class="text-sm"
          :class="init.ranges.price_slot_100_150.count === 0 ? 'text-grey' : ''"
        >
          {{ init.ranges.price_slot_100_150.count }}
        </p>
      </div>
      <div class="flex flex-row justify-between items-end mb-8">
        <InputCheckbox
          v-model="price_slot_150_plus"
          :is-disabled="init.ranges.price_slot_150_plus.count === 0"
          @input="filterResults()"
        >
          EUR 150 +
        </InputCheckbox>
        <p
          class="text-sm"
          :class="
            init.ranges.price_slot_150_plus.count === 0 ? 'text-grey' : ''
          "
        >
          {{ init.ranges.price_slot_150_plus.count }}
        </p>
      </div>
      <p
        class="link text-sm cursor-pointer leading-14 mb-7"
        @click="showCustomPrice = !showCustomPrice"
      >
        {{ $t('program.CustomPrice') }}
      </p>
      <div v-show="showCustomPrice" class="flex flex-row">
        <div>
          <InputText v-model="price_min" :placeholder="'Min'" />
        </div>
        <div class="flex items-center px-4">-</div>
        <div>
          <InputText v-model="price_max" :placeholder="'Max'" />
        </div>
      </div>
      <!-- Category -->
      <div
        v-if="showDynamicFilters && dynamicFilters.categories.length > 0"
        class="flex flex-col"
      >
        <h3 class="text-sm leading-14 text-black font-bold mb-12 mt-24">
          {{ $t('program.Categories') }}
        </h3>
        <div
          v-for="(value, key) in limitBy(
            dynamicFilters.categories,
            showMore['1'] === true ? 999 : showLimit
          )"
          :key="'categories' + key"
          class="flex flex-row justify-between items-end mb-4"
        >
          <InputCheckbox
            v-model="value.model"
            :is-disabled="parseInt(value.count) === 0"
            @input="filterResults()"
          >
            <p class="truncate" :title="value.name | capitalize">
              {{ value.name | capitalize | truncate(sidebarTruncateValue) }}
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
          v-show="
            showMore['1'] === false &&
              dynamicFilters.categories.length > showLimit
          "
          class="link text-sm cursor-pointer"
          @click="showMore['1'] = true"
        >
          {{ $t('program.MoreCategories') }}
        </p>
        <p
          v-show="showMore['1'] === true"
          class="link text-sm cursor-pointer"
          @click="showMore['1'] = false"
        >
          {{ $t('program.Less') }}
        </p>
      </div>
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import HistoryProgramFilter from '@/components/history/HistoryProgramFilter'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import { limitBy, orderBy } from '~/includes/utils'

export default {
  name: 'ProgramFilterForm',
  components: {
    HistoryProgramFilter,
    ButtonSmall,
    InputCheckbox,
    InputText
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
        categories: [],
        activityFor: [],
        activityDuration: [],
        supplier: [],
        services: []
      },
      showDynamicFilters: false,

      price_slot_0_50: false,
      price_slot_50_75: false,
      price_slot_75_100: false,
      price_slot_100_150: false,
      price_slot_150_plus: false,
      price_min: '',
      price_max: '',

      showLimit: 3,
      showMore: {
        '1': false,
        '2': false,
        '3': false,
        '14': false,
        '16': false
      },
      searchHistory: [
        {
          description:
            'Morning + Up to 1 hour + Free Cancellation + Skip the Line'
        },
        {
          stars: 5,
          description:
            'Morning + Up to 1 hour + Free Cancellation + Skip the Line'
        },
        {
          stars: 5,
          description:
            'Morning + Up to 1 hour + Free Cancellation + Skip the Line'
        }
      ],
      showCustomPrice: false
    }
  },
  computed: {
    ...mapGetters('program', ['getFilterHistory']),
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    sidebarTruncateValue() {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        return 25
      } else {
        return 30
      }
    },
    getReverseFilterHistory() {
      const reverseHistory = []
      if (this.getFilterHistory.length > 0) {
        this.getFilterHistory.forEach((history) => {
          reverseHistory.push(history)
        })
      }
      return reverseHistory.reverse()
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
    ...mapMutations('program', ['pushFilterHistory']),
    filterResults(getResultsToo = false) {
      const trueFilters = this.getTrueFilters()
      if (getResultsToo) {
        this.pushFilterHistory(trueFilters)

        this.$emit('filter', {
          filters: trueFilters
        })
      } else {
        this.$emit('updateFilter', {
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
      this.price_slot_0_50 = false
      this.price_slot_50_75 = false
      this.price_slot_75_100 = false
      this.price_slot_100_150 = false
      this.price_min = ''
      this.price_max = ''
      for (let i = 0; i < this.dynamicFilters.categories.length; i++) {
        this.dynamicFilters.categories[i].model = false
      }
      for (let i = 0; i < this.dynamicFilters.activityFor.length; i++) {
        this.dynamicFilters.activityFor[i].model = false
      }
      for (let i = 0; i < this.dynamicFilters.activityDuration.length; i++) {
        this.dynamicFilters.activityDuration[i].model = false
      }
      for (let i = 0; i < this.dynamicFilters.supplier.length; i++) {
        this.dynamicFilters.supplier[i].model = false
      }
      for (let i = 0; i < this.dynamicFilters.services.length; i++) {
        this.dynamicFilters.services[i].model = false
      }
    },
    removeFilters() {
      this.resetFilters()
      this.$emit('filter', {
        filters: []
      })
    },
    processInit(init) {
      if (init) {
        if (this.dynamicFilters.categories.length === 0) {
          for (const value of Object.entries(init.categories)) {
            this.dynamicFilters.categories.push({
              id: value[0],
              name: value[1].name,
              count: value[1].count,
              model: false
            })
          }

          this.dynamicFilters.categories = orderBy(
            this.dynamicFilters.categories,
            'count',
            -1
          )
        } else {
          for (const catvalue of Object.entries(
            this.dynamicFilters.categories
          )) {
            for (const initval of Object.entries(init.categories)) {
              if (initval[1].name === catvalue[1].name) {
                this.dynamicFilters.categories[catvalue[0]].count =
                  initval[1].count
              }
            }
          }
        }

        this.showDynamicFilters = true
      }
    },
    getTrueFilters() {
      const trueFilters = {}

      const priceFilter = []

      if (this.price_slot_0_50 === true) {
        priceFilter.push({
          min: 0,
          max: this.init.ranges.price_slot_0_50.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_0_50'
        })
      }

      if (this.price_slot_50_75 === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_50_75.min_total[this.currency],
          max: this.init.ranges.price_slot_50_75.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_50_75'
        })
      }

      if (this.price_slot_75_100 === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_75_100.min_total[this.currency],
          max: this.init.ranges.price_slot_75_100.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_75_100'
        })
      }

      if (this.price_slot_100_150 === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_100_150.min_total[this.currency],
          max: this.init.ranges.price_slot_100_150.max_total[this.currency],
          currency: this.currency,
          range: 'price_slot_100_150'
        })
      }

      if (this.price_slot_150_plus === true) {
        priceFilter.push({
          min: this.init.ranges.price_slot_150_plus.min_total[this.currency],
          max: 999999999999,
          currency: this.currency,
          range: 'price_slot_150_plus'
        })
      }

      if (this.price_min !== '' || this.price_max !== '') {
        priceFilter.push({
          min: this.price_min !== '' ? parseInt(this.price_min) : 0,
          max: this.price_max !== '' ? parseInt(this.price_max) : 999999999999,
          currency: this.currency,
          range: 'custom'
        })
      }

      trueFilters.price = []

      if (priceFilter.length > 0) {
        trueFilters.price.push(JSON.stringify(priceFilter))
      }

      trueFilters.categories = []

      for (let i = 0; i < this.dynamicFilters.categories.length; i++) {
        if (this.dynamicFilters.categories[i] !== undefined) {
          if (
            this.dynamicFilters.categories[i].model !== undefined &&
            this.dynamicFilters.categories[i].model === true
          ) {
            trueFilters.categories.push(this.dynamicFilters.categories[i].name)
          }
        }
      }

      return trueFilters
    },
    fillHistory(history) {
      this.resetFilters()
      if (Array.isArray(history)) {
        const obj = {}
        history.forEach((item, key) => {
          obj[key] = item
        })

        history = obj
      }

      if (history.price !== undefined) {
        const priceFilters = JSON.parse(history.price)
        for (let n = 0; n < priceFilters.length; n++) {
          if (priceFilters[n].range === 'price_slot_0_50') {
            this.price_slot_0_50 = true
          } else if (priceFilters[n].range === 'price_slot_50_75') {
            this.price_slot_50_75 = true
          } else if (priceFilters[n].range === 'price_slot_75_100') {
            this.price_slot_75_100 = true
          } else if (priceFilters[n].range === 'price_slot_100_150') {
            this.price_slot_100_150 = true
          } else if (priceFilters[n].range === 'price_slot_150_plus') {
            this.price_slot_150_plus = true
          } else if (priceFilters[n].range === 'custom') {
            this.price_min = priceFilters[n].min
            this.price_max = priceFilters[n].max
          }
        }
      }

      for (let i = 0; i < this.dynamicFilters.categories.length; i++) {
        if (this.dynamicFilters.categories[i] !== undefined) {
          if (this.dynamicFilters.categories[i].model !== undefined) {
            if (history.categories !== undefined) {
              history.categories.forEach((name) => {
                if (this.dynamicFilters.categories[i].name === name) {
                  this.dynamicFilters.categories[i].model = true
                }
              })
            }
          }
        }
      }

      this.filterResults()
    }
  }
}
</script>
