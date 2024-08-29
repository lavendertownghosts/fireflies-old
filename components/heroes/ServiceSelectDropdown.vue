<template>
  <div>
    <div
      class="link-dark text-center font-bold text-sm leading-14 cursor-pointer"
      :class="[
        isDark ? 'link-dark' : 'link-danger',
        !showAlways ? 'mt-12' : 'mt-0'
      ]"
      @mouseover="active = true"
    >
      <slot />
    </div>
    <div v-if="showAlways" class="">
      <div
        class="rounded text-black flex flex-row text-base leading-16 justify-center"
      >
        <div class="flex flex-grow bg-white xl:px-20 opacity-75" />
        <div class="flex flex-row w-full max-w-services mx-auto">
          <div class="flex flex-row w-full">
            <div
              v-for="(service, key) in serviceList"
              :key="key"
              class="flex flex-col items-center py-12 md:py-16 w-1/7"
              :class="[
                service.value === activeService
                  ? 'bg-black bg-opacity-60'
                  : hover === service.value && isActiveService(service.value)
                  ? 'bg-white bg-opacity-90'
                  : 'bg-white bg-opacity-75',
                isActiveService(service.value) ? 'cursor-pointer' : '',
                service.value === 'comingsoon' ? 'comingsoon' : ''
              ]"
              @click="changeService(service.value)"
              @mouseover="hover = service.value"
              @mouseleave="hover = false"
            >
              <div v-show="isActiveService(service.value)">
                <img
                  v-if="service.value !== 'comingsoon'"
                  class="mx-auto h-32 md:h-60"
                  :src="
                    serviceImages[
                      service.value +
                        (service.value === activeService ? 'Active' : '')
                    ]
                  "
                />
                <div
                  v-else
                  class="text-center pt-64 text-sm leading-14 font-bold md:h-114 flex items-center"
                >
                  {{ service.title }}
                </div>
              </div>
              <div
                v-if="service.value !== 'comingsoon'"
                v-show="isActiveService(service.value)"
                :class="service.value === activeService ? 'text-white' : ''"
                class="text-center mt-8 hidden lg:block"
              >
                <h3
                  :class="hover === service.value ? 'underline' : ''"
                  class="text-sm leading-14 font-bold"
                >
                  {{ service.title }}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-grow bg-white xl:px-20 opacity-75" />
      </div>
      <div class="lg:hidden px-16 bg-black bg-opacity-60">
        <div class="text-lg leading-24 pt-16">
          {{
            activeServiceObject !== undefined ? activeServiceObject.title : ''
          }}
        </div>
        <div class="text-xs leading-12">
          {{
            activeServiceObject !== undefined
              ? activeServiceObject.description
              : ''
          }}
        </div>
      </div>
    </div>
    <div v-else v-show="active" class="relative hidden md:block">
      <div
        class="absolute right-0 right-0 top-4 bg-white rounded text-black shadow-drop flex flex-row text-base leading-16 z-40"
      >
        <div class="flex flex-col lg:flex-row w-full">
          <div class="flex flex-row w-full lg:w-3/5">
            <div
              v-for="(service, key) in serviceList.slice(0, 3)"
              :key="key"
              class="flex flex-col items-center p-16 w-1/3"
              :class="{
                'cursor-pointer hover:bg-primary-opaque': isActiveService(
                  service.value
                )
              }"
              @click="changeService(service.value)"
            >
              <div v-show="isActiveService(service.value)">
                <img class="mx-auto" :src="serviceImages[service.value]" />
              </div>
              <div
                v-show="isActiveService(service.value)"
                class="text-center mt-8"
              >
                <h3 class="text-sm leading-14 font-bold">
                  {{ service.title }}
                </h3>
                <p class="text-xs leading-12 mt-4">{{ service.description }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-row w-full lg:w-2/5">
            <div
              v-for="(service, key) in serviceList.slice(3, 5)"
              :key="key"
              class="flex flex-col items-center p-16 w-1/2"
              :class="{
                'cursor-pointer hover:bg-primary-opaque': isActiveService(
                  service.value
                )
              }"
              @click="changeService(service.value)"
            >
              <div v-show="isActiveService(service.value)">
                <img class="mx-auto" :src="serviceImages[service.value]" />
              </div>
              <div
                v-show="isActiveService(service.value)"
                class="text-center mt-8"
              >
                <h3 class="text-sm leading-14 font-bold">
                  {{ service.title }}
                </h3>
                <p class="text-xs leading-12 mt-4">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DefaultModal v-show="active" :is-full-page="true" class="md:hidden">
      <div slot="header">
        <div class="flex w-full text-black py-20 px-16">
          <div class="flex items-center">
            <i
              class="fa fa-chevron-left text-sm leading-14 text-primary cursor-pointer mr-16"
              @click="active = false"
            ></i>
          </div>
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('general.OtherServices') }}
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full"></div>
      </div>
      <div slot="body">
        <div class="flex flex-wrap mt-64">
          <div
            v-for="(service, key) in serviceList"
            :key="key"
            class="w-1/2 flex flex-col mt-32"
            @click="changeService(service.value)"
          >
            <div>
              <img class="mx-auto" :src="serviceImages[service.value]" />
            </div>
            <div class="text-center mt-8 text-black">
              <h3 class="text-sm leading-14 font-bold">
                {{ service.title }}
              </h3>
              <p class="text-xs leading-12 mt-4">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
  </div>
