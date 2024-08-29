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
            name:
              $route.params.type == 'medium'
                ? $t('weboffice.VIPMediumPageTitle')
                : $t('weboffice.VIPPurchase')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{
          $route.params.type == 'medium'
            ? $t('weboffice.VIPMediumPageTitle')
            : $t('weboffice.VIPPurchase')
        }}
      </div>
      <div class="flex flex-col w-full">
        <div
          v-if="false"
          :class="autoLoading ? 'opacity-50 pointer-events-none' : ''"
        >
          <InputCheckbox v-model="autoRebuy" @input="changeAutoReBuy"
            >{{ $t('weboffice.MonthAutoReBuy') }}
            <Tooltip
              :tooltip-text="$t('weboffice.VIPStepAutoTooltip')"
              :tooltip-style="['w-271 text-xs leading-16']"
              position="left"
              class="ml-4 text-base"
            />
          </InputCheckbox>

          <InputCheckbox
            v-show="autoRebuy && hasToken"
            v-model="stepProduct.rec_payment"
            class="mt-12"
            @input="changeAutoReBuy"
          >
            <div class="text-sm leading-14 pt-2">
              {{ $t('weboffice.VIPStepCC') }}
              <Tooltip
                :tooltip-text="$t('weboffice.VIPStepCCTooltip')"
                :tooltip-style="['w-271 text-xs leading-16']"
                position="left"
                class="ml-4 text-base"
              />
            </div>
          </InputCheckbox>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex leading-16 font-bold my-24">
            {{ $t('weboffice.CompletedMonths') }}:
            <span class="text-primary ml-4">{{
              stepProduct.activeYear !== undefined
                ? Object.values(stepProduct.history[stepProduct.activeYear])
                    .length
                : 0
            }}</span
            >/12
          </div>
          <div
            class="flex text-sm leading-14 font-bold my-24 link cursor-pointer text-right"
            @click="$scrollTo('#History')"
          >
            {{ $t('weboffice.History') }}
          </div>
        </div>
        <WebofficeStepProgress
          :title="false"
          :length="12"
          :active="
            stepProduct.activeYear !== undefined
              ? Object.values(stepProduct.history[stepProduct.activeYear])
                  .length
              : 0
          "
          :inactive-type="'circle'"
          :ignore-first="true"
          :exception-points="[
            {
              point: 1,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 2,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 4,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 5,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 7,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 8,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 10,
              showPoint: true,
              circleType: 'inverse'
            },
            {
              point: 11,
              showPoint: true,
              circleType: 'inverse'
            }
          ]"
          class="w-full mb-24"
        />
        <div class="text-2x leading-18 font-bold my-24">
          {{ $t('weboffice.PurchaseVIPProduct') }}
        </div>
        <div
          v-show="stepProduct.product_info !== false"
          class="flex flex-col lg:flex-row flex-wrap"
        >
          <div class="mb-16 lg:mb-0 w-240 xl:w-288">
            <div class="flex flex-col rounded border border-grey-light">
              <div
                class="p-16 font-bold leading-16 bg-grey-light bg-opacity-20"
              >
                {{
                  stepProduct.product_info.name === 'big_step_product'
                    ? $t('weboffice.VIPProductBigTitle')
                    : stepProduct.product_info.name === 'medium_step_product'
                    ? $t('weboffice.VIPProductMediumTitle')
                    : $t('weboffice.VIPProductSmallTitle')
                }}
              </div>
              <div class="p-16 text-sm leading-14 h-82">
                {{
                  stepProduct.product_info.name === 'big_step_product'
                    ? $t('weboffice.VIPProductBigDesc')
                    : stepProduct.product_info.name === 'medium_step_product'
                    ? $t('weboffice.VIPProductMediumDesc')
                    : $t('weboffice.VIPProductSmallDesc')
                }}
              </div>
              <div
                class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
              >
                <div class="w-1/2 font-bold">
                  {{ currency }}
                  {{
                    stepProduct.product_info.price
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
                <div class="w-1/2 text-right">
                  <ButtonSmall
                    type="primary"
                    :is-loading="isLoading"
                    :is-disabled="
                      !stepProduct.product_info.available ||
                        stepProduct.product_info.type !== 'medium'
                    "
                    class="w-92"
                    @click="showCart"
                  >
                    {{ $t('weboffice.Select') }}
                  </ButtonSmall>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="History" class="text-2x leading-18 font-bold mb-24 mt-40">
          {{ $t('weboffice.History') }}:
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <div class="flex flex-row" style="min-width: 896px;">
            <div
              v-for="(month, monthKey) in stepProduct.month_select[
                selectedYear
              ]"
              :key="'month-' + monthKey"
              class="relative flex flex-col text-xs leading-12 w-1/12 border-r border-grey-light"
            >
              <div
                class="flex pb-8 border-b uppercase px-8 border-grey-light h-34 items-end text-center"
              >
                {{ selectedYear }}
                {{ getMonthName(month).substring(0, 3) }}
              </div>
              <div class="flex justify-center w-full mt-8 ">
                <i
                  :class="
                    stepProduct.history[selectedYear][month] !== undefined
                      ? 'text-primary fa-check-circle'
                      : 'text-danger fa-times-circle'
                  "
                  class="fa-2x fas cursor-pointer"
                  @mouseover="hoverHistory = selectedYear + '-' + month"
                  @mouseleave="hoverHistory = false"
                ></i>
              </div>
            </div>
          </div>
        </Scrollbar>
        <div
          class="flex flex-wrap mt-16 pt-24 border-t border-grey-light justify-end"
        >
          <div
            v-for="(year, yearKey) in Object.keys(
              stepProduct.month_select
            ).reverse()"
            :key="yearKey"
            class="mr-8"
          >
            <ButtonSmall
              :type="parseInt(year) === selectedYear ? 'primary' : 'inverted'"
              @click="selectedYear = parseInt(year)"
            >
              {{ year }}
            </ButtonSmall>
          </div>
        </div>
        <div v-show="showFAQ" class="text-lg leading-24 font-bold mt-40 mb-24">
          {{ $t('weboffice.Faq') }}
        </div>
        <div
          v-for="(faq, key) in faqList"
          v-show="showFAQ"
          :key="key"
          class="mb-16"
        >
          <div
            v-if="
              showFAQ === true && faq.title !== '' && faq.description !== ''
            "
            class="link cursor-pointer text-sm leading-14"
            @click="activeFaq = key === activeFaq ? false : key"
          >
            {{ faq.title }}
          </div>
          <div
            v-if="
              showFAQ === true && faq.title !== '' && faq.description !== ''
            "
            v-show="activeFaq === key"
            class="text-sm leading-20 mt-4"
            v-html="faq.description"
          ></div>
        </div>
        <div id="billingData">
          <div v-show="activePay && stepProduct.product_info !== false">
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
              <div class="text-lg font-bold text-black leading-24 mb-16">
                {{ $t('general.Pay') }}
              </div>
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
                class="bg-white border-grey-light text-black border-r border-l"
              >
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-grey-light"></div>
                </div>
              </div>
              <div class="bg-primary-gradient px-16 pb-20 text-white">
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-white"></div>
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
                        getTotalPrice
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
                        getHandlingFee(getTotalPrice, 'mlm')
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
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import WebofficeStepProgress from '@/components/weboffice/WebofficeStepProgress'
import ButtonSmall from '@/components/micro/ButtonSmall'
import { getMonthName, getHandlingFee } from '@/includes/utils'
import CartCard from '@/components/cart/CartCard'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import Scrollbar from '~/components/Scrollbar'
import Tooltip from '~/components/micro/Tooltip'

