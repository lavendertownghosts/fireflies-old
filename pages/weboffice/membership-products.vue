<template>
  <main @click="outsideClick">
    <LoadingLayerWeboffice v-if="membershipProducts === false" />
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
            name: $t('weboffice.MyFirefliesProducts')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.MyFirefliesProducts') }}
      </div>
      <div class="flex flex-col w-full">
        <Scrollbar
          :centered="false"
          class="pr-1 pb-100"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            ref="membershipProducts"
            class="text-sm leading-14 text-black"
            style="min-width: 800px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.TransactionId') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.OrderId') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Product') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.OrderDate') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.ProductPrice') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Voucher') }}
                </th>
                <th class="py-14 px-8 text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in membershipProducts.visibleList.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.reservationId }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.orderId }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{
                    (row.productCount !== undefined
                      ? row.productCount + ' X '
                      : '') + getProductName(row.productKey)
                  }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.orderDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{
                    row.productCount !== undefined
                      ? row.productCount + ' X '
                      : ''
                  }}
                  {{ row.currency }}
                  {{
                    row.oneProductPrice
                      | formatNumber('0,0', { thousandsSeparator: ' ' })
                  }}
                </td>
                <td
                  class="py-13 px-8 border border-grey-light"
                  v-html="
                    row.vouchers.length === 0
                      ? '-'
                      : row.vouchers.join('<br />')
                  "
                />
                <td class="py-13 px-8 border border-grey-light">
                  <div v-if="row.noteDownloads !== undefined">
                    <div
                      v-if="row.noteDownloads.length > 1"
                      class="relative text-right link cursor-pointer"
                      @click="showInvoices(row.reservationId)"
                    >
                      {{ $t('weboffice.Invoices') }}
                      <i
                        :class="
                          activeRow === row.reservationId
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down'
                        "
                        class="fa ml-4"
                      ></i>
                      <div
                        v-show="activeRow === row.reservationId"
                        class="absolute right-0 bg-white z-10 pr-8 border border-grey-light p-16 rounded shadow-drop"
                        style="width: 200px;"
                      >
                        <div class="flex flex-col">
                          <div
                            v-for="(invoice, key) in row.noteDownloads"
                            :key="key"
                            class="py-4"
                          >
                            <div
                              class="link cursor-pointer"
                              @click="downloadNote(invoice.orderId)"
                            >
                              {{ getInvoiceCategoryName(invoice.categoryKey) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="row.noteDownloads.length === 1">
                      <div
                        v-if="row.noteDownloads.length > 0"
                        class="text-right link cursor-pointer"
                        @click="downloadNote(row.noteDownloads[0].orderId)"
                      >
                        {{
                          getInvoiceCategoryName(
                            row.noteDownloads[0].categoryKey
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="membershipProducts !== false && maxPage > 1"
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
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import {
  getPerPageLimit,
  getProductName,
  getInvoiceCategoryName
} from '@/includes/utils'
import Scrollbar from '~/components/Scrollbar'

export default {
  name: 'MembershipProductsPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    Pagination,
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
      currentPage: 1,
      maxPage: 1,
      membershipProducts: false,
      activeRow: false
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
    getProductName,
    getInvoiceCategoryName,
    async getDetails() {
      this.membershipProducts = await this.$store.dispatch(
        'user/getMembershipProducts'
      )
      this.maxPage = Math.ceil(
        this.membershipProducts.visibleList.length / this.limit
      )
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    },
    showInvoices(key) {
      if (this.activeRow === key) {
        this.activeRow = false
      } else {
        this.activeRow = key
      }
    },
    outsideClick(e) {
      if (this.$refs.membershipProducts !== undefined) {
        const isChild = this.$refs.membershipProducts.contains(e.target)
        if (!isChild) {
          this.activeRow = false
        }
      }
    },
    downloadNote(orderId) {
      window.open(
        this.$api._defaults.prefixUrl +
          'user/invoice-download?auth=' +
          this.$store.state.user.token +
          '&id=' +
          orderId +
          '&lang=' +
          this.$i18n.locale,
        '_blank'
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeMembershipProductsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeMembershipProductsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeMembershipProductsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
