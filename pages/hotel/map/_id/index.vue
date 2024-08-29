<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper
      v-show="
        isLoading &&
          (results.hotels === undefined || results.hotels.length === 0)
      "
      :request="results.request"
    />
    <div v-show="results.hotels !== undefined && results.hotels.length > 0">
      <div class="hidden md:block w-full bg-primary-gradient text-white">
        <HotelSearchForm
          :init="results.request !== undefined ? results.request : false"
        />
      </div>
      <div class="block md:hidden w-full">
        <div class="w-full h-1 bg-primary-gradient"></div>
        <div class="flex flex-row justify-start items-center my-24 mx-16">
          <i
            class="fa fa-chevron-left text-primary text-sm leading-14 cursor-pointer"
            @click="$router.push(localePath('/'))"
          ></i>
          <div class="ml-8">
            <p class="text-sm leading-14 font-bold text-black mb-6">
              {{ results.hotels !== undefined ? results.hotels.length : '' }}
              {{ $t('general.Offers') }}
            </p>
            <p class="text-xs leading-12">
              {{
                descriptionOffersLocalization.replace(
                  '%nights%',
                  results.request !== undefined
                    ? calcNights(
                        results.request.checkin,
                        results.request.checkout
                      )
                    : ''
                )
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:px-16 xl:px-40 max-w-screen-xl mx-auto">
        <!-- sidebar & hotel map -->
        <div class="w-full flex flex-row items-stretch">
          <!-- sidebar -->
          <div
            class="flex flex-col flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md pt-24"
          >
            <div class="flex flex-row justify-start items-center mb-24">
              <i
                class="fa fa-chevron-left text-primary text-sm leading-14 cursor-pointer"
                @click="$router.push(localePath('/'))"
              ></i>
              <div class="ml-8">
                <p class="text-sm leading-14 font-bold text-black mb-6">
                  {{
                    results.hotels !== undefined ? results.hotels.length : ''
                  }}
                  {{ $t('general.Offers') }}
                </p>
                <p class="text-xs leading-12">
                  {{
                    descriptionOffersLocalization.replace(
                      '%nights%',
                      results.request !== undefined
                        ? calcNights(
                            results.request.checkin,
                            results.request.checkout
                          )
                        : ''
                    )
                  }}
                </p>
              </div>
            </div>

            <ButtonSmall
              :is-disabled="isLoading"
              class="w-full mb-24"
              @click="
                !isLoading
                  ? $router.push(
                      localePath('/hotel/search/' + $route.params.id)
                    )
                  : ''
              "
            >
              <i class="fa fa-th"></i> {{ $t('hotel.ListView') }}
            </ButtonSmall>

            <HotelFilterForm
              v-show="!isLoading"
              :init="filters"
              :type="results.request !== undefined ? results.request.type : ''"
              :nights="
                results.request !== undefined
                  ? calcNights(
                      results.request.checkin,
                      results.request.checkout
                    )
                  : 0
              "
              :filter-cache="cacheFilter"
              @filter="getResults"
              @updateFilter="getFilters"
            />
            <HotelFilterFormDummy v-show="isLoading" />
          </div>
          <!-- hotel map -->
          <div
            class="h-650 md:h-auto md:pl-8 md:pr-8 md:-mr-8 md:pt-8 md:-mt-8 flex-grow overflow-hidden"
          >
            <gmap-map
              ref="gmap"
              class="h-full w-full"
              :center="center"
              :zoom="12"
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
                  v-for="(m, index) in results.hotels"
                  :key="index"
                  :position="{
                    lat: Number(m.latitude),
                    lng: Number(m.longitude)
                  }"
                  :clickable="true"
                  :draggable="false"
                  :icon="
                    active_marker === m.hotel_id
                      ? marker_selected
                      : m.selected === '1'
                      ? selected_marker_unselected
                      : marker_unselected
                  "
                  @click="showPopup({ ...m, ...{ type: type } })"
                ></gmap-marker>
              </gmap-cluster>
            </gmap-map>
          </div>
        </div>
      </div>

      <!-- Mobile bottom navbar-->
      <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-row pt-8 pb-10 px-16">
          <div
            class="w-1/3 text-center pr-8 cursor-pointer"
            @click="showHotelFilterFormModal(true)"
          >
            <div class="text-primary text-base mb-6">
              <i class="far fa-sliders-h"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('general.Filter') }}
              <div class="text-grey-dark">3 {{ $t('general.Condition') }}</div>
            </div>
          </div>
          <div
            class="w-1/3 text-center text-primary px-8 cursor-pointer"
            @click="
              $router.push(localePath('/hotel/search/' + $route.params.id))
            "
          >
            <div class="text-base mb-6">
              <i class="far fa-th"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('hotel.ListView') }}
            </div>
          </div>
          <div
            class="w-1/3 text-center text-primary pl-8 cursor-pointer"
            @click="showHotelSearchFormModal(true)"
          >
            <div class="text-base mb-6">
              <i class="far fa-search"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('general.StartNewSearch') }}
            </div>
          </div>
        </div>
      </div>

      <!-- New search overlay modal-->
      <DefaultModal v-show="hotelSearchFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.StartNewSearch') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showHotelSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <HotelSearchForm
              :is-dark="false"
              class="w-full"
              name-search-input-id="modal-hotel-name-search"
              :init="results.request !== undefined ? results.request : false"
              @search="stopSearch()"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>

      <!-- Filter overlay modal-->
      <DefaultModal v-show="hotelFilterFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.Filter') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showHotelFilterFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <div
              class="mt-24 mb-48 px-16 lg:pb-11 xl:px-40 max-w-screen-xl w-full mx-auto"
            >
              <HotelFilterForm
                :is-mobile="true"
                :init="filters"
                :type="
                  results.request !== undefined ? results.request.type : ''
                "
                :nights="
                  results.request !== undefined
                    ? calcNights(
                        results.request.checkin,
                        results.request.checkout
                      )
                    : 1
                "
                :filter-cache="cacheFilter"
                @filter="getResults"
                @updateFilter="getFilters"
              />
            </div>
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { averageGeolocation, calcNights } from '@/includes/utils'
import MapPopupMixin from '@/includes/MapPopupMixin'

