<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper
      v-show="isLoading && (results === false || results.length === 0)"
      :request="request"
    />
    <div v-show="!isLoading">
      <div class="hidden md:block w-full bg-primary-gradient text-white">
        <FlightSearchForm :init="request" />
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
            <FlightSearchForm
              :is-dark="false"
              :init="request"
              from-search-input-id="no-result-flight-from-search"
              to-search-input-id="no-result-flight-to-search"
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
            <div class="mt-16 md:mt-0">
              <ButtonGroup
                :width="innerWidth < 772 ? false : 288"
                :buttons="[
                  {
                    text: $t('flight.Price'),
                    action: () => {
                      requestOrder('price')
                    },
                    active: orderType === 'price'
                  },
                  {
                    text: $t('flight.DepartureTime'),
                    action: () => {
                      requestOrder('departuretime')
                    },
                    active: orderType === 'departuretime'
                  }
                ]"
              />
            </div>
          </div>
          <!-- PriceTable -->
          <div v-if="request.dateFlexible" class="text-black lg:hidden">
            <div class="flex flex-col md:flex-row justify-between">
              <div class="flex-row font-bold leading-14">
                {{ $t('flight.PeriodBestOffers') }}
              </div>
              <div
                class="leading-16 flex flex-col mt-8 sm:flex-row sm:items-end md:mt-0"
              >
                <div class="flex sm:mr-16">
                  <div
                    class="h-12 w-12 mt-2 mr-5 bg-primary opacity-20 rounded-sm flex-row"
                  ></div>
                  <div class="flex-initial text-xs flex-row">
                    {{ $t('flight.BestOfferInDay') }}
                  </div>
                </div>
                <div class="flex mt-4 md:mt-0">
                  <div
                    class="h-12 w-12 mt-2 mr-5 bg-primary rounded-sm flex-row"
                  ></div>
                  <div class="flex-initial text-xs flex-row">
                    {{ $t('flight.PeriodBestOffer') }}
                  </div>
                </div>
              </div>
            </div>
            <SkeletonCalendarWrapper
              v-if="tableCells.length === 0"
              :date1="new Date(request.dates.date1)"
              :date2="
                request.tripType === '1'
                  ? new Date(request.dates.date2)
                  : new Date(request.dates.date1)
              "
              class="mt-10"
            />
            <PriceTable
              class="mt-10"
              :table-cells="tableCells"
              :details-loading="showDetailsLoading"
              @toCart="toCart"
            />
          </div>
          <div
            class="w-full flex flex-row items-stretch mt-16 md:mt-24 lg:mt-0"
          >
            <div
              class="flex flex-col flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md"
            >
              <FlightFilterForm
                v-show="results.length > 0 || filteredSearch"
                :init="filters"
                :trip-type="
                  request.tripType !== undefined ? request.tripType : '0'
                "
                @updateFilters="getFilters"
                @filter="filterList"
              />
            </div>
            <div class="md:ml-8 flex-grow overflow-hidden">
              <div
                v-if="request.dateFlexible"
                class="text-black hidden lg:block mb-24"
              >
                <div class="flex flex-col md:flex-row justify-between">
                  <div class="flex-row font-bold leading-14">
                    {{ $t('flight.PeriodBestOffers') }}
                  </div>
                  <div
                    class="leading-16 flex flex-col mt-8 sm:flex-row sm:items-end md:mt-0"
                  >
                    <div class="flex sm:mr-16">
                      <div
                        class="h-12 w-12 mt-2 mr-5 bg-primary opacity-20 rounded-sm flex-row"
                      ></div>
                      <div class="flex-initial text-xs flex-row">
                        {{ $t('flight.BestOfferInDay') }}
                      </div>
                    </div>
                    <div class="flex mt-4 md:mt-0">
                      <div
                        class="h-12 w-12 mt-2 mr-5 bg-primary rounded-sm flex-row"
                      ></div>
                      <div class="flex-initial text-xs flex-row">
                        {{ $t('flight.PeriodBestOffer') }}
                      </div>
                    </div>
                  </div>
                </div>
                <SkeletonCalendarWrapper
                  v-if="tableCells.length === 0"
                  :date1="new Date(request.dates.date1)"
                  :date2="
                    request.tripType === '1'
                      ? new Date(request.dates.date2)
                      : new Date(request.dates.date1)
                  "
                  class="mt-10"
                />
                <PriceTable
                  class="mt-10"
                  :table-cells="tableCells"
                  :details-loading="showDetailsLoading"
                  @toCart="toCart"
                />
              </div>
              <!-- FlightCards 1 -->
              <div class="flex flex-wrap justify-start">
                <FlightSearchResultCard
                  v-for="(flight, index) in results"
                  :key="index"
                  :best-price="index === 0 && currentPage === 1"
                  :stops="2"
                  :arrives-nex-day="true"
                  :flight="flight"
                  :show-details-button-loading="showDetailsLoading"
                  class="w-full mb-24"
                  @toCart="toCart(flight)"
                />
              </div>
              <!-- Pagination -->
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
      <div
        v-show="results.length > 0"
        class="fixed bottom-0 bg-white w-full z-10 md:hidden"
      >
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-wrap pt-8 pb-10 px-16">
          <div
            class="w-1/2 text-center"
            @click="showFlightFilterFormModal(true)"
          >
            <div class="text-primary text-base mb-8">
              <i class="far fa-sliders-h"></i>
            </div>
            <div class="text-primary text-sm leading-12">
              {{ $t('general.Filter') }}
              <div class="text-grey-dark">
                {{ countFilter }} {{ $t('general.Condition') }}
              </div>
            </div>
          </div>
          <div
            class="w-1/2 text-center text-primary"
            @click="showFlightSearchFormModal(true)"
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
      <DefaultModal v-show="flightSearchFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.StartNewSearch') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showFlightSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <FlightSearchForm
              :is-dark="false"
              :init="request"
              :show-in-modal="true"
              from-search-input-id="modal-flight-from-search"
              to-search-input-id="modal-flight-to-search"
              class="mt-8"
              @search="getResults"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
      <!-- Filter mobil modal-->
      <DefaultModal v-show="flightFilterFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex items-center">
              <i
                class="fa fa-chevron-left text-primary cursor-pointer mr-16"
                @click="showFlightFilterFormModal(false)"
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
            <div class="mt-24 mb-48 px-16 w-full mx-auto">
              <FlightFilterForm
                v-show="results.length > 0"
                ref="flightFilterFormModal"
                :init="filters"
                :show-filter-button="false"
                :trip-type="
                  request.tripType !== undefined ? request.tripType : '0'
                "
                @updateFilters="getFilters"
                @filter="filterList"
              />
            </div>
          </div>
        </div>
        <div slot="footer">
          <ButtonSmall
            class="w-full rounded-t-none rounded-b-none"
            type="primary"
            @click="$refs.flightFilterFormModal.filterResults(true)"
          >
            {{ $t('general.Filter') }}
          </ButtonSmall>
        </div>
      </DefaultModal>
      <PermissionModal
        :show="permissionModalActive"
        :permission-needed="permissionNeeded"
        @cancel="permissionModalActive = false"
        @accept="$router.push(localePath('/weboffice/membership-upgrade'))"
      />
      <CartBlockModal
        :covid-cart-block="cartBlock"
        @accept="cartBlock = false"
      />
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { addDays, format } from 'date-fns'
import SkeletonSearchWrapper from '~/components/skeleton/flight/SkeletonSearchWrapper'
import FlightSearchForm from '~/components/forms/FlightSearchForm'
import FlightFilterForm from '~/components/forms/FlightFilterForm'
import FlightSearchResultCard from '~/components/flight/FlightSearchResultCard'
import DefaultModal from '~/components/modal/DefaultModal'
import CartBlockModal from '@/components/modal/CartBlockModal'

