<template>
  <div>
    <div v-if="!isHomepage" class="bg-black bg-opacity-60">
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-col md:flex-row">
          <div class="flex flex-grow">
            <InputRoundTripNamesearch
              v-model="nameSearch"
              :is-dark="isDark"
              :label="$t('general.Destination')"
              :error="nameSearchError"
              :component-attr-id="nameSearchInputId"
            />
          </div>
          <div class="flex flex-initial">
            <div class="hidden mt-24 md:block md:mt-16">
              <div class="flex flex-row items-end justify-end">
                <ButtonMedium
                  class="uppercase w-full md:w-128 mt-1"
                  type="danger"
                  :input-style="['lg:rounded-l-none']"
                  :is-loading="searchInitLoading"
                  @click="startRoundTripSearch()"
                >
                  {{ $t('general.Search') }}
                </ButtonMedium>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between">
          <div
            class="flex flex-col sm:flex-row sm:items-center md:w-3/4 md:justify-start mt-8"
          ></div>
          <div class="mt-12 md:hidden">
            <ButtonMedium
              class="uppercase w-full"
              type="danger"
              :is-loading="searchInitLoading"
              @click="startRoundTripSearch()"
            >
              {{ $t('general.Search') }}
            </ButtonMedium>
          </div>
          <ServiceSelectDropdown v-show="!isHomepage" :is-dark="isDark">
            {{ $t('general.OtherServices') }}
          </ServiceSelectDropdown>
        </div>
      </div>
    </div>
    <div v-else class="rounded bg-black bg-opacity-60 p-24">
      <div class="flex flex-row w-full">
        <InputRoundTripNamesearch
          v-model="nameSearch"
          :is-dark="isDark"
          :label="$t('general.Destination')"
          :error="nameSearchError"
          :component-attr-id="nameSearchInputId"
          :button-style="'rounded'"
        />
      </div>
      <div class="flex flex-row w-full mt-18">
        <ButtonMedium
          class="uppercase w-full"
          type="danger"
          :is-loading="searchInitLoading"
          @click="startRoundTripSearch()"
        >
          {{ $t('general.Search') }}
        </ButtonMedium>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputRoundTripNamesearch from '@/components/micro/InputRoundTripNamesearch'

import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'

export default {
  name: 'RoundTripSearchForm',
  components: {
    ButtonMedium,
    InputRoundTripNamesearch,
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
      default: 'round-trip-name-search'
    }
  },
  data() {
    return {
      nameSearch: {
        text: '',
        id: false
      },
      payMethod: '1',
      searchInitLoading: false,
      nameSearchError: false
    }
  },
  watch: {
    init(value) {
      this.setInit(value)
    }
  },
  mounted() {
    this.searchInitLoading = false
    this.setInit(this.init)
  },
  methods: {
    ...mapActions('round-trip', ['initRoundTripSearch']),
    async startRoundTripSearch() {
      this.nameSearchError = false
      if (!this.nameSearch.id) {
        this.nameSearchError = this.$t('general.NameSearchErrorMsg')
        return
      }
      this.searchInitLoading = true
      const result = await this.initRoundTripSearch({
        id: this.nameSearch.id,
        text: this.nameSearch.text,
        payMethod: this.payMethod
      })
      this.searchInitLoading = false
      this.$emit('search')
      this.$router.push(
        this.localePath('/round-trip/search/' + result.search_id)
      )
    },
    changeService(arg) {
      this.$emit('changeService', arg)
    },
    setInit(init) {
      if (init) {
        this.nameSearch.text = init.text
        this.nameSearch.id = init.id
        this.payMethod = init.payMethod
      }
    }
  }
}
</script>
