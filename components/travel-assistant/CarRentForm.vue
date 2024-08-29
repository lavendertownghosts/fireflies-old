<template>
  <div class="mt-16">
    <div class="flex">
      <InputToggle
        v-model="differentLocation"
        :label="$t('carrent.DifferentLocation')"
      />
    </div>
    <div class="flex flex-wrap md:flex-row mt-16 max-input-row">
      <div class="flex flex-wrap w-full md:w-1/2 md:pr-8 lg:pr-0">
        <InputCarRentalNamesearch
          v-model="fromSearch"
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
            'border-r',
            differentLocation ? 'lg:rounded-r-none lg:border-r-0' : ''
          ]"
          :error="fromSearchError"
          :location="'pickup'"
          :component-attr-id="'ta-car-rent-from-search'"
          class="sm:w-2/3 md:w-full"
        />
      </div>
      <div
        v-show="differentLocation"
        class="flex flex-wrap w-full md:w-1/2 mt-16 md:mt-0 md:pl-8 lg:pl-0"
      >
        <InputCarRentalNamesearch
          v-model="toSearch"
          :label="$t('carrent.NameSearchTo')"
          :placeholder="$t('carrent.NameSearchTo')"
          :error="toSearchError"
          :input-style="['truncate', 'border-r', 'lg:rounded-l-none']"
          :location="'drop'"
          :component-attr-id="'ta-car-rent-to-search'"
          class="sm:w-2/3 md:w-full"
        />
      </div>
    </div>
    <div v-if="showButtons">
      <div class="mt-16 inline-block" @click="addCarRent">
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
import InputToggle from '@/components/micro/InputToggle'
import InputCarRentalNamesearch from '@/components/micro/InputCarRentalNamesearch'
import ButtonSmall from '@/components/micro/ButtonSmall'
export default {
  name: 'CarRentForm',
  components: {
    ButtonSmall,
    InputCarRentalNamesearch,
    InputToggle
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
      differentLocation: false,
      fromSearchError: false,
      toSearchError: false,
      fromSearch: {
        text: '',
        id: false
      },
      toSearch: {
        text: '',
        id: false
      }
    }
  },
  watch: {
    differentLocation: {
      handler() {
        if (!this.showButtons) {
          this.addCarRent()
        }
      }
    },
    fromSearch: {
      handler() {
        if (!this.showButtons) {
          this.addCarRent()
        }
      }
    },
    toSearch: {
      handler() {
        if (!this.showButtons) {
          this.addCarRent()
        }
      }
    }
  },
  mounted() {
    if (this.data !== false) {
      this.fromSearch = this.data.fromSearch
      this.toSearch = this.data.toSearch
      this.differentLocation = this.data.differentLocation
    }
  },
  methods: {
    addCarRent() {
      let formError = false
      this.fromSearchError = false
      this.toSearchError = false
      if (!this.fromSearch.id) {
        this.fromSearchError = this.$t('general.NameSearchErrorMsg')
        formError = true
      }
      if (!this.toSearch.id && this.differentLocation) {
        this.toSearchError = this.$t('general.NameSearchErrorMsg')
        formError = true
      }
      if (formError) {
        return
      }
      const trueFilters = {}
      trueFilters.fromSearch = this.fromSearch
      trueFilters.toSearch = this.toSearch
      trueFilters.differentLocation = this.differentLocation
      console.log(trueFilters)
      this.$emit('addCarRent', trueFilters)
    }
  }
}
</script>

<style scoped>
.max-input-row {
  max-width: 592px;
}
</style>
