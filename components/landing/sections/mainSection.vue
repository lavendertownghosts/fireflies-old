<template>
  <div>
    <div class="md:h-88 h-48 bg-grey-lighter"></div>
    <div
      class="z-1 relative main-section bg-cover bg-center bg-no-repeat mix-blend-normal"
      :style="{
        backgroundImage: checkIfMobileUser
          ? 'url(/images/landing/main/portrait-pretty-romantic-couple-having-fun-tropical-islands.svg)'
          : 'none'
      }"
    >
      <video
        v-if="!checkIfMobileUser"
        class="header-video"
        autoplay
        loop
        muted
        playsinline
        poster="/images/landing/fireflies-bg-min-min.jpg"
      >
        <source
          src="/images/landing/main/fireflies_video.mp4"
          type="video/mp4"
        />
      </video>
      <header
        class="flex items-center justify-between flex-wrap px-8 xl:px-34 max-w-screen-xl mx-auto "
      >
        <div class="logo flex items-center">
          <img src="/images/landing/fireflies_logo_secondary.svg" alt="logo" />
        </div>
        <nav class="menu flex items-center hidden md:flex">
          <div
            class="block flex items-center rounded-full bg-landingButtonBackground text-white py-8 my-32 md:my-0 md:mx-12 md:inline-block uppercase cursor-pointer"
          >
            <div class="flex pl-4 pr-4 ml-4 mr-4" @click="showLanguageSelect">
              <div ref="languageSelect">
                {{ currentLanguage }}
              </div>
              <div class="arrow"></div>
            </div>
            <div
              v-show="languageSelectActive"
              class="relative hidden md:inline"
            >
              <div
                class="absolute right-0 top-4 bg-white rounded text-white shadow-drop flex flex-col text-base leading-16 z-40 w-177"
              >
                <div
                  v-for="(locale, index) in availableLocales"
                  :key="locale.code"
                  :class="
                    index !== availableLocales.length - 1 ? 'border-b ' : ''
                  "
                  class="flex flex-row px-12 py-16 border-grey-light hover:bg-primary-opaque"
                  @click="changeLang(locale.code)"
                >
                  <div>
                    <img :src="flagImages[locale.code]" />
                  </div>
                  <div class="font-normal text-primary normal-case ml-8">
                    {{ getLanguageName(locale.code) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="mx-8 rounded-full px-8 py-9 bg-landingButtonBackground text-white"
            @click="$router.push(localePath('support'))"
          >
            {{ $t('general.CustomerService') }}
          </button>
          <button
            class="mx-8 rounded-full px-8 py-9 bg-landingButtonBackground text-white"
            @click="loginModalActive = true"
          >
            {{ $t('general.SignIn') }}
          </button>
        </nav>
        <nav class="md:hidden mr-5 flex items-start flex-col">
          <button
            class="burger flex items-center inline-block text-white"
            @click="toggle"
          >
            <i
              :class="open ? 'far fa-times text-xl' : 'far fa-bars text-xl'"
            ></i>
          </button>
        </nav>
        <DefaultModal
          v-show="loginModalActive"
          :modal-max-width="'336px'"
          @close="loginModalActive = false"
        >
          <div slot="header">
            <div class="flex w-full text-black mt-8">
              <div class="flex flex-grow text-lg font-bold leading-24">
                {{ $t('general.SignIn') }}
              </div>
              <div class="flex items-center">
                <i
                  class="fas fa-times opacity-50 cursor-pointer"
                  @click="loginModalActive = false"
                ></i>
              </div>
            </div>
          </div>
          <div slot="body" class="mt-24">
            <LoginForm @login="loginSuccess" />
          </div>
          <div slot="footer"></div>
        </DefaultModal>
      </header>
      <nav class="md:hidden mr-5 flex items-end flex-col">
        <div
          v-if="open"
          class="flex flex-col items-start p-10 bg-black bg-opacity-75"
        >
          <div
            class="block text-white my-2 mx-8 md:inline-block uppercase cursor-pointer"
          >
            <div ref="languageSelect" @click="showLanguageSelect">
              {{ currentLanguage }}
            </div>
            <div v-show="languageSelectActive" class="relative  md:inline">
              <div
                class="absolute right-0 top-4 bg-white rounded text-white shadow-drop flex flex-col text-base leading-16 z-40 w-177"
              >
                <div
                  v-for="(locale, index) in availableLocales"
                  :key="locale.code"
                  :class="
                    index !== availableLocales.length - 1 ? 'border-b ' : ''
                  "
                  class="flex flex-row px-12 py-16 border-grey-light hover:bg-primary-opaque"
                  @click="changeLang(locale.code)"
                >
                  <div>
                    <img :src="flagImages[locale.code]" />
                  </div>
                  <div class="font-normal text-primary normal-case ml-8">
                    {{ getLanguageName(locale.code) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="mx-8 text-3x text-white"
            @click="$router.push(localePath('support'))"
          >
            {{ $t('general.CustomerService') }}
          </button>
          <button
            class="mx-8 text-3x text-white"
            @click="loginModalActive = true"
          >
            {{ $t('general.SignIn') }}
          </button>
        </div>
      </nav>

      <div
        class="section-body text-white px-8 xl:px-34 max-w-screen-xl md:-mt-100 flex items-center justify-between flex-wrap mx-auto min-h-screen"
      >
        <div class="text-content max-w-lg ml-24">
          <h1
            class="big-text text-2xl md:text-3xl lg:text-4xl lg:leading-70 sm:leading-40 md:leading-56"
          >
            {{ $t('landing.main_section_title') }}
          </h1>
          <div class="smaller-text text-lg mt-8">
            {{ $t('landing.main_section_description') }}
          </div>
          <h2 class="flex flex-col md:flex-row mt-12">
            <LandingButton
              class="mr-4 mt-5"
              style-type="btn-style-1"
              :button-text="$t('landing.main_section_button_main')"
              :click-handler="jumpToCoco"
            />
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import LandingButton from '@/components/landing/elements/landingButton'
import DefaultModal from '@/components/modal/DefaultModal'
import LoginForm from '@/components/forms/LoginForm'
import { getLanguageName, isMobileUser } from '@/includes/utils'

import enFlag from '@/assets/images/flags/en.png'
import huFlag from '@/assets/images/flags/hu.png'
import skFlag from '@/assets/images/flags/sk.png'
import esFlag from '@/assets/images/flags/es.png'
import czFlag from '@/assets/images/flags/cz.png'
import roFlag from '@/assets/images/flags/ro.png'
import ruFlag from '@/assets/images/flags/ru.png'
import deFlag from '@/assets/images/flags/de.png'
import plFlag from '@/assets/images/flags/pl.png'
import trFlag from '@/assets/images/flags/tr.png'

export default {
  components: {
    LandingButton,
    DefaultModal,
    LoginForm
  },
  data() {
    return {
      open: false,
      loginModalActive: false,
      languageSelectActive: false,
      flagImages: {
        en: enFlag,
        hu: huFlag,
        cs: czFlag,
        es: esFlag,
        sk: skFlag,
        ro: roFlag,
        ru: ruFlag,
        de: deFlag,
        pl: plFlag,
        tr: trFlag
      }
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale === 'cs' ? 'cz' : this.$i18n.locale
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    checkIfMobileUser() {
      return isMobileUser() // Use the imported isMobileUser function here
    }
  },
  methods: {
    async changeLang(code) {
      if (this.isLoggedIn) {
        try {
          await this.$store.dispatch('user/setLang', {
            lang: code
          })
        } catch (e) {}
      }
      this.$router.replace(this.switchLocalePath(code))
    },
    jumpToCoco() {
      console.log('should scroll')
      this.$scrollTo('#coco-boxes')
    },
    toggle() {
      this.open = !this.open
    },
    loginSuccess() {
      this.navigateTo('/home')
    },
    navigateTo(path) {
      if (this.open) {
        this.toggle()
      }
      this.$router.push(this.localePath(path))
    },
    showLanguageSelect() {
      this.languageSelectActive = !this.languageSelectActive
    },
    getLanguageName,
    ...mapMutations({
      resetState: 'user/resetState',
      resetTravelAssistantState: 'travel-assistant/resetState'
    })
  }
}
</script>

<style scoped>
body {
  min-height: 137vh;
}
.header-video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
}
.arrow:after {
  content: '';
  margin: 0 0.5em;
  display: inline-block;
  border: 7px solid transparent;
  border-top: 8px solid white;
  border-bottom: 0 none;
}
</style>
