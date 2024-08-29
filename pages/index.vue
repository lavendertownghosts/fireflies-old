<template>
  <div class="relative">
    <TopSection />
    <MainSection />
    <TravelStatistics />
    <CocoSection />
    <PalmSection />
    <OfferSection />
    <MapSection />
    <RateSection id="rateSection" />
    <GallerySection />
    <CommentSection id="commentSection" />
    <PartnerSection />
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
</template>

<script>
import { mapGetters } from 'vuex'

import PalmSection from '@/components/landing/sections/palmSection'
import CocoSection from '@/components/landing/sections/cocoSection'
import TopSection from '@/components/landing/sections/topSection'
import MainSection from '@/components/landing/sections/mainSection'
import TravelStatistics from '@/components/landing/sections/TravelStatistics'
import GallerySection from '@/components/landing/sections/gallerySection'
import MapSection from '@/components/landing/sections/mapSection'
import OfferSection from '@/components/landing/sections/offerSection'
import RateSection from '@/components/landing/sections/rateSection'
import CommentSection from '@/components/landing/sections/commentSection'
import PartnerSection from '@/components/landing/sections/partnerSection'
import FooterSection from '@/components/landing/sections/footerSection'

import Snackbar from '@/components/snackbar/Snackbar'

export default {
  layout: 'blank',
  middleware: 'auth_needed',
  name: 'IndexPage',
  components: {
    CocoSection,
    MainSection,
    TravelStatistics,
    GallerySection,
    TopSection,
    PalmSection,
    MapSection,
    OfferSection,
    RateSection,
    CommentSection,
    PartnerSection,
    FooterSection,
    Snackbar
  },
  computed: {
    ...mapGetters('general', ['getSnackbar'])
  },
  mounted() {
    this.$store.commit('general/setSnackbar', false)
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
</style>
