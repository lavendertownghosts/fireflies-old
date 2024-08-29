<template>
  <div>
    <CartStatus
      v-if="cartStatusActive"
      :type="'success'"
      :show-relevant-offers="true"
    />
    <div v-if="!cartStatusActive && cartCache !== false">
      <div class="bg-primary-gradient">
        <div
          class="flex flex-row items-center justify-between px-16 py-24 lg:py-18 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
        >
          <div class="hidden md:block md:flex-initial md:mr-16">
            <img
              src="~assets/images/white-turq/travel-services/hotel/hotel-60.svg"
              class="w-60 h-60"
            />
          </div>

          <div class="flex-grow leading-32 md:leading-24">
            <div class="flex flex-wrap">
              <div class="mr-4">
                {{ cartCache.hotel.name }}
                <StarRatings
                  :stars="parseInt(cartCache.hotel.stars)"
                  class="inline-block"
                />
              </div>
            </div>
            <div class="hidden md:block md:mt-2 text-sm leading-14">
              {{ calcDistance(cartCache.hotel.distance) }},
              <span class="font-normal">
                {{
                  cartCache.hotel.country +
                    ', ' +
                    cartCache.hotel.city +
                    ', ' +
                    cartCache.hotel.address
                }}
              </span>
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
        <div class="flex flex-col md:flex-row">
          <!-- Reservation -->
          <div class="md:mr-8 mb-40">
            <div class="text-lg font-bold text-black leading-24 mt-20">
              {{ $t('hotel.ReservationTitle') }}
            </div>
            <StatusMessage :type="'warning'" class="mt-16 leading-20">
              {{ $t('hotel.CartMessagePart1') }}<br /><br />
              {{ $t('hotel.CartMessagePart2') }}
              <br /><br />
              <span class="font-bold uppercase">{{
                $t('hotel.CartMessagePart3')
              }}</span
              >: {{ $t('hotel.CartMessagePart4') }}
              <nuxt-link :to="localePath('/support')" class="link">{{
                $t('general.Support')
              }}</nuxt-link>
              {{ $t('hotel.CartMessagePart5') }}
            </StatusMessage>
            <div class="md:block">
              <ServicePreview
                :image-url="cartCache.images[0]"
                :date-text="dateText"
                :roompacks="cartCache.hotel.roompacks"
                :cancellation-text="
                  cartCache.cancellationPolicy.refundable === 1
                    ? formatDateDisplay(
                        cartCache.cancellationPolicy.cancellationDeadline
                      )
                    : $t('hotel.NonRefundable')
                "
                class="md:hidden mt-16"
              />
            </div>
            <CartCard
              v-if="
                getVoucherNum > 0 &&
                  availableVouchers < getVoucherNum &&
                  !getAllowedPV
              "
              id="voucher"
              :type="'warning'"
              :title="
                $t('hotel.ExtraVoucher', [getVoucherNum - availableVouchers])
              "
              :price="getExtraVoucherPrice"
              :active="activeCard === 'voucher'"
              class="mt-24"
              @showCartCard="showCartCard('voucher')"
            >
              <div class="px-16 pt-16 pb-12 mb-4">
                {{
                  $t('hotel.ExtraVoucherDescription', [
                    getVoucherNum - availableVouchers
                  ])
                }}
              </div>
            </CartCard>
            <CartCard
              v-if="
                getVoucherNum > 0 &&
                  availablePVouchers < getVoucherNum &&
                  getAllowedPV
              "
              id="voucher"
              :type="'warning'"
              :title="
                $t('hotel.ExtraPVoucher', [getVoucherNum - availablePVouchers])
              "
              :price="getExtraVoucherPrice"
              :active="activeCard === 'voucher'"
              class="mt-24"
              @showCartCard="showCartCard('voucher')"
            >
              <div class="px-16 pt-16 pb-12 mb-4">
                {{
                  $t('hotel.ExtraPVoucherDescription', [
                    getVoucherNum - availablePVouchers
                  ])
                }}
              </div>
            </CartCard>
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
                acceptedBookingInformation ? Math.ceil(getActualPrice) : false
              "
              :voucher="
                acceptedBookingInformation && getVoucherNum > 0
                  ? getVoucherNum
                  : false
              "
              :voucher-is-extra="
                getVoucherNum > 0 && getVoucherNum > availableVouchers
              "
              :credit="
                acceptedBookingInformation && cartCache.credit > 0
                  ? cartCache.credit
                  : false
              "
              :bpo="
                acceptedBookingInformation &&
                cartCache.cit.params.hotelSearchType === 'bpo'
                  ? cartCache.bpo
                  : false
              "
              :active="activeCard === 'bookingInformation'"
              :help="$t('hotel.BookingInformationAccept')"
              class="mt-24"
              @showCartCard="showCartCard('bookingInformation')"
            >
              <div class="p-16">
                <!-- Remarks -->
                <div v-if="cartCache.remarks.length > 0">
                  <div
                    class="flex flex-grow items-center font-bold cursor-pointer leading-14"
                    @click="
                      bookingInformation.remarks.active = !bookingInformation
                        .remarks.active
                    "
                    @mouseover="bookingInformation.remarks.hover = true"
                    @mouseleave="bookingInformation.remarks.hover = false"
                  >
                    {{ $t('hotel.Remarks') }}
                    <i
                      :class="[
                        bookingInformation.remarks.active
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down',
                        bookingInformation.remarks.hover ? 'opacity-50' : ''
                      ]"
                      class="w-16 text-base ml-8 fas"
                    ></i>
                  </div>
                  <div v-show="bookingInformation.remarks.active" class="mt-16">
                    <p v-for="(remark, key) in cartCache.remarks" :key="key">
                      {{ remark }}
                    </p>
                  </div>
                  <div class="bg-grey-light h-1 my-16"></div>
                </div>
                <!-- Extra költségek -->
                <!-- <div>
                  <div
                    class="flex flex-grow flex-row items-center font-bold cursor-pointer leading-14"
                    @click="
                      bookingInformation.extraFees.active = !bookingInformation
                        .extraFees.active
                    "
                    @mouseover="bookingInformation.extraFees.hover = true"
                    @mouseleave="bookingInformation.extraFees.hover = false"
                  >
                    <div class="inline-block">
                      Helyszínen fizetendő opcionális/extra költségek
                    </div>
                    <div class="inline-block">
                      <i
                        :class="[
                          bookingInformation.extraFees.active
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down',
                          bookingInformation.extraFees.hover ? 'opacity-50' : ''
                        ]"
                        class="w-16 text-base ml-8 fas"
                      ></i>
                    </div>
                  </div>
                  <div
                    v-show="bookingInformation.extraFees.active"
                    class="mt-16"
                  >
                    Internet: 15 EUR
                  </div>
                </div> -->
                <p>{{ $t('hotel.RemarksFixText') }}</p>
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
            <!-- <CartCard
              id="insurance"
              :type="
                insurance !== '' && (acceptedInsurance || insurance === '4')
                  ? 'success'
                  : openedCard.insurance
                  ? 'danger'
                  : 'default'
              "
              :title="'Utasbiztosítás'"
              :help="'Válassz utasbiztosítást!'"
              :active="activeCard === 'insurance'"
              :price="
                insurance !== '' && insurance !== '4' ? '+ EUR 50' : false
              "
              class="mt-24"
              @showCartCard="showCartCard('insurance')"
            >
              <div class="flex flex-col px-16 pt-16 pb-12 mb-4">
                <div class="flex flex-col lg:flex-row">
                  <div
                    class="flex order-first lg:order-last lg:w-5/12 lg:justify-end"
                  >
                    <img src="~assets/images/partners/erv.png" class="h-24" />
                  </div>
                  <div class="order-last lg:order-first lg:w-7/12">
                    <div
                      class="flex flex-row justify-between items-start mt-16 ml-4 lg:mt-2"
                    >
                      <InputRadio
                        v-model="insurance"
                        :selected="'1'"
                        :label="'Travel Cancellation Insurance'"
                        :has-error="openedCard.insurance && insurance === ''"
                      >
                      </InputRadio>
                      <div class="flex items-center text-sm font-bold">
                        EUR 50
                      </div>
                    </div>
                    <a href="#" class="link ml-20 pl-2 text-xs leading-12"
                      >Product information sheet</a
                    >
                    <div
                      class="flex flex-row justify-between items-start mt-16 ml-4"
                    >
                      <InputRadio
                        v-model="insurance"
                        :selected="'2'"
                        :label="'Cancellation and Curailment Insurance'"
                        :has-error="openedCard.insurance && insurance === ''"
                      >
                      </InputRadio>
                      <div class="flex items-center">
                        <div class=" text-sm font-bold">EUR 50</div>
                      </div>
                    </div>
                    <a href="#" class="link ml-20 pl-2 text-xs leading-12"
                      >Product information sheet</a
                    >
                    <div
                      class="flex flex-row justify-between items-start mt-16 ml-4"
                    >
                      <InputRadio
                        v-model="insurance"
                        :selected="'3'"
                        :label="'Multi Cover Package'"
                        :has-error="openedCard.insurance && insurance === ''"
                      >
                      </InputRadio>
                      <div class="flex items-center text-sm font-bold">
                        EUR 50
                      </div>
                    </div>
                    <a href="#" class="link ml-20 pl-2 text-xs leading-12"
                      >Product information sheet</a
                    >
                    <div
                      class="flex flex-row justify-between items-start mt-16 ml-4"
                    >
                      <InputRadio
                        v-model="insurance"
                        :selected="'4'"
                        :label="'No Insurance'"
                        :has-error="openedCard.insurance && insurance === ''"
                      >
                      </InputRadio>
                    </div>
                  </div>
                </div>
                <div
                  v-show="insurance !== '' && insurance !== '4'"
                  class="flex"
                >
                  <div class="mx-16 xl:mx-0 xl:mt-24">
                    <InputCheckbox
                      v-model="acceptedInsurance"
                      :has-error="openedCard.insurance && !acceptedInsurance"
                    >
                      <div class="text-sm leading-14 xl:pt-3">
                        I have read the Product Information Sheet above, as as
                        the Important Information and Terms and Conditions of
                        ERV.
                      </div>
                    </InputCheckbox>
                  </div>
                </div>
              </div>
            </CartCard> -->
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
                <InputCheckbox
                  v-if="cartCache.other_price !== undefined"
                  v-model="isThirdPartyBooking"
                  @input="checkThirdPartyBooking"
                >
                  <div class="text-sm flex flex-row leading-14 font-bold pt-2">
                    {{ $t('hotel.ThirdPartyBookingText')
                    }}<br class="sm:hidden" />
                    <span class="text-danger flex flex-row">
                      ({{ getBPONum }}
                      <img
                        class="-mt-7 inline"
                        src="~static/images/bpo-logo.svg"
                      />
                      + {{ cartCache.other_price.EUR }} EUR)</span
                    >
                  </div>
                </InputCheckbox>
                <!-- <InputCheckbox v-model="saveToProfile" class="mt-12">
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('general.SaveDetails') }}
                  </div>
                </InputCheckbox> -->
                <div
                  v-for="(room, roomNumber) in passengers"
                  :key="roomNumber"
                  class="mt-24 pb-24 border-grey-light"
                  :class="passengers.length != roomNumber + 1 ? 'border-b' : ''"
                >
                  <div
                    v-if="passengers.length > 1"
                    class="text-base leading-14 font-bold"
                  >
                    {{ roomNumber + 1 }}. {{ $t('hotel.Room') }}
                  </div>
                  <div
                    v-for="(item, index) in room"
                    :key="index"
                    class="mt-12 pt-12"
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
                              :error="item.lastNameError"
                              :placeholder="
                                item.lastNameError ? $t('general.LastName') : ''
                              "
                              :is-disabled="
                                roomNumber === 0 &&
                                  index === 0 &&
                                  !roleThirdPartyBooking
                              "
                            />
                          </div>
                          <div class="pl-8 xl:w-240">
                            <InputText
                              v-model="item.firstName"
                              :class="'w-full'"
                              :label="$t('general.FirstName')"
                              :error="item.firstNameError"
                              :placeholder="
                                item.firstNameError
                                  ? $t('general.FirstName')
                                  : ''
                              "
                              :is-disabled="
                                roomNumber === 0 &&
                                  index === 0 &&
                                  !roleThirdPartyBooking
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-row mt-24 xl:mt-12 xl:ml-16">
                        <div v-if="item.age !== undefined" class="w-128">
                          <InputDropdown
                            v-model="item.age"
                            :values="yearSelect"
                            :label="$t('general.Age')"
                            :is-disabled="true"
                          ></InputDropdown>
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
                    :error="billingData.error.name"
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
            <div class="hidden md:block">
              <ServicePreview
                :image-url="cartCache.images[0]"
                :date-text="dateText"
                :roompacks="cartCache.hotel.roompacks"
                :cancellation-text="
                  cartCache.cancellationPolicy.refundable === 1
                    ? formatDateDisplay(
                        cartCache.cancellationPolicy.cancellationDeadline
                      )
                    : $t('hotel.NonRefundable')
                "
                class="hidden md:block mt-16"
              />
            </div>
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
                  <div v-show="getVoucherNum > 0">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{ getVoucherNum }}</span
                    ><span v-if="!getAllowedPV">
                      <span class="ff-currency bg-black cart"></span
                      ><span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
                    </span>
                    <span v-else class="pr-6 lg:pr-0 xl:pr-6">
                      <img
                        class="inline -mt-10"
                        :src="premiumDV"
                        width="36"/></span
                    ><span
                      v-show="getActualPrice > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <div v-show="getBPONum > 0" class="flex flex-row">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{ getBPONum }}</span
                    ><span class="pr-6 lg:pr-0 xl:pr-6"
                      ><img
                        class="-mt-7 inline"
                        src="~static/images/bpo-logo.svg"/></span
                    ><span
                      v-show="getActualPrice > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <div v-show="cartCache.credit > 0">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      cartCache.credit
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}</span
                    ><span class="ff-currency bg-black cart"></span
                    ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span
                    ><span
                      v-show="cartCache.credit > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <div v-show="getActualPrice > 0">
                    EUR
                    {{
                      Math.ceil(getActualPrice)
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
                <div
                  v-show="getVoucherNum > 0 && !getAllowedPV"
                  class="flex flex-col"
                >
                  <div class="w-full h-1 bg-grey-light my-16"></div>
                  <div class="font-bold text-sm leading-14">
                    {{ $t('hotel.UsedDiamondVoucher') }}
                  </div>
                  <div class="mt-4 text-3x leading-20 font-bold">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      getVoucherNum > availableVouchers
                        ? availableVouchers
                        : getVoucherNum
                    }}</span>
                  </div>
                  <div class="text-xs leading-12 mt-4">
                    {{ $t('hotel.CurrentDV') }}:
                    <span>
                      <span class="pr-4 lg:pr-0 xl:pr-4">{{
                        availableVouchers
                      }}</span>
                      <span class="ff-currency bg-black"></span
                      ><span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
                    </span>
                  </div>
                </div>
                <div
                  v-show="getVoucherNum > 0 && getAllowedPV"
                  class="flex flex-col"
                >
                  <div class="w-full h-1 bg-grey-light my-16"></div>
                  <div class="font-bold text-sm leading-14">
                    {{ $t('hotel.UsedPremiumVoucher') }}
                  </div>
                  <div class="mt-4 text-3x leading-20 font-bold">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      getVoucherNum >= availablePVouchers
                        ? availablePVouchers
                        : getVoucherNum
                    }}</span>
                    <span class="pr-6 lg:pr-0 xl:pr-6">
                      <img class="inline -mt-10" :src="premiumDV" width="36"
                    /></span>
                  </div>
                  <div class="text-xs leading-12 mt-4">
                    {{ $t('hotel.CurrentPV') }}:
                    <span class="pr-6 lg:pr-0 xl:pr-6"
                      ><span class="pr-4 lg:pr-0 xl:pr-4">{{
                        availablePVouchers
                      }}</span>
                    </span>
                  </div>
                </div>
                <div
                  v-show="cartCache.cit.params.hotelSearchType === 'bpo'"
                  class="flex flex-col"
                >
                  <div class="w-full h-1 bg-grey-light my-16"></div>
                  <div class="font-bold text-sm leading-14">
                    {{ $t('hotel.UsedBPO') }}
                  </div>
                  <div class="mt-4 flex flex-row text-3x leading-20 font-bold">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      getBPONum > availableBPO ? availableBPO : getBPONum
                    }}</span
                    ><span class="pr-6 lg:pr-0 xl:pr-6"
                      ><img
                        class="-mt-7 inline"
                        src="~static/images/bpo-logo.svg"
                    /></span>
                  </div>
                  <div class="text-xs leading-12 mt-4">
                    {{ $t('hotel.CurrentBPO') }}:
                    <span class="pr-4 lg:pr-0 xl:pr-4">{{ availableBPO }}</span
                    ><span class="pr-6 lg:pr-0 xl:pr-6"
                      ><img
                        class="-mt-7 inline"
                        src="~static/images/bpo-logo.svg"
                    /></span>
                  </div>
                </div>
                <div v-show="cartCache.credit > 0" class="flex flex-col">
                  <div class="w-full h-1 bg-grey-light my-16"></div>
                  <div class="font-bold text-sm leading-14">
                    {{ $t('hotel.UsedCredit') }}
                  </div>
                  <div class="mt-4 text-3x leading-20 font-bold">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      (cartCache.credit > availableCredit
                        ? availableCredit
                        : cartCache.credit)
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}</span
                    ><span class="ff-currency bg-black cart ml-8"></span
                    ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span>
                  </div>
                  <div class="text-xs leading-12 mt-4">
                    {{ $t('hotel.CurrentCR') }}:
                    <span class="pr-4 lg:pr-0 xl:pr-4">{{
                      availableCredit
                    }}</span
                    ><span class="ff-currency bg-black"></span
                    ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span>
                  </div>
                </div>
              </div>
              <div class="bg-primary-gradient px-16 pb-20 text-white">
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-white"></div>
                </div>
                <div
                  v-show="
                    availableVouchers > 0 ||
                      getBPONum > 0 ||
                      cartCache.credit > 0 ||
                      getAddedTravelCard > 0
                  "
                  class="text-sm leading-14 font-bold mt-16"
                >
                  {{ $t('general.PayWithTC') }}
                </div>
                <div
                  v-show="
                    availableVouchers > 0 ||
                      getBPONum > 0 ||
                      cartCache.credit > 0 ||
                      getAddedTravelCard > 0
                  "
                  class="flex flex-row text-3x leading-20 font-bold mt-4"
                >
                  <div v-show="!getAllowedPV && availableVouchers > 0">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      getVoucherNum > availableVouchers
                        ? availableVouchers
                        : getVoucherNum
                    }}</span
                    ><span>
                      <span class="ff-currency bg-white cart"></span
                      ><span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
                    </span>
                    <span
                      v-show="getAddedTravelCard > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <div v-show="!getAllowedPV && availablePVouchers > 0">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      getVoucherNum > availableVouchers
                        ? availableVouchers
                        : getVoucherNum
                    }}</span>
                    <span class="pr-6 lg:pr-0 xl:pr-6">
                      <img
                        class="inline -mt-10"
                        :src="premiumDV"
                        width="36"/></span
                    ><span
                      v-show="getAddedTravelCard > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <div v-show="getBPONum > 0">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{ getBPONum }}</span
                    ><span class="pr-6 lg:pr-0 xl:pr-6"
                      ><img
                        class="-mt-7 inline"
                        src="~static/images/bpo-logo.svg"/></span
                    ><span
                      v-show="getAddedTravelCard > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <div v-show="cartCache.credit > 0">
                    <span class="pr-6 lg:pr-0 xl:pr-6">{{
                      cartCache.credit
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}</span
                    ><span class="ff-currency bg-white cart"></span
                    ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span
                    ><span
                      v-show="getAddedTravelCard > 0"
                      class="pr-6 lg:pr-0 xl:pr-6"
                      >+</span
                    >
                  </div>
                  <span v-show="getAddedTravelCard > 0">
                    {{
                      getAddedTravelCard
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                    EUR
                  </span>
                </div>
                <div
                  v-show="
                    getTotalPrice - getAddedTravelCard > 0 &&
                      (availableVouchers > 0 ||
                        getBPONum > 0 ||
                        cartCache.credit > 0 ||
                        getAddedTravelCard > 0)
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
                class="text-3x leading-20 py-14 text-center bg-danger text-white font-bold rounded-b cursor-pointer"
                @click="pay"
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
    </div>
    <PermissionModal
      :show="permissionModalActive"
      :permission-needed="permissionNeeded"
      @cancel="permissionModalActive = false"
      @accept="$router.push(localePath('/weboffice/membership-upgrade'))"
    />
    <DefaultModal
      v-show="priceChangeModalActive"
      :modal-max-width="'320px'"
      :default-padding="'p-0'"
    >
      <div slot="header"></div>
      <div v-if="cartCache" slot="body">
        <div class="flex flex-col w-full text-black px-16 pt-16">
          <div class="text-lg font-bold leading-24">
            {{ $t('hotel.PriceChanged') }}
          </div>
          <div class="text-sm leading-20 mt-16">
            {{ $t('hotel.PriceChangedDesc') }}
          </div>
        </div>
        <div class="flex flex-row mt-16 bg-grey-light bg-opacity-20 p-16">
          <div class="w-1/2 text-grey">
            <div class="text-sm leading-14">{{ $t('flight.OldPrice') }}</div>
            <div
              class="flex flex-row text-2x leading-18 font-bold mt-6 line-through"
            >
              <div v-if="cartCache.showed_vocher > 0">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{
                  cartCache.showed_vocher
                }}</span
                ><span class="ff-currency bg-white cart"></span
                ><span v-if="!getAllowedPV">
                  <span class="ff-currency"></span
                  ><span v-if="!getAllowedPV">
                    <span class="ff-currency"></span
                    ><span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
                  </span>
                  <span v-else class="pr-6 lg:pr-0 xl:pr-6">
                    <img class="inline -mt-10" :src="premiumDV" width="36"
                  /></span>
                </span>
                <span v-else class="pr-6 lg:pr-0 xl:pr-6">
                  <img class="inline -mt-10" :src="premiumDV" width="36"/></span
                ><span
                  v-if="cartCache.showed_price.EUR > 0"
                  class="pr-6 lg:pr-0 xl:pr-6"
                  >+</span
                >
              </div>
              <div v-if="cartCache.showed_bpo > 0" class="flex flex-row">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{
                  cartCache.showed_bpo
                }}</span
                ><span class="ff-currency bg-white cart"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6"
                  ><img
                    class="-mt-7 inline"
                    src="~static/images/bpo-logo.svg"/></span
                ><span
                  v-show="cartCache.showed_price > 0"
                  class="pr-6 lg:pr-0 xl:pr-6"
                  >+</span
                >
              </div>
              <div v-if="cartCache.showed_credit > 0">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{
                  cartCache.showed_credit
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}</span
                ><span class="ff-currency bg-white cart"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span
                ><span
                  v-show="cartCache.showed_price > 0"
                  class="pr-6 lg:pr-0 xl:pr-6"
                  >+</span
                >
              </div>
              EUR
              {{
                Math.ceil(parseFloat(cartCache.showed_price))
                  | formatNumber('0,0', {
                    thousandsSeparator: ' '
                  })
              }}
            </div>
          </div>
          <div class="w-1/2 text-right text-black">
            <div class="text-sm leading-14">{{ $t('hotel.NewPrice') }}</div>
            <div
              class="flex flex-row text-2x leading-18 font-bold mt-6 justify-end"
            >
              <div v-show="getVoucherNum > 0">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{ getVoucherNum }}</span
                ><span v-if="!getAllowedPV">
                  <span class="ff-currency bg-black cart"></span>
                  <span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
                </span>
                <span v-else class="pr-6 lg:pr-0 xl:pr-6">
                  <img class="inline -mt-10" :src="premiumDV" width="36"/></span
                ><span v-show="getActualPrice > 0" class="pr-6 lg:pr-0 xl:pr-6"
                  >+</span
                >
              </div>
              <div v-show="getBPONum > 0">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{ getBPONum }}</span
                ><span class="pr-6 lg:pr-0 xl:pr-6"
                  ><img
                    class="-mt-7 inline"
                    src="~static/images/bpo-logo.svg"/></span
                ><span v-show="getActualPrice > 0" class="pr-6 lg:pr-0 xl:pr-6"
                  >+</span
                >
              </div>
              <div v-show="cartCache.credit > 0">
                <span class="pr-6 lg:pr-0 xl:pr-6">{{
                  cartCache.credit
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}</span
                ><span class="ff-currency bg-white cart"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span
                ><span
                  v-show="cartCache.credit > 0"
                  class="pr-6 lg:pr-0 xl:pr-6"
                  >+</span
                >
              </div>
              EUR
              {{
                Math.ceil(getActualPrice)
                  | formatNumber('0,0', {
                    thousandsSeparator: ' '
                  })
              }}
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-24">
          <div class="text-center">
            <ButtonSmall @click="acceptNewPrice">
              {{ $t('hotel.AcceptNewPrice') }}
            </ButtonSmall>
          </div>
          <div
            class="text-center link-danger my-16 text-xs leading-12 cursor-pointer"
            @click="$router.back()"
          >
            {{ $t('hotel.RejectNewPrice') }}
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <InformativeModal
      v-show="voucherErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="purgeCache()"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughVoucher') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="creditErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="purgeCache()"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('hotel.NotEnoughCredit') }}
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
import StarRatings from '@/components/micro/StarRatings'
import StatusMessage from '@/components/micro/StatusMessage'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputDropdown from '@/components/micro/InputDropdown'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputText from '@/components/micro/InputText'
import InputTextMask from '@/components/micro/InputTextMask'

