<template>
  <div class="w-full">
    <InputDropdown
      v-model="nameSearchText"
      :is-dark="true"
      :is-filterable="true"
      :label="label"
      :values="nameSearchSuggestions"
      :button-style="[buttonStyle]"
      @input="nameSearchSelect()"
    ></InputDropdown>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import InputDropdown from '@/components/micro/InputDropdown'

export default {
  name: 'InputRoundTripNamesearch',
  components: {
    InputDropdown
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          text: 'buda',
          id: false
        }
      }
    },
    isDark: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: [Boolean, String],
      default: ''
    },
    componentAttrId: {
      type: String,
      required: true
    },
    buttonStyle: {
      type: String,
      default: 'md:rounded-r-none md:border-r-0 md:-mr-1'
    }
  },
  data() {
    return {
      nameSearchText: '',
      nameSearchTextTemp: '',
      nameSearchResponse: [],
      nameSearchSuggestions: []
    }
  },
  computed: {},
  watch: {
    value: {
      handler(newValue) {
        this.nameSearchText = newValue.text
        for (const key in this.nameSearchResponse) {
          if (this.nameSearchResponse[key].name === this.value.text) {
            this.nameSearchText = key
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getValues()
  },
  methods: {
    ...mapActions('round-trip', ['getRoundTripNameSearchResult']),
    async getValues() {
      this.nameSearchResponse = await this.getRoundTripNameSearchResult({
        search: ''
      })
      this.nameSearchSuggestions = this.getSuggestions()
    },
    nameSearchSelect() {
      this.$emit('input', {
        text: this.nameSearchResponse[this.nameSearchText].name,
        id: this.nameSearchResponse[this.nameSearchText].id
      })
    },
    getSuggestions() {
      const results = []
      for (const key in this.nameSearchResponse) {
        if (this.nameSearchResponse[key].name === this.value.text) {
          this.nameSearchText = key
        }
        results.push(this.nameSearchResponse[key].name)
      }
      return results
    }
  }
}
</script>
