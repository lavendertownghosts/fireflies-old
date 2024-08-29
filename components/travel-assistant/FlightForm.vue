<template>
  <div class="mt-16">
    <div class="flex">
      <InputRadio
        v-model="tripType"
        :name="'flightTripType'"
        :label="$t('flight.Return')"
        :class="'mr-24'"
        :selected="'1'"
      />
      <InputRadio
        v-model="tripType"
        :name="'flightTripType'"
        :label="$t('flight.OneWay')"
        :selected="'2'"
      />
    </div>
    <div class="flex flex-wrap mt-16 max-input-row">
      <div class="flex flex-wrap w-full md:w-1/2 md:pr-8 lg:pr-0">
        <InputFlightNamesearch
          v-model="fromSearch"
          :class="'w-full sm:w-2/3 md:w-full'"
          :input-style="['lg:rounded-r-none lg:border-r-0']"
          :label="$t('flight.NameSearchFrom')"
          :placeholder="$t('flight.NameSearchFromPlaceholder')"
          :component-attr-id="'ta-flight-from-search'"
          :error="fromSearchError"
        />
      </div>
      <div class="flex flex-wrap w-full md:w-1/2 mt-16 md:mt-0 md:pl-8 lg:pl-0">
        <InputFlightNamesearch
          v-model="toSearch"
          :class="'w-full sm:w-2/3 md:w-full'"
          :input-style="['lg:rounded-l-none']"
          :label="$t('flight.NameSearchTo')"
          :placeholder="$t('flight.NameSearchToPlaceholder')"
          :error="toSearchError"
          :component-attr-id="'ta-flight-to-search'"
        />
      </div>
    </div>
    <div class="flex mt-16">
      <InputCheckbox v-model="onlyDirect" :class="'mr-24'">
        {{ $t('flight.OnlyDirect') }}
      </InputCheckbox>
      <InputCheckbox v-model="originFlexible">
        {{ $t('flight.OriginFlexible') }}
      </InputCheckbox>
    </div>
    <div v-if="showButtons">
      <div class="mt-16 inline-block" @click="addFlight">
        <ButtonSmall type="primary">
          {{ $t('general.NewTravelAssistantService') }}
        </ButtonSmall>
      </div>
      <div class="inline-block">
        <button class="link font-bold ml-8" @click="$emit('close')">
          {{ $t('general.Cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import InputRadio from '@/components/micro/InputRadio'
import InputCheckbox from '@/components/micro/InputCheckbox'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputFlightNamesearch from '@/components/micro/InputFlightNamesearch'
export default {
  name: 'FlightForm',
  components: {
    InputFlightNamesearch,
    ButtonSmall,
    InputRadio,
    InputCheckbox
  },
  props: {
    data: {
      type: [Object, Boolean],
      default: false
    },
    showButtons: {
      type: Boolean,
      default: true
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
      onlyDirect: true,
      originFlexible: false,
      fromSearchError: false,
      toSearchError: false
    }
  },
  watch: {
    tripType: {
      handler() {
        if (!this.showButtons) {
          this.addFlight()
        }
      }
    },
    fromSearch: {
      handler() {
        if (!this.showButtons) {
          this.addFlight()
        }
      }
    },
    toSearch: {
      handler() {
        if (!this.showButtons) {
          this.addFlight()
        }
      }
    },
    onlyDirect: {
      handler() {
        if (!this.showButtons) {
          this.addFlight()
        }
      }
    },
    originFlexible: {
      handler() {
        if (!this.showButtons) {
          this.addFlight()
        }
      }
    }
  },
  mounted() {
    if (this.data !== false) {
      this.fromSearch = this.data.fromSearch
      this.toSearch = this.data.toSearch
      this.tripType = this.data.tripType
      this.onlyDirect = this.data.onlyDirect
      this.originFlexible = this.data.originFlexible
    }
  },
  methods: {
    addFlight() {
      let formError = false
      this.fromSearchError = false
      this.toSearchError = false
      if (!this.fromSearch.id) {
        this.fromSearchError = this.$t('general.NameSearchErrorMsg')
        formError = true
      }
      if (!this.toSearch.id) {
        this.toSearchError = this.$t('general.NameSearchErrorMsg')
        formError = true
      }
      if (formError) {
        return
      }
      const trueFilters = {}
      trueFilters.fromSearch = this.fromSearch
      trueFilters.toSearch = this.toSearch
      trueFilters.onlyDirect = this.onlyDirect
      trueFilters.originFlexible = this.originFlexible
      trueFilters.tripType = this.tripType
      this.$emit('addFlight', trueFilters)
    }
  }
}
</script>

<style scoped>
.max-input-row {
  max-width: 592px;
}
</style>
