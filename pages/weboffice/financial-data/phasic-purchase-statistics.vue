<template>
  <main>
    <LoadingLayerWeboffice v-if="phasicPurchase === false" />
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
            name: $t('weboffice.Statistics'),
            link: '/weboffice/financial-data/commission-statistics'
          },
          {
            name: $t('weboffice.PhasicPurchaseStatistics')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.PhasicPurchaseStatistics') }}
      </div>
      <div class="flex flex-col w-full mt-24">
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
          <div class="flex flex-col sm:flex-row pt-16 pb-12 px-16">
            <WebofficeSearchUserLoyaltyBonusNamesearch
              v-model="username"
              :label="$t('weboffice.Username')"
              :component-attr-id="'WebofficeSearchUserLoyaltyBonusNamesearch'"
              class="w-full sm:w-216 mb-3"
            />
            <ButtonSmall
              class="w-full sm:ml-16 mt-16 mb-4 sm:w-82"
              type="primary"
              :is-disabled="username.id === false"
              @click="getDetails"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
        <div
          class="flex flex-col py-20 px-16 text-sm leading-16 mt-16 bg-grey-light rounded"
        >
          <div class="flex flex-row">
            <div class="">{{ $t('weboffice.Sponsore') }}:</div>
            <div class="link ml-4">{{ phasicPurchase.sponsoreName }}</div>
          </div>
          <div class="flex flex-row mt-8">
            <div class="flex flex-wrap">
              <div class="mr-4">{{ $t('weboffice.Navigation') }}:</div>
              <div
                v-for="(member, memberKey) in phasicPurchase.members"
                v-show="member !== null"
                :key="memberKey"
                class="flex"
              >
                <div
                  :class="
                    memberKey !== phasicPurchase.members.length - 1
                      ? 'cursor-pointer link'
                      : ''
                  "
                  @click="
                    memberKey !== phasicPurchase.members.length - 1
                      ? selectUsername(member)
                      : false
                  "
                >
                  {{ member }}
                </div>
                <div
                  v-show="memberKey < phasicPurchase.members.length - 1"
                  class="mx-4"
                >
                  >
                </div>
              </div>
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
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 700px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.User') }}
                  </th>
                  <th class="py-14 px-8 text-left w-128">
                    {{ $t('weboffice.CurrentPackage') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CompletedStages') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.UnitsPurchasedWithinTheCurrentStage') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Depth') }}
                  </th>
                  <th class="w-128"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(row, rowKey) in getDetailsTableData">
                  <tr
                    :key="rowKey"
                    :class="
                      rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''
                    "
                  >
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.userName }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ levelNames[row.currentLevelName] }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.completedStep }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.completedPart }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.level }}
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
                  <tr
                    v-show="activeKey === rowKey"
                    :key="'second-' + rowKey"
                    class=""
                  >
                    <td
                      colspan="6"
                      class="bg-grey-light bg-opacity-30 border border-grey-light"
                    >
                      <div
                        class="flex flex-col py-13 px-8 border-t border-b text-sm leading-14"
                      >
                        <WebofficeStepProgress
                          :title="
                            stepProgressTitle1.replace(
                              '__activeCount__',
                              row.completedStep
                            )
                          "
                          :length="7"
                          :active="row.completedStep"
                          :inactive-type="'verticalLine'"
                          class="w-full"
                        />
                        <WebofficeStepProgress
                          :title="
                            stepProgressTitle2.replace(
                              '__activeCount__',
                              row.completedPart
                            )
                          "
                          :length="3"
                          :active="row.completedPart"
                          :inactive-type="'checklist'"
                          class="w-full mt-24"
                        />
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="phasicPurchase !== false && maxPage > 1"
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
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'
import WebofficeStepProgress from '@/components/weboffice/WebofficeStepProgress'
import WebofficeSearchUserLoyaltyBonusNamesearch from '@/components/weboffice/WebofficeSearchUserLoyaltyBonusNamesearch'
import ButtonSmall from '@/components/micro/ButtonSmall'
import { getPerPageLimit } from '@/includes/utils'

export default {
  name: 'PhasicPurchasePage',
  middleware: 'auth_needed',
  components: {
    WebofficeStepProgress,
    Scrollbar,
    Pagination,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    WebofficeSearchUserLoyaltyBonusNamesearch,
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
      phasicPurchase: false,
      currentPage: 1,
      maxPage: 1,
      activeKey: false,
      levelNames: {
        BASIC: this.$t('weboffice.PackageTypeBasic'),
        SMART: this.$t('weboffice.PackageTypeSmart'),
        LIFE: this.$t('weboffice.PackageTypeLife'),
        FREE: this.$t('weboffice.PackageTypeFree')
      },
      stepProgressTitle1:
        this.$t('weboffice.CompletedStages') +
        ': <span class="text-primary">__activeCount__</span> / 7',
      stepProgressTitle2:
        this.$t('weboffice.UnitsPurchasedForTheCompletionOfTheStageStep') +
        ': <span class="text-primary">__activeCount__</span> / 3',
      username: {
        id: false,
        text: ''
      }
    }
  },
  computed: {
    getDetailsTableData() {
      return this.phasicPurchase.statisticDatas.slice(
        (this.currentPage - 1) * this.limit,
        (this.currentPage - 1) * this.limit + this.limit
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
      this.$scrollTo('#__nuxt')
      this.phasicPurchase = false
      this.currentPage = 1
      this.activeKey = false
      const payload = {}
      if (this.username.id !== false) {
        payload.username = this.username.text
      }
      this.phasicPurchase = await this.$store.dispatch(
        'user/getPhasicPurchaseStatistics',
        payload
      )
      this.maxPage = Math.ceil(
        this.phasicPurchase.statisticDatas.length / this.limit
      )
    },
    navPage(page) {
      this.currentPage = page
      this.activeKey = false
      this.$scrollTo('#__nuxt')
    },
    showDetails(key) {
      if (this.activeKey === key) {
        this.activeKey = false
      } else {
        this.activeKey = key
      }
    },
    deleteUserFilters() {
      this.username = {
        id: false,
        text: ''
      }
      this.getDetails()
    },
    selectUsername(username) {
      this.username = {
        id: 1,
        text: username
      }
      this.getDetails()
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePhasicPurchaseStatTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePhasicPurchaseStatTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePhasicPurchaseStatTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
