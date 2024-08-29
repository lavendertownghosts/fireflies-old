<template>
  <div class="w-full">
    <Autosuggest
      :suggestions="nameSearchSuggestions"
      :input-props="{
        id: componentAttrId,
        placeholder: $t('hotel.WhereWantToTravel')
      }"
      :label="label"
      :error="error ? error : ''"
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
  name: 'InputExclusiveNamesearch',
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
    isDark: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    error: {
      type: [Boolean, String],
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    componentAttrId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      nameSearchText: '',
      // ha temp nincs benne az új értékben akkor nullázzuk a javaslatokat
      // ha mindig nullázzuk akkor villogna a dropdown
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
        if (this.nameSearchResponse[key].name !== undefined) {
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
            type: this.nameSearchResponse[key].type
          })
        }
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
    ...mapActions('hotel', ['getHotelNameSearchResult']),
    async nameSearchStart(val) {
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }

        this.nameSearchResponse = await this.getHotelNameSearchResult({
          text: val,
          lang: this.$i18n.locale,
          limit: 5,
          onlyCity: true
        })
        this.nameSearchTextTemp = val
        this.nameSearchSuggestions[0].data = this.getSuggestions
      } else if (val === '') {
        this.$emit('input', {
          text: '',
          id: null,
          type: null
        })
      }
    },
    nameSearchSelect(val) {
      if (val !== null) {
        this.$emit('input', {
          text: val.item.name,
          id: val.item.code,
          type: val.item.type
        })
      }
    }
  }
}
</script>
