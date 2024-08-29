<template>
  <main>
    <LoadingLayerWeboffice v-show="leaderDistribution === false" />
    <div v-show="leaderDistribution !== false" class="text-black">
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
            name: $t('weboffice.LeaderTurnoverDistribution')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LeaderTurnoverDistribution') }}
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
          <div class="flex flex-col">
            <div class="flex flex-col px-16 pt-16">
              <InputToggle
                v-model="customDateFilter"
                :label="$t('weboffice.CustomDateFilter')"
              />
              <div class="flex flex-col lg:flex-row mt-16">
                <InputDropdown
                  v-if="!customDateFilter"
                  v-model="selectedInterval"
                  :values="dateSelectInterval"
                  :label="$t('weboffice.Period')"
                  :is-dark="false"
                  :class="'w-full lg:mr-0 lg:w-240'"
                />
                <div class="flex flex-col w-full sm:flex-row">
                  <InputDropdown
                    v-if="customDateFilter"
                    v-model="dateFrom"
                    :values="dateSelectInterval"
                    :label="$t('general.DateFrom')"
                    :is-dark="false"
                    :error="dateFromError"
                    :class="'w-full sm:mb-3 sm:mr-8 lg:w-240'"
                  />
                  <InputDropdown
                    v-if="customDateFilter"
                    v-model="dateTo"
                    :values="dateSelectInterval"
                    :label="$t('general.DateTo')"
                    :is-dark="false"
                    :error="dateToError"
                    :class="'w-full mt-8 sm:mt-0 sm:mb-3 sm:ml-8 lg:w-240'"
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
              <div class="flex flex-col md:flex-row lg:w-7/12">
                <InputDropdown
                  v-model="selectedUserLevel"
                  :values="getFFCLevels"
                  :label="$t('weboffice.CareerLevel')"
                  :is-dark="false"
                  :class="'md:pr-8 w-full'"
                />
                <InputDropdown
                  v-model="selectedFront"
                  :values="getFronts"
                  :label="$t('weboffice.Front')"
                  :is-dark="false"
                  :class="'mt-8 md:mt-0 md:pl-8 lg:pr-8 w-full'"
                />
              </div>
              <div class="flex flex-col lg:flex-row lg:w-5/12">
                <ButtonSmall
                  class="w-full mt-16 lg:ml-8 md:w-82"
                  type="primary"
                  @click="getDetails"
                >
                  {{ $t('weboffice.Filter') }}
                </ButtonSmall>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-2/3 xl:w-1/3 mt-16">
          <WebofficeCard
            :title="$t('weboffice.Period') + ': ' + activePeriod"
            content-style=""
          >
            <div class="flex">
              <div class="flex flex-col">
                <div class="flex flex-col py-20 px-16">
                  <div class="text-sm leading-14">
                    {{ $t('weboffice.LeaderPackageTurnover') }}
                  </div>
                  <div class="text-lg leading-24 mt-8">
                    {{
                      formatPoint(
                        parseInt(leaderDistribution.leaderPackageTurnover)
                      )
                    }}
                    <span class="lowercase">{{
                      $t('weboffice.QualificationPoints')
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </WebofficeCard>
        </div>
        <div
          class="flex flex-col py-20 px-16 text-sm leading-14 mt-16 bg-grey-light rounded"
        >
          <div class="flex flex-row">
            <div class="">{{ $t('weboffice.Sponsore') }}:</div>
            <div class="link ml-4">
              {{ leaderDistribution.sponsoreName }}
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-24">
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
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CareerLevel') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Depth') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.QualificationPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.ExtraQualificationPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.LineTurnoverRate') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in getDetailsTableData"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.username }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <span class="text-primary">{{
                      getUserLevelName(row.level)
                    }}</span>
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.depth }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.qualifications }} pont
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.extraPoints }} pont
                  </td>
                  <td
                    :class="
                      parseFloat(row.distribution) > 50
                        ? 'text-danger'
                        : 'text-primary'
                    "
                    class="py-13 px-8 border border-grey-light text-right"
                  >
                    {{ row.distribution }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>

          <div class="flex justify-center mt-24">
            <Pagination
              v-if="leaderDistribution !== false && maxPage > 1"
              :max-pages="maxPage"
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { format, eachMonthOfInterval, lastDayOfMonth } from 'date-fns'
import {
  formatPoint,
  getMonthName,
  getUserLevelName,
  getPerPageLimit
} from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import ButtonSmall from '@/components/micro/ButtonSmall'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import InputDropdown from '@/components/micro/InputDropdown'
import Scrollbar from '@/components/Scrollbar'
import InputToggle from '@/components/micro/InputToggle'

export default {
  name: 'LeaderDistributionPage',
  middleware: 'auth_needed',
  components: {
    InputToggle,
    Scrollbar,
    InputDropdown,
    WebofficeCard,
    ButtonSmall,
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
      leaderDistribution: false,
      currentPage: 1,
      maxPage: 1,
      dateSelectInterval: [],
      datesInterval: [],
      selectedInterval: 0,
      selectedUserLevel: 0,
      selectedFront: 0,
      activeDate: new Date(),
      customDateFilter: false,
      dateFrom: 0,
      dateTo: 0,
      dateFromError: '',
      dateToError: ''
    }
  },
  computed: {
    getDetailsTableData() {
      if (this.leaderDistribution.usersQualifications !== undefined) {
        const tableData = this.leaderDistribution.usersQualifications.slice(
          (this.currentPage - 1) * this.limit,
          (this.currentPage - 1) * this.limit + this.limit
        )
        if (tableData.length > 0) {
          tableData.forEach((item) => {})
        }
        return tableData
      } else {
        return false
      }
    },
    getFFCLevels() {
      const levels = [this.$t('general.PleaseSelect')]
      if (this.leaderDistribution.choosableLevels !== undefined) {
        this.leaderDistribution.choosableLevels.forEach((item) => {
          levels.push(getUserLevelName(item.value))
        })
      }
      return levels
    },
    getFronts() {
      const fronts = [this.$t('general.PleaseSelect')]
      if (this.leaderDistribution.choosableFronts !== undefined) {
        this.leaderDistribution.choosableFronts.forEach((item) => {
          fronts.push(item)
        })
      }
      return fronts
    },
    activePeriod() {
      if (this.leaderDistribution.fromDate !== undefined) {
        let fromDate = new Date(this.leaderDistribution.fromDate)
        let toDate =
          this.leaderDistribution.toDate !== undefined
            ? new Date(this.leaderDistribution.toDate)
            : new Date()
        fromDate =
          format(fromDate, 'yyyy') + ' ' + getMonthName(format(fromDate, 'M'))
        toDate =
          format(toDate, 'yyyy') + ' ' + getMonthName(format(toDate, 'M'))
        if (fromDate !== toDate) {
          return fromDate + ' - ' + toDate
        } else {
          return fromDate
        }
      } else {
        return ''
      }
    },
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    const startDate = new Date('2015-04-01')
    let dates = eachMonthOfInterval({
      start: startDate,
      end: new Date()
    })
    if (dates.length > 0) {
      dates = dates.reverse()
      dates.forEach((date) => {
        this.dateSelectInterval.push(
          format(date, 'yyyy ') + getMonthName(format(date, 'M'))
        )
        this.datesInterval.push({
          fromDate: format(date, 'yyyy-LL') + '-01',
          toDate: format(lastDayOfMonth(date), 'yyyy-LL-dd')
        })
      })
    }
    this.getDetails()
  },
  methods: {
    getUserLevelName,
    formatPoint,
    async getDetails() {
      const payload = {}
      if (
        this.customDateFilter &&
        this.datesInterval[this.dateFrom] !== undefined &&
        this.datesInterval[this.dateTo] !== undefined
      ) {
        payload.fromDate = this.datesInterval[this.dateFrom].fromDate
        payload.toDate = this.datesInterval[this.dateTo].toDate
      } else if (this.datesInterval[this.selectedInterval] !== undefined) {
        payload.fromDate = this.datesInterval[this.selectedInterval].fromDate
        payload.toDate = this.datesInterval[this.selectedInterval].toDate
      }
      if (this.selectedUserLevel !== 0) {
        payload.level = this.leaderDistribution.choosableLevels[
          this.selectedUserLevel - 1
        ].value
      }
      if (this.selectedFront !== 0) {
        payload.front = this.leaderDistribution.choosableFronts[
          this.selectedFront - 1
        ]
      }
      this.leaderDistribution = false
      this.leaderDistribution = await this.$store.dispatch(
        'user/getLeaderDistribution',
        payload
      )
      this.activeDate = new Date(this.leaderDistribution.fromDate)
      this.maxPage = Math.ceil(
        this.leaderDistribution.usersQualifications.length / this.limit
      )
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#dataTable')
    },
    deleteFilters() {
      this.selectedInterval = 0
      this.selectedUserLevel = 0
      this.selectedFront = 0
      this.dateFrom = 0
      this.dateTo = 0
      this.getDetails()
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeLeaderDistributionTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeLeaderDistributionTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeLeaderDistributionTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
