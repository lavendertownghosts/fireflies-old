<template>
  <main>
    <LoadingLayerWeboffice v-if="currentPoints === false" />
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
            name: $t('weboffice.CurrentPoints')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.CurrentPoints') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning">
          <div
            class="text-sm leading-20"
            v-html="$t('weboffice.CurrentPointsMessageBox')"
          />
        </StatusMessage>
        <WebofficeCard
          :title="$t('weboffice.PaymentPoints')"
          :content-style="''"
          class="mt-24"
        >
          <div class="flex flex-col px-16 pt-20 pb-12 border-b border-grey">
            <div
              class="flex flex-col md:flex-row md:items-end py-8 text-sm leading-14"
            >
              <div class="flex leading-14 mr-4 mb-2">
                {{ $t('weboffice.CurrentBalance') }}:
              </div>
              <div class="flex flex-row items-end">
                <div class="flex text-lg leading-24 text-danger">
                  {{
                    (getTotalPoints - getTotalQuarantinePoints)
                      | formatNumber('0,0.00', {
                        thousandsSeparator: ' ',
                        decimalSeparator: ','
                      })
                  }}
                </div>
                <div class="flex leading-14 ml-4 mb-2 text-danger">
                  {{ $t('weboffice.PaymentPoint') }}
                </div>
              </div>
            </div>
            <div
              class="flex flex-col md:flex-row md:items-end py-8 text-sm leading-14"
            >
              <div class="flex leading-14 mr-4 mb-2">
                {{ $t('weboffice.Quarantined') }}:
              </div>
              <div class="flex flex-row items-end">
                <div class="flex text-lg leading-24">
                  {{
                    getTotalQuarantinePoints
                      | formatNumber('0,0.00', {
                        thousandsSeparator: ' ',
                        decimalSeparator: ','
                      })
                  }}
                </div>
                <div class="flex leading-14 ml-4 mb-2">
                  {{ $t('weboffice.PaymentPoint') }}
                </div>
              </div>
            </div>
            <div
              class="flex flex-col md:flex-row md:items-end py-8 text-sm leading-14"
            >
              <div class="flex leading-14 mr-4 mb-2">
                {{ $t('weboffice.LastCommissionPaid') }}:
              </div>
              <div class="flex text-lg leading-24">
                EUR
                {{
                  currentPoints.underPaymentPointEUR
                    | formatNumber('0,0.00', {
                      thousandsSeparator: ' ',
                      decimalSeparator: ','
                    })
                }}
              </div>
            </div>
          </div>
          <Scrollbar
            :centered="false"
            class="pr-1 mt-20"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 700px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 pl-16 pr-8 text-left">
                    {{ $t('weboffice.PaymentPointType') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.TotalPaymentPoints') + ' (EUR)' }}
                  </th>
                  <th class="py-14 pl-8 pr-16 text-left">
                    {{ $t('weboffice.PaymentPointsInQuarantine') + ' (EUR)' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in getDetailsTableData"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td
                    :class="[
                      rowKey !== getDetailsTableData.length - 1
                        ? 'border-b'
                        : '',
                      row.bonustType !== 'POOL' && row.bonustType !== 'PPLB'
                        ? 'link cursor-pointer'
                        : ''
                    ]"
                    class="py-13 pr-8 pl-16 border-r border-t border-grey-light"
                    @click="
                      row.bonustType !== 'POOL' && row.bonustType !== 'PPLB'
                        ? getShowedPoints(row.bonustType)
                        : false
                    "
                  >
                    {{ getBonusTypeName(row.bonustType) }}
                  </td>
                  <td
                    :class="
                      rowKey !== getDetailsTableData.length - 1
                        ? 'border'
                        : 'border-t border-r border-l'
                    "
                    class="py-13 px-8 border-grey-light"
                  >
                    {{
                      (row.full !== undefined ? row.full : 0)
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                    {{ $t('weboffice.PaymentPoints') }}
                  </td>
                  <td
                    :class="
                      rowKey !== getDetailsTableData.length - 1
                        ? 'border-b'
                        : ''
                    "
                    class="py-13 pl-8 pr-16 border-l border-t border-grey-light"
                  >
                    {{
                      (row.quarantine !== undefined ? row.quarantine : 0)
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                    {{ $t('weboffice.PaymentPoints') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
        </WebofficeCard>
        <WebofficeCard
          :title="$t('weboffice.CollectedQualificationPoints')"
          class="mt-24"
        >
          <div class="flex flex-row items-end text-danger">
            <div class="flex text-lg leading-24">
              {{
                currentPoints.QualificationPoints
                  | formatNumber('0,0.00', {
                    thousandsSeparator: ' ',
                    decimalSeparator: ','
                  })
              }}
            </div>
            <div class="flex leading-14 ml-4 mb-2">
              {{ $t('weboffice.QualificationPoints') }}
            </div>
          </div>
          <div class="text-sm leading-14 py-8">
            <div class="flex flex-col md:flex-row md:items-end">
              <div class="flex leading-14 mr-4 mb-2">
                {{ $t('weboffice.QuarantinedQualificationPoints') }}:
              </div>
              <div class="flex flex-row items-end">
                <div class="flex text-lg leading-24">
                  {{
                    currentPoints.QualificationPointsQuarantined
                      | formatNumber('0,0.00', {
                        thousandsSeparator: ' ',
                        decimalSeparator: ','
                      })
                  }}
                </div>
                <div class="flex leading-14 ml-4 mb-2 font-bold">
                  {{ $t('weboffice.QualificationPoints') }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="text-sm leading-14 py-8 link cursor-pointer"
            @click="getShowedPoints('QUALIFICATIONPOINTS')"
          >
            {{ $t('general.Details') }}
          </div>
        </WebofficeCard>
        <WebofficeCard
          v-if="false"
          :title="$t('weboffice.TravelPoints')"
          class="mt-24"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <Scrollbar
            :centered="false"
            class="pr-1 mt-16"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <div style="min-width: 460px">
              <div
                class="flex flex-row text-sm leading-14 py-8 font-bold h-32 items-center"
              >
                <div class="w-1/3">
                  {{ $t('weboffice.TravelPoints') }}
                </div>
                <div class="w-1/3">{{ $t('weboffice.Position') }}</div>
                <div class="w-1/3">
                  {{ $t('weboffice.EndDateOfPointCollection') }}
                </div>
              </div>
              <div
                class="flex flex-row border border-grey-light text-sm leading-14 py-8"
              >
                <div
                  class="flex w-1/3 px-8 border-r border-grey-light h-40 items-center"
                >
                  <div class="flex flex-col">
                    <div>
                      {{
                        currentPoints.travelpoints
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                      {{ $t('weboffice.TravelPoint') }}
                    </div>
                    <div
                      class="text-sm leading-14 mt-4 link cursor-pointer font-normal"
                      @click="getShowedPoints('TRAVELPOINTS')"
                    >
                      {{ $t('general.Details') }}
                    </div>
                  </div>
                </div>
                <div
                  class="flex w-1/3 px-8 border-r border-grey-light h-40 items-center text-danger"
                >
                  {{
                    currentPoints.travelpoints_rank_in_top_list === -1
                      ? $t('weboffice.YouAreNotPresentInTheTop200')
                      : currentPoints.travelpoints_rank_in_top_list
                  }}
                </div>
                <div
                  class="flex w-1/3 px-8 border-grey h-40 items-center text-danger"
                >
                  {{
                    currentPoints.travelpointsCollectingDateEnd === 'null'
                      ? $t('weboffice.End')
                      : currentPoints.travelpointsCollectingDateEnd.substr(
                          0,
                          10
                        )
                  }}
                </div>
              </div>
            </div>
          </Scrollbar>
        </WebofficeCard>
        <div id="dataTable" class="flex text-lg leading-24 my-24">
          {{
            activeList === 'QUALIFICATIONPOINTS'
              ? $t('weboffice.CollectedQualificationPoints')
              : activeList === 'TRAVELPOINTS'
              ? $t('weboffice.TravelPoint')
              : getBonusTypeName(activeList)
          }}
        </div>
        <LoadingLayerWeboffice v-if="pointDetailsTableData === false" />
        <Scrollbar
          v-else
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            v-if="pointDetailsTableData.details !== undefined"
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 700px"
          >
            <thead class="font-bold">
              <tr v-show="!isLoyaltyCycle">
                <th class="py-14 px-8">
                  {{ $t('weboffice.Date') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Line') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Depth') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Buyer') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Product') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.CommissionRate') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Points') }}
                </th>
                <th class="py-14 px-8"></th>
              </tr>
              <tr v-show="isLoyaltyCycle">
                <th class="py-14 px-8">
                  {{ $t('weboffice.Date') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.PositionName') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.CompletedSmallCycle') }}
                </th>
                <th v-show="activeList === 'LOYALTYCYCLE'" class="py-14 px-8">
                  {{ $t('weboffice.CompletedBigCycle') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Points') }}
                </th>
                <th class="py-14 px-8">
                  {{ $t('weboffice.Quarantine') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(row, rowKey) in pointDetailsTableData.details.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
              >
                <tr
                  v-show="!isLoyaltyCycle"
                  :key="'second-' + rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.date }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      pointDetailsTableData.lineanddepth !== undefined &&
                      pointDetailsTableData.lineanddepth[row.user] !==
                        undefined &&
                      pointDetailsTableData.lineanddepth[row.user].line !==
                        undefined
                        ? pointDetailsTableData.lineanddepth[row.user].line
                        : ''
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      pointDetailsTableData.lineanddepth !== undefined &&
                      pointDetailsTableData.lineanddepth[row.user] !==
                        undefined &&
                      pointDetailsTableData.lineanddepth[row.user] !== undefined
                        ? pointDetailsTableData.lineanddepth[row.user].depth
                        : ''
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.user }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      getProductName(
                        row['product-key'] ? row['product-key'] : row.product
                      )
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      Math.round(getPoints(row.price, row.amount) * 100) / 100
                    }}%
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      row.amount.toFixed(2)
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                  <td
                    class="py-13 px-8 border border-grey-light link cursor-pointer text-right"
                    @click="showDetails(rowKey)"
                  >
                    {{ $t('general.Details') }}
                  </td>
                </tr>
                <tr
                  v-show="activeKey === rowKey && !isLoyaltyCycle"
                  :key="rowKey"
                >
                  <td
                    colspan="8"
                    class="py-13 px-8 bg-grey-light bg-opacity-30"
                  >
                    <div class="py-4">
                      {{ $t('weboffice.Price') }}: EUR
                      {{
                        row.price
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                    </div>
                    <div class="py-4">
                      {{ $t('weboffice.QualificationPoints') }}:
                      {{
                        row.qualification_points
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                    </div>
                    <div v-if="row.quarantine" class="text-danger py-4">
                      {{ $t('weboffice.Quarantined') }}
                    </div>
                  </td>
                </tr>
                <tr
                  v-show="isLoyaltyCycle"
                  :key="'third-' + rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      row.createDate !== undefined
                        ? row.createDate.substr(0, 16)
                        : ''
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.pos_name }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.smallrollOut }}
                  </td>
                  <td
                    v-show="activeList === 'LOYALTYCYCLE'"
                    class="py-13 px-8 border border-grey-light"
                  >
                    {{ row.bigrollOut }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      row.amount
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                  <td
                    class="py-13 px-8 border border-grey-light text-primary-dark"
                  >
                    {{
                      row.quarantineDate !== undefined &&
                      row.quarantineDate.length > 0 &&
                      new Date() > new Date(row.quarantineDate)
                        ? $t('weboffice.NotQuarantined')
                        : $t('weboffice.Quarantine')
                    }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="pointDetailsTableData !== false && maxPage > 1"
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
import {
  bonusTypeSorting,
  getBonusTypeName,
  getPerPageLimit,
  getProductName
} from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import StatusMessage from '@/components/micro/StatusMessage'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '@/components/Pagination'

export default {
  name: 'CurrentPointsPage',
  middleware: 'auth_needed',
  components: {
    Pagination,
    Scrollbar,
    WebofficeCard,
    StatusMessage,
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
      currentPoints: false,
      activeKey: false,
      showTypes: {
        DIRECT: 0,
        DEPTH: 1,
        GENERATION: 7,
        LEADERDEPTH: 10,
        LOYALTYCYCLE: 104,
        LOYALTYCYCLEBPO: 105,
        QUALIFICATIONPOINTS: 101,
        TRAVELPOINTS: 102,
        LOYALTYVIPCYCLEBONUS: 106,
        CISCOMMISSIONS: false
      },
      pointDetailsTableData: [],
      activeList: 'DIRECT',
      currentPage: 1,
      maxPage: 1
    }
  },
  computed: {
    isLoyaltyCycle() {
      if (
        this.activeList === 'LOYALTYVIPCYCLEBONUS' ||
        this.activeList === 'LOYALTYCYCLE'
      ) {
        return true
      }
      return false
    },
    getDetailsTableData() {
      const tableData = []
      if (
        this.currentPoints.points !== undefined &&
        this.currentPoints.points.EUR !== undefined
      ) {
        const points = this.currentPoints.points.EUR
        if (this.currentPoints.loyaltycyclePopEUR !== undefined) {
          points.LOYALTYCYCLE = {
            quarantine: this.currentPoints.loyaltycyclePopQuarantineEUR,
            full: this.currentPoints.loyaltycyclePopEUR
          }
        }
        if (this.currentPoints.loyaltycycleBPOPopEUR !== undefined) {
          points.LOYALTYCYCLEBPO = {
            quarantine: this.currentPoints.loyaltycycleBPOPopQuarantineEUR,
            full: this.currentPoints.loyaltycycleBPOPopEUR
          }
        }
        if (this.currentPoints.loyaltyVIPCyclePopEUR !== undefined) {
          points.LOYALTYVIPCYCLEBONUS = {
            quarantine: this.currentPoints.loyaltyVIPCyclePopqEUR,
            full: this.currentPoints.loyaltyVIPCyclePopEUR
          }
        }
        if (this.currentPoints.cisCommissionsEUR !== undefined) {
          points.CISCOMMISSIONS = {
            quarantine: this.currentPoints.cisCommissionsQuarantineEUR,
            full: this.currentPoints.cisCommissionsEUR
          }
        }
        return bonusTypeSorting(this.currentPoints.points.EUR)
      }
      return tableData
    },
    getTotalPoints() {
      let total = 0
      if (this.currentPoints.points !== undefined) {
        for (const value of Object.values(this.currentPoints.points.EUR)) {
          total += value.full !== undefined ? parseFloat(value.full) : 0
        }
      }
      if (this.currentPoints.loyaltyVIPCyclePopEUR !== undefined) {
        total += parseFloat(this.currentPoints.loyaltyVIPCyclePopEUR)
      }
      if (this.currentPoints.loyaltycycleBPOPopEUR !== undefined) {
        total += parseFloat(this.currentPoints.loyaltycycleBPOPopEUR)
      }
      if (this.currentPoints.loyaltycyclePopEUR !== undefined) {
        total += parseFloat(this.currentPoints.loyaltycyclePopEUR)
      }
      if (this.currentPoints.cisCommissionsEUR !== undefined) {
        total += parseFloat(this.currentPoints.cisCommissionsEUR)
      }
      return total
    },
    getTotalQuarantinePoints() {
      let total = 0
      if (this.currentPoints.points !== undefined) {
        for (const value of Object.values(this.currentPoints.points.EUR)) {
          total +=
            value.quarantine !== undefined ? parseFloat(value.quarantine) : 0
        }
      }

      if (this.currentPoints.loyaltyVIPCyclePopqEUR !== undefined) {
        total += parseFloat(this.currentPoints.loyaltyVIPCyclePopqEUR)
      }
      if (this.currentPoints.loyaltycycleBPOPopQuarantineEUR !== undefined) {
        total += parseFloat(this.currentPoints.loyaltycycleBPOPopQuarantineEUR)
      }
      if (this.currentPoints.loyaltycyclePopQuarantine !== undefined) {
        total += parseFloat(this.currentPoints.loyaltycyclePopQuarantine)
      }
      if (this.currentPoints.cisCommissionsQuarantineEUR !== undefined) {
        total += parseFloat(this.currentPoints.cisCommissionsQuarantineEUR)
      }
      return total
    },
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getBonusTypeName,
    getProductName,
    async getDetails() {
      this.currentPoints = false
      // Ha új típus kerül bele a táblázatba az uilts bonusTypeSorting függvényébe kell hozzá adni
      try {
        this.currentPoints = await this.$store.dispatch(
          'user/getCurrentPoints',
          {
            showType: 0
          }
        )
      } catch (e) {
        console.log(e)
      }
      this.pointDetailsTableData = this.currentPoints
    },
    getPoints(price, amount) {
      return (amount * 100) / price
    },
    showDetails(key) {
      if (this.activeKey === key) {
        this.activeKey = false
      } else {
        this.activeKey = key
      }
    },
    navPage(page) {
      this.currentPage = page
      this.activeKey = false
      this.$scrollTo('#dataTable')
    },
    async getShowedPoints(type) {
      if (type !== false) {
        this.$scrollTo('#dataTable')
        if (this.activeList !== type) {
          this.pointDetailsTableData = false
          this.activeList = type
          try {
            this.pointDetailsTableData = await this.$store.dispatch(
              'user/getCurrentPoints',
              {
                showType: this.showTypes[type]
              }
            )
          } catch (error) {
            console.log(error)
          }
        }
        this.currentPage = 1
        this.activeKey = false
        if (this.pointDetailsTableData.details !== undefined) {
          this.maxPage = Math.ceil(
            this.pointDetailsTableData.details.length / this.limit
          )
        } else {
          this.maxPage = 1
        }
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeCurrentPointsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeCurrentPointsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeCurrentPointsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