import Pagination from '~/components/Pagination'
import ButtonSmall from '~/components/micro/ButtonSmall'
import ButtonGroup from '~/components/micro/ButtonGroup'
import PriceTable from '~/components/micro/PriceTable'
import SkeletonCalendarWrapper from '@/components/skeleton/flight/SkeletonCalendarWrapper'
import PermissionModal from '@/components/PermissionModal'

export default {
  name: 'FlightSearchPage',
  components: {
    PermissionModal,
    PriceTable,
    SkeletonSearchWrapper,
    FlightSearchForm,
    FlightFilterForm,
    FlightSearchResultCard,
    DefaultModal,
    Pagination,
    ButtonSmall,
    ButtonGroup,
    CartBlockModal,
    SkeletonCalendarWrapper
  },
  data() {
    return {
      innerWidth: 0,
      isLoading: false,
      filteredSearch: false,
      currentPage: 1,
      perPage: 10,
      maxPages: 12,
      totalOffers: 0,
      flightSearchFormModalActive: false,
      flightFilterFormModalActive: false,
      orderType: 'price',
      dateFlexible: true,
      returnDates: [],
      tableCells: [],
      cartBlock: false,
      results: false,
      request: false,
      filters: false,
      calendarData: [],
      countFilter: 0,
      showDetailsLoading: false,
      permissionModalActive: false,
      permissionNeeded: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    }
  },
  mounted() {
    this.$router.push(this.localePath('/'))
    this.getResults()
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    ...mapActions('flight', [
      'getFlightSearch',
      'getFlightFilter',
      'getFlightCalendar'
    ]),
    getResults(filters = false) {
      if (this.flightSearchFormModalActive) {
        this.showFlightSearchFormModal(false)
      }
      if (this.flightFilterFormModalActive) {
        this.showFlightFilterFormModal(false)
      }
      this.searchStart(filters)
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
      this.getResults()
    },
    requestOrder(type) {
      this.orderType = type
      this.getResults()
    },
    showFlightFilterFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.flightFilterFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.flightFilterFormModalActive = false
      }
    },
    showFlightSearchFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.flightSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.flightSearchFormModalActive = false
      }
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    resetFilter() {
      this.filterList({})
      this.$refs.flightFilterFormModal.resetFilters()
      this.getResults()
    },
    async searchStart(params) {
      this.filteredSearch = params.filters !== undefined
      this.isLoading = true
      this.results = []
      let res
      try {
        const payload = {
          search_id: parseInt(this.$route.params.id),
          pagination: {
            per_page: this.perPage,
            page: this.currentPage
          },
          order_by: this.orderType
        }
        if (params.filters !== undefined) {
          payload.filters = params.filters
        }
        res = await this.getFlightSearch(payload, {
          timeout: process.env.SEARCH_INTERVAL
        })
      } catch (e) {
        const body = await e.response?.json()
        if (body && body.messages !== undefined) {
          let messageJson
          try {
            messageJson = JSON.parse(body.messages)
          } catch (e) {
            if (body.messages !== 'SEARCH_ERROR') {
              this.$store.dispatch('general/showSnackbar', {
                message:
                  body.messages === 'INTEGRATION_ERROR'
                    ? this.$t('flight.IntegrationError')
                    : body.messages
              })
            }
          }
          if (messageJson && messageJson.permission_needed !== undefined) {
            this.$router.push(this.localePath('/'))
          }
        }
      }
      if (res && res.results !== undefined) {
        this.results = res.results
        this.request = res.request
        this.filters = res.filters
        this.maxPages = res.page_count
        this.totalOffers = res.total_offers
        this.isLoading = false
        this.getFilters(params)
        if (this.request.dateFlexible) {
          try {
            this.calendarData = await this.getFlightCalendar(
              {
                search_id: parseInt(this.$route.params.id)
              },
              {
                timeout: process.env.SEARCH_INTERVAL
              }
            )
          } catch (e) {
            const body = await e.response?.json()
            if (body && body.messages !== undefined) {
              let messageJson
              try {
                messageJson = JSON.parse(body.messages)
              } catch (e) {
                this.$store.dispatch('general/showSnackbar', {
                  message:
                    body.messages === 'INTEGRATION_ERROR'
                      ? this.$t('flight.IntegrationError')
                      : body.messages
                })
              }
              if (messageJson && messageJson.permission_needed !== undefined) {
                this.$router.push(this.localePath('/'))
              }
            }
          }
          if (
            this.calendarData.results !== undefined &&
            this.calendarData.results.length > 0
          ) {
            const outboundDate = new Date(this.request.dates.date1)
            const outboundDates = [
              null,
              addDays(outboundDate, -3),
              addDays(outboundDate, -2),
              addDays(outboundDate, -1),
              outboundDate,
              addDays(outboundDate, 1),
              addDays(outboundDate, 2),
              addDays(outboundDate, 3)
            ]
            let returnDates = outboundDates
            if (this.request.dates.date2 !== undefined) {
              const returnDate = new Date(this.request.dates.date2)
              returnDates = [
                null,
                addDays(returnDate, -3),
                addDays(returnDate, -2),
                addDays(returnDate, -1),
                returnDate,
                addDays(returnDate, 1),
                addDays(returnDate, 2),
                addDays(returnDate, 3)
              ]
            }
            let row
            const calendarData = []
            let itemIsBestPrice
            for (let i = 0; i < outboundDates.length; i++) {
              row = []
              for (let j = 0; j < returnDates.length; j++) {
                if (i === 0) {
                  row.push({
                    title:
                      j === 4
                        ? this.request.tripType === '0'
                          ? this.$t('flight.Departure')
                          : this.$t('flight.Arrival')
                        : null,
                    value: j !== 0 ? format(returnDates[j], 'LL.dd') : null,
                    class:
                      j === 0
                        ? 'rounded-tl'
                        : j === returnDates.length - 1
                        ? 'border-r rounded-tr'
                        : null
                  })
                } else {
                  const calendarItem = this.getCalendarData(
                    outboundDates[i],
                    returnDates[j]
                  )
                  itemIsBestPrice = false
                  if (calendarItem instanceof Object) {
                    if (
                      Math.ceil(calendarItem.total_fare[this.currency]) ===
                      Math.ceil(this.calendarData.bestPrice[this.currency])
                    ) {
                      itemIsBestPrice = true
                    }
                  }
                  row.push({
                    title:
                      i === 4 && j === 0 ? this.$t('flight.Departure') : null,
                    value:
                      i !== 0 && j === 0
                        ? format(outboundDates[i], 'LL.dd')
                        : calendarItem,
                    class:
                      (i === outboundDates.length - 1 && j === 0
                        ? 'border-b rounded-bl'
                        : i === outboundDates.length - 1 &&
                          j === returnDates.length - 1
                        ? 'border-b border-r rounded-br'
                        : i === outboundDates.length - 1
                        ? 'border-b'
                        : j === returnDates.length - 1
                        ? 'border-r'
                        : null) +
                      ' ' +
                      (itemIsBestPrice
                        ? 'bg-primary text-white font-bold'
                        : i === 4 && j === 4
                        ? 'bg-primary-lighter-opaque text-primary font-bold'
                        : ''),
                    bestPriceInDay: !itemIsBestPrice && i === 4 && j === 4,
                    isBestPrice: itemIsBestPrice
                  })
                }
              }
              calendarData.push(row)
            }
            this.tableCells = calendarData
          }
        }
      } else {
        this.isLoading = false
      }
    },
    filterList(params) {
      this.countFilter = 0
      if (params.filters !== undefined) {
        if (params.filters.class !== undefined) {
          this.countFilter += params.filters.class.length
        }
        if (params.filters.transfer !== undefined) {
          this.countFilter += params.filters.transfer.length
        }
        if (params.filters.transfer !== undefined) {
          this.countFilter += params.filters.transfer.length
        }
        if (params.filters.departuretime !== undefined) {
          if (params.filters.departuretime.firstleg !== undefined) {
            this.countFilter += 1
          }
          if (params.filters.departuretime.returleg !== undefined) {
            this.countFilter += 1
          }
        }
        if (params.filters.price_range !== undefined) {
          this.countFilter += params.filters.price_range.length
        }
        if (params.filters.flighttime !== undefined) {
          this.countFilter += params.filters.flighttime.length
        }
        if (params.filters.airlines !== undefined) {
          this.countFilter += params.filters.airlines.length
        }
      }
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
      this.filters = await this.getFlightFilter(payload)
    },
    getCalendarData(outboundDate, returnDate) {
      if (
        this.calendarData.results !== undefined &&
        this.calendarData.results.length > 0 &&
        outboundDate !== null &&
        returnDate !== null
      ) {
        for (let i = 0; i < this.calendarData.results.length; i++) {
          if (
            format(outboundDate, 'y-MM-dd') ===
              this.calendarData.results[i].departureDate &&
            (format(returnDate, 'y-MM-dd') ===
              this.calendarData.results[i].returnDate ||
              (this.calendarData.results[i].returnDate === '' &&
                format(outboundDate, 'y-MM-dd') ===
                  format(returnDate, 'y-MM-dd')))
          ) {
            return this.calendarData.results[i]
          }
        }
      }
      return null
    },
    async toCart(flight) {
      if (!this.isLoggedIn) {
        this.$eventBus.publish('showLoginModal')
      } else {
        this.showDetailsLoading = true
        let resDetails
        try {
          resDetails = await this.$store.dispatch('flight/getFlightDetails', {
            search_id: parseInt(this.$route.params.id),
            booking_id: flight.bookingId,
            calendar_search: flight.calendarSearch === true
          })
        } catch (e) {
          this.showDetailsLoading = false
          const body = await e.response?.json()
          if (body && body.messages !== undefined) {
            let messageJson
            try {
              messageJson = JSON.parse(body.messages)
            } catch (e) {
              this.$store.dispatch('general/showSnackbar', {
                message:
                  body.messages === 'INTEGRATION_ERROR'
                    ? this.$t('flight.IntegrationError')
                    : this.$t('flight.OfferNotFound')
              })
            }
            if (messageJson && messageJson.permission_needed !== undefined) {
              this.showDetailsLoading = false
              this.permissionNeeded = messageJson.permission_needed
              this.permissionModalActive = true
            }
          }
        }
        if (resDetails) {
          resDetails.calendar_search = flight.calendarSearch === true
          this.$store.commit('flight/setCartCache', resDetails)
          this.$router.push(this.localePath('/flight/cart'))
          this.showDetailsLoading = false
        }
      }
    }
  },
  head() {
    return {
      title: this.request
        ? this.request.fromSearch.text +
          ' - ' +
          this.request.toSearch.text +
          this.$t('meta.TitleSuffix')
        : this.$t('meta.FlightTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.request
            ? this.request.fromSearch.text +
              ' - ' +
              this.request.toSearch.text +
              this.$t('meta.TitleSuffix')
            : this.$t('meta.FlightTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.request
            ? this.request.fromSearch.text +
              ' - ' +
              this.request.toSearch.text +
              this.$t('meta.TitleSuffix')
            : this.$t('meta.FlightTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.FlightDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.FlightDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.FlightDescription')
        }
      ]
    }
  }
}
</script>
