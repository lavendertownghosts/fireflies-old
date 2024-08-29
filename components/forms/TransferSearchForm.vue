<template>
  <div>
    <div class="bg-black bg-opacity-60">
      <div class="pt-12 pb-16 px-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-row">
          <InputRadio
            v-model="tripType"
            :name="'flightTripType'"
            :label="'Retúr'"
            :class="'mr-16'"
            :is-dark="isDark"
            :selected="'1'"
          />
          <InputRadio
            v-model="tripType"
            :name="'flightTripType'"
            :label="'Csak odaút'"
            :is-dark="isDark"
            :selected="'2'"
          />
        </div>
        <div class="flex flex-col xl:flex-row">
          <div
            class="flex flex-col w-full xl:w-5/12 sm:flex-row relative mt-12"
          >
            <div class="relative w-full sm:w-1/2">
              <InputTransferNamesearch
                v-model="fromSearch"
                :is-dark="isDark"
                :label="'Honnan'"
                :input-style="[
                  'xl:rounded-r-none xl:border-r-0 xl:border-l-0 xl:-mr-1 truncate pr-40'
                ]"
                class="sm:pr-8 xl:pr-1 xl:rounded-r-none"
              />
              <div class="absolute right-0 top-0 mt-24 pt-6 mr-8 sm:mr-16">
                <i
                  class="far z-10 text-black text-sm"
                  :class="
                    tripType === '1' ? 'fa-exchange' : 'fa-long-arrow-right'
                  "
                ></i>
              </div>
            </div>
            <div class="w-full mt-16 sm:w-1/2 sm:mt-0">
              <InputTransferNamesearch
                v-model="toSearch"
                :is-dark="isDark"
                :label="'Hová'"
                :input-style="[
                  'pr-8 xl:rounded-r-none xl:border-r-0 xl:rounded-l-none xl:border-l-0 xl:-mr-1 truncate'
                ]"
                :length-limit="38"
                class="sm:pl-8 xl:pl-0 xl:rounded-none xl:border-l-0 xl:pr-1"
              />
            </div>
          </div>
          <div class="flex flex-col w-full md:flex-row xl:w-7/12">
            <div
              class="flex flex-col w-full mt-16 sm:flex-row md:w-4/7 lg:w-5/12 xl:w-4/7 xl:mt-12"
            >
              <InputDateTimeRange
                v-model="dates"
                :is-dark="isDark"
                :label-checkin="'Járat érkezése'"
                :label-checkin-time="'Időpont'"
                :label-checkout="'Járat indulása'"
                :label-checkout-time="'Időpont'"
                class="flex flex-col w-full sm:flex-row"
                :screen-break-point="'xl'"
                :input-style="['xl:border-r-0 xl:-mr-1 xl:rounded-none']"
              />
            </div>
            <div
              class="flex flex-col w-full mt-13 md:mt-16 md:flex-row md:w-3/7 lg:w-7/12 xl:w-3/7 xl:mt-12"
            >
              <InputGuests
                v-model="guests"
                class="w-full md:ml-16 lg:ml-16 md:mr-20 lg:w-2/3 xl:mr-1 xl:ml-0 xl:w-7/12"
                :age-dropdown-values="[
                  'Újszülött',
                  '1 éves',
                  '2 éves',
                  '3 éves',
                  '4 éves',
                  '5 éves',
                  '6 éves',
                  '7 éves',
                  '8 éves',
                  '9 éves',
                  '10 éves',
                  '11 éves',
                  '12 éves'
                ]"
                :label="'Utasok'"
                :is-dark="isDark"
                :input-style="['xl:rounded-none']"
                :wrapper-style="['lg:w-4/7 xl:w-full']"
              />
              <div class="mt-16 md:mt-10 lg:flex-grow xl:mt-12 xl:w-5/12">
                <ButtonMedium
                  class="uppercase w-full md:float-right md:mt-8 xl:mt-5 xl:rounded-l-none xl:border-l-0"
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
          class="flex flex-col w-full mt-4 items-center md:flex-row md:flex-grow md:mt-0"
        >
          <ServiceSelectDropdown
            v-show="!isHomepage"
            :is-dark="isDark"
            class="w-full md:w-3/12 md:order-2 xl:w-1/7"
          >
            <div class="w-full text-center md:text-right">
              {{ $t('general.OtherServices') }}
            </div>
          </ServiceSelectDropdown>
          <div
            class="w-full text-xs leading-12 mt-16 md:w-9/12 md:order-1 xl:w-6/7"
          >
            Az <span class="font-bold">Járat érkezése</span> és a
            <span class="font-bold">Járat indulása</span> mezőkbe a hotelbe
            történő transzferfoglalás esetén a repülő-, hajójárat vagy vonat
            érkezési időpontját, hotelből történő transzfer esetén a repülő-,
            hajójárat vagy vonat indulási időpontját adja meg!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'

import InputRadio from '@/components/micro/InputRadio'
import InputTransferNamesearch from '@/components/micro/InputTransferNamesearch'
import InputDateTimeRange from '@/components/micro/InputDateTimeRange'
import InputGuests from '@/components/micro/InputGuests'
import ButtonMedium from '@/components/micro/ButtonMedium'
import { getDayAfterTomorrow, getTomorrow } from '~/includes/utils'

export default {
  name: 'TransferSearchForm',
  components: {
    InputRadio,
    InputTransferNamesearch,
    InputDateTimeRange,
    InputGuests,
    ButtonMedium,
    ServiceSelectDropdown
  },
  props: {
    isDark: {
      type: Boolean,
      default: true
    },
    fromSearchInit: {
      type: [String, Boolean],
      default: false
    },
    toSearchInit: {
      type: [String, Boolean],
      default: false
    },
    isHomepage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tripType: '1',
      fromSearch: {
        text: 'Buda',
        id: false
      },
      toSearch: {
        text: 'Four',
        id: false
      },
      dates: {
        date1: getTomorrow(),
        date2: getDayAfterTomorrow(),
        time1: 32,
        time2: 32
      },
      guests: {
        adults: 2,
        children: 2,
        childrenAges: [1, 6]
      },
      searchInitLoading: false
    }
  },
  mounted() {
    this.searchInitLoading = false
    if (this.fromSearchInit) {
      this.fromSearch.text = this.fromSearchInit
    }
    if (this.toSearchInit) {
      this.toSearch.text = this.toSearchInit
    }
  },
  methods: {
    startTransferSearch() {
      this.searchInitLoading = true
      window.setTimeout(() => {
        this.searchInitLoading = false
        this.$emit('search')
        this.$router.push(this.localePath('/transfer/search'))
      }, 1000)
    },
    changeService(arg) {
      this.$emit('changeService', arg)
    }
  }
}
</script>
