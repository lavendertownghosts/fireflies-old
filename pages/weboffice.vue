<template>
  <main>
    <div class="w-full h-1 bg-primary-gradient hidden md:block"></div>
    <div v-if="!isSuperFullScreenPage">
      <WebofficeQualification class="flex mb-24 md:hidden" />
      <div class="justify-start max-w-screen-xl mx-auto w-full px-16 xl:px-40">
        <div ref="webofficeMain" class="flex flex-row mt-24">
          <div class="flex flex-col hidden md:block">
            <WebofficeQualification
              class="flex w-240 mb-24 md:w-240 xl:w-288"
            />
            <WebofficeMenu
              v-if="!isFullScreenPage"
              ref="leftMenu"
              class="md:w-240 xl:w-288"
            />
          </div>
          <div
            :class="isFullScreenPage ? 'mb-24' : 'mb-56'"
            class="mx-auto w-full md:pl-16"
          >
            <WebofficeUserDetailsBox class="hidden md:block mb-24" />
            <NuxtChild
              v-if="!isFullScreenPage"
              :scrollbar-max-width="scrollbarMaxWidth"
            />
          </div>
        </div>
        <NuxtChild
          v-if="isFullScreenPage"
          :scrollbar-max-width="scrollbarMaxWidth"
          class="mb-56"
        />
      </div>
      <WebofficeFooterMenu class="md:hidden" />
    </div>
    <div v-else>
      <NuxtChild :scrollbar-max-width="scrollbarMaxWidth" class="mb-56" />
      <WebofficeFooterMenu class="md:hidden" />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import WebofficeQualification from '~/components/weboffice/WebofficeQualification'
import WebofficeUserDetailsBox from '~/components/weboffice/WebofficeUserDetailsBox'
import WebofficeFooterMenu from '~/components/weboffice/WebofficeFooterMenu'
import WebofficeMenu from '~/components/weboffice/WebofficeMenu'
import { calcRemainingTime } from '@/includes/utils'

export default {
  name: 'IndexPage',
  components: {
    WebofficeMenu,
    WebofficeFooterMenu,
    WebofficeUserDetailsBox,
    WebofficeQualification
  },
  data() {
    return {
      scrollbarMaxWidth: 0,
      fullScreenPages: [
        'loyalty-cycle/cycle-view',
        'vip-cycle-bonus-archive',
        'vip-cycle/cycle-view'
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    isFullScreenPage() {
      const fullScreenPages = [
        'loyalty-cycle/cycle-view',
        'vip-cycle-bonus-archive',
        'vip-cycle/cycle-view'
      ]

      for (let i = 0; i < fullScreenPages.length; i++) {
        if (this.$route.path.indexOf(fullScreenPages[i]) > 0) {
          return true
        }
      }
      return false
    },
    isSuperFullScreenPage() {
      const fullScreenPages = [
        'weboffice/exclusive-offers/cart',
        'weboffice/exclusive-offers/payment',
        'weboffice/exclusive-offers/reservation-failed',
        'weboffice/exclusive-offers/reservation-success',
        'weboffice/exclusive-offers/reservation-pending',
        'weboffice/discount-pass/cart',
        'weboffice/discount-pass/payment',
        'weboffice/discount-pass/reservation-failed',
        'weboffice/discount-pass/reservation-success',
        'weboffice/discount-pass/reservation-pending'
      ]

      for (let i = 0; i < fullScreenPages.length; i++) {
        if (this.$route.path.indexOf(fullScreenPages[i]) > 0) {
          return true
        }
      }
      return false
    }
  },
  mounted() {
    window.addEventListener('resize', this.calculateScrollbarMaxWidth)
    this.calculateScrollbarMaxWidth()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateScrollbarMaxWidth)
  },
  methods: {
    calcRemainingTime,
    calculateScrollbarMaxWidth() {
      if (this.$refs.webofficeMain !== undefined) {
        const leftMenuWidth =
          this.$refs.leftMenu !== undefined ? this.$refs.leftMenu : 0
        this.scrollbarMaxWidth =
          this.$refs.webofficeMain.clientWidth -
          leftMenuWidth -
          (leftMenuWidth > 0 ? 16 : 0)

        if ((this.scrollbarMaxWidth >= 896) | isNaN(this.scrollbarMaxWidth)) {
          this.scrollbarMaxWidth = 896
        }
      }
    }
  }
}
</script>

<style>
.text-gold {
  color: #ddab6c;
}

.bg-gold {
  background-color: #ddab6c;
}

.bg-gold-light {
  background-color: #fffcf7;
}

.border-gold {
  border-color: #ddab6c;
}

.parallax-bg {
  background-image: url('~assets/images/ff-logo-large-opaque.svg'),
    linear-gradient(
      90deg,
      rgba(16, 80, 127, 0.6) 0.35%,
      rgba(0, 173, 181, 0.6) 100%
    );
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  mix-blend-mode: normal;
}
</style>
