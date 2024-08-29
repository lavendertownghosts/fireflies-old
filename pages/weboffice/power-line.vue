<template>
  <main>
    <LoadingLayerWeboffice v-if="powerData == false" />
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
            name: $t('weboffice.Powerline')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.Powerline') }}
      </div>

      <!-- PASSIVE POWERLINE BONUS -->
      <div class="flex flex-col w-full mb-32">
        <div class="w-full">
          <div class="grid md:grid-cols-2 gap-16 mb-32">
            <div class="w-full">
              <div class="border border-grey-light rounded">
                <div
                  class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
                >
                  <div
                    class="flex flex-col w-full font-bold text-sm leading-14 "
                  >
                    {{ $t('weboffice.PassivePowerlineBonusLeft') }}
                  </div>
                </div>
                <div
                  v-if="passivePowerBonus.pplb_startdate_plus182 !== undefined"
                  class="py-20 px-16 text-lg"
                >
                  <CountDown
                    v-if="passivePowerBonus !== false"
                    :end-date="
                      passivePowerBonus.pplb_counter !== undefined
                        ? passivePowerBonus.pplb_counter !== ''
                          ? passivePowerBonus.pplb_counter
                          : passivePowerBonus.pplb_startdate_plus182
                        : passivePowerBonus.pplb_startdate_plus182
                    "
                  />
                </div>
                <div v-else class="py-20 px-16 text-lg">
                  -
                </div>
              </div>
            </div>

            <div class="w-full">
              <div class="border border-grey-light rounded">
                <div
                  class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
                >
                  <div
                    class="flex flex-col w-full font-bold text-sm leading-14 "
                  >
                    {{ $t('weboffice.PassivePowerlineBonusQualificated') }}
                  </div>
                </div>
                <div
                  v-if="passivePowerBonus !== false"
                  class="py-20 px-16 text-lg"
                >
                  {{
                    passivePowerBonus.pplb_counter_start !== undefined
                      ? passivePowerBonus.pplb_counter_start
                      : '-'
                  }}
                </div>
              </div>
            </div>

            <div class="w-full">
              <div class="border border-grey-light rounded">
                <div
                  class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
                >
                  <div class="flex w-full font-bold text-sm leading-14 ">
                    {{ $t('weboffice.PowerlineStartDate') }}
                  </div>
                </div>
                <div
                  v-if="passivePowerBonus !== false"
                  class="py-20 px-16 text-lg"
                >
                  {{
                    passivePowerBonus.powerline_startdate !== undefined
                      ? passivePowerBonus.powerline_startdate
                      : '-'
                  }}
                </div>
              </div>
            </div>

            <div class="w-full">
              <div class="border border-grey-light rounded">
                <div
                  class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
                >
                  <div class="flex w-full font-bold text-sm leading-14 ">
                    {{ $t('weboffice.PassivePowerlineBonusDirectBuys') }}
                  </div>
                </div>
                <div
                  v-if="passivePowerBonus !== false"
                  class="py-20 px-16 text-lg"
                >
                  {{
                    passivePowerBonus.pplb_leg_counter !== undefined
                      ? passivePowerBonus.pplb_leg_counter
                      : 0
                  }}
                  / 2
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!powerData.meta.is_gold"
            class="border border-grey-light rounded"
          >
            <div
              class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
            >
              <div
                class="flex items-center w-full font-bold text-sm leading-14 "
              >
                {{ $t('powerline.CarrierTitleIf') }}
              </div>
            </div>
            <div class="bg-pink p-16 text-sm">
              {{ $t('powerline.CarrierIfDescription') }}
            </div>
            <div class="py-20 px-16">
              <div class="grid-cols-5 grid power-grid pt-21">
                <div class="flex relative justify-center">
                  <div class="text-black power-label">TM</div>
                  <div
                    class="power-circle"
                    :class="
                      powerData.meta.power_level > 0
                        ? 'active bg-primary border-primary'
                        : 'bg-white border-grey-dark'
                    "
                  >
                    <i
                      v-show="powerData.meta.power_level > 0"
                      class="fa fa-check text-white text-xs mt-5"
                    ></i>
                  </div>
                </div>
                <div class="flex relative justify-center">
                  <div class="text-black power-label">TMC</div>
                  <div
                    class="power-circle"
                    :class="
                      powerData.meta.power_level > 1
                        ? 'active bg-primary border-primary'
                        : 'bg-white border-grey-dark'
                    "
                  >
                    <i
                      v-show="powerData.meta.power_level > 1"
                      class="fa fa-check text-white text-xs mt-5"
                    ></i>
                  </div>
                </div>
                <div class="flex relative justify-center">
                  <div class="text-black power-label">EC</div>
                  <div
                    class="power-circle"
                    :class="
                      powerData.meta.power_level > 2
                        ? 'active bg-primary border-primary'
                        : 'bg-white border-grey-dark'
                    "
                  >
                    <i
                      v-show="powerData.meta.power_level > 2"
                      class="fa fa-check text-white text-xs mt-5"
                    ></i>
                  </div>
                </div>
                <div class="flex relative justify-center">
                  <div class="text-black power-label">DEC</div>
                  <div
                    class="power-circle"
                    :class="
                      powerData.meta.power_level > 3
                        ? 'active bg-primary border-primary'
                        : 'bg-white border-grey-dark'
                    "
                  >
                    <i
                      v-show="powerData.meta.power_level > 3"
                      class="fa fa-check text-white text-xs mt-5"
                    ></i>
                  </div>
                </div>
                <div class="flex relative justify-center">
                  <div class="text-black power-label">
                    {{ $t('powerline.Gold') }}
                  </div>
                  <div
                    class="power-circle"
                    :class="
                      powerData.meta.power_level > 4
                        ? 'active bg-primary border-primary'
                        : 'bg-white border-grey-dark'
                    "
                  >
                    <i
                      v-show="powerData.meta.power_level > 4"
                      class="fa fa-check text-white text-xs mt-5"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="border rounded"
            :class="
              powerData.meta.powergold_enable ? 'border-gold' : 'border-danger'
            "
          >
            <div
              class="h-48 flex flex-col px-16 justify-center text-white"
              :class="powerData.meta.powergold_enable ? 'bg-gold' : 'bg-danger'"
            >
              <div
                class="flex items-center w-full font-bold text-sm leading-14 "
              >
                {{ $t('powerline.GoldLineTitle') }}
              </div>
            </div>
            <div
              class="py-20 px-16"
              :class="
                powerData.meta.powergold_enable ? 'text-primary' : 'text-danger'
              "
            >
              {{
                powerData.meta.powergold_enable
                  ? powerData.meta.powergold_user
                  : $t('powerline.NoGoldLine')
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-16">
        <div v-if="isTrial" class="w-full">
          <div class="border border-grey-light rounded">
            <div
              class="h-48 flex flex-col bg-danger text-white px-16 justify-center"
            >
              <div class="flex flex-col w-full font-bold text-sm leading-14 ">
                {{ getTrialPhase.label }}
                <span class="text-xs font-normal">{{
                  getTrialPhase.deadline
                }}</span>
              </div>
            </div>
            <div class="py-20 px-16 text-lg">
              <CountDown :end-date="getTrialPhase.deadline" />
            </div>
          </div>
        </div>
        <div v-else class="w-full">
          <div class="border border-grey-light rounded">
            <div
              class="h-48 flex flex-col bg-danger text-white px-16 justify-center"
            >
              <div class="flex flex-col w-full font-bold text-sm leading-14 ">
                {{
                  getOvertime !== false
                    ? $t('powerline.GracePeriod')
                    : $t('powerline.Deadline')
                }}
                <span class="text-xs font-normal">{{
                  getOvertime !== false ? getOvertime : powerData.data.deadline
                }}</span>
              </div>
            </div>

            <div class="py-20 px-16 text-lg">
              <CountDown
                :end-date="
                  getOvertime !== false ? getOvertime : powerData.data.deadline
                "
              />
            </div>
            <div
              class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
            >
              <div class="flex flex-col w-full font-bold text-sm leading-14 ">
                {{ $t('powerline.VIPexpire') }}
                <span class="text-xs font-normal">{{
                  powerData.data.vipExpirationDate
                }}</span>
              </div>
            </div>
            <div
              class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
            >
              <div class="flex flex-col w-full font-bold text-sm leading-14 ">
                {{ $t('powerline.EnterFeeExpire') }}
                <span class="text-xs font-normal">{{
                  powerData.data.loginExpirationDate
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full">
          <div class="border border-grey-light rounded">
            <div
              class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
            >
              <div class="flex w-full font-bold text-sm leading-14 ">
                {{ $t('powerline.ChildTitle') }}
              </div>
            </div>
            <div class="py-20 px-16 text-lg">
              {{ powerData.data.children_count }}
            </div>
          </div>
        </div>
      </div>

      <div class="text-lg mt-42 mb-9">
        {{ $t('general.Details') }}
      </div>

      <div class="w-full">
        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div
              class="flex flex-row justify-between w-full font-bold text-sm leading-14"
            >
              <div class="flex flex-grow">{{ $t('weboffice.Filter') }}</div>
              <div class="flex link cursor-pointer" @click="deleteFilters">
                {{ $t('weboffice.DeleteFilters') }}
              </div>
            </div>
          </div>
          <div
            class="flex justify-between md:flex-row flex-col py-20 px-16 text-lg"
          >
            <div class="flex md:w-1/3">
              <InputDateRange
                v-model="filterDates"
                :is-dark="false"
                :label-checkin="$t('general.DateFrom')"
                :label-checkout="$t('general.DateTo')"
                class="flex flex-row w-full"
                :input-style="['mr-8']"
                :wrapper-style-checkin="['mr-10']"
                :wrapper-style-checkout="['w-full']"
                :input-style-checkin="['w-full']"
                :input-style-checkout="['w-full']"
                :disable-past="false"
                :is-nights="false"
              />
            </div>
            <div class="flex">
              <ButtonSmall
                class="w-full mt-16 mb-4 md:ml-8 md:w-82"
                type="primary"
                @click="getDetails(true)"
              >
                {{ $t('weboffice.Filter') }}
              </ButtonSmall>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full mt-6">
        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div
              class="flex md:flex-row flex-col justify-between w-full font-bold text-sm leading-14"
            >
              <div class="flex flex-grow md:mb-0 mb-5">
                {{ $t('powerline.RegAndBuyTitle') }}
              </div>
              <div class="flex flex-row justify-between">
                <div class="flex pr-5">
                  <span
                    class="rounded-full w-9 h-9 bg-grey-dark mt-2 mr-5"
                  ></span>
                  {{ $t('powerline.Registration') }}
                </div>
                <div class="flex pl-5">
                  <span
                    class="rounded-full w-9 h-9 bg-primary mt-2 mr-5"
                  ></span>
                  {{ $t('powerline.Buying') }}
                </div>
              </div>
            </div>
          </div>
          <div class="md:h-504 h-320 flex-grow overflow-hidden">
            <gmap-map
              ref="powermap"
              class="h-full w-full"
              :center="center"
              :zoom="6"
              :options="mapOptions"
            >
            </gmap-map>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 md:gap-128 gap-16 mt-24">
        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div class="flex w-full font-bold text-sm leading-14 ">
              {{ $t('powerline.AllRegistration') }}
            </div>
          </div>
          <div class="py-20 px-16 text-lg">
            {{ powerData.data.total_reg }}
          </div>
        </div>

        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div class="flex w-full font-bold text-sm leading-14 ">
              {{ $t('powerline.AllBuying') }}
            </div>
          </div>
          <div class="py-20 px-16 text-lg">
            {{ powerData.data.total_buy }}
          </div>
        </div>

        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div class="flex w-full font-bold text-sm leading-14 ">
              {{ $t('powerline.AllCountry') }}
            </div>
          </div>
          <div class="py-20 px-16 text-lg">
            {{ powerData.data.total_country }}
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-16 mt-16">
        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div class="flex w-full font-bold text-sm leading-14 ">
              {{ $t('powerline.TopRegCountries') }}
            </div>
          </div>
          <div class="py-20 px-16 text-lg">
            <VueApexCharts
              v-if="chartSeriesReg.length > 0"
              width="100%"
              type="donut"
              :options="chartRegOptions"
              :series="chartSeriesReg"
            ></VueApexCharts>
            <div v-else class="px-52 py-92 text-3x text-center">
              {{ $t('powerline.NoReg') }}
            </div>
            <div
              v-if="chartSeriesReg.length > 0"
              class="text-center link text-sm"
              @click="topCountriesReg = true"
            >
              {{ $t('powerline.MoreCountries') }}
            </div>
          </div>
        </div>

        <div class="border border-grey-light rounded">
          <div
            class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
          >
            <div class="flex w-full font-bold text-sm leading-14 ">
              {{ $t('powerline.TopBuyCountries') }}
            </div>
          </div>
          <div class="py-20 px-16 text-lg">
            <VueApexCharts
              v-if="chartSeriesBuy.length > 0"
              width="100%"
              type="donut"
              :options="chartBuyOptions"
              :series="chartSeriesBuy"
            ></VueApexCharts>
            <div v-else class="px-52 py-92 text-3x text-center">
              {{ $t('powerline.NoBuy') }}
            </div>
            <div
              v-if="chartSeriesBuy.length > 0"
              class="text-center link text-sm"
              @click="topCountriesBuy = true"
            >
              {{ $t('powerline.MoreCountries') }}
            </div>
          </div>
        </div>
      </div>

      <div class="border border-grey-light rounded w-full mt-16">
        <div
          class="h-48 flex flex-col bg-grey-light bg-opacity-50 px-16 justify-center"
        >
          <div
            class="flex flex-row justify-between w-full font-bold text-sm leading-14"
          >
            <div class="flex flex-grow">{{ $t('weboffice.Powerline') }}</div>
            <div class="flex cursor-pointer">
              <span
                class="text-2x mr-15"
                :class="listZoom ? 'text-primary' : ''"
                @click="setZoom(true)"
                >z<sup>-</sup></span
              >
              <span
                class="text-2x"
                :class="!listZoom ? 'text-primary' : ''"
                @click="setZoom(false)"
                >Z<sup>+</sup></span
              >
            </div>
          </div>
        </div>
        <div class="py-20 px-16">
          <template class="relative">
            <div
              class="pwl-row rounded flex flex-row shadow py-9 mb-8 ml-16 relative items-center text-black"
              :class="[!listZoom ? '' : 'text-xs']"
            >
              <div
                class="rounded-full flex flex-wrap border-2 border-grey-light overflow-hidden justify-center mx-12"
                :class="!listZoom ? 'w-42 h-40' : 'w-24 h-24'"
              >
                <img
                  v-if="powerData.user.country_iso !== undefined"
                  :src="
                    'https://cdn.fireflies.com/flags/' +
                      powerData.user.country_iso +
                      '.png'
                  "
                  style="width: auto; max-width: 300%;"
                  :class="!listZoom ? 'h-40' : 'h-24'"
                  alt=""
                />
              </div>
              <div
                class="md:flex md:justify-between md:w-full items-center flex-row"
              >
                <div
                  class="flex-grow text-left"
                  :class="!listZoom ? 'leading-18' : 'leading-12'"
                >
                  <span class="font-bold">{{ $t('powerline.Me') }} - </span>
                  <span class="italic">{{ powerData.user.country }}</span>
                </div>
                <div class="flex md:px-12">
                  {{ getPowerline.userAtLineFrom }}
                </div>
              </div>
            </div>
          </template>
          <template
            v-for="(row, rowKey) in powerData.powerline"
            class="relative"
          >
            <div
              :key="rowKey"
              class="pwl-row rounded flex flex-row shadow py-9 mb-8 ml-16 relative items-center"
              :class="[
                row.eventType != 'self' ? 'text-white' : '',
                row.eventType == 'BUY' ? 'bg-primary' : '',
                row.eventType == 'SIGNUP' ? 'bg-grey-dark' : '',
                !listZoom ? '' : 'text-xs'
              ]"
            >
              <div
                class="rounded-full flex flex-wrap border-2 border-grey-light overflow-hidden justify-center mx-12"
                :class="!listZoom ? 'w-42 h-40' : 'w-24 h-24'"
              >
                <img
                  :src="
                    'https://cdn.fireflies.com/flags/' +
                      row.usercountry.toLowerCase() +
                      '.png'
                  "
                  style="width: auto; max-width: 300%;"
                  :class="!listZoom ? 'h-40' : 'h-24'"
                  :alt="row.usercountry_name"
                />
              </div>
              <div
                class="md:flex md:justify-between md:w-full items-center flex-row"
              >
                <div
                  class="flex-grow text-left"
                  :class="!listZoom ? 'leading-18' : 'leading-12'"
                >
                  <span class="font-bold">{{ row.username }} - </span
                  ><span class="italic">{{ row.usercountry_name }}</span
                  ><br />
                  {{
                    row.eventType == 'BUY'
                      ? $t('powerline.Buying')
                      : $t('powerline.Registration')
                  }}
                </div>
                <div class="flex md:px-12">
                  {{ row.date }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="w-full px-16 mb-56 flex justify-center">
          <Pagination
            :max-pages="maxPages"
            :current-page="page"
            @click="navPage"
          />
        </div>
      </div>
    </div>
    <DefaultModal
      v-show="topCountriesBuy"
      :modal-max-width="'320px'"
      :default-padding="'p-0'"
      :is-super-popup="true"
    >
      <div slot="header" class="p-16">
        <div class="flex w-full text-black mt-8">
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('powerline.BuyPopTitle') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="topCountriesBuy = false"
            ></i>
          </div>
        </div>
      </div>
      <div v-if="powerData !== false" slot="body" class="p-15">
        <table class="table-auto text-sm leading-14 text-black w-full">
          <tbody>
            <tr
              v-for="(row, rowKey) in powerData.top_countries.buy"
              :key="rowKey"
              :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
            >
              <td class="py-13 pr-8 pl-16 border-r border-t border-grey-light">
                {{ rowKey + 1 }}
              </td>
              <td class="py-13 px-8 border-grey-light border-t ">
                {{ row.country_name }}
              </td>
              <td class="py-13 px-8 border-grey-light border-t ">
                {{ row.buy }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <DefaultModal
      v-show="topCountriesReg"
      :modal-max-width="'320px'"
      :default-padding="'p-0'"
      :is-super-popup="true"
    >
      <div slot="header" class="p-16">
        <div class="flex w-full text-black mt-8">
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('powerline.RegPopTitle') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="topCountriesReg = false"
            ></i>
          </div>
        </div>
      </div>
      <div v-if="powerData !== false" slot="body" class="p-15">
        <table class="table-auto text-sm leading-14 text-black w-full">
          <tbody>
            <tr
              v-for="(row, rowKey) in powerData.top_countries.reg"
              :key="rowKey"
              :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
            >
              <td class="py-13 pr-8 pl-16 border-r border-t border-grey-light">
                {{ rowKey + 1 }}
              </td>
              <td class="py-13 px-8 border-grey-light border-t ">
                {{ row.country_name }}
              </td>
              <td class="py-13 px-8 border-grey-light border-t ">
                {{ row.reg }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import { lightFormat } from 'date-fns'

import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import InputDateRange from '@/components/micro/InputDateRange'
import ButtonSmall from '@/components/micro/ButtonSmall'
import Pagination from '@/components/Pagination'
import CountDown from '@/components/micro/CountDown'
import DefaultModal from '@/components/modal/DefaultModal'
import MapPowerline from '@/includes/MapPowerline'

import { getToday, formatDateApi, addDay, createDate } from '@/includes/utils'

export default {
  name: 'Powerline',
  middleware: 'auth_needed',
  components: {
    LoadingLayerWeboffice,
    WebofficeBreadcrumb,
    InputDateRange,
    ButtonSmall,
    VueApexCharts,
    Pagination,
    CountDown,
    DefaultModal
  },
  mixins: [MapPowerline],
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      marker: '/images/marker-powerline.png',
      powerData: false,
      listZoom: false,
      center: {
        lat: 0,
        lng: 0
      },
      filterDates: {
        date1: formatDateApi('2021', '01', '01'),
        date2: getToday()
      },
      page: 1,
      per_page: 20,
      maxPages: 1,
      topCountriesReg: false,
      topCountriesBuy: false,
      passivePowerBonus: false,
      chartRegOptions: {
        tooltip: {
          enabled: false
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            labels: {
              show: false
            },
            donut: {
              size: '55%',
              labels: {
                show: true,
                name: {
                  show: true
                },
                value: {
                  show: true
                }
              }
            }
          }
        },
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          enabled: false
        },
        labels: []
      },
      chartBuyOptions: {
        tooltip: {
          enabled: false
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            labels: {
              show: false
            },
            donut: {
              size: '55%',
              labels: {
                show: true,
                name: {
                  show: true
                },
                value: {
                  show: true
                }
              }
            }
          }
        },
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          enabled: false
        },
        labels: []
      },
      chartSeriesBuy: [],
      chartSeriesReg: [],
      mapOptions: {
        disableDefaultUI: true,
        mapTypeControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.attraction',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.government',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.medical',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.place_of_worship',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'poi.school',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            featureType: 'poi.sports_complex',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text',
            stylers: [
              {
                visibility: 'on'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('user', ['getPowerline']),
    isTrial() {
      let enabled = false
      if (this.getPowerline.userHasDemoForceLine === true) {
        enabled = true
        if (this.getPowerline.forceLineEndDate !== 'n.a.') {
          enabled = false
        }
      } else {
        enabled = false
      }

      return enabled
    },
    getTrialPhase() {
      if (this.isTrial) {
        const deadline = createDate(
          this.getPowerline.userHasDemoForceLineEndDate
        )
        const today = new Date()

        if (deadline.getTime() > today.getTime()) {
          const phasetime = deadline
          return {
            label: this.$t('powerline.TrialFirstPhase'),
            deadline: lightFormat(phasetime, 'yyyy-MM-dd HH:mm:ss')
          }
        } else {
          return {
            label: this.$t('powerline.TrialLastPhase'),
            deadline: lightFormat(deadline, 'yyyy-MM-dd HH:mm:ss')
          }
        }
      } else {
        return false
      }
    },
    getOvertime() {
      const deadline = createDate(this.powerData.data.deadline)
      const today = new Date()
      if (deadline.getTime() < today.getTime() && !this.isTrial) {
        const overtime = addDay(deadline, 14)
        return formatDateApi(
          overtime.getFullYear(),
          overtime.getMonth() + 1,
          overtime.getDate()
        )
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getPassivePowerBonus()
    this.getDetails()
    this.getUserGeoLoc()
  },

  methods: {
    setZoom(val) {
      if (this.listZoom !== val) {
        this.listZoom = val
        this.page = 1
        if (this.listZoom) {
          this.per_page = 50
        } else {
          this.per_page = 20
        }
        this.getDetails(true)
      }
    },
    deleteFilters() {
      this.page = 1
      if (this.powerData.min_date !== undefined) {
        const newDate1 = new Date(this.powerData.meta.min_date)

        this.filterDates = {
          date1: formatDateApi(
            newDate1.getFullYear(),
            newDate1.getMonth() + 1,
            newDate1.getDate()
          ),
          date2: getToday()
        }
      } else {
        this.filterDates = {
          date1: getToday(),
          date2: getToday()
        }
      }
    },
    navPage(page) {
      this.page = page
      this.getDetails(true)
    },
    async getPassivePowerBonus() {
      this.passivePowerBonus = await this.$store.dispatch(
        'user/getPassivePowerlineBonusData'
      )
    },
    async getDetails(refresh = false) {
      // Elmentjük az előző adatokat ha csak frissítést kértünk a végén vissza töltjük
      let cache
      if (this.powerData !== false) {
        if (refresh) {
          cache = {
            is_gold: this.powerData.meta.is_gold,
            power_level_title: this.powerData.meta.power_level_title,
            power_level: this.powerData.meta.power_level,
            powergold_user: this.powerData.meta.powergold_user,
            powergold_enable: this.powerData.meta.powergold_enable
          }
        }
      } else {
        this.page = 1
        this.filterDates = {
          date1: false,
          date2: getToday()
        }
      }

      this.powerData = false
      try {
        this.powerData = await this.$store.dispatch('user/getPowerLine', {
          date_from: this.filterDates.date1,
          date_to: this.filterDates.date2,
          current_page: this.page,
          per_page: this.per_page,
          lang: this.$i18n.locale,
          refresh: refresh ?? false
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

      if (this.powerData.meta !== undefined) {
        if (refresh) {
          this.powerData.meta.is_gold = cache.is_gold
          this.powerData.meta.power_level_title = cache.power_level_title
          this.powerData.meta.power_level = cache.power_level
          this.powerData.meta.powergold_enable = cache.powergold_enable
          this.powerData.meta.powergold_user = cache.powergold_user
        }

        this.maxPages = this.powerData.meta.max_page
        this.chartRegOptions.labels = this.powerData.top_countries.reg_labels
        this.chartBuyOptions.labels = this.powerData.top_countries.buy_labels
        this.chartSeriesBuy = this.powerData.top_countries.buy_chart
        this.chartSeriesReg = this.powerData.top_countries.reg_chart

        const newDate1 = new Date(this.powerData.meta.date_from)
        const newDate2 = new Date(this.powerData.meta.date_to)

        this.filterDates = {
          date1: formatDateApi(
            newDate1.getFullYear(),
            newDate1.getMonth() + 1,
            newDate1.getDate()
          ),
          date2: formatDateApi(
            newDate2.getFullYear(),
            newDate2.getMonth() + 1,
            newDate2.getDate()
          )
        }

        this.$nextTick(() => {
          if (this.$refs.powermap) {
            this.$refs.powermap.$mapPromise.then((map) => {
              this.definePopupClass()
              Object.entries(this.powerData.countries).forEach((entry) => {
                const [key, value] = entry
                value.id = key
                this.createPopup(value, map)
              })
            })
          } else {
            console.log('POWERMAP NOT FOUND')
          }
        })
      }
    },
    async getUserGeoLoc() {
      const resp = await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=Hungary&key=' +
          process.env.GMAPS_API_KEY
      ).then((res) => res.json())

      if (resp.status === 'OK') {
        this.center.lat = resp.results[0].geometry.location.lat
        this.center.lng = resp.results[0].geometry.location.lng
      } else {
        console.log(resp)
      }
    },
    setLocation(marker) {
      this.center.lat = marker.lat
      this.center.lng = marker.long
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficePowerlineTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficePowerlineTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficePowerlineTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>

<style scoped>
.power-circle {
  @apply rounded-full;
  @apply w-24;
  @apply h-24;
  @apply border-2;
  @apply text-center;
}

.power-circle:before,
.power-circle:after {
  content: '';
  width: 50%;
  position: absolute;
  z-index: -1;
  top: 50%;
  margin-top: -1px;
  background: #6a727f;
  height: 2px;
}

.power-grid > div:first-child .power-circle:before,
.power-grid > div:last-child .power-circle:after {
  display: none;
}

.power-circle:before {
  left: 0;
  right: 50%;
}

.power-circle:after {
  right: 0;
  left: 50%;
}

.power-circle.active:before,
.power-circle.active:after {
  background: #00adb5;
}

.power-circle i {
  display: block !important;
}

.power-label {
  text-align: center;
  position: absolute;
  top: -25px;
}

.pwl-row:before {
  background: #6a727f;
  content: '';
  display: block;
  width: 2px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -17px;
  height: calc(100% + 8px);
}

.pwl-row:after {
  background: #6a727f;
  content: '';
  display: block;
  width: 17px;
  position: absolute;
  top: 50%;
  bottom: 0;
  left: -17px;
  height: 2px;
}
</style>
<style>
.powerline-bubble-content .marker-powerline {
  width: 56px;
  height: 56px;
  background-image: url('/images/marker-powerline.png');
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
  position: relative;
  transform: translate(-50%, -50%);
}

.powerline-bubble-content .marker-powerline span {
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  line-height: 20px;
}
</style>
