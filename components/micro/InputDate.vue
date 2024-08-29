<template>
  <div>
    <div class="w-full">
      <label
        class="block text-black text-xs font-bold leading-12 mb-5"
        :class="{
          'text-danger': error.length > 0,
          'text-white-lighter-opaque': isDisabled,
          'text-black': !isDark && error.length === 0 && !isDisabled,
          'text-white': isDark && !isDisabled && error.length === 0
        }"
        >{{ label }}</label
      >
      <button
        :disabled="isDisabled"
        class="w-full h-48 leading-16 text-base py-14 px-10 text-left rounded text-black hover:border-primary focus:outline-none focus:border-primary"
        :class="getInputClasses()"
        @click="active = 'checkin'"
      >
        {{ date | formatDateDisplay }}
      </button>
      <span
        v-show="error.length > 0"
        class="block text-danger text-xs leading-12 mt-3"
      >
        {{ error }}
      </span>
    </div>
    <Calendar
      v-show="active"
      :init-values="{ date1: value }"
      :disable-past="disablePast"
      :overwrite-today="overwriteToday"
      :select-range="false"
      :labels="{
        date: date
      }"
      :max-date-year="maxDateYear"
      :max-date-interval="maxDateInterval"
      @select="setDate"
    />
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'
export default {
  name: 'InputDate',
  components: {
    Calendar
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    helper: {
      type: String,
      default: ''
    },
    noDateUpdate: {
      type: Boolean,
      default: false
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
    disablePast: {
      type: Boolean,
      default: true
    },
    overwriteToday: {
      type: String,
      default: null
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
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
      date: false,
      active: false
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.date = newValue
      },
      deep: true
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    this.date = this.value
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
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
    setDate(date) {
      if (
        Date.parse(date) < Date.parse(this.overwriteToday) &&
        this.disablePast &&
        this.overwriteToday !== null
      ) {
        this.value = this.overwriteToday
        return
      }

      if (!this.noDateUpdate) {
        this.date = date
      }
      this.active = false
      this.$emit('input', date)
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
