<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper v-show="isLoading" :request="results.request" />
    <div v-show="!isLoading">
      <div class="hidden md:block w-full bg-primary-gradient text-white">
        <ProgramSearchForm
          :is-dark="true"
          :init="meta !== undefined ? meta : false"
          class="mt-8 w-full"
          @search="getResults"
        />
      </div>
      <div
        v-show="
          results.program_list === undefined ||
            results.program_list.length === 0
        "
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
            <ProgramSearchForm
              :is-dark="false"
              :init="meta !== undefined ? meta : false"
              name-search-input-id="no-result-program-name-search"
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
      <div
        v-show="
          results.program_list !== undefined && results.program_list.length > 0
        "
      >
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
                  {{ meta.count }} {{ $t('general.Offers') }}
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
              <ProgramFilterForm
                v-show="!isLoading"
                ref="programModalFilterFormSidebar"
                :init="filters"
                @filter="getResults"
                @updateFilter="getFilters"
              />
            </div>
            <div
              v-if="
                results.program_list !== undefined &&
                  results.program_list.length > 0
              "
              class="md:ml-8 flex-grow overflow-hidden"
            >
              <div class="flex flex-wrap justify-start">
                <!-- Program cards -->
                <ProgramSearchResultCard
                  v-for="(program, index) in results.program_list"
                  :key="index"
                  :best-price="index === 0 && meta.page === 1"
                  :program="program"
                  class="w-full mb-24"
                  @showProgramDetails="showProgramDetails"
                />
              </div>
              <div class="w-full px-16 mb-56 flex justify-center">
                <Pagination
                  v-if="!isLoading && meta.page !== undefined"
                  :max-pages="meta.pageCount"
                  :current-page="meta.page"
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
            @click="showProgramFilterFormModal(true)"
          >
            <div class="text-primary text-base mb-8">
              <i class="far fa-sliders-h"></i>
            </div>
            <div class="text-primary text-sm leading-12">
              {{ $t('general.Filter') }}
              <div class="text-grey-dark">3 {{ $t('general.Condition') }}</div>
            </div>
          </div>
          <div
            class="w-1/2 text-center text-primary"
            @click="showProgramSearchFormModal(true)"
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
      <DefaultModal v-show="programSearchFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.StartNewSearch') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showProgramSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <ProgramSearchForm
              :is-dark="false"
              :init="meta !== undefined ? meta : false"
              name-search-input-id="modal-program-name-search"
              class="mt-8 w-full"
              @search="getResults"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
      <!-- Filter mobil modal-->
      <DefaultModal v-show="programFilterFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex items-center">
              <i
                class="fa fa-chevron-left text-primary cursor-pointer mr-16"
                @click="showProgramFilterFormModal(false)"
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
              <ProgramFilterForm
                v-show="!isLoading"
                ref="programFilterFormModal"
                :init="filters"
                :show-filter-button="false"
                @filter="getResults"
                @updateFilter="getFilters"
              />
            </div>
          </div>
        </div>
        <div slot="footer">
          <ButtonSmall
            class="w-full rounded-t-none rounded-b-none"
            type="primary"
            @click="getResults"
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
import * as workerTimers from 'worker-timers'

import SkeletonSearchWrapper from '@/components/skeleton/program/SkeletonSearchWrapper'
import ProgramSearchForm from '@/components/forms/ProgramSearchForm'
import ProgramFilterForm from '@/components/forms/ProgramFilterForm'
import DefaultModal from '@/components/modal/DefaultModal'
import CartBlockModal from '@/components/modal/CartBlockModal'

import Pagination from '@/components/Pagination'
//
import ButtonSmall from '@/components/micro/ButtonSmall'
import ProgramSearchResultCard from '@/components/program/ProgramSearchResultCard'

