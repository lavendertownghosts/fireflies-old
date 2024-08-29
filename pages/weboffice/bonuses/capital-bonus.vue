<template>
  <main>
    <LoadingLayerWeboffice v-if="capitalBonus === false" />
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
            name: $t('weboffice.CapitalBonus')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.CapitalBonus') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="border border-grey-light rounded mt-24">
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">
              {{ $t('weboffice.Filter') }}
            </div>
            <div class="flex link cursor-pointer" @click="deleteUserFilters">
              {{ $t('weboffice.DeleteFilters') }}
            </div>
          </div>
          <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
            <InputDropdown
              v-model="levelSelect"
              :values="levelSelectList"
              :placeholder="$t('weboffice.PleaseSelect')"
              :label="$t('weboffice.CareerLevel')"
              class="w-216"
            />
            <WebofficeCapitalBonusNamesearch
              v-model="username"
              :label="$t('weboffice.Username')"
              :level-filter="
                levelSelect !== false
                  ? capitalBonus.choosableFFCLevels[levelSelect]
                  : ''
              "
              :is-disabled="levelSelectList[levelSelect] === undefined"
              :component-attr-id="'WebofficeCapitalBonusNamesearch'"
              class="w-216 ml-16"
            />
            <ButtonSmall
              class="w-full ml-16 mt-16 mb-4 md:w-82"
              type="primary"
              :is-disabled="username.id === false"
              @click="getUsers"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
        <div class="h-1 w-full bg-grey-light mt-24" />
        <div
          class="flex flex flex-col md:flex-row text-2x leading-18 mt-24 mb-12 w-full"
        >
          <div class="flex">
            {{ $t('weboffice.Period') }}:
            {{ capitalBonus.periodIdsAndNames[selectedPeriod] }}
          </div>
          <div class="flex flex-grow mt-8 md:mt-0 md:justify-end">
            {{ $t('weboffice.ObtainedLeaderPoints') }}:
            <span class="text-danger ml-8">{{
              capitalBonus.achievedLeaderPoints
            }}</span>
          </div>
        </div>
        <div
          class="flex flex-wrap md:flex-row pt-24 border-t border-grey-light"
        >
          <div
            v-for="(period, periodKey) in capitalBonus.periodIdsAndNames"
            :key="periodKey"
            class="mb-8 lg:mb-0 mr-8"
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
        <div class="mt-16">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 896px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left w-177">
                    {{ $t('weboffice.Front') }}
                  </th>
                  <th
                    v-for="(date, dateKey) in capitalBonus.periodTableDates"
                    :key="dateKey"
                    class="w-128"
                  >
                    {{ date.year + ' ' + getMonthName(parseInt(date.month)) }}
                  </th>
                  <th class="py-14 px-8 text-left w-128">
                    {{ $t('weboffice.Sum') }}
                  </th>
                  <th class="py-14 px-8 text-left w-177">
                    {{ $t('weboffice.ObtainedLeaderPoints') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in capitalBonus.periodTable"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td class="py-13 px-8 border border-grey-light text-primary">
                    {{ row.username }}
                  </td>
                  <td
                    v-for="(date, dateKey) in capitalBonus.periodTableDates"
                    :key="dateKey"
                    :class="
                      currentDate.getFullYear() === parseInt(date.year) &&
                      currentDate.getMonth() + 1 === parseInt(date.month)
                        ? 'text-black'
                        : row.green ||
                          row[
                            date.year + '.' + (parseInt(date.month) - 1) + '.'
                          ] > 10000
                        ? 'text-primary'
                        : 'text-danger'
                    "
                    class="py-13 px-8 border border-grey-light"
                  >
                    {{
                      row[date.year + '.' + (parseInt(date.month) - 1) + '.']
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      row.sum
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      capitalBonus.leaderPointsMap[row.userid]
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                </tr>
                <tr
                  :class="
                    capitalBonus.periodTable.length % 2 === 1
                      ? 'bg-grey-light bg-opacity-30'
                      : ''
                  "
                >
                  <td class="py-13 px-8 border border-grey-light text-primary">
                    {{ $t('weboffice.Total') }}
                  </td>
                  <td
                    v-for="(date, dateKey) in capitalBonus.periodTableDates"
                    :key="dateKey"
                    class="py-13 px-8 border border-grey-light"
                  >
                    {{
                      getTotal(
                        date.year + '.' + (parseInt(date.month) - 1) + '.'
                      )
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      getTotal('sum')
                        | formatNumber('0,0.00', {
                          thousandsSeparator: ' ',
                          decimalSeparator: ','
                        })
                    }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light"></td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
        </div>
        <div class="mt-24">
          <WebofficeCard :title="$t('general.Details')">
            <div
              class="flex flex-col py-20 px-16 text-sm leading-14 bg-grey-light rounded"
            >
              <div class="flex flex-row">
                <div class="">{{ $t('weboffice.Sponsore') }}:</div>
                <div class="link ml-4">
                  {{ capitalBonus.sponsoreName }}
                </div>
              </div>
              <div class="flex flex-row mt-8">
                <div class="">{{ $t('weboffice.Navigation') }}:</div>
                <div class="link ml-4 cursor-pointer">
                  {{ getFees.username }}
                </div>
              </div>
            </div>
            <div class="border border-grey-light rounded mt-24">
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
              <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
                <InputDateRange
                  v-model="dates"
                  :is-dark="false"
                  :label-checkin="$t('general.DateFrom')"
                  :label-checkout="$t('general.DateTo')"
                  class="flex flex-row w-240"
                  :input-style="['mr-8']"
                  :wrapper-style-checkin="['sm:pr-8']"
                  :wrapper-style-checkout="['md:px-8']"
                  :disable-past="false"
                  :is-nights="false"
                />
                <ButtonSmall
                  class="w-full mt-16 mb-4 lg:ml-8 md:w-82"
                  type="primary"
                  @click="getUsers"
                >
                  {{ $t('weboffice.Filter') }}
                </ButtonSmall>
              </div>
            </div>
            <div class="flex flex-col w-full mt-16">
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
                        {{ $t('weboffice.Username') }}
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
                      v-for="(row, rowKey) in getTableData"
                      :key="rowKey"
                      :class="
                        rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''
                      "
                    >
                      <td class="py-13 px-8 border border-grey-light">
                        <div
                          class="link cursor-pointer"
                          @click="getUsers(row.username)"
                        >
                          {{ row.username }}
                        </div>
                      </td>
                      <td class="py-13 px-8 border border-grey-light">
                        {{ row.qualificationPoints }}
                        {{ $t('weboffice.Point') }}
                      </td>
                      <td class="py-13 px-8 border border-grey-light">
                        {{ row.extraQualificationPoints }}
                        {{ $t('weboffice.Point') }}
                      </td>
                      <td
                        class="py-13 px-8 border border-grey-light text-right"
                      >
                        <div
                          :class="
                            row.career_level === 'critical'
                              ? 'text-danger'
                              : 'text-primary'
                          "
                        >
                          {{ Math.round(row.distribution * 10) / 10 }}
                          %
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Scrollbar>
            </div>
            <div class="flex justify-center mt-16">
              <Pagination
                v-if="maxPage > 1"
                :max-pages="maxPage"
                :current-page="currentPage"
                @click="navPage"
              />
            </div>
          </WebofficeCard>
        </div>
        <div class="mt-24">
          <a
            href="https://www.fireflies.com/CDNContent/tokeresz-bonusz-hu.ppsx"
            class="link cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fas fa-file-download"></i>
            {{ $t('weboffice.DownloadCapitalShareBonusPresentation') }}
          </a>
        </div>
        <div class="text-lg leading-24 font-bold mt-40 mb-24">
          {{ $t('weboffice.Information') }}
        </div>
        <div class="mb-16">
          <div
            class="link cursor-pointer text-sm leading-14 uppercase"
            @click="activeInformation = 1 === activeInformation ? false : 1"
          >
            {{ $t('weboffice.CapitalBonusInfTitle1') }}
          </div>
          <div v-show="activeInformation === 1" class="text-sm leading-20 mt-8">
            <div>{{ $t('weboffice.CapitalBonusInfDesc1Part1') }}</div>
            <ul class="list-decimal ml-32 mt-8">
              <li>{{ $t('weboffice.CapitalBonusInfDesc1Part2') }}</li>
              <li>{{ $t('weboffice.CapitalBonusInfDesc1Part3') }}</li>
              <li>{{ $t('weboffice.CapitalBonusInfDesc1Part4') }}</li>
            </ul>
            <div class="flex items-center justify-center mt-8">
              <table class="table-fixed w-10/12">
                <thead>
                  <tr>
                    <th class="w-1/2 py-14 px-8">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part5') }}
                    </th>
                    <th class="w-1/2 py-14 px-8">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part6') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="w-1/2 py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part7') }}
                    </td>
                    <td class="w-1/2 py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part8') }}
                    </td>
                  </tr>
                  <tr>
                    <td class="w-1/2 py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part9') }}
                    </td>
                    <td class="w-1/2 py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part10') }}
                    </td>
                  </tr>
                  <tr>
                    <td class="w-1/2 py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part11') }}
                    </td>
                    <td class="w-1/2 py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.CapitalBonusInfDesc1Part12') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-16">
              {{ $t('weboffice.CapitalBonusInfDesc1Part13') }}
            </div>
            <ul class="list-disc ml-32 mt-8">
              <li>{{ $t('weboffice.CapitalBonusInfDesc1Part14') }}</li>
              <li>{{ $t('weboffice.CapitalBonusInfDesc1Part15') }}</li>
              <li>{{ $t('weboffice.CapitalBonusInfDesc1Part16') }}</li>
            </ul>
          </div>
        </div>
        <div class="mb-16">
          <div
            class="link cursor-pointer text-sm leading-14 uppercase"
            @click="activeInformation = 2 === activeInformation ? false : 2"
          >
            {{ $t('weboffice.CapitalBonusInfTitle2') }}
          </div>
          <div v-show="activeInformation === 2" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.CapitalBonusInfDesc2Part1') }}</div>
            <div class="mt-8">
              {{ $t('weboffice.CapitalBonusInfDesc2Part2') }}
            </div>
            <div class="mt-8">
              {{ $t('weboffice.CapitalBonusInfDesc2Part3') }}
            </div>
          </div>
        </div>
        <div class="mb-16">
          <div
            class="link cursor-pointer text-sm leading-14 uppercase"
            @click="activeInformation = 3 === activeInformation ? false : 3"
          >
            {{ $t('weboffice.CapitalBonusInfTitle3') }}
          </div>
          <div v-show="activeInformation === 3" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.CapitalBonusInfDesc3') }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import ButtonSmall from '@/components/micro/ButtonSmall'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import InputDateRange from '@/components/micro/InputDateRange'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'
import InputDropdown from '~/components/micro/InputDropdown'
import { getUserLevelName, getMonthName } from '@/includes/utils'
import WebofficeCapitalBonusNamesearch from '~/components/weboffice/WebofficeCapitalBonusNamesearch'

export default {
  name: 'CapitalBonusPage',
  middleware: 'auth_needed',
  components: {
    WebofficeCapitalBonusNamesearch,
    InputDropdown,
    Scrollbar,
    Pagination,
    InputDateRange,
    WebofficeCard,
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
      capitalBonus: false,
      selectedPeriod: false,
      selectedUserName: false,
      currentMonth: false,
      activeItems: {},
      maxPage: 0,
      currentPage: 1,
      loadingUserList: false,
      levelSelect: false,
      levelSelectList: [],
      currentDate: new Date(),
      username: {
        id: false,
        text: ''
      },
      limit: 20,
      users: [],
      dates: {
        date1: false,
        date2: false
      },
      activeInformation: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getTableData() {
      return this.users.slice(
        (this.currentPage - 1) * this.limit,
        (this.currentPage - 1) * this.limit + this.limit
      )
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getMonthName,
    getUserLevelName,
    getTotal(key) {
      let total = 0
      this.capitalBonus.periodTable.forEach((item) => {
        total += item[key]
      })
      return total
    },
    async getDetails() {
      const today = new Date()
      const payload = {}
      if (this.selectedPeriod !== false) {
        payload.selectedPeriodId = this.selectedPeriod
      }
      if (this.username.id !== false) {
        payload.selectedUsername = this.selectedUserName
      } else if (this.selectedUserName !== false) {
        payload.selectedUsername = this.selectedUserName
      }
      if (this.dates.date1 !== false) {
        payload.fromDate = this.dates.date1
      } else {
        payload.fromDate = format(today, 'yyyy-LL-01')
      }
      if (this.dates.date2 !== false) {
        payload.toDate = this.dates.date2
      } else {
        payload.toDate = format(today, 'yyyy-LL-dd')
      }
      this.capitalBonus = false
      this.capitalBonus = await this.$store.dispatch(
        'user/getCapitalBonus',
        payload
      )
      if (
        this.capitalBonus.users !== undefined &&
        this.capitalBonus.users.length > 0
      ) {
        this.users = []
        this.capitalBonus.users.forEach((user) => {
          if (user.distribution > 0) {
            this.users.push(user)
          }
        })
      }
      if (this.capitalBonus.choosableFFCLevels !== undefined) {
        this.capitalBonus.choosableFFCLevels.forEach((level) => {
          this.levelSelectList.push(getUserLevelName(level))
        })
      }
      this.dates.date1 = this.capitalBonus.fromDate
      this.dates.date2 = format(new Date(), 'yyyy-LL-dd')
      this.selectedPeriod =
        this.capitalBonus.selectedPeriodId !== undefined
          ? this.capitalBonus.selectedPeriodId
          : false
      this.maxPage = Math.ceil(this.users.length / this.limit)
    },
    navPage(page) {
      this.currentPage = page
    },
    changeSelectedPeriod(period) {
      this.selectedPeriod = period
      this.$scrollTo('#__nuxt')
      this.currentPage = 1
      this.getDetails()
    },
    deleteFilters() {
      this.dates.date1 = this.capitalBonus.fromDate
      this.dates.date2 = format(new Date(), 'yyyy-LL-dd')
    },
    getUsers(username = false) {
      if (username !== false) {
        this.selectedUserName = username
      }
      this.$scrollTo('#__nuxt')
      this.getDetails()
    },
    deleteUserFilters() {
      this.levelSelect = false
      this.username.id = false
      this.username.text = ''
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeCapitalBonusTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeCapitalBonusTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeCapitalBonusTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
