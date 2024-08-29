<template>
  <div
    class="h-56 service w-full md:w-1/2 lg:flex-1 font-bold text-white leading-14 text-pink hover:text-pink-dark md:odd:pr-8 md:even:pl-8 lg:pr-16"
  >
    <div
      v-if="(type === 'flight' || type === 'carRent') && !editable"
      class="flex flex-wrap w-full text-pink"
    >
      <div v-if="tripType === '1'" class="flex flex-wrap w-full h-56">
        <div
          class="flex flex-wrap h-27 w-full items-center border-b border-black"
        >
          <div class="flex bg-white justify-center w-56 rounded-tl">
            <img
              class="w-28 pt-6 pb-5"
              :src="'/images/air-france-logo.svg'"
              alt=""
            />
          </div>
          <div
            class="flex flex-grow pl-8 bg-grey-dark h-full items-center rounded-tr pr-8"
          >
            <div class="flex flex-grow hover-underline">
              {{ from !== null ? from : '' }}
            </div>
            <div class="flex text-xs font-normal">
              {{ $t('flight.Departure') }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-wrap h-27 w-full items-center border-b border-black"
        >
          <div class="flex bg-white justify-center w-56 rounded-bl">
            <img class="w-28 pt-6 pb-5" :src="'/images/klm-logo.svg'" alt="" />
          </div>
          <div
            class="flex flex-grow pl-8 bg-grey-dark h-full items-center rounded-br pr-8"
          >
            <div class="flex flex-grow hover-underline">{{ to }}</div>
            <div class="flex text-xs font-normal">
              {{ $t('flight.Arrival') }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-wrap w-full h-56">
        <div
          class="flex flex-wrap h-full w-full items-center border-b border-black"
        >
          <div
            class="flex h-full bg-white justify-center w-56 rounded-tl rounded-bl"
          >
            <img
              class="pt-6 pb-5"
              :src="'/images/air-france-logo.svg'"
              alt=""
            />
          </div>
          <div
            class="flex flex-grow pl-8 bg-grey-dark h-full items-center rounded-tr rounded-br pr-8"
          >
            <div class="flex flex-grow hover-underline">
              {{ from !== null ? from : '' }}
            </div>
            <div class="flex text-xs font-normal">
              {{ $t('flight.Departure') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      :class="
        !editable
          ? 'bg-grey-dark'
          : currentPrice !== false || updating
          ? updating
            ? 'h-56 border border-dashed border-grey-dark hover:border-pink-dark'
            : 'h-56 border border-dashed border-white hover:border-pink-dark'
          : 'h-56 border border-dashed border-danger hover:danger-dark'
      "
      class="flex flex-wrap w-full rounded text-pink relative justify-center items-center"
    >
      <div class="flex flex-wrap w-56 h-56 lg:flex-initial">
        <img class="p-8" :src="logo" alt="" />
      </div>
      <div class="flex flex-1 px-8">
        <div
          :class="
            searchId !== '' && currentPrice !== false ? 'hover-underline' : ''
          "
          class="flex-auto lg:w-full xl:w-auto"
          @click="$emit('goToList')"
        >
          <div class="flex flex-col">
            <div class="flex flex-row">
              <div class="flex flex-wrap">
                <div :style="name !== '' ? 'mr-4' : ''" class="flex-initial">
                  {{ name }}
                </div>
                <StarRatings v-if="stars != null" :stars="stars" />
              </div>
              <span
                class="hover:underline hover:text-pink-dark cursor-help"
                :title="from !== null ? from : ''"
                >{{
                  shortFrom !== null ? shortFrom : from !== null ? from : ''
                }}</span
              >
              <i
                v-if="from !== null && to != null"
                class="fas fa-exchange-alt mx-8"
              ></i
              ><span
                class="hover:underline hover:text-pink-dark  cursor-help"
                :title="to !== null ? to : ''"
                >{{ shortTo !== null ? shortTo : to !== null ? to : '' }}</span
              >
            </div>
            <div
              v-show="!updating && currentPrice === false"
              class="text-xs leading-12 text-danger mt-2 no-underline"
            >
              {{ $t('general.TravelAssistantNoServiceResult') }}
            </div>
          </div>
        </div>
        <div
          v-show="editable"
          :style="editable && currentPrice !== false ? 'min-width: 136px;' : ''"
          :class="
            currentPrice !== false && !updating ? 'lg:w-full xl:w-auto' : ''
          "
          class="flex text-right lg:mt-4 lg:text-left xl:mt-0 xl:text-right items-center justify-end"
        >
          <div v-show="updating" class="text-grey-dark updating">
            {{ $t('general.Updating') }}
          </div>
          <div v-show="!updating && currentPrice !== false">
            <span class="text-xs mr-4 font-normal no-underline">{{
              $t('general.As')
            }}</span>
            <span
              class="current-price cursor-pointer hover:underline"
              :class="
                priceWatch === 'increase'
                  ? 'text-danger'
                  : priceWatch === 'decrease'
                  ? 'text-primary'
                  : ''
              "
              >{{ currency }}
              {{
                currentPrice | formatNumber('0,0', { thousandsSeparator: ' ' })
              }}<i
                :class="
                  priceWatch === 'increase'
                    ? 'fa-arrow-alt-up'
                    : priceWatch === 'decrease'
                    ? 'fa-arrow-alt-down'
                    : 'fa-horizontal-rule'
                "
                class="ml-4 fas"
              ></i>
              <div
                class="tooltip flex flex-wrap invisible text-left px-8 absolute w-full py-12 bg-white top-56 left-0 rounded text-black text-xs border-1 z-30 lg:w-2/4 lg:left-0 lg:right-0 lg:ml-auto lg:mr-auto lg:py-12 xl:w-full xl:py-12"
              >
                <div
                  class="flex-1 mr-6 lg:mr-0 lg:flex-auto lg:w-full xl:flex-1 xl:mr-6 leading-12"
                >
                  <div class="w-full text-grey-dark font-normal lowercase">
                    {{ $t('general.Min') }}:
                  </div>
                  <div class="flex mt-4">
                    <div v-show="false" class="flex-initial">
                      <div class="flex-initial">1</div>
                      <div class="flex-initial mx-2">
                        <span class="bg-black ff-currency"></span>DV
                      </div>
                      +
                    </div>
                    <div class="flex-initial">
                      {{ currency }}
                      {{
                        minPrice
                          | formatNumber('0,0', { thousandsSeparator: ' ' })
                      }}
                    </div>
                  </div>
                </div>
                <div
                  class="flex-1 mx-6 lg:mx-0 lg:flex-auto lg:w-full lg:mt-12 xl:flex-1 xl:mx-6 xl:mt-0 leading-12"
                >
                  <div class="w-full font-normal lowercase">
                    {{ $t('general.Current') }}:
                  </div>
                  <div class="flex mt-4">
                    <div v-show="false" class="flex-initial">
                      <div class="flex-initial">1</div>
                      <div class="flex-initial mx-2">
                        <span class="bg-black ff-currency"></span>DV
                      </div>
                      +
                    </div>
                    <div class="flex-initial">
                      {{ currency }}
                      {{
                        currentPrice
                          | formatNumber('0,0', { thousandsSeparator: ' ' })
                      }}
                    </div>
                  </div>
                </div>
                <div
                  class="flex-1 ml-5 lg:ml-0 lg:flex-auto lg:w-full lg:mt-12 xl:flex-1 xl:ml-5 xl:mt-0 leading-12"
                >
                  <div class="w-full text-grey-dark font-normal lowercase">
                    {{ $t('general.Max') }}:
                  </div>
                  <div class="flex mt-4">
                    <div v-show="false" class="flex-initial">
                      <div class="flex-initial">1</div>
                      <div class="flex-initial mx-2">
                        <span class="bg-black ff-currency"></span>DV
                      </div>
                      +
                    </div>
                    <div class="flex-initial">
                      {{ currency }}
                      {{
                        maxPrice
                          | formatNumber('0,0', { thousandsSeparator: ' ' })
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
      <div
        v-show="deletable"
        class="absolute delete-service text-base bg-black cursor-pointer hover:text-danger"
        @click="$emit('removeTravelAssistantService')"
      >
        <i class="fas fa-times-circle"></i>
      </div>
    </div>
  </div>
</template>

<script>
import StarRatings from '@/components/micro/StarRatings'
export default {
  name: 'TravelAssistantServiceItem',
  components: { StarRatings },
  props: {
    logo: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    from: {
      type: String,
      default: null
    },
    shortFrom: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    shortTo: {
      type: String,
      default: null
    },
    stars: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      required: true
    },
    minPrice: {
      type: [Boolean, Number],
      default: false
    },
    currentPrice: {
      type: [Boolean, Number],
      default: false
    },
    maxPrice: {
      type: [Boolean, Number],
      default: false
    },
    priceWatch: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    updating: {
      type: Boolean,
      required: true
    },
    tripType: {
      type: String,
      default: null
    },
    deletable: {
      type: Boolean,
      required: true
    },
    searchId: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.delete-service {
  top: -8px;
  right: -8px;
}

.updating {
  animation: blinker;
  animation-duration: 500ms;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes blinker {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.30000001192092896;
  }
  100% {
    opacity: 1;
  }
}
.current-price:hover > .tooltip {
  visibility: visible;
}

.service:hover .hover-underline {
  @apply underline;
  @apply cursor-pointer;
  @apply text-pink-dark;
}
</style>
