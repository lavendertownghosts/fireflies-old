<template>
  <main>
    <LoadingLayerWeboffice v-if="cycleview === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.LoyaltyCycleBonus'),
            link: '/weboffice/loyalty-cycle/position'
          },
          {
            name: $t('weboffice.LoyaltyCyclePosition')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LoyaltyCyclePosition') }}
      </div>
      <div class="flex flex-col w-full">
        <StatusMessage type="warning" class="mb-40">
          <div class="text-sm leading-20 font-bold">
            {{ $t('weboffice.DearDistributor') }}
          </div>
          <div class="text-sm leading-20">
            {{ $t('weboffice.VipCycleBonusViewMessage') }}
          </div>
        </StatusMessage>

        <div
          v-if="Object.values(cycleview.circleArray).length"
          class="border border-grey-light rounded mb-24"
        >
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">
              {{ $t('weboffice.SearchPosition') }}
            </div>
          </div>
          <div class="flex flex-col lg:flex-row pt-16 pb-12 px-16">
            <InputDropdown
              v-model="selectedBonusPositionIndex"
              :values="getbonusPositionSelect"
              :label="$t('weboffice.BonusPositionSearch')"
              :placeholder="$t('weboffice.PleaseSelect')"
              :is-dark="false"
              :is-filterable="true"
              :class="'lg:w-1/3 w-full mt-8 lg:mt-0'"
            />
            <ButtonSmall
              class="w-full mt-16 ml-8 mb-4 md:w-82"
              type="primary"
              @click="
                selectedBonusPositionIndex === ''
                  ? false
                  : $router.push(
                      localePath(
                        '/weboffice/loyalty-cycle/cycle-view/' +
                          Object.keys(bonusPositionsSearch)[
                            selectedBonusPositionIndex
                          ] +
                          '/' +
                          bonusPositionsSearch[
                            Object.keys(bonusPositionsSearch)[
                              selectedBonusPositionIndex
                            ]
                          ].substr(
                            -1,
                            bonusPositionsSearch[
                              Object.keys(bonusPositionsSearch)[
                                selectedBonusPositionIndex
                              ]
                            ].indexOf('#')
                          )
                      )
                    )
              "
            >
              {{ $t('general.Search') }}
            </ButtonSmall>
          </div>
          <div class="flex flex-col lg:flex-row pb-12 px-16">
            <InputLoyaltyBonusPositionsearch
              v-model="bonusDistributor"
              :component-attr-id="'distributor'"
              :label="$t('weboffice.DistributorSuggest')"
              :class="'mt-16 lg:mt-0 lg:pr-8 lg:w-1/3 w-full'"
            />
            <InputDropdown
              v-model="selectedPosition"
              :values="bonusPositions"
              :label="$t('weboffice.Position')"
              :is-dark="false"
              :class="'lg:w-1/3 w-full mt-8 lg:mt-0'"
            />
            <ButtonSmall
              class="w-full ml-8 mt-16 mb-4 md:w-82"
              type="primary"
              @click="redirectToPosition()"
            >
              {{ $t('general.Search') }}
            </ButtonSmall>
          </div>
        </div>
        <div v-show="cycleview.username_of_position === undefined">
          {{ $t('weboffice.VipCycleViewEmpty') }}
        </div>
        <Scrollbar
          v-if="Object.values(cycleview.circleArray).length"
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <div
            class="flex flex-col"
            :style="'min-width: ' + (maxCircleInRow * 140 + 56) + 'px;'"
          >
            <div
              v-if="Object.values(cycleview.sponsorResolver).length"
              class="flex flex-row mb-8"
            >
              <div
                class="flex text-xs leading-12 items-center w-56 whitespace-normal"
              >
                {{ $t('weboffice.sponsorResolver') }}
              </div>
              <div
                class="flex cursor-pointer flex-col w-128 h-128 bg-gold text-white border-gold border-solid border rounded-full ml-12 justify-center items-center text-sm leading-14"
                @click="
                  $router.push(
                    localePath(
                      '/weboffice/loyalty-cycle/cycle-view/' +
                        cycleview.sponsorResolver.sponsorPosId +
                        '/' +
                        cycleview.sponsorResolver.sponsorPosIndex
                    )
                  )
                "
              >
                <div class="uppercase">
                  {{ cycleview.sponsorResolver.sponsorUsername }}
                </div>
              </div>
            </div>
            <div
              v-if="Object.values(cycleview.sponsorResolver).length"
              class="text-center w-128 pl-10 ml-56"
            >
              <i class="fas text-xl text-gold fa-caret-up"></i>
            </div>
            <div
              v-for="(level, levelKey) in cycleview.circleArray"
              :key="levelKey"
              class="flex flex-row mb-8"
            >
              <div class="flex text-xs leading-12 items-center w-56">
                {{ levelKey }}. {{ $t('weboffice.RawLevel') }}
              </div>
              <div v-for="(circle, circleKey) in level" :key="circleKey">
                <div
                  v-if="Object.values(circle).length"
                  class="flex flex-col w-128 h-128 border-solid border-primary border rounded-full ml-12 justify-center items-center text-sm leading-14"
                  :class="[
                    circle.css.indexOf('viewedPosition') !== -1 &&
                    circle.css.indexOf('gold') !== -1
                      ? 'bg-gold text-white border-gold'
                      : circle.css.indexOf('viewedPosition') !== -1
                      ? 'bg-primary text-white'
                      : circle.css.indexOf('gold') !== -1
                      ? 'bg-gold-light border-gold'
                      : ''
                  ]"
                >
                  <div
                    v-if="circle.css.indexOf('inactive') !== -1"
                    class="mb-4 text-xs"
                  >
                    {{ $t('weboffice.Passive') }}
                    <i
                      class="fas fa-info-circle cursor-pointer"
                      :title="$t('weboffice.PassivePositionTooltip')"
                    ></i>
                  </div>
                  <div
                    class="uppercase"
                    :title="
                      circle.sponsorTitle
                        ? $t('weboffice.SponsorePosition') +
                          ': ' +
                          circle.sponsorTitle
                        : ''
                    "
                  >
                    {{ circle.position }}
                  </div>
                  <div
                    v-if="
                      Object.values(circle.followers).length &&
                        circle.css.indexOf('inactive') == -1
                    "
                    class="flex flex-col text-xs leading-12 text-black mt-8"
                  >
                    <div
                      v-for="(sign, signKey) in circle.followers"
                      :key="signKey"
                      :class="sign.includes('red ') ? 'text-danger' : ''"
                      class="text-center"
                    >
                      <span v-if="signKey <= 2">{{ sign }}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex flex-col w-128 h-128 border-solid border-primary border rounded-full ml-12 justify-center items-center text-sm leading-14"
                >
                  {{ $t('weboffice.EmptyPosition') }}
                </div>
              </div>
            </div>
            <div class="flex flex-row">
              <div class="flex w-56"></div>
              <div
                v-for="(i, key) in maxCircleInRow"
                :key="key"
                style="width: 140px;"
                class="flex items-center"
              >
                <div class="h-1 w-full bg-grey pl-12"></div>
                <div><i class="fa fa-caret-right text-primary"></i></div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
      <div
        v-if="
          Object.values(cycleview.waitingPositions).length > 0 &&
            cycleview.waitingPositions[0].details
        "
        class="w-full mt-24"
      >
        <div class="flex items-center text-md leading-18 font-bold mb-24 mt-16">
          {{ $t('weboffice.BigCycleWaitPosition') }}

          <Tooltip
            :tooltip-text="$t('weboffice.BigCyclePositionReadyTooltip')"
            :tooltip-style="['w-271 text-xs leading-16']"
            position="left"
            class="ml-4"
          />
        </div>

        <div class="flex flex-wrap">
          <div
            v-for="(circle, levelKey) in cycleview.waitingPositions"
            :key="levelKey"
            class="mb-8"
          >
            <div
              v-if="circle.details"
              class="flex flex-col w-128 h-128 border-solid border-primary border rounded-full mr-12 justify-center items-center text-sm leading-14 cursor-pointer"
              @click="
                $router.push(
                  localePath(
                    '/weboffice/loyalty-cycle/cycle-view/' +
                      circle.positionId +
                      '/' +
                      circle.index
                  )
                )
              "
            >
              <div class="uppercase">
                {{ circle.details.title }}
              </div>
              <div class="flex flex-col text-xs leading-12 text-black mt-8">
                <div
                  v-for="(sign, signKey) in circle.details.positions"
                  :key="signKey"
                  :class="sign.starredMarking ? 'text-danger' : ''"
                  class="text-center"
                >
                  {{ sign.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="Object.values(cycleview.lost).length > 0" class="w-full mt-24">
        <div class="flex items-center text-md leading-18 font-bold mb-24 mt-16">
          {{ $t('weboffice.LostMarkings') }}

          <Tooltip
            :tooltip-text="$t('weboffice.BigCyclePositionReadyTooltip')"
            :tooltip-style="['w-271 text-xs leading-16']"
            position="center"
            class="ml-4"
          />
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            id="FrontsNotAttached"
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 800px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.LostMarking') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.LostReason') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in cycleview.lost"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ rowKey }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ $t('weboffice.LostReasonDetail', { reason: row }) }}
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
      </div>
    </div>
  </main>
</template>

<script>
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import InputDropdown from '@/components/micro/InputDropdown'
import InputLoyaltyBonusPositionsearch from '@/components/micro/InputLoyaltyBonusPositionsearch'
import ButtonSmall from '@/components/micro/ButtonSmall'
import Scrollbar from '~/components/Scrollbar'
import StatusMessage from '~/components/micro/StatusMessage'
import Tooltip from '~/components/micro/Tooltip'
export default {
  name: 'LoyaltyCycleView',
  middleware: 'auth_needed',
  components: {
    StatusMessage,
    Scrollbar,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
    InputLoyaltyBonusPositionsearch,
    InputDropdown,
    ButtonSmall,
    Tooltip
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cycleview: false,
      maxCircleInRow: 1,
      maxLevel: 1,
      positionId: 0,
      index: 0,
      bonusPositionsSearch: [],
      bonusPositionsObject: {},
      bonusPositions: [],
      bonusDistributor: {
        id: false,
        text: ''
      },
      selectedUserLevel: false,
      selectedBonusPositionIndex: '',
      selectedBonusPosition: 0,
      selectedPosition: 0
    }
  },
  computed: {
    getbonusPositionSelect() {
      const list = []
      if (this.bonusPositionsSearch) {
        Object.values(this.bonusPositionsSearch).forEach((bonusPosition) => {
          list.push(bonusPosition)
        })
      }

      return list
    }
  },
  watch: {
    $route() {
      this.getDetails()
    },
    bonusDistributor: {
      handler(val) {
        if (val.data !== undefined) {
          this.bonusPositions = Object.values(val.data)
          this.selectedPosition = 0
          this.bonusPositionsObject = val.data
        }
      }
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    /** GET DETAILS */
    async getDetails() {
      this.$scrollTo('#__nuxt')
      this.bonusDistributor = {
        id: false,
        text: ''
      }
      try {
        if (this.$route.params.position !== undefined) {
          this.positionId = this.$route.params.position
          if (this.$route.params.index !== undefined) {
            this.index = this.$route.params.index
          }
          this.cycleview = false
          this.cycleview = await this.$store.dispatch(
            'user/postLoyaltyCycleView',
            {
              position: this.positionId,
              index: this.index
            }
          )
          if (this.cycleview !== undefined) {
            if (Object.values(this.cycleview.circleArray).length > 0) {
              Object.values(this.cycleview.circleArray).forEach((value) => {
                if (Object.values(value).length > this.maxCircleInRow) {
                  this.maxCircleInRow = Object.values(value).length
                }
              })
            }

            this.bonusPositions = Object.values(
              this.cycleview.initialPositoinsForReload
            )
            this.bonusPositionsSearch = this.cycleview.bonusPositoinsForReload
            this.bonusDistributor.text = this.cycleview.username_of_position
            this.waitingPositions = this.cycleview.waitingPositions
            this.selectedPosition = parseInt(this.$route.params.index) - 1
            this.bonusPositionsObject = this.cycleview.initialPositoinsForReload
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    redirectToPosition() {
      this.$router.push(
        this.localePath(
          '/weboffice/loyalty-cycle/cycle-view/' +
            Object.keys(this.bonusPositionsObject)[this.selectedPosition] +
            '/' +
            (this.selectedPosition + 1)
        )
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePositionTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePositionTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePositionTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
