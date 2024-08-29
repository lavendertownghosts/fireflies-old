<template>
  <div>
    <div
      v-for="breakpoint in getTimelineVerticalBreakpoints"
      :key="breakpoint"
      class="flex flex-row w-full"
    >
      <div
        :class="stops > 0 && breakpoint % 2 === 0 ? 'border-dashed' : ''"
        class="relative flex-col border-r-2 border-grey-dark h-64"
      >
        <div
          v-if="breakpoint === 1 || breakpoint % 2 === 1"
          class="absolute h-10 w-10 bg-white border-2 border-grey-dark rounded-full z-10 -t-5 -r-6"
        ></div>
        <div
          v-if="breakpoint === getTimelineVerticalBreakpoints"
          class="absolute h-10 w-10 bg-grey-dark border-2 border-grey-dark rounded-full z-10 -b-5 -r-6"
        ></div>
        <div
          v-if="
            stops > 0 &&
              breakpoint % 2 === 1 &&
              breakpoint !== getTimelineVerticalBreakpoints
          "
          class="absolute h-10 w-10 bg-danger border-2 border-white rounded-full z-10 -b-5 -r-6"
        ></div>
      </div>
      <div :class="detailsColumnWidth" class="relative flex-col ml-18">
        <div class="absolute -t-10">
          <div class="text-black text-sm leading-14">
            {{ timeline[breakpoint - 1]['title'] }}
          </div>
          <div
            v-if="stops > 0 || timeline[breakpoint - 1]['descriptionRequired']"
            class="text-xs leading-12 mt-4"
          >
            {{ timeline[breakpoint - 1]['description'] }}
          </div>
          <div
            v-if="timeline[breakpoint - 1]['stoppingTime']"
            class="text-xs leading-12 mt-18"
          >
            {{ $t('flight.Breakpoint') }}:
            {{ timeline[breakpoint - 1]['stoppingTime'] }}
          </div>
        </div>
        <div
          v-if="breakpoint === getTimelineVerticalBreakpoints"
          class="absolute -b-5"
        >
          <div class="text-black text-sm leading-14">
            {{ timeline[breakpoint]['title'] }}
          </div>
        </div>
        <div
          v-if="
            breakpoint === getTimelineVerticalBreakpoints &&
              timeline[breakpoint]['descriptionRequired']
          "
          class="absolute -b-23"
        >
          <div class="text-xs leading-12 mt-4">
            {{ timeline[breakpoint]['description'] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalTimeline',
  props: {
    stops: {
      type: Number,
      required: true
    },
    timeline: {
      type: Array,
      default() {
        return []
      }
    },
    detailsColumnWidth: {
      type: String,
      default: 'w-4/5'
    }
  },
  computed: {
    getTimelineVerticalBreakpoints() {
      if (this.stops < 1) {
        return 1
      } else if (this.stops === 1) {
        return 3
      } else {
        return this.stops + 3
      }
    }
  }
}
</script>

<style scoped>
.-t-5 {
  top: -5px;
}

.-t-10 {
  top: -10px;
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
