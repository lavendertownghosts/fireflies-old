<template>
  <main class="flex-grow">
    <div class="w-full bg-primary relative">
      <div
        class="small-hero-dark-bg w-full bg-primary flex flex-col justify-between"
        :style="{ backgroundImage: `url(${placeholderBackgroundUrl})` }"
      >
        <img
          :src="backgroundUrl"
          class="hidden"
          @load="onLoadBackgroundImage"
        />
        <div
          class="p-16 xl:px-40 max-w-screen-xl xl:min-w-xl xl:mx-auto flex flex-col flex-grow justify-center"
        >
          <div
            class="flex flex-col flex-grow justify-center min-w-full z-10 text-center"
          >
            <div class="text-pink text-xl leading-32">
              {{ $t('general.Registration') }}
            </div>
            <div
              v-show="$route.query.inviter !== undefined"
              class="text-sm leading-14 text-black mt-4"
            >
              {{ $t('general.InvitationSent') }}: {{ $route.query.inviter }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="!isCompleted"
      class="p-16 md:px-92 max-w-screen-md mx-auto mt-8 z-10"
    >
      <InputText
        v-model="email"
        :label="$t('general.Email')"
        :error="error.email"
        class="sm:w-288"
      />
      <div class="h-1 w-full bg-grey-light mt-13 mb-16"></div>
      <InputText
        v-model="username"
        :error="error.username"
        :label="$t('general.Username')"
        class="sm:w-288"
      />
      <div class="flex flex-wrap">
        <div class="w-full sm:w-1/2">
          <InputText
            v-model="password"
            :label="$t('general.Password')"
            :input-type="'password'"
            :error="error.password"
            class="pt-16 sm:mr-8"
          />
        </div>
        <div class="text-xs leading-12 mt-1 w-full sm:order-3">
          {{ $t('general.PasswordRequirements') }}
        </div>
        <div class="w-full sm:w-1/2 sm:order-2">
          <InputText
            v-model="passwordAgain"
            :label="$t('general.PasswordAgain')"
            :error="error.password_again"
            :input-type="'password'"
            class="pt-16 sm:ml-8"
          />
        </div>
      </div>
      <InputDropdown
        v-model="country"
        :values="countrySelect"
        :label="$t('general.Country')"
        :placeholder="$t('general.SelectCountry')"
        :error="error.country"
        :is-filterable="true"
        class="pt-16"
      />
      <div class="h-1 w-full bg-grey-light mt-16 mb-16"></div>
      <InputCheckbox v-model="subscribeNewsletter" class="flex">
        {{ $t('general.SubscribeNewsletter') }}
      </InputCheckbox>
      <div v-show="subscribeNewsletter" class="flex flex-col mt-16">
        <label class="block text-black text-xs font-bold leading-12 mb-5">
          Milyen nyelven szeretné olvasni a hírleveleket?
        </label>
        <InputDropdown
          v-model="selectedLanguage"
          :values="languageList"
          class="w-128"
        />
      </div>
      <InputCheckbox
        v-model="generalTerms"
        :has-error="error.generalTerms"
        class="flex mt-16"
      >
        <div>
          <div
            class="text-sm leading-14 sm:leading-20"
            v-html="$t('general.AcceptGeneralTerms')"
          ></div>
        </div>
      </InputCheckbox>
      <InputCheckbox
        v-model="privacyPolicy"
        :has-error="error.privacyPolicy"
        class="flex mt-16"
      >
        <div
          class="text-sm leading-14 sm:leading-20"
          v-html="$t('general.AcceptPrivacyPolicy')"
        ></div>
      </InputCheckbox>
      <div class="text-center mt-16">
        <ButtonMedium
          type="primary"
          class="w-full sm:w-288"
          :is-loading="isLoading"
          @click="registration"
        >
          {{ $t('general.Registration') }}
        </ButtonMedium>
      </div>
      <div class="text-center text-black text-sm leading-14 mt-16 mb-40">
        {{ $t('general.Registered') }}
        <a
          class="link font-bold cursor-pointer"
          @click="$router.push(localePath('/user/login'))"
          >{{ $t('general.SignIn') }}</a
        >
      </div>
    </div>
    <div v-show="isCompleted" class="p-16 md:px-92 mt-32 z-10 text-center">
      <h3 class="text-xl leading-32">
        {{ $t('general.RegistrationSuccess') }}
      </h3>
      <p class="mt-8">
        {{ $t('general.RegistrationSuccessDesc') }}
      </p>
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import placeholderBackgroundUrl from 'assets/images/hotel-hero-bg-small.jpg'
import backgroundUrl from 'assets/images/hotel-hero-bg.jpg'
import InputText from '@/components/micro/InputText'
import InputDropdown from '@/components/micro/InputDropdown'
import InputCheckbox from '@/components/micro/InputCheckbox'
import ButtonMedium from '@/components/micro/ButtonMedium'
import { isEmail } from '@/includes/utils'
export default {
  name: 'RegistrationPage',
  middleware: 'non_auth_only',
  components: {
    ButtonMedium,
    InputText,
    InputDropdown,
    InputCheckbox
  },
  async asyncData({ store, route, app, redirect }) {
    if (route.query.token === undefined || route.query.token === '') {
      let inviterToken
      try {
        inviterToken = await store.dispatch('user/getRegistrationToken', {
          inviter: route.query.inviter,
          code: route.query.code
        })
      } catch (e) {
        redirect(app.localePath('/'))
      }
      if (
        inviterToken &&
        inviterToken.rs !== undefined &&
        inviterToken.rs.inviter !== undefined
      ) {
        inviterToken = inviterToken.rs.inviter
        return {
          inviterToken
        }
      } else {
        redirect(app.localePath('/'))
      }
    }
  },
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl,
      isCompleted: false,
      email: '',
      username: '',
      password: '',
      passwordAgain: '',
      country: '',
      countryList: [],
      countrySelect: [],
      countrySelectIds: [],
      countrySelectCodes: [],
      subscribeNewsletter: false,
      generalTerms: false,
      privacyPolicy: false,
      error: {
        email: '',
        username: '',
        password: '',
        password_again: '',
        country: '',
        generalTerms: false,
        privacyPolicy: false
      },
      isLoading: false,
      languageList: [
        this.$t('general.LangHu'),
        this.$t('general.LangCz'),
        this.$t('general.LangEn'),
        this.$t('general.LangRo'),
        this.$t('general.LangRu'),
        this.$t('general.LangSk'),
        this.$t('general.LangPl')
      ],
      languageIds: [1, 6, 2, 7, 4, 5, 9],
      selectedLanguage: 0
    }
  },
  async mounted() {
    this.CountryList = await this.$store.dispatch('user/getCountries')
    if (this.CountryList !== undefined) {
      this.countrySelect = []
      for (const value of this.CountryList) {
        this.countrySelect.push(value.name)
        this.countrySelectIds.push(value.id)
        this.countrySelectCodes.push(value.code)
      }
    }
  },
  methods: {
    ...mapActions('user', ['postRegistration']),
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    },
    async registration() {
      if (this.isLoading === true) {
        return
      }

      for (const key in this.error) {
        this.error[key] =
          key === 'privacyPolicy' || key === 'generalTerms' ? false : ''
      }
      this.email = this.email.trim()
      this.username = this.username.trim()
      this.password = this.password.trim()
      this.passwordAgain = this.passwordAgain.trim()
      if (isEmail(this.email) === false) {
        this.error.email = this.$t('general.NotValidEmail')
      } else if (this.username === '') {
        this.error.username = this.$t('general.UsernameRequired')
      } else if (this.password === '') {
        this.error.password = this.$t('general.PasswordRequired')
      } else if (this.password.length < 8) {
        this.error.password = this.$t('general.PasswordMinLengthError')
      } else if (this.passwordAgain === '') {
        this.error.password_again = this.$t('general.PasswordAgainRequired')
      } else if (this.passwordAgain.length < 8) {
        this.error.password_again = this.$t('general.PasswordMinLengthError')
      } else if (this.password !== this.passwordAgain) {
        this.error.password_again = this.$t('general.PasswordMatchError')
      } else if (this.country === '') {
        this.error.country = this.$t('general.CountryRequired')
      } else if (!this.generalTerms) {
        this.error.generalTerms = true
      } else if (!this.privacyPolicy) {
        this.error.privacyPolicy = true
      } else {
        this.isLoading = true
        let res
        try {
          res = await this.postRegistration({
            inviterToken:
              this.inviterToken === undefined
                ? this.$route.query.token
                : this.inviterToken,
            email: this.email,
            username: this.username,
            password: this.password,
            passwordAgain: this.passwordAgain,
            country: String(this.countrySelectIds[this.country]),
            newsletter: this.subscribeNewsletter,
            privacyPolicy: this.privacyPolicy,
            generalTerms: this.generalTerms,
            newsletterLanguage: this.languageIds[this.selectedLanguage],
            lang: this.$i18n.locale
          })
        } catch (e) {
          this.isLoading = false
          this.isCompleted = false

          let body = await e.response
          if (body) {
            body = await e.response.json()
            if (body.messages !== undefined) {
              const error = JSON.parse(body.messages)
              if (error !== undefined) {
                if (error.error_email !== undefined) {
                  this.error.email = error.error_email
                }
                if (error.error_username !== undefined) {
                  this.error.username = error.error_username
                }
                if (error.error_password !== undefined) {
                  this.error.password = error.error_password
                }
                if (error.error_passwordAgain !== undefined) {
                  this.error.password_again = error.error_passwordAgain
                }
                if (error.error_country !== undefined) {
                  this.error.country = error.error_country
                }
                if (error.privacy_policy !== undefined) {
                  this.error.privacyPolicy = true
                  this.error.generalTerms = true
                }
              }
            }
          }
        }

        if (res) {
          this.isLoading = false
          this.isCompleted = true
        }
      }
    }
  },
  head() {
    return {
      title: this.$t('meta.RegistrationTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.RegistrationTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.RegistrationTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.$t('meta.RegistrationDescription') +
            this.$t('meta.TitleSuffix')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.$t('meta.RegistrationDescription') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:description',
          content:
            this.$t('meta.RegistrationDescription') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
