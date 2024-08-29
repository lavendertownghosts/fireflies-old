<template>
  <div class="tooltip relative inline-block">
    <i :class="tooltipIconStyle" class="far fa-info-circle cursor-pointer"></i>
    <div
      ref="tooltipText"
      :class="tooltipStyle"
      :style="'margin-left:' + marginLeft + 'px'"
      class="tooltiptext absolute px-8 py-4 z-10 bg-white rounded text-black shadow-drop text-center"
    >
      {{ tooltipText }}
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    tooltipText: {
      type: String,
      required: true
    },
    tooltipStyle: {
      type: Array,
      default() {
        return ['w-128']
      }
    },
    position: {
      type: String,
      default: 'center'
    },
    tooltipIconStyle: {
      type: Array,
      default() {
        return ['text-primary hover:text-primary-dark']
      }
    },
    fixLeftMargin: {
      type: [Boolean, Number],
      default: false
    }
  },
  data() {
    return {
      marginLeft: 0
    }
  },
  mounted() {
    if (this.fixLeftMargin !== false) {
      this.marginLeft = this.fixLeftMargin
    } else if (this.position === 'center') {
      this.marginLeft =
        -1 * (parseFloat(this.$refs.tooltipText.clientWidth) / 2)
    } else if (this.position === 'left') {
      this.marginLeft = -1 * parseFloat(this.$refs.tooltipText.clientWidth)
    } else {
      this.marginLeft = parseFloat(this.$refs.tooltipText.clientWidth)
    }
  }
}
</script>

<style scoped>
.tooltiptext {
  visibility: hidden;
  left: 50%;
}
.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
