<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper
      v-show="
        isLoading &&
          (results.hotels === undefined || results.hotels.length === 0)
      "
      :request="results.request"
    />

    <div
      v-show="
        (results.hotels !== undefined && results.hotels.length > 0) ||
          !isLoading
      "
      class="hidden md:block w-full bg-primary-gradient text-white"
    >
      <HotelSearchForm
        :init="results.request !== undefined ? results.request : false"
        @search="stopSearch()"
      />
    </div>
    <div
      v-show="results.hotels !== undefined && results.hotels.length === 0"
      class="md:max-w-screen-md md:px-100 lg:px-42 xl:px-70 mx-auto"
    >
      <div class="flex flex-col my-56 md:my-100">
        <div class="text-center text-danger py-24">
          <i class="fal fa-frown fa-5x"></i>
        </div>
        <div v-show="!filteredSearch">
          <div
            class="text-danger text-sm font-bold leading-14 px-16 text-center"
          >
            {{ $t('general.NoResults') }}
          </div>
          <HotelSearchForm
            :is-dark="false"
            class="mt-56 md:hidden"
            name-search-input-id="no-result-hotel-name-search"
            :init="results.request !== undefined ? results.request : false"
            @search="stopSearch()"
          />
        </div>
        <div v-show="filteredSearch">
          <div
            class="text-danger text-sm font-bold leading-14 px-16 text-center"
          >
            {{ $t('general.FilterNoResults') }}
          </div>
          <div class="text-center">
            <ButtonSmall class="mt-24" type="danger" @click="resetFilter()">{{
              $t('general.DeleteFilterCriteria')
            }}</ButtonSmall>
          </div>
        </div>
      </div>
    </div>
    <div v-show="results.hotels !== undefined && results.hotels.length > 0">
      <div class="flex flex-col p-16 xl:px-40 max-w-screen-xl mx-auto">
        <!-- order filter & header -->
        <div class="flex flex-col md:flex-row justify-between my-8">
          <div class="flex flex-row justify-start items-center">
            <i
              class="fa fa-chevron-left text-primary text-sm leading-14 cursor-pointer"
              @click="resetFilter"
            ></i>
            <div class="ml-8">
              <p class="text-sm leading-14 font-bold text-black mb-6">
                {{ results.hotelCount }} {{ $t('general.Offers') }}
                {{ !finishedLoad ? $t('hotel.andMore') : '' }}
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
          <div
            v-if="type === 'bpo'"
            v-show="!isLoading && finishedLoad"
            class="mt-16 md:mt-0"
          >
            <ButtonGroup
              :width="innerWidth <= 772 ? false : 318"
              :buttons="[
                {
                  text: $t('hotel.BPOPrice'),
                  action: () => {
                    requestOrder('bpo_price')
                  },
                  active: order === 'bpo_price'
                },
                {
                  text: $t('hotel.Price'),
                  action: () => {
                    requestOrder('price')
                  },
                  active: order === 'price'
                },
                {
                  text: $t('hotel.Distance'),
                  action: () => {
                    requestOrder('distance')
                  },
                  active: order === 'distance'
                }
              ]"
            />
          </div>
          <div
            v-if="type !== 'bpo'"
            v-show="!isLoading && finishedLoad"
            class="mt-16 md:mt-0"
          >
            <ButtonGroup
              :width="innerWidth <= 772 ? false : 318"
              :buttons="[
                {
                  text: $t('hotel.Price'),
                  action: () => {
                    requestOrder('price')
                  },
                  active: order === 'price'
                },
                {
                  text: $t('hotel.Distance'),
                  action: () => {
                    requestOrder('distance')
                  },
                  active: order === 'distance'
                }
              ]"
            />
          </div>
        </div>

        <!-- sidebar & hotel cards -->
        <div class="w-full flex flex-row items-stretch mt-16">
          <!-- sidebar -->
          <div
            v-show="finishedLoad"
            class="flex flex-col flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md"
          >
            <ButtonSmall
              class="w-full mb-24"
              @click="
                !isLoading
                  ? $router.push(localePath('/hotel/map/' + $route.params.id))
                  : ''
              "
            >
              <i class="fa fa-map-marker-alt"></i> {{ $t('hotel.MapView') }}
            </ButtonSmall>
            <HotelFilterForm
              v-show="!isLoading"
              ref="hotelModalFilterFormSidebar"
              :init="notFound ? [] : filters"
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
          <!-- hotel cards -->
          <div
            class="md:pl-8 md:pr-8 md:-mr-8 md:pt-8 md:-mt-8 flex-grow overflow-hidden"
          >
            <!-- hotel not found alert -->
            <div
              v-show="hotelNotFound"
              class="relative bg-pink mb-24 p-16 overflow-hidden text-black w-full flex-row"
            >
              <i class="fa fa-info-circle mr-5"></i>
              {{ $t('hotel.HotelNotFound') }}
              <i
                class="absolute right-0 top-0 mr-16 mt-20 fas fa-times opacity-50 hover:opacity-100 cursor-pointer"
                @click="hotelNotFound = false"
              ></i>
            </div>

            <!-- first section -->
            <div class="flex flex-wrap justify-start -mx-8">
              <HotelSearchResultCard
                v-for="(hotel, index) in hotelsFirstSection"
                :key="index"
                :hotel="hotel"
                :search-type="type"
                :voucher="
                  results.request.type === 'voucher' ||
                  results.request.type === 'voucher_cis' ||
                  results.request.type === 'voucher_credit'
                    ? 'DV'
                    : ''
                "
                class="w-full sm:w-1/2 lg:w-1/3 px-8"
                :class="{
                  'sm:w-1/2 lg:w-1/3': finishedLoad,
                  'sm:w-1/2 lg:w-1/4': !finishedLoad
                }"
                :image-height="responsiveHotelImageHeight"
              />
            </div>
            <div class="w-full px-16 mb-56 flex justify-center">
              <Pagination
                v-if="pageCount !== 1"
                :max-pages="pageCount"
                :current-page="page"
                @click="navPage"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="!finishedLoad && !showLoadContent"
        class="fixed w-full z-10 bottom-0 mb-60 md:mb-0 align-items-center text-center"
        :class="
          showLoadContent ? 'bg-primary text-white' : 'bg-white text-black'
        "
      >
        <div class="bg-primary-gradient h-1 w-full"></div>
        <p class="text-sm leading-14 font-bold py-16 text-black">
          <i class="fa fa-sync mr-2 fa-spin"></i>
          {{ $t('hotel.SearchInProgress') }}
        </p>
      </div>

      <div
        v-show="!finishedLoad && showLoadContent"
        class="fixed md:w-1/3 w-full z-10 top-0 mb-60 md:mb-0 align-items-center text-center bg-white rounded-b shadow p-15"
        :class="showLoadContent ? 'slide-in' : ''"
        style="left: 50%; transform: translateX(-50%)"
      >
        <div class="mx-auto flex flex-col flex-shrink-0">
          <p class="mb-8 md:text-base text-sm font-bold">
            {{ $t('hotel.loadRestCalltoAction') }}
          </p>
          <p
            class="bg-danger text-sm leading-14 font-bold py-12 cursor-pointer text-white rounded"
            @click="loadResults"
          >
            <i class="fa fa-sync mr-2"></i>
            {{ $t('hotel.loadRestOffers') }}
          </p>
        </div>
      </div>

      <!-- Mobile bottom navbar-->
      <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-row pt-8 pb-10 px-16">
          <div
            class="w-1/3 text-center pr-8 cursor-pointer"
            :class="{
              'opacity-25': mobileLoadingSection && !finishedLoad
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
            :class="{
              'opacity-25': mobileLoadingSection
            }"
            @click="
              !isLoading
                ? $router.push(localePath('/hotel/map/' + $route.params.id))
                : ''
            "
          >
            <div class="text-base mb-6">
              <i class="far fa-map-marker-alt"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('hotel.MapView') }}
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
              name-search-input-id="modal-hotel-name-search"
              class="w-full"
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
            <div class="flex items-center">
              <i
                class="fa fa-chevron-left text-primary cursor-pointer mr-16"
                @click="showHotelFilterFormModal(false)"
              ></i>
            </div>
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.Filter') }}
            </div>
            <div
              class="flex items-center text-primary text-sm leading-14 font-bold cursor-pointer"
              @click="resetFilter"
            >
              {{ $t('general.DeleteFilters') }}
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <div class="mt-24 mb-100 px-16 w-full">
              <HotelFilterForm
                ref="hotelModalFilterFormModal"
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import * as workerTimers from 'worker-timers'