import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import CartStatus from '@/components/cart/CartStatus'

import PermissionModal from '@/components/PermissionModal'
import DefaultModal from '@/components/modal/DefaultModal'
import InformativeModal from '@/components/modal/InformativeModal'
import ButtonSmall from '@/components/micro/ButtonSmall'

import premiumDV from '@/assets/images/premium-voucher.svg'

import NMIModal from '@/components/modal/NMIModal'

import {
  getHandlingFee,
  calcHotelDistance,
  calcNights,
  formatDateDisplay,
  getBoardName,
  getGuestText,
  capitalize
} from '@/includes/utils'

export default {
  name: 'HotelCartPage',
  middleware: 'auth_needed',
  components: {
    ButtonSmall,
    DefaultModal,
    InformativeModal,
    PermissionModal,
    ServicePreview,
    InputText,
    InputTextMask,
    InputDropdown,
    InputDropdownCountry,
    InputCheckbox,
    CartCard,
    StatusMessage,
    StarRatings,
    CartStatus,
    NMIModal
  },
  async asyncData({ store }) {
    let availableVouchers = 0
    let availablePVouchers = 0
    let availableBPO = 0
    let availableCredit = 0
    if (store.state.hotel && store.state.hotel.cartCache) {
      if (
        (store.state.hotel.cartCache.cit.params.hotelSearchType ===
          'new_voucher' ||
          store.state.hotel.cartCache.cit.params.hotelSearchType === 'cisco') &&
        store.state.hotel.cartCache.voucher !== undefined &&
        store.state.hotel.cartCache.voucher > 0
      ) {
        let resVoucher
        try {
          resVoucher = await store.dispatch('user/getVouchersAvailable')
        } catch (e) {
          console.log(e)
        }
        availableVouchers = resVoucher.voucher_count
        availablePVouchers = resVoucher.premium_voucher_count
      } else if (
        store.state.hotel.cartCache.cit.params.hotelSearchType === 'bpo' &&
        store.state.hotel.cartCache.bpo !== undefined &&
        store.state.hotel.cartCache.bpo >= 0
      ) {
        let resBPO
        try {
          resBPO = await store.dispatch('user/getBestPriceOptions')
        } catch (e) {
          console.log(e)
        }
        availableBPO = resBPO.available
      }

      if (
        (store.state.hotel.cartCache.cit.params.hotelSearchType === 'credit' ||
          store.state.hotel.cartCache.cit.params.hotelSearchType === 'cisco') &&
        store.state.hotel.cartCache.credit !== undefined &&
        store.state.hotel.cartCache.credit > 0
      ) {
        let resCredit
        try {
          resCredit = await store.dispatch('user/getCredits')
        } catch (e) {
          console.log(e)
        }
        if (resCredit && resCredit.availableCredits) {
          availableCredit = resCredit.availableCredits
        }
      }
    }
    return {
      availableVouchers,
      availablePVouchers,
      availableBPO,
      availableCredit
    }
  },
  data() {
    return {
      premiumDV,
      activeCard: 'bookingInformation',
      openedCard: {
        bookingInformation: false,
        insurance: false,
        passengers: false,
        billing: false
      },
      bookingInformation: {
        remarks: {
          active: true,
          hover: false
        },
        extraFees: {
          active: true,
          hover: false
        }
      },
      nmiPopupActive: false,
      nmiPopup: false,
      acceptedBookingInformation: false,
      acceptedPassengers: false,
      acceptedBilling: false,
      /* acceptedInsurance: false, */
      isThirdPartyBooking: false,
      /* saveToProfile: false, */
      copyAdult1: true,
      saveBillingData: false,
      insurance: '',
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
      countrySelect: [],
      countrySelectIds: [],
      countrySelectCodes: [],
      passengers: [],
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
      cartStatusActive: false,
      isLoading: false,
      permissionNeeded: false,
      permissionModalActive: false,
      priceChangeModalActive: false,
      activeNewPrice: false,
      voucherErrorModalActive: false,
      creditErrorModalActive: false,
      bpoErrorModalActive: false,
      handlingFee: 0,
      billingDataErrorModalActive: false
    }
  },
  computed: {
    ...mapGetters('hotel', ['cartCache']),
    ...mapGetters('user', [
      'getFees',
      'isLoggedIn',
      'getAllowedPV',
      'isPremiumUser'
    ]),
    getVoucherNum() {
      return this.cartCache.voucher !== undefined ? this.cartCache.voucher : 0
    },
    getBPONum() {
      return this.cartCache.bpo !== undefined ? this.cartCache.bpo : 0
    },
    getTotalPrice() {
      return Math.ceil(this.getActualPrice) + this.getExtraVoucherPrice
    },
    getActualPrice() {
      if (
        this.isThirdPartyBooking &&
        this.cartCache.other_price !== undefined
      ) {
        return parseFloat(this.cartCache.other_price.EUR)
      } else {
        return parseFloat(this.cartCache.price.EUR)
      }
    },
    getExtraVoucherPrice() {
      if (
        this.getVoucherNum &&
        this.getVoucherNum >= this.availableVouchers &&
        this.cartCache.cit.params.hotelSearchType !== 'cisco' &&
        !this.getAllowedPV
      ) {
        return (
          this.cartCache.voucher_price.EUR *
          (this.getVoucherNum - this.availableVouchers)
        )
      } else if (
        this.getVoucherNum &&
        this.getVoucherNum >= this.availablePVouchers &&
        this.cartCache.cit.params.hotelSearchType !== 'cisco' &&
        this.getAllowedPV
      ) {
        return (
          this.cartCache.voucher_price.EUR *
          (this.getVoucherNum - this.availablePVouchers)
        )
      }
      return 0
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
      return fees ? Math.floor(fees.tc.credit) : 0
    },
    roleThirdPartyBooking() {
      return this.getFees
        ? this.getFees.package.permission === 'LIFE' ||
            this.isThirdPartyBooking ||
            this.isPremiumUser
        : false
    },
    validatePayment() {
      if (
        this.acceptedBookingInformation &&
        this.passengerDataStatus === 'success' &&
        this.billingDataStatus === 'success'
      ) {
        return true
      } else {
        return false
      }
    },
    dateText() {
      return (
        formatDateDisplay(this.cartCache.cit.from) +
        ' - ' +
        formatDateDisplay(this.cartCache.cit.to) +
        '<br class="hidden md:block xl:hidden" /><span class="text-grey-dark"> (' +
        calcNights(this.cartCache.cit.from, this.cartCache.cit.to) +
        ' ' +
        this.$t('hotel.Night') +
        ')</span>'
      )
    },
    firstName() {
      return this.cartCache.cit.props.FULLNAME.split(' ')[0]
    },
    lastName() {
      const nameParts = this.cartCache.cit.props.FULLNAME.split(' ')
      nameParts.shift()
      return nameParts.join(' ')
    },
    passengerDataStatus() {
      if (!this.openedCard.passengers) {
        return 'default'
      }
      for (const room of this.passengers) {
        for (const passanger of room) {
          if (passanger.firstNameError || passanger.lastNameError) {
            return 'danger'
          }
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
    }
  },
  mounted() {
    this.isLoading = false
    if (this.cartCache === false) {
      this.$router.push(this.localePath('/'))
      this.$store.dispatch('general/showSnackbar', {
        message: this.$t('hotel.EmptyCart')
      })
    }
    this.updateHotelHandlingFee()
    this.$store.dispatch('user/updateFees')
    let passId = 0
    // Ha globálisan kell számolni
    for (let j = 0; j < this.cartCache.cit.params.roomDatas.length; j++) {
      // let passId = 0
      // Ha 0-tól kell indítani szobánként
      const room = []
      for (
        let i = 0;
        i < this.cartCache.cit.params.roomDatas[j].parentCount;
        i++
      ) {
        room.push({
          passenger: capitalize(this.$t('general.Adult'), true) + ' ' + (i + 1),
          key: 'passenger' + passId,
          title: 0,
          firstName: passId === 0 ? this.firstName : '',
          lastName: passId === 0 ? this.lastName : '',
          firstNameError: false,
          lastNameError: false
        })
        passId++
      }

      if (this.cartCache.cit.params.roomDatas[j].childCount > 0) {
        for (
          let i = 0;
          i < this.cartCache.cit.params.roomDatas[j].childCount;
          i++
        ) {
          room.push({
            passenger:
              capitalize(this.$t('general.Child'), true) + ' ' + (i + 1),
            key: 'passenger' + passId,
            title: 0,
            firstName: '',
            lastName: '',
            firstNameError: false,
            lastNameError: false,
            age: this.cartCache.cit.params.roomDatas[j].childrenAges[i]
          })
          passId++
        }
      }

      this.passengers.push(room)
    }
    this.billingData = {
      name: this.cartCache.cit.props.BILLING_NAME || '',
      country: this.cartCache.cit.props.BILLING_COUNTRY || '',
      postalCode: this.cartCache.cit.props.BILLING_ZIPCODE || '',
      city: this.cartCache.cit.props.BILLING_CITY || '',
      address: this.cartCache.cit.props.BILLING_STREET || '',
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
  },
  methods: {
    getBoardName,
    formatDateDisplay,
    getGuestText,
    ...mapActions('hotel', ['payCart']),
    calcDistance(distance) {
      return (
        calcHotelDistance(distance) + ' ' + this.$t('hotel.FromTheCityCenter')
      )
    },
    async updateHotelHandlingFee() {
      const Price = this.getTotalPrice - this.getExtraVoucherPrice
      let VoucherPrice = this.getExtraVoucherPrice

      if (this.getAddedTravelCard > 0 || this.isThirdPartyBooking) {
        let handlingFeeRes
        try {
          handlingFeeRes = await this.$store.dispatch(
            'hotel/getHotelHandlingFee',
            {
              sum: Price,
              tc: this.getAddedTravelCard
            }
          )
        } catch (error) {
          this.handlingFee = getHandlingFee(
            Price - this.getAddedTravelCard >= 0
              ? Price - this.getAddedTravelCard
              : 0,
            'hotel'
          )
        }
        if (handlingFeeRes && handlingFeeRes.bankComission !== undefined) {
          this.handlingFee = handlingFeeRes.bankComission
        }

        if (Price - this.getAddedTravelCard < 0) {
          VoucherPrice = VoucherPrice - (this.getAddedTravelCard - Price)
          this.handlingFee = 0
        }
        this.handlingFee =
          Number(this.handlingFee) + Number(getHandlingFee(VoucherPrice, 'mlm'))
      } else {
        this.handlingFee = getHandlingFee(Price, 'hotel')
        this.handlingFee += getHandlingFee(VoucherPrice, 'mlm')
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

      for (let i = 0; i < this.passengers.length; i++) {
        for (let j = 0; j < this.passengers[i].length; j++) {
          if (
            this.passengers[i][j].firstNameError ||
            this.passengers[i][j].lastNameError
          ) {
            this.activeCard = ''
            this.showCartCard('passengers')
          }
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
    async pay() {
      if (this.isLoading) {
        return
      }

      this.validateBeforePay()

      if (!this.isLoggedIn) {
        window.location.reload()
      } else if (this.validatePayment) {
        this.isLoading = true

        const parsedPassangers = []
        for (let i = 0; i < this.passengers.length; i++) {
          const roomPassangers = []
          for (let j = 0; j < this.passengers[i].length; j++) {
            roomPassangers.push({
              title: this.titleSelect[this.passengers[i][j].title],
              firstname:
                i === 0 && j === 0 && !this.roleThirdPartyBooking
                  ? this.firstName
                  : this.passengers[i][j].firstName,
              lastname:
                i === 0 && j === 0 && !this.roleThirdPartyBooking
                  ? this.lastName
                  : this.passengers[i][j].lastName,
              age:
                this.passengers[i][j].age !== undefined &&
                this.passengers[i][j].age >= 0
                  ? this.passengers[i][j].age
                  : 30
            })
          }
          parsedPassangers.push(roomPassangers)
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
            passengers: parsedPassangers,
            billing: parsedBilling,
            save_billing: this.saveBillingData,
            search_id: this.cartCache.cit.search_id,
            processId: this.cartCache.cit.result.roompacks[0].processId,
            hotel_id: this.cartCache.cit.result.id,
            source: this.cartCache.cit.result.source,
            accept_new_price: this.activeNewPrice,
            tc: this.getAddedTravelCard,
            isThirdPartyBooking: this.isThirdPartyBooking,
            showed_price: this.getActualPrice,
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
          } else if (cartResp.status === 'NOT_ENOUGH_VOUCHER') {
            this.voucherErrorModalActive = true
          } else if (cartResp.status === 'NOT_ENOUGH_CREDIT') {
            this.creditErrorModalActive = true
          } else if (cartResp.status === 'NOT_ENOUGH_BPO') {
            this.bpoErrorModalActive = true
          } else if (cartResp.status === 'SAVE_BILLING_DATA_ERROR') {
            this.billingDataErrorModalActive = true
          } else if (cartResp.status === 'PRICE_CHANGE') {
            const cartCacheTMP = JSON.parse(JSON.stringify(this.cartCache))
            cartCacheTMP.price = cartResp.price
            cartCacheTMP.searched_price = cartResp.searched_price
            cartCacheTMP.other_price = cartResp.other_price
            cartCacheTMP.showed_price = cartResp.showed_price
            cartCacheTMP.showed_vocher = this.getVoucherNum
            cartCacheTMP.showed_bpo = this.getBPONum
            cartCacheTMP.showed_credit = cartCacheTMP.credit
            cartCacheTMP.credit = cartResp.credit
            cartCacheTMP.voucher = cartResp.voucher
            this.$store.commit('hotel/setCartCache', cartCacheTMP)
            this.priceChangeModalActive = true
          } else if (cartResp.status === 'PAYMENT_SUCCESS') {
            await this.$router.replace(
              this.localePath('/hotel/reservation-success')
            )
          } else if (cartResp.status === 'PAYMENT_PENDING') {
            await this.$router.replace(
              this.localePath('/hotel/reservation-pending')
            )
          } else if (cartResp.status === 'PAYMENT_FAILED') {
            await this.$router.replace(
              this.localePath('/hotel/reservation-failed')
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
    validatePassenger(key) {
      for (let i = 0; i < this.passengers.length; i++) {
        for (let j = 0; j < this.passengers[i].length; j++) {
          this.passengers[i][j].firstNameError = ''
          this.passengers[i][j].lastNameError = ''
          // FirstName validation
          if (this.passengers[i][j].firstName === '') {
            this.passengers[i][j].firstNameError = this.$t(
              'hotel.FirstNameRequired'
            )
          } else if (!/^[\x20-\x7E]+$/.test(this.passengers[i][j].firstName)) {
            this.passengers[i][j].firstNameError = this.$t(
              'hotel.FirstNamePatternError'
            )
          }
          // LastName validation
          if (this.passengers[i][j].lastName === '') {
            this.passengers[i][j].lastNameError = this.$t(
              'hotel.LastNameRequired'
            )
          } else if (!/^[\x20-\x7E]+$/.test(this.passengers[i][j].lastName)) {
            this.passengers[i][j].lastNameError = this.$t(
              'hotel.LastNamePatternError'
            )
          }
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

      if (
        this.billingData.name.includes("'") ||
        this.billingData.name.includes('"')
      ) {
        this.billingData.error.name = this.$t(
          'weboffice.BillingNamePatternError'
        )
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

      if (this.billingData.phone === '') {
        this.billingData.error.phone = this.$t('hotel.PhoneRequired')
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
    acceptNewPrice() {
      this.activeNewPrice = true
      this.priceChangeModalActive = false
    },
    purgeCache() {
      this.voucherErrorModalActive = false
      this.creditErrorModalActive = false
      this.bpoErrorModalActive = false
      this.$store.commit('hotel/setCartCache', false)
      this.$router.push(this.localePath('/'))
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
        this.billingData.name = this.cartCache.cit.props.BILLING_NAME
        this.billingData.country =
          parseInt(this.cartCache.cit.props.BILLING_COUNTRY) - 1
        this.billingData.postalCode = this.cartCache.cit.props.BILLING_ZIPCODE
        this.billingData.city = this.cartCache.cit.props.BILLING_CITY
        this.billingData.address = this.cartCache.cit.props.BILLING_STREET
      }
    },
    checkThirdPartyBooking() {
      if (!this.roleThirdPartyBooking) {
        this.passengers[0][0].firstName = this.firstName
        this.passengers[0][0].lastName = this.lastName
      }
      this.updateHotelHandlingFee()
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
