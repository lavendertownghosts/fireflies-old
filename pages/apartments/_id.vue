<template>
  <div>
    <div class="bg-primary-gradient">
      <div
        class="flex md:flex-row flex-col md:items-center items-left justify-between px-16 py-24 lg:py-16 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="flex items-center flex-row">
          <div class="hidden md:block md:flex-initial md:mr-16">
            <img
              src="~assets/images/white-turq/travel-services/apartments/apartments-60.svg"
              class="w-60 h-60"
            />
          </div>

          <div class="flex-grow leading-32 md:leading-24">
            <div class="flex flex-wrap">
              <div class="flex-initial mr-4">{{ hotel.name }}</div>
              <StarRatings v-if="hotel.stars" :stars="parseInt(hotel.stars)" />
            </div>
            <div class="hidden md:block md:mt-2 text-sm leading-14">
              <span class="font-normal">{{ hotel.address }}</span>
            </div>
          </div>
        </div>
        <div
          class="sm:flex-col lg:flex-row mt-16 md:mt-0 flex-initial text-sm md:w-1/2"
        >
          <div
            class="md:ml-10 mb-8 md:mb-0 flex-row lg:flex-col text-white font-bold"
          >
            {{ $t('apartments.PayMethod') }}
          </div>
          <div class="md:ml-24 ml-16 flex-row md:flex-col sm:flex-row">
            <InputRadio
              v-model="paymentType"
              selected="bpo_price"
              :value="paymentType"
              :label="$t('apartments.PayMethodBPO')"
              :is-dark="true"
            />
          </div>
          <div class="md:ml-24 ml-16 mt-8 md:mt-0 flex-row md:flex-col">
            <InputRadio
              v-model="paymentType"
              selected="pv_bpo"
              :value="paymentType"
              :label="$t('apartments.PayMethodPVBPO')"
              :is-dark="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap lg:px-16 xl:px-40 max-w-screen-xl mx-auto">
      <div class="lg:w-1/2 lg:pr-8">
        <GalleryBox :images="hotel.images" class="md:px-16 md:pt-24 lg:px-0" />
        <div class="flex flex-wrap px-16 lg:px-0 mx-auto text-black">
          <div class="mt-40">
            <div class="font-bold leading-16">
              {{ $t('hotel.AboutTheHotel') }}
            </div>
            <p
              ref="HotelDescription"
              class="mt-8 text-sm leading-20 overflow-hidden"
              :style="
                showDescriptionReadMore
                  ? 'max-height:' + paragraphRow * 20 + 'px'
                  : ''
              "
              :class="showDescriptionReadMore ? 'fadeclamp' : ''"
              v-html="hotel.descriptions"
            ></p>
            <div
              v-show="showDescriptionReadMore"
              class="leading-14 mt-8 text-sm"
            >
              <a
                class="link cursor-pointer"
                @click="showDescriptionReadMore = false"
              >
                {{ $t('hotel.ReadMore') }}
              </a>
            </div>
          </div>

          <div class="w-full mt-8 text-sm">
            <div
              v-if="
                hotel.remarks.checkinCapabilities.length > 0 &&
                  hotel.remarks.checkinCapabilities.check_in_capabilities !== ''
              "
            >
              <div class="mt-8 font-bold">
                {{ $t('apartments.checkinCapabilities') }}
              </div>
              <div>
                {{ hotel.remarks.checkinCapabilities.check_in_capabilities }}
              </div>
            </div>

            <div v-if="hotel.remarks.mandatoryFees.length > 0">
              <div class="mt-8 font-bold">
                {{ $t('apartments.mandatoryFees') }}
              </div>
              <div
                v-for="(mandatory, key) in hotel.remarks.mandatoryFees"
                :key="key"
              >
                <div v-for="(text, key2) in mandatory" :key="key2">
                  {{ text }}
                </div>
              </div>
            </div>

            <div v-if="hotel.remarks.resortFees.length > 0">
              <div class="mt-8 font-bold">
                {{ $t('apartments.resortFees') }}
              </div>
              <div v-for="(fee, key) in hotel.remarks.resortFees" :key="key">
                <div v-for="(text, key2) in fee" :key="key2">
                  {{ text }}
                </div>
              </div>
            </div>

            <div
              v-if="
                hotel.remarks.policyRestrictions.floorNoElevators !==
                  undefined &&
                  hotel.remarks.policyRestrictions.floorNoElevators !== ''
              "
            >
              <div class="mt-8 font-bold">
                {{ $t('apartments.floorNoElevators') }}
              </div>
              <div>
                {{ hotel.remarks.policyRestrictions.floorNoElevators }}
              </div>
            </div>

            <div
              v-if="
                hotel.remarks.policyRestrictions.minimumAgeCheckin !==
                  undefined &&
                  hotel.remarks.policyRestrictions.minimumAgeCheckin !== ''
              "
            >
              <div class="mt-8 font-bold">
                {{ $t('apartments.minimumAgeCheckin') }}
              </div>
              <div>
                {{ hotel.remarks.policyRestrictions.minimumAgeCheckin }}
              </div>
            </div>

            <div
              v-if="
                hotel.remarks.policyRestrictions.noSmoking !== undefined &&
                  hotel.remarks.policyRestrictions.noSmoking !== ''
              "
            >
              <div class="mt-8 font-bold">{{ $t('apartments.noSmoking') }}</div>
              <div>
                {{ hotel.remarks.policyRestrictions.noSmoking }}
              </div>
            </div>

            <div
              v-if="
                hotel.remarks.policyRestrictions.oneInRule !== undefined &&
                  hotel.remarks.policyRestrictions.oneInRule !== ''
              "
            >
              <div class="mt-8 font-bold">{{ $t('apartments.oneInRule') }}</div>
              <div>
                {{ hotel.remarks.policyRestrictions.oneInRule }}
              </div>
            </div>

            <div
              v-if="
                hotel.remarks.policyRestrictions.parkingRestrictions !==
                  undefined &&
                  hotel.remarks.policyRestrictions.parkingRestrictions !== ''
              "
            >
              <div class="mt-8 font-bold">
                {{ $t('apartments.parkingRestrictions') }}
              </div>
              <div>
                {{ hotel.remarks.policyRestrictions.parkingRestrictions }}
              </div>
            </div>

            <div
              v-if="
                hotel.remarks.policyRestrictions.pets !== undefined &&
                  hotel.remarks.policyRestrictions.pets !== ''
              "
            >
              <div class="mt-8 font-bold">{{ $t('apartments.pets') }}</div>
              <div>
                {{ hotel.remarks.policyRestrictions.pets }}
              </div>
            </div>

            <div v-if="hotel.remarks.urgentInfo.length > 0">
              <div class="mt-8 font-bold">
                {{ $t('apartments.urgentInfo') }}
              </div>
              <div v-for="(urgent, key) in hotel.remarks.urgentInfo" :key="key">
                {{ urgent }}
              </div>
            </div>
          </div>

          <div class="mt-40">
            <div class="font-bold leading-16 text-base">
              {{ $t('hotel.Contacts') }}
            </div>
            <ul class="text-sm mt-8 leading-20">
              <li>
                <span class="font-bold">{{ $t('hotel.Address') }}:</span>
                {{ hotel.address }}
              </li>
              <li v-show="hotel.phone">
                <span class="font-bold">{{ $t('hotel.Phone') }}:</span>
                {{ hotel.phone }}
              </li>
            </ul>
          </div>
        </div>
        <div
          class="w-full mt-8 mb-40 overflow-hidden md:px-16 lg:px-0 cursor-pointer"
          :style="{
            'background-image': 'url(' + hotel.map + ')',
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': 'cover',
            height: '222px'
          }"
          @click="hotelMapModalActive = true"
        ></div>
        <div
          v-show="services.servicesWithIcons"
          class="flex flex-wrap px-16 lg:px-0 mt-40 mx-auto text-black"
        >
          <div class="w-full">
            <div class="font-bold leading-16">
              {{ $t('hotel.Facilities') }}
            </div>
            <div class="flex flex-wrap mt-16 -mx-8">
              <div
                v-for="(service, key) in services.servicesWithIcons"
                :key="key"
                class="flex w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/3 xl:w-1/4"
              >
                <div class="w-full text-center mb-16 mx-8">
                  <i
                    v-if="service.class !== false"
                    class="rounded-full border border-grey-light px-10 py-12 h-40 w-40"
                    :class="service.class"
                  ></i>
                  <div
                    class="text-sm leading-14"
                    :class="service.class === false ? 'mt-34' : 'mt-4'"
                  >
                    {{ service.name | capitalize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="services.servicesWithoutIcons"
          class="flex flex-wrap px-16 lg:px-0 mt-40 mb-40 mx-auto text-black"
        >
          <div class="w-full">
            <div class="font-bold leading-16">
              {{ $t('hotel.MoreFacilities') }}
            </div>
            <div class="flex flex-wrap mt-16">
              <div
                v-for="(service, key) in services.servicesWithoutIcons"
                :key="key"
                class="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/2"
              >
                <div class="flex flex-no-wrap w-full my-12">
                  <i
                    class="fal fa-check font-light text-primary text-sm align-middle"
                  ></i>
                  <div class="text-sm leading-14 ml-8">
                    {{ service.name | capitalize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 lg:pl-8">
        <SkeletonOffersWrapper v-show="searchInProgress" />
        <div
          v-if="!searchInProgress && hotel.inventory !== undefined"
          class="flex flex-col px-16 lg:px-0 mx-auto mb-32"
        >
          <div
            v-for="(year_row, year) in hotel.inventory"
            :key="year"
            class="mt-18"
          >
            <div v-for="(row, month) in year_row" :key="month">
              <div
                class="flex flex-row justify-between w-full items-center p-16 border-b border-grey font-bold bg-primary-opaque cursor-pointer"
                :class="
                  activeRow == year + '' + month ? 'text-black' : 'text-primary'
                "
                @click="
                  cartAddInProgress == false
                    ? activeRow == year + '' + month
                      ? (activeRow = 0)
                      : (activeRow = year + '' + month)
                    : false
                "
              >
                <div>{{ year }} {{ getMonthName(month) }}</div>
                <i
                  class="far"
                  :class="
                    activeRow == year + '' + month
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down'
                  "
                ></i>
              </div>

              <div
                v-for="(item, key) in row"
                v-show="activeRow == year + '' + month"
                :id="'item_' + item.id"
                :key="key"
                class="flex md:flex-row md:items-center flex-col justify-between w-full text-sm p-16 border-b border-grey"
                :class="['bg-primary-opaque']"
              >
                <div class="flex flex-col">
                  <span class="font-bold">{{
                    formatListDate(item.date_from, item.date_until)
                  }}</span>
                  <span
                    >{{ item.roomtype }} -
                    {{ $t('apartments.UpToGuests', [item.capacity]) }}</span
                  >
                  <span v-if="item.kitchen_type !== ''" class="capitalize"
                    >{{ item.kitchen_type }}
                  </span>
                  <span class="text-danger">
                    {{ $t('general.NonRefundable') }}
                  </span>
                </div>
                <div class="flex md:flex-row md:items-center flex-col">
                  <div class="text-right mr-16">
                    <div
                      v-show="paymentType === 'bpo_price'"
                      class="flex flex-row border-b border-grey pb-8"
                    >
                      <div class="text-warning items-center flex flex-row">
                        <span class="font-bold text-lg pr-6 lg:pr-0 xl:pr-6">{{
                          item.bpo_bpo
                        }}</span>
                        <img src="~static/images/bpo-logo.svg" />
                        <span
                          v-show="item.bpo_price[currency] > 0"
                          class="font-black text-sm px-6"
                        >
                          +
                        </span>
                      </div>
                      <div class="text-warning flex flex-col">
                        <span
                          v-show="item.bpo_price[currency] > 0"
                          class="font-bold text-base"
                        >
                          {{ currency }}
                          {{
                            item.bpo_price[currency]
                              | formatNumber('0,0', { thousandsSeparator: ' ' })
                          }}
                        </span>
                        <span class="text-xs ">
                          {{ $t('apartments.PricePerNight') }}:
                          {{
                            calcPricePerNight(
                              item.date_from,
                              item.date_until,
                              item.capacity,
                              item.bpo_price[currency]
                            ) | formatNumber('0,0', { thousandsSeparator: ' ' })
                          }}
                          {{ currency }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-show="paymentType === 'pv_bpo'"
                      class="flex flex-row border-b border-grey pb-8"
                    >
                      <div class="text-warning items-center flex flex-row">
                        <span class="font-bold text-lg pr-6 lg:pr-0 xl:pr-6">{{
                          item.pv_bpo
                        }}</span>
                        <img src="~static/images/bpo-logo.svg" />
                        <span
                          v-show="item.bpo_price[currency] > 0"
                          class="font-black text-sm px-6"
                        >
                          +
                        </span>
                        <span
                          class="text-danger font-bold text-lg pr-6 lg:pr-0 xl:pr-6"
                          >{{ item.pv_pv }}</span
                        >
                        <img src="~static/images/premium-voucher-logo.svg" />
                      </div>
                    </div>
                    <div class="text-xs pt-4">
                      {{ $t('apartments.MarketPrice') }}: {{ currency }}
                      {{
                        item.bkprice[currency]
                          | formatNumber('0,0', { thousandsSeparator: ' ' })
                      }}
                    </div>
                  </div>
                  <ButtonSmall
                    :disabled="item.reserved === '1' || inPast(item.date_from)"
                    :type="
                      item.reserved === '1' || inPast(item.date_from)
                        ? 'inverted'
                        : 'primary'
                    "
                    :is-loading="cartAddInProgress == item.id"
                    class="md:mt-0 mt-15"
                    @click="offerSelect(item)"
                  >
                    {{ $t('apartments.Reserve') }}
                  </ButtonSmall>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="hotel.inventory == undefined || hotel.inventory.length <= 0"
          class="px-16 lg:px-0 mx-auto"
        >
          <div class="pb-40 border-b border-grey lg:border-none">
            <div
              class="flex flex-wrap border border-danger border-dashed mt-24 rounded"
            >
              <div class="w-full text-center text-danger py-24">
                <i class="far fa-frown fa-5x"></i>
              </div>
              <div
                class="w-full text-danger text-sm font-bold leading-14 px-16 text-center md:px-128 md:mx-16 lg:px-16"
              >
                {{ $t('hotel.NoResults') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- hotel térképen -->
    <DefaultModal
      v-show="hotelMapModalActive"
      :is-full-page="isFullPageModal"
      :default-padding="'p-0'"
      :modal-max-width="getHoteMapWrapperWidth"
      @close="hotelMapModalActive = false"
    >
      <div slot="header"></div>
      <div slot="body" class="h-full md:rounded overflow-hidden">
        <div class="relative z-30">
          <div
            class="absolute top-0 right-0 w-40 h-40 bg-primary text-white text-base leading-16 flex items-center justify-center rounded-tr rounded-bl cursor-pointer"
            @click="hotelMapModalActive = false"
          >
            <i class="fa fa-times"></i>
          </div>
        </div>
        <div class="w-full" :style="getHoteMapWrapperHeight">
          <gmap-map
            ref="gmap"
            class="h-full w-full"
            :center="{
              lat: Number(hotel.latitude),
              lng: Number(hotel.longitude)
            }"
            :zoom="14"
            :options="mapOptions"
          >
            <gmap-marker
              :position="{
                lat: Number(hotel.latitude),
                lng: Number(hotel.longitude)
              }"
              :clickable="false"
              :draggable="false"
              :icon="marker_unselected"
            ></gmap-marker>
          </gmap-map>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <PermissionModal
      :show="permissionModalActive"
      :permission-needed="permissionNeeded"
      @cancel="permissionModalActive = false"
      @accept="$router.push(localePath('/weboffice/membership-upgrade'))"
    />
    <InformativeModal
      v-show="voucherErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="voucherErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughVoucher') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="voucherErrorPVModalActive"
      :accept-button="$t('general.Ok')"
      @accept="voucherErrorPVModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughPVoucher') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="bpoErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="bpoErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughBPO') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="creditErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="creditErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughCredit') }}
        </div>
      </div>
    </InformativeModal>
    <CartBlockModal :covid-cart-block="cartBlock" @accept="cartBlock = false" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import premiumDV from '@/assets/images/premium-voucher.svg'

import SkeletonOffersWrapper from '@/components/skeleton/hotel/SkeletonOffersWrapper'
import GalleryBox from '@/components/GalleryBox'

import ButtonSmall from '@/components/micro/ButtonSmall'
import DefaultModal from '@/components/modal/DefaultModal'
import InformativeModal from '@/components/modal/InformativeModal'
import StarRatings from '@/components/micro/StarRatings'
import InputRadio from '@/components/micro/InputRadio'
import CartBlockModal from '@/components/modal/CartBlockModal'

import {
  getBoardName,
  filterBy,
  limitBy,
  calcNights,
  calcHotelDistance,
  getGuestText,
  truncate,
  toPascalCase,
  getMonthName,
  createDate,
  getDayAfterTomorrow
} from '@/includes/utils'

import HotelServiceIcons from '@/includes/HotelServiceIcons'
import PermissionModal from '@/components/PermissionModal'

export default {
  name: 'HotelDetailsPage',
  components: {
    PermissionModal,
    SkeletonOffersWrapper,
    StarRatings,
    DefaultModal,
    InformativeModal,
    ButtonSmall,
    GalleryBox,
    CartBlockModal,
    InputRadio
  },
  async asyncData({ app, store, route }) {
    const hotel = await store.dispatch('apartments/getV2Details', {
      apartment_id: route.params.id
    })

    if (hotel.services !== undefined && !Array.isArray(hotel.services)) {
      hotel.services = hotel.services.split(',')
    }

    return {
      hotel
    }
  },
  data() {
    return {
      premiumDV,

      showDescriptionReadMore: true,
      showAllOffers: false,
      hotelSearchModalActive: false,
      hotelMapModalActive: false,

      searchInProgress: true,
      cartAddInProgress: false,
      offerDropdownActive: false,
      otherSource: 0,

      marker_unselected: '/images/marker-unselected.png',
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

      bestPrice: {
        price: 0,
        voucher: 0,
        bpo: 0,
        credit: 0
      }, // alsó sávhoz
      currentSource: false,
      innerWidth: 0,
      innerHeight: 0,
      permissionNeeded: false,
      permissionModalActive: false,
      voucherErrorModalActive: false,
      voucherErrorPVModalActive: false,
      creditErrorModalActive: false,
      bpoErrorModalActive: false,
      searchTimer: false,
      searchRequestLimit: 100,
      searchRequestCounter: 0,
      activeRow: false,
      cartBlock: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('apartments', ['searchCache']),
    ...mapGetters('user', ['isLoggedIn', 'getGeoLoc', 'getAllowedPV']),
    paymentType: {
      get() {
        return this.$store.state.apartments.paymentType
      },
      set(value) {
        this.$store.commit('apartments/setPaymentType', value)
      }
    },
    adultCount() {
      let adultsCount = 0
      this.guests.forEach((room) => {
        adultsCount += room.adults
      })
      return adultsCount
    },
    childCount() {
      let children = 0
      this.guests.forEach((room) => {
        children += room.children
      })
      return children
    },
    getHoteMapWrapperWidth() {
      if (window.innerWidth >= 772) {
        return '85%'
      } else {
        return '100%'
      }
    },
    getHoteMapWrapperHeight() {
      if (window.innerWidth >= 1280) {
        return { height: '675px' }
      } else if (window.innerWidth >= 1024) {
        return { height: '558px' }
      } else if (window.innerWidth >= 772) {
        return { height: '416px' }
      } else {
        return { height: '100%' }
      }
    },
    currency() {
      return this.getCurrency
    },
    services() {
      if (
        this.hotel.services === undefined ||
        this.hotel.services.length === 0
      ) {
        return false
      } else {
        const returnServices = []
        returnServices.servicesWithIcons = []
        returnServices.servicesWithoutIcons = []
        for (let i = 0; i < this.hotel.services.length; i++) {
          const el = HotelServiceIcons.find(
            (e) => e.name === this.hotel.services[i]
          )
          if (el) {
            returnServices.servicesWithIcons.push(el)
          } else {
            returnServices.servicesWithoutIcons.push({
              name: this.hotel.services[i],
              class: false
            })
          }
        }

        return returnServices
      }
    },
    paragraphRow() {
      if (window.innerWidth < 1024) {
        return 11
      } else if (window.innerWidth < 1280) {
        return 12
      } else {
        return 13
      }
    },
    offerLimit() {
      if (window.innerWidth < 1024) {
        return 9
      } else if (window.innerWidth < 1280) {
        return 14
      } else {
        return 15
      }
    },
    isFullPageModal() {
      if (window.innerWidth < 772) {
        return true
      }
      return false
    }
  },
  created() {},
  mounted() {
    this.showReadMoreButton()

    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)

    this.activeRow =
      String(Object.keys(this.hotel.inventory)[0]) +
      String(Object.keys(Object.values(this.hotel.inventory)[0])[0])

    console.log(
      String(Object.keys(this.hotel.inventory)[0]) +
        String(Object.keys(Object.values(this.hotel.inventory)[0])[0])
    )

    this.searchInProgress = false
  },
  beforeDestroy() {
    this.$nuxt.$off('geo-change')
  },
  methods: {
    getBoardName,
    calcNights,
    getGuestText,
    filterBy,
    limitBy,
    toPascalCase,
    getMonthName,
    createDate,
    getDayAfterTomorrow,
    ...mapActions('apartments', ['getV2Details']),
    formatListDate(dateFrom, dateTo) {
      const from = createDate(String(dateFrom))
      const to = createDate(String(dateTo))
      return (
        getMonthName(from.getMonth() + 1) +
        ' ' +
        from.getDate() +
        '. - ' +
        getMonthName(to.getMonth() + 1) +
        ' ' +
        to.getDate() +
        '.'
      )
    },
    calcPricePerNight(dateFrom, dateUntil, capacity, price) {
      return price / (capacity * calcNights(dateFrom, dateUntil))
    },
    calcDistance(distance) {
      return (
        calcHotelDistance(distance) + ' ' + this.$t('hotel.FromTheCityCenter')
      )
    },
    closeOutClick() {
      if (window.innerWidth > 771) {
        this.hotelSearchModalActive = false
      }
    },

    removeFilter() {
      this.clearSearchCache(Number(this.$route.params.id))
      location.reload()
    },
    cancellation(offer) {
      if (offer.cancellable === true) {
        if (offer.cancellationDeadline === null) {
          return this.$t('hotel.CancelInCart')
        } else {
          return offer.cancellationDeadline
        }
      }
      return this.$t('hotel.NonRefundable')
    },
    inPast(date) {
      const today = new Date()
      date = date.split(/[- :]/)
      date = new Date(
        date[0],
        date[1] - 1,
        date[2],
        date[3] !== undefined ? date[3] : 0,
        date[4] !== undefined ? date[4] : 0,
        date[5] !== undefined ? date[5] : 0
      )
      return date < today
    },

    showReadMoreButton() {
      if (
        this.$refs.HotelDescription !== undefined &&
        this.$refs.HotelDescription.offsetHeight <
          this.$refs.HotelDescription.scrollHeight
      ) {
        this.showDescriptionReadMore = true
      } else {
        this.showDescriptionReadMore = false
      }
    },
    showHotelSearchFormModal(status) {
      if (status) {
        if (window.innerWidth < 772) {
          document.body.classList.add('fixed')
        }
        this.hotelSearchModalActive = true
      } else {
        if (window.innerWidth < 772) {
          document.body.classList.remove('fixed')
        }
        this.hotelSearchModalActive = false
      }
    },
    async offerSelect(offer) {
      if (this.cartAddInProgress) {
        return
      }

      if (!this.isLoggedIn) {
        this.$eventBus.publish('showLoginModal')
      } else {
        this.cartAddInProgress = offer.id
        let resDetails
        try {
          console.log('asd')
          resDetails = await this.$store.dispatch('apartments/addToV2Cart', {
            inventory_id: offer.id,
            apartment_id: this.$route.params.id,
            apartment_pricingtype: this.paymentType
          })
          console.log(resDetails)
        } catch (error) {
          console.log(error)
          if (error.response !== undefined) {
            this.cartAddInProgress = false
            const serverMessage = await error.response.json()
            this.$store.dispatch('general/showSnackbar', {
              message: serverMessage.messages || 'Unknown error'
            })
          }
        }

        console.log('asdif')
        if (resDetails) {
          this.cartAddInProgress = false
          if (resDetails.status === 'PERMISSION') {
            if (resDetails.permission_needed === 'premium_voucher') {
              this.voucherErrorPVModalActive = true
            } else {
              this.permissionNeeded = resDetails.permission_needed
              this.permissionModalActive = true
            }
          } else if (resDetails.status === 'NOT_ENOUGH_VOUCHER') {
            this.voucherErrorModalActive = true
          } else if (resDetails.status === 'NOT_ENOUGH_PREMIUM_VOUCHER') {
            this.voucherErrorPVModalActive = true
          } else if (resDetails.status === 'NOT_ENOUGH_BPO') {
            this.bpoErrorModalActive = true
          } else if (resDetails.status === 'NOT_ENOUGH_CREDIT') {
            this.creditErrorModalActive = true
          } else {
            this.$store.commit('apartments/setCartCache', resDetails)
            await this.$router.push(this.localePath('/apartments/cart'))
          }
        }
      }
    },
    toggleOfferDropdown() {
      this.offerDropdownActive = !this.offerDropdownActive
      this.$forceUpdate()
    },
    getOtherSources(rooms) {
      let returnObj = {}
      Object.values(rooms).forEach((room) => {
        if (room[0].source !== this.currentSource) {
          returnObj = { ...returnObj, ...room }
        }
      })
      return returnObj
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
      this.innerHeight = window.innerHeight
    }
  },
  head() {
    return {
      title:
        this.hotel !== undefined
          ? this.hotel.name + this.$t('meta.TitleSuffix')
          : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.hotel !== undefined
              ? this.hotel.name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.hotel !== undefined
              ? this.hotel.name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.hotel.description !== undefined
              ? truncate(this.hotel.description, 160)
              : this.$t('meta.HotelDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.hotel.description !== undefined
              ? truncate(this.hotel.description, 160)
              : this.$t('meta.HotelDescription')
        },
        {
          property: 'twitter:description',
          content:
            this.hotel.description !== undefined
              ? truncate(this.hotel.description, 160)
              : this.$t('meta.HotelDescription')
        }
      ]
    }
  }
}
</script>

<style>
.fadeclamp {
  position: relative;
}
.fadeclamp:after {
  content: '';
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 70%;
  height: 1.2em;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 50%
  );
}

.comma span.filter:not(:last-child):after {
  content: ', ';
  display: inline-block;
}
</style>
