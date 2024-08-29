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
  name: 'HistoryFlightFilter',
  props: {
    history: {
      type: [Object, Object],
      required: true
    }
  },
  data() {
    return {
      hover: false,
      active: false,
      classes: {
        economy: this.$t('flight.Tourist'),
        business: this.$t('flight.Business'),
        first: this.$t('flight.First')
      },
      transferNames: {
        '0': this.$t('flight.OnlyDirect'),
        '1': this.$t('flight.Transfer1'),
        '1+': this.$t('flight.TransferMore')
      }
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    getContent() {
      const content = []
      if (this.history.class !== undefined && this.history.class.length > 0) {
        this.history.class.forEach((flightClass) => {
          content.push(this.classes[flightClass])
        })
      }
      if (
        this.history.transfer !== undefined &&
        this.history.transfer.length > 0
      ) {
        this.history.transfer.forEach((transfer) => {
          content.push(this.transferNames[transfer])
        })
      }

      if (this.history.departuretime !== undefined) {
        if (this.history.departuretime.firstleg !== undefined) {
          content.push(
            this.$t('flight.Departure') +
              ': ' +
              this.history.departuretime.firstleg[0] +
              ' - ' +
              this.history.departuretime.firstleg[1]
          )
        }
        if (this.history.departuretime.returleg !== undefined) {
          content.push(
            this.$t('flight.Arrival') +
              ': ' +
              this.history.departuretime.returleg[0] +
              ' - ' +
              this.history.departuretime.returleg[1]
          )
        }
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
            let label = price.label[this.currency].split('-')

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
                this.$options.filters.formatNumber(
                  label[0].slice(0, -1),
                  '0,0',
                  {
                    thousandsSeparator: ' '
                  }
                ) +
                '+'
            }

            content.push(label)
          }
        })
      }
      if (
        this.history.flighttime !== undefined &&
        this.history.flighttime.length > 0
      ) {
        this.history.flighttime.forEach((flighttime) => {
          content.push(
            flighttime +
              ' ' +
              (flighttime > 1
                ? this.$t('flight.Hours')
                : this.$t('flight.Hour'))
          )
        })
      }

      if (
        this.history.airlines !== undefined &&
        this.history.airlines.length > 0
      ) {
        this.history.airlines.forEach((airline) => {
          content.push(airline)
        })
      }

      return content.join(', ')
    }
  }
}
</script>
