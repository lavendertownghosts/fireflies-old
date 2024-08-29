<template>
  <button
    class="w-full text-left bg-white border rounded mb-12 p-12 text-sm cursor-pointer focus:outline-none"
    :class="{
      'text-grey-dark border-primary hover:text-primary-dark active:border-primary-light active:bg-white active:text-primary-light focus:border-black focus:bg-white focus:text-black': !isDisabled,
      'text-grey border-grey': isDisabled,
      'bg-primary-opaque border-primary-dark': hover && !isDisabled
    }"
    @mouseover="!isDisabled ? (hover = true) : ''"
    @mouseleave="!isDisabled ? (hover = false) : ''"
    @mousedown="!isDisabled ? (active = true) : ''"
    @blur="!isDisabled ? (active = false) : ''"
    @click="$emit('click')"
  >
    <div
      :class="{
        underline: hover || active
      }"
      class="leading-14"
      v-html="filterString"
    ></div>
  </button>
</template>

<script>
export default {
  name: 'HistoryHotelFilter',
  props: {
    history: {
      type: Array,
      default() {
        return []
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hover: false,
      active: false
    }
  },
  computed: {
    filterString() {
      const returnArray = []
      for (let i = 0; i < this.history.length; i++) {
        if (this.history[i].category === 'star') {
          for (let n = 0; n < this.history[i].filter.length; n++) {
            returnArray.push(this.getStarIcons(this.history[i].filter[n]))
          }
        } else if (this.history[i].category === 'supply') {
          for (let n = 0; n < this.history[i].filter.length; n++) {
            if (this.history[i].filter[n] !== 90) {
              returnArray.push(this.getSupplyName(this.history[i].filter[n]))
            }
          }
        } else if (this.history[i].category === 'price') {
          for (let n = 0; n < JSON.parse(this.history[i].filter).length; n++) {
            returnArray.push(
              this.getPriceName(JSON.parse(this.history[i].filter)[n])
            )
          }
        } else if (this.history[i].category === 'voucher') {
          returnArray.push(
            this.getVoucherName(JSON.parse(this.history[i].filter))
          )
        } else if (
          this.history[i].category === '1' ||
          this.history[i].category === '2'
        ) {
          returnArray.push(this.history[i].name)
        } else if (this.history[i].category === 'text') {
          returnArray.push(this.history[i].filter)
        }
      }
      return returnArray.join(' | ')
    },
    nightsValue() {
      for (let i = 0; i < this.history.length; i++) {
        if (this.history[i].category === 'nights') {
          return this.history[i].filter
        }
      }
      return 1
    }
  },
  methods: {
    getStarIcons(num) {
      let returnString = ''
      for (let i = 0; i < num; i++) {
        returnString += '<i class="fas fa-star text-2xs"></i>'
      }
      return returnString
    },
    getSupplyName(id) {
      switch (id) {
        case 10:
          return this.$t('hotel.RoomOnly')
        case 20:
          return this.$t('hotel.WithBreakfast')
        case 30:
          return this.$t('hotel.HB')
        case 40:
          return this.$t('hotel.FullBoard')
        case 50:
          return this.$t('hotel.AllInclusive')
        case 60:
          return this.$t('hotel.DinnerOnly')
      }
    },
    getPriceName(price) {
      price.max =
        price.max < 99999999
          ? ' - ' +
            String(price.currency) +
            ' ' +
            String(price.max / this.nightsValue)
          : ' +'
      return (
        price.currency +
        ' ' +
        String(price.min / this.nightsValue) +
        String(price.max)
      )
    },
    getVoucherName(voucher) {
      let returnString = ''
      if (voucher.min !== '' && parseInt(voucher.min) > 0) {
        returnString +=
          this.$t('hotel.Min') + ' ' + parseInt(voucher.min) + ' DV'
      }

      if (voucher.max !== '' && parseInt(voucher.max) < 9999999) {
        if (returnString !== '') {
          returnString += ' - '
        }
        returnString +=
          this.$t('hotel.Max') + ' ' + parseInt(voucher.max) + ' DV'
      }

      return returnString
    }
  }
}
</script>
