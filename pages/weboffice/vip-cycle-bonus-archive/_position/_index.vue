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
            name: $t('weboffice.LoyaltyVipPosition'),
            link: '/weboffice/vip-cycle/position'
          },
          {
            name: $t('weboffice.VipCycleBonusArchive')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.VipCycleBonus') }}
        <InputDropdown
          v-show="archiveSelectArray.length > 0"
          v-model="archiveSelect"
          :values="archiveSelectArray"
          class="w-240 ml-8"
          @input="getArchive(false)"
        />
      </div>
      <div class="flex flex-col w-full">
        <StatusMessage type="warning" class="mb-40">
          <div class="text-sm leading-20 font-bold">
            {{ $t('weboffice.DearDistributor') }}
          </div>
          <div class="text-sm leading-20">
            {{ $t('weboffice.VipCycleBonusArchiveMessage') }}
          </div>
        </StatusMessage>
        <div
          v-show="archive.cycleRolloutDates.length > 0"
          class="flex flex-row items-center mb-12"
        >
          <div class="flex text-sm leading-14 font-bold mr-8">
            {{ $t('weboffice.DateOfCompletion') }}:
          </div>
          <div class="flex flex-row items-center">
            <ButtonSmall
              type="inverted"
              :is-disabled="cycleIndex <= 0"
              @click="getArchive(cycleIndex - 1)"
            >
              <i class="fa fa-chevron-left"></i>
            </ButtonSmall>
            <div class="font-bold px-16 text-center w-177">
              {{ archive.cycleRolloutDates[cycleIndex] }}
            </div>
            <ButtonSmall
              type="inverted"
              :is-disabled="cycleIndex >= archive.cycleRolloutDates.length - 1"
              @click="getArchive(cycleIndex + 1)"
            >
              <i class="fa fa-chevron-right"></i>
            </ButtonSmall>
          </div>
        </div>
        <Scrollbar
          v-show="archive.selectedIndex !== false"
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <div
            class="flex flex-col"
            :style="'min-width: ' + (maxCircleInRow * 140 + 56) + 'px;'"
          >
            <div
              v-for="(level, levelKey) in archive.circleArray"
              :key="levelKey"
              class="flex flex-row mb-8"
            >
              <div class="flex text-xs leading-12 items-center w-56">
                {{ levelKey }}. {{ $t('weboffice.RawLevel') }}
              </div>
              <div
                v-for="(circle, circleKey) in level"
                :key="circleKey"
                class="flex relative flex-col w-128 h-128 bg-primary rounded-full text-white ml-12 justify-center items-center text-sm leading-14"
                :title="circle.sponsorTitle"
              >
                <div
                  v-if="circle.isFreeRound"
                  class="absolute flex right-0 top-0 bg-primary-light w-34 h-34 items-center justify-center rounded-full border-2 border-white"
                >
                  <i class="flex fas fa-lg fa-gift"></i>
                </div>
                <div class="flex flex-wrap w-full justify-center">
                  <div class="mr-4">{{ circle.posUsername }}</div>
                  <div>{{ circle.indexView }}</div>
                </div>
                <div class="flex flex-col text-xs leading-12 text-black mt-4">
                  <div
                    v-for="(sign, signKey) in circle.signArray"
                    :key="signKey"
                    class=""
                  >
                    <span v-if="signKey < 2"
                      >{{ sign.signUserame }} {{ sign.indexView }}</span
                    >
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
  name: 'VIPCycleBonusArchive',
  middleware: 'auth_needed',
  components: {
    StatusMessage,
    InputDropdown,
    Scrollbar,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
    ButtonSmall
  },
  data() {
    return {
      archive: false,
      maxCircleInRow: 1,
      archiveSelectArray: [],
      archiveSelect: 0,
      cycleIndex: 0
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    scrollbarMaxWidth() {
      return 1200
    }
  },
  watch: {
    $route() {
      this.getDetails()
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    /** GET DETAILS */
    async getDetails() {
      try {
        this.archive = false
        this.archive = await this.$store.dispatch(
          'user/getVIPCycleBonusArchive',
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
        if (Object.values(this.archive.circleArray).length > 0) {
          Object.values(this.archive.circleArray).forEach((value) => {
            if (Object.values(value).length > this.maxCircleInRow) {
              this.maxCircleInRow = Object.values(value).length
            }
          })
        }
        if (this.archive.archiveSelect.length > 0) {
          this.archive.archiveSelect.forEach((selectItem, i) => {
            this.archiveSelectArray.push(
              this.getFees.username + ' ' + selectItem.indexView
            )
            if (this.archive.selectedIndex === selectItem.index) {
              this.archiveSelect = i
            }
          })
        } else {
          const nextIndex = parseInt(this.$route.params.index) + 1
          if (nextIndex < 11) {
            this.$router.push(
              this.localePath('/weboffice/vip-cycle-bonus-archive/' + nextIndex)
            )
          }
        }
        if (this.archive.cycleRolloutDates.length > 0) {
          if (this.$route.params.position === undefined) {
            this.cycleIndex = this.archive.cycleRolloutDates.length - 1
          } else {
            this.cycleIndex = parseInt(this.$route.params.index)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    getArchive(cycleIndexTmp) {
      const index =
        cycleIndexTmp === false
          ? this.archive.archiveSelect[this.archiveSelect].index
          : this.$route.params.position === undefined
          ? this.$route.params.index
          : this.$route.params.position
      this.$router.push(
        this.localePath(
          '/weboffice/vip-cycle-bonus-archive/' +
            (cycleIndexTmp === false ? index : index + '/' + cycleIndexTmp)
        )
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeVipCycleArchiveTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeVipCycleArchiveTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeVipCycleArchiveTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
