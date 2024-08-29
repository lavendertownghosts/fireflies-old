<template>
  <div
    :class="[isNarrow ? 'skeleton-wrapper-narrow' : 'skeleton-wrapper-wide']"
    class="z-20 absolute top-0 bottom-0 left-0 right-0"
  >
    &nbsp;
  </div>
</template>

<script>
export default {
  name: 'ShimmerLayer',
  props: {
    isNarrow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.skeleton-wrapper-wide {
  background-size: 1000px 100%;
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, -0.6) 50%,
    hsla(0, 0%, 100%, 0.9) 80%,
    hsla(0, 0%, 100%, 0)
  );
  animation: shimmerWide 3s infinite linear;
  will-change: transform;
}
@keyframes shimmerWide {
  0% {
    transform: translateX(-1000px);
  }
  100% {
    transform: translateX(1000px);
  }
}

.skeleton-wrapper-narrow {
  background-size: 500px 100%;
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, -0.6) 50%,
    hsla(0, 0%, 100%, 0.9) 80%,
    hsla(0, 0%, 100%, 0)
  );
  animation: shimmerNarrow 3s infinite linear;
  will-change: transform;
}
@keyframes shimmerNarrow {
  0% {
    transform: translateX(-500px);
  }
  100% {
    transform: translateX(500px);
  }
}
</style>
