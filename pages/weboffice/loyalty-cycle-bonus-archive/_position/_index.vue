<template>
  <main>
    <LoadingLayerWeboffice v-if="archive === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.PurchaseFirefliesProducts'),
            link: '/weboffice/membership-upgrade'
          },
          {
            name: $t('weboffice.LoyaltyCycleBonus')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LoyaltyCycleBonus') }}
        <InputDropdown
          v-show="Object.values(archiveSelectArray).length > 0"
          v-model="archiveSelect"
          :values="archiveSelectArray"
          class="w-240 ml-8"
          @input="getArchive()"
        />
      </div>
      <div class="flex flex-col w-full">
        <StatusMessage type="warning" class="mb-40">
          <div class="text-sm leading-20 font-bold">
            {{ $t('weboffice.DearDistributor') }}
          </div>
          <div class="text-sm leading-20">
            {{ $t('weboffice.LoyaltyCycleBonusArchiveMessage') }}
          </div>
        </StatusMessage>
        <div
          v-show="Object.values(rolloutDates).length > 0"
          class="flex flex-row items-center mb-12"
        >
          <div class="flex text-sm leading-14 font-bold mr-8">
            {{ $t('weboffice.DateOfCompletion') }}:
          </div>
          <div class="flex flex-row items-center">
            <ButtonSmall
              type="inverted"
              :is-disabled="
                cycleIndex >= Object.values(rolloutDates).length - 1
              "
              @click="getArchive(parseInt(cycleIndex) + 1)"
            >
              <i class="fa fa-chevron-left"></i>
            </ButtonSmall>
            <div class="font-bold px-16 text-center w-177">
              {{ rolloutDates[cycleIndex] }}
            </div>
            <ButtonSmall
              type="inverted"
              :is-disabled="cycleIndex <= 0"
              @click="getArchive(parseInt(cycleIndex) - 1)"
            >
              <i class="fa fa-chevron-right"></i>
            </ButtonSmall>
          </div>
        </div>
        <Scrollbar
          v-show="archive.selectedIndex !== false"
          v-if="archive.view.circle !== undefined"
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <div
            class="flex flex-col"
            :style="'min-width: ' + (maxCircleInRow * 140 + 56) + 'px;'"
          >
            <div
              v-for="(level, levelKey) in archive.view.circle"
              :key="levelKey"
              class="flex flex-row mb-8"
            >
              <div class="flex text-xs leading-12 items-center w-56">
                {{ levelKey }}. {{ $t('weboffice.RawLevel') }}
              </div>
              <div
                v-for="(circle, circleKey) in level"
                :key="circleKey"
                class="flex flex-col w-128 h-128 bg-primary rounded-full text-white ml-12 justify-center items-center text-sm leading-14"
                :class="[
                  archive.view.is_big
                    ? 'bg-gold text-white border-gold'
                    : 'bg-primary text-white'
                ]"
              >
                <div v-if="circle.is_passive !== false" class="mb-4 text-xs">
                  <span class="text-black">
                    {{ $t('weboffice.Passive') }}
                  </span>
                  <i
                    class="fas fa-info-circle"
                    :title="$t('weboffice.PassivePositionTooltip')"
                  ></i>
                </div>
                <div class="flex flex-wrap w-full justify-center">
                  <div class="text-center px-10">{{ circle.owner }}</div>
                </div>
                <div
                  v-if="circle.signs !== undefined"
                  class="flex flex-col text-xs leading-12 text-black mt-4"
                >
                  <div
                    v-for="(sign, signKey) in circle.signs"
                    :key="signKey"
                    class=""
                  >
                    <span v-if="signKey < 2">{{ sign }}</span>
                  </div>
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

        <div class="w-full mt-24">
          <div
            class="flex items-center text-md leading-18 font-bold mb-24 mt-16"
          >
            {{ $t('weboffice.LostMarkings') }}
            <i
              class="fas fa-info-circle"
              :title="$t('weboffice.BigCyclePositionReadyTooltip')"
            ></i>
          </div>
          <LoadingLayerWeboffice v-if="loadingLostTable" />
          <table
            v-if="lostTable"
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
                v-for="(row, rowKey) in lostTable"
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
          <div v-if="!loadingLostTable && !lostTable">
            <h2>{{ $t('weboffice.EmptyLostTable') }}</h2>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import Scrollbar from '~/components/Scrollbar'
