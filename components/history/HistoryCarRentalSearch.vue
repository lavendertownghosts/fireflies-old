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
      class="leading-14 mb-6 font-bold flex flex-row"
    >
      <div :title="history.from.text" class="truncate min-w-30 cursor-help">
        {{ getFromName }}
      </div>
      <div v-if="getToName !== ''" class="flex flex-row">
        <div class="mx-4">
          <i class="fas w-14 fa-exchange"></i>
        </div>
        <div :title="history.to.text" class="truncate min-w-30 cursor-help">
          {{ getToName }}
        </div>
      </div>
    </div>
    <div class="text-grey-dark leading-20">
      <p>
        {{ history.dates.date1 | formatDateDisplay }} ({{ getTime1 }}) -
        {{ history.dates.date2 | formatDateDisplay }} ({{ getTime2 }})
      </p>
      <p>
        {{ getGuestText }}
      </p>
    </div>
  </button>
</template>

<script>
import { convertMinutesToHoursMinutes, getGuestText } from '~/includes/utils'
export default {
  name: 'HistoryCarRentalSearch',
  props: {
    history: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false,
      active: false,
      fromAltText: '',
      toAltText: ''
    }
  },
  computed: {
    getFromName() {
      const destination = this.history.from.text.match(/\((.*)\)/)
      return destination ? destination[1] : this.history.from.text
    },
    getToName() {
      const destination = this.history.to.text.match(/\((.*)\)/)
      return destination ? destination[1] : this.history.to.text
    },
    getTime1() {
      return convertMinutesToHoursMinutes(this.history.dates.time1 * 15)
    },
    getTime2() {
      return convertMinutesToHoursMinutes(this.history.dates.time2 * 15)
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
      this.$eventBus.publish('carRentalHistoryFill', this.history)
    }
  }
}
</script>
<style scoped>
.min-w-30 {
  min-width: 30px;
}
</style>
