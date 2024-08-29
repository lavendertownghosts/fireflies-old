<template>
  <main>
    <LoadingLayerWeboffice v-if="isLoading" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.DiscountPass')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.DiscountPass') }}
      </div>
      <div
        class="mt-24 p-16 rounded text-sm leading-20 text-black bg-pink"
        v-html="$t('exclusive_offers.DCDescription')"
      ></div>
      <WebofficeCard
        :title="$t('weboffice.DiscountQuantity')"
        class="w-full mt-24"
      >
        <div class="flex flex-row items-end">
          <div class="text-lg leading-24">
            {{ availableDiscountPass }} / {{ allDiscountPass }}
          </div>
          <div class="flex text-xs leading-12 ml-4 mb-2">
            {{ $t('weboffice.DiscountPass') }}
          </div>
        </div>
      </WebofficeCard>
      <div class="mt-24">
        <div
          class="flex flex-col w-full py-16 rounded px-16"
          :class="
            isFormDisabled
              ? 'bg-grey-dark disabled-form'
              : 'bg-primary-gradient'
          "
        >
          <h2 class="text-white text-lg font-bold">
            {{ $t('exclusive_offers.DCRequestOffer') }}
          </h2>
          <InputExclusiveNamesearch
            v-model="form.NameSearch"
            class="mt-12"
            :component-attr-id="'nameSearch'"
            :error="error.NameSearch"
            :is-dark="true"
            :label="$t('exclusive_offers.FormNameSearch')"
            :is-disabled="isFormDisabled"
          />
          <span class="text-xs text-white">{{
            $t('exclusive_offers.NoHotel')
          }}</span>
          <div class="lg:flex lg:flex-row w-full mt-12">
            <div class="flex flex-row mb-12 lg:mb-0">
              <InputDate
                v-model="form.date_range[0]"
                :is-dark="true"
                :label="$t('hotel.Checkin')"
                :input-style="[]"
                :disable-past="true"
                :overwrite-today="getDefaultFromDate()"
                :is-disabled="isFormDisabled"
                :no-date-update="true"
                class="flex flex-wrapper mr-8 w-1/2 lg:w-128"
                @input="checkDate()"
              />
              <InputDate
                v-model="form.date_range[1]"
                :is-dark="true"
                :label="$t('hotel.Checkout')"
                :input-style="[]"
                :disable-past="true"
                :overwrite-today="getDefaultToDate()"
                :is-disabled="isFormDisabled"
                :no-date-update="true"
                class="flex flex-wrapper lg:mr-8 lg:ml-8 w-1/2 lg:w-128"
                @input="checkDate()"
              />
            </div>

            <InputSuperGuestsMultipleRooms
              v-model="form.guests"
              :is-dark="true"
              :is-disabled="isFormDisabled"
              :error="error.guests"
              :placeholder="$t('exclusive_offers.FormGuestButton')"
              class="w-full lg:w-256 sm:pl-8 md:pl-16 lg:pl-0 lg:ml-8 lg:pr-1"
              :label="$t('hotel.Guests')"
            />
          </div>
          <div class="mt-12 grid md:grid-cols-5 grid-cols-2">
            <div class="mb-12 md:mb-0">
              <h3
                class="block text-black text-xs font-bold leading-12 mb-5 text-white"
              >
                {{ $t('hotel.Category') }}
              </h3>
              <div
                v-for="(star, index) in form.stars"
                :key="index"
                class="flex flex-row justify-between items-end mb-4"
              >
                <InputCheckbox
                  v-model="form.stars[index]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  <StarRatings
                    :stars="index + 1"
                    :star-class="
                      isFormDisabled
                        ? 'text-3xs text-white-opaque'
                        : 'text-3xs text-white'
                    "
                    position="center"
                  />
                </InputCheckbox>
                <p class="text-sm"></p>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.category.apartman"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  Apartman
                </InputCheckbox>
                <p class="text-sm"></p>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.category.villa"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  Villa
                </InputCheckbox>
                <p class="text-sm"></p>
              </div>
            </div>
            <div class="mb-12 lg:mb-0">
              <h3
                class="block text-black text-xs font-bold leading-12 mb-5 text-white"
              >
                Board
              </h3>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.board[10]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  {{ $t('hotel.RoomOnly') }}
                </InputCheckbox>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.board[20]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  {{ $t('exclusive_offers.BreakfastOnly') }}
                </InputCheckbox>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.board[30]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  {{ $t('exclusive_offers.HalfBoard') }}
                </InputCheckbox>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.board[40]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  {{ $t('hotel.FullBoard') }}
                </InputCheckbox>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.board[50]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  {{ $t('hotel.AllInclusive') }}
                </InputCheckbox>
              </div>
            </div>
            <div class="mb-12 lg:mb-0">
              <h3
                class="block text-black text-xs font-bold leading-12 mb-5 text-white"
              >
                {{ $t('hotel.Facilities') }}
              </h3>
              <div
                v-for="(service, index) in form.services"
                :key="index"
                class="mt-5 flex flex-row justify-between items-end"
              >
                <InputCheckbox
                  v-model="form.services[index]"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                >
                  {{ getServiceName(index) }}
                </InputCheckbox>
              </div>
            </div>
            <div class="mb-12 lg:mb-0">
              <h3
                class="block text-black text-xs font-bold leading-12 mb-5 text-white"
              >
                {{ $t('exclusive_offers.Destination') }}
              </h3>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="businessFake"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                  @input="form.business = !businessFake"
                >
                  {{ $t('exclusive_offers.NotBusiness') }}
                </InputCheckbox>
              </div>
              <div class="mt-5 flex flex-row justify-between items-end">
                <InputCheckbox
                  v-model="form.business"
                  :is-dark="true"
                  :is-disabled="isFormDisabled"
                  @input="businessFake = !form.business"
                >
                  {{ $t('exclusive_offers.Business') }}
                </InputCheckbox>
              </div>
              <div v-if="error.business !== false" class="text-danger text-xs">
                {{ error.business }}
              </div>
            </div>
          </div>
          <div class="mt-12">
            <InputText
              v-model="form.message"
              :class="'w-full'"
              :placeholder="$t('exclusive_offers.CommentPlaceholder')"
              :label="$t('exclusive_offers.CommentTitle')"
              :is-dark="true"
              :error="false"
              :is-disabled="isFormDisabled"
              :limit="300"
            />
          </div>
          <div class="mt-12">
            <ButtonMedium
              v-if="!isFormDisabled"
              class="uppercase w-128"
              type="danger"
              :is-loading="searchInitLoading"
              @click="sendForm"
            >
              {{ $t('exclusive_offers.Send') }}
            </ButtonMedium>
            <div v-if="sendError" class="text-danger">
              {{ $t('exclusive_offers.SendError') }}
            </div>
          </div>
        </div>
        <div
          v-show="sendSuccess"
          class="mt-24 p-16 rounded text-sm leading-20 text-black bg-pink"
        >
          {{ $t('exclusive_offers.SendSuccess') }}
        </div>
      </div>
    </div>
    <div class="mt-48">
      <div
        v-if="offers.length > 0"
        class="flex lg:flex-row flex-col items-center text-black leading-24 font-bold mb-24 mt-16"
      >
        <div class="flex w-full text-lg">
          {{ $t('exclusive_offers.MyOffers') }}
        </div>
        <div class="flex lg:w-1/2 w-full lg:justify-end">
          <div
            class="flex flex-row px-12 py-6 text-danger text-sm rounded mt-12 lg:mt-0 bg-grey-light"
          >
            {{ $t('exclusive_offers.TimeRemain') }}:
            <CountDown
              class="text-center ml-6"
              :end-date="requestData.deadline"
            />
          </div>
        </div>
      </div>
      <div
        v-if="offers.length > 0"
        class="flex flex-col sm:flex-row sm:flex-wrap -ml-8 -mr-8"
      >
        <ExclusiveResultCard
          v-for="(offer, index) in offers"
          :key="index"
          :offer="offer"
          :image-height="responsiveWidgetThematicOfferHeight"
          :request="requestData"
          class="w-full sm:w-1/2 lg:w-1/3 px-8"
        />
      </div>
      <!-- DISCOUNT TABLE -->
      <div id="table" class="text-lg text-black leading-24 font-bold mt-16">
        Discount Passaim
      </div>
      <div class="flex flex-col w-full">
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 460px"
          >
            <thead class="font-bold text-xs">
              <tr>
                <th
                  class="py-14 px-8 text-left cursor-pointer"
                  @click="changeOrder('dpName')"
                >
                  ID
                  <i
                    v-show="order === 'dpName'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer lg:w-5/12"
                  @click="changeOrder('state')"
                >
                  <span class="block md:w-128"
                    >{{ $t('exclusive_offers.DCTableStatus') }}
                    <i
                      v-show="order === 'state'"
                      :class="
                        orderDirection === 1
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      class="fa"
                  /></span>
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer"
                  @click="changeOrder('createDate')"
                >
                  <span class="block w-128"
                    >{{ $t('exclusive_offers.DCTablePurchase') }}
                    <i
                      v-show="order === 'createDate'"
                      :class="
                        orderDirection === 1
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      class="fa"
                    />
                  </span>
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer"
                  @click="changeOrder('expireDate')"
                >
                  <span class="block w-128">
                    {{ $t('exclusive_offers.DCTableExpire') }}
                    <i
                      v-show="order === 'expireDate'"
                      :class="
                        orderDirection === 1
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      class="fa"
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody v-if="discountpassList.length > 0">
              <tr
                v-for="(row, rowKey) in discountpassList.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="w-full py-13 px-8 border border-grey-light">
                  {{ row.dpName }}
                </td>
                <td
                  class="px-8 font-bold border border-grey-light text-primary"
                  :class="statusBgColor(row.state)"
                >
                  {{ getLabel(row.state) }}
                </td>
                <td class="px-8 border border-grey-light text-left">
                  {{ row.createDate }}
                </td>
                <td class="px-8 border border-grey-light text-left">
                  {{ row.expireDate }}
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="maxPage > 1"
            :max-pages="maxPage"
            :current-page="currentPage"
            @click="navPage"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import InputExclusiveNamesearch from '@/components/micro/InputExclusiveNamesearch'
