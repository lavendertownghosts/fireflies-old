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
      <iframe
        ref="iframeRef"
        src="https://fireflies.tickets-partners.com"
        style="border:0px #ffffff none; width: 100%; height: 100vh; overflow-x: hidden;"
        name="myiFrame"
        frameborder="0"
        marginheight="0px"
        marginwidth="0px"
        height="100%"
        width="100%"
        allowfullscreen
      />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingAnimation from '@/components/micro/LoadingAnimation'

export default {
  name: 'Sports',
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
