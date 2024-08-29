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
          </div>
        </div>
      </div>
    </div>
    <div class="p-16 md:px-92 mt-32 z-10 text-center">
      <div
        :class="getTextColorClass"
        class="flex flex-col text-center mt-40 mb-56"
      >
        <div>
          <i :class="getFAIcon" class="fa-5x"></i>
        </div>
        <div class="text-lg leading-24 mt-12 font-bold">{{ getStatus }}</div>
        <div
          class="text-black text-sm leading-20 mt-8 md:px-92 lg:px-216 xl:px-320 mx-auto"
        >
          {{ getDescription }}
        </div>

        <div
          v-if="$route.params.type === 'activation-unsuccessful'"
          class="text-center"
        >
          <ButtonSmall class="mt-16" type="inverted">
            {{ $t('general.GetSupport') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import placeholderBackgroundUrl from '~/assets/images/hotel-hero-bg-small.jpg'
import backgroundUrl from '~/assets/images/hotel-hero-bg.jpg'
import ButtonSmall from '@/components/micro/ButtonSmall'
export default {
  name: 'RegistrationStatusPage',
  middleware: 'non_auth_only',
  components: { ButtonSmall },
  data() {
    return {
      backgroundUrl,
      placeholderBackgroundUrl
    }
  },
  computed: {
    getTextColorClass() {
      if (
        this.$route.params.type === 'activation-successful' ||
        this.$route.params.type === 'reactivation-successful'
      ) {
        return 'text-primary'
      } else {
        return 'text-danger'
      }
    },
    getFAIcon() {
      if (
        this.$route.params.type === 'activation-successful' ||
        this.$route.params.type === 'reactivation-successful'
      ) {
        return 'fal fa-smile-wink'
      } else {
        return 'fal fa-frown'
      }
    },
    getDescription() {
      if (this.$route.params.type === 'activation-successful') {
        return this.$t('general.ActivationSuccessDesc')
      } else if (this.$route.params.type === 'reactivation-successful') {
        return this.$t('general.ReactivationSuccessDesc')
      } else {
        return this.$t('general.ActivationUnsuccessfulDesc')
      }
    },
    getStatus() {
      if (this.$route.params.type === 'activation-successful') {
        return this.$t('general.ActivationSuccess')
      } else if (this.$route.params.type === 'reactivation-successful') {
        return this.$t('general.ReactivationSuccess')
      } else {
        return this.$t('general.ActivationUnsuccessful')
      }
    }
  },
  methods: {
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
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
