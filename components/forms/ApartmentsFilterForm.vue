<template>
  <div class="flex flex-col text-black">
    <h3 class="text-sm leading-14 text-black font-bold mb-8">
      {{ $t('general.Country') }}
    </h3>
    <InputDropdown
      v-model="country"
      :button-style="['h-48']"
      :wrapper-style="[]"
      :is-filterable="true"
      :values="data.countries"
    ></InputDropdown>
    <div v-if="!isMobile">
      <ButtonSmall
        v-show="showButton"
        class="w-full mt-24"
        type="inverted"
        @click="filterResults()"
      >
        {{ $t('general.Filter') }}
      </ButtonSmall>
    </div>
    <div v-else class="w-full fixed bottom-0 left-0 right-0">
      <ButtonSmall
        v-show="showButton"
        class="w-full rounded-t-none rounded-b-none"
        type="primary"
        @click="filterResults()"
      >
        {{ $t('general.Filter') }}
      </ButtonSmall>
    </div>
    <div
      class="text-sm leading-14 link cursor-pointer text-center mt-16 hidden md:block"
      @click="removeFilters"
    >
      {{ $t('general.DeleteFilters') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { limitBy } from '@/includes/utils'

import InputDropdown from '@/components/micro/InputDropdown'
import ButtonSmall from '@/components/micro/ButtonSmall'
export default {
  name: 'ApartmentsFilterForm',
  components: {
    InputDropdown,
    ButtonSmall
  },
  props: {
    showFilterButton: {
      type: Boolean,
      default: true
    },
    init: {
      type: [Object, Boolean, Array],
      default() {
        return false
      }
    },
    data: {
      type: [Object, Boolean],
      default() {
        return false
      }
    },
    isMobile: {
      type: Boolean,
      default() {
        return false
      }
    },
    showButton: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      country: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    }
  },
  watch: {
    init: {
      handler(val) {
        this.processInit(val)
      },
      deep: true
    }
  },
  mounted() {
    this.processInit(this.init)
  },
  methods: {
    limitBy(obj, n) {
      return limitBy(obj, n)
    },
    resetFilters() {
      this.country = false
    },
    filterResults() {
      this.$emit('filter', {
        apartmentfilters: {
          country: this.data.countries[this.country]
        }
      })
    },
    processInit(val) {
      if (val.country !== false) {
        this.country = false
        if (this.data.countries !== undefined) {
          this.data.countries.forEach((value, key) => {
            if (value === val.country) {
              this.country = key
            }
          })
        }
      } else {
        this.country = false
      }
    },
    removeFilters() {
      this.resetFilters()
      this.$emit('filter', {})
    }
  }
}
</script>
