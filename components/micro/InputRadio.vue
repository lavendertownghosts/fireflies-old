<template>
  <div
    class="radio"
    :class="{ error: hasError, disabled: isDisabled, dark: isDark }"
    @click="!isDisabled ? $emit('input', selected) : ''"
  >
    <input
      :checked="isActive"
      type="radio"
      :disabled="isDisabled"
      :name="name"
      :class="{ checked: isActive }"
    />
    <label
      class="text-sm cursor-pointer"
      :class="
        hasError
          ? 'text-danger'
          : isDisabled
          ? 'text-grey'
          : isDark
          ? 'text-white'
          : 'text-black'
      "
      >{{ label }}</label
    >
  </div>
</template>

<script>
export default {
  name: 'InputRadio',
  props: {
    label: {
      type: String,
      default: ''
    },
    // alapértelmezetten minden radio gombot az oldalon egy név alá rakunk
    // de ez ezzel a paraméterrel felülírható
    name: {
      type: String,
      default: 'radio'
    },
    // erre emitelünk
    value: {
      type: [String, Boolean],
      default: ''
    },
    // ez az értéke a mezőnek
    selected: {
      type: String,
      default: ''
    },
    hasError: {
      type: Boolean,
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
    hideRadio: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.value === this.selected
    }
  }
}
</script>

<style scoped>
.radio input[type='radio'] {
  opacity: 0;
  margin-right: -1px;
}

.radio label {
  position: relative;
  display: inline-block;

  padding-left: 22px;
  margin-left: -16px;
}

.radio label::before,
.radio label::after {
  position: absolute;
  content: '';

  display: inline-block;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.radio label::before {
  height: 16px;
  width: 16px;

  border: 1px solid #cbcbcb;
  background-color: #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  left: 0px;

  top: 2px;
}

.radio.dark label::before {
  border: none;
}

.radio:hover label::before {
  border: 1px solid #6a727f;
}

.radio.dark:hover label::before {
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
}

.radio.dark.disabled label::before,
.radio.dark.disabled:hover label::before {
  border: none;
  background-color: rgba(255, 255, 255, 0.25);
}

.radio.disabled label::before,
.radio.disabled:hover label::before {
  border: 1px solid #cbcbcb;
}

.radio.disabled label::after {
  color: #cbcbcb;
}

.radio.dark.disabled label::after {
  color: rgba(0, 0, 0, 0.35);
}

.radio.error label::before {
  border: 1px solid #fc3c3c;
}

.radio.dark.error label::before {
  border: none;
  background-color: #fc3c3c;
}

.radio label::after {
  height: 5px;
  width: 9px;

  font-family: 'Font Awesome 5 Pro';
  font-style: normal;
  font-weight: 900;
  font-size: 8px;
  line-height: 8px;
  color: #393e46;

  left: 4px;
  top: 6px;
}

.radio input[type='radio'] + label::after {
  /* content: none; */
  content: '\f111';
  opacity: 0;
  transition-property: opacity;
}

.radio input[type='radio']:checked + label::after {
  content: '\f111';
  opacity: 1;
}

/* fallback */
.radio input[type='radio'].checked + label::after {
  content: '\f111';
  opacity: 1;
}

.radio input[type='radio']:focus + label::before {
  outline: none;
}
</style>
