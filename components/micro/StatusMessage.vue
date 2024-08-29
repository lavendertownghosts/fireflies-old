<template>
  <div
    :class="type === 'warning' ? 'bg-pink' : ''"
    class="p-16 rounded text-sm leading-14 text-black"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'StatusMessage',
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
