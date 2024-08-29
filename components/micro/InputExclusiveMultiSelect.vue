<template>
  <div class="">
    <label
      class="text-xs font-bold leading-12 mb-5"
      :class="isDisabled ? 'text-white-lighter-opaque' : 'text-white'"
      >{{ label }}</label
    >
    <multiselect
      id="ajax"
      v-model="modelArray"
      label="name"
      track-by="code"
      placeholder="Type to search"
      open-direction="bottom"
      :options="countries"
      :multiple="true"
      :searchable="true"
      :loading="isLoading"
      :internal-search="false"
      :clear-on-select="false"
      :close-on-select="false"
      :options-limit="300"
      :limit="3"
      :max-height="600"
      :show-no-results="false"
      :hide-selected="true"
      class="w-full min-h-50 relative leading-16 text-base py-14 mb-3 px-12 rounded text-black hover:border-primary focus:outline-none focus:border-primary"
      :class="getInputClasses()"
      @search-change="asyncFind"
    >
      <template slot="tag" slot-scope="{ option, remove }"
        ><span class="custom__tag"
          ><span>{{ option.name }}</span
          ><span class="custom__remove" @click="remove(option)">x</span></span
        ></template
      >
      <template slot="clear" slot-scope="props">
        <div
          v-if="selectedCountries.length"
          class="multiselect__clear"
          @mousedown.prevent.stop="clearAll(props.search)"
        ></div>
      </template>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  name: 'InputExclusiveMultiSelect',
  components: {
    Multiselect
  },
  props: {
    modelArray: {
      type: Array,
      default() {
        return []
      }
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    helper: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    error: {
      type: [String, Boolean],
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    },
    inputType: {
      type: String,
      default: 'text'
    },
    inputProps: {
      type: Object,
      default() {
        return {}
      }
    },
    isReadonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedCountries: [],
      countries: [],
      isLoading: false
    }
  },
  methods: {
    ajaxFindCountry(query) {
      return [
        {
          name: 'American Samoa',
          code: 'AS'
        },
        {
          name: 'Austria',
          code: 'AT'
        },
        {
          name: 'Antarctica',
          code: 'AQ'
        }
      ]
    },
    asyncFind(query) {
      this.isLoading = true
      this.countries = this.ajaxFindCountry(query)
      this.isLoading = false
    },
    clearAll() {
      this.selectedCountries = []
    },
    getInputClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none bg-white-lightest-opaque disable text-white-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none bg-white-lightest-opaque disable text-black-opaque'
          : this.error.length > 0
          ? 'border-2 border-danger'
          : this.isDark
          ? 'bg-white border border-white'
          : 'bg-white border border-grey'

      return [...this.inputStyle, initClass]
    }
  }
}
</script>

<style>
/* DISABLE THINGS */
.multiselect__option--highlight:after {
  display: none !important;
}

.disable .multiselect__placeholder {
  @apply text-white-opaque;
}

/* STYLE */
.min-h-50 {
  min-height: 50px;
}

.multiselect__input {
  border: none !important;
  outline: none !important;
  margin-top: -5px;
}

.multiselect__content-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  margin-top: 1px;
  display: block;
  background: #fff;
  width: 100%;
  overflow: auto;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-radius: 5px;
  -webkit-overflow-scrolling: touch;

  @apply rounded shadow-drop bg-white w-full cursor-pointer z-10;
}

.custom__tag {
  position: relative;
  padding-right: 22px;
  padding-bottom: 5px;
  margin-right: 10px;
  display: inline-block;
}

.custom__remove {
  cursor: pointer;
  padding: 0px 5px;
  border-radius: 3px;
  height: 20px;
  position: absolute;
  top: -2px;
  right: 0px;
}

.custom__remove:hover {
  @apply bg-primary text-white;
}

.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}
.multiselect--above .multiselect__content-wrapper {
  bottom: 100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
  border-top: 1px solid #e8e8e8;
}

.multiselect__content::webkit-scrollbar {
  display: none;
}
.multiselect__element {
  display: block;
}
.multiselect__option {
  display: block;
  @apply leading-16 text-base py-16 px-12 border-b border-grey-light bg-white text-black;
}
.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #41b883;
  color: #fff;
}
.multiselect__option--selected {
  background: #f3f3f3;
  color: #35495e;
  font-weight: 700;
}
.multiselect__option--selected:after {
  content: attr(data-selected);
  color: silver;
}
.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}
</style>
