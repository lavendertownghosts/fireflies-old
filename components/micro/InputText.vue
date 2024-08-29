<template>
  <div class="text-input">
    <label
      :for="name"
      class="block text-black text-xs font-bold leading-12 mb-5"
      :class="{
        'text-danger': error.length > 0,
        'text-black': !isDark && error.length === 0 && !isDisabled,
        'text-white': isDark && !isDisabled,
        'text-white': isDark && isDisabled,
        'text-white': isDark,
        'text-grey-dark': isDisabled
      }"
      >{{ label }}</label
    >
    <input
      v-model="text"
      v-bind="inputProps"
      :disabled="isDisabled"
      :type="inputType === 'password' && !passwordVisible ? 'password' : 'text'"
      :name="name"
      :placeholder="placeholder"
      :readonly="isReadonly"
      :maxlength="limit"
      class="w-full leading-16 text-base py-14 mb-3 px-12 rounded text-black hover:border-primary focus:outline-none focus:border-primary"
      :class="getInputClasses()"
      @keyup="keyUpEvent()"
      @keyup.enter="$emit('enter')"
      @change="changeEvent()"
    />
    <button
      v-if="inputType === 'password'"
      class="show-password"
      @click="togglePasswordVisibility"
    >
      <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </button>
    <span
      v-show="helper.length > 0 && error && error.length === 0"
      class="block text-xs leading-12"
      :class="
        isDisabled && !isDark
          ? 'text-grey'
          : isDisabled && isDark
          ? 'text-white-lighter-opaque'
          : 'text-grey-dark'
      "
    >
      {{ helper }}
    </span>
    <span
      v-if="limit !== null"
      class="block text-xs leading-12"
      :class="
        isDisabled && !isDark
          ? 'text-grey'
          : isDisabled && isDark
          ? 'text-white-lighter-opaque'
          : 'text-white'
      "
    >
      {{ limitText }} characters
    </span>
    <span
      v-show="error && error.length > 0"
      class="block text-danger text-xs leading-12"
    >
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'InputText',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    helper: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    error: {
      type: [String, Boolean],
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: null
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    },
    inputType: {
      type: String,
      default: 'text'
    },
    inputProps: {
      type: Object,
      default() {
        return {}
      }
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    preventHeight: {
      type: Boolean,
      default: false
    },
    numMin: {
      type: [Boolean, Number],
      default: false
    },
    numMax: {
      type: [Boolean, Number],
      default: false
    }
  },
  data() {
    return { text: '', limitText: '', passwordVisible: false }
  },
  watch: {
    value(newVal) {
      this.text = newVal
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$emit('input', this.text)
    })
  },
  mounted() {
    this.text = this.value !== null ? this.value : ''
    this.limitText = this.text.length + '/' + this.limit
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible
    },
    keyUpEvent() {
      if (!this.isDisabled) {
        this.$emit('input', this.text)
        if (this.limit !== null) {
          this.limitText = this.text.length + '/' + this.limit
        }
      }
    },
    changeEvent() {
      if (
        this.inputType === 'number' &&
        this.numMin !== false &&
        this.numMax !== false
      ) {
        if (parseInt(this.text) < this.numMin) {
          this.text = this.numMin
        } else if (parseInt(this.text) > this.numMax) {
          this.text = this.numMax
        }
      }
      this.$emit('input', this.text)
    },
    getInputClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-grey-light disabled:text-grey-dark'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-grey-dark'
          : this.error.length > 0
          ? 'border-2 border-danger'
          : this.isDark
          ? 'bg-white border border-white'
          : 'bg-white border border-grey'

      const preventClasses = !this.preventHeight ? 'h-48' : ''
      return [...this.inputStyle, initClass, preventClasses]
    }
  }
}
</script>

<style scoped>
.show-password {
  position: relative;
  float: right;
  margin-left: -25px;
  margin-top: 12px;
  z-index: 2;
  background: none;
  border: none;
  cursor: pointer;
  padding-right: 4px;
}
.show-password:focus {
  outline: none;
}
.bg-white::placeholder {
  color: #cbcbcb;
}

.disabled\:text-black-opaque:disabled::placeholder {
  color: rgba(57, 62, 70, 0.5);
}

.disabled\:text-white-opaque:disabled::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.border-danger::placeholder {
  color: #fc3c3c;
}

.border-danger {
  color: #fc3c3c;
}
</style>
