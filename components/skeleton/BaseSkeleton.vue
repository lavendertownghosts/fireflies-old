<template>
  <span :style="{ height, width }" class="skeleton-box rounded" />
</template>

<script>
export default {
  name: 'BaseSkeleton',
  props: {
    maxWidth: {
      default: 100,
      type: Number
    },
    minWidth: {
      default: 100,
      type: Number
    },
    height: {
      default: '1em',
      type: String
    },
    width: {
      default: false,
      type: [String, Boolean]
    }
  }
}
</script>

<style lang="scss">
.skeleton-box {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  background-color: #e8eaec;
}
</style>
