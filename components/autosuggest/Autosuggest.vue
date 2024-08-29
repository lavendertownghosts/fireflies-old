<template>
  <div :id="componentAttrIdAutosuggest" class="text-input relative">
    <label
      :for="name"
      class="block text-black text-xs font-bold leading-12 mb-5"
      :class="{
        'text-danger': error.length > 0,
        'text-grey-dark opacity-50': isDisabled,
        'text-black': !isDark && error.length === 0 && !isDisabled,
        'text-white': isDark && !isDisabled && error.length === 0
      }"
      >{{ label }}</label
    >
    <input
      :type="internal_inputProps.type"
      :value="internalValue"
      :autocomplete="internal_inputProps.autocomplete"
      role="combobox"
      class="w-full h-48 leading-16 text-base py-14 mb-1 px-12 rounded text-black hover:border-primary focus:outline-none focus:border-primary"
      :class="getInputClasses()"
      v-bind="internal_inputProps"
      aria-autocomplete="list"
      aria-owns="autosuggest__results"
      :aria-activedescendant="
        isOpen && currentIndex !== null
          ? `autosuggest__results-item--${currentIndex}`
          : ''
      "
      :aria-haspopup="isOpen ? 'true' : 'false'"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :disabled="isDisabled"
      @input="inputHandler"
      @keydown="handleKeyStroke"
      @focus="$event.target.select()"
      v-on="listeners"
    />
    <div
      v-show="isLoading"
      class="pointer-events-none loading text-2x absolute bottom-0 right-0 mb-10 mr-12"
    >
      <i class="animate-spin fas fa-spinner-third"></i>
    </div>
    <div :class="componentAttrClassAutosuggestResultsContainer">
      <div
        v-if="isOpen"
        :class="componentAttrClassAutosuggestResults"
        :aria-labelledby="componentAttrIdAutosuggest"
      >
        <slot name="before-suggestions" />
        <component
          :is="cs.type"
          v-for="(cs, key) in computedSections"
          :ref="getSectionRef(key)"
          :key="getSectionRef(key)"
          :current-index="currentIndex"
          :normalize-item-function="normalizeItem"
          :render-suggestion="renderSuggestion"
          :section="cs"
          @updateCurrentIndex="updateCurrentIndex"
        >
          <template
            :slot="`before-section-${cs.name || cs.label}`"
            slot-scope="{ section, className }"
          >
            <slot
              :name="`before-section-${cs.name || cs.label}`"
              :section="section"
              :className="className"
            />
          </template>
          <template slot-scope="{ suggestion, _key }">
            <slot :suggestion="suggestion" :index="_key">
              <div class="flex flex-row justify-start py-8">
                <div class="mx-8 text-center">
                  <i
                    v-show="suggestion.item.type === 'city'"
                    class="fal fa-map-marker-alt text-grey w-18"
                  ></i>
                  <i
                    v-show="suggestion.item.type === 'poi'"
                    class="fal fa-landmark text-grey w-18"
                  ></i>
                  <i
                    v-show="suggestion.item.type === 'hotel'"
                    class="fal fa-hospital text-grey w-18"
                  ></i>
                  <i
                    v-show="suggestion.item.type === 'airport'"
                    class="fas fa-plane text-grey w-18"
                  ></i>
                </div>
                <div
                  class="w-auto flex items-center"
                  :class="suggestion.item.destination ? 'flex-col' : ''"
                >
                  <div
                    class="leading-16 pr-24 w-full"
                    v-html="markText(suggestion.item.name)"
                  ></div>
                  <div
                    v-show="suggestion.item.destination"
                    class="text-xs leading-12 mt-2 w-full"
                    v-html="markText(suggestion.item.destination)"
                  ></div>
                </div>
              </div>
            </slot>
          </template>
          <template
            :slot="`after-section-${cs.name || cs.label}`"
            slot-scope="{ section }"
          >
            <slot
              :name="`after-section-${cs.name || cs.label}`"
              :section="section"
            />
          </template>
          <template slot="after-section" slot-scope="{ section }">
            <slot name="after-section" :section="section" />
          </template>
        </component>
        <slot name="after-suggestions" />
      </div>
      <slot name="after-suggestions-container" />
    </div>
    <span
      v-show="error.length > 0"
      class="block text-danger text-xs leading-12"
    >
      {{ error }}
    </span>
  </div>
