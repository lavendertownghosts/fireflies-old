<template>
  <div>
    <InputDropdown
      v-model="activeIndex"
      :error="error"
      :values="countrySelect"
      :is-filterable="true"
      :label="label"
      :placeholder="placeholder"
      @input="emitCITid()"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import InputDropdown from '@/components/micro/InputDropdown'
import { isNumber } from '@/includes/utils'

export default {
  name: 'InputDropdownCountry',
  components: {
    InputDropdown
  },
  props: {
    value: {
      type: [Boolean, Number, String],
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    getCitId: {
      type: Boolean,
      default: false
    },
    getFullName: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeIndex: 0,
      countrySelect: [],
      countrySelectIds: [],
      countrySelectCodes: []
    }
  },
  computed: {
    ...mapGetters('user', ['getCountryList'])
  },
  watch: {},
  async mounted() {
    if (this.getCountryList.length !== 0) {
      this.CountryList = await this.getCountryList
    } else {
      this.CountryList = await this.$store.dispatch('user/getCountries')
      this.setCountryList(this.CountryList)
    }

    if (this.CountryList !== undefined) {
      this.countrySelect = []
      for (const value of this.CountryList) {
        this.countrySelect.push(value.name)
        this.countrySelectIds.push(value.id)
        this.countrySelectCodes.push(value.code)
      }
    }
    if (isNumber(this.value)) {
      this.activeIndex = this.countrySelectIds.indexOf(Number(this.value))
    } else if (this.value.length > 2) {
      this.activeIndex = this.countrySelect.indexOf(Number(this.value))
    } else {
      this.activeIndex = this.countrySelectCodes.indexOf(Number(this.value))
    }

    if (this.getCITid) {
      this.$emit('input', this.countrySelectIds[this.activeIndex])
    } else if (this.getFullName) {
      this.$emit('input', this.countrySelect[this.activeIndex])
    } else {
      this.$emit('input', this.countrySelectCodes[this.activeIndex])
    }
  },
  methods: {
    ...mapMutations({
      setCountryList: 'user/setCountryList'
    }),
    emitCITid(index) {
      if (this.getCITid) {
        this.$emit('input', this.countrySelectIds[index])
      } else if (this.getFullName) {
        this.$emit('input', this.countrySelect[this.activeIndex])
      } else {
        this.$emit('input', this.countrySelectCodes[this.activeIndex])
      }
    }
  }
}
</script>
