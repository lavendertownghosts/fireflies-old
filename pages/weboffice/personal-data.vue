<template>
  <main>
    <LoadingLayerWeboffice v-if="personalData === false" />
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
            name: $t('weboffice.PersonalData')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.PersonalData') }}
      </div>
      <div class="flex flex-col w-full">
        <div
          class="flex flex-col py-20 px-16 text-sm leading-14 bg-grey-light bg-opacity-20 rounded border border-grey-light"
        >
          <div class="flex flex-row">
            <div class="font-bold">{{ $t('weboffice.Username') }}:</div>
            <div class="ml-4">
              {{ personalData.username }}
            </div>
          </div>
          <div class="flex flex-row mt-8">
            <div class="font-bold">{{ $t('weboffice.Email') }}:</div>
            <div class="ml-4">
              {{ personalData.email }}
            </div>
          </div>
          <div class="flex flex-row mt-8">
            <div class="font-bold">{{ $t('weboffice.Nationality') }}:</div>
            <div class="ml-4">
              {{
                CountryList !== false
                  ? countrySelect[
                      countrySelectIds.indexOf(Number(personalData.COUNTRY))
                    ]
                  : ''
              }}
            </div>
          </div>
          <div class="flex flex-row mt-8">
            <div
              class="link cursor-pointer"
              @click="changePasswordModalActive = true"
            >
              {{ $t('weboffice.ChangePassword') }}
            </div>
          </div>
          <div v-if="personalData.availableToDelete" class="flex flex-row mt-8">
            <div
              class="cursor-pointer text-danger hover:underline"
              @click="deleteRegistrationModalActive = true"
            >
              {{ $t('weboffice.DeleteRegistration') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-24">
          <div
            class="flex flex-col border rounded bg-grey-light bg-opacity-20 border-grey-light"
          >
            <div class="p-16">
              <div
                v-if="partner != ''"
                class="flex flex-col md:flex-row w-full"
              >
                <InputText
                  v-model="name"
                  :error="error.name"
                  :input-style="[]"
                  :is-disabled="nameIsDisabled"
                  :label="$t('weboffice.Name')"
                  class="md:mr-8 md:w-1/2"
                />
                <InputText
                  v-model="partner"
                  :input-style="[]"
                  :is-disabled="true"
                  :label="$t('weboffice.Partner')"
                  class="md:ml-8 md:w-1/2"
                />
              </div>
              <div v-else class="flex flex-col md:flex-row w-full">
                <InputText
                  v-model="name"
                  :error="error.name"
                  :input-style="[]"
                  :is-disabled="nameIsDisabled"
                  :label="$t('weboffice.Name')"
                  class="w-full lg:mr-8 lg:w-2/3"
                />
              </div>
              <div class="flex flex-col pt-16 lg:flex-row">
                <div class="flex">
                  <InputDropdownCountry
                    v-model="nationality"
                    :error="error.nationality"
                    :label="$t('weboffice.Nationality')"
                    :placeholder="$t('weboffice.PleaseSelect')"
                    class="md:mr-8 md:w-256"
                  />
                </div>
                <div class="flex flex-row w-full mt-16 lg:mt-0">
                  <InputDate
                    v-model="birthday"
                    :error="error.birthday"
                    :label="$t('weboffice.BirthDate')"
                    :input-style="[]"
                    :disable-past="false"
                    class="flex flex-wrapper mr-8 lg:ml-8 w-128"
                  />
                  <InputText
                    v-model="birthPlace"
                    :error="error.birthPlace"
                    :input-style="[]"
                    :label="$t('weboffice.BirthPlace')"
                    class="ml-8 w-full lg:w-256"
                  />
                </div>
              </div>
              <div class="flex flex-col mt-16">
                <div class="flex flex-col md:flex-row">
                  <InputDropdownCountry
                    v-model="country"
                    :error="error.country"
                    :label="$t('weboffice.Country')"
                    :placeholder="$t('weboffice.PleaseSelect')"
                    class="md:mr-8 md:w-256"
                  />
                  <InputText
                    v-model="city"
                    :error="error.city"
                    :input-style="[]"
                    :label="$t('weboffice.City')"
                    class="w-full mt-16 md:mt-0 md:mx-8 lg:w-256"
                  />
                </div>
                <div class="flex flex-row mt-16">
                  <InputText
                    v-model="zipcode"
                    :error="error.zipcode"
                    :input-style="[]"
                    :label="$t('weboffice.ZipCode')"
                    class="md:mt-0 mr-8 w-72 lg:w-92"
                  />
                  <InputText
                    v-model="street"
                    :error="error.street"
                    :input-style="[]"
                    :label="$t('weboffice.StreetAndNumber')"
                    class="ml-8 w-full lg:w-2/3"
                  />
                </div>
                <div class="flex flex-col md:flex-row mt-16">
                  <InputText
                    v-model="phonenumber"
                    :error="error.phonenumber"
                    :input-style="[]"
                    :label="$t('weboffice.Phone')"
                    class="md:mr-8 w-240"
                  />
                </div>
              </div>
              <div class="flex flex-col md:flex-row mt-16">
                <InputText
                  v-model="id_number"
                  :error="error.id_number"
                  :input-style="[]"
                  :label="$t('weboffice.IdNumber')"
                  class="md:mr-8 w-240"
                />
                <InputText
                  v-model="passport_number"
                  :error="error.passport_number"
                  :input-style="[]"
                  :label="$t('weboffice.PassportNumber')"
                  class="mt-16 md:mt-0 md:ml-8 w-240"
                />
              </div>
              <div class="mt-16">
                <ButtonSmall
                  class="w-full lg:w-auto"
                  type="primary"
                  :is-loading="isLoadingUserData"
                  @click="saveUserData"
                >
                  {{ $t('weboffice.SaveChanges') }}
                </ButtonSmall>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-24">
          <div class="text-lg leading-24 font-bold">
            {{ $t('weboffice.BillingData') }}
          </div>
          <div
            class="flex flex-col border rounded bg-grey-light bg-opacity-20 border-grey-light p-16 mt-16"
          >
            <div class="flex flex-row">
              <InputText
                v-model="billing_name"
                :error="error.billing_name"
                :input-style="[]"
                :is-disabled="billingNameIsDisabled"
                :label="$t('weboffice.BillingName')"
                class="mr-8"
              />
            </div>
            <div class="flex flex-col mt-16 md:flex-row">
              <InputDropdownCountry
                v-model="billing_country"
                :error="error.billing_country"
                :label="$t('weboffice.Country')"
                :placeholder="$t('weboffice.PleaseSelect')"
                class="md:mr-8 md:w-256"
              />
              <InputText
                v-model="billing_city"
                :error="error.billing_city"
                :input-style="[]"
                :label="$t('weboffice.City')"
                class="w-full mt-16 md:mt-0 md:ml-8 lg:w-256"
              />
            </div>
            <div class="flex flex-row mt-16">
              <InputText
                v-model="billing_zipcode"
                :error="error.billing_zipcode"
                :input-style="[]"
                :label="$t('weboffice.ZipCode')"
                class="md:mt-0 mr-8 w-72 lg:w-92"
              />
              <InputText
                v-model="billing_street"
                :error="error.billing_street"
                :input-style="[]"
                :label="$t('weboffice.StreetAndNumber')"
                class="ml-8 w-full lg:w-2/3"
              />
            </div>
            <div class="mt-16">
              <ButtonSmall
                class=""
                type="primary"
                :is-loading="isLoadingBillingData"
                @click="saveBillingData"
              >
                {{ $t('weboffice.SaveChanges') }}
              </ButtonSmall>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DefaultModal
      v-show="changePasswordModalActive"
      :modal-max-width="'320px'"
      :overflow-y="false"
      @close="changePasswordModalActive = false"
    >
      <div slot="header">
        <div class="flex w-full text-black mt-8">
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('weboffice.ChangePassword') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="changePasswordModalActive = false"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body" class="mt-24">
        <div class="text-sm leading-14 font-bold">
          {{ $t('general.DearUser') }}
        </div>
        <div class="text-sm leading-14 mt-4">
          {{ $t('general.PasswordRequirements') }}
        </div>
        <InputText
          v-model="oldPassword"
          :input-type="'password'"
          :label="$t('general.OldPassword')"
          :is-disabled="isLoadingChangePassword"
          :error="oldPasswordError"
          class="w-full mt-16"
        />
        <InputText
          v-model="password"
          :input-type="'password'"
          :label="$t('general.Password')"
          :is-disabled="isLoadingChangePassword"
          :error="passwordError"
          class="w-full mt-16"
        />
        <InputText
          v-model="passwordAgain"
          :input-type="'password'"
          :label="$t('general.PasswordAgain')"
          :is-disabled="isLoadingChangePassword"
          :error="passwordAgainError"
          class="w-full mt-16"
        />
        <ButtonMedium
          type="primary"
          class="w-full mt-16"
          :is-loading="isLoadingChangePassword"
          @click="!isLoadingChangePassword ? savePassword() : ''"
        >
          {{ $t('weboffice.Save') }}
        </ButtonMedium>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <InformativeModal
      v-show="passwordChangeSuccessModalActive"
      :accept-button="$t('general.Ok')"
      :link-button="''"
      @accept="passwordChangeSuccessModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('general.PasswordChangeSuccess') }}
        </div>
      </div>
    </InformativeModal>
    <DecisionModal
      v-show="deleteRegistrationModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.DeleteRegistration')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="deleteRegistrationInProgress"
      @close="deleteRegistrationModalActive = false"
      @cancel="deleteRegistrationModalActive = false"
      @accept="deleteRegistrationHandler"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.DeleteRegistration') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.DeleteRegistrationDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
  </main>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import InputText from '@/components/micro/InputText'
import InputDate from '@/components/micro/InputDate'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import DefaultModal from '@/components/modal/DefaultModal'
import DecisionModal from '@/components/modal/DecisionModal'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InformativeModal from '@/components/modal/InformativeModal'
import { isPhoneNumber } from '@/includes/utils'

export default {
  name: 'PersonalDataPage',
  middleware: 'auth_needed',
  components: {
    InformativeModal,
    ButtonMedium,
    DefaultModal,
    InputDropdownCountry,
    ButtonSmall,
    InputDate,
    InputText,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    DecisionModal
  },
  data() {
    return {
      CountryList: [],
      deleteRegistrationModalActive: false,
      deleteRegistrationInProgress: false,
      isLoadingUserData: false,
      isLoadingBillingData: false,
      personalData: false,
      name: '',
      partner: '',
      billing_name: '',
      birthday: '',
      birthPlace: '',
      city: '',
      billing_city: '',
      country: '',
      billing_country: '',
      zipcode: '',
      billing_zipcode: '',
      street: '',
      billing_street: '',
      phonenumber: '',
      id_number: '',
      passport_number: '',
      nationality: 0,
      countrySelect: [],
      countrySelectIds: [],
      countrySelectCodes: [],
      changePasswordModalActive: false,
      oldPassword: '',
      password: '',
      passwordAgain: '',
      isLoadingChangePassword: false,
      passwordError: '',
      passwordAgainError: '',
      oldPasswordError: '',
      passwordChangeSuccessModalActive: false,
      error: {
        name: '',
        billing_name: '',
        birthday: '',
        birthPlace: '',
        city: '',
        billing_city: '',
        country: '',
        billing_country: '',
        zipcode: '',
        billing_zipcode: '',
        street: '',
        billing_street: '',
        phonenumber: '',
        id_number: '',
        passport_number: '',
        nationality: ''
      },
      nameIsDisabled: true,
      billingNameIsDisabled: true
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    ...mapMutations({
      resetState: 'user/resetState',
      resetTravelAssistantState: 'travel-assistant/resetState'
    }),
    ...mapActions('user', ['postDeleteRegistration']),
    isPhoneNumber,
    async getDetails() {
      this.CountryList = await this.$store.dispatch('user/getCountries')
      if (this.CountryList !== undefined) {
        this.countrySelect = []
        for (const value of this.CountryList) {
          this.countrySelect.push(value.name)
          this.countrySelectIds.push(value.id)
          this.countrySelectCodes.push(value.code)
        }
      }
      try {
        this.personalData = await this.$store.dispatch('user/getPersonalData')
      } catch (e) {
        console.log(e)
      }
      if (this.personalData) {
        if (this.personalData.birthPlace !== undefined) {
          this.birthPlace = this.personalData.birthPlace
        }
        this.name =
          this.personalData.FULLNAME === null ? '' : this.personalData.FULLNAME
        this.partner =
          this.personalData.PARTNER_NAME === null
            ? ''
            : this.personalData.PARTNER_NAME
        if (
          this.personalData.FULLNAME === '' ||
          this.personalData.FULLNAME === null ||
          this.personalData.FULLNAME === undefined
        ) {
          this.nameIsDisabled = false
        }
        this.billing_name =
          this.personalData.BILLING_NAME === null
            ? ''
            : this.personalData.BILLING_NAME
        if (
          this.personalData.BILLING_NAME === '' ||
          this.personalData.BILLING_NAME === null ||
          this.personalData.BILLING_NAME === undefined
        ) {
          this.billingNameIsDisabled = false
        }
        this.city = this.personalData.CITY
        this.billing_city = this.personalData.BILLING_CITY
        this.nationality = this.personalData.INIT_COUNTRY
        this.country = this.personalData.COUNTRY
        this.billing_country = this.personalData.BILLING_COUNTRY
        this.zipcode = this.personalData.ZIPCODE
        this.billing_zipcode = this.personalData.BILLING_ZIPCODE
        this.street = this.personalData.STREET
        this.billing_street = this.personalData.BILLING_STREET
        this.phonenumber =
          this.personalData.PHONENUMBER !== null
            ? this.personalData.PHONENUMBER.replace(/\s/g, '')
            : ''
        this.id_number =
          this.personalData.ID_NUMBER === null
            ? ''
            : this.personalData.ID_NUMBER
        this.passport_number =
          this.personalData.PASSPORT_NUMBER == null
            ? ''
            : this.personalData.PASSPORT_NUMBER
        if (
          this.personalData.BIRTHDAY_YEAR !== null &&
          this.personalData.BIRTHDAY_YEAR !== undefined &&
          this.personalData.BIRTHDAY_YEAR !== '0000'
        ) {
          this.birthday =
            this.personalData.BIRTHDAY_YEAR +
            '-' +
            this.personalData.BIRTHDAY_MONTH +
            '-' +
            this.personalData.BIRTHDAY_DAY
        } else {
          this.birthday = '1980-01-01'
        }
      }
    },
    async saveUserData() {
      for (const key in this.error) {
        this.error[key] = ''
      }
      if (!this.nameIsDisabled && this.name === '') {
        this.error.name = this.$t('weboffice.NameRequired')
      } else if (!/^[\x20-\x7E]+$/.test(this.name)) {
        this.error.name = this.$t('weboffice.FirstNamePatternError')
      } else if (this.nationality < 1) {
        this.error.nationality = this.$t('weboffice.NationalityRequired')
      } else if (this.country < 1) {
        this.error.country = this.$t('weboffice.CountryRequired')
      } else if (!this.birthday) {
        this.error.birthday = this.$t('weboffice.BirthdayRequired')
      } else if (!this.birthPlace) {
        this.error.birthPlace = this.$t('weboffice.BirthPlaceRequired')
      } else if (!this.city) {
        this.error.city = this.$t('weboffice.CityRequired')
      } else if (!this.zipcode) {
        this.error.zipcode = this.$t('weboffice.ZipCodeRequired')
      } else if (!this.street) {
        this.error.street = this.$t('weboffice.AddressRequired')
      } else if (!this.phonenumber) {
        this.error.phonenumber = this.$t('weboffice.PhoneRequired')
      } else if (!isPhoneNumber(this.phonenumber)) {
        this.error.phonenumber = this.$t('weboffice.PhoneNumberError')
      } else if (!this.id_number && !this.passport_number) {
        this.error.id_number = this.$t('weboffice.IdOrPassportRequired')
      } else {
        let res
        try {
          res = this.isLoadingUserData = true
          const payload = {
            birthday: this.birthday,
            birthPlace: this.birthPlace,
            nationality: this.nationality,
            country: this.country,
            city: this.city,
            zipcode: this.zipcode,
            street: this.street,
            phonenumber: this.phonenumber.replace(/\s/g, ''),
            id_number: this.id_number,
            passport_number: this.passport_number
          }
          if (!this.nameIsDisabled) {
            payload.name = this.name
          }
          const result = await this.$store.dispatch(
            'user/postPersonalData',
            payload
          )
          if (result !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: this.$t('weboffice.SuccessMessage')
            })
          }
        } catch (e) {
          this.isLoadingUserData = false

          let body = await e.response
          if (body) {
            body = await e.response.json()
            if (body.messages !== undefined) {
              const error = JSON.parse(body.messages)
              if (error !== undefined && error.length > 0) {
                error.forEach((errorItem) => {
                  if (this.error[errorItem] !== undefined) {
                    /* @todo: custom error message */
                    this.error[errorItem] = 'Error...'
                  }
                })
              }
            }
          }
        }
        if (res) {
          this.isLoadingUserData = false
          this.nameIsDisabled = true
        }
      }
    },
    async saveBillingData() {
      for (const key in this.error) {
        this.error[key] = ''
      }
      if (!this.billingNameIsDisabled && this.billing_name === '') {
        this.error.billing_name = this.$t('weboffice.BillingNameRequired')
      } else if (this.billing_country < 1) {
        this.error.billing_country = this.$t('weboffice.CountryRequired')
      } else if (!this.billing_city) {
        this.error.billing_city = this.$t('weboffice.CityRequired')
      } else if (!this.billing_zipcode) {
        this.error.billing_zipcode = this.$t('weboffice.ZipCodeRequired')
      } else if (!this.billing_street) {
        this.error.billing_street = this.$t('weboffice.AddressRequired')
      } else {
        let res
        try {
          res = this.isLoadingBillingData = true
          const payload = {
            billing_country: this.billing_country,
            billing_city: this.billing_city,
            billing_zipcode: this.billing_zipcode,
            billing_street: this.billing_street
          }
          if (!this.billingNameIsDisabled) {
            payload.billing_name = this.billing_name
          }
          const result = await this.$store.dispatch(
            'user/postBillingData',
            payload
          )
          if (result !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: this.$t('weboffice.SuccessMessage')
            })
          }
        } catch (e) {
          this.isLoadingBillingData = false

          let body = await e.response
          if (body) {
            body = await e.response.json()
            if (body.messages !== undefined) {
              const error = JSON.parse(body.messages)
              if (error !== undefined && error.length > 0) {
                error.forEach((errorItem) => {
                  if (this.error[errorItem] !== undefined) {
                    /* @todo: custom error message */
                    this.error[errorItem] = 'Error...'
                  }
                })
              }
            }
          }
        }
        if (res) {
          this.isLoadingBillingData = false
          this.billingNameIsDisabled = true
        }
      }
    },
    async savePassword() {
      this.passwordError = ''
      this.passwordAgainError = ''
      this.oldPasswordError = ''
      if (this.oldPassword === '') {
        this.oldPasswordError = this.$t('general.OldPasswordRequired')
      } else if (this.password === '') {
        this.passwordError = this.$t('general.PasswordRequired')
      } else if (this.password.length < 8) {
        this.passwordError = this.$t('general.PasswordMinLengthError')
      } else if (this.passwordAgain === '') {
        this.passwordAgainError = this.$t('general.PasswordAgainRequired')
      } else if (this.password !== this.passwordAgain) {
        this.passwordAgainError = this.$t('general.PasswordMatchError')
      } else {
        let res
        try {
          this.isLoadingChangePassword = true
          res = await this.$store.dispatch('user/changePassword', {
            password: this.password,
            passwordAgain: this.passwordAgain,
            email: this.personalData.email,
            oldPassword: this.oldPassword
          })
        } catch (e) {
          const body = await e.response.json()
          if (body.messages !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: body.messages
            })
          }

          this.isLoadingChangePassword = false
          this.passwordAgainError = this.$t('general.PasswordChangeError')
        }
        this.isLoadingChangePassword = false
        if (res) {
          if (res.status === 'succes_save') {
            this.changePasswordModalActive = false
            this.password = ''
            this.passwordAgain = ''
            this.oldPassword = ''
            this.passwordChangeSuccessModalActive = true
          } else {
            this.passwordAgainError = this.$t('general.PasswordChangeError')
          }
        }
      }
    },
    async deleteRegistrationHandler() {
      this.deleteRegistrationInProgress = true
      let res
      try {
        res = await this.postDeleteRegistration()
      } catch (error) {
        this.deleteRegistrationInProgress = false
        this.$store.dispatch('general/showSnackbar', {
          message: this.$t('weboffice.DeleteRegistrationError')
        })
      }
      if (res) {
        this.resetState()
        this.resetTravelAssistantState()
        this.$router.push(this.localePath('index'))
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePersonalTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePersonalTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePersonalTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
