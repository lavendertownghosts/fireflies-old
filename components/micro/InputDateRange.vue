<template>
  <div>
    <div class="w-full pr-8" :class="wrapperStyleCheckin">
      <label
        class="block text-black text-xs font-bold leading-12 mb-5"
        :class="{
          'text-danger': error.length > 0,
          'text-grey-dark opacity-50': isDisabled,
          'text-black': !isDark && error.length === 0 && !isDisabled,
          'text-white': isDark && !isDisabled && error.length === 0
        }"
        >{{ labelCheckin }}</label
      >
      <button
        :disabled="isDisabled"
        class="w-full h-48 leading-16 text-base py-14 px-10 mb-3 text-left rounded text-black hover:border-primary focus:outline-none focus:border-primary"
        :class="getInputClasses('checkin')"
        @click="active = 'checkin'"
      >
        {{ date1 | formatDateDisplay }}
      </button>
    </div>
    <slot name="separator"></slot>
    <div class="w-full pl-8" :class="wrapperStyleCheckout">
      <label
        class="block text-black text-xs font-bold leading-12 mb-5"
        :class="{
          'text-danger': error.length > 0,
          'text-grey-dark opacity-50': isDisabled,
          'text-black': !isDark && error.length === 0 && !isDisabled,
          'text-white': isDark && !isDisabled && error.length === 0
        }"
        >{{ labelCheckout }}</label
      >
      <button
        :disabled="isDisabled"
        class="w-full h-48 leading-16 text-base py-14 px-10 mb-3 text-left rounded text-black hover:border-primary focus:outline-none focus:border-primary"
        :class="getInputClasses('checkout')"
        @click="active = 'checkout'"
        v-html="displayDate(date2)"
      />
    </div>
    <Calendar
      v-show="active"
      :init-values="value"
      :disable-past="disablePast"
      :select-range="true"
      :is-nights="isNights"
      :is-end-date="active === 'checkin' ? false : true"
      :labels="{
        date1: labelCheckin,
        date2: labelCheckout
      }"
      :max-date-year="maxDateYear"
      :max-date-interval="maxDateInterval"
      :enable-same-date="enableSameDate"
      @select="setDates"
    />
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'

export default {
  name: 'InputDateRange',
  components: {
    Calendar
  },
  props: {
    labelCheckin: {
      type: String,
      default: ''
    },
    labelCheckout: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {
          date1: '',
          date2: ''
        }
      }
    },
    helper: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    isNights: {
      type: Boolean,
      default: true
    },
    error: {
      type: String,
      default: ''
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    },
    inputStyleCheckin: {
      type: Array,
      default() {
        return []
      }
    },
    inputStyleCheckout: {
      type: Array,
      default() {
        return []
      }
    },
    wrapperStyleCheckin: {
      type: Array,
      default() {
        return [this.isDark ? 'lg:pr-1' : 'lg:pr-0', 'sm:w-1/2']
      }
    },
    wrapperStyleCheckout: {
      type: Array,
      default() {
        return ['sm:w-1/2 sm:pr-8 md:pr-1 lg:pl-0']
      }
    },
    disablePast: {
      type: Boolean,
      default: true
    },
    enableSameDate: {
      type: Boolean,
      default: false
    },
    maxDateYear: {
      type: Number,
      default: 0
    },
    maxDateInterval: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      date1: '',
      date2: '',
      active: false
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.date1 = newValue.date1
        this.date2 = newValue.date2
      },
      deep: true
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    this.date1 = this.value.date1
    this.date2 = this.value.date2
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    displayDate(date) {
      if (date !== false && date !== '') {
        return this.$options.filters.formatDateDisplay(date)
      } else {
        return '&mdash;'
      }
    },
    setDates(dates) {
      this.date1 = dates.date1
      this.date2 = dates.date2

      if (dates.date2 !== false) {
        this.active = false
        this.$emit('input', {
          date1: this.date1,
          date2: this.date2
        })
      } else {
        this.active = 'checkout'
      }
    },
    onDocumentMouseUp(e) {
      const isChild = this.$el.contains(e.target)

      if (!isChild) {
        if (this.active) {
          // STOP! ... HAMMER TIME!
          this.active = false
        }
        this.active = false
      }
    },
    getInputClasses(field) {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-black-light-opaque disabled:text-black-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-white-lighter-opaque'
          : this.error.length > 0
          ? 'border-2 border-danger'
          : this.isDark
          ? 'bg-white border border-white'
          : 'bg-white border border-grey'

      const fieldStyle =
        field === 'checkin' ? this.inputStyleCheckin : this.inputStyleCheckout

      return [
        ...this.inputStyle,
        initClass,
        ...fieldStyle,
        this.active !== false && this.active === field ? 'border-primary' : ''
      ]
    }
  }
}
</script>

<style></style>
