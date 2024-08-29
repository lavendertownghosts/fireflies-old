<template>
  <main>
    <LoadingLayerWeboffice v-if="commissionPayment === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.FinancialData'),
            link: '/weboffice/financial-data/current-points'
          },

          {
            name: $t('weboffice.CommissionPayment')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.back()"
        ></i>
        {{ $t('weboffice.CommissionPayment') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">{{ $t('weboffice.Filter') }}</div>
            <div class="flex link cursor-pointer" @click="deleteFilters">
              {{ $t('weboffice.DeleteFilters') }}
            </div>
          </div>
          <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
            <InputDateRange
              v-model="dates"
              :is-dark="false"
              :label-checkin="$t('general.DateFrom')"
              :label-checkout="$t('general.DateTo')"
              class="flex flex-row w-2/3 lg:w-auto"
              :input-style="['mr-8']"
              :wrapper-style-checkin="['lg:pr-0']"
              :wrapper-style-checkout="['lg:pl-0']"
              :input-style-checkin="['lg:w-100']"
              :input-style-checkout="['lg:w-100']"
              :disable-past="false"
              :is-nights="false"
            />
            <div class="flex flex-col w-full mt-16 sm:flex-row lg:mt-0">
              <InputDropdown
                v-model="selectedTransaction"
                :values="transactionSelectList"
                :label="$t('weboffice.TransactionType')"
                :is-dark="false"
                :class="'w-full'"
              />
              <InputText
                v-model="commissionIdText"
                :input-style="[]"
                :label="$t('weboffice.CommissionId')"
                :class="'mt-16 sm:mt-0 sm:px-8 w-full'"
                :placeholder="$t('general.Search') + '...'"
              />
              <ButtonSmall
                class="w-full mt-16 mb-4 sm:ml-8 sm:w-82"
                type="primary"
                @click="getDetails"
              >
                {{ $t('weboffice.Filter') }}
              </ButtonSmall>
            </div>
          </div>
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 700px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.CommissionId') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.CreateDate') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.TransactionType') }}
                </th>
                <th class="py-14 px-8 text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in getDetailsTableData"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.commisionId }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.payment_date }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ transactionType[row.tranzactionType] }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  <div
                    class="link text-right cursor-pointer"
                    @click="downloadPdf(row.orderid)"
                  >
                    <i class="fal fa-file-alt mr-4"></i
                    >{{ $t('weboffice.Invoice') }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="commissionPayment !== false && maxPage > 1"
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
import { format } from 'date-fns'
import { formatPoint, getPerPageLimit } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import InputDateRange from '@/components/micro/InputDateRange'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import ButtonSmall from '@/components/micro/ButtonSmall'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'CommissionPaymentPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    ButtonSmall,
    InputText,
    InputDropdown,
    InputDateRange,
    Pagination,
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
      commissionPayment: false,
      currentPage: 1,
      maxPage: 1,
      transactionType: {
        travelcard_credit_note: this.$t(
          'weboffice.TransactionTypeTravelCardCreditNote'
        ),
        travelcard_debit_note: this.$t(
          'weboffice.TransactionTypeTravelCardDebitNote'
        ),
        commission_credit_note: this.$t(
          'weboffice.TransactionTypeCommissionCreditNote'
        ),
        commission_debit_note: this.$t(
          'weboffice.TransactionTypeCommissionDebitNote'
        )
      },
      transactionSelectList: [this.$t('general.PleaseSelect')],
      dates: {
        date1: '2014-08-01',
        date2: format(new Date(), 'yyyy-LL-dd')
      },
      selectedTransaction: 0,
      commissionIdText: ''
    }
  },
  computed: {
    getDetailsTableData() {
      return this.commissionPayment.commisionDatas !== undefined
        ? this.commissionPayment.commisionDatas.slice(
            (this.currentPage - 1) * this.limit,
            (this.currentPage - 1) * this.limit + this.limit
          )
        : []
    },
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
    for (const value of Object.values(this.transactionType)) {
      this.transactionSelectList.push(value)
    }
  },
  methods: {
    async getDetails() {
      const payload = { fromDate: this.dates.date1, toDate: this.dates.date2 }
      if (this.selectedTransaction > 0) {
        payload.tranzactionType = Object.keys(this.transactionType)[
          this.selectedTransaction - 1
        ]
      }
      if (this.commissionIdText !== '') {
        payload.commisionId = this.commissionIdText
      }
      this.commissionPayment = false
      this.commissionPayment = await this.$store.dispatch(
        'user/getCommissionPayment',
        payload
      )
      this.maxPage = Math.ceil(
        this.commissionPayment.commisionDatas.length / this.limit
      )
    },
    navPage(page) {
      this.currentPage = page
    },
    format(date) {
      return format(date, 'yyyy.MM.dd HH:mm')
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    deleteFilters() {
      this.selectedTransaction = 0
      this.dates.date1 = '2014-08-01'
      this.dates.date2 = format(new Date(), 'yyyy-LL-dd')
      this.commissionIdText = ''
    },
    downloadPdf(id) {
      window.open(
        this.$api._defaults.prefixUrl +
          'user/invoice-download' +
          '?auth=' +
          this.$store.state.user.token +
          '&id=' +
          id +
          '&lang=' +
          this.$i18n.locale,
        '_blank'
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeCommissionPaymentTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeCommissionPaymentTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeCommissionPaymentTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
