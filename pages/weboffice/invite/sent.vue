<template>
  <main>
    <LoadingLayerWeboffice v-if="invites === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.RecommendService'),
            link: '/weboffice/invite'
          },
          {
            name: $t('weboffice.SentInvitations')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.SentInvitations') }}
      </div>
      <div class="w-full p-16 bg-pink flex flex-row">
        {{ $t('weboffice.InvitationTimeLimitWarning') }}
      </div>

      <div class="flex flex-col w-full">
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 460px"
          >
            <thead class="font-bold">
              <tr>
                <th
                  class="py-14 px-8 text-left cursor-pointer"
                  @click="changeOrder('createDate')"
                >
                  {{ $t('weboffice.Date') }}
                  <i
                    v-show="order === 'createDate'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer lg:w-5/12"
                  @click="changeOrder('email')"
                >
                  {{ $t('weboffice.Email') }}
                  <i
                    v-show="order === 'email'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th
                  class="py-14 px-8 text-left cursor-pointer"
                  @click="changeOrder('newStatus')"
                >
                  {{ $t('weboffice.Status') }}
                  <i
                    v-show="order === 'newStatus'"
                    :class="
                      orderDirection === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    "
                    class="fa"
                  />
                </th>
                <th class="py-14 px-8" style="min-width: 205px;"></th>
              </tr>
            </thead>
            <tbody v-if="invites.sentInvitations !== undefined">
              <tr
                v-for="(row, rowKey) in invites.sentInvitations.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.createDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.email }}
                </td>
                <td
                  class="py-13 px-8 border border-grey-light text-left"
                  :class="getStatusClass(row.newStatus)"
                >
                  <i
                    v-show="row.newStatus === 'filledprofile'"
                    class="fas fa-check-circle text-white"
                  ></i>
                  {{ getStatus(row.newStatus) }}
                </td>
                <td class="border border-grey-light text-left">
                  <span v-if="row.newStatus == 'signedup'">
                    <ButtonSmall
                      type="transparent-noborder"
                      @click="reSend('reg', row.email, rowKey)"
                    >
                      {{ $t('weboffice.ResendConfirmButton') }}
                    </ButtonSmall>
                    <i
                      v-show="row.success !== undefined ? row.success : false"
                      class="fas fa-check-circle text-primary -ml-10"
                    ></i>
                  </span>
                  <span v-if="row.newStatus == 'Invited'">
                    <ButtonSmall
                      type="transparent-noborder"
                      @click="reSend('lead', row.email, rowKey)"
                    >
                      {{ $t('weboffice.ResendInviteButton') }}
                    </ButtonSmall>
                    <i
                      v-show="row.success !== undefined ? row.success : false"
                      class="fas fa-check-circle text-primary -ml-10"
                    ></i>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="invites !== false && maxPage > 1"
            :max-pages="maxPage"
            :current-page="currentPage"
            @click="navPage"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'
import ButtonSmall from '@/components/micro/ButtonSmall'
import { getPerPageLimit, orderBy } from '@/includes/utils'

export default {
  name: 'SentInvitePage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    Pagination,
    LoadingLayerWeboffice,
    ButtonSmall,
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
      currentPage: 1,
      maxPage: 1,
      invites: false,
      order: 'createDate',
      orderDirection: 1,
      status: {
        Invited: this.$t('weboffice.StatusInvited'),
        signedup: this.$t('weboffice.StatusRegistered'),
        approvedsingup: this.$t('weboffice.ApprovedSingup'),
        filledprofile: this.$t('weboffice.FilledProfile')
      },
      statusClass: {
        Invited: 'bg-grey-light text-grey-dark font-bold',
        signedup: 'bg-warning-opaque text-warning-dark font-bold',
        approvedsingup: 'bg-primary-light text-primary-dark font-bold',
        filledprofile: 'bg-primary text-white font-bold'
      }
    }
  },
  computed: {
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    orderBy,
    async getDetails() {
      this.invites = await this.$store.dispatch('user/getSentInvites')
      if (this.invites.sentInvitations !== undefined) {
        this.invites.sentInvitations = this.invites.sentInvitations.sort(
          (a, b) => (a[this.order] > b[this.order] ? 1 : -1)
        )

        if (this.orderDirection === 1) {
          this.invites.sentInvitations.reverse()
        }
      }
      this.maxPage = this.invites.sentInvitations
        ? Math.ceil(this.invites.sentInvitations.length / this.limit)
        : 0
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    },
    getStatus(statusname) {
      return this.status[statusname] !== undefined
        ? this.status[statusname]
        : statusname
    },
    getStatusClass(statusname) {
      return this.statusClass[statusname] !== undefined
        ? this.statusClass[statusname]
        : statusname
    },
    async reSend(type, email, key) {
      let res = false
      this.invites.sentInvitations[key].success = false

      if (type === 'lead') {
        res = await this.$store.dispatch('user/reSendLeadMail', {
          email: email ?? ''
        })
      } else if (type === 'reg') {
        res = await this.$store.dispatch('user/reSendRegMail', {
          email: email ?? ''
        })
      }

      if (res.error !== undefined) {
        if (res.error === true) {
          this.$store.dispatch('general/showSnackbar', {
            message: this.fetchErrors(res.error_message)
          })
          this.$forceUpdate()
        } else {
          this.invites.sentInvitations[key].success = true
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.ResendSuccess')
          })
          this.$forceUpdate()
        }
      }
    },
    fetchErrors(errors) {
      console.log(errors)
      let str = ''
      errors.forEach((error, index) => {
        if (errors.length > 1) {
          if (index === errors.length - 1) {
            str += this.$t('weboffice.Error' + error)
          } else {
            str += this.$t('weboffice.Error' + error) + ', '
          }
        } else {
          str = this.$t('weboffice.Error' + error)
        }
      })
      return str
    },
    changeOrder(type) {
      if (type === this.order) {
        this.orderDirection *= -1
      } else {
        this.order = type
        this.orderDirection = 1
      }

      this.currentPage = 1

      this.invites.sentInvitations = this.invites.sentInvitations.sort((a, b) =>
        a[this.order] > b[this.order] ? 1 : -1
      )

      if (this.orderDirection === 1) {
        this.invites.sentInvitations.reverse()
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeInviteSentTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeInviteSentTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeInviteSentTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
