<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper
      v-show="
        isLoading &&
          (results.hotels === undefined || results.hotels.length === 0)
      "
    />

    <div
      v-show="
        (results.hotels !== undefined && results.hotels.length > 0) ||
          !isLoading
      "
      class="md:block w-full bg-primary-gradient text-white"
    >
      <div class="max-w-screen-xl mx-auto py-10 lg:px-42">
        <div class="flex-col md:flex-row flex text-sm w-full">
          <div class="ml-10 text-white font-bold">
            {{ $t('apartments.PayMethod') }}
          </div>
          <div class="ml-24 flex-row md:flex-col sm:flex-row">
            <InputRadio
              v-model="paymentType"
              selected="bpo_price"
              :value="paymentType"
              :label="$t('apartments.PayMethodBPO')"
              :is-dark="true"
              @input="getResults"
            />
          </div>
          <div class="ml-24 flex-row md:flex-col">
            <InputRadio
              v-model="paymentType"
              selected="pv_bpo"
              :value="paymentType"
              :label="$t('apartments.PayMethodPVBPO')"
              :is-dark="true"
              @input="getResults"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-show="results.hotels !== undefined && results.hotels.length > 0">
      <div class="flex flex-col p-16 xl:px-40 max-w-screen-xl mx-auto">
        <!-- sidebar & hotel cards -->
        <div class="w-full flex flex-row items-stretch mt-16">
          <!-- sidebar -->
          <div
            class="flex flex-col flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md"
          >
            <ButtonSmall
              :is-disabled="isLoading"
              class="w-full mb-24"
              @click="$router.push(localePath('/apartments'))"
            >
              <i class="fa fa-th"></i> {{ $t('hotel.ListView') }}
            </ButtonSmall>

            <ApartmentsFilterForm
              :init="results.session"
              :data="results.filters"
              @filter="setFilters"
            />
          </div>
          <!-- hotel cards -->
          <div
            class="md:pl-8 md:pr-8 md:-mr-8 md:pt-8 md:-mt-8 flex-grow overflow-hidden"
          >
            <div class="flex flex-wrap justify-start">
              <div
                class="h-650 md:pl-8 md:pr-8 md:-mr-8 md:pt-8 md:-mt-8 flex-grow overflow-hidden"
                style="min-height: 80vh"
              >
                <gmap-map
                  ref="gmap"
                  class="h-full w-full"
                  :center="center"
                  :zoom="3"
                  :options="mapOptions"
                  @zoom_changed="zoomChanged"
                  @click="mapClick"
                >
                  <gmap-cluster
                    :zoom-on-click="true"
                    :styles="clusterIcons"
                    :grid-size="120"
                    :minimum-cluster-size="5"
                    :average-center="true"
                  >
                    <gmap-marker
                      v-for="(m, index) in hotelsFirstSection"
                      :key="index"
                      :position="{
                        lat: Number(m.lat),
                        lng: Number(m.lng)
                      }"
                      :clickable="true"
                      :draggable="false"
                      :icon="
                        active_marker === m.intId
                          ? marker_selected
                          : m.selected === '1'
                          ? selected_marker_unselected
                          : marker_unselected
                      "
                      @click="
                        showPopup({
                          ...m,
                          ...{
                            apartmentType: 'apartments',
                            paymentType: paymentType,
                            currency: currency
                          }
                        })
                      "
                    ></gmap-marker>
                  </gmap-cluster>
                </gmap-map>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile bottom navbar-->
      <!-- Mobile bottom navbar-->
      <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-row pt-8 pb-10 px-16 justify-center">
          <div
            class="w-1/3 text-center pr-8 cursor-pointer"
            :class="{
              'opacity-25': mobileLoadingSection
            }"
            @click="showHotelFilterFormModal(true)"
          >
            <div class="text-primary text-base mb-6">
              <i class="far fa-sliders-h"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('general.Filter') }}
            </div>
          </div>
          <div
            class="w-1/3 text-center text-primary px-8 cursor-pointer"
            @click="$router.push(localePath('/apartments/'))"
          >
            <div class="text-base mb-6">
              <i class="far fa-th"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('hotel.ListView') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Filter overlay modal-->
      <DefaultModal v-show="hotelFilterFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex items-center">
              <i
                class="fa fa-chevron-left text-primary cursor-pointer mr-16"
                @click="showHotelFilterFormModal(false)"
              ></i>
            </div>
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.Filter') }}
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <div class="mt-24 mb-100 px-16 w-full"></div>
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import MapPopupMixin from '@/includes/MapPopupMixin'

import SkeletonSearchWrapper from '@/components/skeleton/hotel/SkeletonSearchWrapper'
import ApartmentsFilterForm from '@/components/forms/ApartmentsFilterForm'
import DefaultModal from '@/components/modal/DefaultModal'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputRadio from '@/components/micro/InputRadio'

import premiumDV from '@/assets/images/premium-voucher.svg'
import premiumBPO from '@/assets/images/bpo-logo.svg'

