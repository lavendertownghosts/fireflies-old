<template>
  <div class="flex flex-wrap">
    <div class="w-full text-xs leading-12 mt-6">{{ label }}</div>
    <div
      ref="elem"
      class="relative block rounded bg-grey-light w-full mt-14 mb-14 h-6"
    >
      <div
        ref="minSliderHandle"
        class="absolute h-24 w-24 pl-4 pt-4 cursor-pointer transition z-10"
        :style="{ left: positionMin - 4 + 'px', top: '-10px' }"
        @mousedown="dragStart('min')"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <div
          :class="hover ? 'bg-primary-dark' : 'bg-primary'"
          :style="{ left: positionMin + 'px' }"
          class="slider-handle h-16 w-16 items-center text-center rounded-full"
        ></div>
      </div>
      <div
        ref="maxSliderHandle"
        class="absolute h-24 w-24 pl-4 pt-4 cursor-pointer transition z-10"
        :style="{ left: positionMax - 4 + 'px', top: '-10px' }"
        @mousedown="dragStart('max')"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <div
          :class="hover ? 'bg-primary-dark' : 'bg-primary'"
          :style="{ left: positionMax + 'px' }"
          class="slider-handle h-16 w-16 items-center text-center rounded-full"
        ></div>
      </div>
      <div
        :class="hover ? 'bg-primary-dark' : 'bg-primary'"
        class="slider-process absolute h-6 rounded"
        :style="{
          left: positionMin + 1 + 'px',
          right: width - positionMax + 'px'
        }"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      ></div>
    </div>
  </div>
</template>

<script>
import { addMinutes, format, getHours, getMinutes } from 'date-fns'

export default {
  name: 'RangeSlider',
  props: {
    dates: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      positionMin: 0,
      positionMax: 0,
      dragging: false,
      width: null,
      maxWidth: null,
      offset: null,
      label: '',
      direction: '',
      today: new Date(),
      minutesOfDay: 1440,
      step: 15,
      stepInPx: 0,
      minDate: null,
      maxDate: null,
      touchEvent: false,
      hover: false
    }
  },
  mounted() {
    this.offset = this.$refs.elem.getBoundingClientRect().left
    window.addEventListener('resize', this.calculateSize)
    this.$nextTick(() => {
      this.calculateSize()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    bindListener() {
      if (this.$refs.minSliderHandle !== undefined) {
        this.$refs.minSliderHandle.addEventListener(
          'touchstart',
          () => {
            this.touchEvent = true
            this.dragStart('min')
          },
          false
        )
        this.$refs.minSliderHandle.addEventListener(
          'touchmove',
          this.drag,
          false
        )
        this.$refs.minSliderHandle.addEventListener(
          'touchend',
          this.dragEnd,
          false
        )
      }
      if (this.$refs.maxSliderHandle !== undefined) {
        this.$refs.maxSliderHandle.addEventListener(
          'touchstart',
          () => {
            this.touchEvent = true
            this.dragStart('max')
          },
          false
        )
        this.$refs.maxSliderHandle.addEventListener(
          'touchmove',
          this.drag,
          false
        )
        this.$refs.maxSliderHandle.addEventListener(
          'touchend',
          this.dragEnd,
          false
        )
      }
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.dragEnd)
    },
    setMinPosition(pos) {
      if (pos < 0) {
        this.positionMin = 0
      } else if (pos + this.stepInPx > this.positionMax) {
        this.positionMin = this.positionMax - this.stepInPx
      } else {
        this.positionMin = pos
      }
      this.minDate = addMinutes(
        this.today.setHours(0, 0, 0, 0),
        this.getMinutes(this.positionMin)
      )
      this.setLabel()
    },
    setMaxPosition(pos) {
      if (pos - this.stepInPx < this.positionMin) {
        this.positionMax = this.positionMin + this.stepInPx
      } else if (pos > this.width) {
        this.positionMax = this.width
      } else {
        this.positionMax = pos
      }
      let minutes = this.getMinutes(this.positionMax)
      if (minutes === this.minutesOfDay) {
        minutes--
      }
      this.maxDate = addMinutes(this.today.setHours(0, 0, 0, 0), minutes)
      this.setLabel()
    },
    getMinutes(position) {
      return (
        parseInt(
          (Math.round((parseInt(position) * this.minutesOfDay) / this.width) +
            parseFloat(this.step) / 2) /
            this.step
        ) * this.step
      )
    },
    setLabel() {
      this.minDate =
        typeof this.minDate === 'string' ? parseInt(this.minDate) : this.minDate
      this.maxDate =
        typeof this.maxDate === 'string' ? parseInt(this.maxDate) : this.maxDate
      this.label =
        format(this.minDate, 'HH:mm') + ' - ' + format(this.maxDate, 'HH:mm')
      this.$emit('setDates', {
        minDate: format(this.minDate, 'T'),
        maxDate: format(this.maxDate, 'T')
      })
    },
    dragStart(direction) {
      this.direction = direction
      this.dragging = true
      this.hover = true
      this.offset = this.$refs.elem.getBoundingClientRect().left
    },
    drag(ev) {
      if (!this.dragging) {
        return
      }
      let pos = ev.clientX - this.offset
      if (
        this.touchEvent &&
        ev.touches !== undefined &&
        ev.touches.length > 0
      ) {
        pos = ev.touches[0].clientX - this.offset
      }
      if (pos >= 0 && pos < this.width) {
        pos = Math.round(pos)
        if (this.direction === 'min') {
          this.setMinPosition(pos)
        }
        if (this.direction === 'max') {
          this.setMaxPosition(pos)
        }
      }
    },
    dragEnd() {
      if (!this.dragging) {
        return
      }
      this.dragging = false
      this.touchEvent = false
      this.hover = false
      this.$emit('dragEnd')
    },
    calculateSize() {
      this.minDate = this.dates.minDate
      this.maxDate = this.dates.maxDate
      this.maxWidth =
        this.$refs.elem !== undefined
          ? this.$refs.elem.offsetWidth
          : this.maxWidth
      if (this.maxWidth === 0) {
        if (window.innerWidth >= 1280) {
          this.maxWidth = 288
        } else if (window.innerWidth < 772) {
          this.maxWidth = window.innerWidth - 32
        } else {
          this.maxWidth = 236
        }
      }
      this.width = this.maxWidth - 14
      this.bindListener()
      this.setLabel()
      this.stepInPx = (this.step * this.width) / this.minutesOfDay
      this.positionMin = Math.round(
        ((getHours(this.minDate) * 60 + getMinutes(this.minDate)) *
          this.width) /
          this.minutesOfDay
      )
      this.positionMax = Math.round(
        ((getHours(this.maxDate) * 60 + getMinutes(this.maxDate)) *
          this.width) /
          this.minutesOfDay
      )
    }
  }
}
</script>
