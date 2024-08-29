<template>
  <div class="flex flex-col text-black">
    <div v-if="getReverseFilterHistory && getReverseFilterHistory.length > 0">
      <h3 class="text-sm leading-14 font-bold mb-12">
        {{ $t('general.PreviousFilters') }}
      </h3>
      <div v-for="(history, index) in getReverseFilterHistory" :key="index">
        <HistoryCarRentalFilter
          :history="history"
          @click="fillHistory(history)"
        />
      </div>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-8">
      {{ $t('carrent.Category') }}
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
        :is-disabled="!parseInt(value.count)"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.label | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!parseInt(value.count) ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="
        showMore.category === false &&
          showLimit < dynamicFilters.category.length
      "
      class="link text-sm cursor-pointer mb-24"
      @click="showMore.category = true"
    >
      {{ $t('carrent.MoreCategory') }}
    </p>
    <p
      v-show="
        showMore.category === true && showLimit < dynamicFilters.category.length
      "
      class="link text-sm cursor-pointer mb-24"
      @click="showMore.category = false"
    >
      {{ $t('carrent.Less') }}
    </p>
    <h3 class="text-sm leading-14 font-bold 0 mb-8">
      {{ $t('carrent.PriceRange') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_0_50"
        :is-disabled="init === false || !parseInt(init.price_range[0].count)"
        @input="filterResults()"
      >
        {{ getPriceLabel(0) }}
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.price_range[0].count)
            ? 'text-grey'
            : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.price_range[0].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_50_100"
        :is-disabled="init === false || !parseInt(init.price_range[1].count)"
        @input="filterResults()"
      >
        {{ getPriceLabel(1) }}
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.price_range[1].count)
            ? 'text-grey'
            : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.price_range[1].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_100_150"
        :is-disabled="init === false || !parseInt(init.price_range[2].count)"
        @input="filterResults()"
      >
        {{ getPriceLabel(2) }}
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.price_range[2].count)
            ? 'text-grey'
            : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.price_range[2].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_150_200"
        :is-disabled="init === false || !parseInt(init.price_range[3].count)"
        @input="filterResults()"
      >
        {{ getPriceLabel(3) }}
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.price_range[3].count)
            ? 'text-grey'
            : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.price_range[3].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_200"
        :is-disabled="init === false || !parseInt(init.price_range[4].count)"
        @input="filterResults()"
      >
        {{ getPriceLabel(4) }}
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.price_range[4].count)
            ? 'text-grey'
            : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.price_range[4].count }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-16 mb-8">
      {{ $t('carrent.BaggageCount') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="baggage_1"
        :is-disabled="init === false || !parseInt(init.baggage[1].count)"
        @input="filterResults()"
      >
        1
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.baggage[1].count) ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.baggage[1].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="baggage_2"
        :is-disabled="init === false || !parseInt(init.baggage[2].count)"
        @input="filterResults()"
      >
        2
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.baggage[2].count) ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.baggage[2].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="baggage_3"
        :is-disabled="init === false || !parseInt(init.baggage[3].count)"
        @input="filterResults()"
      >
        3
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.baggage[3].count) ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.baggage[3].count }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="baggage_4"
        :is-disabled="init === false || !parseInt(init.baggage[4].count)"
        @input="filterResults()"
      >
        4+
      </InputCheckbox>
      <p
        :class="
          init === false || !parseInt(init.baggage[4].count) ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ init === false ? '' : init.baggage[4].count }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-16 mb-8">
      {{ $t('carrent.Equipment') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.equipment,
        showMore.equipment === true ? 999 : showLimit
      )"
      :key="'equipment' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!parseInt(value.count)"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.label | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!parseInt(value.count) ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="
        showMore.equipment === false &&
          showLimit < dynamicFilters.equipment.length
      "
      class="link text-sm cursor-pointer"
      @click="showMore.equipment = true"
    >
      {{ $t('carrent.MoreEquipment') }}
    </p>
    <p
      v-show="
        showMore.equipment === true &&
          showLimit < dynamicFilters.equipment.length
      "
      class="link text-sm cursor-pointer"
      @click="showMore.equipment = false"
    >
      {{ $t('carrent.Less') }}
    </p>
    <h3 class="text-sm leading-14 font-bold mt-24 mb-8">
      {{ $t('carrent.CarRental') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.vendor,
        showMore.vendor === true ? 999 : showLimit
      )"
      :key="'vendor' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!parseInt(value.count)"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.name | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!parseInt(value.count) ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="
        showMore.vendor === false && showLimit < dynamicFilters.vendor.length
      "
      class="link text-sm cursor-pointer"
      @click="showMore.vendor = true"
    >
      {{ $t('carrent.MoreCarRental') }}
    </p>
    <p
      v-show="
        showMore.vendor === true && showLimit < dynamicFilters.vendor.length
      "
      class="link text-sm cursor-pointer"
      @click="showMore.vendor = false"
    >
      {{ $t('carrent.Less') }}
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
import HistoryCarRentalFilter from '@/components/history/HistoryCarRentalFilter'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputCheckbox from '@/components/micro/InputCheckbox'
import { limitBy, updateArrayOfObjects } from '@/includes/utils'
export default {
  name: 'CarRentalFilterForm',
  components: {
    HistoryCarRentalFilter,
    ButtonSmall,
    InputCheckbox
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
        vendor: [],
        equipment: [],
        category: []
      },
      showLimit: 3,
      showMore: {
        vendor: false,
        equipment: false,
        category: false
      },
      price_slot_0_50: false,
      price_slot_50_100: false,
      price_slot_100_150: false,
      price_slot_150_200: false,
      price_slot_200: false,
      baggage_1: false,
      baggage_2: false,
      baggage_3: false,
      baggage_4: false,
      departureDates: {
        minDate: new Date().setHours(0, 0, 0, 0),
        maxDate: new Date().setHours(23, 59, 0, 0)
      },
      returnDates: {
        minDate: new Date().setHours(2, 30, 0, 0),
        maxDate: new Date().setHours(21, 0, 0, 0)
      }
    }
  },
  computed: {
    ...mapGetters('carRental', ['getFilterHistory']),
    ...mapGetters('general', ['getCurrency']),
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
    ...mapMutations('carRental', ['pushFilterHistory']),
    filterResults(getResultsToo = false) {
      const trueFilters = {}
      let historyFilters = {}

      const priceFilter = []
      const tmpHistoryFilter = []
      if (this.price_slot_0_50 === true) {
        priceFilter.push('0-50')
        tmpHistoryFilter.push({
          range: '0-50',
          label: this.init.price_range[0].label
        })
      }
      if (this.price_slot_50_100 === true) {
        priceFilter.push('50-100')
        tmpHistoryFilter.push({
          range: '50-100',
          label: this.init.price_range[1].label
        })
      }
      if (this.price_slot_100_150 === true) {
        priceFilter.push('100-150')
        tmpHistoryFilter.push({
          range: '100-150',
          label: this.init.price_range[2].label
        })
      }
      if (this.price_slot_150_200 === true) {
        priceFilter.push('150-200')
        tmpHistoryFilter.push({
          range: '150-200',
          label: this.init.price_range[3].label
        })
      }
      if (this.price_slot_200 === true) {
        priceFilter.push('200+')
        tmpHistoryFilter.push({
          range: '200+',
          label: this.init.price_range[4].label
        })
      }
      if (priceFilter.length > 0) {
        trueFilters.price_range = priceFilter
      }
      if (this.baggage_4 === true) {
        trueFilters.baggage = '4+'
      } else if (this.baggage_3 === true) {
        trueFilters.baggage = '3'
      } else if (this.baggage_2 === true) {
        trueFilters.baggage = '2'
      } else if (this.baggage_1 === true) {
        trueFilters.baggage = '1'
      }
      this.dynamicFilters.vendor.forEach((item) => {
        if (item.model) {
          if (trueFilters.vendor === undefined) {
            trueFilters.vendor = []
          }
          trueFilters.vendor.push(item.name)
        }
      })
      this.dynamicFilters.category.forEach((item) => {
        if (item.model) {
          if (trueFilters.category === undefined) {
            trueFilters.category = []
          }
          trueFilters.category.push(item.name)
        }
      })
      historyFilters = JSON.parse(JSON.stringify(trueFilters))
      this.dynamicFilters.equipment.forEach((item) => {
        if (item.model) {
          if (trueFilters.equipment === undefined) {
            trueFilters.equipment = []
            historyFilters = JSON.parse(JSON.stringify(trueFilters))
          }
          trueFilters.equipment.push(item.name)
          historyFilters.equipment.push({
            name: item.name,
            label: item.label
          })
        }
      })
      if (getResultsToo) {
        if (Object.entries(historyFilters).length > 0) {
          if (tmpHistoryFilter.length > 0) {
            historyFilters.price_range = tmpHistoryFilter
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
    processInit(init) {
      if (init === false) {
        return
      }
      if (init.vendor !== null && init.vendor.length > 0) {
        if (this.dynamicFilters.vendor.length === 0) {
          this.init.vendor.forEach((item) => {
            this.dynamicFilters.vendor.push({
              label: item.label,
              name: item.name,
              count: item.count,
              model: false
            })
          })
        } else {
          this.init.vendor.forEach((item) => {
            this.dynamicFilters.vendor = updateArrayOfObjects(
              this.dynamicFilters.vendor,
              'name',
              item.name,
              'count',
              item.count
            )
          })
        }
      }
      if (init.equipment !== null && init.equipment.length > 0) {
        if (this.dynamicFilters.equipment.length === 0) {
          this.init.equipment.forEach((item) => {
            this.dynamicFilters.equipment.push({
              label: item.label,
              name: item.name,
              count: item.count,
              model: false
            })
          })
        } else {
          this.init.equipment.forEach((item) => {
            this.dynamicFilters.equipment = updateArrayOfObjects(
              this.dynamicFilters.equipment,
              'name',
              item.name,
              'count',
              item.count
            )
          })
        }
      }
      if (init.category !== null && init.category.length > 0) {
        if (this.dynamicFilters.category.length === 0) {
          for (let i = 0; i < init.category.length; i++) {
            this.dynamicFilters.category[i] = {
              label: init.category[i].label,
              name: init.category[i].name,
              count: init.category[i].count,
              model: false
            }
          }
        } else {
          this.init.category.forEach((item) => {
            this.dynamicFilters.category = updateArrayOfObjects(
              this.dynamicFilters.category,
              'name',
              item.name,
              'count',
              item.count
            )
          })
        }
      }
    },
    fillHistory(history) {
      this.resetFilters()
      if (history.category !== undefined && history.category.length > 0) {
        for (let i = 0; i < history.category.length; i++) {
          for (let j = 0; j < this.dynamicFilters.category.length; j++) {
            if (history.category[i] === this.dynamicFilters.category[j].name) {
              this.dynamicFilters.category[j].model = true
            }
          }
        }
      }
      if (history.price_range !== undefined && history.price_range.length > 0) {
        history.price_range.forEach((price) => {
          if (price.range !== undefined) {
            if (price.range === '0-50') {
              this.price_slot_0_50 = true
            }
            if (price.range === '50-100') {
              this.price_slot_50_100 = true
            }
            if (price.range === '100-150') {
              this.price_slot_100_150 = true
            }
            if (price.range === '150-200') {
              this.price_slot_150_200 = true
            }
            if (price.range === '200+') {
              this.price_slot_200 = true
            }
          }
        })
      }
      if (history.baggage !== undefined) {
        if (history.baggage === '4+') {
          this.baggage_4 = true
        } else if (history.baggage === '3') {
          this.baggage_3 = true
        } else if (history.baggage === '2') {
          this.baggage_2 = true
        } else if (history.baggage === '1') {
          this.baggage_1 = true
        }
      }
      if (history.equipment !== undefined && history.equipment.length > 0) {
        for (let i = 0; i < history.equipment.length; i++) {
          for (let j = 0; j < this.dynamicFilters.equipment.length; j++) {
            if (
              history.equipment[i].name ===
              this.dynamicFilters.equipment[j].name
            ) {
              this.dynamicFilters.equipment[j].model = true
            }
          }
        }
      }
      if (history.vendor !== undefined && history.vendor.length > 0) {
        for (let i = 0; i < history.vendor.length; i++) {
          for (let j = 0; j < this.dynamicFilters.vendor.length; j++) {
            if (history.vendor[i] === this.dynamicFilters.vendor[j].name) {
              this.dynamicFilters.vendor[j].model = true
            }
          }
        }
      }
      this.filterResults()
    },
    resetFilters() {
      this.price_slot_0_50 = false
      this.price_slot_50_100 = false
      this.price_slot_100_150 = false
      this.price_slot_150_200 = false
      this.price_slot_200 = false
      this.baggage_1 = false
      this.baggage_2 = false
      this.baggage_3 = false
      this.baggage_4 = false
      if (this.dynamicFilters.category.length > 0) {
        for (let i = 0; i < this.dynamicFilters.category.length; i++) {
          this.dynamicFilters.category[i].model = false
        }
      }
      if (this.dynamicFilters.vendor.length > 0) {
        for (let i = 0; i < this.dynamicFilters.vendor.length; i++) {
          this.dynamicFilters.vendor[i].model = false
        }
      }
      if (this.dynamicFilters.equipment.length > 0) {
        for (let i = 0; i < this.dynamicFilters.equipment.length; i++) {
          this.dynamicFilters.equipment[i].model = false
        }
      }
    },
    removeFilters() {
      this.resetFilters()
      this.$emit('filter', {
        filters: {}
      })
    },
    getPriceLabel(index) {
      if (
        this.init.price_range !== undefined &&
        this.init.price_range[index] !== undefined
      ) {
        let label = this.init.price_range[index].label[this.currency].split('-')

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
      }
      return ''
    }
  }
}
</script>
