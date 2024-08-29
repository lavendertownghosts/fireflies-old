<template>
  <div class="flex flex-wrap px-16 xl:px-40 max-w-screen-xl mx-auto">
    <div class="flex flex-col w-full text-center">
      <div class="text-4xl text-primary">
        {{ error.statusCode }}
      </div>
      <div class="text-xl">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>