</template>

<script>
import DefaultModal from '@/components/modal/DefaultModal'
import hotelImage from '@/assets/images/black-turq/travel-services/hotel/hotel-60.svg'
import hotelActiveImage from '@/assets/images/white-turq/travel-services/hotel/hotel-60.svg'
import flightImage from '@/assets/images/black-turq/travel-services/flight/flight-60.svg'
import flightActiveImage from '@/assets/images/white-turq/travel-services/flight/flight-60.svg'
import carRentalImage from '@/assets/images/black-turq/travel-services/car-rental/car-rental-60.svg'
import carRentalActiveImage from '@/assets/images/white-turq/travel-services/car-rental/car-rental-60.svg'
import transferImage from '@/assets/images/black-turq/travel-services/transfer/transfer-60.svg'
import transferActiveImage from '@/assets/images/white-turq/travel-services/transfer/transfer-60.svg'
import programImage from '@/assets/images/black-turq/travel-services/program/program-60.svg'
import programActiveImage from '@/assets/images/white-turq/travel-services/program/program-60.svg'
import roundTripImage from '@/assets/images/black-turq/travel-services/round-trip/round-trip-60.svg'
import roundTripActiveImage from '@/assets/images/white-turq/travel-services/round-trip/round-trip-60.svg'
import ApartmentsImage from '@/assets/images/black-turq/travel-services/apartments/apartments-60.svg'
import ApartmentsActiveImage from '@/assets/images/white-turq/travel-services/apartments/apartments-60.svg'
import EatforstayImage from '@/assets/images/white-turq/travel-services/eatforstay/eat-for-stay-60.svg'
import sportsImage from '@/assets/images/white-turq/travel-services/sports/sports-60.svg'
import cruiseImage from '@/assets/images/white-turq/travel-services/cruise/cruise.png'

