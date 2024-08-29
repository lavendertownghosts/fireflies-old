<template>
  <header>
    <TravelAssistant
      v-show="isLoggedIn"
      :travel-assistant-visible="travelAssistantVisible"
      :active-travel-assistant="activeTravelAssistant"
      :travel-assistants="
        getTravelAssistants !== undefined && getTravelAssistants !== false
          ? getTravelAssistants
          : []
      "
      :updating="updating"
      :count-active-service="countActiveTravelAssistantServices"
      @changeActiveTravelAssistant="activeTravelAssistant = $event"
      @showTravelAssistant="showTravelAssistant"
    />
    <div :class="open ? 'h-full fixed' : 'h-64'" class="w-full z-20 bg-white">
      <nav
        class="flex items-center justify-between flex-wrap max-w-screen-xl mx-auto"
        :class="!open ? 'h-full' : 'mt-5'"
      >
        <div class="flex items-center flex-shrink-0 ml-16 xl:ml-40 order-first">
          <nuxt-link :to="localePath('/')" class="relative">
            <img class="fill-current" src="~assets/images/ff-logo-header.svg" />
          </nuxt-link>
        </div>
        <div
          :class="open ? 'block' : 'hidden'"
          class="w-full flex-grow md:hidden bg-white h-5 shadow-list z-20 order-2 md:order-1"
        ></div>
        <div
          :class="open ? 'block' : 'hidden'"
          class="w-full flex-grow md:flex md:items-center md:w-auto bg-white order-3 md:order-2"
        >
          <div
            class="text-sm text-center md:text-right leading-14 md:flex-grow text-black"
          >
            <div
              v-show="isLoggedIn"
              class="block py-8 my-32 md:my-0 md:mr-12 md:inline-block cursor-pointer"
              @click="
                navigateTo(
                  isDistributor ? '/weboffice' : '/weboffice/personal-data'
                )
              "
            >
              {{
                isDistributor ? $t('general.WebOffice') : $t('general.Profile')
              }}
            </div>
            <div
              class="block py-8 my-32 md:my-0 md:mx-12 md:inline-block cursor-pointer"
              @click="navigateTo('/statistics')"
            >
              {{ $t('general.TravelStatistics') }}
            </div>

            <div
              v-if="isNewsEnabled"
              class="block md:my-0 md:mx-12 md:inline-block h-24 cursor-pointer"
              @click="navigateTo('/news')"
            >
              <div class="flex flex-row items-center justify-center">
                <div class="flex mr-2">{{ $t('general.News') }}</div>
                <!--
                  <div
                    class="flex bg-primary text-white rounded-full w-24 h-24 items-center text-center justify-center text-xs leading-12 font-bold"
                  >
                    2
                  </div> -->
              </div>
            </div>
            <div
              :key="currentLanguage"
              class="block py-8 my-32 md:my-0 md:mx-12 md:inline-block font-bold uppercase cursor-pointer"
            >
              <div ref="currencySelect" @click="showCurrencySelect()">
                {{ getCurrency }}
              </div>
              <div
                v-show="currencySelectActive"
                class="relative hidden md:inline"
              >
                <div
                  class="absolute right-0 top-4 bg-white rounded text-black shadow-drop flex flex-col text-base leading-16 z-40 w-177"
                >
                  <Scrollbar style="height: 280px; max-height: 50vh;">
                    <div
                      v-for="(currency, key) in currencySelect"
                      :key="key"
                      :class="
                        key !== currencySelect.length - 1 ? 'border-b ' : ''
                      "
                      class="flex flex-row px-12 py-16 border-grey-light hover:bg-primary-opaque"
                      @click="changeCurrency(currency.value)"
                    >
                      <div
                        class="w-34 text-center"
                        v-html="currency.currencyText"
                      ></div>
                      <div
                        class="font-normal text-primary text-xs normal-case ml-8"
                      >
                        {{ currency.name }}
                      </div>
                    </div>
                  </Scrollbar>
                </div>
              </div>
            </div>
            <div
              class="block py-8 my-32 md:my-0 md:mx-12 md:inline-block font-bold uppercase cursor-pointer"
            >
              <div ref="languageSelect" @click="showLanguageSelect">
                {{ currentLanguage }}
              </div>
              <div
                v-show="languageSelectActive"
                class="relative hidden md:inline"
              >
                <div
                  class="absolute right-0 top-4 bg-white rounded text-black shadow-drop flex flex-col text-base leading-16 z-40 w-177"
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
            <div
              v-show="isLoggedIn"
              class="block my-40 md:my-0 md:mx-12 md:inline-block text-danger cursor-pointer"
              @click="logoutModalActive = true"
            >
              {{ $t('general.SignOut') }}
            </div>
          </div>
        </div>
        <div
          :class="isLoggedIn ? 'md:mr-24 xl:mr-48' : 'md:mr-16 xl:mr-40'"
          class="flex block mr-16 order-1 md:order-3"
        >
          <div
            v-show="isLoggedIn"
            id="travelAssistant"
            :class="
              travelAssistantVisible
                ? 'bg-grey-light text-grey-dark hover:text-black focus:bg-black focus:text-pink'
                : 'bg-black text-pink hover:text-pink-dark active:text-pink-light active:bg-grey-dark focus:bg-grey-dark'
            "
            class="rounded-full h-34 w-34 flex items-center justify-center inline-block mr-32 cursor-pointer md:mr-8 focus:outline-none relative ml-12"
            @click="showTravelAssistant(false)"
          >
            <i class="fad fa-suitcase z-10"></i>
            <div
              v-if="
                (getTravelAssistants !== undefined &&
                  getTravelAssistants !== false &&
                  getTravelAssistants.length > 0) ||
                  updating
              "
              id="travelAssistantItems"
              class="rounded-full h-24 w-24 absolute"
              :class="travelAssistantVisible ? 'active' : ''"
            >
              <span
                class="block w-full h-full text-right font-bold text-xs leading-12 pt-7 pr-5"
              >
                <span v-if="!updating">
                  {{
                    getTravelAssistants !== undefined &&
                    getTravelAssistants !== false
                      ? getTravelAssistants.length
                      : ''
                  }}
                </span>
                <span v-else><i class="fas fa-sync fa-spin"></i></span>
              </span>
            </div>
          </div>
          <div v-show="!isLoggedIn" class="mr-16 md:mr-0">
            <ButtonSmall type="primary" @click="loginModalActive = true">
              {{ $t('general.SignIn') }}
            </ButtonSmall>
          </div>
          <button
            class="md:hidden flex items-center inline-block focus:outline-none"
            @click="toggle"
          >
            <i
              :class="
                open
                  ? 'far fa-times text-base w-14'
                  : 'far fa-bars text-black text-base w-14'
              "
            ></i>
          </button>
        </div>
      </nav>
    </div>
    <DefaultModal
      v-if="loginModalActive"
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
    <DefaultModal
      v-show="currencySelectActive"
      :default-padding="'p-15'"
      :overflow-y="true"
      :is-full-page="true"
      class="md:hidden"
    >
      <div slot="header" class="p-16">
        <div class="flex w-full text-black mt-8">
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('general.Currency') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="currencySelectActive = false"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body" class="pt-64">
        <div
          v-for="(currency, key) in currencySelect"
          :key="key"
          class="flex flex-row px-12 py-16 border-t border-grey-light hover:bg-primary-opaque items-center"
          @click="changeCurrency(currency.value)"
        >
          <div
            class="w-34 text-center font-bold text-black"
            v-html="currency.currencyText"
          ></div>
          <div class="font-normal text-primary normal-case ml-8">
            {{ currency.name }}
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <DefaultModal
      v-show="languageSelectActive"
      :default-padding="'p-15'"
      :overflow-y="true"
      :is-full-page="true"
      class="md:hidden"
    >
      <div slot="header" class="p-16">
        <div class="flex w-full text-black mt-8">
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('general.Language') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="languageSelectActive = false"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body" class="pt-64">
        <div
          v-for="locale in availableLocales"
          :key="locale.code"
          class="flex flex-row px-12 py-16 border-t border-grey-light hover:bg-primary-opaque items-center"
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
      <div slot="footer"></div>
    </DefaultModal>
    <DecisionModal
      v-show="logoutModalActive"
      with-class="w-320"
      :accept-button="$t('general.SignOut')"
      :cancel-button="$t('general.Cancel')"
      @close="logoutModalActive = false"
      @cancel="logoutModalActive = false"
      @accept="signOut"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('general.SignOut') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('general.SignOutText') }}
          </div>
        </div>
      </div>
    </DecisionModal>
  </header>
