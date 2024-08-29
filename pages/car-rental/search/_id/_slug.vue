<template>
  <div>
    <div v-if="carRental !== false">
      <!-- Header -->
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
                <span class="cursor-help" :title="request.pickup">{{
                  getFromName
                }}</span
                ><span v-if="request.pickup !== request.drop"
                  ><i class="mx-4 fas fa-long-arrow-right"></i
                  ><span class="cursor-help" :title="request.drop">{{
                    getToName
                  }}</span></span
                >
              </div>
            </div>
          </div>

          <div
            class="hidden lg:flex flex-wrap flex-initial bg-white-lighter-opaque text-white text-sm rounded"
          >
            <div class="flex-grow p-16 leading-14 font-normal w-320">
              <div>
                <span class="font-bold"
                  >{{ getPickupDate }} - {{ getDropDate }}</span
                >
              </div>
              <div class="mt-4">{{ computedGuests }}</div>
            </div>
            <div class="flex mt-12 pr-16 h-40">
              <div
                class="flex items-center bg-danger px-13 rounded cursor-pointer"
                @click="showCarRentalSearchFormModal(true)"
              >
                <i class="fas fa-search text-sm text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Search box -->
      <div class="w-full lg:hidden">
        <div
          id="search-module"
          class="flex flex-wrap bg-primary-gradient px-16 text-white text-sm mt-24"
        >
          <div class="flex-grow py-16">
            <div class="font-bold leading-14">
              {{ getPickupDate }} - {{ getDropDate }}
            </div>
            <div class="mt-4 leading-14">{{ computedGuests }}</div>
          </div>
          <div class="flex mt-12 h-40">
            <div
              class="flex items-center bg-danger px-13 rounded cursor-pointer"
              @click="showCarRentalSearchFormModal(true)"
            >
              <i class="fas fa-search text-sm text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <!-- Car rental card -->
      <div class="px-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:pt-24">
          <div
            class="flex relative mt-24 mb-16 w-full w-max-152 justify-center sm:mr-16 sm:my-0"
          >
            <div
              :style="{
                backgroundImage:
                  'url(' + carRental.image.replace(/ /g, '%20') + ')'
              }"
              class="w-full bg-contain bg-no-repeat bg-center sm:h-auto h-128 z-10 cursor-help"
              :alt="carRental.title"
              :title="carRental.title"
            />
          </div>
          <div class="flex flex-col w-full">
            <div class="flex flex-row">
              <div class="flex flex-col justify-center w-full">
                <div class="flex flex-row justify-between">
                  <div class="flex flex-col">
                    <div class="flex flex-row">
                      <div class="font-bold leading-24 text-black text-lg">
                        {{ carRental.title }}
                      </div>
                      <div class="leading-24 ml-4">
                        <img
                          :src="carRental.vendor_img"
                          :title="carRental.vendor"
                          class="h-24 cursor-help"
                        />
                      </div>
                    </div>
                    <div class="text-xs leading-12 text-grey-dark mt-4">
                      {{ $t('carrent.OrSimilar') }}
                    </div>
                    <div
                      class="text-xs leading-12 mt-4"
                      :class="
                        carRental.details.cancellable
                          ? 'text-grey-dark'
                          : 'text-danger'
                      "
                    >
                      {{ $t('general.CancellationText') }}
                      {{
                        carRental.details.cancellable
                          ? carRental.details.cancellable_until
                          : $t('general.NonRefundable')
                      }}
                    </div>
                  </div>
                  <div class="hidden md:flex flex-row">
                    <div
                      class="flex text-2x leading-18 font-bold text-black mr-16 items-center"
                    >
                      {{ currency }}
                      {{
                        Math.ceil(carRental.price[currency])
                          | formatNumber('0,0', { thousandsSeparator: ' ' })
                      }}
                    </div>
                    <div class="bg-dark-hard">
                      <ButtonSmall
                        :is-loading="cartAddInProgress"
                        class="mt-7"
                        @click="addToCart"
                      >
                        {{ $t('carrent.Booking') }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
              </div>
            </div>
            <div class="flex flex-wrap">
              <div
                v-for="(item, index) in getCarSpecification"
                :key="index"
                :class="item.extraClass"
                :title="item.altText"
                class="flex mr-16 mb-12 text-sm leading-14 cursor-help"
              >
                <i :class="item.icon" class="mr-3"></i>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-row w-full mt-4 justify-end items-center bg-grey-light bg-opacity-20 border-t border-b border-grey-light md:hidden"
      >
        <div
          class="text-2x leading-18 font-bold text-black mr-16 items-center lg:flex lg:w-full lg:justify-center lg:mr-0"
        >
          {{ currency }}
          {{
            Math.ceil(carRental.price[currency])
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </div>
        <div
          class="my-15 mr-16 bg-dark-hard lg:flex lg:w-full lg:m-0 lg:mt-16 lg:justify-center"
        >
          <ButtonSmall
            :is-loading="cartAddInProgress"
            class="mt-7"
            @click="addToCart"
          >
            {{ $t('carrent.Booking') }}
          </ButtonSmall>
        </div>
      </div>
      <div class="px-16 xl:px-40 max-w-screen-xl mx-auto">
        <StatusMessage :type="'warning'" class="flex flex-col w-full mt-40">
          <div class="font-bold mb-8">{{ $t('carrent.Comment') }}:</div>
          <div class="mb-16">
            {{ carRental.details.payment_rule }}
          </div>
          <div class="font-bold mb-8">{{ $t('carrent.FuelConditions') }}:</div>
          <div>
            {{ carRental.details.fuel_information }}
          </div>
        </StatusMessage>
        <div class="flex flex-col mt-40 lg:flex-row">
          <div class="flex flex-col text-black lg:w-1/2 lg:pr-8">
            <div class="font-bold mb-16 leading-16">
              {{ $t('carrent.PriceInclude') }}:
            </div>
            <div class="flex flex-col sm:flex-row sm:flex-wrap">
              <div
                v-for="(item, index) in carRental.details.priced_coverages"
                :key="index"
                :class="index % 2 === 0 ? 'pr-16' : ''"
                class="flex flex-row mb-16 sm:w-1/2"
              >
                <div class="text-primary text-sm leading-14 mr-8">
                  <i class="fas fa-check"></i>
                </div>
                <div class="text-sm leading-14">
                  {{ item.name }}
                  <span v-show="item.description"
                    >({{ item.description }})</span
                  >
                </div>
              </div>
            </div>
            <div class="flex flex-col mt-40 mb-56 text-black">
              <div class="font-bold mb-16 leading-16">
                {{ $t('carrent.Conditions') }}
              </div>
              <div class="text-sm leading-14 font-bold mb-16">
                <a
                  :href="carRental.details.terms.TermsConditions"
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
                  :href="carRental.details.terms.ProductInformation"
                  class="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="fas fa-file-download"></i>
                  {{ $t('carrent.ProductInformation') }}
                </a>
              </div>
            </div>
          </div>
          <div class="flex flex-col text-black lg:w-1/2 lg:pl-8">
            <div
              v-show="carRental.otherInforamtion"
              class="flex flex-col text-black"
            >
              <div class="font-bold mb-16 leading-16">
                {{ $t('carrent.OtherInformation') }}
              </div>
            </div>
            <div
              v-show="carRental.details.age_restriction"
              class="flex flex-col mb-24 text-black"
            >
              <div class="font-bold mb-16 leading-16">
                {{ $t('carrent.AgeLimit') }}
              </div>
              <div class="text-sm leading-20">
                {{ $t('carrent.MinAgeLimit') }}:
                {{ carRental.details.age_restriction.minimum }}
                {{ $t('carrent.Years') }}. <br />
                {{ $t('carrent.MaxAgeLimit') }}:
                {{ carRental.details.age_restriction.maximum }}
                {{ $t('carrent.Years') }}.
              </div>
            </div>
            <div
              v-show="carRental.details.pickup_location_details"
              class="flex flex-col mb-24 text-black"
            >
              <div class="font-bold mb-16 leading-16">
                {{ $t('carrent.PickUp') }}
              </div>
              <div class="text-sm leading-20">
                {{ $t('carrent.City') }}:
                {{ carRental.details.pickup_location_details.address.city
                }}<br />
                {{ $t('carrent.Street') }}:
                {{ carRental.details.pickup_location_details.address.street
                }}<br />
                {{ $t('carrent.Country') }}:
                {{ carRental.details.pickup_location_details.address.country
                }}<br />
                {{ $t('carrent.PostalCode') }}:
                {{
                  carRental.details.pickup_location_details.address.postal_code
                }}<br />
                <span
                  v-if="
                    carRental.details.pickup_location_details.parklocation
                      .length > 0
                  "
                >
                  {{ $t('carrent.ParkLocation') }}:
                  {{
                    carRental.details.pickup_location_details.parklocation[0]
                      .Location
                  }}<br />
                </span>
                <div
                  v-if="
                    carRental.details.pickup_location_details.parklocation
                      .length > 0
                  "
                >
                  <div class="font-bold my-5">
                    {{ $t('carrent.openingHours') }}:
                  </div>
                  <div
                    v-for="(item, index) in carRental.details
                      .pickup_location_details.opening"
                    :key="index"
                  >
                    {{ getDayOfWeekName(index + 1) }}: {{ item.Start }} -
                    {{ item.End }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-show="carRental.details.drop_location_details"
              class="flex flex-col mb-24 text-black"
            >
              <div class="font-bold mb-16 leading-16">
                {{ $t('carrent.Drop') }}
              </div>
              <div class="text-sm leading-20">
                {{ $t('carrent.City') }}:
                {{ carRental.details.drop_location_details.address.city }}<br />
                {{ $t('carrent.Street') }}:
                {{ carRental.details.drop_location_details.address.street
                }}<br />
                {{ $t('carrent.Country') }}:
                {{ carRental.details.drop_location_details.address.country
                }}<br />
                {{ $t('carrent.PostalCode') }}:
                {{ carRental.details.drop_location_details.address.postal_code
                }}<br />
                <span
                  v-if="
                    carRental.details.drop_location_details.parklocation
                      .length > 0
                  "
                >
                  {{ $t('carrent.ParkLocation') }}:
                  {{
                    carRental.details.drop_location_details.parklocation[0]
                      .Location
                  }}<br />
                </span>
                <div
                  v-if="
                    carRental.details.drop_location_details.parklocation
                      .length > 0
                  "
                >
                  <div class="font-bold my-5">
                    {{ $t('carrent.openingHours') }}:
                  </div>
                  <div
                    v-for="(item, index) in carRental.details
                      .drop_location_details.opening"
                    :key="index"
                  >
                    {{ getDayOfWeekName(index + 1) }}: {{ item.Start }} -
                    {{ item.End }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-16 mb-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="bg-grey-light h-1 mt-16"></div>
        <div class="flex flex-col sm:flex-row sm:pt-24">
          <div
            class="flex relative mt-24 mb-16 w-full w-max-152 justify-center sm:mr-16 sm:my-0"
          >
            <div
              :style="{
                backgroundImage:
                  'url(' + carRental.image.replace(/ /g, '%20') + ')'
              }"
              class="w-full bg-contain bg-no-repeat bg-center sm:h-auto h-128 z-10 cursor-help"
              :alt="carRental.title"
              :title="carRental.title"
            />
          </div>
          <div class="flex flex-col w-full">
            <div class="flex flex-row">
              <div class="flex flex-col justify-center w-full">
                <div class="flex flex-row justify-between">
                  <div class="flex flex-col">
                    <div class="flex flex-row">
                      <div class="font-bold leading-24 text-black text-lg">
                        {{ carRental.title }}
                      </div>
                      <div class="leading-24 ml-4">
                        <img
                          :src="carRental.vendor_img"
                          :title="carRental.vendor"
                          class="h-24 cursor-help"
                        />
                      </div>
                    </div>
                    <div class="text-xs leading-12 text-grey-dark mt-4">
                      {{ $t('carrent.OrSimilar') }}
                    </div>
                    <div
                      class="text-xs leading-12 mt-4"
                      :class="
                        carRental.details.cancellable
                          ? 'text-grey-dark'
                          : 'text-danger'
                      "
                    >
                      {{ $t('general.CancellationText') }}
                      {{
                        carRental.details.cancellable
                          ? carRental.details.cancellable_until
                          : $t('general.NonRefundable')
                      }}
                    </div>
                  </div>
                  <div class="hidden md:flex flex-row">
                    <div
                      class="flex text-2x leading-18 font-bold text-black mr-16 items-center"
                    >
                      {{ currency }}
                      {{
                        Math.ceil(carRental.price[currency])
                          | formatNumber('0,0', { thousandsSeparator: ' ' })
                      }}
                    </div>
                    <div class="bg-dark-hard">
                      <ButtonSmall
                        :is-loading="cartAddInProgress"
                        class="mt-7"
                        @click="addToCart"
                      >
                        {{ $t('carrent.Booking') }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
                <div class="bg-grey-light h-1 my-16"></div>
              </div>
            </div>
            <div class="flex flex-wrap">
              <div
                v-for="(item, index) in getCarSpecification"
                :key="index"
                :class="item.extraClass"
                :title="item.altText"
                class="flex mr-16 mb-12 text-sm leading-14 cursor-help"
              >
                <i :class="item.icon" class="mr-3"></i>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- New search mobil modal-->
      <DefaultModal
        v-show="carRentalSearchFormModalActive"
        :is-full-page="isFullPageModal"
        :modal-max-width="'520px'"
        :default-padding="'p-0'"
        :overflow-y="false"
        @close="showCarRentalSearchFormModal(false)"
      >
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('carrent.ChangeSearch') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showCarRentalSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full md:hidden"></div>
        </div>
        <div slot="body">
          <div
            :class="isFullPageModal ? 'mt-64' : ''"
            class="flex flex-wrap mb-8"
          >
            <CarRentalSearchForm
              :init="request"
              :is-dark="false"
              :show-in-modal="true"
              class="mt-8 w-full md:pt-0 md:mt-0"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
    </div>
    <div
      v-if="fullError"
      class="px-16 lg:px-0 mx-auto sm:max-w-screen-sm w-full"
    >
      <div class="pb-40 border-b border-grey lg:border-none">
        <div class="flex flex-wrap mt-24 rounded">
          <div class="w-full text-center text-danger py-24">
            <i class="far fa-frown fa-5x"></i>
          </div>
          <div
            class="w-full text-danger text-sm font-bold leading-14 px-16 text-center md:px-128 md:mx-16 lg:px-16"
          >
            {{ $t('general.NoResults') }}
          </div>
          <div class="w-full  md:px-128 md:mx-14 lg:px-0 lg:mx-0">
            <div class="p-16 mx-auto md:px-0 lg:px-16">
              <CarRentalSearchForm
                :init="request"
                :is-dark="false"
                :show-in-modal="true"
                class="mt-8 w-full md:pt-0 md:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <CartBlockModal :covid-cart-block="cartBlock" @accept="cartBlock = false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCarSpecification } from '@/includes/CarRentalEquipments'
import CarRentalSearchForm from '@/components/forms/CarRentalSearchForm'

import DefaultModal from '@/components/modal/DefaultModal'
import ButtonSmall from '@/components/micro/ButtonSmall'
import StatusMessage from '~/components/micro/StatusMessage'
import CartBlockModal from '@/components/modal/CartBlockModal'
import { getGuestText, getDayOfWeekName } from '@/includes/utils'
export default {
  name: 'CarRentalDetails',
  components: {
    StatusMessage,
    CarRentalSearchForm,
    DefaultModal,
    ButtonSmall,
    CartBlockModal
  },
  async asyncData({ store, route, app, redirect }) {
    let details
    let carRental = false
    let fullError = false
    let request = false
    try {
      details = await store.dispatch('carRental/getCarRentalDetails', {
        veh_perf: route.params.slug,
        search_id: route.params.id
      })
    } catch (e) {
      fullError = true
      return {
        carRental,
        request,
        fullError
      }
    }

    if (details.request !== undefined) {
      request = details.request
    }

    if (!details.error) {
      carRental = details.results
    } else {
      carRental = false
      fullError = true
    }

    return {
      carRental,
      request,
      fullError
    }
  },
  data() {
    return {
      innerWidth: 0,
      isFullPageModal: true,
      carRentalSearchFormModalActive: false,
      cartAddInProgress: false,
      cartBlock: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('carRental', ['getSearchHistory']),
    currency() {
      return this.getCurrency
    },
    getCarSpecification() {
      return getCarSpecification(this.carRental)
    },
    computedGuests() {
      return getGuestText(
        this.request.guests.adults,
        this.request.guests.children
      )
    },
    getPickupDate() {
      if (this.request !== false) {
        const pickupDate = this.request.pickup_date.split('T')
        return pickupDate[0].split('-').join('.') + ' (' + pickupDate[1] + ')'
      } else {
        return ''
      }
    },
    getDropDate() {
      if (this.request !== false) {
        const dropDate = this.request.drop_date.split('T')
        return dropDate[0].split('-').join('.') + ' (' + dropDate[1] + ')'
      } else {
        return ''
      }
    },
    getCancellationFees() {
      const cancellationFees = []
      if (this.carRental.details.cancellation_fees.length > 0) {
        this.carRental.details.cancellation_fees.forEach((item) => {
          if (item.price > 0 && !cancellationFees.includes(item.description)) {
            cancellationFees.push(item.description)
          }
        })
      }
      return cancellationFees
    },
    getFromName() {
      if (this.request.pickup === this.request.drop) {
        return this.request.pickup
      }
      const destination = this.request.pickup.match(/\((.*)\)/)
      return destination ? destination[1] : this.request.pickup
    },
    getToName() {
      const destination = this.request.drop.match(/\((.*)\)/)
      return destination ? destination[1] : this.request.drop
    }
  },
  mounted() {
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
    if (this.fullError) {
      const searchHistory = this.getSearchHistory
      if (searchHistory.length > 0) {
        this.$eventBus.publish('carRentalHistoryFill', searchHistory[0])
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    getDayOfWeekName,
    showCarRentalSearchFormModal(status) {
      if (!this.isFullPageModal) {
        this.carRentalSearchFormModalActive = status
      } else if (status) {
        document.body.classList.add('fixed')
        this.carRentalSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.carRentalSearchFormModalActive = false
      }
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
      if (this.innerWidth >= 772) {
        this.isFullPageModal = false
      } else {
        this.isFullPageModal = true
      }
    },
    async addToCart() {
      // this.cartBlock = true

      if (!this.isLoggedIn) {
        this.$eventBus.publish('showLoginModal')
      } else {
        this.cartAddInProgress = true
        let res = false
        try {
          res = await this.$store.dispatch('car-rental/cart', {
            veh_perf: this.$route.params.slug,
            search_id: this.$route.params.id,
            currency: this.currency
          })
        } catch (e) {
          console.log(e)
        }

        if (res !== false) {
          this.cartAddInProgress = false
          if (res.status === 'PERMISSION') {
            this.permissionNeeded = res.permission_needed
            this.permissionModalActive = true
          } else {
            this.$store.commit('car-rental/setCartCache', res)
            await this.$router.push(this.localePath('/car-rental/cart'))
          }
        }

        this.cartAddInProgress = false
      }
    }
  },
  head() {
    return {
      title: this.carRental
        ? this.carRental.title + this.$t('meta.TitleSuffix')
        : this.$t('meta.CarrentTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.carRental
            ? this.carRental.title + this.$t('meta.TitleSuffix')
            : this.$t('meta.CarrentTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.carRental
            ? this.carRental.title + this.$t('meta.TitleSuffix')
            : this.$t('meta.CarrentTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.CarrentDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.CarrentDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.CarrentDescription')
        }
      ]
    }
  }
}
</script>

<style scoped>
@media (min-width: 520px) {
  .w-max-152 {
    max-width: 152px;
  }
}
</style>
