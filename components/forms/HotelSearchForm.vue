<template>
  <div>
    <div v-if="!isHomepage">
      <div class="px-16 pt-16 pb-16 md:pb-12 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-col lg:flex-row">
          <div class="lg:w-5/12 lg:pr-1 xl:w-7/12">
            <InputHotelNamesearch
              v-model="nameSearch"
              :is-dark="isDark"
              :label="$t('hotel.NameSearch')"
              :error="nameSearchError"
              :component-attr-id="nameSearchInputId"
            />
          </div>
          <div class="flex flex-col sm:flex-row lg:w-7/12 xl:w-5/12">
            <InputDateRange
              v-model="dates"
              :is-dark="isDark"
              :max-date-year="1"
              :max-date-interval="30"
              :disable-past="true"
              :label-checkin="$t('hotel.Checkin')"
              :label-checkout="$t('hotel.Checkout')"
              class="flex flex-row mt-8 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-5/12"
              :input-style="['lg:border-r-0 lg:-mr-1 lg:rounded-none']"
            />
            <div class="mt-8 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-4/12">
              <InputGuestsMultipleRooms
                v-model="guests"
                class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1"
                :label="$t('hotel.Guests')"
                :is-dark="isDark"
                :input-style="['lg:rounded-none']"
              />
            </div>
            <div class="hidden mt-24 md:w-5/12 md:block lg:mt-16 lg:w-3/12">
              <div class="flex flex-row items-end justify-end">
                <ButtonMedium
                  class="uppercase w-1/2 lg:w-full lg:mt-1"
                  type="danger"
                  :input-style="['lg:rounded-l-none']"
                  :is-loading="searchInitLoading"
                  @click="startHotelSearch()"
                  >{{ $t('general.Search') }}</ButtonMedium
                >
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between">
          <div
            class="flex flex-col md:flex-row md:items-center md:w-3/4 md:justify-start mt-8"
          >
            <div
              class="text-sm leading-14 mt-1 mb-6 md:w-auto md:pr-16"
              :class="isCis ? 'md:hidden lg:block' : ''"
            >
              {{ $t('general.WhatWouldYouPay') }}
            </div>
            <div v-show="!isCis" class="ml-16 mb-6 md:w-auto md:pr-16">
              <InputRadio
                v-model="radio"
                :label="$t('general.BestPriceOption')"
                :selected="'bpo'"
                :is-dark="isDark"
              />
            </div>
            <div
              v-show="allowedCountry && allowedpackage"
              class="ml-16 mb-6 md:w-auto md:pr-16"
            >
              <InputRadio
                v-model="radio"
                :label="$t('general.CreditCard')"
                :selected="isCis ? 'card_cis' : 'card'"
                :is-dark="isDark"
              />
            </div>
            <div class="ml-16 mb-6 md:w-auto" :class="isCis ? 'md:pr-16' : ''">
              <InputRadio
                v-model="radio"
                :label="
                  !getAllowedPV
                    ? $t('hotel.DiamondVoucher')
                    : $t('general.PremiumVoucher')
                "
                :selected="isCis ? 'voucher_cis' : 'voucher'"
                :is-dark="isDark"
              />
            </div>
            <div v-show="isCis" class="mb-6 md:w-auto md:pr-16">
              <InputRadio
                v-model="radio"
                :label="$t('hotel.Credit')"
                :selected="'credit'"
                :is-dark="isDark"
              />
            </div>
            <div v-show="isCis" class="mb-6 md:w-auto">
              <InputRadio
                v-model="radio"
                :label="$t('hotel.DiamondVoucherAndCredit')"
                :selected="'voucher_credit'"
                :is-dark="isDark"
              />
            </div>
          </div>
          <div class="mt-12 md:hidden">
            <ButtonMedium
              class="uppercase w-full"
              type="danger"
              :is-loading="searchInitLoading"
              @click="startHotelSearch()"
              >{{ $t('general.Search') }}</ButtonMedium
            >
          </div>
          <ServiceSelectDropdown v-show="!isHomepage" :is-dark="isDark">{{
            $t('general.OtherServices')
          }}</ServiceSelectDropdown>
        </div>
      </div>
    </div>
    <div v-else class="rounded bg-black bg-opacity-60 p-24">
      <div class="flex flex-row w-full">
        <InputHotelNamesearch
          v-model="nameSearch"
          :is-dark="isDark"
          :label="$t('hotel.NameSearch')"
          :error="nameSearchError"
          :input-style="'lg:border-r-5'"
          :component-attr-id="nameSearchInputId"
        />
      </div>
      <div class="flex flex-row w-full">
        <InputDateRange
          v-model="dates"
          :is-dark="isDark"
          :max-date-year="1"
          :max-date-interval="30"
          :disable-past="true"
          :label-checkin="$t('hotel.Checkin')"
          :label-checkout="$t('hotel.Checkout')"
          :wrapper-style-checkin="['lg:pr-8']"
          :wrapper-style-checkout="['lg:pl-8']"
          class="w-full flex flex-row mt-16"
        />
      </div>
      <div class="flex flex-row w-full">
        <InputGuestsMultipleRooms
          v-model="guests"
          class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1 mt-16"
          :label="$t('hotel.Guests')"
          :is-dark="isDark"
        />
      </div>
      <div class="flex flex-row w-full mt-16">
        <ButtonMedium
          class="uppercase w-full"
          type="danger"
          :is-loading="searchInitLoading"
          @click="startHotelSearch()"
          >{{ $t('general.Search') }}</ButtonMedium
        >
      </div>
      <div class="flex flex-row w-full">
        <div class="text-2x font-bold mt-16 text-white mb-6">
          {{ $t('general.WhatWouldYouPay') }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="ml-16 mb-6 md:w-auto md:pr-16">
          <InputRadio
            v-model="radio"
            :label="$t('general.BestPriceOption')"
            :selected="'bpo'"
            :is-dark="isDark"
          />
        </div>
        <div
          v-show="allowedCountry && allowedpackage"
          class="ml-16 mb-6 md:w-auto md:pr-16"
        >
          <InputRadio
            v-model="radio"
            :label="$t('general.CreditCard')"
            :selected="'card'"
            :is-dark="isDark"
          />
        </div>
        <div class="ml-16 mb-6 md:w-auto">
          <InputRadio
            v-model="radio"
            :label="
              !getAllowedPV
                ? $t('hotel.DiamondVoucher')
                : $t('general.PremiumVoucher')
            "
            :selected="'voucher'"
            :is-dark="isDark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

import InputDateRange from '@/components/micro/InputDateRange'
import InputRadio from '@/components/micro/InputRadio'
import InputGuestsMultipleRooms from '@/components/micro/InputGuestsMultipleRooms'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputHotelNamesearch from '@/components/micro/InputHotelNamesearch'
import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'

import { getTomorrow, getDayAfterTomorrow, isArray } from '@/includes/utils'

export default {
  name: 'HotelSearchForm',
  components: {
    InputDateRange,
    InputRadio,
    InputGuestsMultipleRooms,
    ButtonMedium,
    InputHotelNamesearch,
    ServiceSelectDropdown
  },
  props: {
    isDark: {
      type: Boolean,
      default: true
    },
    init: {
      type: [Object, Boolean],
      default: false
    },
    isHomepage: {
      type: Boolean,
      default: false
    },
    nameSearchInputId: {
      type: String,
      default: 'hotel-name-search'
    }
  },
  data() {
    return {
      nameSearch: {
        text: '',
        id: false
      },
      guests: [
        {
          adults: 2,
          children: 0,
          childrenAges: []
        }
      ],
      dates: {
        date1: getTomorrow(),
        date2: getDayAfterTomorrow()
      },
      radio: 'bpo',

      searchInitLoading: false,
      nameSearchError: false,
      allowedCountry: false,
      allowedpackage: false
    }
  },
  computed: {
    ...mapGetters('user', ['isCis', 'getAllowedPV', 'getFees'])
  },
  watch: {
    isCis(value) {
      if (value) {
        this.radio = 'card_cis'
      } else {
        this.radio = 'bpo'
      }
    },
    nameSearch() {
      this.nameSearchError = false
    },
    init(value) {
      this.setInit(value)
    }
  },
  created() {
    this.$eventBus.listen('hotelHistoryFill', this.setInitFromHistory)
    this.$nuxt.$off('geo-change')
    this.$nuxt.$on('geo-change', () => {
      this.startHotelSearch()
    })
  },
  mounted() {
    const fees = this.getFees
    if (fees.package !== undefined) {
      if (fees.package.permission !== undefined) {
        if (fees.package.permission !== 'FREE') {
          this.allowedpackage = true
        }
      }
    }

    this.resolveGeo()
    this.searchInitLoading = false
    this.setInit(this.init)
    if (this.isCis) {
      this.radio = 'card_cis'
    }
  },
  beforeDestroy() {
    this.$eventBus.remove('hotelHistoryFill', this.setInitFromHistory)
    this.$nuxt.$off('geo-change')
  },
  methods: {
    ...mapActions('hotel', ['initHotelSearch']),
    ...mapMutations('hotel', ['pushSearchHistory']),
    async resolveGeo() {
      const res = await this.$store.dispatch('user/getUserCountryAllowed', {
        nationality: this.getGeoLoc
      })
      this.allowedCountry = !res.allowed.data
    },
    setInitFromHistory(history) {
      this.nameSearch = history.nameSearch
      this.dates = history.dates
      this.guests = isArray(history.guests) ? history.guests : [history.guests]
    },
    setInit(init) {
      if (init) {
        this.nameSearch.text = init.fts_name
        this.nameSearch.id = Number(init.fts_id)
        this.dates = {
          date1: init.checkin,
          date2: init.checkout
        }
        this.guests = init.rooms.map((val) => {
          return {
            adults: val.adults,
            children: val.children,
            childrenAges: val.childrenages
          }
        })
        this.radio = init.type
      }
    },
    async startHotelSearch() {
      this.searchInitLoading = true

      if (!this.nameSearch.id) {
        this.nameSearchError = this.$t('general.NameSearchErrorMsg')
        this.searchInitLoading = false
        return
      }

      const result = await this.initHotelSearch({
        type: this.radio,
        text_id: Number(this.nameSearch.id),
        checkin: this.dates.date1,
        checkout: this.dates.date2,
        guests: this.guests,
        lang: this.$i18n.locale
      })

      this.pushSearchHistory({
        nameSearch: this.nameSearch,
        dates: this.dates,
        guests: this.guests
      })

      this.$store.commit('user/setGeoLoc', result.geo_ip.user_country)

      this.searchInitLoading = false
      this.$emit('search')
      this.$router.push(this.localePath('/hotel/search/' + result.search_id))
    }
  }
}
</script>
