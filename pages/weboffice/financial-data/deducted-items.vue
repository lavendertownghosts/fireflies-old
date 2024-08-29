<template>
  <main>
    <LoadingLayerWeboffice v-if="deductedItems === false" />
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
            name: $t('weboffice.DeductedItems')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.DeductedItems') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning">
          <div
            class="leading-20 text-sm"
            v-html="$t('weboffice.DeductedItemsMessageBox')"
          />
        </StatusMessage>
        <div
          class="flex flex-row text-xs leading-12 text-black font-bold mt-16 py-14 px-8"
        >
          <div class="w-1/2">{{ $t('weboffice.Date') }}</div>
          <div class="w-1/2 text-right">{{ $t('weboffice.Sum') }}</div>
        </div>
        <div class="flex flex-col border-b border-grey-light">
          <div
            v-for="(date, key) in deductedItems.visibleDataKeysOrdered"
            :key="key"
            class="flex flex-col border-t border-grey-light text-sm leading-14"
            @click="showItem(date)"
          >
            <div class="flex flex-row py-13 px-8">
              <div class="w-1/2 link cursor-pointer">
                {{ date }}
                <i
                  :class="[
                    activeItems[date] ? 'fa-chevron-up' : 'fa-chevron-down'
                  ]"
                  class="w-16 fal ml-4"
                ></i>
              </div>
              <div class="w-1/2 text-right">
                {{
                  formatPoint(
                    Math.round(
                      deductedItems.total_points_demolished[date] * 100
                    ) / 100
                  )
                }}
              </div>
            </div>
            <div
              v-show="activeItems[date]"
              class="flex w-full mb-16 border-t border-black"
            >
              <Scrollbar
                :ref="'Scrollbar' + date"
                :centered="false"
                class="pr-1"
                :style="'max-width: ' + scrollbarMaxWidth + 'px'"
              >
                <table
                  style="min-width: 1024px;"
                  class="table-auto w-full text-sm leading-14 bg-grey-light bg-opacity-50"
                >
                  <thead>
                    <tr class="text-black font-bold">
                      <th class="py-14 px-8">
                        {{ $t('weboffice.User') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.ProductName') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.Quantity') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.DirectBonus') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.DepthBonus') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.MatrixCommission') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.CarBonus') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.GenerationBonus') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.ExtraDepthBonus') }}
                      </th>
                      <th class="py-14 px-8">
                        {{ $t('weboffice.LeaderDepthBonus') }}
                      </th>
                      <th class="py-14 px-8 text-center w-177">
                        {{ $t('weboffice.Type') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(tableData, tableDataKey) in deductedItems
                        .visibleData[date]"
                      :key="tableDataKey"
                      class="border-b border-grey"
                    >
                      <td class="py-14 px-8">
                        {{ tableData.buyerUsername }}
                      </td>
                      <td colspan="py-14 px-8">
                        {{ tableData.productName }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(Math.round(tableData.count * 100) / 100)
                        }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(Math.round(tableData.direct * 100) / 100)
                        }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(Math.round(tableData.depth * 100) / 100)
                        }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(Math.round(tableData.matrix * 100) / 100)
                        }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{ formatPoint(Math.round(tableData.car * 100) / 100) }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(
                            Math.round(tableData.generation * 100) / 100
                          )
                        }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(
                            Math.round(tableData.extraDepth * 100) / 100
                          )
                        }}
                      </td>
                      <td class="py-14 px-8 text-center">
                        {{
                          formatPoint(
                            Math.round(tableData.leaderdepth * 100) / 100
                          )
                        }}
                      </td>
                      <td class="py-14 px-8">
                        {{ typeList[tableData.type] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Scrollbar>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { formatPoint } from '@/includes/utils'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import StatusMessage from '@/components/micro/StatusMessage'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'DirectdeductedItemssPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    StatusMessage,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      deductedItems: false,
      activeItems: false,
      typeList: {
        chargeback: this.$t('weboffice.TypeChargeback'),
        refund: this.$t('weboffice.TypeRefund')
      }
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.deductedItems = await this.$store.dispatch('user/getDeductedItems')
      this.activeItems = this.deductedItems.visibleDataKeysOrdered.reduce(
        (ac, a) => ({ ...ac, [a]: false }),
        {}
      )
      if (this.deductedItems.visibleData !== undefined) {
        for (const items of Object.values(this.deductedItems.visibleData)) {
          for (const item of Object.values(items)) {
            item.productName = item.productName.replace(/_/g, ' ')
            item.productName = item.productName.replace(/\w+/g, function(w) {
              return w[0].toUpperCase() + w.slice(1).toLowerCase()
            })
          }
        }
      }
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    showItem(date) {
      this.activeItems[date] = !this.activeItems[date]
      if (this.activeItems[date]) {
        const scrollbar = this.$refs['Scrollbar' + date]
        if (scrollbar) {
          setTimeout(() => {
            scrollbar[0].calculateSize()
          }, 100)
        }
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeDeducatedItemsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeDeducatedItemsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeDeducatedItemsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
