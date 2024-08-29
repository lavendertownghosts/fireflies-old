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
              {{ $t('general.ResetPassword') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!isCompleted" class="p-16 md:px-92 mt-8 z-10">
      <InputText
        v-model="email"
        :error="error"
        :label="$t('general.Email')"
        class="sm:w-304 mx-auto "
      />
      <div class="sm:w-304 mx-auto mt-16">
        <recaptcha />
      </div>
      <div class="text-center mt-16">
        <ButtonMedium
          type="primary"
          class="w-full sm:w-304"
          :loading="isLoading"
          @click="resetPassword()"
        >
          {{ $t('general.GetPassword') }}
        </ButtonMedium>
      </div>
    </div>
    <div v-show="isCompleted" class="p-16 md:px-92 mt-32 z-10 text-center">
      <h3 class="text-xl leading-32">
        {{ $t('general.GetNewPasswordSuccessTitle') }}
      </h3>
      <p class="mt-8">
        {{ $t('general.GetNewPasswordSuccessDesc') }}
      </p>
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import placeholderBackgroundUrl from '~/assets/images/hotel-hero-bg-small.jpg'
import backgroundUrl from '~/assets/images/hotel-hero-bg.jpg'
import { isEmail } from '@/includes/utils'

import InputText from '@/components/micro/InputText'
import ButtonMedium from '@/components/micro/ButtonMedium'

export default {
  /* emailt küldünk a megadott címre */
  name: 'ResetPasswordPage',
  middleware: 'non_auth_only',
  components: {
    ButtonMedium,
    InputText
  },
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl,
      email: '',
      isLoading: false,
      isCompleted: false,
      error: ''
    }
  },
  mounted() {
    this.isLoading = false
    this.isCompleted = false
    this.email = ''
  },
  methods: {
    ...mapActions('user', ['postResetPassword']),
    async resetPassword() {
      if (this.isLoading === true) {
        return
      }
      this.email = this.email.trim()
      if (isEmail(this.email) === false) {
        this.error = this.$t('general.NotValidEmail')
      } else {
        try {
          const captchaToken = await this.$recaptcha.getResponse()

          if (captchaToken !== '') {
            this.isLoading = true
            this.error = false
            let res
            try {
              res = await this.postResetPassword({
                email: this.email,
                captcha: captchaToken,
                lang: this.$i18n.locale
              })
            } catch (e) {
              this.isLoading = false
              this.isCompleted = false
              this.error = this.$t('general.EmailNotFound')
              this.$recaptcha.reset()
            }
            if (res && res.status === 'ok') {
              this.email = ''
              this.isLoading = false
              this.isCompleted = true
            }
          }
        } catch (e) {
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.CaptchaError')
          })
          this.$recaptcha.reset()
        }
      }
    },
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    }
  },
  head() {
    return {
      title: this.$t('meta.ReminderTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.ReminderTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.ReminderTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.$t('meta.ReminderDescription') + this.$t('meta.TitleSuffix')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.$t('meta.ReminderDescription') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:description',
          content:
            this.$t('meta.ReminderDescription') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
