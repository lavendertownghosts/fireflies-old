<template>
  <div>
    <Autosuggest
      :suggestions="nameSearchSuggestions"
      :input-props="{
        id: componentAttrId,
        placeholder: ''
      }"
      :label="label"
      :is-dark="isDark"
      :value="nameSearchText"
      :is-disabled="isDisabled"
      @input="nameSearchStart"
      @selected="nameSearchSelect"
    >
    </Autosuggest>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import Autosuggest from '@/components/autosuggest/Autosuggest'

export default {
  name: 'WebofficeCapitalBonusNamesearch',
  components: {
    Autosuggest
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          text: ''
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
    componentAttrId: {
      type: String,
      required: true
    },
    levelFilter: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nameSearchText: '',
      nameSearchTextTemp: '',
      nameSearchResponse: [],
      nameSearchSuggestions: [
        {
          data: []
        }
      ]
    }
  },
  computed: {
    getSuggestions() {
      const results = []
      for (const key in this.nameSearchResponse) {
        results.push({
          id: this.nameSearchResponse[key],
          name: this.nameSearchResponse[key],
          destination: '',
          type: ''
        })
      }

      return results
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.nameSearchText = newValue.text
      },
      deep: true
    }
  },
  mounted() {
    this.nameSearchText = this.value.text

    if (this.nameSearchText.length > 2) {
      this.nameSearchSuggestions[0].data = this.getSuggestions
    }
  },
  methods: {
    ...mapActions('user', ['getCapitalBonusNameSearchResult']),
    async nameSearchStart(val) {
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }

        this.nameSearchResponse = await this.getCapitalBonusNameSearchResult({
          levelFilter: this.levelFilter,
          namepart: val
        })
        this.nameSearchTextTemp = val
        this.nameSearchSuggestions[0].data = this.getSuggestions
      }
    },
    nameSearchSelect(val) {
      if (val !== null) {
        this.$emit('input', {
          text: val.item.name,
          id: val.item.id
        })
      }
    }
  }
}
</script>
