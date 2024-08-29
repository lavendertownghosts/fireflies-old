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
      <div v-show="request && request.adults !== undefined">
        <p
          class="font-bold text-base w-240 leading-16 truncate mb-4"
          v-html="computedSearchDestination"
        ></p>
        <p class="text-sm leading-14 mb-4">
          {{ computedDates }}
        </p>
        <p class="text-sm leading-14">
          {{ computedGuests }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingAnimation from '@/components/micro/LoadingAnimation'
import { formatDateDisplay, getGuestText } from '@/includes/utils'
export default {
  name: 'LoadingLayerCarRentalsearch',
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
      if (
        this.request &&
        this.request.from !== undefined &&
        this.request.to !== undefined
      ) {
        return (
          this.request.from +
          '<i class="mx-4 far fa-long-arrow-right"></i>' +
          this.request.to
        )
      } else {
        return ''
      }
    },
    computedDates() {
      return (
        formatDateDisplay(this.request.checkin) +
        ' ' +
        this.request.checkinTime +
        ' - ' +
        formatDateDisplay(this.request.checkout) +
        ' ' +
        this.request.checkoutTime
      )
    },
    computedGuests() {
      return getGuestText(this.request.adults, this.request.children)
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