import NMIModal from '@/components/modal/NMIModal'

export default {
  name: 'VIPProductPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    InputDropdownCountry,
    InputText,
    InputCheckbox,
    CartCard,
    ButtonSmall,
    WebofficeStepProgress,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
    Tooltip,
    NMIModal
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      autoLoading: false,
      payInProgress: false,
      activePay: false,
      stepProduct: false,
      activeStepProduct: 0,
      buttonDisabledTitle: this.$t('weboffice.PurchasedAfterUnit'),
      activeFaq: false,
      selectedYear: false,
      yearSelect: [],
      hoverHistory: false,
      hasToken: false,
      nmiPopupActive: false,
      nmiPopup: false,
      currency: 'EUR',
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
      isLoading: false,
      showFAQ: false,
      faqList: [
        {
          title: this.$t('weboffice.VipProductFaq1Title'),
          description: this.$t('weboffice.VipProductFaq1Desc')
        },
        {
          title: this.$t('weboffice.VipProductFaq2Title'),
          description: this.$t('weboffice.VipProductFaq2Desc')
        },
        {
          title: this.$t('weboffice.VipProductFaq3Title'),
          description: this.$t('weboffice.VipProductFaq3Desc')
        }
      ],
      autoRebuy: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getTotalPrice() {
      if (
        this.stepProduct.product_info !== false &&
        this.stepProduct.product_info.price !== undefined
      ) {
        return this.stepProduct.product_info.price
      }
      return 0
    },
    getDeadlineDate() {
      if (
        this.stepProduct.stepProductsBelongToUser !== undefined &&
        this.stepProduct.stepProductsBelongToUser.length > 0
      ) {
        return this.stepProduct.stepProductsBelongToUser[0].deadlineDate.substring(
          0,
          10
        )
      }
      return ''
    }
  },
  watch: {
    $route() {
      this.getDetails()
    }
  },
  mounted() {
    this.getDetails()
    this.faqList.forEach((element) => {
      if (element.title !== '' && element.description !== '') {
        this.showFAQ = true
      }
    })
    this.setUserBillingData()
  },
  methods: {
    getMonthName,
    getHandlingFee,
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
        this.stepProduct = false
        this.stepProduct = await this.$store.dispatch(
          'user/getVIPStepProduct',
          { type: this.$route.params.type }
        )
        this.selectedYear = this.stepProduct.activeYear
        this.hasToken = this.stepProduct.hasToken
        if (this.stepProduct.rec_payment === true) {
          this.autoRebuy = true
        } else {
          this.autoRebuy = this.stepProduct.need_autoship
        }
      } catch (e) {
        console.log(e)
      }
    },
    /** PAY */
    async pay() {
      if (
        this.getTotalPrice > 0 &&
        this.stepProduct.product_info.type === 'medium'
      ) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billingData')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payStepFFVIPProductCart', {
              cartId: this.stepProduct.product_info.itemId,
              type: this.stepProduct.product_info.type,
              quantity: 1,
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: '0',
              lang: this.$i18n.locale,
              autoRebuy: this.autoRebuy
            })
          } catch (e) {
            this.payInProgress = false
            let body = await e.response
            if (body && e.response !== undefined) {
              body = await e.response.json()
              if (body.messages !== undefined) {
                if (
                  body.messages ===
                  'only_one_small_or_big_step_product_per_months'
                ) {
                  this.$store.dispatch('general/showSnackbar', {
                    message: this.$t(
                      'weboffice.VipOnlyOneProductPerMonthsError'
                    )
                  })
                } else {
                  this.$store.dispatch('general/showSnackbar', {
                    message: body.messages
                  })
                }
              }
            }
          }
          if (res) {
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
    },
    /** CHANGE AUTO REBUY */
    async changeAutoReBuy() {
      if (this.autoLoading === false) {
        if (this.autoRebuy === false) {
          this.stepProduct.rec_payment = false
        }
        this.autoLoading = true
        await this.$store.dispatch('user/setVIPStepProductNeedAutoship', {
          type: this.$route.params.type,
          needAutoship: this.autoRebuy,
          needAutoCCpay: this.stepProduct.rec_payment
        })
        this.autoLoading = false
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeVipStepProdTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeVipStepProdTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeVipStepProdTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