export default {
  name: 'ProgramSearchPage',
  components: {
    ProgramSearchResultCard,
    SkeletonSearchWrapper,
    ProgramSearchForm,
    ProgramFilterForm,
    DefaultModal,
    Pagination,
    ButtonSmall,
    CartBlockModal
  },
  data() {
    return {
      isLoading: true,

      searchTimer: false,
      searchRequestLimit: 100,
      searchRequestCounter: 0,
      searchProgressBarWidth: 15,

      results: false,
      meta: false,
      filters: false,
      order: 'price',
      filteredSearch: false,
      cartBlock: false,

      innerWidth: 0,
      programSearchFormModalActive: false,
      programFilterFormModalActive: false,
      orderType: 'price'
    }
  },
  mounted() {
    this.getResults()
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    ...mapActions('program', ['getProgramSearch', 'getProgramFilters']),
    stopSearch() {
      if (this.searchTimer) {
        workerTimers.clearInterval(this.searchTimer)
        this.searchTimer = false
      }
    },
    requestOrder(type) {
      this.orderType = type
      this.getResults()
    },
    navPage(page) {
      this.getResults({
        page,
        filters:
          window.innerWidth < 772
            ? this.$refs.programFilterFormModal.getTrueFilters()
            : this.$refs.programModalFilterFormSidebar.getTrueFilters()
      })
    },
    getResults(filters = false) {
      this.$scrollTo('#__nuxt')

      if (this.programSearchFormModalActive) {
        this.showProgramSearchFormModal(false)
      }
      if (this.programFilterFormModalActive) {
        this.showProgramFilterFormModal(false)
      }
      this.isLoading = true
      this.results = false
      this.meta = false
      this.searchStart(filters)
    },
    async getFilters(params) {
      this.filters = await this.getProgramFilters({
        search_id: Number(this.$route.params.id),
        filters: this.prepFilters(params)
      })
    },
    searchStart(params) {
      this.searchRequestCounter++
      let res = []
      const timer = setTimeout(async () => {
        try {
          res = await this.getProgramSearch(
            {
              ...params,
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters(params),
              order: this.order
            },
            { timeout: process.env.SEARCH_INTERVAL }
          )
          if (res.searching === 'DONE') {
            this.filters = await this.getProgramFilters({
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters(params)
            })
          }
        } catch (e) {
          console.log(e)
          clearTimeout(timer)
        }

        if (res.status === 'ERROR') {
          console.log(res)
          clearTimeout(timer)
        }

        if (res.result !== undefined) this.results = res.result
        if (res.meta !== undefined) this.meta = res.meta

        this.meta.search_request.paxDatas.adultCount = parseInt(
          this.meta.search_request.paxDatas.adultCount
        )
        this.meta.search_request.paxDatas.childCount = parseInt(
          this.meta.search_request.paxDatas.childCount
        )

        if (res !== undefined) {
          if (res.searching !== 'DONE' && res.searching !== 'ERROR') {
            this.searchStartInterval(params)
          } else {
            this.isLoading = false
            this.searchTimer = false
          }
        } else {
          this.isLoading = false
          this.searchTimer = false
        }

        clearTimeout(timer)
      }, 500) // első kérésre is kell kis timeout, hogy megvárjuk amíg a navigáció lefut (!)
    },
    searchStartInterval(params) {
      this.searchTimer = workerTimers.setInterval(async () => {
        if (this.searchRequestCounter >= this.searchRequestLimit) {
          this.$store.dispatch(
            'general/showSnackbar',
            'Request limit timed out'
          )
          workerTimers.clearInterval(this.searchTimer)
        }

        this.searchRequestCounter++

        let res = []
        try {
          res = await this.getProgramSearch(
            {
              ...params,
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters(params),
              order: this.order
            },
            { timeout: process.env.SEARCH_INTERVAL - 500 }
          )

          if (res.searching === 'DONE') {
            this.filters = await this.getProgramFilters({
              search_id: Number(this.$route.params.id),
              filters: this.prepFilters(params)
            })
          }
        } catch (e) {
          console.log(e)
          workerTimers.clearInterval(this.searchTimer)
        }

        if (res.status === 'ERROR') {
          workerTimers.clearInterval(this.searchTimer)
          this.isLoading = false
          this.searchTimer = false
          console.log(res)
          return
        }

        if (res.result !== undefined) this.results = res.result
        if (res.meta !== undefined) this.meta = res.meta

        this.meta.search_request.paxDatas.adultCount = parseInt(
          this.meta.search_request.paxDatas.adultCount
        )
        this.meta.search_request.paxDatas.childCount = parseInt(
          this.meta.search_request.paxDatas.childCount
        )

        if (res.searching === 'DONE' || res.searching === 'ERROR') {
          workerTimers.clearInterval(this.searchTimer)
          this.isLoading = false
          this.searchTimer = false
        }
      }, process.env.SEARCH_INTERVAL)
    },
    showProgramFilterFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.programFilterFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.programFilterFormModalActive = false
      }
    },
    showProgramSearchFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.programSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.programSearchFormModalActive = false
      }
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    showProgramDetails(payload) {
      this.cartBlock = false

      let routeData = this.$router.resolve({
        path: '/program/search/' + this.$route.params.id + '/' + payload.slug
      })
      if (payload !== undefined) {
        if (payload.toReview) {
          routeData = this.$router.resolve({
            path:
              '/program/search/' + this.$route.params.id + '/' + payload.slug,
            hash: 'reviews'
          })
        }
      }
      window.open(this.localePath(routeData.href), '_blank')
    },
    resetFilter() {
      this.$refs.programFilterFormModal.resetFilters()
      this.getResults()
    },
    prepFilters(params) {
      this.filteredSearch = params.filters !== undefined
      return [
        {
          category: 'ranges',
          filter: [
            { filter: 'price_slot_0_50', min: 0, max: 50, currency: 'EUR' },
            {
              filter: 'price_slot_50_75',
              min: 50,
              max: 75,
              currency: 'EUR'
            },
            {
              filter: 'price_slot_75_100',
              min: 75,
              max: 100,
              currency: 'EUR'
            },
            {
              filter: 'price_slot_100_150',
              min: 100,
              max: 150,
              currency: 'EUR'
            },
            {
              filter: 'price_slot_150_plus',
              min: 150,
              max: 999999999999,
              currency: 'EUR'
            }
          ]
        },
        {
          category: 'price',
          filter: params.filters !== undefined ? params.filters.price : []
        },
        {
          category: 'categories',
          filter: params.filters !== undefined ? params.filters.categories : []
        }
      ]
    }
  },
  head() {
    return {
      title:
        this.results.request !== undefined
          ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
          : this.$t('meta.ProgramTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.results.request !== undefined
              ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
              : this.$t('meta.ProgramTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.results.request !== undefined
              ? this.results.request.fts_name + this.$t('meta.TitleSuffix')
              : this.$t('meta.ProgramTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.ProgramDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.ProgramDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.ProgramDescription')
        }
      ]
    }
  }
}
</script>
