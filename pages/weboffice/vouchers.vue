<template>
  <main>
    <LoadingLayerWeboffice v-if="vouchers === false" />
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
            name: $t('weboffice.Vouchers')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.Vouchers') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex md:flex-row justify-between">
          <WebofficeCard
            :title="$t('weboffice.PremiumQuantity')"
            class="w-full sm:w-1/2 lg:w-1/3"
          >
            <div class="flex flex-row items-end text-danger">
              <div class="text-lg leading-24">
                {{ statePVoucher }}/{{ allPVoucher }}
              </div>
              <div class="flex text-xs leading-12 ml-4 mb-2">
                {{ $t('weboffice.Available') }}
              </div>
            </div>
          </WebofficeCard>
          <WebofficeCard
            :title="$t('weboffice.QuantityVouchers')"
            class="md:mt-0 mt-24 w-full sm:w-1/2 lg:w-1/3"
          >
            <div class="flex flex-row items-end text-danger">
              <div class="text-lg leading-24">
                {{ stateVoucher }}/{{ allVoucher }}
              </div>
              <div class="flex text-xs leading-12 ml-4 mb-2">
                {{ $t('weboffice.Available') }}
              </div>
            </div>
          </WebofficeCard>
        </div>

        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full mt-16"
            style="min-width: 800px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Voucher') }}
                </th>
                <th class="py-14 px-8 text-left w-128">
                  {{ $t('weboffice.Status') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Giver') }}
                </th>
                <th class="py-14 px-8 text-left w-100">
                  {{ $t('weboffice.DateOfPurchase') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.DonatedTo') }}
                </th>
                <th class="py-14 px-8 text-left w-100">
                  {{ $t('weboffice.DateOfExpiration') }}
                </th>
                <th class="py-14 px-8 text-left w-100">
                  {{ $t('weboffice.Type') }}
                </th>
                <th class="py-14 px-8 text-left w-128"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in vouchers.voucherList.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.voucherName }}
                </td>
                <td
                  :class="
                    row.stateName === 'NEW'
                      ? 'text-primary'
                      : row.stateName === 'GIFTED_ACCEPTED'
                      ? 'text-primary-dark'
                      : 'text-danger'
                  "
                  class="py-13 px-8 border border-grey-light"
                >
                  {{ getVoucherStateName(row.stateName) }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.giver === '' ? '-' : row.giver }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.createDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.donatedTo === '' ? '-' : row.donatedTo }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.expireDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{
                    row.type === 'OLD'
                      ? $t('weboffice.Voucher')
                      : row.type === 'PREMIUM'
                      ? $t('weboffice.ProductPremiumVoucher')
                      : $t('weboffice.ProductVoucher')
                  }}
                </td>
                <td class="py-13 px-8 border border-grey-light text-right">
                  <div
                    v-if="row.isGiftable"
                    :class="row.isExchangeable ? 'mb-4' : ''"
                    class="link cursor-pointer"
                    @click="showGiveVoucher(row)"
                  >
                    {{ $t('weboffice.Gifting') }}
                  </div>
                  <div
                    v-if="row.isExchangeable"
                    :class="row.isAcceptable ? 'mb-4' : ''"
                    class="link cursor-pointer"
                    @click="exchangeVoucher(row)"
                  >
                    {{ $t('weboffice.Exchange') }}
                  </div>
                  <div
                    v-if="row.isAcceptable"
                    class="link cursor-pointer"
                    @click="acceptVoucher(row.voucherId)"
                  >
                    {{ $t('weboffice.VoucherAcceptable') }}
                  </div>
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
    <DecisionModal
      v-if="exchangeVoucherModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.Exchange')"
      :cancel-button="$t('general.Cancel')"
      @close="exchangeVoucherModalActive = false"
      @cancel="exchangeVoucherModalActive = false"
      @accept="showValidateVoucher"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.ExchangeVoucher') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="font-bold">
            {{ $t('weboffice.Voucher') }}: {{ selectedVoucher.voucherName }}
          </div>
          <div class="mt-8 text-danger">
            {{ $t('weboffice.ExchangeVoucherDescription') }}
          </div>
        </div>
      </div>
    </DecisionModal>

    <DecisionModal
      v-if="validateVoucherModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.ExchangeVoucherConfirm')"
      :cancel-button="$t('general.Cancel')"
      @close="validateVoucherModalActive = false"
      @cancel="validateVoucherModalActive = false"
      @accept="validateVoucher"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.ExchangeVoucher') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="font-bold">
            {{ $t('weboffice.Voucher') }}: {{ selectedVoucher.voucherName }}
          </div>
          <div class="mt-8 text-danger">
            {{ $t('weboffice.ExchangeVoucherDescription') }}
          </div>
          <div class="mt-8 text-primary">
            {{ $t('weboffice.ConfirmationCodeSent') }}
          </div>
          <div class="mt-8">
            <InputText
              v-model="confirmationCode"
              :error="confirmationCodeError"
              :placeholder="$t('weboffice.ConfirmationCode')"
            />
          </div>
        </div>
      </div>
    </DecisionModal>

    <DecisionModal
      v-if="giveVoucherModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.GiveVoucherConfirm')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="giveVoucherLoading"
      @close="giveVoucherModalActive = false"
      @cancel="giveVoucherModalActive = false"
      @accept="giveVoucher"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.GiveVoucher') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="font-bold">
            {{ $t('weboffice.Voucher') }}: {{ selectedVoucher.voucherName }}
          </div>
          <div class="mt-8 text-danger">
            {{ $t('weboffice.GiveVoucherDescription1') }}
          </div>
          <div class="mt-4 text-danger">
            {{ $t('weboffice.GiveVoucherDescription2') }}
          </div>
          <div class="mt-8">
            <InputText
              v-model="giveVoucherUserName"
              :label="$t('weboffice.GiveVoucherLabel')"
              :error="giveVoucherUserNameError"
            />
          </div>
          <div
            class="flex flex-col text-sm leading-20 mt-12 mb-12"
            style="margin-left: -7px;"
          >
            <recaptcha />
          </div>
        </div>
      </div>
    </DecisionModal>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Scrollbar from '@/components/Scrollbar'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import Pagination from '@/components/Pagination'
