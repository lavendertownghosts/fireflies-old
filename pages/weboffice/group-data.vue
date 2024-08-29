<template>
  <main>
    <LoadingLayerWeboffice v-if="groupData === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.GroupData')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.GroupData') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <WebofficeCard :title="$t('weboffice.GroupConsistence')">
          <div class="flex flex-col md:flex-row">
            <div class="flex flex-row md:w-1/3 items-end">
              <div class="text-lg leading-24">
                {{ formatPoint(groupData.details.distributor) }}
              </div>
              <div class="text-xs leading-12 ml-4">
                {{ $t('weboffice.Distributor') }}
              </div>
            </div>
            <div class="flex flex-row mt-8 md:mt-0 md:w-1/3 items-end">
              <div class="text-lg leading-24">
                {{ formatPoint(groupData.details.user) }}
              </div>
              <div class="text-xs leading-12 ml-4">
                {{ $t('weboffice.User') }}
              </div>
            </div>
            <div class="flex flex-row mt-8 md:mt-0 md:w-1/3 items-end">
              <div class="text-lg leading-24">
                {{ formatPoint(groupData.details.free) }}
              </div>
              <div class="text-xs leading-12 ml-4">
                {{ $t('weboffice.FreeUser') }}
              </div>
            </div>
          </div>
        </WebofficeCard>
        <div class="flex items-center text-lg leading-24 font-bold mt-24">
          {{ $t('weboffice.Distributors') }}
        </div>
        <div
          class="flex flex-col py-20 px-16 text-sm leading-14 mt-16 bg-grey-light rounded"
        >
          <div class="flex flex-row">
            <div class="">{{ $t('weboffice.Sponsore') }}:</div>
            <div class="link ml-4">{{ groupData.sponsoreName }}</div>
          </div>
          <div class="mt-8">
            {{ $t('weboffice.Navigation') }}:
            <span v-show="!loadingUserList">
              <template v-for="(username, index) in selectedUserList">
                <span
                  :key="index + Math.random() * 10"
                  class="link cursor-pointer"
                  :class="
                    loadingUserList ? 'opacity-50 pointer-events-none' : ''
                  "
                  @click="getUsers(username)"
                  >{{ username }}
                </span>
                <span
                  v-if="index !== selectedUserList.length - 1"
                  :key="index"
                  class="px-4"
                >
                  >
                </span>
              </template>
              <span v-show="selectedUserList.length == 0">NaN</span>
            </span>
            <span v-show="loadingUserList">
              {{ $t('weboffice.LoadingLayerTitle') }}...
            </span>
          </div>
        </div>
        <div class="border border-grey-light rounded mt-24">
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">{{ $t('weboffice.Filter') }}</div>
            <div
              class="flex link cursor-pointer"
              @click="deleteDistributorFilters"
            >
              {{ $t('weboffice.DeleteFilters') }}
            </div>
          </div>
          <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
            <InputDateRange
              v-model="distributorDates"
              :is-dark="false"
              :label-checkin="$t('general.DateFrom')"
              :label-checkout="$t('general.DateTo')"
              class="flex flex-row w-2/3 lg:w-auto"
              :input-style="['mr-8']"
              :wrapper-style-checkin="['lg:pr-0']"
              :wrapper-style-checkout="['lg:pl-0']"
              :input-style-checkin="['lg:w-100']"
              :input-style-checkout="['lg:w-100']"
              :disable-past="false"
              :is-nights="false"
            />
            <InputDropdown
              v-model="selectedUserLevel"
              :values="getFFCLevels"
              :label="$t('weboffice.LevelFilter')"
              :is-dark="false"
              :class="'w-full mt-8 lg:mt-0'"
            />
            <InputUserGroupNameSearch
              v-model="userFilter"
              :component-attr-id="'Namesearch'"
              :class="'mt-11 lg:px-8 w-full'"
            />
            <ButtonSmall
              class="w-full mt-16 mb-4 md:w-82"
              type="primary"
              @click="filterUsers()"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
        <LoadingLayerWeboffice v-show="loadingUserList" />
        <div v-show="!loadingUserList" class="flex flex-col w-full mt-16">
          <div class="flex flex-col w-full mt-24" style="max-width: 919px;">
            <Scrollbar
              :centered="false"
              class="pr-1"
              :style="'max-width: ' + scrollbarMaxWidth + 'px'"
            >
              <table
                id="userList"
                class="table-auto text-sm leading-14 text-black w-full"
                style="min-width: 1280px"
              >
                <thead class="font-bold">
                  <tr>
                    <th class="py-14 px-8 text-left"></th>
                    <th class="py-14 px-8 text-left">
                      {{ $t('weboffice.CareerLevel') }}
                    </th>
                    <th class="py-14 px-8 text-left">
                      {{ $t('weboffice.MLMUser') }}
                    </th>
                    <th class="py-14 px-8 text-left">
                      {{ $t('weboffice.UserList') }}
                    </th>
                    <th class="py-14 px-8 text-left">
                      {{ $t('weboffice.FreeUsers') }}
                    </th>
                    <th class="py-14 px-8 text-left">
                      {{ $t('weboffice.QualificationPoints') }}
                    </th>
                    <th class="py-14 px-8 text-left">
                      {{
                        $t('weboffice.TotalOfQualificationPointsFromThisUser')
                      }}
                    </th>
                    <th
                      v-if="selectedUserList.length <= 1"
                      class="py-14 px-8 text-left"
                    >
                      {{ $t('weboffice.Fullname') }}
                    </th>
                    <th
                      v-if="selectedUserList.length <= 1"
                      class="py-14 px-8 text-left"
                    >
                      {{ $t('weboffice.Email') }}
                    </th>
                    <th class="py-14 px-8 text-left">
                      {{ $t('weboffice.Powerline') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(user, rowKey) in getUserList"
                    :key="rowKey"
                    :class="
                      rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''
                    "
                  >
                    <td class="py-13 px-8 border border-grey-light">
                      <div
                        :class="
                          user.phantom === undefined
                            ? 'link cursor-pointer'
                            : ''
                        "
                        @click="
                          user.phantom === undefined
                            ? getUsers(user.name, user)
                            : false
                        "
                        v-html="
                          user.name +
                            (user.transmitted
                              ? ' (' + $t('weboffice.TransferredFront') + ')'
                              : '')
                        "
                      ></div>
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ getUserLevelName(user.level) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ formatPoint(user.MLMUserCount) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ formatPoint(user.UserCount) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ formatPoint(user.freeUserCount) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ formatPoint(user.sumQualificationPoint) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ formatPoint(user.ownQualificationPonts) }}
                    </td>
                    <td
                      v-if="selectedUserList.length <= 1"
                      class="py-13 px-8 border border-grey-light"
                    >
                      <span>{{ user.fullname }}</span>
                    </td>
                    <td
                      v-if="selectedUserList.length <= 1"
                      class="py-13 px-8 border border-grey-light"
                    >
                      <span>{{ user.email }}</span>
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      <span>
                        <i
                          v-if="user.hasforceLinePoint"
                          class="fas fa-check"
                        ></i>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Scrollbar>
            <div class="flex justify-center mt-24">
              <Pagination
                v-if="maxPage > 1"
                :max-pages="maxPage"
                :current-page="currentPage"
                @click="navPage"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center text-lg leading-24 font-bold mt-24">
          {{ $t('weboffice.NewUsersInMyGroup') }}
        </div>
        <div class="border border-grey-light rounded mt-24">
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">{{ $t('weboffice.Filter') }}</div>
            <div class="flex link cursor-pointer" @click="deleteNewUserFilters">
              {{ $t('weboffice.DeleteFilters') }}
            </div>
          </div>
          <div class="flex flex-col md:flex-row pt-16 pb-12 px-16">
            <InputDateRange
              v-model="newUserDates"
              :is-dark="false"
              :label-checkin="$t('general.DateFrom')"
              :label-checkout="$t('general.DateTo')"
              class="flex flex-row w-2/3 md:w-auto"
              :input-style="['mr-8']"
              :wrapper-style-checkin="['md:pr-0']"
              :wrapper-style-checkout="['md:pl-0']"
              :input-style-checkin="['md:w-100']"
              :input-style-checkout="['md:w-100']"
              :disable-past="false"
              :is-nights="false"
            />
            <ButtonSmall
              class="w-full mt-16 mb-4 md:ml-8 md:w-82"
              type="primary"
              @click="getNewUsers"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
        <LoadingLayerWeboffice v-if="loadingNewUserCount" />
        <WebofficeCard
          v-else
          :title="$t('weboffice.NewUsersInMyGroup')"
          class="mt-24"
        >
          <div class="flex flex-col md:flex-row">
            <div class="flex flex-row md:w-1/3 items-end">
              <div class="text-lg leading-24">
                {{ formatPoint(newDistributor) }}
              </div>
              <div class="text-xs leading-12 ml-4">
                {{ $t('weboffice.Distributor') }}
              </div>
            </div>
            <div class="flex flex-row mt-8 md:mt-0 md:w-1/3 items-end">
              <div class="text-lg leading-24">
                {{ formatPoint(newUser) }}
              </div>
              <div class="text-xs leading-12 ml-4">
                {{ $t('weboffice.User') }}
              </div>
            </div>
            <div class="flex flex-row mt-8 md:mt-0 md:w-1/3 items-end">
              <div class="text-lg leading-24">
                {{ formatPoint(newFree) }}
              </div>
              <div class="text-xs leading-12 ml-4">
                {{ $t('weboffice.FreeUser') }}
              </div>
            </div>
          </div>
        </WebofficeCard>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { formatPoint, getUserLevelName, toPascalCase } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import InputDateRange from '@/components/micro/InputDateRange'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDropdown from '@/components/micro/InputDropdown'
