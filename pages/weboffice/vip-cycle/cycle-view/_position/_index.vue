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
            name: $t('weboffice.LoyaltyVipPosition'),
            link: '/weboffice/vip-cycle/position'
          },
          {
            name: $t('weboffice.VipCycleBonus')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.VipCycleBonus') }}
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

        <div class="border border-grey-light rounded mb-24">
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
                        '/weboffice/vip-cycle/cycle-view/' +
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
            <InputVIPBonusPositionsearch
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
        <div v-show="cycleview.initialUsernameForReload === undefined">
          {{ $t('weboffice.VipCycleViewEmpty') }}
        </div>
        <Scrollbar
          v-show="cycleview.initialUsernameForReload !== undefined"
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <div
            class="flex flex-col"
            :style="'min-width: ' + (maxCircleInRow * 140 + 56) + 'px;'"
          >
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
                  class="flex flex-col w-128 h-128 relative border-solid border-primary border rounded-full ml-12 justify-center items-center text-sm leading-14"
                  :class="
                    circle.cssClass.indexOf('viewedPosition') !== -1
                      ? 'bg-primary text-white'
                      : ''
                  "
                >
                  <div
                    v-if="circle.isFreeRound"
                    class="absolute flex right-0 top-0 bg-primary-light w-34 h-34 items-center justify-center rounded-full border-2 border-white"
                  >
                    <i class="flex fas fa-lg fa-gift"></i>
                  </div>
                  <div v-if="circle.isActive === false" class="mb-4 text-xs">
                    {{ $t('weboffice.Passive') }}
                    <i
                      class="fas fa-info-circle"
                      :title="$t('weboffice.PassivePositionTooltip')"
                    ></i>
                  </div>
                  <div
                    class="mb-4 uppercase"
                    :title="
                      circle.sponsorTitle
                        ? $t('weboffice.SponsorePosition') +
                          ': ' +
                          circle.sponsorTitle
                        : ''
                    "
                  >
                    {{ circle.posUserName }}
                  </div>
                  <div>{{ circle.indexView }}</div>
                  <div
                    v-if="circle.isActive !== false"
                    class="flex flex-col text-xs leading-12 text-black mt-8"
                  >
                    <div
                      v-for="(sign, signKey) in circle.signArray"
                      :key="signKey"
                      class="text-center"
                    >
                      <span v-if="signKey < 2"
                        >{{ sign.signUserName }} {{ sign.indexView }}</span
                      >
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
    </div>
  </main>
</template>

<script>
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import InputDropdown from '@/components/micro/InputDropdown'
import InputVIPBonusPositionsearch from '@/components/micro/InputVIPBonusPositionsearch'
import ButtonSmall from '@/components/micro/ButtonSmall'
import Scrollbar from '~/components/Scrollbar'
import StatusMessage from '~/components/micro/StatusMessage'
export default {
  name: 'VIPCycleView',
  middleware: 'auth_needed',
  components: {
    StatusMessage,
    Scrollbar,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
    InputVIPBonusPositionsearch,
    InputDropdown,
    ButtonSmall
  },
  data() {
    return {
      cycleview: false,
      maxCircleInRow: 1,
      maxLevel: 1,
      positionId: 0,
      index: 0,
      bonusPositionsSearch: [],
      bonusPositions: [],
      bonusPositionsObject: {},
      bonusDistributor: {
        text: '',
        id: false
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
    },
    scrollbarMaxWidth() {
      return 1200
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
      try {
        if (this.$route.params.position !== undefined) {
          this.positionId = this.$route.params.position
          if (this.$route.params.index !== undefined) {
            this.index = this.$route.params.index
          }
          this.cycleview = false
          this.cycleview = await this.$store.dispatch('user/postVIPCycleView', {
            position: this.positionId,
            index: this.index
          })
          if (this.cycleview !== undefined) {
            if (Object.values(this.cycleview.circleArray).length > 0) {
              Object.values(this.cycleview.circleArray).forEach((value) => {
                if (Object.values(value).length > this.maxCircleInRow) {
                  this.maxCircleInRow = Object.values(value).length
                }
              })
            }
            this.bonusPositionsSearch = this.cycleview.bonusPositoinsForReload
            this.bonusPositions = Object.values(
              this.cycleview.initialPositoinsForReload
            )
            this.bonusDistributor.text = this.cycleview.initialUsernameForReload
            if (this.cycleview.initialPositoinsForReload) {
              this.selectedPosition = Object.keys(
                this.cycleview.initialPositoinsForReload
              ).findIndex((idx) => idx === this.$route.params.position)
            }
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
          '/weboffice/vip-cycle/cycle-view/' +
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
