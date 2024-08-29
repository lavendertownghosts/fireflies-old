<template>
  <div class="dropdown text-black">
    <label
      class="block text-black text-xs font-bold leading-12 mb-5"
      :class="{
        'text-danger': error.length > 0,
        'text-grey-dark opacity-50': isDisabled,
        'text-black': !isDark && !isDisabled,
        'text-white': isDark && !isDisabled
      }"
      >{{ label }}</label
    >
    <button
      v-if="!isFilterable"
      class="px-12 leading-16 text-base py-15 rounded text-base w-full hover:border-primary focus:outline-none focus:border-primary cursor-pointer inline-flex justify-between items-center"
      :disabled="isDisabled"
      :class="getButtonClasses"
      @click="triggerOpen()"
    >
      <span
        v-show="values[activeIndex]"
        class="mr-1 p-0 -ml-5"
        :class="{
          'text-danger': error.length > 0 && !isDisabled
        }"
        >&nbsp;{{ values[activeIndex] }}</span
      >
      <span
        v-show="!values[activeIndex] && placeholder.length > 0"
        class="mr-1 p-0 -ml-5"
        :class="
          error.length > 0 && !isDisabled
            ? 'text-danger'
            : isDisabled && !isDark
            ? 'text-black-opaque'
            : isDisabled && isDark
            ? 'text-white-lighter-opaque'
            : 'text-grey'
        "
        >&nbsp;{{ placeholder }}</span
      >
      <i
        v-show="!isLoading"
        class="far fa-chevron-down text-sm"
        :class="isDisabled ? 'text-grey-dark' : 'text-black'"
      ></i>
      <i v-show="isLoading" class="fas fa-spinner-third fa-spin"></i>
    </button>
    <div v-if="isFilterable" class="relative">
      <input
        v-model="text"
        :disabled="isDisabled"
        :placeholder="placeholder"
        :readonly="isReadonly"
        class="px-12 leading-16 text-base py-11 rounded text-base w-full hover:border-primary focus:outline-none focus:border-primary cursor-pointer inline-flex justify-between items-center"
        :class="getButtonClasses"
        @click="triggerOpen()"
        @keyup="!isDisabled ? inputKeyupHandler() : ''"
        @change=";(text = dropdownList[activeIndex]), emitTrueIndex(text)"
      />
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
      <i
        v-show="!isLoading"
        class="far fa-chevron-down absolute right-0 mt-16 mr-12 text-sm pointer-events-none"
        :class="isDisabled ? 'text-grey-dark' : 'text-black'"
      ></i>
      <i
        v-show="isLoading"
        class="fas fa-spinner-third fa-spin absolute right-0 mt-15 mr-12 pointer-events-none"
      ></i>
    </div>
    <div class="relative">
      <div class="absolute w-full z-50">
        <perfect-scrollbar
          v-show="isOpen"
          ref="dropdown"
          class="rounded shadow-drop bg-white w-full cursor-pointer z-10 overflow-hidden"
        >
          <div
            v-for="(rowValue, index) in dropdownList"
            :key="index"
            class="leading-16 text-base py-16 px-12 border-b border-grey-light last:border-b-0 last:rounded-b first:rounded-t"
            :class="
              index === activeIndex
                ? 'bg-primary text-white hover:bg-primary'
                : 'bg-white hover:bg-primary-opaque text-black hover:text-black'
            "
            @click="
              if (!isDisabled) {
                activeIndex = index
                text = rowValue
                isOpen = false
                emitTrueIndex(rowValue)
              }
            "
          >
            {{ rowValue }}
          </div>
        </perfect-scrollbar>
      </div>
    </div>
    <span
      v-show="helper.length > 0 && error.length === 0"
      class="block text-xs leading-12 mt-3"
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
      class="block text-danger text-xs leading-12 mt-3"
    >
      {{ error }}
    </span>
  </div>
</template>

