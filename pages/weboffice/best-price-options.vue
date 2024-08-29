<template>
  <main>
    <LoadingLayerWeboffice v-if="bestPriceOption === false" />
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
            name: $t('weboffice.BestPriceOption')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.BestPriceOption') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <div class="flex md:flex-row justify-between">
          <WebofficeCard
            :title="$t('weboffice.PremiumBPOQuantity')"
            class="w-full sm:w-1/2 lg:w-1/3"
          >
            <div class="flex flex-row items-end text-danger">
              <div class="text-lg leading-24">
                {{ statePBPO }}/{{ allPBPO }}
              </div>
              <div class="flex text-xs leading-12 ml-4 mb-2">
                {{ $t('weboffice.Available') }}
              </div>
            </div>
          </WebofficeCard>
          <WebofficeCard
            :title="$t('weboffice.BPOQuantity')"
            class="md:mt-0 mt-24 w-full sm:w-1/2 lg:w-1/3"
          >
            <div class="flex flex-row items-end text-danger">
              <div class="text-lg leading-24">{{ stateBPO }}/{{ allBPO }}</div>
              <div class="flex text-xs leading-12 ml-4 mb-2">
                {{ $t('weboffice.Available') }}
              </div>
            </div>
          </WebofficeCard>
        </div>

        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black w-full"
            style="min-width: 700px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Id') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.DateOfPurchase') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Validity') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Status') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.Transfer') }}
                </th>
                <th class="py-14 px-8 text-left w-177"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in getDetailsTableData"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.isPremium ? 'premium_' : '' }}BPO_{{ row.id }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.createDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.expireDate }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  <span :class="stateTypeExtraClass[row.state]">{{
                    stateType[row.state]
                  }}</span>
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.transferredBy }}
                </td>
                <td class="py-13 px-8 border border-grey-light text-right">
                  <div
                    v-if="row.isExchangeable"
                    :class="row.isTransferable ? 'mb-4' : ''"
                    class="link cursor-pointer"
                    @click="showExchangeBPOModal(row)"
                  >
                    {{ $t('weboffice.Exchange') }}
                  </div>
                  <div
                    v-if="row.isTransferable"
                    :class="row.isRecallable ? 'mb-4' : ''"
                    class="link cursor-pointer"
                    @click="showTransferModal(row)"
                  >
                    BPO {{ $t('weboffice.Transfer') }}
                  </div>
                  <div
                    v-if="row.isRecallable"
                    class="link cursor-pointer"
                    @click="showRecallBPOModal(row)"
                  >
                    BPO {{ $t('weboffice.Recall') }} ({{ row.recallFrom }})
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="bestPriceOption !== false && maxPage > 1"
            :max-pages="maxPage"
            :current-page="currentPage"
            @click="navPage"
          />
        </div>
      </div>
    </div>

    <DecisionModal
      v-if="exchangeBPOModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.Exchange')"
      :cancel-button="$t('general.Cancel')"
      @close="exchangeBPOModalActive = false"
      @cancel="exchangeBPOModalActive = false"
      @accept="exchangeBPO"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.ExchangeCoupon') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.ExchangeCouponDescription1') }}
          </div>
          <div class="mt-4">
            {{ $t('weboffice.ExchangeCouponDescription2') }}
          </div>
        </div>
        <div
          class="flex flex-col text-sm leading-20 mt-12 mb-12"
          style="margin-left: -7px;"
        >
          <recaptcha />
        </div>
      </div>
    </DecisionModal>

    <DecisionModal
      v-if="recallBPOModalActive"
      with-class="w-320"
      :accept-button="$t('general.Yes')"
      :cancel-button="$t('general.Cancel')"
      @close="recallBPOModalActive = false"
      @cancel="recallBPOModalActive = false"
      @accept="recallBPO"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.BpoRecallConfirmation') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ getRecallDescription }}
          </div>
        </div>
      </div>
    </DecisionModal>

    <DecisionModal
      v-if="transferModalActive"
      with-class="w-320"
      :accept-button="$t('general.Ok')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="transferLoading"
      @close="transferModalActive = false"
      @cancel="transferModalActive = false"
      @accept="transfer"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            BPO {{ $t('weboffice.Transfer') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.BestPriceOption') }}:
            <span class="font-bold">BPO_{{ selectedBPO.id }}</span>
          </div>
          <div class="mt-4">
            {{ $t('weboffice.BPOTransferDescription') }}
          </div>
          <InputBPOTransmissionUsersNamesearch
            v-model="bpoUserSearch"
            :is-dark="false"
            :label="''"
            :placeholder="$t('weboffice.UsernameSearch')"
            :input-style="['truncate pr-40']"
            :component-attr-id="'bpo-transmission-user-namesearch'"
          />
        </div>
        <div
          class="flex flex-col text-sm leading-20 mt-12 mb-12"
          style="margin-left: -7px;"
        >
          <recaptcha />
        </div>
      </div>
    </DecisionModal>

    <DefaultModal
      v-show="transferDisabledModalActive"
      :modal-max-width="'320px'"
      @close="transferDisabledModalActive = false"
    >
      <div slot="header">
        <div class="flex w-full text-black mt-8">
          <div class="flex flex-grow text-lg leading-24">
            BPO {{ $t('weboffice.Transfer') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="transferDisabledModalActive = false"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body" class="mt-24">
        {{ $t('weboffice.DisabledTransferModal') }}
        <div>
          <ButtonMedium
            class="mt-16"
            @click="transferDisabledModalActive = false"
            >OK</ButtonMedium
          >
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
  </main>
</template>

<script>
import { format } from 'date-fns'
import {
  calcRemainingTime,
  formatPoint,
  getPerPageLimit
} from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'
import ButtonMedium from '@/components/micro/ButtonMedium'
import DecisionModal from '@/components/modal/DecisionModal'
import DefaultModal from '@/components/modal/DefaultModal'
import InputBPOTransmissionUsersNamesearch from '@/components/micro/InputBPOTransmissionUsersNamesearch'

export default {
  name: 'BestPriceOptionsPage',
  middleware: 'auth_needed',
  components: {
    InputBPOTransmissionUsersNamesearch,
    DecisionModal,
    DefaultModal,
    ButtonMedium,
    Scrollbar,
    Pagination,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    WebofficeCard
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      bestPriceOption: false,
      currentPage: 1,
      maxPage: 1,
      allPBPO: 0,
      allBPO: 0,
      stateBPO: 0,
      statePBPO: 0,
      pointCollectingEndDate: false,
      details: false,
      transferLoading: false,
      stateType: {
        USED: this.$t('weboffice.StateUsed'),
        NEW: this.$t('weboffice.StateNew'),
        TRANSMITTED: this.$t('weboffice.StateTransmitted'),
        ADDED_TO_PAYMENT: this.$t('weboffice.AddedToPayment'),
        CHANGED: this.$t('weboffice.StateExchanged')
      },
      stateTypeExtraClass: {
        USED: 'text-primary',
        NEW: 'text-warning',
        CHANGED: 'text-danger',
        TRANSMITTED: ''
      },
      exchangeBPOModalActive: false,
      selectedBPO: false,
      recallBPOModalActive: false,
      transferModalActive: false,
      transferDisabledModalActive: false,
      bpoUserSearch: {
        id: false,
        text: ''
      }
    }
  },
  computed: {
    limit() {
      return getPerPageLimit()
    },
    getDetailsTableData() {
      return this.bestPriceOption.bposList
        ? this.bestPriceOption.bposList.slice(
            (this.currentPage - 1) * this.limit,
            (this.currentPage - 1) * this.limit + this.limit
          )
        : []
    },
    getRecallDescription() {
      let description = this.$t('weboffice.BpoRecallDescription')
      if (this.selectedBPO.recallFrom !== undefined) {
        description = description.replace(
          '%recallFrom%',
          this.selectedBPO.recallFrom
        )
      }
      return description
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.bestPriceOption = false
      this.bestPriceOption = await this.$store.dispatch(
        'user/getBestPriceOptions'
      )
      this.allPBPO = 0
      this.allBPO = 0
      this.stateBPO = 0
      this.statePBPO = 0
      this.bestPriceOption.bposList.forEach((elem) => {
        if (elem.isPremium) {
          this.allPBPO++
        } else {
          this.allBPO++
        }

        if (
          (elem.state === 'NEW') |
            (elem.available && elem.state === 'TRANSMITTED') &&
          elem.isPremium
        ) {
          this.statePBPO++
        } else if (
          (elem.state === 'NEW') |
            (elem.available && elem.state === 'TRANSMITTED') &&
          !elem.isPremium
        ) {
          this.stateBPO++
        }
      })
      this.maxPage = this.bestPriceOption.bposList
        ? Math.ceil(this.bestPriceOption.bposList.length / this.limit)
        : 0
    },
    navPage(page) {
      this.$scrollTo('#__nuxt')
      this.currentPage = page
    },
    format(date) {
      return format(date, 'yyyy.MM.dd')
    },
    calcRemainingTime(date) {
      return calcRemainingTime(date)
    },
    formatPoint(number) {
      return formatPoint(number)
    },
    showExchangeBPOModal(bpo) {
      this.selectedBPO = bpo
      this.exchangeBPOModalActive = true
    },
    async exchangeBPO() {
      try {
        const captchaToken = await this.$recaptcha.getResponse()

        if (captchaToken !== '') {
          const exchangeBPO = await this.$store.dispatch('user/exchangeBPO', {
            couponId: this.selectedBPO.id,
            token: captchaToken
          })
          if (exchangeBPO && exchangeBPO.state === 'ok') {
            this.exchangeBPOModalActive = false
            this.$scrollTo('#__nuxt')
            await this.getDetails()
          }
        }
      } catch (e) {
        this.$store.dispatch('general/showSnackbar', {
          message: this.$t('weboffice.CaptchaError')
        })
      }
    },
    showRecallBPOModal(bpo) {
      this.selectedBPO = bpo
      this.recallBPOModalActive = true
    },
    async recallBPO() {
      const recallBPO = await this.$store.dispatch('user/recallBPO', {
        bpoId: this.selectedBPO.id
      })
      if (recallBPO.status === 'OK') {
        this.recallBPOModalActive = false
        this.selectedBPO = false
        this.$scrollTo('#__nuxt')
        await this.getDetails()
      }
    },
    showTransferModal(bpo) {
      this.selectedBPO = bpo
      this.transferModalActive = true
    },
    /*
    showTransferModal() {
      this.transferDisabledModalActive = true
    },
    */
    async transfer() {
      let res

      if (!this.transferLoading) {
        this.transferLoading = true
        try {
          const captchaToken = await this.$recaptcha.getResponse()
          if (captchaToken !== '') {
            try {
              res = await this.$store.dispatch('user/postBPOTransmission', {
                id: this.selectedBPO.id,
                username: this.bpoUserSearch.text,
                token: captchaToken
              })
            } catch (e) {
              let body = await e.response
              if (body && e.response !== undefined) {
                body = await e.response.json()
                if (body.messages !== undefined) {
                  this.$store.dispatch('general/showSnackbar', {
                    message: body.messages
                  })
                }
              }
            }
          }
        } catch (e) {
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.CaptchaError')
          })
        }
        // komment
        if (
          res !== undefined &&
          res.status !== undefined &&
          res.status === 'OK'
        ) {
          this.selectedBPO = false
          this.transferModalActive = false
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.BPOTransmissionSuccess')
          })
          this.$scrollTo('#__nuxt')
          await this.getDetails()
        }

        this.transferLoading = false
      }
    }
  },
  head() {
    return {
      title: this.$t('meta.WebofficeBPOTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeBPOTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeBPOTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
