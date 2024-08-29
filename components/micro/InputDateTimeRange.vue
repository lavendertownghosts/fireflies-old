<template>
  <div>
    <div :class="getCheckInWrapperStyle" class="flex flex-row w-full mr-16">
      <div
        ref="dateSelect1"
        :class="getDateWrapperStyle"
        class="w-5/7 sm:w-4/6 md:w-4/7 mr-8"
      >
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
          :class="getInputClasses()"
          @click="active = 'checkin'"
        >
          {{ date1 | formatDateDisplay }}
        </button>
      </div>
      <div class="w-2/7 sm:w-2/6 md:w-3/7 z-30" @click="active = false">
        <InputDropdown
          ref="timeSelect"
          v-model="time1"
          :values="timeValues"
          :label="labelCheckinTime"
          :is-dark="isDark"
          :button-style="timeButtonStyle"
          class="h-48"
          @change="setTime"
        />
      </div>
    </div>
    <div class="flex flex-row w-full mt-12 sm:mt-0 lg:mr-1">
      <div
        ref="dateSelect2"
        :class="getDateWrapperStyle"
        class="w-5/7 sm:w-4/6 md:w-4/7 mr-8"
      >
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
          :class="getInputClasses()"
          @click="active = 'checkout'"
          v-html="displayDate(date2)"
        />
      </div>
      <div class="w-2/7 sm:w-2/6 md:w-3/7" @click="active = false">
        <InputDropdown
          ref="timeSelect"
          v-model="time2"
          :values="timeValues"
          :label="labelCheckinTime"
          :is-dark="isDark"
          :button-style="timeButtonStyle"
          class="h-48"
          @change="setTime"
        />
      </div>
    </div>
    <Calendar
      v-show="active"
      :init-values="value"
      :disable-past="true"
      :select-range="true"
      :labels="{
        date1: labelCheckin,
        date2: labelCheckout
      }"
      @select="setDate"
    />
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'

import InputDropdown from '@/components/micro/InputDropdown'

export default {
  name: 'InputDateTimeRange',
  components: {
    Calendar,
    InputDropdown
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
    labelCheckinTime: {
      type: String,
      default: ''
    },
    labelCheckoutTime: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {
          date1: '',
          date2: '',
          time1: '',
          time2: ''
        }
      }
    },
    helper: {
      type: String,
      default: ''
    },
    error: {
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
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    },
    timeButtonStyle: {
      type: Array,
      default() {
        return ['xl:rounded-none']
      }
    },
    timeStep: {
      type: Number,
      default: 15
    },
    screenBreakPoint: {
      type: String,
      default: 'lg'
    }
  },
  data() {
    return {
      date1: '',
      date2: '',
      time1: 32,
      time2: 32,
      active: false,
      timeValues: []
    }
  },
  computed: {
    getCheckInWrapperStyle() {
      if (this.screenBreakPoint === 'lg') {
        return 'lg:mr-1'
      } else if (this.screenBreakPoint === 'xl') {
        return 'xl:mr-1'
      } else {
        return 'mr-16'
      }
    },
    getDateWrapperStyle() {
      if (this.screenBreakPoint === 'lg') {
        return 'lg:mr-1'
      } else if (this.screenBreakPoint === 'xl') {
        return 'xl:mr-1'
      } else {
        return 'sm:mr-5 md:mr-4 lg:mr-4'
      }
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.date1 = newValue.date1
        this.date2 = newValue.date2
        this.time1 = newValue.time1
        this.time2 = newValue.time2
      },
      deep: true
    },
    time1: {
      handler() {
        this.setTime()
      }
    },
    time2: {
      handler() {
        this.setTime()
      }
    }
  },
  mounted() {
    for (let i = 0; i < 24 * 60; i += this.timeStep) {
      const hh = Math.floor(i / 60)
      const mm = i % 60
      this.timeValues.push(('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2))
    }
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    this.date1 = this.value.date1
    this.date2 = this.value.date2
    this.time1 = this.value.time1
    this.time2 = this.value.time2
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
    getInputClasses() {
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
      return [...this.inputStyle, initClass]
    },
    setDate(dates) {
      this.date1 = dates.date1
      this.date2 = dates.date2

      if (dates.date2 !== false) {
        this.active = false
        this.$emit('input', {
          date1: this.date1,
          date2: this.date2,
          time1: this.time1,
          time2: this.time2
        })
      } else {
        this.active = 'checkout'
      }
    },
    setTime() {
      this.$emit('input', {
        date1: this.date1,
        date2: this.date2,
        time1: this.time1,
        time2: this.time2
      })
    },
    onDocumentMouseUp(e) {
      const isChild = this.$el.contains(e.target)
      if (!isChild) {
        if (this.active) {
          this.active = false
        }
        this.active = false
      }
    }
  }
}
</script>

<style scoped>
.bg-white::placeholder {
  color: #cbcbcb;
}

.disabled\:text-black-opaque:disabled::placeholder {
  color: rgba(57, 62, 70, 0.5);
}

.disabled\:text-white-lighter-opaque:disabled::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.border-danger::placeholder {
  color: #fc3c3c;
}

.border-danger {
  color: #fc3c3c;
}
</style>
