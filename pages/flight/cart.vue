<template>
  <div v-if="flight.firstLeg !== undefined">
    <CartStatus
      v-if="cartStatusActive"
      :type="'success'"
      :show-relevant-offers="true"
    />
    <div v-if="!cartStatusActive">
      <div class="bg-primary-gradient">
        <div
          class="flex flex-wrap items-center px-16 py-24 max-w-screen-xl mx-auto text-white font-bold text-lg leading-30 md:leading-24 lg:py-16 xl:px-40"
        >
          <div class="hidden md:block md:flex-initial md:mr-16">
            <img
              src="~assets/images/white-turq/travel-services/flight/flight-60.svg"
              class="w-60 h-60"
            />
          </div>
          <div class="flex-grow leading-32 md:leading-24">
            <div class="flex flex-wrap">
              <div class="flex-initial mr-4">
                <span
                  class="cursor-help"
                  :title="flight.firstLeg.departure.airport.name"
                  >{{ flight.firstLeg.departure.airport.code }}</span
                >
                <span>
                  <i class="mx-4 far fa-exchange"></i>
                  <span
                    class="cursor-help"
                    :title="flight.firstLeg.arrival.airport.name"
                  >
                    {{ flight.firstLeg.arrival.airport.code }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-16 max-w-screen-xl mx-auto xl:px-40">
        <div class="flex flex-row mt-4 cursor-pointer" @click="$router.back()">
          <i class="fa fa-chevron-left text-primary text-sm leading-14"></i>
          <p class="ml-8 text-sm leading-14 link font-bold mb-6">
            {{ $t('general.Back') }}
          </p>
        </div>
        <div class="flex flex-col items-stretch md:flex-row">
          <div class="mb-40 md:mr-8">
            <div class="text-lg font-bold text-black leading-24 mt-20">
              {{ $t('general.Reservation') }}
            </div>
            <StatusMessage :type="'warning'" class="mt-16 leading-20">
              {{ $t('general.FlightReservationStatusMessagePart1') }}
              <br /><br />
              <span class="font-bold">{{
                $t('general.FlightReservationStatusMessagePart2')
              }}</span
              >: {{ $t('general.FlightReservationStatusMessagePart3') }}
            </StatusMessage>
            <ServicePreview
              :image-url="false"
              :date-text="
                flight.firstLeg.departure.dateTime.substring(0, 10) +
                  (flight.returnLeg !== undefined
                    ? ' - ' + flight.returnLeg.arrival.dateTime.substring(0, 10)
                    : '')
              "
              :room-text="false"
              :guest-text="
                getGuestText(
                  parseInt(request.guests.adults),
                  parseInt(request.guests.children)
                )
              "
              :cancellation-text="$t('general.NonRefundable')"
              :details-style="
                'sm:pt-48 md:pt-16 sm:border-l md:border-l-0 sm:border-grey-light'
              "
              class="mt-24 pt-16 sm:pt-0 md:hidden"
            >
              <FlightCartCard
                :timeline-extra-class="'sm:flex-grow-0 sm:w-82'"
                :flight="flight"
              />
              <div
                class="bg-grey-light h-1 mt-16 sm:bg-white md:bg-grey-light"
              ></div>
            </ServicePreview>
            <CartCard
              :type="
                acceptedBookingInformation
                  ? 'success'
                  : openedCard.bookingInformation
                  ? 'danger'
                  : ''
              "
              :title="$t('general.BookingInformation')"
              :price="
                acceptedBookingInformation
                  ? Math.ceil(flight.total_fare[currency])
                  : false
              "
              :active="activeCard === 'bookingInformation'"
              :help="$t('general.BookingInformationRequired')"
              class="mt-24"
              @showCartCard="showCartCard('bookingInformation')"
            >
              <div class="p-16">
                <div
                  v-for="(supplierInfo,
                  supplierInfoKey) in flight.supplier_info"
                  :key="supplierInfoKey"
                >
                  <div
                    class="flex flex-grow items-center font-bold cursor-pointer leading-14 mt-8"
                    @click="supplierInfo.active = !supplierInfo.active"
                    @mouseover="supplierInfo.hover = true"
                    @mouseleave="supplierInfo.hover = false"
                  >
                    {{ supplierInfo.name }}
                    <i
                      :class="[
                        supplierInfo.active
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down',
                        supplierInfo.hover ? 'opacity-50' : ''
                      ]"
                      class="w-16 text-base ml-8 fas"
                    ></i>
                  </div>
                  <div v-show="supplierInfo.active" class="mt-16">
                    {{ supplierInfo.value }}
                  </div>
                  <div class="bg-grey-light h-1 my-16"></div>
                </div>
                <div
                  v-show="
                    flight.rules_link !== undefined &&
                      flight.rules_link !== null &&
                      flight.rules_link.length > 0
                  "
                  class="flex flex-col mt-16 text-black"
                >
                  <div class="font-bold mb-16 leading-16">
                    {{ $t('general.BookingConditions') }}
                  </div>
                  <div
                    v-for="(term, index) in flight.rules_link"
                    :key="index"
                    class="text-sm leading-14 font-bold mb-16"
                  >
                    <a
                      :href="term"
                      class="link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="fas fa-file-download"></i>
                      {{ term }}
                    </a>
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
                    {{ $t('general.AcceptBookingConditions') }}
                  </div>
                </InputCheckbox>
              </div>
            </CartCard>
            <CartCard
              v-for="(passenger, key) in passengers"
              :key="key"
              :type="passengerDataStatus(passenger)"
              :title="passenger.passenger"
              :active="activeCard === passenger.key"
              :price="
                passengerDataStatus(passenger) === 'success'
                  ? getPassengerExtraPrice(passenger)
                  : false
              "
              :help="$t('general.PassengerDataRequired')"
              class="mt-24"
              @showCartCard="showCartCard(passenger.key)"
            >
              <div class="flex flex-col mt-24 mx-16">
                <div class="text-sm leading-14 font-bold text-black">
                  {{ $t('general.PassengerData') }}
                </div>
                <div class="flex flex-col xl:flex-row">
                  <div class="flex flex-col sm:flex-row lg:w-11/12 xl:w-2/3">
                    <div class="w-80">
                      <InputDropdown
                        v-model="passenger.title"
                        :values="titleSelect"
                        :label="$t('general.Title')"
                        :error="passenger.error.title"
                        class="mt-12"
                      ></InputDropdown>
                    </div>
                    <div
                      class="flex flex-row mt-24 sm:mt-12 sm:pl-16 lg:flex-grow"
                    >
                      <div class="pr-8 w-full">
                        <InputText
                          v-model="passenger.lastName"
                          :class="'w-full'"
                          :label="$t('general.LastName')"
                          :placeholder="
                            passenger.lastNameError
                              ? $t('general.LastName')
                              : ''
                          "
                          :error="passenger.error.lastName"
                        />
                      </div>
                      <div class="pl-8 w-full">
                        <InputText
                          v-model="passenger.firstName"
                          :class="'w-full'"
                          :label="$t('general.FirstName')"
                          :placeholder="
                            passenger.firstNameError
                              ? $t('general.FirstName')
                              : ''
                          "
                          :error="passenger.error.firstName"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-row mt-24 xl:w-1/3 xl:mt-12 xl:ml-16">
                    <div class="w-107 xl:w-auto xl:flex-grow">
                      <InputDropdown
                        v-model="passenger.gender"
                        :values="genderSelect"
                        :label="$t('general.Gender')"
                        :error="passenger.error.gender"
                      ></InputDropdown>
                    </div>
                    <div class="w-133 ml-16 relative">
                      <InputDate
                        v-model="passenger.birthday"
                        :disable-past="false"
                        :label="$t('general.BirthDate')"
                        class="flex flex-wrapper w-full"
                        :error="passenger.error.birthday"
                      />
                      <i
                        class="absolute far fa-calendar-alt top-0 right-0 mt-34 mr-8 text-sm"
                      ></i>
                    </div>
                  </div>
                </div>
                <div class="bg-grey-light h-1 mt-20 mb-24"></div>
                <div class="flex flex-col">
                  <div class="text-sm leading-14 font-bold text-black">
                    {{ $t('general.DocumentType') }}
                  </div>
                  <div class="w-full flex flex-col xl:flex-row">
                    <div class="flex flex-col lg:flex-row lg:w-10/12 xl:w-2/3">
                      <div
                        class="flex flex-col mt-16 w-2/3 sm:flex-row sm:w-11/12 lg:flex-grow lg:w-8/12 xl:w-7/12"
                      >
                        <InputDropdown
                          v-model="passenger.travelDocumentType"
                          :values="travelDocuments"
                          :placeholder="$t('general.PleaseSelect')"
                          :label="$t('general.Type')"
                          :class="'sm:w-1/2'"
                          :is-filterable="true"
                          :error="passenger.error.travelDocumentType"
                        ></InputDropdown>
                        <InputText
                          v-model="passenger.travelDocumentNumber"
                          :label="$t('general.DocumentNumber')"
                          :placeholder="
                            passenger.travelDocumentType === false
                              ? 'Válassz típust!'
                              : ''
                          "
                          :is-disabled="passenger.travelDocumentType === false"
                          :error="passenger.error.travelDocumentNumber"
                          class="mt-24 sm:ml-16 sm:mt-0 sm:w-1/2"
                        ></InputText>
                      </div>
                      <div class="w-133 mt-24 lg:mt-16 lg:ml-16 relative">
                        <InputDate
                          v-model="passenger.travelDocumentExpire"
                          :label="$t('general.ExpirationDate')"
                          :disable-past="false"
                          :error="passenger.error.travelDocumentExpire"
                          class="flex flex-wrapper w-full"
                        />
                        <i
                          class="far fa-calendar absolute top-0 right-0 mt-34 mr-8"
                        ></i>
                      </div>
                    </div>
                    <div class="mt-24 xl:mt-16 xl:ml-16 xl:w-1/3">
                      <InputDropdown
                        v-model="passenger.travelDocumentCountry"
                        :values="countrySelect"
                        :placeholder="$t('general.PleaseSelect')"
                        :label="$t('general.DocumentCountry')"
                        :class="'sm:w-288'"
                        :is-filterable="true"
                        :error="passenger.error.travelDocumentCountry"
                      ></InputDropdown>
                    </div>
                  </div>
                </div>
                <div class="bg-grey-light h-1 my-24"></div>
                <div v-if="passenger.type === 'adult' || passenger.age > 1">
                  <div class="flex flex-col">
                    <div class="text-sm leading-14 font-bold text-black">
                      {{ $t('general.Baggages') }}
                    </div>
                    <StatusMessage :type="'warning'" class="mt-16 leading-20">
                      {{ $t('flight.BaggageDescription') }}
                    </StatusMessage>
                    <div class="flex flex-col xl:flex-row">
                      <div class="flex flex-col xl:w-1/3 xl:pr-8">
                        <div class="mt-16 w-full">
                          <InputDropdown
                            v-model="passenger.carryOnBaggage"
                            :values="carryOnBaggageSelect"
                            :placeholder="$t('general.PleaseSelect')"
                            :label="$t('flight.CarryOnBaggage')"
                            @input="updateFlightHandlingFee"
                          ></InputDropdown>
                        </div>
                      </div>
                      <div class="flex flex-col lg:flex-row xl:w-2/3 xl:pl-8">
                        <div class="mt-16 lg:w-1/2">
                          <InputDropdown
                            v-model="passenger.outwardBaggage"
                            :values="outwardBaggageSelect"
                            :placeholder="$t('general.PleaseSelect')"
                            :label="$t('flight.OutwardBaggage')"
                            @input="updateFlightHandlingFee"
                          ></InputDropdown>
                        </div>
                        <div class="mt-16 lg:ml-16 lg:w-1/2">
                          <InputDropdown
                            v-model="passenger.returnBaggage"
                            :values="returnBaggageSelect"
                            :placeholder="$t('general.PleaseSelect')"
                            :label="$t('flight.ReturnBaggage')"
                            @input="updateFlightHandlingFee"
                          ></InputDropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-grey-light h-1 my-24"></div>
                  <div class="flex flex-col">
                    <div class="text-sm leading-14 font-bold text-black">
                      {{ $t('flight.CheckinMode') }}
                    </div>
                    <StatusMessage :type="'warning'" class="mt-16 leading-20">
                      {{ $t('flight.CheckinDesc') }}
                    </StatusMessage>
                    <div class="mt-16">
                      <InputDropdown
                        v-model="passenger.checkin"
                        :values="checkinSelect"
                        :placeholder="$t('general.PleaseSelect')"
                        :label="$t('flight.CheckinOption')"
                        :class="'sm:w-288'"
                        @input="updateFlightHandlingFee"
                      ></InputDropdown>
                    </div>
                  </div>
                  <div class="bg-grey-light h-1 my-24"></div>
                  <div class="flex flex-col mb-24">
                    <div class="text-sm leading-14 font-bold text-black">
                      {{ $t('flight.Priority') }}
                    </div>
                    <StatusMessage :type="'warning'" class="mt-16 leading-20">
                      {{ $t('flight.PriorityDesc') }}
                    </StatusMessage>
                    <div class="mt-16">
                      <InputDropdown
                        v-model="passenger.priority"
                        :values="prioritySelect"
                        :placeholder="$t('general.PleaseSelect')"
                        :label="$t('flight.PriorityOption')"
                        :class="'sm:w-288'"
                        :is-disabled="key !== 0"
                        @input="changePriority(passenger)"
                      ></InputDropdown>
                    </div>
                  </div>
                </div>
              </div>
            </CartCard>
            <CartCard
              :type="contactDataStatus()"
              :title="$t('general.Contact')"
              :active="activeCard === 'contact'"
              :help="$t('general.ContactRequired')"
              class="mt-24"
              @showCartCard="showCartCard('contact')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox
                  v-model="contact.copyAdult1"
                  @input="copyAdult1DataToContactData"
                >
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('general.BillingSameAsAdult1') }}
                  </div>
                </InputCheckbox>
                <div class="mt-24 pt-24 border-t border-grey-light">
                  <div class="flex flex-row">
                    <InputText
                      v-model="contact.lastName"
                      :class="'w-full lg:w-240 mr-8'"
                      :label="$t('general.LastName')"
                      :error="contact.error.lastName"
                    />
                    <InputText
                      v-model="contact.firstName"
                      :class="'w-full lg:w-240 ml-8'"
                      :label="$t('general.FirstName')"
                      :error="contact.error.firstName"
                    />
                  </div>
                  <div class="flex flex-col">
                    <label
                      :class="
                        contact.error.phone && contact.error.phone.length > 0
                          ? 'text-danger'
                          : ''
                      "
                      class="block text-black text-xs font-bold leading-12 mb-5 mt-24"
                      >{{ $t('general.Phone') }}</label
                    >
                    <div class="flex flex-row">
                      <InputDropdown
                        v-model="contact.phone.countryCode"
                        :values="PhoneCountryCodeList.codes"
                        :is-filterable="true"
                        :placeholder="'+'"
                        class="w-100 mr-8"
                      ></InputDropdown>
                      <InputText
                        v-model="contact.phone.areaCode"
                        :input-style="[]"
                        class="w-100 mx-8"
                      />
                      <InputText
                        v-model="contact.phone.phoneNumber"
                        :input-style="[]"
                        class="w-full ml-8 lg:w-240"
                      />
                    </div>
                    <div
                      v-show="
                        contact.error.phone && contact.error.phone.length > 0
                      "
                      class="block text-danger text-xs leading-12"
                    >
                      {{ contact.error.phone }}
                    </div>
                  </div>
                  <div class="flex flex-col lg:flex-row">
                    <InputText
                      v-model="contact.email"
                      :class="'w-full mt-24 lg:w-240'"
                      :label="$t('general.Email')"
                      :error="contact.error.email"
                    />
                  </div>
                  <div class="flex flex-col xl:flex-row">
                    <div
                      class="flex flex-col sm:flex-row justify-between md:justify-start"
                    >
                      <InputDropdown
                        v-model="contact.country"
                        :values="countrySelect"
                        :label="$t('general.Country')"
                        :placeholder="$t('general.PleaseSelect')"
                        :is-filterable="true"
                        :error="contact.error.country"
                        class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                      ></InputDropdown>
                      <InputText
                        v-model="contact.postalCode"
                        :class="'w-128 mt-24 md:w-auto lg:w-128'"
                        :label="$t('general.ZipCode')"
                        :error="contact.error.postalCode"
                      />
                    </div>
                    <InputText
                      v-model="contact.city"
                      :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                      :label="$t('general.City')"
                      :error="contact.error.city"
                    />
                  </div>
                  <InputText
                    v-model="contact.address"
                    :class="'w-full mt-24'"
                    :label="$t('general.Address')"
                    :error="contact.error.address"
                  />
                </div>
              </div>
            </CartCard>
            <CartCard
              :type="billingDataStatus()"
              :title="$t('general.BillingDetails')"
              :help="$t('general.BillingDetailsHelp')"
              :active="activeCard === 'billing'"
              class="mt-24"
              @showCartCard="showCartCard('billing')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox
                  v-model="billingData.copyAdult1"
                  @input="copyAdult1DataToBillingData"
                >
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('general.BillingSameAsAdult1') }}
                  </div>
                </InputCheckbox>
                <InputCheckbox v-model="billingData.saveData" class="mt-12">
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('general.SaveDetails') }}
                  </div>
                </InputCheckbox>
                <div class="mt-24 pt-24 border-t border-grey-light">
                  <InputText
                    v-model="billingData.name"
                    :class="'w-full sm:w-271'"
                    :label="$t('general.BillingName')"
                    :error="billingData.error.name"
                  />
                  <div class="flex flex-col xl:flex-row">
                    <div
                      class="flex flex-col sm:flex-row justify-between md:justify-start"
                    >
                      <InputDropdown
                        v-model="billingData.country"
                        :values="countrySelect"
                        :label="$t('general.Country')"
                        :placeholder="$t('general.PleaseSelect')"
                        :is-filterable="true"
                        :error="billingData.error.country"
                        class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                      ></InputDropdown>
                      <InputText
                        v-model="billingData.postalCode"
                        :class="'w-128 mt-24 md:w-auto lg:w-128'"
                        :label="$t('general.ZipCode')"
                        :error="billingData.error.postalCode"
                      />
                    </div>
                    <InputText
                      v-model="billingData.city"
                      :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                      :label="$t('general.City')"
                      :error="billingData.error.city"
                    />
                  </div>
                  <InputText
                    v-model="billingData.address"
                    :class="'w-full mt-24'"
                    :label="$t('general.Address')"
                    :error="billingData.error.address"
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
              :image-url="false"
              :date-text="
                flight.firstLeg.departure.dateTime.substring(0, 10) +
                  (flight.returnLeg !== undefined
                    ? ' - ' + flight.returnLeg.arrival.dateTime.substring(0, 10)
                    : '')
              "
              :guest-text="
                getGuestText(
                  parseInt(request.guests.adults),
                  parseInt(request.guests.children)
                )
              "
              :room-text="false"
              :cancellation-text="$t('general.NonRefundable')"
              :details-style="
                'sm:pt-48 md:pt-16 sm:border-l md:border-l-0 sm:border-grey-light'
              "
              class="mt-16"
            >
              <FlightCartCard
                :timeline-extra-class="'sm:flex-grow-0 sm:w-82'"
                :flight="flight"
                class="md:pt-16"
              />
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
                <div class="text-3x leading-20 mt-4">
                  {{ currency }}
                  {{
                    getTotalPrice
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
                <div class="text-sm leading-14 mt-8">
                  <Tooltip
                    :key="'tooltiip-' + innerWidth"
                    :tooltip-text="''"
                    :tooltip-style="[
                      'w-288 sm:w-320 pt-16 pb-16 px-16 top-0 mt-20 mr-100'
                    ]"
                    :tooltip-icon-style="[]"
                    :fix-left-margin="innerWidth < 772 ? 8 : false"
                  >
                    <div
                      slot="content"
                      class="text-left w-full text-sm text-black"
                    >
                      <div
                        class="flex flex-row justify-between pb-12 border-b border-grey-light font-bold"
                      >
                        <div class="flex">{{ $t('flight.Total') }}:</div>
                        <div class="flex text-right">
                          {{ currency }}
                          {{
                            getTotalPrice
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                        </div>
                      </div>
                      <div
                        class="flex flex-row justify-between font-normal mt-12"
                      >
                        <div class="flex">
                          {{ $t('flight.FlightTicket') }}
                        </div>
                        <div class="flex text-right">
                          {{ currency }}
                          {{
                            (getTotalPrice -
                              eTicketFee -
                              flight.tax -
                              getPassengerTotalExtraPrice)
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                        </div>
                      </div>
                      <div
                        class="flex flex-row justify-between font-normal mt-12"
                      >
                        <div class="flex">
                          {{ $t('flight.AirlineTaxes') }}
                        </div>
                        <div class="flex text-right">
                          {{ currency }}
                          {{
                            flight.tax
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                        </div>
                      </div>
                      <div
                        class="flex flex-row justify-between font-normal mt-12"
                      >
                        <div class="flex">
                          {{ $t('flight.ETicketFee') }}
                        </div>
                        <div class="flex text-right">
                          {{ currency }}
                          {{
                            eTicketFee
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                        </div>
                      </div>
                      <div
                        class="flex flex-row justify-between font-normal mt-12"
                      >
                        <div class="flex">
                          {{ $t('flight.FlightExtraPrice') }}
                        </div>
                        <div class="flex text-right">
                          {{ currency }}
                          {{
                            getPassengerTotalExtraPrice
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                        </div>
                      </div>
                      <div class="text-xs font-normal mt-6">
                        <div
                          v-for="(carryOnB,
                          carryOnKey) in getPassengerAddedExtraOption.carryOnBaggage"
                          :key="'carry-on-' + carryOnKey"
                          class="mt-6"
                        >
                          - {{ carryOnB.count }}X {{ carryOnB.name }}
                          {{ $t('flight.CarryOnBaggage') }}
                        </div>
                        <div
                          v-for="(outwardB,
                          outwardKey) in getPassengerAddedExtraOption.outwardBaggage"
                          :key="'outward-' + outwardKey"
                          class="mt-6"
                        >
                          - {{ outwardB.count }}X {{ outwardB.name }}
                          {{ $t('flight.OutwardBaggage') }}
                        </div>
                        <div
                          v-for="(returnB,
                          returnKey) in getPassengerAddedExtraOption.returnBaggage"
                          :key="'return-' + returnKey"
                          class="mt-6"
                        >
                          - {{ returnB.count }}X {{ returnB.name }}
                          {{ $t('flight.ReturnBaggage') }}
                        </div>
                        <div
                          v-for="(checkinB,
                          checkinKey) in getPassengerAddedExtraOption.checkin"
                          :key="'checkin-' + checkinKey"
                          class="mt-6"
                        >
                          - {{ checkinB.count }}X {{ checkinB.name }}
                        </div>
                        <div
                          v-for="(priority,
                          priorityKey) in getPassengerAddedExtraOption.priority"
                          :key="'priority-' + priorityKey"
                          class="mt-6"
                        >
                          - {{ priority.count }}X
                          {{ $t('flight.Priority') }}
                        </div>
                      </div>
                    </div></Tooltip
                  >
                  <span class="font-normal">{{ $t('general.Details') }}</span>
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
                  :mask="currency + ' 99999'"
                  :class="'w-full'"
                  :is-dark="false"
                  :is-disabled="tcBalance <= 0 || payInProgress"
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
                  <div class="arrow-down border-t-white"></div>
                </div>
                <div class="text-sm leading-14 font-bold mt-16">
                  {{ $t('general.PayWithTC') }}
                </div>
                <div class="text-3x leading-20 font-bold mt-4">
                  {{ currency }}
                  {{
                    getAddedTravelCard
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
                <div class="h-1 bg-white bg-opacity-30 my-12"></div>
                <div class="flex flex-row">
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
                      class="text-xs leading-12 text-white text-opacity-75 mt-4"
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
                @click="pay"
              >
                <div class="relative">
                  <div :class="{ 'opacity-0': payInProgress }" class="static">
                    {{ $t('general.Pay') }}
                  </div>
                  <div
                    class="absolute inset-0 opacity-0"
                    :class="{ 'opacity-100': payInProgress }"
                  >
                    <i class="fas fa-spinner-third fa-spin"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DefaultModal
        v-show="newPriceModalActive"
        :modal-max-width="'320px'"
        :default-padding="'p-0'"
      >
        <div slot="header"></div>
        <div slot="body">
          <div class="flex flex-col w-full text-black px-16 pt-16">
            <div class="text-lg font-bold leading-24">
              {{ $t('flight.PriceChanged') }}
            </div>
            <div class="text-sm leading-20 mt-16">
              {{ $t('flight.PriceChangedDesc') }}
            </div>
          </div>
          <div>
            <FlightCartCard :flight="flight" class="mt-24" />
          </div>
          <div class="flex flex-row mt-16 bg-grey-light bg-opacity-20 p-16">
            <div class="w-1/2 text-grey">
              <div class="text-sm leading-14">{{ $t('flight.OldPrice') }}</div>
              <div class="text-2x leading-18 font-bold mt-6 line-through">
                {{ currency }}
                {{
                  Math.ceil(parseFloat(priceCheck.oldprice))
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}
              </div>
            </div>
            <div class="w-1/2 text-right text-black">
              <div class="text-sm leading-14">{{ $t('flight.NewPrice') }}</div>
              <div class="text-2x leading-18 font-bold mt-6">
                {{ currency }}
                {{
                  Math.ceil(parseFloat(priceCheck.newprice))
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}
              </div>
            </div>
          </div>
          <div class="flex flex-col mt-24">
            <div class="text-center">
              <ButtonSmall
                :is-loading="newDetailsLoading"
                @click="acceptNewPrice"
              >
                {{ $t('flight.AcceptNewPrice') }}
              </ButtonSmall>
            </div>
            <div
              class="text-center link-danger my-16 text-xs leading-12 cursor-pointer"
              @click="$router.back()"
            >
              {{ $t('flight.RejectNewPrice') }}
            </div>
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
      <DefaultModal
        v-show="integrationErrorModalActive"
        :modal-max-width="'320px'"
        :default-padding="'p-0'"
      >
        <div slot="header"></div>
        <div slot="body">
          <div class="flex flex-col w-full text-black px-16 pt-16">
            <div class="text-lg font-bold leading-24">
              {{ $t('flight.IntegrationError') }}
            </div>
            <div class="text-sm leading-20 mt-16">
              {{
                integrationErrorMessageList[integrationErrorType] !== undefined
                  ? integrationErrorMessageList[integrationErrorType]
                  : $t('flight.IntegrationErrorDesc')
              }}
            </div>
          </div>
          <div class="flex flex-row items-center my-16 px-16">
            <div
              class="flex flex-grow link-danger my-16 text-xs leading-12 cursor-pointer text-left"
              @click="$router.back()"
            >
              {{ $t('flight.RejectNewPrice') }}
            </div>
            <ButtonSmall @click="integrationErrorModalActive = false">
              {{ $t('general.Ok') }}
            </ButtonSmall>
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
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
    </div>
  </div>
</template>
<script>
import { differenceInYears } from 'date-fns'
import { mapGetters } from 'vuex'
import StatusMessage from '@/components/micro/StatusMessage'
import CartCard from '@/components/cart/CartCard'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import InputTextMask from '@/components/micro/InputTextMask'
import InputDate from '@/components/micro/InputDate'
import ServicePreview from '@/components/cart/ServicePreview'
import DefaultModal from '@/components/modal/DefaultModal'
import InformativeModal from '@/components/modal/InformativeModal'
import ButtonSmall from '@/components/micro/ButtonSmall'
import FlightCartCard from '@/components/flight/FlightCartCard'
import CartStatus from '~/components/cart/CartStatus'
import Tooltip from '@/components/micro/Tooltip'
import {
  getGuestText,
  capitalize,
  isEmail,
  getHandlingFee
} from '@/includes/utils'
import CountryList from '@/includes/countrylist'
import PhoneCountryCodeList from '@/includes/phonecountrycodelist'
export default {
  name: 'FlightCart',
  middleware: 'auth_needed',
  components: {
    CartStatus,
    ButtonSmall,
    DefaultModal,
    ServicePreview,
    InputTextMask,
    InputText,
    InputDropdown,
    InputCheckbox,
    CartCard,
    StatusMessage,
    InputDate,
    FlightCartCard,
    InformativeModal,
    Tooltip
  },
  data() {
    return {
      CountryList,
      PhoneCountryCodeList,
      integrationErrorModalActive: false,
      integrationErrorType: false,
      integrationErrorMessageList: {
        DUPLICATE_BOOKING: this.$t('flight.DuplicateBooking'),
        INTEGRATION_ERROR: this.$t('flight.IntegrationErrorDesc')
      },
      newPriceModalActive: false,
      newDetailsLoading: false,
      activeCard: 'bookingInformation',
      openedCard: {
        bookingInformation: false,
        billing: false,
        contact: false
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
      acceptedBookingInformation: false,
      titleSelect: [],
      genderSelect: [this.$t('general.Male'), this.$t('general.Female')],
      travelDocuments: [],
      countrySelect: [],
      dialCodeSelect: ['+36', '+40'],
      passengers: [],
      billingData: {
        copyAdult1: true,
        saveData: false,
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
      contact: {
        copyAdult1: false,
        saveData: false,
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        postalCode: '',
        city: '',
        address: '',
        phone: {
          countryCode: '',
          areaCode: '',
          phoneNumber: ''
        },
        error: {
          firstName: '',
          lastName: '',
          email: '',
          country: '',
          postalCode: '',
          city: '',
          address: '',
          phone: ''
        }
      },
      travelCard: '0',
      cartStatusActive: false,
      currency: 'EUR',
      countrySelectIds: [],
      countrySelectCodes: [],
      carryOnBaggageSelect: [this.$t('flight.SmallBaggage') + ' - EUR 0'],
      outwardBaggageSelect: [this.$t('flight.NoBaggage') + ' - EUR 0'],
      returnBaggageSelect: [this.$t('flight.NoBaggage') + ' - EUR 0'],
      prioritySelect: [this.$t('flight.NoNeed') + ' - EUR 0'],
      checkinSelect: [this.$t('flight.InAirport') + ' - EUR 0'],
      priceCheck: false,
      bookingdb_id: false,
      payInProgress: false,
      flight: false,
      request: false,
      handlingFee: 0,
      billingDataErrorModalActive: false,
      innerWidth: 0,
      excludedCountries: ['AS']
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isLoggedIn']),
    ...mapGetters('flight', ['cartCache']),
    activePaymentButton() {
      if (
        this.payInProgress ||
        !this.acceptedBookingInformation ||
        this.contactDataStatus() !== 'success' ||
        this.billingDataStatus() !== 'success'
      ) {
        return false
      }
      for (let i = 0; i < this.passengers.length; i++) {
        if (this.passengerDataStatus(this.passengers[i]) !== 'success') {
          return false
        }
      }
      return true
    },
    getAddedTravelCard() {
      const tc = parseInt(
        (this.travelCard + '').replace(this.currency, '').trim()
      )
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
    getTotalPrice() {
      let total = Math.ceil(parseFloat(this.flight.total_fare[this.currency]))
      total += this.getPassengerTotalExtraPrice
      total += this.eTicketFee
      return total
    },
    getPassengerTotalExtraPrice() {
      let total = 0
      this.passengers.forEach((passenger) => {
        total += this.getPassengerExtraPrice(passenger)
      })
      return total
    },
    tcBalance() {
      const fees = this.getFees
      return fees && fees.tc ? Math.floor(fees.tc.credit) : 0
    },
    eTicketFee() {
      return this.passengers.length * 6
    },
    getPassengerAddedExtraOption() {
      const extraOptions = {
        carryOnBaggage: [],
        outwardBaggage: [],
        returnBaggage: [],
        priority: [],
        checkin: []
      }
      this.passengers.forEach((passenger) => {
        const options = this.getPassengerExtraOption(passenger)
        Object.keys(extraOptions).forEach((type) => {
          if (options[type] !== false) {
            const found = extraOptions[type].find(
              (element) => element.name === options[type]
            )
            if (found) {
              found.count++
            } else {
              extraOptions[type].push({
                name: options[type],
                count: 1
              })
            }
          }
        })
      })
      return extraOptions
    }
  },
  mounted() {
    this.$router.push(this.localePath('/'))
    this.flight = JSON.parse(JSON.stringify(this.cartCache.result))
    this.request = JSON.parse(JSON.stringify(this.cartCache.request))
    if (
      this.flight.supplier_info !== undefined &&
      this.flight.supplier_info !== null &&
      this.flight.supplier_info.length > 0
    ) {
      this.flight.supplier_info.forEach((item, key) => {
        item.hover = false
        item.active = key === 0
      })
    }
    this.initCITUserData()
    if (this.request !== undefined) {
      for (let i = 0; i < this.request.guests.adults; i++) {
        this.passengers.push({
          passenger: capitalize(this.$t('general.Adult'), true) + ' ' + (i + 1),
          key: 'passenger' + i,
          type: 'adult',
          title: 0,
          firstName: '',
          lastName: '',
          firstNameError: false,
          lastNameError: false,
          gender: 0,
          birthday: '',
          travelDocumentType: '',
          travelDocumentNumber: '',
          travelDocumentExpire: '',
          travelDocumentCountry: '',
          carryOnBaggage: 0,
          outwardBaggage: 0,
          returnBaggage: 0,
          checkin: 0,
          priority: 0,
          error: {
            title: '',
            firstName: '',
            lastName: '',
            gender: '',
            birthday: '',
            travelDocumentType: '',
            travelDocumentNumber: '',
            travelDocumentExpire: '',
            travelDocumentCountry: ''
          }
        })
        this.openedCard['passenger' + i] = false
      }
      if (this.request.guests.children > 0) {
        for (let i = 0; i < this.request.guests.children; i++) {
          this.passengers.push({
            passenger:
              capitalize(this.$t('general.Child'), true) +
              ' ' +
              (i + 1) +
              ' (' +
              (this.request.guests.childrenAges[i] < 1
                ? this.$t('general.Newborn')
                : this.$t(
                    'general.YearsOld' +
                      (this.request.guests.childrenAges[i] + 1)
                  )) +
              ')',
            key: 'passenger' + (this.request.guests.adults + i),
            title: 0,
            type: 'child',
            age:
              this.request.guests.childrenAges[i] < 1
                ? 0
                : this.request.guests.childrenAges[i] + 1,
            firstName: '',
            lastName: '',
            firstNameError: false,
            lastNameError: false,
            gender: 0,
            birthday: '',
            travelDocumentType: false,
            travelDocumentNumber: '',
            travelDocumentExpire: '',
            travelDocumentCountry: '',
            carryOnBaggage: 0,
            outwardBaggage: 0,
            returnBaggage: 0,
            checkin: 0,
            priority: 0,
            error: {
              title: '',
              firstName: '',
              lastName: '',
              gender: '',
              birthday: '',
              travelDocumentType: '',
              travelDocumentNumber: '',
              travelDocumentExpire: '',
              travelDocumentCountry: ''
            }
          })
          this.openedCard[
            'passenger' + (this.request.guests.adults + i)
          ] = false
        }
      }
    }
    if (this.flight !== undefined) {
      this.titleSelect = this.flight.fields.passengers.namePrefix.options
      this.travelDocuments = this.flight.fields.passengers.type.options
      if (
        this.flight.carryOnBaggageTiers !== undefined &&
        this.flight.carryOnBaggageTiers.length > 0
      ) {
        this.flight.carryOnBaggageTiers.forEach((baggage) => {
          this.carryOnBaggageSelect.push(baggage.label)
        })
      }
      if (
        this.flight.outwardBaggageTiers !== undefined &&
        this.flight.outwardBaggageTiers.length > 0
      ) {
        this.flight.outwardBaggageTiers.forEach((baggage) => {
          this.outwardBaggageSelect.push(baggage.label)
        })
      }
      if (
        this.flight.returnBaggageTiers !== undefined &&
        this.flight.returnBaggageTiers.length > 0
      ) {
        this.flight.returnBaggageTiers.forEach((baggage) => {
          this.returnBaggageSelect.push(baggage.label)
        })
      }
      if (this.flight.checkIn !== undefined && this.flight.checkIn.length > 0) {
        this.checkinSelect = []
        this.flight.checkIn.forEach((checkIn) => {
          this.checkinSelect.push(checkIn.label)
        })
      }
      if (
        this.flight.speedyBoarding !== undefined &&
        parseFloat(this.flight.speedyBoarding) > 0
      ) {
        this.prioritySelect.push(
          this.$t('general.Yes') +
            ' - ' +
            this.currency +
            ' ' +
            this.flight.speedyBoarding
        )
      }
    }
    if (
      this.CountryList.countryCodesFullName !== undefined &&
      this.CountryList.countryIdFullName !== undefined
    ) {
      this.countrySelect = []
      for (const [key, value] of Object.entries(
        this.CountryList.countryIdFullName
      )) {
        if (!this.excludedCountries.includes(value)) {
          this.countrySelect.push(this.CountryList.countryCodesFullName[value])
          this.countrySelectIds.push(key)
          this.countrySelectCodes.push(value)
        }
      }
    }
    this.updateFlightHandlingFee()
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    isEmail,
    capitalize,
    getGuestText,
    differenceInYears,
    getHandlingFee,
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    async updateFlightHandlingFee() {
      if (this.getAddedTravelCard > 0 || this.getPassengerTotalExtraPrice > 0) {
        let handlingFeeRes
        try {
          handlingFeeRes = await this.$store.dispatch(
            'flight/getFlightHandlingFee',
            {
              sum: this.getTotalPrice - this.eTicketFee,
              tc: this.getAddedTravelCard,
              ticketPiece: this.passengers.length
            }
          )
        } catch (error) {
          this.handlingFee = getHandlingFee(
            this.getTotalPrice - this.getAddedTravelCard,
            'flight'
          )
        }
        if (handlingFeeRes && handlingFeeRes.bankComission !== undefined) {
          this.handlingFee = handlingFeeRes.bankComission
        }
      } else if (
        this.cartCache.handlingFee !== undefined &&
        this.cartCache.handlingFee !== false
      ) {
        this.handlingFee = this.cartCache.handlingFee
      } else {
        this.handlingFee = getHandlingFee(
          this.getTotalPrice - this.getAddedTravelCard,
          'flight'
        )
      }
    },
    async acceptNewPrice() {
      this.newDetailsLoading = true
      let res
      try {
        res = await this.$store.dispatch('flight/postFlightCartAcceptPrice', {
          search_id: parseInt(this.cartCache.search_id),
          booking_id: this.cartCache.calendar_search
            ? this.cartCache.calendar_booking_id
            : this.cartCache.booking_id,
          bookingdb_id: this.bookingdb_id,
          tc: this.getAddedTravelCard
        })
      } catch (e) {
        const body = await e.response?.json()
        if (body && body.messages !== undefined) {
          let messageJson
          try {
            messageJson = JSON.parse(body.messages)
          } catch (e) {
            if (
              body.messages === 'INTEGRATION_ERROR' ||
              body.messages === 'DUPLICATE_BOOKING'
            ) {
              this.integrationErrorModalActive = true
            } else {
              this.$store.dispatch('general/showSnackbar', {
                message:
                  body.messages === 'NAME_CONTAINS_INVALID_CHARACHTERS'
                    ? this.$t('flight.NameContainsInvalidCharachters')
                    : body.messages
              })
            }
          }
          if (messageJson) {
            if (messageJson.permission_needed !== undefined) {
              this.$router.push(this.localePath('/'))
            } else if (messageJson.validation) {
              this.$store.dispatch('general/showSnackbar', {
                message: messageJson.validation
              })
            } else {
              this.$store.dispatch('general/showSnackbar', {
                message: body.messages
              })
            }
          }
        }
      }
      this.newDetailsLoading = false
      if (res) {
        if (res.status === 'FORWARD' && res.forwardUrl !== undefined) {
          window.location.href = res.forwardUrl
        } else if (res.status === 'SAVE_BILLING_DATA_ERROR') {
          this.billingDataErrorModalActive = true
        } else if (res.status === 'PAYMENT_SUCCESS') {
          await this.$router.replace(
            this.localePath('/flight/payment/success/' + res.token)
          )
        } else if (res.status === 'PAYMENT_PENDING') {
          await this.$router.replace(
            this.localePath('/flight/reservation-pending')
          )
        } else if (res.status === 'PAYMENT_FAILED') {
          await this.$router.replace(
            this.localePath('/flight/reservation-failed')
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
          this.validatePassenger(this.activeCard)
        } else if (this.activeCard === 'contact') {
          this.validateContact()
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
    async pay() {
      if (this.payInProgress) {
        return
      }

      this.validateBeforePay()

      if (!this.isLoggedIn) {
        window.location.reload()
      } else if (this.activePaymentButton) {
        const contactTMP = JSON.parse(JSON.stringify(this.contact))
        contactTMP.country = this.countrySelectCodes[contactTMP.country]
        contactTMP.phone.countryCode = this.PhoneCountryCodeList.codes[
          contactTMP.phone.countryCode
        ]
        const billingTMP = JSON.parse(JSON.stringify(this.billingData))
        billingTMP.country = this.countrySelectCodes[billingTMP.country]
        const payload = {
          date:
            this.flight.returnLeg !== undefined
              ? this.flight.returnLeg.arrival.dateTime.substring(0, 10)
              : this.flight.firstLeg.departure.dateTime.substring(0, 10),
          search_id: parseInt(this.cartCache.search_id),
          booking_id: this.cartCache.calendar_search
            ? this.cartCache.calendar_booking_id
            : this.cartCache.booking_id,
          contact: contactTMP,
          billing: billingTMP,
          persons: [],
          tc: this.getAddedTravelCard
        }
        this.passengers.forEach((passenger) => {
          const passengerTMP = JSON.parse(JSON.stringify(passenger))
          if (passengerTMP.carryOnBaggage > 0) {
            passengerTMP.carryOnBaggageSelected = this.flight.carryOnBaggageTiers[
              passengerTMP.carryOnBaggage - 1
            ].tier
          }
          if (passengerTMP.outwardBaggage > 0) {
            passengerTMP.outwardBaggageSelected = this.flight.outwardBaggageTiers[
              passengerTMP.outwardBaggage - 1
            ].tier
          }
          if (passengerTMP.returnBaggage > 0) {
            passengerTMP.returnBaggageSelected = this.flight.returnBaggageTiers[
              passengerTMP.returnBaggage - 1
            ].tier
          }
          if (
            this.flight.checkIn !== undefined &&
            this.flight.checkIn[passengerTMP.checkin] !== undefined &&
            this.flight.checkIn[passengerTMP.checkin].price > 0
          ) {
            passengerTMP.checkIn = this.flight.checkIn[
              passengerTMP.checkin
            ].category
          }
          passengerTMP.travelDocumentCountry = this.countrySelectCodes[
            passengerTMP.travelDocumentCountry
          ]
          passengerTMP.title = this.titleSelect[passengerTMP.title]
          passengerTMP.travelDocumentType = this.travelDocuments[
            passengerTMP.travelDocumentType
          ]
          passengerTMP.gender = passengerTMP.gender ? 'FEMALE' : 'MALE'
          payload.persons.push(passengerTMP)
        })
        this.payInProgress = true
        let res
        try {
          res = await this.$store.dispatch('flight/postFlightCart', payload)
        } catch (e) {
          const body = await e.response?.json()
          if (body && body.messages !== undefined) {
            let messageJson
            try {
              messageJson = JSON.parse(body.messages)
            } catch (e) {
              if (
                body.messages === 'INTEGRATION_ERROR' ||
                body.messages === 'DUPLICATE_BOOKING'
              ) {
                this.integrationErrorModalActive = true
                this.integrationErrorType = body.messages
              } else {
                this.$store.dispatch('general/showSnackbar', {
                  message:
                    body.messages === 'NAME_CONTAINS_INVALID_CHARACHTERS'
                      ? this.$t('flight.NameContainsInvalidCharachters')
                      : body.messages
                })
              }
            }
            if (messageJson) {
              if (messageJson.permission_needed !== undefined) {
                this.$router.push(this.localePath('/'))
              } else if (messageJson.validation) {
                this.$store.dispatch('general/showSnackbar', {
                  message: messageJson.validation
                })
              }
            }
          }
          this.payInProgress = false
        }
        if (res) {
          if (res.priceCheck !== undefined) {
            this.priceCheck = res.priceCheck
            this.bookingdb_id = res.bookingdb_id
            this.newPriceModalActive = true
            this.payInProgress = false
          } else if (res.status === 'FORWARD' && res.forwardUrl !== undefined) {
            window.location.href = res.forwardUrl
          } else if (res.status === 'SAVE_BILLING_DATA_ERROR') {
            this.payInProgress = false
            this.billingDataErrorModalActive = true
          } else if (res.status === 'PAYMENT_SUCCESS') {
            await this.$router.replace(
              this.localePath('/flight/payment/success/' + res.token)
            )
          } else if (res.status === 'PAYMENT_PENDING') {
            await this.$router.replace(
              this.localePath('/flight/reservation-pending')
            )
          } else if (res.status === 'PAYMENT_FAILED') {
            await this.$router.replace(
              this.localePath('/flight/reservation-failed')
            )
          }
        }
      } else {
        this.payInProgress = false
        this.$store.dispatch('general/showSnackbar', {
          message: this.$t('flight.CarBookingDataError')
        })
      }
    },
    passengerDataStatus(passenger) {
      if (!this.openedCard[passenger.key]) {
        return 'default'
      }
      for (const keyError in passenger.error) {
        if (passenger.error[keyError] !== '') {
          return 'danger'
        }
      }
      return 'success'
    },
    contactDataStatus() {
      if (!this.openedCard.contact) {
        return 'default'
      }
      for (const keyError in this.contact.error) {
        if (this.contact.error[keyError] !== '') {
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
    validatePassenger(key) {
      const passengerValidationFields = this.flight.fields.passengers
      this.passengers.forEach((passengerData) => {
        if (passengerData.key === key) {
          for (const keyError in passengerData.error) {
            passengerData.error[keyError] = ''
          }
          // Title validation
          if (this.titleSelect[passengerData.title] === undefined) {
            passengerData.error.title = this.$t('flight.NamePrefixRequired')
          }
          // FirstName validation
          if (passengerData.firstName === '') {
            passengerData.error.firstName = this.$t('flight.FirstNameRequired')
          } else if (!/^[A-Za-z\s]+$/.test(passengerData.firstName)) {
            passengerData.error.firstName = this.$t(
              'flight.FirstNamePatternError'
            )
          } else if (passengerValidationFields.firstName !== undefined) {
            if (
              passengerValidationFields.firstName.maxLength !== undefined &&
              passengerData.firstName.length >
                parseInt(passengerValidationFields.firstName.maxLength)
            ) {
              passengerData.error.firstName = this.$t(
                'flight.FirstNameMaxLength'
              )
              passengerData.error.firstName = passengerData.error.firstName.replace(
                '__maxLength__',
                passengerValidationFields.firstName.maxLength
              )
            }
          }
          // LastName validation
          if (passengerData.lastName === '') {
            passengerData.error.lastName = this.$t('flight.LastNameRequired')
          } else if (!/^[A-Za-z\s]+$/.test(passengerData.lastName)) {
            passengerData.error.lastName = this.$t(
              'flight.LastNamePatternError'
            )
          } else if (passengerValidationFields.lastName !== undefined) {
            if (
              passengerValidationFields.lastName.maxLength !== undefined &&
              passengerData.lastName.length >
                parseInt(passengerValidationFields.lastName.maxLength)
            ) {
              passengerData.error.lastName = this.$t('flight.LastNameMaxLength')
              passengerData.error.lastName = passengerData.error.lastName.replace(
                '__maxLength__',
                passengerValidationFields.lastName.maxLength
              )
            }
          }
          // Gender validation
          if (this.genderSelect[passengerData.gender] === undefined) {
            passengerData.error.gender = this.$t('flight.GenderRequired')
          }
          // Birthday validation
          const birthDate = new Date(passengerData.birthday)
          const departureDate = new Date(this.request.departureDate)
          let validationDate = new Date(this.request.departureDate)
          if (this.request.returnDate) {
            validationDate = new Date(this.request.returnDate)
          }
          const difference = differenceInYears(validationDate, birthDate)
          if (passengerData.birthday === '') {
            passengerData.error.birthday = this.$t('flight.BirthdayRequired')
          } else if (
            !isNaN(difference) &&
            passengerData.type === 'child' &&
            ((passengerData.age === 0 && ![0, 1].includes(difference)) ||
              (passengerData.age > 0 && difference !== passengerData.age) ||
              birthDate > departureDate)
          ) {
            passengerData.error.birthday = this.$t(
              'flight.BirthdayOverDepartureError'
            )
          } else if (
            passengerData.type === 'child' &&
            passengerData.age !== undefined
          ) {
            if (passengerData.age < 2 && difference >= 2) {
              passengerData.error.birthday = this.$t(
                'flight.ChildAgeOver2Error'
              )
            } else if (
              passengerData.age > 2 &&
              difference !== passengerData.age
            ) {
              passengerData.error.birthday = this.$t(
                'flight.ChildAgeMatchError'
              ).replace('__age__', passengerData.age)
            }
          } else if (passengerData.type === 'adult' && difference < 12) {
            passengerData.error.birthday = this.$t('flight.AgeUnder12Error')
          }
          // Document type validation
          if (
            this.travelDocuments[passengerData.travelDocumentType] === undefined
          ) {
            passengerData.error.travelDocumentType = this.$t(
              'flight.DocumentTypeRequired'
            )
          }
          // Document id validation
          else if (passengerData.travelDocumentNumber === '') {
            passengerData.error.travelDocumentNumber = this.$t(
              'flight.DocumentIdRequired'
            )
          } else if (passengerValidationFields.id.pattern !== undefined) {
            const patt = new RegExp(passengerValidationFields.id.pattern)
            if (!patt.test(passengerData.travelDocumentNumber)) {
              passengerData.error.travelDocumentNumber = this.$t(
                'flight.DocumentIdPatterError'
              )
            }
          } else if (
            passengerValidationFields.id.maxLength !== undefined &&
            passengerData.travelDocumentNumber.length >
              parseInt(passengerValidationFields.id.maxLength)
          ) {
            passengerData.error.travelDocumentNumber = this.$t(
              'flight.DocumentIdMaxLength'
            )
            passengerData.error.travelDocumentNumber = passengerData.error.travelDocumentNumber.replace(
              '__maxLength__',
              passengerValidationFields.id.maxLength
            )
          }
          // Document expire validation
          if (passengerData.travelDocumentExpire === '') {
            passengerData.error.travelDocumentExpire = this.$t(
              'flight.DocumentExpireRequired'
            )
          } else {
            const documentExpire = new Date(passengerData.travelDocumentExpire)
            if (documentExpire < validationDate) {
              passengerData.error.travelDocumentExpire = this.$t(
                'flight.TravelDocumentExpired'
              )
            }
          }
          // Document country validation
          if (
            this.countrySelect[passengerData.travelDocumentCountry] ===
            undefined
          ) {
            passengerData.error.travelDocumentCountry = this.$t(
              'flight.DocumentCountryRequired'
            )
          }
        }
      })
    },
    validateContact() {
      for (const keyError in this.contact.error) {
        this.contact.error[keyError] = ''
      }
      const contactValidationFields = this.flight.fields.contact_info
      if (this.contact.firstName === '') {
        this.contact.error.firstName = this.$t('flight.FirstNameRequired')
      }
      if (this.contact.lastName === '') {
        this.contact.error.lastName = this.$t('flight.LastNameRequired')
      }
      if (this.contact.email === '') {
        this.contact.error.email = this.$t('flight.EmailRequired')
      } else if (!isEmail(this.contact.email)) {
        this.contact.error.email = this.$t('flight.EmailPatternError')
      }
      if (this.contact.country === '') {
        this.contact.error.country = this.$t('flight.CountryRequired')
      }
      if (this.contact.postalCode === '') {
        this.contact.error.postalCode = this.$t('flight.PostalCodeRequired')
      } else if (
        contactValidationFields.zipCode.maxLength !== undefined &&
        this.contact.postalCode.length >
          parseInt(contactValidationFields.zipCode.maxLength)
      ) {
        this.contact.error.postalCode = this.$t(
          'flight.PostalCodeMaxLengthError'
        )
        this.contact.error.postalCode = this.contact.error.postalCode.replace(
          '__maxLength__',
          contactValidationFields.zipCode.maxLength
        )
      } else if (contactValidationFields.zipCode.pattern !== undefined) {
        const patt = new RegExp(contactValidationFields.zipCode.pattern)
        if (!patt.test(this.contact.postalCode)) {
          this.contact.error.postalCode = this.$t(
            'flight.PostalCodePatternError'
          )
        }
      }
      if (this.contact.city === '') {
        this.contact.error.city = this.$t('flight.CountryRequired')
      } else if (
        contactValidationFields.cityName.maxLength !== undefined &&
        this.contact.city.length >
          parseInt(contactValidationFields.cityName.maxLength)
      ) {
        this.contact.error.city = this.$t('flight.CityMaxLengthError')
        this.contact.error.city = this.contact.error.city.replace(
          '__maxLength__',
          contactValidationFields.cityName.maxLength
        )
      }
      const contactTemp = this.contact.address
      if (this.contact.address === '') {
        this.contact.error.address = this.$t('flight.AddressRequired')
      } else if (!/^[\x20-\x7E]+$/.test(contactTemp.replace('-', ''))) {
        this.contact.error.address = this.$t('flight.AddressPatternError')
      }
      if (
        this.contact.phone.countryCode === '' ||
        this.contact.phone.areaCode === '' ||
        this.contact.phone.phoneNumber === ''
      ) {
        this.contact.error.phone = this.$t('flight.PhoneRequired')
      } else if (this.contact.phone.phoneNumber.length < 5) {
        this.contact.error.phone = this.$t('flight.PhoneMinLengthError')
      }
    },
    validateBilling() {
      for (const keyError in this.billingData.error) {
        this.billingData.error[keyError] = ''
      }
      const billingDataValidationFields = this.flight.fields.billing_info
      if (this.billingData.name === '') {
        this.billingData.error.name = this.$t('flight.BillingNameRequired')
      }

      if (this.billingData.country === '') {
        this.billingData.error.country = this.$t('flight.CountryRequired')
      }
      if (this.billingData.postalCode === '') {
        this.billingData.error.postalCode = this.$t('flight.PostalCodeRequired')
      } else if (
        billingDataValidationFields.zipCode.maxLength !== undefined &&
        this.billingData.postalCode.length >
          parseInt(billingDataValidationFields.zipCode.maxLength)
      ) {
        this.billingData.error.postalCode = this.$t(
          'flight.PostalCodeMaxLengthError'
        )
        this.billingData.error.postalCode = this.billingData.error.postalCode.replace(
          '__maxLength__',
          billingDataValidationFields.zipCode.maxLength
        )
      } else if (billingDataValidationFields.zipCode.pattern !== undefined) {
        const patt = new RegExp(billingDataValidationFields.zipCode.pattern)
        if (!patt.test(this.billingData.postalCode)) {
          this.billingData.error.postalCode = this.$t(
            'flight.PostalCodePatternError'
          )
        }
      }
      if (this.billingData.city === '') {
        this.billingData.error.city = this.$t('flight.CountryRequired')
      } else if (
        billingDataValidationFields.cityName.maxLength !== undefined &&
        this.billingData.city.length >
          parseInt(billingDataValidationFields.cityName.maxLength)
      ) {
        this.billingData.error.city = this.$t('flight.CityMaxLengthError')
        this.billingData.error.city = this.billingData.error.city.replace(
          '__maxLength__',
          billingDataValidationFields.cityName.maxLength
        )
      }
      const billingTemp = this.billingData.address
      if (this.billingData.address === '') {
        this.billingData.error.address = this.$t('flight.AddressRequired')
      } else if (!/^[\x20-\x7E]+$/.test(billingTemp.replace('-', ''))) {
        this.billingData.error.address = this.$t('flight.AddressPatternError')
      }
    },
    getPassengerExtraPrice(passenger) {
      let total = 0
      if (
        passenger.carryOnBaggage > 0 &&
        this.flight.carryOnBaggageTiers[passenger.carryOnBaggage - 1] !==
          undefined
      ) {
        total += parseFloat(
          this.flight.carryOnBaggageTiers[passenger.carryOnBaggage - 1].price
        )
      }
      if (
        passenger.outwardBaggage > 0 &&
        this.flight.outwardBaggageTiers[passenger.outwardBaggage - 1] !==
          undefined
      ) {
        total += parseFloat(
          this.flight.outwardBaggageTiers[passenger.outwardBaggage - 1].price
        )
      }
      if (
        passenger.returnBaggage > 0 &&
        this.flight.returnBaggageTiers[passenger.returnBaggage - 1] !==
          undefined
      ) {
        total += parseFloat(
          this.flight.returnBaggageTiers[passenger.returnBaggage - 1].price
        )
      }
      if (
        this.flight.checkIn !== undefined &&
        this.flight.checkIn[passenger.checkin] !== undefined &&
        this.flight.checkIn[passenger.checkin].price > 0
      ) {
        total += parseFloat(this.flight.checkIn[passenger.checkin].price)
      }
      if (passenger.priority > 0) {
        total += parseFloat(this.flight.speedyBoarding)
      }
      return Math.round(total * 100) / 100
    },
    getPassengerExtraOption(passenger) {
      const options = {
        carryOnBaggage: false,
        outwardBaggage: false,
        returnBaggage: false,
        priority: false,
        checkin: false
      }
      if (
        passenger.carryOnBaggage > 0 &&
        this.flight.carryOnBaggageTiers[passenger.carryOnBaggage - 1] !==
          undefined
      ) {
        options.carryOnBaggage = this.flight.carryOnBaggageTiers[
          passenger.carryOnBaggage - 1
        ].label.substring(
          0,
          this.flight.carryOnBaggageTiers[
            passenger.carryOnBaggage - 1
          ].label.indexOf(' EUR')
        )
      }
      if (
        passenger.outwardBaggage > 0 &&
        this.flight.outwardBaggageTiers[passenger.outwardBaggage - 1] !==
          undefined
      ) {
        options.outwardBaggage = this.flight.outwardBaggageTiers[
          passenger.outwardBaggage - 1
        ].label.substring(
          0,
          this.flight.outwardBaggageTiers[
            passenger.outwardBaggage - 1
          ].label.indexOf(' EUR')
        )
      }
      if (
        passenger.returnBaggage > 0 &&
        this.flight.returnBaggageTiers[passenger.returnBaggage - 1] !==
          undefined
      ) {
        options.returnBaggage = this.flight.returnBaggageTiers[
          passenger.returnBaggage - 1
        ].label.substring(
          0,
          this.flight.returnBaggageTiers[
            passenger.returnBaggage - 1
          ].label.indexOf(' EUR')
        )
      }
      if (
        this.flight.checkIn !== undefined &&
        this.flight.checkIn[passenger.checkin] !== undefined &&
        this.flight.checkIn[passenger.checkin].price > 0
      ) {
        options.checkin = this.flight.checkIn[
          passenger.checkin
        ].label.substring(
          0,
          this.flight.checkIn[passenger.checkin].label.indexOf(' - EUR')
        )
      }
      if (passenger.priority > 0) {
        options.priority = 'Priority'
      }
      return options
    },
    changeAddedTravelCard() {
      let tc = this.travelCard.replace(this.currency, '').trim()
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
      this.updateFlightHandlingFee()
    },
    async initCITUserData() {
      let personalData
      try {
        personalData = await this.$store.dispatch('user/getPersonalData')
      } catch (e) {
        console.log(e)
      }
      if (personalData !== undefined) {
        let firstName = ''
        let lastName = ''
        if (
          personalData.FULLNAME !== undefined &&
          personalData.FULLNAME !== null
        ) {
          firstName = personalData.FULLNAME.split(' ')[0]
          const nameParts = personalData.FULLNAME.split(' ')
          nameParts.shift()
          lastName = nameParts.join(' ')
        }
        this.billingData.name = personalData.BILLING_NAME || ''
        this.billingData.country =
          this.countrySelectIds.indexOf(personalData.BILLING_COUNTRY) || ''
        this.billingData.postalCode = personalData.BILLING_ZIPCODE || ''
        this.billingData.city = personalData.BILLING_CITY || ''
        this.billingData.address = personalData.BILLING_STREET || ''
        this.billingData.tax = ''
        this.contact.lastName = lastName
        this.contact.firstName = firstName
        this.contact.email = personalData.email
        this.contact.postalCode = personalData.ZIPCODE
        this.contact.city = personalData.CITY
        this.contact.address = personalData.STREET
        this.contact.country =
          this.countrySelectIds.indexOf(personalData.COUNTRY) || ''
        this.passengers[0].firstName = firstName
        this.passengers[0].lastName = lastName
        if (
          personalData.BIRTHDAY_YEAR !== null &&
          personalData.BIRTHDAY_YEAR !== undefined &&
          personalData.BIRTHDAY_YEAR !== '0000'
        ) {
          this.passengers[0].birthday =
            personalData.BIRTHDAY_YEAR +
            '-' +
            personalData.BIRTHDAY_MONTH +
            '-' +
            personalData.BIRTHDAY_DAY
        } else {
          this.passengers[0].birthday = '1980-01-01'
        }
      }
    },
    copyAdult1DataToBillingData() {
      if (!this.billingData.copyAdult1) {
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
    copyAdult1DataToContactData() {
      if (this.contact.copyAdult1) {
        this.contact.lastName = this.passengers[0].lastName
        this.contact.firstName = this.passengers[0].firstName
        this.contact.email = ''
        this.contact.postalCode = ''
        this.contact.city = ''
        this.contact.address = ''
        this.contact.phone = {
          countryCode: '',
          areaCode: '',
          phoneNumber: ''
        }
        this.contact.country = ''
      }
    },
    changePriority(passenger) {
      this.passengers.forEach((passengerTmp) => {
        if (passengerTmp.key !== passenger.key) {
          passengerTmp.priority = passenger.priority
        }
      })
      this.updateFlightHandlingFee()
    },
    validateBeforePay() {
      this.validateBilling()
      this.validateContact()

      this.openedCard.bookingInformation = true
      this.openedCard.billing = true
      this.openedCard.contact = true
      for (const passanger of this.passengers) {
        this.openedCard[passanger.key] = true
        this.validatePassenger(passanger.key)
      }
      for (const passanger of this.passengers) {
        for (const keyError in passanger.error) {
          if (passanger.error[keyError] !== '') {
            this.activeCard = ''
            this.showCartCard(passanger.key)
            break
          }
        }
      }

      for (const keyError in this.contact.error) {
        if (this.contact.error[keyError] !== '') {
          this.activeCard = ''
          this.showCartCard('contact')
          break
        }
      }

      for (const keyError in this.billingData.error) {
        if (this.billingData.error[keyError] !== '') {
          this.activeCard = ''
          this.showCartCard('billing')
          break
        }
      }

      if (this.acceptedBookingInformation === false) {
        this.activeCard = ''
        this.showCartCard('bookingInformation')
      }
    }
  }
}
</script>
<style scoped>
.w-133 {
  width: 133px;
}
.w-80 {
  width: 80px;
}
.w-107 {
  width: 107px;
}
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
</style>
