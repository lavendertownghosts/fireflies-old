<template>
  <div>
    <CartStatus v-if="cartStatusActive" :type="'error'" />
    <div v-if="!cartStatusActive">
      <div class="bg-primary-gradient">
        <div
          class="flex flex-wrap items-center px-16 py-24 lg:py-16 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
        >
          <div class="hidden md:block md:flex-initial md:mr-16">
            <img
              src="~assets/images/white-turq/travel-services/program/program-60.svg"
              class="w-60 h-60"
            />
          </div>

          <div class="flex-grow leading-32 md:leading-24">
            <div class="flex flex-wrap">
              <div class="flex-initial mr-4">
                Bateaux Parisiens Seine River Dinner Cruise
              </div>
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
        <div class="flex flex-col md:flex-row items-stretch w-full">
          <div class="w-auto md:mr-8 mb-40">
            <div class="text-lg font-bold text-black leading-24 mt-20">
              Foglalás
            </div>
            <StatusMessage :type="'warning'" class="mt-16 leading-20">
              Az árak tekintetében, kérjük, vegye figyelembe, hogy egyes
              szállodák további helyi és/vagy idegenforgalmi adót számíthatnak
              fel, amelyet a helyszínen közvetlenül a szállodának kell
              megfizetni. A foglalásra hoteltől függően speciális feltételek
              vonatkozhatnak: ezekről angol nyelven tájékozódhat fizetéskor az
              utazási információk résznél.<br /><br />
              Tájékoztatjuk, hogy a voucheres vagy Diamond voucheres ajánlatokat
              kedvezőbb áron is megvásárolhatja nem-voucheres ajánlataink
              között.
              <br /><br />
              <span class="font-bold">FONTOS</span>: amennyiben különböző
              állampolgárságú vendégek részére kezdeményez foglalást, a
              foglalása sikeres lesz, de a szállodába történő bejelentkezés
              eredményessége érdekében forduljon a Fireflies. Amennyiben
              elmulasztja az
              <a href="#" class="link">Ügyfélkapcsolat</a> megkeresését még az
              utazás megkezdése előtt, sajnos nem tudjuk garantálni, hogy a
              vendégek zökkenőmentesen elfoglalhatják szállásukat a helyszínen.
            </StatusMessage>
            <ServicePreview
              :image-url="'/images/round_trip/roundtrip.svg'"
              :date-text="'2019.10.15. (10:00)'"
              :room-text="false"
              :image-height="getServicePreviewImageHeight"
              :details-style="'sm:mt-24 md:mt-0'"
              class="mt-24 md:hidden"
            />
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
              <div class="p-16">
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
                  With a great location in the heart of Belgravia, one of
                  London’s most exclusive areas, this beautiful, historic
                  Victorian building offers free Wi-Fi and comfortable en suite
                  rooms.
                  <br /><br />
                  A beautifully preserved, Grade II listed building, the
                  Diplomat Hotel has a convenient location, in a quiet
                  residential area, just 5 minutes’ walk from Belgrave Square,
                  home of many of the capital’s embassies. All that London has
                  to offer is within easy reach and the hotel’s great location
                  means it offers good access to London’s transport networks.
                  London Victoria Station is less than 900 m away and Sloane
                  Square and Knightsbridge London Underground Stations are even
                  nearer. Harrods, Hyde Park and Buckingham Palace are all
                  within easy walking distance.
                  <br /><br />
                  With 26 rooms, the hotel offers friendly, personal service.
                  All rooms have telephones, TVs, tea/coffee making facilities,
                  hairdryers and bathroom accessories.
                  <br /><br />
                  A full English and continental buffet-style breakfast is
                  included in the price.
                  <br /><br />
                  Kensington and Chelsea is a great choice for travellers
                  interested in architecture, monuments and theatre.
                  <br /><br />
                  This is our guests' favourite part of London, according to
                  independent reviews. This area is also great for shopping,
                  with popular brands nearby: Cartier, Tiffany & Co, Hermès,
                  Prada, Chanel.
                  <br /><br />
                  Couples particularly like the location — they rated it 8.9 for
                  a two-person trip.
                  <br /><br />
                  We speak your language!
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
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
                <div v-show="bookingInformation.extraFees.active" class="mt-16">
                  Internet: 15 EUR
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
              :type="openedCard.meetingPoint ? 'success' : 'default'"
              :icon="
                openedCard.meetingPoint
                  ? 'fas fa-check'
                  : 'fas fa-question text-primary'
              "
              :title="'Találkozási / Felvételi helyszín'"
              :active="activeCard === 'meetingPoint'"
              :price="false"
              class="mt-24"
              @showCartCard="showCartCard('meetingPoint')"
            >
              <div class="px-16 pt-16 pb-12 mb-4">
                <StatusMessage :type="'warning'" class="leading-20">
                  Meeting point / Pick-up location: hotel reception<br />
                  Opening / Start time: 10am<br />
                  Duration: 5.5 hours<br />
                  Drop-off location: hotel reception<br />
                  Guide language: depending on the option chosen<br />
                  Voucher validity: 1 day<br />
                  To confirm the details of the activity, please call: (00)36
                  30946 34 84\nLanguages spoken at the call centre: English<br />
                </StatusMessage>
                <InputText
                  v-model="meetingPoint"
                  :class="'w-full mt-16'"
                  :label="'Hotel neve'"
                />
              </div>
            </CartCard>
            <CartCard
              :type="
                insurance !== '' && (acceptedInsurance || insurance === '4')
                  ? 'success'
                  : openedCard.insurance
                  ? 'danger'
                  : 'default'
              "
              :icon="
                insurance !== '' && (acceptedInsurance || insurance === '4')
                  ? 'fas fa-check'
                  : openedCard.insurance
                  ? 'fas fa-exclamation-triangle text-danger'
                  : 'fas fa-question text-primary'
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
                        :class="'flex'"
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
                        :class="'flex w-216'"
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
                        :class="'flex'"
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
                        :class="'flex'"
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
              :type="'danger'"
              :icon="'fas fa-exclamation-triangle text-danger'"
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
                        <div class="pr-8">
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
                        <div class="pl-8">
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
              :type="'default'"
              :icon="'fas fa-question text-primary'"
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
          <div class="md:flex-shrink-0 md:ml-8 md:w-240 xl:w-288">
            <div
              class="hidden text-lg font-bold text-black leading-24 mt-20 md:block"
            >
              Összesítő
            </div>
            <ServicePreview
              :image-url="'/images/round_trip/roundtrip.svg'"
              :date-text="'2019.10.15. (10:00)'"
              :room-text="false"
              :image-height="getServicePreviewImageHeight"
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

import CartCard from '@/components/cart/CartCard'
import ServicePreview from '@/components/cart/ServicePreview'
import CartStatus from '@/components/cart/CartStatus'
export default {
  name: 'ProgramCart',
  components: {
    StatusMessage,
    InputCheckbox,
    InputRadio,
    InputDropdown,
    InputText,
    CartCard,
    ServicePreview,
    CartStatus
  },
  data() {
    return {
      innerWidth: 0,
      activeCard: 'bookingInformation',
      openedCard: {
        bookingInformation: false,
        meetingPoint: false,
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
      meetingPoint: 'Westgate Las Vegas',
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
          firstName: '',
          lastName: '',
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
      cartStatusActive: false
    }
  },
  computed: {
    getServicePreviewImageHeight() {
      let height = '180px'
      if (this.innerWidth >= 772 && this.innerWidth < 1280) {
        height = '133px'
      } else if (this.innerWidth >= 1280) {
        height = '162px'
      }
      return height
    },
    activePaymentButton() {
      for (const value of Object.entries(this.openedCard)) {
        if (!value[1]) {
          return false
        }
      }
      return true
    }
  },
  mounted() {
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
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
    calculateSize() {
      this.innerWidth = window.innerWidth
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
