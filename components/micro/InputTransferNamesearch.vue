<template>
  <div class="w-full">
    <Autosuggest
      :suggestions="nameSearchSuggestions"
      :input-props="{
        placeholder: 'Hova szeretne utazni?'
      }"
      :label="label"
      :is-dark="isDark"
      :value="nameSearchText"
      :is-disabled="isDisabled"
      :input-style="inputStyle"
      @input="nameSearchStart"
      @selected="nameSearchSelect"
    >
    </Autosuggest>
  </div>
</template>

<script>
import Autosuggest from '@/components/autosuggest/Autosuggest'

export default {
  name: 'InputTransferNamesearch',
  components: {
    Autosuggest
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          text: 'Buda',
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
      type: Array,
      default() {
        return ['xl:rounded-r-none xl:border-r-0 xl:-mr-1']
      }
    },
    lengthLimit: {
      type: Number,
      default: 34
    }
  },
  data() {
    return {
      nameSearchText: '',

      defaultNameSearchResponse: [
        {
          id: '12800',
          isCollective: '0',
          name: 'Magyarország, Budapest',
          order: 1,
          type: 'city'
        },
        {
          id: '19010001',
          isCollective: '0',
          name: 'Magyarország, Budapest, Budapest (BUD)',
          order: 5,
          type: 'hotel'
        },
        {
          id: '12800',
          isCollective: '0',
          name:
            'Magyarország, Budapest, Four Seasons Hotel Gresham Palace Budapest',
          order: 2,
          type: 'poi'
        },
        {
          id: '48388884',
          isCollective: '0',
          name: 'Magyarország, Budapest, Central Square Apartments',
          order: 3,
          type: 'hotel'
        },
        {
          id: '19010001',
          isCollective: '0',
          name: 'Magyarország, Budapest, Keleti Pályaudvar',
          order: 4,
          type: 'hotel'
        }
      ],

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
      for (const key in this.defaultNameSearchResponse) {
        const nameArray = this.defaultNameSearchResponse[key].name
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
          id: this.defaultNameSearchResponse[key].id,
          name: nameText,
          destination: destinationText,
          type: this.defaultNameSearchResponse[key].type
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
    nameSearchStart(val) {
      if (val.length > 2) {
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
