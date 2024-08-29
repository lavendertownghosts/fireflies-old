<template>
  <main>
    <LoadingLayerWeboffice v-if="commissionStatistics === false" />
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
            name: $t('weboffice.CommissionStatistics')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.CommissionStatistics') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning">
          <div
            class="text-sm leading-20"
            v-html="$t('weboffice.CommissionStatisticsStatusMessageBox')"
          />
        </StatusMessage>
        <div class="flex flex-row w-full my-24">
          <div class="w-1/2 pr-8">
            <WebofficeCard
              :title="$t('weboffice.TotalTransferred') + '(USD)'"
              class="w-full"
            >
              <div class="text-lg leading-24 mt-8">
                {{
                  formatPoint(
                    Math.round(commissionStatistics.paidOutSumma * 100) / 100
                  )
                }}
                USD
              </div>
            </WebofficeCard>
          </div>
          <div class="w-1/2 pl-8">
            <WebofficeCard
              :title="$t('weboffice.TotalTransferred') + '(EUR)'"
              class="w-full"
            >
              <div class="text-lg leading-24 mt-8">
                {{
                  formatPoint(
                    Math.round(commissionStatistics.paidOutSummaEUR * 100) / 100
                  )
                }}
                EUR
              </div>
            </WebofficeCard>
          </div>
        </div>
        <div class="flex flex-row">
          <div
            v-show="commissionStatistics.datas[selectedYear] === undefined"
            class="text-center"
          >
            <h3>{{ $t('weboffice.VipCycleViewEmpty') }}</h3>
          </div>
          <div
            v-show="commissionStatistics.datas[selectedYear] !== undefined"
            :class="isSmallWidth ? 'hidden' : ''"
            class="flex flex-col w-256"
          >
            <div
              class="py-8 border-b border-grey-light text-grey-dark text-sm leading-14"
            >
              {{ $t('weboffice.BonusType') }}
            </div>
            <div
              v-for="(bonusType, key) in bonusTypeSelect"
              v-show="
                bonusType.years === undefined ||
                  bonusType.years.includes(parseInt(selectedYear))
              "
              :key="key"
              :class="
                bonusType.extraClass !== undefined ? bonusType.extraClass : ''
              "
              class="py-8 border-b border-grey-light"
            >
              {{
                bonusType.name !== undefined
                  ? getBonusTypeName(bonusType.name)
                  : ''
              }}
            </div>
          </div>
          <div class="flex flex-col w-auto" style="max-width: 100%">
            <Scrollbar
              :key="'scrollbar-' + selectedYear"
              :centered="false"
              :style="
                'max-width: ' +
                  (scrollbarMaxWidth - (!isSmallWidth ? 255 : 0)) +
                  'px'
              "
              class="pr-1"
            >
              <div :style="'min-width:' + getScrollbarContentMinWidth + 'px'">
                <div class="flex flex-row-reverse border-b border-grey-light">
                  <template
                    v-for="(monthOfYear, monthKey) in commissionStatistics
                      .datas[selectedYear]"
                  >
                    <div
                      v-show="activeDetails !== selectedYear + monthKey"
                      :key="'month-' + monthKey"
                      :class="
                        showTwoCurrencyData(monthKey)
                          ? 'column-width-2x'
                          : 'column-width'
                      "
                      class="px-8 flex-shrink-0 text-primary text-sm leading-14 cursor-pointer py-8"
                      @click="activeDetails = selectedYear + monthKey"
                    >
                      {{ selectedYear }}. {{ getMonthName(monthKey) }}
                    </div>
                    <div
                      v-if="
                        commissionStatistics.datas[selectedYear][monthKey]
                          .details1EUR.day !==
                          commissionStatistics.datas[selectedYear][monthKey]
                            .details2EUR.day
                      "
                      v-show="activeDetails === selectedYear + monthKey"
                      :key="'month-' + monthKey + '-details1'"
                      :class="
                        showTwoCurrencyData(monthKey)
                          ? 'column-width-2x'
                          : 'column-width'
                      "
                      class="flex-shrink-0 text-primary text-sm leading-14 cursor-pointer bg-grey-light bg-opacity-30"
                      @click="activeDetails = false"
                    >
                      <div class="p-8">
                        {{ selectedYear }}. {{ getMonthName(monthKey) }}
                        {{
                          commissionStatistics.datas[selectedYear][monthKey]
                            .details2EUR.day
                        }}.
                      </div>
                    </div>
                    <div
                      v-show="activeDetails === selectedYear + monthKey"
                      :key="'month-' + monthKey + '-details2'"
                      :class="
                        showTwoCurrencyData(monthKey)
                          ? 'column-width-2x'
                          : 'column-width'
                      "
                      class="flex-shrink-0 text-primary text-sm leading-14 cursor-pointer bg-grey-light bg-opacity-30"
                      @click="activeDetails = false"
                    >
                      <div class="p-8">
                        {{ selectedYear }}. {{ getMonthName(monthKey) }}
                        {{
                          commissionStatistics.datas[selectedYear][monthKey]
                            .details1EUR.day
                        }}.
                      </div>
                    </div>
                    <div
                      v-if="
                        isSmallWidth &&
                          monthKey ===
                            Object.keys(
                              commissionStatistics.datas[selectedYear]
                            )[
                              Object.keys(
                                commissionStatistics.datas[selectedYear]
                              ).length - 1
                            ]
                      "
                      :key="'bonus-type-' + monthKey"
                      class="flex-shrink-0 text-primary text-sm leading-14 cursor-pointer w-256"
                    >
                      <div class="p-8">
                        {{ $t('weboffice.BonusType') }}
                      </div>
                    </div>
                  </template>
                </div>
                <div
                  v-for="(bonusType, key) in bonusTypeSelect"
                  v-show="
                    bonusType.years === undefined ||
                      bonusType.years.includes(parseInt(selectedYear))
                  "
                  :key="key"
                  :class="
                    bonusType.extraClass !== undefined
                      ? bonusType.extraClass
                      : ''
                  "
                  class="flex flex-row-reverse border-b border-grey-light"
                >
                  <template
                    v-for="(monthOfYear, monthKey) in commissionStatistics
                      .datas[selectedYear]"
                  >
                    <div
                      v-show="activeDetails !== selectedYear + monthKey"
                      :key="'month-' + monthKey"
                      :class="
                        showTwoCurrencyData(monthKey)
                          ? 'column-width-2x'
                          : 'column-width'
                      "
                      class="flex-shrink-0"
                    >
                      <div
                        v-show="
                          bonusType.key !== undefined &&
                            !showTwoCurrencyData(monthKey)
                        "
                        class="p-8"
                      >
                        {{ getCurrency }}
                        {{
                          getPoint(monthOfYear, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                      <div
                        v-show="
                          bonusType.key !== undefined &&
                            showTwoCurrencyData(monthKey)
                        "
                        class="p-8"
                      >
                        EUR
                        {{
                          getPoint(
                            monthOfYear.details1EUR,
                            bonusType,
                            monthOfYear.details2EUR
                          )
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}

                        / USD
                        {{
                          getPoint(
                            monthOfYear.details1USD,
                            bonusType,
                            monthOfYear.details2USD
                          )
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        commissionStatistics.datas[selectedYear][monthKey]
                          .details1EUR.day !==
                          commissionStatistics.datas[selectedYear][monthKey]
                            .details2EUR.day
                      "
                      v-show="activeDetails === selectedYear + monthKey"
                      :key="'month-' + monthKey + '-details2'"
                      :class="
                        showTwoCurrencyData(monthKey)
                          ? 'column-width-2x'
                          : 'column-width'
                      "
                      class="flex-shrink-0 bg-grey-light bg-opacity-30"
                    >
                      <div
                        v-show="
                          bonusType.key !== undefined &&
                            !showTwoCurrencyData(monthKey)
                        "
                        class="p-8"
                      >
                        {{ getCurrency }}
                        {{
                          getPoint(monthOfYear.details2EUR, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                      <div
                        v-show="
                          bonusType.key !== undefined &&
                            showTwoCurrencyData(monthKey)
                        "
                        class="p-8"
                      >
                        USD
                        {{
                          getPoint(monthOfYear.details2USD, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                        / EUR
                        {{
                          getPoint(monthOfYear.details2EUR, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </div>
                    <div
                      v-show="activeDetails === selectedYear + monthKey"
                      :key="'month-' + monthKey + '-details1'"
                      :class="
                        showTwoCurrencyData(monthKey)
                          ? 'column-width-2x'
                          : 'column-width'
                      "
                      class="flex-shrink-0 bg-grey-light bg-opacity-30"
                    >
                      <div
                        v-show="
                          bonusType.key !== undefined &&
                            !showTwoCurrencyData(monthKey)
                        "
                        class="p-8"
                      >
                        {{ getCurrency }}
                        {{
                          getPoint(monthOfYear.details1EUR, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                      <div
                        v-show="
                          bonusType.key !== undefined &&
                            showTwoCurrencyData(monthKey)
                        "
                        class="p-8"
                      >
                        USD
                        {{
                          getPoint(monthOfYear.details1USD, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                        / EUR
                        {{
                          getPoint(monthOfYear.details1EUR, bonusType)
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        isSmallWidth &&
                          monthKey ===
                            Object.keys(
                              commissionStatistics.datas[selectedYear]
                            )[
                              Object.keys(
                                commissionStatistics.datas[selectedYear]
                              ).length - 1
                            ]
                      "
                      :key="'bonus-type-' + monthKey"
                      class="flex-shrink-0 text-left text-sm leading-14 w-256"
                    >
                      <div class="p-8">
                        {{
                          bonusType.name !== undefined
                            ? getBonusTypeName(bonusType.name)
                            : ''
                        }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </Scrollbar>
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
              @click="changeSelectedYear(year)"
            >
              {{ year }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { format } from 'date-fns'
import { formatPoint, getMonthName, getBonusTypeName } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import ButtonSmall from '@/components/micro/ButtonSmall'
import StatusMessage from '@/components/micro/StatusMessage'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'CommissionStatisticsPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    WebofficeCard,
    StatusMessage,
    ButtonSmall,
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
      commissionStatistics: false,
      innerWidth: 0,
      selectedYear: false,
      currentMonth: false,
      activeItems: {},
      yearSelect: [],
      activeDetails: false,
      bonusTypeSelect: [
        {
          key: 'direct',
          name: 'DIRECT'
        },
        {
          key: 'direct_fligth',
          name: 'DIRECTFLIGHT'
        },
        {
          key: 'depth',
          name: 'DEPTH'
        },
        {
          key: 'matrix',
          name: 'MATRIX',
          years: [2017, 2016, 2015, 2014]
        },
        {
          key: 'matching',
          name: 'MATCHING',
          years: [2016, 2015, 2014]
        },
        {
          key: 'generation',
          name: 'GENERATION'
        },
        {
          key: 'migration',
          name: 'MIGRATION',
          years: [2016, 2015, 2014]
        },
        {
          key: 'extradepth',
          name: 'EXTRADEPTH',
          years: [2017, 2016, 2015, 2014]
        },
        {
          key: 'leaderdepth',
          name: 'LEADERDEPTH'
        },
        {
          key: 'loyaltyPaid',
          name: 'LOYALTYCYCLE'
        },
        {
          key: 'loyaltyVIPPaid',
          name: 'LOYALTYVIPCYCLEBONUS'
        },
        {
          key: 'capitalPaid',
          name: 'CAPITALPAID'
        },
        {
          key: 'bpo',
          name: 'BPO'
        },
        {
          key: 'pplb',
          name: 'PPLB'
        },
        {
          key: 'pool',
          name: 'POOL',
          extraClass: 'border-grey-dark'
        },
        {
          key: 'sum',
          name: this.$t('weboffice.GeneratedCommission'),
          extraClass: 'text-base font-bold leading-16'
        },
        { extraClass: 'bg-grey-light py-16' },
        {
          key: 'payed_out_amount',
          div: 'sum',
          name: this.$t('weboffice.OtherCorrectionItems'),
          extraClass: 'border-grey-dark'
        },
        {
          key: 'payed_out_amount',
          name: this.$t('weboffice.TransferredAmount'),
          extraClass: 'text-base font-bold leading-16'
        }
      ]
    }
  },
  computed: {
    getScrollbarContentMinWidth() {
      if (
        this.commissionStatistics.datas !== undefined &&
        this.commissionStatistics.datas[this.selectedYear] !== undefined
      ) {
        if (parseInt(this.selectedYear) === 2019) {
          return (
            (Object.keys(this.commissionStatistics.datas[this.selectedYear])
              .length -
              2) *
              177 +
            2 * 250 +
            (this.activeDetails !== false
              ? parseInt(this.activeDetails) === 20191 ||
                parseInt(this.activeDetails) === 20192
                ? 250
                : 177
              : 0) +
            (this.isSmallWidth ? 256 : 0)
          )
        } else {
          if (
            this.commissionStatistics.datas[this.selectedYear][
              Object.keys(this.commissionStatistics.datas[this.selectedYear])[
                Object.keys(this.commissionStatistics.datas[this.selectedYear])
                  .length - 1
              ]
            ].details1EUR.day ===
            this.commissionStatistics.datas[this.selectedYear][
              Object.keys(this.commissionStatistics.datas[this.selectedYear])[
                Object.keys(this.commissionStatistics.datas[this.selectedYear])
                  .length - 1
              ]
            ].details2EUR.day
          ) {
            return (
              Object.keys(this.commissionStatistics.datas[this.selectedYear])
                .length *
                177 +
              (this.isSmallWidth ? 256 : 0)
            )
          }
          return (
            Object.keys(this.commissionStatistics.datas[this.selectedYear])
              .length *
              177 +
            (this.activeDetails !== false ? 177 : 0) +
            (this.isSmallWidth ? 256 : 0)
          )
        }
      } else {
        return 0
      }
    },
    getCurrency() {
      if (parseInt(this.selectedYear) < 2019) {
        return 'USD'
      } else {
        return 'EUR'
      }
    },
    isSmallWidth() {
      return this.innerWidth < 1024
    }
  },
  mounted() {
    this.getDetails()
    this.currentMonth = new Date()
    this.currentMonth = format(this.currentMonth, 'yyyy-MM')
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  methods: {
    formatPoint,
    getMonthName,
    getBonusTypeName,
    async getDetails() {
      this.commissionStatistics = await this.$store.dispatch(
        'user/getCommissionStatistics'
      )
      if (this.commissionStatistics.datas !== undefined) {
        Object.keys(this.commissionStatistics.datas).forEach((key) => {
          if (!this.yearSelect.includes(key.slice(-4))) {
            this.yearSelect.push(key.slice(-4))
          }
        })
      }
      this.yearSelect.sort(function(a, b) {
        return b - a
      })

      if (this.yearSelect[0] !== undefined) {
        this.selectedYear = this.yearSelect[0]
      } else {
        this.selectedYear = Object.keys(this.commissionStatistics.datas)[0]
      }
    },
    navPage(page) {
      this.currentPage = page
    },
    changeSelectedYear(year) {
      this.activeDetails = false
      this.selectedYear = year
    },
    showTwoCurrencyData(month) {
      return (
        parseInt(this.selectedYear) === 2019 &&
        (parseInt(month) === 1 || parseInt(month) === 2)
      )
    },
    getPoint(pointInMonthOfYear, bonusType, pointInMonthOfYear2 = false) {
      let point = 0
      if (bonusType.key !== undefined) {
        if (this.selectedYear !== false && this.selectedYear < 2019) {
          point =
            pointInMonthOfYear[bonusType.key] !== undefined
              ? bonusType.div !== undefined
                ? pointInMonthOfYear[bonusType.key] -
                  pointInMonthOfYear[bonusType.div]
                : pointInMonthOfYear[bonusType.key]
              : 0
          if (pointInMonthOfYear2 !== false) {
            point +=
              pointInMonthOfYear2[bonusType.key] !== undefined
                ? bonusType.div !== undefined
                  ? pointInMonthOfYear2[bonusType.key] -
                    pointInMonthOfYear2[bonusType.div]
                  : pointInMonthOfYear2[bonusType.key]
                : 0
          }
        } else {
          point =
            pointInMonthOfYear[bonusType.key] !== undefined
              ? bonusType.div !== undefined
                ? pointInMonthOfYear[bonusType.key] -
                  pointInMonthOfYear[bonusType.div]
                : pointInMonthOfYear[bonusType.key]
              : 0
          point +=
            pointInMonthOfYear2[bonusType.key] !== undefined
              ? bonusType.div !== undefined
                ? pointInMonthOfYear2[bonusType.key] -
                  pointInMonthOfYear2[bonusType.div]
                : pointInMonthOfYear2[bonusType.key]
              : 0
        }
      }
      return point
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeCommissionStatisticsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeCommissionStatisticsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeCommissionStatisticsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.column-width {
  width: 177px;
}
.column-width-2x {
  width: 250px;
}
</style>
