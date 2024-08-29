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
      :is-loading="isLoading"
      :error="error ? error : ''"
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
  name: 'WebofficeSearchUserLoyaltyBonusNamesearch',
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
    error: {
      type: String,
      default: ''
    },
    componentAttrId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nameSearchText: '',
      nameSearchTextTemp: '',
      nameSearchResponse: [],
      isLoading: false,
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
      this.nameSearchResponse.forEach((element) => {
        results.push({
          id: element.id,
          name: element.name,
          destination: '',
          type: ''
        })
      })

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
    ...mapActions('user', ['searchUserLoyaltyBonus']),
    async nameSearchStart(val) {
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }
        this.isLoading = true
        this.nameSearchResponse = await this.searchUserLoyaltyBonus({
          namepart: val
        })
        this.isLoading = false
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
