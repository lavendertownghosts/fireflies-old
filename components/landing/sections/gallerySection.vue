<template>
  <div ref="widthMac" class="py-70">
    <h2
      class="text-landingPrimary  md:text-2xl text-lg font-semibold leading-40 tracking-normal text-center mt-16 mb-0 md:mb-24 lg:mb-0 mx-12"
    >
      {{ $t('landing.rate_section_title') }}
    </h2>

    <Scroller
      v-if="featuredGalleryAfter !== undefined"
      class="overflow-visible"
      :infinite="true"
      :slot-count="
        featuredGalleryBefore.length +
          featuredGallery.length +
          featuredGalleryAfter.length -
          1
      "
      @click-event="navigator"
    >
      <div
        v-for="(image, indexBefore) in featuredGalleryBefore"
        :key="'B' + indexBefore"
        class="flex flex-row flex-none items-center text-sm leading-14 md:w-1/4 w-full md:m-30 m-15 py-128"
      >
        <div
          class="galleryCard aspect-ratio-box p-16 cursor-pointer transition duration-500 ease-in-out relative transform md:hover:scale-150"
        >
          <div
            class="aspect-ratio-content text-center w-full"
            style="borderRadius: 20px"
          >
            <div
              class="w-full h-full bg-cover bg-center"
              style="borderRadius: 20px"
              :style="{
                backgroundImage: `url('/images/gallery/` + image + `')`
              }"
            ></div>
          </div>
        </div>
      </div>

      <div
        v-for="(image, index) in featuredGallery"
        :key="index"
        class="flex flex-row flex-none items-center text-sm leading-14 md:w-1/4 w-full md:m-30 m-15 py-128"
      >
        <div
          class="galleryCard aspect-ratio-box p-16 cursor-pointer transition duration-500 ease-in-out relative transform md:hover:scale-150"
        >
          <div
            class="aspect-ratio-content text-center w-full"
            style="borderRadius: 20px"
          >
            <div
              class="w-full h-full bg-cover bg-center"
              style="borderRadius: 20px"
              :style="{
                backgroundImage: `url('/images/gallery/` + image + `')`
              }"
            ></div>
          </div>
        </div>
      </div>

      <div
        v-for="(image, indexAfter) in featuredGalleryAfter"
        :key="'A' + indexAfter"
        class="flex flex-row flex-none items-center text-sm leading-14 md:w-1/4 w-full md:m-30 m-15 py-128"
      >
        <div
          class="galleryCard aspect-ratio-box p-16 cursor-pointer transition duration-500 ease-in-out relative transform md:hover:scale-150"
        >
          <div
            class="aspect-ratio-content text-center w-full"
            style="borderRadius: 20px"
          >
            <div
              class="w-full h-full bg-cover bg-center"
              style="borderRadius: 20px"
              :style="{
                backgroundImage: `url('/images/gallery/` + image + `')`
              }"
            ></div>
          </div>
        </div>
      </div>
    </Scroller>
    <div class="flex w-full content-center">
      <LandingButton
        style-type="btn-style-1"
        class="mx-auto"
        :button-text="$t('landing.galleryMoreButton')"
        :click-handler="navigator"
      />
    </div>
  </div>
</template>

<script>
import { shuffle } from '@/includes/utils'

import Scroller from '@/components/Scroller'
import LandingButton from '@/components/landing/elements/landingButton'

export default {
  name: 'GallerySection',
  components: {
    Scroller,
    LandingButton
  },
  data() {
    return {
      galleryModal: false,
      featuredGallery: [],
      featuredGalleryBefore: [],
      featuredGalleryAfter: []
    }
  },
  created() {},
  destroyed() {},
  mounted() {
    this.importAll(
      require.context('@/static/images/gallery', false, /\.(png|jpe?g|svg)$/)
    )
  },
  methods: {
    navigator() {
      this.$router.push(this.localePath('/home/gallery'))
    },
    importAll(r) {
      r.keys().forEach((key) => {
        this.featuredGallery.push(key.slice(2))
      })

      this.featuredGallery = shuffle(this.featuredGallery)

      this.featuredGallery.length = 20

      this.featuredGalleryBefore = this.featuredGallery.slice(-3)
      this.featuredGalleryAfter = this.featuredGallery.slice(0, 3)
    }
  }
}
</script>
<style scoped>
.aspect-ratio-box {
  width: 100%; /* or any width */
  padding-top: 100%; /* same as width for 1:1 aspect ratio */
  position: relative;
  overflow: hidden;
}

.aspect-ratio-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.galleryCard {
  position: relative;
  z-index: 1;
}

.galleryCard:hover {
  z-index: 10;
}
</style>
