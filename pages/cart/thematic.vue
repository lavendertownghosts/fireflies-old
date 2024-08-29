<template>
  <div>
    <CartStatus
      v-if="cartStatusActive"
      :type="'success'"
      :show-relevant-offers="true"
    />
    <div v-if="!cartStatusActive">
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
                City Trip to Budapest
              </div>
            </div>
            <div class="hidden md:block md:mt-2 text-sm leading-14">
              Beváltási időszak: 2019.07.12. - 2021.12.31.
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
            Vissza
          </p>
        </div>
        <div class="flex flex-col md:flex-row items-stretch">
          <div class="w-auto md:mr-8 mb-40">
            <div class="text-lg font-bold text-black leading-24 mt-20">
              Foglalás
            </div>
            <StatusMessage :type="'warning'" class="mt-16 leading-20">
              A "Booked By You" ajánlatok megvásárlása nem eredményez foglalást.
              Lényege, hogy az ajánlat megvásárlása után Önnek személyesen a
              hotellel kell egyeztetnie az utazás időpontját illetően, amelynek
              az ajánlat beváltási időszakába kell esnie. A kapcsolatfelvételhez
              az elérhetőségeket az ajánlat adatlapján találja meg.
            </StatusMessage>
            <ServicePreview
              :image-url="'/images/hotel-details-default-img.svg'"
              class="mt-24 md:hidden"
            />
            <CartCard
              id="voucher"
              :type="'warning'"
              :title="'1 db Extra Diamond Voucher'"
              :price="'+ EUR 220'"
              :active="activeCard === 'voucher'"
              class="mt-24"
              @showCartCard="showCartCard('voucher')"
            >
              <div class="px-16 pt-16 pb-12 mb-4">
                A foglalásához 1 Diamond Vouchert kell vásárolnia, ezt
                hozzáadtuk a vásárlásához.
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
              :title="'Foglalási információk'"
              :price="
                acceptedBookingInformation
                  ? '<span class=\'text-warning\'>1 <span class=\'ff-currency bg-warning\'></span>DV</span> + EUR 493'
                  : ''
              "
              :active="activeCard === 'bookingInformation'"
              :help="'Fogadd el a foglalási információkat!'"
              class="mt-24"
              @showCartCard="showCartCard('bookingInformation')"
            >
              <div class="p-16 flex flex-wrap">
                <div class="w-full mb-16 md:mb-0  md:pr-8 md:w-1/2">
                  <GalleryBox :images="[dummy, dummy]" />
                </div>
                <div class="w-full md:pl-8 md:w-1/2">
                  <div class="font-bold cursor-pointer leading-14">
                    A hotelről
                  </div>
                  <div class="mt-8">
                    <span>
                      3 days/ 2 nights stay in a double room with balcony for 2
                      people. Barrier free: Rooms available (on request/ subject
                      to availability). Room facilities:Safe, Sat-TV, Air
                      condition Free entry to the Health Spa and Wellness Centre
                      Sárvár (without sauna use). Free entry to the SARVAR SPA
                      fitness center. Bath robes during the entire stay &
                      welcome drink on the day of arrival. Free Wi-Fi in the
                      hotel room .Day nursery for children (10 am – 6 pm).
                      Parking 5€ per night (subject to availability). Hotel
                      facilities: Spa area, Bicycle rental, Pets welcome.
                      Internet included. Parking. Restaurant. Accessible. Public
                      transport in 500m. Playground/ play area. Non-smoking
                      rooms. Concierge services. Fitness area. Garage.
                      Bar/Lounge. Laundry Fitness area:Training equipment. Spa
                      area: Beauty, Sauna, Steam bath, Massage, Pool, Jacuzzi
                    </span>
                    <span v-show="!showMore">...</span>
                    <span v-show="showMore">
                      .Day nursery for children (10 am – 6 pm). Parking 5€ per
                      night (subject to availability). Hotel facilities: Spa
                      area, Bicycle rental, Pets welcome. Internet included.
                      Parking. Restaurant. Accessible. Public transport in 500m.
                      Playground/ play area. Non-smoking rooms. Concierge
                      services. Fitness area. Garage. Bar/Lounge. Laundry
                      Fitness area:Training equipment. Spa area: Beauty, Sauna,
                      Steam bath, Massage, Pool, Jacuzzi
                    </span>
                    <div
                      class="link text-sm cursor-pointer mt-8 leading-14"
                      @click.stop
                      @click="showMore = !showMore"
                    >
                      {{ showMore ? 'Kevesebb' : 'Tovább olvasom' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-16 pt-0 flex flex-wrap">
                <div class="font-bold cursor-pointer leading-14">
                  Egyéb információk
                </div>
                <div class="mt-8 mb-16">
                  Black-out dates: Easter, national holidays, July, August and
                  23rd December - 4th January. Combining multiple vouchers is
                  possible. Reservations are subject to availability. Arrival:
                  From 3 pm. Departure: Until 12 pm Children discount: Two
                  children up to the age of 6 stay in their parents’ room for
                  free (maximum 1 extra bed per room | on request/ subject to
                  availability) from 7 years onwards 38€ per night/child (max. 2
                  on request/ subject to availability). Extra bed: 63 € per
                  night/person (on request/ subject to availability) The local
                  tax is to be payed directly at the hotel.
                </div>
              </div>
              <div class="p-16 pt-0 flex flex-wrap">
                <div class="font-bold cursor-pointer w-full leading-14">
                  Kapcsolat
                </div>
                <div class="mt-8 mb-8">
                  <span class="font-bold">Telefonszám:</span> +1 123 456 7890,
                  +2 123 456 7890<br />
                  <span class="font-bold">Email:</span>
                  info@faces-aparment.com<br />
                  <span class="font-bold">Weboldal:</span>
                  http://faces-aparment.com
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
                    Elolvastam és elfogadom a foglalási információkat
                  </div>
                </InputCheckbox>
              </div>
            </CartCard>
            <CartCard
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
            </CartCard>
            <CartCard
              id="passengers"
              :type="'danger'"
              :title="'Utasok adatai'"
              :help="'Add meg az utasok adatait!'"
              :price="false"
              :active="activeCard === 'passengers'"
              class="mt-24"
              @showCartCard="showCartCard('passengers')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox v-model="acceptedInsurance">
                  <div class="text-sm leading-14 font-bold pt-2">
                    Más számára foglalom a szállást<br class="sm:hidden" />
                    <span class="text-danger"> (1 BPO + 150 EUR)</span>
                  </div>
                </InputCheckbox>
                <InputCheckbox v-model="acceptedInsurance" class="mt-12">
                  <div class="text-sm leading-14 pt-2">
                    Adatok mentése
                  </div>
                </InputCheckbox>
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
                          :label="'Megszólítás'"
                          class="mt-12"
                        ></InputDropdown>
                      </div>
                      <div class="flex flex-row mt-24 sm:mt-12 sm:pl-16">
                        <div class="pr-8 xl:w-240">
                          <InputText
                            v-model="item.lastName"
                            :class="'w-full'"
                            :label="'Vezetéknév'"
                            :error="
                              item.lastNameError ? 'Add meg a vezetéknevet' : ''
                            "
                            :placeholder="
                              item.lastNameError ? 'Vezetéknév' : ''
                            "
                          />
                        </div>
                        <div class="pl-8 xl:w-240">
                          <InputText
                            v-model="item.firstName"
                            :class="'w-full'"
                            :label="'Keresztnév'"
                            :error="
                              item.firstNameError
                                ? 'Add meg a keresztnevet'
                                : ''
                            "
                            :placeholder="
                              item.firstNameError ? 'Keresztnév' : ''
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-row mt-24 xl:mt-12 xl:ml-16">
                      <div class="w-177">
                        <InputDropdown
                          v-model="item.nationality"
                          :values="nationalitySelect"
                          :label="'Nemzetiség'"
                        ></InputDropdown>
                      </div>
                      <div v-if="item.selectedYear" class="ml-16 w-84">
                        <InputDropdown
                          v-model="item.selectedYear"
                          :values="yearSelect"
                          :label="'Életkor'"
                          :helper="'Max 17 év'"
                        ></InputDropdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CartCard>
            <CartCard
              id="billing"
              :type="'default'"
              :title="'Számlázási adatok'"
              :help="'Add meg a számlázási adatokat!'"
              :active="activeCard === 'billing'"
              class="mt-24"
              @showCartCard="showCartCard('billing')"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox v-model="copyAdult1">
                  <div class="text-sm leading-14 pt-2">
                    Megegyezik Felnőtt 1 adataival
                  </div>
                </InputCheckbox>
                <InputCheckbox v-model="saveBillingData" class="mt-12">
                  <div class="text-sm leading-14 pt-2">
                    Adatok mentése
                  </div>
                </InputCheckbox>
                <div class="mt-24 pt-24 border-t border-grey-light">
                  <InputText
                    v-model="billingData.name"
                    :class="'w-full sm:w-271'"
                    :label="'Számlázási Név'"
                  />
                  <div class="flex flex-col xl:flex-row">
                    <div
                      class="flex flex-col sm:flex-row justify-between md:justify-start"
                    >
                      <InputDropdown
                        v-model="billingData.country"
                        :values="countrySelect"
                        :label="'Ország'"
                        class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                      ></InputDropdown>
                      <InputText
                        v-model="billingData.postalCode"
                        :class="'w-128 mt-24 md:w-auto lg:w-128'"
                        :label="'Irányítószám'"
                      />
                    </div>
                    <InputText
                      v-model="billingData.city"
                      :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                      :label="'Város'"
                    />
                  </div>
                  <InputText
                    v-model="billingData.address"
                    :class="'w-full mt-24'"
                    :label="'Cím'"
                  />
                  <div class="mt-24">
                    <label class="text-black text-xs font-bold leading-12">
                      Adószám
                      <span class="text-grey-dark font-normal"
                        >(Opcionális)</span
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
          <div class="md:flex-shrink-0 md:ml-8">
            <div
              class="hidden text-lg font-bold text-black leading-24 mt-20 md:block"
            >
              Összesítő
            </div>
            <ServicePreview
              :hotel-text="'Caesars Palace'"
              :hotel-stars="3"
              class="hidden md:block mt-16"
            />
            <div class="flex flex-col mt-24 mb-40 md:mt-0">
              <div
                class="px-16 pt-16 pb-12 text-black font-bold bg-grey-light bg-opacity-20 rounded-t border border-grey-light md:rounded-t-none md:border-t-0"
              >
                <div class="text-sm leading-14">Összesen fizetendő</div>
                <div class="text-3x leading-20 mt-4">EUR 828,38</div>
              </div>
              <div class="bg-primary-gradient px-16 pt-12 pb-16 text-white">
                <label class="text-sm leading-14 font-bold"
                  >Travel Carddal fizetendő</label
                >
                <InputText
                  v-model="travelCard"
                  :class="'w-full'"
                  :is-dark="true"
                  :label="''"
                />
                <div class="text-xs leading-12 text-white text-opacity-75">
                  Jelenlegi TC egyenleg: 450 EUR
                </div>
                <div class="h-1 bg-white bg-opacity-30 my-12"></div>
                <div class="text-sm leading-14 font-bold">
                  Bankkártyával fizetendő
                </div>
                <div class="text-3x leading-20 font-bold mt-4">EUR 376</div>
                <div class="text-xs leading-12 text-white text-opacity-75 mt-2">
                  (+ EUR 12,38 tranzakciós díj)
                </div>
              </div>
              <div
                :class="
                  activePaymentButton
                    ? 'bg-danger text-white'
                    : 'bg-grey-light text-grey'
                "
                class="text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
                @click="pay"
              >
                Fizetés EUR 388,38
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StatusMessage from '@/components/micro/StatusMessage'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputRadio from '@/components/micro/InputRadio'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import GalleryBox from '@/components/GalleryBox'

import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import CartStatus from '@/components/cart/CartStatus'

import dummy from '~/assets/images/thematic/thematic-cart-dummy1.jpg'

export default {
  name: 'HotelCart',
  components: {
    ServicePreview,
    InputText,
    InputDropdown,
    InputRadio,
    InputCheckbox,
    CartCard,
    StatusMessage,
    CartStatus,
    GalleryBox
  },
  data() {
    return {
      dummy,
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
      acceptedBookingInformation: false,
      acceptedInsurance: false,
      copyAdult1: false,
      saveBillingData: false,
      insurance: '',
      guests: {
        adults: 2,
        children: 1
      },
      titleSelect: ['Mr', 'Mrs'],
      nationalitySelect: ['magyar', 'német'],
      yearSelect: [
        'Újszülött',
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
      countrySelect: ['New Zealand', 'Hungary'],
      passengers: [
        {
          passenger: 'Felnőtt 1',
          title: 0,
          firstName: 'Jane',
          lastName: 'Cooper',
          nationality: 0,
          firstNameError: false,
          lastNameError: false
        },
        {
          passenger: 'Felnőtt 2',
          title: 0,
          firstName: 'Jane',
          lastName: 'Copper',
          nationality: 0,
          firstNameError: false,
          lastNameError: false
        },
        {
          passenger: 'Gyermek 1',
          title: 0,
          firstName: '',
          lastName: '',
          nationality: 0,
          selectedYear: 8,
          firstNameError: true,
          lastNameError: true
        }
      ],
      billingData: {
        name: 'Dakota Okuneva',
        country: 0,
        postalCode: '34041',
        city: 'London',
        address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
        tax: 'AB1234567-ZT'
      },
      travelCard: 'EUR 450',
      cartStatusActive: false,
      showMore: false
    }
  },
  computed: {
    activePaymentButton() {
      for (const value of Object.entries(this.openedCard)) {
        if (!value[1]) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    showCartCard(index) {
      if (this.openedCard[this.activeCard] === false) {
        this.openedCard[this.activeCard] = true
      }
      if (this.activeCard === index) {
        this.activeCard = false
      } else {
        this.activeCard = index
      }
    },
    pay() {
      if (this.activePaymentButton) {
        this.cartStatusActive = true
      } else {
        this.$store.dispatch('general/showSnackbar', {
          message:
            'Kérjük töltse ki a foglalási adatokat a fizetés megkezdése előtt.'
        })
      }
    }
  }
}
</script>
