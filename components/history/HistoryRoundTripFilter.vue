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
import { getLanguageName } from '@/includes/utils'

export default {
  name: 'HistoryRoundTripFilter',
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
      if (this.history.dates !== undefined) {
        content.push(
          this.history.dates.date1 +
            (this.history.dates.date2 !== ''
              ? ' - ' + this.history.dates.date2
              : '')
        )
      }

      if (
        this.history.trip_length !== undefined &&
        this.history.trip_length.length > 0
      ) {
        this.history.trip_length.forEach((tripLength) => {
          if (tripLength === '0-6') {
            content.push(this.$t('roundtrip.UpTo1Week'))
          } else if (tripLength === '7-14') {
            content.push(this.$t('roundtrip.Weeks_1_2'))
          } else if (tripLength === '14+') {
            content.push(this.$t('roundtrip.Weeks2'))
          }
        })
      }

      if (this.history.guests !== undefined) {
        content.push(
          this.history.guests.adults +
            ' ' +
            (this.history.guests.adults > 1
              ? this.$t('general.Adults')
              : this.$t('general.Adult')) +
            (this.history.guests.children !== 0
              ? ', ' +
                this.history.guests.children +
                ' ' +
                (this.history.guests.children > 1
                  ? this.$t('general.Children')
                  : this.$t('general.Child'))
              : '')
        )
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

      if (
        this.history.custom_price_range !== undefined &&
        this.history.custom_price_range.length > 0 &&
        this.history.currency !== undefined
      ) {
        content.push(
          this.history.currency +
            ' ' +
            this.history.custom_price_range[0] +
            (this.history.custom_price_range[1] !== undefined
              ? ' - ' +
                this.history.currency +
                ' ' +
                this.history.custom_price_range[1]
              : '')
        )
      }

      if (
        this.history.country !== undefined &&
        this.history.country.length > 0
      ) {
        this.history.country.forEach((country) => {
          content.push(country)
        })
      }
      if (this.history.city !== undefined && this.history.city.length > 0) {
        this.history.city.forEach((city) => {
          content.push(city)
        })
      }

      if (
        this.history.difficulty !== undefined &&
        this.history.difficulty.length > 0
      ) {
        this.history.difficulty.forEach((difficulty) => {
          if (difficulty === 'VERY_EASY') {
            content.push(this.$t('roundtrip.VeryEasy'))
          } else if (difficulty === 'EASY') {
            content.push(this.$t('roundtrip.Easy'))
          } else if (difficulty === 'MODERATE') {
            content.push(this.$t('roundtrip.Moderate'))
          } else if (difficulty === 'CHALLENGING') {
            content.push(this.$t('roundtrip.Challenging'))
          }
        })
      }

      if (
        this.history.category !== undefined &&
        this.history.category.length > 0
      ) {
        this.history.category.forEach((category) => {
          const label = category.split('_').join(' ')
          content.push(
            label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
          )
        })
      }

      if (
        this.history.language !== undefined &&
        this.history.language.length > 0
      ) {
        this.history.language.forEach((language) => {
          content.push(getLanguageName(language))
        })
      }

      return content.join(' + ')
    }
  }
}
</script>