<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  name: 'InputDropdown',
  components: {
    PerfectScrollbar
  },
  props: {
    values: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    // index of selected item
    value: {
      type: [Boolean, Number, String],
      default: 0
    },
    label: {
      type: String,
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
    error: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isFilterable: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    buttonStyle: {
      type: Array,
      default() {
        return []
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: 0,
      isOpen: false,
      dropdownList: [],
      text: ''
    }
  },
  computed: {
    getButtonClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-black-light-opaque disabled:text-black-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-white-lighter-opaque'
          : !this.isDisabled && this.error.length > 0
          ? 'bg-white border-2 border-danger'
          : this.isOpen
          ? 'bg-white border border-primary'
          : this.isDark
          ? 'bg-white border border-white'
          : 'bg-white border border-grey'
      return [...this.buttonStyle, initClass]
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.activeIndex = newValue
        this.text = this.values[this.activeIndex]
      }
    }
  },
  mounted() {
    this.dropdownList = this.values
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    if (this.value >= 0) {
      this.activeIndex = this.value
      this.text = this.values[this.value]
    } else {
      this.activeIndex = 99999
    }
    if (this.placeholder.length === 0 && this.activeIndex === false) {
      this.activeIndex = 0
    }
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    onDocumentMouseUp(e) {
      if (!this.isReadonly) {
        const isChild = this.$el.contains(e.target)

        if (!isChild) {
          if (this.isOpen) {
            this.isOpen = false
          }
          this.isOpen = false
        }
      }
    },
    inputKeyupHandler() {
      if (!this.isReadonly) {
        if (!this.isDisabled) {
          this.isOpen = true
          this.activeIndex = 0
          this.filterDropdownlist(this.text)
          this.$nextTick(() => {
            this.$refs.dropdown.$el.scrollTop = this.activeIndex
          })
        }
      }
    },
    triggerOpen() {
      if (!this.isReadonly) {
        if (!this.isDisabled) {
          if (!this.isOpen) {
            this.filterDropdownlist()
            this.isOpen = true
            this.$nextTick(() => {
              this.$refs.dropdown.$el.scrollTop = this.activeIndex
            })
          }
        }
      }
    },
    filterDropdownlist(text) {
      if (text === undefined) {
        this.dropdownList = this.values
        return true
      }

      if (text === '') {
        this.dropdownList = this.values
        return true
      }

      this.dropdownList = this.values.filter(function(str) {
        const search = str.toLowerCase()
        const word = text.toLowerCase()
        if (search.includes(word) === true) {
          return str
        }
      })
    },
    emitTrueIndex(text) {
      if (this.isFilterable) {
        this.activeIndex = Object.values(this.values).indexOf(text)
        this.$emit('input', Object.values(this.values).indexOf(text))
      } else {
        this.$emit('input', this.activeIndex)
      }
    }
  }
}
</script>

<style>
/*
 * Container style
 */
.ps {
  overflow: hidden !important;
  overflow-anchor: none;
  -ms-overflow-style: none;
  touch-action: auto;
  -ms-touch-action: auto;
}
/*
 * Scrollbar rail styles
 */
.ps__rail-x {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear, opacity 0.2s linear;
  -webkit-transition: background-color 0.2s linear, opacity 0.2s linear;
  height: 15px;
  /* there must be 'bottom' or 'top' for ps__rail-x */
  bottom: 0px;
  /* please don't change 'position' */
  position: absolute;
}
.ps__rail-y {
  display: none;
  opacity: 0;
  transition: background-color 0.2s linear, opacity 0.2s linear;
  -webkit-transition: background-color 0.2s linear, opacity 0.2s linear;
  width: 15px;
  /* there must be 'right' or 'left' for ps__rail-y */
  right: 0;
  /* please don't change 'position' */
  position: absolute;
}
.ps--active-x > .ps__rail-x,
.ps--active-y > .ps__rail-y {
  display: block;
  background-color: transparent;
}
.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
  opacity: 0.6;
}
.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
  background: transparent;
  opacity: 0.9;
}
/*
 * Scrollbar thumb styles
 */
.ps__thumb-x {
  background-color: rgba(57, 62, 70, 0.2);
  border-radius: 14px;
  transition: background-color 0.2s linear, height 0.2s ease-in-out;
  -webkit-transition: background-color 0.2s linear, height 0.2s ease-in-out;
  height: 6px;
  /* there must be 'bottom' for ps__thumb-x */
  bottom: 2px;
  /* please don't change 'position' */
  position: absolute;
}
.ps__thumb-y {
  background-color: rgba(57, 62, 70, 0.2);
  border-radius: 6px;
  transition: background-color 0.2s linear, width 0.2s ease-in-out;
  -webkit-transition: background-color 0.2s linear, width 0.2s ease-in-out;
  width: 6px;
  /* there must be 'right' for ps__thumb-y */
  right: 2px;
  /* please don't change 'position' */
  position: absolute;
}
.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
  background-color: rgba(57, 62, 70, 0.2);
  height: 11px;
}
.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
  width: 4px;
  background-color: rgba(57, 62, 70, 0.2);
  border-radius: 14px;
}
/* MS supports */
@supports (-ms-overflow-style: none) {
  .ps {
    overflow: auto !important;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .ps {
    overflow: auto !important;
  }
}

/* -------------------------------- */

.ps {
  position: relative;
  max-height: 267px;
}

.ps__thumb-y {
  width: 4px;
  background-color: rgba(57, 62, 70, 0.2);
  border-radius: 14px;
}

.ps__rail-y,
.ps__rail-y:hover,
.ps__rail-y:focus,
.ps__rail-y.ps--clicking {
  width: 4px;
  padding-right: 4px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
  width: 4px;
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
  background: transparent;
}
</style>
