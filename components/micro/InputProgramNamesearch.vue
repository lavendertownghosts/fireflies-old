<template>
  <div class="w-full">
    <Autosuggest
      :suggestions="nameSearchSuggestions"
      :input-props="{
        id: componentAttrId,
        placeholder: $t('program.AutoSuggestPlaceholder')
      }"
      :label="label"
      :is-dark="isDark"
      :value="nameSearchText"
      :is-disabled="isDisabled"
      :input-style="[inputStyle]"
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
  name: 'InputProgramNamesearch',
  components: {
    Autosuggest
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
    inputStyle: {
      type: String,
      default: 'lg:rounded-r-none lg:border-r-0 lg:-mr-1'
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
        const nameArray = this.nameSearchResponse[key].name
          .split(', ')
          .reverse()
        let destinationText = ''
        let nameText = ''
        if (nameArray.length < 2) {
          nameText = nameArray.join(', ')
        } else if (nameArray.length === 2) {
          destinationText = nameArray[1]
          nameText = nameArray.slice(0, -1).join(', ')
        } else {
          destinationText = nameArray.slice(nameArray.length - 2).join(', ')
          nameText = nameArray.slice(0, nameArray.length - 2).join(', ')
        }
        results.push({
          id: this.nameSearchResponse[key].id,
          name: nameText,
          destination: destinationText,
          type: 'poi'
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
    ...mapActions('program', ['getProgramNameSearchResult']),
    async nameSearchStart(val) {
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }

        this.nameSearchResponse = await this.getProgramNameSearchResult({
          text: val,
          maxNum: 5,
          lang: this.$i18n.locale
        })
        this.nameSearchTextTemp = val
        this.nameSearchSuggestions[0].data = this.getSuggestions
      }
    },
    nameSearchSelect(val) {
      if (val !== null) {
        this.$emit('input', {
          text: [val.item.name, val.item.destination].join(', '),
          id: val.item.id
        })
      }
    }
  }
}
</script>
