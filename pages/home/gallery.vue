<template>
  <div>
    <div class="flex flex-col p-0 xl:px-40 max-w-screen-xl mx-auto">
      <div class="relative">
        <TopSection />
        <div class="md:mt-100 mt-52 pt-15">
          <div
            class="flex flex-row mt-4 cursor-pointer sm:pl-40 pl-32"
            @click="$router.push(localePath('/'))"
          >
            <i class="fa fa-chevron-left text-primary text-sm leading-14"></i>
            <p class="ml-8 text-sm leading-14 link font-bold">
              {{ $t('general.Back') }}
            </p>
          </div>
        </div>
        <div class="grid lg:grid-cols-3 grid-cols-1 gap-32 px-32 py-64 pt-34">
          <div v-for="(image, index) in gallery" :key="index">
            <div
              class="aspect-ratio-box p-16 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
              @click="
                galleryModal = true
                current = index
              "
            >
              <div
                class="aspect-ratio-content text-center"
                style="borderRadius: 20px"
              >
                <div
                  class="galleryCard w-full h-full bg-cover bg-center"
                  style="borderRadius: 20px"
                  :style="{
                    backgroundImage: `url('/images/gallery/` + image + `')`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <footerSection />
        <Snackbar
          v-if="getSnackbar"
          :message="
            getSnackbar !== false &&
            getSnackbar !== undefined &&
            getSnackbar.message !== undefined
              ? getSnackbar.message
              : ''
          "
          :bg-color="getSnackbar.bgColor"
          :undo-button="getSnackbar.undoButton"
          :undo-event="getSnackbar.undoEvent"
        />
      </div>
    </div>
    <GalleryModal
      v-if="galleryModal"
      :img="'/images/gallery/' + gallery[current]"
      :next="gallery[current + 1] !== undefined"
      :prev="gallery[current - 1] !== undefined"
      @close="galleryModal = false"
      @prev="current = current - 1"
      @next="current = current + 1"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import GalleryModal from '@/components/modal/GalleryModal'
import TopSection from '@/components/landing/sections/topSection'
import FooterSection from '@/components/landing/sections/footerSection'
import Snackbar from '@/components/snackbar/Snackbar'

export default {
  layout: 'blank',
  middleware: 'auth_needed',
  name: 'LandingGallery',
  components: {
    GalleryModal,
    FooterSection,
    TopSection,
    Snackbar
  },
  data() {
    return {
      gallery: [],
      current: 0,
      galleryModal: false
    }
  },
  computed: {
    ...mapGetters('general', ['getSnackbar'])
  },
  mounted() {
    this.importAll(
      require.context('@/static/images/gallery', false, /\.(png|jpe?g|svg)$/)
    )
    this.$store.commit('general/setSnackbar', false)
  },
  methods: {
    importAll(r) {
      r.keys().forEach((key) => {
        this.gallery.push(key.slice(2))
      })
    }
  },
  head() {
    return {
      title: 'Fireflies • ' + this.$t('meta.HomeTitle'),
      meta: [
        {
          property: 'og:title',
          content: 'Fireflies • ' + this.$t('meta.HomeTitle')
        },
        {
          property: 'twitter:title',
          content: 'Fireflies • ' + this.$t('meta.HomeTitle')
        },
        {
          property: 'og:description',
          content: this.$t('meta.HomeDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.HomeDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.HomeDescription')
        }
      ]
    }
  }
}
</script>

<style>
html,
body {
  min-height: 100vh;
  overflow-x: hidden;
}
.section {
  min-height: 110vh;
}
html,
body {
  font-family: Nunito, nunito, sans-serif;
}

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
</style>
