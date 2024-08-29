<template>
  <div>
    <div class="bg-primary-gradient">
      <div
        class="flex flex-row items-center px-16 py-24 lg:py-16 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="hidden md:block md:flex-initial md:mr-16">
          <img
            src="~assets/images/white-turq/travel-services/round-trip/round-trip-60.svg"
            class="w-60 h-60"
          />
        </div>

        <div class="flex-grow leading-32 md:leading-24">
          <div class="flex flex-wrap">
            <div class="flex-initial mr-4">{{ roundTrip.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col sm:flex sm:flex-row sm:flex-wrap px-16 xl:px-40 max-w-screen-xl mx-auto mt-24 mb-12"
    >
      <div
        v-for="(item, index) in getBaseInformation"
        :key="index"
        :class="[
          index !== getBaseInformation.length - 1 ? 'sm:mr-24' : '',
          item.title !== '' ? 'cursor-help' : ''
        ]"
        :title="item.title"
        class="text-black text-sm leading-14 mb-12 sm:w-auto"
      >
        <i :class="item.class" class="mr-4 w-18"></i>{{ item.name }}
      </div>
    </div>
    <div class="flex flex-wrap lg:px-16 xl:px-40 max-w-screen-xl mx-auto pb-40">
      <div class="w-full lg:w-1/2 lg:pr-8">
        <GalleryBox
          :images="roundTrip.images"
          class="flex md:px-16 lg:px-0 w-full"
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
        <div
          class="px-16 mt-40 text-sm leading-20 text-black lg:px-0 translate"
          v-html="roundTrip.description"
        ></div>
        <!-- Round Trip details -->
        <div class="px-16 mt-40 lg:px-0">
          <ButtonGroup
            :buttons="[
              {
                text: $t('roundtrip.Itinerary'),
                action: () => {
                  activeTripDetails = 'itinerary'
                },
                active: activeTripDetails === 'itinerary',
                extraClass: 'w-1/3'
              },
              {
                text: $t('roundtrip.Details'),
                action: () => {
                  activeTripDetails = 'details'
                },
                active: activeTripDetails === 'details',
                extraClass: 'w-1/3'
              },
              {
                text: $t('roundtrip.MeetingPoints'),
                action: () => {
                  activeTripDetails = 'meetingPoints'
                },
                active: activeTripDetails === 'meetingPoints',
                extraClass:
                  'w-1/3 px-5 sm:px-10' + roundTrip.startPoints.length > 0
                    ? ''
                    : ' hidden'
              }
            ]"
          />
        </div>
        <div
          v-show="activeTripDetails === 'itinerary'"
          class="pl-16 pr-32 mt-40 mb-8 lg:px-0"
        >
          <div
            v-for="(item, index) in roundTrip.itinerary"
            :key="index"
            class="flex flex-row text-black text-sm leading-20 pt-8 translate"
          >
            <div class="mr-5">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="w-full">
              <div
                class="flex flex-row cursor-pointer mr-6"
                @click="changeActiveItinerary(item.id)"
                @mouseover="item.hover = true"
                @mouseleave="item.hover = false"
              >
                <div :class="item.hover ? 'underline' : ''">
                  <span class="font-bold">Day {{ item.day }}:</span>
                  {{ item.title }}
                </div>
                <div>
                  <i
                    :class="[
                      (activeItinerary === false && index === 0) ||
                      activeItinerary === item.id
                        ? 'fa-angle-up'
                        : 'fa-angle-down',
                      item.hover ? 'opacity-50' : ''
                    ]"
                    class="w-14 ml-4 fas"
                  ></i>
                </div>
              </div>
              <div
                v-show="
                  (activeItinerary === false && index === 0) ||
                    activeItinerary === item.id
                "
                class="mt-4"
              >
                <div v-html="item.body"></div>
                <div
                  v-for="(extra, indexExtra) in item.extra"
                  :key="'extra' + indexExtra"
                  class="font-bold text-xs leading-12 mt-4"
                >
                  <i :class="extra.iconClass" class="mr-4"></i>{{ extra.name }}
                </div>
                <div
                  v-if="item.map !== undefined"
                  class="w-full mt-8 overflow-hidden md:px-16 lg:px-0 bg-center bg-no-repeat bg-cover rounded"
                  :style="{
                    'background-image': 'url(' + item.map + ')',
                    height: '222px'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="activeTripDetails === 'details'"
          class="px-16 mt-40 mb-8 text-black text-sm leading-20 lg:px-0"
        >
          <div
            class="cursor-pointer md:px-92 lg:px-0"
            @click="detailsToggle.map = !detailsToggle.map"
            @mouseover="detailsHover.map = true"
            @mouseleave="detailsHover.map = false"
          >
            <span
              :class="detailsHover.map ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.MapOverview') }}</span
            >
            <i
              :class="[
                detailsToggle.map ? 'fa-angle-up' : 'fa-angle-down',
                detailsHover.map ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.map" class="md:px-92 lg:px-0">
            <div
              v-if="roundTrip.mapOverview !== undefined"
              class="w-full mt-8 overflow-hidden md:px-16 lg:px-0 bg-center bg-no-repeat bg-cover rounded"
              :style="{
                'background-image': 'url(' + roundTrip.mapOverview + ')',
                height: '222px'
              }"
            ></div>
          </div>
          <div
            class="cursor-pointer mt-40"
            @click="detailsToggle.highlights = !detailsToggle.highlights"
            @mouseover="detailsHover.highlights = true"
            @mouseleave="detailsHover.highlights = false"
          >
            <span
              :class="detailsHover.highlights ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.Highlights') }}</span
            >
            <i
              :class="[
                detailsToggle.highlights ? 'fa-angle-up' : 'fa-angle-down',
                detailsHover.highlights ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.highlights">
            <div class="mt-8" v-html="roundTrip.highlights"></div>
          </div>
          <div
            class="cursor-pointer mt-40"
            @click="detailsToggle.included = !detailsToggle.included"
            @mouseover="detailsHover.included = true"
            @mouseleave="detailsHover.included = false"
          >
            <span
              :class="detailsHover.included ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.Included') }}</span
            >
            <i
              :class="[
                detailsToggle.included ? 'fa-angle-up' : 'fa-angle-down',
                detailsHover.included ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.included" id="included">
            <div class="mt-16" v-html="getIncludedHtml"></div>
          </div>
          <div
            class="cursor-pointer mt-40"
            @click="detailsToggle.exclusions = !detailsToggle.exclusions"
            @mouseover="detailsHover.exclusions = true"
            @mouseleave="detailsHover.exclusions = false"
          >
            <span
              :class="detailsHover.exclusions ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.Exclusions') }}</span
            >
            <i
              :class="[
                detailsToggle.exclusions ? 'fa-angle-up' : 'fa-angle-down',
                detailsHover.exclusions ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.exclusions" id="exclusions">
            <div class="mt-16" v-html="roundTrip.excluded"></div>
          </div>
          <div
            class="cursor-pointer mt-40"
            @click="detailsToggle.note = !detailsToggle.note"
            @mouseover="detailsHover.note = true"
            @mouseleave="detailsHover.note = false"
          >
            <span
              :class="detailsHover.note ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.PleaseNote') }}</span
            >
            <i
              :class="[
                detailsToggle.note ? 'fa-angle-up' : 'fa-angle-down',
                detailsHover.note ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.note">
            <div class="mt-8" v-html="roundTrip.attention"></div>
          </div>
          <div
            v-if="
              roundTrip.accommodationOption !== undefined &&
                roundTrip.accommodationOption.value !== undefined
            "
            class="cursor-pointer mt-40"
            @click="detailsToggle.accommodation = !detailsToggle.accommodation"
            @mouseover="detailsHover.accommodation = true"
            @mouseleave="detailsHover.accommodation = false"
          >
            <span
              :class="detailsHover.accommodation ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.AccommodationOptions') }}</span
            >
            <i
              :class="[
                detailsToggle.accommodation ? 'fa-angle-up' : 'fa-angle-down',
                detailsHover.accommodation ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.accommodation">
            <div
              class="mt-8"
              v-html="
                roundTrip.accommodationOption !== undefined
                  ? roundTrip.accommodationOption.value.replace(
                      'ACCOMMODATION OPTIONS',
                      ''
                    )
                  : ''
              "
            ></div>
          </div>
          <div
            class="cursor-pointer mt-40"
            @click="
              detailsToggle.cancellationPolicy = !detailsToggle.cancellationPolicy
            "
            @mouseover="detailsHover.cancellationPolicy = true"
            @mouseleave="detailsHover.cancellationPolicy = false"
          >
            <span
              :class="detailsHover.cancellationPolicy ? 'underline' : ''"
              class="font-bold text-base leading-16"
              >{{ $t('roundtrip.CancellationPolicy') }}</span
            >
            <i
              :class="[
                detailsToggle.cancellationPolicy
                  ? 'fa-angle-up'
                  : 'fa-angle-down',
                detailsHover.cancellationPolicy ? 'opacity-50' : ''
              ]"
              class="w-14 ml-4 fas text-base leading-16"
            ></i>
          </div>
          <div v-show="detailsToggle.cancellationPolicy">
            <div>
              {{ $t('roundtrip.CancellationDeadline') }}:
              {{ roundTrip.cancelhours }} {{ $t('general.Hour') }}
            </div>
          </div>
        </div>
        <div
          v-show="
            activeTripDetails === 'meetingPoints' &&
              roundTrip.startPoints.length > 0
          "
          class="px-16 mt-40 mb-8 text-black lg:px-0"
        >
          <div v-for="(startPoint, key) in roundTrip.startPoints" :key="key">
            <strong>{{ startPoint.title }}</strong
            ><br />
            {{ startPoint.address.addressLine1 }},
            {{ startPoint.address.city }} <br />
            <div
              v-if="startPoint.map !== undefined"
              class="w-full mt-24 overflow-hidden md:px-16 lg:px-0 bg-center bg-no-repeat bg-cover rounded"
              :style="{
                'background-image': 'url(' + startPoint.map + ')',
                height: '222px'
              }"
            ></div>
          </div>
        </div>
        <!--  -->
      </div>
      <div class="w-full lg:w-1/2 lg:pl-8">
        <div
          v-show="offers !== []"
          id="search-module"
          class="bg-primary-gradient p-16 mt-32 md:mx-16 md:rounded lg:mt-0 lg:mx-0"
        >
          <div class="flex flex-col sm:flex-row">
            <InputGuests
              v-model="guests"
              :label="$t('roundtrip.Guests')"
              :is-dark="true"
              :min-adults-count="roundTrip.passenger_min"
              :max-adults-count="roundTrip.passenger_max"
              :max-children-count="
                childrenAgeDropdownValues.length === 0
                  ? 0
                  : roundTrip.passenger_max - guests.adults
              "
              :age-dropdown-values="childrenAgeDropdownValues"
              class="w-full sm:w-5/12 md:w-4/12 lg:w-5/12 sm:mr-8"
              @input="changeFilter('guests', arguments[0])"
              @ageInput="changeFilter('guests', arguments[0])"
            />
            <InputDropdown
              v-model="selectedDate"
              :is-dark="true"
              :values="dateSelect"
              :placeholder="$t('roundtrip.PleaseSelect')"
              :label="$t('roundtrip.Date')"
              :class="
                'w-full sm:w-7/12 md:w-8/12 lg:w-7/12 mt-16 sm:mt-0 sm:ml-8'
              "
              @input="changeFilter('selectedDate', arguments[0])"
            />
          </div>
          <div class="h-1 w-full bg-white opacity-30 my-16"></div>
          <div class="flex flex-col">
            <InputDropdown
              v-model="rate"
              :is-dark="true"
              :values="rateSelect"
              :button-style="['truncate']"
              :placeholder="$t('roundtrip.PleaseSelect')"
              :label="$t('roundtrip.Rate')"
              :class="'w-full'"
              @input="changeFilter('rate', arguments[0])"
            />
            <InputDropdown
              v-model="pickup"
              :is-dark="true"
              :values="pickupSelect"
              :button-style="['truncate']"
              :placeholder="$t('roundtrip.PleaseSelect')"
              :label="$t('roundtrip.PickUpOption')"
              :class="'w-full mt-16'"
              @input="changeFilter('pickup', arguments[0])"
            />
          </div>
        </div>
        <div
          v-show="!searchInProgress && offers === []"
          class="px-16 lg:px-0 mx-auto"
        >
          <div class="pb-40 border-b border-grey lg:border-none">
            <div
              class="flex flex-wrap border border-danger border-dashed rounded py-24"
            >
              <div class="w-full text-center text-danger pb-24">
                <i class="far fa-frown fa-5x"></i>
              </div>
              <div
                class="w-full text-danger text-sm font-bold leading-14 px-16 text-center md:px-128 md:mx-16 lg:px-16"
              >
                {{ $t('roundTrip.NoResults') }}
              </div>
            </div>
          </div>
        </div>
        <!-- Offers -->
        <SkeletonOffersWrapper
          v-show="searchInProgress"
          :request="{ destination: roundTrip.title }"
        />
        <div v-show="!searchInProgress">
          <div
            v-for="(offerItems, date) in offers"
            v-show="!offerItems[0].hidden || showAllOffers"
            :key="date"
            class="mt-40 px-16 text-black"
          >
            <div class="text-lg leading-24">
              {{ getOfferGroupDate(date) }}
            </div>
            <div class="h-1 w-full bg-grey-light my-16"></div>
            <RoundTripOfferBox
              v-for="(offer, offerIndex) in offerItems"
              v-show="!offer.hidden || showAllOffers"
              :key="offerIndex"
              :offer="offer"
              :duration="roundTrip.duration"
              :is-loading="cartAddInProgress"
              @select="selectOffer"
            />
          </div>
          <div
            v-show="countOffers > 0 && countOffers > limitOffer"
            class="w-full px-16 mb-16"
          >
            <ButtonSmall
              v-show="!showAllOffers"
              type="inverted"
              class="w-full mt-24"
              @click="showAllOffers = true"
            >
              {{ countOffers - limitOffer }} {{ $t('roundtrip.MoreOffers') }}
            </ButtonSmall>
          </div>
        </div>
      </div>
    </div>
    <PermissionModal
      :show="permissionModalActive"
      :permission-needed="permissionNeeded"
      @cancel="permissionModalActive = false"
      @accept="$router.push(localePath('/weboffice/membership-upgrade'))"
    />
    <!-- Best offer fixed bottom -->
    <div
      class="fixed bottom-0 w-full flex flex-wrap px-16 text-white text-sm mt-40 lg:hidden z-10"
      :class="
        !searchInProgress && offers.length > 0
          ? 'bg-primary-gradient'
          : 'bg-danger-light'
      "
    >
      <div
        v-show="!searchInProgress && offers.length > 0"
        class="flex-grow py-16"
      >
        <div class="text-xs leading-12 text-white opacity-50">
          {{ $t('roundtrip.BestOffer') }}:
        </div>
        <div class="mt-4 leading-16 font-bold">
          1 <span class="ff-currency bg-white"></span>DV + EUR 140
        </div>
      </div>
      <div
        v-show="!searchInProgress && offers.length > 0"
        class="flex items-center py-12"
      >
        <div
          v-scroll-to="{ el: '#search-module' }"
          class="pb-9 bg-danger px-13 pt-10 rounded text-sm font-bold cursor-pointer"
        >
          {{ $t('roundtrip.ShowOffer') }}
        </div>
      </div>
      <div
        v-show="!searchInProgress && !offers"
        class="py-13 md:flex md:flex-wrap md:items-center"
      >
        <div
          class="md:flex-1 text-white text-center font-bold text-sm leading-14 md:text-left"
        >
          {{ $t('general.NoResults') }}
        </div>
        <div class="mt-12 md:flex-initial md:mt-0">
          <ButtonSmall
            type="danger"
            class="w-full"
            @click="showProgramSearchFormModal(true)"
          >
            {{ $t('general.Search') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import {
  calculateWeek,
  getLanguageName,
  getMonthName,
  getTomorrow
} from '@/includes/utils'
import GalleryBox from '~/components/GalleryBox'
import RoundTripOfferBox from '~/components/round-trip/RoundTripOfferBox'

import SkeletonOffersWrapper from '~/components/skeleton/round-trip/SkeletonOffersWrapper'
import ButtonGroup from '~/components/micro/ButtonGroup'
import InputGuests from '~/components/micro/InputGuests'
import InputDropdown from '~/components/micro/InputDropdown'
import ButtonSmall from '~/components/micro/ButtonSmall'
import PermissionModal from '@/components/PermissionModal'

export default {
  name: 'RoundTripDetails',
  components: {
    GalleryBox,
    ButtonGroup,
    InputGuests,
    InputDropdown,
    RoundTripOfferBox,
    ButtonSmall,
    PermissionModal,
    SkeletonOffersWrapper
  },
  async asyncData({ store, route, app, redirect }) {
    let roundTrip
    try {
      roundTrip = await store.dispatch('round-trip/getRoundTripDetails', {
        activity_id: route.params.slug,
        search_id: route.params.id
      })
    } catch (e) {
      redirect(app.localePath('/round-trip/search/' + route.params.id))
    }
    if (roundTrip) {
      if (roundTrip.itinerary !== undefined && roundTrip.itinerary.length > 0) {
        for (let i = 0; i < roundTrip.itinerary.length; i++) {
          roundTrip.itinerary[i].active = i === 0
          roundTrip.itinerary[i].hover = false
        }
      }
      if (
        roundTrip.customFields !== undefined &&
        roundTrip.customFields.length > 0
      ) {
        roundTrip.accommodationOption = roundTrip.customFields.find(
          (obj) => obj.code === 'Accommodation options'
        )
      }
      const description = roundTrip.description.split('TOUR HIGHLIGHTS')
      roundTrip.description = new DOMParser().parseFromString(
        description[0],
        'text/html'
      ).body.textContent
      roundTrip.highlights =
        description[1] !== undefined
          ? new DOMParser()
              .parseFromString(description[1], 'text/html')
              .body.textContent.trim()
          : false
      const childrenAgeDropdownValues = []
      const childrenAgeDropdownAges = []
      if (roundTrip.minAge !== undefined) {
        for (let i = roundTrip.minAge; i < 18; i++) {
          childrenAgeDropdownValues.push(app.i18n.t('general.YearsOld' + i))
          childrenAgeDropdownAges.push(i)
        }
      }
      if (roundTrip.cancellationDeadline) {
        roundTrip.cancellationDeadline =
          roundTrip.cancellationDeadline.substring(0, 4) +
          '-' +
          roundTrip.cancellationDeadline.substring(4, 6) +
          '-' +
          roundTrip.cancellationDeadline.substring(6, 8)
      }
      return {
        roundTrip,
        childrenAgeDropdownValues,
        childrenAgeDropdownAges
      }
    }
  },
  data() {
    return {
      countOffers: 0,
      limitOffer: 10,
      activeTripDetails: 'itinerary',
      showAllOffers: false,
      searchInProgress: false,
      guests: {
        adults: 1,
        children: 0,
        childrenAges: []
      },
      dates: {
        date1: getTomorrow(),
        date2: ''
      },
      selectedDate: 0,
      dateSelect: [],
      dateSelectKeys: [],
      rate: 0,
      pickup: 0,
      pickupSelect: [this.$t('general.All')],
      detailsToggle: {
        map: true,
        highlights: false,
        included: false,
        exclusions: false,
        note: false,
        accommodation: false,
        cancellationPolicy: false
      },
      detailsHover: {
        map: false,
        highlights: false,
        included: false,
        exclusions: false,
        note: false,
        accommodation: false,
        cancellationPolicy: false
      },
      offers: [],
      activeItinerary: false,
      cartAddInProgress: false,
      rateSelect: [],
      rateSelectKeys: []
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    getBaseInformation() {
      const information = []
      if (this.roundTrip.duration) {
        information.push({
          name: calculateWeek(this.roundTrip.duration_text),
          title:
            this.$t('roundtrip.Period') +
            ': ' +
            calculateWeek(this.roundTrip.duration_text),
          class: 'far fa-clock'
        })
      }
      if (this.roundTrip.difficulty) {
        let difficultyLocalized = ''
        if (this.roundTrip.difficulty === 'VERY_EASY') {
          difficultyLocalized = this.$t('roundtrip.VeryEasy')
        } else if (this.roundTrip.difficulty === 'EASY') {
          difficultyLocalized = this.$t('roundtrip.Easy')
        } else if (this.roundTrip.difficulty === 'MODERATE') {
          difficultyLocalized = this.$t('roundtrip.Moderate')
        } else if (this.roundTrip.difficulty === 'CHALLENGING') {
          difficultyLocalized = this.$t('roundtrip.Challenging')
        }
        information.push({
          name: difficultyLocalized,
          title:
            this.$t('roundtrip.PhysicalDifficultyLevel') +
            ': ' +
            difficultyLocalized,
          class: 'fad fa-signal-alt-1'
        })
      }
      if (
        this.roundTrip.guidanceTypes &&
        this.roundTrip.guidanceTypes.length > 0 &&
        this.roundTrip.guidanceTypes[0].languages
      ) {
        const languages = []
        this.roundTrip.guidanceTypes[0].languages.forEach((langCode) => {
          languages.push(getLanguageName(langCode))
        })
        information.push({
          name:
            this.$t('roundtrip.GuidedLanguage') + ': ' + languages.join(', '),
          title: '',
          class: 'far fa-comment-dots'
        })
      }
      if (this.roundTrip.minAge) {
        information.push({
          name:
            this.$t('roundtrip.MinimumAgeOfPassenger') +
            ': ' +
            this.roundTrip.minAge,
          title: '',
          class: 'far fa-info-circle'
        })
      }
      return information
    },
    getIncludedHtml() {
      return this.roundTrip.included
    }
  },
  mounted() {
    if (this.roundTrip.session !== undefined) {
      if (this.roundTrip.session.guests !== undefined) {
        if (
          this.roundTrip.session.guests.adults +
            this.roundTrip.session.guests.children ===
          0
        ) {
          this.guests.adults = this.roundTrip.passenger_min
        } else {
          this.guests = this.roundTrip.session.guests
        }
      }
      if (this.roundTrip.session.dates !== undefined) {
        this.dates = this.roundTrip.session.dates
      }
    }

    this.initRateSelect()
    this.getOffers(true)
  },
  methods: {
    ...mapActions('round-trip', ['getRoundTripOffers']),
    async startSearch(initDateSelect, filters) {
      this.searchInProgress = true
      filters.activity_id = this.$route.params.slug
      let res
      try {
        res = await this.getRoundTripOffers(filters, {
          timeout: process.env.SEARCH_INTERVAL
        })
      } catch (e) {
        console.log(e)
      }
      this.showAllOffers = false
      this.countOffers = 0
      this.offers = res
      if (Object.entries(res).length > 0) {
        if (initDateSelect) {
          this.dateSelect = [this.$t('general.All')]
          this.dateSelectKeys = ['']
          Object.entries(res).forEach((item) => {
            const dateTMP = new Date(item[0])
            this.dateSelect.push(
              format(dateTMP, 'yyyy') + ' ' + getMonthName(format(dateTMP, 'M'))
            )
            this.dateSelectKeys.push(item[0])
          })
        }
        Object.entries(res).forEach((item) => {
          if (item[1].length > 0) {
            item[1].forEach((value) => {
              value.hidden = this.countOffers > this.limitOffer
              this.countOffers++
            })
          }
        })
        this.searchInProgress = false
      } else {
        this.searchInProgress = false
      }
    },
    getOffers(initDateSelect = false) {
      const trueFilters = {}
      if (this.rateSelectKeys[this.rate] !== undefined) {
        trueFilters.rate_id = this.rateSelectKeys[this.rate]
      }
      if (
        this.selectedDate > 0 &&
        this.dateSelectKeys[this.selectedDate] !== undefined
      ) {
        const date = new Date(this.dateSelectKeys[this.selectedDate])
        trueFilters.date_range = [
          format(startOfMonth(date), 'y-MM-dd'),
          format(endOfMonth(date), 'y-MM-dd')
        ]
      } else {
        trueFilters.date_range = [this.dates.date1, this.dates.date2]
      }
      trueFilters.passengers = JSON.parse(JSON.stringify(this.guests))
      if (this.guests.childrenAges.length > 0) {
        trueFilters.passengers.childrenAges = []
        this.guests.childrenAges.forEach((ageKey) => {
          trueFilters.passengers.childrenAges.push(
            this.childrenAgeDropdownAges[ageKey]
          )
        })
      }
      this.startSearch(initDateSelect, trueFilters)
    },
    async selectOffer(offer) {
      if (!this.isLoggedIn) {
        this.$eventBus.publish('showLoginModal')
      } else {
        this.cartAddInProgress = true
        let res = false
        const passengersData = JSON.parse(JSON.stringify(this.guests))
        if (this.guests.childrenAges.length > 0) {
          passengersData.childrenAges = []
          this.guests.childrenAges.forEach((ageKey) => {
            passengersData.childrenAges.push(
              this.childrenAgeDropdownAges[ageKey]
            )
          })
        }
        try {
          res = await this.$store.dispatch('round-trip/addToCart', {
            search_id: this.$route.params.id,
            activity_id: this.$route.params.slug,
            rate_id: this.rateSelectKeys[this.rate],
            date: offer.date,
            pickup_id: 0,
            passengers: passengersData
          })
        } catch (e) {
          console.log(e)
        }

        if (res !== false) {
          this.cartAddInProgress = false
          if (res.status === 'PERMISSION') {
            this.permissionNeeded = res.permission_needed
            this.permissionModalActive = true
          } else if (res.status === 'NOT_ENOUGH_VOUCHER') {
            this.voucherErrorModalActive = true
          } else if (res.status === 'NOT_ENOUGH_CREDIT') {
            this.creditErrorModalActive = true
          } else {
            this.$store.commit('round-trip/setCartCache', res)
            await this.$router.push(this.localePath('/round-trip/cart'))
          }
        }

        this.cartAddInProgress = false
      }
    },
    getOfferGroupDate(date) {
      const dateTMP = new Date(date)
      return format(dateTMP, 'yyyy') + ' ' + getMonthName(format(dateTMP, 'M'))
    },
    changeFilter(filter, value) {
      if (filter === 'rate') {
        this.rate = value
      } else if (filter === 'selectedDate') {
        this.selectedDate = value
      } else if (filter === 'guests') {
        this.initRateSelect()
        this.guests = value
      }
      this.getOffers()
    },
    changeActiveItinerary(id) {
      if (this.activeItinerary === id) {
        this.activeItinerary = false
      } else {
        this.activeItinerary = id
      }
    },
    initRateSelect() {
      this.rateSelect = []
      this.rateSelectKeys = []
      if (
        this.roundTrip.hotel_list !== undefined &&
        this.roundTrip.hotel_list.length > 0
      ) {
        const passengers = this.guests.adults + this.guests.children
        this.roundTrip.hotel_list.forEach((hotel) => {
          if (hotel.min <= passengers && hotel.max >= passengers) {
            this.rateSelect.push(hotel.title)
            this.rateSelectKeys.push(hotel.rate_id)
          }
        })
        this.rate = 0
      }
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'notranslate'
      },
      title:
        this.roundTrip.title !== undefined
          ? this.roundTrip.title + this.$t('meta.TitleSuffix')
          : this.$t('meta.DestinationTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.roundTrip.title !== undefined
              ? this.roundTrip.title + this.$t('meta.TitleSuffix')
              : this.$t('meta.DestinationTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.roundTrip.title !== undefined
              ? this.roundTrip.title + this.$t('meta.TitleSuffix')
              : this.$t('meta.DestinationTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.DestinationDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.DestinationDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.DestinationDescription')
        }
      ]
    }
  }
}
</script>

<style lang="postcss">
#included > div > p,
#exclusions > div > p {
  @apply mb-8;
  @apply leading-14;
  @apply text-sm;
}

#included > div > p::before {
  font-family: 'Font Awesome 5 Pro';
  font-weight: 900;
  content: '\f00c';
  @apply mr-8;
  @apply text-primary;
}

#included > div > p > strong,
#exclusions > div > p > strong {
  @apply leading-14;
  @apply text-sm;
}
#included > div > ul {
  @apply mb-16;
  margin-left: 22px;
}
#exclusions > div > ul > li {
  @apply leading-14;
  @apply text-sm;
  @apply mb-16;
}
#exclusions > div > ul > li::before {
  font-family: 'Font Awesome 5 Pro';
  font-weight: 900;
  content: '\f00d';
  @apply mr-8;
  @apply text-danger;
}
</style>
