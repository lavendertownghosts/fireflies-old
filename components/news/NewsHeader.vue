<template>
  <div class="w-full bg-primary relative">
    <div
      class="small-hero-dark-bg w-full bg-primary flex flex-col justify-between"
      :style="{ backgroundImage: `url(${placeholderBackgroundUrl})` }"
    >
      <img
        :src="backgroundUrl"
        class="hidden"
        :alt="$t('general.TravelStatistics')"
        @load="onLoadBackgroundImage"
      />
      <div
        class="p-16 xl:px-40 max-w-screen-xl xl:min-w-xl xl:mx-auto flex flex-col flex-grow justify-center"
      >
        <div
          class="flex flex-col flex-grow justify-center min-w-full z-10 text-center"
        >
          <h1 class="text-center pb-14 px-14 text-xl text-pink">
            <span v-if="title">{{ title }}</span>
          </h1>
          <p v-if="description" class="text-center text-sm text-black">
            {{ description }}
          </p>
          <div v-if="showSocial" class="text-center">
            <a
              href="#facebook"
              rel="noopener noreferer"
              class="text-pink text-xl flex-auto p-8"
              target="_blank"
            >
              <i class="fab fa-facebook-square"></i>
            </a>
            <a
              href="#instagram"
              rel="noopener noreferer"
              class="text-pink text-xl flex-auto p-8"
              target="_blank"
            >
              <i class="fab fa-instagram"></i>
            </a>
            <a
              href="#youtube"
              rel="noopener noreferer"
              class="text-pink text-xl flex-auto p-8"
              target="_blank"
            >
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import placeholderBackgroundUrl from '~/assets/images/news-bg-small.jpg'
import backgroundUrl from '~/assets/images/news-bg.jpg'

export default {
  name: 'NewsHeader',
  components: {},
  props: {
    showSocial: {
      type: Boolean,
      default: false
    },
    title: {
      type: [String, Boolean],
      default: false
    },
    description: {
      type: [String, Boolean],
      default: false
    }
  },
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl
    }
  },
  computed: {},
  watch: {
    title: {
      handler(val) {
        this.title = val
      },
      deep: true
    },
    description: {
      handler(val) {
        this.description = val
      },
      deep: true
    }
  },
  methods: {
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    }
  }
}
</script>
