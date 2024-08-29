<template>
  <main>
    <LoadingLayerWeboffice v-if="distribution === false" />
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
            name: $t('weboffice.TurnoverDistribution')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.TurnoverDistribution') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <WebofficeCard
          :title="$t('weboffice.Period') + ': ' + activePeriod"
          content-style=""
        >
          <div class="flex flex-wrap flex-col md:flex-row">
            <div
              class="flex flex-col w-full md:w-1/2 md:border-r md:border-grey-light"
            >
              <div class="flex flex-col py-20 px-16">
                <div class="text-sm leading-14">
                  {{ $t('weboffice.PackageTurnover') }}
                </div>
                <div class="text-lg leading-24 mt-8">
                  {{ formatPoint(distribution.countedPoints) }}
                  {{ $t('weboffice.QualificationPoints') }}
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full md:w-1/2">
              <div class="flex flex-col py-20 px-16">
                <div class="text-sm leading-14">
                  {{ $t('weboffice.QualificationPointsIntoAccount') }}
                </div>
                <div class="text-lg leading-24 mt-8">
                  {{ formatPoint(distribution.parentQualificationPoints) }}
                  (/{{ formatPoint(distribution.benchMark) }})
                </div>
              </div>
            </div>
          </div>
        </WebofficeCard>
        <div
          class="flex flex-col py-20 px-16 text-sm leading-14 mt-16 bg-grey-light rounded"
        >
          <div class="flex flex-row">
            <div class="">{{ $t('weboffice.Sponsore') }}:</div>
            <div class="link ml-4">{{ distribution.sponsoreName }}</div>
          </div>
          <div class="flex flex-row mt-8">
            <div class="">{{ $t('weboffice.Navigation') }}:</div>
            <div class="link ml-4">{{ getFees.username }}</div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-24">
          <div class="border border-grey-light rounded">
            <div
              class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
            >
              <div class="flex flex-grow">
                {{ $t('weboffice.Filter') }}
              </div>
              <div class="flex link" @click="deleteFilters">
                {{ $t('weboffice.DeleteFilters') }}
              </div>
            </div>
            <div class="flex flex-col px-16 pt-16">
              <InputToggle
                v-model="customDateFilter"
                :label="$t('weboffice.CustomDateFilter')"
              />
              <div
                :class="customDateFilter ? 'lg:flex-row' : 'md:flex-row'"
                class="flex flex-col pt-16 pb-12"
              >
                <InputDropdown
                  v-if="!customDateFilter"
                  v-model="selectedPeriod"
                  :values="dateSelect"
                  :label="$t('weboffice.Period')"
                  :is-dark="false"
                  :class="'w-full sm:w-240 mb-3'"
                />
                <div class="flex flex-col sm:flex-row">
                  <InputDropdown
                    v-if="customDateFilter"
                    v-model="dateFrom"
                    :values="dateSelect"
                    :label="$t('general.DateFrom')"
                    :is-dark="false"
                    :error="dateFromError"
                    :class="'w-full sm:mb-3 sm:mr-8 lg:w-240'"
                  />
                  <InputDropdown
                    v-if="customDateFilter"
                    v-model="dateTo"
                    :values="dateSelect"
                    :label="$t('general.DateTo')"
                    :is-dark="false"
                    :error="dateToError"
                    :class="'w-full mt-8 sm:mt-0 sm:mb-3 sm:ml-8 lg:w-240'"
                  />
                </div>
                <div>
                  <ButtonSmall
                    :class="!customDateFilter ? 'md:ml-8' : 'lg:ml-8'"
                    class="w-full mt-16 mb-3 md:w-82 h-48"
                    type="primary"
                    @click="startFilter"
                  >
                    {{ $t('weboffice.Filter') }}
                  </ButtonSmall>
                </div>
              </div>
            </div>
          </div>
          <Scrollbar
            :centered="false"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
            class="pr-1 mt-24"
          >
            <table
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 700px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Fullname') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.QualificationPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.ExtraQualificationPoints') }}
                  </th>
                  <th class="py-14 px-8 text-right">
                    {{ $t('weboffice.DistributionPercentageOfTheLine') }}
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
                    {{ row.fullname }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ formatPoint(row.qualificationPoints) }}
                    {{ $t('weboffice.Point') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ formatPoint(row.extraQualificationPoints) }}
                    {{ $t('weboffice.Point') }}
                  </td>
                  <td
                    :class="
                      row.career_level === 'critical'
                        ? 'text-danger'
                        : 'text-primary'
                    "
                    class="py-13 px-8 border border-grey-light text-right"
                  >
                    {{ formatPoint(Math.round(row.distribution * 10) / 10) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="distribution !== false && maxPage > 1"
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
import { mapGetters } from 'vuex'
import { format, eachMonthOfInterval, lastDayOfMonth } from 'date-fns'
import { formatPoint, getMonthName, getPerPageLimit } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdown from '@/components/micro/InputDropdown'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'
import InputToggle from '@/components/micro/InputToggle'

export default {
  name: 'DistributionPage',
  middleware: 'auth_needed',
  components: {
    InputToggle,
    Scrollbar,
    Pagination,
    InputDropdown,
    ButtonSmall,
    WebofficeCard,
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
      distribution: false,
      currentPage: 1,
      maxPage: 1,
      pointCollectingEndDate: false,
      details: false,
      users: [],
      dateSelect: [],
      datesInterval: [],
      dateFrom: 0,
      dateFromError: '',
      dateTo: 0,
      dateToError: '',
      selectedPeriod: 0,
      customDateFilter: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getDetailsTableData() {
      return this.users.slice(
        (this.currentPage - 1) * this.limit,
        (this.currentPage - 1) * this.limit + this.limit
      )
    },
    activePeriod() {
      if (this.distribution.fromDate !== undefined) {
        let fromDate = new Date(this.distribution.fromDate)
        let toDate =
          this.distribution.toDate !== undefined
            ? new Date(this.distribution.toDate)
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
    this.getDetails()
  },
  methods: {
    formatPoint,
    async getDetails() {
      this.users = []
      this.$scrollTo('#__nuxt')
      this.distribution = false
      this.currentPage = 1
      this.maxPage = 1
      const payload = {}
      if (
        this.customDateFilter &&
        this.dateFrom > 0 &&
        this.dateTo > 0 &&
        this.datesInterval[this.dateFrom] !== undefined &&
        this.datesInterval[this.dateTo] !== undefined
      ) {
        payload.fromDate = this.datesInterval[this.dateFrom - 1].fromDate
        payload.toDate = this.datesInterval[this.dateTo - 1].toDate
      } else if (
        this.selectedPeriod > 0 &&
        this.datesInterval[this.selectedPeriod] !== undefined
      ) {
        payload.fromDate = this.datesInterval[this.selectedPeriod - 1].fromDate
        payload.toDate = this.datesInterval[this.selectedPeriod - 1].toDate
      }
      this.distribution = await this.$store.dispatch(
        'user/getDistribution',
        payload
      )
      this.initDateSelect()
      if (
        this.distribution.users !== undefined &&
        this.distribution.users.length > 0
      ) {
        this.distribution.users.forEach((user) => {
          if (user.distribution > 0) {
            this.users.push(user)
          }
        })
      }
      this.maxPage = Math.ceil(this.users.length / this.limit)
    },
    navPage(page) {
      this.currentPage = page
    },
    format(date) {
      return format(date, 'yyyy') + ' ' + getMonthName(format(date, 'M'))
    },
    initDateSelect() {
      let dates = eachMonthOfInterval({
        start: new Date(
          this.distribution !== false
            ? this.distribution.back_in_time_date
            : '2015-04-01'
        ),
        end: new Date()
      })
      if (dates.length > 0) {
        dates = dates.reverse()
        this.dateSelect.push(this.$t('general.PleaseSelect'))
        dates.forEach((date) => {
          this.dateSelect.push(
            format(date, 'yyyy') + ' ' + getMonthName(format(date, 'M'))
          )
          this.datesInterval.push({
            fromDate: format(date, 'yyyy-LL') + '-01',
            toDate: format(lastDayOfMonth(date), 'yyyy-LL-dd')
          })
        })
      }
    },
    deleteFilters() {
      this.selectedPeriod = 0
      this.dateFrom = 0
      this.dateTo = 0
      this.getDetails()
    },
    startFilter() {
      this.dateFromError = ''
      this.dateToError = ''
      if (this.customDateFilter) {
        if (this.dateFrom === 0) {
          this.dateFromError = this.$t('weboffice.DateRequired')
        } else if (this.dateTo === 0) {
          this.dateToError = this.$t('weboffice.DateRequired')
        } else {
          this.getDetails()
        }
      } else {
        this.getDetails()
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeDistributionTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeDistributionTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeDistributionTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
