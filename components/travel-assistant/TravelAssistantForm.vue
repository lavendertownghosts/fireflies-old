<template>
  <div>
    <div class="bg-primary-gradient h-1"></div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto z-10 bg-white">
      <div class="w-full text-left mt-8">
        <div
          class="link leading-14 font-bold cursor-pointer"
          @click="$router.back()"
        >
          <i class="fas fa-chevron-left mr-4"></i>{{ $t('general.Back') }}
        </div>
        <h1 class="text-left text-lg text-black font-bold mt-24 leading-24">
          {{
            travelAssistant === false
              ? $t('general.NewTravelAssistant')
              : $t('general.EditTravelAssistant')
          }}
        </h1>

        <div
          class="w-full mt-16 p-16 sm:pr-0 lg:pr-16 bg-pink leading-20 text-black text-sm rounded"
        >
          <div v-html="$t('general.TravelAssistantDescription')"></div>
          <div
            :class="readMore ? 'hidden' : ''"
            class="link font-bold xl:hidden"
            @click="readMore = !readMore"
          >
            {{ $t('general.ReadMore') }}
          </div>
        </div>
        <div class="width-288">
          <span
            :class="name !== '' ? 'text-black' : 'text-grey'"
            class="absolute pt-24 pl-16"
            ><i class="fad pt-8 fa-suitcase z-10"></i
          ></span>
          <InputText
            v-model="name"
            :input-style="['pl-34']"
            :label="$t('general.TravelAssistantTitle')"
            :error="nameError"
            class="mt-16"
          />
        </div>
        <div class="flex flex-col lg:flex-row mt-16 lg:w-4/5">
          <InputHotelNamesearch
            v-model="destination"
            :label="$t('general.Destination')"
            :error="destinationSearchError"
            :component-attr-id="'ta-destination-name-search'"
          />
          <div class="flex flex-col sm:flex-row">
            <InputDateRange
              v-model="dates"
              :label-checkin="$t('general.DateFrom')"
              :label-checkout="$t('general.DateTo')"
              :input-style="['lg:border-r-0 lg:-mr-1 lg:rounded-none']"
              class="flex flex-row mt-16 sm:w-240 md:mr-8 lg:mt-0 lg:mr-0"
            />
            <InputGuests
              v-model="guests"
              :label="$t('general.Passengers')"
              :input-style="['lg:rounded-none']"
              class="w-full mt-16 sm:ml-8 sm:w-177 lg:mt-0 lg:ml-0"
            />
          </div>
        </div>
        <div class="mt-24 pb-24 border-b border-grey-light">
          <h2 class="text-lg text-black font-bold pt-24">
            {{ $t('general.Services') }}
          </h2>
          <span
            v-show="serviceError !== false"
            class="block text-danger text-xs leading-12"
          >
            {{ serviceError }}
          </span>
          <div
            v-if="hotel !== false"
            class="border relative border-dashed border-grey p-16 mt-16 rounded hover:border-black"
          >
            <div class="flex flex-wrap h-32">
              <div class="flex w-32 h-full">
                <img class="h-full w-full" :src="inactiveHotelImg" />
              </div>
              <div class="flex h-full text-lg text-black items-center pl-12">
                <span>{{ $t('general.Hotel') }}</span>
              </div>
            </div>
            <HotelForm
              :data="hotel"
              :show-buttons="false"
              @addHotel="hotel = $event"
            />
            <div
              class="absolute delete-service text-black bg-white cursor-pointer hover:text-danger"
            >
              <i
                class="fas fa-times-circle"
                @click="deleteService('hotel')"
              ></i>
            </div>
          </div>

          <div
            v-if="flight !== false"
            class="border relative border-dashed border-grey p-16 mt-16 rounded hover:border-black"
          >
            <div class="flex flex-wrap h-32">
              <div class="flex w-32 h-full">
                <img class="h-full w-full" :src="inactiveFlightImg" />
              </div>
              <div class="flex h-full text-lg text-black items-center pl-12">
                <span>{{ $t('general.FlightTicket') }}</span>
              </div>
            </div>
            <FlightForm
              :data="flight"
              :show-buttons="false"
              @addFlight="flight = $event"
            />
            <div
              class="absolute delete-service text-black bg-white cursor-pointer hover:text-danger"
            >
              <i
                class="fas fa-times-circle"
                @click="deleteService('flight')"
              ></i>
            </div>
          </div>
          <div
            v-if="carRent !== false"
            class="border relative border-dashed border-grey p-16 mt-16 rounded hover:border-black"
          >
            <div class="flex flex-wrap h-32">
              <div class="flex w-32 h-full">
                <img class="h-full w-full" :src="inactiveCarRentImg" />
              </div>
              <div class="flex h-full text-lg text-black items-center pl-12">
                <span>{{ $t('general.CarRental') }}</span>
              </div>
            </div>
            <CarRentForm
              :data="carRent"
              :show-buttons="false"
              @addCarRent="carRent = $event"
            />
            <div
              class="absolute delete-service text-black bg-white cursor-pointer hover:text-danger"
            >
              <i
                class="fas fa-times-circle"
                @click="deleteService('carRent')"
              ></i>
            </div>
          </div>

          <div
            class="flex w-full h-full mt-16"
            @click="travelAssistantFormModal = true"
          >
            <ButtonSmall
              type="inverted-transparent"
              :class="[
                'w-full md:h-56 lg:h-40 lg:text-sm',
                travelAssistantFormModal
                  ? 'focus:bg-white focus:text-primary focus:border-primary focus:no-underline'
                  : ''
              ]"
              :is-disabled="!showAddServiceButton"
            >
              <i class="fas fa-plus mr-4"></i
              >{{ $t('general.NewTravelAssistantService') }}
            </ButtonSmall>
          </div>
        </div>
        <div class="mt-24 mb-24">
          <div class="pb-24">
            <ButtonSmall
              type="primary"
              class="inline-block"
              :is-loading="isLoading"
              @click="saveTravelAssistant"
            >
              {{
                travelAssistant !== false && travelAssistant.id > 0
                  ? $t('general.EditTravelAssistant')
                  : $t('general.SaveNewTravelAssistant')
              }}
            </ButtonSmall>
            <button
              class="link font-bold ml-20 inline-block text-sm"
              @click="$router.back()"
            >
              {{ $t('general.Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <ServiceModal
      :show-modal="travelAssistantFormModal"
      :hotel-data="hotel"
      :flight-data="flight"
      :car-rent-data="carRent"
      @close="travelAssistantFormModal = false"
      @addService="addService"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import inactiveCarRentImg from '@/assets/images/black-turq/travel-services/car-rental/car-rental-60.svg'
import inactiveFlightImg from '@/assets/images/black-turq/travel-services/flight/flight-60.svg'
import inactiveHotelImg from '@/assets/images/black-turq/travel-services/hotel/hotel-60.svg'
import { getDayAfterTomorrow, getTomorrow } from '@/includes/utils'
import InputText from '@/components/micro/InputText'
import HotelForm from '@/components/travel-assistant/HotelForm'
import FlightForm from '@/components/travel-assistant/FlightForm'
import CarRentForm from '@/components/travel-assistant/CarRentForm'
import ButtonSmall from '@/components/micro/ButtonSmall'
import ServiceModal from '@/components/travel-assistant/ServiceModal'
import InputHotelNamesearch from '@/components/micro/InputHotelNamesearch'
import InputDateRange from '@/components/micro/InputDateRange'
import InputGuests from '@/components/micro/InputGuests'
export default {
  name: 'TravelAssistantForm',
  components: {
    InputGuests,
    InputDateRange,
    InputHotelNamesearch,
    InputText,
    HotelForm,
    FlightForm,
    CarRentForm,
    ButtonSmall,
    ServiceModal
  },
  props: {
    travelAssistant: {
      type: [Boolean, Object],
      default: false
    }
  },
  data() {
    return {
      travelAssistantFormModal: false,
      currentTravelAssistant: this.travelAssistant.travelAssistant,
      readMore: false,
      dates: {
        date1: getTomorrow(),
        date2: getDayAfterTomorrow()
      },
      destinationSearchError: false,
      name: '',
      nameError: '',
      guests: {
        adults: 2,
        children: 0,
        childrenAges: []
      },
      destination: {
        text: '',
        id: false,
        type: ''
      },
      hotel: false,
      flight: false,
      carRent: false,
      serviceError: false,
      isLoading: false,
      inactiveCarRentImg,
      inactiveFlightImg,
      inactiveHotelImg
    }
  },
  computed: {
    showAddServiceButton() {
      return (
        this.flight === false || this.hotel === false || this.carRent === false
      )
    }
  },
  watch: {
    hotel: {
      handler(newValue) {
        this.hotel = newValue
      }
    },
    travelAssistant: {
      handler() {
        this.processInit()
      }
    }
  },
  mounted() {
    this.processInit()
  },
  methods: {
    ...mapActions('travel-assistant', ['postSave']),
    deleteService(type) {
      if (type === 'hotel') {
        this.hotel = false
      } else if (type === 'flight') {
        this.flight = false
      } else if (type === 'carRent') {
        this.carRent = false
      }
    },

    async saveTravelAssistant() {
      let formError = false
      this.isLoading = true
      this.nameError = ''
      this.destinationSearchError = false
      this.serviceError = false
      if (this.name === '') {
        this.nameError = this.$t('general.NameSearchErrorMsg')
        formError = true
      }
      if (!this.destination.id) {
        this.destinationSearchError = this.$t('general.NameSearchErrorMsg')
        formError = true
      }
      if (
        this.hotel === false &&
        this.flight === false &&
        this.carRent === false
      ) {
        this.serviceError = this.$t('general.TravelAssistantServiceError')
        formError = true
      }
      if (formError) {
        this.isLoading = false
        return
      }
      try {
        const params = {
          title: this.name,
          destination: {
            id: this.destination.id,
            type: this.destination.type,
            name: this.destination.text
          },
          checkin: this.dates.date1,
          checkout: this.dates.date2,
          guests: this.guests,
          hotel: this.hotel,
          flight: this.flight,
          carRent: this.carRent
        }
        if (this.travelAssistant !== false && this.travelAssistant.id > 0) {
          params.id = this.travelAssistant.id
        }
        await this.postSave(params)
        let saveSuccess = this.$t('general.TravelAssistantSaveSuccess')
        if (params.id !== undefined) {
          saveSuccess = this.$t('general.TravelAssistantEditSuccess')
        }
        this.$eventBus.publish('updateTravelAssistant')
        this.$router.back()
        this.$store.dispatch('general/showSnackbar', {
          message: saveSuccess.replace('%name%', params.title)
        })
      } catch (e) {
        console.log(e)
      }
    },
    addService(service) {
      if (service.hotel !== undefined) {
        this.hotel = service.hotel
      }
      if (service.flight !== undefined) {
        this.flight = service.flight
      }
      if (service.carRent !== undefined) {
        this.carRent = service.carRent
      }
      this.travelAssistantFormModal = false
    },
    processInit() {
      if (this.travelAssistant !== false) {
        this.destination = JSON.parse(this.travelAssistant.destination)
        this.destination.text = this.destination.name
        this.guests = JSON.parse(this.travelAssistant.guests)
        this.name = this.travelAssistant.title
        this.dates.date1 = this.travelAssistant.checkin
        this.dates.date2 = this.travelAssistant.checkout
        if (this.travelAssistant.hotel !== false) {
          this.hotel = this.travelAssistant.hotel
        }
        if (this.travelAssistant.flight !== false) {
          this.flight = this.travelAssistant.flight
        }
        if (this.travelAssistant.carRent !== false) {
          this.carRent = this.travelAssistant.carRent
        }
      }
    }
  }
}
</script>

<style scoped>
.delete-service {
  top: -12px;
  right: -8px;
}

.width-288 {
  width: 288px;
}
@media (min-width: 520px) {
  .date-width {
    width: 104px;
  }
  .travellers-width {
    width: 180px;
  }
}
</style>
