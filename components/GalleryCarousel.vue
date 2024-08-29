<template>
  <div
    class="relative w-full gallery mx-16 lg:mx-0 overflow-hidden"
    :style="carouselStyle"
  >
    <button
      class="absolute top-0 bottom-0 left-0 h-40 w-40 bg-white text-black text-center rounded center-custom-item mt-nav-button z-10 cursor-pointer opacity-75 hover:opacity-100 active:opacity-100 active:bg-black active:text-white focus:outline-none"
      @click="moveLeft"
    >
      <span>
        <i class="fal fa-chevron-left text-base font-normal"></i>
      </span>
    </button>
    <button
      class="absolute top-0 bottom-0 right-0 h-40 w-40 bg-white text-black text-center rounded center-custom-item mt-nav-button z-10 cursor-pointer opacity-75 hover:opacity-100  active:opacity-100 active:bg-black active:text-white focus:outline-none"
      @click="moveRight"
    >
      <span>
        <i class="fal fa-chevron-right text-base font-normal"></i>
      </span>
    </button>
    <div class="carousel">
      <transition-group
        name="transition-x-full"
        tag="div"
        class="flex absolute"
      >
        <div
          v-for="(item, index) in items"
          :key="item"
          :class="index > 0 && index < items.length ? 'ml-8' : ''"
          :style="itemStyle"
          class="transition transition-duration-100 relative flex justify-center items-center w-full rounded mr-8"
        >
          <div
            class="absolute top-0 bottom-0 right-0 left-0 bg-cover"
            :style="{
              backgroundImage: 'url(' + item + ')'
            }"
          ></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryCarousel',
  data() {
    return {
      items: [
        '/images/program/travel_photo.svg',
        '/images/program/travel_photo_2.svg',
        '/images/program/travel_photo_3.svg',
        '/images/program/travel_photo_4.svg',
        '/images/program/travel_photo_5.svg',
        '/images/program/travel_photo_6.svg',
        '/images/program/travel_photo_7.svg',
        '/images/program/travel_photo_8.svg',
        '/images/program/travel_photo_9.svg',
        '/images/program/travel_photo_10.svg'
      ],
      shown: 2,
      itemWidth: 152,
      itemGutter: 5,
      measurement: 'px',
      itemHeight: 114,
      innerWidth: 0
    }
  },
  computed: {
    carouselWidth() {
      return this.shown * this.itemWidth + (this.shown - 1) * 16
    },
    itemStyle() {
      return {
        width: this.itemWidth + this.measurement,
        height: this.itemHeight + this.measurement
      }
    },
    carouselStyle() {
      return {
        width: this.carouselWidth + this.measurement,
        height: this.itemHeight + this.measurement
      }
    }
  },
  mounted() {
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  methods: {
    moveRight() {
      if (this.items.length < 1) return
      const vm = this
      const removedItem = this.items.shift()
      vm.items.push(removedItem)
    },
    moveLeft() {
      if (this.items.length < 1) return
      const vm = this
      const removedItem = this.items.pop()
      vm.items.unshift(removedItem)
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
      if (this.innerWidth >= 520 && this.innerWidth < 772) {
        this.shown = 3
      } else if (this.innerWidth >= 772 && this.innerWidth < 1024) {
        this.shown = 4
        this.itemWidth = 173
        this.itemHeight = 129
      } else if (this.innerWidth >= 1024 && this.innerWidth < 1280) {
        this.shown = 6
        this.itemWidth = 152
        this.itemHeight = 114
      } else if (this.innerWidth >= 1280) {
        this.shown = 8
        this.itemWidth = 136
        this.itemHeight = 102
      }
    }
  }
}
</script>

<style>
.mt-nav-button {
  margin-top: 37px;
}
@media (min-width: 772px) and (max-width: 1023px) {
  .mt-nav-button {
    margin-top: 46px;
  }
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .mt-nav-button {
    margin-top: 37px;
  }
}
@media (min-width: 1280px) {
  .mt-nav-button {
    margin-top: 28px;
  }
}
</style>
