<template>
  <transition name="fade">
    <div class="gallery-overlay">
      <div
        v-show="prev"
        class="arrow md:text-3xl text-lg text-primary left-arrow p-15 cursor-pointer"
        @click="$emit('prev')"
      >
        <i class="fa fa-chevron-left" aria-hidden="true"></i>
      </div>
      <div
        ref="modalContainer"
        class="gallery-picture gallery-padding-full"
        :style="{
          backgroundImage: `url('` + img + `')`
        }"
      ></div>
      <div
        v-show="next"
        class="arrow md:text-3xl text-lg text-primary right-arrow p-15 cursor-pointer"
        @click="$emit('next')"
      >
        <i class="fa fa-chevron-right" aria-hidden="true"></i>
      </div>
      <div
        class="close md:text-3xl text-lg text-primary right-arrow p-15 cursor-pointer"
        @click="$emit('close')"
      >
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'GalleryModal',
  props: {
    img: {
      type: String,
      default: ''
    },
    next: {
      type: Boolean,
      default: false
    },
    prev: {
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
<style scoped>
.gallery-overlay {
  @apply fixed bg-white bg-opacity-80;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
}

.gallery-picture {
  @apply fixed bg-contain bg-center bg-no-repeat rounded;
  z-index: 10001;
}

.close {
  @apply fixed;
  top: 0;
}

.arrow {
  @apply fixed;
  top: 50%;
  transform: translateY(-50%);
}

.left-arrow {
  left: 0;
}

.right-arrow {
  right: 0;
}

.gallery-padding-full {
  top: 100px;
  bottom: 100px;
  left: 100px;
  right: 100px;
}

.h-vfull {
  height: 100vh;
}

@media (min-width: 1201px) and (max-width: 1440px) {
  .gallery-padding-full {
    top: 60px;
    bottom: 60px;
    left: 60px;
    right: 60px;
  }
}

@media (max-width: 1200px) {
  .arrow {
    @apply fixed;
    top: unset;
    transform: none;
    bottom: 0px;
  }

  .close {
    @apply fixed;
    bottom: 0px;
    left: 50%;
    top: unset;
    width: 30px;
    text-align: center;
    transform: translateX(-50%);
  }

  .gallery-padding-full {
    top: 15px;
    bottom: 100px;
    left: 15px;
    right: 15px;
  }
}
</style>
