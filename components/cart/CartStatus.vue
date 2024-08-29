<template>
  <div ref="cartStatus" :style="'height:' + height">
    <div v-show="!isWeboffice" class="bg-primary-gradient h-1 w-full"></div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto min-h-0">
      <div v-show="!isWeboffice" class="flex flex-row text-primary">
        <i
          class="fa fa-chevron-left text-sm leading-14 cursor-pointer"
          @click="$router.push(localePath('/'))"
        ></i>
        <div class="ml-8">
          <p
            class="text-sm leading-14 font-bold mb-6 cursor-pointer"
            @click="$router.push(localePath('/'))"
          >
            {{ $t('general.backToHome') }}
          </p>
        </div>
      </div>
      <div
        :class="getTextColorClass"
        class="flex flex-col text-center mt-40 mb-56"
      >
        <div>
          <i :class="getFAIcon" class="fa-5x"></i>
        </div>
        <div class="text-lg leading-24 mt-12 font-bold">{{ title }}</div>
        <div
          class="text-black text-sm leading-20 mt-8 md:px-92 mx-auto"
          :class="!isWeboffice ? 'xl:px-320 lg:px-216' : 'lg:px-60'"
        >
          {{ description }}
        </div>
        <div v-if="showRelevantOffers">
          <div class="font-bold text-black text-sm leading-20">
            Javasolhatunk néhány ajánlatot a foglalásához?
          </div>
          <RelevantOffers class="mt-24" />
        </div>
        <div v-if="type === 'error'" class="text-center">
          <ButtonSmall
            class="mt-16"
            type="inverted"
            @click="$router.push(localePath('support'))"
          >
            {{ $t('general.GetSupport') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonSmall from '@/components/micro/ButtonSmall'

import RelevantOffers from '@/components/RelevantOffers'
export default {
  name: 'CartStatus',
  components: { RelevantOffers, ButtonSmall },
  props: {
    type: {
      type: String,
      required: true
    },
    showRelevantOffers: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isWeboffice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 'auto'
    }
  },
  computed: {
    getFAIcon() {
      if (this.type === 'success') {
        return 'fal fa-smile-wink'
      } else if (this.type === 'pending') {
        return 'fal fa-clock'
      } else if (this.type === 'error') {
        return 'fal fa-frown'
      }
      return ''
    },
    getTextColorClass() {
      if (this.type === 'success') {
        return 'text-primary'
      } else if (this.type === 'pending') {
        return 'text-warning'
      } else if (this.type === 'error') {
        return 'text-danger'
      }
      return ''
    },
    getHeight() {
      return window.innerHeight - 606
    }
  },
  mounted() {
    this.calculateHeight()
    window.addEventListener('resize', this.calculateHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateHeight)
  },
  methods: {
    calculateHeight() {
      if (
        window.innerWidth > 1023 &&
        this.$refs.cartStatus.clientHeight < window.innerHeight - 606
      ) {
        this.height = window.innerHeight - 606 + 'px'
      }
    }
  }
}
</script>
