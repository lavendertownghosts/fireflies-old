<template>
  <div class="flex flex-col">
    <h3
      v-show="getFilterHistory.length > 0"
      class="text-sm leading-14 text-grey font-bold mb-12"
    >
      {{ $t('general.PreviousFilters') }}
    </h3>
    <HistoryHotelFilter
      v-for="(history, i) in getFilterHistory"
      :key="i"
      :history="history"
      :is-disabled="true"
    />

    <h3 class="text-sm leading-14 text-grey font-bold mt-12 mb-8">
      {{ $t('hotel.Category') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="star5" :is-disabled="true">
        <StarRatings :stars="5" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="star4" :is-disabled="true">
        <StarRatings :stars="4" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="star3" :is-disabled="true">
        <StarRatings :stars="3" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="star2" :is-disabled="true">
        <StarRatings :stars="2" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end">
      <InputCheckbox v-model="star1" :is-disabled="true">
        <StarRatings :stars="1" star-class="text-3xs" position="center" />
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>

    <h3 class="text-sm leading-14 text-grey font-bold mb-12 mt-24">
      {{ $t('hotel.Supply') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="supply10" :is-disabled="true">
        {{ $t('hotel.RoomOnly') }}
      </InputCheckbox>
      <p class="text-sm">10</p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="supply20" :is-disabled="true">
        {{ $t('hotel.WithBreakfast') }}
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div
      class="flex flex-row justify-between items-end"
      :class="showMoreSupply ? 'mb-4' : 'mb-12'"
    >
      <InputCheckbox v-model="supply30" :is-disabled="true">
        {{ $t('hotel.HB') }}
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div
      v-show="showMoreSupply"
      class="flex flex-row justify-between items-end mb-4"
    >
      <InputCheckbox v-model="supply40" :is-disabled="true">
        {{ $t('hotel.FullBoard') }}
      </InputCheckbox>
      <p class="text-sm">10</p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="supply50" :is-disabled="true">
        {{ $t('hotel.AllInclusive') }}
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>

    <!--    <h3 class="text-sm leading-14 text-grey font-bold mb-12 mt-24">-->
    <!--      Opciók-->
    <!--    </h3>-->
    <!--    <div class="flex flex-row justify-between items-end mb-4">-->
    <!--      <InputCheckbox v-model="payment_bpo_tc" :is-disabled="true">-->
    <!--        BPO és / vagy Utazási egyenleg-->
    <!--      </InputCheckbox>-->
    <!--      <p class="text-sm"></p>-->
    <!--    </div>-->
    <!--    <div class="flex flex-row justify-between items-end mb-12">-->
    <!--      <InputCheckbox v-model="payment_promo" :is-disabled="true">-->
    <!--        Kedvezményes ajánlat-->
    <!--      </InputCheckbox>-->
    <!--      <p class="text-sm"></p>-->
    <!--    </div>-->
    <!--    <p class="text-grey text-sm cursor-pointer">További opciók</p>-->

    <h3 class="text-sm leading-14 text-grey font-bold mb-12 mt-24">
      {{ $t('hotel.PriceRange') }}
    </h3>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="price_slot_0_100" :is-disabled="true">
        EUR 0 - EUR 100
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="price_slot_100_250" :is-disabled="true">
        EUR 100 - EUR 250
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="price_slot_250_500" :is-disabled="true">
        EUR 250 - EUR 500
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="price_slot_500_1000" :is-disabled="true">
        EUR 500 - EUR 1000
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>
    <div class="flex flex-row justify-between items-end mb-4">
      <InputCheckbox v-model="price_slot_1000_plus" :is-disabled="true">
        EUR 1000 +
      </InputCheckbox>
      <p class="text-sm"></p>
    </div>

    <div class="flex flex-col">
      <!-- Hotel facilities -->
      <h3 class="text-sm leading-14 text-grey font-bold mb-12 mt-24">
        {{ $t('hotel.Facilities') }}
      </h3>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox :is-disabled="true">
          <p class="truncate">
            {{ $t('hotel.RoomService') }}
          </p>
        </InputCheckbox>
        <p class="text-sm"></p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox :is-disabled="true">
          <p class="truncate">
            {{ $t('hotel.WellnessCenter') }}
          </p>
        </InputCheckbox>
        <p class="text-sm"></p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox :is-disabled="true">
          <p class="truncate">
            {{ $t('hotel.AirportTransfer') }}
          </p>
        </InputCheckbox>
        <p class="text-sm"></p>
      </div>

      <p class="text-grey text-sm cursor-pointer">
        {{ $t('hotel.MoreFacilities') }}
      </p>

      <!-- Hotel themes -->

      <h3 class="text-sm leading-14 text-grey font-bold mb-12 mt-24">
        {{ $t('hotel.HotelThemes') }}
      </h3>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox :is-disabled="true">
          <p class="truncate">
            {{ $t('hotel.Family') }}
          </p>
        </InputCheckbox>
        <p class="text-sm"></p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox :is-disabled="true">
          <p class="truncate">
            {{ $t('hotel.Design') }}
          </p>
        </InputCheckbox>
        <p class="text-sm"></p>
      </div>
      <div class="flex flex-row justify-between items-end mb-4">
        <InputCheckbox :is-disabled="true">
          <p class="truncate">
            {{ $t('hotel.Beach') }}
          </p>
        </InputCheckbox>
        <p class="text-sm"></p>
      </div>

      <p class="text-grey text-sm cursor-pointer">
        {{ $t('hotel.MoreHotelThemes') }}
      </p>
    </div>

    <ButtonSmall :is-disabled="true" class="w-full my-24" type="inverted">
      {{ $t('general.Filter') }}
    </ButtonSmall>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistoryHotelFilter from '@/components/history/HistoryHotelFilter'

import InputCheckbox from '@/components/micro/InputCheckbox'
import StarRatings from '@/components/micro/StarRatings'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'HotelFilterFormDummy',
  components: {
    HistoryHotelFilter,
    InputCheckbox,
    StarRatings,
    ButtonSmall
  },
  data() {
    return {
      dynamicFilters: {
        facilities: [],
        themes: []
      },
      showDynamicFilters: false,

      price_slot_0_100: false,
      price_slot_100_250: false,
      price_slot_250_500: false,
      price_slot_500_1000: false,
      price_slot_1000_plus: false,

      star1: false,
      star2: false,
      star3: false,
      star4: false,
      star5: false,

      supply10: false,
      supply20: false,
      supply30: false,
      supply40: false,
      supply50: false,
      supply60: false,

      payment_bpo_tc: false,
      payment_promo: false,

      showLimit: 3,
      showMoreSupply: false,
      showMore: {
        '1': false,
        '2': false
      }
    }
  },
  computed: {
    ...mapGetters('hotel', ['getFilterHistory']),
    currency() {
      // global currency getter
      return 'EUR'
    },
    sidebarTruncateValue() {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        return 30
      } else {
        return 35
      }
    }
  }
}
</script>