import InputUserGroupNameSearch from '@/components/micro/InputUserGroupNameSearch'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '~/components/Pagination'

export default {
  name: 'GroupDataPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    InputDropdown,
    InputUserGroupNameSearch,
    ButtonSmall,
    InputDateRange,
    WebofficeCard,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    Pagination
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      groupData: false,
      newUserDates: {
        date1: format(new Date(), 'yyyy-LL-dd'),
        date2: format(new Date(), 'yyyy-LL-dd')
      },
      distributorDates: {
        date1: '2014-01-01',
        date2: format(new Date(), 'yyyy-LL-dd')
      },
      newDistributor: 0,
      newUser: 0,
      newFree: 0,
      loadingNewUserCount: false,
      loadingUserList: false,
      userProps: false,
      levelKeys: [
        'ZERO',
        'FRONT3',
        'EC',
        'DEC',
        'GOLD',
        'FOUNDERGOLD',
        'PLATINUM',
        'FOUNDERPLATINUM',
        'EMERALD',
        'FOUNDEREMERALD',
        'DIAMOND'
      ],
      selectedUserLevel: 0,
      userFilter: '',
      userList: [],
      currentPage: 1,
      maxPage: 1,
      limit: 15,
      selectedUserList: [],
      selectUserTransmissionModal: false,
      doUserTransmissionModalActive: false,
      selectedUserTransmission: false,
      doUserTransmissionInProgress: false,
      citTranslate: ['phantom_lane_vip_step']
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getFFCLevels() {
      const levels = [this.$t('general.PleaseSelect')]
      this.levelKeys.forEach((levelCode) => {
        levels.push(getUserLevelName(levelCode))
      })
      return levels
    },
    getUserList() {
      let tmp = []
      const lvltmp = []
      this.userList.forEach((element, index) => {
        if (element.transmitted) {
          if (
            element.transToUserName !==
            this.selectedUserList[this.selectedUserList.length - 1]
          ) {
            element.sumQualificationPoint = 0
            element.ownQualificationPonts = 0
          }
          if (this.selectedUserList.length - 1 > 1) {
            element.email = false
            element.fullname = false
          }
        } else {
          element.sumQualificationPoint = parseInt(
            String(element.sumQualificationPoint).replace(' ', '')
          )
          element.ownQualificationPonts = parseInt(
            String(element.ownQualificationPonts).replace(' ', '')
          )
        }
        if (element.level === '') {
          lvltmp.push(element)
        } else {
          tmp.push(element)
        }
      })
      tmp = tmp
        .sort(function(a, b) {
          return (
            parseInt(String(a.sumQualificationPoint).replace(' ', '')) -
            parseInt(String(b.sumQualificationPoint).replace(' ', ''))
          )
        })
        .reverse()
      tmp = tmp.concat(lvltmp)
      return tmp.slice(
        (this.currentPage - 1) * this.limit,
        (this.currentPage - 1) * this.limit + this.limit
      )
    },
    getDistributorTableData() {
      return []
    }
  },
  mounted() {
    this.getDetails()
    this.getNewUsers()
    this.selectedUserList = [this.getFees.username]
  },
  methods: {
    async getDetails() {
      this.$scrollTo('#__nuxt')
      this.groupData = false
      this.userProps = await this.$store.dispatch('user/getPersonalData')
      try {
        this.groupData = await this.$store.dispatch('user/getGroupData')
      } catch (e) {
        let body = await e.response
        if (body && e.response !== undefined) {
          body = await e.response.json()
          if (body.messages !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: body.messages
            })
          }
        }
      }
      if (this.groupData) {
        this.userList = [
          {
            name: this.groupData.userName,
            level: this.groupData.userLevel,
            MLMUserCount: this.groupData.details.distributor,
            UserCount: this.groupData.details.user,
            freeUserCount: this.groupData.details.free,
            ownQualificationPonts: this.groupData.ownQualificationPoints,
            sumQualificationPoint: this.groupData.qualificationPoints,
            fullname: this.userProps.FULLNAME,
            email: this.getFees.email,
            hasforceLinePoint: this.groupData.hasforceLinePoint
          }
        ]
        if (
          this.groupData.usersForTransmission &&
          this.groupData.usersForTransmission.length > 0
        ) {
          this.groupData.usersForTransmission.forEach((userForTransmission) => {
            userForTransmission.nameSearch = {
              text: '',
              id: false
            }
          })
        }
      }
    },
    formatPoint(point) {
      point = (point + '').replace(/ /g, '')
      return formatPoint(point)
    },
    deleteNewUserFilters() {
      this.newUserDates.date1 = format(new Date(), 'yyyy-LL-dd')
      this.newUserDates.date2 = format(new Date(), 'yyyy-LL-dd')
      this.newDistributor = this.groupData.details.newdistributor
      this.newUser = this.groupData.details.newuser
      this.newFree = this.groupData.details.newfree
      this.getNewUsers()
    },
    deleteDistributorFilters() {
      this.distributorDates.date1 = '2014-01-01'
      this.distributorDates.date2 = format(new Date(), 'yyyy-LL-dd')
      this.selectedUserLevel = 0
      this.userFilter = ''
      this.getUsers()
    },
    async getNewUsers() {
      this.loadingNewUserCount = true
      const newUsers = await this.$store.dispatch('user/getNewUserCounter', {
        from: this.newUserDates.date1,
        to: this.newUserDates.date2
      })
      if (newUsers !== undefined) {
        if (Object.entries(newUsers).length > 0) {
          this.newDistributor = newUsers.distributor
          this.newUser = newUsers.user
          this.newFree = newUsers.free
        }
      }
      this.loadingNewUserCount = false
    },
    async getUsers(username = false, user = {}) {
      if (username !== false) {
        if (!this.selectedUserList.includes(username)) {
          this.selectedUserList.push(username)
        } else {
          this.selectedUserList = this.selectedUserList.slice(
            0,
            this.selectedUserList.indexOf(username) + 1
          )
        }
      } else {
        this.selectedUserList = [this.getFees.username]
      }
      this.currentPage = 1
      this.maxPage = 1
      this.loadingUserList = true
      const payload = {
        userName: this.selectedUserList.slice(-1).pop(),
        nameFilter: this.userFilter,
        levelFilter: '',
        fromDateFilter: this.distributorDates.date1,
        toDateFilter: this.distributorDates.date2,
        lang: this.$i18n.locale
      }
      if (this.selectedUserLevel !== 0 && username === false) {
        payload.levelFilter = this.levelKeys[this.selectedUserLevel - 1]
      }

      let responses
      try {
        responses = await Promise.all([
          this.$store.dispatch('user/getUserList', payload),
          this.$store.dispatch('user/getUserLine', {
            nameFilter: this.selectedUserList.slice(-1).pop()
          })
        ])
      } catch (e) {
        console.log(e)
      }

      const [responseUserList, responseUserLine] = responses

      this.userList =
        responseUserList.users !== undefined ? responseUserList.users : []

      if (responseUserLine !== '') {
        if (responseUserLine.length > 0) {
          this.selectedUserList = responseUserLine.split(',')
        } else {
          this.selectedUserList = []
        }
      } else {
        this.selectedUserList = []
      }

      if (this.selectedUserList.length === 0) {
        if (user.realParent !== undefined) {
          if (user.realParent === false) {
            this.selectedUserList = [this.groupData.userName, user.name]
          }
        }
      }

      this.userList.forEach((item) => {
        this.citTranslate.forEach((translate) => {
          if (item.name === translate) {
            item.name = this.$t('weboffice.' + toPascalCase(translate))
          }
        })
      })

      this.maxPage =
        this.userList !== undefined
          ? Math.ceil(this.userList.length / this.limit)
          : 0
      this.loadingUserList = false
    },
    async filterUsers() {
      if (this.userFilter.text !== '') {
        this.currentPage = 1
        this.maxPage = 1
        this.loadingUserList = true
        const payload = {
          userName: this.userFilter.text === '' ?? this.getFees.username,
          levelFilter: '',
          fromDateFilter: this.distributorDates.date1,
          toDateFilter: this.distributorDates.date2
        }
        if (this.selectedUserLevel !== 0) {
          payload.levelFilter = this.levelKeys[this.selectedUserLevel - 1]
        }
        let res
        try {
          res = await this.$store.dispatch('user/getUserList', payload)
        } catch (error) {
          console.log(error)
        }
        this.userList = res.users !== undefined ? res.users : []

        if (this.userFilter.line !== undefined) {
          this.selectedUserList = this.userFilter.line.split(',')
        }
        this.maxPage =
          this.userList !== undefined
            ? Math.ceil(this.userList.length / this.limit)
            : 0
        this.loadingUserList = false
      }
    },
    getUserLevelName(level) {
      return getUserLevelName(level)
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#userList')
    }
  },
  head() {
    return {
      title: this.$t('meta.WebofficeGroupTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeGroupTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeGroupTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
