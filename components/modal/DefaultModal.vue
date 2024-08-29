<template>
  <transition name="fade">
    <div
      class="fixed top-0 left-0 w-full flex z-30 h-screen"
      :class="[
        isFullPage
          ? 'bg-white md:bg-black-opaque'
          : 'justify-center bg-black-opaque',
        overflowYWrapper ? 'overflow-y-auto' : '',
        isTopAligned ? 'pt-48 pb-48' : !isSuperPopup ? 'items-center' : '',
        isSuperPopup ? 'overflow-y-auto items-start' : ''
      ]"
      @click="outsideClick"
    >
      <div
        ref="modalContainer"
        class="flex flex-wrap bg-white w-full rounded p-0"
        :style="{ maxWidth: modalMaxWidth, height: modalHeight }"
        :class="[
          isFullPage ? 'p-0' : 'mx-16 ' + defaultPadding,
          isTopAligned && innerWidth >= 740 ? 'h-177' : ''
        ]"
      >
        <div
          :class="
            isFullPage
              ? 'fixed top-0 left-0 r-0 w-full bg-white z-10'
              : 'w-full'
          "
        >
          <slot name="header">
            default header
          </slot>
        </div>

        <div
          :class="[
            overflowY ? (!isSuperPopup ? 'overflow-y-auto' : '') : '',
            isFullPage ? 'h-vfull' : ''
          ]"
          class="w-full h-full"
        >
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="fixed bottom-0 w-full">
          <slot name="footer">
            default footer
            <button class="modal-default-button" @click="$emit('close')">
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DefaultModal',
  props: {
    modalExtraClass: {
      type: String,
      default: 'modal-max-width'
    },
    isFullPage: {
      type: Boolean,
      default: false
    },
    defaultPadding: {
      type: String,
      default: 'p-16'
    },
    modalMaxWidth: {
      type: String,
      default: '624px'
    },
    modalHeight: {
      type: String,
      default: 'auto'
    },
    overflowY: {
      type: Boolean,
      default: true
    },
    overflowYWrapper: {
      type: Boolean,
      default: false
    },
    isTopAligned: {
      type: Boolean,
      default: false
    },
    isSuperPopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      xDown: null,
      yDown: null,
      innerWidth: 0
    }
  },
  mounted() {
    this.$refs.modalContainer.addEventListener(
      'touchstart',
      this.handleTouchStart
    )
    this.$refs.modalContainer.addEventListener(
      'touchmove',
      this.handleTouchMove
    )
    this.innerWidth = window.innerWidth
  },
  methods: {
    outsideClick(e) {
      if (this.$refs.modalContainer !== undefined) {
        const isChild = this.$refs.modalContainer.contains(e.target)
        if (!isChild) {
          this.$emit('close')
        }
      }
    },
    handleTouchStart(e) {
      const evt = e.changedTouches ? e.changedTouches[0] : e
      this.xDown = evt.clientX
      this.yDown = evt.clientY
    },
    handleTouchMove(e) {
      const evt = e.changedTouches ? e.changedTouches[0] : e
      if (!this.xDown || !this.yDown) {
        return
      }

      const xUp = evt.clientX
      const yUp = evt.clientY

      const xDiff = this.xDown - xUp
      const yDiff = this.yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          /* left swipe */
          e.preventDefault()
        } else {
          /* right swipe */
          e.preventDefault()
        }
      }
      /* reset values */
      this.xDown = null
      this.yDown = null
    }
  }
}
</script>
<style>
.h-vfull {
  height: 100vh;
}
</style>
