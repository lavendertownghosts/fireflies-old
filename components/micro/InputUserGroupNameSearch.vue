<template>
  <div class="w-full">
    <Autosuggest
      :suggestions="nameSearchSuggestions"
      :input-props="{
        id: componentAttrId,
        placeholder: $t('weboffice.UserFilter')
      }"
      :label="label"
      :is-dark="isDark"
      :value="nameSearchText"
      :is-disabled="isDisabled"
      :is-loading="loading"
      :error="error ? error : ''"
      @input="nameSearchStart"
      @selected="nameSearchSelect"
    >
    </Autosuggest>
  </div>
</template>

<script>
import Autosuggest from '@/components/autosuggest/Autosuggest'

export default {
  name: 'InputUserGroupNameSearch',
  components: {
    Autosuggest
  },
  props: {
    value: {
      type: [Object, String],
      default() {
        return {
          text: '',
          id: false
        }
      }
    },
    levelFilter: {
      type: String,
      default: 'total'
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
    }
  },
  data() {
    return {
      nameSearchText: '',
      nameSearchTextTemp: '',
      nameSearchResponse: [],
      loading: false,
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
          id: key,
          name: this.nameSearchResponse[key].name,
          line: this.nameSearchResponse[key].line
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
    if (this.value.text !== undefined) {
      this.nameSearchText = this.value.text

      if (this.nameSearchText.length > 2) {
        this.nameSearchSuggestions[0].data = this.getSuggestions
      }
    }
  },
  methods: {
    async nameSearchStart(val) {
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }
        this.loading = true
        this.nameSearchResponse = await this.$store.dispatch(
          'user/getUserGroupNameSearch',
          { nameFilter: val }
        )
        this.loading = false
        this.nameSearchTextTemp = val
        this.nameSearchSuggestions[0].data = this.getSuggestions
      }
    },
    searchForPositions(username) {
      let data = []
      this.nameSearchResponse.forEach((value) => {
        if (value.username === username) {
          data = value.positions
          console.log(value)
        }
      })
      return data
    },
    nameSearchSelect(val) {
      if (val !== null) {
        this.$emit('input', {
          text: val.item.name,
          id: val.item.id,
          line: val.item.line
        })
      }
    }
  }
}
</script>
