<template>
  <div class="flex flex-wrap w-full transition-opacity duration-500">
    <div :class="show ? 'show' : 'hidden'" class="w-full">
      <div
        class="w-full text-pink mb-16 px-16 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="font-bold text-base leading-16">
          <i class="fad fa-suitcase mr-4 mb-4"></i>{{ travelAssistant.title }}
        </div>
        <div class="text-xs leading-12">
          {{ travelAssistant.destination.name }},
          {{ travelAssistant.checkin | formatDateDisplay }} -
          {{ travelAssistant.checkout | formatDateDisplay }},
          {{ getGuestText() }}
        </div>
      </div>
      <div class="flex flex-wrap w-full px-16 xl:px-40 max-w-screen-xl mx-auto">
        <TravelAssistantServiceItem
          v-if="
            travelAssistant.hotel !== null && travelAssistant.hotel !== false
          "
          :type="'hotel'"
          :logo="HotelImg"
          :name="$t('general.Hotel')"
          :currency="currency"
          :min-price="getPrice('hotel', 'min')"
          :current-price="getPrice('hotel', 'current')"
          :max-price="getPrice('hotel', 'max')"
          :price-watch="getPriceWatch('hotel')"
          :editable="true"
          :updating="travelAssistant.status !== 'FINISHED'"
          :trip-type="travelAssistant.hotel.tripType"
          :deletable="
            travelAssistant.status === 'FINISHED' && getCountService > 1
          "
          :search-id="
            travelAssistant.hotel.search_id !== undefined
              ? travelAssistant.hotel.search_id
              : ''
          "
          :class="'mb-16'"
          @goToList="goToSearchList('hotel')"
          @removeTravelAssistantService="showDeleteServiceAlert('hotel')"
        />
        <TravelAssistantServiceItem
          v-if="
            travelAssistant.flight !== null &&
              travelAssistant.flight !== false &&
              false
          "
          :type="'flight'"
          :logo="FlightImg"
          :name="''"
          :from="travelAssistant.flight.fromSearch.text"
          :short-from="getIATACode(travelAssistant.flight.fromSearch.text)"
          :to="travelAssistant.flight.toSearch.text"
          :short-to="getIATACode(travelAssistant.flight.toSearch.text)"
          :stars="0"
          :currency="currency"
          :min-price="getPrice('flight', 'min')"
          :current-price="getPrice('flight', 'current')"
          :max-price="getPrice('flight', 'max')"
          :price-watch="getPriceWatch('flight')"
          :editable="true"
          :updating="travelAssistant.status !== 'FINISHED'"
          :trip-type="travelAssistant.flight.tripType"
          :deletable="
            travelAssistant.status === 'FINISHED' && getCountService > 1
          "
          :class="'mb-16'"
          :search-id="
            travelAssistant.flight.search_id !== undefined
              ? travelAssistant.flight.search_id
              : ''
          "
          @goToList="goToSearchList('flight')"
          @removeTravelAssistantService="showDeleteServiceAlert('flight')"
        ></TravelAssistantServiceItem>
        <TravelAssistantServiceItem
          v-if="
            travelAssistant.carRent !== null &&
              travelAssistant.carRent !== false
          "
          :type="'carRent'"
          :logo="CarRentImg"
          :name="''"
          :from="travelAssistant.carRent.fromSearch.text"
          :short-from="
            travelAssistant.carRent.differentLocation
              ? getIATACode(travelAssistant.carRent.fromSearch.text)
              : null
          "
          :to="
            travelAssistant.carRent.differentLocation
              ? travelAssistant.carRent.toSearch.text
              : null
          "
          :short-to="
            travelAssistant.carRent.differentLocation
              ? getIATACode(travelAssistant.carRent.toSearch.text)
              : null
          "
          :stars="0"
          :currency="currency"
          :min-price="getPrice('carRent', 'min')"
          :current-price="getPrice('carRent', 'current')"
          :max-price="getPrice('carRent', 'max')"
          :price-watch="getPriceWatch('carRent')"
          :editable="true"
          :updating="travelAssistant.status !== 'FINISHED'"
          :trip-type="travelAssistant.carRent.differentLocation ? '1' : '0'"
          :deletable="
            travelAssistant.status === 'FINISHED' && getCountService > 1
          "
          :class="'mb-16'"
          :search-id="
            travelAssistant.carRent.search_id !== undefined
              ? travelAssistant.carRent.search_id
              : ''
          "
          @goToList="goToSearchList('carRent')"
          @removeTravelAssistantService="showDeleteServiceAlert('carRent')"
        />
        <div
          v-show="
            travelAssistant.hotel === null ||
              travelAssistant.flight === null ||
              travelAssistant.carRent === null
          "
          class="h-56 service flex-1 font-bold text-white leading-14 text-pink hover:text-pink-dark md:even:pl-8"
        >
          <ButtonMedium
            type="inverted-transparent"
            :is-disabled="travelAssistant.status !== 'FINISHED'"
            :class="[
              'w-full h-56 lg:text-sm',
              !serviceModalActive
                ? 'hover:border-primary-dark hover:text-primary-dark hover:bg-primary-opaque active:bg-white active:text-primary-light active:border-primary-light active:no-underline focus:outline-none focus:bg-white focus:border-black focus:text-black focus:no-underline'
                : 'focus:no-underline'
            ]"
            @click="
              travelAssistant.status === 'FINISHED'
                ? (serviceModalActive = true)
                : (serviceModalActive = false)
            "
            ><i class="fas fa-plus mr-4"></i
            >{{ $t('general.NewTravelAssistantService') }}</ButtonMedium
          >
        </div>
      </div>
      <div
        class="border-t border-white opacity-10 my-16 md:mt-0 xl:h-1 xl:w-full xl:left-0 xl:mx-0"
      ></div>
      <div
        class="flex flex-wrap text-sm xl:mt-16 px-16 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="flex flex-wrap w-full sm:w-1/2">
          <div class="text-pink w-full md:w-3/5 lg:w-auto lg:mr-16">
            {{ $t('general.LastSearch') }}:
            {{ travelAssistant.modified_at | formatDateDisplay }}
          </div>
          <div
            class="w-full text-primary mt-8 font-bold md:w-2/5 md:mt-0 cursor-pointer"
            @click="refreshTravelAssistants()"
          >
            <i
              class="fas fa-sync"
              :class="travelAssistant.status !== 'FINISHED' ? 'fa-spin' : ''"
            ></i>
            {{ $t('general.UpdateOffers') }}
          </div>
        </div>
        <div class="flex w-full font-bold sm:w-1/2">
          <div
            v-show="travelAssistant.status === 'FINISHED'"
            class="flex mt-12 w-full md:mt-0 sm:flex-row-reverse"
          >
            <div
              class="w-1/2 text-primary mr-16 sm:w-auto sm:order-1"
              @click="$emit('showTravelAssistant')"
            >
              <nuxt-link
                :to="localePath('/travel-assistant/' + travelAssistant.id)"
              >
                <i class="fas fa-pencil"></i>
                {{ $t('general.Edit') }}
              </nuxt-link>
            </div>
            <div
              class="w-1/2 text-danger text-right sm:w-auto sm:order-0 cursor-pointer"
              @click="deleteItemModalActive = true"
            >
              <i class="fas fa-times"></i>
              {{ $t('general.Delete') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ServiceModal
      v-if="
        (travelAssistant.hotel === null ||
          travelAssistant.flight === null ||
          travelAssistant.carRent === null) &&
          serviceModalActive
      "
      :show-modal="serviceModalActive"
      :hotel-data="
        travelAssistant.hotel === null ? false : travelAssistant.hotel
      "
      :flight-data="
        travelAssistant.flight === null ? false : travelAssistant.flight
      "
      :car-rent-data="
        travelAssistant.carRent === null ? false : travelAssistant.carRent
      "
      @addService="addService"
      @close="serviceModalActive = false"
    />
    <DecisionModal
      v-if="deleteItemModalActive"
      :accept-button="$t('general.Delete')"
      :cancel-button="$t('general.Cancel')"
      @close="deleteItemModalActive = false"
      @cancel="deleteItemModalActive = false"
      @accept="removeTravelAssistant"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('general.DeleteTravelAssistant') }}
          </div>
        </div>
        <div class="flex text-sm leading-20 mt-12 mb-12">
          {{ getDeleteAlertContent }}
        </div>
      </div>
    </DecisionModal>

    <DecisionModal
      v-if="deleteServiceItemModalActive"
      :accept-button="$t('general.Delete')"
      :cancel-button="$t('general.Cancel')"
      @close="deleteServiceItemModalActive = false"
      @cancel="deleteServiceItemModalActive = false"
      @accept="removeTravelAssistantService"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('general.DeleteTravelAssistantService') }}
          </div>
        </div>
        <div class="flex text-sm leading-20 mt-12 mb-12">
          {{ getDeleteServiceAlertContent }}
        </div>
      </div>
    </DecisionModal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TravelAssistantServiceItem from '@/components/travel-assistant/TravelAssistantServiceItem'
