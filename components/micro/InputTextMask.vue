<template>
  <div class="text-input">
    <label
      :for="name"
      class="block text-black text-xs font-bold leading-12 mb-5"
      :class="{
        'text-danger': error.length > 0,
        'text-grey-dark opacity-50': isDisabled,
        'text-black': !isDark && error.length === 0 && !isDisabled,
        'text-white': isDark && !isDisabled && error.length === 0
      }"
      >{{ label }}</label
    >
    <InputMask
      v-model="text"
      v-bind="inputProps"
      :disabled="isDisabled"
      :type="inputType"
      :name="name"
      :placeholder="placeholder"
      :readonly="isReadonly"
      :mask="mask"
      :mask-char="maskChar"
      class="w-full h-48 leading-16 text-base py-14 mb-3 px-12 rounded text-black hover:border-primary focus:outline-none focus:border-primary"
      :class="getInputClasses()"
      @keydown="!isDisabled ? $emit('input', text) : ''"
      @paste="$emit('input', text)"
    />
    <span
      v-show="helper.length > 0 && error.length === 0"
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
      v-show="error.length > 0"
      class="block text-danger text-xs leading-12"
    >
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'InputTextMask',
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
    mask: {
      type: String,
      required: true
    },
    maskChar: {
      type: String,
      default: ''
    }
  },
  data() {
    return { text: '' }
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
    this.text = this.value
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
