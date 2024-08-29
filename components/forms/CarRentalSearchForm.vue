<template>
  <div>
    <div v-if="!isHomepage" class="bg-black bg-opacity-60">
      <div
        :class="!showInModal ? 'xl:px-40' : ''"
        class="pt-12 pb-16 px-16 max-w-screen-xl mx-auto"
      >
        <div class="flex flex-row">
          <InputToggle
            v-model="differentLocation"
            :label="$t('carrent.DifferentLocation')"
            :is-dark="isDark"
          />
        </div>
        <div
          :class="showFilterOneRow ? 'lg:flex-row' : ''"
          class="flex flex-col"
        >
          <div
            :class="showFilterOneRow ? 'lg:w-4/12' : 'w-full'"
            class="flex flex-col w-full sm:flex-row relative mt-12"
          >
            <div
              :class="showFilterOneRow ? 'w-full' : ''"
              class="flex-col flex"
            >
              <div
                :class="showFilterOneRow ? 'flex flex-row' : ''"
                class="flex flex-col w-full sm:flex-row"
              >
                <div class="w-full">
                  <InputCarRentalNamesearch
                    v-model="fromSearch"
                    :is-dark="isDark"
                    :label="
                      differentLocation
                        ? $t('carrent.NameSearchFrom')
                        : $t('carrent.NameSearchFromTo')
                    "
                    :placeholder="
                      differentLocation
                        ? $t('carrent.NameSearchFrom')
                        : $t('carrent.NameSearchFromTo')
                    "
                    :input-style="[
                      'truncate',
                      showFilterOneRow
                        ? 'lg:rounded-r-none lg:border-r-0 lg:border-l-0 xl:-mr-1'
                        : ''
                    ]"
                    :class="[
                      showFilterOneRow ? 'lg:pr-1 lg:rounded-r-none' : '',
                      differentLocation ? 'sm:pr-8' : ''
                    ]"
                    :error="fromSearchError"
                    :location="'pickup'"
                    :component-attr-id="fromSearchInputId"
                  />
                </div>
                <div v-show="differentLocation" class="w-full mt-16 sm:mt-0">
                  <InputCarRentalNamesearch
                    v-model="toSearch"
                    :is-dark="isDark"
                    :label="$t('carrent.NameSearchTo')"
                    :placeholder="$t('carrent.NameSearchTo')"
                    :input-style="[
                      'truncate',
                      showFilterOneRow
                        ? 'lg:rounded-r-none lg:border-r-0 lg:rounded-l-none lg:border-l-0 lg:-mr-1'
                        : ''
                    ]"
                    :class="[
                      showFilterOneRow ? 'lg:pr-1 lg:rounded-r-none' : '',
                      differentLocation ? 'sm:pl-8' : '',
                      'xl:pl-0'
                    ]"
                    :error="toSearchError"
                    :location="'drop'"
                    :component-attr-id="toSearchInputId"
                  />
                </div>
              </div>
              <div class="flex flex-row w-full mt-5">
                <InputText
                  v-model="driver.age"
                  input-type="number"
                  :label="$t('carrent.DriverAge')"
                  :is-dark="isDark"
                  class="pr-1 rounded-r-none w-1/2"
                  :input-style="['rounded-r-none -mr-1']"
                  :wrapper-style="[]"
                  :num-min="18"
                  :num-max="99"
                />
                <InputDropdown
                  v-model="driver.country"
                  :label="$t('carrent.CountryOrResidence')"
                  :error="countryError"
                  :is-dark="isDark"
                  class="pr-1 rounded-l-none w-1/2"
                  :button-style="['rounded-l-none -mr-1 h-48']"
                  :wrapper-style="[]"
                  :is-filterable="true"
                  :values="countryListInput"
                ></InputDropdown>
              </div>
            </div>
          </div>
          <div
            :class="[
              !showInModal ? 'md:flex-row' : '',
              showFilterOneRow ? 'lg:w-8/12' : ''
            ]"
            class="flex flex-col w-full"
          >
            <div
              :class="[
                showInModal
                  ? 'w-full mt-12'
                  : differentLocation
                  ? 'md:w-4/7 lg:w-3/7 xl:w-4/7 md:mt-16 xl:mt-12'
                  : 'md:w-4/7 md:mt-16 lg:mt-12'
              ]"
              class="flex flex-col w-full mt-16 sm:flex-row"
            >
              <InputDateTimeRange
                v-model="dates"
                :is-dark="isDark"
                :label-checkin="$t('carrent.DateFrom')"
                :label-checkin-time="$t('carrent.Time')"
                :label-checkout="$t('carrent.DateTo')"
                :label-checkout-time="$t('carrent.Time')"
                :class="!showInModal ? 'md:flex-row' : ''"
                :screen-break-point="
                  showFilterOneRow && innerWidth >= 1024 ? 'lg' : 'sm'
                "
                :time-button-style="showFilterOneRow ? ['lg:rounded-none'] : []"
                :input-style="[
                  showFilterOneRow
                    ? 'lg:border-r-0 lg:-mr-1 lg:rounded-none'
                    : ''
                ]"
                class="flex flex-col w-full sm:flex-row"
              />
            </div>
            <div
              :class="[
                showInModal
                  ? 'w-full'
                  : differentLocation
                  ? 'md:flex-row md:w-3/7 lg:w-4/7 xl:w-3/7 md:mt-16 xl:mt-12'
                  : 'md:flex-row md:w-3/7 md:mt-16 lg:mt-12'
              ]"
              class="flex flex-col w-full mt-13 "
            >
              <InputGuests
                v-model="guests"
                :class="[
                  showInModal
                    ? 'w-full'
                    : showFilterOneRow
                    ? 'md:ml-16 md:mr-20 lg:mr-1 lg:ml-0 xl:w-7/12'
                    : 'md:ml-16 md:mr-20 lg:w-5/12 lg:mr-1 lg:ml-12 xl:w-7/12'
                ]"
                class="w-full"
                :age-dropdown-values="[
                  $t('general.Newborn'),
                  $t('general.YearOld1'),
                  $t('general.YearsOld2'),
                  $t('general.YearsOld3'),
                  $t('general.YearsOld4'),
                  $t('general.YearsOld5'),
                  $t('general.YearsOld6'),
                  $t('general.YearsOld7'),
                  $t('general.YearsOld8'),
                  $t('general.YearsOld9'),
                  $t('general.YearsOld10'),
                  $t('general.YearsOld11'),
                  $t('general.YearsOld12')
                ]"
                :label="$t('carrent.Guests')"
                :is-dark="isDark"
                :input-style="[showFilterOneRow ? 'lg:rounded-none' : '']"
                :wrapper-style="[]"
              />
              <div
                :class="[
                  !showInModal ? 'md:mt-8 lg:mt-12' : '',
                  showInModal
                    ? 'w-full'
                    : differentLocation &&
                      innerWidth >= 1024 &&
                      innerWidth < 1280
                    ? 'lg:w-7/12'
                    : 'md:w-7/12 lg:w-5/12'
                ]"
                class="mt-16 text-right"
              >
                <ButtonMedium
                  :class="[
                    showInModal
                      ? 'w-full'
                      : !showFilterOneRow
                      ? 'md:mt-8 w-full md:w-auto lg:px-42 xl:px-20'
                      : 'md:mt-8 w-full md:w-auto lg:w-full',
                    showFilterOneRow ? 'lg:rounded-l-none lg:border-l-0' : ''
                  ]"
                  class="uppercase lg:mt-5"
                  type="danger"
                  :is-loading="searchInitLoading"
                  @click="startTransferSearch()"
                >
                  {{ $t('general.Search') }}
                </ButtonMedium>
              </div>
            </div>
          </div>
        </div>
        <div
          :class="
            !showInModal && !isHomepage
              ? 'md:flex-row md:flex-grow md:mt-0'
              : 'hidden'
          "
          class="flex flex-col w-full mt-4 justify-end"
        >
          <ServiceSelectDropdown
            :is-dark="isDark"
            :class="!showInModal ? 'md:w-3/12 md:order-2 xl:w-1/7' : ''"
            class="w-full"
          >
            <div
              v-show="!isHomepage"
              :class="!showInModal ? 'md:text-right' : ''"
              class="w-full text-center"
            >
              {{ $t('general.OtherServices') }}
            </div>
          </ServiceSelectDropdown>
        </div>
      </div>
    </div>
    <div v-else class="rounded bg-black bg-opacity-60 p-24">
      <div class="flex flex-row w-full">
        <InputToggle
          v-model="differentLocation"
          :label="$t('carrent.DifferentLocation')"
          :is-dark="isDark"
        />
      </div>
      <div class="flex flex-row w-full mt-8">
        <div
          :class="showFilterOneRow ? 'flex flex-row' : ''"
          class="flex flex-col w-full sm:flex-row"
        >
          <div class="w-full">
            <InputCarRentalNamesearch
              v-model="fromSearch"
              :is-dark="isDark"
              :label="
                differentLocation
                  ? $t('carrent.NameSearchFrom')
                  : $t('carrent.NameSearchFromTo')
              "
              :placeholder="
                differentLocation
                  ? $t('carrent.NameSearchFrom')
                  : $t('carrent.NameSearchFromTo')
              "
              :input-style="[
                'truncate',
                showFilterOneRow ? 'lg:border-r-0 lg:border-l-0 xl:-mr-1' : ''
              ]"
              :class="[
                showFilterOneRow ? 'lg:pr-1' : '',
                differentLocation ? 'sm:pr-8 ' : ''
              ]"
              :error="fromSearchError"
              :location="'pickup'"
              :component-attr-id="fromSearchInputId"
            />
          </div>
          <div v-show="differentLocation" class="w-full mt-16 sm:mt-0">
            <InputCarRentalNamesearch
              v-model="toSearch"
              :is-dark="isDark"
              :label="$t('carrent.NameSearchTo')"
              :placeholder="$t('carrent.NameSearchTo')"
              :input-style="['truncate', showFilterOneRow ? '' : '']"
              :class="[
                showFilterOneRow ? '' : '',
                differentLocation ? 'sm:pl-8' : '',
                'xl:pl-0'
              ]"
              :error="toSearchError"
              :location="'drop'"
              :component-attr-id="toSearchInputId"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full mt-16">
        <InputText
          v-model="driver.age"
          input-type="number"
          :label="$t('carrent.DriverAge')"
          :is-dark="isDark"
          class="pr-1 rounded-r-none w-1/6"
          :input-style="['-mr-1']"
          :wrapper-style="[]"
          :num-min="18"
          :num-max="99"
        />
        <InputDropdown
          v-model="driver.country"
          :label="$t('carrent.CountryOrResidence')"
          :error="countryError"
          :is-dark="isDark"
          class="pr-1 w-3/6 ml-8"
          :button-style="['h-48']"
          :wrapper-style="['']"
          :is-filterable="true"
          :values="countryListInput"
        ></InputDropdown>
        <InputGuests
          v-model="guests"
          class="w-2/6"
          :age-dropdown-values="[
            $t('general.Newborn'),
            $t('general.YearOld1'),
            $t('general.YearsOld2'),
            $t('general.YearsOld3'),
            $t('general.YearsOld4'),
            $t('general.YearsOld5'),
            $t('general.YearsOld6'),
            $t('general.YearsOld7'),
            $t('general.YearsOld8'),
            $t('general.YearsOld9'),
            $t('general.YearsOld10'),
            $t('general.YearsOld11'),
            $t('general.YearsOld12')
          ]"
          :label="$t('carrent.Guests')"
          :is-dark="isDark"
          :wrapper-style="['ml-8']"
        />
      </div>
      <div class="flex flex-row w-full mt-16">
        <InputDateTimeRange
          v-model="dates"
          :is-dark="isDark"
          :label-checkin="$t('carrent.DateFrom')"
          :label-checkin-time="$t('carrent.Time')"
          :label-checkout="$t('carrent.DateTo')"
          :label-checkout-time="$t('carrent.Time')"
          :class="!showInModal ? 'md:flex-row' : ''"
          :time-button-style="['rounded-l-none']"
          :input-style="['rounded-r-none']"
          class="flex flex-col w-full sm:flex-row"
        />
      </div>
      <div class="flex flex-row w-full mt-16">
        <ButtonMedium
          class="uppercase w-full lg:mt-5"
          type="danger"
          :is-loading="searchInitLoading"
          @click="startTransferSearch()"
        >
          {{ $t('general.Search') }}
        </ButtonMedium>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'

