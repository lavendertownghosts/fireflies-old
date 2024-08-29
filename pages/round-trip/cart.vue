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
              {{ offer.title }}
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
            {{ $t('roundtrip.ReservationTitle') }}
          </div>
          <StatusMessage :type="'warning'" class="mt-16 leading-20">
            {{ $t('roundtrip.CartMessagePart1') }}<br /><br />
            {{ $t('roundtrip.CartMessagePart2') }}
            <br /><br />
            <span class="font-bold uppercase">{{
              $t('roundtrip.CartMessagePart3')
            }}</span
            >: {{ $t('roundtrip.CartMessagePart4') }}
            <nuxt-link :to="localePath('/support')" class="link">{{
              $t('general.Support')
            }}</nuxt-link>
            {{ $t('roundtrip.CartMessagePart5') }}
          </StatusMessage>
          <ServicePreview
            :image-url="offer.featuredImage"
            :date-text="dateText"
            :room-text="offer.availabilityData.title"
            :guest-text="
              getGuestText(
                offer.request.passengers.adults,
                offer.request.passengers.children
              )
            "
            :cancellation-text="getCancellationText()"
            :pickup-text="getPickupText(offer.pickupId)"
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
            :title="$t('roundtrip.BookingInformation')"
            :price="acceptedBookingInformation ? getTotalPrice : false"
            :bpo="
              acceptedBookingInformation && parseInt(bestPriceOption) > 0
                ? bestPriceOption
                : false
            "
            :active="activeCard === 'bookingInformation'"
            :help="$t('roundtrip.BookingInformationAccept')"
            class="mt-24"
            @showCartCard="showCartCard('bookingInformation')"
          >
            <div class="p-16 flex flex-wrap">
              <div class="w-full">
                <div class="font-bold leading-16 text-base">
                  {{ $t('roundtrip.AboutTheRoundTrip') }}
                </div>
                <div class="mt-8">
                  <span>
                    {{ offer.summary }}
                  </span>
                </div>
              </div>
            </div>
            <div class="px-16 pb-16">
              <div class="font-bold leading-16 text-base">
                {{ $t('roundtrip.PleaseNote') }}
              </div>
              <div class="my-8" v-html="offer.remarks.attention"></div>
            </div>
            <div class="bg-grey-light h-1"></div>
            <div class="pb-12 mb-4 pl-16 pt-16">
              <InputCheckbox
                v-model="acceptedBookingInformation"
                :has-error="
                  openedCard.bookingInformation && !acceptedBookingInformation
                "
              >
                <div class="text-sm leading-14 sm:leading-20">
                  {{ $t('roundtrip.BookingInformationConfirm') }}
                </div>
              </InputCheckbox>
            </div>
          </CartCard>

          <CartCard
            id="passengers"
            :type="passengerDataStatus"
            :title="$t('roundtrip.GuestDetails')"
            :help="$t('roundtrip.GuestDetailsHelp')"
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
                <div class="flex flex-col">
                  <div class="flex flex-col sm:flex-row lg:w-8/12">
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
                          :placeholder="$t('general.LastName')"
                        />
                      </div>
                      <div class="pl-8 xl:w-240">
                        <InputText
                          v-model="item.firstName"
                          :class="'w-full'"
                          :label="$t('general.FirstName')"
                          :error="item.error.firstName"
                          :placeholder="$t('general.FirstName')"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col sm:flex-row mt-21 lg:w-8/12">
                    <div class="flex sm:w-177 sm:pr-8 md:w-7/12">
                      <InputDropdownCountry
                        v-model="item.nationality"
                        :error="item.error.nationality"
                        :label="$t('roundtrip.Nationality')"
                        :placeholder="$t('general.PleaseSelect')"
                        class="w-full"
                      />
                    </div>
                    <div class="flex mt-24 sm:mt-0 sm:pl-8 md:w-5/12">
                      <InputDate
                        v-model="item.birthday"
                        :disable-past="false"
                        :label="$t('general.BirthDate')"
                        class="flex flex-wrapper w-full"
                        :error="item.error.birthday"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col mt-24 sm:flex-row lg:w-8/12">
                    <div class="flex w-full sm:pr-8 sm:w-177 md:w-7/12">
                      <InputText
                        v-model="item.passportID"
                        :label="$t('general.PassportId')"
                        :error="item.error.passportID"
                        class="w-full"
                      />
                    </div>
                    <div
                      class="flex w-full mt-21 sm:w-auto sm:mt-0 sm:pl-8 md:w-5/12"
                    >
                      <InputDate
                        v-model="item.passportExpire"
                        :disable-past="false"
                        :label="$t('general.PassportExpire')"
                        class="flex flex-wrapper w-full"
                        :error="item.error.passportExpire"
                      />
                    </div>
                  </div>
                  <div
                    v-if="
                      offer.bookingQuestion !== undefined &&
                        offer.bookingQuestion.length > 0
                    "
                    v-show="false"
                  >
                    <div
                      v-for="(bookingQuestion,
                      bookingQuestionKey) in offer.bookingQuestion"
                      :key="bookingQuestionKey"
                      class="mt-24 lg:w-8/12"
                    >
                      <div
                        v-if="
                          bookingQuestion.dataType === 'OPTIONS' ||
                            (bookingQuestion.dataType === 'SHORT_TEXT' &&
                              bookingQuestion.options.length > 0)
                        "
                      >
                        <InputDropdown
                          v-model="
                            item['bookingQuestion_' + bookingQuestion.id]
                          "
                          :error="
                            item.error['bookingQuestion_' + bookingQuestion.id]
                          "
                          :values="
                            getBookingQuestionOptions(bookingQuestion.options)
                          "
                          :label="bookingQuestion.label"
                          :placeholder="$t('general.PleaseSelect')"
                          class="w-full"
                        />
                      </div>
                      <div
                        v-else-if="bookingQuestion.dataType === 'SHORT_TEXT'"
                      >
                        <InputText
                          v-model="
                            item['bookingQuestion_' + bookingQuestion.id]
                          "
                          :error="
                            item.error['bookingQuestion_' + bookingQuestion.id]
                          "
                          :label="bookingQuestion.label"
                          class="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CartCard>
          <CartCard
            id="customer"
            :type="customerDataStatus"
            :title="$t('roundtrip.CustomerDetails')"
            :help="$t('roundtrip.CustomerDetailsHelp')"
            :active="activeCard === 'customer'"
            class="mt-24"
            @showCartCard="showCartCard('customer')"
          >
            <div class="px-16 pt-18 pb-20 mb-4">
              <InputCheckbox
                v-model="copyAdult1ToContact"
                @input="copyAdult1DataToContactData"
              >
                <div class="text-sm leading-14 pt-2">
                  {{ $t('general.BillingSameAsAdult1') }}
                </div>
              </InputCheckbox>
              <div class="mt-24 pt-24 border-t border-grey-light">
                <div class="flex flex-col">
                  <div class="flex flex-col sm:flex-row lg:w-8/12">
                    <div class="w-84">
                      <InputDropdown
                        v-model="customer.title"
                        :values="titleSelect"
                        :label="$t('general.Title')"
                        class="mt-12"
                      ></InputDropdown>
                    </div>
                    <div class="flex flex-row mt-24 sm:mt-12 sm:pl-16">
                      <div class="pr-8 xl:w-240">
                        <InputText
                          v-model="customer.lastName"
                          :class="'w-full'"
                          :label="$t('general.LastName')"
                          :error="
                            customer.error.lastName
                              ? customer.error.lastName
                              : ''
                          "
                          :placeholder="$t('general.LastName')"
                        />
                      </div>
                      <div class="pl-8 xl:w-240">
                        <InputText
                          v-model="customer.firstName"
                          :class="'w-full'"
                          :label="$t('general.FirstName')"
                          :error="customer.error.firstName"
                          :placeholder="$t('general.FirstName')"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col sm:flex-row mt-21 lg:w-8/12">
                    <div class="flex sm:w-177 sm:pr-8 md:w-7/12">
                      <InputDropdownCountry
                        v-model="customer.nationality"
                        :error="customer.error.nationality"
                        :label="$t('roundtrip.Nationality')"
                        :placeholder="$t('general.PleaseSelect')"
                        class="w-full"
                      />
                    </div>
                    <div class="flex mt-24 sm:mt-0 sm:pl-8 md:w-5/12">
                      <InputDate
                        v-model="customer.birthday"
                        :disable-past="false"
                        :label="$t('general.BirthDate')"
                        class="flex flex-wrapper w-full"
                        :error="customer.error.birthday"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col mt-24 sm:flex-row lg:w-8/12">
                    <div class="flex w-full sm:pr-8 sm:w-177 md:w-7/12">
                      <InputText
                        v-model="customer.passportID"
                        :label="$t('general.PassportId')"
                        :error="customer.error.passportID"
                        class="w-full"
                      />
                    </div>
                    <div
                      class="flex w-full mt-21 sm:w-auto sm:mt-0 sm:pl-8 md:w-5/12"
                    >
                      <InputDate
                        v-model="customer.passportExpire"
                        :disable-past="false"
                        :label="$t('general.PassportExpire')"
                        class="flex flex-wrapper w-full"
                        :error="customer.error.passportExpire"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <InputText
                      v-model="customer.company"
                      :label="$t('roundtrip.Company')"
                      :error="customer.error.company"
                      class="w-grid-sm mt-21"
                    />
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
            :image-url="offer.featuredImage"
            :date-text="dateText"
            :room-text="offer.availabilityData.title"
            :guest-text="
              getGuestText(
                offer.request.passengers.adults,
                offer.request.passengers.children
              )
            "
            :cancellation-text="getCancellationText()"
            :pickup-text="getPickupText(offer.pickupId)"
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
                <div v-show="bestPriceOption > 0">
                  <span class="pr-6 lg:pr-0 xl:pr-6">{{ bestPriceOption }}</span
                  ><span class="pr-6 lg:pr-0 xl:pr-6">
                    <img
                      class="-mt-7 inline"
                      src="~static/images/bpo-logo.svg"/></span
                  ><span
                    v-show="
                      offer.total[parseInt(bestPriceOption)][currency] > 0
                    "
                    class="pr-6 lg:pr-0 xl:pr-6"
                    >+</span
                  >
                </div>
                <div
                  v-show="offer.total[parseInt(bestPriceOption)][currency] > 0"
                >
                  {{ currency }}
                  {{
                    Math.ceil(
                      parseFloat(
                        offer.total[parseInt(bestPriceOption)][currency]
                      )
                    )
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
                >{{ $t('roundtrip.PayWithBPO') }}</label
              >
              <InputText
                v-model="bestPriceOption"
                input-type="number"
                :class="'w-full'"
                :is-dark="false"
                :input-props="{
                  min: 0,
                  max: availableBPO > getMaxBPONum ? getMaxBPONum : availableBPO
                }"
                @change="updateHandlingFee"
              />

              <div class="text-xs mt-4 leading-12 text-grey-dark">
                {{ $t('roundtrip.CurrentBPO') }}:
                <span class="pr-4 lg:pr-0 xl:pr-4">{{
                  availableBPO
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}</span
                ><span class="pr-6 lg:pr-0 xl:pr-6">
                  <img class="-mt-7 inline" src="~static/images/bpo-logo.svg"
                /></span>
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
                {{ $t('general.CurrentTC') }}: {{ currency }}
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
                <div class="arrow-down border-t-white w-0 h-0"></div>
              </div>
              <div
                v-show="bestPriceOption > 0 || getAddedTravelCard > 0"
                class="text-sm leading-14 font-bold mt-16"
              >
                {{ $t('general.PayWithTC') }}
              </div>
              <div
                v-show="bestPriceOption > 0 || getAddedTravelCard > 0"
                class="flex flex-row text-3x leading-20 font-bold mt-4"
              >
                <div v-show="bestPriceOption > 0">
                  <span class="pr-6 lg:pr-0 xl:pr-6">{{ bestPriceOption }}</span
                  ><span class="pr-6 lg:pr-0 xl:pr-6">
                    <img
                      class="-mt-7 inline"
                      src="~static/images/bpo-logo.svg"/></span
                  ><span
                    v-show="getAddedTravelCard > 0"
                    class="pr-6 lg:pr-0 xl:pr-6"
                    >+</span
                  >
                </div>
                <span v-show="getAddedTravelCard > 0">
                  {{ currency }}
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
                    (bestPriceOption > 0 || getAddedTravelCard > 0)
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
                    {{ currency }}
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
                    (+ {{ currency }}
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
      v-show="bpoErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="purgeCache()"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('roundtrip.NotEnoughBPO') }}
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
          {{ $t('roundtrip.BillingDataError') }}
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
import { lightFormat, differenceInYears } from 'date-fns'

import StatusMessage from '@/components/micro/StatusMessage'
import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputDropdown from '@/components/micro/InputDropdown'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputText from '@/components/micro/InputText'
import InputTextMask from '@/components/micro/InputTextMask'
import InputDate from '@/components/micro/InputDate'

import InformativeModal from '@/components/modal/InformativeModal'
import CartBlockModal from '@/components/modal/CartBlockModal'

import NMIModal from '@/components/modal/NMIModal'

import {
  capitalize,
  formatDateDisplay,
  calcNights,
  getHandlingFee,
  getBoardName,
  getGuestText,
  isEmail
} from '@/includes/utils'

export default {
  name: 'RoundTripCart',
  middleware: 'auth_needed',
  components: {
    StatusMessage,
    CartCard,
    ServicePreview,
    InputCheckbox,
    InputDropdown,
    InputDropdownCountry,
    InputText,
    InputTextMask,
    InformativeModal,
    CartBlockModal,
    InputDate,
    NMIModal
  },
  async asyncData({ app, store, route, redirect }) {
    let availableBPO = 0
    let offer = false

    let responses
    try {
      responses = await Promise.all([
        store.dispatch('user/getBestPriceOptions'),
        store.dispatch('user/getPersonalData')
      ])
    } catch (e) {
      redirect(app.localePath('index'))
    }

    if (store.state['round-trip'] && store.state['round-trip'].cartCache) {
      offer = store.state['round-trip'].cartCache
    }
    const [resBPO, props] = responses
    availableBPO = resBPO.available
    return {
      availableBPO,
      offer,
      props
    }
  },
  data() {
    return {
      activeCard: 'bookingInformation',
      openedCard: {
        bookingInformation: false,
        passengers: false,
        billing: false,
        customer: false
      },
      acceptedBookingInformation: false,
      acceptedPassengers: false,
      acceptedBilling: false,
      passengers: [],
      copyAdult1: true,
      copyAdult1ToContact: false,
      saveBillingData: false,
      bookingquestiondisabler: false,
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
      customer: {
        title: 0,
        firstName: '',
        lastName: '',
        nationality: '',
        birthday: '1980-01-01',
        passportID: '',
        passportExpire: '',
        company: '',
        error: {
          title: '',
          firstName: '',
          lastName: '',
          nationality: '',
          birthday: '',
          passportID: '',
          passportExpire: '',
          email: ''
        }
      },
      travelCard: 'EUR 0',
      isLoading: false,
      bestPriceOption: 0,
      handlingFee: 0,
      bpoErrorModalActive: false,
      permissionModalActive: false,
      billingDataErrorModalActive: false,
      cartBlock: false,
      currency: 'EUR',
      validationDate: false,
      nmiPopupActive: false,
      nmiPopup: false
    }
  },
  computed: {
    ...mapGetters('round-trip', ['cartCache']),
    ...mapGetters('user', ['getFees', 'isLoggedIn']),
    getMaxBPONum() {
      return Object.keys(this.offer.total).length - 1
    },
    getTotalPrice() {
      return Math.ceil(
        parseFloat(
          this.offer.total[parseInt(this.bestPriceOption)][this.currency]
        )
      )
    },
    passengerDataStatus() {
      if (!this.openedCard.passengers) {
        return 'default'
      }
      for (const passanger of this.passengers) {
        if (passanger.error.firstName || passanger.error.lastName) {
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
    customerDataStatus() {
      if (!this.openedCard.customer) {
        return 'default'
      }
      for (const keyError in this.customer.error) {
        if (this.customer.error[keyError] !== '') {
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
    birthday() {
      if (
        this.props.BIRTHDAY_YEAR !== null &&
        this.props.BIRTHDAY_YEAR !== undefined &&
        this.props.BIRTHDAY_YEAR !== '0000'
      ) {
        return (
          this.props.BIRTHDAY_YEAR +
          '-' +
          this.props.BIRTHDAY_MONTH +
          '-' +
          this.props.BIRTHDAY_DAY
        )
      } else {
        return '1980-01-01'
      }
    },
    dateText() {
      if (
        this.offer.availabilityData.date_from !== null &&
        this.offer.availabilityData.date_to !== null
      ) {
        return (
          formatDateDisplay(this.offer.availabilityData.date_from) +
          ' - ' +
          formatDateDisplay(this.offer.availabilityData.date_to) +
          '<br class="hidden md:block xl:hidden" /><span class="text-grey-dark"> (' +
          calcNights(
            this.offer.availabilityData.date_from,
            this.offer.availabilityData.date_to
          ) +
          ' ' +
          this.$t('roundtrip.Night') +
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
        message: this.$t('roundtrip.EmptyCart')
      })
    }

    this.$store.dispatch('user/updateFees')
    this.validationDate = new Date(this.offer.availabilityData.date_to)
    for (let i = 0; i < parseInt(this.offer.request.passengers.adults); i++) {
      const passengerData = {
        passenger: capitalize(this.$t('general.Adult'), true) + ' ' + (i + 1),
        key: 'passenger' + i,
        type: 'adult',
        title: 0,
        firstName: i === 0 ? this.firstName : '',
        lastName: i === 0 ? this.lastName : '',
        nationality: '',
        birthday: i === 0 ? this.birthday : '1980-01-01',
        passportID: '',
        passportExpire: this.offer.availabilityData.date_to,
        error: {
          nationality: '',
          firstName: '',
          lastName: '',
          birthday: '',
          passportID: '',
          passportExpire: ''
        }
      }
      if (
        this.offer.bookingQuestion !== undefined &&
        this.offer.bookingQuestion.length > 0
      ) {
        this.offer.bookingQuestion.forEach((bookingQuestion) => {
          passengerData['bookingQuestion_' + bookingQuestion.id] = ''
          passengerData.error['bookingQuestion_' + bookingQuestion.id] = ''
        })
      }
      this.passengers.push(passengerData)
    }
    for (let i = 0; i < parseInt(this.offer.request.passengers.children); i++) {
      const childBirthday = new Date(
        lightFormat(this.validationDate, 'yyyy-MM-dd')
      )
      childBirthday.setFullYear(
        childBirthday.getFullYear() -
          this.offer.request.passengers.childrenAges[i]
      )
      const passengerData = {
        passenger: capitalize(this.$t('general.Child'), true) + ' ' + (i + 1),
        key: 'passenger' + (this.offer.request.passengers.adults + i),
        type: 'child',
        title: 0,
        firstName: '',
        lastName: '',
        nationality: '',
        birthday: lightFormat(childBirthday, 'yyyy-MM-dd'),
        passportID: '',
        passportExpire: this.offer.availabilityData.date_to,
        error: {
          nationality: '',
          firstName: '',
          lastName: '',
          birthday: '',
          passportID: '',
          passportExpire: ''
        }
      }
      if (
        this.offer.bookingQuestion !== undefined &&
        this.offer.bookingQuestion.length > 0
      ) {
        this.offer.bookingQuestion.forEach((bookingQuestion) => {
          passengerData['bookingQuestion_' + bookingQuestion.id] = ''
          passengerData.error['bookingQuestion_' + bookingQuestion.id] = ''
        })
      }
      this.passengers.push(passengerData)
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
    if (this.availableBPO > this.offer.total.length) {
      this.bestPriceOption = this.offer.total.length - 1
    } else {
      this.bestPriceOption = this.availableBPO
    }
    this.updateHandlingFee()
  },
  methods: {
    ...mapActions('round-trip', ['payCart']),
    getBoardName,
    formatDateDisplay,
    getGuestText,
    isEmail,
    getPickupText(pickId) {
      return pickId === 0 ? 'Do not need pickup' : ''
    },
    getCancellationText() {
      console.log(this.offer.refundable)
      if (this.offer.refundable === 0) {
        return false
      } else {
        return this.offer.cancellationDeadline
          ? this.offer.cancellationDeadline.substring(0, 4) +
              '-' +
              this.offer.cancellationDeadline.substring(4, 6) +
              '-' +
              this.offer.cancellationDeadline.substring(6, 8)
          : false
      }
    },
    showCartCard(index) {
      if (this.openedCard[this.activeCard] === false) {
        this.openedCard[this.activeCard] = true
      }

      if (this.activeCard !== false) {
        if (this.activeCard.includes('passenger')) {
          this.validatePassenger()
        } else if (this.activeCard === 'billing') {
          this.validateBilling()
        } else if (this.activeCard === 'customer') {
          this.validateCustomer()
        }
      }

      if (this.activeCard === index) {
        this.activeCard = false
      } else {
        this.activeCard = index
      }
      setTimeout(() => {
        this.$scrollTo('#' + index)
      }, 100)
    },
    validateBeforePay() {
      this.validatePassenger()
      this.validateBilling()
      this.validateCustomer()

      this.openedCard.bookingInformation = true
      this.openedCard.passengers = true
      this.openedCard.billing = true

      for (const passanger of this.passengers) {
        if (passanger.error.firstName || passanger.error.lastName) {
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
        if (this.passengers[i].passportID === '') {
          this.passengers[i].error.passportID = this.$t(
            'general.PassportIDRequired'
          )
        }
        if (this.passengers[i].type === 'child') {
          const difference = differenceInYears(
            this.validationDate,
            new Date(this.passengers[i].birthday)
          )
          if (
            !isNaN(difference) &&
            difference !==
              this.offer.request.passengers.childrenAges[
                i - this.offer.request.passengers.adults
              ]
          ) {
            this.passengers[i].error.birthday = this.$t(
              'roundtrip.BirthdayOverDepartureError'
            )
          }
        }

        if (this.passengers[i].passportExpire === '') {
          this.passengers[i].error.passportExpire = this.$t(
            'general.PassportExpireRequired'
          )
        } else {
          const documentExpire = new Date(this.passengers[i].passportExpire)
          if (documentExpire < this.validationDate) {
            this.passengers[i].error.passportExpire = this.$t(
              'general.PassportExpired'
            )
          }
        }

        /*
        if (
          this.offer.bookingQuestion !== undefined &&
          this.offer.bookingQuestion.length > 0 &&
        ) {
          this.offer.bookingQuestion.forEach((bookingQuestion) => {
            if (
              bookingQuestion.required &&
              this.passengers[i]['bookingQuestion_' + bookingQuestion.id] === ''
            ) {
              this.passengers[i].error[
                'bookingQuestion_' + bookingQuestion.id
              ] = this.$t('general.FieldRequired')
            }
          })
        }
        */
      }
    },
    validateCustomer() {
      for (const keyError in this.customer.error) {
        this.customer.error[keyError] = ''
      }

      if (this.customer.firstName === '') {
        this.customer.error.firstName = this.$t('hotel.FirstNameRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.customer.firstName)) {
        this.customer.error.firstName = this.$t('hotel.FirstNamePatternError')
      }

      if (this.customer.lastName === '') {
        this.customer.error.lastName = this.$t('hotel.LastNameRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.customer.lastName)) {
        this.customer.error.lastName = this.$t('hotel.LastNamePatternError')
      }

      if (this.customer.nationality === '') {
        this.customer.error.nationality = this.$t('general.NationalityRequired')
      }
      if (this.customer.passportID === '') {
        this.customer.error.passportID = this.$t('general.PassportIDRequired')
      }

      if (this.customer.passportExpire === '') {
        this.customer.error.passportExpire = this.$t(
          'general.PassportExpireRequired'
        )
      } else {
        const documentExpire = new Date(this.customer.passportExpire)
        if (documentExpire < this.validationDate) {
          this.customer.error.passportExpire = this.$t(
            'general.PassportExpired'
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
      this.updateHandlingFee()
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
          const passengerDataTMP = {
            sex: this.passengers[i].title === 0 ? 'm' : 'f',
            type: this.passengers[i].type,
            firstName: this.passengers[i].firstName,
            lastName: this.passengers[i].lastName,
            nationality: this.passengers[i].nationality,
            dateOfBirth: this.passengers[i].birthday,
            passportId: this.passengers[i].passportID,
            passportExpDay: this.passengers[i].passportExpire.substring(8, 10),
            passportExpMonth: this.passengers[i].passportExpire.substring(5, 7),
            passportExpYear: this.passengers[i].passportExpire.substring(0, 4),
            extras: []
          }
          if (
            this.offer.bookingQuestion !== undefined &&
            this.offer.bookingQuestion.length > 0 &&
            this.bookingquestiondisabler
          ) {
            this.offer.bookingQuestion.forEach((bookingQuestion) => {
              if (
                bookingQuestion.dataType === 'OPTIONS' ||
                (bookingQuestion.dataType === 'SHORT_TEXT' &&
                  bookingQuestion.options.length > 0)
              ) {
                passengerDataTMP.extras.push({
                  id: bookingQuestion.id,
                  selectedOption:
                    bookingQuestion.options[
                      this.passengers[i][
                        'bookingQuestion_' + bookingQuestion.id
                      ]
                    ].value
                })
              } else if (bookingQuestion.dataType === 'SHORT_TEXT') {
                passengerDataTMP.extras.push({
                  id: bookingQuestion.id,
                  text: this.passengers[i][
                    'bookingQuestion_' + bookingQuestion.id
                  ]
                })
              }
            })
          }
          parsedPassangers.push(passengerDataTMP)
        }

        const parsedBilling = {
          name: this.billingData.name,
          country: this.billingData.country,
          city: this.billingData.city,
          address: this.billingData.address,
          postalCode: this.billingData.postalCode,
          tax: this.billingData.tax
        }
        const parsedCustomer = {
          firstName: this.customer.firstName,
          lastName: this.customer.lastName,
          nationality: this.customer.nationality,
          sex: this.customer.title === 0 ? 'm' : 'f',
          dateOfBirth: this.customer.birthday,
          organization: this.customer.company,
          passportId: this.customer.passportID,
          passportExpDay: this.customer.passportExpire.substring(8, 10),
          passportExpMonth: this.customer.passportExpire.substring(5, 7),
          passportExpYear: this.customer.passportExpire.substring(0, 4)
        }
        let cartResp
        try {
          cartResp = await this.payCart({
            searchId: this.offer.request.search_id,
            activityId: this.offer.activityId,
            activityDate: this.offer.request.date,
            startTimeId: this.offer.availabilityData.startTimeIds[0],
            rateId: this.offer.request.rate_id,
            pricingCategoryIds: this.offer.availabilityData.pricingCategoryIds,
            bpoCount: parseInt(this.bestPriceOption),
            currency: this.currency,
            tc: this.getAddedTravelCard,
            billing: parsedBilling,
            passengers: parsedPassangers,
            passengersRequest: this.offer.request.passengers,
            customer: parsedCustomer,
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
          } else if (cartResp.status === 'NOT_ENOUGH_BPO') {
            this.bpoErrorModalActive = true
          } else if (cartResp.status === 'SAVE_BILLING_DATA_ERROR') {
            this.billingDataErrorModalActive = true
          } else if (cartResp.status === 'PAYMENT_SUCCESS') {
            await this.$router.replace(
              this.localePath('/round-trip/reservation-success')
            )
          } else if (cartResp.status === 'PAYMENT_FAILED') {
            await this.$router.replace(
              this.localePath('/round-trip/reservation-failed')
            )
          } else if (cartResp.status === 'PAYMENT_PENDING') {
            await this.$router.replace(
              this.localePath('/round-trip/reservation-pending')
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
              message: this.$t('roundtrip.BookingDataError')
            })
          }
        }
      }
    },
    async updateHandlingFee() {
      let handlingFeeRes
      try {
        handlingFeeRes = await this.$store.dispatch(
          'round-trip/getHandlingFee',
          {
            sum: this.getTotalPrice,
            tc: this.getAddedTravelCard
          }
        )
        console.log(handlingFeeRes)
      } catch (error) {
        this.handlingFee = getHandlingFee(
          this.getTotalPrice - this.getAddedTravelCard,
          'round_trip'
        )
      }
      if (handlingFeeRes && handlingFeeRes.bankComission !== undefined) {
        this.handlingFee = handlingFeeRes.bankComission
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
        this.billingData.country = this.props.BILLING_COUNTRY
        this.billingData.postalCode = this.props.BILLING_ZIPCODE
        this.billingData.city = this.props.BILLING_CITY
        this.billingData.address = this.props.BILLING_STREET
      }
    },
    copyAdult1DataToContactData() {
      if (this.copyAdult1ToContact) {
        this.customer.title = this.passengers[0].title
        this.customer.firstName = this.passengers[0].firstName
        this.customer.lastName = this.passengers[0].lastName
        this.customer.nationality = this.passengers[0].nationality
        this.customer.birthday = this.passengers[0].birthday
        this.customer.passportID = this.passengers[0].passportID
        this.customer.passportExpire = this.passengers[0].passportExpire
      }
    },
    purgeCache() {
      this.bpoErrorModalActive = false
      this.$router.push(this.localePath('/'))
    },
    getBookingQuestionOptions(options) {
      const optionsArray = []
      options.forEach((option) => {
        optionsArray.push(option.name)
      })
      return optionsArray
    }
  }
}
</script>

<style lang="postcss" scoped>
.arrow-down {
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
</style>
