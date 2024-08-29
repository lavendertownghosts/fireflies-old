<template>
  <main>
    <LoadingLayerWeboffice v-if="stepProduct === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.PurchaseFirefliesProducts'),
            link: '/weboffice/membership-upgrade'
          },
          {
            name: $t('weboffice.PhasicPurchase')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.PhasicPurchase') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="text-2x leading-18 font-bold mb-24">
          {{ $t('weboffice.CompletedStages') }}:
          <span class="text-primary">{{ completedStages }}</span
          >/7
        </div>
        <WebofficeStepProgress
          :title="false"
          :length="7"
          :active="completedStages"
          :inactive-type="'verticalLine'"
          :exception-points="[
            {
              point: 1,
              showPoint: true,
              infoBox: $t('weboffice.PackageTypeBasic')
            },
            {
              point: 3,
              showPoint: true,
              infoBox: $t('weboffice.PackageTypeSmart')
            },
            {
              point: 7,
              showPoint: true,
              infoBox: $t('weboffice.PackageTypeLife')
            }
          ]"
          class="w-full my-24"
        />
        <div class="text-2x leading-18 font-bold">
          {{ $t('weboffice.Units') }}
        </div>
        <div class="text-sm leading-14 mt-4">
          {{ $t('weboffice.UnitsPurchasedForTheCompletionOfTheStageStep') }}:
          <span class="text-primary">{{ activeStepProduct }}</span
          >/3
        </div>
        <div class="flex w-full justify-center my-24">
          <WebofficeStepProgress
            :title="false"
            :length="3"
            :active="activeStepProduct"
            :inactive-type="'checklist'"
            class="w-full md:w-2/3"
          />
        </div>
        <div class="flex flex-col lg:flex-row flex-wrap">
          <div
            v-for="(product, key) in stepProduct.stepProducts"
            :key="key"
            :class="key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'"
            class="flex w-full mb-16 lg:mb-0 lg:w-1/3"
          >
            <div
              :class="
                key + 1 > activeStepProduct
                  ? 'border-grey-light'
                  : 'border-primary'
              "
              class="flex flex-col w-full rounded border justify-between"
            >
              <div
                :class="
                  key + 1 > activeStepProduct
                    ? 'bg-grey-light bg-opacity-20'
                    : 'bg-primary text-white'
                "
                class="p-16 font-bold leading-16 text-center"
              >
                <div v-html="$t('weboffice.ProductStep' + (key + 1))"></div>
                <div class="text-xs mt-4">
                  {{
                    key > activeStepProduct && product.id !== activeProduct.id
                      ? ''
                      : key + 1 > activeStepProduct
                      ? $t('weboffice.PurchaseAvailable') +
                        ': ' +
                        getDeadlineDate
                      : $t('weboffice.Purchased') +
                        ': ' +
                        getPurchasedDate(product.id)
                  }}
                </div>
              </div>
              <div class="p-16 text-sm leading-16">
                <div
                  v-for="(details, detailsKey) in product.details"
                  :key="detailsKey"
                >
                  {{ details.count + ' ' + details.name }}
                </div>
              </div>
              <div
                :class="
                  product.id === activeProduct.id ||
                  (key > activeStepProduct && product.id !== activeProduct.id)
                    ? 'bg-grey-light bg-opacity-20'
                    : 'bg-primary text-white'
                "
                class="flex flex-col p-16 border-t border-grey-light items-center"
              >
                <div class="flex flex-row w-full h-40 items-center">
                  <div class="w-1/2 font-bold">
                    {{ product.isEuro ? 'EUR' : 'USD' }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      v-show="
                        product.id === activeProduct.id &&
                          new Date(getDeadlineDate) < new Date()
                      "
                      @click="showCart"
                    >
                      {{ $t('weboffice.Buy') }}
                    </ButtonSmall>
                    <div
                      v-show="
                        key > activeStepProduct &&
                          product.id !== activeProduct.id
                      "
                      class="text-sm leading-14 font-bold"
                    >
                      {{
                        $t('weboffice.PurchasedAfterUnit').replace(
                          '__count__',
                          key
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-2x leading-18 font-bold mb-24 mt-24">
          {{ $t('weboffice.History') }}:
        </div>
        <div class="flex flex-row">
          <div
            v-for="(month, monthKey) in monthSelect[selectedYear]"
            :key="'month-' + monthKey"
            :class="
              monthKey < monthSelect[selectedYear].length - 1
                ? 'border-r border-grey'
                : ''
            "
            class="relative flex flex-col text-xs leading-12"
          >
            <div
              v-show="hoverHistory === selectedYear + '-' + month"
              class="absolute text-black right-0 sm:w-177 text-center mb-100 bg-white px-8 py-4 border border-grey-light p-16 rounded shadow-drop"
            >
              {{ getHistoryStatusText(selectedYear, month) }}
            </div>
            <div
              class="flex pb-8 border-b uppercase px-8 border-grey-light h-34 items-end"
            >
              {{ selectedYear + ' ' + getMonthName(month).substring(0, 3) }}
            </div>
            <div class="flex justify-center w-full mt-8 ">
              <i
                :class="
                  getHistoryStatus(selectedYear, month) === 'success'
                    ? 'text-primary fa-check-circle'
                    : 'fa-exclamation-circle'
                "
                class="fal fa-2x cursor-pointer"
                @mouseover="hoverHistory = selectedYear + '-' + month"
                @mouseleave="hoverHistory = false"
              ></i>
            </div>
          </div>
        </div>

        <div
          class="flex flex-wrap mt-16 pt-24 border-t border-grey-light justify-end"
        >
          <div
            v-for="(year, yearKey) in yearSelect"
            :key="yearKey"
            class="mr-8"
          >
            <ButtonSmall
              :type="year === selectedYear ? 'primary' : 'inverted'"
              @click="selectedYear = year"
            >
              {{ year }}
            </ButtonSmall>
          </div>
        </div>
        <div class="text-lg leading-24 font-bold mt-40 mb-8">
          {{ $t('weboffice.Faq') }}
        </div>

        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 1 === activeFaq ? false : 1"
          >
            {{ $t('weboffice.StepProductFaqQuestion1') }}
          </div>
          <div v-show="activeFaq === 1" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.StepProductFaqExposion1Part1') }}</div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 2 === activeFaq ? false : 2"
          >
            {{ $t('weboffice.StepProductFaqQuestion2') }}
          </div>
          <div v-show="activeFaq === 2" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.StepProductFaqExposion2Part1') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion2Part2') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion2Part3') }}</div>
            <table class="table-fixed text-black w-full">
              <thead class="font-bold">
                <tr>
                  <th class="w-1/6 py-14 px-8 "></th>
                  <th class="w-1/6 py-14 px-8 ">
                    {{ $t('weboffice.ProductVoucher') }}
                  </th>
                  <th class="w-1/6 py-14 px-8 ">
                    {{ $t('weboffice.HolidayCoupon') }}
                  </th>
                  <th class="w-1/6 py-14 px-8 ">
                    {{ $t('weboffice.BestPriceOption') }}
                  </th>
                  <th class="w-1/6 py-14 px-8 ">
                    {{ $t('weboffice.RightReservationPortal') }}
                  </th>
                  <th class="w-1/6 py-14 px-8 ">{{ $t('weboffice.Price') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part4') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">5</td>
                  <td class="py-13 px-8 border border-grey-light">1</td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part7') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part5') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">5</td>
                  <td class="py-13 px-8 border border-grey-light">1</td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part8') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part6') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">1</td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">2</td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part9') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.StepProductFaqExposion2Part10') }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              {{ $t('weboffice.StepProductFaqExposion2Part11') }}
            </div>
            <div>
              {{ $t('weboffice.StepProductFaqExposion2Part12') }}
            </div>
            <div>
              {{ $t('weboffice.StepProductFaqExposion2Part13') }}
            </div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 3 === activeFaq ? false : 3"
          >
            {{ $t('weboffice.StepProductFaqQuestion3') }}
          </div>
          <div v-show="activeFaq === 3" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.StepProductFaqExposion3Part1') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion3Part2') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion3Part3') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion3Part4') }}</div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 4 === activeFaq ? false : 4"
          >
            {{ $t('weboffice.StepProductFaqQuestion4') }}
          </div>
          <div v-show="activeFaq === 4" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.StepProductFaqExposion4Part1') }}</div>
            <div>
              {{ $t('weboffice.StepProductFaqExposion4Part2') }}
            </div>
            <div>
              {{ $t('weboffice.StepProductFaqExposion4Part3') }}
            </div>
            <div>{{ $t('weboffice.StepProductFaqExposion4Part4') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion4Part5') }}</div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 5 === activeFaq ? false : 5"
          >
            {{ $t('weboffice.StepProductFaqQuestion5') }}
          </div>
          <div v-show="activeFaq === 5" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.StepProductFaqExposion5Part1') }}</div>
            <div>
              {{ $t('weboffice.StepProductFaqExposion5Part2') }}
            </div>
            <div>
              {{ $t('weboffice.StepProductFaqExposion5Part3') }}
            </div>
            <div>{{ $t('weboffice.StepProductFaqExposion5Part4') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion5Part5') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion5Part6') }}</div>
            <div>{{ $t('weboffice.StepProductFaqExposion5Part7') }}</div>
          </div>
        </div>
        <div id="billingData">
          <div v-show="activePay">
            <div
              class="flex items-center text-lg leading-24 font-bold mb-16 mt-40"
            >
              {{ $t('weboffice.Pay') }}
            </div>
            <CartCard
              id="billing"
              :type="'success'"
              :title="$t('weboffice.BillingData')"
              :help="$t('weboffice.BillingDataError')"
              :active="true"
              :show-chevron="false"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox
                  v-model="billingData.saveBillingData"
                  class="mt-12"
                >
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('weboffice.SaveData') }}
                  </div>
                </InputCheckbox>
                <div class="mt-24 pt-24 border-t border-grey-light">
                  <InputText
                    v-model="billingData.name"
                    :error="billingData.error.name"
                    :class="'w-full sm:w-271'"
                    :label="$t('weboffice.BillingName')"
                  />
                  <div class="flex flex-col xl:flex-row">
                    <div
                      class="flex flex-col sm:flex-row justify-between md:justify-start"
                    >
                      <InputDropdownCountry
                        v-model="billingData.country"
                        :error="billingData.error.country"
                        :label="$t('weboffice.Country')"
                        :placeholder="$t('general.PleaseSelect')"
                        class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                      ></InputDropdownCountry>
                      <InputText
                        v-model="billingData.postalCode"
                        :error="billingData.error.postalCode"
                        :class="'w-128 mt-24 md:w-auto lg:w-128'"
                        :label="$t('weboffice.ZipCode')"
                      />
                    </div>
                    <InputText
                      v-model="billingData.city"
                      :error="billingData.error.city"
                      :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                      :label="$t('weboffice.City')"
                    />
                  </div>
                  <InputText
                    v-model="billingData.address"
                    :error="billingData.error.address"
                    :class="'w-full mt-24'"
                    :label="$t('weboffice.Address')"
                  />
                  <div class="mt-24">
                    <label class="text-black text-xs font-bold leading-12">
                      {{ $t('weboffice.TaxNumber') }}
                      <span class="text-grey-dark font-normal"
                        >({{ $t('weboffice.Optional') }})</span
                      >
                    </label>
                    <InputText
                      v-model="billingData.tax"
                      :error="billingData.error.tax"
                      :class="'w-216'"
                      :label="''"
                    />
                  </div>
                </div>
              </div>
            </CartCard>
            <div class="flex flex-col mt-16">
              <div
                class="px-16 pt-16 pb-12 text-black font-bold bg-grey-light rounded-t border border-grey-light"
              >
                <div class="text-sm leading-14">
                  {{ $t('weboffice.TotalPrice') }}
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
                  :is-disabled="getFees.tc.credit <= 0"
                  @input="changeAddedTravelCard"
                />

                <div class="text-xs mt-4 leading-12 text-grey-dark">
                  {{ $t('general.CurrentTC') }}: {{ currency }}
                  {{
                    (getFees !== false ? getFees.tc.credit : 0)
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
                      class="text-xs leading-12 text-white text-opacity-75 mt-2"
                    >
                      (+ {{ currency }}
                      {{
                        getHandlingFee(
                          getTotalPrice - getAddedTravelCard,
                          'mlm'
                        )
                          | formatNumber('0.00', {
                            thousandsSeparator: ' '
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
                :class="
                  getTotalPrice > 0 && !payInProgress
                    ? 'bg-danger text-white'
                    : 'bg-grey-light text-grey'
                "
                class="text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
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
    </div>
    <InformativeModal
      v-show="billingDataErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="billingDataErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('weboffice.BillingDataError') }}
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
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import InformativeModal from '@/components/modal/InformativeModal'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import WebofficeStepProgress from '@/components/weboffice/WebofficeStepProgress'
import ButtonSmall from '@/components/micro/ButtonSmall'
import { orderBy, getMonthName, getHandlingFee } from '@/includes/utils'
import CartCard from '@/components/cart/CartCard'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputTextMask from '@/components/micro/InputTextMask'
import NMIModal from '@/components/modal/NMIModal'

export default {
  name: 'StepProductPage',
  middleware: 'auth_needed',
  components: {
    InputTextMask,
    InputDropdownCountry,
    InputText,
    InputCheckbox,
    CartCard,
    ButtonSmall,
    WebofficeStepProgress,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
    InformativeModal,
    NMIModal
  },
  data() {
    return {
      recurring: false,
      recurringPopupActive: false,
      recurringPopup: false,
      activeProduct: false,
      payInProgress: false,
      activePay: false,
      stepProduct: false,
      completedStages: 0,
      activeStepProduct: 0,
      buttonDisabledTitle: this.$t('weboffice.PurchasedAfterUnit'),
      faqList: [],
      activeFaq: false,
      selectedYear: false,
      yearSelect: [],
      monthSelect: [],
      hoverHistory: false,
      travelCard: '0',
      currency: 'EUR',
      nmiPopupActive: false,
      nmiPopup: false,
      billingData: {
        saveBillingData: false,
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
      billingDataErrorModalActive: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getTotalPrice() {
      if (this.activeProduct && this.activeProduct.price !== undefined) {
        return this.activeProduct.price
      }
      return 0
    },
    getAddedTravelCard() {
      const tc = parseInt(
        (this.travelCard + '').replace(this.currency, '').trim()
      )
      if (isNaN(tc)) {
        return 0
      } else if (tc > this.getTotalPrice) {
        return this.getTotalPrice
      } else if (tc > this.getFees.tc.credit) {
        return this.getFees.tc.credit
      } else {
        return tc
      }
    },
    getDeadlineDate() {
      if (
        this.stepProduct.stepProductsBelongToUser !== undefined &&
        this.stepProduct.stepProductsBelongToUser.length > 0
      ) {
        return this.stepProduct.stepProductsBelongToUser[0].quarantineDate.substring(
          0,
          10
        )
      }
      return ''
    }
  },
  mounted() {
    this.getDetails()
    this.setUserBillingData()
  },
  methods: {
    getMonthName,
    orderBy,
    getHandlingFee,
    /** GET HISTORY STATUS */
    getHistoryStatus(year, month) {
      const product = this.stepProduct.stepProductsBelongToUser.find(
        (o) => o.year === year && o.month === month
      )
      if (product === undefined) {
        return 'info'
      } else {
        return 'success'
      }
    },
    /** GET HISTORY STATUS TEXT */
    getHistoryStatusText(year, month) {
      const product = this.stepProduct.stepProductsBelongToUser.find(
        (o) => o.year === year && o.month === month
      )
      if (product === undefined) {
        return this.$t('weboffice.StepProductHistoryInfo')
      } else {
        return (
          this.$t(
            'weboffice.ProductStep' +
              (product.productId - this.stepProduct.stepProducts[0].id)
          ) +
          ' ' +
          this.$t('weboffice.Purchase').toLowerCase() +
          ': ' +
          product.createDate.substring(0, 10)
        )
      }
    },
    /** GET PURCHASED DATE */
    getPurchasedDate(id) {
      if (
        this.stepProduct.stepProductsBelongToUser !== undefined &&
        this.stepProduct.stepProductsBelongToUser.length > 0
      ) {
        for (
          let i = 0;
          i < this.stepProduct.stepProductsBelongToUser.length;
          i++
        ) {
          if (id === this.stepProduct.stepProductsBelongToUser[i].productId) {
            return this.stepProduct.stepProductsBelongToUser[
              i
            ].createDate.substring(0, 10)
          }
        }
      }
      return ''
    },
    /** CHANGE ADDED TRAVEL CARD */
    changeAddedTravelCard() {
      let tc = this.travelCard.replace(this.currency, '').trim()
      if (tc !== '') {
        if (this.getFees.tc.credit > 0) {
          tc = parseInt(tc)
          if (isNaN(tc)) {
            this.travelCard = '0'
          } else if (tc > this.getTotalPrice) {
            this.travelCard = this.getTotalPrice + ''
          } else if (tc > Math.floor(this.getFees.tc.credit)) {
            this.travelCard = Math.floor(this.getFees.tc.credit) + ''
          }
        } else {
          this.travelCard = '0'
        }
      }
    },
    /** SHOW CART */
    showCart() {
      this.activePay = true
      this.$scrollTo('#billingData')
    },
    /** VALIDATE BILLING DATA */
    validateBilling() {
      let valid = true
      for (const keyError in this.billingData.error) {
        this.billingData.error[keyError] = ''
      }
      if (this.billingData.name === '') {
        this.billingData.error.name = this.$t('weboffice.BillingNameRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.name)) {
        this.billingData.error.name = this.$t(
          'weboffice.BillingNamePatternError'
        )

        valid = false
      }

      if (this.billingData.country === '') {
        this.billingData.error.country = this.$t('weboffice.CountryRequired')
        valid = false
      }
      if (this.billingData.postalCode === '') {
        this.billingData.error.postalCode = this.$t('weboffice.ZipCodeRequired')
        valid = false
      }
      if (this.billingData.city === '') {
        this.billingData.error.city = this.$t('weboffice.CityRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.city)) {
        this.billingData.error.city = this.$t('weboffice.CityPatternError')

        valid = false
      }
      if (this.billingData.address === '') {
        this.billingData.error.address = this.$t('weboffice.AddressRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.address)) {
        this.billingData.error.address = this.$t(
          'weboffice.AddressPatternError'
        )

        valid = false
      }
      if (this.billingData.phone === '') {
        this.billingData.error.phone = this.$t('weboffice.PhoneRequired')
        valid = false
      }
      return valid
    },
    /** GET DETAILS */
    async getDetails() {
      try {
        this.stepProduct = await this.$store.dispatch('user/getStepProduct')
      } catch (e) {
        console.log(e)
      }
      if (this.stepProduct) {
        if (this.stepProduct.numOfValidStepsInCycle) {
          this.completedStages = Math.floor(
            this.stepProduct.numOfValidStepsInCycle / 3
          )
          if (this.completedStages < 0) {
            this.completedStages = 0
          }

          this.activeStepProduct =
            this.stepProduct.numOfValidStepsInCycle -
            Math.floor(this.stepProduct.numOfValidStepsInCycle / 3) * 3

          this.activeProduct = this.stepProduct.stepProducts[
            this.activeStepProduct
          ]
        }
        if (
          this.stepProduct.stepProducts &&
          this.stepProduct.stepProducts.length > 0
        ) {
          this.stepProduct.stepProducts.forEach((stepProduct) => {
            const details = JSON.parse(stepProduct.info)
            stepProduct.details = details.items
          })
        }
        if (this.stepProduct.faq && this.stepProduct.faq) {
          for (const [key, value] of Object.entries(this.stepProduct.faq)) {
            let keyTmp = key.replace('_question', '')
            keyTmp = keyTmp.replace('_exposion', '')
            let faqTMP = this.faqList.find((o) => o.key === keyTmp)
            if (faqTMP === undefined) {
              faqTMP = { key: keyTmp, question: '', exposion: '', position: 0 }
              this.faqList.push(faqTMP)
            }
            this.faqList.forEach((faqItem) => {
              if (faqItem.key === keyTmp) {
                if (key.includes('_question')) {
                  faqItem.question = value
                  faqItem.position = parseInt(value.charAt(0))
                }
                if (key.includes('_exposion')) {
                  faqItem.exposion = value
                }
              }
            })
          }
          if (
            this.stepProduct.stepProductsBelongToUser !== undefined &&
            this.stepProduct.stepProductsBelongToUser.length > 0
          ) {
            this.stepProduct.stepProductsBelongToUser = orderBy(
              this.stepProduct.stepProductsBelongToUser,
              'createDate',
              -1
            )
            let minDate = new Date()
            this.stepProduct.stepProductsBelongToUser.forEach((userProduct) => {
              const created = new Date(userProduct.createDate)
              userProduct.year = created.getFullYear()
              userProduct.month = created.getMonth() + 1
              if (created < minDate) {
                minDate = created
              }
            })
            const now = new Date()
            // eslint-disable-next-line no-unmodified-loop-condition
            for (let d = minDate; d <= now; d.setMonth(d.getMonth() + 1)) {
              if (this.monthSelect[d.getFullYear()] === undefined) {
                this.monthSelect[d.getFullYear()] = []
              }
              this.monthSelect[d.getFullYear()].push(d.getMonth() + 1)
              if (!this.yearSelect.includes(d.getFullYear())) {
                this.yearSelect.push(d.getFullYear())
              }
            }
            this.yearSelect.sort(function(a, b) {
              return b - a
            })
            this.selectedYear = this.yearSelect[0]
          }
        }
      }
    },
    /** PAY */
    async pay() {
      if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billingData')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payStepFFProductCart', {
              cartId: this.activeProduct.cart_id,
              type: this.activeProduct.type,
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace(this.currency, '').trim(),
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale
            })
          } catch (e) {
            this.payInProgress = false
            let body = await e.response
            if (body && e.response !== undefined) {
              body = await e.response.json()
              if (body.messages !== undefined) {
                this.$store.dispatch('general/showSnackbar', {
                  message: body.messages
                })
              }
            }
          }
          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                } else {
                  this.$store.dispatch('general/showSnackbar', {
                    message: this.$t('hotel.HotelBookingDataError')
                  })
                }
              } else if (res.status === 'RECURRING') {
                this.recurringPopupActive = true
                this.recurringPopup = res.popup
              }
            }
            this.payInProgress = false
          }
        }
      }
    },
    /** SET USER BILLING DATA */
    async setUserBillingData() {
      let res
      try {
        res = await this.$store.dispatch('user/getPersonalData')
      } catch (e) {
        console.log(e)
      }
      if (res) {
        this.billingData.name =
          res.BILLING_NAME === null ? '' : res.BILLING_NAME
        this.billingData.country = res.BILLING_COUNTRY || ''
        this.billingData.postalCode = res.BILLING_ZIPCODE || ''
        this.billingData.city = res.BILLING_CITY || ''
        this.billingData.address = res.BILLING_STREET || ''
        this.billingData.tax = ''
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeStepProdTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeStepProdTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeStepProdTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
