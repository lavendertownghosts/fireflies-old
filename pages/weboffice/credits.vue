<template>
  <main>
    <LoadingLayerWeboffice v-if="credits === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Profile'),
            link: '/weboffice/personal-data'
          },
          {
            name: $t('weboffice.Credits')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.Credits') }}
      </div>
      <div class="flex flex-col w-full">
        <WebofficeCard
          :title="$t('weboffice.CreditBalance')"
          class="w-full sm:w-1/2 lg:w-1/3"
        >
          <div class="flex flex-row items-end text-danger">
            <div class="text-lg leading-24">
              EUR
              {{
                credits.availableCredits
                  | formatNumber('0,0.00', {
                    thousandsSeparator: ' ',
                    decimalSeparator: ','
                  })
              }}
            </div>
          </div>
        </WebofficeCard>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full mt-24"
            style="min-width: 800px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Source') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.TransactionDate') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.TransactionId') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.ExpiryDate') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.CreditAmount') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in credits.credits.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ $t(sourceName[row.sourceId]) }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.createDate.substr(0, 10) }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.reservationId }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.expireDate.substr(0, 10) }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  EUR
                  {{
                    row.amount
                      | formatNumber('0,0.00', {
                        thousandsSeparator: ' ',
                        decimalSeparator: ','
                      })
                  }}
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
  </main>
</template>

<script>
import LoadingLayerWeboffice from '~/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '~/components/weboffice/WebofficeBreadcrumb'
import WebofficeCard from '~/components/weboffice/WebofficeCard'
import Scrollbar from '~/components/Scrollbar'
import Pagination from '~/components/Pagination'
import { getPerPageLimit } from '@/includes/utils'

export default {
  name: 'CreditsPage',
  middleware: 'auth_needed',
  components: {
    Pagination,
    Scrollbar,
    WebofficeCard,
    LoadingLayerWeboffice,
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
      sourceName: [
        'weboffice.CreditSourceChangedBPO',
        'weboffice.CreditSourceChangedCoupon',
        'weboffice.CreditSourcePromotion',
        'weboffice.CreditSourceHotelReservation',
        'weboffice.CreditSourceManualFix'
      ],
      credits: false,
      currentPage: 1,
      maxPage: 1
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
    async getDetails() {
      this.credits = false
      this.credits = await this.$store.dispatch('user/getCredits')
      if (
        this.credits.couponList !== undefined &&
        this.credits.couponList.length > 0
      ) {
        this.maxPage = Math.ceil(this.credits.credits.length / this.limit)
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    }
  },
  head() {
    return {
      title: this.$t('meta.WebofficeCredits') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeCredits') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeCredits') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
