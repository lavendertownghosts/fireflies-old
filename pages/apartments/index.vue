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
              @click="$router.push(localePath('/apartments/map'))"
            >
              <i class="fa fa-map-marker-alt"></i> {{ $t('hotel.MapView') }}
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
            <!-- first section -->
            <div class="flex flex-wrap justify-start">
              <ApartmentResultCard
                v-for="(hotel, index) in hotelsFirstSection"
                :key="index"
                :apartment="hotel"
                :payment-type="paymentType"
                :image-height="responsiveApartmentImageHeight"
                class="w-full lg:w-1/2 md:w-1/1 w-1/1 sm:pr-16 md:px-8"
              />
            </div>
            <div class="w-full px-16 mb-56 flex justify-center">
              <Pagination
                v-if="!isLoading && results.meta.page !== undefined"
                :max-pages="results.meta.max_page"
                :current-page="
                  results.meta.page === false ? 1 : results.meta.page
                "
                @click="navPage"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile bottom navbar-->
      <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-row pt-8 pb-10 px-16 justify-center">
          <div
            class="w-1/3 text-center pr-8 cursor-pointer"
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
            @click="$router.push(localePath('/apartments/map'))"
          >
            <div class="text-base mb-6">
              <i class="far fa-map-marker-alt"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('hotel.MapView') }}
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
          <div class="flex flex-wrap p-16 mt-64">
            <ApartmentsFilterForm
              class="w-full"
              :init="results.session"
              :data="results.filters"
              @filter="setFilters"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
    </div>
  </main>
</template>

<script>
import SkeletonSearchWrapper from '@/components/skeleton/hotel/SkeletonSearchWrapper'
import ApartmentResultCard from '@/components/apartments/ApartmentResultCard'
import ApartmentsFilterForm from '@/components/forms/ApartmentsFilterForm'
import Pagination from '@/components/Pagination'
import DefaultModal from '@/components/modal/DefaultModal'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputRadio from '@/components/micro/InputRadio'

import {
  responsiveApartmentImageHeight,
  apartmentsCount,
  calcNights
} from '@/includes/utils'

export default {
  name: 'HotelSearchPage',
  components: {
    SkeletonSearchWrapper,
    ApartmentResultCard,
    ButtonSmall,
    Pagination,
    DefaultModal,
    InputRadio,
    ApartmentsFilterForm
  },
  data() {
    return {
      isLoading: true, // true

      hotelFilterFormModalActive: false,

      results: false,
      filters: [],
      type: false,

      maxPages: 1,
      perPage: 10,
      totalOffers: 0,
      currentPage: 1,

      cacheFilter: false
    }
  },
  computed: {
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
    }
  },
  mounted() {
    this.searchRequestCounter = 0
    this.getResults()
  },
  methods: {
    calcNights,
    navPage(page) {
      this.currentPage = page
      this.getResults()
    },
    setFilters(filters) {
      this.filters = filters.apartmentfilters
      this.getResults()
    },
    resetFilters() {
      this.filters = []
      this.getResults()
    },
    async getResults() {
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
        hotelPerPage: this.perPage,
        apartmentfilters: this.filters
      })

      this.isLoading = false
    },
    showHotelFilterFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.hotelFilterFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.hotelFilterFormModalActive = false
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
