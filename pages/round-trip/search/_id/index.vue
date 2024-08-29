<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper v-show="isLoading" />
    <div v-show="!isLoading">
      <div class="hidden md:block w-full bg-primary-gradient text-white">
        <RoundTripSearchForm
          :is-dark="true"
          :init="request"
          class="mt-8 w-full"
          @search="getResults"
        />
      </div>
      <div
        v-show="results.length === 0"
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
            <RoundTripSearchForm
              :is-dark="false"
              :init="request"
              name-search-input-id="no-result-round-trip-name-search"
              class="mt-56 md:hidden"
              @search="getResults"
            />
          </div>
          <div v-show="filteredSearch">
            <div
              class="text-danger text-sm font-bold leading-14 px-16 text-center"
            >
              {{ $t('general.FilterNoResults') }}
            </div>
            <div class="text-center">
              <ButtonSmall class="mt-24" type="inverted" @click="resetFilter()">
                {{ $t('general.DeleteFilterCriteria') }}
              </ButtonSmall>
            </div>
          </div>
        </div>
      </div>
      <div v-show="results.length > 0">
        <div class="bg-primary-gradient h-1 w-full md:hidden"></div>
        <div class="flex flex-col p-16 xl:px-40 max-w-screen-xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between mt-8 mb-24">
            <div class="flex flex-row justify-start items-center">
              <i
                class="fa fa-chevron-left text-primary text-sm leading-14 cursor-pointer"
                @click="$router.back()"
              ></i>
              <div class="ml-8">
                <p class="text-sm leading-14 font-bold text-black mb-6">
                  {{ totalOffers }} {{ $t('general.Offers') }}
                </p>
                <p class="text-xs leading-12">
                  {{ $t('general.DescriptionOffers') }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="w-full flex flex-row items-stretch mt-16 md:mt-24 lg:mt-0"
          >
            <div
              class="flex flex-col flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md"
            >
              <RoundTripFilterForm
                ref="roundTripModalFilterFormSidebar"
                :init="filters"
                @filter="filterList"
                @updateFilters="getFilters"
              />
            </div>
            <div class="md:ml-8 flex-grow overflow-hidden">
              <div class="flex flex-wrap justify-start">
                <!-- Round trip cards -->
                <RoundTripSearchResultCard
                  v-for="(roundTrip, index) in results"
                  :key="index"
                  :round-trip="roundTrip"
                  :price-type="priceType"
                  :show-breakpoints="showBreakpointIndex === index"
                  class="w-full mb-24"
                  @showRoundTripDetails="showRoundTripDetails"
                  @showRoundTripBreakpoints="showRoundTripBreakpoints(index)"
                />
              </div>
              <div class="w-full px-16 mb-56 flex justify-center">
                <Pagination
                  :max-pages="maxPages"
                  :current-page="currentPage"
                  @click="navPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Mobile bottom navbar-->
      <div class="fixed bottom-0 bg-white w-full z-20 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-wrap pt-8 pb-10 px-16">
          <div
            class="w-1/2 text-center"
            @click="showRoundTripFilterFormModal(true)"
          >
            <div class="text-primary text-base mb-8">
              <i class="far fa-sliders-h"></i>
            </div>
            <div class="text-primary text-sm leading-12">
              {{ $t('general.Filter') }}
              <div class="text-grey-dark">
                {{ filterCount }} {{ $t('general.Condition') }}
              </div>
            </div>
          </div>
          <div
            class="w-1/2 text-center text-primary"
            @click="showRoundTripSearchFormModal(true)"
          >
            <div class="text-base mb-8">
              <i class="far fa-search"></i>
            </div>
            <div class="text-primary text-sm leading-12 px-32">
              {{ $t('general.StartNewSearch') }}
            </div>
          </div>
        </div>
      </div>
      <!-- New search mobil modal-->
      <DefaultModal
        v-show="roundTripSearchFormModalActive"
        :is-full-page="true"
      >
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.StartNewSearch') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showRoundTripSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <RoundTripSearchForm
              :init="request"
              :is-dark="false"
              name-search-input-id="modal-round-trip-name-search"
              class="mt-8 w-full"
              @search="getResults"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
      <!-- Filter mobil modal-->
      <DefaultModal
        v-show="roundTripFilterFormModalActive"
        :is-full-page="true"
      >
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex items-center">
              <i
                class="fa fa-chevron-left text-primary cursor-pointer mr-16"
                @click="showRoundTripFilterFormModal(false)"
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
            <div class="mt-24 mb-48 px-16 w-full">
              <RoundTripFilterForm
                ref="roundTripFilterFormModal"
                :init="filters"
                :show-filter-button="false"
                @filter="filterList"
                @updateFilters="getFilters"
              />
            </div>
          </div>
        </div>
        <div slot="footer">
          <ButtonSmall
            class="w-full rounded-t-none rounded-b-none"
            type="primary"
            @click="$refs.roundTripFilterFormModal.filterResults(true)"
          >
            {{ $t('general.Filter') }}
          </ButtonSmall>
        </div>
      </DefaultModal>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getTomorrow, convertArray } from '@/includes/utils'
import RoundTripSearchResultCard from '@/components/round-trip/RoundTripSearchResultCard'
import SkeletonSearchWrapper from '@/components/skeleton/round-trip/SkeletonSearchWrapper'
import RoundTripSearchForm from '@/components/forms/RoundTripSearchForm'
import RoundTripFilterForm from '@/components/forms/RoundTripFilterForm'
import DefaultModal from '@/components/modal/DefaultModal'

