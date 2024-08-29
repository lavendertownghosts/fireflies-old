<template>
  <div>
    <div
      :class="isHomepage ? 'bg-black bg-opacity-60' : ''"
      style="display: none;"
    >
      <div class="pt-12 pb-16 px-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-row">
          <InputRadio
            v-model="tripType"
            :name="'flightTripType'"
            :label="$t('flight.Return')"
            :class="'mr-16'"
            :is-dark="isDark"
            :selected="'1'"
          />
          <InputRadio
            v-model="tripType"
            :name="'flightTripType'"
            :label="$t('flight.OneWay')"
            :is-dark="isDark"
            :selected="'0'"
          />
        </div>
        <div class="flex flex-wrap">
          <div class="w-full relative mt-12 sm:w-1/2 xl:w-3/12">
            <InputFlightNamesearch
              v-model="fromSearch"
              :is-dark="isDark"
              :label="$t('flight.NameSearchFrom')"
              :placeholder="$t('flight.NameSearchFromPlaceholder')"
              :input-style="[
                'xl:rounded-r-none xl:border-r-0 xl:-mr-1 truncate pr-40'
              ]"
              :error="fromSearchError"
              :component-attr-id="fromSearchInputId"
              class="sm:pr-8 xl:pr-1 xl:rounded-r-none"
            />
            <div class="absolute right-0 top-0 mt-24 pt-6 mr-16">
              <i
                class="far z-10 text-black text-sm"
                :class="
                  tripType === '1' ? 'fa-exchange' : 'fa-long-arrow-right'
                "
              ></i>
            </div>
          </div>
          <div class="w-full mt-12 sm:w-1/2 xl:w-3/12">
            <InputFlightNamesearch
              v-model="toSearch"
              :is-dark="isDark"
              :label="$t('flight.NameSearchTo')"
              :placeholder="$t('flight.NameSearchToPlaceholder')"
              :input-style="[
                'xl:rounded-r-none xl:border-r-0 xl:rounded-l-none xl:border-l-0 xl:-mr-1 truncate'
              ]"
              :error="toSearchError"
              :component-attr-id="toSearchInputId"
              class="sm:pl-8 xl:pl-0 xl:rounded-none xl:border-l-0 xl:pr-1"
            />
          </div>
          <div
            class="w-full mt-15 md:w-4/12 md:order-1 xl:w-1/5 xl:mt-12 xl:pr-1"
          >
            <InputDateRange
              v-show="tripType === '1'"
              v-model="dates"
              :is-dark="isDark"
              :label-checkin="$t('flight.Departure')"
              :label-checkout="$t('flight.Arrival')"
              class="flex flex-wrapper w-full"
              :input-style="['xl:border-r-0 xl:-mr-1 xl:rounded-none xl:mb-0']"
              :wrapper-style-checkout="['sm:w-1/2 xl:pl-0']"
              :input-style-checkin="['sm:mb-0']"
              :input-style-checkout="['sm:mb-0']"
              :max-date-year="1"
            />
            <InputDate
              v-show="tripType === '0'"
              v-model="date"
              :label="$t('flight.Departure')"
              class="flex flex-wrapper w-full"
              :is-dark="isDark"
              :input-style="['xl:border-r-0 xl:-mr-1 xl:rounded-none xl:-mr-1']"
              :max-date-year="1"
            />
          </div>
          <div
            class="w-full mt-16 md:w-4/12 md:mt-15 md:pl-16 md:order-2 xl:w-1/6 xl:mt-12 xl:pl-0 xl:pr-1"
          >
            <InputGuests
              v-model="guests"
              class="w-full"
              :age-dropdown-values="[
                $t('general.Newborn'),
                $t('general.YearsOld2'),
                $t('general.YearsOld3'),
                $t('general.YearsOld4'),
                $t('general.YearsOld5'),
                $t('general.YearsOld6'),
                $t('general.YearsOld7'),
                $t('general.YearsOld8'),
                $t('general.YearsOld9'),
                $t('general.YearsOld10'),
                $t('general.YearsOld11')
              ]"
              :label="$t('flight.Guests')"
              :is-dark="isDark"
              :error="guestsError"
              :input-style="['xl:rounded-none']"
            />
          </div>
          <div
            class="w-full mt-12 md:order-4 md:flex md:w-auto md:flex-initial"
          >
            <InputCheckbox v-model="onlyDirect" :is-dark="isDark">{{
              $t('flight.OnlyDirect')
            }}</InputCheckbox>
          </div>
          <div
            class="w-full mt-4 md:mt-12 md:pl-16 md:order-5 md:w-auto md:flex-initial"
          >
            <InputCheckbox v-model="dateFlexible" :is-dark="isDark">{{
              $t('flight.DateFlexible')
            }}</InputCheckbox>
          </div>
          <div
            class="w-full mt-4 md:mt-12 md:pl-16 md:order-6 md:w-auto md:flex-initial"
          >
            <InputCheckbox v-model="originFlexible" :is-dark="isDark">{{
              $t('flight.OriginFlexible')
            }}</InputCheckbox>
          </div>
          <div
            class="w-full mt-12 md:w-4/12 md:mt-24 md:order-3 xl:w-auto xl:flex-grow"
          >
            <ButtonMedium
              class="uppercase w-full md:w-1/2 md:float-right md:mt-5 xl:w-full xl:mt-5 xl:rounded-l-none xl:border-l-0"
              type="danger"
              :is-loading="searchInitLoading"
              @click="startFlightSearch()"
            >
              {{ $t('general.Search') }}
            </ButtonMedium>
          </div>
          <div
            v-show="!isHomepage"
            class="w-full mt-2 md:order-7 md:w-auto md:flex-grow md:mt-5"
          >
            <ServiceSelectDropdown :is-dark="isDark">
              <div class="w-full text-center md:text-right">
                {{ $t('general.OtherServices') }}
              </div>
            </ServiceSelectDropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import InputDateRange from '@/components/micro/InputDateRange'
