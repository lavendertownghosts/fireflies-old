<template>
  <div
    ref="scroller"
    class="scroller"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @click="click"
  >
    <div
      class="scroller-content"
      :style="{ transform: 'translate3d(' + scrollLeft + 'px, 0, 0)' }"
    >
      <div ref="content" class="flex">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infinite: {
      type: Boolean,
      default: false
    },
    slotCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scrollLeft: 0,
      isDragging: false,
      startX: 0,
      scrollStart: 0
    }
  },
  mounted() {
    if (this.infinite) {
      this.scrollLeft = (-1 * window.innerWidth) / 2
    } else {
      this.scrollLeft = 0
    }
    this.autoScroll()
  },
  methods: {
    autoScroll() {
      setInterval(() => {
        if (!this.isDragging) {
          this.scrollLeft -= 1
        }
        if (this.$refs.content !== undefined) {
          const contentWidth = this.$refs.content.scrollWidth
          const slotWidth = contentWidth / this.slotCount
          if (
            this.infinite &
            (this.scrollLeft >= (-1 * window.innerWidth) / 2)
          ) {
            this.scrollLeft = (-1 * window.innerWidth) / 2
          } else if (
            this.infinite &
            (Math.abs(this.scrollLeft) >= contentWidth - slotWidth * 4)
          ) {
            this.scrollLeft = (-1 * window.innerWidth) / 2
          } else if (
            !this.infinite &
            (Math.abs(this.scrollLeft) >= contentWidth - window.innerWidth / 2)
          ) {
            this.scrollLeft = window.innerWidth / 3
          }
        }
      }, 20)
    },
    startDrag(event) {
      event.preventDefault()
      this.isDragging = true
      this.startX =
        event.type === 'mousedown' ? event.pageX : event.touches[0].pageX
      this.scrollStart = this.scrollLeft
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('touchend', this.stopDrag)
    },
    onDrag(event) {
      if (!this.isDragging) return
      const x =
        event.type === 'mousemove' ? event.pageX : event.touches[0].pageX
      const delta = x - this.startX

      if (this.infinite & (this.scrollLeft >= (-1 * window.innerWidth) / 2)) {
        this.scrollLeft = (-1 * window.innerWidth) / 2
      } else if (!this.infinite & (this.scrollLeft >= -1 * window.innerWidth)) {
        this.scrollLeft = -1 * window.innerWidth
      } else if (window.innerWidth > 1020) {
        this.scrollLeft = this.scrollStart + delta
      } else {
        this.scrollLeft = this.scrollStart + delta * 2
      }
    },
    stopDrag(event) {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.stopDrag)
    },
    click() {
      /*
      if (!this.isDragging) {
        console.log('asdasd')
        this.$emit('click-event')
      }
      */
    }
  }
}
</script>

<style scoped>
.scroller {
  -webkit-user-drag: none;

  overflow: hidden;
  white-space: nowrap;
  cursor: grab;
  user-select: none;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.scroller-content {
  position: relative;
  /* transition: all 0.5s ease; */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.scroller-content * {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
</style>