import SkeletonSearchWrapper from '@/components/skeleton/hotel/SkeletonSearchWrapper'
import HotelSearchForm from '@/components/forms/HotelSearchForm'
import HotelFilterForm from '@/components/forms/HotelFilterForm'
import HotelFilterFormDummy from '@/components/forms/HotelFilterFormDummy'
import ButtonSmall from '@/components/micro/ButtonSmall'
import DefaultModal from '@/components/modal/DefaultModal'

import premiumDV from '@/assets/images/premium-voucher.svg'

export default {
  name: 'HotelMapPage',
  components: {
    SkeletonSearchWrapper,
    HotelSearchForm,
    HotelFilterForm,
    HotelFilterFormDummy,
    ButtonSmall,
    DefaultModal
  },
  mixins: [MapPopupMixin],
  data() {
    return {
      premiumDV,
      isLoading: true, // true
      type: 'bpo',

      hotelSearchFormModalActive: false,
      hotelFilterFormModalActive: false,

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
        lat: 0,
        lng: 0
      },
      results: false,
      filters: false,

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
      },
      descriptionOffersLocalization: this.$t('hotel.DescriptionOffers'),
      cacheFilter: false
    }
  },
  computed: {
    ...mapGetters('hotel', ['searchCache']),
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('user', ['getGeoLoc']),
    currency() {
      return this.getCurrency
    }
  },
  mounted() {
    if (this.searchCache && this.searchCache[Number(this.$route.params.id)]) {
      this.getResults(
        {
          filters: this.searchCache[Number(this.$route.params.id)]
        },
        true
      )
    } else {
      this.getResults()
    }
  },
  methods: {
    calcNights,
    ...mapActions('hotel', ['getHotelMap', 'getHotelFilters']),
    ...mapGetters('user', ['getAllowedPV']),
    zoomChanged() {
      this.deletePopup()
      this.active_marker = false
    },
    showPopup(marker) {
      /* this.center = {
        lat: Number(marker.latitude),
        lng: Number(marker.longitude)
      } */

      if (this.active_marker === marker.hotel_id) {
        this.deletePopup()
        this.active_marker = false
      } else {
        this.active_marker = marker.hotel_id

        this.deletePopup()

        /* MapPopupMixin.js */
        marker.isPremium = this.getAllowedPV()
        marker.premiumSrc = this.premiumDV
        this.createPopup(marker)
      }
    },
    async getResults(params = {}, fillFilterHistory = false) {
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

      try {
        this.results = await this.getHotelMap({
          ...params,
          search_id: Number(this.$route.params.id),
          client_nationality: this.getGeoLoc
        })

        this.center = averageGeolocation(this.results.hotels)

        this.getFilters(params, fillFilterHistory)

        if (this.results.request.type !== undefined) {
          this.type = this.results.request.type
        }

        this.isLoading = false
      } catch (e) {
        console.log(e)
      }
    },
    async getFilters(params, fillFilterHistory) {
      this.filters = await this.getHotelFilters({
        search_id: Number(this.$route.params.id),
        filters: this.prepFilters(params),
        client_nationality: this.getGeoLoc
      })
      if (
        fillFilterHistory &&
        this.searchCache[Number(this.$route.params.id)]
      ) {
        this.cacheFilter = this.searchCache[Number(this.$route.params.id)]
      }
    },
    prepFilters(params) {
      return [
        {
          category: 'ranges',
          filter: [
            { filter: 'price_slot_0_100', min: 0, max: 100, currency: 'EUR' },
            {
              filter: 'price_slot_100_250',
              min: 100,
              max: 250,
              currency: 'EUR'
            },
            {
              filter: 'price_slot_250_500',
              min: 250,
              max: 500,
              currency: 'EUR'
            },
            {
              filter: 'price_slot_500_1000',
              min: 500,
              max: 1000,
              currency: 'EUR'
            },
            {
              filter: 'price_slot_1000_plus',
              min: 1000,
              max: 999999999999,
              currency: 'EUR'
            }
          ]
        }
      ].concat(params.filters !== undefined ? params.filters : [])
    },
    showHotelFilterFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.hotelFilterFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.hotelFilterFormModalActive = false
      }
    },
    showHotelSearchFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.hotelSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.hotelSearchFormModalActive = false
      }
    },
    mapClick() {
      this.deletePopup()
      this.active_marker = false
    }
  },
  head() {
    return {
      title:
        this.results.request !== undefined
          ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
          : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.results.request !== undefined
              ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.results.request !== undefined
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