import InputDate from '@/components/micro/InputDate'
import InputRadio from '@/components/micro/InputRadio'
import InputGuests from '@/components/micro/InputGuests'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputFlightNamesearch from '@/components/micro/InputFlightNamesearch'
import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'
import { getTomorrow, getDayAfterTomorrow } from '@/includes/utils'
import InputCheckbox from '~/components/micro/InputCheckbox'

export default {
  name: 'FlightSearchForm',
  components: {
    InputCheckbox,
    InputDateRange,
    InputDate,
    InputRadio,
    InputGuests,
    ButtonMedium,
    InputFlightNamesearch,
    ServiceSelectDropdown
  },
  props: {
    isDark: {
      type: Boolean,
      default: true
    },
    init: {
      type: [Object, Boolean],
      default: false
    },
    isHomepage: {
      type: Boolean,
      default: false
    },
    fromSearchInputId: {
      type: String,
      default: 'flight-from-search'
    },
    toSearchInputId: {
      type: String,
      default: 'flight-to-search'
    }
  },
  data() {
    return {
      tripType: '1',
      fromSearch: {
        text: '',
        id: false
      },
      toSearch: {
        text: '',
        id: false
      },
      guests: {
        adults: 1,
        children: 0,
        childrenAges: []
      },
      dates: {
        date1: getTomorrow(),
        date2: getDayAfterTomorrow()
      },
      date: getTomorrow(),
      onlyDirect: false,
      dateFlexible: true,
      originFlexible: false,
      searchInitLoading: false,
      fromSearchError: false,
      toSearchError: false,
      guestsError: ''
    }
  },
  watch: {
    init(value) {
      this.setInit(value)
    }
  },
  created() {
    this.$eventBus.listen('flightHistoryFill', this.setInitFromHistory)
  },
  mounted() {
    this.searchInitLoading = false
    this.setInit(this.init)
  },
  beforeDestroy() {
    this.$eventBus.remove('flightHistoryFill', this.setInitFromHistory)
  },
  methods: {
    ...mapActions('flight', ['initFlightSearch']),
    ...mapMutations('flight', ['pushSearchHistory']),
    setInitFromHistory(history) {
      this.tripType = history.tripType
      this.fromSearch = history.from
      this.toSearch = history.to
      if (history.tripType === '1') {
        this.dates = history.dates
      } else {
        this.date = history.dates
      }
      this.guests = history.guests
      this.onlyDirect = history.onlyDirect
      this.dateFlexible = history.dateFlexible
      this.originFlexible = history.originFlexible
    },
    async startFlightSearch() {
      this.fromSearchError = false
      this.toSearchError = false
      this.guestsError = ''
      if (!this.fromSearch.id) {
        this.fromSearchError = this.$t('general.NameSearchErrorMsg')
        return
      }
      if (!this.toSearch.id) {
        this.toSearchError = this.$t('general.NameSearchErrorMsg')
        return
      }
      if (this.guests.children > 0 && this.guests.childrenAges.length > 0) {
        let countInfants = 0
        this.guests.childrenAges.forEach((childrenAge) => {
          if (childrenAge === 0) {
            countInfants++
          }
        })
        if (countInfants > this.guests.adults) {
          this.guestsError = this.$t('flight.MoreInfantsThanAdults')
          return
        }
      }
      this.searchInitLoading = true
      this.pushSearchHistory({
        tripType: this.tripType,
        from: this.fromSearch,
        to: this.toSearch,
        dates: this.tripType === '0' ? this.date : this.dates,
        guests: this.guests,
        onlyDirect: this.onlyDirect,
        dateFlexible: this.dateFlexible,
        originFlexible: this.originFlexible
      })

      const result = await this.initFlightSearch({
        tripType: this.tripType,
        fromSearch: this.fromSearch,
        toSearch: this.toSearch,
        dates: this.tripType === '0' ? { date1: this.date } : this.dates,
        guests: this.guests,
        onlyDirect: this.onlyDirect,
        dateFlexible: this.dateFlexible,
        originFlexible: this.originFlexible
      })
      this.searchInitLoading = false
      this.$emit('search')
      this.$router.push(this.localePath('/flight/search/' + result.search_id))
    },
    changeService(arg) {
      this.$emit('changeService', arg)
    },
    setInit(init) {
      if (init) {
        this.tripType = init.tripType
        this.fromSearch = init.fromSearch
        this.toSearch = init.toSearch
        if (init.tripType === '0') {
          this.date = init.dates.date1
        } else {
          this.dates = init.dates
        }
        this.guests = init.guests
        this.onlyDirect = init.onlyDirect
        this.dateFlexible = init.dateFlexible
        this.originFlexible = init.originFlexible
      }
    }
  }
}
</script>