import { getVoucherStateName, getPerPageLimit } from '@/includes/utils'
import DecisionModal from '@/components/modal/DecisionModal'
import InputText from '@/components/micro/InputText'

export default {
  name: 'VouchersPage',
  middleware: 'auth_needed',
  components: {
    InputText,
    DecisionModal,
    Pagination,
    WebofficeCard,
    Scrollbar,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      vouchers: false,
      allPVoucher: 0,
      allVoucher: 0,
      statePVoucher: 0,
      stateVoucher: 0,
      currentPage: 1,
      maxPage: 1,
      exchangeVoucherModalActive: false,
      validateVoucherModalActive: false,
      giveVoucherModalActive: false,
      selectedVoucher: false,
      confirmationCode: '',
      confirmationCodeError: false,
      giveVoucherUserName: '',
      giveVoucherUserNameError: false,
      giveVoucherLoading: false
    }
  },
  computed: {
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.vouchers = false
      this.allPVoucher = 0
      this.allVoucher = 0
      this.statePVoucher = 0
      this.stateVoucher = 0
      this.vouchers = await this.$store.dispatch('user/getVouchers')
      if (
        this.vouchers.voucherList !== undefined &&
        this.vouchers.voucherList.length > 0
      ) {
        this.vouchers.voucherList.forEach((item) => {
          if (item.voucherName.includes('premium')) {
            this.allPVoucher++
          } else {
            this.allVoucher++
          }

          if (
            item.stateName === 'NEW' &&
            item.voucherName.includes('premium')
          ) {
            this.statePVoucher++
          } else if (
            item.stateName === 'NEW' &&
            !item.voucherName.includes('premium')
          ) {
            this.stateVoucher++
          }
        })
        this.maxPage = Math.ceil(this.vouchers.voucherList.length / this.limit)
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    },
    getVoucherStateName(stateName) {
      return getVoucherStateName(stateName)
    },
    async acceptVoucher(voucher) {
      const acceptVoucher = await this.$store.dispatch('user/acceptVoucher', {
        voucherId: voucher
      })
      if (acceptVoucher.status === 'OK') {
        this.$scrollTo('#__nuxt')
        await this.getDetails()
      }
    },
    exchangeVoucher(voucher) {
      this.selectedVoucher = voucher
      this.exchangeVoucherModalActive = true
    },
    async showValidateVoucher() {
      let exchangeVoucher = false
      try {
        exchangeVoucher = await this.$store.dispatch('user/exchangeVoucher', {
          voucherId: this.selectedVoucher.voucherId
        })
      } catch (e) {
        this.$store.dispatch('general/showSnackbar', e)
        return
      }
      if (exchangeVoucher.status === 'OK') {
        this.exchangeVoucherModalActive = false
        this.validateVoucherModalActive = true
      }
    },
    async validateVoucher() {
      if (this.confirmationCode === '') {
        this.confirmationCodeError = this.$t(
          'weboffice.ConfirmationCodeRequired'
        )
        return
      }
      let validateVoucher = false
      try {
        validateVoucher = await this.$store.dispatch('user/validateVoucher', {
          voucherId: this.selectedVoucher.voucherId,
          UUID: this.confirmationCode
        })
      } catch (e) {
        this.$store.dispatch('general/showSnackbar', e)
        return
      }
      if (validateVoucher.status === 'ERROR') {
        this.confirmationCodeError = this.$t(
          'weboffice.ConfirmationCodeInvalid'
        )
      } else {
        this.confirmationCode = ''
        this.validateVoucherModalActive = false
        this.selectedVoucher = false
        this.$scrollTo('#__nuxt')
        await this.getDetails()
      }
    },
    showGiveVoucher(voucher) {
      this.selectedVoucher = voucher
      this.giveVoucherModalActive = true
    },
    async giveVoucher() {
      if (this.giveVoucherUserName === '') {
        this.giveVoucherUserNameError = this.$t('weboffice.UserNameRequired')
        return
      }

      if (!this.giveVoucherLoading) {
        try {
          this.giveVoucherLoading = true

          const captchaToken = await this.$recaptcha.getResponse()

          if (captchaToken !== '') {
            let giveVoucher = false
            try {
              giveVoucher = await this.$store.dispatch('user/giveVoucher', {
                voucherId: this.selectedVoucher.voucherId,
                userName: this.giveVoucherUserName,
                token: captchaToken
              })
            } catch (e) {
              this.$store.dispatch('general/showSnackbar', e)
              return
            }
            if (giveVoucher.status === 'ERROR') {
              this.giveVoucherUserNameError = this.$t(
                'weboffice.UserNameInvalid'
              )
            } else {
              this.giveVoucherUserName = ''
              this.giveVoucherModalActive = false
              this.selectedVoucher = false
              this.$scrollTo('#__nuxt')
              await this.getDetails()
            }
          }
        } catch (e) {
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.CaptchaError')
          })
        }

        this.giveVoucherLoading = false
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeVouchersTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeVouchersTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeVouchersTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
