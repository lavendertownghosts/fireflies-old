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
      class="leading-14 mb-6"
    >
      <span class="font-bold">{{ nameSlices[0] }},</span> {{ nameSlices[1]
      }}{{ nameSlices[2] ? ', ' + nameSlices[2] : '' }}
    </div>
    <div class="text-grey-dark leading-20">
      <p>
        {{ history.dates.date1 | formatDateDisplay }} -
        {{ history.dates.date2 | formatDateDisplay }}
        <span class="md:block lg:inline"
          >{{ calcNights(history.dates.date1, history.dates.date2) }}
          {{ $t('general.Nights') }}</span
        >
      </p>
      <p>
        {{ getGuestText }}
      </p>
    </div>
  </button>
</template>

<script>
import { calcNights, getGuestText, isArray } from '@/includes/utils'

export default {
  name: 'HistoryHotelSearch',
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
    nameSlices() {
      return this.history.nameSearch.text.split(',').reverse()
    },
    getGuestText() {
      if (isArray(this.history.guests)) {
        return getGuestText(
          this.history.guests.reduce((sum, { adults }) => sum + adults, 0),
          this.history.guests.reduce((sum, { children }) => sum + children, 0)
        )
      } else {
        return getGuestText(
          this.history.guests.adults,
          this.history.guests.children
        )
      }
    }
  },
  methods: {
    calcNights,
    fillHistory() {
      this.$eventBus.publish('hotelHistoryFill', this.history)
    }
  }
}
</script>
