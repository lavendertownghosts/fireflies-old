<template>
  <!-- v-show -->
  <DefaultModal v-show="showModal" :overflow-y="false" @close="$emit('close')">
    <div slot="header"></div>
    <div slot="body">
      <div class="flex text-black">
        <div class="flex flex-grow text-lg font-bold leading-24">
          {{ $t('general.NewTravelAssistantService') }}
        </div>
        <div class="flex items-center">
          <i
            class="fas fa-times opacity-50 cursor-pointer"
            @click="$emit('close')"
          ></i>
        </div>
      </div>
      <div class="mt-16 flex text-sm leading-14">
        <div v-if="buttons.length === 1">
          <div class="flex flex-wrap h-32">
            <div class="flex w-32 h-full">
              <img class="h-full w-full" :src="buttons[0].activeImagePath" />
            </div>
            <div class="flex h-full text-lg text-black items-center pl-12">
              <span>{{ buttons[0].name }}</span>
            </div>
          </div>
        </div>
        <button
          v-for="(button, key) in buttons"
          v-else
          :key="button.id"
          :class="[
            activeBtn === button.id ? 'btn-active' : '',
            key === 0 && buttons.length === 1
              ? 'rounded-l border-l rounded-r'
              : key === 0
              ? 'rounded-l border-l'
              : key === buttons.length - 1
              ? 'rounded-r'
              : ''
          ]"
          class="flex-1 border-t border-b border-r border-primary px-10 py-4 sm:py-8 active:bg-primary active:no-underline active:text-white focus:outline-none custom-btn hover:underline hover:bg-primary-opaque hover:text-primary"
          @click="selectCategory(button.id)"
        >
          <img
            class="mx-auto h-24 w-24 sm:hidden"
            :src="
              activeBtn === button.id
                ? button.imagePath
                : button.activeImagePath
            "
          /><span class="hidden sm:block">{{ button.name }}</span>
        </button>
      </div>
      <HotelForm
        v-if="activeBtn === 1"
        :data="hotelData"
        @addHotel="addHotel"
        @close="$emit('close')"
      />
      <FlightForm
        v-if="activeBtn === 2"
        :data="flightData"
        @addFlight="addFlight"
        @close="$emit('close')"
      />
      <CarRentForm
        v-if="activeBtn === 3"
        :data="carRentData"
        @addCarRent="addCarRent"
        @close="$emit('close')"
      />
      <ProgramForm v-if="activeBtn === 4" :data="currentProgramData" />
    </div>
    <div slot="footer"></div>
  </DefaultModal>
</template>
<script>
import DefaultModal from '@/components/modal/DefaultModal'
import HotelForm from '@/components/travel-assistant/HotelForm'
import FlightForm from '@/components/travel-assistant/FlightForm'
import ProgramForm from '@/components/travel-assistant/ProgramForm'
import inactiveCarRentImg from '@/assets/images/black-turq/travel-services/car-rental/car-rental-32.svg'
import activeCarRentImg from '@/assets/images/black-yellow/travel-services/car-rental/car-rental-32.svg'
import inactiveFlightImg from '@/assets/images/black-turq/travel-services/flight/flight-32.svg'
import activeFlightImg from '@/assets/images/black-yellow/travel-services/flight/flight-32.svg'
import inactiveHotelImg from '@/assets/images/black-turq/travel-services/hotel/hotel-32.svg'
import activeHotelImg from '@/assets/images/black-yellow/travel-services/hotel/hotel-32.svg'
import CarRentForm from '@/components/travel-assistant/CarRentForm'
export default {
  name: 'ServiceModal',
  components: {
    CarRentForm,
    DefaultModal,
    HotelForm,
    FlightForm,
    ProgramForm
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    hotelData: {
      type: [Object, Boolean],
      default: false
    },
    flightData: {
      type: [Object, Boolean],
      default: false
    },
    carRentData: {
      type: [Object, Boolean],
      default: false
    },
    programData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeBtn: null,
      buttons: [],
      currentTransferData: {},
      currentProgramData: {},
      inactiveCarRentImg,
      inactiveFlightImg,
      inactiveHotelImg,
      activeHotelImg,
      activeFlightImg,
      activeCarRentImg
    }
  },
  watch: {
    hotelData: {
      handler(newValue) {
        this.initialButtons()
      }
    },
    flightData: {
      handler(newValue) {
        this.initialButtons()
      }
    },
    carRentData: {
      handler(newValue) {
        this.initialButtons()
      }
    }
  },
  mounted() {
    this.initialButtons()
  },
  methods: {
    selectCategory(id) {
      this.activeBtn = id
    },
    initialButtons() {
      this.buttons = []
      this.activeBtn = null
      if (this.hotelData === false) {
        this.buttons.push({
          id: 1,
          name: this.$t('general.Hotel'),
          imagePath: this.activeHotelImg,
          activeImagePath: this.inactiveHotelImg
        })
        if (this.activeBtn === null) {
          this.activeBtn = 1
        }
      }

      // if (this.flightData === false) {
      //  this.buttons.push({
      //    id: 2,
      //    name: this.$t('general.FlightTicket'),
      //   imagePath: this.activeFlightImg,
      //    activeImagePath: this.inactiveFlightImg
      //  })
      //  if (this.activeBtn === null) {
      //    this.activeBtn = 2
      //  }
      // }
      if (this.carRentData === false) {
        this.buttons.push({
          id: 3,
          name: this.$t('general.CarRental'),
          imagePath: this.activeCarRentImg,
          activeImagePath: this.inactiveCarRentImg
        })
        if (this.activeBtn === null) {
          this.activeBtn = 3
        }
      }
    },
    addHotel(filter) {
      this.$emit('addService', { hotel: filter })
    },
    addFlight(filter) {
      this.$emit('addService', { flight: filter })
    },
    addCarRent(filter) {
      this.$emit('addService', { carRent: filter })
    }
  }
}
</script>

<style scoped>
.custom-btn:hover {
  @apply bg-primary-opaque;
  @apply underline;
}
.custom-btn.btn-active:hover {
  @apply bg-primary;
  @apply no-underline;
  @apply text-white;
}
.custom-btn {
  @apply bg-white;
  @apply text-primary;
}
.btn-active {
  @apply bg-primary;
  @apply no-underline;
  @apply text-white;
}
</style>