import InputDropdown from '~/components/micro/InputDropdown'
import StatusMessage from '~/components/micro/StatusMessage'
import ButtonSmall from '@/components/micro/ButtonSmall'
export default {
  name: 'LoyaltyCycleBonusArchive',
  middleware: 'auth_needed',
  components: {
    StatusMessage,
    InputDropdown,
    Scrollbar,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
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
      archive: false,
      maxCircleInRow: 1,
      archiveSelectArray: [],
      archiveSelect: '',
      rolloutDates: [],
      cycleIndex: 0,
      lostTable: false,
      loadingLostTable: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isloyaltyAllowed'])
  },
  watch: {
    $route() {
      this.getDetails()
    }
  },
  mounted() {
    if (!this.isloyaltyAllowed) {
      this.$router.push(this.localePath('/weboffice'))
    }
    this.getDetails()
    this.getLosts()
  },
  methods: {
    /** GET DETAILS */
    async getDetails() {
      try {
        this.archive = false
        this.archive = await this.$store.dispatch(
          'user/getLoyaltyCycleBonusArchive',
          {
            index:
              this.$route.params.position === undefined
                ? this.$route.params.index
                : this.$route.params.position,
            cycleIndex:
              this.$route.params.position === undefined
                ? false
                : this.$route.params.index
          }
        )

        if (this.archive.result !== undefined) {
          this.cycleIndex = this.$route.params.index

          this.archive = this.archive.result

          if (this.archive.archiveSelect !== undefined) {
            this.archiveSelectArray = []
            let count = 0
            Object.values(this.archive.archiveSelect).forEach(
              (selectItem, i) => {
                this.archiveSelectArray.push(selectItem.value)
                if (this.$route.params.position === selectItem.index) {
                  this.archiveSelect = count
                }
                count++
              }
            )
          }

          if (this.archive.rolloutDates !== undefined) {
            this.rolloutDates = this.archive.rolloutDates
          }

          Object.values(this.archive.view.circle).forEach((value) => {
            if (Object.values(value).length > this.maxCircleInRow) {
              this.maxCircleInRow = Object.values(value).length
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getLosts() {
      try {
        this.loadingLostTable = true
        this.lostTable = false
        this.lostTable = await this.$store.dispatch(
          'user/getLoyaltyCycleBonusArchive',
          {
            index:
              this.$route.params.position === undefined
                ? this.$route.params.index
                : this.$route.params.position,
            cycleIndex:
              this.$route.params.position === undefined
                ? false
                : this.$route.params.index,
            showLost: 'true'
          }
        )

        if (this.lostTable.result !== undefined) {
          if (this.lostTable.result.lost !== undefined) {
            if (Object.values(this.lostTable.result.lost).length > 0) {
              this.lostTable = this.lostTable.result.lost
            } else {
              this.lostTable = false
            }
          } else {
            this.lostTable = false
          }
        } else {
          this.lostTable = false
        }

        this.loadingLostTable = false
      } catch (e) {
        console.log(e)
      }
    },
    getTrueIndex(index) {
      let returned = 0
      if (this.archive.archiveSelect !== undefined) {
        let count = -1
        Object.values(this.archive.archiveSelect).forEach((selectItem, i) => {
          count++
          if (count === index) {
            returned = selectItem.index
          }
        })
      }
      return returned
    },
    getArchive(cycleIndexTmp) {
      if (cycleIndexTmp === undefined) {
        cycleIndexTmp = 0
      }
      this.$router.push(
        this.localePath(
          '/weboffice/loyalty-cycle-bonus-archive/' +
            this.getTrueIndex(this.archiveSelect) +
            '/' +
            cycleIndexTmp
        )
      )
    }
  },
  head() {
    return {
      title: this.$t('meta.LoyaltyCycleBonus') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.LoyaltyCycleBonus') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.LoyaltyCycleBonus') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