import SkeletonSearchWrapper from '@/components/skeleton/hotel/SkeletonSearchWrapper'
import HotelSearchForm from '@/components/forms/HotelSearchForm'
import HotelFilterForm from '@/components/forms/HotelFilterForm'
import HotelFilterFormDummy from '@/components/forms/HotelFilterFormDummy'
import HotelSearchResultCard from '@/components/hotel/HotelSearchResultCard'
import Pagination from '@/components/Pagination'
import DefaultModal from '@/components/modal/DefaultModal'

import ButtonGroup from '@/components/micro/ButtonGroup'
import ButtonSmall from '@/components/micro/ButtonSmall'

import {
  firstSectionHotelCount,
  secondSectionHotelCount,
  responsiveHotelImageHeight,
  calcNights
} from '@/includes/utils'

export default {
  name: 'HotelSearchPage',
  components: {
    SkeletonSearchWrapper,
    HotelSearchForm,
    HotelFilterForm,
    HotelFilterFormDummy,
    ButtonGroup,
    ButtonSmall,
    HotelSearchResultCard,
    Pagination,
    DefaultModal
  },
  data() {
    return {
      isLoading: true, // true

      hotelSearchFormModalActive: false,
      hotelFilterFormModalActive: false,

      searchTimer: false,
      searchRequestLimit: 100,
      searchRequestCounter: 0,
      searchProgressBarWidth: 15,
      searchType: 'city',
      hotelNotFound: false,

      results: false,
      buffer: [],
      page: 1,
      pageCount: 1,
      perPage: 21,
      showLoadContent: false,
      finishedLoad: false,
      firstLoaded: false,
      type: false,
      filters: false,
      order: 'bpo_price',
      filteredSearch: false,
      notFound: false,
      descriptionOffersLocalization: this.$t('hotel.DescriptionOffers'),

      mobileLoadingSection: true,

      filterCount: 0,
      cacheFilter: false
    }
  },
  computed: {
    ...mapGetters('hotel', ['searchCache']),
    ...mapGetters('user', ['getGeoLoc']),
    firstSectionHotelCount() {
      return firstSectionHotelCount()
    },
    secondSectionHotelCount() {
      return secondSectionHotelCount()
    },
    responsiveHotelImageHeight() {
      return responsiveHotelImageHeight()
    },
    hotelsFirstSection() {
      return this.results.hotels !== undefined
        ? this.results.hotels.slice((this.page - 1) * 24, this.page * 24)
        : []
    },
    innerWidth() {
      return window.innerWidth
    }
  },
  beforeRouteLeave(to, from, next) {
    this.stopSearch()
    next()
  },
  mounted() {
    document.body.classList.remove('fixed')
    this.searchRequestCounter = 0
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
    ...mapMutations('hotel', ['clearSearchCache', 'notFoundFilterHistory']),
    ...mapActions('hotel', ['getHotelSearch', 'getHotelFilters']),
    stopSearch() {
      if (this.searchTimer !== false) {
        workerTimers.clearInterval(this.searchTimer)
        this.searchTimer = false
      }
    },
    requestOrder(order) {
      this.order = order
      this.getResults({
        filters:
          window.innerWidth < 772
            ? this.$refs.hotelModalFilterFormModal.getTrueFilters()
            : this.$refs.hotelModalFilterFormSidebar.getTrueFilters()
      })
    },
    navPage(page) {
      this.$scrollTo('#__nuxt')
      this.page = page
    },
    async loadResults() {
      if (this.buffer.hotels === undefined) {
        window.location.reload()
      } else {
        this.isLoading = true
        this.results = this.buffer
        this.filters = await this.getHotelFilters({
          search_id: Number(this.$route.params.id),
          filters: this.prepFilters({
            filters:
              window.innerWidth < 772
                ? this.$refs.hotelModalFilterFormModal.getTrueFilters()
                : this.$refs.hotelModalFilterFormSidebar.getTrueFilters()
          }),
          client_nationality: this.getGeoLoc
        })
        this.pageCount = Math.ceil(this.results.hotels.length / 24)
        this.page = 1
        this.$scrollTo('#__nuxt')
        this.buffer = []
        this.finishedLoad = true
        this.isLoading = false
        this.showLoadContent = false
      }
    },
    getMobileResults() {
      this.getResults(
        {
          filters:
            window.innerWidth < 772
              ? this.$refs.hotelModalFilterFormModal.getTrueFilters()
              : this.$refs.hotelModalFilterFormSidebar.getTrueFilters()
        },
        true
      )
    },
    getResults(params = {}, fillFilterHistory = false) {
      this.$scrollTo('#__nuxt')

      if (this.hotelSearchFormModalActive) {
        this.showHotelSearchFormModal(false)
      }
      if (this.hotelFilterFormModalActive) {
        this.showHotelFilterFormModal(false)
      }

      this.isLoading = true // true
      this.results = false
      this.searchStart(params, fillFilterHistory)
    },
    async getFilters(params) {
      this.filters = await this.getHotelFilters({
        search_id: Number(this.$route.params.id),
        filters: this.prepFilters(params)
      })
    },
    searchStart(params, fillFilterHistory) {
      this.showLoadContent = false
      this.finishedLoad = false
      this.firstLoaded = false
      this.searchRequestCounter++
      this.notFound = false
      if (this.searchTimer !== false) {
        workerTimers.clearInterval(this.searchTimer)
      }
      this.searchTimer = false
      const timer = setTimeout(async () => {
        let res
        try {
          res = await this.getHotelSearch(
            {
              ...params,
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters(params),
              order: this.order,
              nationality: this.getGeoLoc,
              hotelPerPage: 999999
            },
            { timeout: process.env.SEARCH_INTERVAL }
          )

          if (res !== undefined && res.searching === 'DONE') {
            if (res.hotels.length === 0) {
              this.notFound = true
              this.notFoundFilterHistory(params)
            } else {
              this.filters = await this.getHotelFilters({
                search_id: Number(this.$route.params.id),
                filters: this.prepFilters(params)
              })
              if (
                fillFilterHistory &&
                this.searchCache[Number(this.$route.params.id)]
              ) {
                this.cacheFilter = this.searchCache[
                  Number(this.$route.params.id)
                ]
              }
            }
          }
        } catch (e) {
          console.log(e)
          clearTimeout(timer)
        }

        if (res !== undefined) {
          if (
            res.hotels !== undefined &&
            res.hotels.length > 35 &&
            !this.firstLoaded
          ) {
            this.firstLoaded = true
            this.filters = await this.getHotelFilters({
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters({
                filters:
                  window.innerWidth < 772
                    ? this.$refs.hotelModalFilterFormModal.getTrueFilters()
                    : this.$refs.hotelModalFilterFormSidebar.getTrueFilters()
              }),
              client_nationality: this.getGeoLoc
            })

            this.results = res

            if (res !== undefined) {
              if (
                fillFilterHistory &&
                this.searchCache[Number(this.$route.params.id)]
              ) {
                this.cacheFilter = this.searchCache[
                  Number(this.$route.params.id)
                ]
              }
            }
          }

          this.pageCount = Math.ceil(res.hotels.length / 24)
          this.page = 1
          this.type = false

          this.hotelNotFound = false
          this.searchType = 'city'
          if (this.results && this.results.request !== undefined) {
            if (this.results.request.type !== undefined) {
              this.type = this.results.request.type
            }
            if (this.results.request.fts_source !== undefined) {
              this.searchType = this.results.request.fts_source
            }
          }
          if (this.searchRequestCounter === 1) {
            if (this.type === 'bpo') {
              this.order = 'bpo_price'
            } else {
              this.order = 'price'
            }
          }
          clearTimeout(timer)
          console.log(res.searching, 'init')
        }
        if (res !== undefined && res.searching !== 'DONE') {
          this.searchStartInterval(params)
        } else {
          this.filters = await this.getHotelFilters({
            search_id: Number(this.$route.params.id),
            filters: this.prepFilters({
              filters:
                window.innerWidth < 772
                  ? this.$refs.hotelModalFilterFormModal.getTrueFilters()
                  : this.$refs.hotelModalFilterFormSidebar.getTrueFilters()
            }),
            client_nationality: this.getGeoLoc
          })

          if (!this.firstLoaded) {
            this.firstLoaded = true
            this.results = res
            this.pageCount = Math.ceil(this.results.hotels.length / 24)
            this.page = 1
            this.$scrollTo('#__nuxt')
            this.buffer = []
            this.finishedLoad = true
            this.isLoading = false
            this.showLoadContent = false
            this.mobileLoadingSection = false
            this.searchTimer = false
          } else {
            this.showLoadContent = true
            this.searchTimer = false
            this.isLoading = false
            this.mobileLoadingSection = false
            this.buffer = []
            this.finishedLoad = true
          }
        }
      }, 500) // első kérésre is kell kis timeout, hogy megvárjuk amíg a navigáció lefut (!)
    },
    searchStartInterval(params) {
      this.searchTimer = workerTimers.setInterval(async () => {
        // limit az össze lekérésre
        if (this.searchRequestCounter >= this.searchRequestLimit) {
          if (this.searchTimer !== false) {
            workerTimers.clearInterval(this.searchTimer)
          }
        }

        this.searchRequestCounter++

        let res
        try {
          res = await this.getHotelSearch(
            {
              ...params,
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters(params),
              order: this.order,
              client_nationality: this.getGeoLoc,
              hotelPerPage: 999999
            },
            { timeout: process.env.SEARCH_INTERVAL - 500 }
          )

          // limit az üres válaszokra
          if (
            res.hotels !== undefined &&
            res.hotels.length === 0 &&
            this.searchRequestCounter >= 30
          ) {
            console.log(this.searchRequestCounter)
            this.$store.dispatch('general/showSnackbar', {
              message: 'Request limit timed out'
            })
            if (this.searchTimer !== false) {
              workerTimers.clearInterval(this.searchTimer)
            }
            this.searchTimer = false
          }
        } catch (e) {
          console.log(e)
          if (this.searchTimer !== false) {
            workerTimers.clearInterval(this.searchTimer)
          }
        }

        if (
          res.hotels !== undefined &&
          res.hotels.length > 35 &&
          !this.firstLoaded
        ) {
          this.firstLoaded = true
          this.results = res
          this.pageCount = Math.ceil(res.hotels.length / 24)
          this.page = 1
          this.isLoading = false

          this.filters = await this.getHotelFilters({
            search_id: Number(this.$route.params.id),
            filters: this.prepFilters(params)
          })
        }

        this.type = false
        this.hotelNotFound = false

        if (this.results.request !== undefined) {
          if (this.results.request.type !== undefined) {
            this.type = this.results.request.type
          }
          if (this.results.request.fts_source !== undefined) {
            this.searchType = this.results.request.fts_source
          }
        }

        if (res.searching === 'DONE') {
          this.buffer = res
          if (this.searchTimer !== false) {
            workerTimers.clearInterval(this.searchTimer)
          }
          this.filters = await this.getHotelFilters({
            search_id: Number(this.$route.params.id),
            filters: this.prepFilters({
              filters:
                window.innerWidth < 772
                  ? this.$refs.hotelModalFilterFormModal.getTrueFilters()
                  : this.$refs.hotelModalFilterFormSidebar.getTrueFilters()
            }),
            client_nationality: this.getGeoLoc
          })

          if (!this.firstLoaded) {
            this.firstLoaded = true
            this.results = res
            this.pageCount = Math.ceil(this.results.hotels.length / 24)
            this.page = 1
            this.$scrollTo('#__nuxt')
            this.buffer = []
            this.finishedLoad = true
            this.isLoading = false
            this.showLoadContent = false
            this.mobileLoadingSection = false
            this.searchTimer = false
          } else {
            this.showLoadContent = true
            this.searchTimer = false
            this.isLoading = false
            this.mobileLoadingSection = false
          }
        }
      }, process.env.SEARCH_INTERVAL)
    },
    prepFilters(params) {
      this.filteredSearch = params.filters !== undefined
      // COUNT SELECTED FILTERS - BUGFIX TD
      if (this.filteredSearch) {
        this.filterCount = 0
        params.filters.forEach((element) => {
          if (Array.isArray(element.filter)) {
            this.filterCount += element.filter.length
          } else {
            try {
              const array = JSON.parse(element.filter)
              if (Array.isArray(array)) {
                this.filterCount += array.length
              } else {
                this.filterCount += 1
              }
            } catch (e) {
              this.filterCount += 1
            }
          }
        })
      }

      return [
        {
          category: 'hotelPerPage',
          filter: Number(firstSectionHotelCount() + secondSectionHotelCount())
        },
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
      if (!this.mobileLoadingSection && this.finishedLoad) {
        if (status) {
          document.body.classList.add('fixed')
          this.hotelFilterFormModalActive = true
        } else {
          document.body.classList.remove('fixed')
          this.hotelFilterFormModalActive = false
        }
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
    resetFilter() {
      this.$refs.hotelModalFilterFormModal.resetFilters()
      this.$refs.hotelModalFilterFormSidebar.resetFilters()
      this.clearSearchCache(Number(this.$route.params.id))
      this.getResults()
    }
  },
  head() {
    return {
      title:
        this.results && this.results.request !== undefined
          ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
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
.slide-in {
  animation-name: slideIn;
  animation-duration: 1s;
}

@keyframes slideIn {
  from {
    top: -320px;
  }
  to {
    top: 0px;
  }
}
</style>
