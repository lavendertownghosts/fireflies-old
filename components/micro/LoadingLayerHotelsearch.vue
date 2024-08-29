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
      class="loading-layer-modal-wrapper bg-primary-gradient rounded text-white text-center p-16 flex flex-col items-center justify-center"
    >
      <p class="text-xs leading-12 pulse-me">{{ $t('hotel.LoadingOffers') }}</p>
      <div class="my-16">
        <LoadingAnimation color="white" />
      </div>
      <div v-show="request">
        <p class="font-bold w-240 text-base leading-16 truncate mb-4">
          {{ computedSearchDestination }}
        </p>
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
  name: 'LoadingLayerHotelsearch',
  components: {
    LoadingAnimation
  },
  props: {
    request: {
      type: [Object, Boolean],
      default: false
    },
    // abszolút vagy frame-et kitöltő
    isLocal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedSearchDestination() {
      if (this.request && this.request.fts_name !== undefined) {
        return this.request.fts_name
          .split(', ')
          .reverse()
          .join(', ')
      } else {
        return ''
      }
    },
    computedDates() {
      return this.request
        ? formatDateDisplay(this.request.checkin) +
            ' - ' +
            formatDateDisplay(this.request.checkout)
        : ''
    },
    computedGuests() {
      if (!this.request) {
        return ''
      } else {
        return getGuestText(this.adults, this.children)
      }
    },
    adults() {
      return !this.request ? 1 : this.request.rooms[0].adults
    },
    children() {
      return !this.request ? 0 : this.request.rooms[0].children
    }
  }
}
</script>

<style>
.loading-layer-modal-wrapper {
  width: 288px;
  height: 188px;
}
</style>
