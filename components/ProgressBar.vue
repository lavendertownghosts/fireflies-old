<template>
  <div class="relative pt-1">
    <div
      class="overflow-hidden mb-4 text-xs flex rounded-lg bg-grey-light"
      :class="lineClass"
    >
      <div
        :style="getWidth()"
        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-100 ease-linear"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    initWidth: {
      type: Number,
      default: 0
    },
    lineClass: {
      type: String,
      default: 'h-2 rounded-lg'
    },
    setTimer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      completeTimeout: 120000,
      currentProgess: 0,
      width: 0,
      timer: false,
      step: 100
    }
  },
  mounted() {
    this.width = this.initWidth
    if (this.setTimer) {
      this.timer = setInterval(() => {
        this.currentProgess += this.step
        this.width = (this.currentProgess * 100) / this.completeTimeout

        if (this.currentProgess >= this.completeTimeout - 500) {
          clearInterval(this.timer)
        }
      }, this.step)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getWidth() {
      return 'width:' + this.width + '%'
    }
  }
}
</script>
