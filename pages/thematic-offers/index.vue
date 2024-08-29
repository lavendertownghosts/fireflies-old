<template>
  <main class="flex-grow">
    <SkeletonThematicListWrapper v-show="isLoading" />
    <div v-show="!isLoading">
      <div
        class="py-56 mb-24 bg-cover bg-center relative small-hero-dark-bg hero-bg w-full bg-primary flex flex-col"
      >
        <h1 class="text-center z-10 pb-4 text-xl text-white">
          {{ $t('meta.ThematicTitle') }}
        </h1>
      </div>
      <section
        class="flex flex-col p-16 sm:pr-0 md:pr-8 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="flex flex-row justify-start items-center pb-24">
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

        <div class="w-full flex flex-row items-stretch">
          <div
            class="flex flex-col flex-shrink-0 hidden md:block w-grid-sm xl:w-grid-md"
          >
            <!-- NOTE: Filter forms -->
            <ThematicFilterForm
              ref="thematicModalFilterSidebar"
              :init="filters"
              :show-button="true"
              @updateFilter="getFilters"
              @filter="filterList"
            />
          </div>
          <!-- NOTE: Results list -->
          <div class="flex-grow overflow-hidden md:pl-8">
            <div class="flex flex-wrap justify-start">
              <ThematicResultCard
                v-for="(item, index) in results"
                :key="index"
                :thematic="item"
                :image-height="responsiveHotelImageHeight"
                class="w-full sm:w-1/2 lg:w-1/3 sm:pr-16 md:px-8"
              />
            </div>
            <div class="w-full px-16 mb-56 flex justify-center">
              <Pagination
                v-show="!isLoading"
                :max-pages="maxPages"
                :current-page="currentPage"
                @click="navPage"
              />
            </div>
          </div>
        </div>
      </section>
      <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-row pt-8 pb-2 px-16">
          <div
            class="w-1/2 text-center text-primary pl-8 cursor-pointer"
            @click="$router.push(localePath('/thematic-offers'))"
          >
            <div class="text-base mb-6">
              <i class="fas fa-icons"></i>
              <div class="text-primary text-xs leading-12">
                {{ $t('thematic.thematics_mobile') }}
                <div class="text-grey-dark">
                  {{ $t('thematic.available', { thematics: thematicsAll }) }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="w-1/2 text-center pr-8 cursor-pointer"
            @click="showThematicFilterModal(true)"
          >
            <div class="text-primary text-base">
              <i class="far fa-sliders-h"></i>
            </div>
            <div class="text-primary text-xs leading-12">
              {{ $t('general.Filter') }}
              <div class="text-grey-dark">
                {{ filterCount }} {{ $t('general.Condition') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NOTE: Filter Modal -->
    <DefaultModal v-show="thematicFilterModalActive" :is-full-page="true">
      <div slot="header">
        <div class="flex w-full text-black py-20 px-16">
          <div class="flex items-center">
            <i
              class="fa fa-chevron-left text-primary cursor-pointer mr-16"
              @click="showThematicFilterModal(false)"
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
          <div class="mb-64 px-16 w-full">
            <ThematicFilterForm
              ref="thematicModalFilterSidebar"
              :init="filters"
              :show-button="false"
              @updateFilter="getFilters"
              @filter="filterList"
            />
          </div>
        </div>
      </div>
      <div slot="footer">
        <ButtonSmall
          class="w-full rounded-t-none rounded-b-none"
          type="primary"
          @click="
            $refs.thematicModalFilterSidebar.filterResults(true),
              showThematicFilterModal(false)
          "
          >{{ $t('general.Filter') }}</ButtonSmall
        >
      </div>
    </DefaultModal>
  </main>
</template>

<script>
import ThematicFilterForm from '@/components/forms/ThematicFilterForm'
import ThematicResultCard from '@/components/thematic/ThematicResultCard'
import SkeletonThematicListWrapper from '@/components/skeleton/thematics/SkeletonThematicListWrapper'
import Pagination from '@/components/Pagination'
import ButtonSmall from '@/components/micro/ButtonSmall'
import DefaultModal from '@/components/modal/DefaultModal'

import {
  responsiveHotelImageHeight,
  thematicCount,
  convertArray
} from '@/includes/utils'

export default {
  name: 'ThematicPage',
  components: {
    Pagination,
    ThematicResultCard,
    ThematicFilterForm,
    SkeletonThematicListWrapper,
    DefaultModal,
    ButtonSmall
  },
  data() {
    return {
      isLoading: true,
      slug: false,
      filters: false,
      thematic: {},
      thematics: [],
      thematicsMore: true,
      thematicsAll: 0,
      thematicsAllpage: 99,
      thematicsPerPage: 5,
      results: false,
      request: {},
      maxPages: 1,
      perPage: 10,
      totalOffers: 0,
      currentPage: 1,
      thematicFilterModalActive: false,
      filterCount: 0
    }
  },
  computed: {
    responsiveHotelImageHeight() {
      return responsiveHotelImageHeight()
    },
    thematicCount() {
      return thematicCount()
    }
  },
  mounted() {
    this.getResults()
  },
  methods: {
    getResults(filters = false) {
      if (this.thematicFilterModalActive) {
        this.showThematicFilterModal(false)
      }

      this.getOffers(filters)
    },
    async getOffers(params) {
      this.isLoading = true
      this.results = false
      this.filterCount = 0
      if (params !== false) {
        const filters = convertArray(params)
        filters.forEach((element) => {
          if (Array.isArray(element.$value)) {
            this.filterCount += element.$value.length
          } else {
            this.filterCount++
          }
        })
      }
      let res
      try {
        res = await this.$store.dispatch('thematic-offers/getOfferList', {
          thematicid: parseInt(this.$route.params.id),
          filters: params !== false ? params : {},
          lang: this.$i18n.locale,
          page: this.currentPage,
          perpage: this.thematicCount
        })
      } catch (e) {
        console.log(e)
      }
      if (res !== undefined) {
        if (res.data !== undefined) {
          if (res.data.result !== undefined) {
            this.results = res.data.result.offers
            this.thematic = res.data.result.thematic[0]
            this.maxPages = res.data.result.pages
            this.totalOffers = res.data.result.total
            if (this.results.length > 0) {
              this.getFilters(params)
            } else {
              this.isLoading = false
            }
          } else {
            this.isLoading = false
          }
        } else {
          this.isLoading = false
        }
      } else {
        this.isLoading = false
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
      this.getResults()
    },
    showThematicFilterModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.thematicFilterModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.thematicFilterModalActive = false
      }
    },
    async getFilters(params) {
      let res = false
      res = await this.$store.dispatch('thematic-offers/getOfferFilters', {
        lang: this.$i18n.locale,
        filters: params !== false ? params : {}
      })
      if (res !== undefined) {
        if (res.data !== undefined) {
          if (res.data.result !== undefined) {
            this.filters = res.data.result.filters
            this.isLoading = false
          } else {
            this.isLoading = false
          }
        } else {
          this.isLoading = false
        }
      } else {
        this.isLoading = false
      }
    },
    filterList(params) {
      this.$scrollTo('#__nuxt')
      this.currentPage = 1
      this.getResults(params)
    },
    resetFilter() {
      this.$refs.thematicModalFilterModal.resetFilters()
      this.filterList()
    }
  },
  head() {
    return {
      title: this.$t('meta.ThematicTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.ThematicTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.ThematicTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.ThematicDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.ThematicDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.ThematicDescription')
        }
      ]
    }
  }
}
</script>
