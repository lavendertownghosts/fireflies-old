<template>
  <main>
    <LoadingLayerWeboffice v-if="paymentPoints === false" />
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
            name: $t('weboffice.PaidOutPoints')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.PaidOutPoints') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning">
          <div
            class="text-sm leading-20"
            v-html="$t('weboffice.PaymentPointsMessageBox')"
          />
        </StatusMessage>
        <div class="border border-grey-light rounded mt-40">
          <div
            class="h-48 flex items-center bg-grey-light bg-opacity-50 px-16 font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">
              {{ $t('weboffice.Filter') }}
            </div>
            <div class="flex link" @click="removeFilters">
              {{ $t('weboffice.DeleteFilters') }}
            </div>
          </div>
          <div class="flex flex-col p-16">
            <InputToggle
              v-model="allData"
              :label="$t('weboffice.All')"
              @input="selectedDate = ''"
            />
            <div class="flex flex-col md:flex-row mt-16">
              <InputDropdown
                v-model="selectedDate"
                :values="payoutDates"
                :placeholder="$t('weboffice.PleaseSelect')"
                :label="$t('weboffice.Date')"
                :error="selectDateError"
                :is-filterable="true"
                class="md:w-240"
                @input="selectDate"
              />
              <ButtonSmall
                class="w-full mb-3 md:ml-8 mt-16 md:w-82 h-48"
                type="primary"
                @click="getDetails"
              >
                {{ $t('weboffice.Filter') }}
              </ButtonSmall>
            </div>
          </div>
          <div class="flex flex-col px-16 pb-16">
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
                    <th class="py-14 px-8 text-left w-6/12">
                      {{ $t('weboffice.PaymentPointType') }}
                    </th>
                    <th
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-14 px-8 text-left w-3/12"
                    >
                      {{ $t('weboffice.TotalPaymentPoints') }} (USD)
                    </th>
                    <th class="py-14 px-8 text-left w-3/12">
                      {{ $t('weboffice.TotalPaymentPoints') }} (EUR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(bonusType, bonusTypeKey) in bonusTypeList.filter(
                      (bonusTypeTMP) => {
                        return bonusTypeTMP.show
                      }
                    )"
                    v-show="
                      bonusType.show !== false && bonusType.key !== 'CYCLE_BPO'
                    "
                    :key="bonusTypeKey"
                    class="even:bg-grey-light even:bg-opacity-30"
                  >
                    <td class="py-13 px-8 border border-grey-light">
                      <InputCheckbox
                        v-model="bonusType.value"
                        :is-disabled="
                          bonusType.disabled !== undefined
                            ? bonusType.disabled
                            : false
                        "
                        ><div class="link cursor-pointer">
                          {{ bonusType.name }}
                        </div>
                      </InputCheckbox>
                    </td>
                    <td
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-13 px-8 border border-grey-light"
                    >
                      {{
                        getPaidOutPoints('USD', bonusType.key)
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                      {{ $t('weboffice.PaidOutPoints') }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{
                        getPaidOutPoints('EUR', bonusType.key)
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                      {{ $t('weboffice.PaidOutPoints') }}
                    </td>
                  </tr>
                  <tr class="even:bg-grey-light even:bg-opacity-30 font-bold">
                    <td class="py-13 px-8 border border-grey-light">
                      {{ $t('weboffice.Total') }}
                    </td>
                    <td
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-13 px-8 border border-grey-light"
                    >
                      {{
                        getTotalPaidOutPoints('USD')
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                      {{ $t('weboffice.PaidOutPoints') }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{
                        getTotalPaidOutPoints('EUR')
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                      {{ $t('weboffice.PaidOutPoints') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Scrollbar>
            <Scrollbar
              :centered="false"
              class="pr-1"
              :style="'max-width: ' + scrollbarMaxWidth + 'px'"
            >
              <table
                class="table-auto text-sm leading-14 text-black w-full mt-16"
                style="min-width: 700px"
              >
                <tbody v-show="paymentPoints.payoutDetails">
                  <tr
                    v-show="
                      paymentPoints.payoutDetails.prev_failed_amount !==
                        undefined ||
                        paymentPoints.payoutDetails.prev_failed_amount_euro !==
                          undefined
                    "
                  >
                    <td class="py-13 px-8 border border-grey-light w-6/12">
                      {{ $t('weboffice.UnsuccessfulTranferCommission') }}
                    </td>
                    <td
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-13 px-8 border border-grey-light w-3/12"
                    >
                      <div
                        v-show="
                          paymentPoints.payoutDetails.prev_failed_amount !==
                            undefined
                        "
                      >
                        USD
                        {{
                          paymentPoints.payoutDetails.prev_failed_amount
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </td>
                    <td class="py-13 px-8 border border-grey-light w-3/12">
                      <div
                        v-show="
                          paymentPoints.payoutDetails
                            .prev_failed_amount_euro !== undefined
                        "
                      >
                        EUR
                        {{
                          paymentPoints.payoutDetails.prev_failed_amount_euro
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </td>
                  </tr>
                  <tr class="h-48">
                    <td
                      colspan="3"
                      class="bg-grey-light border border-grey-light"
                    ></td>
                  </tr>
                  <tr>
                    <td class="py-13 px-8 border border-grey-light w-6/12">
                      {{ $t('weboffice.CreditedToTc') }}
                    </td>
                    <td
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-13 px-8 border border-grey-light w-3/12"
                    >
                      <div
                        :class="
                          paymentPoints.payoutDetails.current_tc_payment_failed
                            ? 'text-danger'
                            : 'text-primary'
                        "
                        class="mr-8"
                      >
                        {{
                          paymentPoints.payoutDetails.current_tc_payment_failed
                            ? $t('weboffice.Unsuccessful')
                            : $t('weboffice.Successful')
                        }}
                      </div>
                      USD
                      {{
                        paymentPoints.payoutDetails.paidTCAmountBD
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light w-3/12">
                      <div
                        :class="
                          paymentPoints.payoutDetails
                            .current_tc_payment_failed_euro
                            ? 'text-danger'
                            : 'text-primary'
                        "
                        class="mr-8"
                      >
                        {{
                          paymentPoints.payoutDetails
                            .current_tc_payment_failed_euro
                            ? $t('weboffice.Unsuccessful')
                            : $t('weboffice.Successful')
                        }}
                      </div>
                      EUR
                      {{
                        paymentPoints.payoutDetails.paidTCAmountBD_euro
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="py-13 px-8 border border-grey-light w-6/12">
                      {{ $t('weboffice.BankTransfer') }}
                    </td>
                    <td
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-13 px-8 border border-grey-light w-3/12"
                    >
                      <div
                        :class="
                          paymentPoints.payoutDetails.current_payment_failed
                            ? 'text-danger'
                            : 'text-primary'
                        "
                        class="mr-8"
                      >
                        {{
                          paymentPoints.payoutDetails.current_payment_failed
                            ? $t('weboffice.Unsuccessful')
                            : $t('weboffice.Successful')
                        }}
                      </div>
                      USD
                      {{
                        paymentPoints.payoutDetails.paidAmountBD
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light w-3/12">
                      <div
                        :class="
                          paymentPoints.payoutDetails
                            .current_payment_failed_euro
                            ? 'text-danger'
                            : 'text-primary'
                        "
                        class="mr-8"
                      >
                        {{
                          paymentPoints.payoutDetails
                            .current_payment_failed_euro
                            ? $t('weboffice.Unsuccessful')
                            : $t('weboffice.Successful')
                        }}
                      </div>
                      EUR
                      {{
                        paymentPoints.payoutDetails.paidAmountBD_euro
                          | formatNumber('0,0.00', {
                            thousandsSeparator: ' ',
                            decimalSeparator: ','
                          })
                      }}
                    </td>
                  </tr>
                  <tr
                    v-show="
                      paymentPoints.payoutDetails.curr_failed_amount ||
                        paymentPoints.payoutDetails.curr_failed_amount_euro
                    "
                  >
                    <td class="py-13 px-8 border border-grey-light w-6/12">
                      {{ $t('weboffice.CurrentlyFailedPayout') }}
                    </td>
                    <td
                      v-show="getTotalPaidOutPoints('USD') > 0"
                      class="py-13 px-8 border border-grey-light w-3/12"
                    >
                      <div
                        v-show="
                          paymentPoints.payoutDetails.curr_failed_amount !==
                            undefined
                        "
                      >
                        USD
                        {{
                          paymentPoints.payoutDetails.curr_failed_amount
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </td>
                    <td class="py-13 px-8 border border-grey-light w-3/12">
                      <div
                        v-show="
                          paymentPoints.payoutDetails
                            .curr_failed_amount_euro !== undefined
                        "
                      >
                        EUR
                        {{
                          paymentPoints.payoutDetails.curr_failed_amount_euro
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-show="
                      paymentPoints.voucherCommission !== undefined &&
                        paymentPoints.voucherCommission.date !== undefined
                    "
                    class="font-bold"
                  >
                    <td colspan="3" class="py-13 px-8">
                      <span
                        v-show="
                          paymentPoints.voucherCommission.date !== undefined &&
                            paymentPoints.voucherCommission.amount !== undefined
                        "
                      >
                        {{ $t('weboffice.VoucherBookingCommission') }}
                        {{
                          new Date(
                            paymentPoints.voucherCommission.date
                          ).getFullYear()
                        }}.
                        {{
                          getMonthName(
                            new Date(
                              paymentPoints.voucherCommission.date
                            ).getMonth() + 1
                          )
                        }}: USD
                        {{
                          paymentPoints.voucherCommission.amount
                            | formatNumber('0,0.00', {
                              thousandsSeparator: ' ',
                              decimalSeparator: ','
                            })
                        }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Scrollbar>
            <Scrollbar
              :centered="false"
              class="pr-1"
              :style="'max-width: ' + scrollbarMaxWidth + 'px'"
            >
              <table
                class="table-auto text-sm leading-14 text-black w-full mt-16 rounded"
                style="min-width: 700px"
              >
                <tbody>
                  <tr class="bg-grey-light bg-opacity-30">
                    <td
                      colspan="3"
                      class="py-13 px-8 text-black text-2x border border-grey-light font-bold"
                    >
                      {{ $t('weboffice.MatrixCommission') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Scrollbar>
          </div>
        </div>
        <!-- ÖSSZEGZŐ -->
        <div id="dataTable" class="mt-24">
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
                    {{ $t('weboffice.Date') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Line') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Depth') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Buyer') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Product') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CommissionRate') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.BonusType') }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(row, rowKey) in getDetailsTableData">
                  <tr
                    :key="rowKey"
                    class="even:bg-grey-light even:bg-opacity-30"
                  >
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.date }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.line }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.depth }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.based_on_position }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ getProductName(row.product) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.commission_rates }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.bonus_type_localized }}
                    </td>
                    <td
                      class="py-13 px-8 border border-grey-light text-right link cursor-pointer"
                      @click="showDetails(rowKey)"
                    >
                      {{ $t('general.Details') }}
                      <i
                        :class="[
                          rowKey === activeKey
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down'
                        ]"
                        class="w-16 fas"
                      ></i>
                    </td>
                  </tr>
                  <tr v-show="activeKey === rowKey" :key="'second-' + rowKey">
                    <td
                      colspan="8"
                      class="bg-grey-light bg-opacity-30 border border-grey-light"
                    >
                      <div
                        class="flex flex-col py-13 px-8 border-t border-b text-sm leading-14"
                      >
                        <div>
                          {{ $t('weboffice.Price') }}:
                          {{ row.currency }}
                          {{
                            row.price
                              | formatNumber('0,0', {
                                thousandsSeparator: ' '
                              })
                          }}
                        </div>
                        <div class="mt-8">
                          {{ $t('weboffice.QualificationPointForProducts') }}:
                          {{ row.qualification_point }}
                        </div>
                        <div class="mt-8">
                          {{ $t('weboffice.PaidOutPoints') }}:
                          {{ row.bonus_amount }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="paymentPoints !== false && dataMaxPage > 1"
              :max-pages="dataMaxPage"
              :current-page="dataCurrentPage"
              @click="dataNavPage"
            />
          </div>
        </div>
        <!-- KIFIZETETT PONTOK -->
        <WebofficeCard
          :title="$t('weboffice.PaidOutPointsCyclePoolBonus')"
          class="mt-24"
        >
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
                    {{ $t('weboffice.Date') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PositionName') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.NumberOfCompletedCycles') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PaidOutPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Quarantined') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in getCycleBonusTable"
                  :key="rowKey"
                  class="even:bg-grey-light even:bg-opacity-30"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.createDate.substring(0, 10) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.pos_name }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.rollOut }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.amount.toFixed(1) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light text-primary">
                    {{ $t('weboffice.NotQuarantined') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
        </WebofficeCard>
        <WebofficeCard
          id="loyaltyCycleTable"
          :title="$t('weboffice.PaidOutPointsLoyaltyCycleBonus')"
          class="mt-24"
        >
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
                    {{ $t('weboffice.Date') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PositionName') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CompletedSmallCycle') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CompletedBigCycle') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PaidOutPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Quarantined') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in getLoyaltyCycleBonusTable"
                  :key="rowKey"
                  class="even:bg-grey-light even:bg-opacity-30"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.createDate.substring(0, 10) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.pos_name }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.smallrollOut }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.bigrollOut }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.amount.toFixed(1) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light text-primary">
                    {{ $t('weboffice.NotQuarantined') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="paymentPoints !== false && loyaltyCycleMaxPage > 1"
              :max-pages="loyaltyCycleMaxPage"
              :current-page="loyaltyCycleCurrentPage"
              @click="loyaltyCycleNavPage"
            />
          </div>
        </WebofficeCard>
        <WebofficeCard
          id="vipCycleTable"
          :title="$t('weboffice.LoyaltyVIPCycleBonusPaidOutPoints')"
          class="mt-24"
        >
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
                    {{ $t('weboffice.Date') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PositionName') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.CompletedSmallCycle') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PaidOutPoints') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Quarantined') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(row, rowKey) in getVipCycleBonusTable">
                  <tr
                    :key="rowKey"
                    class="even:bg-grey-light even:bg-opacity-30"
                  >
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.createDate.substring(0, 10) }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.pos_name }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.smallrollOut }}
                    </td>
                    <td class="py-13 px-8 border border-grey-light">
                      {{ row.amount.toFixed(1) }}
                    </td>
                    <td
                      class="py-13 px-8 border border-grey-light text-primary"
                    >
                      {{ $t('weboffice.NotQuarantined') }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="paymentPoints !== false && vipCycleMaxPage > 1"
              :max-pages="vipCycleMaxPage"
              :current-page="vipCycleCurrentPage"
              @click="vipCycleNavPage"
            />
          </div>
        </WebofficeCard>
      </div>
    </div>
  </main>
</template>

<script>
import { getMonthName, getProductName } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import StatusMessage from '@/components/micro/StatusMessage'
import Pagination from '@/components/Pagination'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import Scrollbar from '@/components/Scrollbar'
import ButtonSmall from '~/components/micro/ButtonSmall'
import InputToggle from '~/components/micro/InputToggle'
import InputDropdown from '~/components/micro/InputDropdown'
import InputCheckbox from '~/components/micro/InputCheckbox'

export default {
  name: 'PaymentPointsPage',
  middleware: 'auth_needed',
  components: {
    InputCheckbox,
    InputDropdown,
    InputToggle,
    ButtonSmall,
    Scrollbar,
    WebofficeCard,
    Pagination,
    StatusMessage,
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
      paymentPoints: false,
      allData: true,
      selectedDate: '',
      dataCurrentPage: 1,
      loyaltyCycleCurrentPage: 1,
      vipCycleCurrentPage: 1,
      dataLimit: 40,
      loyaltyCycleLimit: 10,
      vipCycleLimit: 10,
      dataMaxPage: 1,
      loyaltyCycleMaxPage: 1,
      vipCycleMaxPage: 1,
      payoutDates: [],
      activeKey: false,
      productList: {
        travel: this.$t('weboffice.ProductTravel'),
        travel_insurance: this.$t('weboffice.ProductTravelInsurance'),
        step_product1: this.$t('weboffice.ProductStep1'),
        step_product2: this.$t('weboffice.ProductStep2'),
        step_product3: this.$t('weboffice.ProductStep3'),
        loyalty_standard: this.$t('weboffice.ProductLoyaltyStandard'),
        fligth: this.$t('weboffice.ProductFlight'),
        trasfer: this.$t('weboffice.ProductTransfer'),
        loyalty_step_1: this.$t('weboffice.ProductLoyaltyStep1'),
        loyalty_step_2: this.$t('weboffice.ProductLoyaltyStep2'),
        loyalty_step_3: this.$t('weboffice.ProductLoyaltyStep3'),
        basic_package: this.$t('weboffice.ProductBasicPackage'),
        life_package: this.$t('weboffice.ProductLifePackage'),
        ticket: this.$t('weboffice.ProductTicket'),
        loyalty_pro: this.$t('weboffice.ProductLoyaltyPro'),
        loyalty_plus: this.$t('weboffice.ProductLoyaltyPlus'),
        smart_package: this.$t('weboffice.ProductSmartPackage'),
        car_rent: this.$t('weboffice.ProductCarRent'),
        loyalty_auto_big: this.$t('weboffice.ProductLoyaltyRapid'),
        Voucher: this.$t('weboffice.ProductVoucher'),
        Life_upgrade_dynamic: this.$t('weboffice.ProductLifeUpgradeDynamic'),
        loyalty_vip: this.$t('weboffice.ProductLoyaltyVip'),
        portal_use: this.$t('weboffice.ProductPortalUse'),
        new_voucher: this.$t('weboffice.ProductNewVoucher'),
        smart_upgrade_life: this.$t('weboffice.ProductSmartUpgradeLife'),
        business_upgrade_life: this.$t('weboffice.ProductBusinessUpgradeLife'),
        basic_upgrade_life: this.$t('weboffice.ProductBasicUpgradeLife'),
        loyalty_trio: this.$t('weboffice.ProductLoyaltyTrio'),
        Correction_commission: this.$t('weboffice.ProductCorrectionCommission'),
        traval_full_right: this.$t('weboffice.ProductTravelFullRight')
      },
      bonusTypeList: [
        {
          key: 'DIRECT',
          name: this.$t('weboffice.BonusTypeDirect'),
          value: true
        },
        {
          key: 'DEPTH',
          name: this.$t('weboffice.BonusTypeDepth'),
          value: true
        },
        {
          key: 'MATRIX',
          name: this.$t('weboffice.BonusTypeMatrix'),
          value: true
        },
        {
          key: 'CAR',
          name: this.$t('weboffice.BonusTypeCar'),
          value: false,
          disabled: true
        },
        {
          key: 'MATCHING',
          name: this.$t('weboffice.BonusTypeMatching'),
          value: true
        },
        {
          key: 'GENERATION',
          name: this.$t('weboffice.BonusTypeGeneration'),
          value: true
        },
        {
          key: 'MIGRATION',
          name: this.$t('weboffice.BonusTypeMigration'),
          value: true
        },
        {
          key: 'EXTRADEPTH',
          name: this.$t('weboffice.BonusTypeExtraDepth'),
          value: true
        },
        {
          key: 'LEADERDEPTH',
          name: this.$t('weboffice.BonusTypeLeaderDepth'),
          value: true
        },
        {
          key: 'loyalty_cycle_bonus',
          name: this.$t('weboffice.BonusTypeLoyaltyCycle'),
          value: true
        },
        {
          key: 'loyalty_vip_cycle_bonus',
          name: this.$t('weboffice.BonusTypeLoyaltyVipCycle'),
          value: true
        },
        {
          key: 'loyalty_bpo_cycle_bonus',
          name: this.$t('weboffice.BonusTypeLoyaltyCycleBPO'),
          value: true
        },
        {
          key: 'cis_commission_bonus',
          name: this.$t('weboffice.BonusTypeCisCommissions'),
          value: true
        },
        {
          key: 'CANCELLATION',
          name: this.$t('weboffice.BonusTypeCancellation'),
          value: true
        },
        {
          key: 'CANCELLATION_CAR',
          name: this.$t('weboffice.BonusTypeCancellationCar'),
          value: false,
          disabled: true
        },
        {
          key: 'CHARGEBACK',
          name: this.$t('weboffice.DeductedItems'),
          value: true
        },
        {
          key: 'CHARGEBACK_CAR',
          name: this.$t('weboffice.BonusTypeChargebackCar'),
          value: false,
          disabled: true
        },
        {
          key: 'CYCLE_BPO',
          name: this.$t('weboffice.BonusTypeLoyaltyCycleBPO'),
          value: false,
          disabled: true
        },
        {
          key: 'POOL',
          name: this.$t('weboffice.VipLeaderBonus'),
          value: true,
          disabled: true
        },
        {
          key: 'PPLB',
          name: this.$t('weboffice.PassivePowerlineBonus'),
          value: true,
          disabled: true
        }
      ],
      dataDetailsHtml:
        '<div class="flex flex-col text-sm leading-14">\n' +
        '                  <div>' +
        this.$t('weboffice.Price') +
        ' (USD): __price__ __currency__</div>\n' +
        '                  <div class="mt-8">' +
        this.$t('weboffice.QualificationPointForProducts') +
        ': __points__</div>\n' +
        '                  <div class="mt-8">' +
        this.$t('weboffice.PaidOutPoints') +
        ': __points2__</div>' +
        '                </div>',
      dataActiveItem: false,
      selectDateError: ''
    }
  },
  computed: {
    getDetailsTableData() {
      if (this.paymentPoints.datas !== undefined) {
        const tableData = this.paymentPoints.datas.slice(
          (this.dataCurrentPage - 1) * this.dataLimit,
          (this.dataCurrentPage - 1) * this.dataLimit + this.dataLimit
        )
        if (tableData.length > 0) {
          tableData.forEach((item) => {
            item.date = item.date.substring(0, 10)
            if (Number.isFinite(item.commission_rates)) {
              item.commission_rates = item.commission_rates.toFixed(2) + ' %'
            }
            item.product_localized = this.productList[item.product]
            const bonusType = this.bonusTypeList.find(
              (o) => o.key === item.bonus_type
            )
            item.bonus_type_localized =
              bonusType.name !== undefined ? bonusType.name : ''
            if (Number.isFinite(item.price)) {
              item.price = item.price.toFixed(2)
            }
            if (Number.isFinite(item.bonus_amount)) {
              item.bonus_amount = item.bonus_amount.toFixed(2)
            }
          })
        }
        return tableData
      } else {
        return []
      }
    },
    getCycleBonusTable() {
      if (
        this.paymentPoints.cycleBonusData !== undefined &&
        this.paymentPoints.cycleBonusData.cycle_details !== undefined
      ) {
        return this.paymentPoints.cycleBonusData.cycle_details
      }
      return []
    },
    getLoyaltyCycleBonusTable() {
      if (
        this.paymentPoints.loyaltyCycleData !== undefined &&
        this.paymentPoints.loyaltyCycleData.loyalty_cycle_details !== undefined
      ) {
        return this.paymentPoints.loyaltyCycleData.loyalty_cycle_details.slice(
          (this.loyaltyCycleCurrentPage - 1) * this.loyaltyCycleLimit,
          (this.loyaltyCycleCurrentPage - 1) * this.loyaltyCycleLimit +
            this.loyaltyCycleLimit
        )
      }
      return []
    },
    getVipCycleBonusTable() {
      if (this.paymentPoints.loyalty_vip_cycle_details !== undefined) {
        return this.paymentPoints.loyalty_vip_cycle_details.slice(
          (this.vipCycleCurrentPage - 1) * this.vipCycleLimit,
          (this.vipCycleCurrentPage - 1) * this.vipCycleLimit +
            this.vipCycleLimit
        )
      }
      return []
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getMonthName,
    getProductName,
    async getDetails() {
      const payload = {
        initFilterDates: this.payoutDates.length === 0
      }
      if (!this.allData) {
        if (this.payoutDates[this.selectedDate] === undefined) {
          this.selectDateError = this.$t('weboffice.DateRequired')
          return
        }
        payload.selectedDate = this.payoutDates[this.selectedDate]
      }

      this.bonusTypeList.forEach((bonusType) => {
        payload[bonusType.key] = bonusType.value
      })

      this.$scrollTo('#__nuxt')
      this.dataCurrentPage = 1
      this.loyaltyCycleCurrentPage = 1
      this.vipCycleCurrentPage = 1
      this.dataMaxPage = 1
      this.loyaltyCycleMaxPage = 1
      this.vipCycleMaxPage = 1
      this.paymentPoints = false
      try {
        this.paymentPoints = await this.$store.dispatch(
          'user/getPaymentPoints',
          payload
        )
      } catch (e) {}
      if (this.paymentPoints) {
        if (this.payoutDates.length === 0) {
          this.payoutDates = this.paymentPoints.payoutDays.reverse()
        }
        this.dataMaxPage = Math.ceil(
          this.paymentPoints.datas.length / this.dataLimit
        )
        if (
          this.paymentPoints.loyaltyCycleData !== undefined &&
          this.paymentPoints.loyaltyCycleData.loyalty_cycle_details !==
            undefined
        ) {
          this.loyaltyCycleMaxPage = Math.ceil(
            this.paymentPoints.loyaltyCycleData.loyalty_cycle_details.length /
              this.loyaltyCycleLimit
          )
        }
        if (this.paymentPoints.loyalty_vip_cycle_details !== undefined) {
          this.vipCycleMaxPage = Math.ceil(
            this.paymentPoints.loyalty_vip_cycle_details.length /
              this.vipCycleLimit
          )
        }
        this.bonusTypeList.forEach((bonusType) => {
          if (
            bonusType.key === 'MATRIX' &&
            this.paymentPoints.showMatrix === false
          ) {
            bonusType.show = false
          } else if (
            bonusType.key === 'CAR' &&
            this.paymentPoints.showCar === false
          ) {
            bonusType.show = false
          } else if (
            bonusType.key === 'MATCHING' &&
            this.paymentPoints.showMatching === false
          ) {
            bonusType.show = false
          } else if (
            bonusType.key === 'EXTRADEPTH' &&
            this.paymentPoints.showExtraDepth === false
          ) {
            bonusType.show = false
          } else {
            bonusType.show = true
          }
        })
      }
    },
    dataNavPage(page) {
      this.dataCurrentPage = page
      this.dataActiveItem = false
      this.$scrollTo('#dataTable')
    },
    loyaltyCycleNavPage(page) {
      this.loyaltyCycleCurrentPage = page
      this.$scrollTo('#loyaltyCycleTable')
    },
    vipCycleNavPage(page) {
      this.vipCycleCurrentPage = page
      this.$scrollTo('#vipCycleTable')
    },
    changeDataActiveDetails(activeItem) {
      this.dataActiveItem = activeItem
    },
    showDetails(key) {
      if (this.activeKey === key) {
        this.activeKey = false
      } else {
        this.activeKey = key
      }
    },
    getPaidOutPoints(currency, bonusKey) {
      const key = currency === 'USD' ? 'sums' : 'sums_euro'
      if (this.paymentPoints[key][bonusKey] !== undefined) {
        return this.paymentPoints[key][bonusKey]
      }
      return 0
    },
    getTotalPaidOutPoints(currency) {
      const key = currency === 'USD' ? 'sums' : 'sums_euro'
      let sum = 0
      this.bonusTypeList.forEach((bonusType) => {
        if (
          bonusType.show === true &&
          this.paymentPoints[key][bonusType.key] !== undefined
        ) {
          sum += this.paymentPoints[key][bonusType.key]
        }
      })
      return sum
    },
    removeFilters() {
      this.allData = true
      this.selectedDate = ''
      this.bonusTypeList.forEach((bonusType) => {
        if (
          bonusType.key.includes(['CAR', 'CANCELLATION_CAR', 'CHARGEBACK_CAR'])
        ) {
          bonusType.value = false
        } else {
          bonusType.value = true
        }
      })
      this.getDetails()
    },
    selectDate() {
      this.allData = false
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePaymentPointsTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePaymentPointsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePaymentPointsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
