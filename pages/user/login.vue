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
              {{ $t('general.SignIn') }}
            </div>
            <div class="text-sm leading-14 text-black mt-4">
              {{ $t('general.ExpiredSession') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-16 max-w-screen-sm mx-auto mt-8 mb-56 z-10">
      <LoginForm class="sm:mx-100" @login="$router.push(localePath('/'))" />
    </div>
  </main>
</template>

<script>
import placeholderBackgroundUrl from '~/assets/images/hotel-hero-bg-small.jpg'
import backgroundUrl from '~/assets/images/hotel-hero-bg.jpg'

import LoginForm from '@/components/forms/LoginForm'
export default {
  name: 'LoginPage',
  middleware: 'auth_needed',
  components: {
    LoginForm
  },
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl,
      email: '',
      username: '',
      password: '',
      passwordAgain: '',
      country: 1,
      countryList: ['Magyarország'],
      subscribeNewsletter: false,
      generalTerms: false,
      privacyPolicy: false
    }
  },
  methods: {
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    }
  },
  head() {
    return {
      title: this.$t('meta.LoginTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.LoginTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.LoginTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.$t('meta.LoginDescription') + this.$t('meta.TitleSuffix')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.$t('meta.LoginDescription') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:description',
          content:
            this.$t('meta.LoginDescription') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
