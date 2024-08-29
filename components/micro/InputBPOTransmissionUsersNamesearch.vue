<template>
  <div class="w-full">
    <Autosuggest
      :suggestions="nameSearchSuggestions"
      :input-props="{
        id: componentAttrId,
        placeholder: placeholder
      }"
      :label="label"
      :is-dark="isDark"
      :value="nameSearchText"
      :is-disabled="isDisabled"
      :input-style="inputStyle"
      :is-loading="loading"
      :error="error"
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
  name: 'InputBPOTransmissionUsersNamesearch',
  components: {
    Autosuggest
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          text: '',
          id: false
        }
      }
    },
    error: {
      type: String,
      default: ''
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
    inputStyle: {
      type: Array,
      default() {
        return ['xl:rounded-r-none xl:border-r-0 xl:-mr-1']
      }
    },
    lengthLimit: {
      type: Number,
      default: 34
    },
    placeholder: {
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
      loading: false,
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
          id: this.nameSearchResponse[key].userid,
          name: this.nameSearchResponse[key].username,
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

    if (this.nameSearchText !== undefined) {
      if (this.nameSearchText.length > 2) {
        this.nameSearchSuggestions[0].data = this.getSuggestions
      }
    }
  },
  methods: {
    ...mapActions('user', ['getBPOTransmissionUsersNameSearchResult']),
    async nameSearchStart(val) {
      console.log(val)
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }
        this.loading = true
        this.nameSearchResponse = await this.getBPOTransmissionUsersNameSearchResult(
          {
            text: val
          }
        )
        this.loading = false
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
