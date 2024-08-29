<template>
  <div
    class="flex flex-col rounded border border-grey-light sm:flex-row md:flex-col md:rounded-b-none"
  >
    <div class="w-full sm:w-1/2 md:w-full">
      <div
        v-if="imageUrl !== false"
        class="relative w-full rounded-t overflow-hidden justify-center sm:rounded-tr-none sm:rounded-bl md:w-full md:rounded-b-none"
        :style="'height:' + imageHeight"
      >
        <div
          class="absolute top-0 bottom-0 right-0 left-0 w-full text-center flex items-center justify-center"
        >
          <i class="far fa-image-polaroid text-xl"></i>
        </div>
        <div
          :class="imageStyle"
          :style="'background-image: url(' + imageUrl + ')'"
          class="absolute top-0 bottom-0 right-0 left-0 bg-center"
        ></div>
      </div>
      <slot />
    </div>
    <div
      :class="detailsStyle"
      class="text-sm leading-14 text-black p-16 sm:w-1/2 md:w-full"
    >
      <div v-if="hotelText" class="flex flex-row w-full">
        <div class="w-20 mr-4 text-center">
          <img src="~assets/images/hotel-cart.svg" width="16" height="16" />
        </div>
        <div class="sm:w-3/4 flex md:w-auto">
          {{ hotelText }}
          <sup>
            <StarRatings
              :stars="hotelStars"
              star-class="text-3xs"
              class="pl-5"
              position="center"
            />
          </sup>
        </div>
      </div>
      <div v-if="hotelText" class="bg-grey-light h-1 my-12"></div>
      <div v-if="dateText !== ''" class="flex flex-row w-full">
        <div class="w-20 mr-4 text-center">
          <i class="far fa-calendar-alt"></i>
        </div>
        <div class="sm:w-3/4 md:w-auto" v-html="dateText"></div>
      </div>
      <div v-if="dateText !== ''" class="bg-grey-light h-1 my-12"></div>
      <div class="flex flex-row w-full">
        <div class="w-20 mr-4 text-center">
          <i class="far fa-user-friends"></i>
        </div>
        <div v-if="roompacks.length === 0">{{ guestText }}</div>
        <div v-else>{{ getGuestText(adultCount, childrenCount) }}</div>
      </div>
      <div v-if="pickupText">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-4 text-center">
            <i class="far fa-car-side"></i>
          </div>
          <div class="w-9/12">{{ pickupText }}</div>
        </div>
      </div>
      <div v-if="roomText && roompacks.length === 0">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-4 text-center">
            <i class="far fa-bed"></i>
          </div>
          <div>{{ roomText }}</div>
        </div>
      </div>
      <div v-if="roompacks.length > 0">
        <div v-for="(item, key) in roompacks[0].rooms" :key="key">
          <div class="bg-grey-light h-1 my-12"></div>
          <div class="flex flex-row w-full">
            <div v-if="key == 0" class="w-20 mr-4 text-center">
              <i class="far fa-bed"></i>
            </div>
            <div>
              {{ item.room + ', ' + getBoardName(roompacks[0].supply) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="carText">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-4 text-center">
            <i class="far fa-car-side"></i>
          </div>
          <div class="w-9/12">{{ carText }}</div>
        </div>
      </div>
      <div v-if="infoText">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-4 text-center">
            <i class="far fa-info-circle"></i>
          </div>
          <div class="w-9/12">{{ infoText }}</div>
        </div>
      </div>
      <div v-if="services !== false">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-4 text-center">
            <i class="far fa-umbrella-beach"></i>
          </div>
          <div class="w-9/12">{{ services }}</div>
        </div>
      </div>
      <div v-if="isBusiness !== false">
        <div class="bg-grey-light h-1 my-12"></div>
        <div class="flex flex-row w-full">
          <div class="w-20 mr-4 text-center">
            <i class="far fa-suitcase"></i>
          </div>
          <div v-if="isBusiness == 'business'" class="w-9/12">
            {{ $t('exclusive_offers.Business') }}
          </div>
          <div v-else class="w-9/12">
            {{ $t('exclusive_offers.NotBusiness') }}
          </div>
        </div>
      </div>
      <div v-if="cancellationText" class="bg-grey-light h-1 my-12"></div>
      <div v-if="cancellationText" class="flex flex-row w-full text-danger">
        <div class="w-20 mr-4 text-center">
          <i class="fas fa-times"></i>
        </div>
        <div>{{ $t('general.CancellationText') }} {{ cancellationText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRatings from '@/components/micro/StarRatings'
import { getGuestText, getBoardName } from '@/includes/utils'

export default {
  name: 'ServicePreview',
  components: {
    StarRatings
  },
  props: {
    imageUrl: {
      type: [String, Boolean],
      required: true
    },
    imageStyle: {
      type: String,
      default: 'bg-cover'
    },
    imageHeight: {
      type: String,
      default: '180px'
    },
    dateText: {
      type: String,
      default: ''
    },
    // tematikus
    hotelText: {
      type: [Boolean, String],
      default: false
    },
    // tematikus
    hotelStars: {
      type: [Boolean, Number],
      default: 0
    },
    roompacks: {
      type: [Array],
      default() {
        return []
      }
    },
    roomText: {
      type: [Boolean, String],
      default: false
    },
    carText: {
      type: [Boolean, String],
      default: false
    },
    infoText: {
      type: [Boolean, String],
      default: false
    },
    isBusiness: {
      type: [Boolean, String],
      default: false
    },
    services: {
      type: [Boolean, String],
      default: false
    },
    detailsStyle: {
      type: String,
      default: ''
    },
    cancellationText: {
      type: [Boolean, String],
      default: false
    },
    guestText: {
      type: String,
      default: ''
    },
    pickupText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      getGuestText,
      getBoardName
    }
  },
  computed: {
    adultCount() {
      if (this.roompacks[0].rooms !== undefined) {
        return this.roompacks[0].rooms.reduce(
          (sum, { adult }) => sum + adult,
          0
        )
      } else {
        return 0
      }
    },
    childrenCount() {
      if (this.roompacks[0].rooms !== undefined) {
        return this.roompacks[0].rooms.reduce(
          (sum, { child }) => sum + child,
          0
        )
      } else {
        return 0
      }
    }
  }
}
</script>
