<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper
      v-show="isLoading && (results === false || results.length === 0)"
      :request="request"
    />
    <div v-show="!isLoading">
      <div class="hidden md:block w-full bg-primary-gradient text-white">
        <CarRentalSearchForm :init="request" :is-dark="true" />
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
            <CarRentalSearchForm
              :is-dark="false"
              from-search-input-id="car-rent-no-result-from-search"
              to-search-input-id="car-rent-no-result-to-search"
              :init="request"
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
                    text: $t('carrent.Price'),
                    action: () => {
                      requestOrder('price')
                    },
                    active: orderType === 'price'
                  },
                  {
                    text: $t('carrent.Category'),
                    action: () => {
                      requestOrder('category')
                    },
                    active: orderType === 'category'
                  },
                  {
                    text: $t('carrent.Vendor'),
                    action: () => {
                      requestOrder('vendor')
                    },
                    active: orderType === 'vendor'
                  }
                ]"
              />
            </div>
          </div>
          <div
            class="w-full flex flex-row items-stretch mt-16 md:mt-24 lg:mt-0"
          >
            <div
              class="flex flex-col flex-shrink-0 hidden md:block mr-8 w-grid-sm xl:w-grid-md"
            >
              <CarRentalFilterForm
                :init="filters"
                @updateFilters="getFilters"
                @filter="filterList"
              />
            </div>
            <div class="md:ml-8 flex-grow overflow-hidden">
              <div class="flex flex-wrap justify-start">
                <CarRentalSearchResultCard
                  v-for="(carRental, index) in results"
                  :key="index"
                  :best-price="index === 0 && currentPage === 1"
                  :car-rental="carRental"
                  :search-id="$route.params.id"
                  class="w-full mb-24"
                  @block="showCartBlock()"
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
            @click="showCarRentalFilterFormModal(true)"
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
            @click="showCarRentalSearchFormModal(true)"
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
        v-show="carRentalSearchFormModalActive"
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
                @click="showCarRentalSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <CarRentalSearchForm
              :is-dark="false"
              :init="request"
              from-search-input-id="car-rent-modal-from-search"
              to-search-input-id="car-rent-modal-to-search"
              class="mt-8 w-full"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
      <!-- Filter mobil modal-->
      <DefaultModal
        v-show="carRentalFilterFormModalActive"
        :is-full-page="true"
      >
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex items-center">
              <i
                class="fa fa-chevron-left text-primary cursor-pointer mr-16"
                @click="showCarRentalFilterFormModal(false)"
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
              <CarRentalFilterForm
                ref="carRentalModalFilterForm"
                :init="filters"
                :show-filter-button="false"
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
            @click="$refs.carRentalModalFilterForm.filterResults(true)"
          >
            {{ $t('general.Filter') }}
          </ButtonSmall>
        </div>
      </DefaultModal>
      <CartBlockModal
        :covid-cart-block="cartBlock"
        @accept="cartBlock = false"
      />
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'

import CarRentalSearchResultCard from '@/components/car-rental/CarRentalSearchResultCard'
import SkeletonSearchWrapper from '@/components/skeleton/car-rental/SkeletonSearchWrapper'
import CarRentalSearchForm from '@/components/forms/CarRentalSearchForm'
import CarRentalFilterForm from '@/components/forms/CarRentalFilterForm'
import DefaultModal from '@/components/modal/DefaultModal'

import CartBlockModal from '@/components/modal/CartBlockModal'

import Pagination from '@/components/Pagination'

import ButtonGroup from '@/components/micro/ButtonGroup'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'CarRentalSearchPage',
  components: {
    CarRentalSearchResultCard,
    SkeletonSearchWrapper,
    CarRentalSearchForm,
    CarRentalFilterForm,
    DefaultModal,
    Pagination,
    ButtonGroup,
    CartBlockModal,
    ButtonSmall
  },
  data() {
    return {
      isLoading: true,
      countFilter: 0,
      innerWidth: 0,
      currentPage: 1,
      perPage: 10,
      maxPages: 12,
      totalOffers: 0,
      carRentalSearchFormModalActive: false,
      carRentalFilterFormModalActive: false,
      orderType: 'price',
      results: false,
      request: false,
      cartBlock: false,
      filters: false,
      trueFilters: false,
      filteredSearch: false
    }
  },
  mounted() {
    if (this.innerWidth < 520) {
      this.perPage = 8
    }
    this.getResults()
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    ...mapActions('carRental', ['getCarRentalSearch', 'getCarRentalFilter']),
    showCartBlock() {
      this.cartBlock = true
    },
    getResults(filters = false) {
      if (this.carRentalSearchFormModalActive) {
        this.showCarRentalSearchFormModal(false)
      }
      if (this.carRentalFilterFormModalActive) {
        this.showCarRentalFilterFormModal(false)
      }
      this.searchStart(filters)
    },
    showCarRentalFilterFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.carRentalFilterFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.carRentalFilterFormModalActive = false
      }
    },
    showCarRentalSearchFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.carRentalSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.carRentalSearchFormModalActive = false
      }
    },
    requestOrder(type) {
      this.orderType = type
      this.currentPage = 1
      this.$scrollTo('#__nuxt')
      this.getResults(this.trueFilters)
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
      this.getResults(this.trueFilters)
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    async searchStart(params) {
      this.isLoading = true
      this.filteredSearch = params.filters !== undefined
      this.results = false
      let res
      try {
        res = await this.getCarRentalSearch(
          {
            search_id: this.$route.params.id,
            filters: params.filters !== undefined ? params.filters : {},
            pagination: {
              per_page: this.perPage,
              page: this.currentPage
            },
            order_by: this.orderType + ' ASC',
            feat_price: true
          },
          { timeout: process.env.SEARCH_INTERVAL }
        )
      } catch (e) {
        console.log(e)
      }
      if (res.results !== undefined) {
        this.results = res.results
        this.request = res.request
        this.maxPages = res.page_count
        this.totalOffers = res.total_offers
        this.isLoading = false
        if (this.results.length > 0) {
          this.getFilters(params)
        }
      } else {
        this.isLoading = false
      }
    },
    async getFilters(params) {
      this.filters = await this.getCarRentalFilter({
        search_id: this.$route.params.id,
        filters: params.filters !== undefined ? params.filters : {}
      })
    },
    filterList(params) {
      this.countFilter = 0
      if (params.filters.price_range !== undefined) {
        this.countFilter += params.filters.price_range.length
      }
      if (params.filters.baggage !== undefined) {
        this.countFilter += 1
      }
      if (params.filters.category !== undefined) {
        this.countFilter += params.filters.category.length
      }
      if (params.filters.equipment !== undefined) {
        this.countFilter += params.filters.equipment.length
      }
      if (params.filters.vendor !== undefined) {
        this.countFilter += params.filters.vendor.length
      }
      this.$scrollTo('#__nuxt')
      this.trueFilters = params
      this.currentPage = 1
      this.getResults(params)
    },
    resetFilter() {
      this.$refs.carRentalModalFilterForm.resetFilters()
      this.filterList({ filters: {} })
    }
  },
  head() {
    return {
      title: this.request
        ? this.request.pickup + this.$t('meta.TitleSuffix')
        : this.$t('meta.CarrentTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.request
            ? this.request.pickup + this.$t('meta.TitleSuffix')
            : this.$t('meta.CarrentTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.request
            ? this.request.pickup + this.$t('meta.TitleSuffix')
            : this.$t('meta.CarrentTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.CarrentDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.CarrentDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.CarrentDescription')
        }
      ]
    }
  }
}
</script>