import Pagination from '@/components/Pagination'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'RoundTripSearchPage',
  components: {
    SkeletonSearchWrapper,
    RoundTripSearchForm,
    RoundTripFilterForm,
    DefaultModal,
    Pagination,
    ButtonSmall,
    RoundTripSearchResultCard
  },
  data() {
    return {
      isLoading: true,
      innerWidth: 0,
      currentPage: 1,
      maxPages: 12,
      perPage: 10,
      totalOffers: 0,
      roundTripSearchFormModalActive: false,
      roundTripFilterFormModalActive: false,
      showBreakpointIndex: false,
      results: false,
      request: false,
      filters: false,
      trueFilters: false,
      filteredSearch: false,
      filterCount: 0,
      priceType: 'BPO',
      dates: {
        date1: getTomorrow(),
        date2: ''
      },
      guests: {
        adults: 2,
        children: 0,
        childrenAges: []
      }
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    }
  },
  mounted() {
    this.getPriceType()
    this.getResults()
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    ...mapActions('round-trip', ['getRoundTripSearch', 'getRoundTripFilter']),
    async getPriceType() {
      this.priceType = 'BPO'
      let availableCoupons = 0
      let availableBPO = 0

      let resCoupon
      try {
        resCoupon = await this.$store.dispatch('user/getCoupons')
      } catch (e) {
        console.log(e)
      }

      if (resCoupon.availableCoupons !== undefined) {
        availableCoupons = resCoupon.availableCoupons
      }

      let resBPO
      try {
        resBPO = await this.$store.dispatch('user/getBestPriceOptions')
      } catch (e) {
        console.log(e)
      }

      if (resBPO.available !== undefined) {
        availableBPO = resBPO.available
      }

      if (availableBPO === 0) {
        if (availableCoupons > 0) {
          // this.priceType = 'HC'
        }
      }
    },
    getResults(filters = false) {
      if (this.roundTripSearchFormModalActive) {
        this.showRoundTripSearchFormModal(false)
      }
      if (this.roundTripFilterFormModalActive) {
        this.showRoundTripFilterFormModal(false)
      }
      this.searchStart(filters)
    },
    showRoundTripFilterFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.roundTripFilterFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.roundTripFilterFormModalActive = false
      }
    },
    showRoundTripSearchFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.roundTripSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.roundTripSearchFormModalActive = false
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
      this.getResults(this.trueFilters)
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    showRoundTripDetails(params) {
      const routeData = this.$router.resolve({
        path: '/round-trip/search/' + this.$route.params.id + '/' + params.id
      })
      window.open(this.localePath(routeData.href), '_blank')
    },
    showRoundTripBreakpoints(index) {
      if (index === this.showBreakpointIndex) {
        this.showBreakpointIndex = false
      } else {
        this.showBreakpointIndex = index
      }
    },
    resetFilter() {
      this.$refs.roundTripFilterFormModal.resetFilters()
      this.$refs.roundTripModalFilterFormSidebar.resetFilters()
      this.filterList({
        filters: {
          date_range: [getTomorrow(), '']
        }
      })
    },
    async searchStart(params) {
      this.isLoading = true
      this.filteredSearch = params.filters !== undefined
      if (this.filteredSearch) {
        const filters = convertArray(params.filters)
        // COUNT SELECTED FILTERS - BUGFIX TD
        this.filterCount = 0
        filters.forEach((element) => {
          if (Array.isArray(element.$value)) {
            this.filterCount += element.$value.length
          }
        })
      }
      this.results = false
      let res
      try {
        res = await this.getRoundTripSearch(
          {
            search_id: this.$route.params.id,
            filters:
              params.filters !== undefined
                ? params.filters
                : {
                    date_range: [this.dates.date1, ''],
                    guests:
                      params.filters !== undefined &&
                      params.filters.guests !== undefined
                        ? params.filters.guests
                        : this.guests
                  },
            pagination: {
              per_page: this.perPage,
              page: this.currentPage
            },
            currency: this.currency,
            order_by: 'activity_price ASC',
            session: {
              dates:
                params.filters !== undefined
                  ? params.filters.dates
                  : this.dates,
              guests:
                params.filters !== undefined &&
                params.filters.guests !== undefined
                  ? params.filters.guests
                  : this.guests
            }
          },
          { timeout: process.env.SEARCH_INTERVAL }
        )
      } catch (e) {
        console.log(e)
      }
      if (res !== undefined && res.results !== undefined) {
        this.results = res.results
        this.request = res.request
        this.filters = { filters: res.filters }
        this.maxPages = res.page_count
        this.totalOffers = res.total_offers
        this.isLoading = false
        if (this.results.length > 0) {
          this.getFilters(this.filters)
        }
      } else {
        this.isLoading = false
      }
    },
    filterList(params) {
      this.$scrollTo('#__nuxt')
      this.trueFilters = params
      this.currentPage = 1
      this.getResults(params)
    },
    async getFilters(params) {
      const payload = {
        search_id: this.$route.params.id
      }
      if (params.filters !== undefined) {
        payload.filters = params.filters
      }
      payload.currency = this.currency
      this.filters = await this.getRoundTripFilter(payload)
    }
  },
  head() {
    return {
      title:
        this.request.text !== undefined
          ? this.request.text + this.$t('meta.TitleSuffix')
          : this.$t('meta.destinationTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.request.text !== undefined
              ? this.request.text + this.$t('meta.TitleSuffix')
              : this.$t('meta.destinationTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.request.text !== undefined
              ? this.request.text + this.$t('meta.TitleSuffix')
              : this.$t('meta.destinationTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.DestinationDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.DestinationDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.DestinationDescription')
        }
      ]
    }
  }
}
</script>
