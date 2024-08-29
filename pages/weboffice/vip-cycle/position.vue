<template>
  <main>
    <LoadingLayerWeboffice v-if="vipPosition === false" />
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
            name: $t('weboffice.LoyaltyVipPosition')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LoyaltyVipPosition') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning">
          <div
            class="text-sm leading-20"
            v-html="$t('weboffice.VipCyclePositionMessageBox')"
          />
        </StatusMessage>
        <!-- FRONTS NOT ATTACHED -->
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.FrontsNotAttachedToPositions') }}
        </div>
        <div v-show="vipPosition.notAttached.users.length === 0">
          {{ $t('weboffice.EmptyFrontsNotAttachedToPositions') }}
        </div>
        <div v-show="vipPosition.notAttached.users.length > 0">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              id="FrontsNotAttached"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8 text-left w-177">
                    {{ $t('weboffice.Name') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Email') }}
                  </th>
                  <th class="py-14 px-8 text-left w-177">
                    {{ $t('weboffice.PurchaseProductFirst') }}
                  </th>
                  <th class="py-14 px-8 text-left w-100"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in vipPosition.notAttached.users.slice(
                    (currentPage - 1) * limit,
                    (currentPage - 1) * limit + limit
                  )"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                  class="odd:bg-grey-light"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.username }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.name }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.email }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.buyDate }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      class="w-full text-center link cursor-pointer"
                      @click="setPosition(row, 'notAttached')"
                    >
                      {{ $t('weboffice.SelectPosition') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="vipPosition.notAttached.users.length > 0"
              :max-pages="
                Math.ceil(vipPosition.notAttached.users.length / limit)
              "
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </div>
        <!-- WAITING TO PLACE -->
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.PlacementWaitingPositions') }}
        </div>
        <div v-show="vipPosition.waitingToPlace.length === 0">
          {{ $t('weboffice.EmptyPlacementWaitingPositions') }}
        </div>
        <div v-show="vipPosition.waitingToPlace.length > 0">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              id="WaitingToPlace"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left w-2/5">
                    {{ $t('weboffice.PositionAwaitingPlacement') }}
                  </th>
                  <th class="py-14 px-8 text-left w-1/5">
                    {{ $t('weboffice.Validity') }}
                  </th>
                  <th class="py-14 px-8 text-left w-2/5"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in vipPosition.waitingToPlace.slice(
                    (waitingToPlaceCurrentPage - 1) * limit,
                    (waitingToPlaceCurrentPage - 1) * limit + limit
                  )"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                  class="odd:bg-grey-light"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.waitingName }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.waitingFor }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      class="w-full text-center link cursor-pointer"
                      @click="setPosition(row, 'waitingToPlace')"
                    >
                      {{ $t('weboffice.SelectPosition') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="vipPosition.waitingToPlace.length > 0"
              :max-pages="Math.ceil(vipPosition.waitingToPlace.length / limit)"
              :current-page="waitingToPlaceCurrentPage"
              @click="waitingNavPage"
            />
          </div>
        </div>
        <!-- STORED SIGNS -->
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.StoredSigns') }}
        </div>
        <div v-show="vipPosition.storedSigns.length === 0">
          {{ $t('weboffice.EmptyStoredSigns') }}
        </div>
        <div v-show="vipPosition.storedSigns.length > 0">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              id="StoredSigns"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold">
                <tr>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.PositionOwner') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.StoredSignMakingPosition') }}
                  </th>
                  <th class="py-14 px-8 text-left">
                    {{ $t('weboffice.Validity') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in vipPosition.storedSigns.slice(
                    (storedSignsCurrentPage - 1) * limit,
                    (storedSignsCurrentPage - 1) * limit + limit
                  )"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                  class="odd:bg-grey-light"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.owner }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.giver }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.expireDate }}
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="vipPosition.storedSigns.length > 0"
              :max-pages="Math.ceil(vipPosition.storedSigns.length / limit)"
              :current-page="storedSignsCurrentPage"
              @click="storedSignsNavPage"
            />
          </div>
        </div>
        <div v-show="ownPositions.length > 0" class="flex flex-col mt-16">
          <div
            class="flex items-center text-lg leading-24 font-bold mb-16 mt-40"
          >
            {{ $t('weboffice.OwnOositions') }}
          </div>

          <div class="text-sm leading-14 text-black">
            <div
              class="md:grid md:grid-cols-12 md:gap-4 py-8 border-b border-grey-light text-left"
            >
              <div class="flex flex-wrap content-center">
                <InputCheckbox
                  v-model="allPosition"
                  class="ml-16 mb-24"
                  @input="selectAllPosition"
                />
              </div>
              <div
                class="col-span-2 flex flex-wrap content-center justify-center"
              >
                {{ $t('weboffice.OwnOositions') }}
              </div>
              <div
                class="col-span-1 flex flex-wrap content-center justify-center"
              >
                {{ $t('weboffice.Status') }}
              </div>
            </div>
            <template v-for="(row, rowKey) in Object.values(ownPositions)">
              <div
                v-if="row.available"
                :key="rowKey"
                class="md:grid md:grid-cols-12 md:gap-4 py-8 border-b border-grey-light text-left"
              >
                <div class="flex flex-wrap content-center justify-between">
                  <InputCheckbox
                    v-if="!row.indexView.includes('Extra')"
                    v-model="row.selected"
                    class="ml-16 mb-24"
                    @input="selectAllBefore(rowKey)"
                  />
                  <div
                    class="flex content-center md:hidden md:mt-0 md:mr-0 mt-16 mr-16"
                    :class="
                      row.buyWebOfficeFee !== undefined &&
                      row.buyWebOfficeFee !== ''
                        ? ''
                        : !row.active
                        ? 'text-danger font-bold'
                        : ''
                    "
                  >
                    {{
                      row.buyWebOfficeFee !== undefined &&
                      row.buyWebOfficeFee !== ''
                        ? $t('weboffice.Passive')
                        : !row.active
                        ? $t('weboffice.Inactive')
                        : $t('weboffice.StatusActive')
                    }}
                  </div>
                </div>
                <div
                  class="col-span-2 flex md:justify-start justify-center md:mb-0 mb-16"
                >
                  <div
                    :class="
                      row.positionId && row.index
                        ? 'bg-primary text-white'
                        : 'border border-primary text-primary'
                    "
                    class="flex relative items-center cursor-pointer justify-center w-128 h-128 rounded-full"
                    @click="
                      row.positionId && row.index
                        ? $router.push(
                            localePath(
                              '/weboffice/vip-cycle/cycle-view/' +
                                row.positionId +
                                '/' +
                                row.index
                            )
                          )
                        : false
                    "
                  >
                    {{ getFees.username }} {{ row.indexView }}
                    <div
                      v-show="row.isFreeRound"
                      class="absolute flex right-0 top-0 bg-primary-light w-34 h-34 items-center justify-center rounded-full border-2 border-white"
                    >
                      <i class="flex fas fa-lg fa-gift"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="col-span-1 flex flex-wrap flex-cols content-center justify-center"
                >
                  <div
                    class="flex content-center md:block hidden"
                    :class="
                      row.buyWebOfficeFee !== undefined &&
                      row.buyWebOfficeFee !== ''
                        ? ''
                        : !row.active
                        ? 'text-danger font-bold'
                        : ''
                    "
                  >
                    {{
                      row.buyWebOfficeFee !== undefined &&
                      row.buyWebOfficeFee !== ''
                        ? $t('weboffice.Passive')
                        : !row.active
                        ? $t('weboffice.Inactive')
                        : $t('weboffice.StatusActive')
                    }}
                  </div>
                </div>
                <div
                  v-if="getCounterValue(row) !== false"
                  class="col-span-3 flex-wrap flex-rows content-center justify-center lg:flex hidden"
                >
                  <div class="text-center content-center mt-5">
                    <span
                      v-if="row.isFreeRound"
                      class="text-xs font-bold text-danger"
                      >{{ $t('weboffice.CounterLabel1') }}
                    </span>
                    <span v-else class="text-xs text-grey-50">{{
                      $t('weboffice.CounterLabel2')
                    }}</span>
                    <br />
                    <div
                      class="flex-rows flex justify-center content-center mt-4"
                    >
                      <CountDown
                        class="text-center mt-4"
                        :end-date="getCounterValue(row)"
                      />
                      <Tooltip
                        :tooltip-text="
                          row.isFreeRound
                            ? $t('weboffice.VIPFreeTooltip')
                            : $t('weboffice.VIPOtherTooltip')
                        "
                        :tooltip-style="['w-240']"
                        position="left"
                        class="ml-4 mt-5"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="col-span-3 flex flex-col md:mb-0 mb-16 items-center justify-center content-center"
                >
                  <div class="flex flex-col">
                    <div
                      v-if="getDoubleCounter(row) !== false"
                      :class="
                        !row.indexView.includes('Extra')
                          ? 'border-b border-primary mb-10 pb-10'
                          : ''
                      "
                      class="col-span-3 flex flex-cols content-center justify-center"
                    >
                      <div class="text-center content-center mt-5">
                        <span class="text-xs text-grey-50">
                          {{ $t('weboffice.DoubleVIPLabel') }}
                        </span>
                        <br />
                        <div
                          class="flex-rows flex justify-center content-center mt-4"
                        >
                          <CountDown
                            class="text-center mt-4"
                            :end-date="getDoubleCounter(row)"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!row.indexView.includes('Extra')"
                      class="flex flex-grow sm:flex-row leading-20 md:justify-end justify-center"
                    >
                      <InputCheckbox
                        v-model="row.isAutoRebuy"
                        @input="vipCycleAutoBuy(row)"
                        ><div>
                          {{ $t('weboffice.AutoReactivation') }}
                        </div></InputCheckbox
                      ><Tooltip
                        :tooltip-text="
                          $t('weboffice.VipCycleBonusPositionAutoReBuyTooltip')
                        "
                        :tooltip-style="['w-240']"
                        position="left"
                        class="ml-4"
                      />
                    </div>
                  </div>
                </div>
                <div
                  :class="
                    getCounterValue(row) !== false ||
                    getDoubleCounter(row) !== false
                      ? 'col-span-2'
                      : 'col-span-3'
                  "
                  class="flex flex-wrap content-center justify-center md:mb-0 mb-16"
                >
                  <div class="flex justify-end">
                    <ButtonSmall
                      v-if="
                        row.isUpgradable && vipUgradeEnabled && !row.isWaiting
                      "
                      type="inverted"
                      class=""
                      @click="uploadPosition(rowKey)"
                    >
                      {{ $t('weboffice.VIPUpgradeButton') }}
                    </ButtonSmall>
                    <div
                      v-if="
                        row.isUploadable &&
                          !row.indexView.includes('Extra') &&
                          !row.isWaiting
                      "
                      class="link cursor-pointer"
                      @click="uploadPosition(rowKey)"
                    >
                      {{ $t('weboffice.PositionUpload') }}
                    </div>
                    <div
                      v-if="
                        row.buyWebOfficeFee !== undefined &&
                          row.buyWebOfficeFee !== ''
                      "
                      class="link cursor-pointer"
                      @click="
                        $router.push(
                          localePath('/weboffice/membership-upgrade')
                        )
                      "
                    >
                      {{ $t('weboffice.BuyWebOfficeFee') }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="getCounterValue(row) !== false"
                  class="col-span-12 flex flex-wrap flex-cols lg:hidden"
                >
                  <div class="text-center content-center mb-5">
                    <span
                      v-if="row.isFreeRound"
                      class="text-xs font-bold text-danger"
                      >{{ $t('weboffice.CounterLabel1') }}
                    </span>
                    <span v-else class="text-xs text-grey-50">{{
                      $t('weboffice.CounterLabel2')
                    }}</span>
                    <br />
                    <div
                      class="flex-rows flex justify-center content-center mt-4"
                    >
                      <CountDown
                        class="text-center mt-4"
                        :end-date="getCounterValue(row)"
                      />
                      <Tooltip
                        :tooltip-text="
                          row.isFreeRound
                            ? $t('weboffice.VIPFreeTooltip')
                            : $t('weboffice.VIPOtherTooltip')
                        "
                        :tooltip-style="['w-240']"
                        position="left"
                        class="ml-4 mt-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div id="billingData" class="mt-24">
          <div v-if="showBillingData && productTotalPrice > 0">
            <div
              class="flex items-center text-lg leading-24 font-bold mb-16 mt-40"
            >
              {{ $t('weboffice.Pay') }}
            </div>
            <div v-show="!cartUpgrade" class="text-danger leadong-16 my-12">
              {{ $t('weboffice.UploadVipCyclePositionDesc') }}
              {{ getSelectedUploadName }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 md:gap-8">
              <div v-if="!cartUpgrade" class="w-full mb-16">
                <div class="flex flex-col rounded border border-primary">
                  <div class="p-16 font-bold leading-16 bg-primary text-white">
                    {{ $t('weboffice.PositionActivation') }}
                  </div>
                  <div>
                    <div
                      class="flex flex-col justify-between items-center p-16 text-sm leading-14"
                    >
                      <div class="flex flex-col w-full">
                        <div class="text-primary font-bold">
                          1x {{ $t('weboffice.VipCyclePosition') }}
                        </div>
                        <div v-if="vipProduct.upload.bpo > 0" class="mt-4">
                          {{ vipProduct.upload.bpo }}x
                          {{ $t('weboffice.BestPriceOption') }}
                        </div>
                        <div v-if="vipProduct.upload.pbpo > 0" class="mt-4">
                          {{ vipProduct.upload.pbpo }}x
                          {{ $t('weboffice.ProductPremiumBestPriceOption') }}
                        </div>
                        <div v-if="vipProduct.upload.dv > 0" class="ml-9 mt-4">
                          {{ vipProduct.upload.dv }}x
                          {{ $t('general.PremiumVoucher') }}
                        </div>
                      </div>
                      <div class="flex flex-row mt-24 w-full">
                        <div class="flex items-center flex-grow text-left">
                          {{ getSelectedUpload }}x {{ $t('general.Piece') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ 'EUR' }}
                      {{
                        productTotalPrice
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="cartUpgrade" class="w-full mb-16">
                <div class="flex flex-col rounded border border-primary">
                  <div class="p-16 font-bold leading-16 bg-primary text-white">
                    {{ $t('weboffice.VIPUpgradeTitle') }}
                  </div>
                  <div>
                    <div
                      class="flex flex-col justify-between items-center p-16 text-sm leading-14"
                    >
                      <div class="flex flex-col w-full">
                        <div>
                          {{ $t('weboffice.VIPUpgradeContainLine1') }}
                        </div>
                        <div v-if="vipProduct.upgrade.bpo > 0" class="mt-4">
                          {{ vipProduct.upgrade.bpo }}x
                          {{ $t('weboffice.BestPriceOption') }}
                        </div>
                        <div v-if="vipProduct.upgrade.pbpo > 0" class="mt-4">
                          {{ vipProduct.upgrade.pbpo }}x
                          {{ $t('weboffice.ProductPremiumBestPriceOption') }}
                        </div>
                        <div v-if="vipProduct.upgrade.dv > 0" class="ml-9 mt-4">
                          {{ vipProduct.upgrade.dv }}x
                          {{ $t('general.PremiumVoucher') }}
                        </div>
                      </div>
                      <div class="flex flex-row mt-24 w-full">
                        <div class="flex items-center flex-grow text-left">
                          {{ getSelectedUpgrade }}x {{ $t('general.Piece') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ 'EUR' }}
                      {{
                        productTotalPrice
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                  </div>
                </div>
              </div>
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
                  {{ 'EUR' }}
                  {{
                    productTotalPrice
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
              </div>
              <div
                v-if="!cartUpgrade"
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
                  :mask="'EUR 99999'"
                  :class="'w-full'"
                  :is-dark="false"
                  :is-disabled="getFees.tc.credit <= 0"
                  @input="changeAddedTravelCard"
                />

                <div class="text-xs mt-4 leading-12 text-grey-dark">
                  {{ $t('general.CurrentTC') }}: {{ 'EUR' }}
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
                  {{ 'EUR' }}
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
                      {{ 'EUR' }}
                      {{
                        (productTotalPrice - getAddedTravelCard)
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div
                      class="text-xs leading-12 text-white text-opacity-75 mt-2"
                    >
                      (+ {{ 'EUR' }}
                      {{
                        getHandlingFee(
                          productTotalPrice - getAddedTravelCard,
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
                  productTotalPrice > 0 && !payInProgress
                    ? 'bg-danger text-white'
                    : 'bg-grey-light text-grey'
                "
                class="text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
                @click="pay"
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
        <div
          v-show="countSelectedPosition > 0"
          class="flex md:flex-row flex-col fixed bottom-0 left-0 md:px-40 px-15 py-15 w-full bg-white border-t text-sm border-primary z-20 leading-16"
        >
          <div class="flex-col pt-3">
            {{ countSelectedPosition }} {{ $t('weboffice.SelectedPosition') }}
            <div
              class="text-primary cursor-pointer font-bold"
              @click="selectAllPosition(true)"
            >
              {{ $t('weboffice.SelectAll') }}
            </div>
          </div>
          <div class="flex-grow text-right">
            <ButtonSmall
              type="inverted"
              class="md:w-auto w-full md:mb-0 md:mt-0 mb-10 mt-10"
              :is-disabled="getSelectedUpload <= 0"
              @click="uploadPositions"
            >
              {{ $t('weboffice.PositionUploadButton') }}
            </ButtonSmall>
            <ButtonSmall
              v-if="vipUgradeEnabled"
              type="inverted"
              class="md:w-auto w-full"
              :is-disabled="getSelectedUpgrade <= 0"
              @click="upgradePositions"
            >
              {{ $t('weboffice.PositionUpgradeButton') }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
    <DecisionModal
      v-show="setPositionModalActive"
      with-class="w-320 md:w-650"
      :accept-button="$t('weboffice.Save')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="setPositionIsLoading"
      @close="setPositionModalActive = false"
      @cancel="setPositionModalActive = false"
      @accept="selectPosition"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{
              selectedToPosition.type === 'notAttached'
                ? $t('weboffice.FrontsNotAttachedToPositions')
                : selectedToPosition.type === 'waitingToPlace'
                ? $t('weboffice.PlacementWaitingPositions')
                : ''
            }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div
            v-show="selectedToPosition.type === 'notAttached'"
            class="flex flex-col text-sm leading-14"
          >
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.Username') }}</span
              >: {{ selectedToPosition.username }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.Name') }}</span
              >: {{ selectedToPosition.name }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.Email') }}</span
              >: {{ selectedToPosition.email }}
            </div>
            <InputDropdown
              v-model="selectedToPosition.position"
              :placeholder="$t('weboffice.PleaseSelect')"
              :is-dark="false"
              :values="notAttachedPositions"
              :label="$t('weboffice.WhichUserPosition')"
              :class="'w-full md:w-240 mt-16'"
            />
          </div>
          <div
            v-show="selectedToPosition.type === 'waitingToPlace'"
            class="flex flex-col text-sm leading-14"
          >
            <div class="mt-4">
              <span class="font-bold">{{
                $t('weboffice.PositionAwaitingPlacement')
              }}</span
              >: {{ selectedToPosition.waitingName }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.Validity') }}</span
              >: {{ selectedToPosition.waitingFor }}
            </div>
            <InputDropdown
              v-model="selectedToPosition.position"
              :placeholder="$t('weboffice.PleaseSelect')"
              :is-dark="false"
              :values="selectedToPosition.positionSelectValues"
              :label="$t('weboffice.WhichUserPosition')"
              :class="'w-full md:w-240 mt-16'"
            />
          </div>
        </div>
      </div>
    </DecisionModal>
    <DecisionModal
      v-show="needDistributionRoleModal"
      with-class="w-320 md:w-650"
      :accept-button="$t('general.Ok')"
      :cancel-button="$t('general.Cancel')"
      @close="deselectAll()"
      @cancel="deselectAll()"
      @accept="uploadPositions(true)"
    >
      <div slot="body" class="text-black">
        <div class="flex flex-col">
          <div class="flex text-lg leading-24">
            {{ $t('weboffice.NeedDistributionRole') }}
          </div>
          <div class="flex text-sm leading-20 mt-12 mb-12">
            {{ $t('weboffice.NeedDistributionRoleVIPCycleDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
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
import WebofficeBreadcrumb from '~/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '~/components/micro/LoadingLayerWeboffice'
import StatusMessage from '~/components/micro/StatusMessage'
import Scrollbar from '~/components/Scrollbar'
import Pagination from '~/components/Pagination'
import InputCheckbox from '~/components/micro/InputCheckbox'
import Tooltip from '~/components/micro/Tooltip'
import DecisionModal from '~/components/modal/DecisionModal'
import InformativeModal from '~/components/modal/InformativeModal'
import InputDropdownCountry from '~/components/micro/InputDropdownCountry'
import InputDropdown from '~/components/micro/InputDropdown'
import ButtonSmall from '~/components/micro/ButtonSmall'
import InputText from '~/components/micro/InputText'
import CartCard from '@/components/cart/CartCard'
import InputTextMask from '@/components/micro/InputTextMask'
import NMIModal from '@/components/modal/NMIModal'
import {
  getHandlingFee,
  calcRemainingTime,
  calcRemainingHourMinuteSecond
} from '@/includes/utils'
import CountDown from '@/components/micro/CountDown'

export default {
  name: 'VIPPosition',
  middleware: 'auth_needed',
  components: {
    InputDropdownCountry,
    InputDropdown,
    DecisionModal,
    Tooltip,
    InputCheckbox,
    Pagination,
    Scrollbar,
    StatusMessage,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    ButtonSmall,
    InputText,
    CartCard,
    InputTextMask,
    InformativeModal,
    CountDown,
    NMIModal
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      vipPosition: false,
      limit: 10,
      currentPage: 1,
      storedSignsCurrentPage: 1,
      waitingToPlaceCurrentPage: 1,
      notAttachedPositions: [],
      notAttachedPositionError: false,
      setPositionModalActive: false,
      selectedToPosition: false,
      setPositionIsLoading: false,
      countable: false,
      allPosition: false,
      ownPositions: [],
      countrySelect: [],
      countrySelectCodes: [],
      countrySelectIds: [],
      needDistributionRoleModal: false,
      billingDataErrorModalActive: false,
      payInProgress: false,
      showBillingData: false,
      travelCard: '0',
      cartUpgrade: false,
      nmiPopupActive: false,
      nmiPopup: false,
      vipProduct: {
        upload: {
          price: 500,
          id: 3
        },
        upgrade: {
          price: 1100,
          id: 4
        }
      },
      vipUgradeEnabled: false,
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
      }
    }
  },
  computed: {
    ...mapGetters('user', ['getFees']),
    checkSelectedOwnPosition() {
      for (let i = 0; i < this.ownPositions.length; i++) {
        if (this.ownPositions[i].selected) {
          return true
        }
      }
      return false
    },
    productTotalPrice() {
      return this.cartUpgrade
        ? this.getSelectedUpgrade * this.vipProduct.upgrade.price
        : this.getSelectedUpload * this.vipProduct.upload.price
    },
    countSelectedPosition() {
      let total = 0
      this.ownPositions.forEach((ownPosition) => {
        if (ownPosition.selected) {
          total += 1
        }
      })
      return total
    },
    getSelectedUpgrade() {
      let upgradeCount = 0
      this.ownPositions.forEach((ownPosition, key) => {
        if (ownPosition.isUpgradable && ownPosition.selected) {
          upgradeCount += 1
        }
      })
      return upgradeCount
    },
    getSelectedUpload() {
      let uploadCount = 0
      this.ownPositions.forEach((ownPosition, key) => {
        if (ownPosition.isUploadable && ownPosition.selected) {
          uploadCount += 1
        }
      })
      return uploadCount
    },
    getSelectedUploadName() {
      const names = []
      this.ownPositions.forEach((ownPosition, key) => {
        if (ownPosition.isUploadable && ownPosition.selected) {
          names.push(this.getFees.username + ' #' + (key + 1))
        }
      })
      return names.join(', ')
    },
    getSelectedPositions() {
      return parseInt(this.getSelectedUpgrade + this.getSelectedUpload)
    },
    getAddedTravelCard() {
      const tc = parseInt((this.travelCard + '').replace('EUR', '').trim())
      if (isNaN(tc)) {
        return 0
      } else if (tc <= 0) {
        return 0
      } else if (tc > this.productTotalPrice) {
        return this.productTotalPrice
      } else if (this.getFees !== false && tc > this.getFees.tc.credit) {
        return this.getFees.tc.credit
      } else {
        return tc
      }
    },
    getUploadPositions() {
      const positions = []
      this.ownPositions.forEach((ownPosition) => {
        if (
          (ownPosition.isUploadable || ownPosition.isUpgradable) &&
          ownPosition.selected
        )
          positions.push(ownPosition)
      })
      console.log(positions)
      return positions
    },
    getUpgradePositions() {
      const positions = []
      this.ownPositions.forEach((ownPosition) => {
        if (ownPosition.isUpgradable && ownPosition.selected) {
          positions.push(ownPosition)
        }
      })
      console.log(positions)
      return positions
    }
  },
  mounted() {
    this.getDetails()
    this.setUserBillingData()
  },
  methods: {
    getHandlingFee,
    calcRemainingTime,
    calcRemainingHourMinuteSecond,
    async getDetails() {
      this.$scrollTo('#__nuxt')
      this.vipProduct = {
        upload: {
          price: 500,
          id: 3
        },
        upgrade: {
          price: 1000,
          id: 2
        }
      }
      this.vipUgradeEnabled = false
      this.vipPosition = false
      this.currentPage = 1
      this.storedSignsCurrentPage = 1
      this.waitingToPlaceCurrentPage = 1
      try {
        this.vipPosition = await this.$store.dispatch(
          'user/getVIPCyclePosition',
          {
            availableOnly: true
          }
        )
      } catch (e) {
        console.log(e)
      }
      if (
        this.vipPosition.notAttached !== undefined &&
        this.vipPosition.notAttached.users !== undefined &&
        this.vipPosition.notAttached.positions !== undefined
      ) {
        this.notAttachedPositions = []
        this.vipPosition.notAttached.positions.forEach((position) => {
          this.notAttachedPositions.push('#' + position.index)
        })
      }
      if (this.vipPosition.ownPositions !== undefined) {
        const temp = []
        this.ownPositions = []
        this.vipPosition.ownPositions.forEach((ownPosition) => {
          if (ownPosition.indexView.includes('Extra')) {
            temp.push({
              ...{
                selected: false,
                active:
                  ownPosition.positionId !== undefined &&
                  ownPosition.index !== undefined,
                isUpgradable:
                  ownPosition.positionId !== undefined &&
                  ownPosition.index !== undefined &&
                  ownPosition.version === 1,
                isUploadable:
                  ownPosition.positionId === undefined ||
                  ownPosition.index === undefined
              },
              ...ownPosition
            })
          } else {
            this.ownPositions.push({
              ...{
                selected: false,
                active:
                  ownPosition.positionId !== undefined &&
                  ownPosition.index !== undefined,
                isUpgradable:
                  ownPosition.positionId !== undefined &&
                  ownPosition.index !== undefined &&
                  ownPosition.version === 1,
                isUploadable:
                  ownPosition.positionId === undefined ||
                  ownPosition.index === undefined
              },
              ...ownPosition
            })
          }
        })

        this.ownPositions = [...this.ownPositions, ...temp]
      }
      if (this.vipPosition.productInfo !== undefined) {
        console.log(this.vipPosition.productInfo)
        this.vipProduct = {
          upload: {
            price: this.vipPosition.productInfo.vip_update.price,
            id: this.vipPosition.productInfo.vip_update.itemId,
            bpo: this.vipPosition.productInfo.vip_update.items.bpo.count,
            pbpo: this.vipPosition.productInfo.vip_update.items.pbpo.count,
            dv:
              this.vipPosition.productInfo.vip_update.items.pv !== undefined
                ? this.vipPosition.productInfo.vip_update.items.pv.count
                : this.vipPosition.productInfo.vip_update.items.dv.count
          },
          upgrade: {
            price: this.vipPosition.productInfo.vip_upgrade.price,
            id: this.vipPosition.productInfo.vip_upgrade.itemId,
            bpo: this.vipPosition.productInfo.vip_upgrade.items.bpo.count,
            dv:
              this.vipPosition.productInfo.vip_upgrade.items.pv !== undefined
                ? this.vipPosition.productInfo.vip_upgrade.items.pv.count
                : this.vipPosition.productInfo.vip_upgrade.items.dv.count
          }
        }
        this.vipUgradeEnabled = !this.vipPosition.productInfo.vip_upgrade
          .disabled
      }
    },
    getDoubleCounter(row) {
      if (
        row.doubleBonusEndDate !== undefined &&
        this.calcRemainingHourMinuteSecond(row.doubleBonusEndDate) !== false
      ) {
        return row.doubleBonusEndDate
      }
      return false
    },
    getCounterValue(row) {
      // CIT LOGIKA
      if (row.inCycle === true && row.version === 2) {
        if (row.isFreeRound) {
          if (row.freeRoundUntil !== undefined) {
            if (row.freeRoundUntil !== '') {
              return row.freeRoundUntil
            } else {
              return false
            }
          } else {
            return false
          }
        } else if (
          this.calcRemainingHourMinuteSecond(row.timetogetdvs) !== '00:00:00'
        ) {
          return row.timetogetdvs
        } else {
          return false
        }
      } else {
        return false
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#FrontsNotAttached')
    },
    storedSignsNavPage(page) {
      this.storedSignsCurrentPage = page
      this.$scrollTo('#StoredSigns')
    },
    waitingNavPage(page) {
      this.waitingToPlaceCurrentPage = page
      this.$scrollTo('#WaitingToPlace')
    },
    async vipCycleAutoBuy(params) {
      try {
        await this.$store.dispatch('user/postVIPCycleAutoBuy', {
          isAutoRebuy: params.isAutoRebuy,
          positionId: params.positionId
        })
      } catch (e) {
        console.log(e)
      }
    },
    setPosition(item, type) {
      this.selectedToPosition = item
      this.selectedToPosition.type = type
      this.selectedToPosition.position = 0
      if (type === 'waitingToPlace') {
        this.selectedToPosition.positionSelectValues = []
        this.selectedToPosition.saveOptions.forEach((saveOption) => {
          this.selectedToPosition.positionSelectValues.push(
            '#' + saveOption.index
          )
        })
      }
      this.setPositionModalActive = true
    },
    async selectPosition() {
      this.setPositionIsLoading = true
      const payload = {
        positionId: parseInt(
          this.selectedToPosition.type === 'waitingToPlace'
            ? this.selectedToPosition.saveOptions[
                this.selectedToPosition.position
              ].positionId
            : this.vipPosition.notAttached.positions[
                this.selectedToPosition.position
              ].id
        ),
        folloverUserName:
          this.selectedToPosition.type === 'waitingToPlace'
            ? this.selectedToPosition.saveOptions[
                this.selectedToPosition.position
              ].folloverUserName
            : this.selectedToPosition.username
      }
      if (this.selectedToPosition.type === 'waitingToPlace') {
        payload.isPosition = this.selectedToPosition.saveOptions[
          this.selectedToPosition.position
        ].isPosition
      }
      let res
      try {
        res = await this.$store.dispatch(
          'user/postVIPCyclePlacementUser',
          payload
        )
      } catch (e) {
        this.setPositionIsLoading = false
        console.log(e)
      }
      if (res) {
        this.setPositionIsLoading = false
        this.setPositionModalActive = false
        await this.getDetails()
      }
    },
    selectAllPosition(force) {
      if (force !== undefined) {
        this.allPosition = force
      }
      this.ownPositions.forEach((ownPosition) => {
        if (!ownPosition.indexView.includes('Extra')) {
          if (!(ownPosition.positionId && ownPosition.index)) {
            if (ownPosition.available && !ownPosition.isWaiting) {
              ownPosition.selected = this.allPosition
            }
          }
        }
      })
    },
    selectAllBefore(index) {
      let bigIndex = 0
      this.ownPositions.forEach((ownPosition, indexTmp) => {
        if (ownPosition.selected) {
          bigIndex = indexTmp
        }
      })
      if (!this.ownPositions[index].selected) {
        bigIndex = index
      }

      if (this.ownPositions[index].rolloutCount === 0) {
        this.ownPositions.forEach((ownPosition, indexTmp) => {
          if (!(ownPosition.positionId && ownPosition.index)) {
            if (ownPosition.available && !ownPosition.isWaiting) {
              if (indexTmp < bigIndex) {
                ownPosition.selected = true
              } else if (indexTmp > bigIndex) {
                ownPosition.selected = false
              }
            } else {
              ownPosition.selected = false
            }
          }
        })
        this.countable = true
      } else {
        this.countable = false
      }
    },
    deselectAll() {
      this.needDistributionRoleModal = false
      this.ownPositions.forEach((ownPosition) => {
        if (!(ownPosition.positionId && ownPosition.index)) {
          ownPosition.selected = false
        }
      })
      this.allPosition = false
    },
    upgradePositions(acceptNeedDistributionRole = false) {
      this.cartUpgrade = true
      if (
        this.getFees !== false &&
        !this.getFees.hasDistributorRight &&
        !acceptNeedDistributionRole
      ) {
        this.showBillingData = false
        this.needDistributionRoleModal = true
      } else {
        this.needDistributionRoleModal = false
        this.showBillingData = true
        this.$scrollTo('#billingData')
      }
    },
    uploadPositions(acceptNeedDistributionRole = false) {
      this.cartUpgrade = false
      if (
        this.getFees !== false &&
        !this.getFees.hasDistributorRight &&
        !acceptNeedDistributionRole
      ) {
        this.showBillingData = false
        this.needDistributionRoleModal = true
      } else {
        this.needDistributionRoleModal = false
        this.showBillingData = true
        this.$scrollTo('#billingData')
      }
    },
    uploadPosition(index) {
      if (this.ownPositions[index].rolloutCount === 0) {
        this.countable = true
        this.ownPositions.forEach((ownPosition, indexTmp) => {
          if (!(ownPosition.positionId && ownPosition.index)) {
            if (indexTmp <= index && !ownPosition.isWaiting) {
              ownPosition.selected = true
            } else {
              ownPosition.selected = false
            }
          }
        })
      } else {
        this.countable = false
      }
      if (!this.ownPositions[index].isWaiting) {
        this.ownPositions[index].selected = true
      }
    },
    async pay() {
      if (this.productTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billingData')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payVipCyclePosition', {
              uploadPositions: !this.cartUpgrade ? this.getUploadPositions : [],
              uploadCount: this.getSelectedPositions,
              upgradePositions: this.cartUpgrade
                ? this.getUpgradePositions
                : false,
              itemId: this.cartUpgrade
                ? this.vipProduct.upgrade.id
                : this.vipProduct.upload.id,
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace('EUR', '').trim(),
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale,
              cart_upgrade: this.cartUpgrade
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
                } else {
                  window.location.href = res.forwardURL
                }
              }
            }
            this.payInProgress = false
          }
        }
      }
    },
    /** CHANGE ADDED TRAVEL CARD */
    changeAddedTravelCard() {
      let tc = this.travelCard.replace('EUR', '').trim()
      if (tc !== '') {
        if (this.getFees.tc.credit > 0) {
          tc = parseInt(tc)
          if (isNaN(tc)) {
            this.travelCard = '0'
          } else if (tc > this.productTotalPrice) {
            this.travelCard = this.productTotalPrice + ''
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
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePositionTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePositionTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePositionTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
