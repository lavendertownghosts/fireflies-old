<template>
  <div class="VueCarousel-navigation">
    <button
      type="button"
      aria-label="Previous page"
      :tabindex="canAdvanceBackward ? 0 : -1"
      class="VueCarousel-navigation-button VueCarousel-navigation-prev"
      :class="{ 'VueCarousel-navigation--disabled': !canAdvanceBackward }"
      :style="
        `padding: ${clickTargetSize}px; margin-right: -${clickTargetSize}px;`
      "
      @click.prevent="triggerPageAdvance('backward')"
      v-html="prevLabel"
    ></button>
    <button
      type="button"
      aria-label="Next page"
      :tabindex="canAdvanceForward ? 0 : -1"
      class="VueCarousel-navigation-button VueCarousel-navigation-next"
      :class="{ 'VueCarousel-navigation--disabled': !canAdvanceForward }"
      :style="
        `padding: ${clickTargetSize}px; margin-left: -${clickTargetSize}px;`
      "
      @click.prevent="triggerPageAdvance('forward')"
      v-html="nextLabel"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  inject: ['carousel'],
  props: {
    /**
     * Amount of padding to apply around the label in pixels
     */
    clickTargetSize: {
      type: Number,
      default: 8
    },
    /**
     * Text content of the navigation next button
     */
    nextLabel: {
      type: String,
      default: '&#9654'
    },
    /**
     * Text content of the navigation prev button
     */
    prevLabel: {
      type: String,
      default: '&#9664'
    }
  },
  computed: {
    /**
     * @return {Boolean} Can the slider move forward?
     */
    canAdvanceForward() {
      return this.carousel.canAdvanceForward || false
    },
    /**
     * @return {Boolean} Can the slider move backward?
     */
    canAdvanceBackward() {
      return this.carousel.canAdvanceBackward || false
    }
  },
  methods: {
    /**
     * Trigger page change on +/- 1 depending on the direction
     * @param {"backward"} [direction]
     * @return {void}
     */
    triggerPageAdvance(direction) {
      /**
       * @event paginationclick
       * @type {string}
       */
      this.$emit('navigationclick', direction)
    }
  }
}
</script>

<style scoped>
.VueCarousel-navigation-button {
  position: absolute;
  top: 50%;
  box-sizing: border-box;
  color: #000;
  text-decoration: none;
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.VueCarousel-navigation-button:focus {
  outline: 1px solid lightblue;
}

.VueCarousel-navigation-next {
  right: 0;
  transform: translateY(-50%) translateX(100%);
  font-family: 'system';
}

.VueCarousel-navigation-prev {
  left: 0;
  transform: translateY(-50%) translateX(-100%);
  font-family: 'system';
}

.VueCarousel-navigation--disabled {
  opacity: 0.5;
  cursor: default;
}

/* Define the "system" font family */
@font-face {
  font-family: system;
  font-style: normal;
  font-weight: 300;
  src: local('.SFNSText-Light'), local('.HelveticaNeueDeskInterface-Light'),
    local('.LucidaGrandeUI'), local('Ubuntu Light'), local('Segoe UI Symbol'),
    local('Roboto-Light'), local('DroidSans'), local('Tahoma');
}
</style>