</template>

<script>
/**
 * @typedef {Object} ResultSection
 * @prop {String} name - Name of the section
 * @prop {String} label - What is displayed in the section header, is exists
 * @prop {String} type - Used to decide which component to use for section
 * @prop {Number} limit - max number of results
 * @prop {Array} data - the results
 * @prop {Number} start_index - tracks section start reference point
 * @prop {Number} end_index - tracks section end reference point
 * @prop {Object} ulClass - class for <ul> of section e.g. { 'bg-blue': true }
 * @prop {Object} liClass - class for all <li>'s in section
 */

import DefaultSection from './parts/DefaultSection.js'
import { addClass, removeClass } from './utils'

const defaultSectionConfig = {
  name: 'default',
  type: 'default-section'
}

export default {
  name: 'Autosuggest',
  components: {
    /* eslint-disable-next-line vue/no-unused-components */
    DefaultSection
  },
  props: {
    value: {
      type: String,
      default: null
    },
    inputProps: {
      type: Object,
      required: true
    },
    limit: {
      type: Number,
      required: false,
      default: Infinity
    },
    suggestions: {
      type: Array,
      required: true
    },
    renderSuggestion: {
      type: Function,
      required: false,
      default: null
    },
    getSuggestionValue: {
      type: Function,
      required: false,
      default: (suggestion) => {
        const item = suggestion.item
        // eslint-disable-next-line no-prototype-builtins
        if (typeof item === 'object' && item.hasOwnProperty('name')) {
          return item.destination
            ? [item.name, item.destination].join(', ')
            : item.name
        } else {
          return item
        }
      }
    },
    shouldRenderSuggestions: {
      type: Function,
      required: false,
      default: (totalResults, loading, internalValue) => {
        return (
          totalResults > 0 &&
          !loading &&
          internalValue !== null &&
          internalValue.length > 2
        )
      }
    },
    sectionConfigs: {
      type: Object,
      required: false,
      default: () => {
        return {
          default: {
            onSelected: null
          }
        }
      }
    },
    onSelected: {
      type: Function,
      required: false,
      default: null
    },
    componentAttrIdAutosuggest: {
      type: String,
      required: false,
      default: 'autosuggest'
    },
    componentAttrClassAutosuggestResultsContainer: {
      type: String,
      required: false,
      default: 'autosuggest__results-container relative z-40 w-full'
    },
    componentAttrClassAutosuggestResults: {
      type: String,
      required: false,
      default:
        'autosuggest__results absolute z-20 bg-white rounded text-black w-full shadow-drop'
    },
    label: {
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
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      timer: null,
      internalValue: null,
      searchInputOriginal: null,
      currentIndex: null,
      currentItem: null,
      loading: false /** Helps with making sure the dropdown doesn't stay open after certain actions */,
      didSelectFromOptions: false,
      defaultInputProps: {
        type: 'text',
        autocomplete: 'off'
      },
      clientXMouseDownInitial: null
    }
  },
  computed: {
    internal_inputProps() {
      return {
        ...this.defaultInputProps,
        ...this.inputProps
      }
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (e) => {
          // Don't do anything native here, since we have inputHandler
        },
        click: () => {
          /* eslint-disable-next-line vue/no-side-effects-in-computed-properties */
          this.loading = false
          this.$listeners.click && this.$listeners.click(this.currentItem)
          this.$nextTick(() => {
            this.ensureItemVisible(this.currentItem, this.currentIndex)
          })
        },
        selected: () => {
          // Determine which onSelected to fire. This can be either from inside
          // a section's object, from the @selected event, or from the deprecated
          // native onSelected prop (to be removed later)
          if (
            this.currentItem &&
            this.sectionConfigs[this.currentItem.name] &&
            this.sectionConfigs[this.currentItem.name].onSelected
          ) {
            this.sectionConfigs[this.currentItem.name].onSelected(
              this.currentItem,
              this.searchInputOriginal
            )
          } else if (this.sectionConfigs.default.onSelected) {
            this.sectionConfigs.default.onSelected(
              null,
              this.searchInputOriginal
            )
          } else if (this.$listeners.selected) {
            this.$emit('selected', this.currentItem, this.currentIndex)
          }
          this.setChangeItem(null)
        }
      }
    },
    isOpen() {
      return this.shouldRenderSuggestions(
        this.totalResults,
        this.loading,
        this.internalValue
      )
    },
    /** @returns {Array<ResultSection>} */
    computedSections() {
      let tmpSize = 0
      return this.suggestions.map((section) => {
        if (!section.data) return

        const name = section.name ? section.name : defaultSectionConfig.name
        let limit
        let label
        let type
        let ulClass
        let liClass = null

        if (this.sectionConfigs[name]) {
          limit = this.sectionConfigs[name].limit
          type = this.sectionConfigs[name].type
          label = this.sectionConfigs[name].label
          ulClass = this.sectionConfigs[name].ulClass
          liClass = this.sectionConfigs[name].liClass
        }

        /** Set defaults for section configs. */
        type = type || defaultSectionConfig.type

        limit = limit || this.limit
        limit = limit || Infinity
        limit = section.data.length < limit ? section.data.length : limit
        label = label || section.label

        const computedSection = {
          name,
          label,
          type,
          limit,
          data: section.data,
          start_index: tmpSize,
          end_index: tmpSize + limit - 1,
          ulClass,
          liClass
        }

        tmpSize += limit

        return computedSection
      })
    },
    totalResults() {
      return this.computedSections.reduce((acc, section) => {
        // For each section, make sure we calculate the size
        // based on how many are rendered, which maxes out at
        // the limit but can be less than the limit.
        if (!section) return acc
        const { limit, data } = section
        return acc + (data.length >= limit ? limit : data.length)
      }, 0)
    }
  },
  // Watcher to support initialValue
  watch: {
    value: {
      handler(newValue) {
        this.internalValue = newValue
      },
      immediate: true
    }
  },
  created() {
    this.loading = true
  },
  mounted() {
    document.addEventListener('mouseup', this.onDocumentMouseUp)
    document.addEventListener('mousedown', this.onDocumentMouseDown)
    this.internalValue = this.value
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseUp)
    document.removeEventListener('mousedown', this.onDocumentMouseDown)
  },
  methods: {
    markText(text) {
      if (text !== undefined) {
        const textTmp = this.internalValue
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/,/g, '')
        const internalValueArray = textTmp.split(/\s+/).join('|')
        const regX = new RegExp('(' + internalValueArray + ')', 'ig')
        return text.replace(regX, '<strong>$1</strong>')
      }
    },
    getInputClasses() {
      const initClass =
        this.isDisabled && !this.isDark
          ? 'border-none disabled:bg-black-light-opaque disabled:text-black-opaque'
          : this.isDisabled && this.isDark
          ? 'border-none disabled:bg-white-lightest-opaque disabled:text-white-lighter-opaque'
          : this.error.length > 0
          ? 'border-2 border-danger'
          : this.isDark
          ? 'bg-white border border-white'
          : 'bg-white border border-grey'

      return [
        ...this.inputStyle,
        initClass,
        this.isOpen ? 'autosuggest__input--open' : '',
        this.internal_inputProps.class
      ]
    },
    inputHandler(e) {
      const newValue = e.target.value
      this.internalValue = newValue

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('input', newValue)

        if (!this.didSelectFromOptions) {
          this.searchInputOriginal = newValue
          this.currentIndex = null
        }
      }, 500)
    },
    getSectionRef(i) {
      return 'computed_section_' + i
    },
    getItemByIndex(index) {
      let obj = false
      if (index === null) return obj
      for (let i = 0; i < this.computedSections.length; i++) {
        if (
          index >= this.computedSections[i].start_index &&
          index <= this.computedSections[i].end_index
        ) {
          const trueIndex = index - this.computedSections[i].start_index
          const childSection = this.$refs['computed_section_' + i][0]
          if (childSection) {
            obj = this.normalizeItem(
              this.computedSections[i].name,
              this.computedSections[i].type,
              childSection.section.label,
              childSection.section.liClass,
              childSection.getItemByIndex(trueIndex)
            )
            break
          }
        }
      }

      return obj
    },
    handleKeyStroke(e) {
      const { keyCode } = e

      const ignoredKeyCodes = [
        16, // Shift
        9, // Tab
        17, // ctrl
        91, // OS Key
        93 // Right OS Key
      ]

      if (ignoredKeyCodes.includes(keyCode)) {
        return
      }

      // "pattern": "^[\\p{L}0-9\\s]*$",
      if (!/\p{L}/gu.test(e.key)) {
        if (!/^[0-9() _.,&'@-]*$/.test(e.key)) {
          e.preventDefault()
        }
      }

      const wasClosed = !this.isOpen
      this.loading = false
      this.didSelectFromOptions = false
      if (this.isOpen) {
        switch (keyCode) {
          case 40: // ArrowDown
          case 38: // ArrowUp
            e.preventDefault()
            if (keyCode === 38 && this.currentIndex === null) {
              break
            }
            // Determine direction of arrow up/down and determine new currentIndex
            // eslint-disable-next-line no-case-declarations
            const direction = keyCode === 40 ? 1 : -1
            // eslint-disable-next-line no-case-declarations
            const newIndex =
              (parseInt(this.currentIndex) || 0) + (wasClosed ? 0 : direction)

            this.setCurrentIndex(newIndex, this.totalResults)
            this.didSelectFromOptions = true
            if (this.totalResults > 0 && this.currentIndex >= 0) {
              this.setChangeItem(this.getItemByIndex(this.currentIndex))
              this.didSelectFromOptions = true
            } else if (this.currentIndex === -1) {
              this.currentIndex = null
              this.internalValue = this.searchInputOriginal
              e.preventDefault()
            }

            this.$nextTick(() => {
              this.ensureItemVisible(this.currentItem, this.currentIndex)
            })
            break
          case 13: // Enter
            e.preventDefault()
            if (this.currentIndex === null) {
              this.currentIndex = 0
            }
            if (this.totalResults > 0 && this.currentIndex >= 0) {
              this.setChangeItem(this.getItemByIndex(this.currentIndex), true)
              this.didSelectFromOptions = true
            }

            this.loading = true
            this.listeners.selected(this.didSelectFromOptions)
            break
          case 27: // Escape
            /* For 'search' input type, make sure the browser doesn't clear the input when Escape is pressed. */
            this.loading = true
            this.currentIndex = null
            this.internalValue = this.searchInputOriginal
            this.$emit('input', this.searchInputOriginal)
            e.preventDefault()
            break
        }
      }
    },
    setChangeItem(item, overrideOriginalInput = false) {
      if (this.currentIndex === null || !item) {
        this.currentItem = null
      } else if (item) {
        this.currentItem = item
        this.$emit('itemChanged', item, this.currentIndex)
        const v = this.getSuggestionValue(item)
        this.internalValue = v
        if (overrideOriginalInput) {
          this.searchInputOriginal = v
        }
        this.ensureItemVisible(item, this.currentIndex)
      }
    },

    /**
     * Function to standardize suggestion item object picked from sections
     * @returns {ResultSection}
     */
    normalizeItem(name, type, label, className, item) {
      return {
        name,
        type,
        label,
        liClass: item.liClass || className,
        item
      }
    },

    /**
     * Adjust the scroll position to the item in the suggestions overflow
     * @param {Object} item - suggestion item
     * @param {Number} index - item index
     * @param {String} selector - selector of item that is overflowed
     */
    ensureItemVisible(item, index, selector) {
      const resultsScrollElement = this.$el.querySelector(
        selector || `.${this.componentAttrClassAutosuggestResults}`
      )

      if (!resultsScrollElement) {
        return
      }

      const itemElement = resultsScrollElement.querySelector(
        `#autosuggest__results-item--${index}`
      )
      if (!itemElement) {
        return
      }

      const resultsScrollWindowHeight = resultsScrollElement.clientHeight
      const resultsScrollScrollTop = resultsScrollElement.scrollTop

      const itemHeight = itemElement.clientHeight
      const currentItemScrollOffset = itemElement.offsetTop

      if (
        itemHeight + currentItemScrollOffset >=
        resultsScrollScrollTop + resultsScrollWindowHeight
      ) {
        /** Current item goes below visible scroll window */
        resultsScrollElement.scrollTop =
          itemHeight + currentItemScrollOffset - resultsScrollWindowHeight
      } else if (
        currentItemScrollOffset < resultsScrollScrollTop &&
        resultsScrollScrollTop > 0
      ) {
        /** Current item goes above visible scroll window */
        resultsScrollElement.scrollTop = currentItemScrollOffset
      }
    },
    updateCurrentIndex(index) {
      this.setCurrentIndex(index, -1, true)
    },
    clickedOnScrollbar(e, mouseX) {
      const results = this.$el.querySelector(
        `.${this.componentAttrClassAutosuggestResults}`
      )

      const mouseIsInsideScrollbar =
        results &&
        results.clientWidth <= mouseX + 17 &&
        mouseX + 17 <= results.clientWidth + 34
      return (
        (e.target.tagName === 'DIV' && results && mouseIsInsideScrollbar) ||
        false
      )
    },
    onDocumentMouseDown(e) {
      const rect = e.target.getBoundingClientRect
        ? e.target.getBoundingClientRect()
        : 0
      this.clientXMouseDownInitial = e.clientX - rect.left
    },
    onDocumentMouseUp(e) {
      /** Do not re-render list on input click  */
      const isChild = this.$el.contains(e.target)

      /* Clicks outside of dropdown */
      if (!isChild) {
        this.loading = true
        this.currentIndex = null
        return
      }

      if (
        e.target.tagName === 'INPUT' ||
        this.clickedOnScrollbar(e, this.clientXMouseDownInitial)
      ) {
        return
      }

      /** Selects an item in the dropdown */
      this.loading = true
      this.didSelectFromOptions = true
      this.setChangeItem(this.getItemByIndex(this.currentIndex), true)
      this.listeners.selected(true)
    },

    setCurrentIndex(newIndex, limit = -1, onHover = false) {
      let adjustedValue = newIndex

      if (!onHover) {
        const hitLowerLimt = this.currentIndex === null
        const hitUpperLimit = newIndex >= limit
        if (hitLowerLimt || hitUpperLimit) {
          adjustedValue = 0
        }
      }

      this.currentIndex = adjustedValue
      const element = this.$el.querySelector(
        `#autosuggest__results-item--${this.currentIndex}`
      )
      const hoverClass = 'autosuggest__results-item--highlighted'

      if (this.$el.querySelector(`.${hoverClass}`)) {
        removeClass(this.$el.querySelector(`.${hoverClass}`), hoverClass)
      }
      if (element) {
        addClass(element, hoverClass)
      }
    }
  }
}
</script>
