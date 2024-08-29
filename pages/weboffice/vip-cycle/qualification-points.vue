<template>
  <main>
    <LoadingLayerWeboffice v-if="mainTable === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.VipCycleBonusGroupData'),
            link: '/weboffice/loyalty-cycle/position'
          },
          {
            name: $t('weboffice.VipCycleBonusQualificationPoints')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.VipCycleBonusQualificationPoints') }}
      </div>
    </div>
    <div v-if="mainTable !== false" class="flex flex-col w-full mt-24">
      <div class="border border-grey-light rounded mt-24">
        <div
          class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
        >
          <div class="flex flex-grow">{{ $t('weboffice.Filter') }}</div>
          <div class="flex link cursor-pointer" @click="resetMainTable()">
            {{ $t('weboffice.DeleteFilters') }}
          </div>
        </div>
        <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
          <InputDropdown
            v-model="levelFilter"
            :values="levelOptions"
            :label="$t('weboffice.LevelFilter')"
            :is-dark="false"
            :class="'w-full mt-8 lg:mt-0'"
          />
          <InputBonusNamesearch
            v-model="nameSearch"
            :level-filter="selectedUserLevel"
            :component-attr-id="'namesearch'"
            :label="$t('weboffice.UserFilter')"
            :class="'mt-16 lg:mt-0 lg:px-8 w-full'"
          />
          <ButtonSmall
            class="w-full mt-16 mb-4 md:w-82"
            type="primary"
            @click="filterMainTable()"
          >
            {{ $t('weboffice.Filter') }}
          </ButtonSmall>
        </div>
      </div>
      <Scrollbar
        :key="'scrollbar'"
        :centered="false"
        class="pr-1 mt-24"
        :style="'max-width: ' + scrollbarMaxWidth + 'px'"
      >
        <table
          class="table-auto text-sm leading-14 text-black"
          :style="'min-width:' + scrollbarContentWidth + 'px'"
        >
          <thead class="font-bold">
            <tr>
              <td class="py-14 px-8">Front</td>
              <template v-for="(month, index) in mainTable.months">
                <td :key="index" class="py-14 px-8">{{ month }}</td>
              </template>
              <td class="py-14 px-8">Total</td>
            </tr>
          </thead>
          <tbody>
            <template v-for="(user, index) in mainTable.users">
              <tr
                :key="index"
                :class="index % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
              >
                <td class="py-13 px-8 border border-grey-light text-primary">
                  {{ user.username }}
                </td>
                <template v-for="(col, key) in user.points">
                  <td :key="key" class="py-13 px-8 border border-grey-light">
                    {{
                      col
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </td>
                </template>
                <td class="py-13 px-8 border border-grey-light">
                  {{
                    user.points.reduce((a, b) => a + b, 0)
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td class="py-13 px-8 border border-grey-light text-primary">
                Total
              </td>
              <template v-for="(col, key) in mainTable.sums">
                <td :key="key" class="py-13 px-8 border border-grey-light">
                  {{
                    col
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </td>
              </template>
              <td class="py-13 px-8 border border-grey-light">
                {{
                  mainTable.sums.reduce((a, b) => a + b, 0)
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}
              </td>
            </tr>
          </tfoot>
        </table>
      </Scrollbar>
      <div class="text-right my-24">
        <span
          class="my-16 px-16 py-8 bg-primary rounded text-bold text-white"
          >{{ mainTable.year }}</span
        >
      </div>

      <div class="border border-grey-light rounded mt-24">
        <div
          class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
        >
          <div class="flex flex-grow">{{ $t('general.Details') }}</div>
          <div class="flex link cursor-pointer" @click="resetMainTable()">
            {{ $t('weboffice.DeleteFilters') }}
          </div>
        </div>
        <div
          class="bg-grey-light border-t border-grey-light bg-opacity-50 px-16 py-8 font-bold text-sm leading-18 grid grid-cols-2"
        >
          <div class="">
            <div class="mb-8 uppercase">
              <b>{{ $t('weboffice.Sponsore') }}: </b>
              <span v-if="sponsorName !== false">{{ sponsorName }}</span>
            </div>
            <div v-if="navigation !== false" class="uppercase">
              <b>{{ $t('weboffice.Navigation') }}: </b>
              <template v-for="(link, index) in navigation">
                <span
                  :key="index"
                  class="link cursor-pointer"
                  @click="
                    getMainTable({
                      selectedUsername: link
                    })
                  "
                  >{{ link }}
                </span>
                <span
                  v-if="index !== navigation.length - 1"
                  :key="index"
                  class="px-4"
                >
                  >
                </span>
              </template>
            </div>
          </div>
          <div class="flex">
            <InputDateRange
              v-model="dates"
              :disable-past="false"
              :label-checkin="$t('general.DateFromReal')"
              :label-checkout="$t('general.DateToReal')"
              class="flex flex-wrapper w-full"
              :wrapper-style-checkout="['sm:w-1/2']"
              :input-style-checkin="['sm:mb-0']"
              :input-style-checkout="['sm:mb-0']"
            />
            <ButtonSmall
              class="w-full mt-16 mb-4 lg:ml-8 md:w-82"
              type="primary"
              @click="filterMainTable()"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
        <div class="flex flex-col pt-16 pb-12 px-16">
          <table class="table-auto text-sm leading-14 text-black">
            <thead class="font-bold">
              <tr>
                <td class="py-13 px-8">{{ $t('weboffice.ColUsers') }}</td>
                <td class="py-13 px-8">
                  {{ $t('weboffice.ColQualificationPoints') }}
                </td>
                <td class="py-13 px-8">
                  Extra {{ $t('weboffice.ColQualificationPoints') }}
                </td>
                <td class="py-13 px-8">
                  {{ $t('weboffice.ColDistributionPercentage') }}
                </td>
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, index) in detailsTable">
                <tr
                  :key="index"
                  :class="index % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                >
                  <td
                    class="py-13 px-8 border border-grey-light link cursor-pointer"
                    @click="
                      getMainTable({
                        selectedUsername: row.username
                      })
                    "
                  >
                    {{ row.username }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.qualificationPonts }} point
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.extraQualificationPoints }} point
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{
                      row.distribution
                        | formatNumber('0,00.0', {
                          thousandsSeparator: ' '
                        })
                    }}%
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-center mt-24">
        <Pagination
          v-if="mainTable !== false && maxPage > 1"
          :max-pages="maxPage"
          :current-page="currentPage"
          @click="navPage"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { formatDateApi } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'
import InputDropdown from '@/components/micro/InputDropdown'
import InputBonusNamesearch from '@/components/micro/InputBonusNamesearch'
import InputDateRange from '@/components/micro/InputDateRange'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'VIPGroupDataPage',
  middleware: 'auth_needed',
  components: {
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    Pagination,
    Scrollbar,
    InputDropdown,
    InputDateRange,
    InputBonusNamesearch,
    ButtonSmall
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      results: false,
      mainTable: false,
      detailsTable: false,
      navigation: false,
      sponsorName: false,
      levelOptions: false,
      scrollbarContentWidth: 0,
      currentPage: 1,
      limit: 10,
      maxPage: 1,
      levelFilter: false,
      nameSearch: {},
      dates: {
        date1: this.getBeginingOfMonth(),
        date2: this.getToday()
      }
    }
  },
  computed: {
    selectedUserLevel() {
      if (this.levelFilter === false) {
        return this.levelOptions[0]
      }
      return this.levelOptions[this.levelFilter]
    }
  },
  mounted() {
    this.getMainTable(false)
  },
  methods: {
    filterMainTable() {
      this.getMainTable({
        selectedUsername: this.nameSearch.text
      })
    },
    resetMainTable() {
      this.levelFilter = false
      this.nameSearch = {}
      this.dates = {
        date1: this.getBeginingOfMonth(),
        date2: this.getToday()
      }
      this.getMainTable(false)
    },
    async getMainTable(params) {
      this.$scrollTo('#__nuxt')
      this.results = false
      this.mainTable = false
      this.navigation = false
      this.sponsorName = false

      if (params === false) {
        params = {}
      }
      params = {
        ...params,
        ...{
          fromDate: this.dates.date1,
          toDate: this.dates.date2
        }
      }

      this.results = await this.$store.dispatch(
        'user/getVipCycleQualification',
        params
      )

      if (this.results.mainTable !== undefined) {
        this.mainTable = this.results.mainTable[0]
        this.detailsTable = this.results.detailsTable
        this.levelOptions = this.results.levelOptions
        this.navigation = this.results.navigation
        this.sponsorName = this.results.sponsoreName
        if (this.mainTable.months !== undefined) {
          this.scrollbarContentWidth =
            (Object.keys(this.mainTable.months).length + 2) * 140
        } else {
          this.scrollbarContentWidth = 0
        }
      }
    },
    navPage(page) {
      this.currentPage = page
      this.activeRow = -1
      this.$scrollTo('#__nuxt')
    },
    getToday() {
      const today = new Date()
      today.setDate(today.getDate())

      return formatDateApi(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      )
    },
    getBeginingOfMonth() {
      const today = new Date()
      today.setDate(today.getDate())

      return formatDateApi(today.getFullYear(), today.getMonth() + 1, 1)
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeQualificationPointsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeQualificationPointsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeQualificationPointsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