import InputCarRentalNamesearch from '@/components/micro/InputCarRentalNamesearch'
import InputDateTimeRange from '@/components/micro/InputDateTimeRange'
import InputGuests from '@/components/micro/InputGuests'
import InputText from '@/components/micro/InputText'
import InputDropdown from '@/components/micro/InputDropdown'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputToggle from '@/components/micro/InputToggle'
import {
  getDayAfterTomorrow,
  getTomorrow,
  convertMinutesToHoursMinutes
} from '~/includes/utils'

export default {
  name: 'CarRentalSearchForm',
  components: {
    InputCarRentalNamesearch,
    InputDateTimeRange,
    InputGuests,
    InputDropdown,
    InputText,
    ButtonMedium,
    ServiceSelectDropdown,
    InputToggle
  },
  props: {
    isDark: {
      type: Boolean,
      default: true
    },
    showInModal: {
      type: [String, Boolean],
      default: false
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
      default: 'car-rent-from-search'
    },
    toSearchInputId: {
      type: String,
      default: 'car-rent-to-search'
    }
  },
  data() {
    return {
      innerWidth: 0,
      tripType: '1',
      fromSearch: {
        text: '',
        id: false
      },
      toSearch: {
        text: '',
        id: false
      },
      dates: {
        date1: getTomorrow(),
        date2: getDayAfterTomorrow(),
        time1: 32,
        time2: 32
      },
      driver: {
        age: 30,
        country: ''
      },
      guests: {
        adults: 2,
        children: 0,
        childrenAges: []
      },
      searchInitLoading: false,
      differentLocation: false,
      fromSearchError: false,
      toSearchError: false,
      countryError: '',
      countryListInput: [],
      countryListRaw: []
    }
  },
  computed: {
    showFilterOneRow() {
      if (
        this.showInModal ||
        (this.differentLocation && this.innerWidth < 1280)
      ) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    init(value) {
      this.setInit(value)
    }
  },
  created() {
    this.$eventBus.listen('carRentalHistoryFill', this.setInitFromHistory)
  },
  mounted() {
    this.calculateSize()
    this.fillCountryList()
    window.addEventListener('resize', this.calculateSize)
    this.searchInitLoading = false
    this.setInit(this.init)
  },
  beforeDestroy() {
    this.$eventBus.remove('carRentalHistoryFill', this.setInitFromHistory)
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    ...mapActions('carRental', ['initCarRentalSearch', 'getCountries']),
    ...mapMutations('carRental', ['pushSearchHistory']),
    async fillCountryList() {
      let res = false

      res = await this.$store.dispatch('car-rental/getCountries', {
        lang: this.$i18n.locale
      })

      if (res !== undefined) {
        this.countryListRaw = res
        this.countryListRaw.forEach((item) => {
          this.countryListInput.push(item.name)
        })
      }
    },
    async setInitFromHistory(history) {
      this.differentLocation = history.differentLocation
      this.fromSearch = history.from
      this.toSearch = history.to
      this.dates = history.dates
      this.driver = history.driver
      this.guests = history.guests

      let countries = false
      countries = await this.getCountries({
        lang: this.$i18n.locale
      })

      if (countries !== undefined) {
        countries.forEach((item, index) => {
          if (item.ISO === this.driver.country) {
            this.driver.country = index
          }
        })
      }
    },
    async startTransferSearch() {
      this.fromSearchError = false
      this.toSearchError = false
      this.countryError = ''
      if (!this.fromSearch.id) {
        this.fromSearchError = this.$t('general.NameSearchErrorMsg')
        return
      }
      if (this.differentLocation && !this.toSearch.id) {
        this.toSearchError = this.$t('general.NameSearchErrorMsg')
        return
      }

      if (this.driver.country === '') {
        this.countryError = this.$t('general.NameSearchErrorMsg')
        return
      }

      this.searchInitLoading = true
      this.pushSearchHistory({
        differentLocation: this.differentLocation,
        from: this.fromSearch,
        to: this.differentLocation ? this.toSearch : { text: '', id: false },
        dates: this.dates,
        guests: this.guests,
        driver: this.driver
      })

      const result = await this.initCarRentalSearch({
        pickup: this.fromSearch.text,
        drop: this.differentLocation
          ? this.toSearch.text
          : this.fromSearch.text,
        pickup_key: this.fromSearch.id,
        drop_key: this.differentLocation
          ? this.toSearch.id
          : this.fromSearch.id,
        pickup_date:
          this.dates.date1 +
          'T' +
          convertMinutesToHoursMinutes(this.dates.time1 * 15),
        drop_date:
          this.dates.date2 +
          'T' +
          convertMinutesToHoursMinutes(this.dates.time2 * 15),
        passengers: this.guests.adults + this.guests.children,
        lang: this.$i18n.locale,
        guests: this.guests,
        driver: {
          age: this.driver.age,
          country:
            this.countryListRaw[this.driver.country] !== undefined
              ? this.countryListRaw[this.driver.country].ISO
              : 'en'
        },
        dates: this.dates
      })
      this.searchInitLoading = false
      this.$emit('search')
      this.$router.push(
        this.localePath('/car-rental/search/' + result.search_id)
      )
    },
    changeService(arg) {
      this.$emit('changeService', arg)
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    setInit(init) {
      if (init) {
        this.fromSearch.text = init.pickup
        this.fromSearch.id = init.pickup_key
        if (init.pickup_key !== init.drop_key) {
          this.differentLocation = true
          this.toSearch.text = init.drop
          this.toSearch.id = init.drop_key
        }
        this.dates = init.dates
        this.guests = init.guests
        this.driver = init.driver

        let i = 0
        this.countryListRaw.forEach((item) => {
          if (item.ISO === this.driver.country) {
            this.driver.country = i
          }
          i++
        })
      }
    }
  }
}
</script>