import InputText from '@/components/micro/InputText'
import InputDate from '@/components/micro/InputDate'
import InputSuperGuestsMultipleRooms from '@/components/micro/InputSuperGuestsMultipleRooms'
import InputCheckbox from '@/components/micro/InputCheckbox'
import ButtonMedium from '@/components/micro/ButtonMedium'
import StarRatings from '@/components/micro/StarRatings'
import CountDown from '@/components/micro/CountDown'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '@/components/Pagination'
import LoadingLayerWeboffice from '~/components/micro/LoadingLayerWeboffice'
import {
  formatDateApi,
  responsiveWidgetThematicOfferHeight,
  calcNights,
  getServiceName,
  getCountrySelectDatas,
  orderBy
} from '@/includes/utils'

import ExclusiveResultCard from '@/components/exclusive-offers/ExclusiveResultCard'

export default {
  name: 'DiscountPass',
  middleware: ['auth_needed'],
  components: {
    WebofficeBreadcrumb,
    WebofficeCard,
    LoadingLayerWeboffice,
    InputExclusiveNamesearch,
    InputText,
    InputDate,
    InputSuperGuestsMultipleRooms,
    InputCheckbox,
    ButtonMedium,
    ExclusiveResultCard,
    StarRatings,
    CountDown,
    Scrollbar,
    Pagination
  },
  data() {
    return {
      getServiceName,
      selectedCountries: [],
      countries: [],
      isLoading: true,
      isFormDisabled: true,
      sendSuccess: false,
      sendError: false,
      searchInitLoading: false,
      offers: [],
      discountpassList: [],
      requestData: false,
      businessFake: false,
      exclusiveEnabled: false,
      countrySelect: getCountrySelectDatas().countrySelect,
      currentPage: 1,
      maxPage: 1,
      limit: 20,
      order: 'expireDate',
      orderDirection: -1,
      statusLabels: {
        NEW: this.$t('weboffice.StateNew'),
        EXPIRED: this.$t('weboffice.Expired'),
        USED: this.$t('weboffice.StateUsed'),
        ADDED_TO_PAYMENT: this.$t('weboffice.AddedToPayment')
      },
      error: {
        NameSearch: false,
        guests: '',
        business: false
      },
      form: {
        NameSearch: {
          text: '',
          id: false
        },
        date_range: [this.getDefaultFromDate(), this.getDefaultToDate()],
        guests: [
          {
            adults: 2,
            children: 0,
            childrenAges: [],
            passengerData: {
              adults: [
                { firstname: '', lastname: '', nationality: '' },
                { firstname: '', lastname: '', nationality: '' }
              ],
              children: []
            }
          }
        ],
        stars: [false, false, false, false, false],
        category: {
          apartman: false,
          villa: false
        },
        board: {
          10: false,
          20: false,
          30: false,
          40: false,
          50: false
        },
        services: {
          0: false,
          1: false,
          2: false,
          3: false,
          4: false
        },
        business: false,
        message: ''
      }
    }
  },
  computed: {
    responsiveWidgetThematicOfferHeight
  },
  async mounted() {
    this.exclusiveEnabled = await this.$store.dispatch(
      'user/exclusiveMenuCheck'
    )
    this.checkPermission()
  },
  methods: {
    orderBy,
    statusBgColor(status) {
      const colors = {
        NEW: 'bg-primary-opaque',
        USED: 'bg-warning-opaque text-warning-dark'
      }
      return colors[status]
    },
    getLabel(status) {
      return this.statusLabels[status] !== undefined
        ? this.statusLabels[status]
        : status
    },
    async checkPermission() {
      this.isLoading = true
      const result = await this.$store.dispatch('user/exclusiveFormcheck', {
        discount_pass: true
      })
      // A végpont azt adja vissza van e joga, ezért meg kell fordítani
      this.isFormDisabled = !result

      this.getOffers()
      this.getDiscountPassList()
    },
    async getDiscountPassList() {
      const result = await this.$store.dispatch('user/getDiscountPassList')
      this.discountpassList = []
      if (result.dpList !== undefined) {
        this.discountpassList = result.dpList
        this.allDiscountPass = result.all
        this.availableDiscountPass = result.available

        this.discountpassList = this.discountpassList.sort((a, b) =>
          a[this.order] > b[this.order] ? 1 : -1
        )

        if (this.orderDirection === 1) {
          this.discountpassList.reverse()
        }

        this.maxPage = this.discountpassList
          ? Math.ceil(this.discountpassList.length / this.limit)
          : 0
      }
      this.isLoading = false
    },
    async getOffers() {
      const result = await this.$store.dispatch('user/exclusiveOffers', {
        discount_pass: true
      })
      if (result.offersList !== undefined) {
        if (result.offersList.length > 0) {
          this.offers = result.offersList
          this.isFormDisabled = true
        }
        if (Object.values(result.offerRequest).length > 0) {
          this.requestData = result.offerRequest
          // Adatok visszatöltése a formba
          if (this.isFormDisabled) {
            this.form.NameSearch.text = this.requestData.destinations[0] ?? ''
            this.form.date_range[0] = this.requestData.date_from
            this.form.date_range[1] = this.requestData.date_to
            this.form.board = this.requestData.board
            this.form.services = this.requestData.services
            this.form.business = this.requestData.business === '1'
            this.businessFake = this.requestData.business !== '1'
            this.form.message = this.requestData.message
            this.form.stars = this.requestData.stars
          }
        }
      }
    },
    getDefaultFromDate() {
      const tomorrow = new Date()
      tomorrow.setMonth(tomorrow.getMonth() + 1)

      return formatDateApi(
        tomorrow.getFullYear(),
        tomorrow.getMonth() + 1,
        tomorrow.getDate()
      )
    },
    getDefaultToDate() {
      const tomorrow = new Date()
      tomorrow.setMonth(tomorrow.getMonth() + 1)
      tomorrow.setDate(tomorrow.getDate() + 1)

      return formatDateApi(
        tomorrow.getFullYear(),
        tomorrow.getMonth() + 1,
        tomorrow.getDate()
      )
    },
    changeOrder(type) {
      if (type === this.order) {
        this.orderDirection *= -1
      } else {
        this.order = type
        this.orderDirection = 1
      }

      this.currentPage = 1

      this.discountpassList = this.discountpassList.sort((a, b) =>
        a[this.order] > b[this.order] ? 1 : -1
      )

      if (this.orderDirection === 1) {
        this.discountpassList.reverse()
      }
    },
    async sendForm() {
      /* VALIDATE */
      let error = false
      this.sendError = false
      for (const keyError in this.error) {
        this.error[keyError] = false
      }

      if (this.form.NameSearch.text === '') {
        this.error.NameSearch = this.$t('general.NameSearchErrorMsg')
        error = true
      }

      if (this.businessFake === false && this.form.business === false) {
        this.error.business = this.$t('general.FieldRequired')
        error = true
      }

      this.form.guests.forEach((guest) => {
        guest.passengerData.adults.forEach((adult) => {
          Object.values(adult).forEach((value) => {
            if (String(value).replace(' ', '') === '') {
              this.error.guests = this.$t('general.PassengerDataRequired')
              error = true
            }
          })
        })
        guest.passengerData.children.forEach((child) => {
          Object.values(child).forEach((value) => {
            if (String(value).replace(' ', '') === '') {
              this.error.guests = this.$t('general.PassengerDataRequired')
              error = true
            }
          })
        })
      })

      if (error) {
        return false
      }

      this.form.guests.forEach((guest, room) => {
        guest.passengerData.adults.forEach((adult, aid) => {
          this.form.guests[room].passengerData.adults[
            aid
          ].nationality = this.countrySelect[adult.nationality]
        })
      })

      this.form.lang = this.$i18n.locale

      this.sendFormResult = await this.$store.dispatch(
        'user/exlusiveOfferFormSend',
        { ...this.form, ...{ discount_pass: true } }
      )

      if (this.sendFormResult.error === false) {
        this.sendSuccess = true
        this.isFormDisabled = true
      } else {
        this.sendError = true
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#table')
    },
    checkDate() {
      if (
        calcNights(this.form.date_range[0], this.form.date_range[1]) < 0 ||
        calcNights(this.form.date_range[1], this.form.date_range[0]) > 0
      ) {
        const newDate = new Date(this.form.date_range[0])
        newDate.setDate(newDate.getDate() + 1)
        this.form.date_range[1] = formatDateApi(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          newDate.getDate()
        )
      }
    }
  },
  head() {
    return {
      title: this.$t('weboffice.DiscountPass') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('weboffice.DiscountPass') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('weboffice.DiscountPass') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>

<style>
.disabled-form {
  pointer-events: none !important;
}
</style>
