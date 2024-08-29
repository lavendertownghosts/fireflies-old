<template>
  <div
    v-if="buttons.length > 0"
    class="flex items-stretch text-sm leading-14"
    :style="width ? 'width: ' + width + 'px;' : ''"
  >
    <button
      v-for="(button, index) in buttons"
      :key="index"
      class="flex-1 border border-primary py-8 active:bg-primary active:no-underline active:text-white focus:outline-none"
      :class="[
        {
          'rounded-l': index === 0,
          'rounded-r': index === buttons.length - 1,
          '-ml-1': index !== 0,
          'bg-primary no-underline text-white': button.active,
          'bg-white text-primary hover:underline hover:bg-primary-opaque hover:text-primary': !button.active
        },
        button.extraClass ? button.extraClass : 'px-10'
      ]"
      @click="button.action()"
    >
      {{ button.text }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    width: {
      type: [Number, Boolean],
      default: false
    },
    buttons: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