import {
  responsiveApartmentImageHeight,
  apartmentsCount,
  averageGeolocation,
  calcNights
} from '@/includes/utils'

export default {
  name: 'HotelSearchPage',
  components: {
    SkeletonSearchWrapper,
    ButtonSmall,
    DefaultModal,
    InputRadio,
    ApartmentsFilterForm
  },
  mixins: [MapPopupMixin],
  data() {
    return {
      premiumDV,
      premiumBPO,
      isLoading: true, // true

      hotelFilterFormModalActive: false,

      results: false,
      filters: [],
      type: false,

      mobileLoadingSection: true,

      maxPages: 1,
      perPage: 10,
      totalOffers: 0,
      currentPage: 1,

      cacheFilter: false,

      marker_unselected: '/images/marker-unselected.png',
      marker_selected: '/images/marker-selected.png',
      selected_marker_unselected: '/images/selected-marker.png',
      active_marker: false,

      clusterIcons: [
        {
          width: 28,
          height: 28,
          textColor: '#ffffff',
          textSize: 14,
          url: '/images/marker-cluster-small.png'
        },
        {
          width: 42,
          height: 42,
          textColor: '#ffffff',
          textSize: 14,
          url: '/images/marker-cluster-medium.png'
        },
        {
          width: 56,
          height: 56,
          textColor: '#ffffff',
          textSize: 14,
          url: '/images/marker-cluster-big.png'
        }
      ],

      center: {
        lat: 54.37986563665771,
        lng: 15.303571772210478
      },

      mapOptions: {
        disableDefaultUI: true,
        mapTypeControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.attraction',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.government',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.medical',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.place_of_worship',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.school',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.sports_complex',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    firstSectionHotelCount() {
      return apartmentsCount
    },
    responsiveApartmentImageHeight() {
      return responsiveApartmentImageHeight()
    },
    hotelsFirstSection() {
      return this.results.hotels !== undefined
        ? this.results.hotels.slice(0, 99999999)
        : []
    },
    innerWidth() {
      return window.innerWidth
    },
    paymentType: {
      get() {
        return this.$store.state.apartments.paymentType
      },
      set(value) {
        this.$store.commit('apartments/setPaymentType', value)
      }
    },
    currency() {
      return this.getCurrency
    }
  },
  mounted() {
    this.searchRequestCounter = 0
    this.getResults()
  },
  methods: {
    calcNights,
    setFilters(filters) {
      this.filters = filters.apartmentfilters
      this.getResults()
    },
    mapClick() {
      this.deletePopup()
      this.active_marker = false
    },
    zoomChanged() {
      this.deletePopup()
      this.active_marker = false
    },
    showPopup(marker) {
      /* this.center = {
        lat: Number(marker.latitude),
        lng: Number(marker.longitude)
      } */

      if (this.active_marker === marker.intId) {
        this.deletePopup()
        this.active_marker = false
      } else {
        this.active_marker = marker.intId

        this.deletePopup()

        /* MapPopupMixin.js */
        marker.premiumSrc = this.premiumDV
        marker.bpoSrc = this.premiumBPO
        this.createPopup(marker)
      }
    },
    resetFilters() {
      this.filters = []
      this.getResults()
    },
    async getResults() {
      this.deletePopup()
      this.$scrollTo('#__nuxt')

      if (this.hotelSearchFormModalActive) {
        this.showHotelSearchFormModal(false)
      }
      if (this.hotelFilterFormModalActive) {
        this.showHotelFilterFormModal(false)
      }

      this.isLoading = true // true
      this.results = false

      this.results = await this.$store.dispatch('apartments/getV2List', {
        lang: this.$i18n.locale,
        page: this.currentPage,
        hotelPerPage: 9999999,
        apartmentfilters: this.filters
      })

      this.center = averageGeolocation(this.results.hotels)

      this.isLoading = false
    },
    showHotelFilterFormModal(status) {
      if (!this.mobileLoadingSection) {
        if (status) {
          document.body.classList.add('fixed')
          this.hotelFilterFormModalActive = true
        } else {
          document.body.classList.remove('fixed')
          this.hotelFilterFormModalActive = false
        }
      }
    }
  },
  head() {
    return {
      title:
        this.results && this.results.request !== undefined
          ? 'Apartments ' + this.$t('meta.TitleSuffix')
          : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.results && this.results.request !== undefined
              ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.results && this.results.request !== undefined
              ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.HotelDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.HotelDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.HotelDescription')
        }
      ]
    }
  }
}
</script>

<style>
.popup-bubble-content {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
  background-color: white;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 268px;
  height: 293px;
  overflow: hidden;
}

.popup-image {
  background-position: center;
  background-size: cover;
  width: 268px;
  height: 201px;
}

.popup-bubble-anchor {
  position: absolute;
  width: 100%;
  bottom: 32px;
  left: 0;
}
.popup-container {
  cursor: auto;
  height: 0;
  position: absolute;
  width: 200px;
}
.font-proxima-soft {
  font-family: Nunito, nunito, sans-serif;
}
</style>
