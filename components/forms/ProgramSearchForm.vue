<template>
  <div>
    <div v-if="!isHomepage">
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-col lg:flex-row">
          <div class="lg:w-5/12 lg:pr-1 xl:w-7/12">
            <InputProgramNamesearch
              v-model="nameSearch"
              :is-dark="isDark"
              :label="$t('general.Destination')"
              :component-attr-id="nameSearchInputId"
            />
          </div>
          <div class="flex flex-col sm:flex-row lg:w-7/12 xl:w-5/12">
            <InputDateRange
              v-model="dates"
              :is-dark="isDark"
              :label-checkin="$t('program.DateFrom')"
              :label-checkout="$t('program.DateTo')"
              class="flex flex-row mt-16 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-5/12"
              :input-style="['lg:border-r-0 lg:-mr-1 lg:rounded-none']"
            />
            <div class="mt-12 sm:mt-16 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-4/12">
              <InputGuests
                v-model="guests"
                class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1"
                :label="$t('program.Guests')"
                :is-dark="isDark"
                :input-style="['lg:rounded-none']"
              />
            </div>
            <div
              class="hidden mt-24 pt-10 md:w-5/12 md:block lg:mt-16 lg:w-3/12 lg:pt-0"
            >
              <div class="flex flex-row items-end justify-end">
                <ButtonMedium
                  class="uppercase w-1/2 lg:w-full lg:mt-1"
                  type="danger"
                  :input-style="['lg:rounded-l-none']"
                  :is-loading="searchInitLoading"
                  @click="startProgramSearch()"
                >
                  {{ $t('general.Search') }}
                </ButtonMedium>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:justify-end">
          <div class="mt-16 sm:mt-12 md:hidden">
            <ButtonMedium
              class="uppercase w-full"
              type="danger"
              :is-loading="searchInitLoading"
              @click="startProgramSearch()"
            >
              {{ $t('general.Search') }}
            </ButtonMedium>
          </div>
          <ServiceSelectDropdown
            v-show="!isHomepage"
            :is-dark="isDark"
            :class="'mt-4'"
          >
            {{ $t('general.OtherServices') }}
          </ServiceSelectDropdown>
        </div>
      </div>
    </div>
    <div v-else class="rounded bg-black bg-opacity-60 p-24">
      <div class="flex flex-row w-full">
        <InputProgramNamesearch
          v-model="nameSearch"
          :is-dark="isDark"
          :label="$t('general.Destination')"
          :input-style="'lg:border-r-5 border-r-5'"
          :component-attr-id="nameSearchInputId"
        />
      </div>
      <div class="flex flex-row w-full">
        <InputDateRange
          v-model="dates"
          :is-dark="isDark"
          :disable-past="true"
          :label-checkin="$t('program.DateFrom')"
          :label-checkout="$t('program.DateTo')"
          :wrapper-style-checkin="['lg:pr-8']"
          :wrapper-style-checkout="['lg:pl-8']"
          class="w-full flex flex-row mt-16"
        />
      </div>
      <div class="flex flex-row w-full">
        <InputGuests
          v-model="guests"
          class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1 mt-16"
          :label="$t('program.Guests')"
          :is-dark="isDark"
        />
      </div>
      <div class="flex flex-row w-full">
        <ButtonMedium
          class="uppercase w-full mt-16"
          type="danger"
          :is-loading="searchInitLoading"
          @click="startProgramSearch()"
        >
          {{ $t('general.Search') }}
        </ButtonMedium>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

import InputDateRange from '@/components/micro/InputDateRange'
import InputGuests from '@/components/micro/InputGuests'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputProgramNamesearch from '@/components/micro/InputProgramNamesearch'
import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'

import { getTomorrow, getDayAfterTomorrow } from '@/includes/utils'

export default {
  name: 'ProgramSearchForm',
  components: {
    InputDateRange,
    InputGuests,
    ButtonMedium,
    InputProgramNamesearch,
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
    nameSearchInputId: {
      type: String,
      default: 'program-name-search'
    }
  },
  data() {
    return {
      nameSearch: {
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

      searchInitLoading: false,
      nameSearchError: false
    }
  },
  watch: {
    nameSearch() {
      this.nameSearchError = false
    },
    init(value) {
      this.setInit(value)
    }
  },
  created() {
    this.$eventBus.listen('programHistoryFill', this.setInitFromHistory)
  },
  mounted() {
    this.searchInitLoading = false
    this.setInit(this.init)
  },
  beforeDestroy() {
    this.$eventBus.remove('programHistoryFill', this.setInitFromHistory)
  },
  methods: {
    ...mapActions('program', ['initProgramSearch']),
    ...mapMutations('program', ['pushSearchHistory']),
    setInitFromHistory(history) {
      this.nameSearch = history.nameSearch
      this.dates = history.dates
      this.guests = history.guests
    },
    setInit(init) {
      if (init) {
        if (init.search_request === undefined) {
          this.nameSearch.text = init.destination_name
          this.nameSearch.id = init.destination
          this.dates = {
            date1: init.fromDate,
            date2: init.toDate
          }
          this.guests.adults = init.paxDatas.adultCount
          this.guests.children = init.paxDatas.childCount
          this.guests.childrenAges = init.paxDatas.childrenAges
        } else {
          this.nameSearch.text = init.search_request.destination_name
          this.nameSearch.id = init.search_request.destination
          this.dates = {
            date1: init.search_request.fromDate,
            date2: init.search_request.toDate
          }
          this.guests.adults = init.search_request.paxDatas.adultCount
          this.guests.children = init.search_request.paxDatas.childCount
          this.guests.childrenAges = init.search_request.paxDatas.childrenAges
        }
      }
    },
    async startProgramSearch() {
      this.searchInitLoading = true
      if (!this.nameSearch.id) {
        this.nameSearchError = this.$t('general.NameSearchErrorMsg')
        this.searchInitLoading = false
        return
      }
      const result = await this.initProgramSearch({
        destination: this.nameSearch.id,
        destination_name: this.nameSearch.text,
        fromDate: this.dates.date1,
        toDate: this.dates.date2,
        paxDatas: {
          adultCount: this.guests.adults,
          childCount: this.guests.children,
          childrenAges: this.guests.childrenAges
        },
        lang: this.$i18n.locale
      })

      this.pushSearchHistory({
        nameSearch: this.nameSearch,
        dates: this.dates,
        guests: this.guests,
        radio: this.radio
      })
      this.searchInitLoading = false
      this.$emit('search')
      this.$router.push(this.localePath('/program/search/' + result.search_id))
    }
  }
}
</script>
