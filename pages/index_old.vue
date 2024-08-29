<template>
  <main class="flex-grow">
    <HeroMain />
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto z-10 bg-white">
      <HistoryHotelSearchWrapper v-show="activeService === 'hotel'" />
      <HistoryFlightSearchWrapper v-show="activeService === 'flight'" />
      <HistoryProgramSearchWrapper v-show="activeService === 'program'" />
      <HistoryCarRentalSearchWrapper v-show="activeService === 'carRental'" />

      <div
        :class="activeService === 'transfer' ? 'lg:flex-row' : 'md:flex-row'"
        class="flex flex-col"
      >
        <div
          v-for="index in 3"
          :key="index"
          :class="
            activeService === 'transfer'
              ? 'w-full lg:w-1/3 lg:pr-16  xl:w-288'
              : 'md:w-1/3 md:pr-16 lg:w-256 lg:pr-0 lg:mr-16'
          "
          class="last:pr-0"
        >
          <HistoryTransferSearch
            v-show="activeService === 'transfer'"
            :from="
              index === 3 ? 'Four Seasons Hotel Gresham Palace Budapest' : 'BUD'
            "
            :from-alt-text="
              index === 3
                ? 'Four Seasons Hotel Gresham Palace Budapest'
                : 'Budapest (BUD)'
            "
            :to="
              index === 3 ? 'BUD' : 'Four Seasons Hotel Gresham Palace Budapest'
            "
            :to-alt-text="
              index === 3
                ? 'Budapest (BUD)'
                : 'Four Seasons Hotel Gresham Palace Budapest'
            "
            :trip-type="index === 1 ? '1' : '2'"
          />
        </div>
      </div>
    </div>
    <div
      v-if="exclusive_results.length == 4"
      class="px-8 xl:px-34 max-w-screen-xl mx-auto text-center z-10 bg-white"
    >
      <h1
        class="px-8 text-xl mb-14 text-black"
        v-html="$t('weboffice.DiscountPass')"
      />
      <p class="px-8 text-base leading-16">
        {{ $t('exclusive_offers.DCHomeDescription') }}
      </p>

      <SkeletonTopWidget v-show="isLoading" />

      <DiscountPassHomeTop
        v-show="discount_results.length > 0 && !isLoading"
        :results="discount_results"
        class="text-left mt-24"
      />

      <ButtonSmall
        class="my-24"
        type="inverted"
        @click="$router.push(localePath('/discount-offers'))"
      >
        {{ $t('exclusive_offers.DCHomeButton') }}
      </ButtonSmall>
    </div>
    <div class="p-16 xl:px-40 parallax-bg text-center">
      <div class="max-w-screen-xl mx-auto">
        <h1 class="text-xl leading-40 text-black uppercase my-16 block">
          {{ $t('general.WhyFireflies') }}
        </h1>
        <div class="flex flex-col sm:flex-row sm:flex-wrap">
          <div class="pt-16 pb-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.AnnualAverage') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.AnnualAverageCount') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.AnnualAverageDesc') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.Actual') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.ProfessionalExperienceYear') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.ProfessionalExperience') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.StablePosition') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.StablePositionYear') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.StablePositionInTourism') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.Worldwide') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.DistributorCount') }}
            </p>
            <p class="text-black text-base leading-24 lowercase">
              {{ $t('general.Distributor') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.DirectPresence') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.DirectPresenceCount') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.InCountry') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-show="false" class="p-16 xl:px-40 parallax-bg text-center">
      <div class="max-w-screen-xl mx-auto">
        <h1 class="text-xl leading-40 text-black uppercase my-16 block">
          {{ $t('general.WhyFireflies') }}
        </h1>
        <div class="flex flex-col sm:flex-row sm:flex-wrap">
          <div class="pt-16 pb-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.AnnualAverage') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.AnnualAverageCount') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.AnnualAverageDesc') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.Actual') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.ProfessionalExperienceYear') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.ProfessionalExperience') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.StablePosition') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.StablePositionYear') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.StablePositionInTourism') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.Worldwide') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.DistributorCount') }}
            </p>
            <p class="text-black text-base leading-24 lowercase">
              {{ $t('general.Distributor') }}
            </p>
          </div>
          <div class="py-20 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/5">
            <p class="text-black text-base leading-24">
              {{ $t('general.DirectPresence') }}
            </p>
            <p class="text-pink text-2xl leading-40 my-4">
              {{ $t('general.DirectPresenceCount') }}
            </p>
            <p class="text-black text-base leading-24">
              {{ $t('general.InCountry') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="exclusive_results.length == 4"
      class="px-8 xl:px-34 max-w-screen-xl mx-auto text-center z-10 bg-white"
    >
      <h1
        class="px-8 text-xl mt-40 mb-14 text-black"
        v-html="$t('weboffice.ExclusiveOffers')"
      />
      <p class="px-8 text-base leading-16">
        {{ $t('exclusive_offers.HomeDescritpion') }}
      </p>

      <SkeletonTopWidget v-show="isLoading" />

      <ExclusiveHomeTop
        v-show="exclusive_results.length > 0 && !isLoading"
        :results="exclusive_results"
        class="text-left mt-24"
      />

      <ButtonSmall
        class="my-24"
        type="inverted"
        @click="$router.push(localePath('/exclusive-offers'))"
      >
        {{ $t('exclusive_offers.HomeButton') }}
      </ButtonSmall>
    </div>
    <div
      class="px-8 xl:px-34 max-w-screen-xl mx-auto text-center z-10 bg-white"
    >
      <h1 class="px-8 text-xl leading-32 mt-40 mb-24 text-black">
        {{ $t('general.WillBeInterested') }}
        <span class="text-primary">{{ $t('general.DiscountedOffers') }}</span
        >...
      </h1>
      <div class="px-8 flex flex-col sm:flex-row sm:flex-wrap">
        <SkeletonBottomWidget v-show="isLoading" />
        <ThematicHomeBottom
          v-if="booked_results.length > 0 && !isLoading"
          :results="booked_results"
          class="w-full text-left mt-24"
        />
      </div>
      <ButtonSmall
        class="my-24"
        type="inverted"
        @click="$router.push(localePath('/thematic-offers'))"
      >
        {{ $t('general.AdditionalDiscountOffers') }}...
      </ButtonSmall>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDateApi } from '@/includes/utils'

import HeroMain from '@/components/HeroMain'
import HistoryHotelSearchWrapper from '@/components/history/HistoryHotelSearchWrapper'
import HistoryFlightSearchWrapper from '@/components/history/HistoryFlightSearchWrapper'
import HistoryTransferSearch from '@/components/history/HistoryTransferSearch'
import HistoryCarRentalSearchWrapper from '@/components/history/HistoryCarRentalSearchWrapper'
import HistoryProgramSearchWrapper from '@/components/history/HistoryProgramSearchWrapper'
import ExclusiveHomeTop from '@/components/exclusive-offers/ExclusiveHomeTop'
import DiscountPassHomeTop from '@/components/exclusive-offers/DiscountPassHomeTop'
import ThematicHomeBottom from '@/components/thematic/ThematicHomeBottom'
import SkeletonTopWidget from '@/components/skeleton/home/SkeletonTopWidget'
import SkeletonBottomWidget from '@/components/skeleton/home/SkeletonBottomWidget'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'IndexPage',
  components: {
    HeroMain,
    HistoryHotelSearchWrapper,
    HistoryFlightSearchWrapper,
    HistoryTransferSearch,
    HistoryCarRentalSearchWrapper,
    HistoryProgramSearchWrapper,
    ThematicHomeBottom,
    ButtonSmall,
    ExclusiveHomeTop,
    DiscountPassHomeTop,
    SkeletonTopWidget,
    SkeletonBottomWidget
  },
  data() {
    return {
      isSliderLoading: false,
      widgetData: false,
      thematic_results: false,
      exclusive_results: false,
      discount_results: false,
      booked_results: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('general', {
      activeService: 'getMainActiveService'
    })
  },
  mounted() {
    this.getExclusiveOffers()
    this.getOffers()
    document.body.classList.remove('fixed')
  },
  methods: {
    async getExclusiveOffers() {
      let res
      try {
        res = await this.$store.dispatch(
          'exclusive-offers/getExcluiveOfferList',
          {
            page: 1,
            perpage: 4
          }
        )
      } catch (e) {
        console.log(e)
      }

      if (res.offersList !== undefined) {
        this.exclusive_results = res.offersList
      }

      try {
        res = await this.$store.dispatch(
          'exclusive-offers/getExcluiveOfferList',
          {
            page: 1,
            perpage: 4,
            discount_pass: true
          }
        )
      } catch (e) {
        console.log(e)
      }

      if (res.offersList !== undefined) {
        this.discount_results = res.offersList
      }
    },
    async getOffers() {
      this.isLoading = true
      this.widgetData = false
      const now = new Date()
      const today = formatDateApi(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      )
      let res
      try {
        res = await this.$store.dispatch('thematic-offers/getMultiList', {
          multi_request: [
            {
              slug: 'home_booked_widget',
              interface: '_thematicofferlist',
              request: {
                lang: this.$i18n.locale,
                page: 1,
                perpage: this.getSpecialOfferNum(),
                type: ['booked-by-you'],
                orderby: 'rand',
                filters: {
                  bookablefrom: today
                }
              }
            }
          ]
        })
      } catch (e) {
        console.log(e)
      }
      if (res !== undefined) {
        if (res !== undefined) {
          this.widgetData = res
          if (res.home_booked_widget !== undefined) {
            this.booked_results = res.home_booked_widget.data.result.offers
          }
          this.isLoading = false
        } else {
          this.isLoading = false
        }
      } else {
        this.isLoading = false
      }
    },
    getSpecialOfferNum() {
      if (window.innerWidth > 1023) {
        return 8
      } else {
        return 4
      }
    },
    changeService(service) {
      if (document.body.classList.contains('fixed')) {
        document.body.classList.remove('fixed')
      }
      this.$store.commit('general/setMainActiveService', service)
      this.$scrollTo('#__nuxt')
    }
  },
  head() {
    return {
      title: 'Fireflies • ' + this.$t('meta.HomeTitle'),
      meta: [
        {
          property: 'og:title',
          content: 'Fireflies • ' + this.$t('meta.HomeTitle')
        },
        {
          property: 'twitter:title',
          content: 'Fireflies • ' + this.$t('meta.HomeTitle')
        },
        {
          property: 'og:description',
          content: this.$t('meta.HomeDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.HomeDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.HomeDescription')
        }
      ]
    }
  }
}
</script>

<style>
.parallax-bg {
  background-image: url('~assets/images/ff-logo-large-opaque.svg'),
    linear-gradient(
      90deg,
      rgba(16, 80, 127, 0.6) 0.35%,
      rgba(0, 173, 181, 0.6) 100%
    );
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  mix-blend-mode: normal;
}
</style>
