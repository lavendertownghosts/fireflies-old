<template>
  <main>
    <LoadingLayerWeboffice v-if="travelCard === false" />
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
            name: $t('weboffice.TravelCard')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.TravelCard') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-col lg:flex-row">
          <div
            class="w-full flex flex-col items-center justify-center rounded travel-card-bg bg-cover bg-center"
            :style="{ backgroundImage: `url(${travelCardBg})` }"
          >
            <div class="flex text-danger text-lg leading-24">
              EUR
              {{
                travelCard.credit
                  | formatNumber('0,0.00', {
                    thousandsSeparator: ' ',
                    decimalSeparator: ','
                  })
              }}
            </div>
          </div>
          <div class="flex flex-grow">
            <div
              class="border border-grey-light rounded w-full mt-16 lg:mt-0 lg:ml-16"
              style="height: fit-content;"
            >
              <div
                class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
              >
                <div class="flex flex-grow">
                  {{ $t('weboffice.Filter') }}
                </div>
                <div class="flex link cursor-pointer" @click="deleteFilters">
                  {{ $t('weboffice.DeleteFilters') }}
                </div>
              </div>
              <div class="flex flex-col sm:flex-row pt-16 pb-12 px-16">
                <InputDateRange
                  v-model="dates"
                  :is-dark="false"
                  :label-checkin="$t('general.DateFrom')"
                  :label-checkout="$t('general.DateTo')"
                  class="flex flex-row w-256"
                  :input-style="['mr-8']"
                  :wrapper-style-checkin="['sm:pr-8']"
                  :wrapper-style-checkout="['sm:px-8']"
                  :disable-past="false"
                  :is-nights="false"
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
        </div>
        <div class="flex items-center text-2x leading-18 font-bold mb-24 mt-16">
          {{ $t('weboffice.TravelBalanceTraffic') }}
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            id="dataTable"
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 700px"
          >
            <thead class="font-bold">
              <tr>
                <th
                  class="py-14 px-8 text-left cursor-pointer w-240"
                  @click="changeOrder('create_date')"
                >
                  {{ $t('weboffice.TransactionDate') }}
                  <i
                    v-show="order === 'create_date'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer w-128"
                  @click="changeOrder('id')"
                >
                  {{ $t('weboffice.Id') }}
                  <i
                    v-show="order === 'id'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th
                  class="py-14 px-8 text-left w-256 cursor-pointer w-240"
                  @click="changeOrder('localizedReason')"
                >
                  {{ $t('weboffice.TransactionType') }}
                  <i
                    v-show="order === 'localizedReason'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer w-177"
                  @click="changeOrder('amount')"
                >
                  {{ $t('weboffice.TransactionPrice') }}
                  <i
                    v-show="order === 'amount'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th class="w-128"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in limitBy(
                  getDataArray,
                  limit,
                  (currentPage - 1) * limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.create_date }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.id }}
                </td>
                <td
                  class="py-13 px-8 border border-grey-light"
                  v-html="row.localizedReason"
                ></td>
                <td
                  :class="row.amount < 0 ? 'text-danger' : 'text-primary'"
                  class="py-13 px-8 border border-grey-light"
                >
                  {{ row.currency }}
                  {{
                    row.amount
                      | formatNumber('0,0.00', {
                        thousandsSeparator: ' ',
                        decimalSeparator: ','
                      })
                  }}
                </td>
                <td
                  class="py-13 px-8 border border-grey-light text-right link cursor-pointer"
                  @click="downloadPdf(row.note_id)"
                >
                  {{ types[row.type] }}
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="travelCard !== false && maxPage > 1"
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
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import travelCardBg from '~/assets/images/travel-card-web-office.png'
import InputDateRange from '@/components/micro/InputDateRange'
import ButtonSmall from '@/components/micro/ButtonSmall'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '@/components/Pagination'
import { limitBy, orderBy, getPerPageLimit } from '@/includes/utils'

export default {
  name: 'TravelCardPage',
  middleware: 'auth_needed',
  components: {
    Pagination,
    Scrollbar,
    ButtonSmall,
    InputDateRange,
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
      travelCard: false,
      travelCardList: false,
      travelCardBg,
      dates: {
        date1: '2014-07-22',
        date2: format(new Date(), 'yyyy-LL-dd')
      },
      currentPage: 1,
      maxPage: 1,
      types: {
        travelcard_credit_note: this.$t(
          'weboffice.TransactionTypeTravelCardCreditNote'
        ),
        travelcard_debit_note: this.$t(
          'weboffice.TransactionTypeTravelCardDebitNote'
        )
      },
      order: 'create_date',
      orderDirection: -1
    }
  },
  computed: {
    getDataArray() {
      return this.orderBy(
        this.travelCard.datas,
        this.order,
        this.orderDirection
      )
    },
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    limitBy,
    orderBy,
    async getDetails() {
      this.travelCard = false
      this.travelCard = await this.$store.dispatch('user/getTravelCard', {
        fromDate: this.dates.date1,
        toDate: this.dates.date2,
        lang: this.$i18n.locale
      })
      this.maxPage = Math.ceil(this.travelCard.datas.length / this.limit)
    },
    deleteFilters() {
      this.dates.date1 = '2014-07-22'
      this.dates.date2 = format(new Date(), 'yyyy-LL-dd')
      this.getDetails()
    },
    downloadPdf(noteId) {
      window.open(
        this.$api._defaults.prefixUrl +
          'user/invoice-download' +
          '?auth=' +
          this.$store.state.user.token +
          '&id=' +
          noteId +
          '&lang=' +
          this.$i18n.locale,
        '_blank'
      )
    },
    navPage(page) {
      this.$scrollTo('#dataTable')
      this.currentPage = page
    },
    changeOrder(type) {
      if (type === this.order) {
        this.orderDirection *= -1
      } else {
        this.order = type
        this.orderDirection = 1
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeTrevalCardTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeTrevalCardTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeTrevalCardTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.travel-card-bg {
  width: 286px;
  height: 165px;
}

@media (max-width: 772px) {
  .travel-card-bg {
    width: 100%;
    height: 280px;
  }
}
</style>