</template>
<script>
/* import Bugsnag from '@bugsnag/js' */

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getLanguageName } from '@/includes/utils'

import TravelAssistant from '@/components/travel-assistant/TravelAssistant'
import DefaultModal from '@/components/modal/DefaultModal'
import DecisionModal from '@/components/modal/DecisionModal'
import LoginForm from '@/components/forms/LoginForm'

import ButtonSmall from '@/components/micro/ButtonSmall'
import Scrollbar from '@/components/Scrollbar'

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
  name: 'Navbar',
  components: {
    TravelAssistant,
    ButtonSmall,
    DefaultModal,
    DecisionModal,
    LoginForm,
    Scrollbar
  },
  data() {
    return {
      isNewsEnabled: false,
      open: false,
      travelAssistantVisible: false,
      activeTravelAssistant: false,
      updating: false,
      loginModalActive: false,
      logoutModalActive: false,
      currencySelect: [],
      currencySelectActive: false,
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
    ...mapGetters('user', ['isLoggedIn', 'getUserId', 'isDistributor']),
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('travel-assistant', ['getTravelAssistants']),
    currentLanguage() {
      return this.$i18n.locale === 'cs' ? 'cz' : this.$i18n.locale
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    countActiveTravelAssistantServices() {
      let countService = 0
      if (this.activeTravelAssistant !== false) {
        countService +=
          this.activeTravelAssistant.hotel !== null &&
          this.activeTravelAssistant.hotel !== false
            ? 1
            : 0
        countService +=
          this.activeTravelAssistant.flight !== null &&
          this.activeTravelAssistant.flight !== false
            ? 1
            : 0
        countService +=
          this.activeTravelAssistant.carRent !== null &&
          this.activeTravelAssistant.carRent !== false
            ? 1
            : 0
      }
      return countService
    }
  },
  watch: {
    currentLanguage: {
      handler(val) {
        this.populateCurrencyList()
      },
      deep: true
    }
  },
  created() {
    this.$eventBus.listen('updateTravelAssistant', this.updateTravelAssistant)
    this.$eventBus.listen('showLoginModal', this.showLoginModal)
  },
  mounted() {
    this.travelAssistantVisible = false
    this.activeTravelAssistant = false
    this.updating = false
    if (this.isLoggedIn) {
      this.updateTravelAssistant()
    }
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    this.populateCurrencyList()
    this.isNewsMenuEnabled()
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
  },
  methods: {
    getLanguageName,
    ...mapMutations({
      resetState: 'user/resetState',
      resetTravelAssistantState: 'travel-assistant/resetState'
    }),
    ...mapActions('user', ['postLogout']),
    ...mapActions('general', ['setCurrency']),
    async changeLang(code) {
      if (this.isLoggedIn) {
        try {
          await this.$store.dispatch('user/setLang', {
            lang: code
          })
        } catch (e) {
          // Nem dobunk hibát mert a nem bejelentkezett usereknek nem fut le
        }
      }

      this.$router.replace(this.switchLocalePath(code))
    },
    async isNewsMenuEnabled() {
      try {
        const newsObj = await this.$store.dispatch('news/getNewsEnabled')
        this.isNewsEnabled = newsObj.value
      } catch (error) {
        console.log(error)
      }
    },
    toggle() {
      this.open = !this.open
      if (this.open) {
        document.body.classList.add('fixed')
        this.hotelSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.hotelSearchFormModalActive = true
      }
    },
    showTravelAssistant(hard = false) {
      if (hard) {
        this.travelAssistantVisible = true
      } else {
        this.travelAssistantVisible = !this.travelAssistantVisible
      }
      if (this.travelAssistantVisible) {
        setTimeout(() => {
          document
            .getElementById('travel-assistant')
            .classList.remove('overflow-hidden')
        }, 750)
      }
    },
    async updateTravelAssistant(params) {
      if (this.isLoggedIn && !this.updating) {
        this.updating = true
        let finished = await this.syncTravelAssistants(params)
        if (!finished) {
          const updatingTimer = setInterval(async () => {
            if (finished || !this.isLoggedIn) {
              this.updating = false
              clearInterval(updatingTimer)
            } else {
              finished = await this.syncTravelAssistants(params)
              if (finished) {
                this.updating = false
                clearInterval(updatingTimer)
              }
            }
          }, process.env.SEARCH_INTERVAL)
        } else {
          this.updating = false
        }
      }
    },

    async syncTravelAssistants() {
      let travelAssistants = false
      try {
        travelAssistants = await this.$store.dispatch('travel-assistant/getAll')
        if (
          this.activeTravelAssistant === false &&
          travelAssistants.length > 0
        ) {
          this.activeTravelAssistant = travelAssistants[0]
        }
      } catch (e) {
        if (e.response) {
          const body = await e.response.json()
          if (body.messages !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: body.messages
            })
          }
        }
      }
      let finished = true
      let find = false
      const processingTravelAssistants = []
      if (
        this.getTravelAssistants !== undefined &&
        this.getTravelAssistants !== false &&
        this.getTravelAssistants.length > 0
      ) {
        for (let i = 0; i < this.getTravelAssistants.length; i++) {
          if (this.getTravelAssistants[i].status !== 'FINISHED') {
            processingTravelAssistants.push(this.getTravelAssistants[i].id)
          }
        }
      }
      const updatedTravelAssistants = []
      if (travelAssistants !== undefined && travelAssistants.length > 0) {
        for (let i = 0; i < travelAssistants.length; i++) {
          if (travelAssistants[i].status !== 'FINISHED') {
            finished = false
          } else if (
            processingTravelAssistants.includes(travelAssistants[i].id)
          ) {
            updatedTravelAssistants.push(travelAssistants[i])
          }
          if (travelAssistants[i].id === this.activeTravelAssistant.id) {
            find = true
          }
        }
        if (!find) {
          this.activeTravelAssistant = travelAssistants[0]
        }
      }
      this.$store.commit(
        'travel-assistant/setTravelAssistants',
        travelAssistants
      )
      if (updatedTravelAssistants.length > 0) {
        const snackbarMessage = updatedTravelAssistants
          .map((item) => {
            return (
              '<span' + ' class="text-primary"' + '>' + item.title + '</span>'
            )
          })
          .join(', ')
        if (snackbarMessage !== '') {
          this.$store.dispatch('general/showSnackbar', {
            message:
              snackbarMessage +
              ' ' +
              this.$t('general.TravelAssistantsUpdateSuccess'),
            undoButton: this.$t('general.Show'),
            undoEvent: () => {
              this.activeTravelAssistant = updatedTravelAssistants[0]
              this.showTravelAssistant(true)
              this.$scrollTo('#__nuxt')
            }
          })
        }
      }
      return finished
    },

    async signOut() {
      this.logoutModalActive = false
      try {
        await this.postLogout({ user_id: this.getUserId })
      } catch (error) {
        // logout always sucseeds client side
        console.log(error)
      }
      this.resetState()
      this.resetTravelAssistantState()
      this.open = false
      document.body.classList.remove('fixed')
      this.$store.dispatch('general/showSnackbar', {
        message: 'Logout successful'
      })

      this.$router.push(this.localePath('index'))
    },

    onDocumentMouseUp(e) {
      let isChild = this.$refs.currencySelect.contains(e.target)
      if (!isChild) {
        this.currencySelectActive = false
      }

      isChild = this.$refs.languageSelect.contains(e.target)
      if (!isChild) {
        this.languageSelectActive = false
      }
    },
    showLanguageSelect() {
      if (this.open) {
        this.toggle()
      }
      this.languageSelectActive = !this.languageSelectActive
    },
    showCurrencySelect() {
      if (this.open) {
        this.toggle()
      }
      this.currencySelectActive = !this.currencySelectActive
    },
    changeCurrency(currency) {
      if (this.getCurrency !== currency) {
        this.$store.commit('general/setCurrency', currency)
        if (this.$nuxt.$route.name.includes('flight_')) {
          location.reload()
        }
      }
    },
    loginSuccess() {
      /* Bugsnag.notify(new Error('Hiba átadás teszt')) */
      this.loginModalActive = false
    },
    navigateTo(path) {
      if (this.open) {
        this.toggle()
      }
      this.$router.push(this.localePath(path))
    },
    showLoginModal() {
      this.loginModalActive = true
    },
    populateCurrencyList() {
      this.currencySelect = [
        {
          name: this.$t('general.CurrencyNameEur'),
          currencyText: 'EUR',
          value: 'EUR'
        },
        {
          name: this.$t('general.CurrencyNameUsd'),
          currencyText: 'USD',
          value: 'USD'
        },
        {
          name: this.$t('general.CurrencyNameHuf'),
          currencyText: 'HUF',
          value: 'HUF'
        },

        {
          name: this.$t('general.CurrencyNameAed'),
          currencyText: 'AED',
          value: 'AED'
        },
        {
          name: this.$t('general.CurrencyNameAud'),
          currencyText: 'AUD',
          value: 'AUD'
        },
        {
          name: this.$t('general.CurrencyNameBrl'),
          currencyText: 'BRL',
          value: 'BRL'
        },
        {
          name: this.$t('general.CurrencyNameCad'),
          currencyText: 'CAD',
          value: 'CAD'
        },
        {
          name: this.$t('general.CurrencyNameChf'),
          currencyText: 'CHF',
          value: 'CHF'
        },
        {
          name: this.$t('general.CurrencyNameCny'),
          currencyText: 'CNY',
          value: 'CNY'
        },
        {
          name: this.$t('general.CurrencyNameDkk'),
          currencyText: 'DKK',
          value: 'DKK'
        },
        {
          name: this.$t('general.CurrencyNameGbp'),
          currencyText: 'GBP',
          value: 'GBP'
        },
        {
          name: this.$t('general.CurrencyNameJpy'),
          currencyText: 'JPY',
          value: 'JPY'
        },
        {
          name: this.$t('general.CurrencyNameMxn'),
          currencyText: 'MXN',
          value: 'MXN'
        },
        {
          name: this.$t('general.CurrencyNameNok'),
          currencyText: 'NOK',
          value: 'NOK'
        },
        {
          name: this.$t('general.CurrencyNamePln'),
          currencyText: 'PLN',
          value: 'PLN'
        },
        {
          name: this.$t('general.CurrencyNameRub'),
          currencyText: 'RUB',
          value: 'RUB'
        },
        {
          name: this.$t('general.CurrencyNameSek'),
          currencyText: 'SEK',
          value: 'SEK'
        },
        {
          name: this.$t('general.CurrencyNameSgd'),
          currencyText: 'SGD',
          value: 'SGD'
        },
        {
          name: this.$t('general.CurrencyNameThb'),
          currencyText: 'THB',
          value: 'THB'
        },
        {
          name: this.$t('general.CurrencyNameTry'),
          currencyText: 'TRY',
          value: 'TRY'
        },
        {
          name: this.$t('general.CurrencyNameUah'),
          currencyText: 'UAH',
          value: 'UAH'
        },
        {
          name: this.$t('general.CurrencyNameZar'),
          currencyText: 'ZAR',
          value: 'ZAR'
        }
      ]
    }
  }
}
</script>

<style>
#travelAssistant > #travelAssistantItems {
  @apply bg-black;
  left: 19px;
}
#travelAssistant:active > #travelAssistantItems {
  @apply bg-grey-dark;
}
#travelAssistant:focus > #travelAssistantItems {
  @apply bg-grey-dark;
}
#travelAssistant:hover > #travelAssistantItems > span {
  @apply underline;
}
#travelAssistant > #travelAssistantItems.active {
  @apply bg-grey-light;
}
#travelAssistant:focus > #travelAssistantItems .active {
  @apply bg-black;
}
</style>
