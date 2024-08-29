<template>
  <main>
    <LoadingLayerWeboffice v-if="data === false" />
    <div v-else class="text-black">
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        {{ $t('general.WebOffice') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-col lg:flex-row">
          <div class="flex flex-col w-full lg:w-2/3 lg:pr-8">
            <div class="flex flex-col sm:flex-row">
              <div class="sm:w-1/2 sm:pr-8">
                <WebofficeCard
                  :title="$t('weboffice.PayoutPointsWaitingForTransfer')"
                  :content-style="'py-13 xl:py-20 px-16'"
                >
                  <div class="flex flex-col">
                    <div class="flex flex-col xl:flex-row xl:items-end">
                      <div class="flex text-lg leading-24">
                        EUR
                        {{ formatPoint(data.result.payoutPoints.sumPoints) }}
                      </div>
                      <div class="flex text-xs leading-12 xl:ml-4 mb-2">
                        {{ $t('weboffice.PaymentPoint') }}
                      </div>
                    </div>
                    <div class="mt-8 text-sm leading-14">
                      <nuxt-link
                        :to="
                          localePath('/weboffice/financial-data/current-points')
                        "
                        class="link cursor-pointer"
                        >{{ $t('general.Details') }}</nuxt-link
                      >
                    </div>
                  </div>
                </WebofficeCard>
              </div>
              <div class="mt-16 sm:mt-0 sm:w-1/2 sm:pl-8">
                <WebofficeCard
                  :title="$t('weboffice.TurnoverStatistics')"
                  :subtitle="flowStatisticDates"
                >
                  <div v-if="data.result !== undefined" class="flex flex-col">
                    <div class="text-lg leading-24">
                      EUR
                      {{ formatPoint(getTotalFlowStat) }}
                    </div>
                    <div class="mt-8 text-sm leading-14">
                      <nuxt-link
                        :to="
                          localePath(
                            '/weboffice/financial-data/turnover-statistics'
                          )
                        "
                        class="link cursor-pointer"
                        >{{ $t('general.Details') }}</nuxt-link
                      >
                    </div>
                  </div>
                </WebofficeCard>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row mt-16">
              <div class="sm:w-1/2 sm:pr-8">
                <WebofficeCard
                  v-if="false"
                  :title="$t('weboffice.CapitalBonusPoints')"
                  :subtitle="
                    data.result.bonus.name !== undefined
                      ? data.result.bonus.name
                      : ''
                  "
                >
                  <div class="flex flex-col">
                    <div class="flex flex-row items-end">
                      <div class="flex text-lg leading-24">
                        {{
                          data.result.bonus[3]
                            ? formatPoint(data.result.bonus[3].sum)
                            : 0
                        }}
                      </div>
                      <div class="flex text-xs leading-12 ml-4 mb-2">
                        {{ $t('weboffice.QualificationPoints') }}
                      </div>
                    </div>
                    <div class="mt-8 text-sm leading-14">
                      <nuxt-link
                        :to="localePath('/weboffice/bonuses/capital-bonus')"
                        class="link cursor-pointer"
                        >{{ $t('general.Details') }}</nuxt-link
                      >
                    </div>
                  </div>
                </WebofficeCard>
              </div>
              <div class="mt-16 sm:mt-0 sm:w-1/2 sm:pl-8">
                <WebofficeCard
                  v-if="false"
                  :title="$t('weboffice.StartCapitalShareBonusPoints')"
                  content-style=""
                  class="relative"
                >
                  <div
                    v-if="data.result !== undefined"
                    ref="startCapitalBonus"
                    class="flex flex-col px-16 py-15"
                  >
                    <div class="flex flex-row items-center">
                      <div
                        v-for="i in 6"
                        :key="i"
                        class="flex text-center items-center"
                      >
                        <div
                          :class="
                            i <= getStartCapitalCount
                              ? 'bg-primary'
                              : 'bg-white'
                          "
                          class="flex w-18 h-18 rounded-full mr-4 items-center justify-center border-2 border-primary"
                        >
                          <i
                            :class="i <= getStartCapitalCount ? 'fa-check' : ''"
                            class="fas text-white text-xs leading-16"
                          ></i>
                        </div>
                        <i
                          v-if="i === 3"
                          class="fal fa-grip-lines-vertical text-grey-dark mr-4"
                        ></i>
                      </div>
                    </div>
                    <div class="relative w-full mt-12">
                      <div
                        class="overflow-hidden h-4 flex bg-grey-light rounded-full"
                      >
                        <div
                          :style="
                            'width:' +
                              getWidthPercent(
                                parseFloat(
                                  data.result.bonus.sumQualificationPoints
                                ) % parseFloat(data.result.bonus.nextPointQps),
                                data.result.bonus.nextPointQps
                              ) +
                              '%'
                          "
                          class="flex flex-col justify-center bg-primary rounded-full"
                        ></div>
                      </div>
                    </div>
                    <div class="mt-8 text-sm leading-14 relative">
                      <div
                        class="link cursor-pointer"
                        @click="
                          activeStartCapitalBonusDetails = !activeStartCapitalBonusDetails
                        "
                      >
                        {{ $t('general.Details') }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-show="activeStartCapitalBonusDetails"
                    class="absolute z-20 bg-white rounded text-black shadow-drop top-0 mt-16 right-0 w-full p-16 text-center text-sm leading-20 text-black"
                  >
                    <div class="font-bold">
                      {{ $t('weboffice.CollectedQualificationPoints') }}
                    </div>
                    <div class="flex flex-row w-full justify-center">
                      <div class="text-primary font-bold">
                        {{
                          formatPoint(data.result.bonus.sumQualificationPoints)
                        }}
                      </div>
                      <div class="mx-4">/</div>
                      <div>
                        {{ formatPoint(data.result.bonus.nextPointQps) }}
                      </div>
                    </div>
                  </div>
                </WebofficeCard>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row mt-16">
              <div class="sm:w-1/2 sm:pr-8">
                <WebofficeCard
                  :title="$t('weboffice.LoyaltyCycleBonusPositions')"
                >
                  <div class="flex flex-col">
                    <div class="flex flex-row items-end">
                      <div class="flex text-lg leading-24">
                        {{ formatPoint(data.result.loyalty.own) }}
                      </div>
                      <div class="flex text-xs leading-12 mx-4 mb-2">
                        {{ $t('weboffice.ActivePosition') }}
                      </div>
                      <div class="flex text-lg leading-24">
                        + {{ formatPoint(data.result.loyalty.extraCount) }}
                      </div>
                      <div class="flex text-xs leading-12 ml-4 mb-2">
                        {{ $t('weboffice.ExtraPosition') }}
                      </div>
                    </div>
                    <div class="flex flex-row items-end">
                      <div class="flex text-lg leading-24">
                        {{ formatPoint(data.result.loyalty.bonusCount) }}
                      </div>
                      <div class="flex text-xs leading-12 mx-4 mb-2">
                        {{ $t('weboffice.BonusPosition') }}
                      </div>
                    </div>
                    <div class="mt-8 text-sm leading-14">
                      <nuxt-link
                        :to="localePath('/weboffice/loyalty-cycle/position')"
                        class="link cursor-pointer"
                        >{{ $t('general.Details') }}</nuxt-link
                      >
                    </div>
                  </div>
                </WebofficeCard>
              </div>
              <div class="mt-16 sm:mt-0 sm:w-1/2 sm:pl-8">
                <WebofficeCard :title="$t('weboffice.VipCycleBonusPositions')">
                  <div v-if="data.result !== undefined" class="flex flex-col">
                    <div class="flex flex-row items-end">
                      <div class="flex text-lg leading-24">
                        {{ formatPoint(data.result.loyaltyVIP.own) }}
                      </div>
                      <div class="flex text-xs leading-12 ml-4 mb-2">
                        {{ $t('weboffice.ActivePosition') }}
                      </div>
                    </div>
                    <div class="mt-8 text-sm leading-14">
                      <nuxt-link
                        :to="localePath('/weboffice/vip-cycle/position')"
                        class="link cursor-pointer"
                        >{{ $t('general.Details') }}</nuxt-link
                      >
                    </div>
                  </div>
                </WebofficeCard>
              </div>
            </div>
            <div class="flex flex-row mt-16">
              <WebofficeCard
                :title="$t('weboffice.NewUsersInMyGroup')"
                class="w-full"
              >
                <div v-if="data.result !== undefined" class="flex flex-row">
                  <div class="flex flex-row w-1/3 items-end">
                    <div class="text-lg leading-24">
                      {{ formatPoint(data.result.users.newdistributorCount) }}
                    </div>
                    <div class="text-xs leading-12 ml-4">
                      {{ $t('weboffice.Distributor') }}
                    </div>
                  </div>
                  <div class="flex flex-row mt-0 w-1/3 items-end">
                    <div class="text-lg leading-24">
                      {{ formatPoint(data.result.users.newuserCount) }}
                    </div>
                    <div class="text-xs leading-12 ml-4">
                      {{ $t('weboffice.User') }}
                    </div>
                  </div>
                  <div class="flex flex-row mt-0 w-1/3 items-end">
                    <div class="text-lg leading-24">
                      {{ formatPoint(data.result.users.newfreeUserCount) }}
                    </div>
                    <div class="text-xs leading-12 ml-4">
                      {{ $t('weboffice.FreeUser') }}
                    </div>
                  </div>
                </div>
                <div class="mt-8 text-sm leading-14">
                  <nuxt-link
                    :to="localePath('/weboffice/group-data')"
                    class="link cursor-pointer"
                    >{{ $t('general.Details') }}</nuxt-link
                  >
                </div>
              </WebofficeCard>
            </div>
            <div class="flex flex-row mt-16">
              <WebofficeCard
                v-if="false"
                :title="$t('weboffice.TravelContest')"
                class="w-full"
              >
                <Scrollbar :centered="false" class="pr-1">
                  <div class="w-full" style="min-width: 600px">
                    <div
                      class="flex flex-row text-xs leading-12 font-bold h-32 items-center"
                    >
                      <div class="w-1/4">
                        {{ $t('weboffice.TravelPoints') }}
                      </div>
                      <div class="w-1/4">
                        {{ $t('weboffice.QuarantinedTravelPoints') }}
                      </div>
                      <div class="w-1/4">
                        {{ $t('weboffice.Position') }}
                      </div>
                      <div class="w-1/4">
                        {{ $t('weboffice.PointsYouPresentlyNeedToTravel') }}
                      </div>
                    </div>
                    <div
                      v-if="data.result !== undefined"
                      class="flex flex-row border border-grey-light text-sm leading-14"
                    >
                      <div
                        class="flex w-1/4 font-bold px-8 border-r border-grey-light h-40 items-center"
                      >
                        {{ formatPoint(data.result.travelContest.points) }}
                      </div>
                      <div
                        class="flex w-1/4 px-8 border-r border-grey-light h-40 items-center"
                      >
                        {{
                          data.result.travelContest.pointsNewQ !== undefined
                            ? formatPoint(data.result.travelContest.pointsNewQ)
                            : formatPoint(data.result.travelContest.pointsQ)
                        }}
                      </div>
                      <div
                        class="flex w-1/4 px-8 border-r border-grey-light h-40 items-center"
                      >
                        {{
                          data.result.travelContest.rankNew === -1
                            ? $t('weboffice.YouAreNotPresentInTheTop200')
                            : data.result.travelContest.rankNew
                        }}
                      </div>
                      <div
                        class="flex w-1/4 px-8 border-grey h-40 items-center"
                      >
                        {{ formatPoint(data.result.travelContest.divisor) }}
                      </div>
                    </div>
                  </div>
                </Scrollbar>
                <div class="mt-8 text-sm leading-14">
                  <nuxt-link
                    :to="localePath('/weboffice/financial-data/travel-contest')"
                    class="link cursor-pointer"
                    >{{ $t('general.Details') }}</nuxt-link
                  >
                </div>
              </WebofficeCard>
            </div>
          </div>
          <div
            class="flex flex-col sm:flex-row w-full mt-16 lg:mt-0 lg:pl-8 lg:flex-col lg:w-1/3"
          >
            <div
              class="flex flex-col w-full sm:w-1/2 sm:pr-8 lg:pr-0 lg:w-full"
            >
              <WebofficeCard
                :title="$t('weboffice.Sponsore')"
                content-style="py-20 px-16"
                class="w-full"
              >
                <div
                  v-if="data.result !== undefined"
                  class="flex flex-col items-center py-2"
                >
                  <div class="flex flex-row w-full">
                    <div>
                      <img
                        :src="
                          icon[data.result.sponsor.inviter_level.toLowerCase()]
                        "
                        class="w-42 h-42"
                      />
                    </div>
                    <div class="flex flex-col ml-8">
                      <div class="leading-24 text-lg">
                        {{ data.result.sponsor.inviter }}
                      </div>
                      <div class="text-xs leading-12 text-grey-dark mt-2">
                        {{
                          getUserLevelName(data.result.sponsor.inviter_level)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </WebofficeCard>
              <WebofficeCard
                v-if="
                  data.result !== undefined &&
                    data.result.inviter.inviter_username !==
                      data.result.sponsor.inviter_username
                "
                :title="$t('weboffice.Promoter')"
                content-style="py-20 px-16"
                class="w-full mt-16"
              >
                <div
                  v-if="data.result !== undefined"
                  class="flex flex-col items-center py-2"
                >
                  <div class="flex flex-row w-full">
                    <div>
                      <img
                        :src="
                          icon[data.result.inviter.inviter_level.toLowerCase()]
                        "
                        class="w-42 h-42"
                      />
                    </div>
                    <div class="flex flex-col ml-8">
                      <div class="leading-24 text-lg">
                        {{ data.result.inviter.inviter }}
                      </div>
                      <div class="text-xs leading-12 text-grey-dark mt-2">
                        {{
                          getUserLevelName(data.result.inviter.inviter_level)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </WebofficeCard>
            </div>
            <WebofficeCard
              :title="$t('weboffice.Qualifications')"
              class="w-full mt-16 sm:mt-0 sm:w-1/2 sm:pl-8 lg:pl-0 lg:w-full lg:mt-16"
            >
              <div v-if="data.result !== undefined" class="flex flex-col">
                <div
                  v-for="(careerHistory, key) in qualifications"
                  :key="key"
                  class="flex flex-row"
                >
                  <div
                    :class="[
                      'text-' + getUserLevelColor(key),
                      careerHistory === false ? 'pb-24' : 'mb-12'
                    ]"
                    class="flex flex-col flex-grow text-sm leading-14"
                  >
                    <div :class="careerHistory === false ? 'opacity-50' : ''">
                      {{ getUserLevelName(key) }}
                    </div>
                    <div>
                      {{
                        careerHistory.date !== undefined
                          ? careerHistory.date.substring(0, 10)
                          : ''
                      }}
                    </div>
                  </div>
                  <div class="flex w-40 relative">
                    <div
                      :class="[
                        key === 'FRONT3' ? 'rounded-b rounded-b-full' : '',
                        careerHistory !== false ? 'bg-green' : ''
                      ]"
                      class="flex w-16 ml-12"
                    ></div>
                    <div
                      v-if="data.result.users.userLevel !== key"
                      :class="
                        careerHistory !== false
                          ? 'bg-white bottom-0 mb-16'
                          : 'bg-grey-light top-0 mb-8'
                      "
                      class="absolute w-8 h-8 ml-16 rounded-full"
                    />
                    <div v-else class="absolute bottom-0">
                      <img
                        :src="icon[careerHistory.levelName]"
                        class="w-40 h-40 mb-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </WebofficeCard>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  formatDateDisplay,
  formatPoint,
  getUserLevelName,
  getUserLevelColor
} from '@/includes/utils'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import decIcon from '~/assets/images/leader/dec.png'
import ecIcon from '~/assets/images/leader/ec.png'
import distributorIcon from '~/assets/images/leader/distributor.png'
import platinumIcon from '~/assets/images/leader/platinum-leader.png'
import platinumFounderIcon from '~/assets/images/leader/platinum-founder.png'
import goldIcon from '~/assets/images/leader/gold-leader.png'
import goldFounderIcon from '~/assets/images/leader/gold-founder.png'
import emeraldIcon from '~/assets/images/leader/emerald-leader.png'
import emeraldFounderIcon from '~/assets/images/leader/emerald-founder.png'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'DataPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    WebofficeCard,
    LoadingLayerWeboffice
  },
  data() {
    return {
      data: false,
      icon: {
        zero: distributorIcon,
        front3: distributorIcon,
        dec: decIcon,
        ec: ecIcon,
        platinum: platinumIcon,
        founderplatinum: platinumFounderIcon,
        gold: goldIcon,
        foundergold: goldFounderIcon,
        emerald: emeraldIcon,
        founderemerald: emeraldFounderIcon
      },
      flowStatisticDates: '',
      activeStartCapitalBonusDetails: false,
      qualifications: {
        DIAMOND: false,
        FOUNDEREMERALD: false,
        EMERALD: false,
        FOUNDERPLATINUM: false,
        PLATINUM: false,
        FOUNDERGOLD: false,
        GOLD: false,
        DEC: false,
        EC: false,
        FRONT3: false
      }
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getStartCapitalCount() {
      if (this.data.result !== undefined) {
        for (const bonusValue of Object.values(this.data.result.bonus)) {
          if (bonusValue.points !== undefined) {
            return bonusValue.points
          }
        }
      }
      return 0
    },
    getCareerHistoryData() {
      if (this.data.result !== undefined) {
        const returnArray = []
        for (let i = this.data.result.careerHistory.length - 1; i >= 0; i--) {
          if (this.data.result.careerHistory[i].isQuarantine) {
            returnArray.push(this.data.result.careerHistory[i])
          }
        }
        return returnArray
      } else {
        return []
      }
    },
    getTotalFlowStat() {
      let total = 0
      if (
        this.data.result !== undefined &&
        this.data.result.flow !== undefined &&
        this.data.result.flow !== undefined
      ) {
        for (const value of Object.values(this.data.result.flow.flow)) {
          total += value
        }
        if (this.data.result.flow['6Month'] !== undefined) {
          total -= this.data.result.flow['6Month']
        }
        if (this.data.result.flow['14Days'] !== undefined) {
          total -= this.data.result.flow['14Days']
        }
      }
      return total
    }
  },
  mounted() {
    this.getDetails()
    const currentDate = new Date()
    this.flowStatisticDates =
      formatDateDisplay(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      ) +
      ' - ' +
      formatDateDisplay(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate()
      )
  },
  methods: {
    async getDetails() {
      try {
        this.data = await this.$store.dispatch('user/getDashboard')
      } catch (error) {
        this.$router.push(this.localePath('/weboffice/personal-data'))
      }
      if (this.data.result !== undefined) {
        for (let i = 0; i < this.data.result.careerHistory.length; i++) {
          if (
            this.data.result.careerHistory[i].isQuarantine &&
            this.data.result.careerHistory[i].levelName !== undefined
          ) {
            this.qualifications[
              this.data.result.careerHistory[i].levelName.toUpperCase()
            ] = this.data.result.careerHistory[i]
          }
        }
      }
      document.addEventListener('mouseup', this.onDocumentMouseUp)
    },
    getUserLevelName(level) {
      return getUserLevelName(level.toUpperCase())
    },
    formatPoint(price) {
      return formatPoint(price)
    },
    getWidthPercent(point, max) {
      const percent = (parseFloat(point) * 100) / parseFloat(max)
      return percent > 100 ? 100 : percent
    },
    onDocumentMouseUp(e) {
      if (this.$refs.startCapitalBonus !== undefined) {
        const isChild = this.$refs.startCapitalBonus.contains(e.target)
        if (!isChild) {
          this.activeStartCapitalBonusDetails = false
        }
      }
    },
    getUserLevelColor(level) {
      return getUserLevelColor(level.toUpperCase())
    }
  },
  head() {
    return {
      title: this.$t('meta.WebofficeTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('meta.WebofficeTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content: this.$t('meta.WebofficeTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.text-gold {
  color: #dcab6c;
}
.text-green {
  color: #6abb82;
}
.text-platinum {
  color: #90a5aa;
}
.text-diamond {
  @apply text-black;
}
.bg-green {
  background-color: #6abb82;
}
</style>
