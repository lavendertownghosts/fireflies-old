<template>
  <main class="flex-grow">
    <div class="bg-primary-gradient h-1"></div>
    <SkeletonExclusiveListWrapper v-show="isLoading" />
    <section
      v-show="!isLoading"
      class="flex flex-col p-16 sm:pr-0 md:pr-8 xl:px-40 max-w-screen-xl mx-auto"
    >
      <div class="flex flex-row justify-start items-center pb-24">
        <i
          class="fa fa-chevron-left text-primary text-sm leading-14 cursor-pointer"
          @click="$router.push(localePath('/'))"
        ></i>
        <div class="ml-8">
          <p class="text-sm leading-14 font-bold text-black mb-6">
            {{ totalOffers }} {{ $t('exclusive_offers.OfferListTitle') }}
          </p>
          <p class="text-xs leading-12">
            {{ $t('exclusive_offers.OfferListHeading') }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap justify-start mb-12 -ml-8 -mr-8">
        <ExclusiveResultCard
          v-for="(item, index) in results"
          :key="index"
          :offer="item"
          :image-height="responsiveWidgetThematicOfferHeight"
          :is-list="true"
          class="w-full sm:w-1/2 lg:w-1/4 px-8"
        />
      </div>
      <div class="flex flex-wrap justify-center mb-56">
        <Pagination
          :max-pages="maxPages"
          :current-page="currentPage"
          @click="navPage"
        />
      </div>
    </section>
  </main>
</template>
<script>
import ExclusiveResultCard from '@/components/exclusive-offers/ExclusiveResultCard'
import SkeletonExclusiveListWrapper from '@/components/skeleton/exclusive-offers/SkeletonExclusiveWrapper.vue'
import Pagination from '@/components/Pagination'

import {
  responsiveWidgetThematicOfferHeight,
  exclusiveCount
} from '@/includes/utils'

export default {
  name: 'ExclusiveOfferList',
  components: {
    Pagination,
    ExclusiveResultCard,
    SkeletonExclusiveListWrapper
  },
  data() {
    return {
      results: {},
      isLoading: false,
      isLoadMore: false,
      maxPages: 1,
      filterCount: 0,
      perPage: 10,
      totalOffers: 0,
      currentPage: 1
    }
  },
  computed: {
    responsiveWidgetThematicOfferHeight() {
      return responsiveWidgetThematicOfferHeight()
    },
    exclusiveCount() {
      return exclusiveCount()
    }
  },
  mounted() {
    this.resetState()
    this.getResults()
  },
  methods: {
    resetState() {
      this.results = []
      this.page = 0
      this.maxpage = 1
      this.isLoading = false
    },
    async getResults() {
      this.isLoading = true
      let res = {}
      try {
        res = await this.$store.dispatch(
          'exclusive-offers/getExcluiveOfferList',
          {
            page: this.currentPage,
            perpage: this.exclusiveCount
          }
        )
      } catch (e) {
        console.log(e)
      }

      if (res.offersList !== undefined) {
        this.results = res.offersList
        this.maxPages = res.meta.pages
        this.totalOffers = res.meta.total
      }

      this.isLoading = false
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
      this.getResults()
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeExclusiveOffersTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeExclusiveOffersTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeExclusiveOffersTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
