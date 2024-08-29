<template>
  <div v-if="maxPages && maxPages > 0" class="flex flex-row">
    <ButtonSmall
      type="inverted"
      :is-disabled="currentPage - 1 < 1 ? true : false"
      class="w-40 h-40 flex items-center justify-center mx-4"
      @click="currentPage - 1 > 0 ? $emit('click', currentPage - 1) : ''"
    >
      <i class="fa fa-chevron-left"></i>
    </ButtonSmall>

    <div v-for="(pagination, index) in pagination_values" :key="index">
      <span
        v-show="pagination === 'dotdotdot'"
        class="h-40 flex items-center justify-center mx-4 text-black"
      >
        &hellip;
      </span>
      <ButtonSmall
        v-show="pagination !== 'dotdotdot'"
        :type="currentPage === pagination ? 'inverted-black' : 'inverted'"
        class="w-40 h-40 flex items-center justify-center mx-4"
        @click="currentPage !== pagination ? $emit('click', pagination) : ''"
      >
        <span>{{ pagination }}</span>
      </ButtonSmall>
    </div>

    <ButtonSmall
      :is-disabled="currentPage === maxPages ? true : false"
      type="inverted"
      class="w-40 h-40 flex items-center justify-center mx-4"
      @click="currentPage !== maxPages ? $emit('click', currentPage + 1) : ''"
    >
      <i class="fa fa-chevron-right"></i>
    </ButtonSmall>
  </div>
</template>

<script>
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'Pagination',
  components: {
    ButtonSmall
  },
  props: {
    currentPage: {
      type: [Number, Boolean],
      default: false
    },
    maxPages: {
      type: [Number, Boolean],
      default: false
    }
  },
  computed: {
    pagination_values() {
      let delta = 0
      if (
        this.currentPage === 1 ||
        this.currentPage === this.maxPages ||
        window.innerWidth > 520
      ) {
        delta = 2
      } else if (
        this.currentPage === 2 ||
        this.currentPage === this.maxPages - 1
      ) {
        delta = 1
      }

      const left = this.currentPage - delta
      const right = this.currentPage + delta + 1
      const range = []
      const rangeWithDots = []
      let temp

      for (let i = 1; i <= this.maxPages; i++) {
        if (i === 1 || i === this.maxPages || (i >= left && i < right)) {
          range.push(i)
        }
      }

      for (const i of range) {
        if (temp) {
          if (i - temp === 2) {
            rangeWithDots.push(temp + 1)
          } else if (i - temp !== 1) {
            rangeWithDots.push('dotdotdot')
          }
        }
        rangeWithDots.push(i)
        temp = i
      }

      return rangeWithDots
    }
  }
}
</script>
