<template>
  <main>
    <LoadingLayerWeboffice v-if="previousContest === false" />
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
            name: $t('weboffice.TravelContest'),
            link: '/weboffice/financial-data/travel-contest'
          },
          {
            name: $t('weboffice.ResultsOfPreviousContests')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.ResultsOfPreviousContests') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <WebofficeCard
          v-for="(previousList,
          keyPreviousList) in previousContest.previousTopListResult"
          :key="keyPreviousList"
          :title="getListTitle(previousList)"
          :content-style="'pb-20'"
          class="w-full mb-16"
        >
          <div>
            <div class="px-16">
              <div class="flex flex-wrap text-sm leading-14 my-16">
                <div class="flex flex-row w-1/2">
                  <div class="w-1/2">{{ $t('weboffice.Position') }}</div>
                  <div class="w-1/2">{{ $t('weboffice.Username') }}</div>
                </div>
                <div class="w-1/2 text-right">
                  {{ $t('weboffice.TravelPoint') }}
                </div>
              </div>
              <div
                v-for="(topItem, key) in previousList.users"
                :key="key"
                class="flex flex-wrap text-sm leading-14 border-t border-grey-light h-40 items-center"
              >
                <div class="flex flex-row w-1/2">
                  <div class="w-1/2">{{ topItem.rank }}.</div>
                  <div class="w-1/2">{{ topItem.user_id }}</div>
                </div>
                <div class="w-1/2 text-right">
                  {{
                    formatPoint(Math.round(topItem.travel_points * 100) / 100)
                  }}
                </div>
              </div>
            </div>
          </div>
        </WebofficeCard>
      </div>
    </div>
  </main>
</template>

<script>
import { formatPoint } from '@/includes/utils'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'

export default {
  name: 'PreviousContestsPage',
  middleware: 'auth_needed',
  components: {
    WebofficeBreadcrumb,
    WebofficeCard,
    LoadingLayerWeboffice
  },
  data() {
    return {
      previousContest: false
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.previousContest = await this.$store.dispatch(
        'user/getPreviousContests'
      )
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    getListTitle(previousList) {
      return (
        '<div class="flex flex-row w-full"><div class="w-1/2">' +
        previousList.from.substring(0, 10) +
        ' - ' +
        previousList.to.substring(0, 10) +
        '</div>' +
        '<div class="w-1/2 text-right">' +
        this.$t('weboffice.ResultList') +
        ': <span class="text-primary">' +
        (previousList.stillInQuarantine
          ? this.$t('weboffice.Definite')
          : this.$t('weboffice.Running')) +
        '</span></div>' +
        '</div>'
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePreviousContestsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePreviousContestsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePreviousContestsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
