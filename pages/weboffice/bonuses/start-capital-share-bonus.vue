<template>
  <main>
    <LoadingLayerWeboffice v-if="capitalShareBonus === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Vitals'),
            link: '/weboffice/vitals/registration-timeline'
          },
          {
            name: $t('weboffice.StartCapitalShareBonus')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.StartCapitalShareBonus') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="h-1 w-full bg-grey-light" />
        <div class="flex flex-row text-2x leading-18 mt-24 mb-12">
          <div class="flex">
            {{ capitalShareBonus.periodIdsAndNames[selectedPeriod] }}
          </div>
          <div class="flex flex-grow justify-end">
            <div v-for="i in 3" :key="i" class="flex text-center items-center">
              <div
                :class="
                  i <= capitalShareBonus.periodMap[selectedPeriod].points
                    ? 'bg-primary'
                    : 'bg-danger'
                "
                class="flex w-32 h-32 bg-primary rounded-full ml-8 items-center justify-center"
              >
                <i
                  :class="
                    i <= capitalShareBonus.periodMap[selectedPeriod].points
                      ? 'fa-check'
                      : 'fa-times'
                  "
                  class="fas text-white text-2x"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <WebofficeCard :title="$t('weboffice.CollectedQualificationPoints')">
          <div class="relative w-full pt-16 pb-32 mt-16">
            <div
              ref="progressBar"
              class="overflow-hidden h-20 flex bg-grey-light rounded-full"
            >
              <div
                :style="
                  'width:' +
                    getWidthPercent(
                      capitalShareBonus.periodMap[selectedPeriod].periodSumQ,
                      capitalShareBonus.nextPointQualificationPoints
                    ) +
                    '%'
                "
                class="flex flex-col justify-center bg-primary rounded-full"
              ></div>
              <div
                class="absolute text-sm leading-14 h-20 left-0 top-0 mt-16 px-10 text-white rounded-full"
              >
                <div class="pt-3">
                  0
                </div>
              </div>
              <div
                ref="depthBonus"
                class="absolute text-sm leading-14 h-20 right-0 top-0 mt-16 px-10 bg-grey-dark text-white rounded-full"
              >
                <div class="pt-3">
                  {{ capitalShareBonus.nextPointQualificationPoints }}
                </div>
              </div>
              <div
                class="arrow"
                :style="
                  'left:' +
                    getWidthPercent(
                      capitalShareBonus.periodMap[selectedPeriod].periodSumQ,
                      capitalShareBonus.nextPointQualificationPoints
                    ) +
                    '%;'
                "
              ></div>
              <div
                ref="tooltip"
                class="absolute top-0 info-box"
                :style="'left:' + tooltipPositionLeft + 'px; top: -16px;'"
              >
                <div
                  class="bg-primary text-white text-xs leading-14 px-10 py-4 rounded-full w-271 text-center"
                >
                  {{ capitalShareBonus.periodMap[selectedPeriod].periodSumQ }}
                  {{ $t('weboffice.CollectedQualificationPoints') }}
                </div>
              </div>
            </div>
          </div>
          <div class="font-bold leading-16 mb-16">
            {{ $t('weboffice.DistributionOfCollectedPoints') }}
          </div>
          <div
            v-for="(line, lineKey) in getTableData"
            :key="lineKey"
            class="flex flex-row items-center border-t border-grey-light py-24 text-sm leading-14"
          >
            <div class="flex flex-initial w-177">{{ line.username }}</div>
            <div class="flex flex-grow">
              <div class="relative w-full">
                <div
                  class="overflow-hidden h-20 flex bg-grey-light rounded-full"
                >
                  <div
                    :style="'width:' + getWidthPercent(line.qps, 60000) + '%'"
                    class="flex flex-col justify-center bg-primary rounded-full"
                  ></div>
                </div>
              </div>
            </div>
            <div class="flex flex-initial w-128">
              <div class="w-full text-right">
                <span class="font-bold">{{ line.qps }}</span
                >/ 60000
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-16">
            <Pagination
              v-if="capitalShareBonus !== false && maxPage > 1"
              :max-pages="maxPage"
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </WebofficeCard>
        <div class="flex flex-row pt-24 border-t border-grey-light">
          <div
            v-for="(period, periodKey) in capitalShareBonus.periodIdsAndNames"
            :key="periodKey"
            class="mr-8"
          >
            <ButtonSmall
              :type="
                parseInt(periodKey) === selectedPeriod ? 'primary' : 'inverted'
              "
              @click="changeSelectedPeriod(parseInt(periodKey))"
            >
              {{ period }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { format } from 'date-fns'
import { formatPoint } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import ButtonSmall from '@/components/micro/ButtonSmall'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import Pagination from '@/components/Pagination'

export default {
  name: 'StartCapitalShareBonusPage',
  middleware: 'auth_needed',
  components: {
    Pagination,
    WebofficeCard,
    ButtonSmall,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  data() {
    return {
      capitalShareBonus: false,
      selectedPeriod: false,
      currentMonth: false,
      tooltipPositionLeft: 0,
      activeItems: {},
      maxPage: 0,
      currentPage: 1,
      limit: 15
    }
  },
  computed: {
    getTableData() {
      return this.capitalShareBonus.periodMap[this.selectedPeriod].lines.slice(
        (this.currentPage - 1) * this.limit,
        (this.currentPage - 1) * this.limit + this.limit
      )
    }
  },
  mounted() {
    this.getDetails()
    this.currentMonth = new Date()
    this.currentMonth = format(this.currentMonth, 'yyyy-MM')
  },
  methods: {
    async getDetails() {
      this.capitalShareBonus = await this.$store.dispatch(
        'user/getStartCapitalShareBonus'
      )
      this.selectedPeriod =
        this.capitalShareBonus.periodId !== undefined
          ? this.capitalShareBonus.periodId
          : false
      this.maxPage = this.capitalShareBonus.periodMap[
        this.selectedPeriod
      ].lines.length

      this.$nextTick(() => {
        this.getTooltipPosition()
      })
    },
    getTooltipPosition() {
      if (this.$refs.progressBar !== undefined) {
        const percent = this.getWidthPercent(
          this.capitalShareBonus.periodMap[this.selectedPeriod].periodSumQ,
          this.capitalShareBonus.nextPointQualificationPoints
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
    navPage(page) {
      this.currentPage = page
    },
    format(date) {
      return format(date, 'yyyy LLLL')
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    getWidthPercent(point, max) {
      const percent = (parseFloat(point) * 100) / parseFloat(max)
      return percent > 100 ? 100 : percent
    },
    changeSelectedPeriod(period) {
      this.selectedPeriod = period
      this.$scrollTo('#__nuxt')
      this.currentPage = 1
      this.maxPage = this.capitalShareBonus.periodMap[
        this.selectedPeriod
      ].lines.length
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeStartCapitalBonusTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeStartCapitalBonusTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeStartCapitalBonusTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
