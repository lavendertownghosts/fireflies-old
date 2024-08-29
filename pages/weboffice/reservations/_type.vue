<template>
  <main @click="outsideClick">
    <LoadingLayerWeboffice v-if="reservation === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Profile'),
            link: '/weboffice/personal-data'
          },
          {
            name: $t('weboffice.MyReservations'),
            link: '/weboffice/reservations/active'
          },
          {
            name: title[$route.params.type]
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ title[$route.params.type] }}
      </div>
      <div
        v-if="reservation.reservations.length > 0"
        ref="reservations"
        class="flex flex-col w-full"
      >
        <div
          v-for="(reservationTmp, key) in reservation.reservations.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
          )"
          v-show="reservationTmp.type !== 'BASKETOFFER'"
          :key="key"
          :class="
            activeReservation === reservationTmp.reservationId
              ? 'bg-grey-light bg-opacity-50 rounded'
              : 'border-b border-grey pb-16'
          "
          class="flex flex-col pt-16"
        >
          <div
            class="flex flex-row w-full px-16"
            @click="showReservationDetails(reservationTmp.reservationId)"
          >
            <div class="flex justify-center w-60 items-center flex-shrink-0">
              <img
                v-if="
                  reservationTmp.isRoundTrip
                    ? reservationTmp.isRoundTrip == true
                      ? true
                      : false
                    : false
                "
                :src="icon['ROUNDTRIP']"
              />
              <img v-else :src="getIcon(reservationTmp)" />
            </div>
            <div
              class="flex flex-col flex-grow lg:w-320 xl:w-auto justify-center ml-16"
            >
              <div class="uppercase text-primary text-base leading-16">
                {{
                  reservationTmp.type === 'TRANSFER'
                    ? reservationTmp.staticData.name
                    : reservationTmp.type === 'FLIGHT'
                    ? reservationTmp.staticData.airline
                    : reservationTmp.type === 'COUPON_OFFER'
                    ? reservationTmp.staticData.hotel
                    : reservationTmp.type === 'CARRENT'
                    ? reservationTmp.staticData.carType
                    : reservationTmp.type === 'TICKET' &&
                      reservationTmp.isRoundTrip
                    ? reservationTmp.staticData.name
                    : reservationTmp.type === 'APARTMENT'
                    ? reservationTmp.reservation_data.name
                    : reservationTmp.type === 'TICKET' &&
                      (reservationTmp.isRoundTrip === undefined ||
                        reservationTmp.isRoundTrip === false) &&
                      reservationTmp.reservation_data !== undefined
                    ? reservationTmp.reservation_data.name
                    : reservationTmp.staticData.hotelName
                }}
              </div>
              <div class="mt-4 text-sm leading-16">
                <span
                  :class="
                    reservationTmp.reservation_data !== undefined
                      ? 'uppercase text-primary text-base leading-16'
                      : ''
                  "
                >
                  {{
                    reservationTmp.type !== 'CARRENT'
                      ? getPassengers(
                          reservationTmp.passengerDatas,
                          reservationTmp.type
                        ).toLowerCase()
                      : reservationTmp.reservation_data !== undefined
                      ? reservationTmp.reservation_data.name
                      : ''
                  }} </span
                >{{
                  (reservationTmp.staticData.accomodation !== undefined
                    ? ', ' +
                      reservationTmp.staticData.accomodation.length +
                      ' ' +
                      $t('weboffice.Room')
                    : ''
                  ).toLowerCase()
                }}
              </div>
              <div
                v-if="
                  reservationTmp.type === 'TICKET' &&
                    (reservationTmp.isRoundTrip === undefined ||
                      reservationTmp.isRoundTrip === false) &&
                    reservationTmp.reservation_data !== undefined
                "
                class="mt-4 text-sm leading-16"
              >
                {{
                  reservationTmp.reservation_data.adults +
                    ' ' +
                    (reservationTmp.reservation_data.adults > 1
                      ? $t('weboffice.Adults')
                      : $t('weboffice.Adult')) +
                    (reservationTmp.reservation_data.children > 0
                      ? ', ' +
                        reservationTmp.reservation_data.children +
                        ' ' +
                        (reservationTmp.reservation_data.children > 1
                          ? $t('weboffice.Child')
                          : $t('weboffice.Children'))
                      : '')
                }}
              </div>
              <div
                v-if="
                  reservationTmp.type === 'TICKET' &&
                    reservationTmp.isRoundTrip === true
                "
                class="mt-4 text-sm leading-16"
              >
                {{
                  reservationTmp.staticData.adult +
                    ' ' +
                    (reservationTmp.staticData.adult > 1
                      ? $t('weboffice.Adults')
                      : $t('weboffice.Adult')) +
                    (reservationTmp.staticData.child > 0
                      ? ', ' +
                        reservationTmp.staticData.child +
                        ' ' +
                        (reservationTmp.staticData.child > 1
                          ? $t('weboffice.Child')
                          : $t('weboffice.Children'))
                      : '')
                }}
              </div>
              <div class="mt-4 text-sm leading-16">
                <div class="flex flex-col md:flex-row">
                  <div class="flex flex-row">
                    <div>
                      {{ formatDate(reservationTmp.from.substring(0, 10)) }}
                    </div>
                    <div class="mx-4">-</div>
                  </div>
                  <div>
                    {{ formatDate(reservationTmp.to.substring(0, 10)) }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex flex-row justify-end items-center lg:w-216 flex-shrink-1"
            >
              <div
                :class="[
                  activeReservation === reservationTmp.reservationId
                    ? 'text-black'
                    : 'link'
                ]"
                class="flex flex-row cursor-pointer"
              >
                <div class="hidden lg:flex">
                  {{ $t('weboffice.ReservationDetails') }}
                </div>
                <div class="flex items-center">
                  <i
                    :class="[
                      activeReservation === reservationTmp.reservationId
                        ? 'fa-chevron-up text-black'
                        : 'fa-chevron-down text-primary'
                    ]"
                    class="w-16 text-base ml-8 fas"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div
            :class="
              activeReservation === reservationTmp.reservationId
                ? 'h-1 bg-grey w-full mt-16'
                : ''
            "
          ></div>
          <div
            v-show="activeReservation === reservationTmp.reservationId"
            class="flex flex-col w-full px-16 lg:pl-60 py-16"
          >
            <div class="lg:pl-32 text-sm leading-14">
              <div v-if="reservationTmp.type === 'FLIGHT'">
                <div class="font-bold mt-8">
                  {{
                    $t('weboffice.Way') +
                      ' ' +
                      reservationTmp.staticData.airline +
                      ' ' +
                      $t('weboffice.WithAirlines')
                  }}
                </div>
                <div class="mt-4">
                  {{
                    formatDateAndHour(reservationTmp.staticData.dateOfDeparture)
                  }}
                </div>
                <div class="mt-4">
                  {{ reservationTmp.staticData.departureName }}
                  ({{ reservationTmp.staticData.departureCode }}) -
                  {{ reservationTmp.staticData.destinationName }}
                  ({{ reservationTmp.staticData.destinationCode }})
                </div>
                <div v-if="reservationTmp.staticData.pnr != ''" class="mt-4">
                  PNR: {{ reservationTmp.staticData.pnr }}
                </div>
                <div v-if="reservationTmp.staticData.ticket != ''" class="mt-4">
                  Ticket ID: {{ reservationTmp.staticData.ticket }}
                </div>
                <div v-if="reservationTmp.staticData.isReturn">
                  <div class="font-bold mt-8">
                    {{
                      $t('weboffice.ReverseWay') +
                        ' ' +
                        reservationTmp.staticData.r_airline +
                        ' ' +
                        $t('weboffice.WithAirlines')
                    }}
                  </div>
                  <div class="mt-4">
                    {{
                      formatDateAndHour(
                        reservationTmp.staticData.r_DateOfArrival
                      )
                    }}
                  </div>
                  <div class="mt-4">
                    {{ reservationTmp.staticData.r_DepartureName }}
                    {{ reservationTmp.staticData.r_DepartureCode }} -
                    {{ reservationTmp.staticData.r_DestinationName }}
                    {{ reservationTmp.staticData.r_DestinationCode }}
                  </div>
                </div>
              </div>
              <div
                v-else-if="
                  reservationTmp.type === 'CARRENT' &&
                    reservationTmp.reservation_data !== undefined &&
                    reservationTmp.reservation_data.preorder.error !== true
                "
              >
                <div class="flex flex-row">
                  <div class="w-full md:w-1/2">
                    <div class="mt-8">
                      <div class="font-bold mb-5">
                        {{ $t('weboffice.Pickup') }}:
                      </div>
                      {{
                        formatDate(
                          reservationTmp.reservation_data.preorder.request.pickup_date.substring(
                            0,
                            10
                          )
                        ) +
                          ' ' +
                          reservationTmp.reservation_data.preorder.request.pickup_date.substring(
                            reservationTmp.reservation_data.preorder.request
                              .drop_date.length - 5
                          )
                      }}
                      <div class="mt-5">
                        {{
                          reservationTmp.reservation_data.preorder.request
                            .pickup
                        }}
                      </div>
                    </div>
                    <div class="mt-12">
                      <div class="font-bold mb-5">
                        {{ $t('weboffice.Drop') }}:
                      </div>
                      {{
                        formatDate(
                          reservationTmp.reservation_data.preorder.request.drop_date.substring(
                            0,
                            10
                          )
                        ) +
                          ' ' +
                          reservationTmp.reservation_data.preorder.request.drop_date.substring(
                            reservationTmp.reservation_data.preorder.request
                              .drop_date.length - 5
                          )
                      }}
                      <div class="mt-5">
                        {{
                          reservationTmp.reservation_data.preorder.request.drop
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="w-full md:w-1/2">
                    <div class="mt-8">
                      <div class="font-bold mb-5">
                        {{ $t('weboffice.Equipment') }}:
                      </div>
                      {{ reservationTmp.reservation_data.eqipment }}
                    </div>
                    <div class="mt-12">
                      <div class="font-bold">
                        {{ $t('weboffice.Cancelable') }}:
                      </div>
                      <div v-if="reservationTmp.cancellableUntil !== 'null'">
                        {{ reservationTmp.cancellableUntil }}
                      </div>
                    </div>
                    <span
                      v-if="$route.params.type === 'active'"
                      class="cursor-pointer link"
                      @click="selectedReservation = reservationTmp"
                    >
                      {{ $t('weboffice.ReservationCancel') }}
                    </span>
                  </div>
                </div>

                <div class="mt-12 mb-8">
                  <div class="font-bold">
                    {{ $t('weboffice.OtherInformation') }}:
                  </div>
                  {{ reservationTmp.reservation_data.other_information }}
                </div>
              </div>
              <div v-else-if="reservationTmp.type === 'TRANSFER'">
                <div class="font-bold mt-8">
                  <span v-show="reservationTmp.staticData.vehicleName !== ''">
                    {{ reservationTmp.staticData.vehicleName + ', ' }}
                  </span>
                  {{ reservationTmp.staticData.city }}
                </div>
                <div class="mt-4">
                  {{
                    formatDate(reservationTmp.from.substring(0, 10)) +
                      ' ' +
                      reservationTmp.from.substring(11, 16)
                  }}
                </div>
                <div class="mt-4">
                  {{ $t('weboffice.Arrival') }}:
                  {{ reservationTmp.staticData.arrivalName }}
                </div>
                <div class="mt-4">
                  {{ $t('weboffice.Departure') }}:
                  {{ reservationTmp.staticData.departureName }}
                </div>
                <div v-if="!reservationTmp.staticData.isOneEay">
                  <div class="font-bold mt-8">
                    <span v-show="reservationTmp.staticData.vehicleName !== ''">
                      {{ reservationTmp.staticData.vehicleName + ', ' }}
                    </span>
                    {{ reservationTmp.staticData.city }}
                  </div>
                  <div class="mt-4">
                    {{
                      formatDate(reservationTmp.to.substring(0, 10)) +
                        ' ' +
                        reservationTmp.to.substring(11, 16)
                    }}
                  </div>
                  <div class="mt-4">
                    {{ $t('weboffice.Arrival') }}:
                    {{ reservationTmp.staticData.departureName }}
                  </div>
                  <div class="mt-4">
                    {{ $t('weboffice.Departure') }}:
                    {{ reservationTmp.staticData.arrivalName }}
                  </div>
                </div>
              </div>
              <div v-else-if="reservationTmp.type === 'ROOMPACK'">
                <div class="flex flex-row">
                  {{ Math.abs(reservationTmp.staticData.numberOfNights) }}
                  {{ $t('weboffice.Night').toLowerCase() }},
                  {{ reservationTmp.staticData.city | capitalize }}
                </div>
                <div class="font-bold mt-8">
                  {{ $t('weboffice.AccommodationType') }}:
                </div>
                <div class="mt-4">
                  {{
                    reservationTmp.staticData.accomodation !== undefined &&
                    reservationTmp.staticData.accomodation.length > 0
                      ? reservationTmp.staticData.accomodation.join(', ')
                      : ''
                  }}
                </div>
                <div v-if="$route.params.type === 'active'">
                  <div class="font-bold mt-8">
                    {{ $t('weboffice.Cancelable') }}:
                  </div>
                  <div class="mt-4">
                    {{
                      reservationTmp.cancellableUntil === 'null'
                        ? $t('weboffice.NonRefundable')
                        : $t('weboffice.CancellationDeadline') +
                          ': ' +
                          reservationTmp.cancellableUntil.substring(0, 10)
                    }}
                  </div>
                  <div
                    v-if="
                      reservationTmp.cancellableUntil !== 'null' &&
                        reservationTmp.cancellableActive === true
                    "
                    class="mt-4"
                  >
                    <span
                      v-if="getThematicType(reservationTmp) === false"
                      class="cursor-pointer link"
                      @click="selectedReservation = reservationTmp"
                    >
                      {{ $t('weboffice.ReservationCancel') }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else>
                <div
                  v-if="
                    reservationTmp.type !== 'BONUS_OFFER' &&
                      reservationTmp.type !== 'TICKET'
                  "
                  class="flex flex-row"
                >
                  {{ calcNights(reservationTmp.from, reservationTmp.to) }}
                  {{ $t('weboffice.Night').toLowerCase() }},
                  {{ reservationTmp.staticData.city | capitalize }}
                </div>
                <span v-if="reservationTmp.type !== 'TICKET'">
                  <div class="font-bold mt-8">
                    {{ $t('weboffice.Cancelable') }}:
                  </div>
                  <div class="mt-4">
                    {{
                      reservationTmp.cancellableUntil === 'null'
                        ? $t('weboffice.NonRefundable')
                        : $t('weboffice.CancellationDeadline') +
                          ': ' +
                          reservationTmp.cancellableUntil.substring(0, 10)
                    }}
                  </div>
                </span>
              </div>

              <div
                v-if="
                  reservationTmp.type === 'TICKET' &&
                    (reservationTmp.isRoundTrip === undefined ||
                      reservationTmp.isRoundTrip === false) &&
                    reservationTmp.reservation_data !== undefined
                "
                class="flex flex-row"
              >
                {{ reservationTmp.reservation_data.preorder.duration }},
                {{
                  reservationTmp.reservation_data.destinationcity | capitalize
                }}
                ({{
                  reservationTmp.reservation_data.destinationcountry
                    | capitalize
                }})
              </div>
              <div v-if="reservationTmp.type === 'TICKET'" class="mt-4">
                <div class="flex flex-row">
                  {{
                    reservationTmp.reservationDatasParam
                      ? reservationTmp.reservationDatasParam.duration
                        ? reservationTmp.reservationDatasParam.duration
                        : 0
                      : 0
                  }}

                  {{ $t('weboffice.Night').toLowerCase() }},
                  {{ reservationTmp.staticData.city | capitalize }}
                </div>
                <div class="font-bold mt-8">
                  {{ $t('weboffice.Cancelable') }}:
                </div>
                <div class="mt-4">
                  {{
                    reservationTmp.cancellableUntil === 'null'
                      ? $t('weboffice.NonRefundable')
                      : $t('weboffice.CancellationDeadline') +
                        ': ' +
                        reservationTmp.cancellableUntil.substring(0, 10)
                  }}
                </div>

                <div
                  v-if="reservationTmp.cancellableUntil !== 'null'"
                  class="cursor-pointer link mt-4"
                  @click="selectedReservation = reservationTmp"
                >
                  {{ $t('weboffice.ReservationCancel') }}
                </div>
              </div>
              <div
                v-if="
                  reservationTmp.links.length > 0 ||
                    $route.params.type === 'active'
                "
                class="flex flex-col"
              >
                <div class="font-bold pr-8 mt-8">
                  {{ $t('weboffice.Invoices') }}:
                </div>
                <div class="flex flex-col lg:flex-row mt-8">
                  <div
                    v-for="(link, linkKey) in getLinks(reservationTmp)"
                    :key="linkKey"
                    class="lg:px-8 first:pl-0 border-r border-grey last:border-r-0"
                  >
                    <div class="link cursor-pointer" @click="downloadPdf(link)">
                      {{ linkType[link.category] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="maxPage > 1"
            :max-pages="maxPage"
            :current-page="currentPage"
            @click="navPage"
          />
        </div>
      </div>
      <div v-if="reservation.reservations.length == 0">
        {{ $t('weboffice.NoReservation') }}
      </div>
    </div>
    <DecisionModal
      v-show="selectedReservation"
      with-class="w-320"
      :accept-button="$t('general.Yes')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="reservationCancelLoading"
      @close="selectedReservation = false"
      @cancel="selectedReservation = false"
      @accept="reservationCancel"
    >
      <div slot="body" class="text-black">
        <div class="flex flex-col">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.DeleteReservation') }}
          </div>
          <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
            {{ $t('weboffice.DeleteReservationDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
  </main>
</template>

<script>
import { format } from 'date-fns'
import HotelReservationTypes from '@/includes/HotelReservationTypes'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import hotelIcon from '@/assets/images/black-turq/travel-services/hotel/hotel-60.svg'
import transferIcon from '@/assets/images/black-turq/travel-services/transfer/transfer-60.svg'
import flightIcon from '@/assets/images/black-turq/travel-services/flight/flight-60.svg'
import carrentIcon from '@/assets/images/black-turq/travel-services/car-rental/car-rental-60.svg'
import ticketIcon from '@/assets/images/black-turq/travel-services/program/program-60.svg'
import roundtripIcon from '@/assets/images/black-turq/travel-services/round-trip/round-trip-60.svg'
import apartmentIcon from '@/assets/images/black-turq/travel-services/apartments/apartments-60.svg'

import DecisionModal from '~/components/modal/DecisionModal'

import {
  getDayOfWeekName,
  calcNights,
  timeConverter,
  getPerPageLimit
} from '@/includes/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ReservationsPage',
  middleware: 'auth_needed',
  components: {
    Pagination,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    DecisionModal
  },
  data() {
    return {
      reservation: false,
      title: {
        manual: this.$t('weboffice.ManualReservations'),
        active: this.$t('weboffice.ActiveReservations'),
        failed: this.$t('weboffice.FailedReservations'),
        cancelled: this.$t('weboffice.CancelledReservations'),
        pending: this.$t('weboffice.PendingReservations'),
        inactive: this.$t('weboffice.InactiveReservations')
      },
      activeRow: false,
      linkType: {
        TICKET: this.$t('weboffice.ElectronicTicket'),
        PAYMENT: this.$t('weboffice.Invoice'),
        VOUCHER: this.$t('weboffice.Voucher'),
        COUPON_DEBIT_NOTE: this.$t('weboffice.CouponDebitNote'),
        DIAMOND_VOUCHER_CREDIT_NOTE: this.$t(
          'weboffice.DiamondVoucherCreditNote'
        ),
        DIAMOND_VOUCHER_DEBIT_NOTE: this.$t(
          'weboffice.DiamondVoucherDebitNote'
        ),
        TRAVELCARD_DEBIT_NOTE: this.$t(
          'weboffice.TransactionTypeTravelCardDebitNote'
        ),
        PAYMENT_CREDIT_NOTE: this.$t('weboffice.PaymentCreditNote'),
        TRAVELCARD_CREDIT_NOTE: this.$t(
          'weboffice.TransactionTypeTravelCardCreditNote'
        ),
        BPO_DEBIT_NOTE: 'BPO_DEBIT_NOTE',
        BPO_CREDIT_NOTE: 'BPO_CREDIT_NOTE'
      },
      icon: {
        ROOMPACK: hotelIcon,
        TRANSFER: transferIcon,
        FLIGHT: flightIcon,
        COUPON_OFFER: hotelIcon,
        BONUS_OFFER: hotelIcon,
        CARRENT: carrentIcon,
        TICKET: ticketIcon,
        ROUNDTRIP: roundtripIcon,
        FLASH_OFFER: hotelIcon,
        APARTMENT: apartmentIcon
      },
      activeReservation: false,
      currentPage: 1,
      maxPage: 1,
      selectedReservation: false,
      reservationCancelLoading: false
    }
  },
  computed: {
    limit() {
      return getPerPageLimit()
    }
  },
  watch: {
    $route() {
      this.getDetails()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getIcon(reservationTmp) {
      return this.icon[reservationTmp.type]
    },
    getThematicType(data) {
      if (data.reservationDatasParam !== undefined) {
        if (data.reservationDatasParam.thematicData !== undefined) {
          if (data.reservationDatasParam.thematicData.offertype !== undefined) {
            return data.reservationDatasParam.thematicData.offertype
          }
          return true
        }
      }
      return false
    },
    getLinks(res) {
      const links = []
      if (res.type === 'FLIGHT') {
        links.push({
          category: 'TICKET',
          endpoint: 'ticket-download',
          id: res.reservationId,
          postParams: {
            reservationId: res.reservationId
          }
        })
      }

      for (let i = 0; i < res.links.length; i++) {
        if (res.links[i].category === 'PAYMENT') {
          links.push({
            endpoint: 'invoice-download',
            id: res.links[i].postParams.orderId,
            ...res.links[i]
          })
        } else if (
          res.links[i].category === 'VOUCHER' &&
          res.type === 'ROOMPACK'
        ) {
          links.push({
            endpoint: 'voucher-download',
            id: res.reservationId,
            ...res.links[i]
          })
        } else if (Object.keys(this.linkType).includes(res.links[i].category)) {
          let id
          let endpoint
          if (res.links[i].postParams.orderId !== undefined) {
            id = res.links[i].postParams.orderId
            endpoint = 'invoice-download'
          } else if (res.links[i].postParams.reservationId !== undefined) {
            id = res.links[i].postParams.reservationId
            endpoint = 'voucher-download'
          }

          if (id && endpoint) {
            links.push({
              endpoint,
              id,
              ...res.links[i]
            })
          }
        }
      }

      return links
    },
    async getDetails() {
      this.$scrollTo('#__nuxt')
      this.reservation = false
      this.currentPage = 1
      this.activeReservation = false
      this.maxPage = 1
      this.reservation = await this.$store.dispatch('user/getReservations', {
        type: HotelReservationTypes[this.$route.params.type]
      })

      if (this.reservation.reservations !== undefined) {
        this.reservation.reservations.reverse()
        this.maxPage = Math.ceil(
          this.reservation.reservations.length / this.limit
        )
      } else {
        this.maxPage = 1
      }
    },
    showInvoices(key) {
      if (this.activeRow === key) {
        this.activeRow = false
      } else {
        this.activeRow = key
      }
    },
    outsideClick(e) {
      if (this.$refs.reservations !== undefined) {
        const isChild = this.$refs.reservations.contains(e.target)
        if (!isChild) {
          this.activeRow = false
        }
      }
    },
    getPassengers(passengerData, type) {
      let adult = 0
      let children = 0
      passengerData = Object.values(passengerData)
      passengerData.forEach((passengers) => {
        if (passengers.length > 0) {
          passengers.forEach((passenger) => {
            if (
              passenger.age === undefined ||
              passenger.age === '' ||
              passenger.age >= 18 ||
              passenger.passengerTypeCode === 'ADT'
            ) {
              adult++
            } else {
              children++
            }
          })
        }
      })
      if (type === 'FLIGHT') {
        return adult + children + ' ' + this.$t('weboffice.ForTravellers')
      } else {
        return (
          adult +
          ' ' +
          (adult > 1
            ? this.$t('weboffice.Adults')
            : this.$t('weboffice.Adult')) +
          (children > 0
            ? ', ' +
              children +
              ' ' +
              (children > 1
                ? this.$t('weboffice.Child')
                : this.$t('weboffice.Children'))
            : '')
        )
      }
    },
    formatDate(date) {
      if (date !== false) {
        const dateTmp = new Date(date)
        return (
          format(dateTmp, 'yyyy.MM.dd') +
          ' (' +
          getDayOfWeekName(format(dateTmp, 'i')) +
          ')'
        ).toLowerCase()
      } else {
        return ''
      }
    },
    timeToDate(stamp) {
      return stamp !== undefined ? timeConverter(stamp) : false
    },
    formatDateAndHour(date) {
      return date
      // return format(new Date(parseInt(date, 10)), 'yyyy.MM.dd EEEE kk:mm')
    },
    getInvoicesPosition(links) {
      if (links.length > 0) {
        for (let i = 0; i < links.length; i++) {
          if (
            links[i].category !== 'PAYMENT' &&
            links[i].category !== 'VOUCHER'
          ) {
            return 'left--65'
          }
        }
      }
      return 'left--44'
    },
    showReservationDetails(reservationId) {
      this.activeRow = false
      if (this.activeReservation === reservationId) {
        this.activeReservation = false
      } else {
        this.activeReservation = reservationId
      }
    },
    navPage(page) {
      this.currentPage = page
      this.activeRow = false
      this.activeReservation = false
      this.$scrollTo('#__nuxt')
    },
    calcNights(date1, date2) {
      return calcNights(date1, date2)
    },
    downloadPdf(link) {
      window.open(
        this.$api._defaults.prefixUrl +
          'user/' +
          link.endpoint +
          '?auth=' +
          this.$store.state.user.token +
          '&id=' +
          link.id +
          '&lang=' +
          this.$i18n.locale,
        '_blank'
      )
    },
    async reservationCancel() {
      if (
        this.selectedReservation.cancellableUntil !== 'null' &&
        this.selectedReservation.trackingId !== undefined &&
        this.selectedReservation.trackingId !== null &&
        this.selectedReservation.type !== 'TICKET'
      ) {
        let res
        try {
          if (this.selectedReservation.type === 'CARRENT') {
            this.reservationCancelLoading = true
            res = await this.$store.dispatch('user/reservationCarrentCancel', {
              trackingId: this.selectedReservation.trackingId
            })
          } else {
            this.reservationCancelLoading = true
            res = await this.$store.dispatch('user/reservationCancel', {
              trackingId: this.selectedReservation.trackingId
            })
          }
        } catch (e) {
          this.reservationCancelLoading = false
          this.selectedReservation = false
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.ReservationCancelFailed')
          })
        }

        if (res.error !== undefined) {
          this.reservationCancelLoading = false
          this.selectedReservation = false
          this.$store.dispatch('general/showSnackbar', {
            message:
              this.$t('weboffice.ReservationCancelFailed') + ' - ' + res.error
          })
        }

        if (res !== undefined && res.error === undefined) {
          this.selectedReservation = false
          this.reservationCancelLoading = false
          this.getDetails()
        }
      } else if (
        this.selectedReservation.type === 'TICKET' &&
        this.selectedReservation.trackingId !== undefined &&
        this.selectedReservation.reservation_data.preorder.booking
          .booking_id !== undefined
      ) {
        let res
        try {
          this.reservationCancelLoading = true
          res = await this.$store.dispatch('program/cancel', {
            booking_id: this.selectedReservation.reservation_data.preorder
              .booking.booking_id,
            trackingId: this.selectedReservation.trackingId,
            lang: this.$i18n.locale
          })
        } catch (e) {
          this.reservationCancelLoading = false
          this.selectedReservation = false
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.ReservationCancelFailed')
          })
        }
        if (res) {
          if (res.error !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: this.$t('weboffice.ReservationCancelFailed')
            })
            console.log(res.error)
          }
          this.selectedReservation = false
          this.reservationCancelLoading = false
          this.getDetails()
        }
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeReservationsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeReservationsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeReservationsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.left--65 {
  left: -65px;
}
.left--44 {
  left: 44px;
}
</style>
