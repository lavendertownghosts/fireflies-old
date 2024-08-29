<template>
  <div
    :class="[
      isLocal
        ? 'absolute h-full pt-177 sm:pt-72 md:pt-128 lg:pt-216'
        : 'fixed top-0 bottom-0 left-0 h-screen items-center'
    ]"
    class="bg-white-opaque w-full flex justify-center z-30 overflow-hidden px-16"
  >
    <div
      :class="{
        'mx-auto': isLocal
      }"
      class="loading-layer-modal-wrapper bg-primary-gradient rounded text-white text-center p-16 pt-24"
    >
      <p class="text-xs leading-12 pulse-me">
        {{ $t('general.SearchOffers') }}
      </p>
      <div class="my-16">
        <LoadingAnimation color="white" />
      </div>
      <div v-show="request">
        <p
          class="font-bold w-240 text-base leading-16 truncate mb-4"
          v-html="computedSearchDestination"
        ></p>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingAnimation from '@/components/micro/LoadingAnimation'
import { formatDateDisplay } from '@/includes/utils'
export default {
  name: 'LoadingLayerRoundTripsearch',
  components: {
    LoadingAnimation
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    },
    isLocal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedSearchDestination() {
      if (this.request && this.request.destination !== undefined) {
        return this.request.destination
      } else {
        return ''
      }
    },
    computedDates() {
      return (
        formatDateDisplay(this.request.checkin) +
        ' - ' +
        formatDateDisplay(this.request.checkout)
      )
    },
    computedGuests() {
      const adultString = this.request.adults > 1 ? 'adults' : 'adult'
      const childString = this.request.children > 1 ? 'children' : 'child'

      let returnString = this.request.adults + ' ' + adultString
      if (this.request.children > 0) {
        returnString += ', ' + this.request.children + ' ' + childString
      }

      return returnString
    }
  }
}
</script>

<style>
.loading-layer-modal-wrapper {
  width: 288px;
  height: 152px;
}
</style>
