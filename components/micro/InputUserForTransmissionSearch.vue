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
  name: 'InputUserForTransmissionSearch',
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
    isDisabled: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: Array,
      default() {
        return []
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
    },
    username: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
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
          id: this.nameSearchResponse[key].userid,
          name:
            this.nameSearchResponse[key].fullname !== ''
              ? this.nameSearchResponse[key].fullname +
                ' - ' +
                this.nameSearchResponse[key].username
              : this.nameSearchResponse[key].username,
          target: this.nameSearchResponse[key].username
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
    ...mapActions('user', ['searchUserForTransmission']),
    async nameSearchStart(val) {
      if (val.length > 2) {
        if (
          this.nameSearchTextTemp === '' ||
          !val.includes(this.nameSearchTextTemp)
        ) {
          this.nameSearchSuggestions[0].data = []
        }
        this.nameSearchResponse = await this.searchUserForTransmission({
          text: val,
          username: this.username
        })
        this.nameSearchTextTemp = val
        this.nameSearchSuggestions[0].data = this.getSuggestions
      }
    },
    nameSearchSelect(val) {
      if (val !== null) {
        this.$emit('input', {
          text: val.item.name,
          id: val.item.id,
          target: val.item.target
        })
      }
    }
  }
}
</script>
