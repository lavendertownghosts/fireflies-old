<template>
  <div>
    <div class="bg-grey-light relative w-full gallery md:rounded">
      <div
        class="absolute top-0 bottom-0 right-0 left-0 w-full text-center center-custom-item -mt-16"
      >
        <i class="far fa-image-polaroid text-xl"></i>
      </div>
      <button
        v-show="images.length > 1"
        class="absolute top-0 bottom-0 left-0 h-40 w-40 bg-white text-black text-center rounded center-custom-item ml-16 -mt-20 z-10 cursor-pointer opacity-75 hover:opacity-100 active:opacity-100 active:bg-black active:text-white focus:outline-none"
        @click="prevImage"
      >
        <span>
          <i class="fal fa-chevron-left text-base font-normal"></i>
        </span>
      </button>
      <button
        v-show="images.length > 1"
        class="absolute top-0 bottom-0 right-0 h-40 w-40 bg-white text-black text-center rounded center-custom-item mr-16 -mt-20 z-10 cursor-pointer opacity-75 hover:opacity-100  active:opacity-100 active:bg-black active:text-white focus:outline-none"
        @click="nextImage"
      >
        <span>
          <i class="fal fa-chevron-right text-base font-normal"></i>
        </span>
      </button>
      <div
        v-if="images[index]"
        class="absolute top-0 bottom-0 right-0 left-0 bg-cover md:rounded"
        :style="{ backgroundImage: 'url(' + images[index] + ')' }"
      >
        <img
          :src="images[index]"
          class="hidden"
          @error="removeElement(index)"
        />
      </div>
      <div
        v-show="false"
        v-if="images[nextIndex]"
        :style="{ backgroundImage: 'url(' + images[nextIndex] + ')' }"
      >
        <img
          :src="images[nextIndex]"
          class="hidden"
          @error="removeElement(nextIndex)"
        />
      </div>
      <div
        v-show="false"
        v-if="images[prevIndex]"
        :style="{ backgroundImage: 'url(' + images[prevIndex] + ')' }"
      >
        <img
          :src="images[prevIndex]"
          class="hidden"
          @error="removeElement(prevIndex)"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GalleryBox',
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      index: 0,
      nextIndex: 0,
      prevIndex: 0
    }
  },
  mounted() {
    if (this.images.length > 1) {
      this.nextIndex = 1
      this.prevIndex = this.images.length - 1
    } else {
      this.nextIndex = 0
      this.prevIndex = 0
    }
  },
  methods: {
    nextImage() {
      const indexTmp = this.index + 1
      if (indexTmp > this.images.length - 1) {
        this.index = 0
      } else {
        this.index = indexTmp
      }
      this.calculateIndexes()
    },
    prevImage() {
      const indexTmp = this.index - 1
      if (indexTmp < 0) {
        this.index = this.images.length - 1
      } else {
        this.index = indexTmp
      }
      this.calculateIndexes()
    },
    calculateIndexes() {
      if (this.index + 1 < this.images.length - 1) {
        this.nextIndex = this.index + 1
      } else {
        this.nextIndex = 0
      }
      if (this.index - 1 > 0) {
        this.prevIndex = this.index - 1
      } else {
        this.prevIndex = this.images.length - 1
      }
    },
    removeElement(index) {
      console.log(
        'Image not found, deleted from carousel: ' + this.images[index]
      )
      this.images.splice(index, 1)
      this.calculateIndexes()
    }
  }
}
</script>

<style scoped>
.gallery {
  padding-top: 75%;
}
.center-custom-item {
  top: 50%;
}
</style>
