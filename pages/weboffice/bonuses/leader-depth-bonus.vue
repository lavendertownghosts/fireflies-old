<template>
  <main>
    <LoadingLayerWeboffice v-if="leaderDepthBonus === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Bonuses'),
            link: 'bonuses/leader-depth-bonus'
          },
          {
            name: $t('weboffice.LeaderDepthBonus')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LeaderDepthBonus') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <div
          v-show="selectedYear === parseInt(currentMonth.substr(0, 4))"
          class="flex flex-col"
        >
          <div class="flex flex-row py-14 border-t border-grey-light">
            <div class="flex flex-initial">
              {{ format(new Date(currentMonth)) }}
            </div>
            <div class="flex flex-grow justify-end">
              <div class="text-danger">
                {{
                  leaderDepthBonus.currentMonthInQuarantine
                    ? $t('weboffice.Quarantined')
                    : ''
                }}
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex flex-row mb-16">
              <div class="flex flex-col flex-grow">
                <WebofficeCard
                  :title="$t('weboffice.QualificationPointsFromExtensionLines')"
                >
                  <div class="flex flex-col">
                    <div class="flex justify-center items-center w-full">
                      <div class="relative w-full pt-16 pb-32">
                        <div
                          ref="progressBar"
                          class="overflow-hidden h-20 flex bg-grey-light rounded-full"
                        >
                          <div
                            :style="
                              'width:' +
                                getWidthPercent(
                                  leaderDepthBonus.currentAcquiredPoints,
                                  leaderDepthBonus.currentRequiredPointsMax
                                ) +
                                '%'
                            "
                            class="flex flex-col justify-center bg-primary rounded-full"
                          ></div>
                          <div
                            class="absolute text-sm leading-14 h-20 left-0 top-0 mt-16 px-10 text-white rounded-full"
                          >
                            <div class="pt-3">
                              {{ leaderDepthBonus.currentAcquiredPoints }}
                            </div>
                          </div>
                          <div
                            ref="depthBonus"
                            class="absolute text-sm leading-14 h-20 right-0 top-0 mt-16 px-10 bg-grey-dark text-white rounded-full"
                          >
                            <div class="pt-3">
                              {{ leaderDepthBonus.currentRequiredPointsMax }}
                            </div>
                          </div>
                          <div
                            class="arrow"
                            :style="
                              'left:' +
                                getWidthPercent(
                                  leaderDepthBonus.currentAcquiredPoints,
                                  leaderDepthBonus.currentRequiredPointsMax
                                ) +
                                '%;'
                            "
                          ></div>
                          <div
                            ref="tooltip"
                            class="absolute top-0 info-box"
                            :style="
                              'left:' + tooltipPositionLeft + 'px; top: -16px;'
                            "
                          >
                            <div
                              class="bg-primary text-white text-xs leading-14 px-10 py-4 rounded-full w-177 text-center"
                            >
                              {{ leaderDepthBonus.currentAcquiredPoints }}
                              {{ $t('weboffice.QualificationPoints') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-xs leading-12 text-black font-bold mb-16">
                      {{ $t('general.Details') }}
                    </div>
                    <div
                      v-for="(visibleDetails,
                      visibleDetailsKey) in leaderDepthBonus.details"
                      :key="visibleDetailsKey"
                      class="flex md:flex-row flex-col text-sm border-t border-grey-light w-full"
                    >
                      <div class="flex flex-row items-center py-14 w-177">
                        <div>
                          <img
                            :src="icon[visibleDetails.level]"
                            class="w-42 h-42"
                          />
                        </div>
                        <div class="ml-8">
                          {{ visibleDetails.name }}
                        </div>
                      </div>
                      <div class="flex-grow justify-center items-center">
                        <div class="relative md:pt-24">
                          <div
                            class="overflow-hidden h-20 flex bg-grey-light rounded-full"
                          >
                            <div
                              :style="
                                'width:' +
                                  getWidthPercent(
                                    visibleDetails.points,
                                    leaderDepthBonus.currentRequiredPointsMax
                                  ) +
                                  '%'
                              "
                              class="flex flex-col justify-center bg-primary rounded-full"
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div class="flex text-right items-center md:w-128">
                        <div
                          class="w-full md:text-right text-left md:mt-0 md:mb-0 md:ml-24 mt-10 mb-10"
                        >
                          {{ visibleDetails.points }}
                          {{ $t('weboffice.QualificationPoints') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </WebofficeCard>
              </div>
            </div>
            <div class="flex w-full mb-16">
              <WebofficeCard
                :title="$t('weboffice.LinesEntitlingMeToBonus')"
                class="w-full"
              >
                <div class="flex flex-row">
                  <div
                    v-for="(bonusDetails,
                    bonusDetailsKey) in leaderDepthBonus.currentBonusDetailsListVisible"
                    :key="bonusDetailsKey"
                    class="w-full flex flex-row"
                  >
                    <div class="flex items-center">
                      <img
                        src="~assets/images/leader/emerald-leader.png"
                        class="w-42 h-42"
                      />
                    </div>
                    <div
                      class="flex items-center flex-col ml-8 text-sm leading-20"
                    >
                      <div class="w-full">{{ bonusDetails.name }}</div>
                      <div class="w-full">
                        EUR
                        {{
                          bonusDetails.amount
                            | formatNumber('0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </WebofficeCard>
            </div>
          </div>
        </div>
        <div
          v-for="(history, historyKey) in leaderDepthBonus.visibleHistoryList"
          v-show="selectedYear === parseInt(history.month.substr(0, 4))"
          :key="historyKey"
          class="flex flex-col"
        >
          <div class="flex flex-row py-14 border-t border-grey-light">
            <div
              class="flex flex-initial link cursor-pointer"
              @click="changeActiveItem(history.month)"
            >
              {{ format(new Date(history.month)) }}
            </div>
            <div class="flex flex-grow justify-end">
              <div class="text-danger">
                {{ history.inQuarantine ? $t('weboffice.Quarantined') : '' }}
              </div>
              <div class="ml-8 md:ml-0 md:w-177 text-right">
                EUR
                {{ formatPoint(Math.round(history.price * 100) / 100) }}
              </div>
            </div>
          </div>
          <div
            v-show="activeItems[history.month] === true"
            class="flex flex-col"
          >
            <div class="flex flex-col lg:flex-row mb-16">
              <div class="flex flex-col flex-grow">
                <WebofficeCard
                  :title="$t('weboffice.QualificationPointsFromExtensionLines')"
                >
                  <div class="flex flex-col">
                    <div class="flex justify-center items-center w-full">
                      <div class="relative w-full pt-16 pb-32">
                        <div
                          class="overflow-hidden h-20 flex bg-grey-light rounded-full"
                        >
                          <div
                            :style="
                              'width:' +
                                getWidthPercent(
                                  history.acquiredPoints,
                                  history.requiredPointsMax
                                ) +
                                '%'
                            "
                            class="flex flex-col justify-center bg-primary rounded-full"
                          ></div>
                          <div
                            class="absolute text-sm leading-14 h-20 left-0 top-0 mt-16 px-10 text-white rounded-full"
                          >
                            <div class="pt-3">
                              {{ history.acquiredPoints }}
                            </div>
                          </div>
                          <div
                            class="absolute text-sm leading-14 h-20 right-0 top-0 mt-16 px-10 bg-grey-dark text-white rounded-full"
                          >
                            <div class="pt-3">
                              {{ history.requiredPointsMax }}
                            </div>
                          </div>
                          <div
                            class="absolute top-0 info-box"
                            :style="
                              'left:' +
                                getWidthPercent(
                                  history.acquiredPoints,
                                  history.requiredPointsMax
                                ) +
                                '%; top: -16px; margin-left: -90px;'
                            "
                          >
                            <div
                              class="bg-primary text-white text-sm leading-14 px-10 py-4 rounded-full w-177 text-center"
                            >
                              {{ history.acquiredPoints }}
                              {{ $t('weboffice.QualificationPoints') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-xs leading-12 text-black font-bold">
                      {{ $t('general.Details') }}
                    </div>
                    <div
                      v-for="(visibleDetails,
                      visibleDetailsKey) in history.visibleDetails"
                      :key="visibleDetailsKey"
                      class="flex flex-row text-sm border-t border-grey-light w-full"
                    >
                      <div class="flex flex-row items-center py-14 w-177">
                        <div>
                          <img
                            :src="icon[visibleDetails.level]"
                            class="w-42 h-42"
                          />
                        </div>
                        <div class="ml-8">
                          {{ visibleDetails.name }}
                        </div>
                      </div>
                      <div class="flex-grow justify-center items-center">
                        <div class="relative pt-24">
                          <div
                            class="overflow-hidden h-20 flex bg-grey-light rounded-full"
                          >
                            <div
                              :style="
                                'width:' +
                                  getWidthPercent(
                                    visibleDetails.points,
                                    history.requiredPointsMax
                                  ) +
                                  '%'
                              "
                              class="flex flex-col justify-center bg-primary rounded-full"
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div class="flex text-right items-center w-128">
                        <div class="w-full text-right ml-24">
                          {{ visibleDetails.points }}
                          {{ $t('weboffice.QualificationPoints') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </WebofficeCard>
              </div>
              <div class="flex w-full mt-16 lg:w-240 lg:ml-16 lg:mt-0">
                <WebofficeCard
                  title="Bónusz"
                  class="w-full"
                  :content-style="''"
                >
                  <div class="text-lg leading-24 p-16">
                    EUR
                    {{ formatPoint(Math.round(history.price * 100) / 100) }}
                  </div>
                  <div class="w-full h-1 bg-grey-light"></div>
                  <div class="text-2x leading-18 mt-8 text-grey-light p-16">
                    {{ $t('general.Details') }}
                  </div>
                </WebofficeCard>
              </div>
            </div>
            <div class="flex w-full mb-16">
              <WebofficeCard
                :title="$t('weboffice.LinesEntitlingMeToBonus')"
                class="w-full"
              >
                <div
                  v-if="getHistoryDetails(history.month)"
                  class="flex flex-row"
                >
                  <div
                    v-for="(bonusDetails, bonusDetailsKey) in getHistoryDetails(
                      history.month
                    ).bonusDetails"
                    :key="bonusDetailsKey"
                    class="w-full flex flex-row"
                  >
                    <div class="flex items-center">
                      <img
                        src="~assets/images/leader/emerald-leader.png"
                        class="w-42 h-42"
                      />
                    </div>
                    <div
                      class="flex items-center flex-col ml-8 text-sm leading-20"
                    >
                      <div class="w-full">{{ bonusDetails.name }}</div>
                      <div class="w-full">
                        EUR
                        {{
                          bonusDetails.amount
                            | formatNumber('0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </WebofficeCard>
            </div>
          </div>
        </div>
        <div class="flex flex-row pt-24 border-t border-grey-light">
          <div
            v-for="(year, yearKey) in leaderDepthBonus.years"
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
import { formatPoint, getMonthName } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import ButtonSmall from '@/components/micro/ButtonSmall'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import decIcon from '~/assets/images/leader/dec.png'
import ecIcon from '~/assets/images/leader/ec.png'
import distributorIcon from '~/assets/images/leader/distributor.png'
import platinumIcon from '~/assets/images/leader/platinum-leader.png'
import platinumFounderIcon from '~/assets/images/leader/platinum-founder.png'
import goldIcon from '~/assets/images/leader/gold-leader.png'
import goldFounderIcon from '~/assets/images/leader/gold-founder.png'

export default {
  name: 'LeaderDepthBonusPage',
  middleware: 'auth_needed',
  components: {
    WebofficeCard,
    ButtonSmall,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  data() {
    return {
      leaderDepthBonus: false,
      selectedYear: false,
      currentMonth: false,
      activeItems: {},
      tooltipPositionLeft: 0,
      icon: {
        zero: distributorIcon,
        front3: distributorIcon,
        dec: decIcon,
        ec: ecIcon,
        platinum: platinumIcon,
        founderplatinum: platinumFounderIcon,
        gold: goldIcon,
        foundergold: goldFounderIcon
      }
    }
  },
  mounted() {
    this.getDetails()
    this.currentMonth = new Date()
    this.currentMonth = format(this.currentMonth, 'yyyy-MM')
  },
  methods: {
    async getDetails() {
      this.leaderDepthBonus = await this.$store.dispatch(
        'user/getLeaderDepthBonus'
      )
      this.selectedYear =
        this.leaderDepthBonus.years !== undefined
          ? this.leaderDepthBonus.years[0]
          : false
      if (
        this.leaderDepthBonus.visibleHistoryList !== undefined &&
        this.leaderDepthBonus.visibleHistoryList.length > 0
      ) {
        const dates = []
        this.leaderDepthBonus.visibleHistoryList.forEach((item) => {
          dates.push(item.month)
        })
        this.activeItems = dates.reduce((ac, a) => ({ ...ac, [a]: false }), {})
        this.$nextTick(() => {
          this.getTooltipPosition()
        })
      }
    },
    navPage(page) {
      this.currentPage = page
    },
    format(date) {
      return format(date, 'yyyy ') + getMonthName(format(date, 'M'))
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    getWidthPercent(point, max) {
      const percent = (parseFloat(point) * 100) / parseFloat(max)
      return percent > 100 ? 100 : percent
    },
    getTooltipPosition() {
      if (this.$refs.progressBar !== undefined) {
        const percent = this.getWidthPercent(
          this.leaderDepthBonus.currentAcquiredPoints,
          this.leaderDepthBonus.currentRequiredPointsMax
        )
        const progressBarWidth =
          (this.$refs.progressBar.clientWidth / 100) * percent
        const toolTopWidth = this.$refs.tooltip.clientWidth / 2

        this.tooltipPositionLeft = progressBarWidth - toolTopWidth

        // LEFT / RIGHT LIMIT
        if (this.tooltipPositionLeft < toolTopWidth - 15) {
          this.tooltipPositionLeft = 0
        }

        const rightLimit =
          this.$refs.progressBar.clientWidth - this.$refs.tooltip.clientWidth

        if (this.tooltipPositionLeft > rightLimit) {
          this.tooltipPositionLeft =
            this.$refs.progressBar.clientWidth - this.$refs.tooltip.clientWidth
        }
      } else {
        this.tooltipPositionLeft = 0
      }
    },
    changeActiveItem(month) {
      if (this.activeItems[month]) {
        this.activeItems[month] = false
      } else {
        this.activeItems[month] = true
      }
    },
    changeSelectedYear(year) {
      this.selectedYear = year
      this.$scrollTo('#__nuxt')
    },
    getHistoryDetails(date) {
      return this.leaderDepthBonus.visibleHistoryList.find(
        (history) => history.month === date
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeLeaderBonusTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeLeaderBonusTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeLeaderBonusTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style>
.arrow {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 6px 0 6px;
  position: absolute;
  top: 6px;
  -webkit-transform: translate(-50%, 0%);
  -moz-transform: translate(-50%, 0%);
  -o-transform: translate(-50%, 0%);
  -ms-transform: translate(-50%, 0%);
  transform: translate(-50%, 0%);
  border-color: #00adb5 transparent transparent transparent;
}
</style>
