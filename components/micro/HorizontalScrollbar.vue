<template>
  <div class="h-16 bg-white flex items-center">
    <div
      ref="container"
      class="flex relative w-full bg-grey-light h-4 rounded"
      @click="jump"
      @mouseover="hover = true"
      @mouseleave="dragging === false ? (hover = false) : (hover = true)"
    >
      <div
        ref="scrollbar"
        :class="hover ? 'bg-primary-dark' : 'bg-primary'"
        class="absolute h-4 bg-primary rounded cursor-pointer"
        :style="{
          width: scrollbarBodyWidth + 'px',
          left: scrollbarLeft + 'px'
        }"
        @touchstart="startDrag"
        @mousedown="startDrag"
      ></div>
      <div
        :style="{
          left: circleLeft + 'px',
          top: '-6px'
        }"
        :class="hover ? 'bg-primary-dark' : 'bg-primary'"
        class="absolute h-16 w-16 rounded-full cursor-pointer"
        @touchstart="startDrag"
        @mousedown="startDrag"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HorizontalScrollbar',
  props: {
    scrolling: {
      type: Number,
      required: true
    },
    wrapper: {
      type: Object,
      required: true
    },
    area: {
      type: Object,
      required: true
    },
    onChangePosition: {
      type: Function,
      required: true
    },
    onDragging: {
      type: Function,
      required: true
    },
    onStopDrag: {
      type: Function,
      required: true
    },
    circleLeft: {
      type: Number,
      default: 95
    },
    scrollbarLeft: {
      type: Number,
      default: 0
    },
    scrollbarBodyWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dragging: false,
      start: 0,
      hover: false
    }
  },

  mounted() {
    // Put the Listener
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('touchmove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
    document.addEventListener('touchend', this.stopDrag)
  },
  beforeDestroy() {
    // Remove the Listener
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('touchend', this.stopDrag)
  },
  methods: {
    startDrag(e) {
      e.preventDefault()
      e.stopPropagation()
      e = e.changedTouches ? e.changedTouches[0] : e
      // Prepare To Drag
      this.dragging = true
      this.hover = true
      this.start = e.clientX
    },
    onDrag(e) {
      if (this.dragging) {
        // Make The Parent being in the Dragging State
        this.onDragging()
        e = e.changedTouches ? e.changedTouches[0] : e
        const xMovement = e.clientX - this.start
        const xMovementPercentage = (xMovement / this.wrapper.width) * 100
        // Update the last e.clientX
        this.start = e.clientX
        // The next Horizontal Value will be
        const next = this.scrolling + xMovementPercentage
        // Tell the parent to change the position
        this.onChangePosition(next, 'horizontal')
      }
    },
    stopDrag(e) {
      if (this.dragging) {
        // Parent Should Change the Dragging State
        this.onStopDrag()
        this.dragging = false
        this.hover = false
      }
    },
    jump(e) {
      const isContainer = e.target === this.$refs.container
      if (isContainer) {
        // Get the Element Position
        const position = this.$refs.scrollbar.getBoundingClientRect()
        // Calculate the horizontal Movement
        const xMovement = e.clientX - position.left
        const xMovementPercentage =
          (xMovement / this.wrapper.width) * 100 - this.scrollbarBodyWidth / 2
        // Update the last e.clientX
        this.start = e.clientX
        // The next Horizontal Value will be
        const next = this.scrolling + xMovementPercentage
        // Tell the parent to change the position
        this.onChangePosition(next, 'horizontal')
      }
    }
  }
}
</script>
