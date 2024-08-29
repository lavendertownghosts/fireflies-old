<template>
  <div class="flex flex-col text-black">
    <div
      v-if="getReverseFilterHistory && getReverseFilterHistory.length > 0"
      class="mb-12"
    >
      <h3 class="text-sm leading-14 font-bold mb-12">
        {{ $t('general.PreviousFilters') }}
      </h3>
      <div v-for="(history, index) in getReverseFilterHistory" :key="index">
        <HistoryFlightFilter :history="history" @click="fillHistory(history)" />
      </div>
    </div>
    <h3 class="text-sm leading-14 font-bold mb-8">
      {{ $t('flight.Class') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="economy"
        :is-disabled="!getCountByFilterAndType('class', 'economy')"
        @input="filterResults()"
      >
        {{ $t('flight.Tourist') }}
      </InputCheckbox>
      <p
        :class="!getCountByFilterAndType('class', 'economy') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountByFilterAndType('class', 'economy') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="business"
        :is-disabled="!getCountByFilterAndType('class', 'business')"
        @input="filterResults()"
      >
        {{ $t('flight.Business') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('class', 'business') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('class', 'business') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="firstClass"
        :is-disabled="!getCountByFilterAndType('class', 'first')"
        @input="filterResults()"
      >
        {{ $t('flight.First') }}
      </InputCheckbox>
      <p
        :class="!getCountByFilterAndType('class', 'first') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountByFilterAndType('class', 'first') }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-8">
      {{ $t('flight.Transfer') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="transfer_0"
        :is-disabled="!getCountByFilterAndType('transfer', 0)"
        @input="filterResults()"
      >
        {{ $t('flight.OnlyDirect') }}
      </InputCheckbox>
      <p
        :class="!getCountByFilterAndType('transfer', 0) ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountByFilterAndType('transfer', 0) }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="transfer_1"
        :is-disabled="!getCountByFilterAndType('transfer', 1)"
        @input="filterResults()"
      >
        {{ $t('flight.Transfer1') }}
      </InputCheckbox>
      <p
        :class="!getCountByFilterAndType('transfer', 1) ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountByFilterAndType('transfer', 1) }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="transfer_2"
        :is-disabled="!getCountByFilterAndType('transfer', '1+')"
        @input="filterResults()"
      >
        {{ $t('flight.TransferMore') }}
      </InputCheckbox>
      <p
        :class="!getCountByFilterAndType('transfer', '1+') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountByFilterAndType('transfer', '1+') }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-14">
      {{ $t('flight.DepartureTimes') }}
    </h3>
    <div class="flex flex-row justify-between items-end leading-14">
      <p class="text-sm">{{ $t('flight.Departure') }}</p>
      <p class="text-sm">{{ getCountOutboundTime }}</p>
    </div>
    <RangeSlider
      ref="departureDatesRangeSlider"
      :dates="departureDates"
      @setDates="departureDates = arguments[0]"
      @dragEnd="filterResults()"
    />
    <div v-show="tripType === '1'">
      <div class="flex flex-row justify-between items-end leading-14">
        <p class="text-sm">{{ $t('flight.Arrival') }}</p>
        <p class="text-sm">{{ getCountReturnTime }}</p>
      </div>
      <RangeSlider
        ref="returnDatesRangeSlider"
        class="mb-8"
        :dates="returnDates"
        @setDates="returnDates = arguments[0]"
        @dragEnd="filterResults()"
      />
    </div>
    <h3 class="text-sm leading-14 font-bold mt-8 mb-8">
      {{ $t('flight.PriceRange') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_0_150"
        :is-disabled="!getCountByFilterAndType('price_range', '0-150')"
        @input="filterResults()"
      >
        {{ getPriceLabel('0-150') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('price_range', '0-150') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('price_range', '0-150') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_150_300"
        :is-disabled="!getCountByFilterAndType('price_range', '150-300')"
        @input="filterResults()"
      >
        {{ getPriceLabel('150-300') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('price_range', '150-300') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('price_range', '150-300') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_300_450"
        :is-disabled="!getCountByFilterAndType('price_range', '300-450')"
        @input="filterResults()"
      >
        {{ getPriceLabel('300-450') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('price_range', '300-450') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('price_range', '300-450') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_450_600"
        :is-disabled="!getCountByFilterAndType('price_range', '450-600')"
        @input="filterResults()"
      >
        {{ getPriceLabel('450-600') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('price_range', '450-600') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('price_range', '450-600') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="price_slot_600"
        :is-disabled="!getCountByFilterAndType('price_range', '600+')"
        @input="filterResults()"
      >
        {{ getPriceLabel('600+') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('price_range', '600+') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('price_range', '600+') }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-8">
      {{ $t('flight.DurationOfTravel') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="time_slot_0_2"
        :is-disabled="!getCountByFilterAndType('flighttime', '0-2')"
        @input="filterResults()"
      >
        {{ $t('flight.Hours02') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('flighttime', '0-2') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('flighttime', '0-2') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="time_slot_2_4"
        :is-disabled="!getCountByFilterAndType('flighttime', '2-4')"
        @input="filterResults()"
      >
        {{ $t('flight.Hours24') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('flighttime', '2-4') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('flighttime', '2-4') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="time_slot_4_6"
        :is-disabled="!getCountByFilterAndType('flighttime', '4-6')"
        @input="filterResults()"
      >
        {{ $t('flight.Hours46') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('flighttime', '4-6') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('flighttime', '4-6') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="time_slot_6_8"
        :is-disabled="!getCountByFilterAndType('flighttime', '6-8')"
        @input="filterResults()"
      >
        {{ $t('flight.Hours68') }}
      </InputCheckbox>
      <p
        :class="
          !getCountByFilterAndType('flighttime', '6-8') ? 'text-grey' : ''
        "
        class="text-sm"
      >
        {{ getCountByFilterAndType('flighttime', '6-8') }}
      </p>
    </div>
    <div class="flex flex-row justify-between items-end mb-8">
      <InputCheckbox
        v-model="time_slot_8"
        :is-disabled="!getCountByFilterAndType('flighttime', '8+')"
        @input="filterResults()"
      >
        {{ $t('flight.Hours8') }}
      </InputCheckbox>
      <p
        :class="!getCountByFilterAndType('flighttime', '8+') ? 'text-grey' : ''"
        class="text-sm"
      >
        {{ getCountByFilterAndType('flighttime', '8+') }}
      </p>
    </div>
    <h3 class="text-sm leading-14 font-bold mt-12 mb-8">
      {{ $t('flight.Airlines') }}
    </h3>
    <div
      v-for="(value, key) in limitBy(
        dynamicFilters.airlines,
        showMore === true ? 999 : showLimit
      )"
      :key="'airlines' + key"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox
        v-model="value.model"
        :is-disabled="!value.count"
        @input="filterResults()"
      >
        <p class="truncate">
          {{ value.name | capitalize }}
        </p>
      </InputCheckbox>
      <p :class="!value.count ? 'text-grey' : ''" class="text-sm">
        {{ value.count }}
      </p>
    </div>
    <p
      v-show="showMore === false && showLimit < dynamicFilters.airlines.length"
      class="link text-sm cursor-pointer"
      @click="showMore = true"
    >
      {{ $t('flight.MoreAirlines') }}
    </p>
    <p
      v-show="showMore === true && showLimit < dynamicFilters.airlines.length"
      class="link text-sm cursor-pointer"
      @click="showMore = false"
    >
      {{ $t('flight.Less') }}
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
import { format } from 'date-fns'
import { mapGetters, mapMutations } from 'vuex'
import { limitBy, updateArrayOfObjects } from '@/includes/utils'

import HistoryFlightFilter from '@/components/history/HistoryFlightFilter'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputCheckbox from '@/components/micro/InputCheckbox'
import RangeSlider from '@/components/micro/RangeSlider'
export default {
  name: 'FlightFilterForm',
  components: {
    RangeSlider,
    HistoryFlightFilter,
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
    },
    tripType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dynamicFilters: {
        airlines: []
      },
      showLimit: 3,
      showMore: false,
      transfer_0: false,
      transfer_1: false,
      transfer_2: false,
      economy: false,
      business: false,
      firstClass: false,
      price_slot_0_150: false,
      price_slot_150_300: false,
      price_slot_300_450: false,
      price_slot_450_600: false,
      price_slot_600: false,
      time_slot_0_2: false,
      time_slot_2_4: false,
      time_slot_4_6: false,
      time_slot_6_8: false,
      time_slot_8: false,
      departureDates: {
        minDate: new Date().setHours(0, 0, 0, 0),
        maxDate: new Date().setHours(23, 59, 0, 0)
      },
      returnDates: {
        minDate: new Date().setHours(0, 0, 0, 0),
        maxDate: new Date().setHours(23, 59, 0, 0)
      }
    }
  },
  computed: {
    ...mapGetters('flight', ['getFilterHistory']),
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
    },
    getCountOutboundTime() {
      if (
        this.init.filters !== undefined &&
        this.init.filters.departuretime !== undefined
      ) {
        const value = Object.entries(this.init.filters.departuretime.firstleg)
        return value[0][1] !== undefined ? value[0][1].count : ''
      }
      return ''
    },
    getCountReturnTime() {
      if (
        this.init.filters !== undefined &&
        this.init.filters.departuretime !== undefined
      ) {
        const value = Object.entries(this.init.filters.departuretime.returleg)
        return value[0][1] !== undefined ? value[0][1].count : ''
      }
      return ''
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
    ...mapMutations('flight', ['pushFilterHistory']),
    filterResults(getResultsToo = false) {
      const trueFilters = {}
      let tmpFilter = []
      const tmpHistoryFilter = []
      if (this.price_slot_0_150 === true) {
        tmpFilter.push('0-150')
        tmpHistoryFilter.push({
          range: '0-150',
          label: this.init.filters.price_range['0-150'].label
        })
      }
      if (this.price_slot_150_300 === true) {
        tmpFilter.push('150-300')
        tmpHistoryFilter.push({
          range: '150-300',
          label: this.init.filters.price_range['150-300'].label
        })
      }
      if (this.price_slot_300_450 === true) {
        tmpFilter.push('300-450')
        tmpHistoryFilter.push({
          range: '300-450',
          label: this.init.filters.price_range['300-450'].label
        })
      }
      if (this.price_slot_450_600 === true) {
        tmpFilter.push('450-600')
        tmpHistoryFilter.push({
          range: '450-600',
          label: this.init.filters.price_range['450-600'].label
        })
      }
      if (this.price_slot_600 === true) {
        tmpFilter.push('600+')
        tmpHistoryFilter.push({
          range: '600+',
          label: this.init.filters.price_range['600+'].label
        })
      }
      if (tmpFilter.length > 0) {
        trueFilters.price_range = tmpFilter
      }
      tmpFilter = []
      if (this.economy === true) {
        tmpFilter.push('economy')
      }
      if (this.business === true) {
        tmpFilter.push('business')
      }
      if (this.firstClass === true) {
        tmpFilter.push('first')
      }
      if (tmpFilter.length > 0) {
        trueFilters.class = tmpFilter
      }
      tmpFilter = []
      if (this.time_slot_0_2 === true) {
        tmpFilter.push('0-2')
      }
      if (this.time_slot_2_4 === true) {
        tmpFilter.push('2-4')
      }
      if (this.time_slot_4_6 === true) {
        tmpFilter.push('4-6')
      }
      if (this.time_slot_6_8 === true) {
        tmpFilter.push('6-8')
      }
      if (this.time_slot_8 === true) {
        tmpFilter.push('8+')
      }
      if (tmpFilter.length > 0) {
        trueFilters.flighttime = tmpFilter
      }
      tmpFilter = []
      if (this.transfer_0 === true) {
        tmpFilter.push('0')
      }
      if (this.transfer_1 === true) {
        tmpFilter.push('1')
      }
      if (this.transfer_2 === true) {
        tmpFilter.push('1+')
      }
      if (tmpFilter.length > 0) {
        trueFilters.transfer = tmpFilter
      }
      tmpFilter = []
      this.dynamicFilters.airlines.forEach((item) => {
        if (item.model) {
          tmpFilter.push(item.name)
        }
      })
      if (tmpFilter.length > 0) {
        trueFilters.airlines = tmpFilter
      }
      const departuretime = {}
      if (
        format(parseInt(this.departureDates.minDate), 'HH:mm') !== '00:00' ||
        format(parseInt(this.departureDates.maxDate), 'HH:mm') !== '23:59'
      ) {
        departuretime.firstleg = [
          format(parseInt(this.departureDates.minDate), 'HH:mm'),
          format(parseInt(this.departureDates.maxDate), 'HH:mm')
        ]
      }
      if (
        format(parseInt(this.returnDates.minDate), 'HH:mm') !== '00:00' ||
        format(parseInt(this.returnDates.maxDate), 'HH:mm') !== '23:59'
      ) {
        departuretime.returleg = [
          format(parseInt(this.returnDates.minDate), 'HH:mm'),
          format(parseInt(this.returnDates.maxDate), 'HH:mm')
        ]
      }
      if (Object.keys(departuretime).length !== 0) {
        trueFilters.departuretime = departuretime
      }
      const payload = {}
      if (Object.keys(trueFilters).length !== 0) {
        payload.filters = trueFilters
      }
      if (getResultsToo) {
        if (Object.entries(trueFilters).length > 0) {
          const historyFilter = JSON.parse(JSON.stringify(trueFilters))
          if (tmpHistoryFilter.length > 0) {
            historyFilter.price_range = tmpHistoryFilter
          }
          this.pushFilterHistory(historyFilter)
        }
        this.$emit('filter', payload)
      } else {
        this.$emit('updateFilters', payload)
      }
    },
    limitBy(obj, n) {
      return limitBy(obj, n)
    },
    processInit(init) {
      if (init.filters !== undefined) {
        if (init.filters.airlines !== null) {
          if (this.dynamicFilters.airlines.length === 0) {
            for (const [key, value] of Object.entries(init.filters.airlines)) {
              this.dynamicFilters.airlines.push({
                label: value.label,
                name: key,
                count: parseInt(value.count),
                model: false
              })
            }
          } else {
            for (const [key, value] of Object.entries(
              this.init.filters.airlines
            )) {
              this.dynamicFilters.airlines = updateArrayOfObjects(
                this.dynamicFilters.airlines,
                'name',
                key,
                'count',
                parseInt(value.count)
              )
            }
          }
        }
        if (init.filters.departuretime !== undefined) {
          if (init.filters.departuretime.firstleg !== undefined) {
            const wayTime = Object.keys(
              init.filters.departuretime.firstleg
            )[0].split('-')
            this.departureDates = {
              minDate: new Date().setHours(
                parseInt(wayTime[0].substr(0, 2)),
                parseInt(wayTime[0].substr(3, 2)),
                0,
                0
              ),
              maxDate: new Date().setHours(
                parseInt(wayTime[1].substr(0, 2)),
                parseInt(wayTime[1].substr(3, 2)),
                0,
                0
              )
            }
            this.$refs.departureDatesRangeSlider.calculateSize()
          }
          if (init.filters.departuretime.returleg !== undefined) {
            const wayTime = Object.keys(
              init.filters.departuretime.returleg
            )[0].split('-')
            this.returnDates = {
              minDate: new Date().setHours(
                parseInt(wayTime[0].substr(0, 2)),
                parseInt(wayTime[0].substr(3, 2)),
                0,
                0
              ),
              maxDate: new Date().setHours(
                parseInt(wayTime[1].substr(0, 2)),
                parseInt(wayTime[1].substr(3, 2)),
                0,
                0
              )
            }
            this.$refs.returnDatesRangeSlider.calculateSize()
          }
        }
      }
    },
    fillHistory(history) {
      this.resetFilters()
      if (history.price_range !== undefined && history.price_range.length > 0) {
        history.price_range.forEach((price) => {
          if (price.range !== undefined) {
            if (
              price.range === '0-150' &&
              this.getCountByFilterAndType('price_range', '0-150')
            ) {
              this.price_slot_0_150 = true
            } else if (
              price.range === '150-300' &&
              this.getCountByFilterAndType('price_range', '150-300')
            ) {
              this.price_slot_150_300 = true
            } else if (
              price.range === '300-450' &&
              this.getCountByFilterAndType('price_range', '300-450')
            ) {
              this.price_slot_300_450 = true
            } else if (
              price.range === '450-600' &&
              this.getCountByFilterAndType('price_range', '450-600')
            ) {
              this.price_slot_450_600 = true
            } else if (
              price.range === '600+' &&
              this.getCountByFilterAndType('price_range', '600+')
            ) {
              this.price_slot_600 = true
            }
          }
        })
      }
      if (history.class !== undefined && history.class.length > 0) {
        history.class.forEach((flightClass) => {
          if (
            flightClass === 'economy' &&
            this.getCountByFilterAndType('class', 'economy')
          ) {
            this.economy = true
          } else if (
            flightClass === 'business' &&
            this.getCountByFilterAndType('class', 'business')
          ) {
            this.business = true
          } else if (
            flightClass === 'first' &&
            this.getCountByFilterAndType('class', 'first')
          ) {
            this.firstClass = true
          }
        })
      }
      if (history.transfer !== undefined && history.transfer.length > 0) {
        history.transfer.forEach((transfer) => {
          if (transfer === '0' && this.getCountByFilterAndType('transfer', 0)) {
            this.transfer_0 = true
          } else if (
            transfer === '1' &&
            this.getCountByFilterAndType('transfer', 1)
          ) {
            this.transfer_1 = true
          } else if (
            transfer === '1+' &&
            this.getCountByFilterAndType('transfer', '1+')
          ) {
            this.transfer_2 = true
          }
        })
      }
      if (history.flighttime !== undefined && history.flighttime.length > 0) {
        history.flighttime.forEach((flighttime) => {
          if (
            flighttime === '0-2' &&
            this.getCountByFilterAndType('flighttime', '0-2')
          ) {
            this.time_slot_0_2 = true
          } else if (
            flighttime === '2-4' &&
            this.getCountByFilterAndType('flighttime', '2-4')
          ) {
            this.time_slot_2_4 = true
          } else if (
            flighttime === '4-6' &&
            this.getCountByFilterAndType('flighttime', '4-6')
          ) {
            this.time_slot_4_6 = true
          } else if (
            flighttime === '6-8' &&
            this.getCountByFilterAndType('flighttime', '6-8')
          ) {
            this.time_slot_6_8 = true
          } else if (
            flighttime === '8+' &&
            this.getCountByFilterAndType('flighttime', '8+')
          ) {
            this.time_slot_8 = true
          }
        })
      }
      if (history.airlines !== undefined && history.airlines.length > 0) {
        for (let i = 0; i < history.airlines.length; i++) {
          for (let j = 0; j < this.dynamicFilters.airlines.length; j++) {
            if (
              history.airlines[i] === this.dynamicFilters.airlines[j].name &&
              this.dynamicFilters.airlines[j].count
            ) {
              this.dynamicFilters.airlines[j].model = true
            }
          }
        }
      }
      if (history.departuretime !== undefined) {
        if (history.departuretime.firstleg !== undefined) {
          this.departureDates = {
            minDate: new Date().setHours(
              parseInt(history.departuretime.firstleg[0].substr(0, 2)),
              parseInt(history.departuretime.firstleg[0].substr(3, 2)),
              0,
              0
            ),
            maxDate: new Date().setHours(
              parseInt(history.departuretime.firstleg[1].substr(0, 2)),
              parseInt(history.departuretime.firstleg[1].substr(3, 2)),
              0,
              0
            )
          }
        }
        if (history.departuretime.returleg !== undefined) {
          this.returnDates = {
            minDate: new Date().setHours(
              parseInt(history.departuretime.returleg[0].substr(0, 2)),
              parseInt(history.departuretime.returleg[0].substr(3, 2)),
              0,
              0
            ),
            maxDate: new Date().setHours(
              parseInt(history.departuretime.returleg[1].substr(0, 2)),
              parseInt(history.departuretime.returleg[1].substr(3, 2)),
              0,
              0
            )
          }
        }
      }
      this.filterResults()
    },
    resetFilters() {
      this.economy = false
      this.business = false
      this.firstClass = false
      this.transfer_0 = false
      this.transfer_1 = false
      this.transfer_2 = false
      this.price_slot_0_150 = false
      this.price_slot_150_300 = false
      this.price_slot_300_450 = false
      this.price_slot_450_600 = false
      this.price_slot_600 = false
      this.time_slot_0_2 = false
      this.price_slot_0_150 = false
      this.time_slot_2_4 = false
      this.time_slot_4_6 = false
      this.time_slot_6_8 = false
      this.time_slot_8 = false
      this.departureDates = {
        minDate: new Date().setHours(0, 0, 0, 0),
        maxDate: new Date().setHours(23, 59, 0, 0)
      }
      this.returnDates = {
        minDate: new Date().setHours(0, 0, 0, 0),
        maxDate: new Date().setHours(23, 59, 0, 0)
      }
      if (this.dynamicFilters.airlines.length > 0) {
        for (let i = 0; i < this.dynamicFilters.airlines.length; i++) {
          this.dynamicFilters.airlines[i].model = false
        }
      }
    },
    removeFilters() {
      this.resetFilters()
      this.$emit('filter', {})
    },
    getCountByFilterAndType(filter, type) {
      if (
        this.init &&
        this.init.filters !== undefined &&
        this.init.filters[filter] !== undefined
      ) {
        return parseInt(this.init.filters[filter][type].count)
      }
      return 0
    },
    getPriceLabel(type) {
      if (
        this.init &&
        this.init.filters !== undefined &&
        this.init.filters.price_range !== undefined
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
      }
      return 0
    }
  }
}
</script>
