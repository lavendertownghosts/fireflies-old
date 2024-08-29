<template>
  <div
    class="checkbox cursor-pointer"
    :class="{ error: hasError, disabled: isDisabled, dark: isDark }"
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
    >
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  name: 'InputCheckbox',
  props: {
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
.checkbox input[type='checkbox'] {
  opacity: 0;
  margin-left: -1px;
}

.checkbox label {
  position: relative;
  display: inline-block;

  padding-left: 22px;
  margin-left: -16px;
}

.checkbox label::before,
.checkbox label::after {
  position: absolute;
  content: '';

  display: inline-block;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.checkbox label::before {
  height: 16px;
  width: 16px;

  border: 1px solid #cbcbcb;
  background-color: #ffffff;
  box-sizing: border-box;
  border-radius: 4px;
  left: 0px;

  top: 2px;
}

.checkbox.dark label::before {
  border: none;
}

.checkbox:hover label::before {
  border: 1px solid #6a727f;
}

.checkbox.dark:hover label::before {
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
}

.checkbox.dark.disabled label::before,
.checkbox.dark.disabled:hover label::before {
  border: none;
  background-color: rgba(255, 255, 255, 0.15);
}

.checkbox.disabled label::before,
.checkbox.disabled:hover label::before {
  border: 1px solid #cbcbcb;
}

.checkbox.disabled label::after {
  color: #cbcbcb;
}

.checkbox.dark.disabled label::after {
  color: rgba(0, 0, 0, 0.35);
}

.checkbox.error label::before {
  border: 1px solid #fc3c3c;
}

.checkbox.dark.error label::before {
  border: none;
  background-color: #fc3c3c;
}

.checkbox label::after {
  height: 5px;
  width: 9px;

  font-family: 'Font Awesome 5 Pro';
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
  line-height: 12px;
  color: #393e46;

  left: 2px;
  top: 5px;
}

.checkbox input[type='checkbox'] + label::after {
  /* content: none; */
  content: '\f00c';
  opacity: 0;
  transition-property: opacity;
}

.checkbox input[type='checkbox']:checked + label::after {
  content: '\f00c';
  opacity: 1;
}

.checkbox input[type='checkbox']:focus + label::before {
  outline: none;
}
</style>
