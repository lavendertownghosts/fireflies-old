<template>
  <main>
    <LoadingLayerWeboffice v-if="coupons === false" />
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
            name: $t('weboffice.Coupons')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.Coupons') }}
      </div>
      <div class="flex flex-col w-full">
        <WebofficeCard
          :title="$t('weboffice.QuantityCoupons')"
          class="w-full sm:w-1/2 lg:w-1/3"
        >
          <div class="flex flex-row items-end text-danger">
            <div class="text-lg leading-24">
              {{ coupons.availableCoupons }}/{{ coupons.numberOfCoupons }}
            </div>
            <div class="flex text-xs leading-12 ml-4 mb-2">
              {{ $t('weboffice.Available') }}
            </div>
          </div>
        </WebofficeCard>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 800px"
          >
            <thead class="font-bold">
              <tr>
                <!--                      <th class="py-14 px-8 text-left">-->
                <!--                        {{ $t('weboffice.VoucherId') }}-->
                <!--                      </th>-->
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Id') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Voucher') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Status') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Giver') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.DateOfPurchase') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.DonatedTo') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.DateOfExpiration') }}
                </th>
                <th class="py-14 px-8 text-left w-177"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in coupons.couponList.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <!--                      <td class="py-13 px-8 border border-grey-light">-->
                <!--                        {{ row.voucherName }}-->
                <!--                      </td>-->
                <td class="py-13 px-8 border border-grey-light">
                  {{ personalData.username }}_{{ $t('weboffice.Id') }}_{{
                    row.couponId
                  }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.voucherName }}
                </td>
                <td
                  :class="
                    row.stateName === 'NEW' ? 'text-primary' : 'text-danger'
                  "
                  class="py-13 px-8 border border-grey-light"
                >
                  {{ getVoucherStateName(row.stateName) }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.giver === '' ? '-' : row.giver }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.beginningOfValidity }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.donatedTo === '' ? '-' : row.donatedTo }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.expirationDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light text-right">
                  <div
                    v-if="row.isExchangeable"
                    :class="row.isGiftable ? 'mb-4' : ''"
                    class="link cursor-pointer"
                    @click="showExchangeCouponModal(row)"
                  >
                    {{ $t('weboffice.Exchange') }}
                  </div>
                  <div
                    v-if="row.isGiftable"
                    :class="row.isAcceptable ? 'mb-4' : ''"
                    class="link cursor-pointer"
                    @click="showGiveCoupon(row)"
                  >
                    {{ $t('weboffice.CouponGift') }}
                  </div>
                  <div
                    v-if="row.isAcceptable"
                    class="link cursor-pointer"
                    @click="acceptCoupon(row)"
                  >
                    {{ $t('weboffice.CouponAcceptable') }}
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
      v-if="giveCouponModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.GiveVoucherConfirm')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="giveCouponLoading"
      @close="giveCouponModalActive = false"
      @cancel="giveCouponModalActive = false"
      @accept="giveCoupon"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.Gifting') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="font-bold">
            {{ $t('weboffice.Coupon') }}: {{ personalData.username }}_{{
              $t('weboffice.Id')
            }}_{{ selectedCoupon.couponId }}
          </div>
          <div class="mt-8">
            <InputBPOTransmissionUsersNamesearch
              v-model="giveCouponUserName"
              :is-dark="false"
              :label="''"
              :error="giveCouponUserNameError"
              :placeholder="$t('weboffice.GiveCouponLabel')"
              :input-style="['truncate pr-40']"
              :component-attr-id="'bpo-transmission-user-namesearch'"
            />
          </div>
          <div class="mt-8 text-danger">
            {{ $t('weboffice.GiveCouponDescription1') }}
          </div>
          <div class="mt-4 text-danger">
            {{ $t('weboffice.GiveCouponDescription2') }}
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
    <DecisionModal
      v-if="exchangeCouponModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.Exchange')"
      :cancel-button="$t('general.Cancel')"
      @close="exchangeCouponModalActive = false"
      @cancel="exchangeCouponModalActive = false"
      @accept="exchangeCoupon"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.ExchangeCoupon') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.ExchangeCouponDescription1') }}
          </div>
          <div class="mt-4">
            {{ $t('weboffice.ExchangeCouponDescription2') }}
          </div>
        </div>
        <div
          class="flex flex-col text-sm leading-20 mt-12 mb-12"
          style="margin-left: -7px;"
        >
          <recaptcha />
        </div>
      </div>
    </DecisionModal>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import InputBPOTransmissionUsersNamesearch from '@/components/micro/InputBPOTransmissionUsersNamesearch'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '@/components/Pagination'
