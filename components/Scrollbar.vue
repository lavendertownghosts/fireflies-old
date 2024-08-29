<template>
  <div ref="scrollWrapper" :class="'overflow-x-hidden'" @click="calculateSize">
    <div
      ref="scrollArea"
      :style="{
        marginLeft: left * -1 + 'px'
      }"
      @wheel="scroll"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="stopDrag"
    >
      <slot></slot>
      <HorizontalScrollbar
        v-if="showHorizontalScrollbar"
        :area="{ width: scrollAreaWidth }"
        :wrapper="{ width: scrollWrapperWidth }"
        :scrolling="hMovement"
        :scrollbar-left="scrollbarLeft"
        :scrollbar-body-width="scrollbarBodyWidth"
        :circle-left="scrollbarCircleLeft"
        :on-change-position="handleChangePosition"
        :on-dragging="handleScrollbarDragging"
        :on-stop-drag="handleScrollbarStopDrag"
        class="mt-20"
      >
      </HorizontalScrollbar>
    </div>
  </div>
</template>

<script>
import HorizontalScrollbar from '@/components/micro/HorizontalScrollbar'
export default {
  name: 'Scrollbar',
  components: {
    HorizontalScrollbar
  },
  props: {
    speed: {
      type: Number,
      default: 1
    },
    onMaxScroll: {
      type: Function,
      default: () => {}
    },
    centered: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showHorizontalScrollbar: false,
      left: 0,
      scrollAreaHeight: null,
      scrollAreaWidth: null,
      scrollWrapperHeight: null,
      scrollWrapperWidth: null,
      hMovement: 0,
      dragging: false,
      start: { y: 0, x: 0 },
      allowBodyScroll: true,
      scrollbarLeft: 0,
      scrollbarBodyWidth: 0,
      scrollbarCircleLeft: 0,
      draggingScrollbar: false
    }
  },
  mounted() {
    this.calculateSize()
    // Attach The Event for Responsive View~
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    // Remove Event
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    scroll(e) {
      // Make sure the content height is not changed
      this.calculateSize(() => {
        // Set the wheel step
        const num = this.speed
        // DOM events
        const shifted = e.shiftKey
        let scrollX = e.deltaX > 0 ? num : -num
        // Fix Mozilla Shifted Wheel~
        if (shifted && e.deltaX === 0) scrollX = e.deltaY > 0 ? num : -num
        // Next Value
        const nextX = this.left + scrollX
        // Is it Scrollable?
        const canScrollX = this.scrollAreaWidth > this.scrollWrapperWidth
        // Horizontal Scrolling
        if (shifted && canScrollX) this.normalizeHorizontal(nextX)
      })
      // prevent Default only if scrolled content is not at the top/bottom
      if (!this.allowBodyScroll) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    // DRAG EVENT JUST FOR TOUCH DEVICE~
    startDrag(e) {
      this.touchEvent = e
      const evt = e.changedTouches ? e.changedTouches[0] : e
      // Make sure the content height is not changed
      this.calculateSize(() => {
        // Prepare to drag
        this.dragging = true
        this.start = { y: evt.pageY, x: evt.pageX }
      })
    },
    onDrag(e) {
      if (this.dragging) {
        const evt = e.changedTouches ? e.changedTouches[0] : e
        const yMovement = this.start.y - evt.clientY
        if (yMovement === 0 || this.draggingScrollbar) {
          if (e.cancelable) {
            e.preventDefault()
            e.stopPropagation()
          }
          // Prevent Click Event When it dragging
          if (this.touchEvent) {
            this.touchEvent.preventDefault()
            this.touchEvent.stopPropagation()
          }
        }
        // Invers the Movement
        const xMovement = this.start.x - evt.clientX
        // Update the last e.client
        this.start = { y: evt.clientY, x: evt.clientX }
        // The next Vertical Value will be
        const nextX = this.left + xMovement
        this.normalizeHorizontal(nextX)
      }
    },
    stopDrag(e) {
      this.dragging = false
      this.touchEvent = false
    },
    scrollToX(x) {
      this.normalizeHorizontal(x)
    },
    normalizeHorizontal(next) {
      const elementSize = this.getSize()
      // Horizontal Scrolling
      const rightEnd = elementSize.scrollAreaWidth - this.scrollWrapperWidth
      // Max Scroll Right
      next = next > rightEnd ? rightEnd : next
      // Max Scroll Left
      next = next < 0 ? 0 : next
      // Update the Horizontal Value
      const shouldScroll = this.left !== next
      this.allowBodyScroll = !shouldScroll
      if (shouldScroll) {
        this.left = next
        this.hMovement = (next / elementSize.scrollAreaWidth) * 100
        const percentInWrap = (next / rightEnd) * 100
        const scrollbarLeftPercent =
          ((this.scrollWrapperWidth - this.scrollbarBodyWidth) *
            percentInWrap) /
          100
        this.scrollbarLeft = this.left + scrollbarLeftPercent
        this.scrollbarCircleLeft =
          this.scrollbarLeft + (this.scrollbarBodyWidth - 16) / 2
        this.$emit('left', {
          isMin: this.left === 0,
          isMax: this.left === rightEnd
        })
      }
    },
    handleChangePosition(movement, orientation) {
      // Make sure the content height is not changed
      this.calculateSize(() => {
        // Convert Percentage to Pixel
        const next = movement / 100
        if (orientation === 'horizontal') {
          this.normalizeHorizontal(next * this.scrollAreaWidth)
        }
      })
    },
    handleScrollbarDragging() {
      this.dragging = true
      this.draggingScrollbar = true
    },
    handleScrollbarStopDrag() {
      this.dragging = false
      this.draggingScrollbar = false
    },
    getSize() {
      return {
        // Scroll Area Height and Width
        scrollAreaHeight:
          this.$refs.scrollArea !== undefined
            ? this.$refs.scrollArea.children[0].clientHeight
            : 0,
        scrollAreaWidth:
          this.$refs.scrollArea !== undefined
            ? this.$refs.scrollArea.children[0].clientWidth
            : 0,
        // Scroll Wrapper Height and Width
        scrollWrapperHeight:
          this.$refs.scrollWrapper !== undefined
            ? this.$refs.scrollWrapper.clientHeight
            : 0,
        scrollWrapperWidth:
          this.$refs.scrollWrapper !== undefined
            ? this.$refs.scrollWrapper.clientWidth
            : 0
      }
    },
    calculateSize(cb) {
      if (typeof cb !== 'function') cb = null
      const elementSize = this.getSize()
      if (
        elementSize.scrollWrapperHeight !== this.scrollWrapperHeight ||
        elementSize.scrollWrapperWidth !== this.scrollWrapperWidth ||
        elementSize.scrollAreaHeight !== this.scrollAreaHeight ||
        elementSize.scrollAreaWidth !== this.scrollAreaWidth
      ) {
        // Scroll Area Height and Width
        this.scrollAreaHeight = elementSize.scrollAreaHeight
        this.scrollAreaWidth = elementSize.scrollAreaWidth
        // Scroll Wrapper Height and Width
        this.scrollWrapperHeight = elementSize.scrollWrapperHeight
        this.scrollWrapperWidth = elementSize.scrollWrapperWidth
        this.showHorizontalScrollbar =
          this.scrollAreaWidth > this.scrollWrapperWidth
        if (this.showHorizontalScrollbar) {
          const scrollbarBodyWidthPercent = Math.round(
            (this.scrollWrapperWidth * 100) / this.scrollAreaWidth
          )
          this.scrollbarBodyWidth =
            (scrollbarBodyWidthPercent * this.scrollWrapperWidth) / 100
          this.scrollbarCircleLeft =
            this.scrollbarLeft + (this.scrollbarBodyWidth - 16) / 2
          if (this.centered) {
            this.normalizeHorizontal(
              (this.scrollAreaWidth - this.scrollWrapperWidth) / 2
            )
          }
        }
        return cb ? cb() : false
      } else return cb ? cb() : false
    }
  }
}
</script>