export default {
  name: 'ServiceSelectDropdown',
  components: {
    DefaultModal
  },
  props: {
    isDark: {
      type: Boolean,
      default: true
    },
    showAlways: {
      type: Boolean,
      default: false
    },
    activeService: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: false,
      hover: false,
      innerWidth: 0,
      serviceList: [
        {
          title: this.$t('general.Hotels'),
          description: this.$t('general.HotelCount'),
          value: 'hotel'
        },
        {
          title: this.$t('general.FlightTicket'),
          description: this.$t('general.FlightAirlines'),
          value: 'flight'
        },
        {
          title: this.$t('general.RoundTrip'),
          description: this.$t('general.ThousandsOfOptions'),
          value: 'roundTrip'
        },
        {
          title: this.$t('general.Transfer'),
          description: this.$t('general.TransferCountryAndPartners'),
          value: 'transfer'
        },
        {
          title: this.$t('general.Apartments'),
          description: this.$t('general.ApartmentsCountCountry'),
          value: 'apartments'
        },
        {
          title: this.$t('general.EatForStay'),
          description: this.$t('general.EatForStayDescription'),
          value: 'eatforstay'
        },
        {
          title: this.$t('general.Programs'),
          description: this.$t('general.ProgramCountCountry'),
          value: 'program'
        },
        {
          title: this.$t('general.CarRental'),
          description: this.$t('general.CarRentalCountryAndPartner'),
          value: 'carRental'
        },
        {
          title: this.$t('general.SportsAndTickets'),
          description: '',
          value: 'sports'
        },
        {
          title: this.$t('general.Cruise'),
          description: '',
          value: 'cruise'
        }
      ],
      serviceImages: {
        hotel: hotelImage,
        hotelActive: hotelActiveImage,
        flight: flightImage,
        flightActive: flightActiveImage,
        carRental: carRentalImage,
        carRentalActive: carRentalActiveImage,
        transfer: transferImage,
        transferActive: transferActiveImage,
        program: programImage,
        programActive: programActiveImage,
        roundTrip: roundTripImage,
        roundTripActive: roundTripActiveImage,
        apartments: ApartmentsImage,
        apartmentsActive: ApartmentsActiveImage,
        eatforstay: EatforstayImage,
        eatforstayActive: EatforstayImage,
        sports: sportsImage,
        sportsActive: sportsImage,
        cruise: cruiseImage,
        cruiseActive: cruiseImage
      },
      activeServiceObject: {}
    }
  },
  computed: {},
  mounted() {
    document.addEventListener('mouseover', this.onDocumentMouseUp)
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
    this.activeServiceObject = this.serviceList.find(
      (o) => o.value === this.activeService
    )
  },
  beforeDestroy() {
    document.removeEventListener('mouseover', this.onDocumentMouseUp)
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    onDocumentMouseUp(e) {
      const isChild = this.$el.contains(e.target)

      if (!isChild) {
        this.active = false
      }
    },
    changeService(service) {
      if (service === 'flight') {
        this.$router.push(this.localePath('/flight'))
        return
      }

      if (service === 'transfer') {
        window.location.href = this.localePath('/transfer')
        return
      }

      if (service === 'cruise') {
        window.location.href = this.localePath('/cruise')
        return
      }

      if (service === 'apartments') {
        window.location.href = this.localePath('/apartments')
        return
      }

      if (service === 'eatforstay') {
        window.open('https://www.holiday-unlimited.net/fireflies', '_blank')
        return
      }

      if (service === 'sports') {
        window.location.href = this.localePath('/sports')
        return
      }

      this.$router.push(this.localePath('/'))
      if (document.body.classList.contains('fixed')) {
        document.body.classList.remove('fixed')
      }
      this.$store.commit('general/setMainActiveService', service)
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    isActiveService(service) {
      return (
        service === 'hotel' ||
        service === 'flight' ||
        service === 'roundTrip' ||
        service === 'transfer' ||
        service === 'eatforstay' ||
        service === 'apartments' ||
        service === 'program' ||
        service === 'carRental' ||
        service === 'comingsoon' ||
        service === 'sports' ||
        service === 'cruise'
      )
    }
  }
}
</script>

<style>
.top-4 {
  top: 4px;
}

.max-w-services {
  max-width: 1201px;
}

.comingsoon {
  background-color: rgba(0, 172, 181, 0.75) !important;
  color: #fff !important;
  cursor: default !important;
}
</style>