import { getVoucherStateName, getPerPageLimit } from '@/includes/utils'
import DecisionModal from '@/components/modal/DecisionModal'

export default {
  name: 'CouponsPage',
  middleware: 'auth_needed',
  components: {
    DecisionModal,
    Pagination,
    Scrollbar,
    WebofficeCard,
    LoadingLayerWeboffice,
    InputBPOTransmissionUsersNamesearch,
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
      coupons: false,
      currentPage: 1,
      maxPage: 1,
      personalData: false,
      selectedCoupon: false,
      giveCouponLoading: false,
      giveCouponModalActive: false,
      giveCouponUserName: {
        id: false,
        text: ''
      },
      giveCouponUserNameError: '',
      exchangeCouponModalActive: false
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
      if (this.personalData === false) {
        this.personalData = await this.$store.dispatch('user/getPersonalData')
      }
      this.coupons = false
      this.coupons = await this.$store.dispatch('user/getCoupons')
      if (
        this.coupons.couponList !== undefined &&
        this.coupons.couponList.length > 0
      ) {
        this.maxPage = Math.ceil(this.coupons.couponList.length / this.limit)
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    },
    getVoucherStateName(stateName) {
      return getVoucherStateName(stateName)
    },
    showGiveCoupon(coupon) {
      this.selectedCoupon = coupon
      this.giveCouponModalActive = true
    },
    async giveCoupon() {
      if (this.giveCouponUserName.text === '') {
        this.giveCouponUserNameError = this.$t('weboffice.UserNameRequired')
        return
      }

      this.giveCouponUserNameError = ''

      if (!this.giveCouponLoading) {
        try {
          this.giveCouponLoading = true
          const captchaToken = await this.$recaptcha.getResponse()

          if (captchaToken !== '') {
            let giveCoupon = false
            try {
              giveCoupon = await this.$store.dispatch('user/giveCoupon', {
                couponId: this.selectedCoupon.couponId,
                userName: this.giveCouponUserName.text,
                token: captchaToken
              })
            } catch (e) {
              this.$store.dispatch('general/showSnackbar', e)
              return
            }
            if (giveCoupon.status === 'ERROR') {
              this.giveCouponUserNameError = this.$t(
                'weboffice.UserNameInvalid'
              )
            } else {
              this.giveCouponUserName = {
                id: false,
                text: ''
              }
              this.giveCouponModalActive = false
              this.selectedCoupon = false
              this.$scrollTo('#__nuxt')
              await this.getDetails()
            }
          }
        } catch (e) {
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.CaptchaError')
          })
        }

        this.giveCouponLoading = false
      }
    },
    async acceptCoupon(coupon) {
      const acceptCoupon = await this.$store.dispatch('user/acceptCoupon', {
        couponId: coupon.couponId,
        userName: this.personalData.username
      })
      if (acceptCoupon.status === 'OK') {
        this.$scrollTo('#__nuxt')
        await this.getDetails()
      }
    },

    showExchangeCouponModal(coupon) {
      this.selectedCoupon = coupon
      this.exchangeCouponModalActive = true
    },

    async exchangeCoupon() {
      try {
        const captchaToken = await this.$recaptcha.getResponse()

        if (captchaToken !== '') {
          const exchangeCoupon = await this.$store.dispatch(
            'user/exchangeCoupon',
            {
              couponId: this.selectedCoupon.couponId,
              token: captchaToken
            }
          )
          if (exchangeCoupon.state === 'ok') {
            this.exchangeCouponModalActive = false
            this.selectedCoupon = false
            this.$scrollTo('#__nuxt')
            await this.getDetails()
          }
        }
      } catch (e) {
        this.$store.dispatch('general/showSnackbar', {
          message: this.$t('weboffice.CaptchaError')
        })
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeCouponsTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeCouponsTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeCouponsTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
