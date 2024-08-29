<template>
  <main class="flex-grow">
    <section class="w-full relative md:h-650 md:pb-0 pb-84">
      <!-- backgrounds -->
      <div
        v-for="service in serviceList"
        v-show="service.value === activeService"
        :key="service.value"
        :style="
          service.background !== false
            ? {
                backgroundImage:
                  `url('/images/home/` + service.background + `')`
              }
            : ''
        "
        class="service-background absolute w-full md:h-650 h-full left-0 top-0 bottom-0 z-0"
      ></div>
      <div class="relative w-full z-10">
        <div
          class="px-8 xl:px-34 max-w-screen-xl md:h-650 mx-auto z-10 grid grid-cols-1 gap-32 md:grid-cols-12 md:pt-56 pt-24"
        >
          <div class="md:col-span-7 col-span-7">
            <h2 class="md:text-lg mt-16 text-white">
              {{ $t('landing.own_database') }}
            </h2>
            <div class="w-100 h-2 bg-primary mt-5 mb-18"></div>
            <div class="overflow-x-auto">
              <div
                class="grid grid-cols-5 text-white text-xs -mx-5 md:w-full w-650"
              >
                <div
                  v-for="service in serviceList"
                  v-show="
                    !service.disabled &&
                      (service.href == false || service.value == 'apartments')
                  "
                  :key="service.value"
                  class="cursor-pointer h-150 rounded border transition-all duration-300 text-center p-5 flex flex-col items-center items-center mx-5"
                  :class="
                    service.value === activeService
                      ? 'bg-primary'
                      : 'border-primary hover:border-white '
                  "
                  @click="changeService(service)"
                >
                  <img
                    v-show="service.value !== activeService"
                    :src="'/images/home/' + service.icon"
                    :alt="service.title"
                    class="my-5"
                    width="50"
                    height="50"
                  />

                  <img
                    v-show="service.value == activeService"
                    :src="'/images/home/' + service.iconActive"
                    :alt="service.title"
                    class="my-5"
                    width="50"
                    height="50"
                  />

                  <div class="text-sm font-bold ">{{ service.title }}</div>
                  <div class="text-2xs leading-12">
                    {{ service.description }}
                  </div>
                </div>
              </div>
            </div>

            <h2 class="md:text-lg mt-32 text-white">
              {{ $t('landing.redirected_services') }}
            </h2>
            <div class="w-100 h-2 bg-primary mt-5 mb-18"></div>
            <div class="overflow-x-auto">
              <div
                class="grid grid-cols-5 text-white text-xs -mx-5 md:w-full w-650"
              >
                <div
                  v-for="service in serviceList"
                  v-show="
                    !service.disabled &&
                      !service.href == false &&
                      service.value !== 'apartments'
                  "
                  :key="service.value"
                  class="cursor-pointer h-150 rounded border border-primary hover:border-white transition-all duration-300 text-center p-5 flex flex-col items-center items-center mx-5"
                  @click="changeService(service)"
                >
                  <img
                    :src="'/images/home/' + service.icon"
                    :alt="service.title"
                    class="my-5"
                    width="50"
                    height="50"
                  />

                  <div class="text-sm font-bold ">{{ service.title }}</div>
                  <div class="text-2xs leading-12">
                    {{ service.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="forms" class="md:col-span-5 col-span-7">
            <div
              v-for="service in serviceList"
              v-show="service.value === activeService"
              :key="service.value"
              class="text-white"
            >
              <h2 class="md:text-2xl text-lg">{{ service.title }}</h2>
              <div class="md:text-3x">{{ service.description }}</div>
              <div class="w-100 h-2 bg-primary my-18"></div>
            </div>
            <HotelSearchForm
              v-show="'hotel' === activeService"
              :is-homepage="true"
            />
            <CarRentalSearchForm
              v-show="'carRental' === activeService"
              :is-homepage="true"
            />
            <FlightSearchForm
              v-show="'flight' === activeService"
              :is-homepage="true"
            />
            <ProgramSearchForm
              v-show="'program' === activeService"
              :is-homepage="true"
            />
            <RoundTripSearchForm
              v-show="'roundTrip' === activeService"
              :is-homepage="true"
            />
          </div>
        </div>
      </div>
    </section>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto z-10">
      <HistoryHotelSearchWrapper v-show="activeService === 'hotel'" />
      <HistoryFlightSearchWrapper v-show="activeService === 'flight'" />
      <HistoryProgramSearchWrapper v-show="activeService === 'program'" />
      <HistoryCarRentalSearchWrapper v-show="activeService === 'carRental'" />
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
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

import HistoryHotelSearchWrapper from '@/components/history/HistoryHotelSearchWrapper'
import HistoryFlightSearchWrapper from '@/components/history/HistoryFlightSearchWrapper'
import HistoryCarRentalSearchWrapper from '@/components/history/HistoryCarRentalSearchWrapper'
import HistoryProgramSearchWrapper from '@/components/history/HistoryProgramSearchWrapper'
import ExclusiveHomeTop from '@/components/exclusive-offers/ExclusiveHomeTop'
import DiscountPassHomeTop from '@/components/exclusive-offers/DiscountPassHomeTop'
import SkeletonTopWidget from '@/components/skeleton/home/SkeletonTopWidget'
import ButtonSmall from '@/components/micro/ButtonSmall'

import HotelSearchForm from '@/components/forms/HotelSearchForm'
import CarRentalSearchForm from '@/components/forms/CarRentalSearchForm'
import FlightSearchForm from '@/components/forms/FlightSearchForm'
import ProgramSearchForm from '@/components/forms/ProgramSearchForm'
import RoundTripSearchForm from '@/components/forms/RoundTripSearchForm'

export default {
  name: 'IndexPage',
  components: {
    HistoryHotelSearchWrapper,
    HistoryFlightSearchWrapper,
    HistoryCarRentalSearchWrapper,
    HistoryProgramSearchWrapper,
    ButtonSmall,
    ExclusiveHomeTop,
    DiscountPassHomeTop,
    SkeletonTopWidget,
    HotelSearchForm,
    CarRentalSearchForm,
    FlightSearchForm,
    ProgramSearchForm,
    RoundTripSearchForm
  },
  data() {
    return {
      isSliderLoading: false,
      widgetData: false,
      thematic_results: false,
      exclusive_results: false,
      discount_results: false,
      booked_results: false,
      isLoading: false,
      serviceList: [
        {
          title: this.$t('general.Hotels'),
          icon: 'hotel.svg',
          iconActive: 'hotel-active.svg',
          background: 'hotel-hero-bg.jpg',
          value: 'hotel',
          description: this.$t('general.HotelCount'),
          disabled: false,
          href: false,
          active: true
        },
        {
          title: this.$t('general.FlightTicket'),
          icon: 'flight.svg',
          background: 'airplane-hero-bg.jpg',
          value: 'flight',
          description: this.$t('general.FlightAirlines'),
          disabled: false,
          href: this.localePath('/flight'),
          active: false,
          form: false
        },
        {
          title: this.$t('general.Transfer'),
          icon: 'transfer.svg',
          background: 'airplane-hero-bg.jpg',
          value: 'transfer',
          description: this.$t('general.TransferCountryAndPartners'),
          disabled: false,
          href: this.localePath('/transfer'),
          active: false,
          form: false
        },
        {
          title: this.$t('general.Programs'),
          icon: 'program.svg',
          iconActive: 'program-active.svg',
          background: 'program-hero-bg.jpg',
          value: 'program',
          description: this.$t('general.ProgramCountCountry'),
          disabled: false,
          href: false,
          active: false
        },
        {
          title: this.$t('general.CarRental'),
          icon: 'car-rental.svg',
          iconActive: 'car-rental-active.svg',
          background: 'car-rental-hero-bg.jpg',
          value: 'carRental',
          description: this.$t('general.CarRentalCountryAndPartner'),
          disabled: false,
          href: false,
          active: false
        },
        {
          title: this.$t('general.RoundTrip'),
          icon: 'round-trip.svg',
          iconActive: 'roundtrip-active.svg',
          background: 'round-trip-hero-bg.jpg',
          value: 'roundTrip',
          description: this.$t('general.ThousandsOfOptions'),
          disabled: false,
          href: false,
          active: false
        },
        {
          title: this.$t('general.Apartments'),
          icon: 'apartments.svg',
          background: 'villa-apartman-hero-bg.jpg',
          value: 'apartments',
          disabled: false,
          href: '/apartments',
          active: false
        },
        {
          title: this.$t('general.Cruise'),
          icon: 'cruise.svg',
          background: false,
          value: 'cruise',
          disabled: false,
          href: '/cruise',
          active: false
        },
        {
          title: this.$t('general.EatForStay'),
          description: this.$t('general.EatForStayDescription'),
          value: 'eatforstay',
          icon: 'eat-for-stay.svg',
          background: false,
          disabled: false,
          href: 'https://www.holiday-unlimited.net/fireflies',
          active: false
        },
        {
          title: this.$t('general.SportsAndTickets'),
          icon: 'sports.svg',
          background: false,
          value: 'sports',
          disabled: false,
          href: '/sports',
          active: false
        }
      ]
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
      /*
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
      */
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
      if (service.href !== false) {
        window.location.href = service.href
      } else {
        this.$store.commit('general/setMainActiveService', service.value)
        if (window.screen.width < 720) {
          this.$scrollTo('#forms')
        } else {
          this.$scrollTo('#__nuxt')
        }
      }
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
.service-background {
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  filter: grayscale(0.5);
  z-index: 0;
}

.service-background:after {
  background-color: #005257;
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.6;
  z-index: 1;
}

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
