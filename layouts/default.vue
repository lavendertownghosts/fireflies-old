<template>
  <div
    class="font-body min-h-screen flex flex-col justify-between
     text-grey-dark"
  >
    <div
      v-if="false"
      class="w-full p-16 xl:px-40 bg-primary text-white flex flex-row justify-center text-3x"
    >
      <div class="text-center mr-5">{{ $t('general.TopCounterText') }}</div>
      <CountDown class="text-center font-bold" :end-date="'2022-05-04 10:00'" />
    </div>
    <NotificationBar />
    <Navbar />
    <nuxt />
    <Footer />
    <InformativeModal
      v-if="!browserSupported"
      v-show="browserNotSupportedModalActive"
      :accept-button="'OK'"
      :link-button="''"
      @accept="browserNotSupportedModalActive = false"
    >
      <div slot="body">
        {{ $t('general.BrowserNotSupported') }}
      </div>
    </InformativeModal>
    <InformativeModal
      v-if="getPopup"
      :accept-button="
        getPopup.acceptText !== undefined ? getPopup.acceptText : null
      "
      :link-button="
        getPopup.disableCancel == undefined ? $t('general.Cancel') : ''
      "
      @cancel="$store.commit('general/setPopup', false)"
      @accept="
        getPopup.url !== undefined
          ? ($router.push(localePath(getPopup.url)),
            $store.commit('general/setPopup', false))
          : $store.commit('general/setPopup', false)
      "
    >
      <div slot="body" class="mb-16">
        <div
          v-if="getPopup.title !== undefined"
          class="flex w-full text-black mb-12"
        >
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ getPopup.title }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="$store.commit('general/setPopup', false)"
            ></i>
          </div>
        </div>
        <p>
          {{ getPopup.message }}
        </p>
      </div>
    </InformativeModal>
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

import { browserSupported } from '~/includes/browserdetect'

import NotificationBar from '@/components/NotificationBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Snackbar from '@/components/snackbar/Snackbar'
import InformativeModal from '@/components/modal/InformativeModal'
import CountDown from '@/components/micro/CountDown'

export default {
  name: 'DefaultLayout',
  middleware: ['auth_needed', 'redirect'],
  components: {
    InformativeModal,
    NotificationBar,
    Navbar,
    Footer,
    Snackbar,
    CountDown
  },
  data() {
    return {
      showCountdown: true,
      browserNotSupportedModalActive: true
      /* isIdle: false */
    }
  },
  computed: {
    ...mapGetters('general', ['getSnackbar', 'getPopup']),
    browserSupported() {
      return browserSupported()
    }
  },
  mounted() {
    /* this.$idle.$on('idle', () => {
      this.isIdle = true
    })

    this.$idle.$on('reset', () => {
      if (this.isIdle === true) {
        this.isIdle = false
        window.location.reload()
      }
    }) */

    this.$store.commit('general/setSnackbar', false)
  },
  errorCaptured(error) {
    console.log(error)
    if (error !== undefined && String(error) !== 'Expired token') {
      this.$store.dispatch('general/showSnackbar', {
        message: String(error)
      })
    }
    return false // prevent Nuxt from handling the error
  }
}
</script>

<style lang="postcss">
.link {
  @apply text-primary;
}

.link:hover {
  @apply text-primary-dark;
  @apply underline;
}

.link:active {
  @apply text-primary-light;
}

.link:focus {
  @apply text-black;
}

.link:disabled {
  @apply text-grey;
}

.link-dark {
  @apply text-pink;
}

.link-dark:hover {
  @apply text-pink-dark;
  @apply underline;
}

.link-dark:active {
  @apply text-pink-light;
}

.link-dark:focus {
  @apply text-white;
}

.link-dark:disabled {
  @apply text-grey;
}

.link-danger {
  @apply text-danger;
}

.link-danger:hover {
  @apply text-danger-dark;
  @apply underline;
}

.link-danger:active {
  @apply text-danger-light;
}

.link-danger:focus {
  @apply text-black;
}

.link-danger:disabled {
  @apply text-grey;
}

.link-warning {
  @apply text-warning;
}

.link-warning:hover {
  @apply text-warning-dark;
  @apply underline;
}

.link-warning:active {
  @apply text-warning-light;
}

.link-warning:focus {
  @apply text-black;
}

.link-warning:disabled {
  @apply text-grey;
}

.ff-currency {
  @apply absolute;
  @apply w-16;
  @apply h-16;
  @apply bg-danger;
  @apply rounded-full;
  @apply opacity-20;
  @apply ml-2;
}

.ff-currency.bg-black {
  @apply bg-black;
  @apply w-13;
  @apply h-13;
}

.ff-currency.bg-white {
  @apply bg-white;
  @apply opacity-20;
}

.ff-currency.bg-warning {
  @apply bg-warning;
  @apply opacity-20;
}

.ff-currency.bg-grey-dark {
  @apply bg-grey-dark;
  @apply ml-2;
  @apply h-12;
  @apply w-14;
}
.ff-currency.bpo {
  @apply ml-8;
}

.pulse-me {
  animation: pulsate 3s ease-out;
  animation-iteration-count: infinite;
  opacity: 0.5;
}
@keyframes pulsate {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.bg-primary-gradient {
  background: linear-gradient(90deg, #10507f 0.35%, #00adb5 100%);
}

.-webkit-box {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bg-white-to-black-gradient {
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}

.bg-black-to-white-gradient {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
}
.text-shadow {
  text-shadow: 1px 1px #393e46;
}

.vue-map {
  @apply h-full;
}

.content img {
  @apply py-16;
}

.content h2,
.content h3,
.content h4 {
  @apply py-16;
  @apply text-black;
  @apply font-bold;
}

.content h2 {
  @apply text-3x;
}

.content h3 {
  @apply text-2x;
}

.content h4 {
  @apply text-base;
}

.content ul {
  @apply list-disc;
  @apply px-24;
}

.content ol {
  @apply list-decimal;
  @apply px-24;
}

.content blockquote {
  @apply p-24;
  @apply my-15;
  @apply border-l-4;
  @apply border-grey-light;
}

.content a {
  @apply link;
}

.content a:hover {
  @apply link;
  @apply underline;
}

.small-hero-dark-bg {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 162px;
}
.small-hero-dark-bg::before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-image: url('~assets/images/ff-logo-large-opaque-dark.svg');
  background-repeat: no-repeat;
  background-position: 45% 20%;
}
@media (min-width: 520px) and (max-width: 772px) {
  .small-hero-dark-bg::before {
    background-position: 45% 20%;
  }
}
@media (min-width: 772px) and (max-width: 1023px) {
  .small-hero-dark-bg::before {
    background-position: 40% 25%;
  }
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .small-hero-dark-bg::before {
    background-position: 120% 20%;
  }
}
@media (min-width: 1280px) {
  .small-hero-dark-bg::before {
    background-position: 0 26%;
  }
}
@media (min-width: 1330px) {
  .small-hero-dark-bg::before {
    background-position: 35% 20%;
  }
}
</style>
