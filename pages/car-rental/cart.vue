<template>
  <div>
    <CartStatus v-if="cartStatusActive" :type="'pending'" />
    <div v-if="!cartStatusActive">
      <div class="bg-primary-gradient">
        <div
          class="flex flex-wrap items-center px-16 py-24 lg:py-16 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
        >
          <div class="hidden md:block md:flex-initial md:mr-16">
            <img
              src="~assets/images/white-turq/travel-services/car-rental/car-rental-60.svg"
              class="w-60 h-60"
            />
          </div>
          <div class="flex-grow leading-32 md:leading-24">
            <div class="flex flex-wrap">
              <div class="flex-initial mr-4">
                <span
                  class="cursor-help"
                  :title="
                    offer.details.drop_location_details.address.postal_code +
                      ' ' +
                      offer.details.drop_location_details.address.city +
                      ' - ' +
                      offer.details.drop_location_details.address.street
                  "
                  >{{
                    offer.details.pickup_location_details.address.city
                  }}</span
                >
                <span
                  ><i class="mx-4 fas fa-long-arrow-right"></i
                  ><span
                    class="cursor-help"
                    :title="
                      offer.details.pickup_location_details.address
                        .postal_code +
                        ' ' +
                        offer.details.pickup_location_details.address.city +
                        ' - ' +
                        offer.details.pickup_location_details.address.street
                    "
                  >
                    {{ offer.details.pickup_location_details.address.city }} -
                    {{ offer.details.pickup_location_details.address.street }}
                  </span></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
        <div
          class="flex flex-row mt-4 cursor-pointer"
          @click="
            $router.push(
              localePath(
                '/car-rental/search/' + offer.search_id + '/' + offer.veh_perf
              )
            )
          "
        >
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
            <ServicePreview
              :image-url="offer.image"
              :image-style="'bg-contain bg-no-repeat'"
              :image-height="'114px'"
              :date-text="getDateString"
              :cancellation-text="getCancellationText"
              :room-text="false"
              :guest-text="
                request.guests.adults +
                  request.guests.children +
                  ' ' +
                  $t('carrent.Guests')
              "
              class="mt-24 pt-16 md:hidden"
            >
              <div class="flex flex-col px-16 pt-16 pb-16">
                <div class="font-bold leading-16 text-black title-max-width">
                  {{ offer.title }}
                  <div
                    class="font-normal text-xs leading-12 text-grey-dark mt-4"
                  >
                    {{ $t('carrent.OrSimilar') }}
                  </div>
                </div>
                <div class="flex justify-end">
                  <img
                    :src="
                      offer.vendor_img !== undefined ? offer.vendor_img : ''
                    "
                    :title="offer.vendor"
                    class="cursor-help h-32 sm:h-16"
                  />
                </div>
              </div>
              <div class="bg-grey-light h-1"></div>
            </ServicePreview>
            <CartCard
              :type="
                acceptedBookingInformation
                  ? 'success'
                  : openedCard.bookingInformation
                  ? 'danger'
                  : ''
              "
              :icon="
                acceptedBookingInformation
                  ? 'fas fa-check'
                  : openedCard.bookingInformation
                  ? 'fas fa-exclamation-triangle text-danger'
                  : 'fas fa-question text-primary'
              "
              :title="$t('roundtrip.BookingInformationAccept')"
              :price="
                acceptedBookingInformation
                  ? getTotalPriceWhitoutInsurance
                  : false
              "
              :local-price="acceptedBookingInformation ? cashOnLocation : false"
              :active="activeCard === 'bookingInformation'"
              :help="$t('roundtrip.BookingInformationAccept')"
              class="mt-24"
              @showCartCard="showCartCard('bookingInformation')"
            >
              <div class="p-16">
                <div class="flex flex-col text-black">
                  <div class="font-bold mb-16 leading-16">
                    {{ $t('carrent.Conditions') }}
                  </div>
                  <div class="text-sm leading-14 font-bold mb-16">
                    <a
                      :href="offer.details.terms.TermsConditions"
                      class="link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="fas fa-file-download"></i>
                      {{ $t('carrent.TermsConditions') }}
                    </a>
                  </div>
                  <div class="text-sm leading-14 font-bold mb-16">
                    <a
                      :href="offer.details.terms.ProductInformation"
                      class="link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="fas fa-file-download"></i>
                      {{ $t('carrent.ProductInformation') }}
                    </a>
                  </div>
                </div>
                <div
                  class="flex flex-grow items-center font-bold cursor-pointer leading-14"
                  @click="
                    bookingInformation.remarks.active = !bookingInformation
                      .remarks.active
                  "
                  @mouseover="bookingInformation.remarks.hover = true"
                  @mouseleave="bookingInformation.remarks.hover = false"
                >
                  Remarks
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
                  <div class="mb-5">
                    {{ offer.details.fuel_information }}
                  </div>
                  <div>
                    {{ offer.details.payment_rule }}
                  </div>
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
                <div
                  class="flex flex-grow flex-row items-center font-bold cursor-pointer leading-14"
                  @click="
                    bookingInformation.pricedCoverages.active = !bookingInformation
                      .pricedCoverages.active
                  "
                  @mouseover="bookingInformation.pricedCoverages.hover = true"
                  @mouseleave="bookingInformation.pricedCoverages.hover = false"
                >
                  <div class="inline-block">
                    {{ $t('carrent.PriceInclude') }}
                  </div>
                  <div class="inline-block">
                    <i
                      :class="[
                        bookingInformation.pricedCoverages.active
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down',
                        bookingInformation.pricedCoverages.hover
                          ? 'opacity-50'
                          : ''
                      ]"
                      class="w-16 text-base ml-8 fas"
                    ></i>
                  </div>
                </div>
                <div
                  v-show="bookingInformation.pricedCoverages.active"
                  class="mt-16"
                >
                  <ul>
                    <li
                      v-for="(item, index) in offer.details.priced_coverages"
                      :key="index"
                    >
                      {{ item.name }}
                      {{
                        item.description != '' ? ' - ' + item.description : ''
                      }}
                    </li>
                  </ul>
                </div>
                <div
                  v-if="offer.details.priced_not_included.length > 0"
                  class="bg-grey-light h-1 my-16"
                ></div>
                <div
                  v-if="offer.details.priced_not_included.length > 0"
                  class="flex flex-grow flex-row items-center font-bold cursor-pointer leading-14"
                  @click="
                    bookingInformation.pricedNotIncluded.active = !bookingInformation
                      .pricedNotIncluded.active
                  "
                  @mouseover="bookingInformation.pricedNotIncluded.hover = true"
                  @mouseleave="
                    bookingInformation.pricedNotIncluded.hover = false
                  "
                >
                  <div class="inline-block">
                    {{ $t('carrent.PriceNotInclude') }} ({{
                      $t('carrent.CashOnLocation')
                    }})
                  </div>
                  <div class="inline-block">
                    <i
                      :class="[
                        bookingInformation.pricedNotIncluded.active
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down',
                        bookingInformation.pricedNotIncluded.hover
                          ? 'opacity-50'
                          : ''
                      ]"
                      class="w-16 text-base ml-8 fas"
                    ></i>
                  </div>
                </div>
                <div
                  v-show="bookingInformation.pricedNotIncluded.active"
                  class="mt-16"
                >
                  <ul>
                    <li
                      v-for="(item, index) in offer.details.priced_not_included"
                      :key="index"
                    >
                      <b>{{ item.name }}</b>
                      {{
                        item.description != '' ? ' - ' + item.description : ''
                      }}

                      <span v-if="parseInt(item.charge) > 0">
                        +
                        {{
                          item.charge
                            | formatNumber('0,0', {
                              thousandsSeparator: ' '
                            })
                        }}
                        EUR</span
                      >
                    </li>
                  </ul>
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
                <div
                  v-show="customEquipments.length > 0"
                  class="flex flex-grow flex-row items-center font-bold cursor-pointer leading-14"
                  @click="
                    bookingInformation.extraFees.active = !bookingInformation
                      .extraFees.active
                  "
                  @mouseover="bookingInformation.extraFees.hover = true"
                  @mouseleave="bookingInformation.extraFees.hover = false"
                >
                  <div class="inline-block">
                    {{ $t('carrent.OptionalEquipments') }}
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
                <div v-show="bookingInformation.extraFees.active" class="mt-16">
                  <div v-for="(item, index) in customEquipments" :key="index">
                    <InputCheckbox
                      v-model="item.selected"
                      @input="
                        isAdditionalDriverSelected()
                        calcCashOnLocation()
                      "
                    >
                      <div class="text-sm leading-14 sm:leading-20">
                        <b>{{ item.title }}</b>
                        <span class="ml-5"
                          >+ {{ currency }}
                          {{
                            Math.ceil(
                              item.type === 'per day'
                                ? parseFloat(item.price.EUR * getDays)
                                : parseFloat(item.price.EUR)
                            )
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                          / {{ getDays }} {{ $t('general.Days') }}
                        </span>
                      </div>
                    </InputCheckbox>
                  </div>
                </div>
              </div>
              <div
                v-if="Object.keys(offer.details.charges).length !== 0"
                class="bg-grey-light h-1"
              ></div>
              <div
                v-if="Object.keys(offer.details.charges).length !== 0"
                class="pb-12 mb-4 pl-32 sm:pt-16 sm:pb-12 sm:pl-16"
              >
                <div
                  v-for="(item, index) in offer.details.charges"
                  :key="index"
                  class="mb-5"
                >
                  <div class="font-bold mb-5">
                    {{ item.name }} -
                    {{
                      Math.ceil(parseFloat(item.charge.EUR))
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                    EUR
                  </div>
                  <div>{{ item.description }}</div>
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
                    {{ $t('carrent.acceptTerms') }}
                  </div>
                </InputCheckbox>
              </div>
            </CartCard>
            <CartCard
              v-if="
                Object.keys(offer.details.insurance_data).length !== 0 &&
                  offer.details.insurance_data.Description !== undefined
              "
              :type="insuranceStatus"
              :icon="'fas fa-exclamation-triangle text-danger'"
              :title="
                $t('carrent.Insurance') +
                  ' - ' +
                  offer.details.insurance_data.PolicyName
              "
              :help="$t('carrent.pleaseChooseInsurrance')"
              :price="getInsurancePrice"
              :active="activeCard === 'insurance'"
              class="mt-24"
              @showCartCard="showCartCard('insurance')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <div
                  class="mb-8 font-bold"
                  v-html="offer.details.insurance_data.Description"
                ></div>
                <div
                  v-html="offer.details.insurance_data.DetailedInformation"
                ></div>
                <div class="bg-grey-light h-1 my-16"></div>
                <div class="font-bold">
                  {{ $t('carrent.insuranceIncluded') }}
                </div>
                <div
                  v-for="(item, index) in insuranceData"
                  :key="index"
                  class="py-4 my-4"
                  :class="
                    index < insuranceData.length - 1
                      ? 'border-b border-primary-opaque'
                      : ''
                  "
                >
                  <div
                    class="flex flex-row font-bold text-primary"
                    :class="item.Content !== '' ? 'cursor-pointer' : 'pl-20'"
                    @click="
                      item.Content !== ''
                        ? (item.active = !item.active)
                        : (item.active = false)
                    "
                  >
                    <i
                      v-if="item.Content !== ''"
                      class="fa fa-chevron-down mr-8 mt-2 text-base leading-16 font-black cursor-pointer hover:opacity-80"
                    ></i
                    >{{ item.Title }}
                  </div>
                  <div v-if="item.active" class="py-8 pl-20">
                    {{ item.Content }}
                  </div>
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
                <div class="flex sm:flex-row items-center">
                  <div
                    class="insuranceapply text-xs leading-14"
                    v-html="offer.details.insurance_data.Disclaimer"
                  ></div>
                  <div class="sm:pl-16 pl-0 text-right">
                    <div class="w-100 text-2x font-bold">
                      EUR
                      {{
                        Math.ceil(parseFloat(offer.details.insurance.price))
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    {{ offer.details.insurance.type }}
                  </div>
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
                <div class="flex sm:flex-row flex-col justify-between">
                  <div
                    class="p-16 sm:mr-16 sm:text-base text-sm sm:mb-0 mb-16 text-center rounded border border-grey-light hover:border-primary cursor-pointer"
                    :class="
                      insurance === 'basic' ? 'bg-primary text-white' : ''
                    "
                    @click="
                      insurance = 'basic'
                      insuranceError = false
                      updateHandlingFee()
                    "
                  >
                    {{ $t('carrent.bookWithBasicProtection1') }}

                    <div class="font-bold sm:text-2x text-base mt-7">
                      {{ $t('carrent.bookWithBasicProtection2') }}
                    </div>
                  </div>
                  <div
                    class="p-16 sm:ml-16 sm:text-base text-sm  text-center rounded border border-grey-light hover:border-primary cursor-pointer"
                    :class="insurance === 'full' ? 'bg-primary text-white' : ''"
                    @click="
                      insurance = 'full'
                      insuranceError = false
                      updateHandlingFee()
                    "
                  >
                    {{ $t('carrent.bookWithFullProtection1') }}

                    <div class="font-bold sm:text-2x text-base mt-7">
                      {{ $t('carrent.bookWithFullProtection2') }}
                    </div>
                  </div>
                </div>
              </div>
            </CartCard>
            <CartCard
              :type="passengerDataStatus"
              :icon="'fas fa-exclamation-triangle text-danger'"
              :title="$t('general.PassengerData')"
              :help="$t('general.PassengerDataRequired')"
              :price="false"
              :active="activeCard === 'passengers'"
              class="mt-24"
              @showCartCard="showCartCard('passengers')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <div
                  v-for="(item, index) in passengers"
                  :key="index"
                  class="border-grey-light"
                  :class="index > 0 ? 'pt-24' : ''"
                >
                  <div class="text-sm leading-14  xl:mt-12 mt-24 font-bold">
                    {{ item.passenger }}
                  </div>
                  <div class="flex flex-col">
                    <div class="flex flex-row xl:ml-16">
                      <div class="w-84">
                        <InputDropdown
                          v-model="item.title"
                          :values="titleSelect"
                          :label="$t('general.Title')"
                          class="mt-12"
                        ></InputDropdown>
                      </div>
                      <div class="flex flex-row mt-24 sm:mt-12 sm:pl-16">
                        <div>
                          <InputText
                            v-model="item.lastName"
                            :class="'w-full'"
                            :label="$t('general.LastName')"
                            :error="item.error.lastName"
                            :placeholder="$t('general.LastName')"
                          />
                        </div>
                        <div class="pl-8">
                          <InputText
                            v-model="item.firstName"
                            :class="'w-full'"
                            :label="$t('general.FirstName')"
                            :error="item.error.firstName"
                            :placeholder="$t('general.FirstName')"
                          />
                        </div>
                        <div v-if="item.type === 'driver'" class="pl-8">
                          <InputDate
                            v-model="item.birthDate"
                            :class="'w-full'"
                            :label="$t('general.BirthDate')"
                            :error="item.error.birthDate"
                            :disable-past="false"
                            :placeholder="$t('general.BirthDate')"
                          />
                        </div>
                      </div>
                    </div>
                    <div v-if="item.type === 'driver'">
                      <div class="flex flex-row mt-24 xl:mt-12 xl:ml-16">
                        <div class="flex flex-row">
                          <div class="w-full">
                            <InputText
                              v-model="item.email"
                              :class="'w-full'"
                              :label="$t('general.Email')"
                              :error="item.error.email"
                              :placeholder="$t('general.Email')"
                            />
                          </div>
                          <div class="w-full pl-8">
                            <InputText
                              v-model="item.telephone"
                              :class="'w-full'"
                              :label="$t('general.Phone')"
                              :error="item.error.telephone"
                              :placeholder="$t('general.Phone')"
                            />
                          </div>
                          <div class="w-full pl-8">
                            <InputDropdown
                              v-model="request.driver.country"
                              class="w-full"
                              :values="countryListInput"
                              :is-readonly="true"
                              :label="$t('carrent.CountryOrResidence')"
                              :button-style="['bg-grey-light']"
                            ></InputDropdown>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-row mt-24 xl:mt-12 xl:ml-16">
                        <div class="w-177">
                          <InputText
                            v-model="item.postalcode"
                            :class="'w-full'"
                            :label="$t('carrent.PostalCode')"
                            :error="item.error.postalcode"
                            :placeholder="$t('carrent.PostalCode')"
                          />
                        </div>
                        <div class="pl-8">
                          <InputText
                            v-model="item.city"
                            :class="'w-full'"
                            :label="$t('general.City')"
                            :error="item.error.city"
                            :placeholder="$t('general.City')"
                          />
                        </div>
                        <div class="pl-8">
                          <InputText
                            v-model="item.address"
                            :class="'w-full'"
                            :label="$t('general.Address')"
                            :error="item.error.address"
                            :placeholder="$t('general.Address')"
                          />
                        </div>
                      </div>
                    </div>
                    <div v-show="additionalDriverSelected">
                      <div class="text-sm leading-14 font-bold xl:mt-12 mt-24">
                        Plusz sofőr
                      </div>
                      <div class="flex flex-row xl:ml-16">
                        <div class="w-84">
                          <InputDropdown
                            v-model="additionalDriver.title"
                            :values="titleSelect"
                            :label="$t('general.Title')"
                            class="mt-12"
                          ></InputDropdown>
                        </div>
                        <div class="flex flex-row mt-24 sm:mt-12 sm:pl-16">
                          <div>
                            <InputText
                              v-model="additionalDriver.GivenName"
                              :class="'w-full'"
                              :label="$t('general.LastName')"
                              :error="additionalDriver.error.GivenName"
                              :placeholder="$t('general.LastName')"
                            />
                          </div>
                          <div class="pl-8">
                            <InputText
                              v-model="additionalDriver.surName"
                              :class="'w-full'"
                              :label="$t('general.FirstName')"
                              :error="additionalDriver.error.surName"
                              :placeholder="$t('general.FirstName')"
                            />
                          </div>
                          <div class="pl-8">
                            <InputDate
                              v-model="additionalDriver.birthDate"
                              :class="'w-full'"
                              :label="$t('general.BirthDate')"
                              :error="additionalDriver.error.birthDate"
                              :disable-past="false"
                              :placeholder="$t('general.BirthDate')"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CartCard>
            <CartCard
              :type="billingDataStatus"
              :icon="'fas fa-question text-primary'"
              :title="$t('general.BillingDetails')"
              :help="$t('general.BillingDetailsHelp')"
              :active="activeCard === 'billing'"
              class="mt-24"
              @showCartCard="showCartCard('billing')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox v-model="copyAdult1">
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
                        :label="'Irányítószám'"
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
          <div class="md:flex-shrink-0 md:ml-8 md:w-240 xl:w-288">
            <div
              class="hidden text-lg font-bold text-black leading-24 mt-20 md:block"
            >
              {{ $t('general.Summary') }}
            </div>
            <ServicePreview
              :image-url="offer.image"
              :image-style="'bg-contain bg-no-repeat'"
              :image-height="'114px'"
              :date-text="getDateString"
              :room-text="false"
              :cancellation-text="getCancellationText"
              :guest-text="
                request.guests.adults +
                  request.guests.children +
                  ' ' +
                  $t('carrent.Guests')
              "
              class="hidden md:block mt-16 pt-16"
            >
              <div class="flex flex-row px-16 pt-16 pb-16 md:pb-0">
                <div class="font-bold leading-16 text-black title-max-width">
                  {{ offer.title }}
                  <div
                    class="font-normal text-xs leading-12 text-grey-dark mt-4"
                  >
                    {{ $t('carrent.OrSimilar') }}
                  </div>
                </div>
                <div class="flex justify-end">
                  <img
                    :src="
                      offer.vendor_img !== undefined ? offer.vendor_img : ''
                    "
                    :title="offer.vendor"
                    class="cursor-help h-32 sm:h-16"
                  />
                </div>
              </div>
              <div class="bg-grey-light h-1 mt-16"></div>
            </ServicePreview>
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
                  <div v-show="offer.price[currency] > 0">
                    {{ currency }}
                    {{
                      Math.ceil(parseFloat(offer.price[currency]))
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
                  {{ $t('general.CurrentTC') }}: {{ currency }}
                  {{
                    tcBalance
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
              </div>
              <div
                v-show="cashOnLocation > 0"
                class="bg-grey-light px-16 pb-20 text-black"
              >
                <div class="flex flex-row mt-16">
                  <div class="flex flex-col flex-grow">
                    <div class="text-sm leading-14 font-bold">
                      {{ $t('carrent.CashOnLocation') }}
                    </div>
                    <div class="text-3x leading-20 font-bold mt-4">
                      {{ currency }}
                      {{
                        cashOnLocation
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-primary-gradient px-16 pb-20 text-white">
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-white w-0 h-0"></div>
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
                      getAddedTravelCard > 0
                  "
                  class="h-1 bg-white bg-opacity-30 my-12"
                ></div>
                <div
                  v-show="getTotalPrice - getAddedTravelCard > 0"
                  class="flex flex-row mt-16"
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
      <NMIModal
        v-show="nmiPopupActive"
        :popup="nmiPopup"
        @close="
          nmiPopupActive = false
          nmiPopup = false
        "
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { differenceInYears } from 'date-fns'

import InputCheckbox from '@/components/micro/InputCheckbox'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import InputTextMask from '@/components/micro/InputTextMask'
import InputDate from '@/components/micro/InputDate'

import NMIModal from '@/components/modal/NMIModal'

import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import CartStatus from '@/components/cart/CartStatus'

import {
  getHandlingFee,
  getCountrySelectDatas,
  formatDateDisplay,
  calcNights
} from '@/includes/utils'

export default {
  name: 'CarRentalCart',
  components: {
    InputCheckbox,
    InputDropdownCountry,
    InputDropdown,
    InputTextMask,
    InputText,
    InputDate,
    CartCard,
    ServicePreview,
    CartStatus,
    NMIModal
  },
  async asyncData({ app, store, route, redirect }) {
    let offer = false
    let request = false

    let responses
    try {
      responses = await Promise.all([store.dispatch('user/getPersonalData')])
    } catch (e) {
      redirect(app.localePath('index'))
    }

    if (store.state['car-rental'] && store.state['car-rental'].cartCache) {
      offer = store.state['car-rental'].cartCache.results
      request = store.state['car-rental'].cartCache.request
    }
    const [props] = responses

    return {
      request,
      offer,
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
        },
        pricedCoverages: {
          active: true,
          hover: false
        },
        pricedNotIncluded: {
          active: true,
          hover: false
        }
      },
      acceptedBookingInformation: false,
      copyAdult1: false,
      saveBillingData: false,
      guests: {
        adults: 2,
        children: 1
      },
      titleSelect: ['Mr', 'Mrs'],
      nationalitySelect: ['magyar', 'német'],
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
      countrySelect: getCountrySelectDatas().countrySelect,
      countrySelectIds: getCountrySelectDatas().countrySelectIds,
      countrySelectCodes: getCountrySelectDatas().countrySelectCodes,
      passengers: [],
      customEquipments: [],
      additionalDriver: {
        title: 0,
        GivenName: '',
        surName: '',
        birthDate: '1980-01-01',
        error: {
          GivenName: '',
          surName: '',
          birthDate: ''
        }
      },
      billingData: {},
      travelCard: '0',
      currency: 'EUR',
      cartStatusActive: false,
      handlingFee: 0,
      nmiPopupActive: false,
      nmiPopup: false,
      isLoading: false,
      additionalDriverSelected: false,
      countryListInput: [],
      countryListRaw: [],
      insuranceData: [],
      insurance: false,
      insuranceError: false,
      cashOnLocation: 0
    }
  },
  computed: {
    ...mapGetters('car-rental', ['cartCache']),
    ...mapGetters('user', ['getFees', 'isLoggedIn']),
    insuranceStatus() {
      if (!this.openedCard.insurance) {
        return 'default'
      }
      if (this.insuranceError) {
        return 'danger'
      }
      return 'success'
    },
    passengerDataStatus() {
      if (!this.openedCard.passengers) {
        return 'default'
      }

      if (
        this.additionalDriver.error.GivenName !== '' ||
        this.additionalDriver.error.surName !== ''
      ) {
        return 'danger'
      }

      for (const passenger of this.passengers) {
        if (
          passenger.error.firstName ||
          passenger.error.lastName ||
          this.passengers[0].error.birthDate
        ) {
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
    activePaymentButton() {
      for (const value of Object.entries(this.openedCard)) {
        if (!value[1]) {
          return false
        }
      }
      return true
    },
    tcBalance() {
      const fees = this.getFees
      return fees === false ? 0 : Math.floor(fees.tc.credit)
    },
    getDays() {
      if (this.offer.calculation.unit !== undefined) {
        if (this.offer.calculation.unit === 'Day') {
          return this.offer.calculation.quantity
        }
      }
      return calcNights(this.request.pickup_date, this.request.drop_date)
    },
    getCancellationText() {
      return this.offer.details.cancellable
        ? formatDateDisplay(this.offer.details.cancellable_until)
        : this.$t('general.NonRefundable')
    },
    getDateString() {
      const pickup = new Date(this.request.pickup_date)
      const drop = new Date(this.request.drop_date)
      return (
        formatDateDisplay(
          pickup.getFullYear(),
          pickup.getMonth() + 1,
          pickup.getDate()
        ) +
        ' (' +
        (pickup.getHours() <= 9 ? 0 : '') +
        pickup.getHours() +
        ':' +
        (pickup.getMinutes() <= 9 ? 0 : '') +
        pickup.getMinutes() +
        ')' +
        " <span class='inline md:hidden xl:inline'>-</span><br class='hidden md:block xl:hidden' />" +
        formatDateDisplay(
          drop.getFullYear(),
          drop.getMonth() + 1,
          drop.getDate()
        ) +
        ' (' +
        (drop.getHours() <= 9 ? 0 : '') +
        drop.getHours() +
        ':' +
        (drop.getMinutes() <= 9 ? 0 : '') +
        drop.getMinutes() +
        ')'
      )
    },
    getMinMaxString() {
      const ret = [
        this.offer.details.age_restriction.minimum !== undefined
          ? 'Min ' + this.offer.details.age_restriction.minimum
          : null,
        this.offer.details.age_restriction.maximum !== undefined
          ? 'Max ' + this.offer.details.age_restriction.maximum
          : null
      ]
      return ret.join(', ') + ' év'
    },
    getAdultAges() {
      const ret = []
      const min =
        this.offer.details.age_restriction.minimum !== undefined
          ? this.offer.details.age_restriction.minimum
          : 18
      const max =
        this.offer.details.age_restriction.maximum !== undefined
          ? this.offer.details.age_restriction.maximum
          : 99
      for (let i = min; i < max; i++) {
        ret.push(i)
      }
      return ret
    },
    getTotalPrice() {
      return this.insurance !== 'full'
        ? Math.ceil(parseFloat(this.offer.price[this.currency]))
        : Math.ceil(parseFloat(this.offer.price[this.currency])) +
            Math.ceil(parseFloat(this.offer.details.insurance.price))
    },
    getTotalPriceWhitoutInsurance() {
      return Math.ceil(parseFloat(this.offer.price[this.currency]))
    },
    getInsurancePrice() {
      return this.insurance !== false
        ? this.insurance !== 'basic'
          ? Math.ceil(parseFloat(this.offer.details.insurance.price))
          : 0
        : false
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
    }
  },
  mounted() {
    this.fillCountryList()
    this.calcCashOnLocation()
    this.additionalDriverSelected = false
    this.insurance = false
    this.insuranceError = false
    this.isLoading = false
    if (this.offer === false) {
      this.$router.push(this.localePath('/'))
      this.$store.dispatch('general/showSnackbar', {
        message: this.$t('carrent.EmptyCart')
      })
    }

    this.billingData = {
      name: this.props.BILLING_NAME || '',
      country: parseInt(this.props.BILLING_COUNTRY) || '',
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

    this.passengers.push({
      passenger:
        this.$t('general.Adult') + '1' + ' (' + this.$t('carrent.driver') + ')',
      type: 'driver',
      email: '',
      title: 0,
      firstName: '',
      lastName: '',
      nationality: this.request.driver.country,
      nationalityCode: this.request.driver.country,
      address: '',
      city: '',
      postalcode: '',
      telephone: '',
      birthDate: '1970-01-01',
      error: {
        nationality: false,
        firstName: false,
        lastName: false,
        birthDate: '',
        postalcode: false,
        telephone: false,
        city: false,
        address: false,
        email: false
      }
    })

    this.customEquipments = []

    Object.values(this.offer.details.equipments).forEach((val) => {
      this.customEquipments.push({ ...val, selected: false })
    })

    this.insuranceData = []

    if (this.offer.details.insurance_data.length > 0) {
      Object.values(this.offer.details.insurance_data.InclusionsList).forEach(
        (val) => {
          this.insuranceData.push({ ...val, active: false })
        }
      )
    }

    this.updateHandlingFee()
  },
  methods: {
    ...mapActions('carRental', ['payCart']),
    async fillCountryList() {
      let res = false
      res = await this.$store.dispatch('car-rental/getCountries', {
        lang: this.$i18n.locale
      })

      if (res !== undefined) {
        this.countryListRaw = res
        this.countryListRaw.forEach((item) => {
          this.countryListInput.push(item.name)
        })
      }

      let i = 0
      this.countryListRaw.forEach((item) => {
        if (item.ISO === this.request.driver.country) {
          console.log('GOT IT')
          this.request.driver.country = i
        }
        i++
      })
    },
    isAdditionalDriverSelected() {
      this.additionalDriverSelected = false
      for (const equipment of this.customEquipments) {
        if (equipment.id === '222' && equipment.selected) {
          this.additionalDriverSelected = true
        }
      }
    },
    calcCashOnLocation() {
      this.cashOnLocation = 0
      console.log(this.customEquipments)
      for (const charge of this.offer.details.priced_not_included) {
        this.cashOnLocation += parseFloat(charge.charge)
      }
      for (const equipment of this.customEquipments) {
        if (equipment.selected) {
          this.cashOnLocation += Math.ceil(
            equipment.type === 'per day'
              ? parseFloat(equipment.price.EUR * this.getDays)
              : parseFloat(equipment.price.EUR)
          )
        }
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
        } else if (this.activeCard === 'insurance') {
          this.validateInsurance()
        }
      }

      if (this.activeCard === index) {
        this.activeCard = false
      } else {
        this.activeCard = index
      }
    },
    updateHandlingFee() {
      this.handlingFee = getHandlingFee(
        this.getTotalPrice - this.getAddedTravelCard,
        'hotel'
      )
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
    getAge(dateString) {
      const today = new Date()
      const birthDate = new Date(dateString)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    validatePassenger() {
      console.log(this.request.driver.age)
      this.additionalDriver.error.surName = ''
      this.additionalDriver.error.GivenName = ''

      if (
        this.additionalDriver.surName === '' &&
        this.additionalDriverSelected
      ) {
        this.additionalDriver.error.surName = this.$t('hotel.FirstNameRequired')
      }
      if (
        this.additionalDriver.GivenName === '' &&
        this.additionalDriverSelected
      ) {
        this.additionalDriver.error.GivenName = this.$t(
          'hotel.LastNameRequired'
        )
      }

      for (let i = 0; i < this.passengers.length; i++) {
        for (const keyError in this.passengers[i].error) {
          this.passengers[i].error[keyError] = ''
        }

        let birthDateTmp = this.passengers[i].birthDate
        const today = new Date()

        if (typeof birthDateTmp.split !== 'undefined') {
          const arr = birthDateTmp.split(/[- :]/)
          birthDateTmp = new Date(
            arr[0],
            arr[1] - 1,
            arr[2],
            arr[3] !== undefined ? arr[3] : 0,
            arr[4] !== undefined ? arr[4] : 0,
            arr[5] !== undefined ? arr[5] : 0
          )
        } else {
          birthDateTmp = new Date(birthDateTmp)
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
        if (this.passengers[i].telephone === '') {
          this.passengers[i].error.telephone = this.$t('general.FieldRequired')
        }
        if (this.passengers[i].email === '') {
          this.passengers[i].error.email = this.$t('general.FieldRequired')
        }
        if (this.passengers[i].address === '') {
          this.passengers[i].error.address = this.$t('general.FieldRequired')
        }
        if (this.passengers[i].city === '') {
          this.passengers[i].error.city = this.$t('general.FieldRequired')
        }
        if (this.passengers[i].type === 'driver') {
          if (this.passengers[i].birthDate === '') {
            this.passengers[i].error.birthDate = this.$t(
              'general.birthDateRequired'
            )
          } else if (
            differenceInYears(today, birthDateTmp) !==
            parseInt(this.request.driver.age)
          ) {
            this.passengers[i].error.birthDate = this.$t(
              'general.birthDateRestrictionError'
            )
          } else if (this.offer.details !== undefined) {
            if (this.offer.details.age_restriction !== undefined) {
              if (
                this.getAge(this.passengers[i].birthDate) >
                  this.offer.details.age_restriction.maximum ||
                this.getAge(this.passengers[i].birthDate) <
                  this.offer.details.age_restriction.minimum
              ) {
                this.passengers[i].error.birthDate = this.$t(
                  'general.birthDateRestrictionError'
                )
              }
            }
          }

          if (this.passengers[i].postalcode === '') {
            this.passengers[i].error.postalcode = this.$t(
              'general.postalCodeRequired'
            )
          }
        }
      }
    },
    validateInsurance() {
      if (
        this.insurance === false &&
        Object.keys(this.offer.details.insurance_data).length !== 0
      ) {
        this.insuranceError = true
      } else {
        this.insuranceError = false
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
    validateBeforePay() {
      this.validatePassenger()
      this.validateBilling()

      this.openedCard.bookingInformation = true
      this.openedCard.passengers = true
      this.openedCard.billing = true
      // this.openedCard.insurance = true

      console.log(this.additionalDriver.error)

      if (
        (this.additionalDriver.error.GivenName ||
          this.additionalDriver.error.surName) &&
        this.additionalDriverSelected
      ) {
        this.activeCard = ''
        this.showCartCard('passengers')
        return false
      }

      for (const passenger of this.passengers) {
        if (passenger.error.firstName || passenger.error.lastName) {
          this.activeCard = ''
          this.showCartCard('passengers')
          return false
        }

        if (passenger.type === 'driver') {
          if (
            passenger.error.birthDate ||
            passenger.error.postalcode ||
            passenger.error.telephone ||
            passenger.error.city ||
            passenger.error.address ||
            passenger.error.email
          ) {
            this.activeCard = ''
            this.showCartCard('passengers')
            return false
          }
        }
      }

      for (const keyError in this.billingData.error) {
        if (this.billingData.error[keyError] !== '') {
          this.activeCard = ''
          this.showCartCard('billing')
          return false
        }
      }

      if (this.acceptedBookingInformation === false) {
        this.activeCard = ''
        this.showCartCard('bookingInformation')
        return false
      }
      return true
    },
    async pay() {
      if (this.isLoading) {
        return
      }

      if (!this.isLoggedIn) {
        window.location.reload()
      } else if (this.validateBeforePay()) {
        console.log('After validate')
        this.isLoading = true

        // console.log(this.passengers)
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
            search_id: this.offer.search_id,
            vehID: this.offer.veh_perf,
            equipments: this.customEquipments,
            insurance:
              this.insurance !== false ? this.insurance !== 'basic' : false,
            passengers: this.passengers,
            additional_driver: this.additionalDriverSelected
              ? this.additionalDriver
              : [],
            billing: parsedBilling,
            save_billing: this.saveBillingData,
            lang: this.$i18n.locale ?? 'en',
            tc: this.getAddedTravelCard
          })

          console.log('cartResp', cartResp)
        } catch (error) {
          this.isLoading = false
          console.log('error', error)
          if (error.response !== undefined) {
            const serverMessage = await error.response.json()
            this.$store.dispatch('general/showSnackbar', {
              message: serverMessage.messages || 'Unknown error'
            })
          }
        }

        console.log('cartResp', cartResp)

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
    }
  }
}
</script>
<style>
.insuranceapply a {
  color: #00adb5 !important;
}
</style>
