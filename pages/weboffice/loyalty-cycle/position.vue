<template>
  <main>
    <LoadingLayerWeboffice v-if="loyaltyCyclePosition === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.LoyaltyCycleBonus'),
            link: '/weboffice/loyalty-cycle/position'
          },
          {
            name: $t('weboffice.LoyaltyCyclePosition')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LoyaltyCyclePosition') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <StatusMessage type="warning">
          <div
            class="text-sm leading-20"
            v-html="$t('weboffice.LoyaltyCyclePositionMessageBox')"
          />
        </StatusMessage>
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.FrontsNotAttachedToPositions') }}
        </div>
        <div
          v-show="Object.values(loyaltyCyclePosition.childrens).length === 0"
        >
          {{ $t('weboffice.EmptyFrontsNotAttachedToPositions') }}
        </div>
        <div v-show="Object.values(loyaltyCyclePosition.childrens).length > 0">
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
              <thead class="font-bold text-left">
                <tr>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8 w-128">
                    {{ $t('weboffice.Name') }}
                  </th>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.Email') }}
                  </th>
                  <th class="py-14 px-8 w-240">
                    {{ $t('weboffice.WhichUserPosition') }}
                  </th>
                  <th class="py-14 px-8 w-100"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in Object.values(
                    loyaltyCyclePosition.childrens
                  ).slice(
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
                    {{ row.fullName }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.mail }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <InputDropdown
                      v-model="row.selectedPosition"
                      :values="row.positionSelectArray"
                      :placeholder="$t('weboffice.PleaseSelect')"
                      :is-dark="false"
                      :error="
                        positionErrorUsername === row.username
                          ? $t('weboffice.PositionRequired')
                          : ''
                      "
                      :class="'w-full z-90'"
                    />
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      class="w-full text-center link cursor-pointer"
                      @click="saveUserPosition(row.username)"
                    >
                      {{ $t('weboffice.Save') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="Object.values(loyaltyCyclePosition.childrens).length > 0"
              :max-pages="
                Math.ceil(
                  Object.values(loyaltyCyclePosition.childrens).length / limit
                )
              "
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </div>
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.PlaceStarredMarkings') }}
        </div>
        <div v-show="getLocateSign.length === 0">
          {{ $t('weboffice.EmptyPlaceStarredMarkings') }}
        </div>
        <div v-show="getLocateSign.length > 0">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              id="PlaceStarredMarkings"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold text-left">
                <tr>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8 w-128">
                    {{ $t('weboffice.TimeLeft') }}
                  </th>
                  <th class="py-14 px-8"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in Object.values(
                    loyaltyCyclePosition.locateSigns
                  )"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                  class="odd:bg-grey-light"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.details.AboutToReceive }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ calcRemainingHourMinuteSecond(row.details.expireDate) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      class="w-full text-center link cursor-pointer"
                      @click="setPosition(row, 'locateSigns')"
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
              v-if="false"
              :max-pages="1"
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </div>
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.PlacementWaitingPositions') }}
        </div>
        <div v-show="waitingPositionsList.length === 0">
          {{ $t('weboffice.EmptyPlacementWaitingPositions') }}
        </div>
        <div v-show="waitingPositionsList.length > 0">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              id="PlacementWaitingPositions"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold text-left">
                <tr>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8 w-128">
                    {{ $t('weboffice.TimeLeft') }}
                  </th>
                  <th class="py-14 px-8"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in waitingPositionsList"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                  class="odd:bg-grey-light"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.username }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ calcRemainingHourMinuteSecond(row.waitingFor) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      class="w-full text-center link cursor-pointer"
                      @click="setPosition(row, 'waitingPosition')"
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
              v-if="false"
              :max-pages="1"
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </div>
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.OwnPositionsAvailableForPlacement') }}
        </div>
        <div v-show="loyaltyCyclePosition.step3WaitingPositions.length === 0">
          {{ $t('weboffice.EmptyOwnPositionsAvailableForPlacement') }}
        </div>
        <div v-show="loyaltyCyclePosition.step3WaitingPositions.length > 0">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold text-left">
                <tr>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.Username') }}
                  </th>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.TimeLeft') }}
                  </th>
                  <th class="py-14 px-8 w-320">
                    {{ $t('weboffice.WhichUserPosition') }}
                  </th>
                  <th class="py-14 px-8 w-100"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row,
                  rowKey) in loyaltyCyclePosition.step3WaitingPositions"
                  :key="rowKey"
                  :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                  class="odd:bg-grey-light"
                >
                  <td class="py-13 px-8 border border-grey-light">
                    {{ row.username }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    {{ calcRemainingHourMinuteSecond(row.waitingFor) }}
                  </td>
                  <td class="py-13 px-8 border border-grey-light text-center">
                    <ButtonSmall
                      type="primary"
                      class="w-177"
                      @click="setStep3WaitingPosition(rowKey)"
                    >
                      {{
                        row.selectedPosition !== ''
                          ? row.positionSelectArray[row.selectedPosition]
                          : $t('weboffice.PleaseSelect')
                      }}
                    </ButtonSmall>
                  </td>
                  <td class="py-13 px-8 border border-grey-light">
                    <div
                      class="w-full text-center link cursor-pointer"
                      @click="saveStep3WaitingPosition(rowKey)"
                    >
                      {{ $t('weboffice.Save') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <div class="flex justify-center mt-24">
            <Pagination
              v-if="false"
              :max-pages="1"
              :current-page="currentPage"
              @click="navPage"
            />
          </div>
        </div>
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.OwnOositions') }}
        </div>
        <div class="flex flex-row">
          <ButtonGroup
            :buttons="[
              {
                text: $t('weboffice.OwnOositions'),
                action: () => {
                  selectActivePosition('own_positions')
                },
                active: selectedActivePosition === 'own_positions'
              },
              {
                text: $t('weboffice.BonusPositions'),
                action: () => {
                  selectActivePosition('bonus_positions')
                },
                active: selectedActivePosition === 'bonus_positions'
              },
              {
                text: $t('weboffice.ExtraPositions'),
                action: () => {
                  selectActivePosition('extra_positions')
                },
                active: selectedActivePosition === 'extra_positions'
              }
            ]"
          />
        </div>
        <div class="flex flex-col mt-16">
          <Scrollbar
            :centered="false"
            class="pr-1"
            :style="'max-width: ' + scrollbarMaxWidth + 'px'"
          >
            <table
              v-show="selectedActivePosition === 'own_positions'"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold text-left">
                <tr>
                  <th class="px-8 text-left w-32">
                    <InputCheckbox
                      v-model="allPosition"
                      class="ml-16 mb-42"
                      @input="selectAllPosition"
                    />
                  </th>
                  <th class="py-14 px-8 w-240">
                    {{ $t('weboffice.OwnOositions') }}
                  </th>
                  <th class="py-14 px-8 w-128">
                    {{ $t('weboffice.Status') }}
                  </th>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.CycleAlreadyStarted') }}
                  </th>
                  <th class="py-14 px-8 w-256"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in Object.values(ownPositions)"
                  :key="rowKey"
                  class="border-b border-grey-light"
                >
                  <td class="py-13 px-8">
                    <InputCheckbox
                      v-model="row.selected"
                      :is-disabled="
                        row.cycleViewLink &&
                        row.cycleViewLink.positionId &&
                        row.cycleViewLink.index &&
                        row.status &&
                        row.status === 'active'
                          ? true
                          : false
                      "
                      @input="selectAllBefore(rowKey)"
                    />
                  </td>
                  <td class="py-13 px-8">
                    <div
                      :class="
                        !(
                          row.cycleViewLink &&
                          row.cycleViewLink.positionId &&
                          row.cycleViewLink.index &&
                          row.status
                        ) || row.status === 'inactive'
                          ? 'border border-primary text-primary'
                          : row.cycleStatus === 'small'
                          ? 'bg-primary text-white'
                          : 'bg-warning-dark text-white'
                      "
                      class="flex items-center cursor-pointer justify-center w-128 h-128 rounded-full"
                      @click="
                        row.cycleViewLink
                          ? $router.push(
                              localePath(
                                '/weboffice/loyalty-cycle/cycle-view/' +
                                  row.cycleViewLink.positionId +
                                  '/' +
                                  row.cycleViewLink.index
                              )
                            )
                          : false
                      "
                    >
                      {{ getFees.username }} #{{ row.i + 1 }}
                    </div>
                  </td>
                  <td
                    v-if="row.status !== undefined"
                    class="py-13 px-8 text-primary"
                  >
                    {{
                      row.status === 'active'
                        ? $t('weboffice.StatusActive')
                        : row.status === 'inactive'
                        ? $t('weboffice.Inactive')
                        : $t('weboffice.Passive')
                    }}
                  </td>
                  <td class="py-13 px-8">
                    <div
                      v-show="
                        !(
                          row.cycleViewLink &&
                          row.cycleViewLink.positionId &&
                          row.cycleViewLink.index &&
                          row.status
                        ) || row.status === 'inactive'
                      "
                      class="link cursor-pointer"
                      @click="uploadPosition(rowKey)"
                    >
                      {{ $t('weboffice.PositionUpload') }}
                    </div>
                    <div
                      v-show="
                        row.cycleViewLink &&
                          row.cycleViewLink.positionId &&
                          row.cycleViewLink.index &&
                          row.status &&
                          row.status === 'active'
                      "
                      class="text-grey-dark"
                    >
                      {{
                        row.cycleStatus === 'small'
                          ? $t('weboffice.SmallCycle')
                          : $t('weboffice.BigCycle')
                      }}
                    </div>
                  </td>
                  <td class="py-13 px-8">
                    <div
                      v-if="row.cycleViewLink && autoStatusArray[rowKey]"
                      class="flex flex-col leading-20"
                    >
                      <InputCheckbox
                        v-model="autoStatusArray[rowKey].isSmall"
                        @input="changeAutoStatus(rowKey, 'small')"
                        ><div>
                          {{ $t('weboffice.AutoReactivation') }}
                        </div></InputCheckbox
                      >
                      <div class="text-primary">
                        {{ $t('weboffice.InSmallCycle') }}
                      </div>
                      <InputCheckbox
                        v-model="autoStatusArray[rowKey].isBig"
                        @input="changeAutoStatus(rowKey, 'big')"
                        ><div>
                          {{ $t('weboffice.AutoReactivation') }}
                        </div></InputCheckbox
                      >
                      <div class="text-warning-dark">
                        {{ $t('weboffice.InBigCycle') }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              v-show="selectedActivePosition === 'bonus_positions'"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold text-left">
                <tr>
                  <th class="py-14 px-8 w-240">
                    {{ $t('weboffice.BonusPositions') }}
                  </th>
                  <th class="py-14 px-8 w-128">
                    {{ $t('weboffice.Status') }}
                  </th>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.CycleAlreadyStarted') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in Object.values(
                    loyaltyCyclePosition.bonusPositionIds
                  )"
                  :key="rowKey"
                  class="border-b border-grey-light"
                >
                  <td class="py-13 px-8">
                    <div
                      class="flex cursor-pointer items-center justify-center w-128 h-128 bg-primary text-white rounded-full bg-primary text-center"
                      @click="
                        $router.push(
                          localePath(
                            '/weboffice/loyalty-cycle/cycle-view/' +
                              row +
                              '/' +
                              (rowKey + 1)
                          )
                        )
                      "
                    >
                      {{ getFees.username }}<br />
                      BONUS #{{ rowKey + 1 }}
                    </div>
                  </td>
                  <td class="py-13 px-8 text-primary">
                    {{ $t('weboffice.StatusActive') }}
                  </td>
                  <td class="py-13 px-8">
                    {{ $t('weboffice.SmallCycle') }}
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              v-show="selectedActivePosition === 'extra_positions'"
              class="table-auto text-sm leading-14 text-black w-full"
              style="min-width: 800px"
            >
              <thead class="font-bold text-left">
                <tr>
                  <th class="py-14 px-8 w-240">
                    {{ $t('weboffice.BonusPositions') }}
                  </th>
                  <th class="py-14 px-8 w-128">
                    {{ $t('weboffice.Status') }}
                  </th>
                  <th class="py-14 px-8">
                    {{ $t('weboffice.CycleAlreadyStarted') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowKey) in Object.values(
                    loyaltyCyclePosition.extraPos
                  )"
                  :key="rowKey"
                  class="border-b border-grey-light"
                >
                  <td class="py-13 px-8">
                    <div
                      :class="
                        row.cycleStatus === 'small'
                          ? 'bg-primary text-white'
                          : 'bg-warning-dark text-white'
                      "
                      class="flex cursor-pointer items-center justify-center w-128 h-128 rounded-full bg-primary text-center"
                      @click="
                        !row.status
                          ? false
                          : row.cycleViewLink
                          ? $router.push(
                              localePath(
                                '/weboffice/loyalty-cycle/cycle-view/' +
                                  row.cycleViewLink.positionId +
                                  '/' +
                                  row.cycleViewLink.index
                              )
                            )
                          : false
                      "
                    >
                      {{ getFees.username }}<br />
                      EXTRA #{{ row.i + 1 }}
                    </div>
                  </td>
                  <td class="py-13 px-8 text-primary">
                    {{
                      row.status
                        ? $t('weboffice.StatusActive')
                        : $t('weboffice.Inactive')
                    }}
                  </td>
                  <td class="py-13 px-8">
                    {{
                      row.cycleStatus === 'small'
                        ? $t('weboffice.SmallCycle')
                        : $t('weboffice.BigCycle')
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </Scrollbar>
          <ButtonSmall
            type="primary"
            :is-disabled="!checkSelectedOwnPosition"
            class="w-320 mt-32"
            @click="uploadPositions"
          >
            {{ $t('weboffice.UploadPositions') }}
          </ButtonSmall>
        </div>
        <div class="flex items-center text-lg leading-24 font-bold mb-16 mt-40">
          {{ $t('weboffice.ArrangementYourPositions') }}
        </div>
        <Scrollbar
          :centered="true"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <img :src="getLoyaltyCyclePositionImage" style="min-width: 800px" />
        </Scrollbar>
        <div id="billingData" class="mt-24">
          <div v-show="showBillingData && productTotalPrice > 0">
            <div
              class="flex items-center text-lg leading-24 font-bold mb-16 mt-40"
            >
              {{ $t('weboffice.Pay') }}
            </div>
            <div class="text-danger leadong-16 my-12">
              {{ $t('weboffice.UploadVipCyclePositionDesc') }}
              {{ getSelectedPositions }}
            </div>

            <div class="flex flex-col lg:flex-row">
              <div class="w-full mb-16 lg:w-1/3 pr-8">
                <div
                  :class="
                    selectedProductType === 'small'
                      ? 'border-primary'
                      : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      selectedProductType === 'small'
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="flex p-16 font-bold leading-16 h-64 items-center"
                  >
                    {{ $t('weboffice.PositionActivationSmallCycle') }}
                  </div>
                  <div>
                    <div
                      class="flex flex-col justify-between items-center p-16 text-sm leading-14"
                    >
                      <div class="flex flex-col w-full h-64">
                        <div class="text-primary font-bold">
                          1x {{ $t('weboffice.SmallCyclePosition') }}
                        </div>
                        <div class="mt-4">
                          1x {{ $t('weboffice.ProductVoucher') }}
                        </div>
                        <div class="mt-4">
                          10x {{ $t('weboffice.BestPriceOption') }}
                        </div>
                        <div class="mt-4">
                          10x {{ $t('weboffice.PortalUsageRight') }}
                        </div>
                      </div>
                      <div class="flex flex-row mt-24 w-full">
                        <div class="flex items-center flex-grow text-left">
                          {{ countSelectedPosition }}x {{ $t('general.Piece') }}
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
                        productSmallTotalPrice
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div
                      v-show="countSelectedBigPosition > 0"
                      class="w-1/2 text-right"
                    >
                      <ButtonSmall
                        :type="
                          selectedProductType === 'small'
                            ? 'primary'
                            : 'inverted'
                        "
                        class="w-92"
                        @click="selectedProductType = 'small'"
                      >
                        {{ $t('weboffice.Select') }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-show="countSelectedBigPosition > 0"
                class="w-full mb-16 lg:w-1/3 pl-8"
              >
                <div
                  :class="
                    selectedProductType === 'big'
                      ? 'border-primary'
                      : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      selectedProductType === 'big'
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="flex p-16 font-bold leading-16 h-64 items-center"
                  >
                    {{ $t('weboffice.PositionActivationBigCycle') }}
                  </div>
                  <div>
                    <div
                      class="flex flex-col justify-between items-center p-16 text-sm leading-14"
                    >
                      <div class="flex flex-col w-full h-64">
                        <div class="text-primary font-bold">
                          1x {{ $t('weboffice.BigCyclePosition') }}
                        </div>
                        <div class="mt-4">
                          3x {{ $t('weboffice.ProductVoucher') }}
                        </div>
                        <div class="mt-4">
                          43x {{ $t('weboffice.BestPriceOption') }}
                        </div>
                      </div>
                      <div class="flex flex-row mt-24 w-full">
                        <div class="flex items-center flex-grow text-left">
                          {{ countSelectedBigPosition }}x
                          {{ $t('general.Piece') }}
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
                        productBigTotalPrice
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div class="w-1/2 text-right">
                      <ButtonSmall
                        :type="
                          selectedProductType === 'big' ? 'primary' : 'inverted'
                        "
                        class="w-92"
                        @click="selectedProductType = 'big'"
                      >
                        {{ $t('weboffice.Select') }}
                      </ButtonSmall>
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
                        :error="billingData.error.country"
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
      </div>
    </div>
    <DecisionModal
      v-show="attachPositionModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.ExchangeVoucherConfirm')"
      :cancel-button="$t('general.Cancel')"
      @close="attachPositionModalActive = false"
      @cancel="attachPositionModalActive = false"
      @accept="attachPosition"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.AttachPositionTitle') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="font-bold">
            {{ $t('weboffice.UserAttachPosition') }}:
            {{ selectedPosition.name }}
          </div>
          <div class="mt-8 text-danger">
            {{ $t('weboffice.AttachPositionDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
    <DecisionModal
      v-show="step3WaitingPositionModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.Select')"
      :cancel-button="$t('general.Cancel')"
      @close="step3WaitingPositionModalActive = false"
      @cancel="step3WaitingPositionModalActive = false"
      @accept="selectStep3WaitingPositions"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.OwnPositionsAvailableForPlacement') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="font-bold">
            {{ $t('weboffice.Username') }}:
            {{
              step3WaitingPositionSelected !== false
                ? loyaltyCyclePosition.step3WaitingPositions[
                    step3WaitingPositionSelected
                  ].username
                : ''
            }}
          </div>
          <div class="mt-8">
            <InputDropdown
              v-if="step3WaitingPositionSelected !== false"
              v-model="
                loyaltyCyclePosition.step3WaitingPositions[
                  step3WaitingPositionSelected
                ].selectedPosition
              "
              :values="
                step3WaitingPositionSelected !== false
                  ? loyaltyCyclePosition.step3WaitingPositions[
                      step3WaitingPositionSelected
                    ].positionSelectArray
                  : []
              "
              :placeholder="$t('weboffice.PleaseSelect')"
              :is-dark="false"
              :error="
                step3WaitingPositionSelected !== false
                  ? positionErrorStep3Username ===
                    loyaltyCyclePosition.step3WaitingPositions[
                      step3WaitingPositionSelected
                    ].username
                    ? $t('weboffice.PositionRequired')
                    : ''
                  : ''
              "
              :class="'w-full z-90'"
            />
          </div>
        </div>
      </div>
    </DecisionModal>
    <DecisionModal
      v-show="setPositionModalActive"
      with-class="w-320"
      :accept-button="$t('weboffice.Save')"
      :cancel-button="$t('general.Cancel')"
      :is-loading="setPositionIsLoading"
      :accept-button-disabled="
        selectedToPosition.type === 'locateSignsSetPosition' ||
          selectedToPosition.type === 'waitingPositionSetPosition'
      "
      @close="setPositionModalActive = false"
      @cancel="setPositionModalActive = false"
      @accept="selectPosition"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{
              selectedToPosition.type === 'locateSigns' ||
              selectedToPosition.type === 'locateSignsSetPosition'
                ? $t('weboffice.PlaceStarredMarkings')
                : selectedToPosition.type === 'waitingPosition' ||
                  selectedToPosition.type === 'waitingPositionSetPosition'
                ? $t('weboffice.PlacementWaitingPositions')
                : ''
            }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div
            v-show="
              selectedToPosition && selectedToPosition.type === 'locateSigns'
            "
            class="flex flex-col text-sm leading-14"
          >
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.Username') }}</span
              >:
              {{
                selectedToPosition && selectedToPosition.details
                  ? selectedToPosition.details.AboutToReceive
                  : ''
              }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.TimeLeft') }}</span
              >:
              {{
                selectedToPosition && selectedToPosition.details
                  ? calcRemainingHourMinuteSecond(
                      selectedToPosition.details.expireDate
                    )
                  : ''
              }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{
                $t('weboffice.WhichUserPosition')
              }}</span>
              <WebofficeSearchUserLoyaltyBonusNamesearch
                v-model="searchUserLoyaltyBonusNameSearch"
                :label="''"
                :component-attr-id="'WebofficeSearchUserLoyaltyBonusNamesearch'"
                :error="searchUserLoyaltyBonusNameSearchError"
                class="w-full mb-3"
              />
            </div>
          </div>
          <div
            v-show="
              (selectedToPosition &&
                selectedToPosition.type === 'locateSignsSetPosition') ||
                selectedToPosition.type === 'waitingPositionSetPosition'
            "
            class="flex flex-col text-sm leading-14"
          >
            <div
              v-if="
                selectedToPosition &&
                  selectedToPosition.userPositions &&
                  selectedToPosition.userPositions.positions &&
                  selectedToPosition.userPositions.positions.length
              "
            >
              <div
                v-for="(position,
                positionKey) in selectedToPosition.userPositions.positions.sort(
                  (a, b) => (a.name > b.name ? 1 : -1)
                )"
                :key="positionKey"
                class="flex flex-col"
              >
                <div class="flex flex-row py-8 my-2 border-b border-grey-light">
                  <div class="flex flex-col w-1/2 text-left">
                    <div class="w-full">
                      {{ selectedToPosition.searchName }} #{{ position.name }}
                    </div>
                  </div>
                  <div class="flex w-1/2 justify-end">
                    <div
                      class="link cursor-pointer"
                      @click="signPlacement(position.params)"
                    >
                      {{ $t('weboffice.SelectPosition') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                selectedToPosition &&
                  selectedToPosition.userPositions &&
                  selectedToPosition.userPositions.bonusPositions &&
                  selectedToPosition.userPositions.bonusPositions.length
              "
            >
              <div
                v-for="(position,
                positionKey) in selectedToPosition.userPositions.bonusPositions.sort(
                  (a, b) => (a.name > b.name ? 1 : -1)
                )"
                :key="'bonus-' + positionKey"
                class="flex flex-col"
              >
                <div class="flex flex-row py-8 my-2 border-b border-grey-light">
                  <div class="flex flex-col w-1/2 text-left">
                    <div class="w-full">
                      {{ selectedToPosition.searchName }} #{{ position.name }}
                    </div>
                  </div>
                  <div class="flex w-1/2 justify-end">
                    <div
                      class="link cursor-pointer"
                      @click="signPlacement(position.params)"
                    >
                      {{ $t('weboffice.SelectPosition') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="
              selectedToPosition &&
                selectedToPosition.type === 'waitingPosition'
            "
            class="flex flex-col text-sm leading-14"
          >
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.Username') }}</span
              >:
              {{ selectedToPosition.username }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{ $t('weboffice.TimeLeft') }}</span
              >:
              {{ calcRemainingHourMinuteSecond(selectedToPosition.waitingFor) }}
            </div>
            <div class="mt-4">
              <span class="font-bold">{{
                $t('weboffice.WhichUserPosition')
              }}</span>
              <InputDropdown
                v-show="selectedToPosition.reason === 2"
                v-model="waitingPositionSelect"
                :values="globalPositionSelect.selectList"
                :placeholder="$t('weboffice.PleaseSelect')"
                :is-dark="false"
                :error="waitingPositionSelectError"
                :class="'w-full z-90'"
              />
              <WebofficeSearchUserLoyaltyBonusNamesearch
                v-show="selectedToPosition.reason !== 2"
                v-model="searchUserLoyaltyBonusNameSearch"
                :label="''"
                :component-attr-id="
                  'WebofficeSearchUserLoyaltyBonusNamesearch2'
                "
                :error="searchUserLoyaltyBonusNameSearchError"
                class="w-full mb-3"
              />
            </div>
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
            {{ $t('weboffice.NeedDistributionRoleLoyaltyCycleDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
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
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import StatusMessage from '@/components/micro/StatusMessage'
import Scrollbar from '@/components/Scrollbar'
import Pagination from '@/components/Pagination'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import {
  orderBy,
  calcRemainingHourMinuteSecond,
  getHandlingFee
} from '@/includes/utils'
import DecisionModal from '@/components/modal/DecisionModal'
import InformativeModal from '@/components/modal/InformativeModal'
import InputCheckbox from '@/components/micro/InputCheckbox'
import ButtonGroup from '~/components/micro/ButtonGroup'
import ButtonSmall from '~/components/micro/ButtonSmall'
import WebofficeSearchUserLoyaltyBonusNamesearch from '~/components/weboffice/WebofficeSearchUserLoyaltyBonusNamesearch'
import loyaltyCyclePositionImage7 from '@/assets/images/original-loyalty_cycle_distribution_7_position.jpg'
import loyaltyCyclePositionImage15 from '@/assets/images/original-loyalty_cycle_distribution_15_position.jpg'
import loyaltyCyclePositionImage31 from '@/assets/images/original-loyalty_cycle_distribution_31_position.jpg'
import loyaltyCyclePositionImage63 from '@/assets/images/original-loyalty_cycle_distribution_63_position.jpg'
import InputText from '~/components/micro/InputText'
import CartCard from '@/components/cart/CartCard'
import InputTextMask from '@/components/micro/InputTextMask'
import NMIModal from '@/components/modal/NMIModal'

export default {
  name: 'LoyaltyCyclePositionPage',
  middleware: 'auth_needed',
  components: {
    ButtonSmall,
    ButtonGroup,
    InputCheckbox,
    DecisionModal,
    InputDropdownCountry,
    Pagination,
    Scrollbar,
    StatusMessage,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    WebofficeSearchUserLoyaltyBonusNamesearch,
    InputTextMask,
    InputText,
    CartCard,
    InformativeModal,
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
      loyaltyCyclePosition: false,
      limit: 10,
      currentPage: 1,
      positionErrorUsername: false,
      selectedUsername: false,
      attachPositionModalActive: false,
      selectedPosition: false,
      waitingPositionErrorUsername: false,
      selectedActivePosition: 'own_positions',
      autoStatusArray: [],
      step3WaitingPositionModalActive: false,
      step3WaitingPositionSelected: false,
      positionErrorStep3Username: false,
      setPositionModalActive: false,
      setPositionIsLoading: false,
      loyaltyCyclePositionImage7,
      loyaltyCyclePositionImage15,
      loyaltyCyclePositionImage31,
      loyaltyCyclePositionImage63,
      waitingPositionsList: [],
      selectedToPosition: false,
      needDistributionRoleModal: false,
      searchUserLoyaltyBonusNameSearch: {
        id: false,
        text: ''
      },
      searchUserLoyaltyBonusNameSearchError: '',
      globalPositionSelect: {
        selectList: [],
        objects: []
      },
      waitingPositionSelect: '',
      waitingPositionSelectError: '',
      allPosition: false,
      ownPositions: [],
      uploadOwnPositions: [],
      loyaltyProduct: {
        small: {
          price: 500
        },
        big: {
          price: 1890
        }
      },
      billingDataErrorModalActive: false,
      payInProgress: false,
      showBillingData: false,
      travelCard: '0',
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
      countrySelect: [],
      countrySelectCodes: [],
      countrySelectIds: [],
      selectedProductType: 'small',
      nmiPopupActive: false,
      nmiPopup: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isLoyaltyAllowed']),
    getLocateSign() {
      return this.loyaltyCyclePosition.locateSigns
        ? Object.values(this.loyaltyCyclePosition.locateSigns)
        : []
    },
    checkSelectedOwnPosition() {
      for (let i = 0; i < this.ownPositions.length; i++) {
        if (this.ownPositions[i].selected) {
          return true
        }
      }
      return false
    },
    getLoyaltyCyclePositionImage() {
      if (this.globalPositionSelect.selectList.length <= 7) {
        return this.loyaltyCyclePositionImage7
      } else if (this.globalPositionSelect.selectList.length <= 15) {
        return this.loyaltyCyclePositionImage15
      } else if (this.globalPositionSelect.selectList.length <= 31) {
        return this.loyaltyCyclePositionImage31
      } else {
        return this.loyaltyCyclePositionImage63
      }
    },
    productTotalPrice() {
      return this.selectedProductType === 'small'
        ? this.productSmallTotalPrice
        : this.productBigTotalPrice
    },
    productBigTotalPrice() {
      return this.countSelectedBigPosition * this.loyaltyProduct.big.price
    },
    productSmallTotalPrice() {
      return this.countSelectedPosition * this.loyaltyProduct.small.price
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
    countSelectedBigPosition() {
      let total = 0
      this.ownPositions.forEach((ownPosition) => {
        if (ownPosition.selected && ownPosition.canBeActivatedInBig) {
          total += 1
        }
      })
      return total
    },
    getSelectedPositions() {
      const names = []
      this.ownPositions.forEach((ownPosition, key) => {
        if (ownPosition.selected) {
          names.push(this.getFees.username + ' #' + (key + 1))
        }
      })
      return names.join(', ')
    },
    getAddedTravelCard() {
      const tc = parseInt((this.travelCard + '').replace('EUR', '').trim())
      if (isNaN(tc)) {
        return 0
      } else if (tc > this.productTotalPrice) {
        return this.productTotalPrice
      } else if (this.getFees !== false && tc > this.getFees.tc.credit) {
        return this.getFees.tc.credit
      } else {
        return tc
      }
    }
  },
  mounted() {
    if (!this.isLoyaltyAllowed) {
      this.$router.push(this.localePath('/weboffice'))
    }
    this.getDetails()
    this.setUserBillingData()
  },
  methods: {
    getHandlingFee,
    calcRemainingHourMinuteSecond,
    async getDetails() {
      this.$scrollTo('#__nuxt')
      this.loyaltyCyclePosition = false
      this.loyaltyCyclePosition = await this.$store.dispatch(
        'user/getLoyaltyCyclePosition'
      )
      this.loyaltyCyclePosition.indexLimit = this.loyaltyCyclePosition.positionIds.indexLimit
      delete this.loyaltyCyclePosition.positionIds.indexLimit
      delete this.loyaltyCyclePosition.positionIds.bonusCount
      delete this.loyaltyCyclePosition.positionIds.isCPBMigratedUser
      delete this.loyaltyCyclePosition.positionIds.maxposcount
      Object.values(this.loyaltyCyclePosition.childrens).forEach((user) => {
        user.selectedPosition = ''
        user.positionSelect = orderBy(user.positionSelect, 'order')
        user.positionSelectArray = []
        user.positionSelect.forEach((position) => {
          user.positionSelectArray.push(position.name)
        })
      })
      Object.values(this.loyaltyCyclePosition.step3WaitingPositions).forEach(
        (user) => {
          user.selectedPosition = ''
          user.positionSelect = orderBy(user.positions, 'order')
          user.positionSelectArray = []
          user.positionSelect.forEach((position) => {
            user.positionSelectArray.push(
              position.name === 'auto'
                ? this.$t('weboffice.AutoPlacement')
                : position.name
            )
          })
        }
      )
      this.loyaltyCyclePosition.positionIds = orderBy(
        Object.values(this.loyaltyCyclePosition.positionIds),
        'i'
      )
      if (this.loyaltyCyclePosition.positionIds !== undefined) {
        this.loyaltyCyclePosition.positionIds.forEach((ownPosition, key) => {
          this.ownPositions.push({
            ...{
              selected: false
            },
            ...ownPosition
          })
        })
        if (
          this.loyaltyCyclePosition.indexLimit &&
          this.loyaltyCyclePosition.indexLimit >
            Object.values(this.loyaltyCyclePosition.positionIds).length
        ) {
          for (
            let i = 0;
            i <
            this.loyaltyCyclePosition.indexLimit -
              Object.values(this.loyaltyCyclePosition.positionIds).length;
            i++
          ) {
            this.ownPositions.push({
              i:
                Object.values(this.loyaltyCyclePosition.positionIds).length + i,
              selected: false
            })
          }
        }
      }
      this.autoStatusArray = []
      this.loyaltyCyclePosition.positionIds.forEach((position) => {
        this.autoStatusArray.push({
          isSmall: position.AutoStatus.smallUrl.autobuy === 'false',
          isBig: position.AutoStatus.bigUrl.autobuy === 'false'
        })
      })
      this.waitingPositionsList = []
      if (
        this.loyaltyCyclePosition.waitingPositionsStep1 &&
        this.loyaltyCyclePosition.waitingPositionsStep1.waitingPositionsList &&
        Object.keys(
          this.loyaltyCyclePosition.waitingPositionsStep1.waitingPositionsList
        ).length > 0
      ) {
        for (const [key, value] of Object.entries(
          this.loyaltyCyclePosition.waitingPositionsStep1.waitingPositionsList
        )) {
          let keyTMP2 = key.replace(' userId = ', '|')
          keyTMP2 = keyTMP2.replace(' index:', '|')
          const keyTMP = keyTMP2.split('|')
          value.selectedPosition = ''
          value.username =
            keyTMP[0] + (keyTMP[2] !== undefined ? ' #' + keyTMP[2] : '')
          value.userId = keyTMP[1]
          this.waitingPositionsList.push(value)
        }
      }
      this.globalPositionSelect = {
        selectList: [],
        objects: []
      }
      if (
        this.loyaltyCyclePosition.positionIds &&
        Object.values(this.loyaltyCyclePosition.positionIds)
      ) {
        Object.values(this.loyaltyCyclePosition.positionIds).forEach(
          (position) => {
            if (position.status) {
              this.globalPositionSelect.selectList.push('#' + (position.i + 1))
              this.globalPositionSelect.objects.push(position)
            }
          }
        )
      }
      if (
        this.loyaltyCyclePosition.bonusPositionIds &&
        Object.values(this.loyaltyCyclePosition.bonusPositionIds)
      ) {
        Object.values(this.loyaltyCyclePosition.bonusPositionIds).forEach(
          (position, key) => {
            this.globalPositionSelect.selectList.push('#B-' + (key + 1))
            this.globalPositionSelect.objects.push({ id: position })
          }
        )
      }
      if (
        this.loyaltyCyclePosition.extraPos &&
        Object.values(this.loyaltyCyclePosition.extraPos)
      ) {
        for (const [key, position] of Object.entries(
          this.loyaltyCyclePosition.extraPos
        )) {
          this.globalPositionSelect.selectList.push('#E-' + (position.i + 1))
          this.globalPositionSelect.objects.push({ id: key })
        }
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#FrontsNotAttached')
    },
    getPositionError(username) {
      if (this.loyaltyCyclePosition.childrens[username] !== undefined) {
        return this.loyaltyCyclePosition.childrens[username].positionError
      }
    },
    saveUserPosition(username) {
      this.selectedUsername = false
      this.selectedPosition = false
      if (this.loyaltyCyclePosition.childrens[username] !== undefined) {
        this.positionErrorUsername = ''
        if (
          this.loyaltyCyclePosition.childrens[username].selectedPosition === ''
        ) {
          this.positionErrorUsername = username
        } else {
          this.selectedPosition = this.loyaltyCyclePosition.childrens[
            username
          ].positionSelect[
            this.loyaltyCyclePosition.childrens[username].selectedPosition
          ]
          this.selectedUsername = username
          this.attachPositionModalActive = true
        }
      }
    },
    async changeAutoStatus(key, type) {
      if (type === 'small' && this.autoStatusArray[key].isBig) {
        this.autoStatusArray[key].isBig = false
      } else if (type === 'big' && this.autoStatusArray[key].isSmall) {
        this.autoStatusArray[key].isSmall = false
      }
      let res
      try {
        res = await this.$store.dispatch('user/changeLoyaltyAutoReBuy', {
          positionId: this.loyaltyCyclePosition.positionIds[key].id,
          isBig: this.autoStatusArray[key].isBig,
          autobuy:
            (type === 'small' && this.autoStatusArray[key].isSmall) ||
            (type === 'big' && this.autoStatusArray[key].isBig)
        })
      } catch (e) {
        console.log(e)
      }
      console.log(res)
    },
    async attachPosition() {
      if (this.selectedPosition !== false) {
        let res
        try {
          res = await this.$store.dispatch(
            'user/postLoyaltyPlacementUser',
            this.selectedPosition.url
          )
        } catch (e) {
          this.$store.dispatch('general/showSnackbar', e)
        }
        if (res) {
          this.$scrollTo('#__nuxt')
          this.selectedUsername = false
          this.selectedPosition = false
          this.attachPositionModalActive = false
          this.currentPage = 1
          await this.getDetails()
        }
      }
    },
    selectActivePosition(position) {
      this.selectedActivePosition = position
    },
    setStep3WaitingPosition(position) {
      this.step3WaitingPositionSelected = position
      this.step3WaitingPositionModalActive = true
    },
    selectStep3WaitingPositions() {
      if (
        this.loyaltyCyclePosition.step3WaitingPositions[
          this.step3WaitingPositionSelected
        ].selectedPosition !== ''
      ) {
        this.step3WaitingPositionSelected = false
        this.step3WaitingPositionModalActive = false
      } else {
        this.positionErrorStep3Username = this.loyaltyCyclePosition.step3WaitingPositions[
          this.step3WaitingPositionSelected
        ].username
      }
    },
    async saveStep3WaitingPosition(position) {
      const selectedItem = this.loyaltyCyclePosition.step3WaitingPositions[
        position
      ]
      if (selectedItem !== undefined && selectedItem.selectedPosition !== '') {
        const res = await this.$store.dispatch(
          'user/postLoyaltyWaitingPlacement',
          selectedItem.positionSelect[selectedItem.selectedPosition].params
        )
        if (res) {
          this.$scrollTo('#__nuxt')
          await this.getDetails()
        }
      }
    },
    setPosition(item, type) {
      this.selectedToPosition = item
      this.selectedToPosition.type = type
      this.setPositionModalActive = true
    },
    async selectPosition() {
      if (this.selectedToPosition.type === 'locateSigns') {
        this.searchUserLoyaltyBonusNameSearchError = ''
        if (this.searchUserLoyaltyBonusNameSearch.id === false) {
          this.searchUserLoyaltyBonusNameSearchError = this.$t(
            'weboffice.UserNameRequired'
          )
        } else {
          this.setPositionIsLoading = true
          let res
          try {
            res = await this.$store.dispatch(
              'user/getLoyaltyCycleUserPosition',
              {
                sourceId: this.searchUserLoyaltyBonusNameSearch.id,
                type: 'locateSigns'
              }
            )
          } catch (error) {
            console.log(error)
          }
          this.setPositionIsLoading = false
          this.selectedToPosition.searchName = this.searchUserLoyaltyBonusNameSearch.text
          this.selectedToPosition.userPositions = res
          this.selectedToPosition.type = 'locateSignsSetPosition'
        }
      } else if (this.selectedToPosition.type === 'waitingPosition') {
        if (this.selectedToPosition.reason === 2) {
          this.waitingPositionSelectError = ''
          if (this.waitingPositionSelect === '') {
            this.waitingPositionSelectError = this.$t(
              'weboffice.PositionRequired'
            )
          } else {
            this.setPositionIsLoading = true
            let res
            try {
              res = await this.$store.dispatch(
                'user/postLoyaltyPlacementUser',
                {
                  positionId:
                    this.globalPositionSelect.objects[
                      this.waitingPositionSelect
                    ].id + '',
                  folloverUserName: this.selectedToPosition.positionId + '',
                  isPosition: true
                }
              )
            } catch (error) {
              console.log(error)
            }
            this.setPositionIsLoading = false
            if (res && res.STATUS === 'OK') {
              this.selectedToPosition = false
              this.setPositionModalActive = false
              this.getDetails()
            }
          }
        } else {
          this.searchUserLoyaltyBonusNameSearchError = ''
          if (this.searchUserLoyaltyBonusNameSearch.id === false) {
            this.searchUserLoyaltyBonusNameSearchError = this.$t(
              'weboffice.UserNameRequired'
            )
          } else {
            this.setPositionIsLoading = true
            let res
            try {
              res = await this.$store.dispatch(
                'user/getLoyaltyCycleUserPosition',
                {
                  sourceId: this.searchUserLoyaltyBonusNameSearch.id,
                  type: 'waitingPosition',
                  positionId: this.selectedToPosition.positionId
                }
              )
            } catch (error) {
              console.log(error)
            }
            this.setPositionIsLoading = false
            this.selectedToPosition.searchName = this.searchUserLoyaltyBonusNameSearch.text
            this.selectedToPosition.userPositions = res
            this.selectedToPosition.userPositions.AboutToReceive = this.selectedToPosition.username
            this.selectedToPosition.type = 'waitingPositionSetPosition'
          }
        }
      }
    },
    async signPlacement(params) {
      let res
      try {
        res = await this.$store.dispatch(
          this.selectedToPosition.type === 'waitingPositionSetPosition'
            ? 'user/postLoyaltyWaitingPlacement'
            : 'user/loyaltyCycleSignPlacement',
          params
        )
      } catch (error) {
        console.log(error)
      }
      if (res && res.status && res.status.toLowerCase() === 'ok') {
        this.selectedToPosition = false
        this.setPositionModalActive = false
        this.getDetails()
      }
    },
    selectAllPosition() {
      this.ownPositions.forEach((ownPosition) => {
        if (
          !(
            ownPosition.cycleViewLink &&
            ownPosition.cycleViewLink.positionId &&
            ownPosition.cycleViewLink.index &&
            ownPosition.status
          ) ||
          ownPosition.status !== 'active'
        ) {
          ownPosition.selected = this.allPosition
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
      this.ownPositions.forEach((ownPosition, indexTmp) => {
        if (
          !(
            ownPosition.cycleViewLink &&
            ownPosition.cycleViewLink.positionId &&
            ownPosition.cycleViewLink.index &&
            ownPosition.status
          ) ||
          ownPosition.status !== 'active'
        ) {
          if (indexTmp < bigIndex) {
            ownPosition.selected = true
          } else if (indexTmp > bigIndex) {
            ownPosition.selected = false
          }
        }
      })
    },
    deselectAll() {
      this.needDistributionRoleModal = false
      this.ownPositions.forEach((ownPosition) => {
        ownPosition.selected = false
      })
      this.allPosition = false
    },
    uploadPosition(index) {
      this.ownPositions.forEach((ownPosition, indexTmp) => {
        console.log(ownPosition)
        if (
          !(
            ownPosition.cycleViewLink &&
            ownPosition.cycleViewLink.positionId &&
            ownPosition.cycleViewLink.index &&
            ownPosition.status
          ) ||
          ownPosition.status !== 'active'
        ) {
          if (indexTmp <= index) {
            ownPosition.selected = true
          } else {
            ownPosition.selected = false
          }
        }
      })

      this.ownPositions[index].selected = true
      this.uploadPositions()
    },
    uploadPositions(acceptNeedDistributionRole = false) {
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
    async pay() {
      if (this.productTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billingData')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payLoyaltyCyclePosition', {
              quantity:
                this.selectedProductType === 'big'
                  ? this.countSelectedBigPosition
                  : this.countSelectedPosition,
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace('EUR', '').trim(),
              save_billing: this.billingData.saveBillingData,
              productType: this.selectedProductType,
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
            this.travelCard = this.productTotalPrice.toString()
          } else if (
            this.getFees !== false &&
            tc > Math.floor(this.getFees.tc.credit)
          ) {
            this.travelCard = Math.floor(this.getFees.tc.credit).toString()
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
