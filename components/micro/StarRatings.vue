<template>
  <div class="flex-initial">
    <sup v-if="stars > 0 && position === 'sup'">
      <i
        v-for="star in stars"
        :key="star"
        class="fas fa-star"
        :class="starClass ? starClass : 'text-2xs'"
      ></i>
    </sup>
    <div
      v-if="stars > 0 && position === 'center'"
      class="h-18 flex flex-row items-center justify-start"
    >
      <i
        v-for="star in getStarNumber"
        :key="star"
        class="fas fa-star"
        :class="starClass ? starClass : 'text-2xs'"
      ></i>
      <i
        v-if="getStarNumber < stars"
        :class="starClass ? starClass : 'text-2xs'"
        class="fad fa-star-half"
      ></i>
      <i
        v-for="star in getMaxHiddenStarNumber"
        :key="star + maxStar"
        class="fas fa-star"
        :class="'text-2xs text-grey-light'"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StarRatings',
  props: {
    stars: {
      type: Number,
      required: true
    },
    starClass: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'sup'
    },
    maxStar: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getStarNumber() {
      return Math.floor(this.stars)
    },
    getMaxHiddenStarNumber() {
      if (this.maxStar > 0) {
        return Math.floor(this.maxStar - this.stars)
      }
      return 0
    }
  }
}
</script>
<style scoped>
.fad.fa-star-half:after {
  opacity: 1;
  @apply text-grey-light;
}
</style>
