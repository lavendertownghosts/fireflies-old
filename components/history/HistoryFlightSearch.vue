<template>
  <button
    class="w-full text-left text-primary bg-white border border-primary rounded mb-16 px-11 py-8 text-sm cursor-pointer hover:text-primary-dark active:border-primary-light active:bg-white active:text-primary-light focus:outline-none focus:border-black focus:bg-white focus:text-black"
    :class="{
      'bg-primary-opaque border-primary-dark': hover
    }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousedown="active = true"
    @blur="active = false"
    @click="fillHistory()"
  >
    <div
      :class="{
        underline: hover || active
      }"
      class="leading-14 mb-6 font-bold"
    >
      <span :title="history.from.text">{{ getFromName }}</span>
      <i
        class="fas"
        :class="
          history.tripType === '1' ? 'fa-exchange' : 'fa-long-arrow-right'
        "
      ></i>
      <span :title="history.to.text">{{ getToName }}</span>
    </div>
    <div class="text-grey-dark leading-20">
      <p>
        {{ getDateFrom | formatDateDisplay }}
        <i
          v-show="history.tripType === '1'"
          class="text-xs fas fa-exchange"
        ></i>
        <span v-if="history.tripType === '1'">{{
          history.dates.date2 | formatDateDisplay
        }}</span>
      </p>
      <p>
        {{ getGuestText }}
      </p>
    </div>
  </button>
</template>

<script>
import { getGuestText } from '@/includes/utils'

export default {
  name: 'HistoryFlightSearch',
  props: {
    history: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false,
      active: false
    }
  },
  computed: {
    getFromName() {
      return this.history.from.text.match(/\((.*)\)/)[1]
    },
    getToName() {
      return this.history.to.text.match(/\((.*)\)/)[1]
    },
    getDateFrom() {
      return this.history.tripType === '1'
        ? this.history.dates.date1
        : this.history.dates
    },
    getGuestText() {
      return getGuestText(
        parseInt(this.history.guests.adults),
        parseInt(this.history.guests.children)
      )
    }
  },
  methods: {
    fillHistory() {
      this.$eventBus.publish('flightHistoryFill', this.history)
    }
  }
}
</script>
