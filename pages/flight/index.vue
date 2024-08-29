<template>
  <main>
    <LoadingAnimation v-show="isLoading" color="#00ADB5" />
    <div
      v-show="!isLoading"
      class="w-full h-1 bg-primary-gradient hidden md:block mb-12"
    ></div>
    <div
      v-show="!isLoading"
      class="max-w-screen-xl mx-auto h-full"
      style="min-height: 70vh;"
    >
      <div
        class="flex flex-row mt-4 cursor-pointer sm:pl-40 pl-0"
        @click="$router.push(localePath('/'))"
      >
        <i class="fa fa-chevron-left text-primary text-sm leading-14"></i>
        <p class="ml-8 text-sm leading-14 link font-bold">
          {{ $t('general.Back') }}
        </p>
      </div>
      <div id="widget-holder" style="min-height: 70vh;"></div>
      <script
        data-width="100%"
        :data-currency="getCurrency"
        :data-lang="$i18n.locale !== 'cs' ? $i18n.locale : 'cz'"
        data-affilid="swisshalleyagfireflies"
        data-primary-color="00adb5"
        data-background-primary-color="ffffff"
        data-background-secondary-color="ffffff"
        data-foreground-primary-color="00adb5"
        data-foreground-secondary-color="00adb5"
        src="https://widgets.kiwi.com/scripts/widget-search-iframe.js"
      ></script>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingAnimation from '@/components/micro/LoadingAnimation'

export default {
  name: 'KiwiTest',
  components: {
    LoadingAnimation
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency'])
  },
  mounted() {
    this.loader()
  },
  methods: {
    async loader() {
      this.isLoading = true
      await this.timeout(2500)
      this.isLoading = false
    },
    timeout(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms))
    }
  }
}
</script>
