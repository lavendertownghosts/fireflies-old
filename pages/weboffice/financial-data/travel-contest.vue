<template>
  <main>
    <LoadingLayerWeboffice v-if="travelContest === false" />
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
            name: $t('weboffice.TravelContest'),
            link: '/weboffice/financial-data/travel-contest'
          },
          {
            name: $t('weboffice.CurrentState')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.CurrentState') }}
      </div>
      <StatusMessage type="warning">
        <div
          class="text-base leading-16"
          v-html="$t('weboffice.TravelContestMessageTitle')"
        ></div>
        <div
          class="text-sm leading-20"
          v-html="$t('weboffice.TravelContestMessageMessage')"
        ></div>
      </StatusMessage>
      <div class="flex flex-col sm:flex-row mt-24">
        <WebofficeCard
          :title="$t('weboffice.EndDateOfPointCollection')"
          class="w-full sm:w-1/2 lg:w-1/3 sm:pr-8"
        >
          <div class="text-2x leading-18">
            {{ format(pointCollectingEndDate) }}
          </div>
        </WebofficeCard>
        <WebofficeCard
          :title="$t('weboffice.TimeLeft')"
          class="w-full mt-16 sm:mt-0 sm:w-1/2 lg:w-1/3 sm:pl-8"
        >
          <div class="text-2x leading-18">
            {{ calcRemainingTime(pointCollectingEndDate) }}
          </div>
        </WebofficeCard>
      </div>
      <div class="flex w-full mt-24">
        <WebofficeCard
          :title="$t('weboffice.TravelPoints')"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
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
                    {{ $t('weboffice.MyTravelPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.QuarantinedTravelPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Position') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      formatPoint(Math.round(travelContest.usersTP * 100) / 100)
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      formatPoint(
                        Math.round(travelContest.usersTPAtQuarantine * 100) /
                          100
                      )
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      travelContest.rankInTopList === -1
                        ? $t('weboffice.YouAreNotPresentInTheTop200')
                        : travelContest.rankInTopList
                    }}.
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
        </WebofficeCard>
      </div>
      <div class="flex flex-col w-full mt-24">
        <WebofficeCard
          :title="$t('weboffice.Position')"
          :content-style="'py-20'"
          class="w-full"
        >
          <div class="px-16">
            <div
              class="flex flex-row text-xs leading-12 font-bold h-32 items-center"
            >
              <div class="w-1/2">
                {{ $t('weboffice.PointsOfTheUserPreceding') }}
              </div>
              <div class="w-1/2">
                {{ $t('weboffice.PointsOfTheUserFollowing') }}
              </div>
            </div>
            <div
              class="flex flex-row border border-grey-light text-sm leading-14"
            >
              <div
                class="flex w-1/2 px-8 border-r border-grey-light h-40 items-center"
              >
                <span
                  v-if="
                    travelContest.surroundedPeoplesTravelPoints.previous > -1
                  "
                >
                  {{
                    formatPoint(
                      Math.round(
                        travelContest.surroundedPeoplesTravelPoints.previous *
                          100
                      ) / 100
                    )
                  }}
                </span>
              </div>
              <div class="flex w-1/2 px-8 h-40 items-center">
                <span
                  v-if="travelContest.surroundedPeoplesTravelPoints.next > -1"
                >
                  {{
                    formatPoint(
                      Math.round(
                        travelContest.surroundedPeoplesTravelPoints.next * 100
                      ) / 100
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-16">
            <div class="px-16">
              <div class="text-sm leading-14 font-bold">
                {{ $t('weboffice.TravelWinnersInTheCurrentRound') }}
              </div>
              <div class="flex flex-wrap text-sm leading-14 my-16">
                <div class="w-1/2">{{ $t('weboffice.Position') }}</div>
                <div class="w-1/2 text-right">
                  {{ $t('weboffice.TravelPoint') }}
                </div>
              </div>
              <div
                v-for="(topItem, key) in travelWinners"
                :key="key"
                class="flex flex-wrap text-sm leading-14 text-primary border-t border-grey-light h-40 items-center"
              >
                <div class="flex flex-row w-1/2">
                  <div class="w-24 text-center">{{ topItem.rank }}.</div>
                  <i class="fas fa-trophy fa-sm"></i>
                </div>
                <div class="w-1/2 text-right">
                  {{
                    formatPoint(Math.round(topItem.travel_points * 100) / 100)
                  }}
                </div>
              </div>
            </div>
            <div class="h-1 w-full bg-grey"></div>
            <div class="px-16">
              <div class="text-sm leading-14 font-bold mt-16">
                {{ $t('weboffice.OtherPlacesInTheTravelContest') }}
              </div>
              <div class="flex flex-wrap text-sm leading-14 my-16">
                <div class="w-1/2">{{ $t('weboffice.Position') }}</div>
                <div class="w-1/2 text-right">
                  {{ $t('weboffice.TravelPoint') }}
                </div>
              </div>
              <div
                v-for="item in topList.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="item.rank"
                class="flex flex-wrap text-sm leading-14 border-t border-grey-light h-40 items-center"
              >
                <div
                  :class="
                    item.rank === travelContest.rankInTopList ? 'font-bold' : ''
                  "
                  class="flex flex-row w-1/2"
                >
                  <div>{{ item.rank }}.</div>
                </div>
                <div
                  :class="
                    item.rank === travelContest.rankInTopList ? 'font-bold' : ''
                  "
                  class="w-1/2 text-right"
                >
                  {{ formatPoint(Math.round(item.travel_points * 100) / 100) }}
                </div>
              </div>
            </div>
            <div class="h-1 w-full bg-grey"></div>
            <div class="flex justify-center mt-16">
              <Pagination
                v-if="travelContest !== false && maxPage > 1"
                :max-pages="maxPage"
                :current-page="currentPage"
                @click="navPage"
              />
            </div>
          </div>
        </WebofficeCard>
        <div class="text-lg leading-24 font-bold my-24">
          {{ $t('weboffice.TravelPointDetails') }}
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
                  {{ $t('weboffice.Date') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Line') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Depth') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Buyer') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Product') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Points') }}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, rowKey) in getDetailsTableData">
                <tr
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.date }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.line }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.depth }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.user }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ getProductName(row.product) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.amount }}
                  </td>
                  <td
                    class="py-13 px-8 border border-grey-light text-right link cursor-pointer"
                    @click="showDetails(rowKey)"
                  >
                    {{ $t('general.Details') }}
                    <i
                      :class="[
                        rowKey === activeKey
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      ]"
                      class="w-16 fas"
                    ></i>
                  </td>
                </tr>
                <tr v-show="activeKey === rowKey" :key="'second-' + rowKey">
                  <td
                    colspan="8"
                    class="bg-grey-light bg-opacity-30 border border-grey-light"
                  >
                    <div
                      class="flex flex-col py-13 px-8 border-t border-b text-sm leading-14"
                    >
                      <div>
                        {{ $t('weboffice.Price') }}:
                        {{
                          (row.qualification_points / 2)
                            | formatNumber('0,0', {
                              thousandsSeparator: ' '
                            })
                        }}
                        {{ row.currency }}
                      </div>
                      <div class="text-danger mt-8">
                        {{ $t('weboffice.Quarantined') }}
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="travelContest !== false && maxPageDetails > 1"
            :max-pages="maxPageDetails"
            :current-page="currentPageDetails"
            @click="navPageDetails"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { format } from 'date-fns'
