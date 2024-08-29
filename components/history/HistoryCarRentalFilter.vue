<template>
  <button
    class="w-full text-left text-grey-dark bg-white border border-primary rounded mb-12 p-12 text-sm cursor-pointer hover:text-primary-dark active:border-primary-light active:bg-white active:text-primary-light focus:outline-none focus:border-black focus:bg-white focus:text-black"
    :class="{
      'bg-primary-opaque border-primary-dark': hover
    }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @mousedown="active = true"
    @blur="active = false"
    @click="$emit('click')"
  >
    <div
      :class="{
        underline: hover || active
      }"
      class="leading-14"
    >
      {{ getContent }}
    </div>
  </button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HistoryCarRentalFilter',
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
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    getContent() {
      const content = []
      if (
        this.history.category !== undefined &&
        this.history.category.length > 0
      ) {
        this.history.category.forEach((category) => {
          content.push(category)
        })
      }
      if (
        this.history.price_range !== undefined &&
        this.history.price_range.length > 0
      ) {
        this.history.price_range.forEach((price) => {
          if (
            price.label !== undefined &&
            price.label[this.currency] !== undefined
          ) {
            content.push(
              this.currency +
                ' ' +
                price.label[this.currency].replace(
                  ' - ',
                  ' - ' + this.currency + ' '
                )
            )
          }
        })
      }
      if (this.history.baggage !== undefined) {
        content.push(this.history.baggage + ' ' + this.$t('carrent.Baggage'))
      }
      if (
        this.history.equipment !== undefined &&
        this.history.equipment.length > 0
      ) {
        this.history.equipment.forEach((equipment) => {
          content.push(equipment.label)
        })
      }
      if (this.history.vendor !== undefined && this.history.vendor.length > 0) {
        this.history.vendor.forEach((vendor) => {
          content.push(vendor)
        })
      }
      return content.join(', ')
    }
  }
}
</script>

<style scoped></style>
