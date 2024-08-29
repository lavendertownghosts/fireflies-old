<template>
  <div v-if="offer !== undefined">
    <div class="bg-primary-gradient">
      <div
        class="flex flex-row items-center justify-between px-16 py-24 lg:py-18 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="hidden md:block md:flex-initial md:mr-16">
          <img src="~assets/images/thematic-header.svg" class="w-60 h-60" />
        </div>

        <div class="flex-grow leading-32 md:leading-24">
          <div class="flex flex-wrap">
            <div class="mr-4">
              {{ offer.hotelname }}
            </div>
          </div>
          <div
            v-if="offer.redeemdatelimit"
            class="hidden md:block md:mt-2 text-sm leading-14"
          >
            {{
              $t('thematic.redemptionPeriod', {
                redemption: this.$options.filters.formatDateDisplay(
                  offer.redeemdatelimit
                )
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
      <div
        class="flex flex-row mt-4 cursor-pointer"
        @click="$router.push(localePath('/'))"
      >
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
          <StatusMessage :type="'warning'" class="mt-16 leading-20">
            {{ $t('thematic.CartMessage' + offer.offerType.replace(/-/g, '')) }}
          </StatusMessage>
          <ServicePreview
            :image-url="'/images/hotel-details-default-img.svg'"
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
                ? Math.ceil(parseFloat(offer.price.EUR))
                : false
            "
            :bpo="
              acceptedBookingInformation &&
              parseInt(offer.calculatedpriceBPO) > 0
                ? parseInt(offer.calculatedpriceBPO)
                : false
            "
            :active="activeCard === 'bookingInformation'"
            :help="$t('hotel.BookingInformationAccept')"
            class="mt-24"
            @showCartCard="showCartCard('bookingInformation')"
          >
            <div class="p-16 flex flex-wrap">
              <div class="w-full mb-16 md:mb-0  md:pr-8 md:w-1/2">
                <GalleryBox :images="calcPictures" />
              </div>
              <div class="w-full md:pl-8 md:w-1/2">
                <div class="font-bold cursor-pointer leading-16 text-base">
                  {{ $t('hotel.AboutTheHotel') }}
                </div>
                <div class="mt-8">
                  <span>
                    {{ offer.hoteldesc }}
                  </span>
                </div>
              </div>
            </div>
            <div class="px-16 pb-16">
              <div class="font-bold cursor-pointer leading-16 text-base">
                {{ $t('thematic.RedeemDescription') }}
              </div>
              <div class="my-8">
                {{ offer.customredeemdesc }}
              </div>
            </div>
            <div
              v-if="offer.phone || offer.email || offer.web"
              class="px-16 pb-16 flex flex-wrap"
            >
              <div class="font-bold cursor-pointer w-full leading-16 text-base">
                {{ $t('hotel.Contacts') }}
              </div>
              <div class="mt-8 mb-8">
                <div v-if="offer.phone">
                  <span class="font-bold">{{ $t('hotel.Phone') }}:</span>
                  {{ offer.phone }}
                </div>
                <div v-if="offer.email">
                  <span class="font-bold">{{ $t('thematic.Email') }}:</span>
                  {{ offer.email }}
                </div>
                <div v-if="offer.web">
                  <span class="font-bold">{{ $t('thematic.Website') }}:</span>
                  {{ offer.web }}
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
                          :error="item.lastNameError ? item.lastNameError : ''"
                          :placeholder="
                            item.lastNameError ? $t('general.LastName') : ''
                          "
                        />
                      </div>
                      <div class="pl-8 xl:w-240">
                        <InputText
                          v-model="item.firstName"
                          :class="'w-full'"
                          :label="$t('general.FirstName')"
                          :error="
                            item.firstNameError ? item.firstNameError : ''
                          "
                          :placeholder="
                            item.firstNameError ? $t('general.FirstName') : ''
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-row mt-24 xl:mt-12 xl:ml-16">
                    <div v-if="item.selectedYear" class="ml-16 w-84">
                      <InputDropdown
                        v-model="item.selectedYear"
                        :values="yearSelect"
                        :label="$t('general.Age')"
                        :helper="$t('general.AgeHelper')"
                      ></InputDropdown>
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
                    <InputDropdownCountry
                      v-model="billingData.country"
                      :label="$t('general.Country')"
                      class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                    ></InputDropdownCountry>
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
            :image-url="false"
            :date-text="dateText"
            :hotel-text="offer.hotelname"
            :hotel-stars="parseInt(offer.hotelstar)"
            :room-text="
              offer.roomtypedesc + ', ' + getBoardName(offer.services)
            "
            :cancellation-text="
              ['flashsale', 'superflashsale'].includes(offer.offerType)
                ? formatDateDisplay(offer.bookingdatelimit)
                : false
            "
            :guest-text="getGuestText(offer.adultcount, offer.childrencount)"
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
                <div v-show="getBPONum > 0">
                  <span class="pr-6 lg:pr-0 xl:pr-6">{{ getBPONum }}</span
                  ><span class="ff-currency bg-black cart"></span
                  ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span
                  ><span
                    v-show="offer.price.EUR > 0"
                    class="pr-6 lg:pr-0 xl:pr-6"
                    >+</span
                  >
                </div>
                <div v-show="offer.price.EUR > 0">
                  EUR
                  {{
                    Math.ceil(parseFloat(offer.price.EUR))
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
              <div class="flex w-full items-center justify-center">
                <div class="arrow-down border-t-grey-light"></div>
              </div>
              <label
                class="block text-black text-xs font-bold leading-12 mt-16"
                >{{ $t('thematic.PayWitHC') }}</label
              >
              <InputText
                v-model="holidayCoupon"
                input-type="number"
                :class="'w-full'"
                :is-dark="false"
                :input-props="{
                  min: 0,
                  max:
                    availableCoupons > offer.calculatedpriceBPO
                      ? offer.calculatedpriceBPO
                      : availableCoupons
                }"
                @change="changeAddedHC"
              />

              <div class="text-xs mt-4 leading-12 text-grey-dark">
                {{ $t('thematic.CurrentHC') }}:
                <span class="pr-4 lg:pr-0 xl:pr-4">{{
                  availableCoupons
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}</span
                ><span class="ff-currency bg-black"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">HC</span>
              </div>
              <label
                class="block text-black text-xs font-bold leading-12 mt-16"
                >{{ $t('thematic.PayWithBPO') }}</label
              >
              <InputText
                v-model="bestPriceOption"
                input-type="number"
                :class="'w-full'"
                :is-dark="false"
                :input-props="{
                  min: 0,
                  max:
                    availableBPO > offer.calculatedpriceBPO
                      ? offer.calculatedpriceBPO
                      : availableBPO
                }"
                @change="changeAddedBPO"
              />

              <div class="text-xs mt-4 leading-12 text-grey-dark">
                {{ $t('thematic.CurrentBPO') }}:
                <span class="pr-4 lg:pr-0 xl:pr-4">{{
                  availableBPO
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}</span
                ><span class="ff-currency bg-black"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span>
              </div>
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
                v-show="
                  holidayCoupon > 0 ||
                    bestPriceOption > 0 ||
                    getAddedTravelCard > 0
                "
                class="text-sm leading-14 font-bold mt-16"
              >
                {{ $t('general.PayWithTC') }}
              </div>
              <div
                v-show="
                  holidayCoupon > 0 ||
                    bestPriceOption > 0 ||
                    getAddedTravelCard > 0
                "
                class="flex flex-row text-3x leading-20 font-bold mt-4"
              >
                <div v-show="holidayCoupon > 0">
                  <span class="pr-6 lg:pr-0 xl:pr-6">{{ holidayCoupon }}</span
                  ><span class="ff-currency bg-white cart"></span
                  ><span class="pr-6 lg:pr-0 xl:pr-6">HC</span
                  ><span
                    v-show="bestPriceOption > 0 || getAddedTravelCard > 0"
                    class="pr-6 lg:pr-0 xl:pr-6"
                    >+</span
                  >
                </div>
                <div v-show="bestPriceOption > 0">
                  <span class="pr-6 lg:pr-0 xl:pr-6">{{ bestPriceOption }}</span
                  ><span class="ff-currency bg-white cart"></span
                  ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span
                  ><span
                    v-show="getAddedTravelCard > 0"
                    class="pr-6 lg:pr-0 xl:pr-6"
                    >+</span
                  >
                </div>
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
                    (getBPONum > 0 || getAddedTravelCard > 0)
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
      v-show="hcBPOErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="purgeCache()"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('thematic.NotEnoughHCBPO') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="hcErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="purgeCache()"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('thematic.NotEnoughHC') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="bpoErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="purgeCache()"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('hotel.NotEnoughBPO') }}
        </div>
      </div>
    </InformativeModal>
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
    <CartBlockModal :covid-cart-block="cartBlock" @accept="cartBlock = false" />
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

import StatusMessage from '@/components/micro/StatusMessage'
import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import InputCheckbox from '@/components/micro/InputCheckbox'
import GalleryBox from '@/components/GalleryBox'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import InputTextMask from '@/components/micro/InputTextMask'

import InformativeModal from '@/components/modal/InformativeModal'
import CartBlockModal from '@/components/modal/CartBlockModal'

import NMIModal from '@/components/modal/NMIModal'

import {
  capitalize,
  formatDateDisplay,
  calcNights,
  getHandlingFee,
  getBoardName,
  getGuestText
} from '@/includes/utils'

export default {
  name: 'ThematicCartPage',
  middleware: 'auth_needed',
  components: {
    StatusMessage,
    CartCard,
    ServicePreview,
    InputCheckbox,
    GalleryBox,
    InputDropdown,
    InputDropdownCountry,
    InputText,
    InputTextMask,
    InformativeModal,
    CartBlockModal,
    NMIModal
  },
  async asyncData({ store, route }) {
    let availableCoupons = 0
    let availableBPO = 0
    let hcBPOErrorModalActive = false

    let responses
    try {
      responses = await Promise.all([
        store.dispatch('user/getBestPriceOptions'),
        store.dispatch('user/getCoupons'),
        store.dispatch('thematic-offers/getOffer', {
          offerid: parseInt(route.params.id)
        }),
        store.dispatch('user/getPersonalData')
      ])
    } catch (e) {
      console.log(e)
    }

    const [resBPO, resCoupons, offer, props] = responses

    availableBPO = resBPO.available
    if (resCoupons && resCoupons.availableCoupons) {
      availableCoupons = resCoupons.availableCoupons
    }
    if (availableBPO + availableCoupons < offer.calculatedpriceBPO) {
      hcBPOErrorModalActive = true
    }

    return {
      availableBPO,
      availableCoupons,
      offer,
      props,
      hcBPOErrorModalActive
    }
  },
  data() {
    return {
      activeCard: 'bookingInformation',
      openedCard: {
        bookingInformation: false,
        insurance: false,
        passengers: false,
        billing: false
      },
      acceptedBookingInformation: false,
      acceptedPassengers: false,
      acceptedBilling: false,
      passengers: [],
      copyAdult1: false,
      saveBillingData: false,
      titleSelect: ['Mr', 'Mrs'],
      yearSelect: [
        this.$t('general.Newborn'),
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17'
      ],
      billingData: {
        name: '',
        country: '',
        postalCode: '',
        city: '',
        address: '',
        tax: '',
        error: {
          name: '',
          country: '',
          postalCode: '',
          city: '',
          address: '',
          tax: ''
        }
      },
      travelCard: 'EUR 0',
      isLoading: false,
      holidayCoupon: 0,
      bestPriceOption: 0,
      handlingFee: 0,
      hcErrorModalActive: false,
      bpoErrorModalActive: false,
      permissionModalActive: false,
      billingDataErrorModalActive: false,
      cartBlock: false,
      nmiPopupActive: false,
      nmiPopup: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isLoggedIn']),
    getBPONum() {
      return this.offer.calculatedpriceBPO !== undefined
        ? this.offer.calculatedpriceBPO
        : 0
    },
    getTotalPrice() {
      return Math.ceil(parseFloat(this.offer.price.EUR))
    },
    calcPictures() {
      return this.offer.pictures
        .slice(0)
        .sort((a, b) => (a.lead === false && b.lead === true ? 1 : -1))
        .map((o) => o.picurl)
    },
    passengerDataStatus() {
      if (!this.openedCard.passengers) {
        return 'default'
      }
      for (const passanger of this.passengers) {
        if (passanger.firstNameError || passanger.lastNameError) {
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
      if (this.offer.checkin !== null && this.offer.checkout !== null) {
        return (
          formatDateDisplay(this.offer.checkin) +
          ' - ' +
          formatDateDisplay(this.offer.checkout) +
          '<br class="hidden md:block xl:hidden" /><span class="text-grey-dark"> (' +
          calcNights(this.offer.checkin, this.offer.checkout) +
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
        this.billingDataStatus === 'success'
      ) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.isLoading = false
    if (this.offer === false) {
      this.$router.push(this.localePath('/'))
      this.$store.dispatch('general/showSnackbar', {
        message: this.$t('hotel.EmptyCart')
      })
    }
    if (this.offer.calculatedpriceBPO > 0) {
      if (this.availableCoupons > 0) {
        this.holidayCoupon = Math.min(
          this.availableCoupons,
          this.offer.calculatedpriceBPO
        )
      }
      if (this.availableBPO > 0) {
        this.bestPriceOption = Math.min(
          this.availableBPO,
          this.offer.calculatedpriceBPO - this.holidayCoupon
        )
      }
    }

    this.$store.dispatch('user/updateFees')

    for (let i = 0; i < parseInt(this.offer.adultcount); i++) {
      this.passengers.push({
        passenger: capitalize(this.$t('general.Adult'), true) + ' ' + (i + 1),
        key: 'passenger' + i,
        title: 0,
        firstName: i === 0 ? this.firstName : '',
        lastName: i === 0 ? this.lastName : '',
        firstNameError: false,
        lastNameError: false
      })
    }
    if (parseInt(this.offer.childrencount) > 0) {
      for (let i = 0; i < parseInt(this.offer.childrencount); i++) {
        this.passengers.push({
          passenger: capitalize(this.$t('general.Child'), true) + ' ' + (i + 1),
          key: 'passenger' + (parseInt(this.offer.adultcount) + i),
          title: 0,
          firstName: '',
          lastName: '',
          firstNameError: false,
          lastNameError: false,
          age: 0
        })
      }
    }

    this.billingData = {
      name: this.props.BILLING_NAME || '',
      country: this.props.BILLING_COUNTRY || '',
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
    this.updateHotelHandlingFee()
  },
  methods: {
    ...mapActions('thematic-offers', ['payCart']),
    getBoardName,
    formatDateDisplay,
    getGuestText,
    showCartCard(index) {
      if (this.openedCard[this.activeCard] === false) {
        this.openedCard[this.activeCard] = true
      }

      if (this.activeCard !== false) {
        if (this.activeCard.includes('passenger')) {
          this.validatePassenger()
        } else if (this.activeCard === 'billing') {
          this.validateBilling()
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

      this.openedCard.bookingInformation = true
      this.openedCard.passengers = true
      this.openedCard.billing = true
      this.openedCard.insurance = true

      for (const passanger of this.passengers) {
        if (passanger.firstNameError || passanger.lastNameError) {
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
    validatePassenger(key) {
      for (let i = 0; i < this.passengers.length; i++) {
        this.passengers[i].firstNameError = ''
        this.passengers[i].lastNameError = ''

        // FirstName validation
        if (this.passengers[i].firstName === '') {
          this.passengers[i].firstNameError = this.$t('hotel.FirstNameRequired')
        } else if (!/^[\x20-\x7E]+$/.test(this.passengers[i].firstName)) {
          this.passengers[i].firstNameError = this.$t(
            'hotel.FirstNamePatternError'
          )
        }

        // LastName validation
        if (this.passengers[i].lastName === '') {
          this.passengers[i].lastNameError = this.$t('hotel.LastNameRequired')
        } else if (!/^[\x20-\x7E]+$/.test(this.passengers[i].lastName)) {
          this.passengers[i].lastNameError = this.$t(
            'hotel.LastNamePatternError'
          )
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
      this.updateHotelHandlingFee()
    },
    changeAddedHC() {
      if (parseInt(this.holidayCoupon) > this.offer.calculatedpriceBPO) {
        this.holidayCoupon = this.offer.calculatedpriceBPO
        return
      }
      if (parseInt(this.bestPriceOption) > this.offer.calculatedpriceBPO) {
        this.bestPriceOption = this.offer.calculatedpriceBPO
        return
      }
      if (parseInt(this.holidayCoupon) < 0) {
        this.holidayCoupon = 0
        this.bestPriceOption = this.offer.calculatedpriceBPO
        return
      }
      this.bestPriceOption = this.offer.calculatedpriceBPO - this.holidayCoupon
    },
    changeAddedBPO() {
      if (parseInt(this.holidayCoupon) > this.offer.calculatedpriceBPO) {
        this.holidayCoupon = this.offer.calculatedpriceBPO
        this.bestPriceOption = 0
        return
      }
      if (parseInt(this.bestPriceOption) > this.offer.calculatedpriceBPO) {
        this.bestPriceOption = this.offer.calculatedpriceBPO
        this.holidayCoupon = 0
        return
      }
      if (parseInt(this.bestPriceOption) < 0) {
        this.bestPriceOption = 0
        this.holidayCoupon = this.offer.calculatedpriceBPO
        return
      }
      this.holidayCoupon = this.offer.calculatedpriceBPO - this.bestPriceOption
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

        const parsedPassangers = []
        for (let i = 0; i < this.passengers.length; i++) {
          parsedPassangers.push({
            title: this.titleSelect[this.passengers[i].title],
            firstname: this.passengers[i].firstName,
            lastname: this.passengers[i].lastName,
            age:
              this.passengers[i].age !== undefined &&
              this.passengers[i].age >= 0
                ? this.passengers[i].age
                : 30
          })
        }

        const parsedBilling = {
          name: this.billingData.name,
          country: this.billingData.country,
          city: this.billingData.city,
          address: this.billingData.address,
          postalCode: this.billingData.postalCode,
          tax: this.billingData.tax
        }
        let cartResp
        try {
          cartResp = await this.payCart({
            offerid: parseInt(this.$route.params.id),
            bpoCount: parseInt(this.bestPriceOption),
            hcCount: parseInt(this.holidayCoupon),
            tc: this.getAddedTravelCard,
            billing: parsedBilling,
            passengers: parsedPassangers,
            save_billing: this.saveBillingData,
            lang: this.$i18n.locale
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
              this.localePath('/thematic-offers/reservation-success')
            )
          } else if (cartResp.status === 'PAYMENT_FAILED') {
            await this.$router.replace(
              this.localePath('/thematic-offers/reservation-failed')
            )
          } else if (cartResp.status === 'FORWARD') {
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
    async updateHotelHandlingFee() {
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
        getHandlingFee(this.getTotalPrice - this.getAddedTravelCard, 'hotel')
      }
    },
    copyAdult1DataToBillingData() {
      if (this.copyAdult1) {
        this.billingData.name =
          this.passengers[0].firstName + ' ' + this.passengers[0].lastName
        this.billingData.country = ''
        this.billingData.postalCode = ''
        this.billingData.city = ''
        this.billingData.address = ''
        this.billingData.tax = ''
      }
    },
    purgeCache() {
      this.hcErrorModalActive = false
      this.bpoErrorModalActive = false
      this.$router.push(this.localePath('/'))
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