import ServiceModal from '@/components/travel-assistant/ServiceModal'
import CarRentImg from '@/assets/images/yellow-turq/travel-services/car-rental/car-rental-60.svg'
import FlightImg from '@/assets/images/yellow-turq/travel-services/flight/flight-60.svg'
import HotelImg from '@/assets/images/yellow-turq/travel-services/hotel/hotel-60.svg'
import DecisionModal from '@/components/modal/DecisionModal'
import ButtonMedium from '@/components/micro/ButtonMedium'
import { getGuestText } from '@/includes/utils'
export default {
  name: 'TravelAssistantItem',
  components: {
    TravelAssistantServiceItem,
    ButtonMedium,
    ServiceModal,
    DecisionModal
  },
  props: {
    travelAssistant: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    updating: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      serviceModalActive: false,
      deleteItemModalActive: false,
      deleteServiceItemModalActive: false,
      deleteServiceType: false,
      CarRentImg,
      FlightImg,
      HotelImg
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    getDeleteAlertContent() {
      return this.$t('general.DeleteTravelAssistantAlert').replace(
        '{{name}}',
        this.travelAssistant.title
      )
    },
    getDeleteServiceAlertContent() {
      const message = this.$t('general.DeleteTravelAssistantServiceAlert')
      return message.replace('{{name}}', this.travelAssistant.title)
    },
    currency() {
      return this.getCurrency
    },
    getCountService() {
      let countItem = 0
      countItem +=
        this.travelAssistant.hotel !== null &&
        this.travelAssistant.hotel !== false
          ? 1
          : 0
      countItem +=
        this.travelAssistant.flight !== null &&
        this.travelAssistant.flight !== false
          ? 1
          : 0
      countItem +=
        this.travelAssistant.carRent !== null &&
        this.travelAssistant.carRent !== false
          ? 1
          : 0
      return countItem
    }
  },
  mounted() {
    this.serviceModalActive = false
    this.deleteItemModalActive = false
    this.deleteServiceItemModalActive = false
  },
  methods: {
    ...mapActions('travel-assistant', ['deleteService', 'postServiceSave']),
    async removeTravelAssistantService() {
      if (this.deleteServiceType !== false) {
        const res = await this.deleteService({
          travelAssistantId: this.travelAssistant.id,
          serviceType: this.deleteServiceType
        })
        if (res.status === true) {
          this.deleteServiceItemModalActive = false
          this.deleteServiceType = false
          this.$eventBus.publish('updateTravelAssistant')
        }
      }
    },
    async addService(service) {
      const params = { travelAssistantId: parseInt(this.travelAssistant.id) }
      if (service.hotel !== undefined) {
        params.hotel = service.hotel
      }
      if (service.flight !== undefined) {
        params.flight = service.flight
      }
      if (service.carRent !== undefined) {
        params.carRent = service.carRent
      }
      let res = false
      try {
        res = await this.postServiceSave(params)
      } catch (e) {
        this.password = ''
        const body = await e.response.json()
        if (body.messages !== undefined) {
          this.$store.dispatch('general/showSnackbar', {
            message: body.messages
          })
        }
      }
      if (
        parseInt(res.travelAssistantId) === parseInt(this.travelAssistant.id)
      ) {
        this.$eventBus.publish('updateTravelAssistant')
        this.serviceModalActive = false
      }
    },
    removeTravelAssistant() {
      this.deleteItemModalActive = false
      this.$emit('removeTravelAssistant', {
        id: parseInt(this.travelAssistant.id),
        title: this.travelAssistant.title
      })
    },
    getGuestText() {
      return getGuestText(
        this.travelAssistant.guests.adults,
        this.travelAssistant.guests.children
      )
    },
    getIATACode(destination) {
      if (destination.length > 0) {
        const destinationArray = destination.match(/\((.*)\)/)
        return destinationArray[1]
      } else {
        return destination
      }
    },
    async refreshTravelAssistants() {
      if (this.travelAssistant.status === 'FINISHED') {
        let update = false
        try {
          update = await this.$store.dispatch('travel-assistant/update', {
            id: parseInt(this.travelAssistant.id)
          })
        } catch (e) {
          const body = await e.response.json()
          if (body.messages !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: body.messages
            })
          }
        }
        if (update.status) {
          this.$eventBus.publish('updateTravelAssistant', {
            travelAssistantId: this.travelAssistant.id
          })
        }
      }
    },
    goToSearchList(type) {
      if (this.travelAssistant.status === 'FINISHED') {
        if (
          type === 'hotel' &&
          this.travelAssistant.hotel.search_id !== undefined &&
          this.travelAssistant.hotel.search_id !== ''
        ) {
          this.$router.push(
            this.localePath(
              '/hotel/search/' + this.travelAssistant.hotel.search_id
            )
          )
          this.$emit('showTravelAssistant')
        } else if (
          type === 'flight' &&
          this.travelAssistant.flight.search_id !== undefined &&
          this.travelAssistant.flight.search_id !== ''
        ) {
          this.$router.push(
            this.localePath(
              '/flight/search/' + this.travelAssistant.flight.search_id
            )
          )
          this.$emit('showTravelAssistant')
        } else if (
          type === 'carRent' &&
          this.travelAssistant.carRent.search_id !== undefined &&
          this.travelAssistant.carRent.search_id !== ''
        ) {
          this.$router.push(
            this.localePath(
              '/car-rental/search/' + this.travelAssistant.carRent.search_id
            )
          )
          this.$emit('showTravelAssistant')
        }
      }
    },
    showDeleteServiceAlert(type) {
      this.deleteServiceItemModalActive = true
      this.deleteServiceType = type
    },
    getPrice(service, type) {
      return this.travelAssistant[service].result !== null
        ? Math.ceil(this.travelAssistant[service].result[type][this.currency])
        : false
    },
    getPriceWatch(service) {
      return this.travelAssistant[service].result !== null
        ? parseFloat(
            this.travelAssistant[service].result.current[this.currency]
          ) <
          parseFloat(
            this.travelAssistant[service].result.previous[this.currency]
          )
          ? 'decrease'
          : parseFloat(
              this.travelAssistant[service].result.current[this.currency]
            ) >
            parseFloat(
              this.travelAssistant[service].result.previous[this.currency]
            )
          ? 'increase'
          : ''
        : ''
    }
  }
}
</script>
