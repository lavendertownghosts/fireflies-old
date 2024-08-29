<template>
  <div :class="stops === 0 ? 'mb-24 mt-8' : 'my-8'" class="flex w-full">
    <div
      v-for="breakPoint in getTimelineHorizontalBreakpoints"
      :key="breakPoint"
      :class="getTimelineHorizontalWidth"
      class="relative h-2 bg-grey-dark"
    >
      <div
        v-if="breakPoint === 1"
        class="absolute h-10 w-10 bg-white border-2 border-grey-dark rounded-full -t-4 -l-5"
      ></div>
      <div
        v-if="breakPoint === getTimelineHorizontalBreakpoints"
        class="absolute h-10 w-10 bg-grey-dark rounded-full -t-4 -r-5"
      ></div>
      <div
        v-if="stops >= 1 && breakPoint < getTimelineHorizontalBreakpoints"
        class="absolute h-10 w-10 bg-danger border-2 border-white rounded-full z-10 -t-4 -r-5"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HorizontalTimeline',
  props: {
    stops: {
      type: Number,
      required: true
    }
  },
  computed: {
    getTimelineHorizontalBreakpoints() {
      if (this.stops > 0) {
        return this.stops + 1
      } else {
        return 1
      }
    },
    getTimelineHorizontalWidth() {
      if (this.stops < 1) {
        return 'w-full'
      } else {
        return 'w-1/' + (this.stops + 1)
      }
    }
  }
}
</script>

<style scoped>
.-t-4 {
  top: -4px;
}
.-r-5 {
  right: -5px;
}

.-l-5 {
  left: -5px;
}
</style>
