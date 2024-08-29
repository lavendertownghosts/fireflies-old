<template>
  <main>
    <LoadingLayerWeboffice v-if="registrationTimeline === false" />
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
            name: $t('weboffice.RegistrationTimeline')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.RegistrationTimeline') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning" class="leading-20 text-sm">
          <div v-html="$t('weboffice.RegistrationTimelineAbout')"></div>
        </StatusMessage>
        <div class="border border-grey-light rounded mt-24">
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">{{ $t('weboffice.Filter') }}</div>
            <div class="flex link cursor-pointer" @click="deleteFilters">
              {{ $t('weboffice.DeleteFilters') }}
            </div>
          </div>
          <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
            <InputDropdown
              v-model="selectedUserLevel"
              :values="getFFCLevels"
              :label="$t('weboffice.LevelFilter')"
              :is-dark="false"
              :class="'sm:pr-8 lg:pr-8 w-full'"
            />
            <InputText
              v-model="userFilter"
              :input-style="[]"
              :label="$t('weboffice.UserFilter')"
              :class="'mt-16 sm:mt-0 sm:px-8 w-full'"
              :placeholder="$t('general.Search') + '...'"
            />
            <ButtonSmall
              class="w-full mt-16 mb-4 sm:ml-8 sm:w-82"
              type="primary"
              @click="filter"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
        <div
          class="flex flex-col py-20 px-16 text-sm leading-14 mt-16 bg-grey-light rounded"
        >
          <div class="flex flex-row">
            <div class="">{{ $t('weboffice.Sponsore') }}:</div>
            <div class="text-primary ml-4">
              {{ registrationTimeline.sponsoreName }} -
              {{ getUserLevelName(registrationTimeline.userLevel) }}
            </div>
          </div>
          <div class="flex flex-row mt-8">
            <div class="">{{ $t('weboffice.Navigation') }}:</div>
            <div class="link ml-4 cursor-pointer" @click="getDetails">
              {{ registrationTimeline.userName }}
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-24">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <LoadingLayerWeboffice v-if="userFilterActive === true" />
            <table
              v-else
              id="userTable"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 700px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left">
                    {{
                      registrationTimeline.userName +
                        ' ' +
                        $t('weboffice.Users')
                    }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CareerLevel') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.TimeOfRegistrationGaining') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.LineDepth') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.DistributorRightValidity') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Activity') }}
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
                    <div
                      class="link cursor-pointer"
                      @click="getUserData(row.name)"
                    >
                      {{ row.name }}
                    </div>
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      :class="
                        row.level === 'USER'
                          ? 'text-warning'
                          : 'text-primary-dark'
                      "
                    >
                      {{ getUserLevelName(row.level) }}
                    </div>
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.createdDate }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.lineDeep }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.entry_fee_expire_date }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light text-right">
                    {{ getStatusName(row.activity) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="registrationTimeline !== false && maxPage > 1"
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
import {
  calcRemainingTime,
  getUserLevelName,
  getStatusName,
  getPerPageLimit
} from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import StatusMessage from '@/components/micro/StatusMessage'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdown from '@/components/micro/InputDropdown'
import InputText from '@/components/micro/InputText'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'RegistrationTimelinePage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    InputText,
    InputDropdown,
    ButtonSmall,
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
      registrationTimeline: false,
      currentPage: 1,
      maxPage: 1,
      userFilter: '',
      selectedUserLevel: 0,
      userFilterActive: false
    }
  },
  computed: {
    getDetailsTableData() {
      return this.registrationTimeline.users.slice(
        (this.currentPage - 1) * this.limit,
        (this.currentPage - 1) * this.limit + this.limit
      )
    },
    getFFCLevels() {
      const levels = [this.$t('general.PleaseSelect')]
      if (this.registrationTimeline.choosableFFCLevels !== undefined) {
        this.registrationTimeline.choosableFFCLevels.forEach((item) => {
          levels.push(getUserLevelName(item))
        })
      }
      return levels
    },
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    calcRemainingTime,
    getUserLevelName,
    getStatusName,
    async getDetails() {
      this.$scrollTo('#__nuxt')
      this.registrationTimeline = false
      this.maxPage = 1
      this.currentPage = 1
      this.registrationTimeline = await this.$store.dispatch(
        'user/getRegistrationTimeline'
      )
      if (this.registrationTimeline) {
        this.maxPage = Math.ceil(
          this.registrationTimeline.users.length / this.limit
        )
      }
    },
    navPage(page) {
      this.$scrollTo('#userTable')
      this.currentPage = page
      this.detailsActiveItem = false
    },
    changeActiveDetails(activeItem) {
      this.detailsActiveItem = activeItem
    },
    deleteFilters() {
      this.selectedUserLevel = 0
      this.userFilter = ''
      this.getDetails()
    },
    async getUserData(name) {
      this.maxPage = 1
      this.currentPage = 1
      this.userFilterActive = true
      this.registrationTimeline.users = []
      const res = await this.$store.dispatch(
        'user/getRegistrationTimelineUser',
        { userName: name }
      )
      if (res) {
        this.registrationTimeline.users = res.users
        this.maxPage = Math.ceil(
          this.registrationTimeline.users.length / this.limit
        )
        this.userFilterActive = false
      }
    },
    async filter() {
      this.maxPage = 1
      this.currentPage = 1
      this.userFilterActive = true
      this.registrationTimeline.users = []
      const payload = {}
      if (this.userFilter !== '') {
        payload.nameFilter = this.userFilter
      }
      if (this.selectedUserLevel !== 0) {
        payload.levelFilter = this.registrationTimeline.choosableFFCLevels[
          this.selectedUserLevel - 1
        ]
      }
      if (Object.keys(payload).length !== 0) {
        payload.userName = this.registrationTimeline.userName
        const res = await this.$store.dispatch(
          'user/getRegistrationTimelineFilter',
          payload
        )
        if (res) {
          this.registrationTimeline.users = res.users
          this.maxPage = Math.ceil(
            this.registrationTimeline.users.length / this.limit
          )
          this.userFilterActive = false
        }
      } else {
        this.userFilterActive = false
        await this.getDetails()
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeRegTimelineTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeRegTimelineTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeRegTimelineTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
