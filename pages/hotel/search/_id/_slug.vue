<template>
  <div>
    <div class="bg-primary-gradient">
      <div
        class="flex flex-row items-center justify-between px-16 py-24 lg:py-16 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="hidden md:block md:flex-initial md:mr-16">
          <img
            src="~assets/images/white-turq/travel-services/hotel/hotel-60.svg"
            class="w-60 h-60"
          />
        </div>

        <div class="flex-grow leading-32 md:leading-24">
          <div class="flex flex-wrap">
            <div class="flex-initial mr-4">{{ hotel.name }}</div>
            <StarRatings v-if="hotel.stars" :stars="parseInt(hotel.stars)" />
          </div>
          <div class="hidden md:block md:mt-2 text-sm leading-14">
            {{ calcDistance(hotel.distance) }},
            <span class="font-normal">{{ hotel.address }}</span>
          </div>
        </div>

        <div
          class="hidden lg:flex flex-row flex-initial bg-white-lighter-opaque text-white text-sm rounded"
        >
          <div
            v-if="hotel.request !== undefined"
            class="flex-grow p-16 leading-14 font-normal w-320"
          >
            <div>
              <span class="font-bold"
                >{{ dates.date1 | formatDateDisplay }} -
                {{ dates.date2 | formatDateDisplay }}</span
              >
              <span
                >({{ calcNights(dates.date1, dates.date2) }}
                {{ $t('hotel.Night') }})</span
              >
            </div>
            <div v-if="hotel.request !== undefined" class="mt-4">
              {{ getGuestText(adultCount, childCount) }}
            </div>
          </div>
          <div class="flex mt-12 pr-16 h-40">
            <div
              class="pb-9 bg-danger px-13 pt-10 rounded cursor-pointer"
              @click="!searchInProgress ? showHotelSearchFormModal(true) : ''"
            >
              <i
                v-if="!searchInProgress"
                class="fas fa-search text-sm text-white"
              ></i>
              <i
                v-else
                class="fas fa-spinner-third fa-spin text-sm text-white"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap lg:px-16 xl:px-40 max-w-screen-xl mx-auto">
      <div class="lg:w-1/2 lg:pr-8">
        <GalleryBox
          :images="[hotel.image, ...hotel.imageList]"
          class="md:px-16 md:pt-24 lg:px-0"
        />
        <div id="google_translate_element" class="lg:ml-0 mt-15 ml-15"></div>
        <span>
          <script type="text/javascript">
            //<![CDATA[
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  autoDisplay: false,
                  layout:
                    google.translate.TranslateElement.InlineLayout.HORIZONTAL
                },
                'google_translate_element'
              )
            }
            //]]>
          </script>
          <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        </span>
        <div class="flex flex-wrap px-16 lg:px-0 mx-auto text-black">
          <div class="mt-40 translate">
            <div class="font-bold leading-16">
              {{ $t('hotel.AboutTheHotel') }}
            </div>
            <p
              ref="HotelDescription"
              class="mt-8 text-sm leading-20 overflow-hidden"
              :style="
                showDescriptionReadMore
                  ? 'max-height:' + paragraphRow * 20 + 'px'
                  : ''
              "
              :class="showDescriptionReadMore ? 'fadeclamp' : ''"
              v-html="hotel.description"
            ></p>
            <div
              v-show="showDescriptionReadMore"
              class="leading-14 mt-8 text-sm"
            >
              <a
                class="link cursor-pointer"
                @click="showDescriptionReadMore = false"
              >
                {{ $t('hotel.ReadMore') }}
              </a>
            </div>
          </div>
          <div class="mt-40 translate">
            <div class="font-bold leading-16 text-base">
              {{ $t('hotel.Contacts') }}
            </div>
            <ul class="text-sm mt-8 leading-20">
              <li>
                <span class="font-bold">{{ $t('hotel.Address') }}:</span>
                {{ hotel.address }}
              </li>
              <li v-show="hotel.phone">
                <span class="font-bold">{{ $t('hotel.Phone') }}:</span>
                {{ hotel.phone }}
              </li>
            </ul>
          </div>
        </div>
        <div
          class="w-full mt-8 overflow-hidden md:px-16 lg:px-0 cursor-pointer"
          :style="{
            'background-image': 'url(' + hotel.map + ')',
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': 'cover',
            height: '222px'
          }"
          @click="hotelMapModalActive = true"
        ></div>
        <div
          v-show="services.servicesWithIcons"
          class="flex flex-wrap px-16 lg:px-0 mt-40 mx-auto text-black"
        >
          <div class="w-full">
            <div class="font-bold leading-16">
              {{ $t('hotel.Facilities') }}
            </div>
            <div class="flex flex-wrap mt-16 -mx-8">
              <div
                v-for="(service, key) in services.servicesWithIcons"
                :key="key"
                class="flex w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/3 xl:w-1/4"
              >
                <div class="w-full text-center mb-16 mx-8">
                  <i
                    v-if="service.class !== false"
                    class="rounded-full border border-grey-light px-10 py-12 h-40 w-40"
                    :class="service.class"
                  ></i>
                  <div
                    class="text-sm leading-14"
                    :class="service.class === false ? 'mt-34' : 'mt-4'"
                  >
                    {{ service.name | capitalize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="services.servicesWithoutIcons"
          class="flex flex-wrap px-16 lg:px-0 mt-40 mb-40 mx-auto text-black"
        >
          <div class="w-full">
            <div class="font-bold leading-16">
              {{ $t('hotel.MoreFacilities') }}
            </div>
            <div class="flex flex-wrap mt-16">
              <div
                v-for="(service, key) in services.servicesWithoutIcons"
                :key="key"
                class="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/2"
              >
                <div class="flex flex-no-wrap w-full my-12">
                  <i
                    class="fal fa-check font-light text-primary text-sm align-middle"
                  ></i>
                  <div class="text-sm leading-14 ml-8">
                    {{ service.name | capitalize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full lg:hidden">
        <div
          id="search-module"
          class="flex flex-wrap bg-primary-gradient px-16 text-white text-sm mt-40"
        >
          <div class="flex-grow py-16">
            <div class="font-bold leading-14">
              {{ dates.date1 | formatDateDisplay }} -
              {{ dates.date2 | formatDateDisplay }}
              <span class="font-normal"
                >({{ calcNights(dates.date1, dates.date2) }}
                {{ $t('hotel.Night') }})</span
              >
            </div>
            <div v-if="hotel.request !== undefined" class="mt-4 leading-14">
              {{ getGuestText(adultCount, childCount) }}
            </div>
          </div>
          <div class="flex items-center py-12">
            <div
              class="pb-9 bg-danger px-13 pt-10 rounded cursor-pointer"
              @click="showHotelSearchFormModal(true)"
            >
              <i class="fas fa-search text-sm text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/2 lg:pl-8">
        <SkeletonOffersWrapper v-show="searchInProgress" />
        <div
          v-if="!searchInProgress && hotel.roompacks !== undefined"
          class="flex flex-wrap px-16 lg:px-0 mx-auto"
        >
          <div class="w-full">
            <div class="text-lg leading-32 text-black mt-24">
              {{ $t('hotel.Offers') }}
            </div>
            <div
              v-if="getFilterCache.length > 0"
              class="text-sm leading-32 text-black"
            >
              {{ $t('general.Filter') }}:
              <span class="comma">
                <template v-for="(filter, key) in getFilterCache">
                  <span v-if="filter !== 90" :key="key" class="mr-2 filter">{{
                    getBoardName(filter)
                  }}</span>
                </template>
              </span>
              <span> - </span>
              <div
                class="ml-2 link inline cursor-pointer"
                @click="removeFilter"
              >
                {{ $t('general.DeleteFilters') }}
              </div>
            </div>
            <HotelDetailsOfferBox
              v-for="(offer, offerKey) in hotel.roompacks"
              :key="offerKey"
              :is-loading="cartAddInProgress"
              :board-name="getBoardName(offer.supply)"
              :rooms="offer.rooms"
              :cancellation-deadline="cancellation(offer)"
              :percent="offer.percent || 0"
              :currency="currency"
              :voucher="
                hotel.request !== undefined &&
                (hotel.request.type === 'voucher' ||
                  hotel.request.type === 'voucher_cis' ||
                  hotel.request.type === 'voucher_credit')
                  ? 'DV'
                  : ''
              "
              :type="hotel.request !== undefined ? hotel.request.type : ''"
              :voucher-num="parseInt(offer.voucher)"
              :bpo-num="parseInt(offer.bpo)"
              :credit-num="parseInt(offer.credit)"
              :price="Math.ceil(offer.price[currency])"
              :best-price="offerKey == Object.keys(hotel.roompacks)[0]"
              :highlight="offer.highlight"
              :is-alternate-source="offer.source !== currentSource"
              :class="{
                'sm:mb-0': offer.best_price || offer.highlight
              }"
              class="border-b border-grey-light pt-16 pb-16 sm:flex sm:flex-wrap"
              @click="
                offer.source == currentSource
                  ? offerSelect(offer)
                  : alternateOfferSelect(offer)
              "
            />
            <div
              v-if="
                hotel.overPriced !== undefined && hotel.overPriced.length > 0
              "
              :class="showOverPriced ? 'border-b border-grey-light' : ''"
              class="text-black cursor-pointer pb-16 mb-0 mt-16"
              @click="showOverPriced = !showOverPriced"
            >
              {{ $t('hotel.PriceDroppedOffers', [hotel.overPriced.length]) }}
              <i
                class="fa ml-8"
                :class="{
                  'fa-chevron-down': !showOverPriced,
                  'fa-chevron-up': showOverPriced
                }"
              ></i>
            </div>
            <HotelDetailsOfferBox
              v-for="(offer, offerKey) in hotel.overPriced"
              v-show="showOverPriced"
              :key="offerKey"
              :is-loading="cartAddInProgress"
              :board-name="getBoardName(offer.supply)"
              :rooms="offer.rooms"
              :cancellation-deadline="cancellation(offer)"
              :percent="offer.percent || 0"
              :currency="currency"
              :voucher="
                hotel.request !== undefined &&
                (hotel.request.type === 'voucher' ||
                  hotel.request.type === 'voucher_cis' ||
                  hotel.request.type === 'voucher_credit')
                  ? 'DV'
                  : ''
              "
              :type="hotel.request !== undefined ? hotel.request.type : ''"
              :voucher-num="parseInt(offer.voucher)"
              :bpo-num="parseInt(offer.bpo)"
              :credit-num="parseInt(offer.credit)"
              :price="Math.ceil(offer.price[currency])"
              :is-alternate-source="offer.source !== currentSource"
              :class="{
                'sm:mb-0': offer.best_price || offer.highlight
              }"
              class="border-b border-grey-light pt-16 pb-16 sm:flex sm:flex-wrap"
              @click="
                offer.source == currentSource
                  ? offerSelect(offer)
                  : alternateOfferSelect(offer)
              "
            />
          </div>
        </div>
        <div
          v-show="
            hotel.roompacks == undefined ||
              (hotel.roompacks.length <= 0 && hotel.overPriced.length <= 0)
          "
          class="px-16 lg:px-0 mx-auto"
        >
          <div class="pb-40 border-b border-grey lg:border-none">
            <div
              class="flex flex-wrap border border-danger border-dashed mt-24 rounded"
            >
              <div class="w-full text-center text-danger py-24">
                <i class="far fa-frown fa-5x"></i>
              </div>
              <div
                class="w-full text-danger text-sm font-bold leading-14 px-16 text-center md:px-128 md:mx-16 lg:px-16"
              >
                {{ $t('hotel.NoResults') }}
              </div>
              <div class="w-full  md:px-128 md:mx-14 lg:px-0 lg:mx-0">
                <div class="p-16 mx-auto md:px-0 lg:px-16">
                  <div class="flex flex-col xl:flex-row">
                    <div class="flex flex-col sm:flex-row xl:w-3/4">
                      <InputDateRange
                        v-model="dates"
                        :label-checkin="$t('hotel.Checkin')"
                        :label-checkout="$t('hotel.Checkout')"
                        class="flex flex-row mt-8 w-full sm:w-1/2"
                        :input-style="['']"
                        :input-style-checkin="[
                          'xl:rounded-l xl:rounded-r-none'
                        ]"
                        :input-style-checkout="[
                          'xl:rounded-none xl:border-l-0 xl:border-r-0'
                        ]"
                        :wrapper-style-checkin="['sm:w-1/2 xl:pr-0']"
                        :wrapper-style-checkout="[
                          'sm:w-1/2 sm:pr-8 xl:pl-0 xl:pr-0'
                        ]"
                      />
                      <div class="mt-8 w-full sm:pl-8 sm:w-1/2 xl:pl-0">
                        <InputGuestsMultipleRooms
                          v-model="guests"
                          class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1"
                          :label="$t('hotel.Guests')"
                          :input-style="['lg:rounded-none']"
                        />
                      </div>
                    </div>
                    <div class="mt-16 xl:mt-24 xl:w-1/4">
                      <div class="flex flex-row items-end justify-end sm:mt-1">
                        <ButtonMedium
                          class="uppercase w-full"
                          type="danger"
                          :input-style="['xl:rounded-l-none']"
                          :is-loading="searchInProgress"
                          @click="!searchInProgress ? startSearch() : ''"
                        >
                          {{ $t('general.Search') }}
                        </ButtonMedium>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full px-16 lg:px-0">
        <div
          class="mt-15 mb-56 pb-16 border-b border-grey-light lg:border-t lg:border-b-0 lg:pt-16"
        >
          <div class="font-bold text-sm text-black">
            {{ $t('hotel.RelevantOffers') }}
          </div>
          <div class="text-xs leading-12">
            {{ $t('hotel.RelevantOffersAlert') }}
          </div>
          <RelevantOffers class="mt-16" />
        </div>
      </div> -->
      <div
        class="fixed bottom-0 w-full flex flex-wrap px-16 text-white text-sm mt-40 lg:hidden z-10"
        :class="!searchInProgress ? 'bg-primary-gradient' : 'bg-danger-light'"
      >
        <div v-show="!searchInProgress" class="flex-grow py-16">
          <div class="text-xs leading-12 text-white opacity-50">
            {{ $t('hotel.BestOffer') }}:
          </div>
          <div class="mt-4 leading-16 font-bold">
            <span v-if="bestPrice.voucher > 0 && bestPrice.voucher !== ''">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ bestPrice.voucher }}</span>
              <span v-if="!getAllowedPV">
                <span class="ff-currency"></span
                ><span class="pr-6 lg:pr-0 xl:pr-6">DV</span>
              </span>
              <span v-else class="pr-6 lg:pr-0 xl:pr-6">
                <img
                  class="inline -mt-10"
                  :src="premiumDV"
                  width="36"
                  height="24"
                /> </span
              ><span
                v-show="bestPrice.price[currency] > 0 || bestPrice.credit > 0"
                class="pr-6 lg:pr-0 xl:pr-6"
                >+</span
              >
            </span>
            <span v-if="hotel.request.type == 'bpo'">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ bestPrice.bpo }}</span
              ><span class="ff-currency bpo"></span
              ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span
              ><span
                v-show="bestPrice.price[currency] > 0"
                class="pr-6 lg:pr-0 xl:pr-6"
                >+</span
              >
            </span>
            <span v-if="bestPrice.credit > 0">
              <span class="pr-6 lg:pr-0 xl:pr-6">{{ bestPrice.credit }}</span
              ><span class="ff-currency"></span
              ><span class="pr-6 lg:pr-0 xl:pr-6">CR</span
              ><span
                v-show="bestPrice.price[currency] > 0"
                class="pr-6 lg:pr-0 xl:pr-6"
                >+</span
              >
            </span>
            <span v-show="bestPrice.price[currency] > 0">
              {{ currency }}
              {{
                bestPrice.price[currency]
                  | formatNumber('0,0', { thousandsSeparator: ' ' })
              }}
            </span>
          </div>
        </div>
        <div v-show="!searchInProgress" class="flex items-center py-12">
          <div
            v-scroll-to="{ el: '#search-module' }"
            class="pb-9 bg-danger px-13 pt-10 rounded text-sm font-bold cursor-pointer"
          >
            {{ $t('hotel.Offers') }}
          </div>
        </div>
        <div
          v-show="
            hotel.roompacks == undefined ||
              (hotel.roompacks.length <= 0 && hotel.overPriced.length <= 0)
          "
          class="py-13 md:flex md:flex-wrap md:items-center"
        >
          <div
            class="md:flex-1 text-white text-center font-bold text-sm leading-14 md:text-left"
          >
            {{ $t('hotel.NoResults') }}
          </div>
          <div class="mt-12 md:flex-initial md:mt-0">
            <ButtonSmall
              type="danger"
              class="w-full"
              :is-loading="searchInProgress"
              @click="!searchInProgress ? showHotelSearchFormModal(true) : ''"
            >
              {{ $t('general.Search') }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
    <DefaultModal
      v-show="hotelSearchModalActive"
      :is-full-page="isFullPageModal"
      :overflow-y-wrapper="true"
      :is-top-aligned="true"
      @close="closeOutClick"
    >
      <div slot="header">
        <div
          class="flex w-full text-black py-20 px-16 md:px-0 md:py-0 md:pb-16"
        >
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('hotel.ChangeSearch') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="showHotelSearchFormModal(false)"
            ></i>
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full md:hidden"></div>
      </div>
      <div slot="body">
        <div class="w-full mt-64 md:mt-0">
          <div class="p-16 md:p-0 mx-auto">
            <div class="flex flex-col md:flex-row">
              <div class="flex flex-col sm:flex-row md:w-3/4 md:pr-8 lg:pr-0">
                <InputDateRange
                  v-model="dates"
                  :label-checkin="$t('hotel.Checkin')"
                  :label-checkout="$t('hotel.Checkout')"
                  class="flex flex-row mt-8 w-full sm:w-1/2"
                  :input-style="['']"
                  :input-style-checkin="['lg:rounded-l lg:rounded-r-none']"
                  :input-style-checkout="[
                    'lg:rounded-none lg:border-l-0 lg:border-r-0'
                  ]"
                />
                <div class="mt-8 w-full sm:pl-8 sm:w-1/2 lg:pl-0">
                  <InputGuestsMultipleRooms
                    v-model="guests"
                    class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1"
                    :label="$t('hotel.Guests')"
                    :input-style="['lg:rounded-none']"
                  />
                </div>
              </div>
              <div class="mt-16 md:mt-24 md:w-1/4 md:pl-8 lg:pl-0">
                <div class="flex flex-row items-end justify-end sm:mt-1">
                  <ButtonMedium
                    class="uppercase w-full"
                    type="danger"
                    :input-style="['lg:rounded-l-none']"
                    :is-loading="searchInProgress"
                    @click="!searchInProgress ? startSearch() : ''"
                  >
                    {{ $t('general.Search') }}
                  </ButtonMedium>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <!-- hotel térképen -->
    <DefaultModal
      v-show="hotelMapModalActive"
      :is-full-page="isFullPageModal"
      :default-padding="'p-0'"
      :modal-max-width="getHoteMapWrapperWidth"
      @close="hotelMapModalActive = false"
    >
      <div slot="header"></div>
      <div slot="body" class="h-full md:rounded overflow-hidden">
        <div class="relative z-30">
          <div
            class="absolute top-0 right-0 w-40 h-40 bg-primary text-white text-base leading-16 flex items-center justify-center rounded-tr rounded-bl cursor-pointer"
            @click="hotelMapModalActive = false"
          >
            <i class="fa fa-times"></i>
          </div>
        </div>
        <div class="w-full" :style="getHoteMapWrapperHeight">
          <gmap-map
            ref="gmap"
            class="h-full w-full"
            :center="{
              lat: Number(hotel.lat),
              lng: Number(hotel.lon)
            }"
            :zoom="14"
            :options="mapOptions"
          >
            <gmap-marker
              :position="{
                lat: Number(hotel.lat),
                lng: Number(hotel.lon)
              }"
              :clickable="false"
              :draggable="false"
              :icon="marker_unselected"
            ></gmap-marker>
          </gmap-map>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <PermissionModal
      :show="permissionModalActive"
      :permission-needed="permissionNeeded"
      @cancel="permissionModalActive = false"
      @accept="$router.push(localePath('/weboffice/membership-upgrade'))"
    />
    <InformativeModal
      v-show="voucherErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="voucherErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughVoucher') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="voucherErrorPVModalActive"
      :accept-button="$t('general.Ok')"
      @accept="voucherErrorPVModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughPVoucher') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="bpoErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="bpoErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughBPO') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="creditErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="creditErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 font-bold mb-16 text-black">
          {{ $t('hotel.NotEnoughCredit') }}
        </div>
      </div>
    </InformativeModal>
  </div>
