<template>
  <div>
    <div class="border border-grey-light rounded">
      <div
        class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
      >
        <div
          class="flex items-center w-full font-bold text-sm leading-14 "
          v-html="title"
        ></div>
        <div
          v-show="subtitle !== ''"
          class="flex w-full text-xs leading-12 text-grey-dark mt-2"
        >
          {{ subtitle }}
        </div>
      </div>
      <div :class="contentStyle">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebofficeCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    contentStyle: {
      type: String,
      default: 'py-20 px-16'
    }
  }
}
</script>
