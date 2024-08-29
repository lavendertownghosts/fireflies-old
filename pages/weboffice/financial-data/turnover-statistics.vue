<template>
  <main>
    <LoadingLayerWeboffice v-if="turnoverStatistics === false" />
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
            name: $t('weboffice.Statistics'),
            link: '/weboffice/financial-data/commission-statistics'
          },
          {
            name: $t('weboffice.TurnoverStatistics')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.TurnoverStatistics') }}
      </div>
      <StatusMessage type="warning">
        <div
          class="text-sm leading-20"
          v-html="$t('weboffice.TurnoverStatisticsStatusMessageBox')"
        />
      </StatusMessage>
      <div class="flex flex-col w-full mt-24">
        <div class="border border-grey-light rounded mb-24">
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
              class="flex"
              :wrapper-style-checkin="['sm:pr-8']"
              :wrapper-style-checkout="['sm:pl-8 lg:pr-8']"
              :input-style-checkout="['lg:w-100']"
              :disable-past="false"
              :is-nights="false"
              :enable-same-date="true"
            />
            <InputDropdown
              v-model="selectedLevel"
              :values="getFFCLevels"
              :label="$t('weboffice.LevelFilter')"
              :placeholder="$t('general.PleaseSelect')"
              :is-dark="false"
              :class="'mt-16 lg:mt-0 lg:px-8 w-full'"
            />
            <InputText
              v-model="userFilter"
              :input-style="[]"
              :label="$t('weboffice.Name')"
              :class="'mt-16 lg:mt-0 lg:px-8 w-full'"
              :placeholder="$t('general.Search') + '...'"
            />
            <ButtonSmall
              class="w-full mt-16 mb-4 lg:ml-8 md:w-82"
              type="primary"
              @click="getDetails"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
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
                <th class="py-14 px-8 text-left w-256">
                  {{ $t('weboffice.TypeOfTurnover') }}
                </th>
                <th
                  v-show="sumPercentageUSD > 0 && sumPriceUSD > 0"
                  class="py-14 px-8 text-left"
                >
                  {{ $t('weboffice.TurnoverRate') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.TurnoverRate') + ' (EUR)' }}
                </th>
                <th
                  v-show="sumPercentageUSD > 0 && sumPriceUSD > 0"
                  class="py-14 px-8 text-right"
                >
                  {{ $t('weboffice.AmountOfTurnover') }}
                </th>
                <th class="py-14 px-8 text-right">
                  {{ $t('weboffice.AmountOfTurnover') + ' (EUR)' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, rowKey) in turnoverStatistics.visibleData">
                <tr
                  v-if="(row.percentageUSD != 0) | (row.percentageEUR != 0)"
                  :key="rowKey"
                  class="even:bg-grey-light even:bg-opacity-30"
                >
                  <td
                    class="py-13 px-8 border border-grey-light link cursor-pointer"
                    @click="
                      getStatisticDetails(
                        row.postParameters,
                        row.localizedProductName
                      )
                    "
                    v-html="getLocalizedRowList(row.localizedProductName)"
                  ></td>
                  <td
                    v-show="sumPercentageUSD > 0 && sumPriceUSD > 0"
                    class="py-13 px-8 border border-grey-light"
                  >
                    {{ row.percentageUSD }} %
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.percentageEUR }} % (EUR)
                  </td>
                  <td
                    v-show="sumPercentageUSD > 0 && sumPriceUSD > 0"
                    class="py-13 px-8 border border-grey-light"
                  >
                    USD {{ row.priceUSD }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light text-right">
                    EUR {{ row.priceEUR }}
                  </td>
                </tr>
              </template>
              <tr class="border-t border-black font-bold">
                <td class="py-13 px-8 border border-grey-light">
                  {{ $t('weboffice.Sum') }}
                </td>
                <td
                  v-show="sumPercentageUSD > 0 && sumPriceUSD > 0"
                  class="py-13 px-8 border border-grey-light"
                >
                  {{ sumPercentageUSD }} %
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ sumPercentageEUR }} %
                </td>
                <td
                  v-show="sumPercentageUSD > 0 && sumPriceUSD > 0"
                  class="py-13 px-8 border border-grey-light text-right"
                >
                  USD {{ formatPoint(sumPriceUSD) }}
                </td>
                <td class="py-13 px-8 border border-grey-light text-right">
                  EUR {{ formatPoint(sumPriceEUR) }}
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <Scrollbar
          :centered="false"
          class="pr-1 mt-16"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 700px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.CancellationType') }}
                </th>
                <th v-show="sumPriceUSD > 0" class="py-14 px-8 text-left">
                  {{ $t('weboffice.CancelledAmount') }}
                </th>
                <th class="py-14 px-8 text-right">
                  {{ $t('weboffice.CancelledAmount') + '(EUR)' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in getRefundTableData"
                :key="rowKey"
                class="even:bg-grey-light even:bg-opacity-30"
              >
                <td
                  class="py-13 px-8 border border-grey-light link cursor-pointer"
                  @click="getStatisticDetails(row.postParameters, row.type)"
                >
                  {{ row.type }}
                </td>
                <td
                  v-show="sumPriceUSD > 0"
                  class="py-13 px-8 border border-grey-light text-right text-danger"
                >
                  USD -{{ row.priceUSD }}
                </td>
                <td
                  class="py-13 px-8 border border-grey-light text-right text-danger"
                >
                  EUR -{{ row.priceEUR }}
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div id="turnoverStatisticDetails">
          <div v-show="turnoverStatisticDetailsTitle !== false">
            <div
              class="text-lg leading-24 font-bold my-24"
              v-html="
                turnoverStatisticDetailsTitle +
                  ' ' +
                  dates.date1 +
                  ' - ' +
                  dates.date2
              "
            />
            <LoadingLayerWeboffice v-if="turnoverStatisticDetails === false" />
            <div v-else>
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
                      <th class="py-14 px-8">
                        {{ $t('weboffice.Date') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.Purchaser') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.Depth') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.Line') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.Product') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row,
                      rowKey) in turnoverStatisticDetails.purchases.slice(
                        (currentPage - 1) * limit,
                        (currentPage - 1) * limit + limit
                      )"
                      :key="rowKey"
                      class="even:bg-grey-light even:bg-opacity-30"
                    >
                      <td class="py-13 px-8 border border-grey-light">
                        {{ row.date }}
                      </td>
                      <td class="py-13 px-8 border border-grey-light">
                        {{ row.userName }}
                      </td>
                      <td class="py-13 px-8 border border-grey-light">
                        {{ row.depth }}
                      </td>
                      <td class="py-13 px-8 border border-grey-light">
                        {{ row.frontName }}
                      </td>
                      <td
                        class="py-13 px-8 border border-grey-light"
                        v-html="getLocalizedRow(row.productName)"
                      />
                    </tr>
                  </tbody>
                </table>
              </Scrollbar>
              <div class="flex justify-center mt-24">
                <Pagination
                  v-if="turnoverStatisticDetails.purchases.length > 0"
                  :max-pages="
                    Math.ceil(turnoverStatisticDetails.purchases.length / limit)
                  "
                  :current-page="currentPage"
                  @click="navPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InformativeModal
      v-show="showInformativeModal"
      :accept-button="$t('general.Ok')"
      :link-button="''"
      @accept="showInformativeModal = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('weboffice.TurnoverStatisticInfoModalTitle') }}
        </div>
        <div class="text-sm leading-20 mt-12 mb-24">
          {{ $t('weboffice.TurnoverStatisticInfoModalDesc') }}
        </div>
      </div>
    </InformativeModal>
  </main>
</template>

<script>
import { formatPoint, getUserLevelName, decodeHtml } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import StatusMessage from '@/components/micro/StatusMessage'
import InputDropdown from '@/components/micro/InputDropdown'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputText from '@/components/micro/InputText'
import InputDateRange from '@/components/micro/InputDateRange'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '~/components/Pagination'
import InformativeModal from '@/components/modal/InformativeModal'

export default {
  name: 'TurnoverStatisticsPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    InputDateRange,
    InputText,
    ButtonSmall,
    InputDropdown,
    StatusMessage,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    Pagination,
    InformativeModal
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      turnoverStatistics: false,
      turnoverStatisticDetails: false,
      turnoverStatisticDetailsTitle: false,
      sumPercentageEUR: 0,
      sumPercentageUSD: 0,
      sumPriceEUR: 0,
      sumPriceUSD: 0,
      selectedLevel: '',
      userFilter: '',
      dates: {
        date1: false,
        date2: false
      },
      currentPage: 1,
      limit: 25,
      showInformativeModal: true
    }
  },
  computed: {
    getRefundTableData() {
      return [
        {
          type: this.$t('weboffice.CancellationWithin14Days'),
          priceUSD: this.formatPoint(this.turnoverStatistics.refund14day),
          priceEUR: this.formatPoint(this.turnoverStatistics.refund14day_euro),
          postParameters: {
            productTypeId: -1,
            from: this.dates.date1,
            to: this.dates.date2,
            loyalty_step_product_flowstatistics: true
          }
        },
        {
          type: this.$t('weboffice.CancellationWithin6Months'),
          priceUSD: this.formatPoint(this.turnoverStatistics.refund6month),
          priceEUR: this.formatPoint(this.turnoverStatistics.refund6month_euro),
          postParameters: {
            productTypeId: -2,
            from: this.dates.date1,
            to: this.dates.date2,
            loyalty_step_product_flowstatistics: true
          }
        }
      ]
    },
    getFFCLevels() {
      const levels = []
      if (this.turnoverStatistics.availableFilters !== undefined) {
        this.turnoverStatistics.availableFilters.forEach((item) => {
          levels.push(getUserLevelName(item))
        })
      }
      return levels
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    formatPoint,
    async getDetails() {
      this.$scrollTo('#__nuxt')
      const payload = {
        lang: this.$i18n.locale
      }
      if (this.dates.date1 !== false) {
        payload.fromDate = this.dates.date1
      }
      if (this.dates.date2 !== false) {
        payload.toDate = this.dates.date2
      }
      if (this.selectedLevel !== '') {
        payload.levelFilter = this.selectedLevel
      }
      if (this.userFilter !== '') {
        payload.nameFilter = this.userFilter
      }
      this.turnoverStatistics = false
      this.turnoverStatistics = await this.$store.dispatch(
        'user/getTurnoverStatistics',
        payload
      )
      this.sumPercentageEUR = 0
      this.sumPercentageUSD = 0
      this.sumPriceUSD = 0
      this.sumPriceEUR = 0
      this.turnoverStatistics.visibleData.forEach((item) => {
        this.sumPercentageEUR += parseFloat(
          item.percentageEUR.replace(/\s/g, '').replace(/,/g, '.')
        )
        this.sumPercentageUSD += parseFloat(
          item.percentageUSD.replace(/\s/g, '').replace(/,/g, '.')
        )
        this.sumPriceUSD += parseFloat(
          item.priceUSD.replace(/\s/g, '').replace(/,/g, '.')
        )
        this.sumPriceEUR += parseFloat(
          item.priceEUR.replace(/\s/g, '').replace(/,/g, '.')
        )
      })
      this.sumPercentageEUR = Math.round(this.sumPercentageEUR)
      this.sumPercentageUSD = Math.round(this.sumPercentageUSD)
      this.dates.date1 = this.turnoverStatistics.formattedFrom
      this.dates.date2 = this.turnoverStatistics.formattedTo
    },
    navPage(page) {
      this.$scrollTo('#turnoverStatisticDetails')
      this.currentPage = page
    },
    deleteFilters() {
      this.selectedLevel = ''
      this.userFilter = ''
      this.dates.date1 = this.turnoverStatistics.formattedFrom
      this.dates.date2 = this.turnoverStatistics.formattedTo
      this.getDetails()
    },
    getLocalizedRowList(text) {
      const localize = {
        vip_step_1: this.$t('weboffice.vipStepList'),
        Connex: this.$t('weboffice.ConnexProductTitle')
      }

      return localize[text] !== undefined ? localize[text] : decodeHtml(text)
    },
    getLocalizedRow(text) {
      const localize = {
        vip_step_1: this.$t('weboffice.vipStep1'),
        vip_step_2: this.$t('weboffice.vipStep2'),
        vip_step_3: this.$t('weboffice.vipStep3'),
        vip_step_4: this.$t('weboffice.vipStep4'),
        vip_step_5: this.$t('weboffice.vipStep5'),
        Connex: this.$t('weboffice.ConnexProductTitle')
      }

      let ret = localize[text] !== undefined ? localize[text] : decodeHtml(text)

      if (text.includes(' x')) {
        const txttrimed = text.slice(0, text.indexOf(' x'))
        ret =
          localize[txttrimed] !== undefined
            ? localize[txttrimed]
            : decodeHtml(txttrimed)
        ret += ' ' + text.slice(text.indexOf(' x'), text.length)
      }

      return ret
    },
    async getStatisticDetails(postParameters, productName) {
      this.currentPage = 1
      this.turnoverStatisticDetails = false
      if (productName.includes('vip_step')) {
        this.turnoverStatisticDetailsTitle = this.$t('weboffice.vipStepList')
      } else {
        this.turnoverStatisticDetailsTitle = this.getLocalizedRow(productName)
      }
      this.$scrollTo('#turnoverStatisticDetails')
      postParameters.lang = this.$i18n.locale
      this.turnoverStatisticDetails = await this.$store.dispatch(
        'user/getTurnoverStatisticDetails',
        postParameters
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeTurnoverStatTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeTurnoverStatTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeTurnoverStatTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