</template>

<script>
import * as workerTimers from 'worker-timers'
import { mapActions, mapGetters, mapMutations } from 'vuex'

import premiumDV from '@/assets/images/premium-voucher.svg'

import SkeletonOffersWrapper from '@/components/skeleton/hotel/SkeletonOffersWrapper'
import GalleryBox from '@/components/GalleryBox'
import HotelDetailsOfferBox from '@/components/hotel/HotelDetailsOfferBox'
// import RelevantOffers from '@/components/RelevantOffers'

import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDateRange from '@/components/micro/InputDateRange'
import InputGuestsMultipleRooms from '@/components/micro/InputGuestsMultipleRooms'
import ButtonMedium from '@/components/micro/ButtonMedium'
import DefaultModal from '@/components/modal/DefaultModal'
import InformativeModal from '@/components/modal/InformativeModal'
import StarRatings from '@/components/micro/StarRatings'

import {
  getBoardName,
  filterBy,
  limitBy,
  calcNights,
  calcHotelDistance,
  getGuestText,
  truncate
} from '@/includes/utils'

import HotelServiceIcons from '@/includes/HotelServiceIcons'
import PermissionModal from '@/components/PermissionModal'

/* RelevantOffers-t újra hozzá kell adni ha kell */
export default {
  name: 'HotelDetailsPage',
  components: {
    PermissionModal,
    SkeletonOffersWrapper,
    StarRatings,
    DefaultModal,
    InformativeModal,
    ButtonSmall,
    HotelDetailsOfferBox,
    GalleryBox,
    InputDateRange,
    InputGuestsMultipleRooms,
    ButtonMedium
  },
  async asyncData({ app, store, route }) {
    const hotel = await store.dispatch('hotel/getHotelStaticDetails', {
      slug: route.params.slug,
      lang: app.i18n.locale,
      search_id: route.params.id
    })

    if (hotel.services !== undefined && !Array.isArray(hotel.services)) {
      hotel.services = hotel.services.split(',')
    }

    return {
      hotel,
      dates: {
        date1: hotel.request.checkin,
        date2: hotel.request.checkout
      },
      guests: hotel.request.rooms.map((val) => {
        return {
          adults: val.adults,
          children: val.children,
          childrenAges: val.childrenages
        }
      })
    }
  },
  data() {
    return {
      premiumDV,

      showDescriptionReadMore: true,
      showAllOffers: false,
      hotelSearchModalActive: false,
      hotelMapModalActive: false,

      searchInProgress: true,
      cartAddInProgress: false,
      offerDropdownActive: false,
      otherSource: 0,

      marker_unselected: '/images/marker-unselected.png',
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
      },

      bestPrice: {
        price: 0,
        voucher: 0,
        bpo: 0,
        credit: 0
      }, // alsó sávhoz
      currentSource: false,
      innerWidth: 0,
      innerHeight: 0,
      permissionNeeded: false,
      permissionModalActive: false,
      voucherErrorModalActive: false,
      voucherErrorPVModalActive: false,
      creditErrorModalActive: false,
      bpoErrorModalActive: false,
      searchTimer: false,
      searchRequestLimit: 100,
      searchRequestCounter: 0,
      showOverPriced: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('hotel', ['searchCache']),
    ...mapGetters('user', ['isLoggedIn', 'getGeoLoc', 'getAllowedPV']),
    getFilterCache() {
      let filterCache = false
      let returnArray = []
      if (this.searchCache[this.$route.params.id] !== undefined) {
        filterCache = this.searchCache[this.$route.params.id]
        filterCache.forEach((filter) => {
          if (filter.category === 'supply') {
            returnArray = filter.filter
          }
        })
      }
      return returnArray
    },
    adultCount() {
      let adultsCount = 0
      this.guests.forEach((room) => {
        adultsCount += room.adults
      })
      return adultsCount
    },
    childCount() {
      let children = 0
      this.guests.forEach((room) => {
        children += room.children
      })
      return children
    },
    getHoteMapWrapperWidth() {
      if (window.innerWidth >= 772) {
        return '85%'
      } else {
        return '100%'
      }
    },
    getHoteMapWrapperHeight() {
      if (window.innerWidth >= 1280) {
        return { height: '675px' }
      } else if (window.innerWidth >= 1024) {
        return { height: '558px' }
      } else if (window.innerWidth >= 772) {
        return { height: '416px' }
      } else {
        return { height: '100%' }
      }
    },
    currency() {
      return this.getCurrency
    },
    services() {
      if (
        this.hotel.services === undefined ||
        this.hotel.services.length === 0
      ) {
        return false
      } else {
        const returnServices = []
        returnServices.servicesWithIcons = []
        returnServices.servicesWithoutIcons = []
        for (let i = 0; i < this.hotel.services.length; i++) {
          const el = HotelServiceIcons.find(
            (e) => e.name === this.hotel.services[i]
          )
          if (el) {
            returnServices.servicesWithIcons.push(el)
          } else {
            returnServices.servicesWithoutIcons.push({
              name: this.hotel.services[i],
              class: false
            })
          }
        }

        return returnServices
      }
    },
    paragraphRow() {
      if (window.innerWidth < 1024) {
        return 11
      } else if (window.innerWidth < 1280) {
        return 12
      } else {
        return 13
      }
    },
    offerLimit() {
      if (window.innerWidth < 1024) {
        return 9
      } else if (window.innerWidth < 1280) {
        return 14
      } else {
        return 15
      }
    },
    isFullPageModal() {
      if (window.innerWidth < 772) {
        return true
      }
      return false
    }
  },
  created() {
    this.$nuxt.$off('geo-change')
    this.$nuxt.$on('geo-change', () => {
      this.startSearch()
    })
  },
  async mounted() {
    this.searchInProgress = true
    this.showReadMoreButton()

    let filterCache = false
    if (this.searchCache[this.$route.params.id] !== undefined) {
      filterCache = this.searchCache[this.$route.params.id]
    }

    const resp = await this.getHotelLiveDetails({
      search_id: this.$route.params.id,
      slug: this.$route.params.slug,
      lang: this.$i18n.locale,
      nationality: this.getGeoLoc,
      filters: filterCache
    })

    if (resp.roompacks !== undefined) {
      this.hotel.overPriced = resp.overpriced
      this.hotel.roompacks = resp.roompacks
      this.currentSource = resp.current_source
      if (Object.keys(this.hotel.roompacks)[0] !== undefined) {
        this.bestPrice = this.hotel.roompacks[
          Object.keys(this.hotel.roompacks)[0]
        ]
      }
      console.log(this.bestPrice)
    }

    this.searchInProgress = false
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  beforeDestroy() {
    this.$nuxt.$off('geo-change')
  },
  methods: {
    getBoardName,
    calcNights,
    getGuestText,
    filterBy,
    limitBy,
    ...mapActions('hotel', [
      'getHotelLiveDetails',
      'getHotelStaticDetails',
      'initHotelSearch',
      'getHotelSearch',
      'addToCart'
    ]),
    ...mapMutations('hotel', ['setSearchCache', 'clearSearchCache']),
    calcDistance(distance) {
      return (
        calcHotelDistance(distance) + ' ' + this.$t('hotel.FromTheCityCenter')
      )
    },
    closeOutClick() {
      if (window.innerWidth > 771) {
        this.hotelSearchModalActive = false
      }
    },
    async startSearch() {
      if (!this.searchInProgress) {
        this.showHotelSearchFormModal(false)
        this.searchInProgress = true

        const result = await this.initHotelSearch({
          type: this.hotel.request.type,
          text_id: Number(this.hotel.request.fts_id),
          checkin: this.dates.date1,
          checkout: this.dates.date2,
          guests: this.guests,
          lang: this.$i18n.locale,
          hotel_ids: this.hotel.id,
          client_nationality: this.getGeoLoc
        })

        if (result.search_id !== undefined) {
          this.waitTillDone({
            search_id: result.search_id
          })
        }
      }
    },
    removeFilter() {
      this.clearSearchCache(Number(this.$route.params.id))
      location.reload()
    },
    cancellation(offer) {
      if (offer.cancellable === true) {
        if (offer.cancellationDeadline === null) {
          return this.$t('hotel.CancelInCart')
        } else {
          return offer.cancellationDeadline
        }
      }
      return this.$t('hotel.NonRefundable')
    },
    waitTillDone(params) {
      this.searchTimer = workerTimers.setInterval(async () => {
        if (this.searchRequestCounter >= this.searchRequestLimit) {
          this.$store.dispatch(
            'general/showSnackbar',
            'Request limit timed out'
          )
          this.searchInProgress = false
          if (this.searchTimer !== false) {
            workerTimers.clearInterval(this.searchTimer)
          }
        }

        this.searchRequestCounter++

        let res
        try {
          res = await this.getHotelSearch(params, {
            timeout: process.env.SEARCH_INTERVAL - 500,
            nationality: this.getGeoLoc
          })

          if (res.searching === 'DONE') {
            if (this.searchTimer !== false) {
              workerTimers.clearInterval(this.searchTimer)
            }

            const newSearchCache = []
            newSearchCache[Number(params.search_id)] = this.searchCache[
              this.$route.params.id
            ]

            this.setSearchCache(newSearchCache)

            this.$router.push(
              this.localePath(
                '/hotel/search/' +
                  params.search_id +
                  '/' +
                  this.$route.params.slug
              )
            )
          }
        } catch (e) {
          this.searchInProgress = true
          console.log(e)
          if (this.searchTimer !== false) {
            workerTimers.clearInterval(this.searchTimer)
          }
        }
      }, process.env.SEARCH_INTERVAL)
    },
    showReadMoreButton() {
      if (
        this.$refs.HotelDescription !== undefined &&
        this.$refs.HotelDescription.offsetHeight <
          this.$refs.HotelDescription.scrollHeight
      ) {
        this.showDescriptionReadMore = true
      } else {
        this.showDescriptionReadMore = false
      }
    },
    showHotelSearchFormModal(status) {
      if (status) {
        if (window.innerWidth < 772) {
          document.body.classList.add('fixed')
        }
        this.hotelSearchModalActive = true
      } else {
        if (window.innerWidth < 772) {
          document.body.classList.remove('fixed')
        }
        this.hotelSearchModalActive = false
      }
    },
    async offerSelect(offer) {
      if (this.cartAddInProgress) {
        return
      }

      if (!this.isLoggedIn) {
        this.$eventBus.publish('showLoginModal')
      } else {
        this.cartAddInProgress = true
        let resDetails
        try {
          resDetails = await this.addToCart({
            search_id: this.$route.params.id,
            processId: offer.processId,
            hotel_id: this.hotel.id,
            source: offer.source,
            client_nationality: this.getGeoLoc
          })
        } catch (error) {
          if (error.response !== undefined) {
            this.cartAddInProgress = false
            const serverMessage = await error.response.json()
            this.$store.dispatch('general/showSnackbar', {
              message: serverMessage.messages || 'Unknown error'
            })
          }
        }
        if (resDetails) {
          this.cartAddInProgress = false
          if (resDetails.status === 'PERMISSION') {
            if (resDetails.permission_needed === 'premium_voucher') {
              this.voucherErrorPVModalActive = true
            } else {
              this.permissionNeeded = resDetails.permission_needed
              this.permissionModalActive = true
            }
          } else if (resDetails.status === 'NOT_ENOUGH_VOUCHER') {
            this.voucherErrorModalActive = true
          } else if (resDetails.status === 'NOT_ENOUGH_PREMIUM_VOUCHER') {
            this.voucherErrorPVModalActive = true
          } else if (resDetails.status === 'NOT_ENOUGH_BPO') {
            this.bpoErrorModalActive = true
          } else if (resDetails.status === 'NOT_ENOUGH_CREDIT') {
            this.creditErrorModalActive = true
          } else {
            this.$store.commit('hotel/setCartCache', resDetails)
            await this.$router.push(this.localePath('/hotel/cart'))
          }
        }
      }
    },
    async alternateOfferSelect(offer) {
      if (this.cartAddInProgress) {
        return
      }

      this.cartAddInProgress = true
      const roomsTemp = this.hotel.roompacks
      const overPricedTemp = this.hotel.overPriced

      const hotel = await this.getHotelStaticDetails({
        lang: this.$i18n.locale,
        source: offer.source,
        hotel_id: this.hotel.id,
        hotelcode: offer.hotelCode,
        search_id: this.$route.params.id,
        client_nationality: this.getGeoLoc
      })

      if (hotel.services !== undefined && !Array.isArray(hotel.services)) {
        hotel.services = hotel.services.split(',')
      }

      this.hotel = hotel
      this.hotel.roompacks = roomsTemp
      this.hotel.overPriced = overPricedTemp
      if (Object.keys(this.hotel.roompacks)[0] !== undefined) {
        this.bestPrice = this.hotel.roompacks[
          Object.keys(this.hotel.roompacks)[0]
        ]
      }
      console.log(this.bestPrice)
      this.currentSource = offer.source
      this.cartAddInProgress = false
      this.$scrollTo('#__nuxt')
    },
    toggleOfferDropdown() {
      this.offerDropdownActive = !this.offerDropdownActive
      this.$forceUpdate()
    },
    getOtherSources(rooms) {
      let returnObj = {}
      Object.values(rooms).forEach((room) => {
        if (room[0].source !== this.currentSource) {
          returnObj = { ...returnObj, ...room }
        }
      })
      return returnObj
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
      this.innerHeight = window.innerHeight
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'notranslate'
      },
      title:
        this.hotel !== undefined
          ? this.hotel.name + this.$t('meta.TitleSuffix')
          : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.hotel !== undefined
              ? this.hotel.name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.hotel !== undefined
              ? this.hotel.name + this.$t('meta.TitleSuffix')
              : this.$t('meta.HotelTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content:
            this.hotel.description !== undefined
              ? truncate(this.hotel.description, 160)
              : this.$t('meta.HotelDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.hotel.description !== undefined
              ? truncate(this.hotel.description, 160)
              : this.$t('meta.HotelDescription')
        },
        {
          property: 'twitter:description',
          content:
            this.hotel.description !== undefined
              ? truncate(this.hotel.description, 160)
              : this.$t('meta.HotelDescription')
        }
      ]
    }
  }
}
</script>

<style>
.fadeclamp {
  position: relative;
}
.fadeclamp:after {
  content: '';
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 70%;
  height: 1.2em;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 50%
  );
}

.comma span.filter:not(:last-child):after {
  content: ', ';
  display: inline-block;
}
</style>
