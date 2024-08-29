<template>
  <main>
    <LoadingLayerWeboffice v-if="vipLeaderBonus === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Bonuses'),
            link: 'bonuses/leader-depth-bonus'
          },
          {
            name: $t('weboffice.VipLeaderBonus')
          }
        ]"
      />
      <div class="flex flex-col lg:flex-row">
        <div
          class="flex flex-grow items-center text-lg leading-24 font-bold mb-24 mt-16"
        >
          <i
            class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
            @click="$router.push(localePath('/'))"
          ></i>
          {{ $t('weboffice.VipLeaderBonus') }}
        </div>
      </div>
      <div
        v-for="(data, index) in Object.values(vipLeaderBonus.archive).reverse()"
        :key="index"
        class="flex flex-col w-full"
      >
        <div class="flexflex-col">
          <div
            class="flex flex-row py-14 cursor-pointer  border-t border-grey-light"
            @click="activeItem = data.date"
          >
            <div
              :class="activeItem === data.date ? '' : 'link'"
              class="pt-5 flex flex-initial cursor-pointer"
            >
              {{ format(new Date(data.date)) }}
            </div>
            <div class="flex flex-grow flex-row justify-end">
              <div
                v-if="getGroupNumber(data.lines.length) > 0"
                class="mr-3 w-48 text-center py-6 relative text-white text-sm font-bold"
              >
                {{ getGroupNumber(data.lines.length) }}x
                <i class="text-2xs fas fa-check"></i>
                <div
                  class="rounded-full w-24 h-24 text-center absolute py-6 bg-primary right-0 top-0 z-m1 mt-5"
                ></div>
                <div
                  class="rounded-full w-34 h-34 bg-primary absolute left-0 top-0 z-m1"
                ></div>
              </div>
              <div
                v-if="
                  (getGroupNumber(data.lines.length) > 0) &
                    (data.lines.length % 4 !== 0)
                "
                class="text-primary mt-5 ml-2 mr-2"
              >
                <i class="fas fa-grip-lines-vertical"></i>
              </div>
              <div
                v-for="(line, lineKey) in data.lines.length % 4"
                :key="lineKey"
                class="text-primary mt-5"
              >
                <i class="p-2 fas fa-check-circle"></i>
              </div>
              <div
                v-if="data.lines.length === 0 || data.lines.length % 4 !== 0"
                class="flex flex-row"
              >
                <div
                  v-for="(line, lineKey) in 4 - (data.lines.length % 4)"
                  :key="'error-line-' + lineKey"
                  class="text-danger mt-5"
                >
                  <i class="p-2 fas fa-times-circle"></i>
                </div>
              </div>
            </div>
          </div>
          <div v-show="activeItem === data.date" class="flex flex-col">
            <div class="flex flex-row">
              <div class="flex flex-col flex-grow mb-24">
                <WebofficeCard :title="$t('weboffice.BonusLine')">
                  <div class="grid md:grid-cols-4 grid-cols-2">
                    <div
                      v-for="(line, key) in data.lines"
                      :key="key"
                      class="flex flex-row mb-8 mt-8"
                    >
                      <div class="flex items-center">
                        <img
                          :src="getLevelIcon(line.level)"
                          class="w-42 h-42"
                        />
                      </div>
                      <div class="flex items-center flex-col ml-8 leading-20">
                        <div class="w-full sm:text-sm text-xs ">
                          {{ line.name }}
                        </div>
                        <div class="w-full text-xs text-primary">
                          <i class="fas fa-check-circle"></i>
                          {{ $t('weboffice.Completed') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="data.point_value !== false"
                    class="flex w-full justify-end mt-8"
                  >
                    <div class="flex w-full lg:w-240 xl:w-288">
                      <div
                        class="flex w-full border-grey-light justify-center rounded px-16 items-center flex-row bg-grey-light bg-opacity-50"
                      >
                        <div class="text-black block">
                          <i class="fal fa-chart-line fa-2x"></i>
                        </div>
                        <div class="flex-col px-16 py-8 flex text-black">
                          <div class="flex">
                            {{ $t('weboffice.PointValue') }}:
                          </div>
                          <div class="flex font-bold">
                            EUR
                            {{
                              data.point_value
                                | formatNumber('0,0.00', {
                                  thousandsSeparator: ' ',
                                  decimalSeparator: ','
                                })
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </WebofficeCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { format } from 'date-fns'
import { getMonthName } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
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

export default {
  name: 'VipLeaderBonusMedium',
  middleware: 'auth_needed',
  components: {
    WebofficeCard,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  data() {
    return {
      leaderDepthBonus: false,
      activeItem: false,
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
      vipLeaderBonus: false
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    format(date) {
      return format(date, 'yyyy ') + getMonthName(format(date, 'M'))
    },
    getGroupNumber(lines) {
      if (lines % 4 !== 0) {
        return lines - (lines % 4)
      } else {
        return lines
      }
    },
    getLevelIcon(level) {
      if (level !== undefined && this.icon[level.toLowerCase()] !== undefined) {
        return this.icon[level.toLowerCase()]
      } else {
        return this.icon.zero
      }
    },
    async getDetails() {
      this.vipLeaderBonus = false
      this.vipLeaderBonus = await this.$store.dispatch(
        'user/getVipLeaderBonusMedium'
      )
      if (this.vipLeaderBonus.archive !== undefined) {
        const currentDate = new Date()
        this.activeItem =
          currentDate.getFullYear() +
          '-' +
          (currentDate.getMonth() + 1 < 10
            ? '0' + (currentDate.getMonth() + 1)
            : currentDate.getMonth() + 1)
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeVIPLeaderBonusTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeVIPLeaderBonusTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeVIPLeaderBonusTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.z-m1 {
  z-index: -1;
}
</style>
