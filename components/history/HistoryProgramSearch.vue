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
      <span class="font-bold">{{ nameSlices[1] }}, </span> {{ nameSlices[0] }}
    </div>
    <div class="text-grey-dark leading-20">
      <p>
        {{ history.dates.date1 | formatDateDisplay }} -
        {{ history.dates.date2 | formatDateDisplay }}
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
  name: 'HistoryProgramSearch',
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
      return getGuestText(
        parseInt(this.history.guests.adults),
        parseInt(this.history.guests.children)
      )
    }
  },
  methods: {
    fillHistory() {
      this.$eventBus.publish('programHistoryFill', this.history)
    }
  }
}
</script>
