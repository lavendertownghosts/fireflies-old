<template>
  <main>
    <LoadingLayerWeboffice v-if="stepProduct === false" />
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
            name: $t('weboffice.LoyaltyPhasicPurchase')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LoyaltyPhasicPurchase') }}
      </div>
      <div class="flex flex-col w-full">
        <div :class="autoLoading ? 'opacity-50 pointer-events-none' : ''">
          <div class="flex sm:flex-row relative items-center">
            <InputCheckbox
              v-model="stepProduct.automaticPurchaseActualValue"
              @input="changeAutoReBuy"
              >{{ $t('weboffice.LoyaltyStepProductAutoship') }}</InputCheckbox
            >
            <Tooltip
              :tooltip-text="$t('weboffice.LoyaltyStepProductAutoshipTooltip')"
              :tooltip-style="['w-271 text-xs leading-16']"
              position="left"
              class="ml-4"
            />
          </div>
          <div
            v-show="stepProduct.automaticPurchaseActualValue"
            class="flex sm:flex-row relative items-center"
          >
            <InputCheckbox
              v-show="stepProduct.firstLoyaltyPhasicpayment"
              v-model="stepProduct.firstLoyaltyPhasicpaymentActualValue"
              @input="changeAutoReBuy"
              >{{ $t('weboffice.StepPrecedence') }}</InputCheckbox
            >
            <Tooltip
              :tooltip-text="$t('weboffice.StepPrecedenceTooltip')"
              :tooltip-style="['w-271 text-xs leading-16']"
              position="left"
              class="ml-4"
            />
          </div>
          <div
            v-show="stepProduct.hasToken === true"
            class="flex sm:flex-row relative items-center"
          >
            <InputCheckbox
              v-show="stepProduct.automaticPurchaseActualValue"
              v-model="stepProduct.automaticPurchaseCCActualValue"
              :class="
                stepProduct.hasToken === false
                  ? 'opacity-50 pointer-events-none'
                  : ''
              "
              @input="changeAutoReBuy"
            >
              <div class="text-sm leading-14 pt-2">
                {{ $t('weboffice.LoyaltyAutoCC') }}
              </div>
            </InputCheckbox>
            <Tooltip
              v-show="stepProduct.automaticPurchaseActualValue"
              :tooltip-text="$t('weboffice.LoyaltyNoToken')"
              :tooltip-style="['w-271 text-xs leading-16']"
              position="left"
              class="ml-4"
            />
          </div>
        </div>
        <div class="text-2x leading-18 font-bold my-24">
          {{ $t('weboffice.CompletedStages') }}:
          <span class="text-primary">{{ stepProduct.normalPositions }}</span
          >/7
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1 pt-40"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <WebofficeStepProgress
            :title="false"
            :length="7"
            :active="stepProduct.normalPositions % 7"
            :inactive-type="'verticalLine'"
            :exception-points="stageExceptions"
            :first-value="
              stepProduct.normalPositions > 7
                ? Math.floor(stepProduct.normalPositions / 7) * 7
                : 0
            "
            :ignore-last="stepProduct.normalPositions > 7"
            style="min-width: 470px"
            class="w-full my-24"
          />
        </Scrollbar>
        <div class="text-2x leading-18 font-bold">
          {{ $t('weboffice.Units') }}
        </div>
        <div class="text-sm leading-14 mt-4">
          {{ $t('weboffice.UnitsPurchasedForTheCompletionOfTheStageStep') }}:
          <span class="text-primary">{{ stepProduct.stepCompleted }}</span
          >/3
        </div>
        <div class="flex w-full justify-center my-24">
          <WebofficeStepProgress
            :title="false"
            :length="3"
            :active="stepProduct.stepCompleted"
            :inactive-type="'checklist'"
            class="w-full md:w-2/3"
          />
        </div>

        <div class="flex flex-col lg:flex-row flex-wrap">
          <div
            v-for="(product, key) in stepProduct.stepProductsToDisplay"
            :key="key"
            :class="key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'"
            class="flex w-full mb-16 lg:mb-0 lg:w-1/3"
          >
            <div
              :class="
                key !== activeProductKey && key + 1 > stepProduct.stepCompleted
                  ? 'border-grey-light'
                  : 'border-primary'
              "
              class="flex flex-col w-full rounded border justify-between"
            >
              <div
                :class="
                  key !== activeProductKey &&
                  key + 1 > stepProduct.stepCompleted
                    ? 'bg-grey-light bg-opacity-20'
                    : 'bg-primary text-white'
                "
                class="p-16 font-bold leading-16 text-center"
              >
                <div v-html="product.localizedTitle"></div>
                <div
                  v-show="product.formattedAvailableFrom !== undefined"
                  class="text-xs mt-4"
                >
                  {{
                    $t('weboffice.PurchaseAvailable') +
                      ': ' +
                      product.formattedAvailableFrom
                  }}
                </div>
                <div
                  v-show="key < stepProduct.stepCompleted"
                  class="text-xs mt-4"
                  v-html="product.buttonText"
                ></div>
              </div>
              <div class="p-16 text-sm leading-16 h-84">
                <div v-html="product.localizedContent" />
              </div>
              <div
                :class="
                  key !== activeProductKey &&
                  key + 1 > stepProduct.stepCompleted
                    ? 'bg-grey-light bg-opacity-20'
                    : 'bg-primary text-white'
                "
                class="flex flex-col p-16 border-t border-grey-light items-center"
              >
                <div class="flex flex-row w-full h-40 items-center">
                  <div class="w-1/2 font-bold">
                    {{ product.currency }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      v-show="
                        key === stepProduct.stepCompleted &&
                          new Date(product.formattedAvailableFrom) < new Date()
                      "
                      :type="activeProductKey === key ? 'danger' : 'primary'"
                      @click="showCart(key)"
                    >
                      {{ $t('weboffice.Buy') }}
                    </ButtonSmall>
                    <div
                      v-show="key > stepProduct.stepCompleted"
                      class="text-sm leading-14 font-bold"
                    >
                      {{
                        $t('weboffice.PurchasedAfterUnit').replace(
                          '__count__',
                          key
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-2x leading-18 font-bold mb-24 mt-24">
          {{ $t('weboffice.History') }}:
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <div
            class="flex flex-row"
            :style="
              'min-width: ' +
                (stepProduct && stepProduct.historyToDisplay
                  ? stepProduct.historyToDisplay.length * 49
                  : 0) +
                'px'
            "
          >
            <div
              v-for="(history, historyKey) in stepProduct.historyToDisplay"
              :key="'month-' + historyKey"
              :class="
                historyKey < stepProduct.historyToDisplay.length - 1
                  ? 'border-r border-grey'
                  : ''
              "
              class="relative flex flex-col text-xs leading-12"
            >
              <div
                v-show="hoverHistory === historyKey"
                class="absolute text-black right-0 left-0 sm:w-177 text-center h-40 bg-white px-8 py-4 border border-grey-light p-16 rounded shadow-drop z-30"
              >
                <div class="flex items-center justify-center h-full">
                  <div
                    class="flex"
                    v-html="history.hoverPart + ': ' + history.purchaseUnitDate"
                  />
                </div>
              </div>
              <div
                class="flex pb-8 border-b uppercase px-8 border-grey-light h-34 items-end"
              >
                {{ history.purchaseUnitDate }}
              </div>
              <div class="flex justify-center w-full mt-8 ">
                <i
                  :class="
                    history.stateColor.split(' ')[0] === 'green'
                      ? 'text-primary fa-check-circle'
                      : 'fa-exclamation-circle'
                  "
                  class="fal fa-2x cursor-pointer"
                  @mouseover="hoverHistory = historyKey"
                  @mouseleave="hoverHistory = false"
                ></i>
              </div>
            </div>
          </div>
        </Scrollbar>
        <div class="text-lg leading-24 font-bold mt-40 mb-20">
          {{ $t('weboffice.Faq') }}
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 1 === activeFaq ? false : 1"
          >
            {{ $t('weboffice.LoyaltyStepProductFaqQuestion1') }}
          </div>
          <div v-show="activeFaq === 1" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion1Part1') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion1Part2') }}</div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 2 === activeFaq ? false : 2"
          >
            {{ $t('weboffice.LoyaltyStepProductFaqQuestion2') }}
          </div>
          <div v-show="activeFaq === 2" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion2Part1') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion2Part2') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion2Part3') }}</div>
            <table class="table-fixed text-black w-full">
              <thead class="font-bold">
                <tr>
                  <th class="w-1/4 py-14 px-8 "></th>
                  <th class="w-1/4 py-14 px-8 ">
                    {{ $t('weboffice.ProductVoucher') }}
                  </th>
                  <th class="w-1/4 py-14 px-8 ">
                    {{ $t('weboffice.BestPriceOption') }}
                  </th>
                  <th class="w-1/4 py-14 px-8 ">{{ $t('weboffice.Price') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part4') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">5</td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part7') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part5') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">5</td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part8') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part6') }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">1</td>
                  <td class="py-13 px-8 border border-grey-light">-</td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part9') }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part10') }}
            </div>
            <div>
              {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part11') }}
            </div>
            <div>
              {{ $t('weboffice.LoyaltyStepProductFaqExposion2Part12') }}
            </div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 3 === activeFaq ? false : 3"
          >
            {{ $t('weboffice.LoyaltyStepProductFaqQuestion3') }}
          </div>
          <div v-show="activeFaq === 3" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion3Part1') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion3Part2') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion3Part3') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion3Part4') }}</div>
            <div class="mt-16">
              {{ $t('weboffice.LoyaltyStepProductFaqExposion3Part5') }}
            </div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 4 === activeFaq ? false : 4"
          >
            {{ $t('weboffice.LoyaltyStepProductFaqQuestion4') }}
          </div>
          <div v-show="activeFaq === 4" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion4Part1') }}</div>
            <div class="mt-16">
              {{ $t('weboffice.LoyaltyStepProductFaqExposion4Part2') }}
            </div>
            <div class="mt-16">
              {{ $t('weboffice.LoyaltyStepProductFaqExposion4Part3') }}
            </div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion4Part4') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion4Part5') }}</div>
          </div>
        </div>
        <div class="mb-8">
          <div
            class="link cursor-pointer leading-16"
            @click="activeFaq = 5 === activeFaq ? false : 5"
          >
            {{ $t('weboffice.LoyaltyStepProductFaqQuestion5') }}
          </div>
          <div v-show="activeFaq === 5" class="text-sm leading-20 mt-4">
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion5Part1') }}</div>
            <div>
              {{ $t('weboffice.LoyaltyStepProductFaqExposion5Part2') }}
            </div>
            <div>
              {{ $t('weboffice.LoyaltyStepProductFaqExposion5Part3') }}
            </div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion5Part4') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion5Part5') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion5Part6') }}</div>
            <div>{{ $t('weboffice.LoyaltyStepProductFaqExposion5Part7') }}</div>
          </div>
        </div>
        <div id="billingData">
          <div v-show="activePay">
            <div
              class="flex items-center text-lg leading-24 font-bold mb-16 mt-40"
            >
              {{ $t('weboffice.Pay') }}
            </div>
            <CartCard
              id="billing"
              :type="'success'"
              :title="$t('weboffice.BillingData')"
              :help="$t('weboffice.BillingDataError')"
              :active="true"
              :show-chevron="false"
            >
              <div class="px-16 pt-18 pb-20 mb-4">
                <InputCheckbox
                  v-model="billingData.saveBillingData"
                  class="mt-12"
                >
                  <div class="text-sm leading-14 pt-2">
                    {{ $t('weboffice.SaveData') }}
                  </div>
                </InputCheckbox>
                <div class="mt-24 pt-24 border-t border-grey-light">
                  <InputText
                    v-model="billingData.name"
                    :error="billingData.error.name"
                    :class="'w-full sm:w-271'"
                    :label="$t('weboffice.BillingName')"
                  />
                  <div class="flex flex-col xl:flex-row">
                    <div
                      class="flex flex-col sm:flex-row justify-between md:justify-start"
                    >
                      <InputDropdownCountry
                        v-model="billingData.country"
                        :label="$t('weboffice.Country')"
                        :placeholder="$t('general.PleaseSelect')"
                        class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                      ></InputDropdownCountry>
                      <InputText
                        v-model="billingData.postalCode"
                        :error="billingData.error.postalCode"
                        :class="'w-128 mt-24 md:w-auto lg:w-128'"
                        :label="$t('weboffice.ZipCode')"
                      />
                    </div>
                    <InputText
                      v-model="billingData.city"
                      :error="billingData.error.city"
                      :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                      :label="$t('weboffice.City')"
                    />
                  </div>
                  <InputText
                    v-model="billingData.address"
                    :error="billingData.error.address"
                    :class="'w-full mt-24'"
                    :label="$t('weboffice.Address')"
                  />
                  <div class="mt-24">
                    <label class="text-black text-xs font-bold leading-12">
                      {{ $t('weboffice.TaxNumber') }}
                      <span class="text-grey-dark font-normal"
                        >({{ $t('weboffice.Optional') }})</span
                      >
                    </label>
                    <InputText
                      v-model="billingData.tax"
                      :error="billingData.error.tax"
                      :class="'w-216'"
                      :label="''"
                    />
                  </div>
                </div>
              </div>
            </CartCard>
            <div class="flex flex-col mt-16">
              <div class="text-lg font-bold text-black leading-24 mb-16">
                {{ $t('general.Pay') }}
              </div>
              <div
                class="px-16 pt-16 pb-12 text-black font-bold bg-grey-light rounded-t border border-grey-light"
              >
                <div class="text-sm leading-14">
                  {{ $t('weboffice.TotalPrice') }}
                </div>
                <div class="text-3x leading-20 mt-4">
                  {{ currency }}
                  {{
                    getTotalPrice
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
              </div>
              <div
                class="bg-white px-16 pb-16 border-grey-light text-black border-r border-l"
              >
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-grey-light"></div>
                </div>
                <label
                  class="block text-black text-xs font-bold leading-12 mt-16"
                  >{{ $t('general.PayWithTC') }}</label
                >
                <InputTextMask
                  v-model="travelCard"
                  :mask="currency + ' 99999'"
                  :class="'w-full'"
                  :is-dark="false"
                  :is-disabled="tcBalance <= 0"
                  @input="changeAddedTravelCard"
                />

                <div class="text-xs mt-4 leading-12 text-grey-dark">
                  {{ $t('general.CurrentTC') }}: {{ currency }}
                  {{
                    (getFees !== false ? getFees.tc.credit : 0)
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
              </div>
              <div class="bg-primary-gradient px-16 pb-20 text-white">
                <div class="flex w-full items-center justify-center">
                  <div class="arrow-down border-t-white"></div>
                </div>
                <div class="text-sm leading-14 font-bold mt-16">
                  {{ $t('general.PayWithTC') }}
                </div>
                <div class="text-3x leading-20 font-bold mt-4">
                  {{ currency }}
                  {{
                    getAddedTravelCard
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
                <div class="h-1 bg-white bg-opacity-30 my-12"></div>
                <div class="flex flex-row">
                  <div class="flex flex-col flex-grow">
                    <div class="text-sm leading-14 font-bold">
                      {{ $t('general.PayWithCreditCard') }}
                    </div>
                    <div class="text-3x leading-20 font-bold mt-4">
                      {{ currency }}
                      {{
                        (getTotalPrice - getAddedTravelCard)
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div
                      class="text-xs leading-12 text-white text-opacity-75 mt-2"
                    >
                      (+ {{ currency }}
                      {{
                        getHandlingFee(
                          getTotalPrice - getAddedTravelCard,
                          'mlm'
                        )
                          | formatNumber('0.00', {
                            thousandsSeparator: ' '
                          })
                      }}
                      {{ $t('general.TransactionFee') }})
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="flex">
                      <i class="text-lg fas fa-credit-card"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="
                  getTotalPrice > 0 && !payInProgress
                    ? 'bg-danger text-white'
                    : 'bg-grey-light text-grey'
                "
                class="text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
                @click="pay()"
              >
                <div class="relative">
                  <div :class="{ 'opacity-0': payInProgress }" class="static">
                    {{ $t('general.Pay') }}
                  </div>
                  <div
                    class="absolute inset-0 opacity-0"
                    :class="{ 'opacity-100': payInProgress }"
                  >
                    <i class="fas fa-spinner-third fa-spin"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InformativeModal
      v-show="billingDataErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="billingDataErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('weboffice.BillingDataError') }}
        </div>
      </div>
    </InformativeModal>
    <NMIModal
      v-show="nmiPopupActive"
      :popup="nmiPopup"
      @close="
        nmiPopupActive = false
        nmiPopup = false
      "
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import WebofficeStepProgress from '@/components/weboffice/WebofficeStepProgress'
import CartCard from '@/components/cart/CartCard'
import Scrollbar from '~/components/Scrollbar'
import InformativeModal from '@/components/modal/InformativeModal'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InputTextMask from '@/components/micro/InputTextMask'
import Tooltip from '~/components/micro/Tooltip'

import NMIModal from '@/components/modal/NMIModal'

import { getHandlingFee } from '@/includes/utils'
export default {
  name: 'LoyaltyStepProductPage',
  middleware: 'auth_needed',
  components: {
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    WebofficeStepProgress,
    CartCard,
    ButtonSmall,
    InputCheckbox,
    InputText,
    InputDropdownCountry,
    InputTextMask,
    Tooltip,
    Scrollbar,
    InformativeModal,
    NMIModal
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 896
    }
  },
  data() {
    return {
      stepProduct: false,
      activeProductKey: false,
      activeFaq: false,
      activePay: false,
      autoLoading: false,
      tcBalance: 0,
      travelCard: '0',
      currency: 'EUR',
      billingData: {
        saveBillingData: false,
        name: '',
        country: '',
        postalCode: '',
        city: '',
        address: '',
        tax: '',
        error: {
          name: '',
          country: '',
          postalCode: '',
          city: '',
          address: '',
          tax: ''
        }
      },
      nmiPopupActive: false,
      nmiPopup: false,
      payInProgress: false,
      autoRebuy: false,
      stepPrecedence: false,
      hoverHistory: false,
      stageExceptions: [],
      billingDataErrorModalActive: false,
      releaseStage: process.env.RELEASE_STAGE
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    getTotalPrice() {
      if (
        this.stepProduct.stepProductsToDisplay[this.activeProductKey] !==
        undefined
      ) {
        return this.stepProduct.stepProductsToDisplay[this.activeProductKey]
          .price
      }
      return 0
    },
    getAddedTravelCard() {
      const tc = parseInt(
        (this.travelCard + '').replace(this.currency, '').trim()
      )
      if (isNaN(tc) && this.getFees.tc !== undefined) {
        return 0
      } else if (tc > this.getTotalPrice) {
        return this.getTotalPrice
      } else if (this.getFees !== false && tc > this.getFees.tc.credit) {
        return this.getFees.tc.credit
      } else {
        return tc
      }
    }
  },
  mounted() {
    this.getDetails()
    this.setUserBillingData()
  },
  methods: {
    getHandlingFee,
    async getDetails() {
      try {
        this.stepProduct = await this.$store.dispatch(
          'user/getLoyaltyStepProduct',
          { lang: this.$i18n.locale }
        )
      } catch (e) {
        console.log(e)
      }

      if (this.getFees.tc !== undefined) {
        this.tcBalance = this.getFees.tc.credit
      } else {
        this.tcBalance = -1
      }

      if (this.stepProduct) {
        if (this.stepProduct.automaticPurchaseCCActualValue) {
          this.stepProduct.automaticPurchaseActualValue = true
        }
        if (this.stepProduct.normalPositions <= 7) {
          this.stageExceptions = [
            {
              point: 1,
              showPoint: true,
              infoBox:
                this.$t('weboffice.LoyaltyStandard') +
                (this.stepProduct.achievedJSON.achievedStandardPackage
                  ? '<br/>' +
                    this.stepProduct.achievedJSON.achievedStandardPackageDate
                  : ''),
              extraClass: this.stepProduct.achievedJSON.achievedStandardPackage
                ? 'bg-grey-dark text-white w-128 ml-100'
                : 'w-128 ml-100'
            },
            {
              point: 3,
              showPoint: true,
              infoBox:
                this.$t('weboffice.LoyaltyPlus') +
                (this.stepProduct.achievedJSON.achievedPlusPackage
                  ? '<br/>' +
                    this.stepProduct.achievedJSON.achievedPlusPackageDate
                  : ''),
              extraClass: this.stepProduct.achievedJSON.achievedPlusPackageDate
                ? 'bg-primary text-white w-128'
                : 'text-primary w-128'
            },
            {
              point: 7,
              showPoint: true,
              infoBox:
                this.$t('weboffice.LoyaltyPro') +
                (this.stepProduct.achievedJSON.achievedProPackage
                  ? '<br/>' +
                    this.stepProduct.achievedJSON.achievedProPackageDate
                  : ''),
              extraClass: this.stepProduct.achievedJSON.achievedProPackage
                ? 'bg-warning bg-opacity-50 text-white w-128'
                : 'text-warning w-128'
            }
          ]
        } else {
          this.stageExceptions = [
            {
              point: 0,
              showPoint: true,
              infoBox:
                this.$t('weboffice.LoyaltyPro') +
                (this.stepProduct.achievedJSON.achievedProPackage
                  ? '<br/>' +
                    this.stepProduct.achievedJSON.achievedProPackageDate
                  : ''),
              extraClass: this.stepProduct.achievedJSON.achievedProPackage
                ? 'bg-warning text-white ml-100'
                : 'text-warning ml-100'
            }
          ]
        }
      }
    },
    showCart(key) {
      this.activeProductKey = key
      this.activePay = true
      this.$scrollTo('#billingData')
    },
    /** SET USER BILLING DATA */
    async setUserBillingData() {
      let res
      try {
        res = await this.$store.dispatch('user/getPersonalData')
      } catch (e) {
        console.log(e)
      }
      if (res) {
        this.billingData.name =
          res.BILLING_NAME === null ? '' : res.BILLING_NAME
        this.billingData.country = res.BILLING_COUNTRY || ''
        this.billingData.postalCode = res.BILLING_ZIPCODE || ''
        this.billingData.city = res.BILLING_CITY || ''
        this.billingData.address = res.BILLING_STREET || ''
        this.billingData.tax = ''
      }
    },
    /** CHANGE ADDED TRAVEL CARD */
    changeAddedTravelCard() {
      let tc = this.travelCard.replace(this.currency, '').trim()
      if (tc !== '') {
        if (this.getFees.tc.credit > 0) {
          tc = parseInt(tc)
          if (isNaN(tc)) {
            this.travelCard = '0'
          } else if (tc > this.getTotalPrice) {
            this.travelCard = this.getTotalPrice + ''
          } else if (
            this.getFees !== false &&
            tc > Math.floor(this.getFees.tc.credit)
          ) {
            this.travelCard = Math.floor(this.getFees.tc.credit) + ''
          }
        } else {
          this.travelCard = '0'
        }
      }
    },
    /** PAY */
    async pay() {
      if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billingData')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payLoyaltyStepProduct', {
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace(this.currency, '').trim(),
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale
            })
          } catch (e) {
            this.payInProgress = false
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
          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                } else {
                  this.$store.dispatch('general/showSnackbar', {
                    message: this.$t('hotel.HotelBookingDataError')
                  })
                }
              }
            }

            this.payInProgress = false
          }
        }
      }
    },
    /** VALIDATE BILLING DATA */
    validateBilling() {
      let valid = true
      for (const keyError in this.billingData.error) {
        this.billingData.error[keyError] = ''
      }
      if (this.billingData.name === '') {
        this.billingData.error.name = this.$t('weboffice.BillingNameRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.name)) {
        this.billingData.error.name = this.$t(
          'weboffice.BillingNamePatternError'
        )

        valid = false
      }

      if (this.billingData.country === '') {
        this.billingData.error.country = this.$t('weboffice.CountryRequired')
        valid = false
      }
      if (this.billingData.postalCode === '') {
        this.billingData.error.postalCode = this.$t('weboffice.ZipCodeRequired')
        valid = false
      }
      if (this.billingData.city === '') {
        this.billingData.error.city = this.$t('weboffice.CityRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.city)) {
        this.billingData.error.city = this.$t('weboffice.CityPatternError')

        valid = false
      }
      if (this.billingData.address === '') {
        this.billingData.error.address = this.$t('weboffice.AddressRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.address)) {
        this.billingData.error.address = this.$t(
          'weboffice.AddressPatternError'
        )

        valid = false
      }
      if (this.billingData.phone === '') {
        this.billingData.error.phone = this.$t('weboffice.PhoneRequired')
        valid = false
      }
      return valid
    },
    /** CHANGE AUTO REBUY */
    async changeAutoReBuy() {
      if (this.autoLoading === false) {
        this.autoLoading = true
        if (this.stepProduct.hasToken === false) {
          this.stepProduct.automaticPurchaseCCActualValue = false
        }
        try {
          await this.$store.dispatch('user/changeLoyaltyStepProductAutoship', {
            needAutoship: this.stepProduct.automaticPurchaseActualValue,
            needAutoCCpay: this.stepProduct.automaticPurchaseCCActualValue,
            precedence: this.stepProduct.firstLoyaltyPhasicpaymentActualValue
          })
        } catch (error) {
          console.log(error)
        }
        this.autoLoading = false
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeLoyaltyStepTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeLoyaltyStepTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeLoyaltyStepTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
