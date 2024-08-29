<template>
  <div>
    <div :class="isHomepage ? 'bg-black bg-opacity-60' : ''">
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
        <div
          class="flex md:flex-row flex-col md:p-16 sm:pr-0 md:pr-8 xl:px-40 max-w-screen-xl mx-auto md:h-40 md:items-center"
        >
          <div class="mr-16 md:w-320 text-white font-bold">
            <div class="w-320">{{ $t('apartments.formServicetype') }}</div>
          </div>
          <div
            class="mr-32 md:pl-0 pl-16 flex md:flex-row flex-col"
            @click.self.prevent="remove"
          >
            <InputRadio
              v-model="selected"
              selected="apartments"
              :value="selected"
              :label="$t('apartments.formApartments')"
              :is-dark="isDark"
              :hide-radio="true"
              class="md:pr-16 md:w-320"
            />
            <InputRadio
              v-model="selected"
              selected="condos"
              :value="selected"
              :label="$t('apartments.formCondos')"
              :is-dark="isDark"
              :hide-radio="true"
              class="md:pl-16 md:w-320"
            />
          </div>
          <div class="flex md:mt-0 mt-15 w-full justify-end">
            <ButtonMedium
              v-show="selected === 'apartments'"
              class="uppercase w-full md:w-128 mt-1"
              type="danger"
              :input-style="['lg:rounded-l-none']"
              :is-loading="searchInitLoading"
              @click="startApartmentSearch()"
            >
              {{ $t('general.Search') }}
            </ButtonMedium>
            <ButtonMedium
              v-show="selected === 'apartments'"
              class="uppercase w-full md:w-128 mt-1"
              type="danger"
              :input-style="['lg:rounded-l-none']"
              :is-loading="searchInitLoading"
              @click="startApartmentIntSearch"
            >
              {{ $t('general.Search') }} Integrations
            </ButtonMedium>
            <ApartmentsCondosSearchForm
              v-show="selected === 'condos'"
              :is-homepage="isHomepage"
              class="w-full md:w-128"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputRadio from '@/components/micro/InputRadio'
import ApartmentsCondosSearchForm from '@/components/apartments/ApartmentsCondosSearchForm'

export default {
  name: 'ApartmentsSearchForm',
  components: {
    ButtonMedium,
    InputRadio,
    ApartmentsCondosSearchForm
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
      searchInitLoading: false,
      nameSearchError: false,
      selected: 'apartments'
    }
  },
  computed: {
    paymentType: {
      get() {
        return this.$store.state.apartments.paymentType
      },
      set(value) {
        this.$store.commit('apartments/setPaymentType', value)
      }
    }
  },
  mounted() {
    this.searchInitLoading = false
    this.$store.commit('apartments/setPaymentType', 'bpo_price')
  },
  methods: {
    startApartmentSearch() {
      this.$router.push(this.localePath('/apartments'))
    },
    startApartmentIntSearch() {
      this.$router.push(this.localePath('/apartments'))
    },
    changeService(arg) {
      this.$emit('changeService', arg)
    }
  }
}
</script>
<style>
.radio input[type='radio'] {
  display: none !important;
}
</style>
