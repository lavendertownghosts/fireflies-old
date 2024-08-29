<template>
  <div>
    <div
      v-for="(breakpoint, index) in timeline"
      :key="index"
      class="flex flex-row w-full"
    >
      <div
        :class="
          index < timeline.length - 1
            ? 'border-r-2 border-grey-dark h-32'
            : 'h-1'
        "
        class="relative flex-col"
      >
        <div
          class="absolute h-10 w-10 bg-white border-2 border-grey-dark rounded-full z-10 -t-5 -r-6"
        ></div>
      </div>
      <div class="relative flex-col ml-18 mr-16 w-full">
        <div class="absolute -t-8">
          <div class="leading-12">
            <span class="text-sm leading-14 text-black">{{
              breakpoint.title
            }}</span>
            <span
              v-if="breakpoint.subtitle"
              class="text-xs leading-12 text-grey-dark"
              >{{ breakpoint.subtitle }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalSimpleTimeline',
  props: {
    stops: {
      type: Number,
      required: true
    },
    timeline: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.-t-5 {
  top: -5px;
}

.-t-8 {
  top: -8px;
}

.-b-5 {
  bottom: -5px;
}
.-b-23 {
  bottom: -23px;
}

.-r-6 {
  right: -6px;
}
</style>