import {
  calcRemainingTime,
  formatPoint,
  getPerPageLimit,
  getProductName
} from '@/includes/utils'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import StatusMessage from '@/components/micro/StatusMessage'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'TravelContestPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    WebofficeCard,
    StatusMessage,
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
      getProductName,
      travelContest: false,
      travelWinners: [],
      topList: [],
      currentPage: 1,
      currentPageDetails: 1,
      limitDetails: 25,
      maxPage: 1,
      maxPageDetails: 1,
      detailsActiveItem: false,
      pointCollectingEndDate: false,
      activeKey: false
    }
  },
  computed: {
    getDetailsTableData() {
      return this.travelContest.details.slice(
        (this.currentPageDetails - 1) * this.limitDetails,
        (this.currentPageDetails - 1) * this.limitDetails + this.limitDetails
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
    async getDetails() {
      this.travelContest = await this.$store.dispatch('user/getTravelContest')
      if (this.travelContest.topListresult !== undefined) {
        this.travelWinners = this.travelContest.topListresult.slice(
          0,
          this.travelContest.winnerCount
        )
        this.topList = this.travelContest.topListresult.slice(
          this.travelContest.winnerCount,
          10
        )
        this.maxPage = Math.ceil(this.topList.length / this.limit)
        this.maxPageDetails = Math.ceil(
          this.travelContest.details.length / this.limitDetails
        )
        const pointCollectionEndDate = this.travelContest.pointCollectingEndDate.split(
          ' '
        )
        this.pointCollectingEndDate = new Date(
          pointCollectionEndDate[1] +
            ', ' +
            pointCollectionEndDate[2] +
            ' ' +
            pointCollectionEndDate[3] +
            ' ' +
            pointCollectionEndDate[5]
        )
      }
    },
    navPage(page) {
      this.currentPage = page
    },
    navPageDetails(page) {
      this.currentPageDetails = page
      this.activeKey = false
    },
    format(date) {
      return format(date, 'yyyy.MM.dd')
    },
    calcRemainingTime(date) {
      return calcRemainingTime(date)
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    showDetails(key) {
      if (this.activeKey === key) {
        this.activeKey = false
      } else {
        this.activeKey = key
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeTravelContestTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeTravelContestTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeTravelContestTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
