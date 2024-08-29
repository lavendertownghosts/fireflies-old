<template>
  <div>
    <InputText
      v-model="email"
      :label="$t('general.EmailOrUsername')"
      class="w-304"
      :is-disabled="isLoading"
    />
    <InputText
      v-model="password"
      :input-type="'password'"
      :label="$t('general.Password')"
      class="w-304 mt-16"
      :is-disabled="isLoading"
      @enter="!isLoading ? login() : ''"
    />
    <div class="w-full mt-16">
      <recaptcha />
    </div>
    <div class="flex flex-row justify-between align-center mt-16 px-1">
      <div>
        <InputCheckbox v-model="rememberMe" :is-disabled="isLoading">
          {{ $t('general.RememberMe') }}
        </InputCheckbox>
      </div>
      <div>
        <a
          class="link cursor-pointer font-bold text-sm leading-14"
          @click.prevent="navToResetPage()"
        >
          {{ $t('general.PasswordReminder') }}
        </a>
      </div>
    </div>
    <ButtonMedium
      type="primary"
      class="w-full mt-16"
      :is-loading="isLoading"
      @click="!isLoading ? login() : ''"
    >
      {{ $t('general.SignIn') }}
    </ButtonMedium>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import InputText from '@/components/micro/InputText'
import InputCheckbox from '@/components/micro/InputCheckbox'
import ButtonMedium from '@/components/micro/ButtonMedium'

export default {
  name: 'LoginForm',
  components: {
    ButtonMedium,
    InputText,
    InputCheckbox
  },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      exclusiveEnabled: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('general', ['getUsernameCache']),
    ...mapGetters('user', ['getGeoLoc'])
  },
  mounted() {
    this.$nextTick(() => {
      this.email = this.getUsernameCache || ''
      this.password = ''
    })
  },
  methods: {
    ...mapActions('user', ['postLogin']),
    navToResetPage() {
      this.$emit('login') // ezzel zárjuk be a modalt, ha abban vagyunk
      this.$router.push(this.localePath('/user/reset-password'))
    },
    async login() {
      this.isLoading = true
      let res = false
      try {
        const captchaToken = await this.$recaptcha.getResponse()

        if (captchaToken !== '') {
          try {
            this.email = this.email.trim()
            res = await this.postLogin({
              email: this.email,
              password: this.password,
              lang: this.$i18n.locale,
              captcha: captchaToken
            })
            this.$eventBus.publish('updateTravelAssistant')
          } catch (e) {
            this.password = ''
            this.isLoading = false
            let body = await e.response
            if (body && e.response !== undefined) {
              body = await e.response.json()
              if (body.messages !== undefined) {
                console.log(body.messages)
                this.$store.dispatch('general/showSnackbar', {
                  message: this.$t('general.LoginInvalid')
                })
                this.$recaptcha.reset()
              }
            }
          }
        }
      } catch (e) {
        this.$store.dispatch('general/showSnackbar', {
          message: this.$t('weboffice.CaptchaError')
        })
        this.$recaptcha.reset()
      }

      this.isLoading = false
      if (res) {
        if (this.rememberMe === true) {
          this.$store.commit('general/setUsernameCache', this.email)
        }

        // const prevGeoLoc = this.getGeoLoc
        this.$store.commit('user/setUserId', res.user_id)
        this.$store.commit('user/setGeoLoc', res.user_country)
        this.$store.commit('user/setPowerLine', res.powerline)
        this.$store.commit('user/setFees', res.fees)
        this.$store.commit('user/setAllowedGeo', res.user_geo_allowed)
        this.$store.commit('user/setAllowedPV', res.user_pv_allowed)
        this.$store.commit('user/setPremiumUser', res.premiumuser)

        if (process.env.NODE_ENV === 'development') {
          console.log(
            '%c i USER GEO ALLOWED = ' + res.user_geo_allowed,
            'background: #02A; color: #FFFFFF; font-weight: bold;'
          )
        }

        // Exclusive offer engedélyezés
        /* this.exclusiveEnabled = await this.$store.dispatch(
          'user/exclusiveMenuCheck'
        )

        if (this.exclusiveEnabled === undefined) {
          this.exclusiveEnabled = false
        } */

        this.exclusiveEnabled = true

        this.$store.commit('user/setExclusiveEnabled', this.exclusiveEnabled)

        // Exclusive offer emlékeztető
        const exclusiveOffers = await this.$store.dispatch(
          'user/exclusiveOffers',
          { discount_pass: true }
        )

        if (this.exclusiveEnabled) {
          if (exclusiveOffers.offersList !== undefined) {
            if (exclusiveOffers.offersList.length > 0) {
              this.$store.dispatch('general/showPopup', {
                title:
                  this.$t('exclusive_offers.DCLoginPopupTitle') + ' PREMIUM',
                message: this.$t('exclusive_offers.DCLoginPopupMessage'),
                acceptText: this.$t('exclusive_offers.DCLoginPopupButtonText'),
                url: '/weboffice/discount-pass'
              })
            } else {
              // Exclusive offer emlékeztető
              const exclusiveOffers = await this.$store.dispatch(
                'user/exclusiveOffers'
              )

              if (this.exclusiveEnabled) {
                if (exclusiveOffers.offersList !== undefined) {
                  if (exclusiveOffers.offersList.length > 0) {
                    this.$store.dispatch('general/showPopup', {
                      title: this.$t('exclusive_offers.LoginPopupTitle'),
                      message: this.$t('exclusive_offers.LoginPopupMessage'),
                      acceptText: this.$t(
                        'exclusive_offers.LoginPopupButtonText'
                      ),
                      url: '/weboffice/exclusive-offers'
                    })
                  }
                }
              }
            }
          }
        }

        this.password = ''
        this.$store.dispatch('general/showSnackbar', {
          message: this.$t('general.LoginSuccessful')
        })

        this.$recaptcha.destroy()

        if (!String(this.$nuxt.$route.name).includes('index')) {
          /* if (prevGeoLoc !== res.user_country) {
            if (process.env.NODE_ENV === 'development') {
              console.log(
                '%c ! GOE CHANGED -> RELOAD ! ',
                'background: #F00; color: #FFFFFF; font-weight: bold;'
              )
            }
            this.$nuxt.$emit('geo-change')
          } */
          // Prémium voucher miatt muszáj mindig frissíteni
          this.$nuxt.$emit('geo-change')
        }

        this.$emit('login')
      }
    }
  }
}
</script>
