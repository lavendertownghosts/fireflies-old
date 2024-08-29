<template>
  <main>
    <LoadingAnimation v-show="isLoading" color="#00ADB5" />
    <div
      v-show="!isLoading"
      class="w-full h-1 bg-primary-gradient hidden md:block mb-12"
    ></div>
    <div
      v-show="!isLoading"
      class="max-w-screen-xl mx-auto h-full pb-34"
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
      <div id="gettransfer_widget"></div>
      <script
        type="text/javascript"
        src="https://gettransfer.com/transfers/widget.js?widget_id=157"
      ></script>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingAnimation from '@/components/micro/LoadingAnimation'

export default {
  name: 'Transfer',
  components: {
    LoadingAnimation
  },
  data() {
    return {
      isLoading: false
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
      this.isLoading = false
      await this.timeout(2500)
      this.isLoading = false
    },
    timeout(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms))
    }
  }
}
</script>
