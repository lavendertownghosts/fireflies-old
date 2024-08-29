<template>
  <main @click="outsideClick">
    <LoadingLayerWeboffice v-if="businessData === false" />
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
            name: $t('weboffice.MyData'),
            link: '/weboffice/personal-data'
          },
          {
            name: $t('weboffice.BusinessData')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.BusinessData') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-col">
          <div class="flex flex-row">
            <InputText
              :input-style="[]"
              :value="businessData.co_name"
              :is-readonly="true"
              :label="$t('weboffice.CoName')"
            />
          </div>
          <div class="flex flex-col md:flex-row w-full mt-16 lg:w-2/3">
            <InputText
              :input-style="[]"
              :value="businessData.co_country"
              :is-readonly="true"
              :label="$t('weboffice.Country')"
              class="w-full md:pr-8"
            />
            <InputText
              :input-style="[]"
              :value="businessData.co_city"
              :is-readonly="true"
              :label="$t('weboffice.City')"
              class="w-full mt-16 md:mt-0 md:pl-8"
            />
          </div>
          <div class="flex flex-row mt-16 w-full lg:w-2/3">
            <InputText
              :input-style="[]"
              :value="businessData.co_address"
              :is-readonly="true"
              :label="$t('weboffice.Address')"
              class="w-full"
            />
          </div>
          <div
            class="flex flex-col md:flex-row mt-16 w-full border-b border-grey-light pb-16 lg:w-2/3"
          >
            <InputText
              :input-style="[]"
              :value="businessData.co_contact_name"
              :is-readonly="true"
              :label="$t('weboffice.CoContactName')"
              class="w-full md:mr-8"
            />
            <InputText
              :input-style="[]"
              :value="businessData.co_tax_number"
              :is-readonly="true"
              :label="$t('weboffice.TaxNumber')"
              class="w-full  mt-16 md:mt-0 md:ml-8"
            />
          </div>
          <div>
            <div
              class="flex flex-row text-xs leading-12 text-black font-bold w-full mt-24"
            >
              <div class="py-14 px-8 w-full">
                {{ $t('weboffice.Date') }}
              </div>
              <div class="py-14 px-8 w-full text-right">
                {{ $t('weboffice.Invoices') }}
              </div>
            </div>
            <div
              ref="invoiceTable"
              class="flex flex-col w-full border-t border-grey-light"
            >
              <div
                v-for="(item, key2) in invoiceList.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="key2"
                :class="[key2 % 2 === 1 ? 'bg-grey-light bg-opacity-30' : '']"
                class="flex flex-col w-full border-l border-grey-light border-b"
              >
                <div class="flex flex-row w-full items-center">
                  <div
                    class="text-sm leading-14 py-13 px-8 border-r border-grey-light w-full"
                  >
                    {{ item.date }}
                  </div>
                  <div
                    :class="activeRow === item.date ? 'text-black' : 'link'"
                    class="relative text-sm leading-14 py-13 px-8 border-r border-grey-light w-full text-right cursor-pointer"
                    @click="showInvoices(item.date)"
                  >
                    {{ $t('weboffice.Invoices') }}
                    <i
                      :class="
                        activeRow === item.date
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      class="fa ml-4"
                    ></i>
                    <div
                      v-show="activeRow === item.date"
                      class="absolute right-0 bg-white z-10 pr-8 border border-grey-light p-16 rounded shadow-drop"
                    >
                      <div class="flex flex-col">
                        <div
                          v-for="(invoice, key) in item.invoices"
                          :key="key"
                          class="py-4"
                        >
                          <div
                            class="link cursor-pointer"
                            @click="downloadPdf(invoice.id)"
                            v-html="invoice.localizedName"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center mt-24">
                <Pagination
                  v-if="
                    invoiceList !== false &&
                      invoiceList.length !== 0 &&
                      maxPage > 1
                  "
                  :max-pages="maxPage"
                  :current-page="currentPage"
                  @click="navPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import InputText from '@/components/micro/InputText'
import Pagination from '@/components/Pagination'
import { getPerPageLimit } from '@/includes/utils'

export default {
  name: 'BusinessDataPage',
  middleware: 'auth_needed',
  components: {
    Pagination,
    InputText,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  data() {
    return {
      businessData: false,
      activeRow: false,
      invoiceList: [],
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
      this.businessData = await this.$store.dispatch('user/getBusinessData', {
        lang: this.$i18n.locale
      })
      const sortedData = Object.entries(
        this.businessData.sortedInvoiceData
      ).sort((a, b) => new Date(b[0]) - new Date(a[0]))
      if (sortedData.length > 0) {
        sortedData.forEach((item) => {
          this.invoiceList.push({
            date: item[0],
            invoices: item[1]
          })
        })
      }
      this.maxPage = Math.ceil(this.invoiceList.length / this.limit)
    },
    showInvoices(key) {
      if (this.activeRow === key) {
        this.activeRow = false
      } else {
        this.activeRow = key
      }
    },
    outsideClick(e) {
      if (this.$refs.invoiceTable !== undefined) {
        const isChild = this.$refs.invoiceTable.contains(e.target)
        if (!isChild) {
          this.activeRow = false
        }
      }
    },
    navPage(page) {
      this.activeRow = false
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    },
    downloadPdf(id) {
      window.open(
        this.$api._defaults.prefixUrl +
          'user/invoice-download' +
          '?auth=' +
          this.$store.state.user.token +
          '&id=' +
          id +
          '&lang=' +
          this.$i18n.locale,
        '_blank'
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeBusinessDataTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeBusinessDataTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeBusinessDataTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
