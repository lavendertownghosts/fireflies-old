<template>
  <div>
    <div v-if="cartCache.offerData !== undefined">
      <div class="bg-primary-gradient">
        <div
          class="flex flex-row items-center justify-between px-16 py-24 lg:py-18 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
        >
          <div class="flex items-center">
            <div class="hidden md:block md:flex-initial md:mr-16">
              <img
                src="~assets/images/white-turq/travel-services/apartments/apartments-60.svg"
                class="w-60 h-60"
              />
            </div>
            <div
              class="items-center flex-grow text-lg leading-32 md:leading-24"
            >
              <div class="flex flex-wrap">
                <div class="flex-initial mr-4">
                  {{ cartCache.offerData.activity_name }}
                </div>
              </div>
              <div class="hidden md:block md:mt-2 text-sm leading-14">
                <span class="font-normal">{{
                  cartCache.offerData.address
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-row mt-4 cursor-pointer" @click="$router.back()">
          <i class="fa fa-chevron-left text-primary text-sm leading-14"></i>
          <p class="ml-8 text-sm leading-14 link font-bold mb-6">
            {{ $t('general.Back') }}
          </p>
        </div>
        <div class="flex flex-col md:flex-row items-stretch">
          <div class="w-full md:mr-8 mb-40">
            <div class="text-lg font-bold text-black leading-24 mt-20">
              {{ $t('hotel.ReservationTitle') }}
            </div>
            <ServicePreview
              :image-url="false"
              :date-text="dateText"
              :hotel-text="cartCache.offerData.name"
              :cancellation-text="false"
              :guest-text="
                getGuestText(
                  parseInt(cartCache.search_request.paxDatas.adultCount),
                  parseInt(cartCache.search_request.paxDatas.childCount)
                )
              "
              class="mt-24 md:hidden"
            />
            <CartCard
              id="bookingInformation"
              :type="
                acceptedBookingInformation
                  ? 'success'
                  : openedCard.bookingInformation
                  ? 'danger'
                  : 'default'
              "
              :title="$t('hotel.BookingInformation')"
              :price="
                acceptedBookingInformation
                  ? Math.ceil(parseFloat(cartCache.offerData.price.EUR))
                  : false
              "
              :active="activeCard === 'bookingInformation'"
              :help="$t('hotel.BookingInformationAccept')"
              class="mt-24"
              @showCartCard="showCartCard('bookingInformation')"
            >
              <div class="p-16 flex flex-wrap">
                <div class="w-full md:pl-8">
                  <div v-if="cartCache.offerData.overview !== ''">
                    <div class="font-bold cursor-pointer leading-16 text-base">
                      {{ $t('program.AboutTheProgram') }}
                    </div>
                    <div
                      class="mt-8"
                      v-html="cartCache.offerData.overview"
                    ></div>
                  </div>
                  <div
                    v-if="
                      cartCache.offerData.important_info &&
                        cartCache.offerData.important_info.length > 0
                    "
                    class="mt-20 bg-primary-opaque p-10 border border-primary rounded-sm"
                  >
                    <div
                      class="flex flex-row w-full text-black font-bold items-center leading-16"
                    >
                      <span>
                        {{ $t('program.ImportantInfo') }}
                      </span>
                    </div>
                    <div
                      class="text-sm leading-20 text-black mt-8"
                      v-html="cartCache.offerData.important_info"
                    ></div>
                  </div>
                  <div
                    v-if="
                      cartCache.offerData.featureGroups &&
                        cartCache.offerData.featureGroups.length > 0
                    "
                    class="flex flex-row w-full text-black font-bold items-center leading-16 mt-20"
                  >
                    <span class="mb-8">
                      {{ $t('program.featureGroup') }}
                    </span>
                  </div>
                  <div
                    v-for="(feature, index) in cartCache.offerData
                      .featureGroups"
                    :key="index"
                    class="mt-2"
                  >
                    <div class="text-sm leading-20 text-black">
                      {{ feature.type }}
                    </div>
                    <div
                      v-if="feature.included && feature.included.length > 0"
                      class="text-sm leading-20 text-black pl-8"
                    >
                      {{ $t('program.featureGroupIncluded') }} :
                      {{ feature.included }}
                    </div>
                    <div
                      v-if="feature.excluded && feature.excluded.length > 0"
                      class="text-sm leading-20 text-black pl-8"
                    >
                      {{ $t('program.featureGroupExcluded') }} :
                      {{ feature.excluded }}
                    </div>
                  </div>
                  <div
                    v-if="
                      cartCache.offerData.services &&
                        cartCache.offerData.services.length > 0
                    "
                    class="flex flex-row w-full text-black font-bold items-center leading-16 mt-20"
                  >
                    <span>
                      {{ $t('program.programServices') }}
                    </span>
                  </div>
                  <div
                    class="text-sm leading-20 text-black mt-8"
                    v-html="cartCache.offerData.services"
                  ></div>
                  <div
                    class="mt-20 flex flex-row w-full text-black font-bold items-center leading-16"
                  >
                    <span>
                      {{ $t('program.DepartureReturn') }}
                    </span>
                  </div>
                  <div class="text-sm leading-20 text-black mt-1">
                    <div class="mt-5">
                      {{ $t('program.MeetingPointsTitle') }}:
                    </div>
                    <div class="ml-8">
                      <div
                        v-for="(start_point, index) in cartCache.offerData
                          .start_points"
                        :key="index"
                        class="pb-5"
                      >
                        <div v-show="start_point.meetingPoint !== undefined">
                          <div
                            v-html="formatStartPointText(start_point, index)"
                          ></div>
                          <div v-if="start_point.meetingPoint.description">
                            <b>Description:</b>
                            {{ start_point.meetingPoint.description }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-5">{{ $t('program.EndPointsTitle') }}:</div>
                    <div class="ml-8">
                      <div
                        v-for="(end_point, index) in cartCache.offerData
                          .end_points"
                        :key="index"
                      >
                        <div v-html="formatEndPointText(end_point)"></div>
                        <div v-if="end_point.description">
                          <b>Description:</b>
                          <div v-html="end_point.description"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-grey-light h-1"></div>
              <div class="pb-12 mb-4 pl-32 sm:pt-16 sm:pb-12 sm:pl-16">
                <InputCheckbox
                  v-model="acceptedBookingInformation"
                  :has-error="
                    openedCard.bookingInformation && !acceptedBookingInformation
                  "
                >
                  <div class="text-sm leading-14 sm:leading-20">
                    {{ $t('hotel.BookingInformationConfirm') }}
                  </div>
                </InputCheckbox>
              </div>
            </CartCard>

            <CartCard
              id="passengers"
              :type="passengerDataStatus"
              :title="$t('hotel.GuestDetails')"
              :help="$t('hotel.GuestDetailsHelp')"
              :price="false"
              :active="activeCard === 'passengers'"
              class="mt-24"
              @showCartCard="showCartCard('passengers')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <div
                  v-for="(item, index) in passengers"
                  :key="index"
                  class="mt-24 pt-24 border-t border-grey-light"
                >
                  <div class="text-sm leading-14 font-bold">
                    {{ item.passenger }}
                  </div>
                  <div class="flex flex-col xl:flex-row">
                    <div class="flex flex-col sm:flex-row">
                      <div class="w-84">
                        <InputDropdown
                          v-model="item.title"
                          :values="titleSelect"
                          :label="$t('general.Title')"
                          class="mt-12"
                        ></InputDropdown>
                      </div>
                      <div class="flex flex-row mt-24 sm:mt-12 sm:pl-16">
                        <div class="pr-8 xl:w-240">
                          <InputText
                            v-model="item.lastName"
                            :class="'w-full'"
                            :label="$t('general.LastName')"
                            :error="
                              item.error.lastName ? item.error.lastName : ''
                            "
                            :placeholder="
                              item.error.lastName ? $t('general.LastName') : ''
                            "
                          />
                        </div>
                        <div class="pl-8 xl:w-240">
                          <InputText
                            v-model="item.firstName"
                            :class="'w-full'"
                            :label="$t('general.FirstName')"
                            :error="
                              item.error.firstName ? item.error.firstName : ''
                            "
                            :placeholder="
                              item.error.firstName
                                ? $t('general.FirstName')
                                : ''
                            "
                          />
                        </div>
                        <div class="pl-8 xl:w-240">
                          <InputText
                            v-model="item.age"
                            :is-readonly="
                              item.readonlyAge !== undefined
                                ? item.readonlyAge
                                : false
                            "
                            :label="$t('general.Age')"
                            :error="item.error.age ? item.error.age : ''"
                            :placeholder="
                              item.error.age ? $t('general.Age') : ''
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CartCard>

            <CartCard
              id="billing"
              :type="billingDataStatus"
              :title="$t('general.BillingDetails')"
              :help="$t('general.BillingDetailsHelp')"
              :active="activeCard === 'billing'"
              class="mt-24"
              @showCartCard="showCartCard('billing')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox
                  v-model="copyAdult1"
                  @input="copyAdult1DataToBillingData"
                >
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('general.BillingSameAsAdult1') }}
                  </div>
                </InputCheckbox>
                <InputCheckbox v-model="saveBillingData" class="mt-12">
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('general.SaveDetails') }}
                  </div>
                </InputCheckbox>
                <div class="mt-24 pt-24 border-t border-grey-light">
                  <InputText
                    v-model="billingData.name"
                    :class="'w-full sm:w-271'"
                    :label="$t('general.BillingName')"
                  />
                  <div class="flex flex-col xl:flex-row">
                    <div
                      class="flex flex-col sm:flex-row justify-between md:justify-start"
                    >
                      <InputDropdown
                        v-model="billingData.country"
                        :values="countrySelect"
                        :is-filterable="true"
                        :label="$t('general.Country')"
                        class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                      ></InputDropdown>
                      <InputText
                        v-model="billingData.postalCode"
                        :class="'w-128 mt-24 md:w-auto lg:w-128'"
                        :label="$t('general.ZipCode')"
                      />
                    </div>
                    <InputText
                      v-model="billingData.city"
                      :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                      :label="$t('general.City')"
                    />
                  </div>
                  <InputText
                    v-model="billingData.address"
                    :class="'w-full mt-24'"
                    :label="$t('general.Address')"
                  />
                  <div class="mt-24">
                    <label class="text-black text-xs font-bold leading-12">
                      {{ $t('general.TaxNumber') }}
                      <span class="text-grey-dark font-normal"
                        >({{ $t('general.Optional') }})</span
                      >
                    </label>
                    <InputText
                      v-model="billingData.tax"
                      :class="'w-216'"
                      :label="''"
                    />
                  </div>
                </div>
              </div>
            </CartCard>

            <CartCard
              v-show="questions.length > 0"
              id="questions"
              :type="questionsDataStatus"
              :title="$t('program.Questions')"
              :help="$t('program.QuestionsHelp')"
              :price="false"
              :active="activeCard === 'questions'"
              class="mt-24"
              @showCartCard="showCartCard('questions')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <div
                  v-for="(item, index) in questions"
                  :key="index"
                  class="mt-12 pt-8 pb-5 border-t border-grey-light"
                >
                  <div class="text-sm pb-6 leading-12 font-bold">
                    {{ index + 1 }}. {{ item.question.text }}
                  </div>
                  <div class="flex flex-col xl:flex-row pt-6">
                    <InputText
                      v-model="item.question.answer"
                      :class="'w-full'"
                      :label="$t('program.Answer')"
                      :placeholder="
                        item.question.answer ? $t('program.Answer') : ''
                      "
                    />
                  </div>
                </div>
              </div>
            </CartCard>
          </div>
          <!-- Summary -->
          <div
            class="md:ml-8 w-full md:max-w-grid-sm xl:max-w-grid-md md:min-w-grid-sm xl:min-w-grid-md"
          >
            <div
              class="hidden text-lg font-bold text-black leading-24 mt-20 md:block"
            >
              {{ $t('general.Summary') }}
            </div>
            <ServicePreview
              :image-url="cartCache.offerData.image"
              :date-text="dateText"
              :hotel-text="cartCache.offerData.activity_name"
              :cancellation-text="
                cartCache.offerData.freeCancellationDate !== undefined
                  ? formatDateDisplay(cartCache.offerData.freeCancellationDate)
                  : $t('hotel.NonRefundable')
              "
              :room-text="cartCache.offerData.type"
              :guest-text="
                getGuestText(
                  parseInt(cartCache.search_request.paxDatas.adultCount),
                  parseInt(cartCache.search_request.paxDatas.childCount)
                )
              "
              class="hidden md:block mt-16"
            />
            <div class="flex flex-col mt-24 mb-40">
              <div class="text-lg font-bold text-black leading-24 mb-16">
                {{ $t('general.Pay') }}
              </div>
              <div
                class="px-16 pt-16 pb-12 text-black font-bold bg-grey-light rounded-t border border-grey-light"
              >
                <div class="text-sm leading-14">
                  {{ $t('general.OfferPrice') }}
                </div>
                <div class="flex flex-row text-3x leading-20 mt-4">
                  <div v-show="cartCache.offerData.price.EUR > 0">
                    EUR
                    {{
                      Math.ceil(parseFloat(cartCache.offerData.price.EUR))
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                </div>
              </div>
              <div
                class="bg-white px-16 pb-16 border-grey-light text-black border-r border-l"
              >
                <label
                  class="block text-black text-xs font-bold leading-12 mt-16"
                  >{{ $t('general.PayWithTC') }}</label
                >
                <InputTextMask
                  v-model="travelCard"
                  :mask="'EUR 99999'"
                  :class="'w-full'"
                  :is-dark="false"
                  :is-disabled="tcBalance <= 0"
                  @input="changeAddedTravelCard"
                />

                <div class="text-xs mt-4 leading-12 text-grey-dark">
                  {{ $t('general.CurrentTC') }}: EUR
                  {{
                    tcBalance
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
              </div>
              <div class="bg-primary-gradient px-16 pb-20 text-white">
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-white"></div>
                </div>
                <div
                  v-show="getAddedTravelCard > 0"
                  class="text-sm leading-14 font-bold mt-16"
                >
                  {{ $t('general.PayWithTC') }}
                </div>
                <div
                  v-show="getAddedTravelCard > 0"
                  class="flex flex-row text-3x leading-20 font-bold mt-4"
                >
                  <span v-show="getAddedTravelCard > 0">
                    EUR
                    {{
                      getAddedTravelCard
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </span>
                </div>
                <div
                  v-show="
                    getTotalPrice - getAddedTravelCard > 0 &&
                      getAddedTravelCard > 0
                  "
                  class="h-1 bg-white bg-opacity-30 my-12"
                ></div>
                <div
                  v-show="getTotalPrice - getAddedTravelCard > 0"
                  class="flex flex-row"
                >
                  <div class="flex flex-col flex-grow">
                    <div class="text-sm leading-14 font-bold">
                      {{ $t('general.PayWithCreditCard') }}
                    </div>
                    <div class="text-3x leading-20 font-bold mt-4">
                      EUR
                      {{
                        (getTotalPrice - getAddedTravelCard)
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div
                      class="text-xs leading-12 text-white text-opacity-75 mt-2"
                    >
                      (+ EUR
                      {{
                        handlingFee
                          | formatNumber('0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                      {{ $t('general.TransactionFee') }})
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="flex">
                      <i class="text-lg fas fa-credit-card"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-danger text-white text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
                @click="pay()"
              >
                <div class="relative">
                  <div :class="{ 'opacity-0': isLoading }" class="static">
                    {{ $t('general.Pay') }}
                  </div>
                  <div
                    class="absolute inset-0 opacity-0"
                    :class="{ 'opacity-100': isLoading }"
                  >
                    <i class="fas fa-spinner-third fa-spin"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InformativeModal
        v-show="billingDataErrorModalActive"
        :accept-button="$t('general.Ok')"
        @accept="billingDataErrorModalActive = false"
      >
        <div slot="body">
          <div class="text-lg font-bold leading-24 mb-16 text-black">
            {{ $t('hotel.BillingDataError') }}
          </div>
        </div>
      </InformativeModal>
      <CartBlockModal
        :covid-cart-block="cartBlock"
        @accept="cartBlock = false"
      />
    </div>
    <NMIModal
      v-show="nmiPopupActive"
      :popup="nmiPopup"
      @close="
        nmiPopupActive = false
        nmiPopup = false
      "
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import InputTextMask from '@/components/micro/InputTextMask'

import InformativeModal from '@/components/modal/InformativeModal'
import CartBlockModal from '@/components/modal/CartBlockModal'

import CountryList from '@/includes/countrylist'

import NMIModal from '@/components/modal/NMIModal'

import {
  formatDateDisplay,
  calcNights,
  getHandlingFee,
  getBoardName,
  getGuestText,
  capitalize,
  createDate
} from '@/includes/utils'

export default {
  name: 'ApartmentsCartPage',
  middleware: 'auth_needed',
  components: {
    CartCard,
    ServicePreview,
    InputCheckbox,
    InputDropdown,
    InputText,
    InputTextMask,
    InformativeModal,
    CartBlockModal,
    NMIModal
  },
  async asyncData({ store, route }) {
    let responses
    try {
      responses = await Promise.all([store.dispatch('user/getPersonalData')])
    } catch (e) {
      console.log(e)
    }

    const [props] = responses

    return {
      props
    }
  },
  data() {
    return {
      activeCard: 'bookingInformation',
      openedCard: {
        bookingInformation: false,
        insurance: false,
        passengers: false,
        billing: false,
        questions: false
      },
      acceptedBookingInformation: false,
      acceptedPassengers: false,
      acceptedBilling: false,
      passengers: [],
      copyAdult1: true,
      copyAdult1ToContact: false,
      saveBillingData: false,
      titleSelect: ['Mr', 'Mrs'],
      yearSelect: 0,
      countrySelect: [],
      countrySelectIds: [],
      countrySelectCodes: [],
      billingData: {
        name: '',
        age: '',
        country: '',
        postalCode: '',
        city: '',
        address: '',
        tax: '',
        error: {
          name: '',
          age: '',
          country: '',
          postalCode: '',
          city: '',
          address: '',
          tax: ''
        }
      },
      questions: [],
      travelCard: 'EUR 0',
      isLoading: false,
      handlingFee: 0,
      permissionModalActive: false,
      billingDataErrorModalActive: false,
      cartBlock: false,

      nmiPopupActive: false,
      nmiPopup: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isLoggedIn']),
    ...mapActions('program', ['payCart']),
    ...mapGetters('program', ['cartCache']),
    getTotalPrice() {
      return Math.ceil(parseFloat(this.cartCache.offerData.price.EUR))
    },
    passengerDataStatus() {
      if (!this.openedCard.passengers) {
        return 'default'
      }
      for (const passenger of this.passengers) {
        if (
          passenger.error.firstName ||
          passenger.error.lastName ||
          passenger.error.age
        ) {
          return 'danger'
        }
      }
      return 'success'
    },
    questionsDataStatus() {
      if (!this.openedCard.questions) {
        return 'default'
      }
      for (const question of this.questions) {
        if (question.question.error) {
          return 'danger'
        }
      }
      return 'success'
    },
    billingDataStatus() {
      if (!this.openedCard.billing) {
        return 'default'
      }
      for (const keyError in this.billingData.error) {
        if (this.billingData.error[keyError] !== '') {
          return 'danger'
        }
      }
      return 'success'
    },
    firstName() {
      return this.getFees.fullname.split(' ')[0]
    },
    lastName() {
      const nameParts = this.getFees.fullname.split(' ')
      nameParts.shift()
      return nameParts.join(' ')
    },
    dateText() {
      if (
        this.cartCache.offerData.date_from !== null &&
        this.cartCache.offerData.date_to !== null
      ) {
        const from = createDate(this.cartCache.offerData.date_from)
        const to = createDate(this.cartCache.offerData.date_to)
        return (
          formatDateDisplay(
            from.getFullYear(),
            from.getMonth() + 1,
            from.getDate()
          ) +
          ' - ' +
          formatDateDisplay(to.getFullYear(), to.getMonth() + 1, to.getDate()) +
          '<br class="hidden md:block xl:hidden" /><span class="text-grey-dark"> (' +
          calcNights(
            this.cartCache.offerData.date_from,
            this.cartCache.offerData.date_to
          ) +
          ' ' +
          this.$t('hotel.Night') +
          ')</span>'
        )
      } else {
        return ''
      }
    },
    getAddedTravelCard() {
      const tc = parseInt((this.travelCard + '').replace('EUR', '').trim())
      if (isNaN(tc)) {
        return 0
      } else if (tc > this.getTotalPrice) {
        return this.getTotalPrice
      } else if (tc > this.tcBalance) {
        return this.tcBalance
      } else {
        return tc
      }
    },
    tcBalance() {
      const fees = this.getFees
      return fees === false ? 0 : Math.floor(fees.tc.credit)
    },
    activePaymentButton() {
      if (
        this.acceptedBookingInformation &&
        this.passengerDataStatus === 'success' &&
        this.billingDataStatus === 'success' &&
        this.questionsDataStatus === 'success'
      ) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    let passId = 0
    console.log(this.cartCache.search_request.paxDatas)
    for (
      let i = 0;
      i < this.cartCache.search_request.paxDatas.adultCount;
      i++
    ) {
      this.passengers.push({
        passenger: capitalize(this.$t('general.Adult'), true) + ' ' + (i + 1),
        key: 'passenger' + passId,
        title: 0,
        firstName: passId === 0 ? this.firstName : '',
        lastName: passId === 0 ? this.lastName : '',
        adult: true,
        age: '',
        error: {
          nationality: '',
          firstName: '',
          lastName: '',
          age: '',
          birthday: ''
        }
      })
      passId++
    }

    if (this.cartCache.search_request.paxDatas.childCount > 0) {
      for (
        let i = 0;
        i < this.cartCache.search_request.paxDatas.childCount;
        i++
      ) {
        this.passengers.push({
          passenger: capitalize(this.$t('general.Child'), true) + ' ' + (i + 1),
          key: 'passenger' + passId,
          title: 0,
          firstName: '',
          lastName: '',
          adult: false,
          error: {
            nationality: '',
            firstName: '',
            lastName: '',
            age: '',
            birthday: ''
          },
          readonlyAge: true,
          age: this.cartCache.search_request.paxDatas.childrenAges[i]
        })
        passId++
      }
    }

    if (
      this.cartCache.offerData.questions !== undefined &&
      this.cartCache.offerData.questions.length > 0
    ) {
      for (
        let questionIndex = 0;
        questionIndex < this.cartCache.offerData.questions.length;
        questionIndex++
      ) {
        this.questions.push({
          question: {
            code: this.cartCache.offerData.questions[questionIndex].code,
            text: this.cartCache.offerData.questions[questionIndex].text,
            answer:
              this.cartCache.offerData.questions[questionIndex].answer ?? '',
            error: ''
          }
        })
      }
    }

    this.isLoading = false
    if (this.cartCache === false) {
      this.$router.push(this.localePath('/'))
      this.$store.dispatch('general/showSnackbar', {
        message: this.$t('hotel.EmptyCart')
      })
    }

    this.$store.dispatch('user/updateFees')

    if (
      CountryList.countryCodesFullName !== undefined &&
      CountryList.countryIdFullName !== undefined
    ) {
      this.countrySelect = []
      for (const [key, value] of Object.entries(
        CountryList.countryIdFullName
      )) {
        this.countrySelect.push(CountryList.countryCodesFullName[value])
        this.countrySelectIds.push(key)
        this.countrySelectCodes.push(value)
      }
    }

    this.billingData = {
      name: this.props.BILLING_NAME || '',
      country: parseInt(this.props.BILLING_COUNTRY) - 1 || '',
      postalCode: this.props.BILLING_ZIPCODE || '',
      city: this.props.BILLING_CITY || '',
      address: this.props.BILLING_STREET || '',
      tax: '',
      error: {
        name: '',
        country: '',
        postalCode: '',
        city: '',
        address: '',
        tax: ''
      }
    }
    this.updateProgramHandlingFee()
  },
  methods: {
    getBoardName,
    formatDateDisplay,
    getGuestText,
    capitalize,
    showCartCard(index) {
      if (this.openedCard[this.activeCard] === false) {
        this.openedCard[this.activeCard] = true
      }

      if (this.activeCard !== false) {
        if (this.activeCard.includes('passenger')) {
          this.validatePassenger()
        } else if (this.activeCard === 'billing') {
          this.validateBilling()
        } else if (this.activeCard === 'questions') {
          this.validateQuestions()
        }
      }

      if (this.activeCard === index) {
        this.activeCard = false
      } else {
        this.activeCard = index
      }
    },
    validateBeforePay() {
      this.validatePassenger()
      this.validateBilling()
      this.validateQuestions()

      this.openedCard.bookingInformation = true
      this.openedCard.passengers = true
      this.openedCard.billing = true
      this.openedCard.insurance = true
      this.openedCard.questions = true

      for (const passenger of this.passengers) {
        if (
          passenger.error.firstName ||
          passenger.error.lastName ||
          passenger.error.age
        ) {
          this.activeCard = ''
          this.showCartCard('passengers')
        }
      }

      for (const keyError in this.billingData.error) {
        if (this.billingData.error[keyError] !== '') {
          this.activeCard = ''
          this.showCartCard('billing')
        }
      }

      if (this.acceptedBookingInformation === false) {
        this.activeCard = ''
        this.showCartCard('bookingInformation')
      }
    },
    validatePassenger() {
      for (let i = 0; i < this.passengers.length; i++) {
        for (const keyError in this.passengers[i].error) {
          this.passengers[i].error[keyError] = ''
        }

        if (this.passengers[i].firstName === '') {
          this.passengers[i].error.firstName = this.$t(
            'hotel.FirstNameRequired'
          )
        } else if (!/^[\x20-\x7E]+$/.test(this.passengers[i].firstName)) {
          this.passengers[i].error.firstName = this.$t(
            'hotel.FirstNamePatternError'
          )
        }

        if (this.passengers[i].lastName === '') {
          this.passengers[i].error.lastName = this.$t('hotel.LastNameRequired')
        } else if (!/^[\x20-\x7E]+$/.test(this.passengers[i].lastName)) {
          this.passengers[i].error.lastName = this.$t(
            'hotel.LastNamePatternError'
          )
        }

        if (this.passengers[i].nationality === '') {
          this.passengers[i].error.nationality = this.$t(
            'general.NationalityRequired'
          )
        }

        if (this.passengers[i].age === '') {
          this.passengers[i].error.age = this.$t('general.AgeRequired')
        }
      }
    },

    validateBilling() {
      for (const keyError in this.billingData.error) {
        this.billingData.error[keyError] = ''
      }

      if (this.billingData.name === '') {
        this.billingData.error.name = this.$t('hotel.BillingNameRequired')
      }

      if (this.billingData.country === '') {
        this.billingData.error.country = this.$t('hotel.CountryRequired')
      }

      if (this.billingData.postalCode === '') {
        this.billingData.error.postalCode = this.$t('hotel.ZipCodeRequired')
      }

      if (this.billingData.city === '') {
        this.billingData.error.city = this.$t('hotel.CityRequired')
      }

      if (this.billingData.address === '') {
        this.billingData.error.address = this.$t('hotel.AddressRequired')
      }
    },
    validateQuestions() {
      if (this.questions.length > 0) {
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].question.error =
            this.questions[i].question.answer.length === 0
        }
      }
    },
    changeAddedTravelCard() {
      let tc = this.travelCard.replace('EUR', '').trim()
      if (tc !== '') {
        if (this.tcBalance > 0) {
          tc = parseInt(tc)
          if (isNaN(tc)) {
            this.travelCard = '0'
          } else if (tc > this.getTotalPrice) {
            this.travelCard = this.getTotalPrice + ''
          } else if (tc > this.tcBalance) {
            this.travelCard = this.tcBalance + ''
          }
        } else {
          this.travelCard = '0'
        }
      }
      this.updateProgramHandlingFee()
      return false
    },
    async pay() {
      if (this.isLoading) {
        return
      }

      this.validateBeforePay()

      if (!this.isLoggedIn) {
        window.location.reload()
      } else if (this.activePaymentButton) {
        this.isLoading = true

        const parsedPassengers = {
          adults: [],
          children: []
        }

        for (let i = 0; i < this.passengers.length; i++) {
          if (this.passengers[i].firstName !== '') {
            if (!this.passengers[i].adult) {
              parsedPassengers.children.push({
                title: this.titleSelect[this.passengers[i].title],
                firstname: this.passengers[i].firstName,
                lastname: this.passengers[i].lastName,
                age: this.passengers[i].age
              })
            } else {
              parsedPassengers.adults.push({
                title: this.titleSelect[this.passengers[i].title],
                firstname: this.passengers[i].firstName,
                lastname: this.passengers[i].lastName,
                age: this.passengers[i].age
              })
            }
          }
        }

        const parsedBilling = {
          name: this.billingData.name,
          country: CountryList.countryIdFullName[this.billingData.country + 1],
          city: this.billingData.city,
          address: this.billingData.address,
          postalCode: this.billingData.postalCode,
          tax: this.billingData.tax
        }
        let cartResp
        try {
          cartResp = await this.$store.dispatch('program/payCart', {
            paymenttype: this.paymentType,
            search_id: this.cartCache.offerData.search_id,
            activity_id: this.cartCache.offerData.activity_id,
            rate_key: this.cartCache.offerData.rate_key,
            fromDate: this.cartCache.offerData.date_from,
            toDate: this.cartCache.offerData.date_to,
            tc: this.getAddedTravelCard,
            billing: parsedBilling,
            passengers: parsedPassengers,
            save_billing: this.saveBillingData,
            lang: this.$i18n.locale,
            questions: this.questions
          })
        } catch (error) {
          this.isLoading = false
          if (error.response !== undefined) {
            const serverMessage = await error.response.json()
            this.$store.dispatch('general/showSnackbar', {
              message: serverMessage.messages || 'Unknown error'
            })
          }
        }
        if (cartResp) {
          this.isLoading = false
          if (cartResp.status === 'PERMISSION') {
            this.permissionNeeded = cartResp.permission_needed
            this.permissionModalActive = true
          } else if (cartResp.status === 'NOT_ENOUGH_HC') {
            this.hcErrorModalActive = true
          } else if (cartResp.status === 'NOT_ENOUGH_BPO') {
            this.bpoErrorModalActive = true
          } else if (cartResp.status === 'SAVE_BILLING_DATA_ERROR') {
            this.billingDataErrorModalActive = true
          } else if (cartResp.status === 'PAYMENT_SUCCESS') {
            await this.$router.replace(
              this.localePath('/program/reservation-success')
            )
          } else if (cartResp.status === 'PAYMENT_FAILED') {
            await this.$router.replace(
              this.localePath('/program/reservation-failed')
            )
          } else if (
            cartResp.status === 'FORWARD' &&
            (cartResp.forwardURL !== undefined ||
              cartResp.popupHTML !== undefined)
          ) {
            if (cartResp.paymentType === 'NMI') {
              this.nmiPopup = cartResp.popupHTML
              this.nmiPopupActive = true
            } else if (cartResp.forwardURL !== undefined) {
              window.location.href = cartResp.forwardURL
            } else {
              this.$store.dispatch('general/showSnackbar', {
                message: this.$t('hotel.HotelBookingDataError')
              })
            }
          } else {
            this.$store.dispatch('general/showSnackbar', {
              message: this.$t('hotel.HotelBookingDataError')
            })
          }
        }
      }
    },
    async updateProgramHandlingFee() {
      if (this.getAddedTravelCard > 0) {
        let handlingFeeRes
        try {
          handlingFeeRes = await this.$store.dispatch(
            'hotel/getHotelHandlingFee',
            {
              sum: this.getTotalPrice,
              tc: this.getAddedTravelCard
            }
          )
        } catch (error) {
          this.handlingFee = getHandlingFee(
            this.getTotalPrice - this.getAddedTravelCard,
            'hotel'
          )
        }
        if (handlingFeeRes && handlingFeeRes.bankComission !== undefined) {
          this.handlingFee = handlingFeeRes.bankComission
        }
      } else {
        this.handlingFee = getHandlingFee(
          this.getTotalPrice - this.getAddedTravelCard,
          'hotel'
        )
      }
    },
    copyAdult1DataToBillingData() {
      if (!this.copyAdult1) {
        this.billingData.name = ''
        this.billingData.country = ''
        this.billingData.postalCode = ''
        this.billingData.city = ''
        this.billingData.address = ''
        this.billingData.tax = ''
      } else {
        this.billingData.name = this.props.BILLING_NAME
        this.billingData.country = parseInt(this.props.BILLING_COUNTRY) - 1
        this.billingData.postalCode = this.props.BILLING_ZIPCODE
        this.billingData.city = this.props.BILLING_CITY
        this.billingData.address = this.props.BILLING_STREET
      }
    },
    purgeCache() {
      this.hcErrorModalActive = false
      this.bpoErrorModalActive = false
      this.$router.push(this.localePath('/'))
    },
    formatStartPointText(startPoint, index) {
      let text = ''

      if (index !== undefined) {
        text += index + 1 + '. '
      }

      if (
        startPoint.meetingPoint.country !== undefined &&
        startPoint.meetingPoint.country.length > 0
      ) {
        text += startPoint.meetingPoint.country
      }

      if (
        startPoint.meetingPoint.zip !== undefined &&
        startPoint.meetingPoint.zip.length > 0
      ) {
        if (text.length > 0) {
          text += ', '
        }
        text += startPoint.meetingPoint.zip
      }

      if (
        startPoint.meetingPoint.city !== undefined &&
        startPoint.meetingPoint.city.length > 0
      ) {
        if (text.length > 0) {
          text += ', '
        }
        text += startPoint.meetingPoint.city
      }

      if (
        startPoint.meetingPoint.address !== undefined &&
        startPoint.meetingPoint.address.length > 0
      ) {
        if (text.length > 0) {
          text += ', '
        }
        text += startPoint.meetingPoint.address
      }
      if (
        startPoint.pickupInstructions !== undefined &&
        startPoint.pickupInstructions.length > 0
      ) {
        if (text.length > 0) {
          text += ' ( '
        }

        text += startPoint.pickupInstructions

        if (text.length > 0) {
          text += ' )'
        }
      }

      return text
    },
    formatEndPointText(endPoint) {
      let text = ''
      if (endPoint.type !== undefined && endPoint.type.length > 0) {
        text += endPoint.type
      }
      return text
    }
  }
}
</script>

<style scoped>
.arrow-down {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 20px solid;
}

.border-t-grey-light {
  border-top-color: #e8eaec;
}

.border-t-white {
  border-top-color: #fefefe;
}

.ff-currency.cart {
  @apply w-20;
  @apply h-20;
}
</style>
