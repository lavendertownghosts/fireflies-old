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
              {{ $t('general.ChangePassword') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!isCompleted" class="p-16 md:px-92 mt-8 z-10">
      <InputText
        v-model="email"
        :error="error.email"
        :label="$t('general.Email')"
        class="sm:w-288 mx-auto"
      />
      <div class="text-sm leading-14 mt-16 sm:w-288 mx-auto">
        {{ $t('general.PasswordRequirements') }}
      </div>
      <InputText
        v-model="password"
        :error="error.password"
        :input-type="'password'"
        :label="$t('general.Password')"
        class="sm:w-288 mt-4 mx-auto"
        :is-disabled="isLoading"
      />
      <InputText
        v-model="password_again"
        :error="error.password_again"
        :input-type="'password'"
        :label="$t('general.PasswordAgain')"
        class="sm:w-288 mt-16 mx-auto"
        :is-disabled="isLoading"
      />
      <div class="text-center mt-16 mb-64">
        <ButtonMedium
          type="primary"
          class="w-full sm:w-288"
          :loading="isLoading"
          @click="changePassword()"
        >
          {{ $t('general.SavePassword') }}
        </ButtonMedium>
      </div>
    </div>
    <div v-show="isCompleted" class="p-16 md:px-92 mt-32 z-10 text-center">
      <h3 class="text-xl leading-32">
        {{ $t('general.ChangePasswordSuccess') }}
      </h3>
      <p class="mt-8">
        {{ $t('general.ChangePasswordSuccessDesc') }}
      </p>
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import { isEmail } from '@/includes/utils'

import InputText from '@/components/micro/InputText'
import ButtonMedium from '@/components/micro/ButtonMedium'
import placeholderBackgroundUrl from '~/assets/images/hotel-hero-bg-small.jpg'
import backgroundUrl from '~/assets/images/hotel-hero-bg.jpg'

export default {
  /* query string paraméterekkel beküldjük az új jelszót */
  name: 'ChangePasswordPage',
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
      password: '',
      password_again: '',
      isLoading: false,
      isCompleted: false,
      error: {
        email: '',
        password: '',
        password_again: ''
      }
    }
  },
  mounted() {
    this.isLoading = false
    this.isCompleted = false

    if (this.$route.query.token === undefined) {
      this.$router.push(this.localePath('/'))
    }
  },
  methods: {
    ...mapActions('user', ['guestChangePassword']),
    async changePassword() {
      if (this.isLoading === true) {
        return
      }

      for (const key in this.error) {
        this.error[key] = ''
      }
      this.email = this.email.trim()
      if (isEmail(this.email) === false) {
        this.error.email = this.$t('general.NotValidEmail')
      } else if (this.password === '') {
        this.error.password = this.$t('general.PasswordRequired')
      } else if (this.password.length < 8) {
        this.error.password = this.$t('general.PasswordMinLengthError')
      } else if (this.passwordAgain === '') {
        this.error.password_again = this.$t('general.PasswordAgainRequired')
      } else if (this.password_again.length < 8) {
        this.error.password_again = this.$t('general.PasswordMinLengthError')
      } else if (this.password !== this.password_again) {
        this.error.password_again = this.$t('general.PasswordMatchError')
      } else {
        this.isLoading = true
        this.error = false
        let res
        try {
          res = await this.guestChangePassword({
            email: this.email,
            password: this.password,
            passwordAgain: this.password_again,
            token: this.$route.query.token
          })
        } catch (e) {
          // this.password = ''
          // this.password_again = ''

          this.isLoading = false
          this.isCompleted = false

          const body = await e.response.json()
          if (body.messages !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: body.messages
            })
          }
        }

        if (res) {
          this.isLoading = false
          this.isCompleted = true
        }
      }
    },
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    }
  },
  head() {
    return {
      title: this.$t('meta.ChangePassTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.ChangePassTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.ChangePassTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.$t('meta.ChangePassDescription') + this.$t('meta.TitleSuffix')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.$t('meta.ChangePassDescription') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:description',
          content:
            this.$t('meta.ChangePassDescription') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
