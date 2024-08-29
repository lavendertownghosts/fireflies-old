<template>
  <main>
    <LoadingLayerWeboffice v-if="commissionData === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Profile'),
            link: '/weboffice/personal-data'
          },
          {
            name: $t('weboffice.MyData'),
            link: '/weboffice/personal-data'
          },
          {
            name: $t('weboffice.CommissionData')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.CommissionData') }}
      </div>
      <div class="flex flex-col w-full">
        <StatusMessage type="warning">
          <div
            class="text-sm leading-20"
            v-html="$t('weboffice.CommissionDataMessageBox')"
          />
        </StatusMessage>
        <!-- <div
          class="flex flex-col relative border-b border-t border-grey-light mt-16 pb-16"
        >
          <div
            v-show="selectedPayment !== 'E_PAYMENT'"
            class="absolute t-0 l-0 w-full h-full bg-grey bg-opacity-10 z-10"
          ></div>
          <div class="px-16">
            <div class="flex flex-row">
              <div class="flex">
                <InputRadio
                  v-model="selectedPayment"
                  selected="E_PAYMENT"
                  :is-disabled="true"
                  label=""
                />
              </div>
              <div class="flex">
                <img
                  src="~assets/images/payments_placeholder.jpg"
                  class="flex h-18 mt-20"
                />
              </div>
              <div
                class="flex bg-grey text-white text-sm leading-14 mt-16 ml-8 p-4 rounded"
              >
                {{ $t('weboffice.Inactive') }}
              </div>
            </div>
            <div class="flex flex-row mt-8 text-sm leading-14">
              {{ $t('weboffice.YourEPaymentsNumber') }}
            </div>
            <div class="flex flex-row mt-4 text-sm leading-14">
              {{ commissionData.epaymentData.epaymentNumberCurrent }}
            </div>
          </div>
        </div> -->
        <div
          v-show="selectedPayment === 'BANKTRANSFER'"
          class="relative flex flex-col border-b border-grey-light pb-16"
        >
          <div
            class="absolute t-0 l-0 h-full w-full bg-grey bg-opacity-10 z-10"
          ></div>
          <div class="px-16">
            <div class="flex flex-row">
              <div class="flex">
                <InputRadio
                  v-model="selectedPayment"
                  :is-disabled="true"
                  selected="BANKTRANSFER"
                  label=""
                />
              </div>
              <div
                v-show="selectedPayment === 'BANKTRANSFER'"
                class="flex bg-primary text-white text-sm leading-14 mt-16 ml-8 p-4 rounded"
              >
                {{ $t('weboffice.StatusActive') }}
              </div>
            </div>
            <div>
              <div class="text-2x leading-18 font-bold mt-18">
                {{ $t('weboffice.CommissionBankTransfer') }}
              </div>
              <div class="flex flex-row mt-18 w-2/3">
                <InputText
                  :value="commissionData.bankTransferData.accountHolderName"
                  :label="$t('weboffice.RevolutName')"
                  class="w-1/2"
                />
                <InputText
                  :value="commissionData.bankTransferData.bankName"
                  :label="$t('weboffice.BankName')"
                  class="ml-8"
                />
              </div>
              <div class="flex flex-row mt-18 w-2/3">
                <InputText
                  :value="commissionData.bankTransferData.iban"
                  :label="$t('weboffice.Iban')"
                  class="w-1/2"
                />
                <InputText
                  :value="commissionData.bankTransferData.swift"
                  :label="$t('weboffice.SwiftCode')"
                  class="ml-8"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="relative flex flex-col border-b border-grey-light pb-16">
          <div class="px-16">
            <div class="flex flex-row">
              <div class="flex">
                <InputRadio
                  v-model="selectedPayment"
                  :is-disabled="true"
                  selected="REVOLUT"
                  label=""
                />
              </div>
              <div class="flex">
                <img
                  src="~assets/images/revolut-logo.png"
                  class="flex h-18 mt-20"
                />
              </div>
              <div
                v-show="selectedPayment === 'REVOLUT'"
                class="flex bg-primary text-white text-sm leading-14 mt-16 ml-8 p-4 rounded"
              >
                {{ $t('weboffice.StatusActive') }}
              </div>
            </div>
            <div class="text-2x leading-18 font-bold mt-18">
              {{ $t('weboffice.RevolutData') }}
            </div>
            <div class="flex flex-row mt-18">
              <InputDropdown
                v-model="revolut.revolutCountry"
                :values="
                  Object.values(commissionData.revolutData.revolutCountries)
                "
                :error="revolut.error.revolutCountry"
                :label="$t('weboffice.Country')"
                :placeholder="$t('general.PleaseSelect')"
                :is-filterable="true"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="w-full sm:w-256"
              />
            </div>
            <div class="flex mt-12">
              <InputDropdown
                v-model="revolut.revolutAccountType"
                :values="['INDIVIDUAL', 'COMPANY']"
                :label="$t('weboffice.RevolutAccountType')"
                :placeholder="$t('general.PleaseSelect')"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="w-full sm:w-256"
              />
            </div>
            <div class="flex flex-row mt-12">
              <InputText
                v-model="revolut.revolutName"
                :input-style="[]"
                :error="revolut.error.revolutName"
                :label="$t('weboffice.RevolutName')"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="w-full sm:w-256"
              />
            </div>
            <div
              v-show="!revolutCountryUS"
              class="flex flex-col sm:flex-row mt-12"
            >
              <InputText
                v-model="revolut.revolutIban"
                :input-style="[]"
                :error="revolut.error.revolutIban"
                :label="$t('weboffice.Iban')"
                :class="!isRevolutEditable ? 'disabled' : ''"
                :is-readonly="!isRevolutEditable"
                class="w-full sm:mr-8 sm:w-320"
              />
              <InputText
                v-model="revolut.revolutBic"
                :input-style="[]"
                :error="revolut.error.revolutBic"
                :label="$t('weboffice.Bic')"
                :class="!isRevolutEditable ? 'disabled' : ''"
                :is-readonly="!isRevolutEditable"
                class="w-full mt-12 sm:ml-8 sm:w-128 sm:mt-0"
              />
            </div>
            <div
              v-show="revolutCountryUS"
              class="flex flex-col md:flex-row mt-12"
            >
              <InputText
                v-model="revolut.revolutAccountNumber"
                :input-style="[]"
                :error="revolut.error.revolutAccountNumber"
                :label="$t('weboffice.AccountNumber')"
                :class="!isRevolutEditable ? 'disabled' : ''"
                :is-readonly="!isRevolutEditable"
                class="w-full md:mr-8 sm:w-320"
              />
              <InputText
                v-model="revolut.revolutAba"
                :input-style="[]"
                :error="revolut.error.revolutAba"
                :label="$t('weboffice.Aba')"
                :class="!isRevolutEditable ? 'disabled' : ''"
                :is-readonly="!isRevolutEditable"
                class="w-full mt-12 md:ml-8 sm:w-177 md:mt-0"
              />
            </div>
            <div
              v-show="revolutCountryUS"
              class="flex flex-col sm:flex-row mt-12"
            >
              <InputText
                v-model="revolut.revolutStateUS"
                :input-style="[]"
                :error="revolut.error.revolutStateUS"
                :label="$t('weboffice.County')"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="w-full sm:mr-8 sm:w-320"
              />
            </div>
            <div class="flex flex-row mt-12">
              <InputText
                v-model="revolut.revolutCity"
                :input-style="[]"
                :error="revolut.error.revolutCity"
                :label="$t('weboffice.City')"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="w-full sm:w-320"
              />
            </div>
            <div class="flex flex-col sm:flex-row mt-12">
              <InputText
                v-model="revolut.revolutZip"
                :input-style="[]"
                :error="revolut.error.revolutZip"
                :label="$t('weboffice.ZipCode')"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="sm:mr-8 w-128"
              />
              <InputText
                v-model="revolut.revolutStreet"
                :input-style="[]"
                :error="revolut.error.revolutStreet"
                :label="$t('weboffice.Address')"
                :class="selectedPayment === 'REVOLUT' ? 'disabled' : ''"
                :is-readonly="selectedPayment === 'REVOLUT' ? true : false"
                class="w-full mt-12 sm:w-320 sm:ml-8 sm:mt-0"
              />
            </div>
            <div class="flex flex-row mt-12">
              <ButtonSmall
                type="primary"
                :is-loading="revolutLoading"
                @click="saveRevolutCard"
                >{{
                  selectedPayment === 'REVOLUT'
                    ? $t('weboffice.RevolutActivation')
                    : $t('weboffice.RevolutSave')
                }}</ButtonSmall
              >
            </div>
          </div>
        </div>
        <div id="billingData" class="mt-24">
          <div v-show="crosscardPayShowBilling">
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
                  {{ 'EUR' }}
                  {{
                    crosscardTotalPrice
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
                <div class="h-1 bg-white bg-opacity-30 my-12"></div>
                <div class="flex flex-row">
                  <div class="flex flex-col flex-grow">
                    <div class="text-sm leading-14 font-bold">
                      {{ $t('general.PayWithCreditCard') }}
                    </div>
                    <div class="text-3x leading-20 font-bold mt-4">
                      {{ 'EUR' }}
                      {{
                        crosscardTotalPrice
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div
                      class="text-xs leading-12 text-white text-opacity-75 mt-2"
                    >
                      (+ {{ 'EUR' }}
                      {{
                        0.08
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
                  crosscardTotalPrice > 0 && !payInProgress
                    ? 'bg-danger text-white'
                    : 'bg-grey-light text-grey'
                "
                class="text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
                @click="registerCrosscard(true)"
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
    <InformativeModal
      v-show="crosscardWaitingIdModal"
      :accept-button="$t('general.Ok')"
      @accept="crosscardWaitingIdModal = false"
    >
      <div slot="body">
        <h2 class="mb-10 text-lg text-black">
          {{ $t('weboffice.DearUser') }}
        </h2>
        <p class="mb-10">{{ $t('weboffice.CrosscardWaitingIdPopup') }}</p>
      </div>
    </InformativeModal>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import StatusMessage from '@/components/micro/StatusMessage'
import InputRadio from '@/components/micro/InputRadio'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputDropdown from '@/components/micro/InputDropdown'
import PhoneCountryCodeList from '@/includes/phonecountrycodelist'
import CartCard from '@/components/cart/CartCard'
import InformativeModal from '@/components/modal/InformativeModal'

import CountryList from '@/includes/countrylist'

export default {
  name: 'CommissionData',
  middleware: 'auth_needed',
  components: {
    ButtonSmall,
    InputText,
    InputRadio,
    InputCheckbox,
    StatusMessage,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    InputDropdownCountry,
    InputDropdown,
    CartCard,
    InformativeModal
  },
  data() {
    return {
      CountryList,
      PhoneCountryCodeList,
      billingDataErrorModalActive: false,
      crosscardWaitingIdModal: false,
      commissionData: false,
      selectedPayment: false,
      selectedRevolutCountry: false,
      isRevolutEditable: true,
      genderSelect: [this.$t('general.Male'), this.$t('general.Female')],
      languageSelect: [],
      countrySelect: [],
      countryCodeSelect: [],
      billingCountrySelect: [],
      revolut: {
        revolutZip: '',
        revolutCity: '',
        revolutStreet: '',
        revolutCountry: '',
        revolutName: '',
        revolutIban: '',
        revolutBic: '',
        revolutAccountType: false,
        error: []
      },
      revolutLoading: false,
      langCodeList: [
        {
          value: 'hu',
          text: 'Magyar'
        },
        {
          value: 'hr',
          text: 'Croatian'
        },
        {
          value: 'cs',
          text: 'Czech'
        },
        {
          value: 'en',
          text: 'English'
        },
        {
          value: 'fr',
          text: 'French'
        },
        {
          value: 'de',
          text: 'German'
        },
        {
          value: 'it',
          text: 'Italian'
        },
        {
          value: 'pl',
          text: 'Polish'
        },
        {
          value: 'pt',
          text: 'Portugal'
        },
        {
          value: 'ro',
          text: 'Romanian'
        },
        {
          value: 'ru',
          text: 'Russian'
        },
        {
          value: 'sr',
          text: 'Serbian'
        },
        {
          value: 'sk',
          text: 'Slovak'
        },
        {
          value: 'es',
          text: 'Spanish'
        },
        {
          value: 'tr',
          text: 'Turkish'
        }
      ],
      countrySelectRevolut: [],
      crosscardPayShowBilling: false,
      crosscard: {
        gender: '0',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        countryCode: '',
        zipCode: '',
        city: '',
        street: '',
        nameOnCard: '',
        phoneNumber01: '',
        phoneNumber02: '',
        languageCode: '',
        currency: '',
        error: {
          gender: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          countryCode: '',
          zipCode: '',
          city: '',
          street: '',
          nameOnCard: '',
          phoneNumber01: '',
          languageCode: ''
        }
      },
      crosscardTotalPrice: 5,
      payInProgress: false,
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
      crosscardNumber: {
        id: '',
        idAgain: '',
        error: {
          id: '',
          idAgain: ''
        }
      },
      crosscardNumberSaveProgress: false
    }
  },
  computed: {
    revolutCountryUS() {
      const countryCodes = Object.keys(
        this.commissionData.revolutData.revolutCountries
      )
      return countryCodes[this.revolut.revolutCountry] === 'US'
    }
  },
  mounted() {
    this.getDetails()
    this.setUserBillingData()
  },
  methods: {
    async getDetails() {
      this.isRevolutEditable = true
      let res
      try {
        res = await this.$store.dispatch('user/getComissionData')
      } catch (e) {
        console.log(e)
      }
      if (res && res.error === undefined) {
        this.commissionData = res
        this.selectedPayment = this.commissionData.selectedPaymentOption
        this.langCodeList.forEach((lang) => {
          this.languageSelect.push(lang.text)
        })
        if (
          this.commissionData.crosscardData !== undefined &&
          this.commissionData.crosscardData.crosscardregistrationFormData !==
            undefined
        ) {
          if (this.commissionData.crosscardData.waiting_for_id) {
            this.crosscardWaitingIdModal = true
          }
          if (
            this.commissionData.crosscardData.countries !== undefined &&
            this.commissionData.crosscardData.countries.length > 0
          ) {
            this.commissionData.crosscardData.countries.forEach((country) => {
              let countryCode = Object.keys(
                this.CountryList.countryCodesFullName
              ).find(
                (key) => this.CountryList.countryCodesFullName[key] === country
              )
              if (countryCode === undefined && country === 'Cyprus') {
                countryCode = 'CY'
              }
              if (countryCode !== undefined) {
                this.countrySelect.push(country)
                this.countryCodeSelect.push(countryCode)
              }
            })
            for (const [key, value] of Object.entries(
              this.commissionData.crosscardData.crosscardregistrationFormData
            )) {
              if (this.crosscard[key] !== undefined) {
                if (key === 'gender') {
                  if (value === 'male') {
                    this.crosscard[key] = 0
                  } else {
                    this.crosscard[key] = 1
                  }
                } else if (key === 'currency') {
                  this.crosscard[key] = value === '' ? 'EUR' : value
                } else if (key === 'countryCode') {
                  this.crosscard[key] =
                    value === '0' ? '' : this.countryCodeSelect.indexOf(value)
                } else if (key === 'phoneNumber01') {
                  this.crosscard[key] =
                    value === ''
                      ? ''
                      : this.PhoneCountryCodeList.codes.indexOf(value)
                } else if (key === 'languageCode') {
                  const langCodeItem = this.langCodeList.find(
                    (element) => element.value === value
                  )
                  if (langCodeItem !== undefined) {
                    this.crosscard[key] = this.languageSelect.indexOf(
                      langCodeItem.text
                    )
                  }
                } else {
                  this.crosscard[key] = value
                }
              }
            }
          }
          this.countrySelect = this.commissionData.crosscardData.countries
        }

        if (this.commissionData.revolutData !== undefined) {
          let idxCountry = ''
          if (this.commissionData.revolutData.revolutCountry !== undefined) {
            idxCountry = Object.keys(
              this.commissionData.revolutData.revolutCountries
            ).findIndex(
              (key) => this.commissionData.revolutData.revolutCountry === key
            )
            if (idxCountry < 0) {
              idxCountry = ''
            }
          }

          this.revolut = {
            revolutZip: this.commissionData.revolutData.revolutZip,
            revolutCity: this.commissionData.revolutData.revolutCity,
            revolutStreet: this.commissionData.revolutData.revolutStreet,
            revolutCountry: idxCountry,
            revolutName: this.commissionData.revolutData.revolutName,
            revolutIban: this.commissionData.revolutData.revolutIban,
            revolutBic: this.commissionData.revolutData.revolutBic,
            revolutAccountNumber: this.commissionData.revolutData
              .revolutAccountNumber,
            revolutAba: this.commissionData.revolutData.revolutAba,
            revolutStateUS: this.commissionData.revolutData.revolutStateUS,
            revolutAccountType:
              this.commissionData.revolutData.revolutAccountType === 'true'
                ? 1
                : 0,
            error: []
          }

          if (this.commissionData.revolutData.revolutCountries !== undefined) {
            this.countrySelectRevolut = Object.values(
              this.commissionData.revolutData.revolutCountries
            )
          }

          if (this.selectedPayment === 'REVOLUT') {
            let res
            try {
              res = await this.$store.dispatch('user/getRevolutEditable')
            } catch (e) {
              console.log(e)
            }

            if (res !== undefined) {
              if (res.canBeUpdated !== undefined) {
                this.isRevolutEditable = res.canBeUpdated
              }
            }
          }
        }
      } else {
        this.$store.dispatch('general/showSnackbar', {
          message: res.error !== undefined ? res.error : ''
        })
      }
    },
    async registerCrosscard(pay = false) {
      for (const key in this.crosscard.error) {
        this.crosscard.error[key] = ''
      }
      if (this.crosscard.firstName.trim() === '') {
        this.crosscard.error.firstName = this.$t('weboffice.FirstNameRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.crosscard.firstName)) {
        this.crosscard.error.firstName = this.$t(
          'weboffice.FirstNamePatternError'
        )
      } else if (this.crosscard.lastName.trim() === '') {
        this.crosscard.error.lastName = this.$t('weboffice.LastNameRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.crosscard.lastName)) {
        this.crosscard.error.lastName = this.$t(
          'weboffice.LastNamePatternError'
        )
      } else if (this.crosscard.dateOfBirth.trim() === '') {
        this.crosscard.error.dateOfBirth = this.$t('weboffice.BirthdayRequired')
      } else if (this.crosscard.countryCode === '') {
        this.crosscard.error.countryCode = this.$t('weboffice.CountryRequired')
      } else if (this.crosscard.zipCode.trim() === '') {
        this.crosscard.error.zipCode = this.$t('weboffice.ZipCodeRequired')
      } else if (this.crosscard.city.trim() === '') {
        this.crosscard.error.city = this.$t('weboffice.CityRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.crosscard.city)) {
        this.crosscard.error.city = this.$t('weboffice.CityPatternError')
      } else if (this.crosscard.street.trim() === '') {
        this.crosscard.error.street = this.$t('weboffice.AddressRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.crosscard.street)) {
        this.crosscard.error.street = this.$t('weboffice.AddressPatternError')
      } else if (this.crosscard.phoneNumber01 === '') {
        this.crosscard.error.phoneNumber01 = this.$t('weboffice.PhoneRequired')
      } else if (this.crosscard.phoneNumber02.trim() === '') {
        this.crosscard.error.phoneNumber01 = this.$t('weboffice.PhoneRequired')
      } else if (this.crosscard.languageCode === '') {
        this.crosscard.error.languageCode = this.$t(
          'weboffice.LanguageRequired'
        )
      } else if (this.crosscard.nameOnCard.trim() === '') {
        this.crosscard.error.nameOnCard = this.$t(
          'weboffice.NameOnCardRequired'
        )
      } else if (!/^[\x20-\x7E]+$/.test(this.crosscard.nameOnCard)) {
        this.crosscard.error.nameOnCard = this.$t(
          'weboffice.NameOnCardPatternError'
        )
      } else if (!pay) {
        this.crosscardPayShowBilling = true
        this.$scrollTo('#billingData')
      } else {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billingData')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/saveCrosscard', {
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              save_billing: this.billingData.saveBillingData,
              gender: this.crosscard.gender === 0 ? 'male' : 'female',
              first_name: this.crosscard.firstName,
              last_name: this.crosscard.lastName,
              date_of_birth: this.crosscard.dateOfBirth,
              country_code: this.crosscard.countryCode,
              zip_code: this.crosscard.zipCode,
              city: this.crosscard.city,
              street: this.crosscard.street,
              phone_number_01: this.PhoneCountryCodeList.codes[
                this.crosscard.phoneNumber01
              ],
              phone_number_02:
                this.crosscard.phoneNumber02.replace(/\s/g, '') + '',
              language_code: this.langCodeList[this.crosscard.languageCode]
                .value,
              name_on_card: this.crosscard.nameOnCard
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
                window.location.href = res.forwardURL
              }
            }
            this.payInProgress = false
          }
        }
      }
      for (const key in this.crosscard.error) {
        if (this.crosscard.error[key] !== '') {
          this.$scrollTo('#crosscardRegistration')
          continue
        }
      }
    },
    async saveCrosscardNumber() {
      for (const key in this.crosscard.error) {
        this.crosscard.error[key] = ''
      }
      if (this.crosscardNumber.id.trim() === '') {
        this.crosscardNumber.error.id = this.$t(
          'weboffice.CrosscardNumberRequired'
        )
      } else if (!/^\d+$/.test(this.crosscardNumber.id)) {
        this.crosscardNumber.error.id = this.$t(
          'weboffice.CrosscardNumberOnlyNumber'
        )
      } else if (this.crosscardNumber.id.length !== 9) {
        this.crosscardNumber.error.id = this.$t(
          'weboffice.CrosscardLengthRequired'
        )
      } else if (this.crosscardNumber.id !== this.crosscardNumber.idAgain) {
        this.crosscardNumber.error.id = this.$t(
          'weboffice.CrosscardNumberMatch'
        )
      } else {
        this.crosscardNumberSaveProgress = true
        let res
        try {
          res = await this.$store.dispatch('user/saveNumberCrosscard', {
            enter_crosscard_id: this.crosscardNumber.id,
            enter_crosscard_id_again: this.crosscardNumber.idAgain
          })
        } catch (e) {
          this.crosscardNumberSaveProgress = false
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
          window.location.reload()
        }
      }
    },
    async saveRevolutCard() {
      this.revolut.error = {}

      let error = false

      if (
        this.revolut.revolutName === '' ||
        this.revolut.revolutName === undefined
      ) {
        this.revolut.error.revolutName = this.$t(
          'weboffice.RevolutNameRequired'
        )
        error = true
      }

      if (
        this.revolut.revolutZip === '' ||
        this.revolut.revolutZip === undefined
      ) {
        this.revolut.error.revolutZip = this.$t('weboffice.RevolutZipRequired')
        error = true
      }

      if (
        this.revolut.revolutCity === '' ||
        this.revolut.revolutCity === undefined
      ) {
        this.revolut.error.revolutCity = this.$t(
          'weboffice.RevolutCityRequired'
        )
        error = true
      }

      if (
        this.revolut.revolutStreet === '' ||
        this.revolut.revolutStreet === undefined
      ) {
        this.revolut.error.revolutStreet = this.$t(
          'weboffice.RevolutStreetRequired'
        )
        error = true
      }

      if (
        this.revolut.revolutCountry === '' ||
        this.revolut.revolutCountry === undefined
      ) {
        this.revolut.error.revolutCountry = this.$t(
          'weboffice.RevolutCountryRequired'
        )
        error = true
      }

      if (this.revolutCountryUS) {
        if (
          this.revolut.revolutAccountNumber === '' ||
          this.revolut.revolutAccountNumber === undefined
        ) {
          this.revolut.error.revolutAccountNumber = this.$t(
            'weboffice.RevolutAccountNumberRequired'
          )
          error = true
        }

        if (
          this.revolut.revolutAba === '' ||
          this.revolut.revolutAba === undefined
        ) {
          this.revolut.error.revolutAba = this.$t(
            'weboffice.RevolutAbaRequired'
          )
          error = true
        }

        if (
          this.revolut.revolutStateUS === '' ||
          this.revolut.revolutStateUS === undefined
        ) {
          this.revolut.error.revolutStateUS = this.$t(
            'weboffice.RevolutCountyRequired'
          )
          error = true
        }
      } else {
        if (
          this.revolut.revolutIban === '' ||
          this.revolut.revolutIban === undefined
        ) {
          this.revolut.error.revolutIban = this.$t(
            'weboffice.RevolutIbanRequired'
          )
          error = true
        }

        if (
          this.revolut.revolutBic === '' ||
          this.revolut.revolutBic === undefined
        ) {
          this.revolut.error.revolutBic = this.$t(
            'weboffice.RevolutBicRequired'
          )
          error = true
        }
      }

      if (!error) {
        this.revolutLoading = true
        let res
        try {
          const postData = {
            newPaymentSaveType: true,
            revolutZip: this.revolut.revolutZip,
            revolutCity: this.revolut.revolutCity,
            revolutStreet: this.revolut.revolutStreet,
            revolutCountry: Object.keys(
              this.commissionData.revolutData.revolutCountries
            )[this.revolut.revolutCountry],
            revolutName: this.revolut.revolutName,
            bank_transfer_submit: false,
            payment_option: 'REVOLUT',
            revolutAccountType: Boolean(this.revolut.revolutAccountType)
          }
          if (this.revolutCountryUS) {
            postData.revolutAccountNumber = this.revolut.revolutAccountNumber
            postData.revolutAba = this.revolut.revolutAba
            postData.revolutStateUS = this.revolut.revolutStateUS
          } else {
            postData.revolutIban = this.revolut.revolutIban
            postData.revolutBic = this.revolut.revolutBic
          }
          res = await this.$store.dispatch('user/saveRevolut', postData)
          this.revolutLoading = false
        } catch (e) {
          let body = await e.response
          if (body && e.response !== undefined) {
            body = await e.response.json()
            if (body.messages !== undefined) {
              this.$store.dispatch('general/showSnackbar', {
                message: body.messages
              })
            }
          }
          this.revolutLoading = false
        }

        if (res) {
          window.location.reload()
        }
      }
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
        this.$t('meta.WebofficeComissionTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeComissionTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeComissionTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
