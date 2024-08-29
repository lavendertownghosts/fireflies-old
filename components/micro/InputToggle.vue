<template>
  <div
    class="switch cursor-pointer"
    :class="{
      error: hasError,
      disabled: isDisabled,
      dark: isDark,
      active: isActive
    }"
    @click="!isDisabled ? $emit('input', !value) : ''"
  >
    <input v-model="isActive" type="checkbox" :disabled="isDisabled" />
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
  name: 'InputToggle',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
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
    }
  },
  computed: {
    isActive() {
      return this.value
    }
  }
}
</script>

<style scoped>
.switch input[type='checkbox'] {
  opacity: 0;
}

.switch label {
  position: relative;
  display: inline-block;

  padding-left: 34px;
  margin-left: -16px;
}

.switch label::before,
.switch label::after {
  position: absolute;
  content: '';

  display: inline-block;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.switch label::before {
  height: 16px;
  width: 28px;

  border: 1px solid #cbcbcb;
  background-color: #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  left: 0px;

  top: 2px;
}

.switch.dark label::before {
  border: none;
}

.switch.active label::before {
  background-color: #00adb5;
  border: none;
}

.switch.active:hover label::before {
  background-color: #008c92;
  border: none;
}

.switch.dark.active:hover label::before {
  border: none;
  background-color: rgba(0, 173, 181, 0.5);
}

.switch:hover label::before {
  border: 1px solid #6a727f;
}

.switch.dark:hover label::before {
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
}

.switch.dark.disabled label::before,
.switch.dark.disabled:hover label::before {
  border: none;
  background-color: rgba(255, 255, 255, 0.25);
}

.switch.disabled label::before,
.switch.disabled:hover label::before {
  border: 1px solid #cbcbcb;
  background-color: #ffffff;
}

.switch.disabled label::after {
  color: #cbcbcb;
}

.switch.dark.disabled label::after {
  color: rgba(0, 0, 0, 0.35);
}

.switch.disabled input[type='checkbox']:checked + label::after {
  color: #cbcbcb;
}

.switch.dark.disabled input[type='checkbox']:checked + label::after {
  color: rgba(0, 0, 0, 0.35);
}

.switch.error label::before {
  border: 1px solid #fc3c3c;
  background-color: #ffffff;
}

.switch.error:hover label::before {
  border: 1px solid #fc3c3c;
  background-color: #ffffff;
}

.switch.dark.error label::before,
.switch.dark.error:hover label::before {
  border: none;
  background-color: #fc3c3c;
}

.switch.error label::after {
  color: #fc3c3c;
}

.switch.dark.error label::after {
  color: #393e46;
}

.switch.error input[type='checkbox']:checked + label::after {
  color: #393e46;
}

.switch label::after {
  height: 5px;
  width: 9px;

  font-family: 'Font Awesome 5 Pro';
  font-style: normal;
  font-weight: 900;
  font-size: 10px;
  line-height: 10px;
  color: #393e46;

  left: 4px;
  top: 5px;
}

.switch input[type='checkbox'] + label::after {
  content: '\f111';
}

.switch input[type='checkbox']:checked + label::after {
  content: '\f111';
  -webkit-transform: translateX(10px);
  -ms-transform: translateX(10px);
  transform: translateX(10px);
  color: #ffffff;
}

.switch input[type='checkbox']:focus + label::before {
  outline: none;
}
</style>
