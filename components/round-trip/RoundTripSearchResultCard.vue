<template>
  <div
    :class="hover ? 'border-grey' : 'border-grey-light'"
    class="flex flex-col lg:flex-row border rounded cursor-pointer"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="$emit('showRoundTripDetails', { id: roundTrip.activity_id })"
  >
    <!-- Body-->
    <div class="w-full flex flex-col">
      <div class="flex flex-col sm:flex-row sm:mb-0">
        <div
          class="flex flex-initial w-full sm:mr-16 relative index-image h-240 sm:h-auto"
        >
          <div
            class="absolute top-0 bottom-0 right-0 left-0 bg-cover lg:rounded-bl"
            :style="{
              backgroundImage: 'url(' + roundTrip.activity_feat_image + ')'
            }"
          ></div>
        </div>
        <div
          class="flex flex-grow flex-col sm:justify-center px-16 py-16 sm:pl-0"
        >
          <div class="flex flex-row w-full">
            <div class="flex flex-col justify-center w-full">
              <div
                :class="[hover ? 'underline' : '']"
                class="font-bold leading-16 text-black w-full max-name"
              >
                {{ roundTrip.activity_title }}
              </div>
              <div
                v-if="roundTrip.activity_duration !== undefined"
                class="text-black leading-16 mt-12"
                :title="
                  $t('roundtrip.Period') + ': ' + roundTrip.activity_duration
                "
              >
                <i class="far fa-clock mr-4"></i
                >{{ calculateWeek(roundTrip.activity_duration) }}
              </div>
              <div
                class="text-sm leading-14 cursor-pointer link mt-12"
                @click.stop
                @click="$emit('showRoundTripBreakpoints')"
              >
                {{ getBreakpointsTitle }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="showBreakpoints" class="flex flex-col">
        <div class="bg-grey-light h-1 mb-16"></div>
        <div class="px-16 pb-15">
          <div class="text-sm leading-14 font-bold text-black mb-16">
            {{ $t('roundtrip.Visiting') }}:
          </div>
          <VerticalSimpleTimeline
            :stops="1"
            :timeline="getTimeline"
            :details-column-width="'w-full'"
            class="mt-10 mb-13 ml-4"
          />
        </div>
      </div>
    </div>
    <!-- Footer-->
    <div
      :class="[
        'bg-grey-lighter-opaque border-t border-grey-light lg:border-t-0 lg:border-l'
      ]"
      class="flex flex-row w-full flex-1 lg:w-full"
    >
      <div
        class="flex flex-row w-full justify-end items-center lg:flex-col lg:justify-center lg:mx-4"
      >
        <div
          v-show="roundTrip.activity_fullprice[currency] > 0"
          class="text-center"
        >
          <div class="text-2x text-black font-bold">
            {{ currency }}
            {{
              Math.ceil(roundTrip.activity_fullprice[currency])
                | formatNumber('0,0', { thousandsSeparator: ' ' })
            }}
          </div>
          <div class="text-sm mb-4">
            {{ $t('general.textOr') }}
          </div>
        </div>
        <div
          class="text-2x text-warning leading-18 font-bold mr-16 items-center lg:flex lg:w-full lg:justify-center lg:mr-0 lg:min-w-grid-xs"
        >
          <span v-if="priceType === 'BPO' && roundTrip.activity_bpo > 0">
            <span class="pr-6 lg:pr-0 xl:pr-6">{{
              roundTrip.activity_bpo
            }}</span
            ><span class="pr-6 lg:pr-0 xl:pr-6"
              ><img
                class="-mt-7 inline"
                src="~static/images/bpo-logo.svg"/></span
            ><span
              v-show="roundTrip.activity_price[currency] > 0"
              class="pr-6 lg:pr-0 xl:pr-6"
              >+</span
            >
          </span>
          <span v-if="priceType === 'HC' && roundTrip.activity_bpo > 0">
            <span class="pr-6 lg:pr-0 xl:pr-6">{{
              roundTrip.activity_bpo
            }}</span
            ><span class="ff-currency mt-2 bg-warning bpo"></span
            ><span class="pr-6 lg:pr-0 xl:pr-6">HC</span
            ><span
              v-show="roundTrip.activity_price[currency] > 0"
              class="pr-6 lg:pr-0 xl:pr-6"
              >+</span
            >
          </span>
          <span v-show="roundTrip.activity_price[currency] > 0">
            {{ currency }}
            {{
              Math.ceil(roundTrip.activity_price[currency])
                | formatNumber('0,0', { thousandsSeparator: ' ' })
            }}
          </span>
        </div>
        <div
          class="mr-16 my-15 bg-dark-hard lg:flex lg:w-full lg:m-0 lg:mt-16 lg:justify-center"
        >
          <div class="flex flex-col cursor-pointer">
            <ButtonSmall :type="'inverted'">
              {{ $t('general.Details') }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { calculateWeek } from '@/includes/utils'
import ButtonSmall from '@/components/micro/ButtonSmall'
import VerticalSimpleTimeline from '@/components/micro/VerticalSimpleTimeline'

export default {
  name: 'RoundTripSearchResultCard',
  components: {
    ButtonSmall,
    VerticalSimpleTimeline
  },
  props: {
    roundTrip: {
      type: Object,
      required: true
    },
    priceType: {
      type: String,
      default: 'BPO'
    },
    showBreakpoints: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerWidth: 0,
      hover: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    },
    getBreakpointsTitle() {
      return (
        this.roundTrip.activity_route.split('#').length +
        ' ' +
        this.$t('roundtrip.Location')
      )
    },
    getTimeline() {
      const route = this.roundTrip.activity_route.split('#')
      const timeline = []
      if (route.length > 0) {
        route.forEach((item) => {
          timeline.push({
            title: item,
            subtitle: ''
          })
        })
      }
      return timeline
    }
  },
  methods: {
    calculateWeek(days) {
      return calculateWeek(days)
    }
  }
}
</script>

<style scoped>
.index-image {
  padding-top: 75%;
}
@media (min-width: 520px) {
  .index-image {
    width: 212px;
    padding-top: 160px;
  }
}
.max-name {
  max-width: fit-content;
}
</style>
